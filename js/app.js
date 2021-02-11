function load_page() {

  //******Initialize bootstrap tooltip
  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $(function () {
    $('[data-toggle="popover"]').popover()
  })

  //******Add header
  d3.select("body")
    .append("div")
    .attr("class", "header")
    .html('<a href="https://www.fws.gov/northeast/fisherycenter/" target="_blank"><img id="usfws" src="images/usfws.png" title="US Fish & Wildlife Service - Northeast Fishery Center" target="_blank"></img></a><div id="headerDiv"><h1>OpenTrons Protocol Generator</h1><div class="headerLinks"><p id="intro" class="introLink" title="Click to initiate a walkthrough highlighting the features and functions of the app">Tutorial</p><p id="resources" class="introLink" title="Click to download protocols and access contact information for questions or comments about the app">Resources</p></div></div>');

  d3.select("#intro").on("click", function() { startIntro(); });
  d3.select("#resources")
    .attr("data-toggle", "modal")
    .attr("data-target", "#resourcesModal");


  //******Add generate
  d3.select("body")
    .append("div")
    .attr("id", "cleanDiv")
    .attr("class", "input")
    .html('<h3>Generate<span id="introI" class="fa fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Enables the user to upload necessary files that will be used in the generation of the selected OpenTrons protocol"></span></h3>'
      + '<form id="protocolForm" action="javascript:;" onsubmit="generate(this)">'
        + '<table id="protocolTable" style="border-collapse:separate;">'
          + '<tr>'
            + '<td colspan="3" style="text-align:left;">'
              + '<button type="reset" id="resetBut" class="formBut btn btn-primary" title="Click to reset the form"><span class="fa fa-repeat"></span> Reset</button>'
            + '</td>'
          + '</tr>'

          + '<tr>'
            + '<td class="labelDiv">Select a protocol:</td>'
            + '<td>'
              + '<select id="protocolSel" class="formInput name="protocolSel" required></select>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Protocol descriptions:<ul><li><b>DNA Dilution</b> - Used to dilute extracted DNA samples to 0.2 ng/ul</li><li><b>Library Dilution</b> - Used to dilute PCR product of samples to 4 nM concentrations and combine into a single 1.5 ml tube</li><ul></p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr class="fileTR">'
            + '<td class=labelDiv>Provide a quantification file:</td>'
            + '<td>'
              + '<input type="file" id="quantFile" class="formInput" name="quantFile" accept=".xlsx,.csv"></input>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>An Excel or CSV file that contains information about the samples (e.g. DNA concentration, fragment size)</p>"></span><a class="fileExamp" id="quantFileExamp" href="files/OT2_Dilutions_File.xlsx" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="Example of a DNA quantification file"><span id="exampFile" class="fa fa-file" ></span></a>'
            + '</td>'
          + '</tr>'

          + '<tr id="quantSheetTR" class="sheetTR">'
            + '<td class="labelDiv">Select worksheet:</td>'
            + '<td>'
              + '<select id="quantSheetSel" class="formInput" name="quantSheetSel"></select>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Select which worksheet to use for the protocol creation.</p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr id="mapLabelTR" class="mapTR">'
            + '<td colspan="3" class="labelDiv">Map the below fields:</td>'
          + '</tr>'
          + '<tr id="concMap" class="mapTR">'
            + '<td class="mapLabel">Concentration:</td>'
            + '<td>'
              + '<select id="concColSel" class="formInput mapSel" name="concColSel"></select>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Select the column in the quantification file that contains DNA concentration data (ng/ul) for the samples to be diluted.</p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr id="fragMap" class="mapTR">'
            + '<td class="mapLabel">Fragment Length:</td>'
            + '<td>'
              + '<select id="fragColSel" class="formInput mapSel" name="fragColSel"></select>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Select the column in the quantification file that contains average DNA fragment size data (number of bases) for the samples to be diluted</p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr id="skipMap" class="mapTR">'
            + '<td class="mapLabel">Skip Sample:</td>'
            + '<td>'
              + '<select id="skipColSel" class="formInput mapSel" name="skipColSel"></select>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Select the column in the quantification file that contains information on whether to skip diluting this sample</p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr id="sampCountTR" class="mapTR sampTR">'
            + '<td class="labelDiv">Sample count:</td>'
            + '<td>'
              + '<input id="sampCount" class="formInput mapInput" type="number" name="sampCount" min="1" max="96" step="1" value="96"></input>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>A value between 1 and 96 representing the number of samples that will be diluted.</p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr id="sampRowTR" class="mapTR sampTR">'
            + '<td class="labelDiv">Start row:</td>'
            + '<td>'
              + '<input id="sampRow" class="formInput mapInput" type="number" name="sampRow" min="1" step="1" value="1"></input>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>An integer representing the row number in the quantification file of the first sample to be diluted.</p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr id="concTR" class="mapTR sampTR">'
            + '<td class="labelDiv">Final concentration:</td>'
            + '<td>'
              + '<input id="finalConc" class="formInput mapInput" type="number" name="finalConc" min="0" step="0.1"></input>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>The DNA concentration of the final dilution:<ul><li><b>DNA Dilution</b> - nanograms/microliter</li><li><b>Library Dilution</b> - nanomolar</li></ul></p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr id="trisTR" class="mapTR sampTR">'
            + '<td class="labelDiv">Tris Volume:</td>'
            + '<td>'
              + '<input id="trisVol" class="formInput mapInput" type="number" name="trisVol" min="1" max="50" step="1" value="50"></input>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>The starting volume (ml) of Tris in the 50 ml conical vial</p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr id="tipRack200TR" class="mapTR sampTR">'
            + '<td class="labelDiv">First Tip 200ul:</td>'
            + '<td>'
              + '<select id="tipStart200Sel" class="formInput mapInput" name="tipStart200Sel"></input>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>The starting well position for the 200 ul filter tip rack in deck slot 8 of the OpenTrons</p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr id="tipRack20TR" class="mapTR sampTR">'
            + '<td class="labelDiv">First Tip 20ul:</td>'
            + '<td>'
              + '<select id="tipStart20Sel" class="formInput mapInput" name="tipStart20Sel"></input>'
            + '</td>'
            + '<td>'
              + '<span class="fa fa-info-circle form" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>The starting well position for the 20 ul filter tip rack in deck slot 5 of the OpenTrons</p>"></span>'
            + '</td>'
          + '</tr>'

          + '<tr>'
            + '<td>'
              + '<button type="submit" id="runBut" class="formBut btn btn-primary" title="Click to generate a file for the current protocol"><span class="fa fa-play-circle"></span> Run</button>'
            + '</td>'
            + '<td>'
              + '<button type="button" id="downloadBut" class="formBut btn btn-primary" title="Click to download generated protocol file"><a id="downloadA" class="dlA stretched-link"><span class="fa fa-download"></span> Download</a></button>'
            + '</td>'
          + '</tr>'
        + '</table>'
        + '<div id="genResults">'
          + '<label class="labelDiv">Sample summary:</label>'
        + '</div>'
      + '</form>'
    );

  
  //***Populate tip rack start position
  tipArray = [];
  ["A","B","C","D","E","F","G","H"].forEach(function(col) {
    for(i = 1; i < 13; i++) {
      tipArray.push(col + i);
    }
  });
  d3.select("#tipStart200Sel").selectAll("option")
    .data(tipArray)
    .enter()
      .append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; }); 

  d3.select("#tipStart20Sel").selectAll("option")
    .data(tipArray)
    .enter()
      .append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; }); 


  d3.select("#resetBut").on("click", function() { 
    d3.selectAll(".fileTR,.sheetTR,.mapTR,#downloadBut,#genResults").style("display", "none");
    d3.select("#quantFile").property("required", false);
  });

  document.getElementById("protocolSel").setCustomValidity("A protocol must be selected");

  d3.select("#protocolSel").selectAll("option")
    .data(["...", "DNA Dilution", "Library Dilution"])
    .enter()
      .append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });


  //***Call when protocal is changed
  d3.select("#protocolSel")
    .on("change", function() {
      var tmpVal = d3.select(this.options[this.selectedIndex]).attr("value");
      d3.select(this).attr("value", tmpVal);

      if(tmpVal == "...") {
        this.setCustomValidity("A protocol must be selected");
        $("#resetBut").click();
      }
      else if(tmpVal == "DNA Dilution" || tmpVal == "Library Dilution") {
        this.setCustomValidity("");
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#quantFile").property("required", true);
        var tmpIndex = d3.select("#quantSheetSel").property("selectedIndex");
        if(tmpIndex > 0) {
          d3.select("#quantSheetSel").property("selectedIndex", 0);
          document.getElementById("quantSheetSel").dispatchEvent(new Event("change"));
        }
        if(tmpVal == "DNA Dilution") {
          d3.select("#finalConc").attr("value", 0.2);
        }
        else if(tmpVal == "Library Dilution") {
          d3.select("#finalConc").attr("value", 4.0);
        }
      }
    });


  //***Call when Excel worksheet is changed
  d3.select("#quantSheetSel")
    .on("change", function() {
      var tmpVal = d3.select(this.options[this.selectedIndex]).attr("value");
      var tmpProt = d3.select("#protocolSel").attr("value");

      if(tmpVal == "...") {
        this.setCustomValidity("A worksheet must be selected");
        d3.selectAll(".mapTR,#downloadBut,#genResults").style("display", "none");
        d3.selectAll(".mapSel").property("required", false);
        d3.selectAll(".mapSel").each(function() { this.setCustomValidity(""); });
        d3.selectAll(".mapInput").property("required", false);
      }
      else {
        this.setCustomValidity("");

        fileImport = XLSX.utils.sheet_to_csv(workbook.Sheets[tmpVal], {FS:"\t"});
        fileImport = fileImport.replace(/,/g, ";");
        fileImport = fileImport.replace(/\t/g, ",");
        addMapOpts();
      }
    });


  //***Call when field mapping selection changes
  d3.selectAll(".mapSel")
    .on("change", function() {
      if(this.selectedIndex == 0) {
        this.setCustomValidity("A field must be selected");
      }
      else {
        this.setCustomValidity("");
      }
      d3.selectAll("#downloadBut,#genResults").style("display", "none");
    });


  //***Call when mapInput values change
  d3.selectAll(".mapInput")
    .on("change", function() {
      d3.selectAll("#downloadBut,#genResults").style("display", "none");
    });


  //***Read in file and add field names to mapping selects
  d3.select("#quantFile")
    .on("change", function() {
      if(typeof document.getElementById("quantFile").files[0] != "undefined") {
        d3.selectAll(".sheetTR,.mapTR,#downloadBut,#genResults").style("display", "none").property("required", false);
        if(document.getElementById("quantFile").files[0].name.toUpperCase().includes("CSV") == true) {
          ImportRead.readAsText(document.getElementById("quantFile").files[0]);
        }
        else if(document.getElementById("quantFile").files[0].name.toUpperCase().includes("XLSX") == true) {
          ImportReadXL.readAsBinaryString(document.getElementById("quantFile").files[0]);
        }
      }
      else {
        d3.selectAll(".sheetTR,.mapTR").style("display", "none").property("required", false);
        var tmpIndex = d3.select("#quantSheetSel").property("selectedIndex");
        if(tmpIndex > 0) {
          d3.select("#quantSheetSel").property("selectedIndex", 0);
          document.getElementById("quantSheetSel").dispatchEvent(new Event("change"));
        }
      }
    });






  //***Add file upload function (csv file)
  const ImportRead = new FileReader();
  fileImport = "";

  //***Read import file
  ImportRead.onload = function(event) {
    fileImport = event.target.result;

    addMapOpts();
  }


  ImportRead.onerror = (event) => {
    alert(event.target.error.name);
  };



  //***Add file upload function (csv file)
  const ImportReadXL = new FileReader();
  workbook = {};

  //***Read import file
  ImportReadXL.onload = function(event) {
    var data = event.target.result;
    workbook = XLSX.read(data, {type: "binary"});

    if(workbook.SheetNames.length == 1) {
      d3.select("#quantSheetTR").style("display", "none").property("required", false);

      fileImport = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]], {FS:"\t"});
      fileImport = fileImport.replace(/,/g, ";");
      fileImport = fileImport.replace(/\t/g, ","); 
      addMapOpts();
    }
    else {
      wsArray = ["..."];
      workbook.SheetNames.forEach(function(sheetName) {
        wsArray.push(sheetName);
      });
      
      d3.select("#quantSheetSel").selectAll("option").remove();

      d3.select("#quantSheetSel").selectAll("option")
        .data(wsArray)
        .enter()
          .append("option")
          .attr("value", function(d) { return d; })
          .text(function(d) { return d; });

      d3.select("#quantSheetSel").property("required", true);
      document.getElementById("quantSheetSel").setCustomValidity("A worksheet must be selected");
      d3.select("#quantSheetTR").style("display", "table-row");
    }
  }

  function addMapOpts() {
    const allLines = fileImport.split(/\r?\n/);
    var tmpFields = allLines[0].split(",");
    tmpFields.splice(0,0,"Select field...");

    //***Add file headers to map select boxes
    d3.select("#protocolForm").selectAll(".mapSel").each(function() {
      d3.select(this).selectAll("option").remove();
      d3.select(this).selectAll("option")
        .data(tmpFields)
        .enter()
          .append("option")
          .attr("value", function(d) { return d; })
          .property("title", function(d) { return d; })
          .text(function(d) { return d; });      
    });

    var tmpProt = d3.select("#protocolSel").attr("value");
    d3.selectAll(".mapTR,#downloadBut,#genResults").style("display", "none");
    if(tmpProt == "DNA Dilution") {
      d3.selectAll("#mapLabelTR,#concMap,#skipMap,.sampTR").style("display","table-row");
      document.getElementById("concColSel").setCustomValidity("A field must be selected");
      d3.selectAll(".mapInput").property("required", true);
    }
    else if(tmpProt == "Library Dilution") {
      d3.selectAll(".mapTR").style("display", "table-row");
      document.getElementById("concColSel").setCustomValidity("A field must be selected");
      document.getElementById("fragColSel").setCustomValidity("A field must be selected");
      d3.selectAll(".mapInput").property("required", true);
    }
  }



  ImportReadXL.onerror = (event) => {
    alert(event.target.error.name);
  };


  //******Add Resources
  d3.select("body")
    .append("div")
    .attr("class", "modal fade ui-draggable in ")
    .attr("id", "resourcesModal")
    .style("display", "none")
    .append("div")
    .attr("class", "modal-dialog modal-lg")
    .attr("id", "resourcesDiv")
    .html('<h3>Resources<span id="modalExit" class="fa fa-times-circle" title="Click to close resources window"></span></h3>'
      + '<hr>'
      + '<div id="resourceInternalDiv">'
        + '<h5>OpenTrons<span class="fa fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Links to information about, and applications for the OpenTrons liquid handling robot.</p>"></span></h5>'
        + '<div id="docDiv" class="resLinkDiv">'
          + '<a class="resourceA" href="https://opentrons.com/ot-2" target="_blank" title="Click to view OT-2 website"><span class="fa fa-link faResource"</span></a><p class="resourceP">OT-2 Liquid Handling Robot</p>'
          + '<br>'
          + '<a class="resourceA" href="https://labware.opentrons.com/" target="_blank" title="Click to view existing, and create custom labware definitions for the OT-2"><span class="fa fa-link faResource"</span></a><p class="resourceP">OT-2 Labware Definitions</p>'
          + '<br>'
          + '<a class="resourceA" href="https://designer.opentrons.com/" target="_blank" title="Click to use the protocol designer app for the OT-2"><span class="fa fa-link faResource"</span></a><p class="resourceP">OT-2 Protocol Designer App</p>'
          + '<br>'
          + '<a class="resourceA" href="https://docs.opentrons.com/v2/" target="_blank" title="Click to view the Python protocol API version 2 for the OT-2"><span class="fa fa-link faResource"</span></a><p class="resourceP">OT-2 Python Protocol API Version 2</p>'
        + '</div>'
        + '<br><br>'
        + '<h5>Contact Information<span class="fa fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Email addresses for questions and comments about protocols and the app .</p>"></span></h5>'
        + '<div id="emailDiv" class="resLinkDiv">'
          + '<a class="resourceA" href="mailto:aaron_maloy@fws.gov?subject=Mitogenome Assembly Protocol" target="_blank" title="Click to send email"><span class="fa fa-envelope faResource"</span></a><p class="resourceP">Mitogenome assembly protocol questions: <span class="emailSpan">Aaron Maloy - <a href="mailto:aaron_maloy@fws.gov?subject=Mitogenome Assembly Protocol" target="_blank" title="Click to send email">aaron_maloy@fws.gov</a></span></p>'
          + '<br>' 
          + '<a class="resourceA" href="mailto:jason_coombs@fws.gov?subject=OpenTrons Protocol Creation" target="_blank" title="Click to send email"><span class="fa fa-envelope faResource"</span></a><p class="resourceP">OT-2 protocol creation/editing questions: <span class="emailSpan">Jason Coombs - <a href="mailto:jason_coombs@fws.gov?subject=OpenTrons Protocol Creation" target="_blank" title="Click to send email">jason_coombs@fws.gov</a></span></a></p>'
        + '</div>'
      + '</div>'
    );
  
  d3.select("#modalExit")
    .attr("data-toggle", "modal")
    .attr("data-target", "#resourcesModal");



}



//******Generate protocol
function generate(tmpForm) {
  var sampCount = parseInt(tmpForm.sampCount.value);
  var sampRow = parseInt(tmpForm.sampRow.value);
  var sampConc = parseFloat(tmpForm.finalConc.value);
  var trisVol = parseInt(tmpForm.trisVol.value);
  var tipStart200 = tmpForm.tipStart200Sel.value;
  var tipStart20 = tmpForm.tipStart20Sel.value;
  var tmpProt = d3.select("#protocolSel").attr("value");

  var tmpTip = tipArray.indexOf(tipStart200);
  if((96 - tmpTip) + 96 < sampCount) {
    alert("There are not enough 200 ul tips to perform this protocol.\r\n\r\nPlease replace the 200 ul tip rack in slot 8 of the OpenTrons deck and update the first tip well position on the form.");
    return;
  }

  var tmpTip = tipArray.indexOf(tipStart20);
  if((96 - tmpTip) + 96 < (sampCount * 2)) {
    alert("There are not enough 20 ul tips to perform this protocol.\r\n\r\nPlease replace the 20 ul tip rack in slot 5 of the OpenTrons deck and update the first tip well position on the form.");
    return;
  }
  
  var allLines = fileImport.split(/\r?\n/);
  const tmpFields = allLines[0].split(",");
  //allLines.splice(0,1);
  //***Remove empty lines
  allLinesClean = allLines.filter(function(tmpLine) { return tmpLine != ""; });

  var lineCnt = allLinesClean.length - 1;
  var concArray = [];
  var sizeArray = [];
  var skipArray = [];
  var molArray = [];
  var dnaArray = [];
  var trisArray = [];

  allLinesClean.forEach(function(tmpLine, i) {
    if(i >= sampRow && i < sampRow + sampCount) {
      var lineArray = tmpLine.split(",");
      if(tmpProt == "DNA Dilution") {
        var tmpConc = parseFloat(lineArray[tmpFields.indexOf(tmpForm.concColSel.value)]);
        if(isNaN(tmpConc) == true) { tmpConc = 0.0001; };

        concArray.push(tmpConc);
        var tmpVolDil = ((tmpConc * 10) / sampConc);

        if( tmpVolDil <= 1700) {
          dnaArray.push(10);
          trisArray.push(d3.max([Math.round(((tmpVolDil - 10) * 10)) / 10, 0]));
        }
        else {
          tmpVolDNA = ((sampConc * 1700) / tmpConc);
          tmpVolDNA = Math.round(tmpVolDNA * 1000) / 1000;
          dnaArray.push(tmpVolDNA);
          trisArray.push(d3.max([Math.round(((1700 - tmpVolDNA) * 10)) / 10, 0]));
        }
      }
      else if(tmpProt == "Library Dilution") {
        var tmpConc = parseFloat(lineArray[tmpFields.indexOf(tmpForm.concColSel.value)])
        var tmpSize = parseFloat(lineArray[tmpFields.indexOf(tmpForm.fragColSel.value)])
        if(isNaN(tmpConc) == true) { tmpConc = 0.0001; };

        concArray.push(tmpConc);
        sizeArray.push(tmpSize);
        var tmpNM = ((tmpConc / (660 * tmpSize)) * 1000000);
        molArray.push(tmpNM);
        var tmpVolDil = ((tmpNM * 10) / sampConc);

        if( tmpVolDil <= 1700) {
          dnaArray.push(10);
          trisArray.push(d3.max([Math.round(((tmpVolDil - 10) * 10)) / 10, 0]));
        }
        else {
          tmpVolDNA = ((sampConc * 1700) / tmpNM);
          dnaArray.push(tmpVolDNA);
          trisArray.push(d3.max([Math.round(((1700 - tmpVolDNA) * 10)) / 10, 0]));
        }
      }

      skipArray.push(lineArray[tmpFields.indexOf(tmpForm.skipColSel.value)]);
    }
  });

  //***Make summary variables
  var totTris = trisArray.reduce((a, b) => a + b, 0) / 1000;
  if(totTris > trisVol) {
    alert("The required amount of Tris (" + totTris + " ml) is greater than the volume of Tris specified (" + trisVol + " ml).\r\n\r\nPlease increase the amount of Tris in the 50 ml conical vial and update the volume on the form");
    return;
  } 


  var lowConcID = [];
  if(tmpProt == "DNA Dilution") {
    var lowConc = concArray.filter(function(tmpConc) { return tmpConc < sampConc; });
    concArray.forEach(function(tmpConc,i) { if(tmpConc < sampConc) { lowConcID.push(i + 1); } });
  }
  else if(tmpProt == "Library Dilution") {
    var lowConc = molArray.filter(function(tmpConc) { return tmpConc < sampConc; });
    molArray.forEach(function(tmpConc,i) { if(tmpConc < sampConc) { lowConcID.push(i + 1); } });
  }



  //***Make well arrays
  var tmpBi = 0;
  var tmpCnt = 0;
  var dil_wellArray = [];

  for(j=1; j<=12; j++) {
    ["A","B","C","D","E","F","G","H"].some(function(row) {
      tmpCnt ++;
      if(tmpCnt > sampCount) { 
        tmpBi = 1;
      }
      else {
        dil_wellArray.push(row + j);
      }
      return tmpBi == 1;
    });
    if(tmpBi == 1) { break; }
  }



  //***Make tubeRack array
  tmpBi = 0;
  tmpCnt = 0;
  var tube_wellArray = [];
  for(i=1; i<=4; i++) {
    for(j=1; j<=6; j++) {
      ["A","B","C","D"].some(function(row) {
        tmpCnt ++;
        if(tmpCnt > sampCount) { 
          tmpBi = 1;
        }
        else {
          tube_wellArray.push(row + j);
        }
        return tmpBi == 1;
      });
      if(tmpBi == 1) { break; }
    }
    if(tmpBi == 1) { break; }
  }  

  
  //***Create python protocol file
  var dlText = "from opentrons import protocol_api\r\n";
  dlText += "\r\n";

  //***Add metadata
  dlText += "metadata = {\r\n";
  dlText += "\t'protocolName': '" + tmpProt + "',\r\n";
  dlText += "\t'author': 'Jason Coombs <jason_coombs@fws.gov>',\r\n";
  if(tmpProt == "DNA Dilution") {
    dlText += "\t'description': 'Protocol to dilute extracted DNA samples to a concentration of 0.2 ng/ul for PCR',\r\n";
  }
  else if(tmpProt == "Library Dilution") {
    dlText += "\t'description': 'Protocol to dilute amplified library DNA to a concentration of 4 nM for sequencing',\r\n";
  }
  dlText += "\t'apiLevel': '2.8'\r\n";
  dlText += "}\r\n";
  dlText += "\r\n";

  //***Define the run protocol
  dlText += "def run(protocol: protocol_api.ProtocolContext):\r\n";
  dlText += "\t\r\n";

  //***Labware
  dlText += "\t# Labware\r\n";
  dlText += "\ttris = protocol.load_labware('opentrons_6_tuberack_nest_50ml_conical', '11')\r\n";

  if(tmpProt == "DNA Dilution") {
    dlText += "\tdna_1 = protocol.load_labware('opentrons_24_tuberack_nest_1.5ml_snapcap', '10')\r\n";
    dlText += "\tdna_2 = protocol.load_labware('opentrons_24_tuberack_nest_1.5ml_snapcap', '7')\r\n";
    dlText += "\tdna_3 = protocol.load_labware('opentrons_24_tuberack_nest_1.5ml_snapcap', '4')\r\n";
    dlText += "\tdna_4 = protocol.load_labware('opentrons_24_tuberack_nest_1.5ml_snapcap', '1')\r\n";
    dlText += "\tpcr_plate = protocol.load_labware('4titude_96_wellplate_200ul', '3')\r\n";
  }
  else if(tmpProt == "Library Dilution") {
    dlText += "\tpcr_plate = protocol.load_labware('4titude_96_wellplate_200ul', '10')\r\n";
    dlText += "\tfinal_tube = protocol.load_labware('opentrons_24_tuberack_nest_1.5ml_snapcap', '3')\r\n";
  }

  if(Math.max(...trisArray) <= 125) {
    dlText += "\tdil_plate = protocol.load_labware('4titude_96_wellplate_200ul', '6')\r\n";
  }
  else {
    dlText += "\tdil_plate = protocol.load_labware('usascientific_96_wellplate_2.4ml_deep', '6')\r\n";
  }
  dlText += "\ttips_200_1 = protocol.load_labware('opentrons_96_filtertiprack_200ul', '8')\r\n";
  dlText += "\ttips_200_2 = protocol.load_labware('opentrons_96_filtertiprack_200ul', '9')\r\n";
  dlText += "\ttips_20_1 = protocol.load_labware('opentrons_96_filtertiprack_20ul', '5')\r\n";
  dlText += "\ttips_20_2 = protocol.load_labware('opentrons_96_filtertiprack_20ul', '2')\r\n";
  dlText += "\t\r\n";

  dlText += "\t# Pipettes\r\n";
  dlText += "\tleft_pip = protocol.load_instrument('p300_single_gen2', 'left', tip_racks=[tips_200_1, tips_200_2])\r\n";
  dlText += "\tright_pip = protocol.load_instrument('p20_single_gen2', 'right', tip_racks=[tips_20_1, tips_20_2])\r\n";
  dlText += "\tleft_pip.starting_tip = tips_200_1.well('" + tipStart200 + "')\r\n";
  dlText += "\tright_pip.starting_tip = tips_20_1.well('" + tipStart20 + "')\r\n";
  dlText += "\tleft_pip.well_bottom_clearance.aspirate = 3\r\n";
  dlText += "\tleft_pip.well_bottom_clearance.dispense = 3\r\n";
  dlText += "\tright_pip.well_bottom_clearance.aspirate = 3\r\n";
  dlText += "\tright_pip.well_bottom_clearance.dispense = 3\r\n";
  dlText += "\t\r\n";

  dlText += "\t# Commands\r\n";
  dlText += "\t\r\n";

  dlText += "\t# Turn lights on\r\n";
  dlText += "\tprotocol.set_rail_lights(True)\r\n";
  dlText += "\t\r\n";
  
  dlText += "\t# Distribute Tris\r\n";
  //dlText += "\tleft_pip.distribute([" + trisArray.toString().replace(/,/g, ", ") + "], tris.wells_by_name()['A1'], [dil_plate.wells_by_name()[well_name] for well_name in ['" + dil_wellArray.toString().replace(/,/g, "', '") + "']], disposal_volume=50, carryover=True)\r\n";
  dlText += "\tleft_pip.pick_up_tip()\r\n";
  dlText += "\tright_pip.pick_up_tip()\r\n";
  for(i=0; i<sampCount; i ++) {
    if(skipArray[i] == "") {
      if(trisArray[i] > 20) {
        var tmpVol = d3.max([Math.round((1.8524 * trisVol) + 10.267) - 30, 3]);
        dlText += "\tleft_pip.well_bottom_clearance.aspirate = " + tmpVol + "\r\n";
        dlText += "\tleft_pip.transfer(" + trisArray[i] + ", tris.wells_by_name()['A1'], dil_plate.wells_by_name()['" + dil_wellArray[i] + "'], new_tip='never')\r\n";
        trisVol -= trisArray[i] / 1000;
      }
      else if(trisArray[i] > 0) {
        var tmpVol = d3.max([Math.round((1.8524 * trisVol) + 10.267) - 20, 3]);
        dlText += "\tright_pip.well_bottom_clearance.aspirate = " + tmpVol + "\r\n";
        dlText += "\tright_pip.transfer(" + trisArray[i] + ", tris.wells_by_name()['A1'], dil_plate.wells_by_name()['" + dil_wellArray[i] + "'], new_tip='never')\r\n";
        trisVol -= trisArray[i] / 1000;
      }
    }
  }
  dlText += "\tleft_pip.blow_out(protocol.fixed_trash['A1'])\r\n";
  dlText += "\tright_pip.blow_out(protocol.fixed_trash['A1'])\r\n";
  dlText += "\tleft_pip.return_tip()\r\n";
  dlText += "\tleft_pip.reset_tipracks()\r\n";
  dlText += "\tleft_pip.starting_tip = tips_200_1.well('" + tipStart200 + "')\r\n";
  dlText += "\tright_pip.return_tip()\r\n";
  dlText += "\tright_pip.reset_tipracks()\r\n";
  dlText += "\tright_pip.starting_tip = tips_20_1.well('" + tipStart20 + "')\r\n";
  dlText += "\tleft_pip.well_bottom_clearance.aspirate = 3\r\n";
  dlText += "\tright_pip.well_bottom_clearance.aspirate = 3\r\n";



  dlText += "\t\r\n";

  //******DNA Dilution
  dlText += "\t# Dilute DNA\r\n";
  dlText += "\tleft_pip.flow_rate.aspirate = 450\r\n";
  dlText += "\tleft_pip.flow_rate.dispense = 450\r\n";

  if(tmpProt == "DNA Dilution") {
    var plateCnt = 0;
    for(i=0; i<sampCount; i ++) {
      if(i % 24 == 0) { plateCnt += 1; }
      if(skipArray[i] == "" && trisArray[i] > 0) {
        dlText += "\tright_pip.transfer(" + dnaArray[i] + ", dna_" + plateCnt + ".wells_by_name()['" + tube_wellArray[i] + "'], dil_plate.wells_by_name()['" + dil_wellArray[i] + "'], new_tip='always')\r\n";
        dlText += "\tleft_pip.pick_up_tip()\r\n";
        dlText += "\tleft_pip.mix(3, " + d3.min([Math.round(((trisArray[i] + dnaArray[i]) * 0.8) * 10) / 10, 200]) + ", dil_plate.wells_by_name()['" + dil_wellArray[i] + "'])\r\n";
        dlText += "\tleft_pip.drop_tip()\r\n";
      }
    }
  
    dlText += "\t\r\n";
    dlText += "\t# Transfer DNA for PCR\r\n";
    var plateCnt = 0;
    for(i=0; i<sampCount; i ++) {
      if(i % 24 == 0) { plateCnt += 1; }
      if(skipArray[i] == "") {
        if(trisArray[i] > 0) {
          dlText += "\tright_pip.transfer(5, dil_plate.wells_by_name()['" + dil_wellArray[i] + "'], pcr_plate.wells_by_name()['" + dil_wellArray[i] + "'], new_tip='always')\r\n";
        }
        else {
          dlText += "\tright_pip.transfer(5, dna_" + plateCnt + ".wells_by_name()['" + tube_wellArray[i] + "'], pcr_plate.wells_by_name()['" + dil_wellArray[i] + "'], new_tip='always')\r\n";
        }
      }
    }
  }

  //******Library Dilution
  else if(tmpProt == "Library Dilution") {
    for(i=0; i<sampCount; i ++) {
      if(skipArray[i] == "" && trisArray[i] > 0) {
        dlText += "\tright_pip.transfer(" + dnaArray[i] + ", pcr_plate.wells_by_name()['" + dil_wellArray[i] + "'], dil_plate.wells_by_name()['" + dil_wellArray[i] + "'], new_tip='always')\r\n";
        dlText += "\tleft_pip.pick_up_tip()\r\n";
        dlText += "\tleft_pip.mix(3, " + d3.min([Math.round(((trisArray[i] + dnaArray[i]) * 0.8) * 10) / 10, 200]) + ", dil_plate.wells_by_name()['" + dil_wellArray[i] + "'])\r\n";
        dlText += "\tleft_pip.drop_tip()\r\n";
      }
    }
  
    dlText += "\t\r\n";
    dlText += "\t# Combine DNA for sequencing\r\n";
    for(i=0; i<sampCount; i ++) {
      if(skipArray[i] == "") {
        if(trisArray[i] > 0) {
          dlText += "\tright_pip.transfer(5, dil_plate.wells_by_name()['" + dil_wellArray[i] + "'], final_tube.wells_by_name()['A1'], new_tip='always')\r\n";
        }
        else {
          dlText += "\tright_pip.transfer(5, pcr_plate.wells_by_name()['" + dil_wellArray[i] + "'], final_tube.wells_by_name()['A1'], new_tip='always')\r\n";
        }
      }
    }
  }

  dlText += "\t\r\n";
  dlText += "\t# Turn lights off\r\n";
  dlText += "\tprotocol.set_rail_lights(False)\r\n";
  dlText += "\t\r\n";




  //******Add file link to download
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '_' + dd + '_' + yyyy;

  //***Create file link
  var data = new Blob([dlText], {type: "text/plain"});
  var url = window.URL.createObjectURL(data);

  d3.select("#downloadA")
    .attr("href", url)
    .attr("target", "_blank")
    .attr("download", tmpProt.replace(/ /g, "_") + "_" + today + ".py");

  d3.select("#downloadBut").style("display", "table-row");
  
  //***Add results to summary div
  d3.select("#genResults").selectAll("p, img").remove();

  d3.select("#genResults")
    .append("p")
    .text("Total TRIS volume (ml): " + totTris.toFixed(1));

  d3.select("#genResults")
    .append("p")
    .text("Samples below concentration: " + lowConc.length + " (" + lowConcID.toString().replace(/,/g, ", ") + ")");

  d3.select("#genResults")
    .append("p")
    .html(function() {
      if(tmpProt == "DNA Dilution") {
        var tmpStr = "";
        for(i=1; i<=plateCnt; i++) {
          tmpStr += "<br>&emsp;&emsp;DNA Tuberack " + i + " - Slot " + (10 - ((i - 1) * 3));
        }
        return "Deck positions:" + tmpStr + "<br>&emsp;&emsp;Tris - Slot 11, Well A1<br>&emsp;&emsp;Dilution Plate - Slot 6<br>&emsp;&emsp;PCR Plate - Slot 3<br>&emsp;&emsp;20 ul Filter Tips - Slots 2 & 5<br>&emsp;&emsp;200 ul Filter Tips - Slot 8";
      }
      else if(tmpProt == "Library Dilution") {
        return "Deck positions:<br>&emsp;&emsp;PCR Plate - Slot 10<br>&emsp;&emsp;Tris - Slot 11, Well A1<br>&emsp;&emsp;Dilution Plate - Slot 6<br>&emsp;&emsp;Final Tube - Slot 3, Well A1<br>&emsp;&emsp;20 ul Filter Tips - Slots 2 & 5<br>&emsp;&emsp;200 ul Filter Tips - Slot 8";
      }
    });

  d3.select("#genResults")
    .append("img")
    .property("src", function() {
      if(tmpProt == "DNA Dilution") {
        return "images/dna_dilution_deck.jpg";
      }
      else if(tmpProt == "Library Dilution") {
        return "images/library_dilution_deck.jpg";
      }
    }) 
    .property("title", function() {      
      if(tmpProt == "DNA Dilution") {
        return "OpenTrons deck configuration for DNA Dilution protocol";
      }
      else if(tmpProt == "Library Dilution") {
        return "OpenTrons deck configuration for Library Dilution protocol";
      }
    });
      
  d3.select("#genResults").style("display", "block");
  document.getElementById('genResults').scrollIntoView();
}











//******Tutorial
function startIntro() {
  var intro = introJs();
  intro.setOptions({
    steps: [
      //0
      { intro: '<b>Welcome to the <span style="font-family:nebulous;color:orangered;font-weight:bold;">OpenTrons Protocol Generator</span> app!</b><img src="images/opentrons.png" style="height:50px;display:block;margin:auto;"></img>This app is designed to generate custom protocols to run on the <a href="https://opentrons.com/ot-2/" target="_blank">OpenTrons OT-2</a> liquid handling robot by utilizing user supplied data to calculate transfer volumes.<br><br>The final product is a downloadable Python script that is uploaded to the OT-2 app interface to be run.' },
      //1
      { element: document.querySelector("#intro"), intro: "To access this guide at any time simply click on the 'Tutorial' link." },
      //2
      { element: document.querySelector("#resources"), intro: "Click here for:<ul><li>Information about the OT-2</li><li>Viewing and creating labware definitions</li><li>Using the OpenTrons protocol designer app</li><li>Viewing the OT-2 Python protocol API</li><li>Email questions or comments to NEFC researchers</li></ul>" },
      //3
      { element: document.querySelector("#introI"), intro: 'Hover the cursor over any <span class="fa fa-info-circle" style="margin:0;"></span> icon to view information about the associated element.' },
      //4
      { element: document.querySelector("#protocolSel"), intro: "The first step of the process is to select your desired protocol." },
      //5
      { element: document.querySelector("#quantFile"), intro: "Select your DNA quantification file here. Files can have a .xlxs or .csv extension." },
      //6
      { element: document.querySelector("#exampFile"), intro: "Click here to download an example Excel file and view formatting requirements for input."},
      //7
      { element: document.querySelector("#quantSheetSel"), intro: "If an Excel file containing multiple worksheets was selected as the input file, the appropriate worksheet is selected here." },
      //8
      { element: document.querySelector("#concColSel"), intro: "Map the column in the input file for each required field by selecting the appropriate column heading." },
      //9
      { element: document.querySelector("#sampCount"), intro: "Specify the number of samples to perform the selected protocol on." },
      //10
      { element: document.querySelector("#sampRow"), intro: "Specify the row in the input file that contains the first sample for which the selected protocol will be performed. This enables breaking the input sheet into multiple OpenTrons sessions." },
      //11
      { element: document.querySelector("#finalConc"), intro: 'Specify the final concentration to which to dilute samples. Concentration unit is protocol dependent and is shown in the associated <span class="fa fa-info-circle" style="margin:0;"></span> icon.' },
      //12
      { element: document.querySelector("#trisVol"), intro: "The starting volume of Tris in milliliters" },
      //13
      { element: document.querySelector("#tipStart200Sel"), intro: "The starting well position of the 200 ul filter tip rack." },
      //14
      { element: document.querySelector("#tipStart20Sel"), intro: "The starting well position of the 20 ul filter tip rack." },
      //15
      { element: document.querySelector("#runBut"), intro: "Click to run the app and generate the OpenTrons protocol file." },
      //16
      { element: document.querySelector("#downloadBut"), intro: "Click to download the generated OpenTrons protocol Python file." },
      //17
      { element: document.querySelector("#genResults"), intro: "The summary provides the user with<ul><li>The total volume of Tris used for the protocol</li><li>The total number of samples that fall below the specified final concentration, and a list of their associated row number</li><li>A list and graphic detailing which deck slots to use</li></ul>" },
      //18
      { intro: 'Thank you for touring the <span style="font-family:nebulous;color:orangered;font-weight:bold;">OpenTrons Protocol Generator</span> app!<img src="images/opentrons.png" style="height:50px;display:block;margin:auto;"></img>Questions or comments can be directed to <a href="mailto:jason_coombs@fws.gov?subject=OpenTrons Protocol App" target="_blank">Jason Coombs</a>.' },
    ],
    tooltipPosition: 'auto',
    positionPrecedence: ['right', 'left', 'bottom', 'top'],
    showStepNumbers: false,
    hidePrev: true,
    hideNext: true,
    scrollToElement: true,
    disableInteraction: true,
  });

  intro.onchange(function() { 
    revertIntro();
    switch (this._currentStep) {
      case 0:
        d3.select("#genResults").html('<div id="introResultsDiv"><label class="labelDiv">Sample summary:</label><p>Total TRIS volume (ml): 26.8</p><p>Samples below concentration: 8 (30, 36, 63, 64, 78, 88, 95, 96)</p><p>Deck positions:<br>  DNA Tuberack 1 - Bay 10<br>  DNA Tuberack 2 - Bay 7<br>  DNA Tuberack 3 - Bay 4<br>  DNA Tuberack 4 - Bay 1<br>  Tris - Bay 11, Well A1<br>  Dilution Plate - Bay 6<br>  PCR Plate - Bay 3<br>  20 ul Filter Tips - Bays 2 &amp; 5<br>  200 ul Filter Tips - Bay 8</p></div><img src="images/dna_dilution_deck.jpg" title="OpenTrons deck configuration for DNA Dilution protocol">');
        break;
      case 1:
        d3.select("#intro").style("color","aqua");
        d3.select(".header").classed("highZ", true);
        break;
      case 2:
        d3.select("#resources").style("color","aqua");
        d3.select(".header").classed("highZ", true);
        break;
      case 3:
      case 4:
        break;
      case 5:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        break;
      case 6:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        break;
      case 7:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetTR").style("display", "table-row");
        break;
      case 8:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        break;
      case 9:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        break;
      case 10:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        break;
      case 11:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        break;
      case 12:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        break;
      case 13:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        break;
      case 14:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        break;
      case 15:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        break;
      case 16:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        d3.select("#downloadBut").style("display", "table-row");
        d3.select("#genResults").style("display", "block");
        break;
      case 17:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        d3.select("#downloadBut").style("display", "table-row");
        d3.select("#genResults").style("display", "block");
        break;
      case 18:
        d3.select(".fileTR").style("display", "table-row");
        d3.select("#protocolSel").property("selectedIndex", 1);
        d3.select("#quantSheetSel").selectAll("option").data(["...","DNA Dilution Sheet","Library Dilution Sheet"]).enter().append("option").text(function(d) {return d;});
        d3.select("#quantSheetSel").property("selectedIndex", 1);
        d3.select("#quantSheetTR").style("display", "table-row");
        d3.select("#concColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#skipColSel").selectAll("option").data(["Select field...","ng/ul","Library Size","Skip"]).enter().append("option").text(function(d) {return d;});
        d3.select("#finalConc").property("value", 0.2);
        d3.selectAll(".mapTR").style("display", "table-row");
        d3.select("#fragMap").style("display", "none");
        d3.select("#downloadBut").style("display", "table-row");
        d3.select("#genResults").style("display", "block");
        break;
    }
  });

  intro.onbeforechange(function() { 
    switch (this._currentStep) {
      case 16:                              
        break;
    }  
  });

  intro.oncomplete(function() { 
    //localStorage.setItem('doneTour', 'yeah!'); 
    $("#clean").click();
    d3.select("#introResultsDiv").remove();
    revertIntro();
  });

  intro.onexit(function() {
    $("#clean").click();
    d3.select("#introResultsDiv").remove();
    revertIntro();
    //disableTutorialSession = true;
  });            


  intro.start();



  function revertIntro() {
    d3.selectAll("#intro,#resources").style("color", "");
    d3.select(".header").classed("highZ", false);
    $("#resetBut").click();
    $("#resetButCreate").click();
  }

  function addResults() {
    d3.select("#summary_text").property("value", "Organism: Esox niger\nID: NEFC_F16-005\nBase Pairs: 16775\nNumber of tRNAs: 22\n     Complement: 8\nNumber of rRNAs: 2\nNumber of D-loops: 1\n     15619..16775\nNumber of CDSs: 13\n     Complement: 1");
    d3.select("#tRNA_text").property("value", "tRNA-Phe\ntRNA-Val\ntRNA-Leu\ntRNA-Ile\ntRNA-Gln\ntRNA-Met\ntRNA-Trp\ntRNA-Ala\ntRNA-Asn\ntRNA-Cys\ntRNA-Tyr\ntRNA-Ser\ntRNA-Asp\ntRNA-Lys\ntRNA-Gly\ntRNA-Arg\ntRNA-His\ntRNA-Ser\ntRNA-Leu\ntRNA-Glu\ntRNA-Thr\ntRNA-Pro");
    d3.select("#CDS_text").property("value", "NADH dehydrogenase subunit 1\nNADH dehydrogenase subunit 2\ncytochrome c oxidase subunit I\ncytochrome c oxidase subunit II\nATP synthase subunit 8\nATP synthase subunit 6\ncytochrome c oxidase subunit III\nNADH dehydrogenase subunit 3\nNADH dehydrogenase subunit 4L\nNADH dehydrogenase subunit 4\nNADH dehydrogenase subunit 5\nNADH dehydrogenase subunit 6\ncytochrome b");
    d3.select("#except_text").property("value", "pos:5048,aa:TERM,  4001..5048\npos:7830,aa:TERM,  7140..7830\npos:8745,aa:TERM,  8064..8745\npos:9951,aa:TERM,  9603..9951\npos:11692,aa:TERM, 10312..11692");
    d3.select("#summaryDiv").style("display", "inline-block");
  }

  function addCreateResults() {
    d3.select("#SQN_warnings_a").attr("data-original-title", "WARNING: valid [SEQ_INST.CompleteCircleProblem] Circular topology without complete flag set BIOSEQ: lcl|NEFC_F16-134: raw, dna len= 17424");
    d3.select("#SQN_warnings").style("display", "inline-block");
    d3.select("#summaryDivCreate").style("display", "inline-block");
  }
}

