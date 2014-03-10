;(function(Yv, undefined) {
    'use strict';

    var Dropdown = (function() {
        function Dropdown(elem) {
            if (!elem) {
                return;
            }

            this.element = elem;
            this.menu = Yv.Utils.qs('.yv-Dropdown-menu', elem);
            this.menuLink = Yv.Utils.qs('.yv-Dropdown-menuLink', elem);
            this.menuOptions = Yv.Utils.qsa('.yv-Dropdown-menuOption', elem);

            if (this.open === undefined) {
                this._init();
            }
        }

        Dropdown.prototype._init = function() {
            Yv.Utils.klass.add(this.element, 'yv-Dropdown--is-closed');

            this.menuLink.setAttribute('tabindex', 0);
            this.menuLink.setAttribute('role', 'button');
            this.menuLink.setAttribute('aria-expanded', false);

            this._initEvents();

            this.menu.setAttribute('role', 'menu');
            this.menu.setAttribute('aria-hidden', true);

            [].forEach.call(this.menuOptions, function(el) {
                el.setAttribute('tabindex', 0);
                el.setAttribute('role', 'menuitem');
            });

            this.open = false;
        };

        Dropdown.prototype._initEvents = function() {
            var self = this;

            this.listener = function(e) {
                if (e.type === 'click' ||
                        (e.type === 'touchend' && e.changedTouches.length === 1) ||
                        (e.type === 'keyup' && e.keyCode === 13)
                        ) {
                    Yv.Utils.events.prevent(e);
                    self.toggle();
                }
            };

            var events = ['click', 'touchend'];

            var nodeType = this.menuLink.tagName.toLowerCase();
            if (nodeType !== 'a' && nodeType !== 'button') {
                events.push('keyup');
            }

            for (var i = 0, len = events.length; i < len; i++) {
                Yv.Utils.events.addEvent(this.menuLink, events[i], this.listener);
            }
        };

        Dropdown.prototype.toggle = function() {
            Yv.Utils.klass.toggle(this.element, 'yv-Dropdown--is-open');
            Yv.Utils.klass.toggle(this.element, 'yv-Dropdown--is-closed');

            this.open = !this.open;

            this.menuLink.setAttribute('aria-expanded', this.open);
            this.menu.setAttribute('aria-hidden', !this.open);

            if (this.open && this.menuOptions.length) {
                this.menuOptions[0].focus();
            }
        };

        Dropdown.prototype.destroy = function() {
            var i, len;

            Yv.Utils.klass.remove(this.element, 'yv-Dropdown--is-closed');
            Yv.Utils.klass.remove(this.element, 'yv-Dropdown--is-open');

            this.menuLink.removeAttribute('role');
            this.menuLink.removeAttribute('tabindex');
            this.menuLink.removeAttribute('aria-expanded');

            var events = ['click', 'keyup', 'touchend'];

            for (i = 0, len = events.length; i < len; i++) {
                Yv.Utils.events.removeEvent(this.menuLink, events[i], this.listener);
            }

            this.menu.removeAttribute('role');
            this.menu.removeAttribute('aria-hidden');

            for (i = 0, len = this.menuOptions.length; i < len; i++) {
                this.menuOptions[i].removeAttribute('tabindex');
                this.menuOptions[i].removeAttribute('role');
            }
            delete this.open;
        };

        return Dropdown;
    })();

    Yv.Dropdown = function(elem, opts) {
        return new Dropdown(elem);
    };
})(window.Yv || (window.Yv = {}));
