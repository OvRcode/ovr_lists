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

    <title>OvR Trip Lists</title>

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
                    <button class="btn btn-primary" id="btn-settings">
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
                    <button type="button" class="btn btn-primary btn-reports disabled" id="reportsMenu">
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
            <div class="container-fluid pad" id="content">
                <!-- content here -->
                <h2>Reports</h2>
                <div class="row">
                    <div class="col-xs-12 col-md-12">
                        <p>Please fill out each required field into the open area below with starting with the corresponding number, then that numbers info.</p>  <p>Each field should be saved as a separate note.  Use this reference key below.</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-md-6">
                        <textarea rows="10" class="form-control" id="newReport" placeholder="Add note here"></textarea>
                    </div>
                    <div class="col-xs-12 col-md-6">
                        <ol type="1">
                            <li>Trip Leaders </li>
                            <li>Bus Info (Driver Name, Bus Company, Bus Number)</li>
                            <li>Passenger Count (After your last Pickup to the Mountain = To, After you depart MT = From)</li>
                            <li>Product Received (Hard Count of Product Received from Group Sales)</li>
                            <li>Added Products Unpaid (Changes, Additions, etc)</li>
                            <li>No Shows </li>
                            <li>Bus Issues (Late, Faulty Equipment, etc.)</li>
                            <li>Notable Injuries</li>
                            <li>Guest Complaints </li>
                            <li>General Additional Notes (How was the snow? Your day? Good crew? etc)</li>
                        </ol>
                    </div>
                </div>
                <div class="row reports">
                    <div class="col-xs-12">
                        <button class="btn btn-success" id="saveReport">
                            <i class="fas fa-save"></i>&nbsp;Save Report
                        </button>
                        <button class="btn btn-info" id="syncReports">
                            <i class="fas fa-refresh"></i>&nbsp;Sync Reports
                        </button>
                        <button class="btn btn-warning" id="tallyOrders">
                          <i class="fas fa-money"></i>&nbsp;Total Walk On Orders
                        </button>
                    </div>
                    <div class="col-xs-12">
                        Show reports from:<select id="bus" class="input-sm">
                        </select>
                        <span class="mobileButtons hidden">
                            <button type="button" class="btn btn-primary btn-list" id="backMobile">
                                <i class="fas fa-arrow-left"></i>&nbsp;Back to List
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <div id="reportsContent"></div>
                    </div>
                </div>
        </div>
        <!-- /#page-content-wrapper -->

    </div>
    <!-- /#wrapper -->
    <script src="js/reports.min.js"></script>
</body>

</html>
