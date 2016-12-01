$(document).ready(function() {

    setInterval(function() {

        var date = new Date();

        $('#date').text(date.toDateString());
        $('#time').text(date.toLocaleTimeString());

    }, 500);


    var timer = undefined;

    $('#date').hover(function() {

            _$ = $('#header');

            _$.tooltip({
                title: '<h1><span class="glyphicon  glyphicon-calendar"></span> ' + this.outerHTML + '</h1>',
                html: true,
                placement: 'top',
            });
            _$.tooltip('show');

        },
        function() {
            $('#header').tooltip('destroy');

        });

    $('#time').hover(function() {

            _$ = $('#header');

            _$.tooltip({
                title: '<h1><span class="glyphicon  glyphicon-time"><br/></span> ' + this.outerHTML + '</h1>',
                html: true,
                placement: 'top',
            });
            _$.tooltip('show');

        },
        function() {
            $('#header').tooltip('destroy');
        });

});