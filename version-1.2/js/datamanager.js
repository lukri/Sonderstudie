//selectionTree is defined in script.js

function getDate(destinationArray){
  loadDataFromFile('data/data-test.csv',destinationArray);
  //loadDataFromFile('data/data-reduced.scv2',destinationArray);
  return dataObj;
}

function loadDataFromFile(filePath, destinationArray){
  setDataReadyState(false);
  // https://github.com/mbostock/d3/wiki/CSV
  var dsv = d3.dsv(";", "text/plain");
  var temp = {};
  dsv(filePath).get(function(error, rows) {
    for(var i in rows){
      temp = rows[i];
      temp.label = temp.Datum;
      temp.month = temp.Datum.slice(0,3);
      temp.year = temp.Datum.slice(-2);
      temp.freeIT = temp["IT-Freihaender"];
      temp.totalIT = temp["IT-Zuschlaege"];
      temp.totalFree = temp["Freihaender"];
      temp.total = temp["Zuschlaege"];
      temp.checkbox = selectionTree.addPathCountAndReturnLastCheckbox(["Gesamt",temp.year,temp.month]);
      destinationArray[i] = temp;
    }
    setDataReadyState(true);
    dataObj.init();
  });
}

function setDataReadyState(state) {
  dataObj.readyState = state;
}
