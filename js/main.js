$(document).ready(function() {

    //==================== block =========================
    //     Language content initializing
    //====================================================
    var lng = (navigator.language || navigator.browserLanguage).substr(0, 2);

    switch (lng) {

        case "ru":
            $("#lang").attr("name", "russian");
            $("#lang").attr("src", "images/RU.png");
            break;
        case "de":
            $("#lang").attr("name", "german");
            $("#lang").attr("src", "images/DE.png");
            break;

        default:
            $("#lang").attr("name", "english");
            $("#lang").attr("src", "images/uk.png");

    };


    function reloadNavBar(lang) {

        nav_header.init(lang);
        $("#nav_about").text(nav_header.about());
        $("#nav_contact").text(nav_header.conctact());
        $("#nav_portfolio").text(nav_header.portfolio());
        $("#nav_pricing").text(nav_header.pricing());
        $("#nav_services").text(nav_header.services());



    };

    function reloadForm(jsontxt) {

        $("[placeholder]").each(function(i) {

            var v = $(this).attr("name") + "-placeholder";

            if (jsontxt == undefined) return;
            $(this).attr("placeholder", jsontxt[v]);

        });
    };
    //==================== block =========================
    //     Changing language content
    //====================================================
    var _langFactory = new langFactory();

    function reloadContent(lang) {


        reloadNavBar(lang);

        var jsonLang = _langFactory.getInstance(lang);

        $("[lang]").each(function(i) {

            if (jsonLang == undefined) return;
            var name = $(this).attr("name");

            var html = jsonLang[name];
            if (html == undefined) return;

            $(this).html(html);



            //*********************************************

            /*      if (this.lang != lang) {

                      var txt = $(this).html();

                      if (name == undefined || txt == undefined) {
                          return;
                      }

                      $.post("main.php", {
                              process: "file",
                              file: this.lang + ".json",
                              str: "{\"" + name + "\"" + " : " + "\"" + txt + "\"" + "},\r\n",
                          },
                          function(data, status) {
                              if (status != "success") {
                                  alert("Not OK -> " + data + " = " + status);
                              }
                          });
                  };*/

        });

        reloadForm(jsonLang);

    };

    //==================== block =========================
    //     Affix header
    //====================================================
    $(".navbar").affix({ offset: { top: $("header").outerHeight(true) } });

    $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 50
            }, 900, function() {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;

            });
        } // End if
    });

    //==================== block =========================
    //     Window scroll
    //====================================================
    $(window).scroll(function() {
        $(".slideanim").each(function() {
            var pos = $(this).offset().top;

            var winTop = $(window).scrollTop();
            if (pos < winTop + 600) {
                $(this).addClass("slide");
            }
        });
    });

    //==================== block =========================
    //     Window resizing
    //====================================================

    $(window).resize(function() {

        var width = Number($(this).width().toFixed());

        if (width <= 286) {

            $("#navHeader").hide();
        } else {
            $("#navHeader").show();

        }

        if (width <= 600) {

            initMap();

            $("#affix_hdr_l").hide();
            $("#affix_h3").hide();
        } else {
            $("#affix_hdr_l").show();
            $("#affix_h3").show();
        }
    });

    //==================== block =========================
    //     Content changing function
    //====================================================
    $(".dropdown-menu li").on("click", function(event) {

        if (this.hash == "") return;

        var lang = $("#lang").attr("name");

        switch (this.lang) {
            case "ru":
                if (lang == "russian") return;
                break;
            case "uk":
                if (lang == "english") return;
                break;
            case "de":
                if (lang == "german") return;
                break;
            default:
                break;
        };

        var obj = this.children[0].children[0];

        $("#lang").attr("name", obj.name);
        $("#lang").attr("src", obj.src);

        reloadContent(obj.name);

        _hideCollapseBar(this, event);

    });

    $(".navbar-nav li").on('click', function(event) {

        _hideCollapseBar(this, event);

    });

    function _hideCollapseBar(elem, event) {

        //alert($(elem).attr("class"));

        if ($(elem).attr("class") == "dropdown") return;

        event.preventDefault();

        var nb = $("#myNavbar");

        if (nb.attr("aria-expanded") == "true") {
            nb.attr("class", "navbar-collapse collapse");
        }
    };
    //==================== block =========================
    //     verify E-mail and Name inputs and send Message 
    //====================================================
    var timer = undefined;

    $("#submit").on("click", function() {

        var the_addr = $("#email").val();
        var the_name = $("#name").val();

        if (the_name == undefined || the_name == "") {
            showMessage($("#name"), "Name - value required!");
            return;
        }

        var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
        if (!pattern.test(the_addr)) {
            showMessage($("#email"), "Invalid email address!");
            return;
        }

        $.post("main.php", {
                process: "email",
                mail: the_addr,
                name: the_name,
                subj: $("#comments").val(),
            },
            function(data, status) {
                if (status != "success") {
                    alert("Not OK -> " + data + " = " + status);

                } else {
                    showMessage($("#comments"), "Сообщение успешно отправлено");
                }
                grecaptcha.reset();
                $("#submit").prop("disabled", true);
            });

        function showMessage(_$, message) {

            if (timer != undefined) return;

            _$.on("shown.bs.tooltip", function() {

                timer = setTimeout(function() {

                    clearTimeout(timer);
                    timer = undefined;

                    _$.tooltip('destroy');

                }, 5000);
            });

            var lang = $("#lang").attr("name");
            var jsonLang = _langFactory.getInstance(lang);

            if (jsonLang != undefined) {
                message = jsonLang[_$.attr("name") + "-tooltip"];
            }

            _$.tooltip({ title: message, placement: "bottom" });
            _$.tooltip('show');

        };
    });

    //==================== block =========================
    //     Goggle map initializing
    //====================================================
    function initMap() {

        var myCenter = new google.maps.LatLng(55.808508, 37.581345);

        var mapProp = {
            center: myCenter,
            zoom: 14,
            scrollwheel: false,
            draggable: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP

        };


        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        var marker = new google.maps.Marker({
            position: myCenter,
            title: 'JTRonic',
        });

        marker.setMap(map);
    };

    //==================== block =========================
    //     Main - Initilizing content
    //====================================================

    reloadContent($("#lang").attr("name"));

    initMap();

    $("#submit").prop("disabled", true);

    //====================================================

});


//==================== block =========================
//     Working with reCapture
//====================================================
var capVerify = function(response) {

    $.post("main.php", {
            process: "verify",
            question: response,
        },
        function(data, status) {
            if (status != "success") {
                alert("Not OK -> " + data + " = " + status);
                return;
            }

            data = JSON.parse(data);

            $("#submit").prop("disabled", !data.success);
        });

};

//==================== block =========================
//     Working with reCapture
//====================================================
var capExpired = function() {

    grecaptcha.reset();
    $("#submit").prop("disabled", true);
};

//==================== block =========================
//     Language factory
//====================================================

function langFactory() {
    this.lang = {
        russian: undefined,
        english: undefined,
        german: undefined,
    };
    this.getInstance = function(lang) {

        var x = this.lang[lang];
        if (x == undefined) {
            $.ajax({
                url: "js/" + lang + ".json",
                error: function(xhr, status, error) {
                    alert("Error -> " + error);
                },
                success: function(result, status, xhr) {
                    //alert("Res = " + JSON.stringify(result) + "Stat = " + status);
                    x = result;
                },
                async: false,
                dataType: "json",
            });

            this.lang[lang] = x;
        }

        return x;
    };
};