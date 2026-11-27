import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';
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
      <p style={{ fontSize: 44, color: muted, margin: 0, lineHeight: 1.4 }}>{t('Git history for CLAUDE.md, memory and skills')}</p>
      <p style={{ fontSize: 30, color: muted, margin: '72px 0 0', fontFamily: mono }}>
        Grimmer · Tech Lead, <A href="https://fireflies.ai">Fireflies.ai</A> · {t('from Taiwan')} · <A href={URL_ME}>github.com/grimmerk</A>
      </p>
      <div style={{ position: 'absolute', right: PAD, top: 96, textAlign: 'center' }}>
        <img src={slidesQr} alt={`QR code for ${slidesUrl}`} style={{ width: 190, height: 190, imageRendering: 'pixelated' }} />
        <div style={{ fontSize: 22, color: muted, fontFamily: mono, marginTop: 10 }}>{slidesUrl.replace('https://', '')}</div>
      </div>
    </div>
  );

  // ---------- 2. how Claude Code remembers ----------

  const Bubble = ({ who, children, claude }: { who: ReactNode; children: ReactNode; claude?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: claude ? 'flex-start' : 'flex-end' }}>
      <div style={{ fontSize: 21, color: soft, marginBottom: 4 }}>{who}</div>
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

  const Remembers: Page = () => (
    <Content eyebrow={t('How Claude Code remembers')} heading={t('Every session starts fresh, so Claude keeps notes in files')} headingSize={62}>
      <div style={{ marginTop: 18 }}>
        <Gloss term={t('session')}>{t('one conversation with Claude Code')}</Gloss>
      </div>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', marginTop: 26 }}>
        <div style={{ width: 620, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 22, color: muted, fontWeight: 700 }}>{t('Monday')}</div>
          <Bubble who={t('You')}>{t('“Remember: the API tests need a local Redis.”')}</Bubble>
          <Bubble who="Claude" claude>
            {t('Saved to memory.')}
          </Bubble>
        </div>
        <div style={{ fontSize: 40, color: muted }}>→</div>
        <div style={{ width: 330, background: '#fff', border: `2px solid ${teal}`, borderRadius: 14, padding: '18px 22px' }}>
          <div style={{ fontFamily: mono, fontSize: 22, color: teal, fontWeight: 700 }}>memory/testing.md</div>
          <div style={{ fontSize: 23, marginTop: 8, lineHeight: 1.4 }}>{t('API tests need a local Redis.')}</div>
        </div>
        <div style={{ fontSize: 40, color: muted }}>→</div>
        <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 22, color: muted, fontWeight: 700 }}>{t('Tuesday, a new session')}</div>
          <Bubble who="Claude" claude>
            {t('(reads its notes first) Starting Redis, then running the tests.')}
          </Bubble>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 28, marginTop: 40 }}>
        <Card title="CLAUDE.md" sub={t('Standing instructions')}>
          {t('Read at the start of every session. You write it; Claude edits it too.')}
        </Card>
        <Card title={t('Memory')} sub={t('Notes')}>
          {t('Claude writes them as it works, or when you say “remember”.')}
        </Card>
        <Card title={t('Skills')} sub={t('How-to guides')}>
          {t('Steps for one kind of task, loaded when the task comes up.')}
        </Card>
      </div>
    </Content>
  );

  // ---------- 3. where memory can live ----------

  const Where: Page = () => (
    <Content eyebrow={t('Where Claude’s memory can live')} heading={t('Three places. Today is about the files on your computer.')} headingSize={62}>
      <div style={{ display: 'flex', gap: 30, marginTop: 52, alignItems: 'stretch' }}>
        <Card title={t('In your claude.ai account')} sub={t('Claude chat and Projects')}>
          <div>{t('Instructions, memory and skills you add.')}</div>
          <div style={{ color: muted, marginTop: 10 }}>{t('Kept on Anthropic’s side; you view and edit them in Settings.')}</div>
        </Card>
        <Card title={t('Your own system')} sub={t('like the talk you just heard')}>
          <div>{t('Markdown files and Git, organised your way.')}</div>
          <div style={{ color: muted, marginTop: 10 }}>{t('You design the rules and the folders.')}</div>
        </Card>
        <Card title={t('Files on your computer')} sub={t('Claude Code: in a terminal, or the Code tab of the Claude desktop app')} strong>
          <div>
            <b>CLAUDE.md · {t('memory')} · {t('skills')}</b>
          </div>
          <div style={{ color: muted, marginTop: 10 }}>{t('Plain text files that Claude Code reads, and rewrites by itself.')}</div>
        </Card>
      </div>
      <p style={{ fontSize: 24, color: soft, margin: '30px 0 0' }}>{t('Cowork and scheduled tasks: see the appendix.')}</p>
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
    <Content eyebrow={t('The problem')} heading={t('Claude edits these files every day, and keeps no history')} headingSize={62}>
      <p style={{ fontSize: 34, lineHeight: 1.45, margin: '28px 0 0', maxWidth: 1600 }}>
        {t('It is like a shared document with no version history: it keeps changing, and you cannot see what changed.')}
      </p>
      <div style={{ display: 'flex', gap: 26, marginTop: 40 }}>
        <Pain n="1" head={t('You forget what was tried')} body={t('An idea was tried last week and dropped. Nobody remembers, so it is tried again.')} />
        <Pain n="2" head={t('A bad edit cannot be undone')} body={t('The old version is simply gone.')} />
        <Pain n="3" head={t('You cannot tell why')} body={t('A new rule appears. Who added it, and for what?')} />
      </div>
      <p style={{ fontSize: 38, fontWeight: 700, margin: '50px 0 0', color: 'var(--osd-accent)' }}>
        {t('So I rarely let Claude touch a skill, and never asked it to clean up its memory.')}
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
        <Gloss term={t('commit')}>{t('one saved change, a record in that history')}</Gloss>
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
        </div>
      </div>
      <p style={{ fontSize: 27, color: muted, margin: '26px 0 0' }}>
        {t(<>The tool is <b style={{ color: 'var(--osd-text)' }}>memsaga</b>, free and open source. Claude works as before; the files stay where they are.</>)}
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
    <Content eyebrow={t('A real case')} heading={t('“Did you add this rule yourself?”')} headingSize={66}>
      <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
        <FlowBox label={t('A rule in my CLAUDE.md')} body={t('“Run the tests before every push.”')} />
        <Arrow />
        <FlowBox label={t('The record that added it')} body={<>{t('Tue 14:02')}<br />{t('session “fix flaky login test”')}</>} />
        <Arrow />
        <FlowBox label={t('Reopen that session')} body={t('Read why it was added')} accent />
      </div>
      <p style={{ fontSize: 33, lineHeight: 1.5, margin: '40px 0 0', maxWidth: 1620 }}>
        {t('I did not search myself. I asked Claude, and it looked it up in the history. Yes, it had added the rule, and it said so in its reply. I had missed that line.')}
      </p>
      <p style={{ fontSize: 33, lineHeight: 1.5, margin: '22px 0 0', fontWeight: 700 }}>
        {t('My rule since: memory and skills, Claude edits and tells me. CLAUDE.md waits for my OK.')}
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
    <Content eyebrow={t('What changed for me')} heading={t('Undo is what lets me hand the work over')} headingSize={66}>
      <div style={{ display: 'flex', gap: 60, marginTop: 56 }}>
        <Big n="~90" head={t('files removed in Claude’s cleanups')} body={t('Duplicate and stale notes. Every one can come back.')} />
        <Big n="70" head={t('changes to one skill in two months')} body={t('Each with the session that made it. A skill gets better one small change at a time.')} />
        <Big n="2" head={t('times the tool itself broke files')} body={t('A sync bug, twice. Each time, the history undid it.')} />
      </div>
      <p style={{ fontSize: 38, lineHeight: 1.45, margin: '64px 0 0', fontWeight: 700 }}>
        {t('Like a seatbelt: I rarely need it, but I drive differently because it is there.')}
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

  const Cell = ({ children, head, strong }: { children: ReactNode; head?: boolean; strong?: boolean }) => (
    <div
      style={{
        padding: '12px 18px',
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

  // Checked against Anthropic's docs on 2026-11-28 (support.claude.com chat memory, skills and
  // projects articles; code.claude.com desktop, skills, memory, routines and scheduled-tasks pages;
  // claude.com/docs/cowork). "Not documented" means the page is silent.
  const Surfaces: Page = () => (
    <Content eyebrow={t('Appendix · Which Claude reads which files')} heading={t('Only Claude Code on your computer uses these files')} headingSize={54}>
      <div style={{ display: 'grid', gridTemplateColumns: '430px 300px 900px', fontSize: 24, border: `1px solid ${rule}`, borderRadius: 'var(--osd-radius)', overflow: 'hidden', width: 1630, marginTop: 34 }}>
        <Cell head>{t('Where you use Claude')}</Cell>
        <Cell head>{t('Runs on')}</Cell>
        <Cell head>{t('Instructions, memory, skills')}</Cell>
        <Cell>{t('Claude chat, Projects (web, desktop, phone)')}</Cell>
        <Cell>{t('Anthropic')}</Cell>
        <Cell>{t('Its own, kept in your account; not these files')}</Cell>
        <Cell>{t('Cowork (desktop app)')}</Cell>
        <Cell>{t('your computer')}</Cell>
        <Cell>{t('Its own project instructions and memory, plus your account’s skills; it does not read ~/.claude')}</Cell>
        <Cell>{t('Scheduled tasks in the cloud')}</Cell>
        <Cell>{t('Anthropic')}</Cell>
        <Cell>{t('A fresh copy of your repository, plus your account’s skills; no auto memory')}</Cell>
        <Cell strong>{t('Claude Code: terminal, or the desktop app’s Code tab')}</Cell>
        <Cell strong>{t('your computer')}</Cell>
        <Cell strong>{t('CLAUDE.md, memory and skills in ~/.claude: the files memsaga keeps')}</Cell>
      </div>
      <p style={{ fontSize: 23, color: muted, margin: '18px 0 0', lineHeight: 1.45 }}>
        {t('From Anthropic’s docs, 28 Nov 2026. The desktop Code tab is documented to load ~/.claude/skills; that it also reads CLAUDE.md and memory when a folder is chosen is my own test. Skills added to your claude.ai account are also copied into Claude Code.')}
      </p>
    </Content>
  );

  const Item = ({ mark, children, color }: { mark: string; children: ReactNode; color: string }) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
      <Num n={mark} color={color} />
      <div style={{ fontSize: 27, lineHeight: 1.45, paddingTop: 6 }}>{children}</div>
    </div>
  );

  const NeedIt: Page = () => (
    <Content eyebrow={t('Appendix · Do you need memsaga?')} heading={t('Maybe not')}>
      <div style={{ display: 'flex', gap: 40, marginTop: 40, alignItems: 'stretch' }}>
        <Card title={t('You may not need it, if…')}>
          <Item mark="1" color={muted}>
            {t(<>One account on one computer: put <Code>~/.claude</Code> in Git yourself, keep only the files you want, and commit at the end of each session.</>)}
          </Item>
          <Item mark="2" color={muted}>
            {t('You keep your memory in your own folder, outside Claude Code’s files (like the previous talk).')}
          </Item>
          <Item mark="3" color={muted}>
            {t(<>You are on Windows: <A href={URL_ENGRAM}>Engram</A> is a similar tool.</>)}
          </Item>
        </Card>
        <Card title={t('What memsaga adds')} strong>
          <Item mark="A" color={teal}>{t('Which session made each change')}</Item>
          <Item mark="B" color={teal}>{t('History kept apart from the live files')}</Item>
          <Item mark="C" color={teal}>{t('Several accounts and computers; edits from GitHub or a phone come back')}</Item>
          <Item mark="D" color={teal}>{t('History from before you installed it, rebuilt from saved sessions')}</Item>
        </Card>
      </div>
      <p style={{ fontSize: 25, color: muted, margin: '26px 0 0' }}>
        {t('The full comparison:')} <A href={URL_NEED}>{t('README, “Do you need memsaga?”')}</A>
      </p>
    </Content>
  );

  const Place = ({ title, sub, strong }: { title: ReactNode; sub: ReactNode; strong?: boolean }) => (
    <div
      style={{
        width: 380,
        padding: '28px 30px',
        boxSizing: 'border-box',
        borderRadius: 'var(--osd-radius)',
        border: `2px solid ${strong ? teal : rule}`,
        background: strong ? '#e6f1ee' : panel,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 38, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 25, color: muted, marginTop: 10 }}>{sub}</div>
    </div>
  );

  const Machines: Page = () => (
    <Content eyebrow={t('Appendix · More than one computer')} heading={t('One history, on every computer')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 64 }}>
        <Place title={t('My Mac')} sub={t('a record every turn')} />
        <div style={{ fontSize: 48, color: muted }}>⇄</div>
        <Place title="GitHub" sub={t('a private repository')} strong />
        <div style={{ fontSize: 48, color: muted }}>⇄</div>
        <Place title={t('Backup Mac')} sub={t('one copy, then restore')} />
      </div>
      <ul style={{ fontSize: 31, lineHeight: 1.5, margin: '56px 0 0', paddingLeft: 40, maxWidth: 1600 }}>
        <li>{t('Setting up my backup Mac: copy the repository, run one restore command, and its CLAUDE.md, skills and memory were back.')}</li>
        <li>{t('An edit made on GitHub, even from a phone, comes back to the file Claude reads.')}</li>
        <li>{t('Two Claude accounts on one Mac: both are recorded, each change labelled with its account.')}</li>
      </ul>
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
        <div style={{ fontSize: 30, color: muted, marginTop: 14 }}>{t('times “who changed this, and why?” was answered from the history')}</div>
      </div>
      <p style={{ fontSize: 25, color: muted, margin: '40px 0 0' }}>
        {t('Since 20 Sep 2026. On the first day, 502 earlier records (July to September) were rebuilt from Claude Code’s saved sessions.')}
      </p>
    </Content>
  );

  const pages: Page[] = [Cover, Remembers, Where, Problem, WhatIDo, Story, Changed, Close, Surfaces, NeedIt, Machines, Numbers];

  // The talk script, in simple English (the venue runs live machine interpretation into Japanese:
  // short sentences, one idea each). About 480 words for the eight main pages, roughly four minutes.
  const notes: (string | undefined)[] = [
    `~15s.
はじめまして。台湾から来た Grimmer です。よろしくお願いします。
I will speak in English. The slides are in Japanese.
Today I will share how I learned to let Claude clean up its own memory.`,
    `~35s.
First, how does Claude Code remember things?
A session is one conversation with Claude Code.
Every new session starts fresh. Claude does not remember yesterday.
So Claude keeps notes in plain text files on my computer.
For example, I say: "Remember, the API tests need a local Redis."
Claude writes it into a memory file. The next day, it reads that note first.
There are three kinds of files.
CLAUDE.md: standing instructions, read at the start of every session.
Memory: notes Claude writes as it works.
Skills: how-to guides for one kind of task.`,
    `~25s. (Short on time: say only the first and last sentences.)
Where can this memory live? In three places.
In your claude.ai account, for Claude chat.
In your own system, like the talk you just heard: Markdown files and Git.
Or in Claude Code's own files on your computer.
Today is about the third one: the files Claude Code reads, and rewrites by itself.`,
    `~40s.
Here is the problem.
Claude changes these files every day. But nothing keeps a history.
It is like a shared document with no version history.
So three things happen.
One: you forget what was tried. An idea was dropped last week, and it comes back again.
Two: a bad edit cannot be undone. The old version is gone.
Three: you cannot tell why. A new rule appears, and you do not know who added it, or for what.
Because of this, I rarely let Claude touch a skill. And I never asked it to clean up its memory.`,
    `~35s.
So now, every change becomes a record.
Git is a tool that keeps the history of files. One record is called a commit.
I wrote a small tool, memsaga. When Claude changes one of these files, memsaga saves a commit.
Each commit carries the name of the session that made the change.
There is also a quiet benefit.
These files used to hide in a folder full of logs.
Now they are in one place I can browse, even on my phone.
Claude works as before. The files stay where they are.`,
    `~40s.
Here is a real case.
I found a rule in my CLAUDE.md: "Run the tests before every push."
I did not remember writing it.
So I asked Claude: did you add this rule yourself?
Claude looked it up in the history. The record showed the time and the session.
I reopened that session.
Yes, Claude added it, and it said so in its reply. I had missed that line.
Since then, I have a simple rule.
Memory and skills: Claude can edit them, and tells me.
CLAUDE.md: Claude waits for my OK.`,
    `~40s.
What changed for me?
Now I let Claude clean up its memory.
About 90 files were removed in these cleanups. Every one can come back.
One of my skills changed 70 times in two months. I can see each change, and the session behind it.
And the tool itself made mistakes. Twice, a sync bug broke some files. Both times, the history undid it.
I think of it as a seatbelt.
I rarely need it. But I drive differently because it is there.`,
    `~20s.
So this is my answer to today's theme: systems that don't break when you hand work to Claude.
I can see every change. I can undo any change. So I can hand the work over.
You do not need my tool for this. Any Git history of these files helps.
Mine is free and open source.
Thank you. ありがとうございました。`,
    `Appendix, for the panel. Which Claude reads which files.`,
    `Appendix, for questions only.`,
    `Appendix, for the panel (sharing settings across machines).`,
    `Appendix, for questions only.`,
  ];

  return { design, pages, notes };
}
