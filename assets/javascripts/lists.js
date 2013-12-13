/**
*  OvR Lists - Custom JavaScript
*
*/

// Order Status: Check All / Uncheck All
function checkAll(trip_list, checktoggle) {
  var checkboxes = [];
  checkboxes = document.getElementsByClassName('order_status_checkbox');

  for (var i=0; i<checkboxes.length; i++) {
    if (checkboxes[i].type == 'checkbox') {
      checkboxes[i].checked = checktoggle;
    }
  }
}

function formReset(){
  var tbl = document.getElementById("Listable");
  while (tbl.firstChild) {
    tbl.removeChild(tbl.firstChild);
  }
}

function tableToForm(){
  // Reads through generated table and saves to a php form which is submitted to save values to a mysql table
  var table = document.getElementById('Listable');
  // Start on row 1 (SKIP HEADER ROW), rowLength - 1 (SKIP FOOTER ROW)
  var labels = new Array("AM","PM","First","Last","Pickup","Phone","Package","Order","Waiver","Product","Bus","All_Area","Beg","BRD","SKI","LTS","LTR","Prog_Lesson");
  var form = "<form name='js_save' id='js_save' method='post' action='save.php'>";
  var trip = document.getElementById("trip").value;
  for(var rowCounter = 1, rowLength = table.rows.length; rowCounter < rowLength - 1; rowCounter++ ){
    var id = table.rows[rowCounter].cells[0].children[0].name;
    id = id.split(":");
    id = id[0]+":"+id[1];
    var prefix = id.substring(0,2);
    for(var cellCounter = 0, cellLength = table.rows[rowCounter].cells.length; cellCounter < cellLength; cellCounter++){
      if(prefix == "WO"){
        if(labels[cellCounter] == "First" || labels[cellCounter] == "Last" || labels[cellCounter] == "Pickup" || labels[cellCounter] == "Phone" || labels[cellCounter] == "Package"){
          form += "<input type='hidden' name='"+id+":"+labels[cellCounter]+"' value='"+table.rows[rowCounter].cells[cellCounter].innerText+"'>";
        }
        else if(labels[cellCounter] == "Order"){
          form += "<input type='hidden' name='"+id+":"+labels[cellCounter]+"' value='"+table.rows[rowCounter].cells[cellCounter].innerText+"'>";
          var select = document.getElementById("trip");
          form += "<input type='hidden' name='"+id+":Trip' value='"+select.options[select.selectedIndex].value+"'>";
        }
        else{
          form += "<input type='hidden' name='"+id+":"+labels[cellCounter]+"' value='"+table.rows[rowCounter].cells[cellCounter].children[0].checked+"'>";
        }
      }
      else{
        // Only capture checkboxes for woocommerce orders
        if(labels[cellCounter] != "First" && labels[cellCounter] != "Last" && labels[cellCounter] != "Pickup" && labels[cellCounter] != "Phone" && labels[cellCounter] != "Package" && labels[cellCounter] != "Order"){
          form += "<input type='hidden' name='"+id+":"+labels[cellCounter]+"' value='"+table.rows[rowCounter].cells[cellCounter].children[0].checked+"'>";
        }
      }
    }
  }
  form += "</form>";
  $("body").append(form);
  document.getElementById("js_save").submit();
}

// webSQL Functions
function saveCheckbox(id,value){
  var db = window.db;
  db.transaction(function(tx) {
    tx.executeSql('INSERT OR REPLACE INTO `ovr_lists_fields` (`ID`, `value`) VALUES(?,?)',
      [id,value],
      function(tx, result){
        console.log('successful insert or replace on ovr_lists_fields');
      },
      function(tx, error){
        console.log('error inserting or replacing on ovr_lists_fields: ' + error.message);
      }
    );
  });
}
function saveManualOrder(id,manual){
  var db = window.db;
  db.transaction(function(tx) {
    tx.executeSql('INSERT OR REPLACE INTO `ovr_lists_manual_orders`' +
                  ' (`ID`, `First`, `Last`, `Pickup`, `Phone`,`Package`, `Trip`)' +
                  ' VALUES(?,?,?,?,?,?,?)',
      [id, manual.First, manual.Last, manual.Pickup, manual.Phone, manual.Package, manual.Trip],
      function(tx, result){
        console.log('successful insert or replace on ovr_lists_manual_orders');
      },
      function(tx, error){
        console.log('error inserting or replacing on ovr_lists_manual_orders: ' + error.message);
      }
    );
  });
}
$("#save").click(function(){
  // Collect table data and save to local webSQL tables
  var row = $("#Listable tbody");
  $("#Listable tbody tr").each(function(index){
    var split = $(this).children('td').children('input').attr('name').split(':');
    var order = split[0];
    var manual = {};
    var id = split[0] + ':' + split[1];
    $(this).children("td").each(function(){
      if( $(this).hasClass('center-me') ) {
        id = $(this).children('input').attr('name');
        saveCheckbox(id, $(this).children('input').is(':checked'));
      } else if ($(this).attr('contenteditable')) {
        var content = $(this).text();
        if ($(this).hasClass("unsavedFirst")) {
          manual.First = content;
        } else if ($(this).hasClass("unsavedLast")) {
          manual.Last = content;
        } else if ($(this).hasClass("unsavedPickup")) {
          manual.Pickup = content;
        } else if ($(this).hasClass("unsavedPhone")) {
          manual.Phone = content;
        } else if ($(this).hasClass("unsavedPackage")) {
          manual.Package = content;
        }
      }
    });
    if ( !jQuery.isEmptyObject(manual) ){
      var label = id.split(':');
      manualId = label[0] + ':' + label[1];
      manual.Trip = $('#trip').val();
      saveManualOrder(manualId,manual);
    }
  });
});
function truncateTables(){
  // This is just to clear data without resetting browser
  var db = window.db;
  db.transaction(function (tx) {  
    tx.executeSql('DELETE FROM `ovr_lists_fields`');
  });
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM `ovr_lists_manual_orders`');
  });
}
// End webSQL Functions
$(function(){
  // Connect to webSQL DB and create tables
  (function(){
    var db = openDatabase('lists.ovrride.com', '0.1', 'OvR Ride Lists local DB', 2 * 1024 * 1024);
    window.db = db;
    db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS' +
                    '`ovr_lists_fields` (`ID` UNIQUE, `value` INTEGER)',
                    [],
                    function(tx, result) {
                      console.log("ovr_lists_fields setup success"); },
                    function(tx, error) {
                      console.log("ovr_lists_fields setup error: " + error.message); }
      );
    });
    db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS' +
                    '`ovr_lists_manual_orders` (`ID` UNIQUE, `First`, `Last`,' +
                    ' `Pickup`, `Phone`, `Package`, `Trip`)',
                    [],
                    function(tx, result){
                      console.log('ovr_lists_manual_orders setup success'); },
                    function(tx, error){
                      console.log('ovr_lists_manual_orders setup error:' + error.message); }
      );
    });
  })();
  
  // Create a table if data exists
  $.fn.buildTable = function(){
    var hasPickup   = $("#hasPickup").val();
    var orderData   = jQuery.parseJSON($("#orderData").val());
    var tableHeader = '';
    var tableBody   = '';
    var tableFooter = '';
    var riders      = 0;
    var byLocation  = {};
    
    if (orderData) {
      tableHeader += '<table id="Listable" class="tablesorter table table-bordered table-striped table-condensed">\n' +
                        '<thead>' +
                        '<tr class="tablesorter-headerRow">\n' +
                        '<td class="filter-false">AM</td>' +
                        '<td class="filter-false">PM</td>' +
                        '<td>First</td>' +
                        '<td>Last</td>';
                        
      if (hasPickup == 1) {
        tableHeader += '<td data-placeholder="Choose a Location">Pickup</td>';
      }
      
      tableHeader += '<td>Phone</td>' +
                    '<td data-placeholder="Choose a Package">Package</td>' +
                    '<td>Order</td>' +
                    '<td class="filter-false">Waiver</td>' +
                    '<td class="filter-false">Product REC.</td>' +
                    '<td class="filter-false">Bus Only</td>' +
                    '<td class="filter-false">All Area Lift</td>' +
                    '<td class="filter-false">Beg. Lift</td>' +
                    '<td class="filter-false">BRD Rental</td>' +
                    '<td class="filter-false">Ski Rental</td>' +
                    '<td class="filter-false">LTS</td>' +
                    '<td class="filter-false">LTR</td>' +
                    '<td class="filter-false">Prog. Lesson</td>\n' +
                    '</tr>' +
                    '</thead>\n';
      
      $.each(orderData, function(orderNumber, values){
        var prefix = orderNumber.substring(0,2);
        $.each(values, function(orderItemNumber, fields){
          var id = orderNumber+":"+orderItemNumber+":";
          var row = {};
          $.each(fields, function(field, value){
            if (field == 'First' || field == 'Last' || field == 'Pickup Location' || field == 'Phone' || field == 'Package' || field == 'Order') {
              row[field] = '<td';
              if (prefix != 'WO') {
                row[field] += ' class="no-edit"';
              } else {
                row[field] += ' class="saved"';
              }
              row[field] +='>'+value+'</td>';
            } 
            else {
              row[field] = '<td class="center-me"><input type="checkbox" name="' + id + field + '" ' + value +'></td>';
            }
          });
          /* Had to manually assemble cells in correct order, couldn't get AM/Pm on left side of table with a loop
              this is proably a result of moving data from PHP to JSON and back to an array */
          tableBody += '<tr>'+row.AM + row.PM + row.First + row.Last;
          if (hasPickup == 1) {
            tableBody += row['Pickup Location'];
          } 
          tableBody += row.Phone + row.Package;
          if (prefix == 'WO') {
            tableBody += '<td>' + orderNumber + '</td>';
          } else {
            tableBody += '<td><a href="https://ovrride.com/wp-admin/post.php?post=' + orderNumber +'&action=edit" target="_blank">' + orderNumber+ '</a></td>';
          }
          tableBody += row.Waiver + row.Product + row.Bus + row.All_Area;
          tableBody += row.Beg + row.BRD + row.SKI + row.LTS + row.LTR + row.Prog_Lesson + '</tr>';
          riders++;
          var locationName = row['Pickup Location'].replace(/<(?:.|\n)*?>/gm, '');
          if(typeof byLocation[locationName] === undefined || typeof byLocation[locationName] === 'undefined' || typeof byLocation[locationName] === 'NaN'){
            byLocation[locationName] = 0;
          }
          byLocation[locationName] += 1;
        });
      });
      tableBody += '</tbody>\n';
      tableFooter += '<tfoot>\n<tr class="totals-row">' +
                     '<td>Total Guests: </td>\n' +
                     '<td id="total_guests">' + riders + '</td>' +
                     '<td><button type="button" class="btn btn-primary" id="add">' +
                     '<span class="glyphicon glyphicon-plus"></span></button>' +
                     '<button type="button" class="btn btn-danger pull-right" id="remove">' +
                     '<span class="glyphicon glyphicon-minus"></span></button></td>';
      if (hasPickup == 1) {
        tableFooter += '<td>Guests by Pickup: </td>';
        $.each(byLocation, function(location, value){
          tableFooter += '<td>' + location + ': ' + value + '</td>';
        });
      }
      tableFooter += '</tfoot></table>';
      var output = tableHeader + tableBody + tableFooter;
      $(this).append(output);
    } else {
      $(this).append('<div class="container"><p>There are no orders for the selected Trip and Order Status.</p></div>');
    }
    
  };
  $("#listTable").buildTable();
  // Chained drop downs
  $("#trip").chained("#destination");
  //custom column counter
  $.fn.colCount = function() {
     var colCount = 0;
     $('thead:nth-child(1) td', this).each(function () {
         if ($(this).attr('colspan')) {
             colCount += +$(this).attr('colspan');
         } else {
             colCount++;
         }
     });
     return colCount;
  };
  // tablesorter configuration
  // http://mottie.github.io/tablesorter/docs/#Configuration
  var rows = $("#Listable").colCount();
  // check for pickup column, 18 columns with 17 without
  if(rows == 18){
    $('#Listable').tablesorter({
      sortList: [[4,0],[3,0]],
      headers: {
            0: { sorter: 'checkbox' },
            1: { sorter: 'checkbox' },
            8: { sorter: 'checkbox' },
            9: { sorter: 'checkbox' },
            10: { sorter: 'checkbox' },
            11: { sorter: 'checkbox' },
            12: { sorter: 'checkbox' },
            13: { sorter: 'checkbox' },
            14: { sorter: 'checkbox' },
            15: { sorter: 'checkbox' },
            16: { sorter: 'checkbox' },
            17: { sorter: 'checkbox' }
          },
      widgets : [ 'editable','zebra', 'columns','stickyHeaders','filter' ],
      widgetOptions: {
        editable_columns       : "2-6",  // point to the columns to make editable (zero-based index)
        editable_enterToAccept : true,     // press enter to accept content, or click outside if false
        editable_autoResort    : false,    // auto resort after the content has changed.
        editable_noEdit        : 'no-edit', // class name of cell that is no editable
        stickyHeaders_offset: 50,
        filter_childRows : false,
        filter_columnFilters : true,
        filter_hideFilters : true,
        filter_ignoreCase : true,
        filter_reset : '.reset',
        filter_searchDelay : 100,
        filter_functions : {
          4 : true,
          6 : true 
        }
      }
    });
  }
  else if (rows == 17){
    $('#Listable').tablesorter({
      sortList: [[4,0],[3,0]],
      headers: {
            0: { sorter: 'checkbox' },
            1: { sorter: 'checkbox' },
            8: { sorter: 'checkbox' },
            9: { sorter: 'checkbox' },
            10: { sorter: 'checkbox' },
            11: { sorter: 'checkbox' },
            12: { sorter: 'checkbox' },
            13: { sorter: 'checkbox' },
            14: { sorter: 'checkbox' },
            15: { sorter: 'checkbox' },
            16: { sorter: 'checkbox' },
            17: { sorter: 'checkbox' }
          },
      widgets : [ 'editable','zebra', 'columns','stickyHeaders','filter'],
      widgetOptions: {
        editable_columns       : "2-5",  // point to the columns to make editable (zero-based index)
        editable_enterToAccept : true,     // press enter to accept content, or click outside if false
        editable_autoResort    : false,    // auto resort after the content has changed.
        editable_noEdit        : 'no-edit', // class name of cell that is no editable
        stickyHeaders_offset: 50,
        filter_childRows : false,
        filter_columnFilters : true,
        filter_hideFilters : true,
        filter_ignoreCase : true,
        filter_reset : '.reset',
        filter_searchDelay : 100,
        filter_functions : {
          5 : true
        }
      }
    }); 
  }
  
  $('#add').click(function(){
    // Find total cell and increment
    $("#total_guests").val(parseInt( $("#total_guests").val(), 10 ) + 1);
    //Generate Walk On order #
    var itemNum = Math.floor(Math.random()*90000);
    var order = 'WO'+ Math.floor(Math.random()*90000);
    var id = order+":"+itemNum;
    var row = '<tr class="manual"><td class="center-me"><input type="checkbox" name="' + id + ':AM"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':PM"></td>' +
    '<td contenteditable="true" class="unsavedFirst"></td>' +
    '<td contenteditable="true" class="unsavedLast"></td>' +
    '<td contenteditable="true" class="unsavedPickup"></td>' +
    '<td contenteditable="true" class="unsavedPhone"></td>' +
    '<td contenteditable="true" class="unsavedPackage"></td>' +
    '<td class="no-edit">' + order + '</td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':Waiver"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':Product"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':Bus"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':All_Area"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':Beg"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':BRD"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':SKI"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':LTS"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':LTR"></td>' +
    '<td class="center-me"><input type="checkbox" name="' + id + ':Prog_Lesson"></td></tr>',
    $row = $(row),
    // resort table using the current sort; set to false to prevent resort, otherwise 
    // any other value in resort will automatically trigger the table resort. 
    resort = true;
    $('#Listable').find('tbody').append($row).trigger('addRows', [$row, resort]);
    return false;
   });
   
   // remove dynamically added rows from table
   $('#remove').click(function(){
       if($('#Listable tbody tr:last').hasClass('manual')){
       $('#Listable tbody tr:last').remove();
       $("#total_guests").val(parseInt( $("#total_guests").val(), 10 ) - 1);
       $('#Listable').trigger("update");}
   });
   
});
