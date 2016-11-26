$(document).ready(function() {

    var timer = setInterval(function() {

        var date = new Date();

        $('#date').text(date.toDateString());
        $('#time').text(date.toLocaleTimeString());

    }, 500);

});