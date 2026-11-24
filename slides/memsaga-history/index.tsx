import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';
import matchapackQr from './assets/matchapack-qr.svg';
import qr from './assets/memsaga-qr.svg';
import syncSequence from './assets/sync-sequence-light.png';

// memsaga talk, English master deck (Taipei 2026-11-26; the Japanese deck is translated from this).
// Every number on these pages was measured on 2026-11-24 from the author's own data repository
// (commits since 2026-09-20) and session transcripts; the method lives outside this repo.

export const design: DesignSystem = {
  palette: { bg: '#fbfaf7', text: '#1a1814', accent: '#b0641c' },
  fonts: {
    display: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang TC", "Hiragino Sans", system-ui, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang TC", "Hiragino Sans", system-ui, sans-serif',
  },
  typeScale: { hero: 132, body: 40 },
  radius: 16,
};

const muted = '#6b645a';
const teal = '#1f7a6d';
const panel = '#f1ede4';
const rule = '#e2dccf';
const mono = '"SF Mono", ui-monospace, Menlo, Consolas, monospace';
const PAD = 140;

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
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        margin: '36px 0 40px',
      }}
    >
      Git history for
      <br />
      <span style={{ color: 'var(--osd-accent)' }}>Claude Code's memory</span>
    </h1>
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, margin: 0 }}>CLAUDE.md · memory · skills — every change, and the conversation behind it</p>
    <p style={{ fontSize: 30, color: muted, margin: '72px 0 0', fontFamily: mono }}>Grimmer Kang · github.com/grimmerk</p>
  </div>
);

const Problem: Page = () => (
  <Content eyebrow="The problem" heading={<>Claude edits its own instructions<br />and memory every day.</>}>
    <p style={{ fontSize: 48, lineHeight: 1.4, margin: '72px 0 0', maxWidth: 1500 }}>
      What did it change? When? <span style={{ color: 'var(--osd-accent)' }}>In which conversation?</span>
    </p>
    <p style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.5, color: muted, margin: '56px 0 0', maxWidth: 1500 }}>
      I couldn't tell. So I never let Claude clean up its memory or fix a skill — I was afraid it would break something I couldn't undo.
    </p>
  </Content>
);

const CommitLine = ({ k, v, color }: { k: string; v: string; color?: string }) => (
  <div>
    <span style={{ color: muted }}>{k}</span>
    <span style={{ color: color ?? 'var(--osd-text)' }}>{v}</span>
  </div>
);

const HowItWorks: Page = () => (
  <Content eyebrow="What memsaga does" heading={<>Every turn that changes something<br />becomes one commit, named after the conversation.</>} headingSize={60}>
    <div
      style={{
        marginTop: 56,
        background: panel,
        border: `1px solid ${rule}`,
        borderRadius: 'var(--osd-radius)',
        padding: '36px 48px',
        fontFamily: mono,
        fontSize: 30,
        lineHeight: 1.6,
        width: 1300,
      }}
    >
      <CommitLine k="" v="a1b2c3d  [weekly memory tidy-up] claude:memory" color="var(--osd-accent)" />
      <CommitLine k="  Session-Title: " v="weekly memory tidy-up" />
      <CommitLine k="  Session:       " v="9e41f07c-…" />
      <CommitLine k="  Account:       " v="claude" />
      <CommitLine k="   M " v="memory/project-notes.md" color={teal} />
      <CommitLine k="   D " v="memory/old-duplicate.md" color={teal} />
    </div>
    <p style={{ fontSize: 30, color: muted, margin: '40px 0 0' }}>
      Claude Code hooks · one Rust binary · about 5 ms per tool call · a private Git repository you own
    </p>
  </Content>
);

const FlowBox = ({ label, body, accent }: { label: string; body: string; accent?: boolean }) => (
  <div
    style={{
      width: 340,
      height: 250,
      boxSizing: 'border-box',
      padding: '28px 30px',
      borderRadius: 'var(--osd-radius)',
      border: `2px solid ${accent ? 'var(--osd-accent)' : rule}`,
      background: accent ? '#fbefe2' : panel,
    }}
  >
    <div style={{ fontSize: 26, color: muted, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 30, lineHeight: 1.4, marginTop: 16, fontFamily: mono }}>{body}</div>
  </div>
);

const Arrow = () => <div style={{ fontSize: 48, color: muted, alignSelf: 'center' }}>→</div>;

const ProvenanceFlow = () => (
  <div style={{ display: 'flex', gap: 22, marginTop: 72 }}>
    <FlowBox label="A rule in CLAUDE.md" body="“Run the tests before every push.”" />
    <Arrow />
    <FlowBox label="git blame" body="a1b2c3d, Tue 14:02" />
    <Arrow />
    <FlowBox label="the commit" body="Session-Title: fix flaky login test" />
    <Arrow />
    <FlowBox label="the conversation" body="why the rule was added" accent />
  </div>
);

const Provenance: Page = () => (
  <Content eyebrow="Who changed this, and why?" heading="“Did you add this rule on your own?”">
    {/* Opt-in clip: set src to the recorded clip A (assets/clip-provenance.mp4) when it exists. */}
    <Clip src={undefined} width={1440} height={600} fallback={<ProvenanceFlow />} />
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, margin: '64px 0 0' }}>
      The answer takes seconds — and it changed what I let Claude edit by itself.
    </p>
  </Content>
);

const Stat = ({ n, label, accent }: { n: string; label: string; accent?: boolean }) => (
  <div style={{ width: 760 }}>
    <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1, color: accent ? 'var(--osd-accent)' : 'var(--osd-text)', letterSpacing: '-0.02em' }}>{n}</div>
    <div style={{ fontSize: 34, color: muted, marginTop: 14 }}>{label}</div>
  </div>
);

const Numbers: Page = () => (
  <Content eyebrow="Two months of my own data" heading="What actually happened">
    <div style={{ display: 'grid', gridTemplateColumns: '760px 760px', columnGap: 120, rowGap: 64, marginTop: 64 }}>
      <Stat n="~5,000" label="commits since late September" />
      <Stat n="24 / 55" label="sessions that changed my CLAUDE.md / my skills" />
      <Stat n="0" label="times I rolled a file back" />
      <Stat n="~12" label="times I asked “who changed this, and why?”" accent />
    </div>
  </Content>
);

const Question = ({ q, note }: { q: string; note: string }) => (
  <li style={{ marginBottom: 34 }}>
    <span style={{ fontWeight: 700 }}>{q}</span>
    <span style={{ color: muted }}> — {note}</span>
  </li>
);

const Questions: Page = () => (
  <Content eyebrow="The questions I actually asked" heading="History is how parallel sessions see each other">
    <ul style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.4, margin: '64px 0 0', paddingLeft: 44 }}>
      <Question q="“Did you add this rule on your own?”" note="yes, and it said so" />
      <Question q="“Which version of the skill did you load?”" note="last night's" />
      <Question q="“What did the other session just change?”" note="a shared skill, earlier that day" />
      <Question q="“Where did this file go?”" note="another session moved it" />
    </ul>
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
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, margin: '64px 0 0' }}>
      Restoring my backup Mac took one clone. Browsing history on GitHub needs nothing installed.
    </p>
  </Content>
);

const Lesson = ({ head, body }: { head: string; body: string }) => (
  <li style={{ marginBottom: 40 }}>
    <div style={{ fontWeight: 700 }}>{head}</div>
    <div style={{ color: muted, fontSize: 34, marginTop: 8 }}>{body}</div>
  </li>
);

const Lessons: Page = () => (
  <Content eyebrow="What I learned" heading="Rollback is a seatbelt">
    <ul style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.35, margin: '56px 0 0', paddingLeft: 44, maxWidth: 1560 }}>
      <Lesson head="Never needed it — and that is why I let Claude reorganize." body="About 90 memory and skill files deleted, every one recoverable." />
      <Lesson head="Testing on a backup Mac found a real bug." body="A file missing on one machine looked like a deletion everywhere. Fixed." />
      <Lesson head="A reader asked: what about API keys?" body="Since 0.1.5, a file whose new lines look like a secret is held back, not committed." />
    </ul>
  </Content>
);

const Links: Page = () => (
  <div style={{ ...fill, padding: `120px ${PAD}px 0`, display: 'flex', gap: 120 }}>
    <div style={{ flex: 1 }}>
      <Eyebrow>Try it</Eyebrow>
      <Heading size={96}>memsaga.grimmer.io</Heading>
      <div
        style={{
          marginTop: 56,
          fontFamily: mono,
          fontSize: 36,
          background: panel,
          border: `1px solid ${rule}`,
          borderRadius: 'var(--osd-radius)',
          padding: '26px 36px',
          display: 'inline-block',
        }}
      >
        brew install grimmerk/tap/memsaga
      </div>
      <p style={{ fontSize: 32, color: muted, margin: '48px 0 0', lineHeight: 1.5 }}>
        Free and open source (MIT) · macOS and Linux · listed in Git Rev News #140
        <br />
        Bonus: companion docs — notes and translations beside repositories you can't commit to
      </p>
    </div>
    <div style={{ width: 460, paddingTop: 40 }}>
      <img src={qr} alt="QR code for memsaga.grimmer.io" style={{ width: 460, height: 460, imageRendering: 'pixelated' }} />
    </div>
    <Footer />
  </div>
);

const Extra = ({ name, line, status }: { name: string; line: string; status: string }) => (
  <div style={{ marginBottom: 56 }}>
    <div style={{ fontSize: 56, fontWeight: 800 }}>
      {name} <span style={{ fontSize: 28, color: muted, fontWeight: 500, fontFamily: mono }}>{status}</span>
    </div>
    <div style={{ fontSize: 'var(--osd-size-body)', color: muted, marginTop: 12 }}>{line}</div>
  </div>
);

const OneMoreThing: Page = () => (
  <Content eyebrow="One more thing" heading="Two more side projects">
    <div style={{ display: 'flex', gap: 80, marginTop: 56 }}>
      <div style={{ flex: 1 }}>
        <Extra
          name="matchapack"
          line="Ten git worktrees, the disk space of one: copy-on-write node_modules for npm and Yarn 1."
          status="released 2026-11-24 · github.com/grimmerk/matchapack"
        />
        <div style={{ fontSize: 30, color: muted, marginTop: -28, marginBottom: 28 }}>
          10 worktrees of a large project: 20.68 GiB with plain npm → 61 MiB, plus one 1.82 GiB store
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 30,
            background: panel,
            border: `1px solid ${rule}`,
            borderRadius: 'var(--osd-radius)',
            padding: '18px 28px',
            display: 'inline-block',
          }}
        >
          brew install grimmerk/tap/matchapack
        </div>
      </div>
      <img src={matchapackQr} alt="QR code for github.com/grimmerk/matchapack" style={{ width: 300, height: 300, marginTop: 8, imageRendering: 'pixelated' }} />
    </div>
    <div style={{ marginTop: 52 }}>
      <Extra name="CodeV" line="Several Claude Code accounts on one Mac, sharing one CLAUDE.md, skills and memory." status="github.com/grimmerk/codev · macOS" />
    </div>
  </Content>
);

const Timing: Page = () => (
  <Content eyebrow="Appendix · Does it slow Claude Code down?" heading="Barely — measured">
    <ul style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.5, margin: '56px 0 0', paddingLeft: 44 }}>
      <li>Most tool calls: about 5 ms</li>
      <li>End of a reply with nothing to commit: about 30–45 ms</li>
      <li>A commit, and pushing to GitHub: in the background</li>
      <li>Checking GitHub for edits made elsewhere: about 0.5 s, at most once a minute</li>
    </ul>
    <p style={{ fontSize: 28, color: muted, margin: '48px 0 0' }}>Source: memsaga docs/faq.md, “Does it slow Claude Code down?”</p>
  </Content>
);

const SyncDetail: Page = () => (
  <Content eyebrow="Appendix · Two-way sync" heading="An edit on GitHub reaches Claude like this">
    <img src={syncSequence} alt="Sequence: edit on GitHub, memsaga hooks notice origin moved, merge, write the live file, tell Claude which lines changed" style={{ width: 1640, marginTop: 48, borderRadius: 'var(--osd-radius)' }} />
  </Content>
);

export const notes: (string | undefined)[] = [
  `~10s. Hi, I'm Grimmer. Five minutes on giving Claude Code's memory a Git history.
(Taipei: you just wrote your first Mod — it has no history either.)`,
  `~35s. Claude Code's auto memory rewrites Markdown files in ~/.claude by itself, and none of it has history.
After a while I couldn't tell what it had remembered or when it changed.
So I never let it merge duplicate memories or fix a skill — I was afraid of breaking something I couldn't undo.`,
  `~30s. memsaga hooks into Claude Code. At the end of every turn that changed something, it commits — and the commit is named after the session, with the session ID in a trailer.
It's one small Rust binary; a tool call costs about 5 ms. The repository is yours, private on GitHub.`,
  `~50s. Real example. I found a rule in my CLAUDE.md and asked Claude: did you add this on your own, or did you ask me?
git blame gives the commit, the commit gives the session, the session gives the conversation.
Answer: it added it by itself, and it told me in the same reply. That answer changed which edits I allow Claude to make automatically.`,
  `~25s. I measured my own data before this talk. About 5,000 commits since late September.
24 different sessions changed my global CLAUDE.md; 55 changed my skills. Nobody can track that from memory.
I rolled a file back zero times. But I asked "who changed this and why" about a dozen times.`,
  `~20s. These are the questions. I run many sessions in parallel, and they edit the same files —
the Git log is how they, and I, see each other's edits.`,
  `~25s. Everything is pushed to a private GitHub repository: an off-site backup I can browse from anywhere.
My second Mac is a backup machine; restoring it was one clone. And if I fix a memory on my phone in the GitHub editor, it comes back to the live file.`,
  `~30s. Rollback is a seatbelt. I never needed it — and because it's there, I let Claude reorganize: about 90 files deleted, all recoverable.
Testing on the backup Mac found a real bug: a file missing on one machine looked like a deletion. Fixed.
Someone asked about API keys; since 0.1.5 a file that looks like it holds a secret is held back.`,
  `~10s. memsaga.grimmer.io — free and open source. Scan the code, or brew install.`,
  `~15s, Taipei only, drop if over time. matchapack went public yesterday: ten git worktrees for the disk space of one — scan the code.
And CodeV, if you run more than one Claude Code account on a Mac.`,
  `Appendix, for questions only.`,
  `Appendix, for questions only.`,
];

export const meta: SlideMeta = {
  title: 'Git history for Claude Code’s memory',
  createdAt: '2026-11-24T15:20:24.732Z',
};

export default [
  Cover,
  Problem,
  HowItWorks,
  Provenance,
  Numbers,
  Questions,
  NotJustThisMachine,
  Lessons,
  Links,
  OneMoreThing,
  Timing,
  SyncDetail,
] satisfies Page[];
