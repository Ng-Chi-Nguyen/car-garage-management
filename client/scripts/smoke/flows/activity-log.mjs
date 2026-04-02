import { readFile } from 'node:fs/promises';

export default async function run() {
  const [activityServiceSource, activityListSource] = await Promise.all([
    readFile(new URL('../../../../server/src/services/activity/activity.service.js', import.meta.url), 'utf8'),
    readFile(new URL('../../../src/features/activity/components/ActivityLogList.jsx', import.meta.url), 'utf8'),
  ]);

  if (!/initials:\s*buildInitials\(user\)/u.test(activityServiceSource)) {
    throw new Error('activity DTO does not expose initials');
  }

  if (!/\{log\.initials\s*\|\|\s*log\.user\}/u.test(activityListSource)) {
    throw new Error('activity log UI is missing initials fallback');
  }
}
