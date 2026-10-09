import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface VideoModalProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  /** Accessible name for the dialog and the player frame. */
  title?: string;
}

const YT_ORIGIN = 'https://www.youtube.com';

/** Where the viewer left a video, so reopening it carries on from there. */
interface Progress {
  videoId: string;
  seconds: number;
}

/*
 * Playback model: the player exists only while the dialog is open.
 *  - Opening mounts the iframe with autoplay, inside the click that opened it.
 *  - Closing unmounts the iframe, which is the one way to stop the audio that
 *    cannot fail (a "pause" command to a hidden player can be lost if the
 *    player has not finished loading).
 *  - While it plays, the player reports its position. Reopening the same video
 *    resumes from that position; if the reports never arrive, it simply starts
 *    from the beginning.
 * Play, pause and seeking in between belong to YouTube's own controls.
 */
export default function VideoModal({ videoId, isOpen, onClose, title = 'DROS video' }: VideoModalProps) {
  const progress = useRef<Progress>({ videoId, seconds: 0 });

  if (!isOpen) return null;

  // Rendered into <body> so a transformed ancestor (scroll-reveal wrappers)
  // cannot capture the fixed overlay.
  return createPortal(
    <VideoDialog videoId={videoId} title={title} onClose={onClose} progress={progress} />,
    document.body,
  );
}

function VideoDialog({
  videoId,
  title,
  onClose,
  progress,
}: {
  videoId: string;
  title: string;
  onClose: () => void;
  progress: React.MutableRefObject<Progress>;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Latest onClose without re-running the open/close effect: callers often
  // pass a new function every render, and re-running would yank focus out of
  // the player mid-playback.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Built once per open. The src must never change while the dialog is up:
  // any change reloads the iframe and restarts the video.
  const [src] = useState(() => {
    const start = progress.current.videoId === videoId ? Math.floor(progress.current.seconds) : 0;
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      playsinline: '1',
      enablejsapi: '1',
      origin: window.location.origin,
    });
    if (start > 0) params.set('start', String(start));
    return `${YT_ORIGIN}/embed/${videoId}?${params}`;
  });

  // Track the playback position reported by the player, and store it on close.
  useEffect(() => {
    let seconds = progress.current.videoId === videoId ? progress.current.seconds : 0;
    let duration = 0;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== frameRef.current?.contentWindow) return;
      let info: { currentTime?: unknown; duration?: unknown } | undefined;
      try {
        info = (typeof e.data === 'string' ? JSON.parse(e.data) : e.data)?.info;
      } catch {
        return;
      }
      if (!info) return;
      if (typeof info.currentTime === 'number') seconds = info.currentTime;
      if (typeof info.duration === 'number' && info.duration > 0) duration = info.duration;
    };

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      // A finished video starts over next time instead of resuming at the end.
      const finished = duration > 0 && seconds >= duration - 5;
      progress.current = { videoId, seconds: finished ? 0 : seconds };
    };
  }, [videoId, progress]);

  // Escape to close, scroll lock (restoring the prior overflow value rather
  // than clearing it, so this composes with other scroll-locking UI), and
  // focus handed back to whatever opened the dialog.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  // Ask the player to start reporting its state (current time, duration).
  const subscribe = () => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id: videoId, channel: 'widget' }),
      YT_ORIGIN,
    );
  };

  return (
    <div
      // Above the announcement banner (z-60), which would otherwise sit on
      // top of the backdrop.
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        // Width is also capped by viewport height so the 16:9 frame and the
        // close button always fit on short or landscape screens.
        className="relative w-full max-w-[min(56rem,calc((100vh-7rem)*16/9))] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
          aria-label="Close video"
        >
          <X className="w-4 h-4" />
          Close
        </button>
        <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-[0_32px_80px_rgba(0,0,0,0.7)]" style={{ paddingBottom: '56.25%' }}>
          <iframe
            ref={frameRef}
            className="absolute inset-0 w-full h-full"
            src={src}
            title={title}
            onLoad={subscribe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in  { animation: fade-in  0.2s ease both; }
        .animate-scale-in { animation: scale-in 0.22s ease both; }
      `}</style>
    </div>
  );
}
