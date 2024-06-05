function price(free, p_wo_d, p_w_d, filter_data){
    d3.select(".content").selectAll("div").remove();
    d3.select(".RightTags").selectAll("div").remove();
    tagsRank = d3.select(".RightTags")
                .append("div")
                .attr("class", "tags");
    countTags(tagsRank, p_wo_d, "TagMode", "in Price w/o Discount");
    countTags(tagsRank, p_wo_d, "TagStyle", "in Price w/o Discount");

    pieContainer = d3.select(".content")
                    .append("div")
                    .attr("class", "pie");

    var svg_pie = pieContainer
                    .append("div")
                    .attr("class", "pie-chart")
                    .text("Price")
                    .style("font", "15px sans-serif")
                    .style("color", "white")
                    .style("padding-top", "10px")
                    .append("svg");
    var price_dict = {"Free": free.length, "Price w/o discount": p_wo_d.length, "Price with discount": p_w_d.length};
    var result = Object.keys(price_dict).map(function(key) {
        return {"name": key, "percent":(price_dict[key]/filter_data.length*100).toFixed(2)};
    });
    PieChart(svg_pie, result);

    
    var svg_price = pieContainer
                    .append("div")
                    .attr("class", "dist1")                    
                    .append("div")
                    .attr("class", "dist-item")
                    .text("Price w/o Discount")
                    .style("font", "15px sans-serif")
                    .style("color", "white")
                    .style("padding-top", "10px")
                    .append("svg")

    distri(svg_price, p_wo_d, "#377eb8");
    
    var svg = pieContainer
                .append("div")
                .attr("class", "dist2")
                .text("Price with Discount")
                .style("font", "15px sans-serif")
                .style("color", "white")
                .style("padding-top", "10px")
    var svg_price_d = svg
                        .append("div")
                        .attr("class", "dist2-items");
    var svg_price = svg_price_d
                    .append("div")
                    .attr("class", "dist-item")
                    .text("Original Price")
                    .style("font", "15px sans-serif")
                    .style("color", "lightgray")
                    .style("padding-top", "10px")
                    .append("svg");
    distri(svg_price, p_w_d, "red", "origin");
    var svg_price = svg_price_d
                    .append("div")
                    .attr("class", "dist-item")
                    .text("Discounted Price")
                    .style("font", "15px sans-serif")
                    .style("color", "lightgray")
                    .style("padding-top", "10px")
                    .append("svg");
    distri(svg_price, p_w_d, "#ff7f00");
}

function GameList(data){   
    d3.select(".content").selectAll("div").remove();
    d3.select(".RightTags").selectAll("div").remove();
    tagsRank = d3.select(".RightTags")
                .append("div")
                .attr("class", "tags");
    countTags(tagsRank, data, "TagMode");
    countTags(tagsRank, data, "TagStyle");

    var gameContainer = d3.select(".content")
                        .append("div")
                        .attr("class", "game")
                        .text("Popular Games!")
                        .style("text-align", "center");
    // title
    var GameTitle = gameContainer
                    .append("div")
                    .attr("class", "list-title");

    GameTitle.append("div")
        .text("#")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "2vw");

    GameTitle.append("div")
        .text("Name")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "15vw");
    
    GameTitle.append("div")
        .text("Price")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "10vw");
    
    GameTitle.append("div")
        .text("Discount")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "10vw");
    
    GameTitle.append("div")
        .text("     Comment \nPositive rate(%) / All")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "13vw");
    gameContainer.append("div").attr("class", "horizontal-line")
    var GameItems = gameContainer
        .append("div")
        .attr("class", "game-list scrollbar");

    var gameItems = GameItems.selectAll("div")
                    .data(data)
                    .enter()
                    .append("div")
                    .attr("class", "game-item")
                    .style("display", "inline-flex")
                    .style("align-items", "center")
                    .style("margin", "5px")
                    .style("width", "auto")
                    .style("opacity", 0.7)
                    .on("mousemove", function(event,d) {
                        divTooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        var output = "<p style='text-align: center;'><B>Game's Tags</B></p>" + d.Tag +
                         "<p style='text-align: center;'><B>Systems Requests</B></p>" + d.Request_Processor + ", " + d.Request_Memory;
                        divTooltip.html(output)
                            .style("left", (event.pageX) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(event, d) {
                        divTooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                        });

    gameItems.append("div")
            .text(function(d, i) { return i+1;})
            .style("padding", "5px")
            .style("width", "2vw")
            .style("height", "auto");

    gameItems.append("div")
        .text(function(d) { return d.Name; })
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "15vw");

    gameItems.append("div")
        .text(function(d) {if(d.Price == 0){return "Free"}else{return d.Price;}})
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "10vw");
        
    gameItems.append("div")
        .text(function(d) {if(d.Price == 0){return "-"}
                            else if(d.PriceDiff == 0){return "None"}
                            else{return d.PriceDiff;}})
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "10vw");
    
    gameItems.append("div")
        .text(function(d) { return  (+d.Comment_Positive/+d.Comment_All*100).toFixed(2) + '%'+ ' / ' + +d.Comment_All; })
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "13vw");
}

function draw(data, figName){
    d3.select(".RightTags").selectAll("div").remove();
    d3.select(".content").selectAll("div").remove();
    sysContainer = d3.select(".content")
                    .append("div")
                    .attr("class", "system")
    var myColor = d3.scaleSequential(d3.interpolateReds).domain([0, 1]);
    var margin = {top: 30, right: 0, bottom: 30, left: 50};
    var width = window.innerWidth/3 - margin.left - margin.right,
    height = window.innerWidth/3 - margin.top - margin.bottom;
    var X_feat = new Set(d3.map(data, function(d) {return d.Request_Processor}));
    var Y_feat = new Set(d3.map(data, function(d) {return d.Request_Memory}));
    X_order = ["Beginner", "Intermediate", "Advanced", "Top"];
    X_feat = new Set(X_order.filter(item => X_feat.has(item)));
    Y_order = ["low", "normal", "high"];
    Y_feat = new Set(Y_order.filter(item => Y_feat.has(item)));


    var svg_bar = sysContainer.append("div")
                            .append('svg')
                            .attr('width', window.outerWidth/3+100)
                            .attr('height', 50);
    svg_bar.append('g')
        .attr('class', 'color-bar')
        .attr('transform', 'translate(50,10)');

    svg_bar.select('.color-bar')
        .selectAll('rect')
        .data(d3.range(0, window.outerWidth/3 + 1))
        .enter().append('rect')
            .attr('x', function(d){return d})
            .attr('y', 0)
            .attr('width', 1)
            .attr('height', 20)
            .attr('fill', function(d){return myColor(d/(window.outerWidth/3))});

    var svg = sysContainer.append("div").attr("class", "heatmap")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
    // Build X scales and axis:
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(X_feat)
    .padding(0.01);
    svg.append("g")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(0, -30)");

    // Build Y scales and axis:
    var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(Y_feat)
    .padding(0.01);
    svg.append("g")
    .call(d3.axisLeft(y));

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    var heatmapData = []; heatmapArray = [];
    for(var i=0; i < X_feat.size; i++){
        for(var j=0; j < Y_feat.size; j++){
            var key = Array.from(X_feat)[i] + "vs" + Array.from(Y_feat)[j];
            heatmapData[key] = 0;
        }
    }
    data.forEach(function(d) {
        var key = d.Request_Processor + "vs" + d.Request_Memory;
      
        heatmapData[key] += 1;
      });
      
    var heatmapArray = Object.keys(heatmapData).map(function(key) {
        var pair = key.split("vs");
        return {
          group: pair[0],
          variable: pair[1],
          value: heatmapData[key]
        };
    });

    svg_bar.append("text")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("x", 40)
            .attr("y", 25)
            .text("0")
    svg_bar.append("text")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("x", (window.outerWidth/3) + 61)
            .attr("y", 25)
            .text(d3.max(heatmapArray, function(d){return d.value}))

    svg.selectAll()
        .data(heatmapArray)
        .enter()
        .append("rect")
            .attr("x", function(d) { return x(d.group) })
            .attr("y", function(d) { return y(d.variable) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.value/d3.max(heatmapArray, function(d){return d.value}))} )
            .on("mouseover", function(event,d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("Number of games:"+ d.value)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            });
    var inform = d3.select(".heatmap").append("div").style("flex", 1).style("padding", "5vw");
    inform.append("div")
    .text("This heatmap show the relation between CPU and Memory.\ne.g. Each block represents the corresponding number of memory and CPU combinations.")
    inform.append("div")
    .text("\n\n* CPU\n1. TOP: i9 and similar\n2. Advanced: i7 and similar\n3. Intermediate: i5 and similar\n4. Beginner: i3 and ther lower level")
    inform.append("div")
    .text("\n\n* Memory\n1. High: >= 10 GB RAM\n2. Normal: 6~10 GB RAM\n3. Low: <6 or smaller memory capacity")
}

function sankey_diagram(data){
    d3.select(".RightTags").selectAll("div").remove();
    d3.select(".content").selectAll("div").remove();
    // do sankey_diagram
    var legendContainer = d3.select(".content")
        .append("div")
        .attr("class", "legend");
        
    var margin = {"left": 50, "right": 50, "top": 50, "bottom": 50};
    var width  = d3.select(".content").node().clientWidth - margin.left - margin.right;
    var height = window.innerHeight - margin.top - margin.bottom - 200;
    var svg = d3.select(".content").append("div")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    var features = ["Mode", "Style", "Person", "Dimension", "NumPlayer"];
    var units = "s";
    var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; };
    var color = d3.scaleOrdinal()
            .domain(features)
            .range(['#e41a1c', '#ff7f00', '#f5bf16', '#4daf4a', '#377eb8', '#984ea3', '#a65628']);
    
    let legendItem = document.querySelector('.legend')//d3.select(".content").append("div").attr("id", 'legend').node();
    let currentLi
    legendItem.addEventListener('dragstart',(e)=>{
        e.dataTransfer.effectAllowed = 'move'
        currentLi = e.target
        setTimeout(()=>{
            currentLi.classList.add('moving')
        })
    })
    
    legendItem.addEventListener('dragenter',(e)=>{
        try{e.preventDefault();
        if (e.target === currentLi || e.target === legendItem) {
            return;
        }
        let isChildOfTarget = e.target.contains(currentLi);
        let isParentOfTarget = currentLi.contains(e.target);
    
        if (isChildOfTarget || isParentOfTarget) {
            return;
        }
        let commonParent = null;
        let targetParent = e.target.parentNode;
    
        while (!commonParent && targetParent) {
            if (targetParent.contains(currentLi)) {
                commonParent = targetParent;
            }
            targetParent = targetParent.parentNode;
        }
    
        if (commonParent) {
            let liArray = Array.from(commonParent.children);
            let currentIndex = liArray.indexOf(currentLi);
            let targetIndex = liArray.indexOf(e.target);
    
            if (currentIndex < targetIndex) {
                commonParent.insertBefore(currentLi, e.target.nextElementSibling);
            } else {
                commonParent.insertBefore(currentLi, e.target);
            }
        }}catch(error){}
    })
    
    legendItem.addEventListener('dragend',(e)=>{
        currentLi.classList.remove('moving')
        var feature_order = document.getElementsByName("feature_order");
        var keys = [];
        for(var i =0; i<feature_order.length; i++){
            keys.push(feature_order[i].innerText)
        };
        displayResult(keys) // if the block are dragged over, the reshow the new figure
    })
    displayResult(features)
    function displayResult(keys){
        svg.selectAll("g").remove();
        legendContainer.selectAll("div").remove();
        showLegend(keys, color)
        // Set the sankey diagram properties
        var sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(40)
            .size([width, height]);

        var path = sankey.link();

        var tag_features = new Array();
        tag_features.push(new Set(d3.merge(d3.map(data, (d)=>d.TagMode.split(','))).filter((d) => d!="").map(d => "Mode_" + d.trim())));
        tag_features.push(new Set(d3.merge(d3.map(data, (d)=>d.TagStyle.split(','))).filter((d) => d!="").map(d => "Style_" + d.trim())));
        tag_features.push(new Set(d3.merge(d3.map(data, (d)=>d.TagPerson.split(','))).filter((d) => d!="").map(d => "Person_" + d.trim())));
        tag_features.push(new Set(d3.merge(d3.map(data, (d)=>d.TagDimension.split(','))).filter((d) => d!="").map(d => "Dimension_" + d.trim())));
        tag_features.push(new Set(d3.merge(d3.map(data, (d)=>d.TagNumPlayer.split(','))).filter((d) => d!="").map(d => "NumPlayer_" + d.trim())));

        function getCategory(set) {
            for (let item of set) {
                let category = item.split('_')[0];
                if (keys.includes(category)) {
                    return category;
                }
            }
            return null;
        }

        tag_features.sort((a, b) => {
            let categoryA = getCategory(a);
            let categoryB = getCategory(b);
            return keys.indexOf(categoryA) - keys.indexOf(categoryB);
        });

        var frequency_list = new Array();
        for(var u=0; u<tag_features.length-1; u++){
            for(var i=0; i<tag_features[u].size; i++){
                for(var j=0; j<tag_features[u+1].size; j++){
                    frequency_list.push({"source": Array.from(tag_features[u])[i], "target": Array.from(tag_features[u+1])[j], "value": 0})
                }
            }
        }

        frequency_list.forEach(function(d){
            var count = 0
            var feat1 = d["source"].split("_")[0];
            var t1 = d["source"].split("_")[1];
            var feat2 = d["target"].split("_")[0];
            var t2 = d["target"].split("_")[1];

            data.forEach(function(d){
                if(d["Tag"+feat1].includes(t1) && d["Tag"+feat2].includes(t2)){
                    count += 1
                }
            })
            d["value"] = count
        })

        frequency_list = Object.values(frequency_list)


        graph = {"nodes" : [], "links" : []};
        frequency_list.forEach(function (d) {
            graph.nodes.push({ "name": d.source });
            graph.nodes.push({ "name": d.target });
            graph.links.push({ "source": d.source,
                                "target": d.target,
                                "value": +d.value });
        });

        // return only the distinct / unique nodes
        // graph.nodes = d3.keys(d3.nest()
        // .key(function (d) { return d.name; })
        // .object(graph.nodes));

        graph.nodes = Array.from(d3.group(graph.nodes, d => d.name).keys());
        // loop through each link replacing the text with its index from node
        graph.links.forEach(function (d, i) {
            graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
            graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
        });
        // now loop through each nodes to make nodes an array of objects
        // rather than an array of strings
        graph.nodes.forEach(function (d, i) {
            graph.nodes[i] = { "name": d };
        });
        
        sankey.nodes(graph.nodes)
                .links(graph.links)
                .layout(1);

        // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; });

        // add the link titles
        link.append("title")
                .text(function(d) {
                return d.source.name + " → " + 
                        d.target.name + "\n" + format(d.value); });

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.drag()
                .subject(function(d) {
                return d;
                })
                .on("start", function() {
                this.parentNode.appendChild(this);
                })
                .on("drag", dragmove));

        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) {
            return d.color = color((d.name).split('_')[0].replace(/ .*/, "")); })   //adding color corresponding to each feature
            .style("stroke", function(d) { 
            return d3.rgb(d.color).darker(2); })
            .append("title")
            .text(function(d) { 
            return d.name + "\n" + format(d.value); });

        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .style("font", "15px sans-serif")
            .style("fill", "white")
            .text(function(d) { return (d.name).split('_')[1]; })
            .filter(function(d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(event, d) {
            d3.select(this)
            .attr("transform", 
                "translate(" 
                    + d.x + "," 
                    + (d.y = Math.max(
                        0, Math.min(height - d.dy, event.y))
                    ) + ")"
            );
            sankey.relayout();
            link.attr("d", path);
        };}
    function showLegend(legendList, color){
        // Add div for each label
        var legendItems = legendContainer.selectAll("div")
        .data(legendList)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .attr("name", "feature_order")
        .attr("draggable", "true")
        .style("display", "inline-block")
        .style("padding", "5px");
    
        // Add a square represent color for each label
        legendItems.append("div")
            .style("width", "20px")
            .style("height", "20px")
            .style("background-color", function(d) { return color(d); })
            .style("display", "inline-block")
            .style("margin-right", "10px");
    
        // Add label name
        legendItems.append("div")
            .text(function(d) { return d; })
            .style("display", "inline-block");
    }
}
