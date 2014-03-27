;(function(Yv, undefined) {
    'use strict';

    var Spinner = (function() {

        function Spinner(opts) {
            var self = this;

            this.options = {
                appendTo: document.body
            };

            this.spinner = null;
            this.spinning = null;

            Yv.Utils.extend(this.options || {}, opts);
        }

        var _createSpinner = function(container) {
            var spinnerContainer, spinner, color;

            this.spinner = spinnerContainer = Yv.Utils.createNode('div', {
                class: 'yv-Spinner'
            });

            if (this.options.position) {
                spinnerContainer.style.position = this.options.position;
            }

            if (this.options.offset) {
                spinnerContainer.style.top = this.options.offset;
            }

            color = this.options.color || '#000';

            spinner = Yv.Utils.createNode('span');
            spinner.style.backgroundColor = color;

            spinnerContainer.appendChild(spinner);

            container.appendChild(spinnerContainer);
        };

        Spinner.prototype.on = function() {
            if (this.spinning) { return; }
            this.spinning = true;
            _createSpinner.call(this, this.options.appendTo);
            return this;
        };

        Spinner.prototype.off = function() {
            if (!this.spinner) { return; }
            this.spinning = false;
            Yv.Utils.removeNode(this.spinner);
        };

        return Spinner;
    })();

    Yv.Spinner = function(opts) {
        return new Spinner(opts);
    };
})(window.Yv || (window.Yv = {}));
