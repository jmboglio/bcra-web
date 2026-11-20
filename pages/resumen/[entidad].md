```sql ent
select nombre from bcra.entidades where cod_entidad = '${params.entidad}'
```

# {ent[0]?.nombre ?? params.entidad}

<small>Código BCRA {params.entidad} · <a href="/resumen">volver al resumen</a></small>

```sql bal
select activo / 1e6 as activo, pasivo / 1e6 as pasivo, pn_total / 1e6 as pn,
       resultado_acumulado / 1e6 as resultado
from bcra.balance
where cod_entidad = '${params.entidad}'
```

```sql eerr_sel
select linea, orden, valor / 1e6 as valor, es_total
from bcra.eerr
where cod_entidad = '${params.entidad}'
order by orden
```

## Situación patrimonial

<small>$ miles de millones</small>

<BigValue data={bal} value=activo title="Activo" fmt='#,##0.0' />
<BigValue data={bal} value=pasivo title="Pasivo" fmt='#,##0.0' />
<BigValue data={bal} value=pn title="Patrimonio neto" fmt='#,##0.0' />
<BigValue data={bal} value=resultado title="Resultado acumulado" fmt='#,##0.0' />

## Estado de resultados resumido

<Cascada data={eerr_sel} />
