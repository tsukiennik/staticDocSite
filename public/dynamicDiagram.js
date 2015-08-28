var items = null;
$(function() {
    var metaKey = $("body").attr("key");
    alert(metaKey);
    $.getJSON( "./" + metaKey + '.json', function( data ) {
        items = data;
        var lessons = []
        $.each( data, function( key, val ) {
            lessons.push( "<h3><span>" + key + ". </span><a name='item" + key + "'></a><span>" + val.itemLabel.replace("{{index}}", key) + " - </span><a href='" + val.href.replace("{{index}}", key) + "'>see detail</a></h3><br/><br/><br/><br/><br/><br/><br/>" );
        });

        $( "<br/><br/><br/><br/>").appendTo( "#dynamic" );
        $( "<div/>", {
        "class": "itemlist",
        html: lessons.join( "" )
        }).appendTo( "#dynamic" );

        lessons = [];
        $.each( data, function( key, val ) {
            var link = val.href.replace("{{index}}", key);
            if ((link.indexOf("#") === 0) && ($(link).size() === 0)) {
                link = link.replace("#", "");
                lessons.push( "<h3><a id='" + link + "' name='" + link + "'></a> " + val.lessonLabel + "</h3><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>" );
            }
        });
        if (lessons.length > 0) {
            $( "<br/><br/><br/><br/>").appendTo( "#dynamic" );
            $( "<div/>", {
            "class": "itemlist",
            html: lessons.join( "" )
            }).appendTo( "#dynamic" );
        }
        setup();
    });
    function setup() {
        $('#svg-main').load("./" + metaKey + '.svg', null, function(data, status, xhr) {
            $('#svg-main').find('svg').attr("width", "100%");
            $('#svg-main').find('svg').attr("height", "100%");
            $('#svg-main').find('svg').click(function(event) {
                //alert(event.target);
            });
            $('#svg-main').find('ellipse').parent().each(function(step) {
                var id = $(this).find("tspan");
                if (id.size() === 1) {
                    var metadata = items[id.text()];
                    if (metadata) {
                        var tip = metadata.tip.replace("{{index}}", id.text());
                        this.setAttribute("title", tip);
                    }
                }
            });
           $('#svg-main').find('ellipse').parent().click(function(event) {
                event.stopPropagation();//fill: #f3f3f3
                var ellipse = $(this).find("ellipse");
                if (ellipse[0].style.fill === "rgb(243, 243, 243)") {
                    var id = $(this).find("tspan");
                    if (id.size() === 1) {
                        var metadata = items[id.text()];
                        if (metadata) {
                            var itemLabel = metadata.itemLabel.replace("{{index}}", id.text());
                            //alert("This will navigate to: " + itemLabel);
                            document.location = "#item" + id.text();
                        }
                    }
                }
            });

        });
    }
});

