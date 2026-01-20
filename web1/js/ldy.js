// 设置图表的宽度和高度
var svgWidth = 800;
var svgHeight = 400;
var margin = {top: 10, right: 30, bottom: 30, left: 50};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var color = d3.scaleOrdinal()
    .domain(['returnyear<year', 'returnyear>year'])
    .range(['green', 'brown']);

function renderResult(domId, data) {
    var svgElement = d3.select(domId)
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    svgElement.selectAll("*").remove(); // Clear any existing content

    var g = svgElement.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    var x = d3.scaleBand()
        .domain(data.map(d => d.treat))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    var xAxis = g => g
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    var yAxis = g => g
        .call(d3.axisLeft(y))
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y));

    g.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x(d.treat)},0)`)
        .selectAll("rect")
        .data(d => [{
            name: d.condition,
            value: d.value
        }])
        .join("rect")
        .attr("class", "bar")
        .attr("fill", d => color(d.name))
        .attr("x", 0)
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .append("title")
        .text(d => d.condition === 'returnyear<year' ? `参与青千前：${d.value}` : `参与青千后：${d.value}`);

    g.append("g")
        .call(xAxis);

    g.append("g")
        .call(yAxis);
}

renderResult('#ldy-chart1', [
    {treat: 0, condition: 'returnyear<year', value: 2.403959708},
    {treat: 0, condition: 'returnyear>year', value: 0.308733087},
    {treat: 1, condition: 'returnyear<year', value: 3.989881956},
    {treat: 1, condition: 'returnyear>year', value: 0.145224941}
]);

renderResult('#ldy-chart2', [
    {treat: 0, condition: 'returnyear<year', value: 44418.37303},
    {treat: 0, condition: 'returnyear>year', value: 4291.157123},
    {treat: 1, condition: 'returnyear<year', value: 186024.7535},
    {treat: 1, condition: 'returnyear>year', value: 1114.8382}
]);