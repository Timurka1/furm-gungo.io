
<html lang="ru-RU" class="ezpz-layout -webkit-"><head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="SHORTCUT ICON" href="favicon.ico">
	<title>EzySkins | Игровой онлайн-розыгрыш</title>
	
	
	<!-- Scripts -->
		<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script type="text/javascript" src="/js/noty/packaged/jquery.noty.packaged.min.js"></script>
	<script src="/js/progressbar.js"></script>

	<script src="/bower_components/magnific-popup/dist/jquery.magnific-popup.min.js"></script>
	<script src="/bower_components/prefixfree/prefixfree.min.js"></script>
	<script src="/bower_components/blueimp-md5/js/md5.min.js"></script>
	<script src="/components/placeholder.jquery.js"></script>
	<script src="/js/jquery.autoellipsis-1.0.10.min.js"></script>
	<script src="/js/app.js?1436364671"></script>

		<script src="/js/main.js"></script>
	
					<link href="/css/chat.css" rel="stylesheet">
			<link href="/bower_components/magnific-popup/dist/magnific-popup.css" rel="stylesheet">
	<link href="/bower_components/jquery.scrollbar/jquery.scrollbar.css" rel="stylesheet">
	<link href="/css/app.css?1436274851" rel="stylesheet">

</head>

<div class="chat" style="height: auto; z-index: 500;">
  <header>
    <h2 class="title"><a>ЧАТ</a></h2>
  
</div>

<?php 
							$lastgame = fetchinfo("value","info","name","current_game");
							$lastwinner = fetchinfo("userid","games","id",$lastgame-1);
							$winnercost = fetchinfo("cost","games","id",$lastgame-1);
							$winnerpercent = round(fetchinfo("percent","games","id",$lastgame-1),1);
							$winneravatar = fetchinfo("avatar","users","steamid",$lastwinner);
							$winnername = fetchinfo("name","users","steamid",$lastwinner);
						?>
						
<body class="ezpz-currency-ru">


	<div class="wrapper"> <!-- wrapper начало -->
		<header class="header"> <!-- header начало -->
			<div class="header-inside clearfix">
				<a href="/" class="logo"><img src="/newimages/icon-logo.png" height="45" width="215" alt=""></a>
				<ul class="clearfix">                        
					<li><a href="/">ГЛАВНАЯ</a></li>
					<li><a href=".support" class="popup">ПОДДЕРЖКА</a></li>
					<li><a href="/about">О САЙТЕ</a></li>
				</ul>
				<ul class="clearfix">                                                
					<li><a href="/history">ИСТОРИЯ ИГР</a></li>
					<li><a href="http://vk.com/EzySkinsru" target="_blank">ГРУППА ВК</a></li>
					<li><a href="/top">ТОП</a></li>
				</ul>
			</div>
		</header> <!-- header конец -->
		<section class="after-header"> <!-- after-header начало -->
			<section class="after-header-language"></section>
			<section class="after-header-inside"> <!-- after-header-inside начало -->
				<article class="item clearfix">
					<ul class="stat clearfix">            
						<li>
							<h6 class="selector-online-users"><?php include 'online.php';?></h6>
							<p>человек онлайн</p>
						</li>
						<li>
							<h6 class="selector-stat-today-matches"><?php
											$result = mysql_query("SELECT id FROM games WHERE `starttime` > ".(time()-86400));
											echo mysql_num_rows($result);
										?></h6>
							<p>игр сегодня</p>
						</li>
						<li>
							<h6 class="selector-stat-today-players"><?php
									$result = mysql_query("SELECT SUM(itemsnum) AS itemsnum FROM games WHERE `starttime` > ".(time()-86400));
									$row = mysql_fetch_assoc($result);
									echo $row["itemsnum"];
									?></h6>
							<p>вещей разыграно</p>
						</li>
						<li>
							<h6 class="selector-stat-max-sum">12362.9<span class="ezpz-price"></span></h6>
							<p>макс. выигрыш</p>
						</li>
					</ul>
					
						<?php
				if(!isset($_SESSION["steamid"])) {
					steamlogin();
				
									echo '<a class="ezpz-login" href="?login">Авторизоваться для начала игры</a>';
				} else {
					
					echo "";
					mysql_query("UPDATE users SET name='".$steamprofile['personaname']."', avatar='".$steamprofile['avatarfull']."' WHERE steamid='".$_SESSION["steamid"]."'");
				}
				?>
					
				
					
							<?php 
					if(isset($_SESSION["steamid"])) 
					{ 	?>
											<article class="jfrs clearfix">
							<a href="javascript:;" class="ezpz-profile-update selector-profile-update"><img src="<?php echo $steamprofile['avatarfull'];  ?>" height="74" width="74" alt=""></a>
							<p><span class="selector-profile-steampersonaname"><?php echo $steamprofile['personaname'];  ?></span> <a href="steamauth/logout.php">ВЫЙТИ</a></p>
							<ul class="clearfix">
								<li><a href="/profile" class="selector-profile">Профиль</a></li>
								<li><a href="/my-history">Моя История</a></li>
								<li><a href="/inventory">Инвентарь</a></li>
							</ul>
						</article>
						
							
							
						
						<div class="buy">
							<p>Добавь в свой ник и получи -5% комиссии!</p>
							<h6>EzySkins.ru</h6>
						</div>

							<form method="POST" action="./updatelink.php">
						<input type="text" id="link"  name="link"   class="main-link" value="<?php echo fetchinfo("tlink","users","steamid",$_SESSION["steamid"]); ?>" placeholder="Вставьте ссылку на обмен ..." data-success-message="Ссылка на обмен успешно сохранена">
						<button type="submit" class="main-link-check"></button></form>
						<!--<a href="javascript:;" class="main-link" data-token="PveqRKmpR2k6N496VTr56rhwF5HI9jwQgjGnCyVS">/my-history</a>-->
									</article>	<?php } ?>
			</section> <!-- after-header-inside конец -->
		</section> <!-- after-header конец -->