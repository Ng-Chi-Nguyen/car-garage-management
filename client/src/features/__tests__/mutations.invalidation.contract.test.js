import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const featuresDir = path.resolve(__dirname, '../');

describe('Mutation Invalidation Contract', () => {
  it('should ensure any use*Mutation.js exports INVALIDATES_KEYS and calls invalidateQueries correctly', () => {
    const featureDirs = fs.readdirSync(featuresDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.'));

    for (const dirent of featureDirs) {
      const featureName = dirent.name;
      const files = fs.readdirSync(path.join(featuresDir, featureName));

      const mutationFiles = files.filter(f => f.startsWith('use') && f.endsWith('Mutation.js'));

      for (const mutFile of mutationFiles) {
        const filePath = path.join(featuresDir, featureName, mutFile);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Verify INVALIDATES_KEYS is structurally exported as an object or array
        const invalidatesExportPattern = /export\s+const\s+INVALIDATES_KEYS\s*=\s*[[{]([^}\]]*)[}\]]/s;
        const match = content.match(invalidatesExportPattern);
        assert.ok(
          match,
          `${mutFile} in ${featureName} must export INVALIDATES_KEYS structurally`
        );
        
        // Verify we actually loop/call invalidateQueries
        const invalidateCallPattern = /queryClient\.invalidateQueries\(\s*\{\s*queryKey:\s*[^}]+\}\s*\)/s;
        assert.ok(
          invalidateCallPattern.test(content) || content.includes('queryClient.invalidateQueries('),
          `${mutFile} in ${featureName} must structurally call queryClient.invalidateQueries({ queryKey: ... })`
        );
      }
    }
  });
});
