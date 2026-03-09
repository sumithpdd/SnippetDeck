'use client';

import { useState, useCallback } from 'react';

export function useClipboard(durationMs = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    (id: string, text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), durationMs);
        })
        .catch(() => {
          // Clipboard API can fail if the document is not focused or
          // permissions are denied. No-op — button simply won't show "Copied!".
        });
    },
    [durationMs]
  );

  return { copiedId, copy };
}
