#!/usr/bin/env node

import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.DATAB_EACH_PORT || process.env.PORT || 43173);
const GAME_INDEX = path.join(ROOT, "three-js", "index.html");

const MIME_TYPES = {
  ".avif": "image/avif",
  ".bin": "application/octet-stream",
  ".css": "text/css; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".glsl": "text/plain; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".m4a": "audio/mp4",
  ".map": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const filePath = path.resolve(root, `.${decoded}`);
  const prefix = `${root}${path.sep}`;
  if (filePath !== root && !filePath.startsWith(prefix)) return null;
  return filePath;
}

async function sendFile(response, filePath) {
  const data = await fs.readFile(filePath);
  const type = MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": type,
    "content-length": data.length,
  });
  response.end(data);
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
    let pathname = url.pathname;

    if (pathname === "/three-js/") {
      response.writeHead(308, { location: "/three-js" });
      response.end();
      return;
    }

    if (pathname === "/" || pathname === "/three-js") {
      await sendFile(response, GAME_INDEX);
      return;
    }

    const filePath = safeJoin(ROOT, pathname);
    if (!filePath) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("forbidden");
      return;
    }

    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await sendFile(response, path.join(filePath, "index.html"));
        return;
      }
      await sendFile(response, filePath);
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? error.code : "";
      response.writeHead(code === "ENOENT" ? 404 : 500, { "content-type": "text/plain; charset=utf-8" });
      response.end(code === "ENOENT" ? "not found" : "unable to read file");
    }
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "server error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Data B-each Three.js at http://127.0.0.1:${PORT}/three-js`);
});
