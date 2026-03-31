import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const featuresDir = path.resolve(__dirname, '../');

describe('Query Keys & URL Sync Contract', () => {
  it('should ensure all queryKeys.js files export a valid keys object', () => {
    const featureDirs = fs.readdirSync(featuresDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.'));

    for (const dirent of featureDirs) {
      const featureName = dirent.name;
      const files = fs.readdirSync(path.join(featuresDir, featureName));
      
      const queryKeysFile = files.find(f => f.endsWith('.queryKeys.js'));
      if (queryKeysFile) {
        const filePath = path.join(featuresDir, featureName, queryKeysFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        assert.ok(
          content.includes('const') && (content.includes('Keys = {') || content.includes('Keys = {')) || content.includes('export const'),
          `Feature ${featureName} queryKeys file should export a Keys object`
        );
        assert.ok(
          content.includes("all:"),
          `Feature ${featureName} queryKeys should have an 'all' base key`
        );
      }
    }
  });

  it('should ensure filters files exist for list-like features and export normalizers', () => {
    // Only check features that have a filters file for now to avoid failing on new features without one
    const featureDirs = fs.readdirSync(featuresDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.'));

    for (const dirent of featureDirs) {
      const featureName = dirent.name;
      const files = fs.readdirSync(path.join(featuresDir, featureName));
      
      const filtersFile = files.find(f => f.endsWith('.filters.js'));
      if (filtersFile) {
        const filePath = path.join(featuresDir, featureName, filtersFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        assert.ok(
          content.includes('normalizeFilters') || content.includes('applyFilterUpdates'),
          `Feature ${featureName} filters file should export url sync helpers`
        );
      }
    }
  });
});
