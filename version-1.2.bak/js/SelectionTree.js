var SelectionTree = function(options){
  options = options || {};
  
  var tree = {};
  tree.isRoot = true;
  tree.children = {};
  tree.childrenOrder = [];
  
  
  this.addPathCountAndReturnLastCheckbox = function(path){
    path = path || [];
    var parentChildren = tree.children;
    var parentObj = tree;
    var lastCheckbox;
    for(var i=0; i< path.length; i++){
      if(!parentChildren[path[i]]){
        parentChildren[path[i]]={};
        parentChildren[path[i]].name = path[i];
        parentObj.childrenOrder[parentObj.childrenOrder.length] = path[i];
        parentChildren[path[i]].amount = 0;
        parentChildren[path[i]].children = {};
        parentChildren[path[i]].childrenOrder = [];
        parentChildren[path[i]].treeParent = parentObj;
        
        parentChildren[path[i]].openCloseButton = document.createElement("input");
        parentChildren[path[i]].openCloseButton.type = "button";
        parentChildren[path[i]].openCloseButton.value = "+";
        parentChildren[path[i]].openCloseButton.className = "openclose";
        parentChildren[path[i]].openCloseButton.parent = parentChildren[path[i]]; 
        parentChildren[path[i]].openCloseButton.selectionTree = this;
        
        parentChildren[path[i]].checkbox = document.createElement("input");
        parentChildren[path[i]].checkbox.type = "checkbox";
        parentChildren[path[i]].checkbox.className = "selectionBox";
        parentChildren[path[i]].checkbox.parent = parentChildren[path[i]]; 
        parentChildren[path[i]].checkbox.selectionTree = this;
        
        lastCheckbox = parentChildren[path[i]].checkbox;
      }
      parentChildren[path[i]].amount++;  
      parentObj = parentChildren[path[i]];
      parentChildren = parentChildren[path[i]].children;
    }
    return lastCheckbox;
  };
  
  this.getTree = function(){
    return tree;
  };
  
  
  
  
  
  this.update = function(){
    dataObj.drawGraph();  
  };
  
  this.setGreen = function(){
    this.selectionUpdater.button.value = "Aktuell"; 
    this.selectionUpdater.button.style.color = "green";
    this.selectionUpdater.button.disabled = true;   
  };
  
  this.setRed = function(){
    this.selectionUpdater.button.value = "Aktualisieren!";
    this.selectionUpdater.button.style.color = "red";
    this.selectionUpdater.button.disabled = false; 
  };
  
  
  this.selectionUpdater = {};
  this.selectionUpdater.button = document.createElement("input");
  this.selectionUpdater.button.type = "button";
  this.selectionUpdater.button.className = "updater";
  this.selectionUpdater.button.parent = this;
  this.setGreen();
  
  
  
  this.drawTree = function(HTMLParent){
    HTMLParent.appendChild(this.selectionUpdater.button);
    var list = document.createElement("ul");
    list.style.listStyleType = "none";
    HTMLParent.appendChild(list);
    drawChildren(list,tree);
    
    //select latest year; last child of the first child of tree;
    //http://stackoverflow.com/questions/983267/access-the-first-property-of-an-object
    /*tc = tree.children; //trees first child
    tcc = tc[Object.keys(tc)[0]].children; //first child of first child
    tccn = tcc[Object.keys(tcc)[0]]; //and its firstchild's node*/
    
    tco0 = tree.childrenOrder[0];
    tcco = tree.children[tco0].childrenOrder;
    tcLastChild = tree.children[tco0].children[tcco[tcco.length-1]];
    this.toggle(tcLastChild.checkbox, true, true);
    this.openCloseFcn(tree.children.Gesamt.openCloseButton);
    
  };
  
  function drawChildren(HTMLParent,treeParent){
    var tPcO = treeParent.childrenOrder;
    for(var i in tPcO){
      var treeChildName = tPcO[tPcO.length-1-i]; //reverse order
      var treeChild = treeParent.children[treeChildName];
      var child = document.createElement("li");
      HTMLParent.appendChild(child);
      child.appendChild(treeChild.checkbox);
      //treeChild.checkbox.checked = true;
      var label = document.createElement("span");
      label.innerHTML = treeChildName;
      child.appendChild(label);
      if(treeChild.childrenOrder.length!==0){
        child.appendChild(treeChild.openCloseButton);
        var list = document.createElement("ul");
        list.style.display = "none";
        list.style.listStyleType = "none";
        treeChild.openCloseButton.childList = list;
        child.appendChild(list);
        drawChildren(list,treeChild);
      }
      
      
      
    } 
  }
  
  this.toggle = function(inputElement, internCall, forceChildren){
    internCall = internCall || false;
    forceChildren = forceChildren || false;
    
    if(internCall&&forceChildren)inputElement.checked = !inputElement.checked;
    
    if(!internCall || forceChildren){ //it was clicked by user and children have to be forced. or progammatigally forceChildren
      this.adaptChildren(inputElement.parent);
    }
    
    
    inputElement.parent.activeChildren = 0;
    for(var i in inputElement.parent.children){
        if(inputElement.parent.children[i].checkbox.checked){
            inputElement.parent.activeChildren+=inputElement.parent.children[i].activeChildren||1;
        }    
    }
    if(internCall){
        inputElement.checked=(inputElement.parent.activeChildren>0);
    }
    
    
    if(!inputElement.parent.treeParent.isRoot){
      this.toggle(inputElement.parent.treeParent.checkbox,true);
    }else{
      this.setRed();
    }
    
    
  };
  
  
  this.adaptChildren = function(parent){
    var activeC = 0;
    for(var i in parent.children){
      parent.children[i].checkbox.checked = parent.checkbox.checked;  
      if(parent.children[i].checkbox.checked)
        activeC += parent.children[i].activeChildren||1;
      this.adaptChildren(parent.children[i]);
    }
    parent.activeChildren = activeC;
  };
  
  
  this.openCloseFcn = function(openCloseButton){
    openCloseButton = openCloseButton.parent.openCloseButton;
    if(openCloseButton.childList.style.display=="none"){
        openCloseButton.childList.style.display = "block";
        openCloseButton.value = "-";
    }else{
        openCloseButton.childList.style.display = "none";
        openCloseButton.value = "+";
    }
  };
  
  
  
  
};
