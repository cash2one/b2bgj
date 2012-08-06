/*
Copyright 2010, KISSY UI Library v1.1.6
MIT Licensed
build time: Dec 15 17:50
*/
/*
 * @module kissy
 * @author lifesinger@gmail.com
 */
(function(host, S, undef) {

    var meta = {
            /**
             * Copies all the properties of s to r.
             * @return {Object} the augmented object
             */
            mix: function(r, s, ov, wl) {
                if (!s || !r) return r;
                if (ov === undef) ov = true;
                var i, p, len;

                if (wl && (len = wl.length)) {
                    for (i = 0; i < len; i++) {
                        p = wl[i];
                        if (p in s) {
                            _mix(p, r, s, ov);
                        }
                    }
                } else {
                    for (p in s) {
                        _mix(p, r, s, ov);
                    }
                }
                return r;
            }
        },

        _mix = function(p, r, s, ov) {
            if (ov || !(p in r)) {
                r[p] = s[p];
            }
        },

        // If KISSY is already defined, the existing KISSY object will not
        // be overwritten so that defined namespaces are preserved.
        seed = (host && host[S]) || {},

        guid = 0,
        EMPTY = '';

    // The host of runtime environment. specify by user's seed or <this>,
    // compatibled for  '<this> is null' in unknown engine.
    host = seed.__HOST || (seed.__HOST = host || {});

    // shortcut and meta for seed.
    S = host[S] = meta.mix(seed, meta, false);

    S.mix(S, {

        // S.app() with these members.
        __APP_MEMBERS: ['namespace'],
        __APP_INIT_METHODS: ['__init'],

        /**
         * The version of the library.
         * @type {String}
         */
        version: '1.1.6',

        /**
         * Returns a new object containing all of the properties of
         * all the supplied objects. The properties from later objects
         * will overwrite those in earlier objects. Passing in a
         * single object will create a shallow copy of it.
         * @return {Object} the new merged object
         */
        merge: function() {
            var o = {}, i, l = arguments.length;
            for (i = 0; i < l; i++) {
                S.mix(o, arguments[i]);
            }
            return o;
        },

        /**
         * Applies prototype properties from the supplier to the receiver.
         * @return {Object} the augmented object
         */
        augment: function(/*r, s1, s2, ..., ov, wl*/) {
            var args = arguments, len = args.length - 2,
                r = args[0], ov = args[len], wl = args[len + 1],
                i = 1;

            if (!S.isArray(wl)) {
                ov = wl;
                wl = undef;
                len++;
            }
            if (!S.isBoolean(ov)) {
                ov = undef;
                len++;
            }

            for (; i < len; i++) {
                S.mix(r.prototype, args[i].prototype || args[i], ov, wl);
            }

            return r;
        },

        /**
         * Utility to set up the prototype, constructor and superclass properties to
         * support an inheritance strategy that can chain constructors and methods.
         * Static members will not be inherited.
         * @param r {Function} the object to modify
         * @param s {Function} the object to inherit
         * @param px {Object} prototype properties to add/override
         * @param sx {Object} static properties to add/override
         * @return r {Object}
         */
        extend: function(r, s, px, sx) {
            if (!s || !r) return r;

            var create = Object.create ?
                         function(proto, c) {
                             return Object.create(proto, {
                                 constructor: {
                                     value: c
                                 }
                             });
                         } :
                         function (proto, c) {
                             function F() {
                             }

                             F.prototype = proto;

                             var o = new F();
                             o.constructor = c;
                             return o;
                         },
                sp = s.prototype,
                rp;

            // add prototype chain
            r.prototype = rp = create(sp, r);
            r.superclass = create(sp, s);

            // add prototype overrides
            if (px) {
                S.mix(rp, px);
            }

            // add object overrides
            if (sx) {
                S.mix(r, sx);
            }

            return r;
        },

        /****************************************************************************************

         *                            The KISSY System Framework                                *

         ****************************************************************************************/

        /**
         * Initializes KISSY
         */
        __init: function() {
            this.Config = this.Config || {};
            this.Env = this.Env || {};

            // NOTICE: '@DEBUG@' will replace with '' when compressing.
            // So, if loading source file, debug is on by default.
            // If loading min version, debug is turned off automatically.
            this.Config.debug = '@DEBUG@';
        },

        /**
         * Returns the namespace specified and creates it if it doesn't exist. Be careful
         * when naming packages. Reserved words may work in some browsers and not others.
         * <code>
         * S.namespace('KISSY.app'); // returns KISSY.app
         * S.namespace('app.Shop'); // returns KISSY.app.Shop
         * S.namespace('TB.app.Shop', true); // returns TB.app.Shop
         * </code>
         * @return {Object}  A reference to the last namespace object created
         */
        namespace: function() {
            var args = arguments, l = args.length,
                o = null, i, j, p,
                global = (args[l - 1] === true && l--);

            for (i = 0; i < l; i++) {
                p = (EMPTY + args[i]).split('.');
                o = global ? host : this;
                for (j = (host[p[0]] === o) ? 1 : 0; j < p.length; ++j) {
                    o = o[p[j]] = o[p[j]] || { };
                }
            }
            return o;
        },

        /**
         * create app based on KISSY.
         * @param name {String} the app name
         * @param sx {Object} static properties to add/override
         * <code>
         * S.app('TB');
         * TB.namespace('app'); // returns TB.app
         * </code>
         * @return {Object}  A reference to the app global object
         */
        app: function(name, sx) {
            var isStr = S.isString(name),
                O = isStr ? host[name] || {} : name,
                i = 0,
                len = S.__APP_INIT_METHODS.length;

            S.mix(O, this, true, S.__APP_MEMBERS);
            for (; i < len; i++) S[S.__APP_INIT_METHODS[i]].call(O);

            S.mix(O, S.isFunction(sx) ? sx() : sx);
            isStr && (host[name] = O);

            return O;
        },

        /**
         * Prints debug info.
         * @param msg {String} the message to log.
         * @param cat {String} the log category for the message. Default
         *        categories are "info", "warn", "error", "time" etc.
         * @param src {String} the source of the the message (opt)
         */
        log: function(msg, cat, src) {
            if (S.Config.debug) {
                if (src) {
                    msg = src + ': ' + msg;
                }
                if (host['console'] !== undef && console.log) {
                    console[cat && console[cat] ? cat : 'log'](msg);
                }
            }
        },

        /**
         * Throws error message.
         */
        error: function(msg) {
            if (S.Config.debug) {
                throw msg;
            }
        },

        /*
         * Generate a global unique id.
         * @param pre {String} optional guid prefix
         * @return {String} the guid
         */
        guid: function(pre) {
            return (pre || EMPTY) + guid++;
        }
    });

    S.__init();

    return S;

})(this, 'KISSY');
/**
 * @module  lang
 * @author  lifesinger@gmail.com
 */
(function(S, undef) {

    var host = S.__HOST,

        toString = Object.prototype.toString,
        indexOf = Array.prototype.indexOf,
        lastIndexOf = Array.prototype.lastIndexOf,
        filter = Array.prototype.filter,
        trim = String.prototype.trim,

        EMPTY = '',
        RE_TRIM = /^\s+|\s+$/g,

        // [[Class]] -> type pairs
        class2type = {};

    S.mix(S, {

        /**
         * Determine the internal JavaScript [[Class]] of an object.
         */
        type: function(o) {
            return o == null ?
                String(o) :
                class2type[toString.call(o)] || 'object';
        },

        isNull: function(o) {
            return o === null;
        },

        isUndefined: function(o) {
            return o === undef;
        },

        /**
         * Checks to see if an object is empty.
         */
        isEmptyObject: function(o) {
            for (var p in o) {
                return false;
            }
            return true;
        },

        /**
         * Checks to see if an object is a plain object (created using "{}"
         * or "new Object()" or "new FunctionClass()").
         * Ref: http://lifesinger.org/blog/2010/12/thinking-of-isplainobject/
         */
        isPlainObject: function(o) {
            return o && toString.call(o) === '[object Object]' && 'isPrototypeOf' in o;
        },

        /**
         * Creates a deep copy of a plain object or array. Others are returned untouched.
         */
        clone: function(o) {
            var ret = o, b, k;

            // array or plain object
            if (o && ((b = S.isArray(o)) || S.isPlainObject(o))) {
                ret = b ? [] : {};
                for (k in o) {
                    if (o.hasOwnProperty(k)) {
                        ret[k] = S.clone(o[k]);
                    }
                }
            }

            return ret;
        },

        /**
         * Removes the whitespace from the beginning and end of a string.
         */
        trim: trim ?
            function(str) {
                return (str == undef) ? EMPTY : trim.call(str);
            } :
            function(str) {
                return (str == undef) ? EMPTY : str.toString().replace(RE_TRIM, EMPTY);
            },

        /**
         * Substitutes keywords in a string using an object/array.
         * Removes undefined keywords and ignores escaped keywords.
         */
        substitute: function(str, o, regexp) {
            if (!S.isString(str) || !S.isPlainObject(o)) return str;

            return str.replace(regexp || /\\?\{([^{}]+)\}/g, function(match, name) {
                if (match.charAt(0) === '\\') return match.slice(1);
                return (o[name] !== undef) ? o[name] : EMPTY;
            });
        },

        /**
         * Executes the supplied function on each item in the array.
         * @param object {Object} the object to iterate
         * @param fn {Function} the function to execute on each item. The function
         *        receives three arguments: the value, the index, the full array.
         * @param context {Object} (opt)
         */
        each: function(object, fn, context) {
            var key, val, i = 0, length = object ? object.length : undef,
                isObj = length === undef || S.type(object) === 'function';
            context = context || host;

            if (isObj) {
                for (key in object) {
                    if (fn.call(context, object[key], key, object) === false) {
                        break;
                    }
                }
            } else {
                for (val = object[0];
                     i < length && fn.call(context, val, i, object) !== false; val = object[++i]) {
                }
            }

            return object;
        },

        /**
         * Search for a specified value within an array.
         */
        indexOf: indexOf ?
            function(item, arr) {
                return indexOf.call(arr, item);
            } :
            function(item, arr) {
                for (var i = 0, len = arr.length; i < len; ++i) {
                    if (arr[i] === item) {
                        return i;
                    }
                }
                return -1;
            },

        /**
         * Returns the index of the last item in the array
         * that contains the specified value, -1 if the
         * value isn't found.
         */
        lastIndexOf: (lastIndexOf) ?
            function(item, arr) {
                return lastIndexOf.call(arr, item);
            } :
            function(item, arr) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (arr[i] === item) {
                        break;
                    }
                }
                return i;
            },

        /**
         * Returns a copy of the array with the duplicate entries removed
         * @param a {Array} the array to find the subset of uniques for
         * @param override {Boolean}
         *        if override is true, S.unique([a, b, a]) => [b, a]
         *        if override is false, S.unique([a, b, a]) => [a, b]
         * @return {Array} a copy of the array with duplicate entries removed
         */
        unique: function(a, override) {
            if (override) a.reverse();
            var b = a.slice(), i = 0, n, item;

            while (i < b.length) {
                item = b[i];
                while ((n = S.lastIndexOf(item, b)) !== i) {
                    b.splice(n, 1);
                }
                i += 1;
            }

            if (override) b.reverse();
            return b;
        },

        /**
         * Search for a specified value index within an array.
         */
        inArray: function(item, arr) {
            return S.indexOf(item, arr) > -1;
        },

        /**
         * Executes the supplied function on each item in the array.
         * Returns a new array containing the items that the supplied
         * function returned true for.
         * @param arr {Array} the array to iterate
         * @param fn {Function} the function to execute on each item
         * @param context {Object} optional context object
         * @return {Array} The items on which the supplied function
         *         returned true. If no items matched an empty array is
         *         returned.
         */
        filter: filter ?
            function(arr, fn, context) {
                return filter.call(arr, fn, context);
            } :
            function(arr, fn, context) {
                var ret = [];
                S.each(arr, function(item, i, arr) {
                    if (fn.call(context, item, i, arr)) {
                        ret.push(item);
                    }
                });
                return ret;
            },

        /**
         * Gets current date in milliseconds.
         */
        now: function() {
            return new Date().getTime();
        }
    });

    S.each('Boolean Number String Function Array Date RegExp Object'.split(' '),
        function(name, lc) {
            // populate the class2type map
            class2type['[object ' + name + ']'] = (lc = name.toLowerCase());

            // add isBoolean/isNumber/...
            S['is' + name] = function(o) {
                return S.type(o) == lc;
            }
        });

})(KISSY);
/**
 * @module  lang
 * @author  lifesinger@gmail.com
 */
(function(S, undef) {

    var win = S.__HOST,
        doc = win['document'],
        docElem = doc.documentElement,

        EMPTY = '',
        SEP = '&',
        BRACKET = encodeURIComponent('[]'),

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady = false,

        // The functions to execute on DOM ready.
        readyList = [],

        // Has the ready events already been bound?
        readyBound = false,

        // The number of poll times.
        POLL_RETRYS = 500,

        // The poll interval in milliseconds.
        POLL_INTERVAL = 40,

        // #id or id
        RE_IDSTR = /^#?([\w-]+)$/,
        RE_ARR_KEY = /^(\w+)\[\]$/,
        RE_NOT_WHITE = /\S/;

    S.mix(S, {

        /**
         * A crude way of determining if an object is a window
         */
        isWindow: function(o) {
            return S.type(o) === 'object' && 'setInterval' in o;
        },

        /**
         * Converts object to a true array.
         */
        makeArray: function(o) {
            if (o === null || o === undef) return [];
            if (S.isArray(o)) return o;

            // The strings and functions also have 'length'
            if (typeof o.length !== 'number' || S.isString(o) || S.isFunction(o)) {
                return [o];
            }

            return slice2Arr(o);
        },

        /**
         * Creates a serialized string of an array or object.
         * <code>
         * {foo: 1, bar: 2}    // -> 'foo=1&bar=2'
         * {foo: 1, bar: [2, 3]}    // -> 'foo=1&bar[]=2&bar[]=3'
         * {foo: '', bar: 2}    // -> 'foo=&bar=2'
         * {foo: undefined, bar: 2}    // -> 'foo=undefined&bar=2'
         * {foo: true, bar: 2}    // -> 'foo=true&bar=2'
         * </code>
         */
        param: function(o, sep) {
            if (!S.isPlainObject(o)) return EMPTY;
            sep = sep || SEP;

            var buf = [], key, val;
            for (key in o) {
                val = o[key];
                key = encodeURIComponent(key);

                // val is valid non-array value
                if (isValidParamValue(val)) {
                    buf.push(key, '=', encodeURIComponent(val + EMPTY), sep);
                }
                // val is not empty array
                else if (S.isArray(val) && val.length) {
                    for (var i = 0, len = val.length; i < len; ++i) {
                        if (isValidParamValue(val[i])) {
                            buf.push(key, BRACKET + '=', encodeURIComponent(val[i] + EMPTY), sep);
                        }
                    }
                }
                // ignore other cases, including empty array, Function, RegExp, Date etc.
            }
            buf.pop();
            return buf.join(EMPTY);
        },

        /**
         * Parses a URI-like query string and returns an object composed of parameter/value pairs.
         * <code>
         * 'section=blog&id=45'        // -> {section: 'blog', id: '45'}
         * 'section=blog&tag[]=js&tag[]=doc' // -> {section: 'blog', tag: ['js', 'doc']}
         * 'tag=ruby%20on%20rails'        // -> {tag: 'ruby on rails'}
         * 'id=45&raw'        // -> {id: '45', raw: ''}
         * </code>
         */
        unparam: function(str, sep) {
            if (typeof str !== 'string' || (str = S.trim(str)).length === 0) return {};

            var ret = {},
                pairs = str.split(sep || SEP),
                pair, key, val, m,
                i = 0, len = pairs.length;

            for (; i < len; ++i) {
                pair = pairs[i].split('=');
                key = decodeURIComponent(pair[0]);

                // decodeURIComponent will throw exception when pair[1] contains
                // GBK encoded chinese characters.
                try {
                    val = decodeURIComponent(pair[1] || EMPTY);
                } catch (ex) {
                    val = pair[1] || EMPTY;
                }

                if ((m = key.match(RE_ARR_KEY)) && m[1]) {
                    ret[m[1]] = ret[m[1]] || [];
                    ret[m[1]].push(val);
                } else {
                    ret[key] = val;
                }
            }
            return ret;
        },

        /**
         * Evalulates a script in a global context.
         */
        globalEval: function(data) {
            if (data && RE_NOT_WHITE.test(data)) {
                // Inspired by code by Andrea Giammarchi
                // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
                var head = doc.getElementsByTagName('head')[0] || docElem,
                    script = doc.createElement('script');

                // It works! All browsers support!
                script.text = data;

                // Use insertBefore instead of appendChild to circumvent an IE6 bug.
                // This arises when a base node is used.
                head.insertBefore(script, head.firstChild);
                head.removeChild(script);
            }
        },

        /**
         * Executes the supplied function in the context of the supplied
         * object 'when' milliseconds later. Executes the function a
         * single time unless periodic is set to true.
         * @param fn {Function|String} the function to execute or the name of the method in
         *        the 'o' object to execute.
         * @param when {Number} the number of milliseconds to wait until the fn is executed.
         * @param periodic {Boolean} if true, executes continuously at supplied interval
         *        until canceled.
         * @param o {Object} the context object.
         * @param data [Array] that is provided to the function. This accepts either a single
         *        item or an array. If an array is provided, the function is executed with
         *        one parameter for each array item. If you need to pass a single array
         *        parameter, it needs to be wrapped in an array [myarray].
         * @return {Object} a timer object. Call the cancel() method on this object to stop
         *         the timer.
         */
        later: function(fn, when, periodic, o, data) {
            when = when || 0;
            o = o || { };
            var m = fn, d = S.makeArray(data), f, r;

            if (S.isString(fn)) {
                m = o[fn];
            }

            if (!m) {
                S.error('method undefined');
            }

            f = function() {
                m.apply(o, d);
            };

            r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

            return {
                id: r,
                interval: periodic,
                cancel: function() {
                    if (this.interval) {
                        clearInterval(r);
                    } else {
                        clearTimeout(r);
                    }
                }
            };
        },

        /**
         * Specify a function to execute when the DOM is fully loaded.
         * @param fn {Function} A function to execute after the DOM is ready
         * <code>
         * KISSY.ready(function(S){ });
         * </code>
         * @return {KISSY}
         */
        ready: function(fn) {
            // Attach the listeners
            if (!readyBound) this._bindReady();

            // If the DOM is already ready
            if (isReady) {
                // Execute the function immediately
                fn.call(win, this);
            } else {
                // Remember the function for later
                readyList.push(fn);
            }

            return this;
        },

        /**
         * Binds ready events.
         */
        _bindReady: function() {
            var self = this,
                doScroll = doc.documentElement.doScroll,
                eventType = doScroll ? 'onreadystatechange' : 'DOMContentLoaded',
                COMPLETE = 'complete',
                fire = function() {
                    self._fireReady();
                };

            // Set to true once it runs
            readyBound = true;

            // Catch cases where ready() is called after the
            // browser event has already occurred.
            if (doc.readyState === COMPLETE) {
                return fire();
            }

            // w3c mode
            if (doc.addEventListener) {
                function domReady() {
                    doc.removeEventListener(eventType, domReady, false);
                    fire();
                }

                doc.addEventListener(eventType, domReady, false);

                // A fallback to window.onload, that will always work
                win.addEventListener('load', fire, false);
            }
            // IE event model is used
            else {
                function stateChange() {
                    if (doc.readyState === COMPLETE) {
                        doc.detachEvent(eventType, stateChange);
                        fire();
                    }
                }

                // ensure firing before onload, maybe late but safe also for iframes
                doc.attachEvent(eventType, stateChange);

                // A fallback to window.onload, that will always work.
                win.attachEvent('onload', fire);

                // If IE and not a frame
                // continually check to see if the document is ready
                var notframe = false;

                try {
                    notframe = win['frameElement'] == null;
                } catch(e) {
                }

                if (doScroll && notframe) {
                    function readyScroll() {
                        try {
                            // Ref: http://javascript.nwbox.com/IEContentLoaded/
                            doScroll('left');
                            fire();
                        } catch(ex) {
                            setTimeout(readyScroll, 1);
                        }
                    }

                    readyScroll();
                }
            }
        },

        /**
         * Executes functions bound to ready event.
         */
        _fireReady: function() {
            if (isReady) return;

            // Remember that the DOM is ready
            isReady = true;

            // If there are functions bound, to execute
            if (readyList) {
                // Execute all of them
                var fn, i = 0;
                while (fn = readyList[i++]) {
                    fn.call(win, this);
                }

                // Reset the list of functions
                readyList = null;
            }
        },

        /**
         * Executes the supplied callback when the item with the supplied id is found.
         * @param id <String> The id of the element, or an array of ids to look for.
         * @param fn <Function> What to execute when the element is found.
         */
        available: function(id, fn) {
            id = (id + EMPTY).match(RE_IDSTR)[1];
            if (!id || !S.isFunction(fn)) return;

            var retryCount = 1,

                timer = S.later(function() {
                    if (doc.getElementById(id) && (fn() || 1) || ++retryCount > POLL_RETRYS) {
                        timer.cancel();
                    }

                }, POLL_INTERVAL, true);
        }
    });

    function isValidParamValue(val) {
        var t = typeof val;
        // If the type of val is null, undefined, number, string, boolean, return true.
        return val === null || (t !== 'object' && t !== 'function');
    }

    // Converts array-like collection such as LiveNodeList to normal array.
    function slice2Arr(arr) {
        return Array.prototype.slice.call(arr);
    }
    // IE will throw error.
    try {
        slice2Arr(docElem.childNodes);
    }
    catch(e) {
        slice2Arr = function(arr) {
            for (var ret = [], i = arr.length - 1; i >= 0; i--) {
                ret[i] = arr[i];
            }
            return ret;
        }
    }

    // If url contains '?ks-debug', debug mode will turn on automatically.
    if (location && (location.search || EMPTY).indexOf('ks-debug') !== -1) {
        S.Config.debug = true;
    }
    
    S._bindReady();

})(KISSY);
/**
 * @module loader
 * @author lifesinger@gmail.com, lijing00333@163.com, yiminghe@gmail.com
 */
(function(S, undef) {

    var win = S.__HOST,
        doc = win['document'],
        head = doc.getElementsByTagName('head')[0] || doc.documentElement,

        EMPTY = '', CSSFULLPATH = 'cssfullpath',
        LOADING = 1, LOADED = 2, ERROR = 3, ATTACHED = 4,
        mix = S.mix,

        scriptOnload = doc.createElement('script').readyState ?
            function(node, callback) {
                var oldCallback = node.onreadystatechange;
                node.onreadystatechange = function() {
                    var rs = node.readyState;
                    if (rs === 'loaded' || rs === 'complete') {
                        node.onreadystatechange = null;
                        oldCallback && oldCallback();
                        callback.call(this);
                    }
                };
            } :
            function(node, callback) {
                node.addEventListener('load', callback, false);
            },

        RE_CSS = /\.css(?:\?|$)/i,
        loader;

    loader = {

        /**
         * Registers a module.
         * @param name {String} module name
         * @param fn {Function} entry point into the module that is used to bind module to KISSY
         * @param config {Object}
         * <code>
         * KISSY.add('module-name', function(S){ }, requires: ['mod1']);
         * </code>
         * <code>
         * KISSY.add({
         *     'mod-name': {
         *         fullpath: 'url',
         *         requires: ['mod1','mod2'],
         *         attach: false // ÈªòËÆ§‰∏∫ true
         *     }
         * });
         * </code>
         * @return {KISSY}
         */
        add: function(name, fn, config) {
            var self = this, mods = self.Env.mods, mod, o, oldr;

            // S.add(name, config) => S.add( { name: config } )
            if (S.isString(name) && !config && S.isPlainObject(fn)) {
                o = {};
                o[name] = fn;
                name = o;
            }

            // S.add( { name: config } )
            if (S.isPlainObject(name)) {
                S.each(name, function(v, k) {
                    v.name = k;
                    if (mods[k]) mix(v, mods[k], false); // ‰øùÁïô‰πãÂâçÊ∑ªÂä†ÁöÑÈÖçÁΩÆ
                });
                mix(mods, name);
            }
            // S.add(name[, fn[, config]])
            else {
                config = config || {};

                mod = mods[name] || {};
                name = config.host || mod.host || name;
                mod = mods[name] || {};

                // Ê≥®ÊÑèÔºöÈÄöËøá S.add(name[, fn[, config]]) Ê≥®ÂÜåÁöÑ‰ª£Á†ÅÔºåÊó†ËÆ∫ÊòØÈ°µÈù¢‰∏≠ÁöÑ‰ª£Á†ÅÔºåËøò
                //      ÊòØ js Êñá‰ª∂ÈáåÁöÑ‰ª£Á†ÅÔºåadd ÊâßË°åÊó∂ÔºåÈÉΩÊÑèÂë≥ÁùÄËØ•Ê®°ÂùóÂ∑≤Áªè LOADED
                mix(mod, { name: name, status: LOADED });

                if (!mod.fns) mod.fns = [];
                fn && mod.fns.push(fn);

                //!TODO ÊöÇÊó∂‰∏çËÄÉËôë requires Âú® add ‰∏≠ÁöÑ‰øÆÊîπ
                // Âíå order _requires ÂÖ≥ËÅîËµ∑Êù•Â§™Â§çÊùÇ
                oldr = mod['requires'];
                mix((mods[name] = mod), config);
                mods[name]['requires'] = oldr; // ‰∏çË¶ÜÁõñ

                // ÂØπ‰∫é requires ÈÉΩÂ∑≤ attached ÁöÑÊ®°ÂùóÔºåÊØîÂ¶Ç core ‰∏≠ÁöÑÊ®°ÂùóÔºåÁõ¥Êé• attach
                if ((mod['attach'] !== false) && self.__isAttached(mod.requires)) {
                    self.__attachMod(mod);
                }

                //!TODO add ‰∏≠ÊåáÂÆö‰∫Ü‰æùËµñÈ°πÔºåËøôÈáåÊ≤°ÊúâÁªßÁª≠ËΩΩ‰æùËµñÈ°π
                //self.__isAttached(mod.requires) ËøîÂõû false
            }

            return self;
        },

        /**
         * Start load specific mods, and fire callback when these mods and requires are attached.
         * <code>
         * S.use('mod-name', callback, config);
         * S.use('mod1,mod2', callback, config);
         * </code>
         * config = {
         *   order: true, // ÈªòËÆ§‰∏∫ false. ÊòØÂê¶‰∏•Ê†ºÊåâÁÖß modNames ÁöÑÊéíÂàóÈ°∫Â∫èÊù•ÂõûË∞ÉÂÖ•Âè£ÂáΩÊï∞
         *   global: KISSY // ÈªòËÆ§‰∏∫ KISSY. ÂΩìÂú® this.Env.mods ‰∏äÊâæ‰∏çÂà∞Êüê‰∏™ mod ÁöÑÂ±ûÊÄßÊó∂Ôºå‰ºöÂà∞ global.Env.mods ‰∏äÂéªÊâæ
         * }
         */
        use: function(modNames, callback, config) {
            modNames = modNames.replace(/\s+/g, EMPTY).split(',');
            config = config || {};

            var self = this, mods = self.Env.mods,
                global = (config || 0).global,
                i, len = modNames.length, mod, name, fired;

            // Â∞Ü global ‰∏äÁöÑ mods, ÁßªÂä®Âà∞ instance ‰∏ä
            if (global) self.__mixMods(global);

            // Â∑≤ÁªèÂÖ®ÈÉ® attached, Áõ¥Êé•ÊâßË°åÂõûË∞ÉÂç≥ÂèØ
            if (self.__isAttached(modNames)) {
                callback && callback(self);
                return;
            }

            // ÊúâÂ∞öÊú™ attached ÁöÑÊ®°Âùó
            for (i = 0; i < len && (mod = mods[modNames[i]]); i++) {
                if (mod.status === ATTACHED) continue;

                // ÈÄöËøáÊ∑ªÂä†‰æùËµñÔºåÊù•‰øùËØÅË∞ÉÁî®È°∫Â∫è
                if (config.order && i > 0) {
                    if (!mod.requires) mod.requires = [];
                    mod._requires = mod.requires.concat(); // ‰øùÁïôÔºå‰ª•‰æøËøòÂéü
                    name = modNames[i - 1];

                    if (!S.inArray(name, mod.requires)
                        && !(S.inArray(mod.name, mods[name].requires || []))) { // ÈÅøÂÖçÂæ™ÁéØ‰æùËµñ
                        mod.requires.push(name);
                    }
                }

                self.__attach(mod, function() {
                    if (mod._requires) {
                        mod.requires = mod._requires; // restore requires
                        delete mod._requires;
                    }
                    if (!fired && self.__isAttached(modNames)) {
                        fired = true;
                        callback && callback(self);
                    }
                }, global);
            }

            return self;
        },

        /**
         * Attach a module and all required modules.
         */
        __attach: function(mod, callback, global) {
            var self = this, requires = mod['requires'] || [],
                i = 0, len = requires.length;

            // attach all required modules
            for (; i < len; i++) {
                self.__attach(self.Env.mods[requires[i]], fn, global);
            }

            // load and attach this module
            self.__buildPath(mod);
            self.__load(mod, fn, global);

            function fn() {
                // add ÂèØËÉΩÊîπ‰∫Ü configÔºåËøôÈáåÈáçÊñ∞Âèñ‰∏ã
                var requires = mod['requires'] || [];

                if (self.__isAttached(requires)) {
                    if (mod.status === LOADED) {
                        self.__attachMod(mod);
                    }
                    if (mod.status === ATTACHED) {
                        callback();
                    }
                }
            }
        },

        __mixMods: function(global) {
            var mods = this.Env.mods, gMods = global.Env.mods, name;
            for (name in gMods) {
                this.__mixMod(mods, gMods, name, global);
            }
        },

        __mixMod: function(mods, gMods, name, global) {
            var mod = mods[name] || {}, status = mod.status;

            S.mix(mod, S.clone(gMods[name]));

            // status Â±û‰∫éÂÆû‰æãÔºåÂΩìÊúâÂÄºÊó∂Ôºå‰∏çËÉΩË¢´Ë¶ÜÁõñ„ÄÇÂè™ÊúâÊ≤°ÊúâÂàùÂßãÂÄºÊó∂ÔºåÊâç‰ªé global ‰∏äÁªßÊâø
            if (status) mod.status = status;

            // Êù•Ëá™ global ÁöÑ mod, path Â∫îËØ•Âü∫‰∫é global
            if (global) this.__buildPath(mod, global.Config.base);

            mods[name] = mod;
        },

        __attachMod: function(mod) {
            var self = this;

            if (mod.fns) {
                S.each(mod.fns, function(fn) {
                    fn && fn(self);
                });
                mod.fns = undef; // ‰øùËØÅ attach ËøáÁöÑÊñπÊ≥ïÂè™ÊâßË°å‰∏ÄÊ¨°
                //S.log(mod.name + '.status = attached');
            }

            mod.status = ATTACHED;
        },

        __isAttached: function(modNames) {
            var mods = this.Env.mods, mod,
                i = (modNames = S.makeArray(modNames)).length - 1;

            for (; i >= 0 && (mod = mods[modNames[i]]); i--) {
                if (mod.status !== ATTACHED) return false;
            }

            return true;
        },

        /**
         * Load a single module.
         */
        __load: function(mod, callback, global) {
            var self = this, url = mod['fullpath'],
                loadQueque = S.Env._loadQueue, // Ëøô‰∏™ÊòØÂÖ®Â±ÄÁöÑÔºåÈò≤Ê≠¢Â§öÂÆû‰æãÂØπÂêå‰∏ÄÊ®°ÂùóÁöÑÈáçÂ§ç‰∏ãËΩΩ
                node = loadQueque[url], ret;

            mod.status = mod.status || 0;

            // ÂèØËÉΩÂ∑≤ÁªèÁî±ÂÖ∂ÂÆÉÊ®°ÂùóËß¶ÂèëÂä†ËΩΩ
            if (mod.status < LOADING && node) {
                mod.status = node.nodeName ? LOADING : LOADED;
            }

            // Âä†ËΩΩ css, ‰ªÖÂèëÂá∫ËØ∑Ê±ÇÔºå‰∏çÂÅö‰ªª‰ΩïÂÖ∂ÂÆÉÂ§ÑÁêÜ
            if (S.isString(mod[CSSFULLPATH])) {
                self.getScript(mod[CSSFULLPATH]);
                mod[CSSFULLPATH] = LOADED;
            }

            if (mod.status < LOADING && url) {
                mod.status = LOADING;

                ret = self.getScript(url, {
                    success: function() {
                        KISSY.log(mod.name + ' is loaded.', 'info'); // ÂéãÁº©Êó∂‰∏çËøáÊª§ËØ•Âè•Ôºå‰ª•Êñπ‰æøÁ∫ø‰∏äË∞ÉËØï
                        _success();
                    },
                    error: function() {
                        mod.status = ERROR;
                        _final();
                    },
                    charset: mod.charset
                });

                // css ÊòØÂêåÊ≠•ÁöÑÔºåÂú® success ÂõûË∞ÉÈáåÔºåÂ∑≤ÁªèÂ∞Ü loadQueque[url] ÁΩÆÊàê LOADED
                // ‰∏çÈúÄË¶ÅÂÜçÁΩÆÊàêËäÇÁÇπÔºåÂê¶ÂàôÊúâÈóÆÈ¢ò
                if (!RE_CSS.test(url)) {
                    loadQueque[url] = ret;
                }
            }
            // Â∑≤ÁªèÂú®Âä†ËΩΩ‰∏≠ÔºåÈúÄË¶ÅÊ∑ªÂä†ÂõûË∞ÉÂà∞ script onload ‰∏≠
            // Ê≥®ÊÑèÔºöÊ≤°ÊúâËÄÉËôë error ÊÉÖÂΩ¢
            else if (mod.status === LOADING) {
                scriptOnload(node, _success);
            }
            // ÊòØÂÜÖÂµå‰ª£Á†ÅÔºåÊàñËÄÖÂ∑≤Áªè loaded
            else {
                callback();
            }

            function _success() {
                _final();
                if (mod.status !== ERROR) {

                    // ÂØπ‰∫éÂä®ÊÄÅ‰∏ãËΩΩ‰∏ãÊù•ÁöÑÊ®°ÂùóÔºåloaded ÂêéÔºåglobal ‰∏äÊúâÂèØËÉΩÊõ¥Êñ∞ mods ‰ø°ÊÅØÔºåÈúÄË¶ÅÂêåÊ≠•Âà∞ instance ‰∏äÂéª
                    // Ê≥®ÊÑèÔºöË¶ÅÊ±Ç mod ÂØπÂ∫îÁöÑÊñá‰ª∂ÈáåÔºå‰ªÖ‰øÆÊîπËØ• mod ‰ø°ÊÅØ
                    if (global) self.__mixMod(self.Env.mods, global.Env.mods, mod.name, global);

                    // Ê≥®ÊÑèÔºöÂΩìÂ§ö‰∏™Ê®°Âùó‰æùËµñÂêå‰∏Ä‰∏™‰∏ãËΩΩ‰∏≠ÁöÑÊ®°ÂùóA‰∏ãÔºåÊ®°ÂùóA‰ªÖÈúÄ attach ‰∏ÄÊ¨°
                    // Âõ†Ê≠§Ë¶ÅÂä†‰∏ä‰∏ãÈù¢ÁöÑ !== Âà§Êñ≠ÔºåÂê¶Âàô‰ºöÂá∫Áé∞ÈáçÂ§ç attach, ÊØîÂ¶ÇÁºñËæëÂô®ÈáåÂä®ÊÄÅÂä†ËΩΩÊó∂ÔºåË¢´‰æùËµñÁöÑÊ®°Âùó‰ºöÈáçÂ§ç
                    if (mod.status !== ATTACHED) mod.status = LOADED;

                    callback();
                }
            }

            function _final() {
                loadQueque[url] = LOADED;
            }
        },

        __buildPath: function(mod, base) {
            var Config = this.Config;

            build('path', 'fullpath');
            if (mod[CSSFULLPATH] !== LOADED) build('csspath', CSSFULLPATH);

            function build(path, fullpath) {
                if (!mod[fullpath] && mod[path]) {
                    mod[fullpath] = (base || Config.base) + mod[path];
                }
                // debug Ê®°Âºè‰∏ãÔºåÂä†ËΩΩÈùû min Áâà
                if (mod[fullpath] && Config.debug) {
                    mod[fullpath] = mod[fullpath].replace(/-min/g, '');
                }
            }
        },

        /**
         * Load a JavaScript file from the server using a GET HTTP request, then execute it.
         * <code>
         *  getScript(url, success, charset);
         *  or
         *  getScript(url, {
         *      charset: string
         *      success: fn,
         *      error: fn,
         *      timeout: number
         *  });
         * </code>
         */
        getScript: function(url, success, charset) {
            var isCSS = RE_CSS.test(url),
                node = doc.createElement(isCSS ? 'link' : 'script'),
                config = success, error, timeout, timer;

            if (S.isPlainObject(config)) {
                success = config.success;
                error = config.error;
                timeout = config.timeout;
                charset = config.charset;
            }

            if (isCSS) {
                node.href = url;
                node.rel = 'stylesheet';
            } else {
                node.src = url;
                node.async = true;
            }
            if (charset) node.charset = charset;

            if (isCSS) {
                S.isFunction(success) && success.call(node);
            } else {
                scriptOnload(node, function() {
                    if (timer) {
                        timer.cancel();
                        timer = undef;
                    }

                    S.isFunction(success) && success.call(node);

                    // remove script
                    if (head && node.parentNode) {
                        head.removeChild(node);
                    }
                });
            }

            if (S.isFunction(error)) {
                timer = S.later(function() {
                    timer = undef;
                    error();
                }, (timeout || this.Config.timeout) * 1000);
            }

            head.insertBefore(node, head.firstChild);
            return node;
        }
    };

    mix(S, loader);

    /**
     * get base from src
     * @param src script source url
     * @return base for kissy
     * @example:
     *   http://a.tbcdn.cn/s/kissy/1.1.6/??kissy-min.js,suggest/suggest-pkg-min.js
     *   http://a.tbcdn.cn/??s/kissy/1.1.6/kissy-min.js,s/kissy/1.1.5/suggest/suggest-pkg-min.js
     *   http://a.tbcdn.cn/??s/kissy/1.1.6/suggest/suggest-pkg-min.js,s/kissy/1.1.5/kissy-min.js
     *   http://a.tbcdn.cn/s/kissy/1.1.6/kissy-min.js?t=20101215.js
     * @notice: custom combo rules, such as yui3:
     *  <script src="path/to/kissy" data-combo-prefix="combo?" data-combo-sep="&"></script>
     */
    // notice: timestamp
    var baseReg = /^(.*)(seed|kissy)(-min)?\.js[^/]*/i,
        baseTestReg = /(seed|kissy)(-min)?\.js/;

    function getBaseUrl(script) {
        var src = script.src,
            prefix = script.getAttribute('data-combo-prefix') || '??',
            sep = script.getAttribute('data-combo-sep') || ',',
            parts = src.split(sep),
            base,
            part0 = parts[0],
            index = part0.indexOf(prefix);

        // no combo
        if (index == -1) {
            base = src.replace(baseReg, '$1');
        } else {
            base = part0.substring(0, index);
            var part01 = part0.substring(index + 2, part0.length);
            // combo first
            // notice use match better than test
            if (part01.match(baseTestReg)) {
                base += part01.replace(baseReg, '$1');
            }
            // combo after first
            else {
                for (var i = 1; i < parts.length; i++) {
                    var part = parts[i];
                    if (part.match(baseTestReg)) {
                        base += part.replace(baseReg, '$1');
                        break;
                    }
                }
            }
        }
        return base;
    }

    /**
     * Initializes loader.
     */
    S.__initLoader = function() {
        // get base from current script file path
        var scripts = doc.getElementsByTagName('script'),
            currentScript = scripts[scripts.length - 1],
            base = getBaseUrl(currentScript);

        this.Env.mods = {}; // all added mods
        this.Env._loadQueue = {}; // information for loading and loaded mods

        // don't override
        if(!this.Config.base) this.Config.base = base;
        if(!this.Config.timeout) this.Config.timeout = 10;   // the default timeout for getScript
    };
    S.__initLoader();

    // for S.app working properly
    S.each(loader, function(v, k) {
        S.__APP_MEMBERS.push(k);
    });
    S.__APP_INIT_METHODS.push('__initLoader');

})(KISSY);

/**
 * @module mods
 * @author lifesinger@gmail.com
 */
(function(S) {

    var map = {
        core: {
            path: 'packages/core-min.js',
            charset: 'utf-8'
        }
    };

    S.each([
        'sizzle', 'dd', 'datalazyload', // pure utilities
        'flash', // flash etc.
        'switchable', 'suggest', 'calendar', // UI components based on Base
        'uibase', 'overlay', 'imagezoom' // UI components based on UIBase
    ],
        function(modName) {
            map[modName] = {
                path: modName + '/' + modName + '-pkg-min.js',
                requires: ['core'],
                charset: 'utf-8'
            };
        });

    map['calendar'].csspath = 'calendar/default-min.css';
    map['overlay'].requires = ['uibase'];

    S.add(map);

})(KISSY);/**
 * »´æ÷ƒ£øÈ
 * @desc Ωˆ¥¶¿Ìµı∂•∫Õ“ª–©»´æ÷π¶ƒ‹µƒ‘ÿ»Î
 * @creater ‘∆«´ <yunqian@taobao.com>
 * @depends seed
 */

var TB = window['TB'] || {};
TB.namespace = TB.namespace || function() {
    KISSY.namespace.apply(TB, arguments);
};

(function() {

    var S = KISSY,
        isIE76 = !'0'[0],
        isIE6 = isIE76 && !window.XMLHttpRequest,
        isIE = !!window.ActiveXObject,
        doc = document, win = window, assetsHost, urlConfig,
        SPACE = ' ', HOVER = 'hover',

        siteNavElem,
        APPID = 'g_config' in win ? ('appId' in win['g_config'] ? parseInt(win['g_config']['appId']): undefined) : undefined ,
        MINICART_CLS = 'mini-cart', MINICART_NO_LAYER_CLS = 'mini-cart-no-layer',
        hostname = location.hostname.split('.'),
        domain = doc.domain,
        IS_TMALL = domain.indexOf('tmall.com') > -1,
        IS_DAILY = ~location.hostname.indexOf('daily.taobao.net') || ~location.hostname.indexOf('daily.tmall.net'),
        HOSTNAME = IS_DAILY ? '.daily.taobao.net' : '.taobao.com',
        EMPTY = '',
        IS_INIT = false, //  «∑Ò“—æ≠≥ı ºªØ¡À TB.Global ±Í÷æ

        savedLogoutUrl = null,

        // https «Î«Û (µ«¬º◊¢≤·“≥√Ê)
        isHTTPS = (doc.location.href.indexOf("https://") === 0),

        // À˘”–”√µΩµƒ cookie
        COOKIES = {},

        // ≥ı ºªØ∫Ø ˝∂”¡–
        runItems = {

            /**
             * ∂•Õ®
             */
            siteNav: function() {
                if (!siteNavElem) return;
                siteNavElem.setAttribute("role","navigation");
                S.each(getElementsByClassName('menu', '*', siteNavElem), function(el) {
                    TB.Global._addMenu(el);
                });
                // º‡Ã˝∂•≤øÀ—À˜Ã·Ωª
                var form = doc.forms['topSearch'];
                addEvent(form, 'submit', function() {
                    if (form['q'].value == EMPTY) { // ø’À—À˜£¨Ã¯◊™µΩŒ““™¬Ú
                        form.action = 'http://list.taobao.com/browse/cat-0.htm';
                    }
                });

                // π∫ŒÔ≥µµ«¬Ω«∞÷√
                var cartElem = getElementsByClassName('cart', 'li', siteNavElem)[0];
                addEvent(cartElem, 'click', function(e) {
                  var tg = e.target || e.srcElement;
                  if (tg.nodeName != 'A' && tg.parentNode.nodeName === 'A') {
                    tg = tg.parentNode;
                  }
                  if (tg.nodeName === 'A' && tg.href.indexOf('my_cart.htm') > -1) {
                    preventDefault(e);
                    removeClass(cartElem, 'hover');
                    TB.Cart && TB.Cart.redirect(tg, tg.href);
                    if (win.MiniCart) {
                      win.MiniCart._clicked = false;
                    }
                  }
                });

                //Œ“µƒÃ‘±¶◊Ó–¬∂ØÃ¨
                var MyRemind = "g_mytaobao_set_dynamic_count";
                var has_mouseovered = false;
                var mytaobaoElem = getElementsByClassName('mytaobao', 'li', siteNavElem)[0];
                addEvent(mytaobaoElem,'mouseover',function(e){
                    if (has_mouseovered) return;
                    if (!TB.Global.isLogin()) return;
                    has_mouseovered = true;
                    window[MyRemind] = function(data) {
                        if (!data || !data[5] || data[5]==0 ) return;
                        el = document.getElementById('myTaobaoPanel').getElementsByTagName("a")[2]
                        el.innerHTML += "<span style=\"color:#f50;\"> "+data[5]+"</span>";
                    };
                    var url="http://i"+HOSTNAME+"/json/my_taobao_remind_data.htm?from=site&t="
                    S.getScript(url + S.now() + "&callback="+MyRemind);
                });

                //ªÒ»°VIPª·‘±Ãÿ»®Õº±Í    
                var Viphas_mouseovered = false;
                var myVipElem = getElementsByClassName('user', 'span', siteNavElem)[0];
                

                addEvent(myVipElem,'mouseover',function(e){

                    var myVipStepLeftElem=getElementsByClassName('vip-stepleft', 'a', siteNavElem)[0];
                    var myVipStepRightElem=getElementsByClassName('vip-stepright', 'a', siteNavElem)[0];
                    var myVipPage;
                    var MyVipIcon = 'g_my_vip_icon';


                    if (!TB.Global.isLogin()) return;
                    if (Viphas_mouseovered) return;
                    Viphas_mouseovered = true;
                    window[MyVipIcon] = function(data) {

                        var vip_content_el = document.getElementById('J_VipContent');
                        var vip_medal_el=document.getElementById('J_VipMedal');

                        //»Áπ˚Ω”ø⁄∑µªÿ”–ŒÛ£¨ªÚ’ﬂ√ª”–—´’¬÷±Ω”…æ≥˝Ω⁄µ„≤¢÷ÿ÷√Contentµƒ∏ﬂ∂»
                        if (!data || data.isSuccess === false ){
                            vip_content_el.removeChild(vip_medal_el);
                            vip_content_el.style.height="100px";
                            return;
                        }
                        // el = document.getElementById('myTaobaoPanel').getElementsByTagName("a")[2]
                        // el.innerHTML += "<span style=\"color:#f50;\">"+data[5]+"</span>";
                        //console.log(data)
                        
                        //ªÒ»°—´’¬◊Ó¥Û∆¡ ˝
                        myVipPage=Math.ceil(data.userMedals.length/5);

                        var vip_icons = [];
                        for(var i=0;i<data.userMedals.length;i++){
                            vip_icons.push('<a title="'+data.userMedals[i].medalName+'" target="_self" href="'+ data.userMedals[i].medalUrl +'"><img src="'+ data.userMedals[i].pic +'" /></a>');
                        }
                        if (vip_icons.length === 0) {
                            vip_content_el.removeChild(vip_medal_el);
                            vip_content_el.style.height = "100px";
                        }
                        else{
                            var vip_medal_content_el = document.getElementById('J_VipMedalContent');

                            //“∆≥˝loading—˘ Ω
                            var loading_reg = new RegExp('(\\s|^)'+'vip-loading'+'(\\s|$)');
                            vip_medal_el.className=vip_medal_el.className.replace(loading_reg,'');
                            
                            vip_medal_content_el.innerHTML = vip_icons.join('');

                            
                            //»Áπ˚—´’¬ ˝¡ø≤ª≥¨π˝5∏ˆ£¨‘Ú“˛≤ÿ∑≠“≥∞¥≈•
                            if(vip_icons.length<=5){
                                myVipStepRightElem.style.display=myVipStepLeftElem.style.display='none';
                            }




                            //ƒ¨»œµ⁄“ª“≥
                            vip_medal_content_el.setAttribute("pageid","1");
                            
                            var pageid=parseInt(vip_medal_content_el.getAttribute("pageid"));

                            addEvent(myVipStepLeftElem,'click',function(e){
                                if(pageid>1){
                                    //turn left 200px;
                                    pageid=pageid-1;
                                    vip_medal_content_el.style.left='-'+ (pageid-1)*205 +'px';
                                    vip_medal_content_el.setAttribute("pageid",pageid);
                                }

                            });
                            addEvent(myVipStepRightElem,'click',function(e){
                                if(pageid<myVipPage){
                                    
                                    //turn right 200px;
                                    vip_medal_content_el.style.left='-'+ pageid*205 +'px';
                                    pageid=pageid+1;
                                    vip_medal_content_el.setAttribute("pageid",pageid);
                                }

                            });
                        }
                        
                    };
                    var nick = getCookie('_nk_') || getCookie('tracknick'); // ”√ªßÍ«≥∆£¨Session ƒ⁄”––ß
                    var url='http://vipservice'+ HOSTNAME +'/medal/GetUserVisibleMedals.do?from=diaoding&nick=';
                    S.getScript(url + nick +'&t='+ S.now() + "&callback="+MyVipIcon,{ charset: 'utf-8'});
                });
            },

            /**
             * WebWW (tdog)
             */
            tDog: function() {
                // º”‘ÿ webww js µƒø™πÿ£∫
                // £®url ÷–”– tstart/tdog ≤Œ ˝£© ªÚ £®”– g_config »´æ÷±‰¡ø£¨«“ appId ÷µ≤ªŒ™ -1£©
                if ((APPID && APPID != -1) || 'tstart' in urlConfig || 'tdog' in urlConfig) {
                    var url = 'http://' + assetsHost + '/p/header/webww-min.js?t=20110629.js',
                        times = 0;
                    S.ready(function() {
                        if (S.DOM) {
                            S.getScript(url);
                        } else {
//                            S.log('webww: try ' + times);
                            if (times < 10) {
                                setTimeout(arguments.callee, 1000);
                                times++;
                            }
                            // »Áπ˚ µ‘⁄√ª”– ks-core
                            else {
                                S.use('core', function() {
                                    S.getScript(url);
                                });
                            }
                        }
                    });
                }
            },

            /**
             * Ã‘±¶ µ—È “
             * cc @macji xiaomacji@gmail.com
             */
            tLabs: function() {
                // √ª”–µ«¬º, return ¡˜≥Ãº˚ http://img03.taobaocdn.com/tps/i3/T1EAigXlXhXXXXXXXX-660-673.png
                //if (!TB.Global.isLogin()) return;
                if (location.href.indexOf("tms.taobao.com") !== -1) return;

                S.ready(function() {
                    var url = 'http://' + assetsHost + '/p/tlabs/1.0.0/tlabs-min.js?t=1.0.0.js',
                        nick = getCookie('_nk_') || getCookie('tracknick');
                    nick = encodeURIComponent(escapeHTML(unescape(nick.replace(/\\u/g, '%u'))));
                    S.getScript(url, function() {
                        if (typeof TLabs !== 'undefined') {
                            TLabs.init({nick: nick});
                        }
                    });
                });
            },

            /**
             * POC Monitor
             *
             * @author Macji xiaohu@taobao.com
             */
            POCMonitor: function() {
              var _poc = win['_poc'] || [], option, i = 0,
                  config = [
					['_setAccount', (win['g_config'] || 0).appId],
                    ['_setStartTime', (win['g_config'] || 0).startTime || win['HUBBLE_st'] || win['g_hb_monitor_st']]
                  ],
                  rate = 10000; // …Ë÷√√¸÷–¬ 

              while ((option = _poc[i++])) {
                if (option[0] === '_setRate') {
                  rate = option[1];
                } else if (option[0] === '_setAccount') {
                  config[0] = option;
                } else if (option[0] === '_setStartTime') {
                  config[1] = option;
                } else {
                  config.push(option);
                }
              }

              // ”–’ ∫≈ && √¸÷–
              if (parseInt(Math.random() * rate) === 0) {
                win['_poc'] = config;
                S.getScript('http://a.tbcdn.cn/p/poc/m.js?v=0.0.1.js');
              }
            },

            /**
             * ≤‚ ‘ª∑æ≥÷–ÃÊªª“≥Õ∑¡¥Ω”taobao.comŒ™{test}.taobao.net
             */
            initHeaderLinks: function () {
                if (domain.indexOf('.taobao.net') === -1) return;
                var els = siteNavElem ? siteNavElem.getElementsByTagName('a') : [],
                    i = 0,
                    len = els.length,
                    hn = hostname;

                while (hn.length > 3) {
                    hn.shift();
                }

                hn = hn.join('.');

                for (; i < len; i++) {
                    els[i].href = els[i].href.replace('taobao.com', hn);
                }
            },

            /**
             * ≥ı ºªØµ«≥ˆ¡¥Ω”
             */
            // initLogout: function() {
            //     /* »Áπ˚”√ªß“—µ«¬º£¨∏¯[ÕÀ≥ˆ]¡¥Ω”◊¢≤· ¬º˛£¨œ»∑¢ÀÕ◊¢œ˙«Î«ÛµΩtaobao£¨‘ŸÃ¯◊™÷¡Ã‘±¶ ◊“≥ */
            //     var logoutEl = doc.getElementById('J_Logout');
                
            //     if (!logoutEl) return;

            //     addEvent(logoutEl, 'click', function(ev) {
            //         preventDefault(ev);
                    
            //         var logoutUrl = logoutEl.href;

            //         var img_el = new Image();

            //         img_el.src='http://login.taobao.com/member/logout.jhtml?f=top&out=true&t='+S.now();

            //         img_el.onload = img_el.onerror = function (){
         
            //             location.href = logoutUrl;
            //         }
            //     });
            // },

            /**
             * ≥ı ºªØÕ¯’æµº∫Ω“Ï≤Ωº”‘ÿ
             */
            initSiteNav: function() {
                var trigger = doc.getElementById('J_Service'), container = doc.getElementById('J_ServicesContainer'), node,
                    URL = 'http://www.taobao.com/index_inc/2010c/includes/get-services.php', CALLBACK = '__services_results';

                if (!trigger || !container) return;

                addEvent(trigger, 'mouseover', handler);
                /*aria support by ≥–”Ò*/
                addEvent(trigger,'keydown',handler);

                function handler(e) {
                    if (e.type === 'keydown' && e.keyCode !== 39 && e.keyCode !== 40) {
                        return;
                    }
                    node = S.getScript(URL + '?cb=' + CALLBACK, {
                        charset: 'gbk'
                    });
                    preventDefault(e);
                }

                window[CALLBACK] = function(html) {
                    if (node) node.parentNode.removeChild(node);
                    node = null;
                    // »∑±£“ª∂®µƒ»›¥Ì£¨µ´øº¬«µΩø…ƒ‹µƒ π”√¬ £¨π ÷ªºÚµ•µÿ¥¶¿Ìø…ƒ‹≥ˆœ÷µƒ¥ÌŒÛ
                    try {
                        container.innerHTML = html;
                        container.style.height = 'auto';
                        removeEvent(trigger, 'mouseover', handler);
                        removeEvent(trigger, 'keydown', handler);
                    } catch(e) {
                        container.style.display = 'none';
                    }
                };
            },

            /**
             * «∞∂Àµ•‘™≤‚ ‘øÚº‹‘ÿ»Î
             */
            test: function() {
                var loaded = false;
                var load = function() {
                    if (loaded) return;
                    loaded = true;
                    if (location.href.indexOf('__cloudyrun__') > -1) {
                        S.getScript('http://assets.daily.taobao.net/p/cloudyrun/1.0/cloudyrun-taobao-pkg.js?t='+(+new Date()));
                    }
                };
                S.ready(load);
                setTimeout(load, 4000);
            },

            assist: function() {
                if (getCookie('test_accouts') && document.domain.indexOf('taobao.net') > -1) {
                    S.ready(function() {
                        S.getScript('http://assets.daily.taobao.net/p/assist/login/login.js');
                    });
                }
            },

            /**
             * ≥ı ºªØ mini π∫ŒÔ≥µ
             * @author ««ª®<qiaohua@taobao.com>
             */
            miniCart: function() {
                var TG = TB.Global;
                if (TG._OFF) return;

                if (IS_TMALL || domain.indexOf('tmall.net') > -1) {
                    if (S.isUndefined(APPID)) {
                        // µ»¥˝, …Ã≥« php ªÒ»°≤ªµΩ cookie , µ´µı∂•√ø¥Œ∂ºª·∏¯ http://www.taobao.com/go/app/tmall/login-api.php ∑¢«Î«Û
                        return;
                    }
                    else if (!(getCookie('uc2') && getCookie('mt'))) {
                        // …Ã≥«”¶”√ ≤ªƒ‹ µ ±Õ¨≤Ω cookie, –Ë“™∑¢ÀÕhttp://www.taobao.com/go/app/tmall/login-api.php ∑¢«Î«Û
                        S.getScript('http://www'+HOSTNAME+'/go/app/tmall/login-api.php'+'?t='+S.now());
                        return;
                    }
                }
                TG.initMiniCart();
            },

            /**
             * »´æ÷‘ÿ»Î tb-mpp.js Ω≈±æ
             * 20110831 qiaohua: ‘› ±◊¢ ÕµÙ
             */
            mpp: function() {
                S.getScript('http://' + assetsHost + '/p/tstart/1.0/build/tb-mpp-min.js?t=201107210.js', function() {
                    // ∞≤»´÷––ƒÕ∆ÀÕœ˚œ¢,  π”√mppΩ”ø⁄
                    S.ready(function() {
                        // Œ¥µ«¬ºµƒ≤ª–Ë“™Ã· æ∞≤»´–≈œ¢
                        if (!TB.Global.isLogin()) return;

                        //type ÃÓ 1010, subType 1, java ∫Õ js ∂º”√¥À≤Œ ˝, ”…œ˚œ¢Õ®µ¿∑÷≈‰µƒ≤Œ ˝.
                        Mpp.Notify.register({appId:1010, type:1, callback: function() {
                            /*’‚∂˘ «œ˚œ¢ªÿµ˜À˘“™«Û£¨”√JSONP»°ªÿœ˚œ¢ µÃÂ*/
                            S.getScript('http://'+(IS_DAILY?'webww.daily.taobao.net:8080':'webwangwang.taobao.com') + '/getOtherSystem.do?callback=TB.Global.setUserMsg&t=' + S.now());
                        }});
                    });
                });
            },

            fpLBSBacon: function() {
                if (parseFloat(S.version) >= 1.2) {
                    var url = "http://a.tbcdn.cn/p/fp/2012/misc/lbs/??flashstorage.js,lbs.js?t=20120802.js";
                    S.getScript(url);
                }
            }

        };

    // {{{ yubo 20110817 for speeding up first screen
    var lazyItems = [ 'tDog', 'tLabs', 'test', 'mpp' ];
    for (var i = 0; i < lazyItems.length; i++) {
        (function(item) {
            var old = runItems[item];
            runItems[item] = function() {
                setTimeout(old, 1000);
            };
        })(lazyItems[i]);
    }
    // yubo }}}

    TB.Global = {

        // aria support by ≥–”Ò
        _addMenu: function(menuEl) {
            if (!menuEl) return;
            var self = this,
                menuHdEl = getElementsByClassName('menu-hd', '*', menuEl)[0],
                menuBdEl = getElementsByClassName('menu-bd', '*', menuEl)[0];

            if (!menuBdEl || !menuHdEl) return;

            menuHdEl.tabIndex = 0;
            self._subMenus.push(menuBdEl);

            menuBdEl.setAttribute("role", "menu");
            menuBdEl.setAttribute("aria-hidden", "true");

            if (!menuBdEl.getAttribute("id")) {
                menuBdEl.setAttribute("id", S.guid("menu-"));
            }

            menuHdEl.setAttribute("aria-haspopup", menuBdEl.getAttribute("id"));
            menuHdEl.setAttribute("aria-label", "”“º¸µØ≥ˆ≤Àµ•£¨tabº¸µº∫Ω£¨escπÿ±’µ±«∞≤Àµ•");

            // ÃÌº” iframe shim ≤„
            // ‘⁄ https “≥√Ê£¨µ± iframe µƒ src …ËŒ™ about:blank ª· πµ√ IE µØ≥ˆ"∞≤»´»∑»œøÚ"£¨∂¯
            // µ«¬Ω◊¢≤·“≥µƒœ¬¿≠∏≤∏««¯”Ú≤¢√ª”– SELECT ‘™Àÿ–Ë“™∏≤∏«£¨À˘“‘‘⁄’‚–©“≥√Ê÷–≤ª¥¥Ω®∂‘”¶µƒ iframe
            var iframe = false;
            if (!isHTTPS && isIE6) {
                iframe = doc.createElement('iframe');
                iframe.src = 'about: blank';
                iframe.className = 'menu-bd';
                menuEl.insertBefore(iframe, menuBdEl);
            }

            //var prt = el.parentNode;
            addEvent(menuEl, 'mouseover', function(event) {
                // Check if mouse(over|out) are still within the same parent element
                var parent = event.relatedTarget;

                // Traverse up the tree
                while (parent && parent !== menuEl) {
                    parent = parent.parentNode;
                }

                if (parent !== menuEl) {
                    S.each(self._subMenus, function(submenu) {
                        if (submenu !== menuBdEl) {
                            removeClass(submenu.parentNode, HOVER);
                            submenu.setAttribute("aria-hidden", "true");
                        }
                    });

                    //addClass(prt, HOVER);
                    addClass(menuEl, HOVER);
                    menuBdEl.setAttribute("aria-hidden", "false");

                    if (!iframe) return;
                    // ÷ª”– menulist œ‘ æ≥ˆ¿¥∫Û£¨≤≈ƒ‹ªÒ»° offset ÷µ
                    // ∏ﬂ∂»ºı 5  «“ÚŒ™ ie6 œ¬£¨iframe ¥¶¿Ì padding - bottom µƒ“ª∏ˆ bug
                    iframe.style.height = parseInt(menuBdEl.offsetHeight) + 25 + 'px';
                    iframe.style.width = parseInt(menuBdEl.offsetWidth) + 1 + 'px';
                }
            });

            addEvent(menuEl, 'mouseout', function(event) {
                // Check if mouse(over|out) are still within the same parent element
                var parent = event.relatedTarget;

                // Traverse up the tree
                while (parent && parent !== menuEl) {
                    parent = parent.parentNode;
                }

                if (parent !== menuEl) {
                    removeClass(menuEl, HOVER);

                    menuBdEl.setAttribute("aria-hidden", "true");

                    // ∏°≤„“˛≤ÿ∫Û, Ω´ el ∞¸∫¨µƒ input »•≥˝Ωπµ„
                    S.each(menuBdEl.getElementsByTagName('input'), function(el) {
                        if (el.getAttribute('type') !== 'hidden') {
                            el.blur();
                        }
                    });
                }
            });

            addEvent(menuEl, 'keydown', function(event) {
                var key = event.keyCode;
                // esc
                if (key == 27 || key == 37 || key == 38) {
                    removeClass(menuEl, HOVER);
                    menuBdEl.setAttribute("aria-hidden", "true");
                    menuHdEl.focus();
                    preventDefault(event);
                } else if (key == 39 || key == 40) {
                    addClass(menuEl, HOVER);
                    menuBdEl.setAttribute("aria-hidden", "false");
                    preventDefault(event);
                }
            });

            var hiddenTimer;
            addEvent(menuEl, isIE ? "focusin" : "focus", function() {
                if (hiddenTimer) {
                    clearTimeout(hiddenTimer);
                    hiddenTimer = null;
                }
            }, !isIE);

            addEvent(menuEl, isIE ? "focusout" : "blur", function() {
                hiddenTimer = setTimeout(function() {
                    removeClass(menuEl, HOVER);
                    menuBdEl.setAttribute("aria-hidden", "true");
                }, 100);
            }, !isIE);
        },

        /**
         * ≥ı ºªØ Global ƒ£øÈ
         */
        init: function(cfg) {
            // ∑¿÷π÷ÿ∏¥≥ı ºªØ TB.Global
            if (IS_INIT) return;
            IS_INIT = true;

            assetsHost = IS_DAILY ? 'assets.daily.taobao.net' : 'a.tbcdn.cn';
            urlConfig = S.unparam(location.search.substring(1));
            siteNavElem = doc.getElementById('site-nav');

            // minicart ø™πÿ±Í÷æ
            this._OFF = !!!siteNavElem;
            this.config = cfg;
            if (cfg && cfg.mc && cfg.mc === -1)  this._OFF = true;

            // “≥√Ê±ª«∂»Î ±, ≤ª–Ë“™Ω¯––≥ı ºªØ
            if (window.top !== window.self) {
//                S.log(['in frame, exit']);
                this._OFF = true;
            }

            // aria ÷–º«¬ºÀ˘”–≤Àµ•
            this._subMenus = [];

            for (var k in runItems) {
                runItems[k]();
            }

            // add test for global.js
            if (~location.search.indexOf('__test__=global.js')) {
              S.ready(function() {
                S.later(_test, 3000);
              });
              function _test() {
                var globalVars = ['Light', 'TLabs'];
                for (var i=0; i<globalVars.length; i++) {
                  if (typeof globalVars === 'undefined') {
                    alert('test case: failure');
                    return;
                  }
                }
                alert('test case: success');
              }
            }
        },

        /**
         * µ«¬º–≈œ¢
         * config: {memberServer:'', loginServer:'', redirectUrl:'', loginUrl:'', logoutUrl:'', forumServer:'',outmemServer:''}
         * ◊¢£∫config µƒ∏˜œÓ∂º «ø…—°œÓ
         */
        writeLoginInfo: function(config, async) {
            config = config || {};

            var self = this,
                nick = getCookie('_nk_') || getCookie('tracknick'), // ”√ªßÍ«≥∆£¨Session ƒ⁄”––ß
                ucMap = unparam(getCookie('uc1')),// user cookie ”√ªßµƒ≈‰÷√–≈œ¢
                msgCount = parseInt(ucMap['_msg_']) || 0, // ’æƒ⁄–≈Œ¥∂¡ ˝¡ø
                timeStamp = S.now(), //  ±º‰¥¡
                logoutServer = 'http://login.taobao.com',

                memberServer = config['memberServer'] || 'http://member1.taobao.com',
                outmemServer = config['outmemServer'] || 'http://outmem.taobao.com',
                loginServer = config['loginServer'] || 'https://login.taobao.com',
                loginUrl = config['loginUrl'] || loginServer + '/member/login.jhtml?f=top', // ∂‘”⁄≤ ∆±µ»”¶”√£¨÷±Ω”¥´»ÎloginUrl

                defaultRedirectUrl = location.href,
                redirectUrl, logoutUrl, regUrl, pMsgUrl, spaceUrl, output = EMPTY;

            // ∂‘”⁄µ«¬º“≥√Ê£¨µ«¬º∫Ûƒ¨»œÃ¯◊™µΩŒ“µƒÃ‘±¶°£∆‰À¸“≥√ÊÃ¯ªÿµ±«∞“≥√Ê
            if (/^http.*(\/member\/login\.jhtml)$/i.test(defaultRedirectUrl)) {
                // Œ™ø’ ±£¨∫Û∂Àª·ƒ¨»œÃ¯◊™µΩŒ“µƒÃ‘±¶
                defaultRedirectUrl = EMPTY;
            }

            redirectUrl = config['redirectUrl'] || defaultRedirectUrl;
            if (redirectUrl) loginUrl += '&redirectURL=' + encodeURIComponent(redirectUrl);

            logoutUrl = config['logoutUrl'] || logoutServer + '/member/logout.jhtml?f=top&out=true&redirectURL=' + encodeURIComponent(redirectUrl); // ◊¢œ˙url
            regUrl = memberServer + '/member/newbie.htm'; // ◊¢≤·url
            pMsgUrl = outmemServer + '/message/list_private_msg.htm?t=' + timeStamp;
            spaceUrl = 'http://i.taobao.com/my_taobao.htm?t=' + timeStamp;

            // ±£¥Ê logoutUrl£¨run() ∫Ø ˝¿Ô”–”√.
            savedLogoutUrl = logoutUrl;

            if (self.isLogin()) { // “—µ«¬º£¨œ‘ æ£∫hi£¨XXX£°[ÕÀ≥ˆ] ’æƒ⁄–≈(n)
                output = self.showVIP(logoutUrl);

                    // + '<a id="J_Logout" href="' + logoutUrl + '" target="_top">ÕÀ≥ˆ</a>'
                    // + '<a href="' + pMsgUrl + '" target="_top">’æƒ⁄–≈';
                // if (msgCount) {
                //     output += '(' + msgCount + ')';
                // }
                // output += '</a>';
            } else { // Œ¥µ«¬º£¨œ‘ æ£∫«◊£¨ª∂”≠¿¥Ã‘±¶£°[«Îµ«¬º] [√‚∑—◊¢≤·]
                output = '«◊£¨ª∂”≠¿¥Ã‘±¶£°«Î<a href="' + loginUrl + '" target="_top">µ«¬º</a>';
                output += '<a href="' + regUrl + '" target="_top">√‚∑—◊¢≤·</a>';
            }
          // {{{ added by yubo for async loading @20110816
          if (async) {
            var nav = document.getElementById('site-nav');
            if (nav) {
              var p = getElementsByClassName('login-info', '*', nav)[0];
           
              if (p && p.className === 'login-info') {
                p.innerHTML = output;
              }
            }

            return;
          }
        
          // }}}
          doc.write(output);

			if(self.showVIP(logoutUrl).length<1) return;
			
			var vipareas = document.getElementById('J_Vip_Areas');
            var timer = null;
			
            addEvent(vipareas, 'mouseover', function(e) {
                if(checkHover(e,this)){
                    timer && timer.cancel();
                    addClass(vipareas, 'user-hover');
                }
			});

			addEvent(vipareas, 'mouseout', function(e) {   
                if(checkHover(e,this)){     
                    timer && timer.cancel();
                    timer = S.later(function(){
                        removeClass(vipareas, 'user-hover'); 
                    }, 300);
                }
			});

            function contains(parentNode, childNode) {
                // if (parentNode.contains) {
                //     return parentNode != childNode && parentNode.contains(childNode);
                // } else {
                    while (childNode.nodeName !== 'BODY') {
                        if (parentNode === childNode.parentNode) {
                            return true;
                        }
                        childNode = childNode.parentNode;
                    }
                    return false;
                // }
            }

            function checkHover(e,target){
                if (getEvent(e).type=="mouseover")  {
                    return !contains(target,getEvent(e).relatedTarget||getEvent(e).fromElement) && !((getEvent(e).relatedTarget||getEvent(e).fromElement)===target);
                } else {
                    return !contains(target,getEvent(e).relatedTarget||getEvent(e).toElement) && !((getEvent(e).relatedTarget||getEvent(e).toElement)===target);
                }
            }

            function getEvent(e){
                return e||window.event;
            }
			

        },


        /**
         * µ«¬º”√ªßœ‘ æVIP Õº±Í
         * 0£∫V0ª·‘±
         * 1£∫V1ª·‘±
         * 2£∫V2ª·‘±
         * 3£∫V3ª·‘±
         * 4£∫V4ª·‘±
         * 5£∫V5ª·‘±
         * 6£∫V6ª·‘±
         * 7£∫–Ë“™º§ªÓµƒª·‘±
         * V3-V6ª·‘±‘ˆº”°∞Œ“µƒøÕ∑˛°±Õº±Í
         * -1£∫∆’Õ®ª·‘±£¨≤ª’π æ
         */
		showVIP: function(logoutUrl) {
            var tag = parseInt(unparam(getCookie('uc1'))['tag']),
                ret = EMPTY,
                vip_my_power=EMPTY,
				vip_my_service=EMPTY,
                vip_host = 'http://vip' + HOSTNAME,
                timeStamp = S.now(),
                nick = getCookie('_nk_') || getCookie('tracknick'), // ”√ªßÍ«≥∆£¨Session ƒ⁄”––ß
                spaceUrl = 'http://i.taobao.com/my_taobao.htm?t=' + timeStamp;

            
            if(tag===0 || tag===-1){
                vip_my_power='<a class="vip-my-power" href="http://vip.taobao.com/new.htm" rel="nofollow" target="_top">–¬ ÷Ãÿ—µ”™π∫ŒÔ»Î√≈</a>';
            }
            else if(tag===7){
                vip_my_power='<a class="vip-my-power" href="http://vip.taobao.com/vip_club.htm" rel="nofollow" target="_top">¡¢øÃº§ªÓŒ“µƒ…Ì∑›</a>';
            }
            else{
                vip_my_power='<a class="vip-my-power" href="http://vip.taobao.com/growth_info.htm" rel="nofollow" target="_top">≤Èø¥Œ“µƒª·‘±Ãÿ»®</a>';
            }

            if(tag===0 || tag===-1){
                vip_my_service='<a class="vip-my-service" href="http://vip.taobao.com/newuser/newGift.htm" rel="nofollow" target="_top">øÏ»•¡Ï–¬»À¿ÒΩ!</a>';
            }
            else if(tag>2&&tag<7){
                vip_my_service='<a class="vip-my-service" href="http://service.taobao.com/support/minerva/robot_main.htm?dcs=2&sourceId=400&businessId=100&moduleGroupId=taobaocrm" rel="nofollow" target="_top">Œ“µƒøÕ∑˛</a>';
            }
            else{
                vip_my_service='<a class="vip-my-service" href="http://vip.taobao.com/growth_info.htm" rel="nofollow" target="_top">Œ“µƒ≥…≥§</a>';
            }
           

            if (S.indexOf(tag, [0, 1, 2, 3, 4, 5, 6, 7]) > -1) {
				//»Áπ˚ª·‘±µ»º∂¥Û”⁄2£¨œ‘ æŒ“µƒøÕ∑˛Õº±Í
				
                //ret = '<span class="menu"><a href="'+vip_host+'" rel="nofollow" target="_top"  class="user-vip vip-icon'+tag+'"> </a></span>';
			    ret = '<span class="vip-areas user" id="J_Vip_Areas">'
                    + '<span class="vip-head">'
                    +'<a class="user-nick" href="' + spaceUrl + '" target="_top">'
                    + escapeHTML(unescape(nick.replace(/\\u/g, '%u'))) + '</a>'
					+ '<a class="vip-icon'+ tag +'" id="J_VipIcon" rel="nofollow" target="_top" href="http://vip.taobao.com/"></a>'
                    + '<b></b>'
                    + '</span>'
					+ '<span class="vip-content" id="J_VipContent">'
                    + '<a href="http://i.taobao.com/my_taobao.htm" class="avatar"><img src="http://wwc.taobaocdn.com/avatar/getAvatar.do?userNick='+encodeGBK(escapeHTML(unescape(nick.replace(/\\u/g, '%u'))))+ '&width=80&height=80&type=sns" width="80" height="80"/></a>'
					+ '<span class="vip-operate"><a href="http://member1.taobao.com/member/fresh/account_security.htm" target="_top">’ ∫≈π‹¿Ì</a><a target="_top" href="'+ logoutUrl +'" id="J_Logout">ÕÀ≥ˆ</a></span>'
                    + '<span class="vip-my-level"><a class="vip-my-level'+ tag +'" target="_top" href="http://vip.taobao.com/growth_info.htm" rel="nofollow" target="_top"></a></span>'
					+ vip_my_power
					+ vip_my_service
                    + '<span class="vip-medal vip-loading" id="J_VipMedal">'
                    + '<span class="vip-medalgroup">'
                    + '<span class="vip-medal-content" id="J_VipMedalContent">'
                    + '</span>'
                    + '</span>'
                    + '<span class="vip-step"><a href="javascript:;" target="_self" class="vip-stepleft"><s class="arrow arrow-lthin"><s></s></s></a><a href="javascript:;" target="_self" class="vip-stepright"><s class="arrow arrow-rthin"><s></s></s></a></span>'
                    + '</span>'
					+ '</span>'
                    // + '<span class="vip-login">'
                    // + '<a href="" class="vip-login-back">∑µªÿ<s class="arrow arrow-lthin"><s></s></s></a>'
                    // + '<iframe src="https://login.taobao.com/member/login.jhtml?style=mini&full_redirect=true&redirectURL=http%3A%2F%2Fwww.taobao.com%2F" frameborder="0" width="260" height="" scrolling="no"></iframe>'
                    // + '</span>'
					+ '</span>';
            }
            else{
                ret = '<span class="vip-areas user user-special" id="J_Vip_Areas">'
                    + '<span class="vip-head vip-head-special">'
                    +'<a class="user-nick" href="' + spaceUrl + '" target="_top">'
                    + escapeHTML(unescape(nick.replace(/\\u/g, '%u'))) + '</a>'                
                    + '<b></b>'
                    + '</span>'
                    + '<span class="vip-content vip-content-special" id="J_VipContent">'
                    + '<a href="http://i.taobao.com/my_taobao.htm" class="avatar"><img src="http://wwc.taobaocdn.com/avatar/getAvatar.do?userNick='+encodeURIComponent(nick)+ '&width=80&height=80&type=sns" width="80" height="80"/></a>'
                    + '<span class="vip-operate"><a href="http://member1.taobao.com/member/fresh/account_security.htm" target="_top">’ ∫≈π‹¿Ì</a><a target="_top" href="'+ logoutUrl +'" id="J_Logout">ÕÀ≥ˆ</a></span>'
                    + vip_my_power
                    + vip_my_service
                    + '<span class="vip-medal vip-loading" id="J_VipMedal">'
                    + '<span class="vip-medalgroup">'
                    + '<span class="vip-medal-content" id="J_VipMedalContent">'
                    + '</span>'
                    + '</span>'
                    + '<span class="vip-step"><a href="javascript:;" target="_self" class="vip-stepleft"><s class="arrow arrow-lthin"><s></s></s></a><a href="javascript:;" target="_self" class="vip-stepright"><s class="arrow arrow-rthin"><s></s></s></a></span>'
                    + '</span>'
                    + '</span>'
                    // + '<span class="vip-login">'
                    // + '<a href="" class="vip-login-back">∑µªÿ<s class="arrow arrow-lthin"><s></s></s></a>'
                    // + '<iframe src="https://login.taobao.com/member/login.jhtml?style=mini&full_redirect=true&redirectURL=http%3A%2F%2Fwww.taobao.com%2F" frameborder="0" width="260" height="" scrolling="no"></iframe>'
                    // + '</span>'
                    + '</span>'; 
            }

            function encodeGBK(s) {
                var img = document.createElement("img");
                // escapeDBC ∂‘∂‡◊÷Ω⁄◊÷∑˚±‡¬Îµƒ∫Ø ˝
                function escapeDBC(s) {
                    if (!s) return ""
                    if (window.ActiveXObject) {
                        // »Áπ˚ « ie,  π”√ vbscript
                        execScript('SetLocale "zh-cn"', 'vbscript');
                        return s.replace(/[\d\D]/g, function($0) {
                            window.vbsval = "";
                            execScript('window.vbsval=Hex(Asc("' + $0 + '"))', "vbscript");
                            return "%" + window.vbsval.slice(0,2) + "%" + window.vbsval.slice(-2);
                        });
                    }
                    // ∆‰À¸‰Ø¿¿∆˜¿˚”√‰Ø¿¿∆˜∂‘«Î«Ûµÿ÷∑◊‘∂Ø±‡¬ÎµƒÃÿ–‘
                    img.src = "http://www.atpanel.com/jsclick?globaljs=1&separator=" + s;
                    return img.src.split("?separator=").pop();
                }
                // ∞— ∂‡◊÷Ω⁄◊÷∑˚ ”Î µ•◊÷Ω⁄◊÷∑˚ ∑÷ø™£¨∑÷± π”√ escapeDBC ∫Õ encodeURIComponent Ω¯––±‡¬Î
                return s.replace(/([^\x00-\xff]+)|([\x00-\xff]+)/g, function($0, $1, $2) {
                    return escapeDBC($1) + encodeURIComponent($2||'');
                });
            }


   //           else if (tag === 7) { //»Áπ˚”√ªß–Ë“™º§ªÓªÚ…˝º∂£¨÷ªœ‘ æ…˝º∂GIF∂Øª≠
			//     ret = '<span class="vip-areas" id="J_Vip_Areas">'
			// 		+'<a class="vip-icon'+ tag +'" id="J_VipIcon" rel="nofollow" target="_top" href="http://vip.taobao.com"></a></span>';
   //          } else if (tag === 0) { //”√ªßµ»º∂Œ™V0£¨ƒ¨»œ√ª”–∏°≤„
			// 	ret = '<span class="vip-areas" id="J_Vip_Areas">'
			// 		+ '<a class="vip-icon'+ tag +'" id="J_VipIcon" rel="nofollow" target="_top" href="http://vip.taobao.com/"></a></span>';
			// }
			
            return ret;
        },

        /**
         * ≈–∂œ «∑Ò «µ«¬º”√ªß
         * ”√ªß «∑Ò“—æ≠µ«¬º°£◊¢“‚£∫±ÿ–ÎÕ¨ ±≈–∂œ nick ÷µ£¨“ÚŒ™ _nk_ ∫Õ _l_g_ ”– ±≤ªÕ¨≤Ω
         */
        isLogin: function() {
            /*if (win.userCookie) {
                return !!(win.userCookie._nk_);
            }*/
            var trackNick = getCookie('tracknick'),
                nick = getCookie('_nk_') || trackNick;

            return !!(getCookie('_l_g_') && nick || getCookie('ck1') && trackNick);
        },

        /**
        * µı∂• «∑Òæﬂ”–π∫ŒÔ≥µ‘™Àÿ
        */
        getCartElem: function() {
            return siteNavElem  && getElementsByClassName('cart', 'li', siteNavElem)[0];
        },

        /**
         * ≥ı ºªØ mini π∫ŒÔ≥µ
         */
        initMiniCart: function() {
            // µΩ¥À “™±£÷§”– cookie or userCookie ÷µ
            var self= this,
                CARTNUM_API = 'http://cart' + HOSTNAME
                            + '/top_cart_quantity.htm?',
                request = function() {
                    // «Î«Ûπ∫ŒÔ≥µ ˝¡ø
                    S.getScript(CARTNUM_API + 'callback=TB.Global.setCartNum' + '&t=' + S.now() + (APPID ? '&appid=' + APPID : EMPTY));
                };
            if (self._OFF = (self._OFF || !!!self.getCartElem())) return;

            var mt = unparam(getCookie('mt')), ci, cp;

            // ∂¡»° cookie ≥…π¶
            if (mt && (ci = mt.ci)) {
                ci = ci.split('_');
                cp = parseInt(ci[1]);
                ci = parseInt(ci[0]);
                //   «∑ÒπÿµÙ, true Œ™ πÿµÙ, false/undefined Œ™ ø™∆Ù
                self._OFF = ci < 0;

                if (ci < 0) {
//                    S.log('ci < 0, not request and not init minicart');
                    return;
                }
                if (self.isLogin()) {
                    if (cp === 0) {
//                        S.log('login , cp = 0, ci >= 0, requesting');
                        request();
                    } else if (cp === 1) {
//                        S.log('login , cp = 1, minicart is init.');
                        TB.Global.setCartNum(ci);
                    }
                } else {
                    if (cp === 0) {
//                        S.log('not login , cp = 0, ci >= 0, minicart is init.');
                        TB.Global.setCartNum(ci);
                    }
                    else if (cp === 1) {
//                        S.log('not login , cp = 1, ci >= 0, requesting.');
                        request();
                    }
                }
            } else {
//                S.log(['no mt, requesting']);
                request();
            }

            //this.cartRedirect('http://www.taobao.com/');
        },

        /**
         * …Ë÷√ mini π∫ŒÔ≥µµƒ ˝¡ø
         */
        setCartNum: function(num) {
            //  ≤ª”√this, ∂¯”√ TB.Global  «“ÚŒ™ detail …œ, µ˜”√ setCartNum  ± this Œ™ window ¡À
            if (!S.isNumber(num) || TB.Global._OFF) return;

            var trigger = TB.Global.getCartElem();

            if (!trigger) return;

            var elem = trigger.getElementsByTagName('a')[0],
                title = '<span class="mini-cart-line"></span><s></s>' +'π∫ŒÔ≥µ',
                // ‘⁄π∫ŒÔ≥µ“≥√Ê, ≤ªœ‘ æ∏°≤„
                showLayer = APPID !== 19;

            //  ˝¡ø–°”⁄ 0  ±
            if (num < 0) {
                // ÷ª“™”– -1 æÕ±Ì æπÿ±’
                TB.Global._OFF = num === -1;

                elem.innerHTML = title;
                removeClass(trigger, MINICART_CLS);

                win.MiniCart && win.MiniCart.hide();
                return;
            }

            elem.innerHTML = title + '<span class="mc-count' + (num < 10 ? ' mc-pt3' : EMPTY) + '">' + num + '</span>' + 'º˛' + (showLayer?'<b></b>':EMPTY);
            elem.href = 'http://ju.atpanel.com/?url=http://cart' + HOSTNAME
                      + '/my_cart.htm?from=mini&ad_id=&am_id=&cm_id=&pm_id=150042785330be233161';
            addClass(trigger, MINICART_CLS);
            if (!showLayer) {
                addClass(trigger, MINICART_NO_LAYER_CLS);
            }
            addClass(trigger, 'menu');
            addClass(elem, 'menu-hd');
            elem.id = 'mc-menu-hd';

            if (win.MiniCart) {
                win.MiniCart.cartNum = num;
                win.MiniCart.isExpired = true;
            } else {
                S.ready(function() {
                    var times = 0;
                    S.getScript('http://' + assetsHost + '/p/global/1.0/minicart-min.js?t=20110811.js', function() {
                        // minicart.js “¿¿µ”⁄ ks-core, —”≥Ÿ+ºÏ≤‚S.DOM «∑Òok
                        if (S.DOM) {
                            win.MiniCart.init(num, showLayer);
                        } else {
//                            S.log('minicart: try ' + times);
                            if (times < 10) {
                                setTimeout(arguments.callee, 1000);
                                times++;
                            }
                            // »Áπ˚ µ‘⁄√ª”– ks-core
                            else {
                                S.use('core', function() {
                                    win.MiniCart.init(num, showLayer);
                                });
                            }
                        }
                    });
                });
            }
        },

        /**
         * ∏¯ tmall œ¬‘À––ƒ«–©“¿¿µ”⁄ cookie µƒπ¶ƒ‹, ∞¸∫¨ mini π∫ŒÔ≥µ, Tlabs
         * @param cfg
         */
        run: function(cfg) {
            var self = this;

            self.initMiniCart();
            /*runItems.tLabs();*/

            // œ‘ æ vip icon
            if (self.isLogin()) {
                var times = 0;

                // µ»¥˝ login-api, …Ë÷√ DOM ∫Û, ‘Ÿº”»Î VIP ±Í÷æ, ≤ª»ªµƒª∞◊‹ «√ª”–µ«≥ˆ‘™Àÿµƒ
                S.later(function() {
                    var logoutEl = doc.getElementById('J_Logout');
//                    S.log(['tmall vip try: ', times]);
                    if (!logoutEl) {
                        if (times < 20) {
                            setTimeout(arguments.callee, 20);
                            times++;
                        }
                        return;
                    }

                    var html = self.showVIP(savedLogoutUrl || "");
                    if (html.length < 1) return;

                    var div = doc.createElement('div');
                    div.innerHTML = html;
                    logoutEl.parentNode.insertBefore(div.firstChild, logoutEl);

                    self._addMenu(div.firstChild);
                }, 30);
            }
        },

        /**
         * ∞≤»´÷––ƒµƒ”√ªßÃ· æ–≈œ¢Ω”ø⁄ªÿµ˜
         * @param data
         */
        setUserMsg: function(data) {
            if (data.success && data.success === 'true') {
                var DOM = S.DOM;
                if (!DOM) return;

                var loginElem = DOM.get('.login-info', siteNavElem),
                    offset = DOM.offset(loginElem),
                    elem = DOM.get('#gb-msg-notice'),
                    contentElem;
                // “≥√Ê…œ #gb-msg-notice ‘™Àÿ±Ì æ”√ªßœ˚œ¢»›∆˜;
                if (!elem) {
                    elem = DOM.create('<div id="gb-msg-notice"><div class="gb-msg-inner gb-msg-info"><p class="gb-msg-content">'
                        + data['result']['messages'][0]
                        + '</p><div class="gb-msg-icon gb-msg-close" title="πÿ±’"></div></div><div class="gb-msg-icon gb-msg-tri"><div class="gb-msg-icon gb-msg-tri-inner"></div></div></div>');
                    DOM.append(elem, siteNavElem.parentNode);
                    DOM.offset(elem, {
                        left: offset.left + 30,
                        top: offset.top + DOM.height(loginElem) + 1
                    });
                    S.Event.on(elem, 'click', function(e) {
                        var t = e.target;
                        if (DOM.hasClass(t, 'gb-msg-close')) {
                            DOM.hide(elem);
                        }
                    });
                } else {
                    contentElem = DOM.get('.gb-msg-content', elem);
                    DOM.html(contentElem, data['result']['messages'][0]);
                    DOM.show(elem);
                }
            }
        }
    };


  ////////////////////////////////////////
  // π∫ŒÔ≥µµ«¬Ω«∞÷√

  TB.Cart = S.merge({}, {

    domain: document.domain.indexOf('taobao.net') > -1 ? 'daily.taobao.net' : 'taobao.com',
    API:    'http://cart.%domain%/check_cart_login.htm',
    cache:  {},
    popup:  null,

    redirect: function(trigger, url) {
      var args = S.makeArray(arguments);
      var func = arguments.callee;
      var self = this;

      if (url.indexOf('ct=') === -1 && getCookie('t')) {
        url = url + (url.indexOf('?')===-1?'?':'&') + 'ct=' + getCookie('t');
      }

      if (!S.DOM || !S.Event) {
        S.getScript('http://a.tbcdn.cn/s/kissy/1.1.6/packages/core-min.js', function() {
          func.apply(self, args);
        });
        return;
      }

      this._addStyleSheetOnce();
      var guid = S.guid();
      this.cache[guid] = S.makeArray(arguments);
      S.getScript(this.API.replace('%domain%', this.domain)+'?callback=TB.Cart.redirectCallback&guid='+guid, {
        timeout: 4000,
        error: function() {
          window.top.location.href = url;
        }
      });
    },

    redirectCallback: function(data) {
      var guid = data.guid;
      var url = S.trim(this.cache[guid][1]);
      if (!data['needLogin']) {
        window.top.location.href = url;
        return;
      }
      if (!guid) {
        throw Error('[error] guid not found in callback data');
      }
      if (!this.popup) {
        this.popup = this._initPopup();
      }
      this._initLoginIframe(url);
    },

    hidePopup: function(e) {
      e && e.preventDefault && e.preventDefault();
      S.DOM.css(this.popup, 'visibility', 'hidden');
    },

    showPopup: function() {
      this._centerPopup();
      S.DOM.css(this.popup, 'visibility', 'visible');
    },

    _centerPopup: function() {
      var top = (S.DOM.viewportHeight() - parseInt(S.DOM.css(this.popup, 'height'), 10)) / 2;
      top = top < 0 ? 0 : top;
      S.DOM.css(this.popup, 'top', top);
    },

    _addStyleSheetOnce: function() {
      if (!this._stylesheetAdded) {
        S.DOM.addStyleSheet('' +
          '#g-cartlogin{position:fixed;_position:absolute;border:1px solid #aaa;left:50%;top:120px;margin-left:-206px;width:412px;height:272px;z-index:10001;background:#fafafa;-moz-box-shadow:rgba(0,0,0,0.2) 3px 3px 3px;-webkit-box-shadow:3px 3px 3px rgba(0,0,0,0.2);filter:progid:DXImageTransform.Microsoft.dropshadow(OffX=3,OffY=3,Color=#16000000,Positive=true);} #g_minicart_login_close{position:absolute;right:5px;top:5px;width:17px;height:17px;background:url(http://img01.taobaocdn.com/tps/i1/T1krl0Xk8zXXXXXXXX-194-382.png) no-repeat -100px -69px;text-indent:-999em;overflow:hidden;}' +
          '#g-cartlogin-close{cursor:pointer;position:absolute;right:5px;top:5px;width:17px;height:17px;line-height:0;overflow:hidden;background:url(http://img03.taobaocdn.com/tps/i1/T1k.tYXadGXXXXXXXX-146-77.png) no-repeat -132px 0;text-indent:-999em;}' +
          '');
        this._stylesheetAdded = true;
      }
    },

    _initPopup: function() {
      var popup = S.DOM.create('<div id="g-cartlogin"></div>');
      S.DOM.append(popup, S.DOM.get('body'));
      return popup;
    },

    _initLoginIframe: function(url) {
      var iframeSrc = 'https://login.' + this.domain + '/member/login.jhtml?from=globalcart&style=mini' +
        '&redirectURL=' + encodeURIComponent(url) + '&full_redirect=true';
      this.popup.innerHTML = '' +
        '<iframe src="'+iframeSrc+'" width="410" height="270" frameborder="0" scrolling="0"></iframe>' +
        '<span title="πÿ±’" id="g-cartlogin-close">πÿ±’</span>';
      S.Event.on('#g-cartlogin-close', 'click', this.hidePopup, this);
      this.showPopup();
    }

  });


    //////////////////////////////////////////////////////
    // Utilities

    /**
     * ªÒ»° Cookie
     */
    function getCookie(name) {
        if (win.userCookie && !S.isUndefined(win.userCookie[name])) {
            return win.userCookie[name];
        }

        if (S.isUndefined(COOKIES[name])) {
            var m = doc.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
            COOKIES[name] = (m && m[1]) ? decodeURIComponent(m[1]) : EMPTY;
        }
        return COOKIES[name];
    }

    /**
     * ±‡¬Î HTML (from prototype framework 1.4)
     */
    function escapeHTML(str) {
        var div = doc.createElement('div'),
            text = doc.createTextNode(str);
        div.appendChild(text);
        return div.innerHTML;
    }

    /**
     * Õ®π˝ ClassName ªÒ»°‘™Àÿ
     */
    function getElementsByClassName(cls, tag, context) {
        var els = context.getElementsByTagName(tag || '*'),
            ret = [], i = 0, j = 0, len = els.length, el, t;

        cls = SPACE + cls + SPACE;
        for (; i < len; ++i) {
            el = els[i];
            t = el.className;
            if (t && (SPACE + t + SPACE).indexOf(cls) > -1) {
                ret[j++] = el;
            }
        }
        return ret;
    }

    /**
     * ÃÌº” ¬º˛
     */
    function addEvent(el, type, fn, capture) {
        if (!el) return;
        if (el.addEventListener) {
            el.addEventListener(type, fn, !!capture);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, fn);
        }
    }

    /**
     * …æ≥˝ ¬º˛
     */
    function removeEvent(el, type, fn, capture) {
        if (!el) return;
        if (el.removeEventListener) {
            el.removeEventListener(type, fn, !!capture);
        } else if (el.detachEvent) {
            el.detachEvent('on' + type, fn);
        }
    }

    /**
     * ºÚ“◊∞Ê‘ˆº”/…æ≥˝‘™Àÿµƒ class
     * @param elem
     * @param cls
     */
    function addClass(elem, cls) {
        var className = SPACE + elem.className + SPACE;

        if (className.indexOf(SPACE + cls + SPACE) === -1) {
            className += cls;
            elem.className = S.trim(className);
        }
    }

    function removeClass(elem, cls) {
        var className = SPACE + elem.className + SPACE;

        if (className.indexOf(SPACE + cls + SPACE) !== -1) {
            className = className.replace(SPACE + cls + SPACE, SPACE);
            elem.className = S.trim(className);
        }
    }

    /**
     * unparam
     */
    function unparam(str) {
        if (win.userCookie && win.userCookie.version == "2") {
            return S.unparam(str, "&amp;");
        }
        return S.unparam(str);
    }

    function preventDefault(e){
        // if preventDefault exists run it on the original event
        if (e.preventDefault) {
            e.preventDefault();
        }
        // otherwise set the returnValue property of the original event to false (IE)
        else {
            e.returnValue = false;
        }
    }

})();