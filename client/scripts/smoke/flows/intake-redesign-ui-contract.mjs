import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.resolve(__dirname, '../../../');

export default async function run() {
  const formContent = fs.readFileSync(path.join(clientDir, 'src/features/intake/components/VehicleIntakeForm.jsx'), 'utf-8');
  const flowContent = fs.readFileSync(path.join(clientDir, 'src/features/intake/intakeSubmissionFlow.js'), 'utf-8');
  const combinedContent = formContent + '\n' + flowContent;
  
  const requiredSignals = [
    'useCustomersQuery',
    'useCustomersMutations',
    'useCarBrandsQuery',
    'useVehicleCatalogQuery',
    'resolveVehicleByPlate',
    'buildIntakePayload',
    'mutateAsync(',
  ];

  for (const signal of requiredSignals) {
    if (!combinedContent.includes(signal)) {
      throw new Error(`intake form/flow missing required wiring: ${signal}`);
    }
  }

  const forbiddenSignals = ['vehicleType', 'const carBrands = [', 'const carModels = ['];
  for (const signal of forbiddenSignals) {
    if (combinedContent.includes(signal)) {
      throw new Error(`intake form/flow still contains forbidden scaffolding: ${signal}`);
    }
  }
  
  const manifest = fs.readFileSync(path.join(clientDir, 'src/app/routeManifest.js'), 'utf-8');
  if (manifest.includes('IntakeModalPage') || manifest.includes('/intake/new')) {
    throw new Error('intake modal route/component references should be removed');
  }
}
