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

# Start Session Validation
session_start();

# Include Functions
require_once("includes/lists.php");

# Session Validation - Is User logged in?
# else redirect to login page
if (!(isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] != ''))
  header ("Location: login/index.php");

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>OvR Trip Lists</title>

    <!-- Mobile view properties & enable iOS Web App-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>

    <!-- favicon and apple-touch-icon -->
    <link rel="apple-touch-icon" href="assets/images/touch-icon-iphone.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="assets/images/touch-icon-ipad.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="assets/images/touch-icon-iphone-retina.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="assets/images/touch-icon-ipad-retina.png" />
    <link rel="icon" type="image/png" href="http://ovrride.com/favicon.ico">

    <!-- Include compiled and minified stylesheets -->
    <link rel="stylesheet" href="assets/stylesheets/all.css">
    <!-- Include tablesorter styles -->
    <link rel="stylesheet" href="assets/tablesorter/css/theme.bootstrap.css">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>

    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand logo-nav" href="/">OvR Trip Lists</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav nav-puller">
            <li><a href="http://ovrride.com" target="_blank">Ovrride.com</a></li>
            <li><a href="https://ovrride.com/sop/" target="_blank">SOP</a></li>
            <li class="disabled"><a href="#settings">Settings</a></li>
            <li><a href="login/register.php">Create New User</a></li>
            <li><a href="login/logout.php">Logout</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div><!-- /.container -->
    </nav>

    <div class="container">

    <form action="index.php" method="post" name="trip_list" id="trip_list">
      <section class="trip-select">
          <label>Select a Trip:</label>
          <br>

          <select class="form-control input-sm" id="trip" name="trip" id="trip">
          <?php echo $list->select_options; ?>
          </select>
      </section>
      <br>

      <section class="order-status-select input-group">
          <label>Order Status: </label>
          <a onclick="javascript:checkAll('trip_list', true);" href="javascript:void();"> Check All</a> &#47;
          <a onclick="javascript:checkAll('trip_list', false);" href="javascript:void();">Uncheck All</a>
          <br>
          <label class="checkbox order-checkbox">
            <input type="checkbox" class="order_status_checkbox" name="processing" value="processing" <?php if(isset($_SESSION['post_data']['processing']) || !isset($_SESSION['post_data']['trip'])) echo 'checked';?>>Processing</input>
          </label>
          <label class="checkbox order-checkbox">
            <input type="checkbox" class="order_status_checkbox" name="pending" value="pending" <?php if(isset($_SESSION['post_data']['pending']) || !isset($_SESSION['post_data']['trip'])) echo 'checked'; ?>>Pending</input>
          </label>
          <label class="checkbox order-checkbox">
            <input type="checkbox" class="order_status_checkbox" name="cancelled" value="cancelled" <?php if(isset($_SESSION['post_data']['cancelled'])) echo 'checked'; ?>>Cancelled</input>
          </label>
          <label class="checkbox order-checkbox">
            <input type="checkbox" class="order_status_checkbox" name="failed" value="failed" <?php if(isset($_SESSION['post_data']['failed'])) echo 'checked'; ?>>Failed</input>
          </label>
          <label class="checkbox order-checkbox">
            <input type="checkbox" class="order_status_checkbox" name="on-hold" value="on-hold" <?php if(isset($_SESSION['post_data']['on-hold'])) echo 'checked'; ?>>On-hold</input>
          </label>
          <label class="checkbox order-checkbox">
            <input type="checkbox" class="order_status_checkbox" name="completed" value="completed" <?php if(isset($_SESSION['post_data']['completed'])) echo 'checked'; ?>>Completed</input>
          </label>
          <label class="checkbox order-checkbox">
            <input type="checkbox" class="order_status_checkbox" name="refunded" value="refunded" <?php if(isset($_SESSION['post_data']['refunded'])) echo 'checked'; ?>>Refunded</input>
          </label>
          <br>
          <input type="submit" class="btn btn-primary generate-list" value="Generate List" /> 

          <button type="button" onclick="location.href='/';" class="btn btn-primary generate-list">Clear Form</button>

          <?php if(isset($_SESSION['post_data']['trip']) && $_SESSION['post_data']['trip'] != "none"){ ?>
            <button type="button" class="reset btn btn-warning generate-list">Reset Table Filters </button>
          <?php } ?>
      </section>
      <br>

      </div><!-- /.container -->

      <!-- Output of the Trip List Table -->
      <?php if(isset($_SESSION['post_data']['trip']) && $_SESSION['post_data']['trip'] != "none"){ 
          print $list->html_table;
      } ?>
      <nav class="navbar navbar-inverse navbar-fixed-bottom" role="navigation">
        <div class="container">
          <div class="row">
            <div class="col-md-3 text-center">
              <h5>Version <?php echo $lists_version ?></h5>
              <h5><span class="text-danger">For OvR Staff Use Only</span></h5>
            </div>
            <div class="col-md-6 text-center">
            <?php if(isset($_SESSION['post_data']['trip']) && $_SESSION['post_data']['trip'] != "none"){ ?>
              <form>
                <button type="submit" class="btn btn-info footer-btn" id="csv_list" name="csv_list" value="csv_list">Generate List CSV</button>
                <button type="submit" class="btn btn-info footer-btn" id="csv_email" name="csv_email" value="csv_email">Generate Email CSV</button>
                <button type="button" class="btn btn-success footer-btn" id="save_form" name="save_form" onclick="javascript:tableToForm();">Save</button>
              </form>
              <?php } ?>
              </form>
            </div>
            <div class="col-md-2 text-center">
              <h5>&copy; Copyright <?php echo date('Y'); ?></h5> <h5><a href="/">OvR ride LLC.</a></h5>
            </div>
      </nav>
      <!-- Include concatenated and minified javascripts -->
      <script src="assets/javascripts/all.min.js"></script>
  </body>
</html>