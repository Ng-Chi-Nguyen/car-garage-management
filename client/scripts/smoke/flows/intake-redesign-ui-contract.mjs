import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.resolve(__dirname, '../../../');

export default async function run() {
  const formContent = fs.readFileSync(path.join(clientDir, 'src/features/intake/components/VehicleIntakeForm.jsx'), 'utf-8');
  if (formContent.includes('vehicleType')) {
    throw new Error('vehicleType field should not be in intake form');
  }
  if (!formContent.includes('intakeVehicleResolver.api') && !formContent.includes('useVehicleResolver')) {
    throw new Error('resolver API usage should exist in intake form');
  }
  
  const manifest = fs.readFileSync(path.join(clientDir, 'src/app/routeManifest.js'), 'utf-8');
  if (manifest.includes('IntakeModalPage') || manifest.includes('/intake/new')) {
    throw new Error('intake modal route/component references should be removed');
  }
}
