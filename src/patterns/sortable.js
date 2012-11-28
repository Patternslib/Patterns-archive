define([
    'jquery',
    "../registry"
], function($, patterns) {
    var _ = {
        name: "sortable",
        trigger: "ul.pat-sortable",

        init: function($el) {
            if ($el.length > 1)
                return $el.each(function() { _.init($(this)); });
            
            // use only direct descendants to support nested lists
            var $lis = $el.children().filter('li');
            
            // add handles and make them draggable for HTML5 and IE8/9
            // it has to be an "a" tag (or img) to make it draggable in IE8/9
            var $handles = $('<a href="#" class="handle"></a>').appendTo($lis);
            if('draggable' in document.createElement('span'))
                $handles.attr('draggable', true);
            else
                $handles.bind('selectstart', function(event) {
                    event.preventDefault();
                });
                        
            $handles.bind('dragstart', function(event) {
                // Firefox seems to need this set to any value
                event.originalEvent.dataTransfer.setData('Text', '');
                event.originalEvent.dataTransfer.effectAllowed = ['move'];
                if ('setDragImage' in event.originalEvent.dataTransfer)
                    event.originalEvent.dataTransfer.setDragImage(
                        $(this).parent()[0], 0, 0);
                $(this).parent().addClass('dragged');
           
                // list elements are only drop targets when one element of the
                // list is being dragged. avoids dragging between lists.
                $lis.bind('dragover.pat-sortable', function(event) {
                    var $this = $(this),
                        midlineY = $this.offset().top - $(document).scrollTop()
                            + $this.height()/2;
    
                    // bail if dropping on self
                    if ($(this).hasClass('dragged'))
                        return;

                    $this.removeClass('drop-target-above drop-target-below');
                    if (event.originalEvent.clientY > midlineY)
                        $this.addClass('drop-target-below');
                    else
                        $this.addClass('drop-target-above');
                    event.preventDefault();
                });
                
                $lis.bind('dragleave.pat-sortable', function(event) {
                    $lis.removeClass('drop-target-above drop-target-below');
                });
                
                $lis.bind('drop.pat-sortable', function(event) {
                    if ($(this).hasClass('drop-target-below'))
                        $(this).after($('.dragged'));
                    else
                        $(this).before($('.dragged'));
                    $(this).removeClass('drop-target-above drop-target-below');
                    event.preventDefault();
                });
            });

            $handles.bind('dragend', function(event) {
                $('.dragged').removeClass('dragged');
                $lis.unbind('.pat-sortable');
            });

        }
    };

    patterns.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
