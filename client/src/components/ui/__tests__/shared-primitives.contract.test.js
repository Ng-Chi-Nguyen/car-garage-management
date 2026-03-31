import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uiDir = path.resolve(__dirname, '..');

describe('Shared Primitives Contract', () => {
  it('should have all required canonical UI components', () => {
    const requiredFiles = [
      'page-header.jsx',
      'stat-card.jsx',
      'section-card.jsx',
      'data-table.jsx',
      'status-badge.jsx',
      'state-shell.jsx',
      'loading-state.jsx',
      'error-state.jsx',
      'empty-state.jsx',
      'index.js'
    ];

    for (const file of requiredFiles) {
      assert.ok(
        fs.existsSync(path.join(uiDir, file)),
        `Missing required canonical component file: ${file}`
      );
    }
  });

  it('should export all primitives from index.js', () => {
    const indexPath = path.join(uiDir, 'index.js');
    assert.ok(fs.existsSync(indexPath), 'index.js does not exist');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    const requiredExports = [
      'PageHeader',
      'StatCard',
      'SectionCard',
      'DataTable',
      'StatusBadge',
      'StateShell',
      'LoadingState',
      'ErrorState',
      'EmptyState'
    ];

    for (const exportName of requiredExports) {
      assert.match(
        content,
        new RegExp(`export\\s+\\{\\s*[^}]*\\b${exportName}\\b[^}]*\\}`),
        `index.js should export ${exportName}`
      );
    }
  });
});
