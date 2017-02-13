var circle,bets=100500,timeleft=120,ms=1000;
var audioElement = document.createElement('audio');
audioElement.setAttribute('src', 'audio.mp3');
var audioElement2 = document.createElement('audio');
audioElement2.setAttribute('src', 'msg.mp3');
var audioElement3 = document.createElement('audio');
audioElement3.setAttribute('src', 'open.wav');
var ls=0;
var roulet=0;
var timerinterval;
window.onload = function onLoad() {
	circle = new ProgressBar.Circle('#prograsd', {
		color: '#3d9be4',
		strokeWidth: 12,
		easing: 'easeInOut',
		trailColor: "#0068c7"
	});
	circle.animate(1);
	timerinterval = setInterval("reloadinfo()",1000);
	setInterval("reloadtimer()",1000);
	setInterval("updatetimer()",1);
};

function alert2(txt,typet) {
	var n = noty({
		layout: 'bottomRight',
		text: txt,
		type: typet,
		timeout: 10000
	});
	audioElement.play();
}

function updatetimer() {
	var d = new Date();
	var n = 99-Math.round(d.getMilliseconds()/10);
	if(timeleft == 120) n = 0;
	if(n < 0) n = 0;
	if(timeleft <= 0) n = 0;
	if(timeleft < 0) timeleft = 0;
	if(n < 10) $('.selector-timer').text(timeleft);
	else $('.selector-timer').text(timeleft);
}

function reloadinfo() {
		$.ajax({
		type: "GET",
		url: "lastwinner.php",
		success: function(msg){
			$('.last-winner').html(msg);
		}
	});
	$.ajax({
		type: "GET",
		url: "currentgame.php",
		success: function(msg){
			$(".selector-current-match-id").text(""+msg);
		}
	});
	$.ajax({
		type: "GET",
		url: "currentchance.php",
		success: function(msg){
			$(".selector-depositor-chance").text(msg);
		}
	});
	$.ajax({ 
		type: "GET",
		url: "currentitems.php",
		success: function(msg){
			if(msg > 100) msg = 100;
			circle.animate(msg/100);
			$('.selector-items-counter').text(msg);
			$('.red-line').css('width', msg + "%");
		}
	});
	$.ajax({
		type: "GET",
		url: "currentbank.php",
		success: function(msg){
			$('.selector-current-match-prizepool').text(msg+'');
		}
 	});
	$.ajax({
		type: "GET",
		url: "items.php",
		success: function(msg){
			$('.selector-rates').html(msg);
		}
	});
		$.ajax({
		type: "GET",
		url: "online.php",
		success: function(msg){
			$('.online').html(msg);
		}
	});
	
}

function reloadtimer() {
 	$.ajax({
 		type: "GET",
 		url: "timeleft.php",
 		success: function(msg) {
 			timeleft = msg;
 		}
 	});
}