import { parseArgs } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const options = {
  flow: {
    type: 'string',
  },
};

const { values } = parseArgs({ options, strict: false });

async function runSmoke() {
  const flowsDir = path.join(__dirname, 'flows');
  
  if (values.flow) {
    const flowPath = path.join(flowsDir, `${values.flow}.mjs`);
    if (!fs.existsSync(flowPath)) {
      console.error(`Error: Flow '${values.flow}' not found at ${flowPath}`);
      process.exit(1);
    }
    
    console.log(`Running smoke flow: ${values.flow}`);
    try {
      const module = await import(flowPath);
      if (module.default) {
        await module.default();
        console.log(`✅ Flow '${values.flow}' completed successfully.`);
      } else {
        console.error(`Error: Flow '${values.flow}' does not export a default function.`);
        process.exit(1);
      }
    } catch (err) {
      console.error(`❌ Flow '${values.flow}' failed:`, err);
      process.exit(1);
    }
  } else {
    // Run all flows
    console.log(`Running all smoke flows...`);
    const files = fs.readdirSync(flowsDir).filter(f => f.endsWith('.mjs'));
    let hasError = false;
    
    for (const file of files) {
      const flowName = path.basename(file, '.mjs');
      console.log(`\n--- Flow: ${flowName} ---`);
      try {
        const module = await import(path.join(flowsDir, file));
        if (module.default) {
          await module.default();
          console.log(`✅ Flow '${flowName}' completed successfully.`);
        }
      } catch (err) {
        console.error(`❌ Flow '${flowName}' failed:`, err);
        hasError = true;
      }
    }
    
    if (hasError) {
      console.error(`\n❌ One or more smoke flows failed.`);
      process.exit(1);
    } else {
      console.log(`\n✅ All smoke flows completed successfully.`);
    }
  }
}

runSmoke().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
