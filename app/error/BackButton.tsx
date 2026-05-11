'use client';

export default function BackButton() {
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); history.back(); }}>
      &#8592; Voltar
    </a>
  );
}
