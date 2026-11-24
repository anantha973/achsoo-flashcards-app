import type { VocabCard } from './vocabData';
import { CONVERSATIONAL_CHUNKS_PART_1 } from './conversationalChunksPart1';
import { CONVERSATIONAL_CHUNKS_PART_2 } from './conversationalChunksPart2';
import { CONVERSATIONAL_CHUNKS_PART_3 } from './conversationalChunksPart3';
import { CONVERSATIONAL_CHUNKS_PART_4 } from './conversationalChunksPart4';
import { CONVERSATIONAL_CHUNKS_PART_5 } from './conversationalChunksPart5';

export const CONVERSATIONAL_CHUNK_CARDS: VocabCard[] = [
  ...CONVERSATIONAL_CHUNKS_PART_1,
  ...CONVERSATIONAL_CHUNKS_PART_2,
  ...CONVERSATIONAL_CHUNKS_PART_3,
  ...CONVERSATIONAL_CHUNKS_PART_4,
  ...CONVERSATIONAL_CHUNKS_PART_5,
];
