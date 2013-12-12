({
    baseUrl: ".",
    out: 'bundle.js',
    name: 'patterns',

    paths: {

        // Externals
        jquery: 'externals/jquery-1.8.3',
        logging: 'externals/logging',
        'jquery.form': 'externals/jquery.form',
        'Markdown.Converter': 'externals/pagedown-1.1.0/Markdown.Converter',
        'Markdown.Sanitizer': 'externals/pagedown-1.1.0/Markdown.Sanitizer',
        'Markdown.Extra': 'externals/pagedown-extra-2013.04.02/Markdown.Extra',

        // Core
        patterns: 'src/patterns',
        registry: 'src/registry',
        utils: 'src/utils',
        compat: 'src/compat',
        'jquery-ext': 'src/jquery-ext',
        logger: 'src/core/logger',
        parser: 'src/core/parser',
        remove: 'src/core/remove',

        // Lib
        htmlparser: 'src/lib/htmlparser',

        // Patterns
        ajax: 'src/pat/ajax',
        tooltip: 'src/pat/tooltip',
        inject: 'src/pat/inject',
        markdown: 'src/pat/markdown'

    },

    shim: {
        'Markdown.Converter': {
            exports: 'Markdown'
        },

        'Markdown.Sanitizer': {
            deps: ['Markdown.Converter']
        },

        'Markdown.Extra': {
            deps: ['Markdown.Converter'],

            init: function (Markdown) {
                window.Markdown = Markdown;
            }

        },
    },

    optimize: 'none'


})



