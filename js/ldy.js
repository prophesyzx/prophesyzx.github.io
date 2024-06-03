// 设置图表的宽度和高度
var width = 800;
var height = 400;
var margin = {top: 10, right: 30, bottom: 10, left: 40};

// 创建 SVG 元素
var svg1 = d3.select("#ldy-chart1")
    .attr("width", width)
    .attr("height", height);

// 读取数据
d3.csv("data/aggregated_data.csv").then(data => {
    // 将数据转换为数值类型
    data.forEach(d => {
        d.returnyear = +d.returnyear;
        d.teamsize_mean = +d.teamsize_mean;
        d.teamsize_nlg_mean = +d.teamsize_nlg_mean;
    });

    // 设置 x 和 y 轴的比例尺
    var x = d3.scaleLinear()
        .domain([d3.min(data, d => d.returnyear), d3.max(data, d => d.returnyear)])
        .range([margin.left, width - margin.right]);

    var y = d3.scaleLinear()
        .domain([0, 3.5])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // 创建 x 轴和 y 轴
    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5));

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // 画 x 轴和 y 轴
    svg1.append("g").call(xAxis);
    svg1.append("g").call(yAxis);

    // 创建折线生成器
    var line = d3.line()
        .x(d => x(d.returnyear))
        .y(d => y(d.teamsize_mean));

    var line_nlg = d3.line()
        .x(d => x(d.returnyear))
        .y(d => y(d.teamsize_nlg_mean));

    // 绘制 teamsize_mean 折线
    svg1.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")  // Ensure fill is none to avoid black areas
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // 绘制 teamsize_nlg_mean 折线
    svg1.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")  // Ensure fill is none to avoid black areas
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line_nlg);

    // 添加图例
    svg1.append("text")
        .attr("x", width - margin.right - 100)
        .attr("y", margin.top + 10)
        .attr("fill", "steelblue")
        .text("teamsize_mean");

    svg1.append("text")
        .attr("x", width - margin.right - 100)
        .attr("y", margin.top + 30)
        .attr("fill", "green")
        .text("teamsize_nlg_mean");
});

// 添加新的图表区域
var width2 = 800;
var height2 = 400;
var margin2 = {top: 10, right: 30, bottom: 40, left: 80};


// 创建 SVG 元素
var svg2 = d3.select("#ldy-chart2")
    .attr("width", width2)
    .attr("height", height2);

// 读取新的数据
d3.csv("data/grant.csv").then(data => {
    // 将数据转换为数值类型
    data.forEach(d => {
        d.year = +d.year;
        d.grant = +d.grant;
        d.grant_nlg = +d.grant_nlg;
    });

    // 按treat分组的数据
    var data0 = data.filter(d => d.treat == 0);
    var data1 = data.filter(d => d.treat == 1);

    // 设置 x 和 y 轴的比例尺
    var x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([margin2.left, width2 - margin2.right]);
    // 创建 x 轴和 y 轴
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.grant, d.grant_nlg))])
        .nice()
        .range([height2 - margin2.bottom, margin2.top]);

    // 创建 x 轴和 y 轴
    var xAxis = g => g
        .attr("transform", `translate(0,${height2 - margin2.bottom})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));

    var yAxis = g => g
        .attr("transform", `translate(${margin2.left},0)`)
        .call(d3.axisLeft(y));

    // 画 x 轴和 y 轴
    svg2.append("g").call(xAxis);
    svg2.append("g").call(yAxis);

    // 创建折线生成器
    var lineGrant0 = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.grant));

    var lineGrant1 = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.grant));

    var lineGrantNlg0 = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.grant_nlg));

    var lineGrantNlg1 = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.grant_nlg));

    // 绘制 grant 折线
    svg2.append("path")
        .datum(data0)
        .attr("class", "line line0")
        .attr("fill", "none")  // Ensure fill is none to avoid black areas
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", lineGrant0);

    svg2.append("path")
        .datum(data1)
        .attr("class", "line line1")
        .attr("fill", "none")  // Ensure fill is none to avoid black areas
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", lineGrant1);

    // 绘制 grant_nlg 折线
    svg2.append("path")
        .datum(data0)
        .attr("class", "line line0")
        .attr("fill", "none")  // Ensure fill is none to avoid black areas
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", lineGrantNlg0);

    svg2.append("path")
        .datum(data1)
        .attr("class", "line line1")
        .attr("fill", "none")  // Ensure fill is none to avoid black areas
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", lineGrantNlg1);

    // 添加图例
    svg2.append("text")
        .attr("x", width2 - margin2.right - 100)
        .attr("y", margin2.top + 10)
        .attr("fill", "steelblue")
        .text("grant (treat 0)");

    svg2.append("text")
        .attr("x", width2 - margin2.right - 100)
        .attr("y", margin2.top + 30)
        .attr("fill", "green")
        .text("grant (treat 1)");

    svg2.append("text")
        .attr("x", width2 - margin2.right - 100)
        .attr("y", margin2.top + 50)
        .attr("fill", "steelblue")
        .style("stroke-dasharray", ("3, 3"))
        .text("grant_nlg (treat 0)");

    svg2.append("text")
        .attr("x", width2 - margin2.right - 100)
        .attr("y", margin2.top + 70)
        .attr("fill", "green")
        .style("stroke-dasharray", ("3, 3"))
        .text("grant_nlg (treat 1)");
});
