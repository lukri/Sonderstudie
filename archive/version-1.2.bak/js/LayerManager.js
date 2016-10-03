var LayerManager = function (){
  var layerArray = [];
  this.addLayer = function(layer){
    layerArray[layerArray.length] = layer;
  };
  this.getActiveLayer = function(index){
    index++;
    for(var i in layerArray){
      if(layerArray[i].isEnabled())index--;
      if(index===0)return layerArray[i];
    }
    return null;
  };
  this.getAmountOfActiveLayer = function(){
    var counter = 0;
    for(var i in layerArray){
      if(layerArray[i].isEnabled())counter++;
    }
    return counter;
  };

  this.drawLegend = function(){
    var legend = document.getElementById("legend");
    for(var i=layerArray.length-1;i>=0;i--){
      var container = document.createElement("div");
      var colorBox = document.createElement("span");
      colorBox.appendChild(layerArray[i].getCheckbox());
      colorBox.style.background = layerArray[i].getColor();
      colorBox.style.margin = "5px";
      colorBox.style.padding = "5px";
      var labelBox = document.createElement("span");
      labelBox.innerHTML = layerArray[i].getLabel();
      container.appendChild(colorBox);
      container.appendChild(labelBox);
      legend.appendChild(container);
    }
  };
  this.reorderLayer = function(){
    var checkboxes = document.getElementById("legend").getElementsByTagName("input");
    var k = checkboxes.length-1;
    layerArray = [];
    for(var i=0;i<=k;i++)
      layerArray[i] = checkboxes[k-i].belongingLayert;
    dataObj.drawGraph();
  };

  this.getBarTotal = function(){
    var total = [];
    for (var i = 0; i < this.getAmountOfActiveLayer(); i++) {
      var a = this.getActiveLayer(i).getValues({representation: "absolute"});
      for (var k in a) {
        total[k] = parseFloat(total[k] || 0) + parseFloat(a[k]);
      }
    }
    return total;
  };

};
