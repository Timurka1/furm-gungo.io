 $(function() {  
     $("#msgsend").keyup(function(event){         
	     
          
          var message = $(this).val();
     if(message!=""&&event.keyCode == 13){
     $.ajax({
        type : "POST",
        data: {message:message},
        url : "chat.php",
        success: function(data){
         if(data == 0){
            // $(".result").html("<div class="alert alert-error">Ошибка при записи в чат!</div>");
         }else{
            
           //  $(".result").html("<div class="alert alert-success">Сообщение успешно добавлено!</div>");
             
             show();
             
  
         }   
        }}          
          );
           $(this).val("");
               chatScroll();
          }});
	  $("#sendmsg").click(function() {
     var message = $("#msgsend").val();
     if(message!=""){
     $.ajax({
        type : "POST",
        data: {message:message},
        url : "chat.php",
        success: function(data){
         if(data == 0){
            // $(".result").html("<div class="alert alert-error">Ошибка при записи в чат!</div>");
         }else{
         //    $(".message").val('');
           //  $(".result").html("<div class="alert alert-success">Сообщение успешно добавлено!</div>");
              
             show();
             
  
         }   
        }
     });
     chatScroll();
     $("#msgsend").val("");
     }
});
	  $(".closech").click(function() {
	  	if(close)
	  		$(".closech").text('↑');
	  	else $(".closech").text('↓');

  		close = !close;

	    $('.chat> .body').slideToggle();
	    $('.chat').css('height', 'auto');
	    $('.chat> .footer').slideToggle();
	  });
	});
    
    function chatScroll() {
	  var $t = $('.chat> .body');
	  $t.animate({"scrollTop": $t[0].scrollHeight}, 0);
	}

 	$('.chat> .body').slideToggle();
    $('.chat').css('height', 'auto');
    $('.chat> .footer').slideToggle();
    $(".closech").text('↑');

function show(){
    chatScroll();
    var Result = "";
    $.ajax({
        url: "chat.php",
        cache: false,
        success: function(ResultData){
           
             ResultData = JSON.parse(ResultData);
            
           
       for(i=ResultData.length-1; i>=0; i--){
      console.log(ResultData.length);     		
          Result += "<li><div class='thumbnail' style='float: left;'><img src='"+ResultData[i].avatar+"'></div><div class='content' style='width: 200px;'><h3 style='display: block; width: 100%; margin-bottom: 5px; color: #808080;'>"+ResultData[i].name+ "</h3><span class='preview'>" +ResultData[i].message+ "</span>";
	  } 
      $(".block-msgs").html(Result); 
        } 
    });
}
$(document).ready(function(){
    
  setInterval(function() {
    show();
},1000);
  // SetInterval(show(),2000);
  //Сообщения

});