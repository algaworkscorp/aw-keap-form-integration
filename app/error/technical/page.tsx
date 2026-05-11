import BackButton from '../BackButton';
import DebugHint from '../DebugHint';

const styles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; margin: 0; background: #f5f5f5;
  }
  .card {
    background: #fff; border-radius: 8px; padding: 40px 48px;
    max-width: 480px; width: 100%; text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  h1 { font-size: 1.5rem; color: #1a1a1a; margin-bottom: 12px; }
  p { color: #555; line-height: 1.6; margin-bottom: 28px; }
  a { color: #0070f3; text-decoration: none; font-weight: 500; cursor: pointer; }
  a:hover { text-decoration: underline; }
`;

export default async function TechnicalErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ hint?: string }>;
}) {
  const { hint } = await searchParams;

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Erro técnico</title>
        <style>{styles}</style>
      </head>
      <body>
        <div className="card">
          <h1>Erro técnico</h1>
          <p>Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.</p>
          <BackButton />
        </div>
        {hint && <DebugHint hint={hint} />}
      </body>
    </html>
  );
}
