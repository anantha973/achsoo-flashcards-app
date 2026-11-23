import type { VocabCard } from './vocabData';
import { CONVERSATIONAL_CHUNKS_PART_1 } from './conversationalChunksPart1';
import { CONVERSATIONAL_CHUNKS_PART_2 } from './conversationalChunksPart2';

export const CONVERSATIONAL_CHUNK_CARDS: VocabCard[] = [
  ...CONVERSATIONAL_CHUNKS_PART_1,
  ...CONVERSATIONAL_CHUNKS_PART_2,
];
