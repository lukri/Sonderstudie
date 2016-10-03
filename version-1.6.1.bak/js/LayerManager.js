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
      var layer = layerArray[i];
      var cbId = "cbl"+i;
      var container = document.createElement("div");
      
      var cb = layerArray[i].getCheckbox();
      cb.id = cbId;
      container.appendChild(cb);
      var label = document.createElement("label");
      label.setAttribute("for",cbId);
      label.style.background = layer.getColor();
      container.appendChild(label);
     
      var labelBox = document.createElement("span");
      labelBox.innerHTML = '<label for="'+cbId+'">'+": "+layerArray[i].getLabel()+'</label>';
      container.appendChild(labelBox);
      
      var mover = document.createElement("span");
      mover.innerHTML = "&equiv;";
      mover.setAttribute("class","mover");
      container.appendChild(mover);
      
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

  this.getBarTotal = function(options){
    options = options || {};
    var getAllBars = options.getAllBars;
    var total = [];
    for (var i = 0; i < this.getAmountOfActiveLayer(); i++) {
      var a = this.getActiveLayer(i).getValues({representation: "absolute"});
      for (var k=0; k<a.length;k++) {
        total[k] = parseFloat(total[k] || 0) + parseFloat(a[k].value);
      }
    }
    return total;
  };

};
