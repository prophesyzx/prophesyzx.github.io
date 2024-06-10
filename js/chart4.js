export function drawChart4() {
    // 数据准备
    const data = [
        {
            group: 'accept',
            metrics: [
                {axis: 'avg_pub', value: 2.390363815142576},
                {axis: 'avg_FA_pub', value: 1.002851524090462},
                {axis: 'avg_FA_top10pub', value: 0.522566371681416},
                {axis: 'avg_LA_top10pub', value: 0.04626352015732547},
                {axis: 'avg_LA_pub', value: 0.19591937069813173},
                
            ]
        },
        {
            group: 'reject',
            metrics: [
                {axis: 'avg_pub', value: 2.931735159817352},
                {axis: 'avg_FA_pub', value: 1.0582191780821917},
                {axis: 'avg_FA_top10pub', value: 0.4034246575342466},
                {axis: 'avg_LA_top10pub', value: 0.20205479452054795},
                {axis: 'avg_LA_pub', value: 0.6082191780821917},
                
            ]
        }
    ];

    const margin = {top: 150, right: 150, bottom: 150, left: 150},
        width = 800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom,
        radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal().range(["#66c2a5", "#fc8d62"]); // Colors for accept and reject

    const radarChartOptions = {
        w: width,
        h: height,
        levels: 5,
        maxValue: 3.0,  // Assuming the max value in the data is 3.0
        roundStrokes: true,
        color: color,
    };

    const allAxis = data[0].metrics.map(d => d.axis),
        total = allAxis.length,
        angleSlice = Math.PI * 2 / total;

    const rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, radarChartOptions.maxValue]);

    // SVG容器
    const svg = d3.select('#compare-pub')
        .attr('width', radarChartOptions.w + margin.left + margin.right)
        .attr('height', radarChartOptions.h + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${radarChartOptions.w / 2 + margin.left}, ${radarChartOptions.h / 2 + margin.top})`);

    // 网格和刻度线
    const axisGrid = svg.append("g").attr("class", "axisWrapper");

    axisGrid.selectAll(".levels")
        .data(d3.range(1, radarChartOptions.levels + 1).reverse())
        .enter().append("circle")
        .attr("class", "gridCircle")
        .attr("r", d => radius / radarChartOptions.levels * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", 0.1);

    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, radarChartOptions.levels + 1).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", d => -d * radius / radarChartOptions.levels)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(d => d3.format('.1f')(radarChartOptions.maxValue * d / radarChartOptions.levels));

    // 轴线
    const axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(radarChartOptions.maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(radarChartOptions.maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(radarChartOptions.maxValue * 1.25) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(radarChartOptions.maxValue * 1.25) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d)
        .call(function wrap(text, width){}, radarChartOptions.w / 5);

    // 雷达图多边形
    const radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice);

    if (radarChartOptions.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }

    const blobWrapper = svg.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");


    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", d => radarLine(d.metrics))
        .style("stroke-width", "2px")
        .style("stroke", (d, i) => radarChartOptions.color(i))
        .style("fill", "none")
        .style("filter", "url(#glow)");

    // 添加交互功能
    const tooltip = d3.select("body").append("g")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // 为每个数据点的父元素添加"group"属性，并为每个数据点添加事件监听器
    blobWrapper.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper")
        .attr("group", d => d.group) // 将"group"属性绑定到每个数据点的父元素上
        .selectAll(".radarCircle")
        .data(d => d.metrics)
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", 4)
        .attr("cx", (d, i, j) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i, j) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill", function c(d, i, j){if (d3.select(this.parentNode).attr("group") == "accept"){return "#66c2a5"} else{return "#fc8d62"}})
        //.style("fill", (d, i, j) => radarChartOptions.color(j))
        .style("fill-opacity", 0.8)
        .style("pointer-events", "all")
        .on("mouseover", function(event, d) {
            const posX = event.pageX;
            const posY = event.pageY;

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            // 通过父元素获取"group"属性
            const group = d3.select(this.parentNode).attr("group");

            // 根据"group"属性显示相应的信息
            let groupInfo = "";
            if (group === "accept") {
                groupInfo = "<strong>Acceptor</strong><br>";
            } else if (group === "reject") {
                groupInfo = "<strong>Rejector</strong><br>";
            }

            const tooltipHtml = `${groupInfo}<strong>${d.axis}</strong>: ${d.value.toFixed(2)}`;
            tooltip.html(tooltipHtml)
                .style("left", (posX + 10) + "px")
                .style("top", (posY - 15) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // 创建图例
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - margin.right - 100}, ${margin.top})`);

    // 添加accept图例
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", radarChartOptions.color(0)); // 使用颜色数组中的第一个颜色

    legend.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text("Acceptor");

    // 添加reject图例
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 30)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", radarChartOptions.color(1)); // 使用颜色数组中的第二个颜色

    legend.append("text")
        .attr("x", 30)
        .attr("y", 45)
        .text("Rejector");
}
