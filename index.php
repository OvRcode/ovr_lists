<?php
/**
 * OvR Lists - The main template file for OvR Lists
 *
 *
 * @package OvR Lists
 * @since Version 0.0.1
 */

# Report all PHP errors
# For Development use only
# error_reporting(E_ALL|E_STRICT);
# ini_set('display_errors','On');

session_start();

# Start Session with a 1 day persistent session lifetime
$cookieLifetime = 60 * 60 * 24 * 1;
setcookie(session_name(),session_id(),time()+$cookieLifetime);

# Bounce to login if user is not logged in
if ( !isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    header("HTTP/1.0 401 Unauthorized");
    header("Location: login/login.php");
}

# get version from file
$version = file_get_contents('lists.version');
?>
<!DOCTYPE html>
<html lang="en"  manifest="manifest.appcache">

<head>
    <title>OvR Trip Lists</title>
    <!-- Mobile view properties & enable iOS Web App-->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="OvR Lists">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <!-- favicon and apple-touch-icon -->
    <link rel="icon" type="image/png" href="https://ovrride.com/favicon.ico">
    <link rel="apple-touch-icon" href="images/ios/iconset/Icon-60@2x.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="images/ios/iconset/Icon-60@3x.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="images/ios/iconset/Icon-76.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="images/ios/iconset/Icon-76@2x.png" />
    <link rel="apple-touch-icon" sizes="58x58" href="images/ios/iconset/Icon-Small@2x.png" />
    <!-- Apple Splash Screens -->
    <!-- iPhone -->
    <link href="images/startup-320x460.png"
      media="(device-width: 320px) and (device-height: 480px)
        and (-webkit-device-pixel-ratio: 1)"
      rel="apple-touch-startup-image" />


    <link href="css/application.min.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>

    <div id="wrapper">

        <!-- Sidebar -->
        <div id="sidebar-wrapper">
            <ul class="sidebar-nav">
                <li class="sidebar-brand">
                    <button class="btn btn-black" id="status"><i class="fas fa-signal"></i> Online</button>
                </li>
                <li>
                    <button type="button" class="btn btn-warning" id="btn-hide">
                        <i class="fas fa-arrow-left"></i>&nbsp;Hide Menu
                    </button>
                </li>
                <li>
                    <button class="btn btn-primary disabled" id="btn-settings">
                      <i class="fas fa-sliders-h"></i>&nbsp;Settings
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-primary btn-list" id="menuList">
                      <i class="fas fa-list"></i>&nbsp;List
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-primary btn-summary" id="menuSummary">
                        <i class="fas fa-table"></i>&nbsp;Summary
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-primary btn-reports" id="reportsMenu">
                        <i class="fas fa-edit"></i>&nbsp;Reports
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-primary" id="btn-message">
                        <i class="fas fa-exclamation-triangle"></i>&nbsp;Message
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-primary" id="btn-admin">
                        <i class="fas fa-tachometer-alt"></i>&nbsp;Admin
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-danger" id="btn-logout">
                        <i class="fas fa-power-off"></i>&nbsp;Log Out
                    </button>
                </li>
                <li>
                    <span class="version">OvR Lists <?php echo $version; ?></span>
                </li>
            </ul>
        </div>
        <!-- /#sidebar-wrapper -->

        <!-- Page Content -->
        <div id="page-content-wrapper container">
          <nav class="navbar navbar-default navbar-static-top ovr" role="navigation">
            <div class="container-fluid">
                <button class="btn btn-link navbar-brand" id="brand">OvR Trip Lists</button>
                <button class="btn btn-default" id="menu-toggle"><i class="fas fa-cogs"></i>&nbsp;Menu</button>
            </div>
          </nav>
            <div class="container-fluid pad">
                <div class="row-fluid">
                    <div class="col-lg-12">
                        <h3>List Settings</h3>
                        <select id="destination" class="form-control input-sm">
                            <option value="none" class="none">Select a destination</option>
                        </select>
                        <br />
                        <select id="trip" class="form-control input-sm">
                            <option value="none" class="none">Trip: Select destination first</option>
                        </select>
                        <br />
                        <select id="bus" class="form-control input-sm">
                            <option value="1">Bus 1</option>
                            <option value="2">Bus 2</option>
                            <option value="3">Bus 3</option>
                            <option value="4">Bus 4</option>
                            <option value="5">Bus 5</option>
                            <option value="6">Bus 6</option>
                            <option value="7">Bus 7</option>
                            <option value="8">Bus 8</option>
                            <option value="9">Bus 9</option>
                            <option value="10">Bus 10</option>
                            <option value="All">All Buses: Admin ONLY</option>
                        </select>
                        <br />
                        <div class="row">
                          <div class="checkbox">
                            <h4>Order Statuses:</h4>
                            <div class="col-xs-6 col-sm-2 col-md-2 col-lg-6">
                                <label class="input-lg"><input type="checkbox" value="wc-balance-due" id="balance">Balance Due</label><br />
                                <label class="input-lg"><input type="checkbox" value="wc-cancelled"  id="cancelled">Cancelled</label><br />
                                <label class="input-lg"><input type="checkbox" value="wc-completed"  id="completed" checked>Completed</label><br />
                                <label lcass="input-lg"><input type="checkbox" value="wc-modified" id="modified" checked>Completed, Modified</label><br />
                                <label class="input-lg"><input type=checkbox value="wc-failed"  id="failed">Failed</label><br />
                                <label class="input-lg"><input type="checkbox" value="wc-finalized" id="finalized">Finalized</label><br />
                                <label class="input-lg"><input type="checkbox" value="wc-no-show" id="no-show">No Show</label><br />
                            </div>
                            <div class="col-xs-6 col-sm-2 col-md-2 col-lg-6">
                                <label class="input-lg"><input type="checkbox" value="wc-on-hold" id="on-hold">On Hold</label><br />
                                <label class="input-lg"><input type="checkbox" value="wc-processing" id="processing" checked>Processing</label><br />
                                <label class="input-lg"><input type="checkbox" value="wc-pending" id="pending"> Pending</label><br />
                                <label class="input-lg"><input type="checkbox" value="wc-refunded" id="refunded">Refunded</label><br />
                                <label class="input-lg"><input type="checkbox" value="walk-on" id="walk-on" checked>Walk On</label><br />
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <br />
                          <button class="btn btn-warning" id="clear">Clear Statuses</button><button class="btn btn-warning" id="default">Reset Statuses</button>
                        </div>
                        <div class="row">
                          <button class="btn btn-success" id="generate_list">
                            <i class="fas fa-save"></i>&nbsp;Generate List
                          </button>
                          <button class="btn btn-danger" id="clearData">
                              <i class="fas fa-trash"></i>&nbsp;Clear Data
                          </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /#page-content-wrapper -->

    </div>
    <!-- /#wrapper -->
    <script src="js/settings.min.js"></script>
</body>

</html>
