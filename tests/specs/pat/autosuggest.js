define(["pat-autosuggest"], function(pattern) {

    var utils = {
        createElement: function(c) {
            var cfg = c || {};
            return $("<input/>", {
                "id":   cfg.id || "select2",
                "data-pat-autosuggest": "" || cfg.data,
                "class": "pat-autosuggest"
            }).appendTo($("div#lab"));
        },

        removeSelect2: function removeSelect2() {
            $("#select2").remove();
            $("#select2-drop").remove();
            $("#select2-drop-mask").remove();
            $(".select2-container").remove();
            $(".select2-sizer").remove();
        },

        click: {
            type: "click",
            preventDefault: function () {}
        }
    };

    describe("pat-autosuggest", function() {

        describe("An ordinary <input> element", function () {
            beforeEach(function() {
                $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
                $("<div/>", {id: "lab"}).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("gets converted into a select2 widget", function() {
                utils.createElement();
                var $el = $("input.pat-autosuggest");

                expect($(".select2-container").length).toBe(0);
                expect($el.hasClass("select2-offscreen")).toBeFalsy();
                pattern.init($el);
                expect($el.hasClass("select2-offscreen")).toBeTruthy();
                expect($(".select2-container").length).toBe(1);
                utils.removeSelect2();
            });
        });

        describe("Selected items", function () {
            beforeEach(function() {
                $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
                $("<div/>", {id: "lab"}).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("can be given custom CSS classes", function() {
                utils.createElement({
                    data: "words: apple,orange,pear; pre-fill: orange; selection-classes: {\"orange\": [\"fruit\", \"orange\"]}"
                });
                var $el = $("input.pat-autosuggest");
                expect($(".select2-search-choice").length).toBe(0);
                pattern.init($el);
                expect($(".select2-search-choice").length).toBe(1);
                expect($(".select2-search-choice").hasClass("fruit")).toBeTruthy();
                expect($(".select2-search-choice").hasClass("orange")).toBeTruthy();
                utils.removeSelect2();
            });

            it("can be restricted to a certain amount", function() {
                // First check without limit
                utils.createElement({
                    data: "words: apple,orange,pear; pre-fill: orange"
                });
                expect($(".select2-input").length).toBe(0);
                pattern.init($("input.pat-autosuggest"));
                expect($(".select2-input").length).toBe(1);
                expect($(".select2-selection-limit").length).toBe(0);
                $(".select2-input").val("apple").click();
                expect($(".select2-selection-limit").length).toBe(0);
                utils.removeSelect2();

                // Then with limit
                utils.createElement({
                    data: "maximum-selection-size: 1; words: apple,orange,pear; pre-fill: orange"
                });
                expect($(".select2-input").length).toBe(0);
                pattern.init($("input.pat-autosuggest"));
                expect($(".select2-input").length).toBe(1);
                expect($(".select2-selection-limit").length).toBe(0);
                $(".select2-input").val("apple").click();
                expect($(".select2-selection-limit").length).toBe(1);
                expect($(".select2-selection-limit").text()).toBe("You can only select 1 item");
                utils.removeSelect2();
            });
        });
    });

});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab