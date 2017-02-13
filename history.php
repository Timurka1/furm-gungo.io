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

<?php include 'head.php';?>

<section class="history"> <!-- history начало -->
		

	
<?php
							$gamenum = fetchinfo("value","info","name","current_game");
							$rs = mysql_query("SELECT * FROM `games` WHERE `id` < $gamenum ORDER BY `id` DESC LIMIT 30");
							while($row = mysql_fetch_array($rs)) {
							$lastwinner = $row["userid"];
							$winnercost = $row["cost"];
							$winnerpercent = $row["percent"];
							$winneravatar = fetchinfo("avatar","users","steamid",$lastwinner);
							$winnername = fetchinfo("name","users","steamid",$lastwinner);
								if($admin == active) $admtext = "выигрыш ожидает отправки"; 
		else $admtext = "выигрыш отправлен";
							echo '	<article>
		<ul>
			<li><p>ИГРА: #'.$row["id"].'</p></li>
			<li><p>ПОБЕДИЛ ИГРОК: <a href="javascript:;" class="selector-profile">    '.$winnername.'</a> <span>(с шансом в '.round($winnerpercent,1).'%)</span></p></li>
			<li><p>ВЫИГРЫШ: <a>'.round($winnercost).'<span class="ezpz-price" style="color: #db073d;"></span></a></p></li>
					</ul>
									<span class="winning">'.$admtext.'</span>
						</article>';
	}
								?>


	

</section>

	
<?php include "footer.php"; ?>
		