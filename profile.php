<?php
@include_once "langdoc.php";
if(!isset($_COOKIE['lang'])) {
	setcookie("lang","ru",2147485547);
	$lang = "ru";
} else $lang = $_COOKIE["lang"];
$sitename = "EzySkins - проверь свою удачу!";
$title = "$sitename";
@include_once('set.php');
require('steamauth/steamauth.php');
	if(isset($_SESSION["steamid"])) {
include_once('steamauth/userInfo.php');}
?>
		<?php
				if(!isset($_SESSION["steamid"])) {
					steamlogin();
						Header("Location: index.php");
					
					}
				?>
				
<?php 
if(isset($_SESSION["steamid"])) 
{ 	?>

<?php include 'head.php';?>
	<link rel="stylesheet" href="css/profile.css">
<div class="history_game">

										
					<ul>
						
						<div style="float: left;">
							<img src="<?php echo $steamprofile['avatarfull'];  ?>" style=" width: 184px; height: 184px; ">
							<div style="background: #FF5346; font: 500 16px/18px 'Roboto', sans-serif; margin: 5px 0; padding: 6px 10px; text-align: center;">
								<a href="<?php echo$steamprofile['profileurl'] = $_SESSION['steam_profileurl'];  ?>" style="color: white; text-decoration: none;" target="_blank">Профиль Steam</a>
							</div>
						</div>

						<div style="float: left; width: 300px; margin-left: 15px;">
							<div style="background:#FF5346; font: 500 16px/18px 'Roboto', sans-serif; padding: 10px 10px;color: #eee">
							<?php echo $steamprofile['personaname'];  ?> 
							</div>
				
							
		
							<div style="background: #FF5346;  margin: 5px 0; padding: 10px 10px;color: #eee">
								Выиграно: <?php echo fetchinfo("won","users","steamid",$_SESSION["steamid"]); ?>  <i class="fa fa-rub fa-1"></i>
							</div>
							<div style="background: #FF5346;  margin: 5px 0; padding: 11px 10px; color: #eee">
								Количество игр: <?php echo fetchinfo("games","users","steamid",$_SESSION["steamid"]); ?>
							</div>
						
							

					
						</div>

						<div style="margin-left: 80px; margin-top: 60px; display: inline-block; width: 200px;">
							<div id="rang"></div>
						</div>
						

						
						
									        </ul>

					
										

					</div>

<?php } ?>