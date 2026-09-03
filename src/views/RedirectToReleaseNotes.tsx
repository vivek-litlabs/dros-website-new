export const route = '/release-notes';
import { useEffect } from 'react';

export default function RedirectToReleaseNotes() {
  useEffect(() => {
    window.location.href = 'https://app.dros.ai/release-notes';
  }, []);

  return null;
}
