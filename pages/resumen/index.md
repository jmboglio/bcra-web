---
title: Resumen
---

```sql entidades
select cod_entidad, nombre, link
from bcra.entidades
order by case when cod_entidad = 'SIST' then 0 else 1 end, nombre
```

<Dropdown data={entidades} name=entidad value=cod_entidad label=nombre defaultValue="SIST" title="Entidad" />

```sql bal
select activo / 1e6 as activo, pasivo / 1e6 as pasivo, pn_total / 1e6 as pn,
       resultado_acumulado / 1e6 as resultado, fecha
from bcra.balance
where cod_entidad = '${inputs.entidad.value}'
```

```sql eerr_sel
select linea, orden, valor / 1e6 as valor, es_total
from bcra.eerr
where cod_entidad = '${inputs.entidad.value}'
order by orden
```

## Situación patrimonial

<small>$ miles de millones</small>

<BigValue data={bal} value=activo title="Activo" fmt='#,##0' />
<BigValue data={bal} value=pasivo title="Pasivo" fmt='#,##0' />
<BigValue data={bal} value=pn title="Patrimonio neto" fmt='#,##0' />
<BigValue data={bal} value=resultado title="Resultado acumulado" fmt='#,##0' />

## Estado de resultados resumido

<small>Acumulado del ejercicio · $ miles de millones</small>

<Cascada data={eerr_sel} />

<DataTable data={eerr_sel} rows=all>
    <Column id=linea title="Línea" />
    <Column id=valor title="$ miles de millones" fmt='#,##0.0' />
</DataTable>

## Páginas por entidad

<DataTable data={entidades} link=link rows=10 search=true>
    <Column id=cod_entidad title="Código" />
    <Column id=nombre title="Entidad" />
</DataTable>
