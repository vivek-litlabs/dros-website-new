export const route = '/api-docs';
import { useEffect } from 'react';

export default function RedirectToApiDocs() {
  useEffect(() => {
    window.location.href = 'https://app.dros.ai/api-docs';
  }, []);

  return null;
}
