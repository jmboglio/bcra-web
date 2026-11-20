---
title: Monitor del sistema
---

<small>Spike F0 · una serie real de la API del BCRA, leída del export <code>web.duckdb</code>.</small>

```sql reservas
select fecha, valor, unidad, fuente
from bcra.monitor_series
where serie = 'reservas_internacionales'
order by fecha
```

```sql ultima
select fecha, valor, unidad
from ${reservas}
order by fecha desc
limit 1
```

<BigValue data={ultima} value=valor title="Reservas internacionales" fmt='#,##0' />

<LineChart
    data={reservas}
    x=fecha
    y=valor
    yAxisTitle="{ultima[0]?.unidad ?? ''}"
    title="Reservas internacionales · últimos 3 años"
/>

<small>Fuente: {reservas[0]?.fuente}</small>
