function PieChart(svg, list){
    containerWidth = d3.select(".pie-chart").node().getBoundingClientRect().width;
    containerHeight = d3.select(".pie-chart").node().getBoundingClientRect().height;
    w = containerWidth * 0.9; h = containerHeight * 0.9;
    
    // 设置 SVG 的视图框和宽高
    svg.attr('viewBox', `0 0 ${w} ${h}`);
    
    svg1 = svg.append("g")
        .attr("transform",`translate(${w/2} ${h/2})`);

    const pie = d3.pie()
        .value(function(d){return d.percent})
        .sort(null)
        .padAngle(.0);;
    const arc = d3.arc()
                .innerRadius(Math.min(w, h)/3)
                .outerRadius(Math.min(w,h)/2.2);
    var color = d3.scaleOrdinal()
                .domain(list)
                .range(['#4daf4a','#377eb8','#ff7f00']);//,'#984ea3','#e41a1c']);
    //Generate groups
    var arcs = svg1.selectAll("arc")
                .data(pie(list))
                .enter()
                .append("g")
                .attr("class", "arc")

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(d.data.name);
        })
        .attr("d", arc);

    svg1.append('g')
       .attr('class', '.legend')
    svg1.selectAll('text')
        .data(pie(list))
        .enter()
            .append("text")
            .attr("dx", 70)
            .attr("dy", function(d, i){return (i-1)*18})
            .attr("text-anchor", "middle")
            .text(function(d){
                return d.data.percent+"%";
            })
            .style('fill','#ffffff')
            .style("font", "10px sans-serif")
            .style('font-weight', 'bold');

    svg1.selectAll("dots")
        .data(pie(list))
        .enter()
            .append("circle")
            .attr("cx", -60)
            .attr("cy", function(d, i){return (i-1)*18 - 3.5})
            .attr("r", 7)
            .style("fill", function(d, i){return color(d.data.name)})
    svg1.selectAll("mylabel")
        .data(pie(list))
        .enter()
            .append("text")
            .attr("dx", -45)
            .attr("dy", function(d, i){return (i-1)*18})
            .attr("text-anchor", "left")
            .text(function(d){
                return d.data.name;
            })
            .style('fill','#ffffff')
            .style("font", "10px sans-serif")
            .style('font-weight', 'bold');
}

function distri(svg, data, color, type){
    if(type == "origin"){
        var list = d3.map(data, function(d){return +d.Price + +d.PriceDiff});
    }
    else{
        var list = d3.map(data, function(d){return +d.Price});
    }

    containerWidth = d3.select(`.dist-item`).node().getBoundingClientRect().width;
    containerHeight = d3.select(`.dist-item`).node().getBoundingClientRect().height;

    width = containerWidth * 3 / 4;
    height = containerHeight * 2 / 3;

    svg.attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    svg = svg.append("g")
              .attr("transform",`translate(${(containerWidth - width)/2}, ${(containerHeight - height)/2})`);    

    var x = d3.scaleLinear()
            .domain([d3.min(list), d3.max(list)])
            .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues(x.ticks().filter(function(d, i){return i % 2 === 0;})));

    var histogram = d3.histogram()
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(40)); // then the numbers of bins
    var bins = histogram(list);
    var y_max = d3.max(bins, function(d){return d.length;});
    // add the y Axis
    var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, y_max]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", -h/2)
        .attr("y", -30)
        .text("Count")
        .attr("fill", "white")
        .attr("transform", "rotate(-90)");

    // var color = `hsl(${Math.random() * 360}, 100%, 75%)`;

    svg.append("g")
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", color)
        .on("mousemove", function(event,d) {
            divTooltip.transition()
                .duration(200)
                .style("opacity", .9);
            if(type == "origin"){
                var games = data.filter(function(dd){return d.includes(+dd.Price + +dd.PriceDiff)});
            }
            else{
                var games = data.filter(function(dd){return d.includes(+dd.Price)});                
            }
            var output = "<p>Game's Name</p>"
            output += "<p style='text-align: left;'>" + games.map(function(g, i){return (i+1) + '. ' + g.Name + "<br>"}).join('') + "</p>";
            divTooltip.html(output)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
            divTooltip.transition()
            .duration(500)
            .style("opacity", 0);
            });
    return svg
}

// special for comment
function sor(a, b){
    if (+b.Comment_Positive/+b.Comment_All > +a.Comment_Positive/+a.Comment_All) {
        return 1;
      } else if (+b.Comment_Positive/+b.Comment_All < +a.Comment_Positive/+a.Comment_All) {
        return -1;
      } else {return +b.Comment_All - +a.Comment_All;}
}

// tagsRank: svg
// p_wo_d: data
// p: (str) column name
function countTags(tagsRank, p_wo_d, p, title=""){
    var p_wo_d_tags = d3.map(p_wo_d, function(d){return d[p].split(",").filter((d)=>d!="")}); // get all tags (in mode or style), with duplicated
    p_wo_d_tags = d3.map(d3.merge(p_wo_d_tags), function(d){return d.trim()}) // remove space, e.g. " RPG" -> "RPG"
    const temp = p_wo_d_tags.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {}); // output = {"tag_a": 3, "tag_b": 5, ..., etc}
    const tagsrank = Object.entries(temp).sort((a, b) => b[1] - a[1]); // order by value

    tagsRank.append("div")
            .style("margin", "5px")
            .style("padding", "10px")
            .style("background-color", "rgb(95, 134, 173)")
            .style("border-radius", "9px")
            .text(p + " Ranking " + title)
            .selectAll("div")
            .data(tagsrank.slice(0, 10))
            .enter()
                // .select("div")
                .append("li")
                .style("text-align", "left")
                .style("padding", "3px")
                .text(function(d, i){return (i+1) + '. ' + d[0] + ": " + d[1]})
}