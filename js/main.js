$(document).ready(function() {

    var timer = setInterval(function() {

        var date = new Date();

        $('#date').text(date.toDateString());
        $('#time').text(date.toLocaleTimeString());

    }, 500);

    /*  $(window).resize(function() {

          $('.item').css("height", Number(window.innerHeight - 1).toString() + "px !important");
      });*/

});