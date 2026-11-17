// fumadocs references the Oniguruma WASM engine, but the site uses the JS regex engine.
// Stub it so Nitro does not bundle onig.wasm, whose `env` import cannot be resolved.
export default function shikiWasmUnused(): never {
  throw new Error('shiki/wasm is not available. Use the JavaScript regex engine.');
}
