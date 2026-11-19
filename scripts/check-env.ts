/**
 * CI Security Script: scripts/check-env.ts
 *
 * Verifies that server-only secrets are NEVER prefixed with VITE_.
 * Fails fast with exit code 1 if a server secret is exposed to the client bundle.
 */

import fs from 'node:fs';
import path from 'node:path';

const SERVER_ONLY_KEYS = [
  'LIVEKIT_API_KEY',
  'LIVEKIT_API_SECRET',
  'GROQ_API_KEY',
  'GEMINI_API_KEY',
  'CEREBRAS_API_KEY',
  'OPENROUTER_API_KEY',
  'CF_ACCOUNT_ID',
  'CF_API_TOKEN',
  'WM_API_KEY',
  'ALLOWED_ORIGINS',
  'ROOM_PREFIX',
  'TOKEN_TTL_SECONDS',
  'VOICE_DAILY_MINUTES_PER_USER',
  'LLM_PROVIDER_CHAIN',
  'RATE_LIMIT_PER_MIN',
];

function checkEnvFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return true;
  const content = fs.readFileSync(filePath, 'utf-8');
  let hasViolation = false;

  for (const key of SERVER_ONLY_KEYS) {
    const leakPattern = new RegExp(`^\\s*VITE_${key}\\s*=`, 'm');
    if (leakPattern.test(content)) {
      console.error(`🚨 SECURITY VIOLATION: Server secret "${key}" was found with client prefix "VITE_${key}" in ${filePath}!`);
      hasViolation = true;
    }
  }

  return !hasViolation;
}

const envFiles = ['.env', '.env.demo', '.env.local', '.env.production'];
let allPassed = true;

for (const file of envFiles) {
  const fullPath = path.resolve(process.cwd(), file);
  if (!checkEnvFile(fullPath)) {
    allPassed = false;
  }
}

if (!allPassed) {
  console.error('\n❌ check-env failed: Fix leaked VITE_ server prefixes before committing.');
  process.exit(1);
} else {
  console.log('✅ check-env passed: No server secrets exposed with VITE_ prefix.');
}
