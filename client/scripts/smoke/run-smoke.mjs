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

  const runFlowModule = async (flowName, flowPath) => {
    const module = await import(flowPath);

    if (typeof module.default !== 'function') {
      throw new Error(`Flow '${flowName}' must export a default function.`);
    }

    await module.default();
  };
  
  if (values.flow) {
    const flowPath = path.join(flowsDir, `${values.flow}.mjs`);
    if (!fs.existsSync(flowPath)) {
      console.error(`Error: Flow '${values.flow}' not found at ${flowPath}`);
      process.exit(1);
    }
    
    console.log(`Running smoke flow: ${values.flow}`);
    try {
      await runFlowModule(values.flow, flowPath);
      console.log(`✅ Flow '${values.flow}' completed successfully.`);
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
        await runFlowModule(flowName, path.join(flowsDir, file));
        console.log(`✅ Flow '${flowName}' completed successfully.`);
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
