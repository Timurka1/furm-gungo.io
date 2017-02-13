<?php session_start();

@include_once('set.php');
if($_POST['message']){

  if(isset($_SESSION["steamid"])) {

    
require('steamauth/steamauth.php');

$msg = inputclean($_POST['message']);
$steamid = (int)$_SESSION["steamid"];
$admin = fetchinfo("admin","users","steamid",$steamid);
if($admin!=2){
$sql = "INSERT INTO `chat` (`id`, `text`, `steam_id`) VALUES (NULL, '$msg', '$steamid');";
mysql_query($sql);
}
}
}
else
{
   $sql = "SELECT * FROM  `chat` ORDER BY  `id` DESC LIMIT 0 , 20";
   $q = mysql_query($sql);
  
   $arr = array();
   $c = count($res);
   while( $res = mysql_fetch_array($q)) {
    $a = array();
    $a['steam_id'] = $res['steam_id'];
    $a['message'] = $res['text'];
    $id = (int)$res['steam_id'];
    $sql = "SELECT * FROM  `users` where `steamid` = '$id'";
    $ma = mysql_fetch_assoc(mysql_query($sql));
    $adm = (int)$ma['admin'];
    if($adm==1){
        
        $a['name'] = '<b style="color: red;">Администратор</b>';
        $a['avatar'] = 'http://www.nature.com/nature/journal/v420/n6916/images/420609b-i1.0.jpg';
        $arr[] = $a;
    }else{
        
    $a['name'] = $ma['name'];
    $a['avatar'] = $ma['avatar'];
    $arr[] = $a;
    }
    
   }
    
print_r(json_encode($arr));
}

?>