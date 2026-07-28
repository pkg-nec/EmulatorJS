import { test } from 'tap';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { doMinify } from '../minify/minify.js';

test('doMinify generates minified output', async (t) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'minify-test-'));
    t.teardown(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

    const inputJs = path.join(tmpDir, 'test.js');
    const outputJs = path.join(tmpDir, 'test.min.js');
    const inputCss = path.join(tmpDir, 'test.css');
    const outputCss = path.join(tmpDir, 'test.min.css');

    fs.writeFileSync(inputJs, 'function hello() { console.log("world"); }');
    fs.writeFileSync(inputCss, 'body { color: red; }');

    await doMinify(inputJs, outputJs, inputCss, outputCss);

    t.ok(fs.existsSync(outputJs), 'JS minified file should exist');
    t.ok(fs.statSync(outputJs).size > 0, 'JS minified file should not be empty');
    t.ok(fs.existsSync(outputCss), 'CSS minified file should exist');
    t.ok(fs.statSync(outputCss).size > 0, 'CSS minified file should not be empty');
});
