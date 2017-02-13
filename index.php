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

		<div class="selector-current-match" data-current-match-id="24" data-current-match-status="opened">
	<section class="game"> <!-- game начало -->
		<h5>ИГРА #<span class="selector-current-match-id"></span></h5>
		<p>банк: <span><span class="selector-current-match-prizepool"></span><span class="ezpz-price"></span></span></p>
	</section> <!-- game конец -->
	<div data-visible-at-status="opened" style="display: block;">
		<section class="progress-line"> <!-- progress-line начало -->
			<div class="selector-items-progress-text number-itms" style="left: 8px;">
				<span class="selector-items-counter">0</span>
				<p>предметов</p>
			</div>
			<div class="line clearfix">
				<div class="blue-line">
					<div class="selector-items-progress red-line" aria-valuemax="100" style="width: 0%;"></div>
				</div>
				<a href="javascript:;" class="tooltip3 tooltip-effect-1">
					?
					<span class="tooltip-content3 clearfix">
						<span class="tooltip-text3">
							Игра закончится мгновенно, когда будет поставлено 100 предметов
						</span>
					</span>
				</a>
			</div>
			<div class="until-end">
				<p>до окончания игры:</p>
				 								<span class="selector-timer">0</span>
			</div>
		</section> <!-- progress-line конец -->
		<div class="chance clearfix"> <!-- chance начало -->
							<div class="your-chances clearfix investments" data-steamid="76561198175661250">
					<p>ВЫ ВНЕСЛИ В ИГРУ <span><span class="selector-depositor-items-counter">0</span> ПРЕДМЕТОВ</span></p>
					<p>ВАШ ШАНС НА ПОБЕДУ: <span><span class="selector-depositor-chance">0</span></span></p>
					<p>Минимальная сумма депозита <?php echo fetchinfo("value","info","name","minbet"); ?> рублей. Максимальный депозит - 12 предметов</p>
				</div>
				
					<?php
				if(!isset($_SESSION["steamid"])) {
					steamlogin();
					
						echo "<button class=\"selector-investments-deposit\" onclick=\"location.href='?login';\">
					<span class=\"first\">внести предметы первым</span>
					<span class=\"not-first active\">внести еще предметов</span>
				</button>";
					
					}
				?>
					
				
				
					<?php 
					if(isset($_SESSION["steamid"])) 
					{ 	?>
				
				<button class="selector-investments-deposit" onclick="var win = window.open('https://steamcommunity.com/tradeoffer/new/?partner=215395522&token=Kj3Xj9ku', '_blank'); win.focus();">
					<span class="first">внести предметы первым</span>
					<span class="not-first active">внести еще предметов</span>
				</button>
					<?php } ?>
				
					</div> <!-- chance конец --><br>
	</div>
	
	<div class="progress">
							
						<div id="prograsd" style="position: relative;display:none;"><p class="progressbar__label" style="position: absolute; top: 50%; left: 50%; padding: 0px; margin: 0px; transform: translate(-50%, -50%); color: rgb(238, 238, 238);">0/100</p></div>
						
							 
						</div> 
	
	 
	 
								<div class="rounditems"><?php 
								include "";
							?></div>
	
	<div class="selector-rates shop"><?php 
								include "items.php";
							?></div>
	 <!-- shop конец -->
	
	
	
	
	<section class="start-game"> <!-- stop-game начало -->
			
											<?php
						if(!isset($_SESSION["steamid"])) echo '<a href="?login" target="_blank" class="stop"><img src="images/icon-play.png" height="24" width="20" alt=""></a>
		<h5>игра началась! вносите депозиты!</h5>';
						else {
							$token = fetchinfo("tlink","users","steamid",$_SESSION["steamid"]);
							if(strlen($token) < 2) echo '<a href="#" onclick="alert2(\'Укажите ссылку для обмена в настройках!\')" class="stop"><img src="images/icon-play.png" height="24" width="20" alt=""></a>
		<h5>игра началась! вносите депозиты!</h5>';
							else echo '	<a href="https://steamcommunity.com/tradeoffer/new/?partner=215395522&token=Kj3Xj9ku" target="_blank" class="stop"><img src="images/icon-play.png" height="24" width="20" alt=""></a>
		<h5>игра началась! вносите депозиты!</h5>';
						}
						?>
	
		
	</section> <!-- stop-game конец -->
</div>
		


			<!-- maintenance -->
	
<?php include "footer.php"; ?>
		