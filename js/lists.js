$(function() {
    window.dropDown = $.initNamespaceStorage('dropdown');
    window.dd = dropDown.localStorage; 
    window.options = $.initNamespaceStorage('settings');
    window.settings = options.localStorage; 
    window.orderData = $.initNamespaceStorage('orders');
    window.orders = orderData.localStorage;
    window.outputHTML = $.initNamespaceStorage('initialHTML');
    window.initialHTML = outputHTML.localStorage;    
    setupPage();
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
}
function noShow(element) {
    //NEED TO SAVE STATE TO LOCAL STORAGE!
    element.addClass('bg-danger');
}
function changeStatus(element){
    //NEED TO SAVE STATE TO LOCAL STORAGE!
    if ( element.hasClass('bg-none') && ! element.hasClass('bg-danger')) {
        element.removeClass('bg-none');
        element.addClass('bg-warning');        
        element.find('.flexPackage').removeClass('visible-md visible-lg');
        element.find('.flexPickup').addClass('visible-md visible-lg');
    } else if ( element.hasClass('bg-warning') ) {
        element.removeClass('bg-warning');
        element.addClass('bg-success');
    } else if ( element.hasClass('bg-success') ) {
        element.removeClass('bg-success');
        element.addClass('bg-info');
        element.find('.flexPackage').addClass('visible-md visible-lg');
        element.find('.flexPickup').removeClass('visible-md visible-lg');
    }

}
function setupListeners(){
    jQuery.each(orders.keys(), function(key, value){
        var split = value.split(":");
        if ($(window).width() < 970) {
            $("#" + split[0] + "\\:" + split[1])
            .click(function(){
                changeStatus($(this));
            });
        } else {
            //
            $("#" + split[0] + "\\:" + split[1] + " div.row.primary").children().not(".noClick")
            .click(function(){
                changeStatus($(this).parent().parent());
                //alert($(this).parent().parent().attr('id'));
            });
        }
        
    });
}
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$("#btn-hide").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$('#btn-settings').click(function(){
   window.location.href='index.html';
})
$('#btn-list').click(function(){
   window.location.href='list.html';
})
