var Layer = function(options){
  options = options || {};
  var color = options.color || "";
  var label = options.label || "";
  var dataArray = [];
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;
  checkbox.style.background = "grey";
  checkbox.belongingLayert = this;


  this.setColor = function(colorParam){
    color = colorParam;
  };
  this.getColor = function(){
    return color;
  };
  this.getLabel = function(){
    return label;
  };
  this.getCheckbox = function(){
    return checkbox;
  };

  this.addValue = function(value){
    dataArray[dataArray.length] = value;
  };
  this.getLastValue = function(){
    if(dataArray.length===0)return null;
    return dataArray[dataArray.length-1];
  };
  
  /*returns array of selected data as objects of the value and the actual index in the dataSet*/
  this.getValues = function(options){
    options = options || {};
    var representation = options.representation || dataObj.representation;
    var a=[];
    //representation adaptation
    var k;
    var ak=0;
    for (k in dataObj.dataSet){
      if(dataObj.labels[k].checkbox.checked){
        if (representation == "perTotal"){
          a[ak] = {value:percentage(dataObj.dataSet[k].total, dataArray[k]),index:k};
        } else if (representation == "perBar") {
          a[ak] = {value:percentage(barTotal[ak], dataArray[k]),index:k};  
          //barTotal is calculatet in layermanager and is already reduced to the checked lenght
          //because it gets the its data from here with param rep:absolute
        }else{
          a[ak]={value:dataArray[k],index:k};
        }
        ak++;
      }
    }
    if(options.getOriginal)
      a=dataArray;
    return a;
  };

  this.isEnabled = function(){
    return checkbox.checked;
  };
  this.disable = function(){
    checkbox.checked = false;
  };
  this.switchEnebledState = function(){
    checkbox.checked = !checkbox.checked;
  };



}
