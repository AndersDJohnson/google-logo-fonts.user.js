// ==UserScript==
// @name         Google Logo Fonts
// @namespace    https://github.com/AndersDJohnson/
// @version      1.0.0
// @downloadURL  https://github.com/AndersDJohnson/google-logo-fonts.user.js/raw/master/src/js/google-logo-fonts.user.js
// @description  Switch Google's logo to random fonts from Google Fonts API.
// @author       Anders D. Johnson
// @copyright    2015+, Anders D. Johnson
// @match        https://www.google.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://raw.githubusercontent.com/typekit/webfontloader/master/webfontloader.js
// @grant        GM_xmlhttpRequest 
// ==/UserScript==

var randomIndex = function (array) {
    return Math.floor(array.length * Math.random());
};

var random = function(array) {
    return array[randomIndex(array)];
};

/**
 * http://worknotes.scripting.com/february2012/22612ByDw/listOfGoogleFonts
 * http://static.scripting.com/google/webFontNames.txt
 */
var getFonts = function () {
    return $.get('https://s3.amazonaws.com/static.scripting.com/google/webFontNames.txt')
    .then(function(data) {
        return data.split(/[\n\r]/);
    })
};

var loadFont = function (name) {
    var $link = $('<link>', {
        href: 'https://fonts.googleapis.com/css?family=' + name,
        rel: 'stylesheet',
        type: 'text/css'
    });

    $(document.body).append($link);
};

$(function () {
    var $logo = $('#hplogo');
    $logo.hide();

    var $par = $logo.parent();

    var $new = $('<div>');
    var colors = {
        blue: '#4285F4',
        red: '#EA4335',
        yellow: '#FBBC05',
        green: '#34A853'
    };
    var letterColors = ['blue','red','yellow','blue','green','red'];
    $.each('Google'.split(''), function (k, v) {
        var $s = $('<span>');
        $s.text(v);
        $s.css({color: colors[letterColors[k]]});
        $new.append($s);
    });
    $new.css({
        fontSize: 80,
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        bottom: 36
    });

    var activate = function () {
        $logo.replaceWith($new);
        $par.css({
            position: 'relative' 
        });
    };

    getFonts()
    .then(function (fonts) {
        var font = random(fonts);
        //console.log('font', font);

        WebFont.load({
            google: {
                families: [font]
            },
            active: function() {
                $new.css({fontFamily: font});
                activate();
            }
        });
    });

});
