<?php
/**
 * OvR Lists - Functions and Definitions
 *
 * @package OvR Lists
 * @since Version 0.0.2
 */

# OvR Lists Version Number
$lists_version = "0.8.1";


# Form
if(isset($_SESSION['saved_table']) && $_SESSION['saved_table'])
    unset($_SESSION['saved_table']);
else
    $_SESSION['post_data'] = $_POST;

if(isset($_SESSION['post_data']['trip']))
    $list = new Trip_List($_SESSION['post_data']['trip']);
else
    $list = new Trip_List("None");

if(isset($_SESSION['post_data']['trip']) && isset($_SESSION['post_data']['csv_list'])){
    if($_SESSION['post_data']['csv_list'] == "csv_list")
        $list->csv("trip_list");
}

if(isset($_SESSION['post_data']['trip']) && isset($_SESSION['post_data']['csv_email'])){
    if($_SESSION['post_data']['csv_email'] == "csv_email")
        $list->csv("email_list");
}
function checkbox_helper($field){
  # Prints checked for selected checkboxes OR sets default checkboxes for new form
  if($field == "processing" || $field == "pending" || $field == "walk-on"){
      if(isset($_SESSION['post_data'][$field]) || !isset($_SESSION['post_data']['trip']))
        print ' checked';
  }
  elseif (isset($_SESSION['post_data'][$field]))
      print ' checked';
}
class Trip_List{
    var $db_connect;
    var $trip;
    var $select_options;
    var $orders;
    var $order_data;
    var $has_pickup;
    var $destinations;
    var $checkboxes;

    function __construct($selected_trip){
        # Connect to database
        require_once("config.php");
        $this->db_connect = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
        if($this->db_connect->connect_errno > 0){
            die('Unable to connect to database [' . $this->db_connect->connect_error . ']');
        }
        else{
          $this->db_connect->query("SET NAMES utf8");
          $this->db_connect->query("SET CHARACTER SET utf8");
          $this->db_connect->query("SET COLLATION_CONNECTION = 'utf8_unicode_ci'");
        }
        $this->destinations = array("Camelback MT","Hunter MT","Japan","Killington","MT Snow","Stowe","Stratton","Sugarbush","Whistler","Windham");
        $this->checkboxes = array("AM","PM","Waiver","Product","Bus","All_Area","Beg","BRD","SKI","LTS","LTR","Prog_Lesson");
        $this->trip = $selected_trip;
        $this->trip_options();
        if($selected_trip != "none"){
            $this->find_orders();
            if(count($this->orders) > 0 || count($this->order_data) > 0){
                $this->get_order_data();
              }
          }

    }
    function csv($type) {
        $sql = "SELECT `post_title` FROM `wp_posts`
                WHERE `ID` = '$this->trip'
                AND (`post_status` =  'publish' OR (`post_status` = 'draft' AND `comment_status` = 'closed'))
                AND `post_type` = 'product'";
        $result = $this->db_query($sql);
        $name = $result->fetch_assoc();
        $filename = $name['post_title'];
        if($type == "email_list")
            $filename .= "_EMAIL";
        $filename .= ".csv";

        header("Content-type: text/csv");  
        header("Cache-Control: no-store, no-cache");  
        header("Content-Disposition: attachment; filename=".$filename);
        $f = fopen('php://output', 'w');
        # start CSV with column labels
        if($type == "trip_list"){
            $labels = array("AM","PM","First","Last","Pickup","Phone","Package","Order","Waiver","Product REC.","Bus Only","All Area Lift","Beg. Lift","BRD Rental","Ski Rental","LTS","LTR","Prog. Lesson");
        }
        elseif($type == "email_list"){
            $labels = array("Email", "First","Last","Package","Pickup");
        }
        if(!$this->has_pickup)
          unset($labels["Pickup"]);
        
        fputcsv($f,$labels,',');
        foreach($this->order_data as $order => $array){
            foreach($array as $order_item_id => $field){
                $data = array();
                foreach($labels as $label){
                  if($label == "Order")
                      $value = $order;
                  elseif($label == "Phone")
                      $value = $field[$label];
                  elseif($label == "First" || $label == "Last" || $label == "Package" || $label == "Order")
                    $value = $field[$label];
                  elseif($label == "Pickup")
                    $value = $field['Pickup'];
                  elseif($label == "Email"){
                    if(isset($field['Email']))
                        $value = $field['Email'];
                    else
                        $value = "No Email";
                  }
                  elseif($label == "Product REC.")
                      $value = ($field['Product'] == "checked" ? "X":"");
                  elseif($label == "Bus Only")
                      $value = ($field['Bus'] == "checked" ? "X":"");
                  elseif($label == "All Area Lift")
                      $value = ($field['All_Area'] == "checked" ? "X":"");
                  elseif($label == "Beg. Lift")
                      $value = ($field['Beg'] == "checked" ? "X":"");
                  elseif($label == "BRD Rental")
                      $value = ($field['BRD'] == "checked" ? "X":"");
                  elseif($label == "Ski Rental")
                      $value = ($field['SKI'] == "checked" ? "X":"");
                  elseif($label == "Prog. Lesson")
                      $value = ($field['Prog_Lesson'] == "checked" ? "X":"");
                  else
                      $value = ($field[$label] == "checked" ? "X":"");
                  
                  array_push($data, $value);
                }
                fputcsv($f,$data,',');
            }
        }

        fclose($f);
        exit();
    }
    private function db_query($sql){
        if(!$result = $this->db_connect->query($sql))
            die('There was an error running the query [' . $this->db_connect->error . ']');
        else
          return $result;
    }
    private function trip_options(){
        # Find trips for the Select a Trip drop down
        $sql = "SELECT  `id` ,  `post_title`
                FROM  `wp_posts` 
                WHERE  (`post_status` =  'publish' OR (`post_status` = 'draft' AND `comment_status` = 'closed'))
                AND  `post_type` =  'product'
                AND  `post_title` NOT LIKE  '%High Five%'
                AND  `post_title` NOT LIKE  '%Gift%'
                AND   `post_title` NOT LIKE '%Beanie%'
                
                ORDER BY  `post_title`";
        $result = $this->db_query($sql);

        # Construct options for a select field
        $this->select_options['trip'] = '<option value="none"';
        if($this->trip == "none")
            $this->select_options['trip'] .= " selected ";
        $this->select_options['trip'] .= "> Select trip </option>\n";
        while($row = $result->fetch_assoc()){
            foreach($this->destinations as $value){
              if($value != "Stratton")
                  $regex = '/'.$value.'(.*)/i';
              else
                $regex = '/Stratturday\s(.*)/i';

              if(preg_match($regex,$row['post_title'],$match)){
                $class = $value;
                $label = $match[1];
              }
                  
            }
            $this->select_options['trip'] .= "<option class='".$class."' value='".$row['id']."'";
            if($this->trip == $row['id'])
                $this->select_options['trip'] .= " selected ";
            $this->select_options['trip'] .= ">".$label."</option>\n";
        }
        # Clean up
        $result->free();
        $this->select_options['destinations'] = '<option value="">Select a destination</option>';
        foreach($this->destinations as $destination){
          $this->select_options['destinations'].= '<option value="'.$destination.'" class="'.$destination.'"';
          if(isset($_SESSION['post_data']['destination']) && $_SESSION['post_data']['destination'] ==  $destination)
              $this->select_options['destinations'] .= ' selected';
          $this->select_options['destinations'].='>'.$destination.'</option>';
        }
    }
    private function find_orders(){
        # Conditional SQL for checkboxes on form
        $sql_conditional = "";
        $checkboxes = array("processing","pending","cancelled","failed","on-hold","completed",
                            "refunded","walk-on","balance-due","no-show");
        foreach($checkboxes as $field){
          if(isset($_SESSION['post_data'][$field])){
              if($field == "walk-on")
                  $this->get_saved_data();
              elseif($sql_conditional == "")
                  $sql_conditional .= "`wp_terms`.`name` = '$field'";
              else
                  $sql_conditional .= " OR `wp_terms`.`name` = '$field'";
          }
        }

        $sql = "SELECT `wp_posts`.`ID`, `wp_woocommerce_order_items`.`order_item_id`, `wp_terms`.`name`
            FROM `wp_posts`
            INNER JOIN `wp_woocommerce_order_items` ON `wp_posts`.`id` = `wp_woocommerce_order_items`.`order_id`
            INNER JOIN `wp_woocommerce_order_itemmeta` ON `wp_woocommerce_order_items`.`order_item_id` = `wp_woocommerce_order_itemmeta`.`order_item_id`
            INNER JOIN `wp_term_relationships` ON `wp_posts`.`id` = `wp_term_relationships`.`object_id`
            INNER JOIN `wp_terms` on `wp_term_relationships`.`term_taxonomy_id` = `wp_terms`.`term_id`
            WHERE `wp_posts`.`post_type` =  'shop_order'
            AND `wp_woocommerce_order_items`.`order_item_type` =  'line_item'
            AND `wp_woocommerce_order_itemmeta`.`meta_key` =  '_product_id'
            AND `wp_woocommerce_order_itemmeta`.`meta_value` =  '$this->trip'
            AND ($sql_conditional)";
        if($sql_conditional != ""){
            $result = $this->db_query($sql);
            $this->orders = array();
            while($row = $result->fetch_assoc()){
                $this->orders[$row['ID']][$row['order_item_id']] = $row['name'];
            }
            $result->free();
        }
    }
    private function get_order_data(){
      
        foreach((array)$this->orders as $order => $data){
            # Get phone number
            $sql = "SELECT  `meta_value` AS  `Phone`
                    FROM wp_postmeta
                    WHERE meta_key =  '_billing_phone'
                    AND post_id =  '$order'";
            $result = $this->db_query($sql);
            $row = $result->fetch_assoc();
            $phone = $row['Phone'];
            $result->free();

            foreach($data as $order_item_id => $status){
                $this->order_data[$order][$order_item_id]['Phone'] = $this->reformat_phone($phone);
                $sql = "SELECT `meta_key`, `meta_value` 
                        FROM `wp_woocommerce_order_itemmeta`
                        WHERE ( `meta_key` = 'Name'
                        OR `meta_key` = 'Email'
                        OR `meta_key` = 'Package'
                        OR `meta_key` = 'Pickup'
                        OR `meta_key` = 'Pickup Location')
                        AND `order_item_id` = '$order_item_id'";
                $result = $this->db_query($sql);

                while($row = $result->fetch_assoc()){
                    if($row['meta_key'] == 'Package')
                        $this->order_data[$order][$order_item_id]['Package'] = ucwords(strtolower($this->remove_package_price($row['meta_value'])));
                    elseif($row['meta_key'] == 'Pickup' || $row['meta_key'] == 'Pickup Location'){
                        $this->order_data[$order][$order_item_id]['Pickup'] = ucwords(strtolower($this->strip_time($row['meta_value'])));
                        $this->has_pickup = TRUE;
                    }
                    elseif($row['meta_key'] == 'Name'){
                        $names = $this->split_name($row['meta_value']);
                        $this->order_data[$order][$order_item_id]['First'] = stripcslashes(ucwords(strtolower($names['First'])));
                        $this->order_data[$order][$order_item_id]['Last'] = stripcslashes(ucwords(strtolower($names['Last'])));
                    }  
                    else
                        $this->order_data[$order][$order_item_id][$row['meta_key']] = trim($row['meta_value']);
                }
                $result->free();
                $this->get_checkbox_states($order,$order_item_id);
            }
        }
    }
    private function get_checkbox_states($order,$order_item_id){
        # Attempts to lookup set checkboxes from form in ovr_lists_checkboxes table
        $id = $order.":".$order_item_id;
        $sql = "SELECT `ID`, `value` FROM `ovr_lists_fields` WHERE `ID` LIKE CONCAT('$id','%')";
        $result = $this->db_query($sql);
        while ($row = $result->fetch_assoc()) {
          $label = explode(':',$row['ID']);
          $this->order_data[$order][$order_item_id][$label[2]] = ($row['value'] == 1 ? "checked" : "");
        }
        foreach($this->checkboxes as $field){
          #error_log($order.":".$order_item_id.":".$field);
          if (!isset($this->order_data[$order][$order_item_id][$field])){
            $this->order_data[$order][$order_item_id][$field] = "";
          }
        }
    }
    private function get_saved_data(){
        $sql = "SELECT  `ID` ,  `First` ,  `Last` ,  `Pickup` ,  `Phone` ,  `Package`
                FROM  `ovr_lists_manual_orders` 
                WHERE  `Trip` =  '$this->trip'";
        $result = $this->db_query($sql);
        while($row = $result->fetch_assoc()){
            
            $exploded_id = explode(":",$row['ID']);
            $order = $exploded_id[0];
            $order_item_id = $exploded_id[1];
            $this->order_data[$order][$order_item_id]['First'] = stripcslashes(ucwords(strtolower(trim($row['First']))));
            $this->order_data[$order][$order_item_id]['Last'] = stripcslashes(ucwords(strtolower(trim($row['Last']))));
            $this->order_data[$order][$order_item_id]['Pickup'] = stripcslashes(ucwords(strtolower(trim($row['Pickup']))));
            if (isset($row['Pickup']))
                $this->has_pickup = TRUE;
            $this->order_data[$order][$order_item_id]['Phone'] = $this->reformat_phone($row['Phone']);
            $this->order_data[$order][$order_item_id]['Package'] = stripcslashes(ucwords(strtolower(trim($row['Package']))));
            $this->get_checkbox_states($order,$order_item_id);
        }
    }
    private function split_name($name){
        $parts = explode(" ", $name);
        $last = array_pop($parts);
        $first = implode(" ", $parts);
        
        return array("First" => $first, "Last" => $last); 
    }
    private function reformat_phone($phone){
        
        # Strip all formatting
        $phone = str_replace('-','',$phone);
        $phone = str_replace('(','',$phone);
        $phone = str_replace(')','',$phone);
        $phone = str_replace(' ','',$phone);
        $phone = str_replace('.','',$phone);
        if(strlen($phone) == 11)
            $phone = substr($phone,1,10);
        # Add formatting to raw phone num
        $phone = substr_replace($phone,'(',0,0);
        $phone = substr_replace($phone,') ',4,0);
        $phone = substr_replace($phone,'-',9,0);
        
        return $phone;
    }
    private function strip_time($pickup){
      # Remove dash and time from pickup
      preg_match("/(.*).-.*/", $pickup, $matched);
      return $matched[1];
    }
    private function remove_package_price($package){
        return preg_replace('/\(\$\S*\)/', "", $package);
    }
}
?>
