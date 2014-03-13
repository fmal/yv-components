;(function(window, undefined) {
    'use strict';

    // localise Yv global
    var Yv = window.Yv = window.Yv || {};

    var win = window,
        doc = win.document;

    var utils = (function() {
        var me = {};

        me.extend = function(target, obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    target[i] = obj[i];
                }
            }

            return target;
        };

        var _elementStyle = doc.documentElement.style,
            _features = {
                classList: !!document.body.classList,
                addEventListener: !!window.addEventListener,
                svg: !!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"),
                touchScreen: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch),
                boxShadow: 'boxShadow' in _elementStyle || ('WebkitBoxShadow' in _elementStyle || 'MozBoxShadow' in _elementStyle),
                createEvent: 'createEvent' in doc
            };

        me.hasFeat = function(feature) {
            return _features[feature];
        };

        me.extend(me.klass = {}, {
            has: function(el, name) {
                if (_features.classList) {
                    return el.classList.contains(name);
                } else {
                    return (el.className).indexOf(name) !== -1;
                }
            },
            add: function(el, name) {
                if (_features.classList) {
                    el.classList.add(name);
                } else {
                    if (!me.klass.has(el, name)) {
                        el.className += ' ' + name;
                    }
                }
            },
            remove: function(el, name) {
                if (_features.classList) {
                    el.classList.remove(name);
                } else {
                    el.className = el.className.replace(new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            },
            toggle: function(el, name) {
                if(_features.classList) {
                    el.classList.toggle(name);
                } else {
                    if (me.klass.has(el, name)) {
                        me.klass.remove(el, name);
                    } else {
                        me.klass.add(el, name);
                    }
                }
            }
        });

        me.extend(me.events = {}, {
            addEvent: function(element, eventName, func, capture) {
                if (_features.addEventListener) {
                    return element.addEventListener(eventName, func, !!capture);
                } else if (element.attachEvent) {
                    return element.attachEvent("on" + eventName, func);
                }
            },
            removeEvent: function(element, eventName, func, capture) {
                if (_features.addEventListener) {
                    return element.removeEventListener(eventName, func, !!capture);
                } else if (element.attachEvent) {
                    return element.detachEvent("on" + eventName, func);
                }
            },
            prevent: function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            },
            cancel: function(e) {
                if(e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
            }
        });

        me.extend(me.value = {}, {
            get: function(el) {
                var content;
                if (el.value) {
                    content = el.value;
                } else {
                    content = el.innerHTML;
                }
                return content;
            },
            set: function(el, val) {
                if(!el.type) {
                    el.innerHTML = val;
                } else {
                    el.value = val;
                }
            }
        });

        me.qs = function(selector, context) {
            return (context || doc).querySelector(selector);
        };

        me.qsa = function(selector, context) {
            return (context || doc).querySelectorAll(selector);
        };

        me.byId = function(id) {
            return document.getElementById(id);
        };

        me.byClass = function(classname, context) {
            context = context ? context : document.body;
            var a = [],
                re = new RegExp('(^| )' + classname + '( |$)'),
                els = context.getElementsByTagName("*");
            for (var i=0, j=els.length; i<j; i++) {
                if (re.test(els[i].className)) {
                    a.push(els[i]);
                }
            }
            return a;
        };

        me.createNode = function(tagName, attributes) {
            var node = doc.createElement(tagName),
                key;
            for (key in attributes) {
                node.setAttribute(key, attributes[key]);
            }
            return node;
        };

        me.removeNode = function(targetNode) {
            if (targetNode && targetNode.parentNode) {
                targetNode.parentNode.removeChild(targetNode);
            }
        };

        me.insertBefore = function(newNode, targetNode) {
            var parentNode = targetNode.parentNode;
            var next = targetNode.nextSibling;
            if (!next) {
                parentNode.appendChild(newNode);
            } else {
                parentNode.insertBefore(newNode, targetNode);
            }
        };

        me.insertAfter = function(newNode, targetNode) {
            var parentNode = targetNode.parentNode;
            var next = targetNode.nextSibling;
            if (next) {
                parentNode.insertBefore(newNode, next);
            } else {
                parentNode.appendChild(newNode);
            }
        };

        me.previousElementSibling = function(el) {
            if (el.previousElementSibling) {
                return el.previousElementSibling;
            } else {
                do { el = el.previousSibling; } while ( el && el.nodeType !== 1 );
                return el;
            }
        };

        me.nextElementSibling = function(el) {
            if (el.nextElementSibling) {
                return el.nextElementSibling;
            } else {
                do { el = el.nextSibling; } while ( el && el.nodeType !== 1 );
                return el;
            }
        };

        me.text = function(node, val) {
            if (val) {
                if (node.textContent !== undefined) {
                    node.textContent = val;
                } else {
                    node.innerText = val;
                }
            }
            return (node.textContent || node.innerText).trim();
        };

        me.outerWidth = function(el, includeMargin) {
            var height = el.offsetWidth;
            if (includeMargin) {
                var style = el.currentStyle || getComputedStyle(el);
                height += parseInt(style.marginLeft) + parseInt(style.marginRight);
            }
            return height;
        };

        me.outerHeight = function(el, includeMargin) {
            var height = el.offsetHeight;
            if (includeMargin) {
                var style = el.currentStyle || getComputedStyle(el);
                height += parseInt(style.marginTop) + parseInt(style.marginBottom);
            }
            return height;
        };

        return me;
    })();

    Yv.Utils = utils;
})(window);
