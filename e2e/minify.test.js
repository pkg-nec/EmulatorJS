import { test } from 'tap';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, "../");

test('npm run minify creates emulator.min.js and emulator.min.css', (t) => {
    // Run the npm script
    execSync('npm run minify', { cwd: rootPath });

    const outJs = path.join(rootPath, 'data/emulator.min.js');
    const outCss = path.join(rootPath, 'data/emulator.min.css');

    t.ok(fs.existsSync(outJs), 'output JS exists');
    t.ok(fs.existsSync(outCss), 'output CSS exists');

    const jsStat = fs.statSync(outJs);
    const cssStat = fs.statSync(outCss);

    t.ok(jsStat.size > 0, 'output JS has content');
    t.ok(cssStat.size > 0, 'output CSS has content');
    t.end();
});
