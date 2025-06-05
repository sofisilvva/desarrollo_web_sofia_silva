// Usando jQuery y Flot para crear gráficos interactivos con lo visto en clases

// Gráfico de líneas para actividades por día de la semana
$(function () {
  $.getJSON("/estadisticas/actividades-por-dia", function (data) {
    const diasOrdenados = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    const cantidades = diasOrdenados.map((dia) => {
      const entrada = data.find((d) => d.dia === dia);
      return entrada ? entrada.cantidad : 0;
    });

    const datos = cantidades.map((cantidad, index) => [index, cantidad]);
    const ticks = diasOrdenados.map((dia, index) => [index, dia]);

    // Configuración del gráfico de líneas
    $.plot(
      "#grafico-linea",
      [
        {
          data: datos,
          lines: { show: true },
          points: { show: true },
        },
      ],
      {
        xaxis: {
          ticks: ticks,
        },
        yaxis: {
          min: 0,
        },
        grid: {
          hoverable: true,
          clickable: true,
        },
      }
    );
    // Tooltip para mostrar la cantidad de actividades por día al pasar el mouse por encima de los puntos
    $("#grafico-linea").bind("plothover", function (event, pos, item) {
      if (item) {
        const x = item.datapoint[0],
              y = item.datapoint[1],
              dia = item.series.xaxis.ticks[x].label;

        $("#tooltip")
          .html(`<strong>${dia}</strong>: ${y} actividad/es`)
          .css({ top: item.pageY - $("#tooltip").outerHeight() - 10, left: item.pageX + 5 })
          .fadeIn(200);
      } else {
        $("#tooltip").hide();
      }
    });
  });
});

// Gráfico de torta para actividades por tema
$(function () {
  $.getJSON("/estadisticas/actividades-por-tema", function (data) {
    const datos = data.map(function (item) {
      return { label: item.tema, data: item.cantidad };
    });

    // Configuración del gráfico de torta
    $.plot("#grafico-torta", datos, {
      series: {
        pie: {
          show: true,
          label: {
            show: true,
            formatter: function (label, series) {
              return `<div style="font-size:13px;text-align:center;padding:2px;color:black;">${label}<br/>${Math.round(
                series.percent
              )}%</div>`;
            },
          },
        },
      },
      legend: {
        show: false,
      },
      grid: {
        hoverable: true,
        clickable: true,
      },
    });
    // Tooltip para mostrar la cantidad de actividades por tema al pasar el mouse por encima de cada pedazo de la torta
    $("#grafico-torta").bind("plothover", function (event, pos, item) {
      if (item) {
        const label = item.series.label;
        const percent = Math.round(item.series.percent);
        const cantidad = item.series.data[0][1]; // cantidad real de actividades
        $("#tooltip")
          .html(`${cantidad} actividades<br>`)
          .css({
            top: pos.pageY - $("#tooltip").outerHeight() - 10,
            left: pos.pageX + 5,
          })
          .fadeIn(200);
      } else {
        $("#tooltip").hide();
      }
    });
  });
});

// Gráfico de barras para actividades por mes y horario
$(function () {
  $.getJSON("/estadisticas/actividades-por-horario", function (data) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const serieManana = { label: "Mañana", color: "yellow", data: [] };
    const serieTarde = { label: "Mediodía", color: "green", data: [] };
    const serieNoche = { label: "Tarde", color: "blue", data: [] };

    const offset = 0.2; // Desplazamiento para evitar superposición

    data.forEach((item) => {
      const baseX = item.mes - 1; // Ajuste para que enero sea 0
      serieManana.data.push([baseX - offset, item.manana]);
      serieTarde.data.push([baseX, item.tarde]);
      serieNoche.data.push([baseX + offset, item.noche]);
    });

    const ticks = meses.map((mes, i) => [i, mes]);

    // Configuración del gráfico de barras
    $.plot("#grafico-barras", [serieManana, serieTarde, serieNoche], {
      series: {
        bars: {
          show: true,
          barWidth: 0.2,
          align: "center",
        },
      },
      xaxis: {
        ticks: ticks,
      },
      legend: {
        show: true,
        position: "ne",
      },
      grid: {
        hoverable: true,
        clickable: true,
      },
    });
    // Tooltip para mostrar la cantidad de actividades por horario al pasar el mouse por encima de las barras
    $("#grafico-barras").bind("plothover", function (event, pos, item) {
      if (item) {
        const mes = item.series.xaxis.ticks[item.dataIndex].label;
        const cantidad = item.datapoint[1];
        const horario = item.series.label;

        $("#tooltip")
          .html(`<strong>${horario} de ${mes}</strong>: ${cantidad} actividad/es`)
          .css({ top: item.pageY - $("#tooltip").outerHeight() - 10, left: item.pageX + 5 })
          .fadeIn(200);
      } else {
        $("#tooltip").hide();
      }
    });
  });
});
