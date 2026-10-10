import {defineConfig} from "vite";
import vinext from "vinext";
import nextConfig from "./next.config";
import {sites} from "./build/sites-vite-plugin";

// Separate Node production target; portable/local Worker preview stays intact.
export default defineConfig({
  plugins: [vinext({nextConfig: {...nextConfig, output: "standalone"}}), sites({mockAuth: false})],
});
