// Post-build: sirve los binarios de DuckDB-WASM desde jsDelivr en lugar de incluirlos en ./build.
//
// Motivo: Cloudflare Pages limita cada archivo a 25 MiB y los .wasm de DuckDB pesan ~33 y ~38 MB.
// Evidence los importa con `?url` de Vite, así que en el bundle solo queda una URL string
// (/_app/immutable/assets/duckdb-<variante>.<hash>.wasm) que DuckDB descarga con fetch.
// Este script reemplaza esa URL por la de jsDelivr (versión fijada) y borra el archivo local.
//
// Salvaguardas: verifica que el .wasm del build sea idéntico (SHA256) al de node_modules, así la
// versión en la URL del CDN es exactamente la que se compiló; falla si no reemplaza nada o si queda
// algún archivo > 25 MiB en ./build.

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BUILD = 'build';
const ASSETS = path.join(BUILD, '_app', 'immutable', 'assets');
const PKG_DIR = path.join('node_modules', '@duckdb', 'duckdb-wasm');
const LIMITE_BYTES = 25 * 1024 * 1024;

const sha256 = (f) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');

function* archivos(dir) {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) yield* archivos(p);
		else yield p;
	}
}

function fallar(msg) {
	console.error(`[wasm-cdn] ERROR: ${msg}`);
	process.exit(1);
}

if (!fs.existsSync(ASSETS)) fallar(`no existe ${ASSETS}; correr antes 'evidence build'`);

const version = JSON.parse(fs.readFileSync(path.join(PKG_DIR, 'package.json'), 'utf8')).version;
const wasms = fs.readdirSync(ASSETS).filter((f) => /^duckdb-(eh|mvp)\.[A-Za-z0-9_-]+\.wasm$/.test(f));
if (wasms.length === 0) fallar('no se encontraron duckdb-*.wasm en el build');

const jsFiles = [...archivos(BUILD)].filter((f) => /\.(js|html|json)$/.test(f));

for (const wasm of wasms) {
	const variante = wasm.split('.')[0]; // duckdb-eh | duckdb-mvp
	const local = path.join(ASSETS, wasm);
	const original = path.join(PKG_DIR, 'dist', `${variante}.wasm`);
	if (sha256(local) !== sha256(original)) {
		fallar(`${wasm} no coincide con ${original}; no se puede asegurar la versión del CDN`);
	}

	const urlLocal = `/_app/immutable/assets/${wasm}`;
	const urlCdn = `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@${version}/dist/${variante}.wasm`;
	let reemplazos = 0;
	for (const f of jsFiles) {
		const txt = fs.readFileSync(f, 'utf8');
		if (!txt.includes(urlLocal)) continue;
		fs.writeFileSync(f, txt.split(urlLocal).join(urlCdn));
		reemplazos++;
	}
	if (reemplazos === 0) fallar(`no se encontró la referencia a ${urlLocal} en el bundle`);

	fs.rmSync(local);
	console.log(`[wasm-cdn] ${wasm} -> ${urlCdn} (${reemplazos} archivo/s)`);
}

const grandes = [...archivos(BUILD)].filter((f) => fs.statSync(f).size > LIMITE_BYTES);
if (grandes.length) fallar(`quedan archivos > 25 MiB: ${grandes.join(', ')}`);
console.log('[wasm-cdn] OK: ningún archivo supera 25 MiB');
