<?php
@include_once "langdoc.php";
if(!isset($_COOKIE['lang'])) {
	setcookie("lang","ru",2147485547);
	$lang = "ru";
} else $lang = $_COOKIE["lang"];
$sitename = "EzySkins - проверь свою удачу!";
$title = "$sitename - TOP10";
@include_once('set.php');
@include_once('steamauth/steamauth.php');
if(!isset($_SESSION["steamid"])) {
	Header("Location: index.php");
	exit;
}
@include_once('steamauth/userInfo.php');
?>
<?php include 'head.php';?>
				<div class="content">
				
				<div class="settings">
        <div class="settings-top">
            <div class="settings-title">Настройки</div>
        </div>
        <div class="settings-content">
                 
                <fieldset class="fieldset-profile">
					
                    <h4>Настройки профиля</h4>
                    <div class="form-line first">
                        <div class="wrap-label">
                            <label for="par2">Ссылка на обмен в Steam:</label>
                        </div>
						<form method="POST" action="./updatelink.php">
                        <div class="form-inner">
                            <div class="form-line">
                                <div class="wrap-input">
                                    <input type="text" id="link"  name="link"  value="<?php echo fetchinfo("tlink","users","steamid",$_SESSION["steamid"]); ?>" placeholder="Например: https://steamcommunity.com/tradeoffer/new/?partner=226107091&amp;token=pWn1337k">
                                </div>
                            </div>
                            <p><a class="trade-link" href="http://steamcommunity.com/id/id/tradeoffers/privacy#trade_offer_access_url" target="_blank">Где взять ссылку?</a></p>
                            <p><strong>Обязательно <a href="http://steamcommunity.com/id/id/edit/settings" target="_blank" class="">откройте инвентарь</a> в Steam для получения приза! </strong></p>
                        </div>
                    </div>
                    
                    <div class="buttons">
                      <input type="submit" class="btn-yellow" style="
    cursor: pointer;
"  value="Сохранить настройки"></span>
                    
                    </div>
				</form>
                </fieldset>
        </div>
    </div>	
				
				</div>
</body>
</html>