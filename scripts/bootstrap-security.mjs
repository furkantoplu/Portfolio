import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const rootDirectory = resolve(import.meta.dirname, "..");
const contents = await readFile(resolve(rootDirectory, ".env"), "utf8");
const environment = {};

for (const rawLine of contents.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith("#")) continue;
  const separator = line.indexOf("=");
  if (separator === -1) continue;
  environment[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
}

const directusUrl = (environment.DIRECTUS_PUBLIC_URL || "http://localhost:8055").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${directusUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.errors?.map((error) => error.message).join("; ") || response.statusText;
    throw new Error(`${options.method || "GET"} ${path}: ${response.status} ${message}`);
  }

  return payload?.data ?? payload;
}

const login = await request("/auth/login", {
  method: "POST",
  body: {
    email: environment.DIRECTUS_ADMIN_EMAIL,
    password: environment.DIRECTUS_ADMIN_PASSWORD,
  },
});

if (!login.access_token) throw new Error("Directus oturum açma yanıtında erişim anahtarı bulunamadı.");

await request("/settings", {
  method: "PATCH",
  token: login.access_token,
  body: {
    project_name: "Furkan Toplu İçerik Yönetimi",
    project_descriptor: "Blog ve çalışma alanları yönetimi",
    project_url: environment.SITE_PUBLIC_URL || "http://localhost:8080",
    default_language: "tr-TR",
    auth_login_attempts: 5,
    auth_password_policy: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{10,}$",
    public_registration: false,
  },
});

console.log("Directus yönetim güvenliği ayarları hazır.");
