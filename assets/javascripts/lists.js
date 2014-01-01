/**
*  OvR Lists - Custom JavaScript
*
*/
// iOS click lag workaround
(function( $ ) {
  $.fn.noClickDelay = function() {
    var $wrapper = this;
    var $target = this;
    var moved = false;
    $wrapper.bind('touchstart mousedown',function(e) {
      e.preventDefault();
      moved = false;
      $target = $(e.target);
      if ($target.nodeType == 3) {
        $target = $($target.parent());
      }
      $target.addClass('pressed');
      $wrapper.bind('touchmove mousemove',function(e) {
      moved = true;
      $target.removeClass('pressed');
    });
    $wrapper.bind('touchend mouseup',function(e) {
    $wrapper.unbind('mousemove touchmove');
    $wrapper.unbind('mouseup touchend');
    if(!moved && $target.length) {
      $target.removeClass('pressed');
      $target.trigger('click');
      $target.focus();
    }
  });
});
};
})( jQuery );
// end iOS click lag workaround
// Order Status: Check All / Uncheck All
function checkAll(status) {
  // reset checked attr status either way
  $('.order_status_checkbox').removeAttr('checked');
  
  if (status == 'check'){
    $('.order_status_checkbox').prop('checked', true);
  }
}
function formReset(){
  $('#Listable').remove();
  $('.pager').css('visibility','hidden');
  $('#destination').val('');
  $('#destination').trigger('change');
  checkAll('uncheck');
}
function checkPackages(text, order, orderItem, value){
  var bus        = new RegExp(/bus only/i);
  var begLift    = new RegExp(/beginner lift/i);
  var lts        = new RegExp(/lesson.*ski rental/i);
  var ltr        = new RegExp(/lesson.*board rental/i);
  var progSki    = new RegExp(/prog.* lesson.*ski rental/i);
  var progBrd    = new RegExp(/prog.* lesson.*board rental/i);
  var progLesson = new RegExp(/prog.* lesson/i);
  var ski        = new RegExp(/ski rental/i);
  var brd        = new RegExp(/board rental/i);
  var allArea    = new RegExp(/all area/i);
  // TODO: reorder checks for packages based off most ordered to improve efficiency
  if ( bus.test(text) ) {
    var busId = $('#' + order + "\\:" + orderItem + "\\:Bus .value");
    if ( busId.text() == value ){
      busId.click();
    }
  } else {
    // Selectors for button values
    var begId   = "#" + order + "\\:" + orderItem + "\\:Beg .value";
    var allAreaId = "#" + order + "\\:" + orderItem + "\\:All_Area .value";
    var progId    = "#" + order + "\\:" + orderItem + "\\:Prog_Lesson .value";
    var skiId     = "#" + order + "\\:" + orderItem + "\\:SKI .value";
    var brdId     = "#" + order + "\\:" + orderItem + "\\:BRD .value";
    var ltrId     = "#" + order + "\\:" + orderItem + "\\:LTR .value";
    var ltsId     = "#" + order + "\\:" + orderItem + "\\:LTS .value";
    
    // All area or beginner?
    if ( begLift.test(text) ) {
      if ( $(begId).text() == value ){
        $(begId).parent().click();
      }
    } else if ( allArea.test(text) ) {
      if ( $(allAreaId).text() == value ) {
        $(allAreaId).parent().click();
      }
    }
    
    // Lessons + rental combos
    if ( progSki.test(text)) {
      if ( $(progId).text() == value ) {
        $(progId).parent().click();
      }
      if ( $(skiId).text() == value ) {
        $(skiId).parent().click();
      }
    } else if ( progBrd.test(text) ) {
      if ( $(brdId).text() == value ) {
        $(brdId).parent().click();
      }
      if ( $(progId).text() == value ) {
        $(progId).parent().click();
      }
      
    } else if ( progLesson.test(text) ) {
      progId.click();
    } else if ( ltr.test(text) ) {
      if ( $(ltrId).text() == value ) {
        $(ltrId).parent().click();
      }
      if ( $(brdId).text() == value ) {
        $(brdId).parent().click();
      }
    } else if ( lts.test(text) ) {
      if ( $(ltsId).text() == value ) {
        $(ltsId).parent().click();
      }
      if ( $(skiId).text() ){
        $(skiId).parent().click();
      }
    } else if ( ski.test(text) ) {
      if ( $(skiId).text() == value ) {
        $(skiId).parent().click();
      }
    } else if ( brd.test(text) ) {
      if ( $(brdId).text() == value ) {
        $(brdId).parent().click();}
    }
    
  }
  
}
// webSQL Functions
function generateOnOff(){
  // switch generate list button between online and offline mode
  if (window.navigator.onLine){
    $('#Listable').remove();
    $('.pager').css('visiblity','hidden');
    $('#loader').css('display','inline');
    $('#trip').getData();
  } else {
    setupDropDowns();
    $('#Listable').remove();
    $('.pager').css('visibility','hidden');
    $('#loader').css('display','inline');
    $('#save').css('visibility','hidden');
    $('#csv_list').css('visibility','hidden');
    $('#csv_email').css('visibility','hidden');
    console.log('Offline Loading data:');
    window.orderData = window.storage.get('orderData');
    console.log(window.orderData);
    $('#listTable').buildTable();
    
    // Select data and trigger build at end
    //var selectMode = 'build';
    //window.selectMode = selectMode;
    //selectOrderCheckboxes();
  }
}
function autoSaveManualOrder(id,field,value){
  /* sqLite db doesn't have an insert or update (upsert) function
      this function duplicates upsert by selecting the other values on the same row during replacement */
  var db = window.db;
  var trip = $('#trip').val();
  var replaceFields = {};
  replaceFields.First = "COALESCE((SELECT `First` FROM ovr_lists_manual_orders WHERE `ID` = '" + id + "'),'')";
  replaceFields.Last = "COALESCE((SELECT `Last` FROM ovr_lists_manual_orders WHERE `ID` = '" + id + "'),'')";
  replaceFields.Pickup = "COALESCE((SELECT `Pickup` FROM ovr_lists_manual_orders WHERE `ID` = '" + id +"'),'')";
  replaceFields.Phone = "COALESCE((SELECT `Phone` FROM ovr_lists_manual_orders WHERE `ID` = '" + id + "'),'')";
  replaceFields.Package = "COALESCE((SELECT `Package` FROM ovr_lists_manual_orders WHERE `ID` = '" + id + "'),'')";

  var sql = "INSERT OR REPLACE INTO ovr_lists_manual_orders (`ID`, `First`,`Last`, `Pickup`, `Phone`, `Package`, `Trip`) VALUES(?, ";
  switch(field){
    case 'First':
      sql += "'" + value +"'," + replaceFields.Last + ", " + replaceFields.Pickup + ", " + replaceFields.Phone + ", " + replaceFields.Package + ", ?)";
      break;
    case 'Last':
      sql += replaceFields.First +",'" + value + "', " + replaceFields.Pickup + ", " + replaceFields.Phone + ", " + replaceFields.Package + ", ?)";
      break;
    case 'Pickup':
      sql += replaceFields.First +"," + replaceFields.Last + ", '" + value + "', " + replaceFields.Phone + ", " + replaceFields.Package + ", ?)";
      break;
    case 'Phone':
      sql += replaceFields.First +"," + replaceFields.Last + ", " + replaceFields.Pickup + ", '" + value + "', " + replaceFields.Package + ", ?)";
      break;
    case 'Package':
      sql += replaceFields.First +"," + replaceFields.Last + ", " + replaceFields.Pickup + ", " + replaceFields.Phone + ", '" + value + "', ?)";
      break;
    default:
      sql += replaceFields.First +"," + replaceFields.Last + ", " + replaceFields.Pickup + ", " + replaceFields.Phone + ", " + replaceFields.Package + ", ?)";
      break;
  }
  db.transaction(function(tx){
    tx.executeSql(sql, [id, trip], function(tx,result){},
                  function(tx, error){
                    console.log(error.message);
                  }); 
  });
}
function saveButton(id,value){
  // TODO: port to Local storage
  var db = window.db;
  var time = (new Date()).valueOf();
  time = (time.toString()).substr(0,10); // time values were larger than mysql unix time values
  db.transaction(function(tx) {
    tx.executeSql('INSERT OR REPLACE INTO `ovr_lists_fields` (`ID`, `value`, `timeStamp`) VALUES(?,?,?)',
      [id, value, time],
      function(tx,result){},
      function(tx, error){
        console.log('error inserting or replacing on ovr_lists_fields: ' + error.message);
      }
    );
  });
}
function saveWebOrder(id,webOrder){
  // TODO: remove when local storage is implemented
  var db = window.db;
  var time = (new Date()).valueOf();
  time = (time.toString()).substr(0,10);//take most significant 10 digits, was longer than mysql timestamp
  var trip = $('#trip').val();
  db.transaction(function(tx) {
    tx.executeSql('INSERT OR REPLACE INTO `ovr_lists_orders`' +
                  ' (`ID`, `First`, `Last`, `Pickup`, `Phone`,`Package`, `Trip`,`Email`,`timeStamp`)' +
                  ' VALUES(?,?,?,?,?,?,?,?,?)',
      [id, webOrder.First, webOrder.Last, webOrder.Pickup, webOrder.Phone, webOrder.Package, trip, webOrder.Email, time],
      function(tx,result){},
      function(tx, error){
        console.log('error inserting or replacing on ovr_lists_orders: ' + error.message);
      }
    );
  });
}
function selectOrderCheckboxes(){
  // TODO: remove when local storage is implemented
  if (window.selectMode == "save"){
  $('#saveBar').css('width', '30%');
  }
  var db = window.db;
  if (window.tableData === undefined){
    window.tableData = {};
  }
  var tableData = window.tableData;
  var trip = $('#trip').val();
  
  db.transaction(function(tx){
    tx.executeSql('SELECT `ovr_lists_fields`.`ID`, `ovr_lists_fields`.`value`,`ovr_lists_fields`.`timeStamp`' +
                  'FROM `ovr_lists_fields`' +
                  'INNER JOIN `ovr_lists_orders` on `ovr_lists_fields`.`ID` LIKE `ovr_lists_orders`.`ID` || "%"' +
                  'WHERE `ovr_lists_orders`.`trip` = ?', 
                  [trip],
                  function(tx,results){
                    var len=results.rows.length;
                    var i;
                    
                    for(i = 0; i < len; i++) {
                      var label = results.rows.item(i).ID;
                      label = label.split(':');
                      var order = label[0];
                      var orderItem = label[1];
                      var field = label[2];
                      var value = results.rows.item(i).value == 'true' ? 1:0;
                      
                      if ( typeof tableData[order] === "undefined" || typeof tableData[order] === undefined) {
                      tableData[order] = {};
                      }
                      
                      if ( typeof tableData[order][orderItem] === "undefined" || typeof tableData[order][orderItem] === undefined) {
                      tableData[order][orderItem] = {};
                      }
                      // only save time stamps for saving to external DB
                      if (window.selectMode == "save") {
                        tableData[order][orderItem][field] = new Array(value, results.rows.item(i).timeStamp);
                      } else if (window.selectMode == "build") {
                        tableData[order][orderItem][field] = value;
                      }
                    }
                    if (window.selectMode == "save"){
                      $('#saveBar').css('width', '40%');
                      selectManualOrders();
                    } else if (window.selectMode == "build"){
                      selectManualOrders();
                    }
                  });
  });
}
function selectManualOrders(){
  // TODO: remove when local storage is implemented
  if (window.selectMode == "save"){
    $('#saveBar').css('width', '50%');
  }
  var db = window.db;
  var tableData = window.tableData;
  var trip = $('#trip').val();
  
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM `ovr_lists_manual_orders` WHERE `trip` = ?',
                  [trip],
                  function(tx,results){
                  var len = results.rows.length;
                  var i;
                  for(i = 0; i < len; i++) {
                    var id = results.rows.item(i).ID;
                    id = id.split(':');
                    var order = id[0];
                    var orderItem = id[1];
                    
                    if ( typeof tableData[order] === 'undefined') {
                      tableData[order] = {};
                    }
                    
                    if ( typeof tableData[order][orderItem] === 'undefined') {
                      tableData[order][orderItem] = {};
                    }
                    
                    tableData[order][orderItem].First = results.rows.item(i).First;
                    tableData[order][orderItem].Last = results.rows.item(i).Last;
                    tableData[order][orderItem].Pickup = results.rows.item(i).Pickup;
                    tableData[order][orderItem].Phone = results.rows.item(i).Phone;
                    tableData[order][orderItem].Package = results.rows.item(i).Package;
                    tableData[order][orderItem].Trip = results.rows.item(i).Trip;
                  }
                  if (window.selectMode == "save"){
                    selectManualCheckboxes();
                  } else if (window.selectMode == "build") {
                    selectManualCheckboxes();
                  }
      });
  });
}
function selectWebOrders(){
  // TODO: remove when local storage is implemented
  var db = window.db;
  var tableData = window.tableData;
  var trip = $('#trip').val();
  
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM `ovr_lists_orders` WHERE `trip` = ?',
                  [trip],
                  function(tx,results){
                  var len = results.rows.length;
                  var i;
                  for(i = 0; i < len; i++) {
                    var id = results.rows.item(i).ID;
                    id = id.split(':');
                    var order = id[0];
                    var orderItem = id[1];
                    
                    if ( typeof tableData[order] === 'undefined') {
                      tableData[order] = {};
                    }
                    
                    if ( typeof tableData[order][orderItem] === 'undefined') {
                      tableData[order][orderItem] = {};
                    }
                    
                    tableData[order][orderItem].First = results.rows.item(i).First;
                    tableData[order][orderItem].Last = results.rows.item(i).Last;
                    tableData[order][orderItem].Pickup = results.rows.item(i).Pickup;
                    tableData[order][orderItem].Phone = results.rows.item(i).Phone;
                    tableData[order][orderItem].Package = results.rows.item(i).Package;
                    tableData[order][orderItem].Trip = results.rows.item(i).Trip;
                    tableData[order][orderItem].Email = results.rows.item(i).Email;
                    if (tableData[order][orderItem].Email === undefined) {
                      tableData[order][orderItem].Email = "No Email";
                    }
                  }
                  $("#listTable").buildTable();
      });
  });
}
function selectManualCheckboxes(){
  // TODO: remove when local storage is implemented
  if (window.selectMode == "save"){
    $('#saveBar').css('width', '60%');
  }
  var db = window.db;
  var tableData = window.tableData;
  var trip = $('#trip').val();
  
  db.transaction(function(tx){
    tx.executeSql('SELECT `ovr_lists_fields`.* ' +
                  'FROM `ovr_lists_fields`, `ovr_lists_manual_orders`' +
                  'WHERE `ovr_lists_fields`.`ID` LIKE `ovr_lists_manual_orders`.`ID`||"%" ' +
                  'AND `ovr_lists_manual_orders`.`trip` = ?',
                  [trip],
                  function(tx,results){
                    var len = results.rows.length;
                    var i;
                    
                    for (i = 0; i < len; i++) {
                      var id = results.rows.item(i).ID;
                      id = id.split(':');
                      var order = id[0];
                      var orderItem = id[1];
                      var field = id[2];
                      var value = results.rows.item(i).value == 'true' ? 1:0;
                      
                      if ( typeof tableData[order] === 'undefined') {
                        tableData[order] = {};
                      }
                      
                      if ( typeof tableData[order][orderItem] === 'undefined') {
                        tableData[order][orderItem] = {};
                      }
                      // only save timestamp for saving to external DB
                      if (window.selectMode == "save") {
                        tableData[order][orderItem][field] = new Array(value, results.rows.item(i).timeStamp);
                      } else if (window.selectMode == "build") {
                        tableData[order][orderItem][field] = value;
                      }
                    }
                    if (window.selectMode == "save"){
                      postData();
                    } else if (window.selectMode == "build"){
                      selectWebOrders();
                    }
                  },
                  function(tx,error) {
                    console.log("query error:" + error.message);
                  });
  });
}
function postData(){
  // send data to backend mySQL database
  $('#saveBar').css('width', '80%');
  var jqxhr = $.post( "save.php", {'data' : window.tableData } ,function() {})
    .done(function() {
      $('#saveBar').css('width', '100%');
      setTimeout(function(){
        $('#saveProgress').remove();
        $('#mainBody').append('<div id="success" class="alert alert-success alert-dismissable">' +
                              '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                              'Successful Save</div>');
        setTimeout(function(){ 
          $('#success').remove();
        }, 5000);
      });
    })
    .fail(function() {
      console.log("POST request error");
      $('#mainBody').append('<div id="success" class="alert alert-danger alert-dismissable">' +
                            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                            'Something went wrong, try saving again</div>');
                            $('.close').on('click',function(){
                              $('#saveProgress').remove();
                            });
    });
}
function truncateTables(){
  // TODO: remove when local storage is implemented
  var db = window.db;
  db.transaction(function (tx) {  
    tx.executeSql('DELETE FROM `ovr_lists_fields`');
  });
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM `ovr_lists_manual_orders`');
  });
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM `ovr_lists_orders`');
  });
}
function setupProgressBar(){
  $('#mainBody').append('<div id="saveProgress"><h3>Save Progress:</h3>' +
    '<div class="progress progress-striped active">' +
    '<div id="saveBar" class="progress-bar"  role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100" style="width: 1%">' +
      '<span class="sr-only">1% Complete</span>' +
    '</div>' +
  '</div>' +
    '</div>');
} 
// REMOVE THIS FUNCTION
function saveDropdown(type,classType, tripId, tripLabel){
  // TODO: remove when local storage is implemented
  var db = window.db;
  if ( type == 'destination' ) {
    tripId = classType;
  }
  db.transaction(function(tx) {
    tx.executeSql('INSERT OR REPLACE INTO `ovr_lists_dropdown` (`type`,`class`,`label`,`value`) VALUES(?,?,?,?)',
      [type,classType, tripLabel,tripId],
      function(tx,result){},
      function(tx, error){
        console.log('error inserting or replacing on ovr_lists_fields: ' + error.message);
      }
    );
  });
}
function selectDropdown(type){
  // TODO: remove when local storage is implemented
  var db = window.db;
  var destinations = window.destinations;
  var trips = window.trips;
  if (type == "destination") {
    db.transaction(function(tx){
      tx.executeSql('SELECT `class` FROM `ovr_lists_dropdown` WHERE type = ?', 
        ['destination'],
        function(tx,results){
          var len = results.rows.length;
          var i;
          
          for (i = 0; i < len; i++) {
            var value = results.rows.item(i).class;
            destinations += '<option class="' + value + '" value="' + value + '">'+ value + '</option>\n';
          }
          window.destinations = destinations;
        }
        );
    });
  } else if (type == "trip") {
    db.transaction(function(tx){
      tx.executeSql('SELECT `class`,`label`,`value` FROM `ovr_lists_dropdown` where type = ?',
        ['trip'],
        function(tx,result){
          var len = result.rows.length;
          var i;
          
          for (i = 0; i < len; i++) {
            var classType = result.rows.item(i).class;
            var tripLabel = result.rows.item(i).label;
            var tripId = result.rows.item(i).value;
            trips += '<option class="' + classType + '" value="' + tripId + '">' + tripLabel + '</option>\n';
            window.trips = trips;
          }
        });
    });
  }
}
$('#save').click(function(){
  window.selectMode = 'save';
  setupProgressBar();
  $('#saveBar').css('width', '10%');
  
  if(window.navigator.onLine){
    $('#saveBar').css('width', '20%');
    window.tableData = {};
    /* Starts selection of data from webSQL DB's 
    futher calls are chained on transaction success */
    selectOrderCheckboxes();
  } else {
    $('#mainBody').append('<div id="success" class="alert alert-warning alert-dismissable">' +
                            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                            'Changes made have been saved locally, try again when you\'re online</div>');
    $('#saveBar').css('width', '100%');
    setTimeout(function(){
      $('#saveProgress').remove();
    },2000);
  }
});
$.fn.getData = function(){
  var jqxhr = $.post("pull.php", {'requestType':'orders','trip' : $(this).val()})
  .done(function(data){
    window.orderData = data;
    console.log('Server Data:');
    console.log(window.orderData);
    window.storage.set('orderData',orderData);
    $("#listTable").buildTable();
  })
  .fail(function(error){
    console.log('Error getting data:' + error.message);
  });
};
// End webSQL Functions
function createTripCookie(){
  var today = new Date();
  var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
  var expires = "; expires=" + tomorrow.toGMTString();
  var name = "OvrRide Trip";
  var tripValue = $('#trip').val();
  var destValue = $('#destination').val();
  var value = destValue + "," + tripValue;
  document.cookie = name + "=" + value + expires + "; path=/";
}
function readTripCookie(){
  var cookies = document.cookie;
  var location = cookies.indexOf(" OvrRide Trip=");
  var value = unescape(cookies.substring(location, cookies.length));
  var name;
  // Take out Trip cookie
  value = value.split(';');
  value = value[0];
  // Take out label
  value = value.split('=');
  name = value[0];
  value = value[1];
  value = value.split(',');
  
  if (name == 'OvrRide Trip'){
    return value;
  } else {
    return false;
  }
}
function destroyTripCookie(){
  document.cookie = "OvrRide Trip=;-1; path=/";
}
// CONVERT TO LOCAL STORAGE
function setTrip(){
  var trip = readTripCookie();
  if ( trip ){
    $('#destination').val(trip[0]);
    // Need to trigger change for chained plugin to show trips
    $('#destination').trigger('change');
    $('#trip').val(trip[1]);
  }
}
function setupTablesorter(rows) {
    var pagerOptions = {
    container: $('.pager'),
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})' 
    };
    var headerOptions = {
      0: { sorter: 'text' },
      1: { sorter: 'checkbox' },
      2: { sorter: 'text' },
      3: { sorter: 'text' },
      4: { sorter: 'text' },
      5: { sorter: 'digit' },
      6: { sorter: 'text' },
      7: { sorter: 'digit' },
      8: {sorter: 'text'}, 
      9: { sorter: 'text' },
      10: { sorter: 'text' },
      11: { sorter: 'text' },
      12: { sorter: 'text' },
      13: { sorter: 'text' },
      14: { sorter: 'text' },
      15: { sorter: 'text' },
      16: { sorter: 'text' },
      17: { sorter: 'text' },
      18: { sorter: 'text' }
    };
    var filterOptions = {
        4 : true,
        6 : true 
      };
    var widgetOptions = {
      editable_columns       : '2-6',  // point to the columns to make editable (zero-based index)
      editable_enterToAccept : true,     // press enter to accept content, or click outside if false
      editable_autoResort    : false,    // auto resort after the content has changed.
      editable_noEdit        : 'no-edit', // class name of cell that is no editable
      stickyHeaders_offset: 50,
      filter_childRows : true,
      filter_columnFilters : true,
      filter_hideFilters : true,
      filter_ignoreCase : true,
      filter_reset : '.reset',
      filter_searchDelay : 0,
      filter_functions : filterOptions
    };
    // Modify options for tables with no pickup column
    if (rows == 17) {
      delete headerOptions[18];
      headerOptions[4].sorter = 'digit';
      headerOptions[5].sorter = 'text';
      headerOptions[6].sorter = 'digit';
      headerOptions[7].sorter = 'text';
      widgetOptions.editable_columns = '2-5';
      delete filterOptions[4];
      delete filterOptions[6];
      filterOptions[5] = true;
    }
    
    var tablesorterOptions = {
      delayInit: false,
      widthFixed: true,
      ignoreCase: true,
      removeRows: true,
      sortList: [[4,0],[3,0]],
      headers: headerOptions,
      widgets : [ 'editable', 'columns','filter' ],
      widgetOptions: widgetOptions,
    };
    if (rows > 0) {
      $('#Listable').tablesorter(tablesorterOptions).tablesorterPager(pagerOptions);
      $('.pager').css('visibility','visible');
    }
}
function setupDropDowns(){
  if (window.navigator.onLine) {
    var dropDown = {};
    dropDown.destinations = {};
    dropDown.trips = {};
    var jqxhr = $.post('pull.php', {'requestType':'dropdowns'})
    .done(function(data){
      var destinations = '';
      var trips = '';
      $.each(data.destinations, function(key,value){
        destinations += '<option class="' + value + '" value="' + value + '">'+ value + '</option>';
        dropDown.destinations[value] = value;
      });
      $('#destination', '#mainBody').append(destinations);
      $.each(data.trip, function(classType,value){
        $.each(value, function(tripId, tripLabel){
          trips += '<option class="' + classType + '" value="' + tripId + '">' + tripLabel + '</option>';
          if ( typeof dropDown.trips[classType] == 'undefined' ) {
            dropDown.trips[classType] = {};
          }
          dropDown.trips[classType][tripId] = tripLabel;
        }); 
      });
      window.storage.set('dropDown',dropDown);
      $('#trip', '#mainBody').append(trips);
      $("#trip").chained("#destination");
    });
  } else {
    var localDropdown = window.storage.get('dropDown');
    var localTrips = '';
    var localDestinations = '';
    $.each(localDropdown.destinations, function(destination){
      localDestinations += '<option class="' + destination + '" value="' + destination + '">' + destination + '</option>\n';
    });
    $('#destination').append(localDestinations);
    $.each(localDropdown.trips, function(tripClass, data){
      $.each(data, function(tripId, tripLabel){
          localTrips += '<option class="' + tripClass + '" value="' + tripId + '">'+tripLabel+'</option>\n';
      });
      
    });
    $('#trip').append(localTrips);
    setTimeout(function(){
      $("#trip").chained("#destination");
    },200);
  }
  
}
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
$.fn.buildTable = function(){
  var hasPickup = '';
  var orderData   = window.orderData;
  var tableHeader = '';
  var tableBody   = '';
  var tableFooter = '';
  var riders      = 0;
  var byLocation  = {};
  var statusBoxes = {};
  $('.order_status_checkbox').each(function(){
    statusBoxes[$(this).attr('name')] = $(this).is(':checked');
  });
  $('#Listable').remove();
  if (window.navigator.onLine) {
    // ONLINE
    if ($('#trip').val() != 'none') {
      createTripCookie();
    }
    
    if (jQuery.isEmptyObject(orderData)) {
      $(this).append('<div class="container"><p>There are no orders for the selected Trip and Order Status.</p></div>');
      $('#loader').css('display','none');
      throw new Error('Aborted table creation, no data here');
    } 
  }
  truncateTables();
  var events = [];
  $.each(orderData, function(orderNumber, values){
    var prefix = orderNumber.substring(0,2);
    $.each(values, function(orderItemNumber, fields){
      var id = orderNumber+":"+orderItemNumber;
      var row = {};
      
      saveWebOrder(id,fields);
      if (statusBoxes[fields.Status] === true) {
        $.each(fields, function(field, value){
          if (field == 'First' || field == 'Last' || field == 'Pickup' || field == 'Phone' || field == 'Package' || field == 'Order') {
            row[field] = '<td id="' + id + ':' + field +'"';
            switch (field) {
              case 'First':
                row[field] += ' headers="First"';
                break;
              case 'Last':
                row[field] += ' headers="Last"';
                break;
              case 'Pickup':
                row[field] += ' headers="Pickup"';
                hasPickup = true;
                break;
              case 'Phone':
                row[field] += ' headers="Phone"';
                break;
              case 'Package':
                row[field] += ' headers="Package"';
                break;
              case 'Order':
                row[field] += 'headers="Order"';
            }
            if (prefix != 'WO') {
              row[field] += ' class="no-edit"';
            } else {
              row[field] += ' class="saved"';
            }
            row[field] +='>' + value + '</td>';
          } else if (field != 'Email'){
            var btnClass;
            var spanClass;
            if (value == 1) {
              btnClass = 'btn-success';
              spanClass = 'glyphicon-ok-sign';
            } else {
              btnClass= 'btn-danger';
              spanClass = 'glyphicon-minus-sign';
            }
            value = (value == 1 ? true : false);
            row[field] = '<td class="center-me" id ="' + id + ':' + field + '"><span class="value">' + value + '</span>' +
                          '<button name ="' + id + ':' + field + '" class="btn-xs btn-default ' + btnClass + '" value="' + value + '">' +
                          '<span class="glyphicon ' + spanClass + '"></span></button></td>';
            saveButton(id + ':' + field, value);
            // ADD selector to array!
            events.push("#"+orderNumber+"\\:"+orderItemNumber+"\\:"+field);
          }
        });
        /* Had to manually assemble cells in correct order, couldn't get AM/Pm on left side of table with a loop
          this is proably a result of moving data from PHP to JSON and back to an array */
        tableBody += '<tr>'+row.AM + row.PM + row.First + row.Last;
        if (row.Pickup) {
          tableBody += row.Pickup;
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
      
        if (row.Pickup) {
          var locationName = row.Pickup.replace(/<(?:.|\n)*?>/gm, '');
          if (typeof byLocation[locationName] === undefined || typeof byLocation[locationName] === 'undefined') {
            byLocation[locationName] = 0;
          }
          byLocation[locationName] += 1;
        }
      }
    });
  });
  // Assemble table from data
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
                
  tableBody += '</tbody>\n';
  tableFooter += '<tfoot>\n<tr class="totals-row">' +
                 '<td><button type="button" class="btn btn-primary" id="add">' +
                 '<span class="glyphicon glyphicon-plus"></span></button></td>' +
                 '<td><button type="button" class="btn btn-danger" id="remove">' +
                 '<span class="glyphicon glyphicon-minus"></span></button></td>';
  if (byLocation) {
    tableFooter += '<td>Guests by Pickup: </td>';
    $.each(byLocation, function(location, value){
      tableFooter += '<td>' + location + ': ' + value + '</td>';
    });
  }
    
  tableFooter += '</tfoot></table>';
  var output = tableHeader + tableBody + tableFooter;
  $('#loader').css('display','none');
  $(this).append(output);
  // click event to add row to the table for a manual order
  $('#add').click(function(){addOrder();});
   
   // click event to remove unsaved manual orders from table
   $('#remove').click(function(){removeOrder();});
   
  $('#save').css('visibility','visible');
  if (window.navigator.onLine){
    $('#csv_list').css('visibility','visible');
    $('#csv_email').css('visibility','visible');
  }
  
  setupTablesorter($("#Listable").colCount());
  
  // update table when sorting (speeds up click lag on iOS/mobile devices )
  $('#Listable thead tr td').on("click", function(){ $('#Listable').trigger('update'); });
  
  createTripCookie();
  
  $.each(events, function(key,value){
    addButtonListener(value);
  });
  //$('#Listable').autoSave();
};
function addButtonListener(value){
  $(value,'#Listable').on('click',function(){
    var button = $(this).children('button');
    var iconSpan = button.children('.glyphicon');
    var hiddenSpan = $(this).children('span');
    var tdId = $(this).attr('id');
    tdId = tdId.split(':');
    var order = tdId[0];
    var item = tdId[1];
    var field = tdId[2];
    var packageText;
    var time = (((new Date()).valueOf()).toString()).substr(0,10);
    
    if ( button.hasClass('btn-success')) {
      button.removeClass('btn-success').addClass('btn-danger').val('false');
      iconSpan.removeClass('glyphicon-ok-sign').addClass('glyphicon-minus-sign');
      hiddenSpan.text('false');
      orderData[order][item][field] = 0;
    } else if ( button.hasClass('btn-danger')) {
      button.removeClass('btn-danger').addClass('btn-success').val('true');
      iconSpan.removeClass('glyphicon-minus-sign').addClass('glyphicon-ok-sign');
      hiddenSpan.text('true');
      orderData[order][item][field] = 1;
    }
    
    if ( typeof orderData[order][item].timeStamp === undefined ) {
      console.log('Setting timeStamp field');
    }
    
    orderData[order][item].timeStamp = time;
    
    window.storage.set('orderData',window.orderData);
    console.log('Data @ save:');
    console.log(orderData);
    
    //check packages if AM
    if (field == 'AM') {
      packageText = $("#" + order + "\\:" + item + "\\:Package").text();
      checkPackages(packageText, order, item, "true");
    }
  });
}
function addManualListener(value){
  $(value).on('blur', function(){
    var id = $(this).attr('id');
    id = id.split(':');
    var order = id[0];
    var itemNum = id[1];
    var field = id[2];
    var time = (((new Date()).valueOf()).toString()).substr(0,10);
    var text = $(this).text();

    if ( text === '' || text === ' ' || text == 'Cannot be blank!') {
      $(this).text('Cannot be blank!').css('color','red');
    } else {
      $(this).css('color','');
      // Setup nested objects if they do not exist
      if ( typeof window.orderData[order] === "undefined" ) {
        window.orderData[order] = {};
      }
      if (typeof window.orderData[order][itemNum] === "undefined" ) {
        window.orderData[order][itemNum] = {};
      }
      window.orderData[order][itemNum][field] = text;
      window.orderData[order][itemNum].timeStamp = time;
      window.storage.set('orderData',window.orderData);
    }
  });
  $(value).on('focusin', function(){
    var text = $(this).text();
    if ( text == 'Cannot be blank!' || text === ' ') {
      $(this).text('');
    }
  });
}
function addOrder(){
  // switch to last page
  $('.last.btn.btn-default').trigger('click');
  
  // Find total cell and increment
  $('#total_guests').text( function(i,txt) { return parseInt(txt,10) + 1;} );
  
  //Generate Walk On order #
  var itemNum = Math.floor( Math.random() * 90000 );
  var order = 'WO' + Math.floor( Math.random() * 90000 );
  var id = order + ":" + itemNum;
  
  var row = '<tr class="manual">' +
  '<td class="center-me" id ="' + id + ':AM"><span class="value">false</span>' +
  '<button name ="' + id + ':AM" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':PM"><span class="value">false</span>' +
  '<button name ="' + id + ':PM" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td contenteditable="true" id ="' + id +':First" class="unsaved"><input type="hidden" value="' + id + '" /></td>' +
  '<td contenteditable="true" id ="' + id +':Last" class="unsaved"><input type="hidden" value="' + id + '" /></td>' +
  '<td contenteditable="true" id ="' + id +':Pickup" class="unsaved"><input type="hidden" value="' + id + '" /></td>' +
  '<td contenteditable="true" id ="' + id +':Phone" class="unsaved"><input type="hidden" value="' + id + '" /></td>' +
  '<td contenteditable="true" id ="' + id +':Package" class="unsaved"><input type="hidden" value="' + id + '" /></td>' +
  '<td headers="Order" class="no-edit unsaved">' + order + '</td>' +
  '<td class="center-me" id ="' + id + ':Waiver"><span class="value">false</span>' +
  '<button name ="' + id + ':Waiver" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':Product"><span class="value">false</span>' +
  '<button name ="' + id + ':Product" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':Bus"><span class="value">false</span>' +
  '<button name ="' + id + ':Bus" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':All_Area"><span class="value">false</span>' +
  '<button name ="' + id + ':All_Area" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':Beg"><span class="value">false</span>' +
  '<button name ="' + id + ':Beg" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':BRD"><span class="value">false</span>' +
  '<button name ="' + id + ':BRD" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':SKI"><span class="value">false</span>' +
  '<button name ="' + id + ':SKI" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':LTS"><span class="value">false</span>' +
  '<button name ="' + id + ':LTS" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':LTR"><span class="value">false</span>' +
  '<button name ="' + id + ':LTR" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td>' +
  '<td class="center-me" id ="' + id + ':Prog_Lesson"><span class="value">false</span>' +
  '<button name ="' + id + ':Prog_Lesson" class="btn-xs btn-default btn-danger" value="false">' +
  '<span class="glyphicon glyphicon-minus-sign"></span></button></td></tr>',
  $row = $(row),
  resort = false;
  $('#Listable').find('tbody').append($row).trigger('addRows', [$row, resort]);
  addButtonListener("#" + order + "\\:" + itemNum + "\\:AM");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:PM");
  addManualListener("#" + order + "\\:" + itemNum + "\\:First");
  addManualListener("#" + order + "\\:" + itemNum + "\\:Last");
  addManualListener("#" + order + "\\:" + itemNum + "\\:Pickup");
  addManualListener("#" + order + "\\:" + itemNum + "\\:Phone");
  addManualListener("#" + order + "\\:" + itemNum + "\\:Package");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:Waiver");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:Product");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:Bus");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:All_Area");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:Beg");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:BRD");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:SKI");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:LTS");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:LTR");
  addButtonListener("#" + order + "\\:" + itemNum + "\\:Prog_Lesson");
  $("#" + order + "\\:" + itemNum + "\\:First").focus();
}
function removeOrder(){
    if($('#Listable tbody tr:last').hasClass('manual')){
      var label = $('#Listable tbody tr:last td').attr('id');
      var id = label[0] + ':' + label[1];
      
      // Delete from object and local storage
      delete window.orderData[id];
      window.storage.set('orderData',window.orderData);
      
      $('#Listable tbody tr:last').remove();
      $('#total_guests').text(function(i,txt){ return parseInt(txt,10) - 1; });
      $('#Listable').trigger("update"); 
    }
}
function exportCsv(mode){
  var text = '';
  if ( mode == 'Email' ) {
    text += 'Email, First, Last, Package, Pickup\n';
  } else if ( mode == 'Export' ) {
    text += 'AM, PM, First, Last, Pickup, Phone, Package, Order, Waiver, Product REC.,';
    text += ' Bus Only, All Area Lift, Beg. Lift, BRD Rental, Ski Rental, LTS, LTR, Prog. Lesson\n';
  }
  selectOrderCheckboxes();
  selectManualOrders();
  selectWebOrders();
  selectManualCheckboxes();
  $.each(window.orderData, function(order,data){
    $.each(data, function(orderItem, fields){
      if ( mode == 'Export' ) {
        text += fields.AM + ',' + fields.PM + ',"' + fields.First + '","' + fields.Last + '","' + fields.Pickup + '","' + fields.Phone + '",'; 
        text += '"' + fields.Package + '",' + order + ',' +  fields.Waiver + ',' + fields.Product + ',' + fields.Bus + ',' + fields.All_Area + ',';
        text += fields.Beg + ',' + fields.BRD + ',' + fields.SKI + ',' + fields.LTS + ',' + fields.LTR + ',' + fields.Prog_Lesson + '\n';  
      } else if ( mode == 'Email' ) { 
        text += '"' + fields.Email + '","' + fields.First + '","' + fields.Last + '","' + fields.Package + '","' + fields.Pickup + '"\n';
      }
    });
  });

  var encodedUri = encodeURI(text);
  var link = document.createElement("a");
  var name = $('#destination').val() + ' ' + $('#trip option:selected').text() + ' ' + mode + '.csv';
  link.setAttribute("href", "data:text/csv;charset=utf-8,\uFEFF" + encodedUri);
  link.setAttribute("download",name);
  link.click();
  
}
// TODO: REMOVE when all functions are ported to local storage
// Connect to webSQL DB and create tables
(function(){
  var db = openDatabase('lists.ovrride.com', '0.2', 'OvR Ride Lists local DB', 2 * 1024 * 1024);
  window.db = db;
  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS' +
                  '`ovr_lists_fields` (`ID` UNIQUE, `value` INTEGER, `timeStamp` INTEGER)',
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
    tx.executeSql('CREATE TABLE IF NOT EXISTS' +
                  '`ovr_lists_orders` (`ID` UNIQUE, `First`, `Last`,' +
                  ' `Pickup`, `Phone`, `Package`, `Trip`, `Email`,`timeStamp` INTEGER)',
                  [],
                  function(tx, result){
                    console.log('ovr_lists_manual_orders setup success'); },
                  function(tx, error){
                    console.log('ovr_lists_manual_orders setup error:' + error.message); }
    );
    tx.executeSql('CREATE TABLE IF NOT EXISTS ' +
                  '`ovr_lists_dropdown` (`type`,`class`,`label`,`value` UNIQUE)',
                  [],
                  function(tx, result){
                    console.log('ovr_lists_dropdown setup success'); },
                  function(tx, error){
                    console.log('ovr_lists_dropdown setup error:' + error.message); }
    );
  });
})();

$(function(){
  // Setup local storage
  window.storage = $.localStorage;
  setupDropDowns();
  if (!window.navigator.onLine) {
    setTrip();
  }
  
  // remove 300ms click input for checkboxes on iOS
  $('#listTable tbody tr td input').noClickDelay();
  
  // disable link on onLine/offLine status
  $('.status').not('.iphone').click(function(e){
    e.preventDefault();
  });

  // save when back online
  window.addEventListener('online',  function(){
    $('#mainBody').append('<div id="backOnline" class="alert alert-info alert-dismissable">' +
                          '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                          'Back online, save starting...</div>');
    setTimeout(function(){
      $('#backOnline').remove();
      $('#save').trigger('click');  
    },2000);
    
  });
  
  // Monitor onLine status and flip navbar indicator 
  setInterval(function () {
    var status = $('.status').not('.iphone');
    var statusSmall = $('.status.iphone');
    if (window.navigator.onLine) {
      if ($('#Listable').length > 0) {
      $('#csv_list').css('visibility','visible');
      $('#csv_email').css('visibility','visible'); 
      }
      $('#save').removeClass('btn-warning');
      if (status.hasClass('glyphicon-cloud-download')) {
        status.removeClass('glyphicon-cloud-download').addClass('glyphicon-cloud-upload').css('color','').text(' online');
        statusSmall.removeClass('glyphicon-cloud-download').addClass('glyphicon-cloud-upload').css('color','');
      } else if (!status.hasClass('glyphicon-cloud-upload')) {
        status.addClass('glyphicon-cloud-upload').css('color','').text(' online');
        statusSmall.addClass('glyphicon-cloud-upload').css('color','');
      } 
    } else if (!window.navigator.onLine) {
      $('#csv_list').css('visibility','hidden');
      $('#csv_email').css('visibility','hidden');
      $('#save').addClass('btn-warning');
      if (status.hasClass('glyphicon-cloud-upload')){
        status.removeClass('glyphicon-cloud-upload').addClass('glyphicon-cloud-download').css('color', 'red').text(' offline');
        statusSmall.removeClass('glyphicon-cloud-upload').addClass('glyphicon-cloud-download').css('color', 'red');
      } else if (!status.hasClass('glyphicon-cloud-download')){
        status.addClass('glyphicon-cloud-download').css('color','red').text(' offline');
        statusSmall.addClass('glyphicon-cloud-download').css('color','red');
      }
    }
  }, 250);
});