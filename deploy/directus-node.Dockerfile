# Runtime-only security overlay. Keep Directus, native addons and its Alpine ABI.
FROM node:22.23.4-alpine3.24@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS patched-node
FROM directus/directus:12.4.0@sha256:e4809aa907c6dc67d60fcea734bbbbac567df458bfd86dd5984b1cc08d018212
COPY --from=patched-node /usr/local/bin/node /usr/local/bin/node
ENV NODE_VERSION=22.23.4
RUN node -e "const a=require('node:assert/strict'); a.equal(process.versions.node,'22.23.4'); a.equal(process.versions.modules,'127'); a.equal(require('node:zlib').constants.BROTLI_DECODER_ERROR_FORMAT_BLOCK_SWITCH,-17); a.equal(require('/directus/package.json').version,'12.4.0')"
# Inherit non-root USER, entrypoint, CMD, workdir and complete application tree.
