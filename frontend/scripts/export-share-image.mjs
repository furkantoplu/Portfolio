import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { stat } from "node:fs/promises";

// Export the existing portrait for small link-preview downloads; never crop it.
const source = fileURLToPath(new URL("../public/furkan-toplu-hero-white-coat-v1.png", import.meta.url));
const output = fileURLToPath(new URL("../public/furkan-toplu-share-v1.jpg", import.meta.url));
await sharp(source)
  .resize(600, 600, { fit: "contain", background: "#f5f4ee" })
  .flatten({ background: "#f5f4ee" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(output);
const metadata = await sharp(output).metadata();
const { size } = await stat(output);
if (metadata.width !== 600 || metadata.height !== 600 || size > 200_000) {
  throw new Error("Share image must be 600 × 600 and smaller than 200 KB.");
}
console.log(`Share JPEG: ${metadata.width} × ${metadata.height}, ${size} bytes`);
