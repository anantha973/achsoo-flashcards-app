package com.achsoo.app;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Native Android GitHub Releases self-updater:
 * - Queries public GitHub Releases over HTTPS with strict host allowlisting
 * - Streams Achsoo.apk into private cache/updates/ with live progress updates
 * - Verifies SHA-256 integrity before launching Android's native package installer
 */
public final class AchsooAppUpdater {
    private static final String USER_AGENT = "Achsoo-Android-Updater/1.2";
    private static final int CONNECT_TIMEOUT_MS = 15_000;
    private static final int READ_TIMEOUT_MS = 30_000;
    private static final int MAX_REDIRECTS = 6;
    private static final long MAX_APK_BYTES = 200L * 1024L * 1024L; // 200 MB sanity ceiling

    private static final Pattern REPO_PATTERN =
        Pattern.compile("^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$");
    private static final Pattern VERSION_LAST_SEGMENT_PATTERN =
        Pattern.compile("(\\d+)(?!.*\\d)");

    private static final Set<String> ALLOWED_HOSTS = new HashSet<>(Arrays.asList(
        "api.github.com",
        "github.com",
        "objects.githubusercontent.com",
        "release-assets.githubusercontent.com",
        "github-releases.githubusercontent.com",
        "codeload.github.com"
    ));

    private static final String UPDATES_SUBDIR = "updates";
    private static final String CACHED_APK_FILENAME = "Achsoo-update.apk";
    private static final String TEMP_APK_FILENAME = "Achsoo-update.tmp";

    public interface DownloadProgressListener {
        void onProgress(int percent, long downloadedBytes, long totalBytes);
    }

    public static final class InstalledVersion {
        public final long versionCode;
        public final String versionName;

        public InstalledVersion(long versionCode, String versionName) {
            this.versionCode = versionCode;
            this.versionName = versionName;
        }
    }

    public static final class UpdateCheckResult {
        public final boolean updateAvailable;
        public final long currentVersionCode;
        public final String currentVersionName;
        public final long latestVersionCode;
        public final String latestVersionName;
        public final String tagName;
        public final String publishedAt;
        public final String apkUrl;
        public final long apkSizeBytes;
        public final String sha256;
        public final String releaseNotes;
        public final boolean signedRelease;

        public UpdateCheckResult(
            boolean updateAvailable,
            long currentVersionCode,
            String currentVersionName,
            long latestVersionCode,
            String latestVersionName,
            String tagName,
            String publishedAt,
            String apkUrl,
            long apkSizeBytes,
            String sha256,
            String releaseNotes,
            boolean signedRelease
        ) {
            this.updateAvailable = updateAvailable;
            this.currentVersionCode = currentVersionCode;
            this.currentVersionName = currentVersionName;
            this.latestVersionCode = latestVersionCode;
            this.latestVersionName = latestVersionName;
            this.tagName = tagName;
            this.publishedAt = publishedAt;
            this.apkUrl = apkUrl;
            this.apkSizeBytes = apkSizeBytes;
            this.sha256 = sha256;
            this.releaseNotes = releaseNotes;
            this.signedRelease = signedRelease;
        }
    }

    private AchsooAppUpdater() {}

    public static boolean isValidRepoSlug(String repo) {
        return repo != null && REPO_PATTERN.matcher(repo.trim()).matches();
    }

    public static InstalledVersion getInstalledVersion(Context context) {
        try {
            PackageManager pm = context.getPackageManager();
            PackageInfo info;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                info = pm.getPackageInfo(
                    context.getPackageName(),
                    PackageManager.PackageInfoFlags.of(0)
                );
            } else {
                info = pm.getPackageInfo(context.getPackageName(), 0);
            }
            long code = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
                ? info.getLongVersionCode()
                : info.versionCode;
            String name = info.versionName != null ? info.versionName : "1.0.0";
            return new InstalledVersion(code, name);
        } catch (Exception e) {
            return new InstalledVersion(1L, "1.0.0");
        }
    }

    public static UpdateCheckResult checkForUpdate(Context context, String rawRepo) throws Exception {
        String repo = rawRepo != null ? rawRepo.trim() : "";
        if (!isValidRepoSlug(repo)) {
            throw new IllegalArgumentException("Invalid GitHub repository format. Use owner/repo.");
        }

        InstalledVersion installed = getInstalledVersion(context);
        String apiUrl = "https://api.github.com/repos/" + repo + "/releases/latest";
        String releaseBody = fetchHttpsString(apiUrl, "application/vnd.github+json");
        JSONObject releaseJson = new JSONObject(releaseBody);

        String tagName = releaseJson.optString("tag_name", "");
        String publishedAt = releaseJson.optString("published_at", "");
        String releaseNotes = releaseJson.optString("body", "");
        JSONArray assets = releaseJson.optJSONArray("assets");

        String apkUrl = "";
        long apkSize = 0L;
        String manifestUrl = "";

        if (assets != null) {
            for (int i = 0; i < assets.length(); i++) {
                JSONObject asset = assets.optJSONObject(i);
                if (asset == null) continue;
                String name = asset.optString("name", "");
                String dlUrl = asset.optString("browser_download_url", "");
                if ("achsoo-release.json".equalsIgnoreCase(name)) {
                    manifestUrl = dlUrl;
                } else if (name.toLowerCase(Locale.US).endsWith(".apk")) {
                    if (apkUrl.isEmpty() || "Achsoo.apk".equalsIgnoreCase(name)) {
                        apkUrl = dlUrl;
                        apkSize = asset.optLong("size", 0L);
                    }
                }
            }
        }

        if (apkUrl.isEmpty()) {
            throw new IOException("Latest GitHub Release does not contain an APK asset yet.");
        }
        validateAllowedHttpsUrl(apkUrl);

        long latestVersionCode = parseFallbackVersionCode(tagName);
        String latestVersionName = tagName.startsWith("v") ? tagName.substring(1) : tagName;
        String sha256 = "";
        boolean signedRelease = false;

        if (!manifestUrl.isEmpty()) {
            try {
                validateAllowedHttpsUrl(manifestUrl);
                String manifestText = fetchHttpsString(manifestUrl, "application/json");
                JSONObject manifest = new JSONObject(manifestText);
                long manifestCode = manifest.optLong("versionCode", -1L);
                if (manifestCode > 0L) {
                    latestVersionCode = manifestCode;
                }
                String manifestName = manifest.optString("versionName", "");
                if (!manifestName.isEmpty()) {
                    latestVersionName = manifestName;
                }
                long manifestSize = manifest.optLong("apkSizeBytes", 0L);
                if (manifestSize > 0L) {
                    apkSize = manifestSize;
                }
                sha256 = manifest.optString("sha256", "").trim().toLowerCase(Locale.US);
                signedRelease = manifest.optBoolean("signedRelease", false);
                String manifestNotes = manifest.optString("releaseNotes", "").trim();
                if (!manifestNotes.isEmpty()) {
                    releaseNotes = manifestNotes;
                }
                String manifestPublished = manifest.optString("publishedAt", "").trim();
                if (!manifestPublished.isEmpty()) {
                    publishedAt = manifestPublished;
                }
            } catch (Exception ignored) {
                // Fall back to GitHub Release tag metadata cleanly
            }
        }

        boolean updateAvailable = latestVersionCode > installed.versionCode;
        return new UpdateCheckResult(
            updateAvailable,
            installed.versionCode,
            installed.versionName,
            latestVersionCode,
            latestVersionName,
            tagName,
            publishedAt,
            apkUrl,
            apkSize,
            sha256,
            releaseNotes,
            signedRelease
        );
    }

    public static File downloadAndVerifyApk(
        Context context,
        String apkUrl,
        String expectedSha256,
        DownloadProgressListener listener
    ) throws Exception {
        validateAllowedHttpsUrl(apkUrl);

        File updatesDir = getUpdatesDirectory(context);
        if (!updatesDir.exists() && !updatesDir.mkdirs()) {
            throw new IOException("Could not create private updates cache directory.");
        }

        File tempFile = new File(updatesDir, TEMP_APK_FILENAME);
        File finalFile = new File(updatesDir, CACHED_APK_FILENAME);
        if (tempFile.exists()) {
            //noinspection ResultOfMethodCallIgnored
            tempFile.delete();
        }
        if (finalFile.exists()) {
            //noinspection ResultOfMethodCallIgnored
            finalFile.delete();
        }

        HttpURLConnection conn = openAllowedHttpsConnection(apkUrl, "application/octet-stream");
        try {
            int status = conn.getResponseCode();
            if (status < 200 || status >= 300) {
                throw new IOException("APK download failed with HTTP " + status);
            }

            long totalBytes = Build.VERSION.SDK_INT >= Build.VERSION_CODES.N
                ? conn.getContentLengthLong()
                : conn.getContentLength();
            if (totalBytes > MAX_APK_BYTES) {
                throw new IOException("APK exceeds maximum expected file size.");
            }

            MessageDigest sha256Digest = MessageDigest.getInstance("SHA-256");
            long downloaded = 0L;
            int lastReportedPct = -1;
            long lastReportMs = 0L;

            try (
                InputStream in = new BufferedInputStream(conn.getInputStream());
                FileOutputStream out = new FileOutputStream(tempFile)
            ) {
                byte[] buffer = new byte[16 * 1024];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    downloaded += read;
                    if (downloaded > MAX_APK_BYTES) {
                        throw new IOException("Downloaded APK exceeded safety limit.");
                    }
                    out.write(buffer, 0, read);
                    sha256Digest.update(buffer, 0, read);

                    if (listener != null) {
                        int pct = totalBytes > 0
                            ? (int) Math.min(100L, (downloaded * 100L) / totalBytes)
                            : 0;
                        long now = System.currentTimeMillis();
                        if (pct != lastReportedPct && (pct >= lastReportedPct + 2 || now - lastReportMs >= 150L || pct == 100)) {
                            lastReportedPct = pct;
                            lastReportMs = now;
                            listener.onProgress(pct, downloaded, totalBytes);
                        }
                    }
                }
                out.flush();
            }

            if (downloaded < 100_000L) {
                throw new IOException("Downloaded file is too small to be a valid APK.");
            }

            String actualSha256 = toHex(sha256Digest.digest());
            String normalizedExpected = expectedSha256 != null
                ? expectedSha256.trim().toLowerCase(Locale.US)
                : "";
            if (!normalizedExpected.isEmpty() && !normalizedExpected.equals(actualSha256)) {
                //noinspection ResultOfMethodCallIgnored
                tempFile.delete();
                throw new SecurityException("APK integrity verification failed (SHA-256 mismatch).");
            }

            if (!tempFile.renameTo(finalFile)) {
                throw new IOException("Could not finalize downloaded update package.");
            }

            if (listener != null) {
                listener.onProgress(100, downloaded, totalBytes > 0 ? totalBytes : downloaded);
            }
            return finalFile;
        } catch (Exception e) {
            if (tempFile.exists()) {
                //noinspection ResultOfMethodCallIgnored
                tempFile.delete();
            }
            throw e;
        } finally {
            conn.disconnect();
        }
    }

    public static boolean hasCachedApk(Context context) {
        File apkFile = new File(getUpdatesDirectory(context), CACHED_APK_FILENAME);
        return apkFile.exists() && apkFile.length() > 100_000L;
    }

    /**
     * Launches Android's native package installer for the cached APK, or directs the user
     * to the single "Install unknown apps" toggle on Android 8+ if not yet granted.
     *
     * @return "installing" | "permission_needed" | "missing_apk"
     */
    public static String launchCachedApkInstaller(Context context) {
        File apkFile = new File(getUpdatesDirectory(context), CACHED_APK_FILENAME);
        if (!apkFile.exists() || apkFile.length() <= 100_000L) {
            return "missing_apk";
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!context.getPackageManager().canRequestPackageInstalls()) {
                Intent permIntent = new Intent(
                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + context.getPackageName())
                );
                permIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(permIntent);
                return "permission_needed";
            }
        }

        Uri contentUri = FileProvider.getUriForFile(
            context,
            context.getPackageName() + ".fileprovider",
            apkFile
        );

        Intent installIntent = new Intent(Intent.ACTION_VIEW);
        installIntent.setDataAndType(contentUri, "application/vnd.android.package-archive");
        installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(installIntent);
        return "installing";
    }

    private static File getUpdatesDirectory(Context context) {
        return new File(context.getCacheDir(), UPDATES_SUBDIR);
    }

    private static void validateAllowedHttpsUrl(String rawUrl) throws IOException {
        URL parsed = new URL(rawUrl);
        if (!"https".equalsIgnoreCase(parsed.getProtocol())) {
            throw new SecurityException("Only HTTPS update URLs are permitted.");
        }
        String host = parsed.getHost() != null ? parsed.getHost().toLowerCase(Locale.US) : "";
        if (!ALLOWED_HOSTS.contains(host)) {
            throw new SecurityException("Blocked untrusted update host: " + host);
        }
    }

    private static HttpURLConnection openAllowedHttpsConnection(String rawUrl, String acceptHeader)
        throws IOException {
        String currentUrl = rawUrl;
        for (int hop = 0; hop <= MAX_REDIRECTS; hop++) {
            validateAllowedHttpsUrl(currentUrl);
            HttpURLConnection conn = (HttpURLConnection) new URL(currentUrl).openConnection();
            conn.setInstanceFollowRedirects(false);
            conn.setConnectTimeout(CONNECT_TIMEOUT_MS);
            conn.setReadTimeout(READ_TIMEOUT_MS);
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", USER_AGENT);
            if (acceptHeader != null) {
                conn.setRequestProperty("Accept", acceptHeader);
            }

            int status = conn.getResponseCode();
            if (status == HttpURLConnection.HTTP_MOVED_PERM
                || status == HttpURLConnection.HTTP_MOVED_TEMP
                || status == HttpURLConnection.HTTP_SEE_OTHER
                || status == 307
                || status == 308) {
                String location = conn.getHeaderField("Location");
                conn.disconnect();
                if (location == null || location.trim().isEmpty()) {
                    throw new IOException("Redirect missing Location header.");
                }
                URL nextUrl = new URL(new URL(currentUrl), location);
                currentUrl = nextUrl.toString();
                continue;
            }
            return conn;
        }
        throw new IOException("Too many redirects while contacting GitHub Releases.");
    }

    private static String fetchHttpsString(String rawUrl, String acceptHeader) throws IOException {
        HttpURLConnection conn = openAllowedHttpsConnection(rawUrl, acceptHeader);
        try {
            int status = conn.getResponseCode();
            if (status == HttpURLConnection.HTTP_NOT_FOUND) {
                throw new IOException("No published GitHub Releases found for this repository yet.");
            }
            if (status < 200 || status >= 300) {
                throw new IOException("GitHub API returned HTTP " + status);
            }
            try (InputStream in = new BufferedInputStream(conn.getInputStream());
                 ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                byte[] buf = new byte[8192];
                int read;
                int total = 0;
                while ((read = in.read(buf)) != -1) {
                    total += read;
                    if (total > 2 * 1024 * 1024) {
                        throw new IOException("Unexpectedly large GitHub API response.");
                    }
                    out.write(buf, 0, read);
                }
                return new String(out.toByteArray(), StandardCharsets.UTF_8);
            }
        } finally {
            conn.disconnect();
        }
    }

    private static long parseFallbackVersionCode(String tagName) {
        if (tagName == null || tagName.isEmpty()) return 0L;
        Matcher m = VERSION_LAST_SEGMENT_PATTERN.matcher(tagName);
        if (m.find()) {
            try {
                long parsed = Long.parseLong(m.group(1));
                return parsed < 100L ? 100L + parsed : parsed;
            } catch (NumberFormatException ignored) {
                return 0L;
            }
        }
        return 0L;
    }

    private static String toHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format(Locale.US, "%02x", b & 0xff));
        }
        return sb.toString();
    }
}
