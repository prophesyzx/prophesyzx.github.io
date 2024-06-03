var margin = {top: 10, right: 30, bottom: 70, left: 40},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#line-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
var yAxis = d3.axisLeft(y);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis");

svg.append("g")
    .attr("class", "y axis");

var data_type = "num_of_pub";
var discipline = "ALL";
var id;


d3.select("#search-button").on("click", function(event) {
    event.preventDefault();
    id = d3.select("#id-search").property("value");
    discipline = "PERSONAL";
    updateVisualization(data_type, "PERSONAL", id);
    displayPersonalData(id);
});

d3.select("#discipline-filter").on("change", function() {
    discipline = d3.select(this).property("value");

    updateVisualization(data_type, discipline);
});

d3.select("#data-type").on("change", function() {
    data_type = d3.select(this).property("value");
    updateVisualization(data_type, discipline,id);
});

updateVisualization(data_type,discipline,id)

function updateVisualization(outtype, discipline = "ALL", personId = null) {
    
    d3.csv("data/all_data.csv").then(function(data) {
        data.forEach(function(d) {
            d['year_index'] = +d['year_index'];
            d[outtype] = +d[outtype];
            d['treat'] = +d['treat'];
        });

        data = data.filter(function(d) {
            return d.year_index >= -8 && d.year_index <= 8;
        });
        if (discipline === "PERSONAL" && personId) {
            var groupid = data.find(function(d) {
                return d.uniqueid === personId;
            }).groupid;
            
            // 过滤出 groupid 相同的样本
            data = data.filter(function(d) {
                return d.groupid === groupid;
            });
        } else if (discipline !== "ALL") {
            data = data.filter(function(d) {
                return d.discipline === discipline;
            });
        }
        var controlGroups = d3.groups(data, d => d.treat, d => d.year_index);
        var controlData = controlGroups.map(group => {
            return {
                control: group[0],
                values: group[1].map(yearGroup => {
                    return {
                        year_index: yearGroup[0],
                        avgOuttype: d3.mean(yearGroup[1], d => d[outtype])
                    };
                }).sort((a, b) => a.year_index - b.year_index)
            };
        });

        x.domain(d3.extent(data, d => d.year_index));
        y.domain([0, d3.max(controlData, c => d3.max(c.values, v => v.avgOuttype))]);

        var line = d3.line()
            .x(d => x(d.year_index))
            .y(d => y(d.avgOuttype));

        var lines = svg.selectAll(".line")
            .data(controlData, d => d.control);

        lines.enter()
            .append("path")
            .attr("class", "line")
            .attr("d", d => line(d.values))
            .attr("fill", "none")
            .attr("stroke-width", 5)
            .merge(lines)
            .transition()
            .duration(800)
            .attr("d", d => line(d.values))
            .attr("stroke", d => {
                switch (d.control) {
                    case 0:
                        return "steelblue";
                    case 1:
                        return "orange";
                    case 2:
                        return "gold";
                    default:
                        return "black";
                }
            })
            .attr("opacity", d => d.control === 1 ? 1 : 0.2);

        lines.on("mouseover", function(event, d) {
                if (d.control !== 1) {
                    d3.select(this).attr("opacity", 1);
                    d3.selectAll(`.point-${d.control}`).attr("opacity", 1);
                }
                var tooltipText;
                switch (d.control) {
                    case 0:
                        tooltipText = "控制组数据";
                        break;
                    case 1:
                        tooltipText = "YTT计划回国高校教师数据";
                        break;
                    case 2:
                        tooltipText = "反事实数据";
                        break;
                    default:
                        tooltipText = `Group ${d.control}`;
                }
                showTooltip(event, tooltipText);
            })
            .on("mouseout", function(event, d) {
                if (d.control !== 1) {
                    d3.select(this).attr("opacity", 0.2);
                    d3.selectAll(`.point-${d.control}`).attr("opacity", 0.2);
                }
                hideTooltip();
            });

        lines.exit().remove();

        controlData.forEach(function(group) {
            var points = svg.selectAll(".point-" + group.control)
                .data(group.values);

            points.enter()
                .append("circle")
                .attr("class", "point point-" + group.control)
                .attr("cx", d => x(d.year_index))
                .attr("cy", d => y(d.avgOuttype))
                .attr("r", 5)
                .attr("fill", d => {
                    switch (group.control) {
                        case 0:
                            return "steelblue";
                        case 1:
                            return "orange";
                        case 2:
                            return "gold";
                        default:
                            return "black";
                    }
                })
                .attr("opacity", group.control === 1 ? 1 : 0.2)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("r", 7);
                    showTooltip(event, `年份: ${d.year_index}<br>${outtype}: ${d.avgOuttype}`);
                })
                .on("mouseout", function(event, d) {
                    d3.select(this).attr("r", 5);
                    hideTooltip();
                })
                .merge(points)
                .transition()
                .duration(800)
                .attr("cx", d => x(d.year_index))
                .attr("cy", d => y(d.avgOuttype));

            points.exit().remove();
        });

        svg.selectAll(".vertical-line").remove();
        svg.append("line")
            .attr("class", "vertical-line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");

        svg.select(".x.axis").transition().duration(800).call(xAxis);
        svg.select(".y.axis").transition().duration(800).call(yAxis);
    });
}

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "#f9f9f9")
    .style("border", "1px solid #d3d3d3")
    .style("padding", "10px")
    .style("border-radius", "5px");

function showTooltip(event, text) {
    tooltip.html(text)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px")
        .style("visibility", "visible");
}

function hideTooltip() {
    tooltip.style("visibility", "hidden");
}
function displayPersonalData(id) {
    d3.csv("data/all_data.csv").then(function(data) {
        var person = data.find(d => d.uniqueid === id);
        if (person) {
            d3.select("#personal-data").html(`
                <h3>个人详细信息</h3>
                <p>个人照片</p>
                <img src="data/default.jpeg" alt="个人照片" style="max-width:200px;">
                <p>学科: ${person.discipline}</p>
                <p>性别: ${person.gender}</p>
                <p>博士毕业年份: ${person.doctoral_graduation_year}</p>
                <p>本科学校: ${person.bachelor_university}</p>
                <p>博士学校: ${person.doctoral_university}</p>
            `);
        } else {
            d3.select("#personal-data").html("<p>未找到该ID的个人数据</p>");
        }
    });
}

