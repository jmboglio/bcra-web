-- EERR resumido (D5): rubros BCRA agregados por línea + subtotales.
with base as (
    select r.cod_entidad, r.fecha, m.linea, m.orden, sum(r.valor) as valor
    from eerr_rubros r
    join mapeo_eerr m on m.rubro = r.rubro
    group by all
),
neto as (
    select cod_entidad, fecha, 'Resultado neto' as linea, 90 as orden, sum(valor) as valor
    from base where orden < 90
    group by all
),
integral as (
    select cod_entidad, fecha, 'Resultado integral total' as linea, 110 as orden, sum(valor) as valor
    from base
    group by all
)
select *, false as es_total from base
union all select *, true from neto
union all select *, true from integral
