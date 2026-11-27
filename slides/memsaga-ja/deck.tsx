import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import { type CSSProperties, type ReactNode, useSyncExternalStore } from 'react';
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
// Each deck opens in its own language (or ?lang=en|ja) and switches in place with the EN / 日本語
// button in the footer: no reload, same page. The button is a <button>, which open-slide exempts
// from click-to-navigate. The choice lives in this window only (the presenter window keeps its own).
// The speaker notes are the English talk script and are shared by both decks.
// Numbers come from the author's own data repository (measured 2026-11-24 to 26, commits since
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
// The Taipei talk's deck (English slides), through the alias shared on Discord.
const URL_TAIPEI = 'https://slides.grimmer.io/s/memsaga-taipei-2026-11';
const URL_ENGRAM = 'https://github.com/Sen-CaPoo/engram';
const URL_ME = 'https://github.com/grimmerk';
const URL_MATCHAPACK = 'https://github.com/grimmerk/matchapack';
const URL_CODEV = 'https://github.com/grimmerk/codev';
// Anthropic's skill guide, section "Evaluation and iteration" (評価と反復 in the Japanese edition).
const URL_SKILL_GUIDE_EN = 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices';
const URL_SKILL_GUIDE_JA = 'https://platform.claude.com/docs/ja/agents-and-tools/agent-skills/best-practices';
// Claude Code checkpoints: "Not a replacement for version control" (バージョン管理の代替ではありません).
const URL_CHECKPOINT_EN = 'https://code.claude.com/docs/en/checkpointing';
const URL_CHECKPOINT_JA = 'https://code.claude.com/docs/ja/checkpointing';

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
};

export function buildDeck(defaultLang: Lang) {
  // The current language: one small store per deck, so the two decks never share a choice.
  const fromUrl = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('lang');
  let lang: Lang = fromUrl === 'en' || fromUrl === 'ja' ? fromUrl : defaultLang;
  const listeners = new Set<() => void>();
  const setLang = (next: Lang) => {
    if (next === lang) return;
    lang = next;
    for (const l of listeners) l();
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const useLang = () => useSyncExternalStore(subscribe, () => lang, () => lang);

  const t = <T extends ReactNode>(en: T, ja?: T): T => (lang === 'ja' && ja !== undefined ? ja : en);
  // The QR and URL always name this deck; the button changes only the language shown.
  const deckPath = defaultLang === 'ja' ? 'memsaga-ja' : 'memsaga-fukuoka';
  const slidesUrl = `https://slides.grimmer.io/s/${deckPath}`;
  const slidesQr = defaultLang === 'ja' ? slidesQrJa : slidesQrEn;

  // Both stacks list Hiragino Sans before any Chinese font, so kanji get Japanese shapes either way.
  const font =
    defaultLang === 'ja'
      ? '"Hiragino Sans", "Hiragino Kaku Gothic ProN", -apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif'
      : '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Sans", system-ui, sans-serif';

  // Japanese: break lines at phrase boundaries (Chromium 119+; other browsers ignore it).
  const jaBreak = () => (lang === 'ja' ? { wordBreak: 'auto-phrase' } : {}) as CSSProperties;

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

  const LangSwitch = () => {
    const now = useLang();
    const opt = (value: Lang, label: string) => (
      <button
        type="button"
        onClick={(e) => {
          setLang(value);
          // Give the keyboard back to the deck, so the arrow keys keep turning pages.
          e.currentTarget.blur();
        }}
        aria-pressed={now === value}
        style={{
          font: 'inherit',
          fontSize: 22,
          padding: '2px 12px',
          border: `1px solid ${now === value ? muted : rule}`,
          borderRadius: 8,
          background: now === value ? panel : 'transparent',
          color: now === value ? 'var(--osd-text)' : soft,
          cursor: 'pointer',
        }}
      >
        {label}
      </button>
    );
    return (
      <span style={{ display: 'inline-flex', gap: 8 }}>
        {opt('en', 'EN')}
        {opt('ja', '日本語')}
      </span>
    );
  };

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
        <span style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <LangSwitch />
          {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    );
  };

  const Eyebrow = ({ children }: { children: ReactNode }) => (
    <div style={{ fontSize: 26, letterSpacing: lang === 'ja' ? '0.08em' : '0.14em', color: 'var(--osd-accent)', fontWeight: 600, textTransform: lang === 'ja' ? 'none' : 'uppercase' }}>{children}</div>
  );

  const Heading = ({ children, size = 68 }: { children: ReactNode; size?: number }) => (
    <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: size, fontWeight: 800, lineHeight: 1.2, margin: '22px 0 0', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  );

  const Content = ({ children, eyebrow, heading, headingSize }: { children?: ReactNode; eyebrow: ReactNode; heading: ReactNode; headingSize?: number }) => (
    <div lang={lang} style={{ ...fill, ...jaBreak(), padding: `110px ${PAD}px 0` }}>
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
    <div lang={lang} style={{ ...fill, ...jaBreak(), display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `0 ${PAD}px` }}>
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
        {t(
          <>Letting Claude clean up its memory, <span style={{ color: 'var(--osd-accent)' }}>without fear</span></>,
          <>Claude に記憶の整理を、<br /><span style={{ color: 'var(--osd-accent)' }}>安心して</span>任せる</>,
        )}
      </h1>
      <p style={{ fontSize: 44, color: muted, margin: 0, lineHeight: 1.4 }}>{t('Git history for Claude Code’s CLAUDE.md, memory and skills', 'Claude Code の CLAUDE.md・メモリ・スキルに Git の履歴を')}</p>
      <p style={{ fontSize: 30, color: muted, margin: '72px 0 0', fontFamily: mono }}>
        Grimmer · Tech Lead, <A href="https://fireflies.ai">Fireflies.ai</A> · {t('from Taiwan', '台湾から')} · <A href={URL_ME}>github.com/grimmerk</A>
      </p>
      {/* Bottom right, flush with the right margin: the QR and its URL share one right edge. */}
      <div style={{ position: 'absolute', right: PAD, bottom: 96, textAlign: 'right' }}>
        <img src={slidesQr} alt={`QR code for ${slidesUrl}`} style={{ display: 'block', marginLeft: 'auto', width: 190, height: 190, imageRendering: 'pixelated' }} />
        <div style={{ fontSize: 22, color: muted, fontFamily: mono, marginTop: 10 }}>{slidesUrl.replace('https://', '')}</div>
      </div>
      <div style={{ position: 'absolute', left: PAD, bottom: 56, fontFamily: mono }}>
        <LangSwitch />
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
    <Content eyebrow={t('How Claude Code remembers', 'Claude Code はどう覚えているか')} heading={t<ReactNode>('Each session starts with no memory, so Claude Code keeps notes in files', <>セッションは毎回ゼロから。<br />だから Claude Code はファイルにメモを残す</>)} headingSize={54}>
      <div style={{ marginTop: 18 }}>
        <Gloss term="Claude Code">{t('Claude working on your computer: in a terminal, or the Code tab of the desktop app', 'パソコン上で作業する Claude')}</Gloss>
        <Gloss term={t('session', 'セッション')}>{t('one conversation with Claude Code', 'Claude Code との1回の会話')}</Gloss>
      </div>
      <div style={{ fontSize: 24, color: teal, fontWeight: 700, margin: '26px 0 10px', letterSpacing: '0.06em' }}>{t('EXAMPLE: AUTO MEMORY', '例：自動メモリ（auto memory）')}</div>
      <div style={{ display: 'flex', gap: 22, alignItems: 'flex-end' }}>
        <Step n="1" label={t('Monday: I say', '月曜：こう頼む')}>
          <Bubble who="">{t<ReactNode>('“Remember: start the database before the tests.”', <>「覚えておいて。<br />テスト前にデータベースを起動」</>)}</Bubble>
        </Step>
        <div style={{ fontSize: 40, color: muted, paddingBottom: 18 }}>→</div>
        <Step n="2" label={t('Claude Code writes a note', 'Claude Code がメモを書く')}>
          <div style={{ background: '#fff', border: `2px solid ${teal}`, borderRadius: 14, padding: '14px 20px' }}>
            <div style={{ fontFamily: mono, fontSize: 22, color: teal, fontWeight: 700 }}>memory/testing.md</div>
            <div style={{ fontSize: 25, marginTop: 6, lineHeight: 1.35 }}>{t('Start the database before the tests.', 'テストの前にデータベースを起動する。')}</div>
          </div>
        </Step>
        <div style={{ fontSize: 40, color: muted, paddingBottom: 18 }}>→</div>
        <Step n="3" label={t('Tuesday: a new session reads it first', '火曜：新しいセッションが最初に読む')}>
          <Bubble who="" claude>
            {t('“Starting the database first.”', '「先にデータベースを起動します」')}
          </Bubble>
        </Step>
      </div>
      <div style={{ display: 'flex', gap: 28, marginTop: 26 }}>
        <Card title="CLAUDE.md" sub={t('Instructions it reads every time', '毎回読む指示書')}>
          {t('Read at the start of every session.', 'セッションの最初に毎回読まれる。')}
        </Card>
        <Card title={t('Auto memory', '自動メモリ')} sub={t('Notes', 'メモ')}>
          {t('Claude Code writes them on its own as it works (on by default), or when you say “remember”.', 'Claude Code が作業中に自分で書く（デフォルトで有効）。頼んだときも。')}
        </Card>
        <Card title={t('Skills', 'スキル')} sub={t('How-to guides', '手順書')}>
          {t('Steps for one kind of task, loaded when the task needs them.', '特定の作業の手順。必要なときだけ読み込まれる。')}
        </Card>
      </div>
      {lang === 'en' && (
        <p style={{ fontSize: 25, color: muted, margin: '18px 0 0' }}>
        {t('CLAUDE.md and skills: you write them, ask Claude Code to update them, or tell it when it may update them on its own.', 'CLAUDE.md とスキルは、自分で書いても、Claude Code に頼んでもよい。')}
      </p>
      )}
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
  const PLACE_APP = { title: t('Claude app', 'Claude アプリ'), sub: t('web, desktop, phone · kept with your account', 'Web・デスクトップ・スマホ／アカウントに保存') };
  const PLACE_MINE = { title: t<ReactNode>(<>Claude Code<br />your files</>, <>Claude Code<br />自分用のファイル</>), sub: t('~/.claude on your computer · just you', 'パソコンの ~/.claude／自分だけ') };
  const PLACE_PROJECT = { title: t<ReactNode>(<>Claude Code<br />project files</>, <>Claude Code<br />プロジェクトのファイル</>), sub: t('in the project’s Git repository · shared with the team', 'Git で管理するプロジェクト／チームで共有') };

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
    <Content eyebrow={t('The big picture', '全体像')} heading={t('Where Claude keeps its instructions and notes', 'Claude は指示とメモをどこに置いているか')} headingSize={60}>
      <div style={{ marginTop: 16 }}>
        <Gloss term="Git">{t('a tool that keeps the history of files', 'ファイルの変更履歴を残す仕組み')}</Gloss>
        <Gloss term={t('repository (repo)', 'リポジトリ')}>{t('a project’s files together with their history', 'ファイルとその履歴をまとめて保存する場所')}</Gloss>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr 1fr 1fr', columnGap: 20, marginTop: 24, width: 1640 }}>
        <div />
        <GridHead {...PLACE_APP} />
        <GridHead {...PLACE_MINE} strong />
        <GridHead {...PLACE_PROJECT} />

        <RowLabel>{t('Instructions', '指示')}</RowLabel>
        <GridCell>{t('Your instructions (profile, project)', '自分で書く指示（プロフィール、プロジェクト）')}</GridCell>
        <GridCell strong>CLAUDE.md</GridCell>
        <GridCell>{t('CLAUDE.md or AGENTS.md', 'CLAUDE.md または AGENTS.md')}</GridCell>

        <RowLabel>{t('Notes', 'メモ')}</RowLabel>
        <GridCell>{t('Memory: Claude keeps it; you can view and edit it in Settings', 'メモリ：Claude が管理（設定画面で確認・編集できる）')}</GridCell>
        <GridCell strong>{t('Auto memory, one folder per project', '自動メモリ（プロジェクトごとに1フォルダ）')}</GridCell>
        <GridCell dim>—</GridCell>

        <RowLabel>{t('How-to guides', '手順書')}</RowLabel>
        <GridCell>{t('Skills you upload', 'アップロードしたスキル')}</GridCell>
        <GridCell strong>{t('Skills', 'スキル')}</GridCell>
        <GridCell>{t('Skills', 'スキル')}</GridCell>

        <RowLabel>{t('History', '履歴')}</RowLabel>
        <GridCell last>{t('— (not covered today)', '—（今日は対象外）')}</GridCell>
        <GridCell last strong accent>{t('None. Today’s topic.', 'なし。今日のテーマ')}</GridCell>
        <GridCell last>{t('Git, together with the code', 'Git（コードと一緒に）')}</GridCell>
      </div>
      <p style={{ fontSize: 25, color: muted, margin: '26px 0 0', lineHeight: 1.45 }}>
        {t('Like the talk before mine, you can also build your own notes system that Claude reads.', '前の発表のように、Claude が読むメモの仕組みを自分で作る方法もあります。')}{' '}
        <PageLink to={Surfaces}>{t('Which Claude reads which place (appendix)', 'どの Claude がどこを読むか（付録）')}</PageLink>
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
    <Content eyebrow={t('The problem', '課題')} heading={t<ReactNode>('Claude Code edits these files every day, with no history to look back on', <>Claude Code は毎日これらのファイルを書き換える。<br />でも、見返せる履歴は残らない</>)} headingSize={60}>
      <p style={{ fontSize: 34, lineHeight: 1.45, margin: '28px 0 0', maxWidth: 1600 }}>
        {t('It is like a document you and Claude Code both edit, with no version history: it keeps changing, and you cannot see what changed.', '自分と Claude Code が一緒に編集する、変更履歴のない文書のようなもの。どんどん変わるのに、何が変わったのかわからない。')}
      </p>
      <div style={{ display: 'flex', gap: 26, marginTop: 40 }}>
        <Pain n="1" head={t('You forget what was tried', '何を試したか忘れる')} body={t('An idea was tried last week and dropped. Neither you nor Claude Code remembers, so it is tried again.', '先週試してやめた案を、自分も Claude も覚えていない。だからまた試してしまう。')} />
        <Pain n="2" head={t('Last week’s bad edit cannot be undone', '先週のまずい変更は戻せない')} body={t('Rewind only undoes the current session’s edits.', '巻き戻し（rewind）で戻せるのは、今のセッションの変更だけ。')} />
        <Pain n="3" head={t('You cannot tell why', '理由がわからない')} body={t('A rule you don’t remember appears. When, in which session, and why?', '知らないルールが増えている。いつ・どのセッションで・なぜ？')} />
      </div>
      <p style={{ fontSize: 38, fontWeight: 700, margin: '50px 0 0', color: 'var(--osd-accent)' }}>
        {t('So I rarely let Claude Code touch a skill, and never asked it to clean up its memory.', 'だから、スキルはほとんど触らせず、メモリの整理は一度も頼みませんでした。')}
      </p>
      <p style={{ fontSize: 23, color: muted, margin: '36px 0 0' }}>
        {t('Anthropic’s docs on rewind (checkpoints):', 'Anthropic のドキュメントも、巻き戻し（チェックポイント）について：')}{' '}
        <A href={t(URL_CHECKPOINT_EN, URL_CHECKPOINT_JA)}>{t('“Not a replacement for version control”', '「バージョン管理の代替ではありません」')}</A>
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
    <Content eyebrow={t('What I do now · answers ①', '今のやり方 · ① への答え')} heading={t('Every change becomes a record, named after its session', 'すべての変更を、セッション名つきで記録')} headingSize={62}>
      <div style={{ marginTop: 18 }}>
        <Gloss term="Git">{t('a tool that keeps the history of files', 'ファイルの変更履歴を残す仕組み')}</Gloss>
        <Gloss term={t('commit', 'コミット（commit）')}>{t('one saved record of a change, with a short message', '変更1件分の記録（短い説明付き）')}</Gloss>
      </div>
      <div style={{ display: 'flex', gap: 40, marginTop: 28, alignItems: 'flex-start' }}>
        <div style={{ width: 900, background: '#fff', border: `2px solid ${rule}`, borderRadius: 'var(--osd-radius)', padding: '18px 30px' }}>
          <div style={{ fontSize: 22, color: muted, fontWeight: 700, letterSpacing: '0.08em' }}>{t('HISTORY (newest first)', '履歴（新しい順）')}</div>
          <HistoryRow first when={t('Tue 14:02', '火 14:02')} title={t('session “fix flaky login test”', 'セッション「不安定なログインテストを直す」')} what={t('CLAUDE.md: 1 rule added', 'CLAUDE.md：ルールを1つ追加')} />
          <HistoryRow when={t('Tue 11:40', '火 11:40')} title={t('session “weekly memory tidy-up”', 'セッション「毎週のメモリ整理」')} what={t('memory: 2 notes merged, 1 deleted', 'メモリ：2件を統合、1件を削除')} />
          <HistoryRow when={t('Mon 18:15', '月 18:15')} title={t('session “write release notes”', 'セッション「リリースノートを書く」')} what={t('skills/release-notes: 3 lines changed', 'skills/release-notes：3行を変更')} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title={<Code>~/.claude</Code>} sub={t('A hidden folder: about 60 items, mostly logs and caches.', '隠しフォルダ。約60項目の大半はログやキャッシュ。')} />
          <div style={{ fontSize: 34, color: muted, textAlign: 'center' }}>↓</div>
          <Card title={t('A private folder you can browse', '見やすいフォルダに（非公開）')} sub={t('Only CLAUDE.md, memory and skills, with readable names. Private on GitHub, even from a phone.', 'CLAUDE.md・メモリ・スキルだけを、わかりやすい名前で。GitHub（非公開）で、スマホからも見られる。')} strong />
          <div style={{ fontSize: 22, color: muted, textAlign: 'right' }}>
            <PageLink to={WhatGoesIn}>{t('The two folders side by side (appendix)', '2つのフォルダの比較（付録）')}</PageLink>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 27, color: muted, margin: '22px 0 0' }}>
        {t(
          <>The tool is <b style={{ color: 'var(--osd-text)' }}>memsaga</b>, my personal open-source project (free). Claude Code works as before; the files stay where they are.</>,
          <>ツールは <b style={{ color: 'var(--osd-text)' }}>memsaga</b>（個人で作った無料のオープンソース）。Claude Code の使い方は変わらず、ファイルも元の場所のまま。</>,
        )}
      </p>
      {/* Not spoken: for engineers in the room. */}
      <p style={{ fontSize: 23, color: soft, margin: '10px 0 0' }}>
        {t('How: Claude Code hooks run it at the end of each turn · one small program · about 5 ms for most tool calls ·', '仕組み：Claude Code のフック（hooks）から各ターンの終わりに実行／小さなプログラム1つ／ツール呼び出し1回あたり約 5 ms（ほとんどの場合）／')}{' '}
        <PageLink to={OneRecord}>{t('one record, in full (appendix)', '記録1件の全体（付録）')}</PageLink>
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
    <Content eyebrow={t('A real case, simplified · answers ③', '実例（表示は簡略化）· ③ への答え')} heading={t('“Did you add this rule yourself?”', '「このルール、自分で追加した？」')} headingSize={66}>
      <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
        <FlowBox label={t('A rule in my CLAUDE.md', '私の CLAUDE.md にあるルール')} body={t('“Always run the tests first.”', '「必ず先にテストを実行する」')} />
        <Arrow />
        <FlowBox label={t('The record that added it', 'それを追加した記録')} body={<>{t('Tue 14:02', '火 14:02')}<br />{t('session “fix flaky login test”', 'セッション「不安定なログインテストを直す」')}</>} />
        <Arrow />
        <FlowBox label={t('That session’s saved conversation', 'そのセッションの保存された会話')} body={t('The conversation that led to it', '追加に至った会話')} accent />
      </div>
      <p style={{ fontSize: 33, lineHeight: 1.5, margin: '40px 0 0', maxWidth: 1620 }}>
        {t('I did not search myself. Claude Code looked it up in the history. Yes, it had added the rule, and its reply back then said so. I had missed that line.', '自分では調べていません。Claude Code が履歴をたどってくれました。追加したのは、やはり Claude Code。追加したときの返信でも、そう伝えてくれていました。私が見落としていたのです。')}
      </p>
      <p style={{ fontSize: 33, lineHeight: 1.5, margin: '22px 0 0', fontWeight: 700 }}>
        {t('My rule since: memory and skills, Claude Code edits and tells me. CLAUDE.md waits for my OK. If I miss a line again, the history still has it.', 'それ以来のルール：メモリとスキルは Claude Code が編集して報告。CLAUDE.md は私が OK してから。また見落としても、履歴に残っている。')}
      </p>
      {/* Not spoken: more questions the history answered (from the Taipei deck). */}
      <p style={{ fontSize: 24, color: muted, margin: '34px 0 0', lineHeight: 1.5 }}>
        {t('Questions like this: about 12 in two months, from me and from other sessions. For example:', 'こうした質問は2か月で約12回（私からも、別のセッションからも）。たとえば：')}{' '}
        {t('“Which version of the skill did you load?” · “What did the other session just change?” · “Where did this file go?”', '「どのバージョンのスキルを読み込んだ？」「別のセッションがさっき何を変えた？」「このファイルはどこへ行った？」')}
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
    <Content eyebrow={t('What changed for me · answers ②', '私にとって変わったこと · ② への答え')} heading={t<ReactNode>('Undo took away the fear. Now I hand over the cleanup.', <>元に戻せるから、怖くない。<br />整理を任せられるようになった</>)} headingSize={62}>
      <div style={{ display: 'flex', gap: 60, marginTop: 56 }}>
        <Big n={t('~90', '約90')} head={t('files deleted so far', 'これまでに削除したファイル')} body={t('As Claude Code reorganized its memory. Every one can come back.', 'Claude Code がメモリを整理する中で。どれも元に戻せる。')} />
        <Big n="70" head={t('recorded changes to one skill (two months)', '1つのスキルの変更記録（2か月間）')} body={t('Small steps, each with its session. That is how a skill gets better.', '小さな変更を、それぞれセッション名つきで。スキルはこうして良くなる。')} />
        <Big n="2" head={t('times my own tool, memsaga, broke files', '自作ツール memsaga のバグでファイルが壊れた回数')} body={t('A sync bug, twice. The history undid both, and both are fixed.', '同期のバグで2回。どちらも履歴で元に戻し、修正済み。')} />
      </div>
      <p style={{ fontSize: 38, lineHeight: 1.45, margin: '64px 0 0', fontWeight: 700 }}>
        {t('Like a seatbelt: I rarely need it, but I drive differently because it is there.', 'シートベルトのようなもの。めったに出番はないけれど、あるから安心して運転できる。')}
      </p>
      <p style={{ fontSize: 25, color: muted, margin: '12px 0 0' }}>
        {t('So far, the only real undos were those two bugs in my own tool. Claude Code’s cleanups have not needed one yet.', 'これまで実際に元に戻したのは、自作ツールのバグの2回だけ。Claude Code の整理では、まだ一度も必要になっていません。')}
      </p>
      <p style={{ fontSize: 24, color: muted, margin: '40px 0 0' }}>
        {t('Anthropic’s guide also says to improve a skill step by step:', 'Anthropic のガイドでも、スキルは少しずつ改善していくものとされています：')}{' '}
        <A href={t(URL_SKILL_GUIDE_EN, URL_SKILL_GUIDE_JA)}>{t('“Skill authoring best practices”, Evaluation and iteration', '「スキル作成のベストプラクティス」の「評価と反復」')}</A>
      </p>
    </Content>
  );

  // ---------- 8. close ----------

  const Close: Page = () => (
    <div lang={lang} style={{ ...fill, ...jaBreak(), padding: `110px ${PAD}px 0`, display: 'flex', gap: 70 }}>
      <div style={{ flex: 1 }}>
        <Eyebrow>{t('Systems that don’t break when you hand work to Claude', 'Claude に任せても壊れない仕組み')}</Eyebrow>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.15, margin: '40px 0 0', letterSpacing: '-0.02em' }}>
          {t(
            <>See every change.<br />Undo any change.<br /><span style={{ color: 'var(--osd-accent)' }}>Then hand it over.</span></>,
            <>すべての変更が見える。<br />どの変更も戻せる。<br /><span style={{ color: 'var(--osd-accent)' }}>だから任せられる。</span></>,
          )}
        </div>
        <p style={{ fontSize: 32, color: muted, margin: '48px 0 0', lineHeight: 1.5 }}>
          {t('The idea needs no special tool: any Git history of these files helps.', '特別なツールは要りません。これらのファイルを Git で履歴に残すだけでも役に立ちます。')}
        </p>
        <p style={{ fontSize: 28, color: muted, margin: '20px 0 0', lineHeight: 1.6 }}>
          {t('Mine:', '私のツール：')} <A href={URL_SITE}>memsaga.grimmer.io</A> · {t('free and open source (MIT) · macOS and Linux', '無料・オープンソース（MIT）／macOS・Linux 対応')}
          <br />
          {t('These slides:', 'このスライド：')} <A href={slidesUrl}>{slidesUrl.replace('https://', '')}</A>
        </p>
        <p style={{ fontSize: 40, fontWeight: 700, margin: '44px 0 0' }}>{t('Thank you!', 'ありがとうございました')}</p>
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
    <Content eyebrow={t('Appendix · The big picture, in detail', '付録 · 全体像の詳細')} heading={t('Which Claude reads which place', 'どの Claude がどこを読むか')} headingSize={56}>
      <div style={{ display: 'grid', gridTemplateColumns: '400px 410px 410px 410px', fontSize: 24, border: `1px solid ${rule}`, borderRadius: 'var(--osd-radius)', overflow: 'hidden', width: 1630, marginTop: 30 }}>
        <Cell head>{t('Where you use Claude', 'Claude を使う場所')}</Cell>
        <Cell head>{PLACE_APP.title}<div style={{ fontWeight: 400, fontSize: 21 }}>{PLACE_APP.sub}</div></Cell>
        <Cell head>{PLACE_MINE.title}<div style={{ fontWeight: 400, fontSize: 21 }}>{PLACE_MINE.sub}</div></Cell>
        <Cell head>{PLACE_PROJECT.title}<div style={{ fontWeight: 400, fontSize: 21 }}>{PLACE_PROJECT.sub}</div></Cell>

        <Cell>{t('Claude app: chat and Projects', 'Claude アプリ：チャットとプロジェクト')}</Cell>
        <Cell><Mark kind="yes">{t('your instructions, memory and skills (yours, or shared in your organisation)', '指示・メモリ・スキル（自分のもの、または組織で共有されたもの）')}</Mark></Cell>
        <Cell><Mark kind="no">{t('not read', '読まない')}</Mark></Cell>
        <Cell><Mark kind="no">{t('not read', '読まない')}</Mark></Cell>

        <Cell>{t('Scheduled tasks in the cloud', 'クラウドのスケジュールタスク')}</Cell>
        <Cell><Mark kind="yes">{t('skills', 'スキル')}</Mark></Cell>
        <Cell><Mark kind="no">{t('not read, so no auto memory', '読まない（自動メモリもなし）')}</Mark></Cell>
        <Cell><Mark kind="yes">{t('a fresh copy of the project each run, with its skills', '実行のたびにプロジェクトを新しく取得（そのスキルも）')}</Mark></Cell>

        <Cell strong>{t('Claude Code: terminal, or the desktop app’s Code tab', 'Claude Code：ターミナル、またはデスクトップアプリの Code タブ')}</Cell>
        <Cell strong><Mark kind="copy">{t('a downloaded copy of the skills you added in the Claude app (one way)', 'Claude アプリに追加したスキルのコピー（ダウンロードのみ）')}</Mark></Cell>
        <Cell strong><Mark kind="yes"><b>{t('CLAUDE.md, auto memory, skills: what memsaga keeps', 'CLAUDE.md・自動メモリ・スキル：memsaga が記録するもの')}</b></Mark></Cell>
        <Cell strong><Mark kind="yes">{t('CLAUDE.md (or AGENTS.md) and skills', 'CLAUDE.md（または AGENTS.md）とスキル')}</Mark></Cell>
      </div>
      <p style={{ fontSize: 23, color: muted, margin: '18px 0 0', lineHeight: 1.45 }}>
        {t<ReactNode>(<>● reads it<br />○ reads a copy: at the start of each session, Claude Code downloads the skills you added in the Claude app into ~/.claude/skills/synced/, and never uploads<br />— does not</>, <>● 読む<br />○ コピーを読む（セッション開始時に、Claude アプリのスキルを ~/.claude/skills/synced/ にダウンロード。アップロードはしない）<br />— 読まない</>)}
        <br />
        {t('Cowork, part of the Claude app since 10 Nov 2026, uses the app’s skills and does not read ~/.claude. From Anthropic’s docs, 28 Nov 2026; that the desktop Code tab also reads CLAUDE.md and auto memory when a folder is chosen is my own test.', 'Cowork（2026年11月10日から Claude アプリに統合）はアプリのスキルを使い、~/.claude は読みません。Anthropic の公式ドキュメント（2026年11月28日時点）より。デスクトップの Code タブがフォルダを選んだときに CLAUDE.md と自動メモリも読むことは、私自身の検証です。')}
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
    <Content eyebrow={t('Appendix · What goes in', '付録 · 何が記録されるか')} heading={t('A hidden, noisy folder becomes a folder you can browse', '雑多な隠しフォルダを、見やすいフォルダに')} headingSize={54}>
      <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
        <TreeBox title="~/.claude" sub={t('hidden; about 60 items, mostly caches and logs', '隠しフォルダ。約60項目、ほとんどがキャッシュやログ')}>
          <T line="CLAUDE.md" keep note={t('kept', '記録')} />
          <T line="skills/  hooks/  scripts/" keep note={t('kept', '記録')} />
          <T line="projects/" />
          <T line="  -Users-you-code-webapp/" />
          <T line="    memory/" keep note={t('kept', '記録')} />
          <T line="      MEMORY.md  project-notes.md" keep />
          <T line="    3f46…e21.jsonl" note={t('saved conversation, not kept', '保存された会話（記録しない）')} />
          <T line="cache/  telemetry/  paste-cache/" dim />
          <T line="shell-snapshots/  session-env/" dim />
          <T line="file-history/  history.jsonl  …" dim note={t('not kept', '記録しない')} />
        </TreeBox>
        <TreeBox title="memories/" sub={t('your history folder, private on GitHub', '履歴用のフォルダ（GitHub に非公開で保存）')} strong>
          <T line="index.md" keep note={t('~/code/webapp → HOME-code-webapp', '~/code/webapp → HOME-code-webapp')} />
          <T line="claude/" />
          <T line="  CLAUDE.md" keep />
          <T line="  skills/  hooks/  scripts/" keep />
          <T line="  memory/HOME-code-webapp/" keep />
          <T line="    MEMORY.md  project-notes.md" keep />
          <T line="  drafts/" keep note={t('any folder you add', '追加した任意のフォルダ')} />
          <T line="claude-alt/" keep note={t('a second account', '2つ目のアカウント')} />
          <T line="extra/home/" keep note={t('files outside ~/.claude', '~/.claude の外のファイル')} />
          <T line="companion/" keep note={t('your notes on other repositories', 'ほかのリポジトリについてのメモ')} />
        </TreeBox>
      </div>
    </Content>
  );

  // The two kinds of Claude Code files from page 3, as folders. Project files travel with the code in
  // Git; the personal ones, including each project's auto memory, stay in ~/.claude.
  const ProjectFiles: Page = () => (
    <Content eyebrow={t('Appendix · Two kinds of Claude Code files', '付録 · Claude Code の2種類のファイル')} heading={t<ReactNode>('Project files travel with the code; yours stay on your computer', <>プロジェクトのファイルはコードと一緒に、<br />自分のファイルはパソコンの中に</>)} headingSize={52}>
      <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
        <TreeBox title="~/code/webapp/" sub={t('the project’s Git repository (repo), shared with the team, for example on GitHub', 'プロジェクトの Git リポジトリ（repo）。GitHub などでチームと共有')}>
          <T line="CLAUDE.md" keep note={t('instructions for everyone on the project', 'プロジェクトの全員への指示')} />
          <T line="AGENTS.md" note={t('read instead, if there is no CLAUDE.md', 'CLAUDE.md がなければ代わりに読む')} />
          <T line=".claude/" />
          <T line="  skills/release-notes/" />
          <T line="    SKILL.md" keep note={t('a skill for this project', 'このプロジェクト用のスキル')} />
          <T line="  settings.json" note={t('shared settings', '共有の設定')} />
          <T line="src/  tests/  …" dim note={t('the code', 'コード')} />
        </TreeBox>
        <TreeBox title="~/.claude/" sub={t('your files, on your computer only', '自分のファイル（このパソコンだけ）')} strong>
          <T line="CLAUDE.md" keep note={t('your instructions, every project', '自分の指示（全プロジェクト共通）')} />
          <T line="skills/" keep note={t('your skills, every project', '自分のスキル（全プロジェクト共通）')} />
          <T line="projects/" />
          <T line="  -Users-you-code-webapp/" />
          <T line="    memory/" keep note={t('auto memory for this project', 'このプロジェクトの自動メモリ')} />
          <T line="      MEMORY.md" keep />
        </TreeBox>
      </div>
      <p style={{ fontSize: 27, color: muted, margin: '30px 0 0', lineHeight: 1.45 }}>
        {t('Project files get Git history when you commit them with the code. Your files in ~/.claude, including each project’s auto memory, get none: that is the gap memsaga fills.', 'プロジェクトのファイルは、コードと一緒にコミットすれば Git の履歴が残ります。~/.claude の自分のファイル（各プロジェクトの自動メモリも含む）には残りません。そこを埋めるのが memsaga です。')}
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
    <Content eyebrow={t('Appendix · How it works', '付録 · 仕組み')} heading={t('One record, in full', '記録1件の中身')}>
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
          <Pt lead={t('First line:', '1行目：')}>{t('the session’s title, and which folder changed.', 'セッションのタイトルと、変更されたフォルダ。')}</Pt>
          <Pt lead="Session:">{t('the ID to reopen that session, or to read its saved conversation.', 'そのセッションを再開したり、保存された会話を読んだりするための ID。')}</Pt>
          <Pt lead="Account:">{t('which Claude Code account, when you use more than one.', 'どの Claude Code アカウントか（複数使う場合）。')}</Pt>
          <Pt lead="Agent:">{t('main, or the name of the subagent that made the edit.', 'main、または編集したサブエージェントの名前。')}</Pt>
          <Pt lead={t('When:', 'いつ：')}>{t('one record per turn that changed something; Git adds the time.', '何かが変わったターンごとに1件。時刻は Git が付ける。')}</Pt>
        </div>
      </div>
      <p style={{ fontSize: 24, color: muted, margin: '26px 0 0' }}>
        {t('A record holds every change since the last one, including your own edits; it is named after the session whose turn just ended.', '1件の記録には前回からのすべての変更（自分の手での編集も）が入り、ちょうどターンを終えたセッションの名前が付きます。')}
      </p>
    </Content>
  );

  const NeedIt: Page = () => (
    <Content eyebrow={t('Appendix · Do you need memsaga?', '付録 · memsaga は必要？')} heading={t('Maybe not', '必要ないかも')}>
      <div style={{ display: 'flex', gap: 40, marginTop: 34, alignItems: 'stretch' }}>
        <Card title={t('You may not need it, if…', '必要ないかもしれない場合')}>
          <Item mark="1" color={muted}>
            {t(
              <>One account on one computer: put <Code>~/.claude</Code> in Git yourself, keep only the files you want, and commit at the end of each session.</>,
              <>アカウント1つ・パソコン1台なら：<Code>~/.claude</Code> を自分で Git 管理し、必要なファイルだけ残して、セッションの終わりにコミットする。</>,
            )}
          </Item>
          <Item mark="2" color={muted}>
            {t('You already keep your notes in a system you built yourself, outside Claude Code’s files.', 'Claude Code のファイルとは別に、自分で作った仕組みでメモを管理している。')}
          </Item>
          <Item mark="3" color={muted}>
            {t(
              <>You are on Windows: <A href={URL_ENGRAM}>Engram</A> is a similar tool.</>,
              <>Windows を使っている：似たツールに <A href={URL_ENGRAM}>Engram</A> があります。</>,
            )}
          </Item>
        </Card>
        <Card title={t('What memsaga adds', 'memsaga が加えるもの')} strong>
          <Item mark="A" color={teal}>{t('Which session made each change', 'どのセッションが変更したか')}</Item>
          <Item mark="B" color={teal}>{t('History kept apart from the live files', '実際のファイルとは別の場所に履歴を保存')}</Item>
          <Item mark="C" color={teal}>{t('Several accounts and computers; edits from GitHub or a phone come back', '複数のアカウントとパソコンに対応。GitHub やスマホでの編集も反映')}</Item>
          <Item mark="D" color={teal}>{t(<>Any file you choose, even outside <Code>~/.claude</Code></>, <>好きなファイルを追加できる（<Code>~/.claude</Code> の外も）</>)}</Item>
          <Item mark="E" color={teal}>{t('History from before you installed it, rebuilt from saved conversations', '導入前の履歴も、保存された会話から再構築')}</Item>
          <Item mark="F" color={teal}>{t('New lines that look like an API key are held back, not committed', 'API キーらしき行が増えたら、コミットせずに保留')}</Item>
          <Item mark="G" color={teal}>{t('Companion docs: your notes and translations beside a repository you must not commit to', 'コミットできないリポジトリ用のメモや翻訳を、別の場所に保存（コンパニオン文書）')}</Item>
        </Card>
      </div>
      <p style={{ fontSize: 25, color: muted, margin: '22px 0 0' }}>
        {t('The full comparison:', '詳しい比較：')} <A href={URL_NEED}>{t('README, “Do you need memsaga?”', 'README「Do you need memsaga?」')}</A> ·{' '}
        {t('A longer English version:', 'より詳しい英語版：')} <A href={URL_TAIPEI}>{t('Taipei, 26 Nov', '台北、11月26日')}</A>
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
    <Content eyebrow={t('Appendix · For the panel', '付録 · 座談会用')} heading={t('What goes where, and how I review it', '何をどこに書くか、どうレビューするか')}>
      <div style={{ display: 'flex', gap: 40, marginTop: 40, alignItems: 'stretch' }}>
        <Card title={t('What goes where (my rule of thumb)', '何をどこに（私の目安）')}>
          <div style={{ marginTop: 6 }}>
            <Rule name="CLAUDE.md">{t('Rules that must hold in every session. Keep it short: it is read every time.', 'すべてのセッションで守るべきルール。毎回読まれるので短く。')}</Rule>
            <Rule name={t('Skills', 'スキル')}>{t('Steps for one kind of task, loaded only when needed.', 'ある種類の作業の手順。必要なときだけ読み込まれる。')}</Rule>
            <Rule name={t('Memory', 'メモリ')}>{t('Facts about one project, and anything that changes or expires.', '1つのプロジェクトについての事実や、変わるもの・期限があるもの。')}</Rule>
            <Rule name={t('A hook (an automatic check)', 'フック（自動チェック）')}>{t('A rule a script can check. Do not add more text for it.', 'スクリプトで確認できるルール。文章を増やさず、チェックにする。')}</Rule>
          </div>
        </Card>
        <Card title={t('How I review it', 'どうレビューするか')} strong>
          <div style={{ marginTop: 6 }}>
            <Item mark="1" color={teal}>{t('Claude Code edits memory and skills, then tells me. CLAUDE.md waits for my OK.', 'メモリとスキルは Claude Code が編集して報告。CLAUDE.md は私の OK を待つ。')}</Item>
            <Item mark="2" color={teal}>{t('When something looks off, the history shows what changed, in which session, and lets me undo it.', 'おかしいと思ったら、何が、どのセッションで変わったかを履歴で確認し、元に戻せる。')}</Item>
            <Item mark="3" color={teal}>{t('For the why, Claude Code reads that session’s saved conversation (kept 30 days by default in the terminal), so it can explain any change.', '理由は、Claude Code がそのセッションの保存された会話（ターミナルではデフォルトで30日保存）を読んで説明してくれる。')}</Item>
            <Item mark="4" color={teal}>{t('Now and then, a tidy-up session: merge duplicates, delete stale notes.', 'ときどき整理用のセッション：重複をまとめ、古いメモを消す。')}</Item>
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
    <Content eyebrow={t('Appendix · For the panel', '付録 · 座談会用')} heading={t('Sharing skills and settings', 'スキルと設定の共有')}>
      <div style={{ display: 'flex', gap: 30, marginTop: 40, alignItems: 'stretch' }}>
        <Card title={<NumTitle n="1">{t('My computers', '自分のパソコン')}</NumTitle>}>
          <Pt lead={t('One private repository', '非公開のリポジトリ1つ：')}>{t('on GitHub holds the history.', 'GitHub 上で履歴を保存。')}</Pt>
          <Pt lead={t('Another Mac:', '別の Mac：')}>{t('copy it once, run one restore command, and CLAUDE.md, skills and memory are back.', '一度コピーして復元コマンドを1回実行すれば、CLAUDE.md・スキル・メモリが戻る。')}</Pt>
          <Pt lead={t('From a phone:', 'スマホから：')}>{t('an edit on GitHub comes back to the file Claude Code reads.', 'GitHub での編集が、Claude Code の読むファイルに反映される。')}</Pt>
        </Card>
        <Card title={<NumTitle n="2">{t('My two accounts', '自分の2つのアカウント')}</NumTitle>}>
          <Pt lead={t('Shared files:', '共有ファイル：')}>{t(
            <>two Claude Code accounts on one Mac use one CLAUDE.md, skills and memory; my Mac app <A href={URL_CODEV}>CodeV</A> links them.</>,
            <>1台の Mac で2つの Claude Code アカウントが、同じ CLAUDE.md・スキル・メモリを使う。自作の Mac アプリ <A href={URL_CODEV}>CodeV</A> でリンク。</>,
          )}</Pt>
          <Pt lead={t('One history:', '履歴は1つ：')}>{t('memsaga records both and labels each change with its account.', 'memsaga が両方を記録し、変更ごとにアカウント名を付ける。')}</Pt>
        </Card>
        <Card title={<NumTitle n="3">{t('A team', 'チーム')}</NumTitle>}>
          <Pt lead={t('In the project:', 'プロジェクトに：')}>{t('CLAUDE.md (or AGENTS.md) and skills in the repository; everyone’s Claude Code reads them.', 'リポジトリに CLAUDE.md（または AGENTS.md）とスキルを置けば、全員の Claude Code が読む。')}</Pt>
          <Pt lead={t('Claude app (Team, Enterprise):', 'Claude アプリ（Team・Enterprise）：')}>{t('publish a skill to the organisation.', 'スキルを組織に公開できる。')}</Pt>
          <Pt lead={t('Plugins:', 'プラグイン：')}>{t('an owner can install one for everyone.', 'オーナーが全員にインストールできる。')}</Pt>
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
    <Content eyebrow={t('Appendix · Two months of my own data', '付録 · 2か月分の自分のデータ')} heading={t('Too many changes to follow from memory', '記憶だけでは追えない量の変更')}>
      <div style={{ display: 'flex', gap: 60, marginTop: 64 }}>
        <Stat n="25" label={t('sessions changed CLAUDE.md', 'CLAUDE.md を変更したセッション')} />
        <Stat n="57" label={t('sessions changed skills', 'スキルを変更したセッション')} />
        <Stat n="136" label={t('sessions changed memory', 'メモリを変更したセッション')} />
      </div>
      <div style={{ marginTop: 64 }}>
        <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1, color: 'var(--osd-accent)' }}>{t('~12', '約12回')}</div>
        <div style={{ fontSize: 30, color: muted, marginTop: 14 }}>{t('times “when and why did this change?” was answered from the history', '「いつ、なぜ変わった？」に履歴で答えられた')}</div>
      </div>
      <p style={{ fontSize: 25, color: muted, margin: '40px 0 0' }}>
        {t('Since 20 Sep 2026. On the first day, 502 earlier records (July to September) were rebuilt from Claude Code’s saved conversations.', '2026年9月20日以降。初日に、それ以前（7〜9月）の記録502件を Claude Code の保存された会話から再構築。')}
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
    <Content eyebrow={t('Appendix · Two more side projects', '付録 · ほかの個人プロジェクト')} heading={t('Also free and open source', 'こちらも無料・オープンソース')}>
      <Extra
        icon={matchapackIcon}
        qr={matchapackQr}
        name="matchapack"
        href={URL_MATCHAPACK}
        status={t('first released 2026-11-24', '2026-11-24 初公開')}
        line={t('Each extra git worktree’s node_modules costs almost no disk: savings like pnpm’s, but the exact tree plain npm or Yarn 1 builds.', 'git worktree を増やしても、node_modules がほとんどディスクを使わない。pnpm 並みの節約で、npm や Yarn 1 とまったく同じツリー。')}
      >
        <div style={{ fontSize: 25, color: muted, marginTop: 8 }}>
          {t('Measured, 10 worktrees: 20.68 GiB with plain npm → 61 MiB + one 1.82 GiB store', '実測（worktree 10個）：npm のみで 20.68 GiB → 61 MiB ＋ 共有ストア 1.82 GiB')} · <Code>brew install grimmerk/tap/matchapack</Code>
        </div>
      </Extra>
      <Extra
        icon={codevIcon}
        qr={codevQr}
        name="CodeV"
        href={URL_CODEV}
        status="macOS"
        line={t('A Mac app for Claude Code: session switcher, project launcher, built-in terminal, and several accounts sharing one CLAUDE.md, skills and memory.', 'Claude Code 用の Mac アプリ：セッション切り替え、プロジェクトランチャー、内蔵ターミナル、複数アカウントでの CLAUDE.md・スキル・メモリの共有。')}
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
    // Page 8 again, so skimming to the end of the appendix lands on the close, not a side project.
    Close,
  ];

  // The talk script, in simple English (the venue plans an app for live machine interpretation:
  // short sentences, one idea each). About 440 words for the eight main pages: about 4 minutes at 110-120 words a minute, plus the Japanese greeting and page turns; page 3's unstarred line is the first cut.
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
How does Claude Code remember?
Claude Code is Claude working on your computer.
A session is one conversation with it.
Each session starts with no memory. So Claude Code keeps notes in files.
On Monday I say: "Remember, start the database before the tests."
Claude Code writes that into its auto memory. On Tuesday, a new session reads it first.
Three kinds of files. CLAUDE.md: instructions it reads every time.
Auto memory: its own notes.
Skills: how-to guides for one kind of task.`,
    `~20s. (Short on time: say only the lines marked *.)
* The last talk built its own memory system, with Markdown and Git.
* Mine is about the files Claude Code already has, and changes on its own.
Project files live in the project's repository, so Git keeps their history.
* My own files live in a hidden folder. Nothing keeps their history. That is today's topic.`,
    `~35s.
Claude Code changes these files every day, with no history to look back on.
It is like a document we both edit, with no version history.
You forget what was tried, and try it again.
Rewind only undoes the current session.
And a rule you don't remember appears: when, and why?
So I rarely let Claude Code touch a skill, and never asked it to clean up its memory.`,
    `~30s.
So I wrote a small tool, memsaga.
Git keeps the history of files. Each saved change is a commit.
When Claude Code changes one of these files, memsaga makes a commit, named after the session.
It also keeps them in a private folder I can browse, even on my phone.
Claude Code works as before.`,
    `~35s.
A real case, simplified.
I found a rule in my CLAUDE.md I didn't remember writing.
I asked Claude Code: did you add this yourself?
It checked the history, and read that session's saved conversation.
Yes, it had. Its reply back then said so. I just missed that line.
Now: memory and skills, Claude Code edits and tells me. CLAUDE.md waits for my OK.`,
    `~35s.
Undo took away the fear.
Now Claude Code reorganizes its memory: about 90 files deleted so far, all recoverable.
One skill changed 70 times in two months, each step recorded.
Even my own tool broke files twice. The history undid both, and both are fixed.
It is a seatbelt. I rarely need it, but I drive differently because it is there.
(Optional: Those two were my only real undos so far. Claude Code's cleanups have not needed one.)`,
    `~20s.
Today's theme is systems that don't break when you hand work to Claude.
My system is simple. I can see every change, and undo any change. So I can hand the work over.
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
    `The closing page (same as page 8), so the deck ends here rather than on the appendix.`,
  ];

  // Each page re-renders when the language changes; PageLink keeps indexing the unwrapped pages.
  const withLang = (P: Page): Page => {
    const Wrapped: Page = () => {
      useLang();
      return <P />;
    };
    return Wrapped;
  };

  return { design, pages: pages.map(withLang), notes };
}
