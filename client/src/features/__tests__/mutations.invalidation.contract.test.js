import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const featuresDir = path.resolve(__dirname, '../');

describe('Mutation Invalidation Contract', () => {
  it('should ensure any use*Mutation.js exports INVALIDATES_KEYS and calls invalidateQueries', () => {
    const featureDirs = fs.readdirSync(featuresDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.'));

    for (const dirent of featureDirs) {
      const featureName = dirent.name;
      const files = fs.readdirSync(path.join(featuresDir, featureName));
      
      const mutationFiles = files.filter(f => f.startsWith('use') && f.endsWith('Mutation.js'));
      
      for (const mutFile of mutationFiles) {
        const filePath = path.join(featuresDir, featureName, mutFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        assert.ok(
          content.includes('INVALIDATES_KEYS'),
          `${mutFile} in ${featureName} must export INVALIDATES_KEYS`
        );
        assert.ok(
          content.includes('invalidateQueries'),
          `${mutFile} in ${featureName} must call queryClient.invalidateQueries`
        );
      }
    }
    
    assert.ok(true);
  });
});
