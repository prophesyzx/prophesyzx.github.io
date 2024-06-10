var margin = {top: 10, right: 40, bottom: 70, left: 60},
    width = 700 - margin.left - margin.right,
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
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 40)
    .style("text-anchor", "middle")
    .style("fill", "black") // 设置颜色
    .style("font-size", "14px") // 设置字体大小
    .text("相对回国年份 (Year Index)");

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

// 设置画图需要用到基本变量
var data_type = "num_of_pub";
var discipline = "ALL";
var id;
var yAxisLabels = {
    num_of_pub: "文章发表数",
    top10_num: "前10%期刊发表文章数",
    fa_pub: "首作者发表文章数",
    fa_q1pub: "前25%期刊首作者发表文章数",
    la_pub: "通讯作者发表文章数",
    la_q1pub: "前25%期刊通讯作者发表文章数",
};

//个人id搜索
d3.select("#search-button").on("click", function(event) {
    event.preventDefault();
    id = d3.select("#id-search").property("value");
    discipline = "PERSONAL";
    updateVisualization(data_type, "PERSONAL", id);
    displayPersonalData(id);
});

//根据学科筛选
d3.select("#discipline-filter").on("change", function() {
    discipline = d3.select(this).property("value");

    updateVisualization(data_type, discipline);
});
//根据展示数据类型筛选
d3.select("#data-type").on("change", function() {
    data_type = d3.select(this).property("value");
    updateVisualization(data_type, discipline,id);
});


function updateVisualization(outtype, discipline = "ALL", personId = null) {
    //读入数据
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
            
            // 过滤出 groupid 相同的样本，即选择对象对应的控制组数据
            data = data.filter(function(d) {
                return d.groupid === groupid;
            });
        } else if (discipline !== "ALL") {
            data = data.filter(function(d) {
                return d.discipline === discipline;
            });
        }
        //根据treat进行分组；在数据集中treat原本只有0，1两个值，但是反事实数据我设定成了treat=2
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
        //画图
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
            .attr("data-control", d => d.control) 
            .attr("stroke-width", 5)
            .merge(lines)
            .transition()
            .duration(800)
            .attr("d", d => line(d.values))
            .attr("stroke", d => {
                switch (d.control) {
                    case 0:
                        return "#99000d";
                    case 1:
                        return "#005a32";
                    case 2:
                        return "#000080 ";
                    default:
                        return "black";
                }
            })
            .attr("opacity", d => d.control === 1 ? 1 : 0.2);
            //设置鼠标放上时操作
            lines.on("mouseover", function(event, d) {
                var line = d3.select(this);
                var thisOpacity = line.attr("opacity");
                line.attr("original-opacity", thisOpacity); // 存储当前的 opacity
                line.attr("opacity", 1);
                d3.selectAll(`.point-${d.control}`).attr("original-opacity", thisOpacity).attr("opacity", 1); // 存储并修改点的 opacity
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
                hideTooltip();
                var line = d3.select(this);
                var originalOpacity = line.attr("original-opacity"); // 恢复之前存储的 opacity
                line.attr("opacity", originalOpacity);
                d3.selectAll(`.point-${d.control}`).attr("opacity", originalOpacity); // 恢复点的 opacity
            });
            
        lines.exit().remove();
        //差异数据
        var diffData = controlData[1].values.map((d, i) => {
            var counterfactualValue = controlData[2].values.find(v => v.year_index === d.year_index);
            if (counterfactualValue) {
                return {
                    year_index: d.year_index,
                    diff: d.avgOuttype - counterfactualValue.avgOuttype
                };
            } else {
                return {
                    year_index: d.year_index,
                    diff: 0
                };
            }
        }).filter(d => d.year_index >= 1 && d.year_index <= 8); // 这里确保只包含 0 到 8 年的数据
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
                            return "#99000d";
                        case 1:
                            return "#005a32";
                        case 2:
                            return "#000080 ";
                        default:
                            return "black";
                    }
                })
                .attr("opacity", group.control === 1 ? 1 : 0.2)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("r", 7);
                    showTooltip(event, `相对年份: ${d.year_index}<br>${yAxisLabels[outtype]}: ${d.avgOuttype.toFixed(2)}`);
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
        // 动态调整图例位置
        var legendTransform = "translate(20, 20)"; // 默认左上角
        if (outtype === "fa_q1pub" || outtype === "fa_pub") {
            legendTransform = "translate(20, " + (height - 60) + ")"; // 这两个数据因为大多往下走，所以放在左下角
        }

        // 定义颜色
        var colors = {
            0: "#99000d",
            1: "#005a32",
            2: "#000080 "
        };
        svg.selectAll(".legend").remove();
        // 添加图例
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", legendTransform);

            legend.selectAll("rect")
            .data(Object.entries(colors))
            .enter().append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => d[1])
            .on("click", function(event, d) {
                // 切换对应线条的透明度
                var currentOpacity = d3.selectAll(`.line[data-control="${d[0]}"]`).attr("opacity");
                var newOpacity = currentOpacity == 1 ? 0.2 : 1;
                d3.selectAll(`.line[data-control="${d[0]}"]`).attr("opacity", newOpacity);
                d3.selectAll(`.point-${d[0]}`).attr("opacity", newOpacity);
            });
        //设置图例文字
        legend.selectAll("text")
            .data(Object.entries(colors))
            .enter().append("text")
            .attr("x", 20)
            .attr("y", (d, i) => i * 20 + 10)
            .text(d => {
                switch (d[0]) {
                    case "0": return "控制组数据";
                    case "1": return "YTT计划回国高校教师数据";
                    case "2": return "反事实数据";
                    default: return `Group ${d[0]}`;
                }
            })
            .on("click", function(event, d) {
                // 切换对应线条的透明度
                var currentOpacity = d3.selectAll(`.line[data-control="${d[0]}"]`).attr("opacity");
                var newOpacity = currentOpacity == 1 ? 0.2 : 1;
                d3.selectAll(`.line[data-control="${d[0]}"]`).attr("opacity", newOpacity);
                d3.selectAll(`.point-${d[0]}`).attr("opacity", newOpacity);
            });
        var yAxisLabel = yAxisLabels[outtype] || yAxisLabels.default;
        
        svg.select(".y.axis-label").remove(); // 移除现有标签
    
         svg.select(".y.axis")
                .append("text")
                .attr("class", "axis-label y axis-label")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -40)
                .style("text-anchor", "middle")
                .style("fill", "black")
                .style("font-size", "14px")
                .text(yAxisLabel);
        drawBarChart(diffData);

    });
}

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("padding", "10px")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", 0);

function showTooltip(event, text) {
    tooltip.html(text)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px")
        .style("visibility", "visible")
        .style("opacity", 1);
}
function hideTooltip() {
    tooltip.style("visibility", "hidden");
}
//展示个人数据
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
// 画差异图
function drawBarChart(diffData) {
    var margin = {top: 10, right: 130, bottom: 70, left: 60},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    d3.select("#bar-chart").selectAll("*").remove();
    var svg = d3.select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .domain(diffData.map(d => d.year_index))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([d3.min(diffData, d => d.diff), d3.max(diffData, d => d.diff)])
        .nice()
        .range([height, 0]);

    var xAxis = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    xAxis.append("text")
        .attr("class", "axis-label")
        .attr("transform", "translate(" + (width / 2) + " ," + margin.bottom + ")")
        .attr("y", -10)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "14px")
        .text("相对回国年份 (Year Index)");

    var yAxis = svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    yAxis.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "14px")
        .text("回国生产力 - 不回国生产力");

    svg.selectAll(".bar")
        .data(diffData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year_index))
        .attr("y", y(0))
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", d => d.diff > 0 ? "#006400" : "#8b0000") // 根据差异值着色
        .attr("opacity", 0.8)
        .on("mouseover", function(event, d) {
            showTooltip(event, `相对回国年份: ${d.year_index}<br>增量: ${d.diff.toFixed(2)}`);
        })
        .on("mouseout", function(event, d) {
            hideTooltip();
        })
        .transition()
        .duration(800)
        .attr("y", d => y(Math.max(d.diff, 0)))
        .attr("height", d => Math.abs(y(d.diff) - y(0)));
}



document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("personIdInput").value = "";
    // 清除个人数据展示部分
    d3.select("#line-chart").selectAll("*").remove();
    d3.select("#bar-chart").selectAll("*").remove();
    // 重新绘制图表，重置为全部数据
    updateVisualization("yourOuttype", "ALL", null);
});


updateVisualization(data_type,discipline,id)