exports.metrics = {
    R: { name: 'R', regexp: /R\:([-\d+]+)/i, value: '', unit: '°', pin: 1, },
    MINC: { name: 'MINC',regexp:/\bMINC\:([-\d\.]+)\b/i, value: '', unit: '°', pin: 1, graph: 1, graphValSuffix: 'C', graphOptions: { legendLbl: 'Minimum Temperature' } },
    AVGC: { name: 'AVGC',regexp:/\bAVGC\:([-\d\.]+)\b/i, value: '', unit: '°', pin: 1, graph: 1, graphValSuffix: 'C', graphOptions: { legendLbl: 'Average Temperature' } },
    AVGH: { name: 'AVGH',regexp:/\bAVGH\:([-\d\.]+)\b/i, value: '', unit: '%', pin: 1, graph: 1, graphOptions: { legendLbl: 'Humidity', lines: { lineWidth: 1 } } },
    AVGP: { name: 'AVGP',regexp:/\bAVGP\:([-\d\.]+)\b/i, value: '', unit: 'mmHg', pin: 1, graph: 1, graphOptions: { legendLbl: 'Average Pressure', lines: { lineWidth: 1 } } },
};