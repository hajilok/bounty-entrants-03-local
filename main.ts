import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_MANIFEST_BYTES = 16384;
const MIN_BOUNTIES = 1;
const MAX_BOUNTIES = 100;

type ManifestObject = Record<string, unknown>;

function isValidBountyEntry(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed !== value) {
    return false;
  }
  return !/[\u0000-\u001f\u007f]/.test(value);
}

function validateManifest(raw: Buffer): void {
  if (raw.byteLength === 0) {
    throw new Error("BOUNTY.json is empty.");
  }
  if (raw.byteLength > MAX_MANIFEST_BYTES) {
    throw new Error(
      `BOUNTY.json exceeds maximum allowed size of ${MAX_MANIFEST_BYTES} bytes (got ${raw.byteLength}).`,
    );
  }

  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(raw);
  } catch {
    throw new Error("BOUNTY.json must be valid UTF-8.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`BOUNTY.json contains invalid JSON: ${detail}`);
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("BOUNTY.json root must be a JSON object.");
  }

  const manifest = parsed as ManifestObject;
  const hasBounties = Object.prototype.hasOwnProperty.call(manifest, "bounties");
  const hasUrl = Object.prototype.hasOwnProperty.call(manifest, "url");

  if (hasBounties && hasUrl) {
    throw new Error('BOUNTY.json must not specify both "bounties" and "url" keys.');
  }

  if (hasBounties) {
    const entries = manifest.bounties;
    if (!Array.isArray(entries)) {
      throw new Error('BOUNTY.json "bounties" must be an array of strings.');
    }
    if (entries.length < MIN_BOUNTIES || entries.length > MAX_BOUNTIES) {
      throw new Error(
        `BOUNTY.json "bounties" must contain between ${MIN_BOUNTIES} and ${MAX_BOUNTIES} entries (got ${entries.length}).`,
      );
    }
    for (let i = 0; i < entries.length; i += 1) {
      if (!isValidBountyEntry(entries[i])) {
        throw new Error(`BOUNTY.json "bounties[${i}]" must be a valid non-empty string.`);
      }
    }
    return;
  }

  if (hasUrl) {
    if (!isValidBountyEntry(manifest.url)) {
      throw new Error('BOUNTY.json "url" must be a valid non-empty string.');
    }
    return;
  }

  throw new Error('BOUNTY.json must contain a "bounties" array (or a single "url" string).');
}

function main(): void {
  const botDir: string = process.env.MAKEFUN_BOT_DIR ?? "/bot";
  const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

  const sourcePath: string = join(botDir, "BOUNTY.json");
  const outputPath: string = join(outputDir, "BOUNTY.json");

  const raw: Buffer = readFileSync(sourcePath);
  validateManifest(raw);

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, raw);

  try {
    chmodSync(outputPath, 0o644);
  } catch {
    // Ignore chmod failures on filesystems or container environments where permissions cannot be changed.
  }
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
}
