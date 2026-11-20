<!--
  Cascada (waterfall) del EERR resumido. Recibe filas {linea, orden, valor, es_total} ordenadas.
  Implementada con una serie "custom" de ECharts: cada barra va de `lo` a `hi`, lo que funciona
  también con resultados negativos o que cruzan cero (el truco de barras apiladas con base invisible no).
-->
<script>
	import { ECharts } from '@evidence-dev/core-components';

	export let data = [];
	export let height = '320px';

	const COLORES = ['#2E6DB4', '#D0393F', '#3A4152']; // suma, resta, subtotal

	$: filas = Array.from(data ?? []);
	$: puntos = (() => {
		let acumulado = 0;
		return filas.map((f, i) => {
			let lo, hi, tipo;
			if (f.es_total) {
				lo = Math.min(0, f.valor);
				hi = Math.max(0, f.valor);
				tipo = 2;
				acumulado = f.valor;
			} else {
				const inicio = acumulado;
				acumulado += f.valor;
				lo = Math.min(inicio, acumulado);
				hi = Math.max(inicio, acumulado);
				tipo = f.valor >= 0 ? 0 : 1;
			}
			return [i, lo, hi, tipo, f.valor];
		});
	})();

	const fmt = (v) =>
		new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(v);

	$: config = {
		grid: { left: 56, right: 16, top: 24, bottom: 72 },
		tooltip: {
			trigger: 'item',
			formatter: (p) => `${filas[p.value[0]].linea}<br/><b>${fmt(p.value[4])}</b>`
		},
		xAxis: {
			type: 'category',
			data: filas.map((f) => f.linea),
			axisLabel: { interval: 0, rotate: 30, fontSize: 11 }
		},
		yAxis: { type: 'value', axisLabel: { formatter: (v) => fmt(v) } },
		series: [
			{
				type: 'custom',
				encode: { x: 0, y: [1, 2] },
				data: puntos,
				renderItem: (params, api) => {
					const i = api.value(0);
					const arriba = api.coord([i, api.value(2)]);
					const abajo = api.coord([i, api.value(1)]);
					const ancho = api.size([1, 0])[0] * 0.6;
					return {
						type: 'rect',
						shape: {
							x: arriba[0] - ancho / 2,
							y: arriba[1],
							width: ancho,
							height: Math.max(abajo[1] - arriba[1], 1),
							r: [4, 4, 4, 4]
						},
						style: { fill: COLORES[api.value(3)] }
					};
				}
			}
		]
	};
</script>

<ECharts {config} {height} />
<div class="text-xs text-gray-600 flex gap-4 mt-1">
	<span><span style="color:{COLORES[0]}">■</span> Suma</span>
	<span><span style="color:{COLORES[1]}">■</span> Resta</span>
	<span><span style="color:{COLORES[2]}">■</span> Subtotal</span>
</div>
