// client/scripts/analyze-bundle.js
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import process from "process";

const DIST_PATH = path.join(process.cwd(), "dist");
const ASSETS_PATH = path.join(DIST_PATH, "assets");

console.log("🔍 Analyzing bundle size...\n");

// Build for production first
console.log("📦 Building production bundle...");
try {
  execSync("npm run build", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}

// Analyze bundle sizes
if (!fs.existsSync(ASSETS_PATH)) {
  console.error("❌ Assets directory not found. Build may have failed.");
  process.exit(1);
}

const files = fs.readdirSync(ASSETS_PATH);
const jsFiles = files.filter((f) => f.endsWith(".js"));
const cssFiles = files.filter((f) => f.endsWith(".css"));

console.log("\n📊 Bundle Analysis Results:");
console.log("━".repeat(60));

// JavaScript files
console.log("\n🟡 JavaScript Files:");
let totalJSSize = 0;
jsFiles.forEach((file) => {
  const filePath = path.join(ASSETS_PATH, file);
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  totalJSSize += stats.size;

  const type = file.includes("index")
    ? "(Main Bundle)"
    : file.includes("vendor")
    ? "(Vendor)"
    : "(Chunk)";

  console.log(`  📄 ${file} ${type}: ${sizeKB} KB`);
});

// CSS files
console.log("\n🔵 CSS Files:");
let totalCSSSize = 0;
cssFiles.forEach((file) => {
  const filePath = path.join(ASSETS_PATH, file);
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  totalCSSSize += stats.size;

  console.log(`  🎨 ${file}: ${sizeKB} KB`);
});

// Summary
console.log("\n📈 Summary:");
console.log(`  Total JS Size: ${(totalJSSize / 1024).toFixed(2)} KB`);
console.log(`  Total CSS Size: ${(totalCSSSize / 1024).toFixed(2)} KB`);
console.log(
  `  Total Bundle Size: ${((totalJSSize + totalCSSSize) / 1024).toFixed(2)} KB`
);

// Recommendations
console.log("\n💡 Optimization Recommendations:");
if (totalJSSize > 500 * 1024) {
  console.log("  ⚠️  JavaScript bundle is large (>500KB). Consider:");
  console.log("     - Further code splitting");
  console.log("     - Tree shaking optimization");
  console.log("     - Dynamic imports for heavy libraries");
}

if (totalCSSSize > 100 * 1024) {
  console.log("  ⚠️  CSS bundle is large (>100KB). Consider:");
  console.log("     - CSS purging");
  console.log("     - Critical CSS inlining");
}

const totalSize = (totalJSSize + totalCSSSize) / 1024;
if (totalSize < 300) {
  console.log("  ✅ Bundle size is excellent (<300KB)");
} else if (totalSize < 500) {
  console.log("  ✅ Bundle size is good (<500KB)");
} else {
  console.log("  ⚠️  Bundle size could be optimized (>500KB)");
}

console.log("\n━".repeat(60));
console.log("📊 Bundle analysis complete!");
