import path from "path";
import { fileURLToPath } from "url";
import minify from "@node-minify/core";
import terser from "@node-minify/terser";
import cleanCSS from "@node-minify/clean-css";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, "../");

export async function doMinify(inputJs, outputJs, inputCss, outputCss) {
    await minify({
        compressor: terser,
        input: inputJs,
        output: outputJs,
    })
        .catch(function (err) {
            console.error(err);
            throw err;
        })
        .then(function() {
            console.log("Minified JS");
        });
    await minify({
        compressor: cleanCSS,
        input: inputCss,
        output: outputCss,
    })
        .catch(function (err) {
            console.error(err);
            throw err;
        })
        .then(function() {
            console.log("Minified CSS");
        });
}

// If run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    console.log("Minifying");
    await doMinify(
        path.join(rootPath, "data/src/*.js"),
        path.join(rootPath, "data/emulator.min.js"),
        path.join(rootPath, "data/emulator.css"),
        path.join(rootPath, "data/emulator.min.css")
    );
    console.log("Minifying Done!");
}
