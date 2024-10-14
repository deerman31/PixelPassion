import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

function handler(_req: Request): Response {
  const html = `
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deno Web Server</title>
      </head>
      <body>
        <h1>こんにちは、Deno!</h1>
        <p>これはDenoで作成されたシンプルなWebページです。</p>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

console.log("サーバーを起動します...");
let port = Deno.env.get("FRONTEND_DENO_PORT") || "8000";

await serve(handler, { port: parseInt(port) });
