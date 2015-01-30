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

session_regenerate_id();
session_start();

# Start Session with a 1 day persistent session lifetime
$cookieLifetime = 60 * 60 * 24 * 1;
setcookie(session_name(),session_id(),time()+$cookieLifetime);

# Session Validation - Is User logged in?
# else redirect to login page
if (!(isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] != ''))
  header ("Location: /login/index.php");

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
                    <button class="btn btn-black" id="status"><i class="fa fa-signal"></i> Online</button>
                </li>
                <li>
                    <button type="button" class="btn btn-warning" id="btn-hide">
                        <i class="fa fa-arrow-left"></i>&nbsp;Hide Menu
                    </button>
                </li>
                <li>
                    <button class="btn btn-primary" id="btn-settings">
                      <i class="fa fa-sliders"></i>&nbsp;Settings
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-primary btn-list disabled" id="menuList">
                      <i class="fa fa-list"></i>&nbsp;List
                    </button>
                </li>
                <li class="half">
                    <button type="button" class="btn btn-primary" id="addWalkOn"
                        data-toggle="popover"
                        data-html="true"
                        data-content="<div id='walkon'>
                                        <input type='text' class='form-control' id='first' placeholder='Enter Fist Name'><br />
                                        <input type='text' class='form-control' id='last' placeholder='Enter Last Name'><br />
                                        <input type='text' class='form-control' id='phone' placeholder='Enter Phone Number'><br />
                                        <div id='pickupDiv'>
                                            <input type='text' class='form-control' id='pickup' placeholder='Enter Pickup'><br />
                                        </div>
                                        <select class='input-sm' id='walkonPackage'></select><br /><br />
                                        <button type='button' class='btn btn-success disabled' id='saveWalkOn'>
                                          <i class='fa fa-plus'></i>&nbsp<i class='fa fa-list'></i>&nbsp;Add to list
                                       </button>
                                   </div>"
                        title="Walk-on Order"
                        data-placement="bottom">
                        <i class="fa fa-plus"></i>&nbsp;<i class="fa fa-male"></i>&nbsp;Add Walk On
                    </button>
                </li>
                <li class="half">
                    <button type="button" class="btn btn-success saveList" id="menuSave">
                        <i class="fa fa-floppy-o"></i>&nbsp;Save List
                    </button><br />
                </li>
                <li>
                    <button type="button" class="btn btn-primary btn-summary" id="menuSummary">
                        <i class="fa fa-table"></i>&nbsp;Summary
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-primary btn-reports" id="reportsMenu">
                        <i class="fa fa-pencil-square-o"></i>&nbsp;Reports
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-primary" id="btn-message">
                        <i class="fa fa-exclamation-triangle"></i>&nbsp;Message
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-primary" id="btn-admin">
                        <i class="fa fa-tachometer"></i>&nbsp;Admin
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-danger" id="btn-logout">
                        <i class="fa fa-power-off"></i>&nbsp;Log Out
                    </button>
                </li>
                <li>
                    <span class="version">OvR Lists <?php echo $version; ?></span>
                </li>
            </ul>
        </div>
        <!-- /#sidebar-wrapper -->

        <!-- Page Content -->
        <div>
          <nav class="navbar navbar-default navbar-static-top ovr" role="navigation">
            <div class="container-fluid">
                <button class="btn btn-link navbar-brand" id="brand">OvR Trip Lists</button>
              <button class="btn btn-default" id="menu-toggle"><i class="fa fa-cogs"></i>&nbsp;Menu</button>
            </div>
          </nav>
            <div class="container-fluid pad">
                <div class="row" id="top">
                    <div class="col-xs-9 col-md-8">
                        <h4>Trip: <span id="destName"></span> <span id="tripName"></span></h4>
                    </div>
                    <div class="col-xs-4 col-md-4">
                        <h4>Bus: <span id="bus"></span></h4>
                    </div>
                    <div class="col-xs-12 col-md-6">
                        <button class="btn btn-default" id="AMPM" value="AM">
                            <i class="fa fa-sun-o fa-lg"></i>&nbsp;
                            <i class="fa fa-toggle-off fa-lg"></i>&nbsp;
                            <i class="fa fa-moon-o fa-lg"></i>
                        </button>
                    </div>
                    <div class="col-xs-12 mobileButtons hidden">
                        <button class="btn btn-primary secondaryWalkOn">
                            <i class="fa fa-plus"></i>&nbsp;<i class="fa fa-male"></i>&nbsp;Add Walk On
                        </button>
                        <button type="button" class="btn btn-primary btn-reports">
                            <i class="fa fa-pencil-square-o"></i>&nbsp;Reports
                        </button>
                        <button type="button" class="btn btn-primary btn-summary" id="menuSummary">
                            <i class="fa fa-table"></i>&nbsp;Summary
                        </button>
                        <button type="button" class="btn btn-success saveList">
                            <i class="fa fa-floppy-o"></i>&nbsp;Save List
                        </button>
                    </div>
                    <div class="col-xs-4 col-md-3">
                        <select id="sortBy" class="input-sm" data-role='none'>
                            <option value="none">Sort By</option>
                            <option value="Faz">First&nbsp;&#8595;</option>
                            <option value="Fza">First&nbsp;&#8593;</option>
                            <option value="Laz">Last&nbsp;&#8595;</option>
                            <option value="Lza">Last&nbsp;&#8593;</option>
                            <option value="Paz">Package&nbsp;&#8595;</option>
                            <option value="Pza">Package&nbsp;&#8593;</option>
                            <option value="Piaz">Pickup&nbsp;&#8595;</option>
                            <option value="Piza">Pickup&nbsp;&#8593;</option>
                            <option value="Oaz">Order&nbsp;&#8595;</option>
                            <option value="Oza">Order&nbsp;&#8593;</option>
                        </select>
                    </div>
                    <div class="col-xs-8 col-md-3">
                        <div class="input-group">
                              <div class="input-group-btn">
                                <button type="button" class="btn btn-default dropdown-toggle" id="searchButton" data-toggle="dropdown">Search By: <span class="caret"></span></button>
                                <ul class="dropdown-menu" role="menu" id="searchType">
                                  <li><a href="#">Clear Search</a></li>
                                  <li><a href="#">Name</a></li>
                                  <li><a href="#">Email</a></li>
                                  <li><a href="#">Phone</a></li>
                                  <li><a href="#">Order</a></li>
                                  <li><a href="#">Package</a></li>
                                </ul>
                              </div><!-- /btn-group -->
                              <input type="text" id="searchField" class="form-control" placeholder="Choose Search field first">
                            </div><!-- /input-group -->
                    </div>
                </div>
              </div>
              <div class="row">
                  <div class="col-xs-12 col-md-6">
                      <select class="input-sm pickupList" data-role='none'></select>
                  </div>
                  <div class="col-xs-12 col-md-6">
                      <select class="input-sm packageList" data-role='none'></select>
                  </div>
              </div>
              <div class="row-fluid">
                <div class="col-xs-12 col-lg-12" id="content">
                  <!-- List goes here -->    
                </div>
              </div>
              <div class="row">
                  <div class="col-xs-2 col-xs-offset-5">
                      <h4><span class="listTotal"></span></h4>
                  </div>
              </div>
        </div>
        <!-- /#page-content-wrapper -->

    </div>
    <!-- /#wrapper -->
    <script src="js/lists.min.js"></script>
</body>

</html>