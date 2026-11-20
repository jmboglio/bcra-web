# bcra-web

Web pública del **Repositorio BCRA**: datos públicos del sistema financiero argentino publicados por el
Banco Central de la República Argentina (Informe de Entidades Financieras y API de Estadísticas Monetarias).

Sitio personal. No representa a ninguna entidad financiera ni contiene opiniones sobre ellas.

## Cómo funciona

- Sitio estático hecho con [Evidence](https://legacy-docs.evidence.dev) (framework clásico, versiones fijadas).
- Los datos llegan en un único archivo, `sources/bcra/web.duckdb`, generado fuera de este repo por
  `etl/web/exportar_web.py` (repo privado `bcra-repo`). Este repo no se conecta a ninguna base.
- Hosting: Cloudflare Pages.

## Desarrollo local

```bash
npm ci
npm run sources   # lee sources/bcra/web.duckdb
npm run dev
```

Build de producción: `npm run sources && npm run build` (salida en `build/`).

Para no enviar telemetría anónima de Evidence, definir la variable de entorno `send_anonymous_usage_stats=no`.

## Estado

F0 (spike): página Monitor con reservas internacionales, página Resumen con selector de entidad, páginas por
entidad y cascada del estado de resultados.
