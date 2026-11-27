import type { Page, SlideMeta } from '@open-slide/core';
import { buildDeck } from '../memsaga-ja/deck';

// English version of the Fukuoka Claude Meetup deck (2026-11-29): the draft language, and the
// script the speaker talks from. The content lives in slides/memsaga-ja/deck.tsx, shared with
// the Japanese deck shown on stage.
const deck = buildDeck('en');

export const design = deck.design;
export const notes = deck.notes;

export const meta: SlideMeta = {
  title: 'Letting Claude clean up its memory without fear (memsaga, Fukuoka)',
  createdAt: '2026-11-28T08:00:00.000Z',
};

export default deck.pages satisfies Page[];
