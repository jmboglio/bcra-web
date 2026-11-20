select
    e.cod_entidad,
    e.nombre,
    e.fecha,
    case when e.cod_entidad = 'SIST' then '/resumen' else '/resumen/' || e.cod_entidad end as link
from entidades e
