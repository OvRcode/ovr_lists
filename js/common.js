$(function() {
    window.dropDown = $.initNamespaceStorage('dropdown');
    window.dd = dropDown.localStorage; 
    window.options = $.initNamespaceStorage('settings');
    window.settings = options.localStorage; 
    window.orderData = $.initNamespaceStorage('orders');
    window.orders = orderData.localStorage;
    window.outputHTML = $.initNamespaceStorage('initialHTML');
    window.initialHTML = outputHTML.localStorage;  
    window.data =$.initNamespaceStorage('data');
    window.tripData = data.localStorage; 
    window.notespace = $.initNamespaceStorage('notes');
    window.notes = notespace.localStorage;
    window.walkonspace = $.initNamespaceStorage('newWalkon');
    window.newWalkon = walkonspace.localStorage;
    // Menu JS
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $("#btn-hide").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $( '#brand' ).on("click", function(){ window.location.href='index.html' });
    $( '#btn-settings' ).on("click", function(){ window.location.href='index.html' });
    $( '#btn-list' ).on("click", function(){ window.location.href='list.html' });
    $( '#btn-summary' ).on("click", function(){ window.location.href = 'summary.html' });
    $( '#btn-notes' ).on("click", function(){ window.location.href = 'notes.html' });
    $( '#btn-message' ).on("click", function(){ window.location.href = 'message.html' });
    $( '#btn-admin' ).on("click", function(){ window.location.href = 'admin.html' });
    $( '#btn-logout' ).on("click", function(){ /*TODO: implement login/logout */ });
    
    // Monitor onLine status and flip navbar indicator
    setInterval(function () {
        var statusIcon = $("#status");
        if (window.navigator.onLine) {
            if ( statusIcon.hasClass('btn-danger') ) {
                statusIcon.removeClass('btn-danger')
                    .addClass('btn-success')
                    .html('<i class="fa fa-signal"></i> Online');
            }
        } else if (!window.navigator.onLine) {
            if ( statusIcon.hasClass('btn-success') ) {
                statusIcon.removeClass('btn-success')
                    .addClass('btn-danger')
                    .html('<i class="fa fa-plane"></i> Offline');
            }
        }
    }, 250);
});

function getNotes(){
    notes.removeAll();
    var trip = settings.get('tripNum');
    $.get("api/notes/"+trip, function(data){
        var parsed = jQuery.parseJSON(data);
        jQuery.each(parsed, function(key,value){
            notes.set(key, value);
        });
    }).done(function(){})
    .fail(function(){ /* fail function here*/});
}
function getTripData(){
    var trip = settings.get('tripNum');
    var statuses = settings.get('status');
    //Start with a clean slate
    window.orders.removeAll();
    window.initialHTML.removeAll();
    window.tripData.removeAll();
    $.get("api/trip/"+trip+"/"+statuses, function(data){
        var apiData = jQuery.parseJSON(data);
        jQuery.each(apiData, function(id,dataObject){
            jQuery.each(dataObject, function(key, value){
                if ( key == 'Data' ){
                    orders.set(id,value);
                    if ( 'Pickup' in value )
                        settings.set('Pickup', 1);
                } else {
                    initialHTML.set(id,value);
                }
            });
        });
    })
    .done(function(){
        window.location.href= "list.html";
    });
}
// Number padding for timestamp generation
Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    }