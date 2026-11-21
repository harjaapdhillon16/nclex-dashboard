import fs from "node:fs";
import path from "node:path";
import { compile, optimize, Polyfills } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";

const root = process.cwd();
const srcPath = path.join(root, "app", "tailwind.src.css");
const outPath = path.join(root, "app", "globals.css");

const rawCss = fs.readFileSync(srcPath, "utf8");
const compiler = await compile(rawCss, {
  from: srcPath,
  base: path.dirname(srcPath),
  shouldRewriteUrls: true,
  onDependency: () => {},
  polyfills: Polyfills.All,
});

const scanner = new Scanner({
  sources: [
    { base: path.join(root, "app"), pattern: "**/*.{tsx,ts}", negated: false },
    { base: path.join(root, "components"), pattern: "**/*.{tsx,ts}", negated: false },
    { base: path.join(root, "lib"), pattern: "**/*.{tsx,ts}", negated: false },
  ],
});

const candidates = scanner.scan();
const built = compiler.build(candidates);
const optimized = optimize(built, { minify: false }).code;
fs.writeFileSync(outPath, optimized, "utf8");
console.log(`Compiled Tailwind v4 CSS (${candidates.length} candidates -> ${outPath})`);
