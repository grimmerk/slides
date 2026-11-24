import { type DesignSystem, type Page, type SlideMeta, useIsActivePage } from '@open-slide/core';
import { useEffect, useRef } from 'react';
import hero from './assets/hero-light.png';

// Smoke test for the 2026-11 memsaga talks: CJK text with system fonts,
// a local image, a local video, speaker notes.

export const design: DesignSystem = {
  palette: { bg: '#fbfaf7', text: '#1a1814', accent: '#c2410c' },
  fonts: {
    display: '"Hiragino Sans", "PingFang TC", "Noto Sans JP", "Noto Sans TC", system-ui, sans-serif',
    body: '"Hiragino Sans", "PingFang TC", "Noto Sans JP", "Noto Sans TC", system-ui, sans-serif',
  },
  typeScale: { hero: 120, body: 40 },
  radius: 16,
};

const muted = '#6b645a';

const fill = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  boxSizing: 'border-box',
} as const;

const Cover: Page = () => (
  <div style={{ ...fill, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 140px' }}>
    <div style={{ fontSize: 28, color: 'var(--osd-accent)', letterSpacing: '0.2em' }}>SMOKE TEST</div>
    <h1 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero)', fontWeight: 800, lineHeight: 1.15, margin: '32px 0' }}>
      Claude に記憶を安心して整理させる
    </h1>
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, margin: 0 }}>
      用 memsaga 替 CLAUDE.md、memory、skills 加 Git 歷史
    </p>
  </div>
);

const ImagePage: Page = () => (
  <div style={{ ...fill, display: 'flex', flexDirection: 'column', padding: 120, gap: 48 }}>
    <h2 style={{ fontSize: 64, fontWeight: 800, margin: 0 }}>A local image</h2>
    <img src={hero} alt="memsaga hero: every Claude Code turn becomes a commit" style={{ width: 1680, height: 640, objectFit: 'contain', borderRadius: 'var(--osd-radius)' }} />
  </div>
);

const DemoVideo = () => {
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
  return (
    <video
      ref={ref}
      src={new URL('./assets/demo.mp4', import.meta.url).href}
      muted
      playsInline
      controls
      style={{ width: 1440, height: 720, background: '#000', borderRadius: 'var(--osd-radius)' }}
    />
  );
};

const VideoPage: Page = () => (
  <div style={{ ...fill, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 100, gap: 40 }}>
    <h2 style={{ fontSize: 64, fontWeight: 800, margin: 0, alignSelf: 'flex-start' }}>A local video (plays when the page is active)</h2>
    <DemoVideo />
  </div>
);

export const notes: (string | undefined)[] = [
  'Cover: Japanese and Traditional Chinese with system fonts only.',
  'Image: imported as a module, so the build fingerprints it.',
  'Video: should start when this page becomes active and pause when you leave.',
];

export const meta: SlideMeta = {
  title: 'Smoke test',
  createdAt: '2026-11-24T14:30:42.962Z',
};

export default [Cover, ImagePage, VideoPage] satisfies Page[];
