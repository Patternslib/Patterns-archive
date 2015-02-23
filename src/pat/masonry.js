/**
 * Patternslib pattern for Masonry
 * Copyright 2015 Syslab.com GmBH
 */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "jquery",
            "pat-registry",
            "pat-parser",
            "masonry",
            "imagesloaded"
            ], function() {
                return factory.apply(this, arguments);
        });
    } else {
        factory(root.$, root.patterns, root.patterns.Parser, root.Masonry, root.imagesLoaded);
    }
}(this, function($, registry, Parser, Masonry, imagesLoaded) {
    "use strict";
    var parser = new Parser("masonry");
    parser.add_argument("column-width");
    parser.add_argument("container-style", "{ position: 'relative' }");
    parser.add_argument("gutter");
    parser.add_argument("hidden-style", "{ opacity: 0, transform: 'scale(0.001)' }");
    parser.add_argument("is-fit-width", false);
    parser.add_argument("is-origin-left", true);
    parser.add_argument("is-origin-top", true);
    parser.add_argument("item-selector", ".item");
    parser.add_argument("stamp", "");
    parser.add_argument("transition-duration", "0.4s");
    parser.add_argument("visible-style", "{ opacity: 1, transform: 'scale(1)' }");

    var masonry = {
        name: "masonry",
        trigger: ".pat-masonry",
        init: function mypattern_init($el, opts) {
            var options = parser.parse($el, opts);
            $(document).trigger('clear-imagesloaded-cache');
            var msnry = new Masonry($el[0], {
                columnWidth:            this.getTypeCastedValue(options.columnWidth),
                containerStyle:         options.containerStyle,
                gutter:                 this.getTypeCastedValue(options.gutter),
                hiddenStyle:            options.hiddenStyle,
                isFitWidth:             options.is["fit-width"],
                isInitLayout:           false,
                isOriginLeft:           options.is["origin-left"],
                isOriginTOp:            options.is["origin-top"],
                itemSelector:           options.itemSelector,
                stamp:                  options.stamp,
                transitionDuration:     options.transitionDuration,
                visibleStyle:           options.visibleStyle
            });
            imagesLoaded(this, this.layout($el, msnry, options));
        },

        layout: function ($el, msnry, options) {
            $el.removeClass('masonry-ready');
            msnry.on('layoutComplete', function() { 
                $el.addClass('masonry-ready');
            });
            msnry.layout();
        },

        getTypeCastedValue: function (original) {
            var val = Number(original);
            return (isNaN(val)) ? (original || 0) : val;
        }
    };
    registry.register(masonry);
    return masonry;
}));
