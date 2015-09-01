var items = null;
var metaKey = null;
$(function() {
    metaKey = getQueryVariable("pageID"); //$("body").attr("key");
    if (!metaKey) {
        return;
    }
    $.getJSON( "assets/" + metaKey + "/" + metaKey + '.json', function( data ) {
        if (data.title) {
            document.title = data.title;
            $(".docTitle").text(data.title);
        }
        items = data.topics;
        var lessons = []
        $.each( items, function( key, val ) {
            link = "<div class='table'>"
            link += "<div classs='bulletCell'><div class='numericBullet'>" + key + "</div></div><div class='tableCell'>&nbsp;&nbsp;</div>";
            link += "<div class='tableCell'><h3><a name='item" + key + "'></a><span>" + val.itemLabel.replace("{{index}}", key) + "</span></h3>";
            if (val.summary) {
                link += "<p>" + val.summary + "</p>"
            }
            if (val.references) {
                link += "<div><p class='bold'>References:</p>"
                $.each(val.references, function (key, reference) {
                    link += "<p><a href='" + reference.link + "'>"  + reference.text + "</a></p>";
                });
                link += "</div><br/>"
            }
            if (val.detail) {
                link += "<div>"
                link += "<p class='bold'><a href='" + val.detail.replace("{{index}}", key) + "'>Detailed discussion of this topic</a></p>";
                link += "</div>"
            }
            link += "<br/><br/><br/>";
            link += "</div></div>";
            lessons.push(link);
        });

        $( "<br/><br/><br/>").appendTo( "#dynamic" );
        $( "<div/>", {
        "class": "itemlist",
        html: lessons.join( "" )
        }).appendTo( "#dynamic" );

        $( "<hr/>").appendTo( "#dynamic" );

        lessons = [];
        var itemKeys = [];
        $.each( items, function( key, val ) {
            itemKeys.push(key);
        });

        function processNextDetail(index) {
            index++;
            if (index < itemKeys.length) {
                processDetail(index);
            }
            else {
                if (lessons.length > 0) {
                    $( "<br/><br/><br/><br/>").appendTo( "#dynamic" );
                    $( "<div/>", {
                    "class": "itemlist",
                    html: lessons.join( "" ) + "</div>"
                    }).appendTo( "#dynamic" );
                }
                setup();
            }
        }

        function processDetail(index) {
            var val = items[itemKeys[index]];
            var key = itemKeys[index];

            function wrapUp(link) {
                if (val.references) {
                    link += "<div><p class='bold'>References:</p>"
                    $.each(val.references, function (key, reference) {
                        link += "<p><a href='" + reference.link + "'>"  + reference.text + "</a></p>";
                    });
                    link += "</div><br/>"
                }
                link += "<div>"
                link += "<p class='bold'><a href='#top'>Back to Top</a></p>";
                link += "</div>"
                link += "<br/><br/><br/><br/>";
                link += "</div></div>"
                lessons.push(link);
                processNextDetail(index);
            }

            if (val.detail) {
                var link = val.detail.replace("{{index}}", key);
                if ((link.indexOf("#") === 0) && ($(link).size() === 0)) {
                    var href = link.replace("#", "");
                    link = "<div class='table'>"
                    link += "<div classs='bulletCell'><div class='numericBullet'>" + key + "</div></div><div class='tableCell'>&nbsp;&nbsp;</div>";
                    link += "<div class='tableCell'><h3><a id='" + href + "' name='" + href + "'></a> " + val.detailLabel + "</h3>";
                    if (val.detailMarkup) {
                        $.get( val.detailMarkup, function( data ) {
                            while (data.indexOf("<pre><code>") >= 0) {
                                data = data.replace("<pre><code>", "<pre>");
                            }
                            while (data.indexOf("</code></pre>") >= 0) {
                                data = data.replace("</code></pre>", "</pre>");
                            }
                            link += data;
                            wrapUp(link);
                        });
                    }
                    else {
                        wrapUp(link);
                    }
                }
                else {
                    processNextDetail(index);
                }
            }
        }

        processDetail(0);

    });
    function setup() {
        $('#svg-main').load("assets/" + metaKey + "/" + metaKey + '.svg', null, function(data, status, xhr) {
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
                var ellipse = $(this).find("ellipse");
                if (ellipse[0].style.fill === "rgb(243, 243, 243)") {
                    var id = $(this).find("tspan");
                    if (id.size() === 1) {
                        var metadata = items[id.text()];
                        if (metadata) {
                            var tip = metadata.tip.replace("{{index}}", id.text());
                            this.setAttribute("title", tip);
                        }
                    }
                    $(this).click(clickStepIcon);
                    $(this).mouseenter(mouseenterStepIcon);
                    $(this).mouseleave(mouseleaveStepIcon);
                    $(this).css("cursor", "pointer");
                    activeSteps.push({ shape: ellipse[0], tip: items[id.text()].tip });
                }
            });

            function clickStepIcon(event) {
                event.stopPropagation();
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
                function highlightStep(index) {
                    lastHighlightedStep = activeSteps[index].shape;
                    lastHighlightedStep.style.fill = "rgb(120, 255, 120)";
                    $("#step-tip").html("<h4>" + activeSteps[index].tip + "</h4>");
                }

                stepIndex = 0;
                highlightStep(stepIndex);
                setInterval(function() {
                    if (!bStepHovered) {
                        if (lastHighlightedStep) {
                            lastHighlightedStep.style.fill = "rgb(243, 243, 243)";
                        }
                        stepIndex++;
                        if (stepIndex === activeSteps.length) {
                            stepIndex = 0;
                        }
                        highlightStep(stepIndex);
                    }
                }, 3000);

            }

        });
    }
});

function getQueryVariable(variable) {
    var query = document.location.href.split("?");
    if (query.length === 1) {
        return;
    }
    var vars = query[1].split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            pair = pair[1].split("#");
            return decodeURIComponent(pair[0]);
        }
    }
    console.log('Query variable %s not found', variable);
}
