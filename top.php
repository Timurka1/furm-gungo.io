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

<section class="top-table"> <!-- top-table начало -->
		<table border="0">
			<tbody>                                                   
				<tr>
					<td><h6>МЕСТО</h6></td>
					<td><h6>ПРОФИЛЬ</h6></td>
			
					<td><h6>ПОБЕД</h6></td>
			
					<td><h6>СУММА БАНКОВ</h6></td>
				</tr>
									
								  <?php
$rs = mysql_query("SELECT * FROM `users` ORDER BY `won` DESC LIMIT 40");
$i = 1;
while($row = mysql_fetch_array($rs)) {
	
								if (empty($row["avatar"]))
{
	

}	
else
{
	echo '	
									<tr class="selector-profile" data-steamid="76561198166463410">
						<td><span>'.$i.'</span></td>
						<td><p>'.$row["name"].'</p></td>
				
						<td><p>'.$row["games"].'</p></td>
				
						<td><p>'.round($row["won"],2).'<span class="ezpz-price"></span></p></td>
					</tr>
				';
$i++;
}

}
?>
							</tbody>
		</table>
	</section>

	
	<?php include "footer.php"; ?>