export function drawChart4(data) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 70, left: 40},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#compare-pub")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var subgroups = data.columns.slice(1)

    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.group; }))
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-30)")
    .style("text-anchor", "end");

    // Another scale for subgroup position?
    var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 3])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#005a32","#99000d"]);

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
    svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
      .attr("class", function(d){ return "myRect " + d.key })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect").style("opacity", 0.7)
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); })
      .on("mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        tooltip.transition()
            .duration(100)
            .style("opacity", .9);
        tooltip.html("Group: " + toUpper(d.key) + "<br>Count: " + d.value)
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
    function toUpper(string) {
        if (string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }
        return string;
      };
}
