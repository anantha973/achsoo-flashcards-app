import type {
  CardSrsState,
  ReviewLogEntry,
  VocabCard,
} from '../data/vocabData';

export const IDB_NAME = 'achsoo_db_v1';
export const IDB_VERSION = 1;

export const STORE_REVIEW_LOGS = 'review_logs';
export const STORE_CARD_STATES = 'card_states';
export const STORE_CUSTOM_CARDS = 'custom_cards';
export const STORE_META = 'meta';

export interface MetaRecord {
  key: string;
  value: unknown;
  updatedAt: string;
}

const DEVICE_ID_STORAGE_KEY = 'achsoo_device_id_v1';

export function generateUuid(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateDeviceId(): string {
  try {
    if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
      if (existing) return existing;
      const fresh = generateUuid();
      localStorage.setItem(DEVICE_ID_STORAGE_KEY, fresh);
      return fresh;
    }
  } catch {
    // Ignore storage errors
  }
  return 'device-ephemeral';
}

export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.storage &&
      typeof navigator.storage.persist === 'function'
    ) {
      const alreadyPersisted = await navigator.storage.persisted?.();
      if (alreadyPersisted) return true;
      return await navigator.storage.persist();
    }
  } catch {
    // Ignore on unsupported browsers
  }
  return false;
}

let dbPromise: Promise<IDBDatabase> | null = null;

export function resetIdbConnectionForTests(): void {
  dbPromise = null;
}

export function openAchsooDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const req = indexedDB.open(IDB_NAME, IDB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORE_REVIEW_LOGS)) {
        const logStore = db.createObjectStore(STORE_REVIEW_LOGS, {
          keyPath: 'id',
        });
        logStore.createIndex('by_cardId', 'cardId', { unique: false });
        logStore.createIndex('by_reviewedAt', 'reviewedAt', { unique: false });
        logStore.createIndex('by_studyDayKey', 'studyDayKey', {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(STORE_CARD_STATES)) {
        db.createObjectStore(STORE_CARD_STATES, { keyPath: 'cardId' });
      }

      if (!db.objectStoreNames.contains(STORE_CUSTOM_CARDS)) {
        db.createObjectStore(STORE_CUSTOM_CARDS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error || new Error('Failed to open IndexedDB'));
    };
  });

  return dbPromise;
}

export async function idbGetAllReviewLogs(): Promise<ReviewLogEntry[]> {
  try {
    const db = await openAchsooDb();
    return await new Promise<ReviewLogEntry[]>((resolve, reject) => {
      const tx = db.transaction(STORE_REVIEW_LOGS, 'readonly');
      const store = tx.objectStore(STORE_REVIEW_LOGS);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = (req.result as ReviewLogEntry[]) || [];
        items.sort(
          (a, b) =>
            Date.parse(a.reviewedAt) - Date.parse(b.reviewedAt) ||
            a.id.localeCompare(b.id)
        );
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function idbAppendReviewLogAndState(
  logEntry: ReviewLogEntry,
  nextState: CardSrsState
): Promise<void> {
  try {
    const db = await openAchsooDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(
        [STORE_REVIEW_LOGS, STORE_CARD_STATES],
        'readwrite'
      );
      tx.objectStore(STORE_REVIEW_LOGS).put(logEntry);
      tx.objectStore(STORE_CARD_STATES).put(nextState);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback mirror in localStorage is also maintained by srsEngine
  }
}

export async function idbPutReviewLogsBulk(
  logs: ReviewLogEntry[],
  states: Record<string, CardSrsState>
): Promise<void> {
  try {
    const db = await openAchsooDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(
        [STORE_REVIEW_LOGS, STORE_CARD_STATES],
        'readwrite'
      );
      const logStore = tx.objectStore(STORE_REVIEW_LOGS);
      const stateStore = tx.objectStore(STORE_CARD_STATES);
      for (const entry of logs) {
        logStore.put(entry);
      }
      for (const st of Object.values(states)) {
        stateStore.put(st);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore
  }
}

export async function idbDeleteReviewLogAndPutState(
  logId: string,
  restoredState: CardSrsState
): Promise<void> {
  try {
    const db = await openAchsooDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(
        [STORE_REVIEW_LOGS, STORE_CARD_STATES],
        'readwrite'
      );
      tx.objectStore(STORE_REVIEW_LOGS).delete(logId);
      tx.objectStore(STORE_CARD_STATES).put(restoredState);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore
  }
}

export async function idbGetAllCardStates(): Promise<
  Record<string, CardSrsState>
> {
  try {
    const db = await openAchsooDb();
    return await new Promise<Record<string, CardSrsState>>(
      (resolve, reject) => {
        const tx = db.transaction(STORE_CARD_STATES, 'readonly');
        const store = tx.objectStore(STORE_CARD_STATES);
        const req = store.getAll();
        req.onsuccess = () => {
          const list = (req.result as CardSrsState[]) || [];
          const map: Record<string, CardSrsState> = {};
          for (const st of list) {
            if (st && st.cardId) {
              map[st.cardId] = st;
            }
          }
          resolve(map);
        };
        req.onerror = () => reject(req.error);
      }
    );
  } catch {
    return {};
  }
}

export async function idbClearReviewsForCards(
  cardIds?: string[]
): Promise<void> {
  try {
    const db = await openAchsooDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(
        [STORE_REVIEW_LOGS, STORE_CARD_STATES],
        'readwrite'
      );
      const logStore = tx.objectStore(STORE_REVIEW_LOGS);
      const stateStore = tx.objectStore(STORE_CARD_STATES);

      if (!cardIds) {
        logStore.clear();
        stateStore.clear();
      } else {
        const targetSet = new Set(cardIds);
        for (const cid of targetSet) {
          stateStore.delete(cid);
        }
        const req = logStore.getAll();
        req.onsuccess = () => {
          const allLogs = (req.result as ReviewLogEntry[]) || [];
          for (const entry of allLogs) {
            if (targetSet.has(entry.cardId)) {
              logStore.delete(entry.id);
            }
          }
        };
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore
  }
}

export async function idbSaveCustomCard(card: VocabCard): Promise<void> {
  try {
    const db = await openAchsooDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_CUSTOM_CARDS, 'readwrite');
      tx.objectStore(STORE_CUSTOM_CARDS).put(card);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore
  }
}

export async function idbGetAllCustomCards(): Promise<VocabCard[]> {
  try {
    const db = await openAchsooDb();
    return await new Promise<VocabCard[]>((resolve, reject) => {
      const tx = db.transaction(STORE_CUSTOM_CARDS, 'readonly');
      const req = tx.objectStore(STORE_CUSTOM_CARDS).getAll();
      req.onsuccess = () => resolve((req.result as VocabCard[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function idbClearAllUserData(): Promise<void> {
  try {
    const db = await openAchsooDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(
        [STORE_REVIEW_LOGS, STORE_CARD_STATES, STORE_CUSTOM_CARDS, STORE_META],
        'readwrite'
      );
      tx.objectStore(STORE_REVIEW_LOGS).clear();
      tx.objectStore(STORE_CARD_STATES).clear();
      tx.objectStore(STORE_CUSTOM_CARDS).clear();
      tx.objectStore(STORE_META).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore IndexedDB errors
  }
}
