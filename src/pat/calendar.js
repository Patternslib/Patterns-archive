/**
 * Patterns calendar - Calendar with different views for patterns.
 *
 * Copyright 2013 Marko Durkovic
 */
define([
    'jquery',
    '../core/logger',
    '../core/parser',
    '../utils',
    '../registry',
    '../lib/dnd',
    '../lib/moment-timezone-data',
    'jquery.fullcalendar',
    'moment.timezone'
], function($, logger, Parser, utils, registry, dnd) {
    'use strict';

    var log = logger.getLogger('calendar'),
        parser = new Parser('calendar');

    parser.add_argument('height', 'auto');
    parser.add_argument('start-date');
    parser.add_argument('time-format', 'h(:mm)t');
    parser.add_argument('title-month', 'MMMM YYYY');
    parser.add_argument('title-week', 'MMM D YYYY');
    parser.add_argument('title-day', 'dddd, MMM d, YYYY');
    parser.add_argument('column-month', 'ddd');
    parser.add_argument('column-week', 'ddd M/d');
    parser.add_argument('column-day', 'dddd M/d');
    parser.add_argument('first-day', '0');
    parser.add_argument('first-hour', '6');
    parser.add_argument('calendar-controls', '');
    parser.add_argument('category-controls', '');
    parser.add_argument('default-view', 'month');

    var _ = {
        name: 'calendar',
        trigger: '.pat-calendar',

        init: function($el) {
            var cfg = parser.parse($el),
                calOpts = {
                    header: false,
                    droppable: true,
                    drop: function(date, event, undef, view) {
                        var $this = $(this),
                            $ev = $this.hasClass('cal-event') ?
                                $this : $this.parents('.cal-event'),
                            $cal = $(view.element).parents('.pat-calendar');

                        $ev.appendTo($cal.find('.cal-events'));
                        var $start = $ev.find('.start');
                        if (!$start.length) {
                            $('<time class="start"/>').attr('datetime', date.format())
                                .appendTo($ev);
                        }
                        var $end = $ev.find('.end');
                        if (!$end.length) {
                            $('<time class="end"/>').appendTo($ev);
                        }

                        if (date.hasTime()) {
                            $ev.addClass('all-day');
                        } else {
                            $ev.removeClass('all-day');
                        }
                        $cal.fullCalendar('refetchEvents');
                        $cal.find('a').each(function(a) { $(a).draggable = 1; });
                    },
                    events: function(start, end, timezone, callback) {
                        var events = _.parseEvents($el, timezone);
                        callback(events);
                    },
                    firstHour: cfg.first.hour,
                    axisFormat: cfg.timeFormat,
                    timeFormat: cfg.timeFormat,
                    titleFormat: cfg.title,
                    columnFormat: cfg.column,
                    viewRender: _.highlightButtons,
                    defaultView: cfg.defaultView
                };

            if (cfg.startDate) {
                calOpts.defaultDate = $.fullCalendar.moment(cfg.startDate, 'YYYY-MM-DD');
            } else {
                calOpts.defaultDate = $.fullCalendar.moment();
            }

            if (cfg.height !== 'auto') {
                calOpts.height = cfg.height;
            }

            var dayNames = [ 'su', 'mo', 'tu', 'we', 'th', 'fr', 'sa' ];
            if (dayNames.indexOf(cfg.first.day) >= 0) {
                calOpts.firstDay = dayNames.indexOf(cfg.first.day);
            }

            var refetch = function() {
                $el.fullCalendar('refetchEvents');
            };
            var refetch_deb = utils.debounce(refetch, 400);

            var $filter = $el.find('.filter');
            if ($filter && $filter.length > 0) {
                $('.search-text', $filter).on('keyup', refetch_deb);
                $('.search-text[type=search]', $filter).on('click', refetch_deb);
                $('select[name=state]', $filter).on('change', refetch);
                $('.check-list', $filter).on('change', refetch);
            }

            var $categoryRoot = cfg.categoryControls ?
                $(cfg.categoryControls) : $el;

            $el.categories = $el.find('.cal-events .cal-event')
                .map(function() {
                    return this.className.split(' ').filter(function(cls) {
                        return (/^cal-cat/).test(cls);
                    });
                });

            $el.$catControls = $categoryRoot.find('input[type=checkbox]');
            $el.$catControls.on('change', refetch);

            var $controlRoot = cfg.calendarControls ?
                    $(cfg.calendarControls) : $el,
                $timezoneControl = $controlRoot.find('select.timezone'),
                timezone = $timezoneControl.val();
            calOpts.timezone = timezone;

            $el.fullCalendar(calOpts);

            // move to end of $el
            $el.find('.fc-content').appendTo($el);

            if (cfg.height === 'auto') {
                $el.fullCalendar('option', 'height',
                    $el.find('.fc-content').height());

                $(window).on('resize.pat-calendar', function() {
                    $el.fullCalendar('option', 'height',
                        $el.find('.fc-content').height());
                });
                $(document).on('pat-update.pat-calendar', function() {
                    $el.fullCalendar('option', 'height',
                        $el.find('.fc-content').height());
                });
            }

            // update title
            var $title = $el.find('.cal-title');
            $title.text($el.fullCalendar('getView').title);

            $controlRoot.find('.view-month').addClass('active');

            $controlRoot.find('.jump-next').on('click', function() {
                $el.fullCalendar('next');
                $title.html($el.fullCalendar('getView').title);
            });
            $controlRoot.find('.jump-prev').on('click', function() {
                $el.fullCalendar('prev');
                $title.html($el.fullCalendar('getView').title);
            });
            $controlRoot.find('.jump-today').on('click', function() {
                $el.fullCalendar('today');
                $title.html($el.fullCalendar('getView').title);
            });
            $controlRoot.find('.view-month').on('click', function() {
                $el.fullCalendar('changeView', 'month');
                $title.html($el.fullCalendar('getView').title);
                if (cfg.height === 'auto') {
                    $el.fullCalendar('option', 'height',
                        $el.find('.fc-content').height());
                }
            });
            $controlRoot.find('.view-week').on('click', function() {
                $el.fullCalendar('changeView', 'agendaWeek');
                $title.html($el.fullCalendar('getView').title);
                if (cfg.height === 'auto') {
                    $el.fullCalendar('option', 'height',
                        $el.find('.fc-content').height());
                }
            });
            $controlRoot.find('.view-day').on('click', function() {
                $el.fullCalendar('changeView', 'agendaDay');
                $title.html($el.fullCalendar('getView').title);
                if (cfg.height === 'auto') {
                    $el.fullCalendar('option', 'height',
                        $el.find('.fc-content').height());
                }
            });
            $timezoneControl.on('change', function(ev) {
                var timezone = ev.target.value;
                calOpts.timezone = timezone;
                $el.fullCalendar('destroy');
                $el.fullCalendar(calOpts);
            });

            $el.find('.cal-events').css('display', 'none');

            // make .cal-event elems draggable
            dnd.draggable($('.cal-events .cal-event'));

            // emulate jQueryUI dragstop and mousemove during drag.
            $('.cal-events .cal-event').on('dragend', function() {
                $(this).trigger('dragstop');
            });
            $el.on('dragover', function(event) {
                event.preventDefault();
                event.type = 'mousemove';
                $(document).trigger(event);
            });

            if (!$.fn.draggable) {
                $.fn.draggable = function(opts) {
                    var start = opts.start,
                        stop = opts.stop;
                    this.on('dragstart', function(event) {
                        start(event, null);
                    });
                    this.on('dragend', function(event) {
                        stop(event, null);
                    });
                };
            }
        },

        highlightButtons: function(view, element) {
            var $el = element.parents('.pat-calendar').first(),
                $today = $el.find('.jump-today');
            $today.removeClass('active');
            if (view.name === 'agendaDay') {
                var calDate = $el.fullCalendar('getDate'),
                    today = $.fullCalendar.moment();
                if (calDate.date() === today.date() &&
                    calDate.month() === today.month() &&
                    calDate.year() === today.year()) {
                    $today.addClass('active');
                }
            }

            var classMap = {
                month: '.view-month',
                agendaWeek: '.view-week',
                agendaDay: '.view-day'
            };
            $el.find('.view-month').removeClass('active');
            $el.find('.view-week').removeClass('active');
            $el.find('.view-day').removeClass('active');
            $el.find(classMap[view.name]).addClass('active');
        },

        parseEvents: function($el, timezone) {
            var $events = $el.find('.cal-events'),
                $filter = $el.find('.filter'),
                searchText,
                regex;

            // parse filters
            if ($filter && $filter.length > 0) {
                searchText = $('.search-text', $filter).val();
                regex = new RegExp(searchText, 'i');
            }

            var hiddenCats = $el.categories.filter(function() {
                var cat = this;
                return $el.$catControls.filter(function() {
                    return !this.checked &&
                        $(this)
                            .parents()
                            .andSelf()
                            .hasClass(cat);
                }).length;
            });

            var events = $events.find('.cal-event').filter(function() {
                var $event = $(this);

                if (searchText && !regex.test($event.find('.title').text())) {
                    log.debug('remove due to search-text='+searchText, $event);
                    return false;
                }

                return !hiddenCats.filter(function() {
                    return $event.hasClass(this);
                }).length;
            }).map(function(idx, event) {
                var attr, i;

                // classNames: all event classes without 'event' + anchor classes
                var classNames = $(event).attr('class').split(/\s+/)
                    .filter(function(cls) { return (cls !== 'cal-event'); })
                    .concat($('a', event).attr('class').split(/\s+/));

                // attrs: all 'data-' attrs from anchor
                var allattrs = $('a', event)[0].attributes,
                    attrs = {};
                for (attr, i=0; i<allattrs.length; i++){
                    attr = allattrs.item(i);
                    if (attr.nodeName.slice(0,5) === 'data-') {
                        attrs[attr.nodeName] = attr.nodeValue;
                    }
                }

                var location = ($('.location', event).html() || '').trim();

                var startstr = $('.start', event).attr('datetime'),
                    endstr = $('.end', event).attr('datetime'),
                    start = $.fullCalendar.moment.parseZone(startstr),
                    end = $.fullCalendar.moment.parseZone(endstr);

                if (timezone) {
                    start = start.tz(timezone);
                    end = end.tz(timezone);
                }
                var ev = {
                    title: $('.title', event).text().trim() +
                        (location ? (' (' + location + ')') : ''),
                    start: start.format(),
                    end: end.format(),
                    allDay: $(event).hasClass('all-day'),
                    url: $('a', event).attr('href'),
                    className: classNames,
                    attrs: attrs,
                    editable: $(event).hasClass('editable')
                };
                if (!ev.title) {
                    log.error('No event title for:', event);
                }
                if (!ev.start) {
                    log.error('No event start for:', event);
                }
                if (!ev.url) {
                    log.error('No event url for:', event);
                }
                return ev;
            }).toArray();
            return events;
        }
    };

    registry.register(_);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
