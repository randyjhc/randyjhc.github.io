const fs = require("fs");
const path = require("path");
const { minify: minifyHtml } = require("html-minifier-terser");
const csso = require("csso");
const terser = require("terser");

const SRC_DIR = "src";    // your raw input files
const OUT_DIR = "docs";   // GitHub Pages folder

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

async function processFile(srcPath, destPath) {
  const ext = path.extname(srcPath);
  const content = fs.readFileSync(srcPath, "utf8");

  let minified;
  if (ext === ".html") {
    minified = await minifyHtml(content, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    });
  } else if (ext === ".css") {
    minified = csso.minify(content).css;
  } else if (ext === ".js") {
    const result = await terser.minify(content);
    minified = result.code;
  } else {
    // copy as-is
    minified = content;
  }

  fs.writeFileSync(destPath, minified, "utf8");
  console.log("✅ Minified:", destPath);
}

async function walkAndMinify(dir, outDir) {
  ensureDirSync(outDir);
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const srcPath = path.join(dir, file);
    const destPath = path.join(outDir, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      await walkAndMinify(srcPath, destPath);
    } else {
      await processFile(srcPath, destPath);
    }
  }
}

(async () => {
  await walkAndMinify(SRC_DIR, OUT_DIR);
})();