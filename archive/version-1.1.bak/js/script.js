/*global d3, SelectionTree*/

var dataObj = {readyState:false};
dataObj.dataSet = []; //destinationArray

dataObj.margin = {top: 40, right: 10, bottom: 50, left: 50};
dataObj.width = 600 - dataObj.margin.left - dataObj.margin.right;
dataObj.height = 300 - dataObj.margin.top - dataObj.margin.bottom;



var selectionTree = new SelectionTree();


getDate(dataObj.dataSet);
var data = null;

var barTotal = [];
var labels = [];

var color = d3.scale.linear()
  .domain([0, 3])
  .range(["#aad", "#556"]);


//creating layers
var freeITLayer = new Layer({label:"IT Freih&auml;nder", color:"rgb(217, 58, 26)"});
var regularITLayer = new Layer({label:"IT normale Zuschl&auml;ge", color:"rgb(39, 105, 101)"});
var freeNoITLayer = new Layer({label:"Nicht IT Freih&auml;nder", color:"rgb(198, 153, 29)"});
var regularNoITLayer = new Layer({label:"Nicht IT normale Zuschl&auml;ge", color:"rgb(0, 66, 2)"});

regularNoITLayer.disable();
freeNoITLayer.disable();

var layerManager = new LayerManager();
//add and order (bottom uo)

layerManager.addLayer(freeITLayer);
layerManager.addLayer(regularITLayer);
layerManager.addLayer(freeNoITLayer);
layerManager.addLayer(regularNoITLayer);

function percentage(total, portion){
  if(total===0)return 0;
  return portion/total*100;
}
//---------------------------------------------------------------------------------------------------

dataObj.labels = [];

dataObj.init = function(){
  d3.selectAll("input").on("change", change);
  layerManager.drawLegend();
  
  disableSelection(document);
  
  document.getElementById("legend").style.cursor = "pointer";
  d3.select("#legend").selectAll("input").on("change", dataObj.drawGraph);
  d3.select("#legend").selectAll("div").on("dblclick", function(){dragstart(this);});
  d3.select("#legend").selectAll("div").on("mouseover", function(){draghere(this);});
  dataObj.representation = "absolute";
  dataObj.representationUnit = "";
  
  
  //draw selection tree
  selectionTree.drawTree(document.getElementById("selection"));
  
  d3.select("#selection").selectAll(".selectionBox").on("change", function(){this.selectionTree.toggle(this)});
  d3.select("#selection").selectAll(".openclose").on("click", function(){this.selectionTree.openCloseFcn(this)});
  d3.select("#selection").selectAll(".updater").on("click", function(){this.parent.update()});
  
  
  d3.select("#h2c").on("click", function(){
    var chart = $("#chartbox");
    var collection = document.getElementById("collection");
    html2canvas(chart, {
            onrendered: function(canvas) {
                theCanvas = canvas;
                collection.appendChild(canvas);
            }
    });
    /*
    html2canvas(document.body, {
        onrendered: function(canvas) {
          document.body.appendChild(canvas);
        }
        });
    */    
  });
  
  /*
  for(var i in dataObj.dataSet){
    labels[i] = dataObj.dataSet[i].label;
  }
  */

  var regIT;

  for(var i in dataObj.dataSet){
      //if(i<10)continue;
      //labels[i] = dataObj.dataSet[i].label;
      dataObj.labels[i] = {};
      dataObj.labels[i].checkbox = dataObj.dataSet[i].checkbox;
      dataObj.labels[i].text = dataObj.dataSet[i].label; 
      regIT = dataObj.dataSet[i].totalIT-dataObj.dataSet[i].freeIT;
      freeITLayer.addValue(dataObj.dataSet[i].freeIT);
      regularITLayer.addValue(regIT);
      freeNoITLayer.addValue(dataObj.dataSet[i].totalFree-dataObj.dataSet[i].freeIT);
      regularNoITLayer.addValue(dataObj.dataSet[i].total-dataObj.dataSet[i].totalFree-regIT);
  }



  dataObj.drawGraph();
};

//---------------------------------------------------------------------------------------------------

dataObj.drawGraph = function() {
  selectionTree.setGreen();
  //clear old stuff
  document.getElementById("chartbox").innerHTML = "";
  delete dataObj.svg;
  dataObj.svg = d3.select("#chartbox").append("svg")
    .attr("width", dataObj.width + dataObj.margin.left + dataObj.margin.right)
    .attr("height", dataObj.height + dataObj.margin.top + dataObj.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + dataObj.margin.left + "," + dataObj.margin.top + ")");


  if(dataObj.representation == "perBar") {
    barTotal = layerManager.getBarTotal();
  }

  dataObj.n = layerManager.getAmountOfActiveLayer(); // number of layers
  dataObj.m = selectionTree.getTree().children.Gesamt.activeChildren;// number of samples per layer (how many bars)
  //before used dataObj.dataSet.length; 
  
  
  dataObj.stack = d3.layout.stack();
  
  var layerCounter = 0;
  
  layers = dataObj.stack(d3.range(dataObj.n).map(function () {
    var a = layerManager.getActiveLayer(layerCounter).getValues();
    layerCounter++;

    return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
  }));
  yGroupMax = d3.max(layers, function (layer) {
    return d3.max(layer, function (d) {
      return d.y;
    });
  });
  yStackMax = d3.max(layers, function (layer) {
    return d3.max(layer, function (d) {
      return d.y0 + d.y;
    });
  });


  dataObj.x = d3.scale.ordinal()
    .domain(d3.range(dataObj.m))
    .rangeRoundBands([0, dataObj.width], 0.08);

  dataObj.y = d3.scale.linear()
    .domain([0, yStackMax])
    .range([dataObj.height, 0]);

  dataObj.layer = dataObj.svg.selectAll(".layer")
    .data(layers)
    .enter().append("g")
    .attr("class", "layer")
    .style("fill", function (d, i) {
      return layerManager.getActiveLayer(i).getColor();
    });

  dataObj.rect = dataObj.layer.selectAll("rect")
    .data(function (d) {
      return d;
    })
    .enter().append("rect")
    .attr("x", function (d) {
      return dataObj.x(d.x);
    })
    .attr("y", dataObj.height)
    .attr("width", dataObj.x.rangeBand())
    .attr("height", 0);

  dataObj.rect.transition()
    .delay(function (d, i) {
      return i * 10;
    })
    .attr("y", function (d) {
      return dataObj.y(d.y0 + d.y);
    })
    .attr("height", function (d) {
      d.height = dataObj.y(d.y0) - dataObj.y(d.y0 + d.y);
      return d.height;
    });

  var dMap = 0; //d runs from 0 to x. so dMap is to count forward to next checked one
  var counter = 0;
  dataObj.xAxis = d3.svg.axis()
    .scale(dataObj.x)
    .tickFormat(function(d) {
      for(dMap;dMap<dataObj.labels.length;dMap++){
        if(dataObj.labels[dMap].checkbox.checked){
          counter++;
          if(counter%2==1||dataObj.m<50){  //wenn zuviele nur noch jedes zweite anzeigen
            return dataObj.labels[dMap++].text;
          }else{
            dMap++; //muss trotzdem hochzählen
            return "";
          }
        }
      }
    })
    .tickSize(3)
    .tickPadding(6)
    .orient("bottom");

  dataObj.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + dataObj.height + ")")
    .call(dataObj.xAxis)
    .selectAll("text")
    .attr("y", 8)
    .attr("x", 0)
    .attr("dy", ".35em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

  dataObj.yAxis = d3.svg.axis()
    .scale(dataObj.y)
    .tickFormat(function(d) {return d+dataObj.representationUnit;})
    .tickSize(3)
    .tickPadding(6)
    .orient("bottom");

  dataObj.svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "rotate(90)")
    .call(dataObj.yAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", -6)
    .attr("dy", ".35em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end");

  document.getElementById("stackbutton").checked = true;

};


function change() {

  if (this.value == "grouped") {
    transitionGrouped();
  } else if (this.value == "stacked") {
    transitionStacked();
  } else if (this.value == "absolute") {
    dataObj.representation = "absolute";
    dataObj.representationUnit = "";
    dataObj.drawGraph();
  } else if (this.value == "perTotal") {
    dataObj.representation = "perTotal";
    dataObj.representationUnit = "%";
    dataObj.drawGraph();
  } else if (this.value == "perBar") {
    dataObj.representation = "perBar";
    dataObj.representationUnit = "%";
    dataObj.drawGraph();
  } else {
  }
}

function transitionGrouped() {
  dataObj.y.domain([0, yGroupMax]);

  dataObj.rect.transition()
    .duration(500)
    .delay(function(d, i) { return i * 10; })
    .attr("x", function(d, i, j) { return dataObj.x(d.x) + dataObj.x.rangeBand() / dataObj.n * j; })
    .attr("width", dataObj.x.rangeBand() / dataObj.n)
    .transition()
    .attr("y", function(d) {return dataObj.y(0)-d.height;});
}

function transitionStacked() {
  dataObj.y.domain([0, yStackMax]);

  dataObj.rect.transition()
    .duration(500)
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return dataObj.y(d.y0 + d.y); })
    .attr("height", function(d) { return d.height; })
    .transition()
    .attr("x", function(d) { return dataObj.x(d.x); })
    .attr("width", dataObj.x.rangeBand());
}


var isDragging = false;
var dragObjekt = null;

function dragstart(element) {
  isDragging = true;
  dragObjekt = element;
  element.style.border = "1px dotted black";
}

function draghere(element) {
  if((isDragging)&&(dragObjekt!=element)&&(element.parentNode==dragObjekt.parentNode)){
    if(element.nextSibling == dragObjekt){
      element.parentNode.insertBefore(dragObjekt,element)
    }else{
      element.parentNode.insertBefore(dragObjekt,element.nextSibling)
    }
  }
}


document.onmouseup = function dragStop(){
  if(isDragging) {
    isDragging = false;
    dragObjekt.style.border = "none";
    dragObjekt = null;
    layerManager.reorderLayer();
  }
};

function disableSelection(target){
  target = document.getElementsByTagName('body')[0];
  if(typeof target.onselectstart!="undefined"){ //IE route
    target.onselectstart=function(){return false;};
  }else if(typeof target.style.MozUserSelect!="undefined"){ //Firefox route
    target.style.MozUserSelect="none";
  }else{ //All other route (ie: Opera)
    target.onmousedown=function(){return false;};
  }
}

