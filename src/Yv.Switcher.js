;(function(Yv, undefined) {
    'use strict';

    var Switcher = (function() {

        function Switcher(elem) {
            if (!elem) {
                return;
            } else if (elem.type !== 'checkbox') {
                throw new Error('Input must be checkbox');
            }

            this.element = elem;
            this.element.style.display = 'none';

            this._init();
        }

        Switcher.prototype._init = function() {
            this._layout();

            if (this.element.checked) {
                this.turnOn();
            }

            Yv.Utils.events.addEvent(this.switch, 'click', this);
            Yv.Utils.events.addEvent(this.switch, 'touchstart', this);
        };

        Switcher.prototype._layout = function() {
            this.switch = Yv.Utils.createNode('div', {
                class: 'yv-Switcher'
            });

            var handle = Yv.Utils.createNode('div', {
                class: 'yv-Switcher-handle'
            });

            this.switch.appendChild(handle);

            Yv.Utils.insertBefore(this.switch, this.element);
        };

        Switcher.prototype.handleEvent = function(e) {
            var evt = e || window.event;
            switch (evt.type) {
                case 'click':
                    this.toggle();
                    console.log('click');
                    break;
                case 'touchstart':
                    Yv.Utils.events.prevent(evt);
                    this.toggle();
                    console.log('touch');
                    break;
            }
        };

        Switcher.prototype.toggle = function() {
            if (Yv.Utils.klass.has(this.switch, 'yv-Switcher--on')) {
                this.turnOff();
            } else {
                this.turnOn();
            }

            this._triggerChange();
        };

        Switcher.prototype.turnOn = function() {
            Yv.Utils.klass.add(this.switch, 'yv-Switcher--on');
            this.element.checked = true;
        };

        Switcher.prototype.turnOff = function() {
            Yv.Utils.klass.remove(this.switch, 'yv-Switcher--on');
            this.element.checked = false;
        };

        Switcher.prototype._triggerChange = function() {
            if (Yv.Utils.hasFeat('createEvent')) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('change', false, true);
                this.switch.dispatchEvent(evt);
            } else {
                this.switch.fireEvent('onchange');
            }
        };

        return Switcher;
    })();

    Yv.Switcher = function(elem, opts) {
        return new Switcher(elem, opts);
    };
})(window.Yv || (window.Yv = {}));
