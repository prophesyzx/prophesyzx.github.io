export function drawChart2(data) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 150, left: 150},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#discipline-rank")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    data.sort(function(a,b){return b.count - a.count})
    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Discipline; }))
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-30)")
    .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("text-align", "center")
    .style("padding", "8px")
    .style("font", "12px sans-serif")
    .style("background", "lightsteelblue")
    .style("border", "1px solid #333")
    .style("border-radius", "8px")
    .style("pointer-events", "none")
    .style("white-space", "nowrap");
    // Bars
    svg.selectAll(".mybar")
    .data(data)
    .enter()
    .append("rect")
    .style("opacity", 0.7)
    .attr("class", "mybar")
    .attr("x", function(d) { return x(d.Discipline); })
    .attr("y", function(d) { return y(d.count); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.count); })
    .attr("fill", "#005a32")
    .on("mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        tooltip.transition()
            .duration(100)
            .style("opacity", .9);
        tooltip.html("Discipline: " + d.Discipline + "<br>Count: " + d.count)
    })
    .on("mousemove", function(event, d) {
        tooltip
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("stroke", "none");
        tooltip.transition()
            .duration(100)
            .style("opacity", 0);
    });
    // Add text labels
    svg.selectAll(".bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function(d) { return x(d.Discipline) + x.bandwidth() / 2; }) // 设置文本的 x 坐标为每个柱子的中心
    .attr("y", function(d) { return y(d.count) + 20; }) // 设置文本的 y 坐标略微上移，以便不与柱子重叠
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .attr("text-anchor", "middle") // 将文本锚定在水平方向的中心
    .style("fill", "white") // 设置文本颜色为白色，以便与柱子对比
    .text(function(d) { return d.count; }); // 设置文本内容为柱子对应的数值

    svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom * 0.8)
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text("Discipline")

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", - height / 2)
    .attr("y", - margin.left / 4)
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text("People Num")
}
