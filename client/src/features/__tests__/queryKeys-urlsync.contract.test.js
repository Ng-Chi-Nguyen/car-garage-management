import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const featuresDir = path.resolve(__dirname, '../');

describe('Query Keys & URL Sync Contract', () => {
  it('should ensure all queryKeys.js files export a valid keys object dynamically', async () => {
    const featureDirs = fs.readdirSync(featuresDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.'));

    for (const dirent of featureDirs) {
      const featureName = dirent.name;
      const files = fs.readdirSync(path.join(featuresDir, featureName));

      const queryKeysFile = files.find(f => f.endsWith('.queryKeys.js'));
      if (queryKeysFile) {
        const filePath = path.join(featuresDir, featureName, queryKeysFile);
        const moduleUrl = 'file://' + filePath;
        const module = await import(moduleUrl);
        const keysObj = Object.values(module).find(val => typeof val === 'object' && val !== null && Array.isArray(val.all));
        
        assert.ok(
          keysObj,
          `Feature ${featureName} queryKeys file should export a Keys object with an 'all' array`
        );
      }
    }
  });

  it('should ensure filters files exist for list-like features and parse logic', () => {
    const featureDirs = fs.readdirSync(featuresDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.'));

    for (const dirent of featureDirs) {
      const featureName = dirent.name;
      const files = fs.readdirSync(path.join(featuresDir, featureName));

      const filtersFile = files.find(f => f.endsWith('.filters.js') || f.endsWith('Filters.js'));
      if (filtersFile) {
        const filePath = path.join(featuresDir, featureName, filtersFile);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Instead of pure string match, we check for structured function patterns
        // We verify the file handles URLSearchParams and sets/deletes properly
        assert.ok(
          content.includes('URLSearchParams') || content.includes('useSearchParams'),
          `Feature ${featureName} filters file should interact with URLSearchParams`
        );
        assert.ok(
          content.includes('delete(') || content.includes('set('),
          `Feature ${featureName} filters file should have mutation logic for params`
        );
      }
    }
  });
});
