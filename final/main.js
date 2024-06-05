"use strict";
const dataPath = "../Processed_data/games_all.csv"

var menu_container = document.querySelector('.top-menu');
var divTooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var TagModeContainer = d3.select(".dropdown-content");

const data = d3.csv(dataPath).then(function(data){
    const filter_data = d3.filter(data, function(d){return d.Type == "game"});
    var free = d3.filter(filter_data, function(d){return d.Price == 0});
    var nofree = d3.filter(filter_data, function(d){return d.Price != 0});
    var p_wo_d = d3.filter(nofree, function(d){return d.PriceDiff == 0});
    var p_w_d = d3.filter(nofree, function(d){return d.PriceDiff != 0});



    var top_data = d3.filter(filter_data, function(d){return +d.Comment_Positive/+d.Comment_All >= 0.9 && d.Comment_All > 1e+5})
    var adv_data = d3.filter(filter_data, function(d){return +d.Comment_Positive/+d.Comment_All >= 0.8 && !(d in top_data)})
    var good_data = d3.filter(filter_data, function(d){return +d.Comment_Positive/+d.Comment_All >= 0.5 && d.Comment_Positive/+d.Comment_All < 0.8})
    var normal_data = d3.filter(filter_data, function(d){return +d.Comment_Positive/+d.Comment_All >= 0.4 && d.Comment_Positive/+d.Comment_All < 0.6})
    var bad_data = d3.filter(filter_data, function(d){return +d.Comment_Positive/+d.Comment_All <0.4})

    top_data.sort((a, b)=>b.Comment_All - a.Comment_All);
    adv_data.sort((a, b)=>+b.Comment_Positive/+b.Comment_All - +a.Comment_Positive/+a.Comment_All);
    good_data.sort((a, b)=>+b.Comment_Positive/+b.Comment_All - +a.Comment_Positive/+a.Comment_All);
    normal_data.sort((a, b)=>+b.Comment_Positive/+b.Comment_All - +a.Comment_Positive/+a.Comment_All);
    bad_data.sort((a, b)=>+b.Comment_Positive/+b.Comment_All - +a.Comment_Positive/+a.Comment_All);
    var popular_data = d3.merge([top_data, adv_data, good_data, normal_data, bad_data]);
    var tagmodes = new Set(d3.merge(d3.map(filter_data, (d)=>d.TagMode.split(','))).filter((d) => d!="").map(d => d.trim()));
    var tagstyles = new Set(d3.merge(d3.map(filter_data, (d)=>d.TagStyle.split(','))).filter((d) => d!="").map(d => d.trim()));

    // add buttons
    d3.select("#TagMode").selectAll("div")
    .data(tagmodes)
    .enter()
    .append("button")
    .attr("class", "nn")
    .attr("value", function(d){return "mode_" + d})
    .text(function(d){return d});

    d3.select("#TagStyle").selectAll("div")
    .data(tagstyles)
    .enter()
    .append("button")
    .attr("class", "nn")
    .attr("value", function(d){return "style_" + d})
    .text(function(d){return d});

    // price(free, p_wo_d, p_w_d, filter_data);
    GameList(popular_data);
    // draw(filter_data);

    let buttonList = menu_container.querySelectorAll("button");
    var temp_order = '';

    buttonList.forEach(function(i){
        i.addEventListener("click", function(e){
            var order = e.target.getAttribute("value");
            if(order == "" || order == temp_order){  // double click will refresh to the front page
                buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 1; })
                GameList(popular_data);
                temp_order = '';
            }else if(order == "price"){
                buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 0.5; })
                buttonList[0].style.opacity = 1;
                e.target.style.opacity = 1;
                e.target.style.font = '15px sans-serif';
                e.target.style.fontWeight = 'bold';
                price(free, p_wo_d, p_w_d, filter_data);
                temp_order = order;
            }
            else if(order == "system"){
                buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 0.5; })
                buttonList[0].style.opacity = 1;
                e.target.style.opacity = 1;
                e.target.style.font = '15px sans-serif';
                e.target.style.fontWeight = 'bold';
                draw(filter_data);
                temp_order = order;
            }
            else if(order == "tags"){
                buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 0.5; })
                buttonList[0].style.opacity = 1;
                e.target.style.opacity = 1;
                e.target.style.font = '15px sans-serif';
                e.target.style.fontWeight = 'bold';
                sankey_diagram(filter_data);
                temp_order = order;
            }
            else if(order.includes("mode_")){
                buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 0.5; })
                buttonList[0].style.opacity = 1;
                e.target.style.opacity = 1;
                e.target.style.font = '15px sans-serif';
                e.target.style.fontWeight = 'bold';
                var mode_data = d3.filter(filter_data, function(d){return d.TagMode.includes(order.slice(5, -1))});
                GameList(mode_data);
                temp_order = order;
            }
            else if(order.includes("style_")){
                buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 0.5; })
                buttonList[0].style.opacity = 1;
                e.target.style.opacity = 1;
                e.target.style.font = '15px sans-serif';
                e.target.style.fontWeight = 'bold';
                var style_data = d3.filter(filter_data, function(d){return d.TagStyle.includes(order.slice(6, -1))});
                GameList(style_data);
                temp_order = order;
            }
        })
    })
})