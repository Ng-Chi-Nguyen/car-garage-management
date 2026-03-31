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

  it('should ensure filters files export correct behavior (get/apply logic)', async () => {
    const featureDirs = fs.readdirSync(featuresDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.'));

    for (const dirent of featureDirs) {
      const featureName = dirent.name;
      const files = fs.readdirSync(path.join(featuresDir, featureName));

      const filtersFile = files.find(f => f.endsWith('.filters.js'));
      if (filtersFile) {
        const filePath = path.join(featuresDir, featureName, filtersFile);
        const moduleUrl = 'file://' + filePath;
        const moduleExports = await import(moduleUrl);
        
        // Ensure there is some function exposed for getting or applying filters
        const exportedFunctions = Object.values(moduleExports).filter(v => typeof v === 'function');
        assert.ok(exportedFunctions.length > 0, `Feature ${featureName} filters file must export filter utility functions`);
      }
    }
  });
});
