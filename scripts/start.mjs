import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";

try {
  const text = readFileSync(new URL("../.env", import.meta.url), "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq);
    if (!process.env[key]) {
      process.env[key] = trimmed.slice(eq + 1);
    }
  }
} catch {
  // Hostinger injects the variables directly.
}

function run(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(command));
    });
  });
}

if (process.env.DATABASE_URL) {
  await run("npx prisma migrate deploy");
  await run("npx tsx prisma/seed.ts");
}

const port = process.env.PORT || "3011";
const server = spawn(`npx next start --port ${port}`, { shell: true, stdio: "inherit" });
server.on("exit", (code) => {
  process.exit(code ?? 0);
});
