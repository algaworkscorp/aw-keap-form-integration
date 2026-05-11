import BackButton from '../BackButton';

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

export default function ValidationErrorPage() {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Campos inválidos ou ausentes</title>
        <style>{styles}</style>
      </head>
      <body>
        <div className="card">
          <h1>Campos inválidos ou ausentes</h1>
          <p>
            Um ou mais campos obrigatórios não foram preenchidos corretamente.
            Por favor, verifique as informações e tente novamente.
          </p>
          <BackButton />
        </div>
      </body>
    </html>
  );
}
