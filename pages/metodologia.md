---
title: Metodología y fuentes
---

Sitio personal. Publica datos públicos del Banco Central de la República Argentina (BCRA) — Informe de
Entidades Financieras y API de Estadísticas Monetarias — sin opiniones sobre las entidades. No representa a
ninguna entidad financiera.

El último mes publicado por el BCRA puede corregirse en entregas posteriores.

```sql metadatos
select fuente, fecha_corte, generado_en from bcra.metadatos
```

<DataTable data={metadatos} />
