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
      Hooks and any file you choose, too, inside ~/.claude or not.
    </p>
    <p style={{ fontSize: 30, color: muted, margin: '64px 0 0', fontFamily: mono }}>
      Grimmer Kang · Tech Lead, Fireflies.ai · <A href={URL_ME}>github.com/grimmerk</A>
    </p>
    <p style={{ fontSize: 26, color: muted, margin: '14px 0 0' }}>memsaga is a personal open-source project.</p>
  </div>
);

const Term = ({ name, body }: { name: string; body: string }) => (
  <div style={{ flex: 1, background: panel, border: `1px solid ${rule}`, borderRadius: 'var(--osd-radius)', padding: '26px 30px' }}>
    <div style={{ fontSize: 36, fontWeight: 800, fontFamily: mono }}>{name}</div>
    <div style={{ fontSize: 28, color: muted, marginTop: 12, lineHeight: 1.4 }}>{body}</div>
  </div>
);

const Problem: Page = () => (
  <Content eyebrow="The problem" heading="Claude edits these files by itself, every day">
    <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
      <Term name="CLAUDE.md" body="Instructions Claude reads at the start of every session." />
      <Term name="auto memory" body="Notes Claude writes for itself as it works, or when you ask it to remember." />
      <Term name="skills" body="Folders of instructions Claude loads when a task needs them." />
    </div>
    <p style={{ fontSize: 46, lineHeight: 1.35, margin: '56px 0 0' }}>
      What did it change? When? <span style={{ color: 'var(--osd-accent)' }}>In which session?</span>
    </p>
    <p style={{ fontSize: 34, lineHeight: 1.5, color: muted, margin: '28px 0 0', maxWidth: 1560 }}>
      I couldn't tell. So I let Claude change a skill only now and then, and never asked it to clean up its memory: I was afraid it would break something I couldn't undo.
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
    <p style={{ fontSize: 28, color: muted, margin: '32px 0 0' }}>
      Claude Code hooks · one Rust binary · <A href={URL_FAQ_SPEED}>about 5 ms for most tool calls</A> · a private Git repository you own
    </p>
  </Content>
);

const FlowBox = ({ label, body, accent }: { label: string; body: ReactNode; accent?: boolean }) => (
  <div
    style={{
      width: 350,
      height: 236,
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
  <div style={{ display: 'flex', gap: 18, marginTop: 56 }}>
    <FlowBox label="A rule in CLAUDE.md" body="“Run the tests before every push.”" />
    <Arrow />
    <FlowBox label="git blame" body="a1b2c3d, Tue 14:02" />
    <Arrow />
    <FlowBox label="The commit" body={<>Session-Title: fix flaky login test</>} />
    <Arrow />
    <FlowBox label="Reopen that session" body={<>claude --resume 9e41f07c…</>} accent />
  </div>
);

const Provenance: Page = () => (
  <Content eyebrow="Who changed this, and why?" heading="“Did you add this rule on your own?”">
    {/* Opt-in clip: set src to the recorded clip A (assets/clip-provenance.mp4) when it exists. */}
    <Clip src={undefined} width={1440} height={560} fallback={<ProvenanceFlow />} />
    <p style={{ fontSize: 36, lineHeight: 1.45, margin: '52px 0 0' }}>
      It had, and said so in its reply. That answer helped me set my rule: Claude edits skills and memory on its own and tells me; a change to CLAUDE.md waits for my yes.
    </p>
    <p style={{ fontSize: 26, color: muted, margin: '24px 0 0' }}>
      The session reopens while Claude Code still keeps its transcript (30 days by default, <span style={{ fontFamily: mono }}>cleanupPeriodDays</span>). memsaga never copies transcripts.
    </p>
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
    <div style={{ display: 'grid', gridTemplateColumns: '760px 760px', columnGap: 120, marginTop: 56 }}>
      <Stat n="~90" label="files Claude deleted while tidying up, all recoverable" />
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
  <Content eyebrow="Questions the history answered" heading={<>Every session sees what the others changed,<br />and what it changed itself</>} headingSize={60}>
    <ul style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.4, margin: '64px 0 0', paddingLeft: 44 }}>
      <Question q="“Did you add this rule on your own?”" note="yes, and it said so" />
      <Question q="“Which version of the skill did you load?”" note="last night's" />
      <Question q="“What did the other session just change?”" note="a shared skill, earlier that day" />
      <Question q="“Where did this file go?”" note="git log showed the new path, and the session that moved it" />
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
      Setting up my backup Mac: clone the repository, run <span style={{ fontFamily: mono }}>memsaga restore --all</span>, and its CLAUDE.md, skills and memory were back.
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
        Because every change can come back, I let Claude reorganize its memory: about 90 files deleted along the way. <Code>memsaga restore &lt;file&gt; --at &lt;commit&gt;</Code> shows the diff first, then brings it back.
      </Lesson>
      <Lesson head="The two real rollbacks undid the tool's own sync bugs.">
        Oct 22: a restore test on my backup Mac deleted a file on my main Mac; brought back, <A href={URL_BUG}>fixed in v0.1.1</A>.
        <br />
        Nov 24: the backup Mac committed stale copies of 77 files over newer ones; one revert, <A href={URL_V016}>fixed in 0.1.6</A>.
      </Lesson>
      <Lesson head="Rehearse a restore while nothing is at stake.">
        My first rehearsal, on the backup Mac, found that first bug: better then than on the day I need my files back.
      </Lesson>
    </ul>
  </Content>
);

const Links: Page = () => (
  <div style={{ ...fill, padding: `120px ${PAD}px 0`, display: 'flex', gap: 120 }}>
    <div style={{ flex: 1 }}>
      <Eyebrow>Try it</Eyebrow>
      <Heading size={96}>
        <A href={URL_SITE}>memsaga.grimmer.io</A>
      </Heading>
      <div
        style={{
          marginTop: 52,
          fontFamily: mono,
          fontSize: 36,
          background: panel,
          border: `1px solid ${rule}`,
          borderRadius: 'var(--osd-radius)',
          padding: '24px 36px',
          display: 'inline-block',
        }}
      >
        <A href={URL_INSTALL}>brew install grimmerk/tap/memsaga</A>
      </div>
      <p style={{ fontSize: 30, color: muted, margin: '44px 0 0', lineHeight: 1.6 }}>
        Free and open source (MIT) · macOS and Linux · listed in <A href={URL_REV_NEWS}>Git Rev News #140</A>, the Git community's monthly newsletter
        <br />
        A file whose new lines look like an API key is <A href={URL_SECRETS}>held back, not committed</A> (0.1.5, a reader's question).
        <br />
        Bonus: companion docs — notes and translations beside repositories you can't commit to (appendix).
      </p>
    </div>
    <div style={{ width: 420, paddingTop: 40 }}>
      <img src={qr} alt="QR code for memsaga.grimmer.io" style={{ width: 420, height: 420, imageRendering: 'pixelated' }} />
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
    <div style={{ display: 'flex', gap: 80, marginTop: 56 }}>
      <div style={{ flex: 1 }}>
        <Extra
          name="matchapack"
          href={URL_MATCHAPACK}
          line="Copy-on-write node_modules for npm and Yarn 1: each extra git worktree costs almost no disk."
          status="v0.1.0, released 2026-11-24"
        />
        <div style={{ fontSize: 30, color: muted, marginTop: -28, marginBottom: 28 }}>
          Measured, 10 worktrees: 20.68 GiB with plain npm → 61 MiB + one 1.82 GiB store
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
          <A href={URL_MATCHAPACK_INSTALL}>brew install grimmerk/tap/matchapack</A>
        </div>
      </div>
      <img src={matchapackQr} alt="QR code for github.com/grimmerk/matchapack" style={{ width: 300, height: 300, marginTop: 8, imageRendering: 'pixelated' }} />
    </div>
    <div style={{ marginTop: 40 }}>
      <Extra
        name="CodeV"
        href={URL_CODEV}
        line="A Mac app for Claude Code: session switcher, project launcher, built-in terminal, and several accounts sharing one CLAUDE.md, skills and memory."
        status="macOS"
        small
      />
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

const RepoBox = ({ title, sub, lines, strong }: { title: string; sub: string; lines: string[]; strong?: boolean }) => (
  <div
    style={{
      width: 700,
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 48 }}>
      <RepoBox
        title="A repository you can't commit to"
        sub="say, your employer's"
        lines={['webapp/', '  docs/design.md']}
      />
      <div style={{ textAlign: 'center', width: 180 }}>
        <div style={{ fontSize: 48, color: muted }}>→</div>
        <div style={{ fontSize: 24, color: muted }}>“translate this”, “keep a note on it”</div>
      </div>
      <RepoBox
        title="Your memsaga data repository"
        sub="versioned and synced with your memory"
        lines={['companion/webapp/', '  docs/design.zh-tw.md', '    sources: docs/design.md @ a1b2c3d', '    status: draft']}
        strong
      />
    </div>
    <ul style={{ fontSize: 30, lineHeight: 1.45, margin: '40px 0 0', paddingLeft: 40 }}>
      <li>Same path as the source, so a later session finds it before translating again.</li>
      <li>The source file and commit are recorded, so you can tell when it is out of date.</li>
      <li><Code>memsaga companions</Code> lists them; a note about the whole repository goes in <Code>_notes/</Code>.</li>
    </ul>
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
    <ul style={{ fontSize: 32, lineHeight: 1.4, margin: '36px 0 0', paddingLeft: 44 }}>
      <li>Most tool calls: about 5 ms</li>
      <li>The commit at the end of a reply: in the background; the reply does not wait</li>
      <li>Push: in the background, at most every 10 minutes by default; right away when a session ends</li>
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
(Taipei: you just wrote your first Mod — it has no history either.)`,
  `~35s. Three kinds of files: CLAUDE.md, auto memory, skills. Claude edits all three by itself.
None of it has history. After a while I couldn't tell what it had remembered or when it changed,
so I let it touch a skill only now and then, and never asked it to clean up its memory.`,
  `~30s. memsaga hooks into Claude Code. At the end of every turn that changed something, it commits,
and the commit carries the session's title and ID. One small Rust binary, about 5 ms for most tool calls. The repository is yours.
(If asked: Account is the label of the config folder, ~/.claude -> claude, ~/.claude-work -> claude-work.
Agent is main, or a subagent's name when a subagent made the edit.
A commit holds every change since the last one, including a hand edit or another parallel session's edit;
it is named after the session whose turn ended. The conversation tells you who actually made it.)`,
  `~50s. A real case. I found a rule in my CLAUDE.md and asked: did you add this on your own?
git blame gives the commit, the commit gives the session, claude --resume reopens it.
It had added the rule by itself, and said so in the same reply. That is when I set my rule:
skills and memory, Claude may change and report; CLAUDE.md, it proposes and waits for my yes.
The session can be reopened only while Claude Code keeps the transcript; memsaga does not copy transcripts.`,
  `~25s. I measured my own data before this talk, since late September.
25 different sessions changed my CLAUDE.md, 57 changed my skills, 136 changed my memory. Nobody can follow that from memory.
(If asked about volume: 57 commits on a typical day, 460 on the busiest, all from live sessions. You don't read them;
you search them when a question comes up, with git log -S or git blame.)
Claude deleted about 90 files while tidying up, every one recoverable.
And about a dozen times I asked: who changed this, and why?`,
  `~20s. These are the questions. I run many sessions in parallel, and they edit the same files.
The Git log shows a session what the others changed, and what it changed itself, without digging through transcripts.
Some of these I asked; some a session found by checking the history on its own.`,
  `~25s. Everything is pushed to a private GitHub repository: an off-site backup I can browse anywhere
(I even pinned it to my Dock). My second Mac is a backup machine: clone, memsaga restore --all, and it had everything.
An edit on my phone, in the GitHub editor, comes back to the live file.`,
  `~30s. Rollback is a seatbelt: undo is what makes a cleanup safe. I let Claude reorganize memory.
The only two real rollbacks so far undid memsaga's own sync bugs.
Oct 22: a restore test on the backup Mac deleted a file on my main Mac; brought back with memsaga restore, fixed in v0.1.1.
Nov 24: a sync on the backup Mac was cut off half-way, and the next commit put stale copies of 77 files over newer ones;
the commit named the session, one revert, fixed in 0.1.6 (released last night).
Lesson: test a restore before you need it. (Fukuoka: drop the "77".)`,
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
  Provenance,
  Numbers,
  Questions,
  NotJustThisMachine,
  Lessons,
  Links,
  OneMoreThing,
  NeedIt,
  Companion,
  Timing,
  SyncDetail,
] satisfies Page[];
