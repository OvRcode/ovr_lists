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
    // Menu JS
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $("#btn-hide").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    
    $( '#btn-settings' ).click(function(){ window.location.href='index.html' });
    $( '#btn-list' ).click(function(){ window.location.href='list.html' });
    $( '#btn-summary' ).on("tap", function(){ window.location.href = 'summary.html' });
    $('#AMPM').change(function(){
        if ( $(this).val() == 'PM' ) {
            $('.listButton.bg-none').addClass('hidden');
        } else if ( $(this).val() == 'AM' ) {
            $('.listButton.bg-none').removeClass('hidden');
        }
    });
    // Turn off tap event when taphold is triggered;
    $.event.special.tap.emitTapOnTaphold = false; 
    setupPage();
    setupListeners();
});
function setupPage(){
    if ( window.settings.isSet('tripName') ) {
        $('#tripName').text(window.settings.get('tripName'));
    }
    if ( settings.isSet('bus') ) {
        $('#bus').text(settings.get('bus'));
    }
    var keys = initialHTML.keys();
    jQuery.each(keys, function(key,value){
        $('#content').append(initialHTML.get(value));
    });
    // Hide expanded area of reservation
    $("div.expanded").hide();
}
function noShow(element) {
    var NoShow = element.attr('id')+":NoShow";
    tripData.set(NoShow, 1);
    element.addClass('bg-noshow');
}
function resetGuest(element){
    var ID = element.attr('id');
    var clearVars = [ ID + ":AM", ID + ":PM", ID + ":Waiver", ID + ":Product", ID + ":NoShow" ];
    element.removeClass();
    element.addClass("row listButton bg-none");
    jQuery.each(clearVars, function(key,value){
        tripData.remove(value);
    });
}
function changeStatus(element){
    if ( $('#AMPM').val() == 'PM' ) {
        // Customer checked in at end of day
        element.removeClass('bg-productrec');
        element.addClass('bg-pm');
        var PM = element.attr('id')+":PM";
        tripData.set(PM, 1);
    }
    
    if ( element.hasClass('bg-none') && ! element.hasClass('bg-danger')) {
        // Customer Checked in
        var AM = element.attr('id') + ":AM";
        var Bus = element.attr('id')+":Bus";
        tripData.set(AM, 1 );
        tripData.set(Bus, settings.get('bus'));
        element.removeClass('bg-none');
        element.addClass('bg-am');        
        element.find('.flexPackage').removeClass('visible-md visible-lg');
        element.find('.flexPickup').addClass('visible-md visible-lg');
    } else if ( element.hasClass('bg-am') ) {
        // Waiver Received from Customer
        var Waiver = element.attr('id')+":Waiver";
        tripData.set(Waiver, 1);
        element.removeClass('bg-am');
        element.addClass('bg-waiver');
    } else if ( element.hasClass('bg-waiver') ) {
        // Customer received product
        var Product = element.attr('id')+":Product";
        tripData.set(Product, 1);
        element.removeClass('bg-waiver');
        element.addClass('bg-productrec');
        element.find('.flexPackage').addClass('visible-md visible-lg');
        element.find('.flexPickup').removeClass('visible-md visible-lg');
    }

}
function toggleExpanded(element){
    if ( element.is(':visible') ){
        element.hide(600);
    } else {
        element.show(600);
    }
}
function setupListeners(){
    jQuery.each(orders.keys(), function(key, value){
        var split = value.split(":");
        var selectorID = "#" + split[0] + "\\:" + split[1];
        // Click events for noshow/reset buttons
        $(selectorID + "\\:Reset").click(function(){
            resetGuest($(this).parents().eq(3));
        });
        $(selectorID + "\\:NoShow").click(function(){
            noShow($(this).parents().eq(3));
        });
        
       // Expand list entry by pressing and holding on entry (works on mobile and desktop)
        $( selectorID ).on("taphold", function(){
            toggleExpanded( $(this).children('div.expanded') );
        });
        
        /* Click events for listButton
            on small screens noClick class is ignored because links are not shown on button in regular list mode */
        if ($(window).width() < 970) {
            $("#" + split[0] + "\\:" + split[1]).on("tap", function(){
                changeStatus($(this));
            });
        } else {
            $("#" + split[0] + "\\:" + split[1] + " div.row.primary").children().not(".noClick").on("tap", function(){
                changeStatus($(this).parents().eq(1));
            });
        }
        
    });
}