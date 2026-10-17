import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const envPath = resolve(root, ".env");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};
const allowedStyles = {
  ambient: "airy ambient visual art, deep atmospheric gradients, orbital linework and delicate luminous detail",
  synth: "retro synthwave record sleeve, analog futurism, sunset glow, geometric horizon and sharp perspective",
  jazz: "modern jazz album artwork, tactile editorial composition, confident negative space and expressive abstract shapes",
  brutal: "bold brutalist music artwork, graphic color blocking, cut paper collage, imperfect print texture and raw geometry"
};
const allowedPalettes = {
  night: "cool sea-glass mint, deep petrol blue, pale acid-lime accents",
  sunset: "warm peach, plum, burnt coral and golden amber",
  mono: "soft ivory, charcoal, stone grey and muted silver",
  acid: "acid lime, electric indigo, hot pink and deep violet"
};
const requestsByIp = new Map();

await loadEnvironment();

async function loadEnvironment() {
  try {
    const file = await readFile(envPath, "utf8");
    for (const line of file.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match || match[1] in process.env) continue;
      process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(body));
}

async function readJson(request, limit = 8_000) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error("Request is too large."), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 });
  }
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = requestsByIp.get(ip);
  if (!record || now - record.startedAt > 60_000) {
    requestsByIp.set(ip, { startedAt: now, count: 1 });
    return true;
  }
  if (record.count >= 3) return false;
  record.count += 1;
  return true;
}

function buildPrompt({ idea, style, palette }) {
  return [
    "Create original square 1:1 background artwork for a contemporary music release cover.",
    `Visual direction: ${allowedStyles[style]}.`,
    `Color palette: ${allowedPalettes[palette]}.`,
    `Concept from the artist: ${idea}`,
    "Make it feel art-directed, distinctive and print-ready, with a cohesive composition and tactile detail.",
    "Keep the lower quarter relatively calm and dark enough for white title typography that will be added later.",
    "The top-left area should have some breathing room for a small artist credit.",
    "Generate background artwork only. Do not include any text, letters, numbers, logos, signatures, watermarks, UI, mockups, borders, or album-cover objects placed on a desk."
  ].join("\n");
}

async function handleGeneration(request, response) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_api_key_here") {
    sendJson(response, 503, { error: "Добавь API-ключ в файл .env и перезапусти Cover Lab." });
    return;
  }
  if (!checkRateLimit(request.socket.remoteAddress || "local")) {
    sendJson(response, 429, { error: "Слишком много запросов. Подожди минуту и попробуй снова." });
    return;
  }

  let body;
  try {
    body = await readJson(request);
  } catch (error) {
    sendJson(response, error.status || 400, { error: error.message });
    return;
  }

  const idea = typeof body.idea === "string" ? body.idea.trim() : "";
  const style = typeof body.style === "string" ? body.style : "";
  const palette = typeof body.palette === "string" ? body.palette : "";
  if (!idea || idea.length > 600 || !(style in allowedStyles) || !(palette in allowedPalettes)) {
    sendJson(response, 400, { error: "Проверь описание, стиль и палитру обложки." });
    return;
  }

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      signal: AbortSignal.timeout(120_000),
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-2.5-flare",
        prompt: buildPrompt({ idea, style, palette }),
        size: "1024x1024",
        quality: "medium",
        output_format: "png",
        n: 1
      })
    });
    const result = await apiResponse.json().catch(() => ({}));
    if (!apiResponse.ok) {
      const apiMessage = result.error?.message || "Unknown image generation error";
      console.error(`OpenAI image request failed (${apiResponse.status}): ${apiMessage}`);
      if (apiResponse.status === 401) {
        sendJson(response, 502, { error: "API-ключ не принят. Проверь его в .env." });
      } else if (apiResponse.status === 429) {
        sendJson(response, 429, { error: "Не удалось создать картинку: проверь лимит или баланс API-аккаунта." });
      } else {
        sendJson(response, 502, { error: "Сервис генерации не смог создать изображение. Попробуй ещё раз." });
      }
      return;
    }

    const image = result.data?.[0]?.b64_json;
    if (!image) {
      console.error("OpenAI image request completed without image data.");
      sendJson(response, 502, { error: "Сервис не вернул изображение. Попробуй ещё раз." });
      return;
    }
    sendJson(response, 200, { image });
  } catch (error) {
    console.error(`Image generation request failed: ${error.message}`);
    const timedOut = error.name === "TimeoutError" || error.name === "AbortError";
    sendJson(response, 502, { error: timedOut ? "Генерация заняла слишком много времени. Попробуй ещё раз." : "Не удалось подключиться к сервису генерации." });
  }
}

async function handleStatic(pathname, response) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = resolve(root, `.${requestedPath}`);
  const relativePath = relative(root, filePath);
  if (relativePath.startsWith(`..${sep}`) || relativePath === ".." || relativePath.startsWith(sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache"
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (request.method === "POST" && url.pathname === "/api/generate-cover") {
    await handleGeneration(request, response);
    return;
  }
  if (url.pathname.startsWith("/api/")) {
    sendJson(response, 404, { error: "Неизвестный API-маршрут." });
    return;
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { "Allow": "GET, HEAD" }).end();
    return;
  }
  await handleStatic(decodeURIComponent(url.pathname), response);
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, "127.0.0.1", () => {
  console.log(`Cover Lab открыт: http://127.0.0.1:${port}`);
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_api_key_here") {
    console.log("Добавь свой ключ OpenAI в .env, чтобы включить генерацию фона.");
  }
});
