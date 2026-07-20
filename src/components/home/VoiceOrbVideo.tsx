import { useEffect, useRef } from 'react';

/* The source clip (public/orb/ai-agent-orb.*) renders the liquid orb on a
   flat #CCCCCC backdrop. Video containers don't reliably support alpha
   across browsers, so instead we draw each frame to a canvas and key the
   flat background out per-pixel - the canvas then composites with true
   transparency against whatever sits behind it (the glass card). */
const BG = { r: 204, g: 204, b: 204 };
const INNER = 18; // fully transparent within this color-distance
const OUTER = 46; // fully opaque beyond this distance; feathered between

function keyOutBackground(frame: ImageData) {
  const data = frame.data;
  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - BG.r;
    const dg = data[i + 1] - BG.g;
    const db = data[i + 2] - BG.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist <= INNER) {
      data[i + 3] = 0;
    } else if (dist < OUTER) {
      data[i + 3] = Math.round((255 * (dist - INNER)) / (OUTER - INNER));
    }
  }
}

export default function VoiceOrbVideo({ size }: { size: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = Math.round(size * dpr);
    canvas.width = px;
    canvas.height = px;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let rafId = 0;
    let cancelled = false;

    function drawFrame() {
      if (cancelled || !ctx || !video) return;
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, px, px);
        try {
          const frame = ctx.getImageData(0, 0, px, px);
          keyOutBackground(frame);
          ctx.putImageData(frame, 0, 0);
        } catch {
          // transient decode error mid-frame; next tick recovers
        }
      }
      if (!reduced && !cancelled) {
        rafId = requestAnimationFrame(drawFrame);
      }
    }

    if (reduced) {
      const onReady = () => drawFrame();
      video.addEventListener('loadeddata', onReady, { once: true });
      return () => {
        cancelled = true;
        video.removeEventListener('loadeddata', onReady);
      };
    }

    video.play().catch(() => {});
    rafId = requestAnimationFrame(drawFrame);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [size]);

  return (
    <>
      <video ref={videoRef} className="hidden" muted loop playsInline aria-hidden="true">
        <source src="/orb/ai-agent-orb.webm" type="video/webm" />
        <source src="/orb/ai-agent-orb.mp4" type="video/mp4" />
      </video>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block rounded-full"
        aria-hidden="true"
      />
    </>
  );
}
