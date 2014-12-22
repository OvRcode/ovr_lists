$(function(){
    parseData();
    if ( ! jQuery.isEmptyObject(pickups) ) {
        outputPickups();
    }
    if ( tripData.keys() != '' ) {
        outputPackages();
    }
})
function parseData(){
    window.packages = {};
    window.pickups = {};
    jQuery.each(orders.keys(), function(key, value){
        var currentOrder = orders.get(value);
        // Check for pickup and save data
        if ( typeof currentOrder['Pickup'] != 'undefined' ) {
               var pickup = currentOrder['Pickup'].trim();
               if ( typeof pickups[pickup] == 'undefined' ) {
                   // Define pickup location object if not set
                   pickups[pickup] = {};
                   pickups[pickup].Expected = 0;
                   pickups[pickup].AM = 0;
                   pickups[pickup].PM = 0;
               }
               // Add to pickup location
               pickups[pickup].Expected++;
               if ( tripData.isSet(value + ":AM" ) ) {
                   pickups[pickup].AM++;
               }
               if ( tripData.isSet(value + ":PM" ) ) {
                   pickups[pickup].PM++;
               }
        }
        if ( tripData.isSet(value+":AM") )
            parsePackages(currentOrder['Package'].trim());
    });
}
function addPackage(packageName){
    if ( typeof packages[packageName] == 'undefined' ) {
        packages[packageName] = 0
    }
    packages[packageName]++;
}
function parsePackages(custPackage){
    var bus           = new RegExp(/bus only/i);
    var begLiftLesson = new RegExp(/beginner lift.*lesson$/i);
    var allArea       = new RegExp(/all area/i);
    var weekendLift   = new RegExp(/^lift/i);
    var weekendLift2  = new RegExp(/Balance \(lift/i);
    var ltr           = new RegExp(/beginner lift area.*bus.*lesson.*board/i);
    var lts           = new RegExp(/beginner lift area.*bus.*lesson.*ski/i);
    var progLesson    = new RegExp(/prog.* lesson/i);
    var ski           = new RegExp(/ski rental/i);
    var brd           = new RegExp(/board rental/i);
    var lunch         = new RegExp(/.*lunch.*/i);
    // Beach / Waterpark Specific packages
    var allMountainCoaster = new RegExp(/mountain coaster/i);
    var waterPark          = new RegExp(/all area waterpark/i);
    var oneWay             = new RegExp(/one way bus/i);
    var roundTrip          = new RegExp(/round trip bus/i);
    var beachDay           = new RegExp(/day at the beach package/i);
    var beachSurf          = new RegExp(/surf lesson/i);
    
    // Check summer packages then bus/Lift options
    if ( beachSurf.test(custPackage) ) {
        addPackage("Surf Lesson");
    }
    else if ( beachDay.test(custPackage) ) {
        addPackage("Day at the beach");
    }
    else if ( oneWay.test(custPackage) ) {
        addPackage("One way bus");
    }
    else if ( roundTrip.test(custPackage) ) {
        addPackage("Round Trip Bus");
    }
    else if ( waterPark.test(custPackage) ) {
        addPackage("All Area Waterpark");
    }
    else if ( allMountainCoaster.test(custPackage) ) {
        addPackage("Waterpark & Mountain Coaster");
    }
    else if ( bus.test(custPackage) ) {
        addPackage("Bus Only");
    } else if ( begLiftLesson.test(custPackage) ) {
        addPackage("Beginner Lift and Lesson");
    } else if ( allArea.test(custPackage) ) {
        addPackage("All Area Lift");
    } else if ( weekendLift.test(custPackage) || weekendLift2.test(custPackage) ) {
        addPackage("Weekend Lift");
    }
    // Check rentals and lessons
    if ( ltr.test(custPackage) ) {
        addPackage("Learn to Ride");
    } else if ( lts.test(custPackage) ) {
        addPackage("Learn to Ski");
    } else if ( progLesson.test(custPackage) ) {
        addPackage("Progressive Lesson");
    }
  
    if ( ski.test(custPackage) && !lts.test(custPackage) ) {
        addPackage("Ski Rental");
    } else if ( brd.test(custPackage) && !ltr.test(custPackage) ) {
        addPackage("Board Rental");
    }
  // REI Lunch Vouchers
    if ( lunch.test(custPackage) ) {
        addPackage("Lunch Voucher");
    }
}
function outputPickups(){
    var output = "<h3>Riders by location</h3>\
                  <table id='pickupTable' class='summary'>\
                    <thead>\
                        <tr>\
                            <th>Location</th><th>Expected</th><th>AM</th><th>PM</th>\
                        </tr>\
                    </thead>\
                    <tbody>";
    jQuery.each(pickups, function(pickup, object){
        var row = "<tr>\
                       <th>" + pickup + "</th><td>" + object.Expected + "</td><td>" + object.AM + "</td><td>" + object.PM + "</td>\
                  </tr>";
        output = output.concat(row);
    });
    output = output.concat("</tbody></table>");
    $("#content").append(output);
}
function outputPackages(){
    var output = "<h3>Package Item Totals</h3>\
                  <table id='packagesTable' class='summary'>\
                      <thead>\
                          <tr>\
                            <th>Item</th>\
                            <th>Total</th>\
                            <tbody>";
    jQuery.each(packages, function(key, value){
        var row = "<tr>\
                    <th>" + key + "</th><td>" + value + "</td>\
                  </tr>";
            output = output.concat(row);
    });
    output = output.concat("</tbody></table>");
    $("#content").append(output);
}
// jQuery.isEmptyObject(pickups);