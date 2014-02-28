;(function(Yv, undefined) {
    'use strict';

    var Toggler = (function() {

        function Toggler(elem, opts) {
            if(!elem) {
                return;
            }
            this.element = elem;
            this.options = {
                scrollBottom: true
            };

            Yv.Utils.extend(this.options || {}, opts);

            if (this.element.scrollHeight > Yv.Utils.outerHeight(this.element)) {
                this._init();
            }
        }

        Toggler.prototype._init = function() {
            this._layout();
            this._initEvents();

            if (this.options.scrollBottom) {
                this.element.scrollTop = this.element.scrollHeight;
            }
        };

        Toggler.prototype._layout = function() {
            Yv.Utils.klass.add(this.element, 'yv-Toggle');
            Yv.Utils.klass.add(this.element, 'yv-Toggle--constrained');
            this.toggleButton = Yv.Utils.createNode('button', {
                class: 'yv-ToggleButton yv-ToggleButton--expand'
            });
            this.toggleButton.appendChild(document.createTextNode("Rozwiń \u25bc"));
            this.element.parentNode.insertBefore(this.toggleButton, this.element.nextSibling);
        };

        Toggler.prototype._initEvents = function() {
            var self = this;
            this.listener = function(e) {
                var target = e.target || e.srcElement;
                Yv.Utils.events.prevent(e);
                if (Yv.Utils.klass.has(self.element, 'yv-Toggle--constrained')) {
                    Yv.Utils.klass.remove(target, 'yv-ToggleButton--expand');
                    Yv.Utils.klass.add(target, 'yv-ToggleButton--collapse');
                    target.childNodes[0].nodeValue = "Zwiń \u25b2";
                    Yv.Utils.klass.remove(self.element, 'yv-Toggle--constrained');
                } else {
                    Yv.Utils.klass.remove(target, 'yv-ToggleButton--collapse');
                    Yv.Utils.klass.add(target, 'yv-ToggleButton--expand');
                    target.childNodes[0].nodeValue = "Rozwiń \u25bc";
                    Yv.Utils.klass.add(self.element, 'yv-Toggle--constrained');
                }
            };
            Yv.Utils.events.addEvent(this.toggleButton, 'click', this.listener);
        };

        Toggler.prototype.destroy = function() {
            Yv.Utils.klass.remove(this.element, 'yv-Toggle');
            Yv.Utils.klass.remove(this.element, 'yv-Toggle--constrained');
            Yv.Utils.events.removeEvent(this.toggleButton, 'click', this.listener);
            this.element.parentNode.removeChild(this.element.nextSibling);
            delete this.toggleButton;
        };

        return Toggler;
    })();

    Yv.Toggler = function(elem, opts) {
        return new Toggler(elem, opts);
    };
})(window.Yv || (window.Yv = {}));
