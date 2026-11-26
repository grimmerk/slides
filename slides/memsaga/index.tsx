import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';
import codevIcon from './assets/codev-icon.png';
import codevQr from './assets/codev-qr.svg';
import matchapackIcon from './assets/matchapack-icon.png';
import matchapackQr from './assets/matchapack-qr.svg';
import qr from './assets/memsaga-qr.svg';
import slidesQr from './assets/slides-qr.svg';

// memsaga talk, English master deck (Taipei 2026-11-26; the Japanese deck is translated from this).
// Every number on these pages was measured on 2026-11-24 from the author's own data repository
// (commits since 2026-09-20) and session transcripts; the method lives outside this repo.
// Facts about memsaga are from its README ("Do you need memsaga?", "Timing") and docs/faq.md.

export const design: DesignSystem = {
  palette: { bg: '#fbfaf7', text: '#1a1814', accent: '#b0641c' },
  fonts: {
    display: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang TC", "Hiragino Sans", system-ui, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang TC", "Hiragino Sans", system-ui, sans-serif',
  },
  typeScale: { hero: 112, body: 40 },
  radius: 16,
};

const muted = '#6b645a';
const teal = '#1f7a6d';
const panel = '#f1ede4';
const rule = '#e2dccf';
const mono = '"SF Mono", ui-monospace, Menlo, Consolas, monospace';
const PAD = 140;

const URL_SITE = 'https://memsaga.grimmer.io';
const URL_REPO = 'https://github.com/grimmerk/memsaga';
const URL_NEED = `${URL_REPO}#do-you-need-memsaga`;
const URL_FAQ_SPEED = `${URL_REPO}/blob/main/docs/faq.md#does-it-slow-claude-code-down`;
const URL_TIMING = `${URL_REPO}#timing`;
const URL_BUG = `${URL_REPO}/pull/28`;
const URL_V016 = `${URL_REPO}/releases/tag/v0.1.6`;
const URL_TWO_WAY = `${URL_REPO}/blob/main/docs/two-way-sync.md`;
const URL_SECRETS = `${URL_REPO}/blob/main/docs/faq.md#what-if-claude-writes-an-api-key-into-a-memory-file`;
const URL_INSTALL = `${URL_REPO}#quick-start`;
const URL_REV_NEWS = 'https://git.github.io/rev_news/2026/10/31/edition-140/';
const URL_ENGRAM = 'https://github.com/Sen-CaPoo/engram';
const URL_OTHER_TOOLS = `${URL_REPO}/blob/main/docs/design.md#31-open-source-two-rounds-of-search-github-in-all-languages-plus-the-web`;
const URL_MATCHAPACK = 'https://github.com/grimmerk/matchapack';
const URL_MATCHAPACK_INSTALL = `${URL_MATCHAPACK}#install`;
const URL_CODEV = 'https://github.com/grimmerk/codev';
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
      <span>memsaga · Grimmer Kang</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 26, letterSpacing: '0.18em', color: 'var(--osd-accent)', fontWeight: 600, textTransform: 'uppercase' }}>
    {children}
  </div>
);

const Heading = ({ children, size = 72 }: { children: ReactNode; size?: number }) => (
  <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: size, fontWeight: 800, lineHeight: 1.15, margin: '24px 0 0', letterSpacing: '-0.01em' }}>
    {children}
  </h2>
);

const Content = ({ children, eyebrow, heading, headingSize }: { children?: ReactNode; eyebrow: string; heading: ReactNode; headingSize?: number }) => (
  <div style={{ ...fill, padding: `120px ${PAD}px 0` }}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <Heading size={headingSize}>{heading}</Heading>
    {children}
    <Footer />
  </div>
);

// A video that plays only while its page is on screen. Opt-in: pass no src and the
// fallback (a static picture) is shown instead, so a missing clip never leaves a hole.
const Clip = ({ src, width, height, fallback }: { src?: string; width: number; height: number; fallback: ReactNode }) => {
  const active = useIsActivePage();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);
  if (!src) return <>{fallback}</>;
  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      controls
      style={{ width, height, background: '#000', borderRadius: 'var(--osd-radius)' }}
    />
  );
};

// ---------- pages ----------

const Cover: Page = () => (
  <div style={{ ...fill, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `0 ${PAD}px` }}>
    <Eyebrow>memsaga</Eyebrow>
    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 800,
        lineHeight: 1.08,
        letterSpacing: '-0.02em',
        margin: '36px 0 40px',
      }}
    >
      Git history for
      <br />
      <span style={{ color: 'var(--osd-accent)' }}>CLAUDE.md, memory and skills</span>
    </h1>
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, margin: 0, lineHeight: 1.5 }}>
      Every change, committed at the end of a Claude Code turn and named after that session.
      <br />
      Hooks and subagents by default; any other file you choose, even outside ~/.claude.
    </p>
    <p style={{ fontSize: 30, color: muted, margin: '64px 0 0', fontFamily: mono }}>
      Grimmer Kang · Tech Lead, <A href="https://fireflies.ai">Fireflies.ai</A> · <A href={URL_ME}>github.com/grimmerk</A>
    </p>
    <p style={{ fontSize: 26, color: muted, margin: '14px 0 0' }}>
      memsaga is a personal open-source project: <A href={URL_SITE}>memsaga.grimmer.io</A>
    </p>
    {/* These slides, for anyone who wants to follow on a phone. */}
    <div style={{ position: 'absolute', right: PAD, bottom: 96, textAlign: 'center' }}>
      <img src={slidesQr} alt="QR code for slides.grimmer.io/s/memsaga" style={{ width: 200, height: 200, imageRendering: 'pixelated' }} />
      <div style={{ fontSize: 22, color: muted, fontFamily: mono, marginTop: 10 }}>slides.grimmer.io/s/memsaga</div>
    </div>
  </div>
);

// A role first, the file's name second: the cover already names the three files.
const Role = ({ role, name, body }: { role: string; name: string; body: string }) => (
  <div style={{ flex: 1, background: panel, border: `1px solid ${rule}`, borderRadius: 'var(--osd-radius)', padding: '26px 30px' }}>
    <div style={{ fontSize: 34, fontWeight: 800 }}>{role}</div>
    <div style={{ fontSize: 28, fontFamily: mono, color: 'var(--osd-accent)', marginTop: 8 }}>{name}</div>
    <div style={{ fontSize: 26, color: muted, marginTop: 10, lineHeight: 1.4 }}>{body}</div>
  </div>
);

const Problem: Page = () => (
  <Content eyebrow="The problem" heading="Claude edits these files by itself, every day">
    <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
      <Role role="Its standing instructions" name="CLAUDE.md" body="Read at the start of every session." />
      <Role role="What it remembers" name="auto memory" body="Notes it writes as it works, or when you ask it to remember." />
      <Role role="How it does a task" name="skills" body="Instructions it loads when a task needs them." />
    </div>
    <p style={{ fontSize: 46, lineHeight: 1.35, margin: '56px 0 0' }}>
      What did it change? When? <span style={{ color: 'var(--osd-accent)' }}>In which session?</span>
    </p>
    <p style={{ fontSize: 34, lineHeight: 1.5, color: muted, margin: '28px 0 0', maxWidth: 1560 }}>
      I couldn't tell, so I rarely let Claude touch a skill, and never asked it to clean up its memory.
    </p>
  </Content>
);

const Line = ({ children, color, bold }: { children: ReactNode; color?: string; bold?: boolean }) => (
  <div style={{ color: color ?? muted, fontWeight: bold ? 700 : 400, whiteSpace: 'pre' }}>{children}</div>
);

const HowItWorks: Page = () => (
  <Content eyebrow="What memsaga does" heading={<>Every turn that changes something becomes<br />one commit, named after the session</>} headingSize={60}>
    <div
      style={{
        marginTop: 44,
        background: panel,
        border: `1px solid ${rule}`,
        borderRadius: 'var(--osd-radius)',
        padding: '28px 44px',
        fontFamily: mono,
        fontSize: 26,
        lineHeight: 1.45,
        width: 1240,
      }}
    >
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
    <p style={{ fontSize: 34, margin: '30px 0 0' }}>
      It keeps history; it does not take over. Your files stay where they are.
    </p>
    <p style={{ fontSize: 26, color: muted, margin: '10px 0 0' }}>
      Claude Code hooks · one Rust binary · <A href={URL_FAQ_SPEED}>about 5 ms for most tool calls</A> · a private Git repository you own
    </p>
  </Content>
);

// One line of a file tree: kept lines in the text colour, the rest muted; an optional note on the right.
const T = ({ t, keep, note, dim }: { t: string; keep?: boolean; note?: string; dim?: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
    <span style={{ whiteSpace: 'pre', color: keep ? 'var(--osd-text)' : dim ? '#a39b8e' : muted, fontWeight: keep ? 700 : 400 }}>{t}</span>
    {note && <span style={{ color: keep ? teal : '#a39b8e', fontFamily: 'var(--osd-font-body)', fontSize: 21, whiteSpace: 'nowrap' }}>{note}</span>}
  </div>
);

const TreeBox = ({ title, sub, strong, children }: { title: ReactNode; sub: string; strong?: boolean; children: ReactNode }) => (
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

// ~/.claude as it is on disk, next to what memsaga keeps of it. Folder names are Claude Code's own; the
// project is a placeholder. Memory sits under a folder named after the encoded absolute path; the
// repository names it relative to home, and index.md maps it back to the real folder.
const WhatGoesIn: Page = () => (
  <Content eyebrow="What goes in" heading="A hidden, noisy folder becomes a repository you can browse" headingSize={56}>
    <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
      <TreeBox title="~/.claude" sub="hidden; about 60 entries, mostly caches and logs">
        <T t="CLAUDE.md" keep note="kept" />
        <T t="skills/  hooks/  scripts/" keep note="kept" />
        <T t="projects/" />
        <T t="  -Users-you-code-webapp/" />
        <T t="    memory/" keep note="kept" />
        <T t="      MEMORY.md  project-notes.md" keep />
        <T t="    3f46…e21.jsonl" note="transcript, not kept" />
        <T t="  -Users-you-Library-Application-…" />
        <T t="cache/  telemetry/  paste-cache/" dim />
        <T t="shell-snapshots/  session-env/" dim />
        <T t="file-history/  history.jsonl  …" dim note="not kept" />
      </TreeBox>
      <TreeBox title="memories/" sub="your data repository, private on GitHub" strong>
        <T t="index.md" keep note="~/code/webapp → HOME-code-webapp" />
        <T t="claude/" />
        <T t="  CLAUDE.md" keep />
        <T t="  skills/  hooks/  scripts/" keep />
        <T t="  memory/HOME-code-webapp/" keep />
        <T t="    MEMORY.md  project-notes.md" keep />
        <T t="  drafts/  mods/" keep note="folders you add" />
        <T t="claude-work/" keep note="a second account" />
        <T t="extra/home/" keep note="files outside ~/.claude" />
        <T t="companion/" keep note="your notes on other repos" />
      </TreeBox>
    </div>
  </Content>
);

const FlowBox = ({ label, body, accent }: { label: string; body: ReactNode; accent?: boolean }) => (
  <div
    style={{
      width: 350,
      height: 214,
      boxSizing: 'border-box',
      padding: '26px 28px',
      borderRadius: 'var(--osd-radius)',
      border: `2px solid ${accent ? 'var(--osd-accent)' : rule}`,
      background: accent ? '#fbefe2' : panel,
    }}
  >
    <div style={{ fontSize: 26, color: muted, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 27, lineHeight: 1.4, marginTop: 14, fontFamily: mono }}>{body}</div>
  </div>
);

const Arrow = () => <div style={{ fontSize: 44, color: muted, alignSelf: 'center' }}>→</div>;

const ProvenanceFlow = () => (
  <div style={{ display: 'flex', gap: 18, marginTop: 36 }}>
    <FlowBox label="A rule in CLAUDE.md" body="“Run the tests before every push.”" />
    <Arrow />
    <FlowBox label="git blame" body="a1b2c3d, Tue 14:02" />
    <Arrow />
    <FlowBox label="The commit" body={<>Session-Title: fix flaky login test</>} />
    <Arrow />
    <FlowBox label="Reopen that session" body={<>claude --resume 9e41f07c…</>} accent />
  </div>
);

const Question = ({ q, note }: { q: string; note: string }) => (
  <li style={{ marginBottom: 12 }}>
    <span style={{ fontWeight: 700 }}>{q}</span>
    <span style={{ color: muted }}> — {note}</span>
  </li>
);

// The answer to page 2's three questions: one worked example, then the other questions history answered.
const Answers: Page = () => (
  <Content eyebrow="Now I can tell" heading="“Did you add this rule on your own?”" headingSize={64}>
    {/* Opt-in clip: set src to the recorded clip A (assets/clip-provenance.mp4) when it exists. */}
    <Clip src={undefined} width={1440} height={420} fallback={<ProvenanceFlow />} />
    <p style={{ fontSize: 32, lineHeight: 1.45, margin: '30px 0 0' }}>
      I just asked Claude, and it looked this up in the history itself. It had added the rule, and said so in its reply. My rule since: skills and memory, Claude edits and tells me; CLAUDE.md waits for my yes.
    </p>
    <div style={{ fontSize: 28, color: muted, fontWeight: 600, margin: '34px 0 10px' }}>Other questions the history answered, for me and for other sessions:</div>
    <ul style={{ fontSize: 30, lineHeight: 1.4, margin: 0, paddingLeft: 40 }}>
      <Question q="“Which version of the skill did you load?”" note="last night's" />
      <Question q="“What did the other session just change?”" note="a shared skill, earlier that day" />
      <Question q="“Where did this file go?”" note="git log showed the new path, and the session that moved it" />
      <Question q="“Which session added this to-do?”" note="the commit names it; reopen it for the why" />
    </ul>
  </Content>
);

const Stat = ({ n, label, accent, wide, narrow }: { n: string; label: string; accent?: boolean; wide?: boolean; narrow?: boolean }) => (
  <div style={{ width: wide ? 1640 : narrow ? 500 : 760 }}>
    <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1, color: accent ? 'var(--osd-accent)' : 'var(--osd-text)', letterSpacing: '-0.02em' }}>{n}</div>
    <div style={{ fontSize: 34, color: muted, marginTop: 14 }}>{label}</div>
  </div>
);

const Numbers: Page = () => (
  <Content eyebrow="Two months of my own data" heading="What actually happened">
    <div style={{ display: 'grid', gridTemplateColumns: '500px 500px 500px', columnGap: 70, marginTop: 64 }}>
      <Stat n="25" label="sessions changed CLAUDE.md" narrow />
      <Stat n="57" label="sessions changed skills" narrow />
      <Stat n="136" label="sessions changed memory" narrow />
    </div>
    <p style={{ fontSize: 28, color: muted, margin: '20px 0 0' }}>
      And history started before memsaga did: on day one it rebuilt 502 commits (July to September) from Claude Code's saved sessions.
    </p>
    <div style={{ marginTop: 64 }}>
      <Stat n="~12" label="times “who changed this, and why?” was answered from the history" accent wide />
    </div>
  </Content>
);

const Place = ({ title, sub, strong }: { title: string; sub: string; strong?: boolean }) => (
  <div
    style={{
      width: 360,
      padding: '30px 32px',
      boxSizing: 'border-box',
      borderRadius: 'var(--osd-radius)',
      border: `2px solid ${strong ? teal : rule}`,
      background: strong ? '#e6f1ee' : panel,
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 40, fontWeight: 700 }}>{title}</div>
    <div style={{ fontSize: 26, color: muted, marginTop: 10, fontFamily: mono }}>{sub}</div>
  </div>
);

const SyncDiagram = () => (
  <div style={{ marginTop: 72 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
      <Place title="This Mac" sub="every turn" />
      <div style={{ fontSize: 48, color: muted }}>⇄</div>
      <Place title="GitHub" sub="private repo" strong />
      <div style={{ fontSize: 48, color: muted }}>⇄</div>
      <Place title="Backup Mac" sub="one clone" />
    </div>
    <div style={{ fontSize: 30, color: teal, marginTop: 28, marginLeft: 420, fontFamily: mono }}>↑ edit on the web or a phone — it comes back</div>
  </div>
);

const NotJustThisMachine: Page = () => (
  <Content eyebrow="Not just this machine" heading="Off-site backup, readable anywhere">
    {/* Opt-in clip: assets/sync-demo.mp4 is memsaga's recorded two-way sync demo. */}
    <Clip src={undefined} width={1440} height={560} fallback={<SyncDiagram />} />
    <p style={{ fontSize: 36, color: muted, margin: '56px 0 0', lineHeight: 1.45 }}>
      Setting up my backup Mac: clone the repository, run <span style={{ fontFamily: mono }}>memsaga restore --all</span>, and its CLAUDE.md, skills and memory were back.
    </p>
    <p style={{ fontSize: 36, margin: '24px 0 0', lineHeight: 1.45 }}>
      Not only memory: my drafts folder, my PR/to-do board and the Mod I wrote live in the same repository.
    </p>
  </Content>
);

const Lesson = ({ head, children }: { head: string; children: ReactNode }) => (
  <li style={{ marginBottom: 40 }}>
    <div style={{ fontWeight: 700 }}>{head}</div>
    <div style={{ color: muted, fontSize: 32, marginTop: 8, lineHeight: 1.45 }}>{children}</div>
  </li>
);

const Lessons: Page = () => (
  <Content eyebrow="What I learned" heading="Rollback is a seatbelt">
    <ul style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.35, margin: '52px 0 0', paddingLeft: 44, maxWidth: 1600 }}>
      <Lesson head="Undo is what makes a cleanup safe.">
        Now I let Claude reorganize its memory: about 90 files deleted so far, every one recoverable with <Code>memsaga restore &lt;file&gt; --at &lt;commit&gt;</Code>.
      </Lesson>
      <Lesson head="The tool made mistakes too; history undid them.">
        Twice a sync bug in memsaga itself damaged files; each was one undo, and both are fixed (<A href={URL_BUG}>v0.1.1</A>, <A href={URL_V016}>0.1.6</A>). The first showed up while I rehearsed a restore on a backup Mac: rehearse yours before you need it.
      </Lesson>
    </ul>
  </Content>
);

const INSTALL_PROMPT =
  'Install memsaga for me. Follow\nhttps://raw.githubusercontent.com/grimmerk/memsaga/main/INSTALL-WITH-CLAUDE.md\nand ask me before each step that changes my machine.';

// A code block with a GitHub-style copy button in its top-right corner. A <button> is exempt from
// open-slide's click-to-navigate, so clicking it in present mode copies without turning the page.
const CopyBlock = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
  };
  return (
    <div
      style={{
        position: 'relative',
        fontFamily: mono,
        fontSize: 23,
        lineHeight: 1.5,
        background: panel,
        border: `1px solid ${rule}`,
        borderRadius: 'var(--osd-radius)',
        padding: '20px 72px 20px 28px',
        whiteSpace: 'pre',
      }}
    >
      {text}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy'}
        title={copied ? 'Copied' : 'Copy'}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--osd-bg)',
          border: `1px solid ${rule}`,
          borderRadius: 8,
          color: copied ? teal : muted,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {copied ? (
          <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
            <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
          </svg>
        )}
      </button>
    </div>
  );
};

const Links: Page = () => (
  <div style={{ ...fill, padding: `120px ${PAD}px 0`, display: 'flex', gap: 80 }}>
    <div style={{ flex: 1 }}>
      <Eyebrow>Try it</Eyebrow>
      <Heading size={96}>
        <A href={URL_SITE}>memsaga.grimmer.io</A>
      </Heading>
      <div style={{ fontSize: 28, color: muted, fontWeight: 600, margin: '40px 0 10px' }}>Paste into Claude Code (it asks before each step):</div>
      <CopyBlock text={INSTALL_PROMPT} />
      <div style={{ fontSize: 28, color: muted, margin: '20px 0 0' }}>
        Or by hand: <Code>brew install grimmerk/tap/memsaga</Code>, then the <A href={URL_INSTALL}>Quick start</A>.
      </div>
      <div style={{ fontSize: 28, color: muted, margin: '12px 0 0' }}>
        Day to day: <Code>memsaga status</Code> · <Code>memsaga restore</Code> · <Code>memsaga sync</Code>, or just ask Claude.
      </div>
      <p style={{ fontSize: 26, color: muted, margin: '30px 0 0', lineHeight: 1.55 }}>
        Free and open source (MIT) · macOS and Linux · listed in <A href={URL_REV_NEWS}>Git Rev News #140</A>, the Git community's monthly newsletter
        <br />
        A file whose new lines look like an API key is <A href={URL_SECRETS}>held back, not committed</A> (0.1.5, a reader's question).
        <br />
        Bonus: companion docs (appendix).
        <br />
        These slides: <A href="https://slides.grimmer.io/s/memsaga">slides.grimmer.io/s/memsaga</A>
      </p>
    </div>
    <div style={{ width: 340, paddingTop: 40 }}>
      <img src={qr} alt="QR code for memsaga.grimmer.io" style={{ width: 340, height: 340, imageRendering: 'pixelated' }} />
      <a
        href={URL_REPO}
        target="_blank"
        rel="noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24, fontSize: 26, fontFamily: mono, color: muted, textDecoration: 'none' }}
      >
        <svg width="30" height="30" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
        </svg>
        grimmerk/memsaga
      </a>
    </div>
    <Footer />
  </div>
);

const Extra = ({ name, href, line, status, small }: { name: string; href: string; line: string; status: string; small?: boolean }) => (
  <div style={{ marginBottom: small ? 0 : 56 }}>
    <div style={{ fontSize: small ? 48 : 56, fontWeight: 800 }}>
      <A href={href}>{name}</A> <span style={{ fontSize: 28, color: muted, fontWeight: 500, fontFamily: mono }}>{status}</span>
    </div>
    <div style={{ fontSize: small ? 32 : 'var(--osd-size-body)', color: muted, marginTop: 10, lineHeight: 1.4 }}>{line}</div>
  </div>
);

const OneMoreThing: Page = () => (
  <Content eyebrow="One more thing" heading="Two more side projects">
    <div style={{ display: 'flex', gap: 40, marginTop: 44, alignItems: 'flex-start' }}>
      <img src={matchapackIcon} alt="matchapack icon" style={{ width: 120, height: 120, borderRadius: 24, flex: 'none' }} />
      <div style={{ flex: 1 }}>
        <Extra
          name="matchapack"
          href={URL_MATCHAPACK}
          line="Each extra git worktree's node_modules costs almost no disk: savings like pnpm's, but the exact tree plain npm or Yarn 1 builds."
          status="v0.1.0, released 2026-11-24"
          small
        />
        <div style={{ fontSize: 26, color: muted, marginTop: 10 }}>
          Measured, 10 worktrees: 20.68 GiB with plain npm → 61 MiB + one 1.82 GiB store ·{' '}
          <Code><A href={URL_MATCHAPACK_INSTALL}>brew install grimmerk/tap/matchapack</A></Code>
        </div>
      </div>
      <img src={matchapackQr} alt="QR code for github.com/grimmerk/matchapack" style={{ width: 220, height: 220, imageRendering: 'pixelated' }} />
    </div>
    <div style={{ display: 'flex', gap: 40, marginTop: 44, alignItems: 'flex-start' }}>
      <img src={codevIcon} alt="CodeV icon" style={{ width: 120, height: 120, flex: 'none' }} />
      <div style={{ flex: 1 }}>
        <Extra
          name="CodeV"
          href={URL_CODEV}
          line="A Mac app for Claude Code: session switcher, project launcher, built-in terminal, and several accounts sharing one CLAUDE.md, skills and memory."
          status="macOS"
          small
        />
      </div>
      <img src={codevQr} alt="QR code for github.com/grimmerk/codev" style={{ width: 220, height: 220, imageRendering: 'pixelated' }} />
    </div>
  </Content>
);

const Col = ({ title, children, strong }: { title: string; children: ReactNode; strong?: boolean }) => (
  <div
    style={{
      flex: 1,
      boxSizing: 'border-box',
      padding: '28px 32px',
      borderRadius: 'var(--osd-radius)',
      border: `2px solid ${strong ? teal : rule}`,
      background: strong ? '#e6f1ee' : panel,
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 800 }}>{title}</div>
    <div style={{ marginTop: 18 }}>{children}</div>
  </div>
);

const Item = ({ mark, children, color }: { mark: string; children: ReactNode; color: string }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 14 }}>
    <div
      style={{
        width: 38,
        height: 38,
        flex: 'none',
        borderRadius: 19,
        background: color,
        color: '#fff',
        fontSize: 22,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
      }}
    >
      {mark}
    </div>
    <div style={{ fontSize: 27, lineHeight: 1.45 }}>{children}</div>
  </div>
);

const m = (s: string) => <span style={{ fontFamily: mono, fontSize: 24 }}>{s}</span>;

const NeedIt: Page = () => (
  <Content eyebrow="Appendix · Do you need memsaga?" heading="Maybe not">
    <div style={{ display: 'flex', gap: 40, marginTop: 40, alignItems: 'stretch' }}>
      <Col title="You may not need it, if…">
        <Item mark="1" color={muted}>
          One account on one computer: {m('git init ~/.claude')}, an allowlist {m('.gitignore')} and a Stop hook that commits.
        </Item>
        <Item mark="2" color={muted}>
          You keep your own memory in a folder outside {m('~/.claude')} (say {m('~/notes')}), by an instruction or a skill, or with <A href={URL_OTHER_TOOLS}>another open-source memory tool</A>.
        </Item>
        <Item mark="3" color={muted}>
          You are on Windows: <A href={URL_ENGRAM}>Engram</A> is a similar tool.
        </Item>
      </Col>
      <Col title="What memsaga adds" strong>
        <Item mark="A" color={teal}>Which session made each change</Item>
        <Item mark="B" color={teal}>History kept away from the live files</Item>
        <Item mark="C" color={teal}>Several accounts and computers; edits from GitHub or a phone</Item>
        <Item mark="D" color={teal}>Any file you name, outside {m('~/.claude')} too</Item>
        <Item mark="E" color={teal}>History from before you started, rebuilt from saved sessions</Item>
        <Item mark="F" color={teal}>Companion docs (next page)</Item>
      </Col>
    </div>
    <p style={{ fontSize: 26, color: muted, margin: '28px 0 0' }}>
      The full comparison: <A href={URL_NEED}>README, “Do you need memsaga?”</A>
    </p>
  </Content>
);

const RepoBox = ({ title, sub, lines, strong, width = 700 }: { title: string; sub: string; lines: string[]; strong?: boolean; width?: number }) => (
  <div
    style={{
      width,
      boxSizing: 'border-box',
      padding: '28px 32px',
      borderRadius: 'var(--osd-radius)',
      border: `2px solid ${strong ? teal : rule}`,
      background: strong ? '#e6f1ee' : panel,
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 800 }}>{title}</div>
    <div style={{ fontSize: 26, color: muted, marginTop: 6 }}>{sub}</div>
    <div style={{ fontFamily: mono, fontSize: 25, lineHeight: 1.55, marginTop: 18, whiteSpace: 'pre' }}>{lines.join('\n')}</div>
  </div>
);

const Companion: Page = () => (
  <Content eyebrow="Appendix · Companion docs" heading="Notes beside a repository, never committed to it" headingSize={60}>
    {/* Mirrors the "Companion docs" section of memsaga.grimmer.io. */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 40 }}>
      <RepoBox
        title="~/git/webapp"
        sub="the project · not yours to commit to"
        lines={['docs/', '  architecture.md', '  review-process.md', 'README.md']}
        width={560}
      />
      <div style={{ textAlign: 'center', width: 180 }}>
        <div style={{ fontSize: 48, color: muted }}>→</div>
        <div style={{ fontSize: 24, color: muted }}>same path, plus the language</div>
      </div>
      <RepoBox
        title="companion/webapp"
        sub="in your data repository"
        lines={['_notes/', '  pr-2107-review.md      note', 'docs/', '  architecture.zh-tw.md  translation', '  new-design.zh-tw.md    draft, no source yet']}
        strong
        width={880}
      />
    </div>
    <div
      style={{
        marginTop: 28,
        fontFamily: mono,
        fontSize: 22,
        lineHeight: 1.5,
        whiteSpace: 'pre',
        background: '#1f1d1a',
        color: '#f1ede4',
        borderRadius: 'var(--osd-radius)',
        padding: '16px 24px',
      }}
    >
      {'/companions webapp\nstable  webapp/_notes/pr-2107-review.md    ~ docs/review-process.md, acme/webapp#2107\nstable  webapp/docs/architecture.zh-tw.md  <- ~/git/webapp/docs/architecture.md\ndraft   webapp/docs/new-design.zh-tw.md    (no source yet)'}
    </div>
    <div style={{ fontSize: 23, color: muted, marginTop: 10, fontFamily: mono }}>
      stable / draft: the status you give it · {'<-'} translated from · ~ a note about (a file, a PR)
    </div>
    <p style={{ fontSize: 26, color: muted, margin: '20px 0 0', lineHeight: 1.45 }}>
      Ask in your own words (中文版, 日本語版, a note on this repo); Claude checks for an existing companion first.
    </p>
  </Content>
);

const Cell = ({ children, head }: { children: ReactNode; head?: boolean }) => (
  <div style={{ padding: '9px 20px', borderBottom: `1px solid ${rule}`, fontWeight: head ? 700 : 400, color: head ? muted : 'var(--osd-text)', background: head ? panel : 'transparent' }}>
    {children}
  </div>
);

// From memsaga 0.1.6's code (sync.rs: on_session_start, on_prompt, checked_tool), checked by the memsaga session on 2026-11-26.
// Two kinds of wait: the GitHub check (about 0.5 s), and a pull (fetch + merge + write) when a change is already known to be waiting.
const CheckTable = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '400px 260px 420px 560px', fontSize: 24, border: `1px solid ${rule}`, borderRadius: 'var(--osd-radius)', overflow: 'hidden', width: 1640 }}>
    <Cell head>When</Cell>
    <Cell head>Reuses an answer up to</Cell>
    <Cell head>Waits for the GitHub check?</Cell>
    <Cell head>If a check already found new changes</Cell>
    <Cell>A session starts</Cell>
    <Cell>60 s</Cell>
    <Cell>Yes, about 0.5 s</Cell>
    <Cell>Brings them all in now (Claude Code waits)</Cell>
    <Cell>Each prompt</Cell>
    <Cell>60 s</Cell>
    <Cell>No, runs in the background</Cell>
    <Cell>Brings them all in now (Claude Code waits)</Cell>
    <Cell>Before Claude reads a kept file</Cell>
    <Cell>60 s</Cell>
    <Cell>No, runs in the background</Cell>
    <Cell>Brings in this file, if changed (waits)</Cell>
    <Cell>Before Claude writes a kept file</Cell>
    <Cell>10 s</Cell>
    <Cell>Yes, about 0.5 s</Cell>
    <Cell>Brings in this file, if changed (waits)</Cell>
  </div>
);

const Timing: Page = () => (
  <Content eyebrow="Appendix · Does it slow Claude Code down?" heading="Barely — measured">
    <ul style={{ fontSize: 30, lineHeight: 1.4, margin: '32px 0 0', paddingLeft: 44 }}>
      <li>Most tool calls: about 5 ms. Commit and push run in the background; the reply does not wait.</li>
      <li>Push: at most every 10 minutes by default, even while Claude Code is idle; right away when a session ends.</li>
    </ul>
    <div style={{ fontSize: 30, fontWeight: 700, margin: '24px 0 10px' }}>Checking GitHub for edits made elsewhere</div>
    <CheckTable />
    <p style={{ fontSize: 24, color: muted, margin: '12px 0 0', lineHeight: 1.4 }}>
      Claude Code waits for GitHub only at session start and before writing a kept file; a pull happens only when something actually changed. Answers are shared by every session on the machine. A kept file is one memsaga mirrors.
    </p>
    <p style={{ fontSize: 24, color: muted, margin: '16px 0 0' }}>
      Sources: <A href={URL_FAQ_SPEED}>memsaga FAQ, “Does it slow Claude Code down?”</A> and <A href={URL_TIMING}>README, “Timing”</A>
    </p>
  </Content>
);

const Code = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: mono, fontSize: '0.92em', whiteSpace: 'nowrap', color: 'var(--osd-text)' }}>{children}</span>
);

const Step = ({ n, head, body }: { n: string; head: string; body?: ReactNode }) => (
  <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', marginBottom: 18 }}>
    <div
      style={{
        width: 56,
        height: 56,
        flex: 'none',
        borderRadius: 28,
        background: teal,
        color: '#fff',
        fontSize: 30,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div>
      <div style={{ fontSize: 36, fontWeight: 700 }}>{head}</div>
      <div style={{ fontSize: 28, color: muted, marginTop: 4, lineHeight: 1.4 }}>{body}</div>
    </div>
  </div>
);

const SyncDetail: Page = () => (
  <Content eyebrow="Appendix · Two-way sync" heading="An edit on GitHub reaches Claude like this" headingSize={56}>
    <div style={{ marginTop: 36 }}>
      <Step n="1" head="You edit a memory file on GitHub (browser or phone), or push from another computer." />
      <Step n="2" head="memsaga's hooks ask GitHub: did anything change?" body="At session start, each prompt, and before Claude reads or writes a file memsaga keeps (timing: previous page)." />
      <Step
        n="3"
        head="The edit is merged into the data repository."
        body={<>Usually automatic. It stops only if this Mac has a committed, unpushed change to the same lines: nothing is pushed, <Code>memsaga status</Code> names the file, and you fix it in the data repository.</>}
      />
      <Step
        n="4"
        head="The live file is updated before each prompt, and before a file-tool read or write."
        body={<>Usually silent. If the file was also edited here on the same lines, it waits: Claude and the end-of-turn notice tell you, and <Code>memsaga sync --take live|repo &lt;file&gt;</Code> picks a side. (Read through Bash mid-turn, a change shows the old text until the next prompt.)</>}
      />
      <Step n="5" head="A session that already read the old text is told which lines changed." body="So Claude re-reads the file before using it (3 of 3 in a test; without the notice, 0 of 3)." />
    </div>
    <p style={{ fontSize: 26, color: muted, margin: '8px 0 0' }}>
      Sources: <A href={URL_TIMING}>memsaga README, “Timing”</A> and <A href={URL_TWO_WAY}>docs/two-way-sync.md</A>
    </p>
  </Content>
);

export const notes: (string | undefined)[] = [
  `~10s. Hi, I'm Grimmer. Five minutes on giving Claude Code's files a Git history.
(The name: mem, for memory, plus saga, the Old Norse word for a story or history: the story of how your agent's memory came to be.)
(Taipei: you just wrote your first Mod — it has no history either.)`,
  `~35s. Claude keeps three kinds of files: its standing instructions, what it remembers, how it does tasks.
It edits all three by itself, and none of it has history. What did it change, when, in which session? I couldn't tell,
so I rarely let it touch a skill, and never asked it to clean up its memory.`,
  `~30s. memsaga hooks into Claude Code. At the end of every turn that changed something, it commits,
and the commit carries the session's title and ID. It keeps history; it does not take over: your files stay where they are,
and Claude works as before. One small Rust binary, about 5 ms for most tool calls. The repository is yours.
(If asked: Account is the label of the config folder, ~/.claude -> claude, ~/.claude-work -> claude-work.
Agent is main, or a subagent's name when a subagent made the edit.
A commit holds every change since the last one, including a hand edit or another parallel session's edit;
it is named after the session whose turn ended. The conversation tells you who actually made it.)`,
  `~20s. ~/.claude is hidden, and most of its sixty-odd entries are caches and logs; memory sits under folders named after
encoded paths. The repository keeps only what matters, with names you can read, and index.md maps each one back to its
project. That alone made it easier to browse and tidy: two memory folders with similar files stand out at a glance.`,
  `~55s. Now I can answer page 2's questions. A real case: I found a rule in my CLAUDE.md and asked, did you add this on your own?
git blame gives the commit, the commit names the session, claude --resume reopens it.
I didn't run these myself: I asked Claude, and it looked it up in the history. It had added the rule, and had said so in its reply. Since then: skills and memory, Claude edits and tells me; CLAUDE.md waits for my yes.
The other questions: which version of a skill was loaded, what another session just changed, where a file went,
and which session added a to-do on the PR board Claude keeps for me (the item says what; the session says why).
I run many sessions in parallel; the log is how they, and I, see each other's edits. Some I asked; some a session checked on its own.
(If asked: the session reopens only while Claude Code keeps the transcript, 30 days by default; memsaga does not copy transcripts.)`,
  `~20s. My own data since late September: 25 different sessions changed my CLAUDE.md, 57 my skills, 136 my memory.
Nobody can follow that from memory. About a dozen times, the history answered "who changed this, and why?".
(If asked about volume: 57 commits on a typical day, 460 on the busiest, all from live sessions. You don't read them;
you search them when a question comes up, with git log -S or git blame.)`,
  `~25s, skip if over time. Everything is pushed to a private GitHub repository: an off-site backup I can browse anywhere
(I pinned it to my Dock). My second Mac is a backup machine: clone, memsaga restore --all, and it had everything.
An edit on my phone, in the GitHub editor, comes back to the live file.
Not only memory: my drafts folder, my PR/to-do board (50 sessions edited it) and the Mod I wrote are in the same repository.
(Taipei: the Mod you wrote today can go in too, by adding ~/.claude/mods to memsaga's dirs.)`,
  `~35s. Rollback is a seatbelt. Undo is what makes a cleanup safe: now I let Claude reorganize its memory, about 90 files deleted, all recoverable.
The tool made mistakes too: the only two real rollbacks so far undid memsaga's own sync bugs, and both are fixed.
(Details if asked: Oct 22, a restore rehearsal on the backup Mac deleted a file on my main Mac, brought back with memsaga restore, fixed in v0.1.1.
Nov 24, a sync on the backup Mac was cut off half-way and the next commit put stale copies of 77 files over newer ones;
one revert, fixed in 0.1.6, released last night.) Rehearse a restore before you need it.`,
  `~10s. memsaga.grimmer.io — free and open source. A reader asked about API keys, so since 0.1.5 a file that looks like one is held back.
If you only use one account on one computer, the README compares memsaga with a do-it-yourself setup.`,
  `~15s, Taipei only, drop if over time. matchapack went public yesterday: extra git worktrees cost almost no disk.
And CodeV: a Mac app for Claude Code sessions, projects and several accounts.`,
  `Appendix, for questions only.`,
  `Appendix, for questions only. A translation or note about a repository you must not commit to (an employer's)
lives in the data repository under companion/<repo>/, at the source file's path, with the source commit recorded.`,
  `Appendix, for questions only.`,
  `Appendix, for questions only. Why each prompt is a sync point, not only session start and file reads:
the read/write hook matches Claude's file tools (Read, Write, Edit), not paths, so a read through Bash never passes it;
and CLAUDE.md and MEMORY.md are loaded once at session start, never re-read. Session start covers changes made before
the session began; each prompt covers changes made while it runs. (memsaga docs/two-way-sync.md, section 7.)`,
];

export const meta: SlideMeta = {
  title: 'Git history for CLAUDE.md, memory and skills',
  createdAt: '2026-11-24T15:20:24.732Z',
};

export default [
  Cover,
  Problem,
  HowItWorks,
  WhatGoesIn,
  Answers,
  Numbers,
  NotJustThisMachine,
  Lessons,
  Links,
  OneMoreThing,
  NeedIt,
  Companion,
  Timing,
  SyncDetail,
] satisfies Page[];
