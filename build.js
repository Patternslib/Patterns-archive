({
    baseUrl: ".",
    out: 'bundle.js',
    name: 'patterns',

    paths: {

        // Externals
        jquery: 'externals/jquery-1.8.3',
        logging: 'externals/logging',
        'jquery.form': 'externals/jquery.form',

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
        inject: 'src/pat/inject'

    },

    // optimize: 'none'

})