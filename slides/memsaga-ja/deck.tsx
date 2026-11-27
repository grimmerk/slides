import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';
import codevIcon from './assets/codev-icon.png';
import codevQr from './assets/codev-qr.svg';
import matchapackIcon from './assets/matchapack-icon.png';
import matchapackQr from './assets/matchapack-qr.svg';
import memsagaQr from './assets/memsaga-qr.svg';
import slidesQrEn from './assets/slides-qr-en.svg';
import slidesQrJa from './assets/slides-qr-ja.svg';

// memsaga talk, Fukuoka Claude Meetup (2026-11-29): one source, two decks.
//   slides/memsaga-fukuoka/index.tsx -> buildDeck('en')  (draft language; the speaker talks in English)
//   slides/memsaga-ja/index.tsx      -> buildDeck('ja')  (what is shown on stage)
// Every visible string goes through t(en, ja); a missing ja falls back to the English.
// The speaker notes are the English talk script and are shared by both decks.
// Numbers come from the author's own data repository (measured 2026-11-24, commits since
// 2026-09-20); facts about other Claude surfaces were checked against Anthropic's docs on 2026-11-28.

export type Lang = 'en' | 'ja';

const muted = '#6b645a';
const teal = '#1f7a6d';
const panel = '#f1ede4';
const rule = '#e2dccf';
const soft = '#a39b8e';
const mono = '"SF Mono", ui-monospace, Menlo, Consolas, monospace';
const PAD = 140;

const URL_SITE = 'https://memsaga.grimmer.io';
const URL_REPO = 'https://github.com/grimmerk/memsaga';
const URL_NEED = `${URL_REPO}#do-you-need-memsaga`;
const URL_ENGRAM = 'https://github.com/Sen-CaPoo/engram';
const URL_ME = 'https://github.com/grimmerk';
const URL_MATCHAPACK = 'https://github.com/grimmerk/matchapack';
const URL_CODEV = 'https://github.com/grimmerk/codev';
// Anthropic's skill guide, section "Evaluation and iteration" (評価と反復 in the Japanese edition).
const URL_SKILL_GUIDE_EN = 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices';
const URL_SKILL_GUIDE_JA = 'https://platform.claude.com/docs/ja/agents-and-tools/agent-skills/best-practices';

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
};

export function buildDeck(lang: Lang) {
  const t = <T extends ReactNode>(en: T, ja?: T): T => (lang === 'ja' && ja !== undefined ? ja : en);
  const deckPath = lang === 'ja' ? 'memsaga-ja' : 'memsaga-fukuoka';
  const slidesUrl = `https://slides.grimmer.io/s/${deckPath}`;
  const slidesQr = lang === 'ja' ? slidesQrJa : slidesQrEn;

  const font =
    lang === 'ja'
      ? '"Hiragino Sans", "Hiragino Kaku Gothic ProN", -apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif'
      : '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Sans", system-ui, sans-serif';

  const design: DesignSystem = {
    palette: { bg: '#fbfaf7', text: '#1a1814', accent: '#b0641c' },
    fonts: { display: font, body: font },
    typeScale: { hero: 100, body: 40 },
    radius: 16,
  };

  // ---------- shared pieces ----------

  const A = ({ href, children }: { href: string; children: ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--osd-accent)', textDecorationThickness: 2, textUnderlineOffset: 8 }}
    >
      {children}
    </a>
  );

  const Code = ({ children }: { children: ReactNode }) => (
    <span style={{ fontFamily: mono, fontSize: '0.92em', whiteSpace: 'nowrap' }}>{children}</span>
  );

  const Footer = () => {
    const { current, total } = useSlidePageNumber();
    return (
      <div
        style={{
          position: 'absolute',
          left: PAD,
          right: PAD,
          bottom: 56,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 24,
          color: muted,
          fontFamily: mono,
        }}
      >
        <span>memsaga · Grimmer · Fukuoka Claude Meetup</span>
        <span>
          {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    );
  };

  const Eyebrow = ({ children }: { children: ReactNode }) => (
    <div style={{ fontSize: 26, letterSpacing: '0.14em', color: 'var(--osd-accent)', fontWeight: 600, textTransform: 'uppercase' }}>{children}</div>
  );

  const Heading = ({ children, size = 68 }: { children: ReactNode; size?: number }) => (
    <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: size, fontWeight: 800, lineHeight: 1.2, margin: '22px 0 0', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  );

  const Content = ({ children, eyebrow, heading, headingSize }: { children?: ReactNode; eyebrow: ReactNode; heading: ReactNode; headingSize?: number }) => (
    <div style={{ ...fill, padding: `110px ${PAD}px 0` }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading size={headingSize}>{heading}</Heading>
      {children}
      <Footer />
    </div>
  );

  // A technical term with its plain-words meaning, for readers who are not engineers.
  const Gloss = ({ term, children }: { term: ReactNode; children: ReactNode }) => (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, background: '#eef5f3', border: `1px solid #cfe3de`, borderRadius: 10, padding: '6px 16px', fontSize: 25, marginRight: 14 }}>
      <span style={{ fontWeight: 700, color: teal }}>{term}</span>
      <span style={{ color: muted }}>{children}</span>
    </span>
  );

  const Card = ({ title, sub, children, strong, accent, width }: { title: ReactNode; sub?: ReactNode; children?: ReactNode; strong?: boolean; accent?: boolean; width?: number }) => (
    <div
      style={{
        flex: width ? 'none' : 1,
        width,
        boxSizing: 'border-box',
        padding: '26px 30px',
        borderRadius: 'var(--osd-radius)',
        border: `2px solid ${accent ? 'var(--osd-accent)' : strong ? teal : rule}`,
        background: accent ? '#fbefe2' : strong ? '#e6f1ee' : panel,
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.25 }}>{title}</div>
      {sub && <div style={{ fontSize: 26, color: muted, marginTop: 8, lineHeight: 1.35 }}>{sub}</div>}
      {children && <div style={{ fontSize: 30, lineHeight: 1.45, marginTop: 14 }}>{children}</div>}
    </div>
  );

  const Num = ({ n, color }: { n: string; color?: string }) => (
    <div
      style={{
        width: 48,
        height: 48,
        flex: 'none',
        borderRadius: 24,
        background: color ?? 'var(--osd-accent)',
        color: '#fff',
        fontSize: 26,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
  );

  // ---------- 1. cover ----------

  const Cover: Page = () => (
    <div style={{ ...fill, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `0 ${PAD}px` }}>
      <Eyebrow>Fukuoka | Claude Meetup · 2026-11-29</Eyebrow>
      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-0.02em',
          margin: '36px 0 32px',
          maxWidth: 1500,
        }}
      >
        {t(<>Letting Claude clean up its memory, <span style={{ color: 'var(--osd-accent)' }}>without fear</span></>)}
      </h1>
      <p style={{ fontSize: 44, color: muted, margin: 0, lineHeight: 1.4 }}>{t('Git history for Claude Code’s CLAUDE.md, memory and skills')}</p>
      <p style={{ fontSize: 30, color: muted, margin: '72px 0 0', fontFamily: mono }}>
        Grimmer · Tech Lead, <A href="https://fireflies.ai">Fireflies.ai</A> · {t('from Taiwan')} · <A href={URL_ME}>github.com/grimmerk</A>
      </p>
      {/* Bottom right, flush with the right margin: the QR and its URL share one right edge. */}
      <div style={{ position: 'absolute', right: PAD, bottom: 96, textAlign: 'right' }}>
        <img src={slidesQr} alt={`QR code for ${slidesUrl}`} style={{ display: 'block', marginLeft: 'auto', width: 190, height: 190, imageRendering: 'pixelated' }} />
        <div style={{ fontSize: 22, color: muted, fontFamily: mono, marginTop: 10 }}>{slidesUrl.replace('https://', '')}</div>
      </div>
    </div>
  );

  // ---------- 2. how Claude Code remembers ----------

  const Bubble = ({ who, children, claude }: { who: ReactNode; children: ReactNode; claude?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      {who && <div style={{ fontSize: 21, color: soft, marginBottom: 4 }}>{who}</div>}
      <div
        style={{
          fontSize: 27,
          lineHeight: 1.35,
          padding: '12px 20px',
          borderRadius: 14,
          background: claude ? '#fbefe2' : panel,
          border: `1px solid ${claude ? '#ecd3b8' : rule}`,
          maxWidth: 560,
        }}
      >
        {children}
      </div>
    </div>
  );

  // One step of the auto-memory example: a small label, then a bubble or a file card.
  const Step = ({ n, label, children }: { n: string; label: ReactNode; children: ReactNode }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, color: muted, fontWeight: 700 }}>
        <span style={{ width: 34, height: 34, borderRadius: 17, background: teal, color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
        {label}
      </div>
      {children}
    </div>
  );

  const Remembers: Page = () => (
    <Content eyebrow={t('How Claude Code remembers')} heading={t('Each session starts fresh, so Claude Code keeps notes in files')} headingSize={54}>
      <div style={{ marginTop: 18 }}>
        <Gloss term="Claude Code">{t('Claude working on your computer: in a terminal, or the desktop app')}</Gloss>
        <Gloss term={t('session')}>{t('one conversation with Claude Code')}</Gloss>
      </div>
      <div style={{ fontSize: 24, color: teal, fontWeight: 700, margin: '26px 0 10px', letterSpacing: '0.06em' }}>{t('EXAMPLE: AUTO MEMORY')}</div>
      <div style={{ display: 'flex', gap: 22, alignItems: 'flex-end' }}>
        <Step n="1" label={t('Monday: you say')}>
          <Bubble who="">{t('“Remember: start the database before the tests.”')}</Bubble>
        </Step>
        <div style={{ fontSize: 40, color: muted, paddingBottom: 18 }}>→</div>
        <Step n="2" label={t('Claude Code writes a note')}>
          <div style={{ background: '#fff', border: `2px solid ${teal}`, borderRadius: 14, padding: '14px 20px' }}>
            <div style={{ fontFamily: mono, fontSize: 22, color: teal, fontWeight: 700 }}>memory/testing.md</div>
            <div style={{ fontSize: 25, marginTop: 6, lineHeight: 1.35 }}>{t('Start the database before the tests.')}</div>
          </div>
        </Step>
        <div style={{ fontSize: 40, color: muted, paddingBottom: 18 }}>→</div>
        <Step n="3" label={t('Tuesday: a new session reads it first')}>
          <Bubble who="" claude>
            {t('“Starting the database, then the tests.”')}
          </Bubble>
        </Step>
      </div>
      <div style={{ display: 'flex', gap: 28, marginTop: 34 }}>
        <Card title="CLAUDE.md" sub={t('Standing instructions')}>
          {t('Read at the start of every session.')}
        </Card>
        <Card title={t('Auto memory')} sub={t('Notes')}>
          {t('Claude Code writes them on its own as it works (on by default), or when you say “remember”.')}
        </Card>
        <Card title={t('Skills')} sub={t('How-to guides')}>
          {t('Steps for one kind of task, loaded when the task needs them.')}
        </Card>
      </div>
      <p style={{ fontSize: 25, color: muted, margin: '18px 0 0' }}>
        {t('CLAUDE.md and skills: you write them, ask Claude Code to update them, or tell it when it may update them on its own.')}
      </p>
    </Content>
  );

  // ---------- 3. where memory can live ----------

  // A link to another page of this deck (?p=N), for readers browsing the slides later.
  const PageLink = ({ to, children }: { to: Page; children: ReactNode }) => (
    <a href={`?p=${pages.indexOf(to) + 1}`} style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: soft, textUnderlineOffset: 6 }}>
      {children}
    </a>
  );

  // The same three kinds as page 2 (instructions, notes, how-to guides), in the three places they
  // can be kept. The appendix page Surfaces uses the same three column names.
  const PLACE_APP = { title: t('Claude app'), sub: t('web, desktop, phone · kept with your account') };
  const PLACE_MINE = { title: t('Claude Code · your files'), sub: t('~/.claude on your computer · just you') };
  const PLACE_PROJECT = { title: t('Claude Code · project files'), sub: t('in the project’s Git repository · shared with the team') };

  const GridHead = ({ title, sub, strong }: { title: ReactNode; sub: ReactNode; strong?: boolean }) => (
    <div style={{ padding: '16px 20px', background: strong ? '#e6f1ee' : panel, borderTopLeftRadius: 14, borderTopRightRadius: 14, border: `2px solid ${strong ? teal : rule}`, borderBottom: 'none' }}>
      <div style={{ fontSize: 30, fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 22, color: muted, marginTop: 4 }}>{sub}</div>
    </div>
  );

  const GridCell = ({ children, strong, accent, last, dim }: { children: ReactNode; strong?: boolean; accent?: boolean; last?: boolean; dim?: boolean }) => (
    <div
      style={{
        padding: '14px 20px',
        fontSize: 27,
        lineHeight: 1.35,
        color: accent ? 'var(--osd-accent)' : dim ? soft : 'var(--osd-text)',
        fontWeight: accent ? 700 : 400,
        background: strong ? '#f0f7f5' : '#fff',
        borderLeft: `2px solid ${strong ? teal : rule}`,
        borderRight: `2px solid ${strong ? teal : rule}`,
        borderTop: `1px solid ${rule}`,
        borderBottom: last ? `2px solid ${strong ? teal : rule}` : 'none',
        borderBottomLeftRadius: last ? 14 : 0,
        borderBottomRightRadius: last ? 14 : 0,
      }}
    >
      {children}
    </div>
  );

  const RowLabel = ({ children }: { children: ReactNode }) => (
    <div style={{ padding: '14px 0', fontSize: 25, color: muted, fontWeight: 700, alignSelf: 'center' }}>{children}</div>
  );

  const Where: Page = () => (
    <Content eyebrow={t('The big picture')} heading={t('Where Claude keeps its instructions and notes')} headingSize={60}>
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr 1fr 1fr', columnGap: 20, marginTop: 40, width: 1640 }}>
        <div />
        <GridHead {...PLACE_APP} />
        <GridHead {...PLACE_MINE} strong />
        <GridHead {...PLACE_PROJECT} />

        <RowLabel>{t('Instructions')}</RowLabel>
        <GridCell>{t('Your instructions (profile, project)')}</GridCell>
        <GridCell strong>CLAUDE.md</GridCell>
        <GridCell>{t('CLAUDE.md or AGENTS.md')}</GridCell>

        <RowLabel>{t('Notes')}</RowLabel>
        <GridCell>{t('Memory: Claude keeps it; you can view and edit it in Settings')}</GridCell>
        <GridCell strong>{t('Auto memory, one folder per project')}</GridCell>
        <GridCell dim>—</GridCell>

        <RowLabel>{t('How-to guides')}</RowLabel>
        <GridCell>{t('Skills you upload')}</GridCell>
        <GridCell strong>{t('Skills')}</GridCell>
        <GridCell>{t('Skills')}</GridCell>

        <RowLabel>{t('History')}</RowLabel>
        <GridCell last>{t('Kept by Anthropic')}</GridCell>
        <GridCell last strong accent>{t('None. Today’s topic.')}</GridCell>
        <GridCell last>{t('Git, together with the code')}</GridCell>
      </div>
      <p style={{ fontSize: 25, color: muted, margin: '26px 0 0', lineHeight: 1.45 }}>
        {t('You can also build notes of your own outside these, like the talk you just heard: an external memory Claude reads.')}{' '}
        <PageLink to={Surfaces}>{t('Which Claude reads which place (appendix)')}</PageLink>
      </p>
    </Content>
  );

  // ---------- 4. the problem ----------

  const Pain = ({ n, head, body }: { n: string; head: ReactNode; body: ReactNode }) => (
    <div style={{ flex: 1, display: 'flex', gap: 18, alignItems: 'flex-start', background: panel, border: `1px solid ${rule}`, borderRadius: 'var(--osd-radius)', padding: '24px 26px' }}>
      <Num n={n} />
      <div>
        <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.3 }}>{head}</div>
        <div style={{ fontSize: 29, color: muted, marginTop: 12, lineHeight: 1.45 }}>{body}</div>
      </div>
    </div>
  );

  const Problem: Page = () => (
    <Content eyebrow={t('The problem')} heading={t('Claude Code edits these files every day, and keeps no history')} headingSize={60}>
      <p style={{ fontSize: 34, lineHeight: 1.45, margin: '28px 0 0', maxWidth: 1600 }}>
        {t('It is like a shared document with no version history: it keeps changing, and you cannot see what changed.')}
      </p>
      <div style={{ display: 'flex', gap: 26, marginTop: 40 }}>
        <Pain n="1" head={t('You forget what was tried')} body={t('An idea was tried last week and dropped. Nobody remembers, so it is tried again.')} />
        <Pain n="2" head={t('A bad edit cannot be undone')} body={t('The old version is simply gone.')} />
        <Pain n="3" head={t('You cannot tell why')} body={t('A new rule appears. When was it added, in which session, and why?')} />
      </div>
      <p style={{ fontSize: 38, fontWeight: 700, margin: '50px 0 0', color: 'var(--osd-accent)' }}>
        {t('So I rarely let Claude Code touch a skill, and never asked it to clean up its memory.')}
      </p>
    </Content>
  );

  // ---------- 5. what I do now ----------

  const HistoryRow = ({ when, title, what, first }: { when: string; title: ReactNode; what: ReactNode; first?: boolean }) => (
    <div style={{ display: 'flex', gap: 20, padding: '14px 0', borderTop: first ? 'none' : `1px solid ${rule}` }}>
      <div style={{ width: 120, fontSize: 23, color: muted, fontFamily: mono, paddingTop: 4 }}>{when}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 23, color: teal, marginTop: 4, fontFamily: mono }}>{what}</div>
      </div>
    </div>
  );

  const WhatIDo: Page = () => (
    <Content eyebrow={t('What I do now')} heading={t('Every change becomes a record, named after its session')} headingSize={62}>
      <div style={{ marginTop: 18 }}>
        <Gloss term="Git">{t('a tool that keeps the history of files')}</Gloss>
        <Gloss term={t('commit')}>{t('one saved change, with a short message')}</Gloss>
      </div>
      <div style={{ display: 'flex', gap: 40, marginTop: 28, alignItems: 'flex-start' }}>
        <div style={{ width: 900, background: '#fff', border: `2px solid ${rule}`, borderRadius: 'var(--osd-radius)', padding: '18px 30px' }}>
          <div style={{ fontSize: 22, color: muted, fontWeight: 700, letterSpacing: '0.08em' }}>{t('HISTORY (newest first)')}</div>
          <HistoryRow first when={t('Tue 14:02')} title={t('session “fix flaky login test”')} what={t('CLAUDE.md: 1 rule added')} />
          <HistoryRow when={t('Tue 11:40')} title={t('session “weekly memory tidy-up”')} what={t('memory: 2 notes merged, 1 deleted')} />
          <HistoryRow when={t('Mon 18:15')} title={t('session “write release notes”')} what={t('skills/release-notes: 3 lines changed')} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title={<Code>~/.claude</Code>} sub={t('A hidden folder: about 60 items, mostly logs and caches.')} />
          <div style={{ fontSize: 34, color: muted, textAlign: 'center' }}>↓</div>
          <Card title={t('A folder you can browse')} sub={t('Only CLAUDE.md, memory and skills, with readable names. On GitHub, even from a phone.')} strong />
          <div style={{ fontSize: 22, color: muted, textAlign: 'right' }}>
            <PageLink to={WhatGoesIn}>{t('The two folders side by side (appendix)')}</PageLink>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 27, color: muted, margin: '22px 0 0' }}>
        {t(<>The tool is <b style={{ color: 'var(--osd-text)' }}>memsaga</b>, free and open source. Claude Code works as before; the files stay where they are.</>)}
      </p>
      {/* Not spoken: for engineers in the room. */}
      <p style={{ fontSize: 23, color: soft, margin: '10px 0 0' }}>
        {t('How: Claude Code hooks run it at the end of each turn · one small program · about 5 ms for most tool calls ·')}{' '}
        <PageLink to={OneRecord}>{t('one record, in full (appendix)')}</PageLink>
      </p>
    </Content>
  );

  // ---------- 6. the story ----------

  const FlowBox = ({ label, body, accent }: { label: ReactNode; body: ReactNode; accent?: boolean }) => (
    <div
      style={{
        width: 470,
        minHeight: 190,
        boxSizing: 'border-box',
        padding: '24px 28px',
        borderRadius: 'var(--osd-radius)',
        border: `2px solid ${accent ? 'var(--osd-accent)' : rule}`,
        background: accent ? '#fbefe2' : panel,
      }}
    >
      <div style={{ fontSize: 25, color: muted, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 29, lineHeight: 1.4, marginTop: 12 }}>{body}</div>
    </div>
  );

  const Arrow = () => <div style={{ fontSize: 44, color: muted, alignSelf: 'center' }}>→</div>;

  const Story: Page = () => (
    <Content eyebrow={t('A real case: what I asked Claude Code')} heading={t('“Did you add this rule yourself?”')} headingSize={66}>
      <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
        <FlowBox label={t('A rule in my CLAUDE.md')} body={t('“Run the tests before every push.”')} />
        <Arrow />
        <FlowBox label={t('The record that added it')} body={<>{t('Tue 14:02')}<br />{t('session “fix flaky login test”')}</>} />
        <Arrow />
        <FlowBox label={t('That session’s saved conversation')} body={t('Why the rule was added')} accent />
      </div>
      <p style={{ fontSize: 33, lineHeight: 1.5, margin: '40px 0 0', maxWidth: 1620 }}>
        {t('I did not search myself. Claude Code looked it up in the history. Yes, it had added the rule, and it said so in its reply. I had missed that line.')}
      </p>
      <p style={{ fontSize: 33, lineHeight: 1.5, margin: '22px 0 0', fontWeight: 700 }}>
        {t('My rule since: memory and skills, Claude Code edits and tells me. CLAUDE.md waits for my OK.')}
      </p>
      {/* Not spoken: more questions the history answered (from the Taipei deck). */}
      <p style={{ fontSize: 24, color: muted, margin: '34px 0 0', lineHeight: 1.5 }}>
        {t('The history also answered, for me and for other sessions:')}{' '}
        {t('“Which version of the skill did you load?” · “What did the other session just change?” · “Where did this file go?”')}
      </p>
    </Content>
  );

  // ---------- 7. what changed ----------

  const Big = ({ n, head, body }: { n: string; head: ReactNode; body: ReactNode }) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1, color: 'var(--osd-accent)', letterSpacing: '-0.02em' }}>{n}</div>
      <div style={{ fontSize: 34, fontWeight: 700, marginTop: 18, lineHeight: 1.3 }}>{head}</div>
      <div style={{ fontSize: 29, color: muted, marginTop: 12, lineHeight: 1.45 }}>{body}</div>
    </div>
  );

  const Changed: Page = () => (
    <Content eyebrow={t('What changed for me')} heading={t('Undo took away the fear. Now I hand over the cleanup.')} headingSize={62}>
      <div style={{ display: 'flex', gap: 60, marginTop: 56 }}>
        <Big n="~90" head={t('files removed in Claude Code’s cleanups')} body={t('Duplicate and stale notes. Every one can come back.')} />
        <Big n="70" head={t('changes to one skill in two months')} body={t('Each with the session that made it. A skill gets better one small change at a time.')} />
        <Big n="2" head={t('times the tool itself broke files')} body={t('A sync bug, twice. Each time, the history undid it.')} />
      </div>
      <p style={{ fontSize: 38, lineHeight: 1.45, margin: '64px 0 0', fontWeight: 700 }}>
        {t('Like a seatbelt: I rarely need it, but I drive differently because it is there.')}
      </p>
      <p style={{ fontSize: 24, color: muted, margin: '40px 0 0' }}>
        {t('Anthropic’s guide also says to improve a skill step by step:')}{' '}
        <A href={t(URL_SKILL_GUIDE_EN, URL_SKILL_GUIDE_JA)}>{t('“Skill authoring best practices”, Evaluation and iteration')}</A>
      </p>
    </Content>
  );

  // ---------- 8. close ----------

  const Close: Page = () => (
    <div style={{ ...fill, padding: `110px ${PAD}px 0`, display: 'flex', gap: 70 }}>
      <div style={{ flex: 1 }}>
        <Eyebrow>{t('Systems that don’t break when you hand work to Claude')}</Eyebrow>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.15, margin: '40px 0 0', letterSpacing: '-0.02em' }}>
          {t(<>See every change.<br />Undo any change.<br /><span style={{ color: 'var(--osd-accent)' }}>Then hand it over.</span></>)}
        </div>
        <p style={{ fontSize: 32, color: muted, margin: '48px 0 0', lineHeight: 1.5 }}>
          {t('The idea needs no special tool: any Git history of these files helps.')}
        </p>
        <p style={{ fontSize: 28, color: muted, margin: '20px 0 0', lineHeight: 1.6 }}>
          {t('Mine:')} <A href={URL_SITE}>memsaga.grimmer.io</A> · {t('free and open source (MIT) · macOS and Linux')}
          <br />
          {t('These slides:')} <A href={slidesUrl}>{slidesUrl.replace('https://', '')}</A>
        </p>
      </div>
      <div style={{ width: 340, paddingTop: 150, textAlign: 'center' }}>
        <img src={memsagaQr} alt="QR code for memsaga.grimmer.io" style={{ width: 320, height: 320, imageRendering: 'pixelated' }} />
        <div style={{ fontSize: 24, color: muted, fontFamily: mono, marginTop: 12 }}>memsaga.grimmer.io</div>
      </div>
      <Footer />
    </div>
  );

  // ---------- appendix ----------

  // ● reads it · ○ reads a copy · — does not. Checked against Anthropic's docs on 2026-11-28:
  // code.claude.com skills, memory (AGENTS.md), desktop, routines pages; claude.com/docs/cowork
  // (changelog: Chat and Cowork merged into "Unified Claude", on for everyone from 2026-11-10);
  // support.claude.com chat memory, skills and projects articles. The desktop Code tab reading
  // CLAUDE.md and auto memory when a folder is chosen is the author's own test (2026-11-25).
  const Mark = ({ kind, children }: { kind: 'yes' | 'copy' | 'no'; children?: ReactNode }) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 28, lineHeight: 1.1, color: kind === 'no' ? soft : teal, width: 24, flex: 'none' }}>{kind === 'yes' ? '●' : kind === 'copy' ? '○' : '—'}</span>
      <span style={{ color: kind === 'no' ? soft : 'var(--osd-text)' }}>{children}</span>
    </div>
  );

  const Cell = ({ children, head, strong }: { children: ReactNode; head?: boolean; strong?: boolean }) => (
    <div
      style={{
        padding: '14px 18px',
        borderBottom: `1px solid ${rule}`,
        fontWeight: head ? 700 : 400,
        color: head ? muted : 'var(--osd-text)',
        background: head ? panel : strong ? '#e6f1ee' : 'transparent',
        lineHeight: 1.35,
      }}
    >
      {children}
    </div>
  );

  const Surfaces: Page = () => (
    <Content eyebrow={t('Appendix · The big picture, in detail')} heading={t('Which Claude reads which place')} headingSize={56}>
      <div style={{ display: 'grid', gridTemplateColumns: '400px 410px 410px 410px', fontSize: 24, border: `1px solid ${rule}`, borderRadius: 'var(--osd-radius)', overflow: 'hidden', width: 1630, marginTop: 30 }}>
        <Cell head>{t('Where you use Claude')}</Cell>
        <Cell head>{PLACE_APP.title}<div style={{ fontWeight: 400, fontSize: 21 }}>{PLACE_APP.sub}</div></Cell>
        <Cell head>{PLACE_MINE.title}<div style={{ fontWeight: 400, fontSize: 21 }}>{PLACE_MINE.sub}</div></Cell>
        <Cell head>{PLACE_PROJECT.title}<div style={{ fontWeight: 400, fontSize: 21 }}>{PLACE_PROJECT.sub}</div></Cell>

        <Cell>{t('Claude app: chat and Projects')}</Cell>
        <Cell><Mark kind="yes">{t('your instructions, memory and skills (yours, or shared in your organisation)')}</Mark></Cell>
        <Cell><Mark kind="no">{t('not read')}</Mark></Cell>
        <Cell><Mark kind="no">{t('not read')}</Mark></Cell>

        <Cell>{t('Scheduled tasks in the cloud')}</Cell>
        <Cell><Mark kind="yes">{t('skills')}</Mark></Cell>
        <Cell><Mark kind="no">{t('not read, so no auto memory')}</Mark></Cell>
        <Cell><Mark kind="yes">{t('a fresh copy of the project each run, with its skills')}</Mark></Cell>

        <Cell strong>{t('Claude Code: terminal, or the desktop app’s Code tab')}</Cell>
        <Cell strong><Mark kind="copy">{t('a downloaded copy of the skills you added in the Claude app (one way)')}</Mark></Cell>
        <Cell strong><Mark kind="yes"><b>{t('CLAUDE.md, auto memory, skills: what memsaga keeps')}</b></Mark></Cell>
        <Cell strong><Mark kind="yes">{t('CLAUDE.md (or AGENTS.md) and skills')}</Mark></Cell>
      </div>
      <p style={{ fontSize: 23, color: muted, margin: '18px 0 0', lineHeight: 1.45 }}>
        {t('● reads it · ○ reads a copy: at the start of each session, Claude Code downloads the skills you added in the Claude app into ~/.claude/skills/synced/, and never uploads · — does not.')}
        <br />
        {t('Cowork, part of the Claude app since 10 Nov 2026, uses the app’s skills and does not read ~/.claude. From Anthropic’s docs, 28 Nov 2026; that the desktop Code tab also reads CLAUDE.md and auto memory when a folder is chosen is my own test.')}
      </p>
    </Content>
  );

  // One line of a file tree: kept lines in the text colour, the rest muted; an optional note on the right.
  const T = ({ line, keep, note, dim }: { line: string; keep?: boolean; note?: ReactNode; dim?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
      <span style={{ whiteSpace: 'pre', color: keep ? 'var(--osd-text)' : dim ? soft : muted, fontWeight: keep ? 700 : 400 }}>{line}</span>
      {note && <span style={{ color: keep ? teal : soft, fontFamily: 'var(--osd-font-body)', fontSize: 21, whiteSpace: 'nowrap' }}>{note}</span>}
    </div>
  );

  const TreeBox = ({ title, sub, strong, children }: { title: ReactNode; sub: ReactNode; strong?: boolean; children: ReactNode }) => (
    <div
      style={{
        width: 800,
        boxSizing: 'border-box',
        padding: '24px 30px',
        borderRadius: 'var(--osd-radius)',
        border: `2px solid ${strong ? teal : rule}`,
        background: strong ? '#e6f1ee' : panel,
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 800, fontFamily: mono }}>{title}</div>
      <div style={{ fontSize: 24, color: muted, marginTop: 4 }}>{sub}</div>
      <div style={{ fontFamily: mono, fontSize: 23, lineHeight: 1.5, marginTop: 14 }}>{children}</div>
    </div>
  );

  // ~/.claude as it is on disk, next to what memsaga keeps of it (from the Taipei deck). Folder names
  // are Claude Code's own; the project is a placeholder.
  const WhatGoesIn: Page = () => (
    <Content eyebrow={t('Appendix · What goes in')} heading={t('A hidden, noisy folder becomes a folder you can browse')} headingSize={54}>
      <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
        <TreeBox title="~/.claude" sub={t('hidden; about 60 items, mostly caches and logs')}>
          <T line="CLAUDE.md" keep note={t('kept')} />
          <T line="skills/  hooks/  scripts/" keep note={t('kept')} />
          <T line="projects/" />
          <T line="  -Users-you-code-webapp/" />
          <T line="    memory/" keep note={t('kept')} />
          <T line="      MEMORY.md  project-notes.md" keep />
          <T line="    3f46…e21.jsonl" note={t('saved conversation, not kept')} />
          <T line="cache/  telemetry/  paste-cache/" dim />
          <T line="shell-snapshots/  session-env/" dim />
          <T line="file-history/  history.jsonl  …" dim note={t('not kept')} />
        </TreeBox>
        <TreeBox title="memories/" sub={t('your history folder, private on GitHub')} strong>
          <T line="index.md" keep note={t('~/code/webapp → HOME-code-webapp')} />
          <T line="claude/" />
          <T line="  CLAUDE.md" keep />
          <T line="  skills/  hooks/  scripts/" keep />
          <T line="  memory/HOME-code-webapp/" keep />
          <T line="    MEMORY.md  project-notes.md" keep />
          <T line="  drafts/" keep note={t('any folder you add')} />
          <T line="claude-alt/" keep note={t('a second account')} />
          <T line="extra/home/" keep note={t('files outside ~/.claude')} />
          <T line="companion/" keep note={t('your notes on other repositories')} />
        </TreeBox>
      </div>
    </Content>
  );

  // The two kinds of Claude Code files from page 3, as folders. Project files travel with the code in
  // Git; the personal ones, including each project's auto memory, stay in ~/.claude.
  const ProjectFiles: Page = () => (
    <Content eyebrow={t('Appendix · Two kinds of Claude Code files')} heading={t('Project files travel with the code; yours stay on your computer')} headingSize={52}>
      <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
        <TreeBox title="~/code/webapp/" sub={t('the project’s Git repository (repo), shared with the team, for example on GitHub')}>
          <T line="CLAUDE.md" keep note={t('instructions for everyone on the project')} />
          <T line="AGENTS.md" note={t('read instead, if there is no CLAUDE.md')} />
          <T line=".claude/" />
          <T line="  skills/release-notes/" />
          <T line="    SKILL.md" keep note={t('a skill for this project')} />
          <T line="  settings.json" note={t('shared settings')} />
          <T line="src/  tests/  …" dim note={t('the code')} />
        </TreeBox>
        <TreeBox title="~/.claude/" sub={t('your files, on your computer only')} strong>
          <T line="CLAUDE.md" keep note={t('your instructions, every project')} />
          <T line="skills/" keep note={t('your skills, every project')} />
          <T line="projects/" />
          <T line="  -Users-you-code-webapp/" />
          <T line="    memory/" keep note={t('auto memory for this project')} />
          <T line="      MEMORY.md" keep />
        </TreeBox>
      </div>
      <p style={{ fontSize: 27, color: muted, margin: '30px 0 0', lineHeight: 1.45 }}>
        {t('Project files get Git history when you commit them with the code. Your files in ~/.claude, including each project’s auto memory, get none: that is the gap memsaga fills.')}
      </p>
    </Content>
  );

  const Item = ({ mark, children, color }: { mark: string; children: ReactNode; color: string }) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 14 }}>
      <Num n={mark} color={color} />
      <div style={{ fontSize: 27, lineHeight: 1.42, paddingTop: 6 }}>{children}</div>
    </div>
  );

  const Line = ({ children, color, bold }: { children: ReactNode; color?: string; bold?: boolean }) => (
    <div style={{ color: color ?? muted, fontWeight: bold ? 700 : 400, whiteSpace: 'pre' }}>{children}</div>
  );

  // One commit as memsaga writes it (from the Taipei deck): the subject names the session and the
  // folder; the trailers say which session, account and agent. Placeholder project and session.
  const OneRecord: Page = () => (
    <Content eyebrow={t('Appendix · How it works')} heading={t('One record, in full')}>
      <div style={{ display: 'flex', gap: 40, marginTop: 36, alignItems: 'flex-start' }}>
        <div style={{ background: panel, border: `1px solid ${rule}`, borderRadius: 'var(--osd-radius)', padding: '26px 36px', fontFamily: mono, fontSize: 25, lineHeight: 1.45, width: 1000, boxSizing: 'border-box' }}>
          <Line color="var(--osd-accent)" bold>{'[weekly memory tidy-up] claude:memory:HOME-code-webapp'}</Line>
          <Line>{'2 files changed, 6 insertions(+), 14 deletions(-)'}</Line>
          <Line color={teal}>{'M   claude/memory/HOME-code-webapp/project-notes.md'}</Line>
          <Line color={teal}>{'D   claude/memory/HOME-code-webapp/old-duplicate.md'}</Line>
          <Line>{' '}</Line>
          <Line>{'Event: Stop'}</Line>
          <Line>{'Account: claude'}</Line>
          <Line color="var(--osd-text)" bold>{'Session: 9e41f07c-2b1d-4c0e-9a57-…'}</Line>
          <Line>{'Cwd: /Users/you/code/webapp'}</Line>
          <Line>{'Agent: main'}</Line>
          <Line color="var(--osd-text)" bold>{'Session-Title: weekly memory tidy-up'}</Line>
        </div>
        <div style={{ flex: 1, fontSize: 26, lineHeight: 1.45 }}>
          <Pt lead={t('First line:')}>{t('the session’s title, and which folder changed.')}</Pt>
          <Pt lead="Session:">{t('the ID to reopen that session, or to read its saved conversation.')}</Pt>
          <Pt lead="Account:">{t('which Claude Code account, when you use more than one.')}</Pt>
          <Pt lead="Agent:">{t('main, or the name of the subagent that made the edit.')}</Pt>
          <Pt lead={t('When:')}>{t('one record per turn that changed something; Git adds the time.')}</Pt>
        </div>
      </div>
      <p style={{ fontSize: 24, color: muted, margin: '26px 0 0' }}>
        {t('A record holds every change since the last one, including your own edits; it is named after the session whose turn just ended.')}
      </p>
    </Content>
  );

  const NeedIt: Page = () => (
    <Content eyebrow={t('Appendix · Do you need memsaga?')} heading={t('Maybe not')}>
      <div style={{ display: 'flex', gap: 40, marginTop: 34, alignItems: 'stretch' }}>
        <Card title={t('You may not need it, if…')}>
          <Item mark="1" color={muted}>
            {t(<>One account on one computer: put <Code>~/.claude</Code> in Git yourself, keep only the files you want, and commit at the end of each session.</>)}
          </Item>
          <Item mark="2" color={muted}>
            {t('You already keep your notes in a system you built yourself, outside Claude Code’s files.')}
          </Item>
          <Item mark="3" color={muted}>
            {t(<>You are on Windows: <A href={URL_ENGRAM}>Engram</A> is a similar tool.</>)}
          </Item>
        </Card>
        <Card title={t('What memsaga adds')} strong>
          <Item mark="A" color={teal}>{t('Which session made each change')}</Item>
          <Item mark="B" color={teal}>{t('History kept apart from the live files')}</Item>
          <Item mark="C" color={teal}>{t('Several accounts and computers; edits from GitHub or a phone come back')}</Item>
          <Item mark="D" color={teal}>{t(<>Any file you choose, even outside <Code>~/.claude</Code></>)}</Item>
          <Item mark="E" color={teal}>{t('History from before you installed it, rebuilt from saved conversations')}</Item>
          <Item mark="F" color={teal}>{t('Companion docs: your notes and translations beside a repository you must not commit to')}</Item>
        </Card>
      </div>
      <p style={{ fontSize: 25, color: muted, margin: '22px 0 0' }}>
        {t('The full comparison:')} <A href={URL_NEED}>{t('README, “Do you need memsaga?”')}</A>
      </p>
    </Content>
  );

  const Rule = ({ name, children }: { name: ReactNode; children: ReactNode }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 29, fontWeight: 800 }}>{name}</div>
      <div style={{ fontSize: 26, color: muted, marginTop: 4, lineHeight: 1.4 }}>{children}</div>
    </div>
  );

  // Panel question 2 (second half): how do you review the memory and CLAUDE.md Claude rewrites,
  // and what goes into CLAUDE.md, memory and skills? The author's own rules of thumb.
  const PanelWhatGoesWhere: Page = () => (
    <Content eyebrow={t('Appendix · For the panel')} heading={t('What goes where, and how I review it')}>
      <div style={{ display: 'flex', gap: 40, marginTop: 40, alignItems: 'stretch' }}>
        <Card title={t('What goes where (my rule of thumb)')}>
          <div style={{ marginTop: 6 }}>
            <Rule name="CLAUDE.md">{t('Rules that must hold in every session. Keep it short: it is read every time.')}</Rule>
            <Rule name={t('Skills')}>{t('Steps for one kind of task, loaded only when needed.')}</Rule>
            <Rule name={t('Memory')}>{t('Facts about one project, and anything that changes or expires.')}</Rule>
            <Rule name={t('A hook (an automatic check)')}>{t('A rule a script can check. Do not add more text for it.')}</Rule>
          </div>
        </Card>
        <Card title={t('How I review it')} strong>
          <div style={{ marginTop: 6 }}>
            <Item mark="1" color={teal}>{t('Claude Code edits memory and skills, then tells me. CLAUDE.md waits for my OK.')}</Item>
            <Item mark="2" color={teal}>{t('When something looks off, the history shows what changed, in which session, and lets me undo it.')}</Item>
            <Item mark="3" color={teal}>{t('For the why, Claude Code reads that session’s saved conversation (kept 30 days by default), so it can explain any change.')}</Item>
            <Item mark="4" color={teal}>{t('Now and then, a tidy-up session: merge duplicates, delete stale notes.')}</Item>
          </div>
        </Card>
      </div>
    </Content>
  );

  // Panel question 9 (second half): sharing skills and settings across a team or several machines.
  // Team options per Anthropic's docs, 2026-11-28 (code.claude.com skills, memory, managed-settings;
  // claude.com/docs plugins and skills).
  // A bullet with a bold lead-in, so each point can be found at a glance.
  const Pt = ({ lead, children }: { lead: ReactNode; children: ReactNode }) => (
    <div style={{ display: 'flex', gap: 12, marginTop: 14, fontSize: 27, lineHeight: 1.4 }}>
      <span style={{ color: teal, fontWeight: 800 }}>•</span>
      <div>
        <b>{lead}</b> <span style={{ color: muted }}>{children}</span>
      </div>
    </div>
  );

  const NumTitle = ({ n, children }: { n: string; children: ReactNode }) => (
    <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <Num n={n} color={teal} />
      {children}
    </span>
  );

  const PanelSharing: Page = () => (
    <Content eyebrow={t('Appendix · For the panel')} heading={t('Sharing skills and settings')}>
      <div style={{ display: 'flex', gap: 30, marginTop: 40, alignItems: 'stretch' }}>
        <Card title={<NumTitle n="1">{t('My computers')}</NumTitle>}>
          <Pt lead={t('One private repository')}>{t('on GitHub holds the history.')}</Pt>
          <Pt lead={t('Another Mac:')}>{t('copy it once, run one restore command, and CLAUDE.md, skills and memory are back.')}</Pt>
          <Pt lead={t('From a phone:')}>{t('an edit on GitHub comes back to the file Claude Code reads.')}</Pt>
        </Card>
        <Card title={<NumTitle n="2">{t('My two accounts')}</NumTitle>}>
          <Pt lead={t('Shared files:')}>{t(<>two Claude Code accounts on one Mac use one CLAUDE.md, skills and memory; my Mac app <A href={URL_CODEV}>CodeV</A> links them.</>)}</Pt>
          <Pt lead={t('One history:')}>{t('memsaga records both and labels each change with its account.')}</Pt>
        </Card>
        <Card title={<NumTitle n="3">{t('A team')}</NumTitle>}>
          <Pt lead={t('In the project:')}>{t('CLAUDE.md (or AGENTS.md) and skills in the repository; everyone’s Claude Code reads them.')}</Pt>
          <Pt lead={t('Claude app (Team, Enterprise):')}>{t('publish a skill to the organisation.')}</Pt>
          <Pt lead={t('Plugins:')}>{t('an owner can install one for everyone.')}</Pt>
        </Card>
      </div>
    </Content>
  );

  const Stat = ({ n, label }: { n: string; label: ReactNode }) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>{n}</div>
      <div style={{ fontSize: 30, color: muted, marginTop: 14 }}>{label}</div>
    </div>
  );

  const Numbers: Page = () => (
    <Content eyebrow={t('Appendix · Two months of my own data')} heading={t('Too many changes to follow from memory')}>
      <div style={{ display: 'flex', gap: 60, marginTop: 64 }}>
        <Stat n="25" label={t('sessions changed CLAUDE.md')} />
        <Stat n="57" label={t('sessions changed skills')} />
        <Stat n="136" label={t('sessions changed memory')} />
      </div>
      <div style={{ marginTop: 64 }}>
        <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1, color: 'var(--osd-accent)' }}>~12</div>
        <div style={{ fontSize: 30, color: muted, marginTop: 14 }}>{t('times “when and why did this change?” was answered from the history')}</div>
      </div>
      <p style={{ fontSize: 25, color: muted, margin: '40px 0 0' }}>
        {t('Since 20 Sep 2026. On the first day, 502 earlier records (July to September) were rebuilt from Claude Code’s saved conversations.')}
      </p>
    </Content>
  );

  const Extra = ({ icon, qr, name, href, status, line, children }: { icon: string; qr: string; name: string; href: string; status: ReactNode; line: ReactNode; children?: ReactNode }) => (
    <div style={{ display: 'flex', gap: 40, marginTop: 44, alignItems: 'flex-start' }}>
      <img src={icon} alt={`${name} icon`} style={{ width: 120, height: 120, borderRadius: 24, flex: 'none' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 48, fontWeight: 800 }}>
          <A href={href}>{name}</A> <span style={{ fontSize: 28, color: muted, fontWeight: 500, fontFamily: mono }}>{status}</span>
        </div>
        <div style={{ fontSize: 30, color: muted, marginTop: 10, lineHeight: 1.4 }}>{line}</div>
        {children}
      </div>
      <img src={qr} alt={`QR code for ${href}`} style={{ width: 200, height: 200, imageRendering: 'pixelated' }} />
    </div>
  );

  const OneMoreThing: Page = () => (
    <Content eyebrow={t('Appendix · Two more side projects')} heading={t('Also free and open source')}>
      <Extra
        icon={matchapackIcon}
        qr={matchapackQr}
        name="matchapack"
        href={URL_MATCHAPACK}
        status={t('first released 2026-11-24')}
        line={t('Each extra git worktree’s node_modules costs almost no disk: savings like pnpm’s, but the exact tree plain npm or Yarn 1 builds.')}
      >
        <div style={{ fontSize: 25, color: muted, marginTop: 8 }}>
          {t('Measured, 10 worktrees: 20.68 GiB with plain npm → 61 MiB + one 1.82 GiB store')} · <Code>brew install grimmerk/tap/matchapack</Code>
        </div>
      </Extra>
      <Extra
        icon={codevIcon}
        qr={codevQr}
        name="CodeV"
        href={URL_CODEV}
        status="macOS"
        line={t('A Mac app for Claude Code: session switcher, project launcher, built-in terminal, and several accounts sharing one CLAUDE.md, skills and memory.')}
      />
    </Content>
  );

  const pages: Page[] = [
    Cover,
    Remembers,
    Where,
    Problem,
    WhatIDo,
    Story,
    Changed,
    Close,
    Surfaces,
    ProjectFiles,
    WhatGoesIn,
    OneRecord,
    NeedIt,
    PanelWhatGoesWhere,
    PanelSharing,
    Numbers,
    OneMoreThing,
  ];

  // The talk script, in simple English (the venue plans an app for live machine interpretation:
  // short sentences, one idea each). About 500 words for the eight main pages: 4 to 4.5 minutes at 110-120 words a minute; page 3 is the first cut.
  const notes: (string | undefined)[] = [
    `~15s. Say the first lines in Japanese, slowly:
はじめまして。台湾から来た Grimmer です。
(Hajimemashite. Taiwan kara kita Grimmer desu.)
英語で話しますが、スライドは日本語です。
(Eigo de hanashimasu ga, suraido wa nihongo desu.)
よろしくお願いします。
(Yoroshiku onegaishimasu.)
Then in English: Today I will share how I learned to let Claude Code clean up its own memory.`,
    `~35s.
First, how does Claude Code remember?
Claude Code is Claude working on your computer.
A session is one conversation with it.
Each session starts fresh. So Claude Code keeps notes in files.
For example, on Monday I say: "Remember, start the database before the tests."
Claude Code writes that into its auto memory.
On Tuesday, a new session reads it first.
There are three kinds of files.
CLAUDE.md: standing instructions.
Auto memory: notes Claude Code writes on its own.
Skills: how-to guides for one kind of task.`,
    `~25s. (Short on time: say only the lines marked *.)
* Where are these files kept?
The Claude app keeps its own, with your account.
Claude Code keeps two kinds of files.
Project files live in the project's repository, so Git keeps their history.
* Your own files live in a hidden folder. Nothing keeps their history.
* That is today's topic.`,
    `~35s.
Here is the problem.
Claude Code changes these files every day, with no history.
It is like a shared document with no version history.
Three things happen.
You forget what was tried, and try it again.
A bad edit cannot be undone.
And when a new rule appears, you cannot tell when, or why.
So I rarely let Claude Code touch a skill.
And I never asked it to clean up its memory.`,
    `~35s.
So I wrote a small tool, memsaga.
Git keeps the history of files. Each saved change is a commit, with a short message.
When Claude Code changes one of these files, memsaga makes a commit.
The message is the name of the session.
A bonus: these files leave a hidden folder full of logs.
Now I can browse them, even on my phone.
Claude Code works as before.`,
    `~40s.
A real case.
I found a rule in my CLAUDE.md: "Run the tests before every push."
I did not remember writing it.
So I asked Claude Code: did you add this yourself?
It checked the history: the time, and the session.
It read that session's saved conversation.
Yes, it added the rule, and it told me in its reply. I had missed it.
Now my rule is simple.
Memory and skills: Claude Code edits them and tells me.
CLAUDE.md: it waits for my OK.`,
    `~35s.
What changed?
Undo took away the fear.
Now Claude Code cleans up its memory. About 90 files are gone, and every one can come back.
One skill changed 70 times in two months, each change with its session.
Even my tool broke files, twice. The history undid both.
It is a seatbelt. I rarely need it, but I drive differently because it is there.`,
    `~20s.
Today's theme is systems that don't break when you hand work to Claude.
Mine is simple. I can see every change, and undo any change. So I can hand the work over.
You don't need my tool for this. Any Git history of these files helps.
Thank you.
ありがとうございました。
(Arigatou gozaimashita.)`,
    `Appendix, for the panel and questions. Which Claude reads which place.`,
    `Appendix, for questions only. Project files versus your own files, as folders.`,
    `Appendix, for questions only. What memsaga keeps, next to ~/.claude.`,
    `Appendix, for questions only. One commit, with its trailers.`,
    `Appendix, for questions only.`,
    `Appendix, for panel question 2: reviewing memory and CLAUDE.md; what goes where.`,
    `Appendix, for panel question 9: sharing skills and settings across machines and a team.`,
    `Appendix, for questions only.`,
    `Appendix, not presented: other side projects, for people browsing the slides later.`,
  ];

  return { design, pages, notes };
}
