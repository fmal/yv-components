;(function(Yv, undefined) {
    'use strict';

    function addListener(el, type, listener, useCapture) {
        if (el.addEventListener) {
            el.addEventListener(type, listener, useCapture);
            return {
                destroy: function() {
                    el.removeEventListener(type, listener, useCapture);
                }
            };
        } else {
            var handler = function(e) {
                listener.handleEvent(window.event, listener);
            };
            el.attachEvent('on' + type, handler);

            return {
                destroy: function() {
                    el.detachEvent('on' + type, handler);
                }
            };
        }
    }

    var FastButton = (function() {

        function FastButton(elem, handler, useCapture) {
            this.events = [];
            this.touchEvents = [];
            this.element = elem;
            this.handler = handler;
            this.useCapture = useCapture;
            if(Yv.Utils.hasFeat('touchScreen')) {
                this.events.push(addListener(elem, 'touchstart', this, this.useCapture));
            }
            this.events.push(addListener(elem, 'click', this, this.useCapture));
        }

        FastButton.prototype.destroy = function() {
            for (var i = this.events.length - 1; i >= 0; i -= 1) {
                this.events[i].destroy();
            }
            this.events = this.touchEvents = this.element = this.handler = this.fastButton = null;
        };

        FastButton.prototype.handleEvent = function(event) {
            event = event || window.event;
            switch (event.type) {
                case 'touchstart':
                    this.onTouchStart(event);
                    break;
                case 'touchmove':
                    this.onTouchMove(event);
                    break;
                case 'touchend':
                    this.onClick(event);
                    break;
                case 'click':
                    this.onClick(event);
                    break;
            }
        };

        FastButton.prototype.onTouchStart = function(event) {
            Yv.Utils.events.cancel(event);
            this.touchEvents.push(addListener(this.element, 'touchend', this, this.useCapture));
            this.touchEvents.push(addListener(document.body, 'touchmove', this, this.useCapture));
            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
        };

        FastButton.prototype.onTouchMove = function(event) {
            if (Math.abs(event.touches[0].clientX - this.startX) > 10 || Math.abs(event.touches[0].clientY - this.startY) > 10) {
                this.reset();
            }
        };

        FastButton.prototype.onClick = function(event) {
            Yv.Utils.events.cancel(event);
            this.reset();
            var result = this.handler.call(this.element, event);
            if (event.type === 'touchend') {
                ClickBuster.preventGhostClick(this.startX, this.startY);
            }
            return result;
        };

        FastButton.prototype.reset = function() {
            for (var i = this.touchEvents.length - 1; i >= 0; i -= 1) {
                this.touchEvents[i].destroy();
            }
            this.touchEvents = [];
        };

        return FastButton;
    })();

    var ClickBuster = {};

    ClickBuster.preventGhostClick = function(x, y) {
        ClickBuster.coordinates.push(x, y);
        window.setTimeout(function() {
            ClickBuster.coordinates.splice(0, 2);
        }, 2500);
    };

    ClickBuster.onClick = function(event) {
        for (var i = 0; i < ClickBuster.coordinates.length; i += 2) {
            var x = ClickBuster.coordinates[i],
                y = ClickBuster.coordinates[i + 1];
            if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };

    if (Yv.Utils.hasFeat('touchScreen')) {
        document.addEventListener('click', ClickBuster.onClick, true);
        ClickBuster.coordinates = [];
    }

    Yv.FastButton = function(elem, handler, useCapture) {
        return new FastButton(elem, handler, useCapture);
    };
})(window.Yv || (window.Yv = {}));
