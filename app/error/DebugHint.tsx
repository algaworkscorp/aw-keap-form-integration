'use client';

import { useEffect, useRef } from 'react';

export default function DebugHint({ hint }: { hint: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        dialogRef.current?.showModal();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <dialog ref={dialogRef} style={dialogStyle}>
      <h2 style={{ marginTop: 0, fontSize: '1rem' }}>Diagnóstico do erro</h2>
      <p style={{ fontFamily: 'monospace', wordBreak: 'break-word', fontSize: '0.85rem' }}>
        {hint}
      </p>
      <form method="dialog" style={{ textAlign: 'right' }}>
        <button style={buttonStyle}>Fechar</button>
      </form>
    </dialog>
  );
}

const dialogStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '24px',
  maxWidth: '480px',
  width: '90%',
  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
};

const buttonStyle: React.CSSProperties = {
  background: '#0070f3',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 20px',
  cursor: 'pointer',
  fontSize: '0.9rem',
};
