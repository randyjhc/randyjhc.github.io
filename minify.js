// minify.js
const fs = require("fs");
const { minify } = require("html-minifier-terser");

(async () => {
  const html = fs.readFileSync("docs/index.html", "utf-8");

  const minified = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
  });

  fs.writeFileSync("dist/index.html", minified, "utf-8");
  console.log("✅ Minified HTML");
})();