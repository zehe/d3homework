$(document).ready(function(){
    $.ajax({
        type: "GET",
        url: "./car.csv",
        dataType: "text",
        success: function(allText) {
            var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    for (var j=1; j<headers.length-1; j++) {
        $('#sel-x')
            .append($("<option/>",{
                      value:headers[j],
                      text:headers[j]
                      }));
        
        $('#sel-y')
            .append($("<option/>",{
                      value:headers[j],
                      text:headers[j]
                      }));
    }
        }
     });
    
    var w= 940,
    h= 300,
    pad = 20,
    left_pad = 100;

var svg = d3.select("svg")
            .attr("width",w)
            .attr("height",h);

var x = d3.scale.linear().domain([0, 500]).range([left_pad, w-pad]).nice(),
    y = d3.scale.linear().domain([0, 50]).range([h-pad*2, pad]).nice();

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var parseDate = d3.time.format("%y").parse;
    
d3.csv("./car.csv", function(values){
        
    values.forEach(function(d){
        d.mpg= +d.mpg,
        d.cylinders= +d.cylinders,
        d.displacement= +d.displacement,
        d.horsepower= +d.horsepower,
        d.weight= +d.weight,
        d.acceleration= +d.acceleration,
        d.modelyear= parseDate(d["model.year"])
        });
        
        x.domain([0, d3.max(values, function(d) { return d[$('#sel-x').val()]; })]).range([left_pad, w-pad]).nice();
            
        y.domain([0, d3.max(values, function(d) { return d[$('#sel-y').val()]; })]).range([h-pad*2, pad]).nice();
           
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, "+(h-pad)+")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", w)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text($('#sel-x').val());
 
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+(left_pad-pad)+", 0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text($('#sel-y').val())
    
    svg.append("text")
        .attr("class", "loading")
        .text("Loading ...")
        .attr("x", function () { return w/2; })
        .attr("y", function () { return h/2-5; });
        
        svg.selectAll(".loading").remove();
        
        var cir = svg.selectAll("circle").data(values);
        
        cir
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function (d) { return x(d[$('#sel-x').val()]);})
        .attr("cy", function (d) { return y(d[$('#sel-y').val()]);})
        .attr("r", function () { return 2; })
        .on("click", function(d){
            $("#hovered").html(d.name);
        });
    
    $('#sel-x').change(function(){
        x.domain([0, d3.max(values, function(d) { return d[$('#sel-x').val()]; })]);
            
        y.domain([0, d3.max(values, function(d) { return d[$('#sel-y').val()]; })]);
        
        cir
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return x(d[$('#sel-x').val()]);})
        .attr("cy", function (d) { return y(d[$('#sel-y').val()]);})
        
        svg.select(".x.axis")
            .transition()
            .duration(1000)
            .call(xAxis)
            .select(".label")
            .text($('#sel-x').val());
        
        update();

    });
    
    $('#sel-y').change(function(){
        x.domain([0, d3.max(values, function(d) { return d[$('#sel-x').val()]; })]).range([left_pad, w-pad]).nice();
            
        y.domain([0, d3.max(values, function(d) { return d[$('#sel-y').val()]; })]).range([h-pad*2, pad]).nice();
        
        cir
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return x(d[$('#sel-x').val()]);})
        .attr("cy", function (d) { return y(d[$('#sel-y').val()]);})
        
        svg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(yAxis)
            .select(".label")
            .text($('#sel-y').val());
        
        update();
    });
    
    $('#update').click(function(){    
        checkValidate();   
        update();
    })
    
    cir.exit().remove(); 
    
    function update(){
        var html = document.getElementById("alert").innerHTML;
        
        if(html == "Updated"){
            var filtereddata = values.filter(function(d){ return d['mpg'] >= +$('#mpg-min').val() && d['mpg'] <= +$('#mpg-max').val()});
        
        var newcir = svg.selectAll("circle").data(filtereddata);
        
//        newcir
//        .enter()
//        .append("circle")
//        .transition()
//        .duration(1000)
            
        newcir
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function (d) { return x(d[$('#sel-x').val()]);})
        .attr("cy", function (d) { return y(d[$('#sel-y').val()]);})
        .attr("r", function () { return 2; })
        .on("click", function(d){
            $("#hovered").html(d.name);
        })
        .transition()
        .duration(1000)
        
        
        newcir
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return x(d[$('#sel-x').val()]);})
        .attr("cy", function (d) { return y(d[$('#sel-y').val()]);})
        
        newcir.exit().remove();
        }
    }
    
    
    });
});

function checkValidate() {
    var min, max, text;
    
    min = $('#mpg-min').val();
    max = $('#mpg-max').val();
    text = "Updated";
    
    if(isNaN(min) || isNaN(max)){
        text = "This Query input can only accept number!";
    }else if( min > max){
        text = "Min should be smaller than Max";
    }
    
    document.getElementById("alert").innerHTML = text; 
    
}