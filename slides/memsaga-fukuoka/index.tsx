import type { Page, SlideMeta } from '@open-slide/core';
import { buildDeck } from './deck';

// Fukuoka Claude Meetup deck (2026-11-29). Opens in Japanese; the EN / 日本語 switch in the footer
// (and on the cover) changes the language in place, and ?lang=en opens it in English.
// The content and the English talk script live in ./deck.tsx.
const deck = buildDeck('ja');

export const design = deck.design;
export const notes = deck.notes;

export const meta: SlideMeta = {
  title: 'Claude に記憶の整理を安心して任せる / Letting Claude clean up its memory without fear',
  createdAt: '2026-11-28T08:00:00.000Z',
};

export default deck.pages satisfies Page[];
