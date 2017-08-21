exports.metrics = {
    R: { name: 'R', regexp: /R\:([-\d+]+)/i, value: '', unit: '°', pin: 1, },
    MINC: { name: 'MINC', value: '', unit: '°', pin: 1, graph: 1, graphValSuffix: 'C', graphOptions: { legendLbl: 'Minimum Temperature' } },
    AVGC: { name: 'AVGC', value: '', unit: '°', pin: 1, graph: 1, graphValSuffix: 'C', graphOptions: { legendLbl: 'Average Temperature' } },
    AVGH: { name: 'AVGH', value: '', unit: '%', pin: 1, graph: 1, graphOptions: { legendLbl: 'Humidity', lines: { lineWidth: 1 } } },
    AVGP: { name: 'AVGP', value: '', unit: 'mmHg', pin: 1, graph: 1, graphOptions: { legendLbl: 'Average Pressure', lines: { lineWidth: 1 } } },
};