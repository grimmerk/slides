import type { Page, SlideMeta } from '@open-slide/core';
import { buildDeck } from './deck';

// Japanese deck for the Fukuoka Claude Meetup (2026-11-29). The content lives in ./deck.tsx,
// shared with the English draft at slides/memsaga-fukuoka.
const deck = buildDeck('ja');

export const design = deck.design;
export const notes = deck.notes;

export const meta: SlideMeta = {
  title: 'Claude に記憶の整理を安心して任せる（memsaga・福岡）',
  createdAt: '2026-11-28T08:00:00.000Z',
};

export default deck.pages satisfies Page[];
