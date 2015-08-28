var items = null;
$(function() {
    var metaKey = $("body").attr("key");
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
            var activeSteps = [];
            var lastHighlightedStep = null;
            var stepIndex = -1;
            var bStepHovered = false;
            $('#svg-main').find('ellipse').parent().each(function(step) {
                var id = $(this).find("tspan");
                if (id.size() === 1) {
                    var metadata = items[id.text()];
                    if (metadata) {
                        var tip = metadata.tip.replace("{{index}}", id.text());
                        this.setAttribute("title", tip);
                    }
                }
                var ellipse = $(this).find("ellipse");
                if (ellipse[0].style.fill === "rgb(243, 243, 243)") {
                    $(this).click(clickStepIcon);
                    $(this).mouseenter(mouseenterStepIcon);
                    $(this).mouseleave(mouseleaveStepIcon);
                    activeSteps.push({ shape: ellipse[0], tip: items[id.text()].tip });
                }
            });

            function clickStepIcon(event) {
                event.stopPropagation();//fill: #f3f3f3
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

            function mouseenterStepIcon(event) {
                event.stopPropagation();
                var id = $(this).find("tspan");
                if (id.size() === 1) {
                    bStepHovered = true;
                    if (lastHighlightedStep) {
                        lastHighlightedStep.style.fill = "rgb(243, 243, 243)";
                    }
                    var ellipse = $(this).find("ellipse");
                    ellipse[0].style.fill = "rgb(120, 255, 120)";
                    $("#step-tip").html("<h4>" + items[id.text()].tip + "</h4>");
                    lastHighlightedStep = ellipse[0];
                }
            }

            function mouseleaveStepIcon(event) {
                event.stopPropagation();
                bStepHovered = false;
            }

            if (activeSteps.length > 0) {
                setInterval(function() {
                    if (!bStepHovered) {
                        if (lastHighlightedStep) {
                            lastHighlightedStep.style.fill = "rgb(243, 243, 243)";
                        }
                        stepIndex++;
                        if (stepIndex === activeSteps.length) {
                            stepIndex = 0;
                        }
                        lastHighlightedStep = activeSteps[stepIndex].shape;
                        lastHighlightedStep.style.fill = "rgb(120, 255, 120)";
                        $("#step-tip").html("<h4>" + activeSteps[stepIndex].tip + "</h4>");
                    }
                }, 3000);
            }

        });
    }
});

