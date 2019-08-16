window.onload = function () {
    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var option = {
        legend:{
            padding:    5,
            itemGap:    10,
            data:       ["Demo"]
        },
        tooltip:{
            trigger:    'item'
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value',
            boundaryGap:['10%', '10%'],
            splitNumber:4
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
        }]
    };
    myChart.setOption(option);
};

