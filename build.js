({
    baseUrl: "src",
    out: "bundle.js",
    name: "almond",
    include: "patterns",

    wrap: {
        endFile: "src/wrap-end.js"
    },

    paths: {
        // Externals
        "Markdown.Converter":          "legacy/Markdown.Converter",
        "Markdown.Extra":              "legacy/Markdown.Extra",
        "Markdown.Sanitizer":          "legacy/Markdown.Sanitizer",
        "almond":                      "bower_components/almond/almond",
        "eventEmitter/EventEmitter":   "bower_components/eventEmitter/EventEmitter",
        "eventie/eventie":             "bower_components/eventie/eventie",
        "get-size":                    "bower_components/get-size",
        "get-style-property":          "bower_components/get-style-property",
        "imagesloaded":                "bower_components/imagesloaded/imagesloaded",
        "jcrop":                       "bower_components/jcrop/js/jquery.Jcrop",
        "jquery":                      "bower_components/jquery/dist/jquery",
        "jquery.anythingslider":       "bower_components/AnythingSlider/js/jquery.anythingslider",
        "jquery.browser":              "bower_components/jquery.browser/dist/jquery.browser",
        "jquery.chosen":               "bower_components/chosen/chosen/chosen.jquery",
        "jquery.form":                 "bower_components/jquery-form/jquery.form",
        "jquery.fullcalendar":         "bower_components/fullcalendar/fullcalendar.min",
        "jquery.fullcalendar.dnd":     "bower_components/fullcalendar/lib/jquery-ui.custom.min",
        "jquery.placeholder":          "bower_components/jquery-placeholder/jquery.placeholder.min",
        "jquery.textchange":           "bower_components/jquery-textchange/jquery.textchange",
        "klass":                       "bower_components/klass/src/klass",
        "logging":                     "bower_components/logging/src/logging",
        "masonry":                     "bower_components/masonry/dist/masonry.pkgd",
        "matches-selector":            "bower_components/matches-selector",
        "modernizr":                   "bower_components/modernizr/modernizr",
        "modernizr-csspositionsticky": "bower_components/modernizr/feature-detects/css-positionsticky",
        "moment":                      "bower_components/moment/moment",
        "moment-timezone":             "bower_components/moment-timezone/moment-timezone",
        "parsley":                     "bower_components/parsleyjs/parsley",
        "parsley.extend":              "bower_components/parsleyjs/parsley.extend",
        "pat-calendar-moment-timezone-data": "pat/calendar/moment-timezone-data",
        "patternslib.slides":          "bower_components/slides/src/slides",
        "photoswipe":                  "legacy/photoswipe",
        "prefixfree":                  "bower_components/prefixfree/prefixfree.min",
        "select2":                     "bower_components/select2/select2.min",
        "spectrum":                    "bower_components/spectrum/spectrum",
        "tinymce":                     "bower_components/jquery.tinymce/jscripts/tiny_mce/jquery.tinymce",
        "underscore":                  "bower_components/underscore/underscore",

        // Core
        "pat-base":                    "core/base",
        "pat-compat":                  "core/compat",
        "pat-depends_parse":           "lib/depends_parse",
        "pat-dependshandler":          "lib/dependshandler",
        "pat-htmlparser":              "lib/htmlparser",
        "pat-input-change-events":     "lib/input-change-events",
        "pat-jquery-ext":              "core/jquery-ext",
        "pat-logger":                  "core/logger",
        "pat-parser":                  "core/parser",
        "pat-pluggable":               "core/pluggable",
        "pat-registry":                "core/registry",
        "pat-remove":                  "core/remove",
        "pat-store":                   "core/store",
        "pat-url":                     "core/url",
        "pat-utils":                   "core/utils",

        // Patterns
        "pat-ajax":                    "pat/ajax/ajax",
        "pat-autofocus":               "pat/autofocus/autofocus",
        "pat-autoscale":               "pat/auto-scale/auto-scale",
        "pat-autosubmit":              "pat/auto-submit/auto-submit",
        "pat-autosuggest":             "pat/auto-suggest/auto-suggest",
        "pat-breadcrumbs":             "pat/breadcrumbs/breadcrumbs",
        "pat-bumper":                  "pat/bumper/bumper",
        "pat-carousel":                "pat/carousel/carousel",
        "pat-checkedflag":             "pat/checked-flag/checked-flag",
        "pat-checklist":               "pat/checklist/checklist",
        "pat-chosen":                  "pat/chosen/chosen",
        "pat-clone":                   "pat/clone/clone",
        "pat-collapsible":             "pat/collapsible/collapsible",
        "pat-colour-picker":           "pat/colour-picker/colour-picker",
        "pat-depends":                 "pat/depends/depends",
        "pat-edit-tinymce":            "pat/edit-tinymce/edit-tinymce",
        "pat-equaliser":               "pat/equaliser/equaliser",
        "pat-expandable":              "pat/expandable-tree/expandable-tree",
        "pat-focus":                   "pat/focus/focus",
        "pat-form-state":              "pat/form-state/form-state",
        "pat-forward":                 "pat/forward/forward",
        "pat-calendar":                "pat/calendar/calendar",
        "pat-gallery":                 "pat/gallery/gallery",
        "pat-image-crop":              "pat/image-crop/image-crop",
        "pat-inject":                  "pat/inject/inject",
        "pat-legend":                  "pat/legend/legend",
        "pat-markdown":                "pat/markdown/markdown",
        "pat-masonry":                 "pat/masonry/masonry",
        "pat-menu":                    "pat/menu/menu",
        "pat-modal":                   "pat/modal/modal",
        "pat-navigation":              "pat/navigation/navigation",
        "pat-notification":            "pat/notification/notification",
        "pat-placeholder":             "pat/placeholder/placeholder",
        "pat-selectbox":               "pat/selectbox/selectbox",
        "pat-skeleton":                "pat/skeleton/skeleton",
        "pat-slides":                  "pat/slides/slides",
        "pat-slideshow-builder":       "pat/slideshow-builder/slideshow-builder",
        "pat-sortable":                "pat/sortable/sortable",
        "pat-stacks":                  "pat/stacks/stacks",
        "pat-subform":                 "pat/subform/subform",
        "pat-switch":                  "pat/switch/switch",
        "pat-toggle":                  "pat/toggle/toggle",
        "pat-tooltip":                 "pat/tooltip/tooltip",
        "pat-validate":                "pat/validate/validate",
        "pat-zoom":                    "pat/zoom/zoom",
        "patterns":                    "patterns"
    },

    shim: {
        "jquery": {
            exports: "jQuery"
        },
        "jquery.fullcalendar.dnd": {
            depends: "jQuery",
        },
        "tinymce": {
            depends: "jquery"
        },
        "photoswipe": {
            depends: "klass",
        }
    },

    optimize: "none"
})
