/*
 *http://a.tbcdn.cn/??s/yui/3.3.0/build/oop/oop.js,s/yui/3.3.0/build/event-custom/event-custom.js,s/yui/3.3.0/build/dom/dom.js,s/yui/3.3.0/build/event/event.js,s/yui/3.3.0/build/pluginhost/pluginhost.js,s/yui/3.3.0/build/node/node.js,s/yui/3.3.0/build/cookie/cookie.js,apps/et/common/js/modernizr.js,s/yui/3.3.0/build/json/json.js,apps/et/common/js/storage-lite-v1.1.js,s/yui/3.3.0/build/attribute/attribute.js,s/yui/3.3.0/build/base/base.js,apps/et/common/js/search-form.js,s/yui/3.3.0/build/jsonp/jsonp.js,apps/et/common/js/mustache.js,s/yui/3.3.0/build/intl/intl.js,s/yui/3.3.0/build/autocomplete/lang/autocomplete.js,s/yui/3.3.0/build/collection/array-extras.js,s/yui/3.3.0/build/escape/escape.js,s/yui/3.3.0/build/event-valuechange/event-valuechange.js,s/yui/3.3.0/build/dom/selector-css3.js,s/yui/3.3.0/build/classnamemanager/classnamemanager.js,s/yui/3.3.0/build/widget/widget.js,s/yui/3.3.0/build/widget/widget-position.js,s/yui/3.3.0/build/widget/widget-position-align.js,s/yui/3.3.0/build/widget/widget-stack.js,s/yui/3.3.0/build/autocomplete/autocomplete.js,s/yui/3.3.0/build/autocomplete/autocomplete-list-keys.js,s/yui/3.3.0/build/anim/anim-base.js,s/yui/3.3.0/build/anim/anim-easing.js,apps/et/common/js/slide.js,apps/et/common/js/placeholder.js,apps/et/common/widgets/suggest/js/trip-autocomplete.js,apps/et/common/widgets/calendar/js/calendar.js,apps/et/common/widgets/calendar/js/trip-calendar.v1.1.js,s/yui/3.3.0/build/widget/widget-stdmod.js,s/yui/3.3.0/build/widget/widget-position-constrain.js,s/yui/3.3.0/build/overlay/overlay.js,s/yui/3.3.0/build/dd/dd-ddm-base.js,s/yui/3.3.0/build/dd/dd-drag.js,s/yui/3.3.0/build/dd/dd-plugin.js,apps/et/common/widgets/box/js/box.js,s/yui/3.3.0/build/imageloader/imageloader.js
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('oop', function(Y) {

/**
 * Supplies object inheritance and manipulation utilities.  This adds
 * additional functionaity to what is provided in yui-base, and the
 * methods are applied directly to the YUI instance.  This module
 * is required for most YUI components.
 * @module oop
 */

/**
 * The following methods are added to the YUI instance
 * @class YUI~oop
 */

    var L = Y.Lang,
        A = Y.Array,
        OP = Object.prototype,
        CLONE_MARKER = '_~yuim~_',
        EACH = 'each',
        SOME = 'some',

        dispatch = function(o, f, c, proto, action) {
            if (o && o[action] && o !== Y) {
                return o[action].call(o, f, c);
            } else {
                switch (A.test(o)) {
                    case 1:
                        return A[action](o, f, c);
                    case 2:
                        return A[action](Y.Array(o, 0, true), f, c);
                    default:
                        return Y.Object[action](o, f, c, proto);
                }
            }
        };


    /**
     * Applies prototype properties from the supplier to the receiver.
     * The receiver can be a constructor or an instance.
     * @method augment
     * @param {function} r  the object to receive the augmentation.
     * @param {function} s  the object that supplies the properties to augment.
     * @param {boolean} ov if true, properties already on the receiver
     * will be overwritten if found on the supplier.
     * @param {string[]} wl  a whitelist.  If supplied, only properties in
     * this list will be applied to the receiver.
     * @param {Array | Any} args arg or arguments to apply to the supplier
     * constructor when initializing.
     * @return {object} the augmented object.
     *
     * @todo constructor optional?
     * @todo understanding what an instance is augmented with
     * @todo best practices for overriding sequestered methods.
     */
    Y.augment = function(r, s, ov, wl, args) {
        var sProto = s.prototype,
            newProto = null,
            construct = s,
            a = (args) ? Y.Array(args) : [],
            rProto = r.prototype,
            target = rProto || r,
            applyConstructor = false,
            sequestered, replacements;

        // working on a class, so apply constructor infrastructure
        if (rProto && construct) {
            sequestered = {};
            replacements = {};
            newProto = {};

            // sequester all of the functions in the supplier and replace with
            // one that will restore all of them.
            Y.Object.each(sProto, function(v, k) {
                replacements[k] = function() {

            // overwrite the prototype with all of the sequestered functions,
            // but only if it hasn't been overridden
                        for (var i in sequestered) {
                        if (sequestered.hasOwnProperty(i) &&
                                (this[i] === replacements[i])) {
                            this[i] = sequestered[i];
                        }
                    }

                    // apply the constructor
                    construct.apply(this, a);

                    // apply the original sequestered function
                    return sequestered[k].apply(this, arguments);
                };

                if ((!wl || (k in wl)) && (ov || !(k in this))) {
                    if (L.isFunction(v)) {
                        // sequester the function
                        sequestered[k] = v;

// replace the sequestered function with a function that will
// restore all sequestered functions and exectue the constructor.
                        this[k] = replacements[k];
                    } else {
                        this[k] = v;
                    }
                }

            }, newProto, true);

        // augmenting an instance, so apply the constructor immediately
        } else {
            applyConstructor = true;
        }

        Y.mix(target, newProto || sProto, ov, wl);

        if (applyConstructor) {
            s.apply(target, a);
        }

        return r;
    };

    /**
     * Applies object properties from the supplier to the receiver.  If
     * the target has the property, and the property is an object, the target
     * object will be augmented with the supplier's value.  If the property
     * is an array, the suppliers value will be appended to the target.
     * @method aggregate
     * @param {function} r  the object to receive the augmentation.
     * @param {function} s  the object that supplies the properties to augment.
     * @param {boolean} ov if true, properties already on the receiver
     * will be overwritten if found on the supplier.
     * @param {string[]} wl a whitelist.  If supplied, only properties in
     * this list will be applied to the receiver.
     * @return {object} the extended object.
     */
    Y.aggregate = function(r, s, ov, wl) {
        return Y.mix(r, s, ov, wl, 0, true);
    };

    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @param {function} r   the object to modify.
     * @param {function} s the object to inherit.
     * @param {object} px prototype properties to add/override.
     * @param {object} sx static properties to add/override.
     * @return {object} the extended object.
     */
    Y.extend = function(r, s, px, sx) {
        if (!s || !r) {
            Y.error('extend failed, verify dependencies');
        }

        var sp = s.prototype, rp = Y.Object(sp);
        r.prototype = rp;

        rp.constructor = r;
        r.superclass = sp;

        // assign constructor property
        if (s != Object && sp.constructor == OP.constructor) {
            sp.constructor = s;
        }

        // add prototype overrides
        if (px) {
            Y.mix(rp, px, true);
        }

        // add object overrides
        if (sx) {
            Y.mix(r, sx, true);
        }

        return r;
    };

    /**
     * Executes the supplied function for each item in
     * a collection.  Supports arrays, objects, and
     * Y.NodeLists
     * @method each
     * @param {object} o the object to iterate.
     * @param {function} f the function to execute.  This function
     * receives the value, key, and object as parameters.
     * @param {object} c the execution context for the function.
     * @param {boolean} proto if true, prototype properties are
     * iterated on objects.
     * @return {YUI} the YUI instance.
     */
    Y.each = function(o, f, c, proto) {
        return dispatch(o, f, c, proto, EACH);
    };

    /**
     * Executes the supplied function for each item in
     * a collection.  The operation stops if the function
     * returns true. Supports arrays, objects, and
     * Y.NodeLists.
     * @method some
     * @param {object} o the object to iterate.
     * @param {function} f the function to execute.  This function
     * receives the value, key, and object as parameters.
     * @param {object} c the execution context for the function.
     * @param {boolean} proto if true, prototype properties are
     * iterated on objects.
     * @return {boolean} true if the function ever returns true,
     * false otherwise.
     */
    Y.some = function(o, f, c, proto) {
        return dispatch(o, f, c, proto, SOME);
    };

    /**
     * Deep obj/array copy.  Function clones are actually
     * wrappers around the original function.
     * Array-like objects are treated as arrays.
     * Primitives are returned untouched.  Optionally, a
     * function can be provided to handle other data types,
     * filter keys, validate values, etc.
     *
     * @method clone
     * @param {object} o what to clone.
     * @param {boolean} safe if true, objects will not have prototype
     * items from the source.  If false, they will.  In this case, the
     * original is initially protected, but the clone is not completely
     * immune from changes to the source object prototype.  Also, cloned
     * prototype items that are deleted from the clone will result
     * in the value of the source prototype being exposed.  If operating
     * on a non-safe clone, items should be nulled out rather than deleted.
     * @param {function} f optional function to apply to each item in a
     * collection; it will be executed prior to applying the value to
     * the new object.  Return false to prevent the copy.
     * @param {object} c optional execution context for f.
     * @param {object} owner Owner object passed when clone is iterating
     * an object.  Used to set up context for cloned functions.
     * @param {object} cloned hash of previously cloned objects to avoid
     * multiple clones.
     * @return {Array|Object} the cloned object.
     */
    Y.clone = function(o, safe, f, c, owner, cloned) {

        if (!L.isObject(o)) {
            return o;
        }

        // @todo cloning YUI instances doesn't currently work
        if (Y.instanceOf(o, YUI)) {
            return o;
        }

        var o2, marked = cloned || {}, stamp,
            yeach = Y.each;

        switch (L.type(o)) {
            case 'date':
                return new Date(o);
            case 'regexp':
                // if we do this we need to set the flags too
                // return new RegExp(o.source);
                return o;
            case 'function':
                // o2 = Y.bind(o, owner);
                // break;
                return o;
            case 'array':
                o2 = [];
                break;
            default:

                // #2528250 only one clone of a given object should be created.
                if (o[CLONE_MARKER]) {
                    return marked[o[CLONE_MARKER]];
                }

                stamp = Y.guid();

                o2 = (safe) ? {} : Y.Object(o);

                o[CLONE_MARKER] = stamp;
                marked[stamp] = o;
        }

        // #2528250 don't try to clone element properties
        if (!o.addEventListener && !o.attachEvent) {
            yeach(o, function(v, k) {
if ((k || k === 0) && (!f || (f.call(c || this, v, k, this, o) !== false))) {
                    if (k !== CLONE_MARKER) {
                        if (k == 'prototype') {
                            // skip the prototype
                        // } else if (o[k] === o) {
                        //     this[k] = this;
                        } else {
                            this[k] =
                                Y.clone(v, safe, f, c, owner || o, marked);
                        }
                    }
                }
            }, o2);
        }

        if (!cloned) {
            Y.Object.each(marked, function(v, k) {
                if (v[CLONE_MARKER]) {
                    try {
                        delete v[CLONE_MARKER];
                    } catch (e) {
                        v[CLONE_MARKER] = null;
                    }
                }
            }, this);
            marked = null;
        }

        return o2;
    };


    /**
     * Returns a function that will execute the supplied function in the
     * supplied object's context, optionally adding any additional
     * supplied parameters to the beginning of the arguments collection the
     * supplied to the function.
     *
     * @method bind
     * @param {Function|String} f the function to bind, or a function name
     * to execute on the context object.
     * @param {object} c the execution context.
     * @param {any} args* 0..n arguments to include before the arguments the
     * function is executed with.
     * @return {function} the wrapped function.
     */
    Y.bind = function(f, c) {
        var xargs = arguments.length > 2 ?
                Y.Array(arguments, 2, true) : null;
        return function() {
            var fn = L.isString(f) ? c[f] : f,
                args = (xargs) ?
                    xargs.concat(Y.Array(arguments, 0, true)) : arguments;
            return fn.apply(c || fn, args);
        };
    };

    /**
     * Returns a function that will execute the supplied function in the
     * supplied object's context, optionally adding any additional
     * supplied parameters to the end of the arguments the function
     * is executed with.
     *
     * @method rbind
     * @param {Function|String} f the function to bind, or a function name
     * to execute on the context object.
     * @param {object} c the execution context.
     * @param {any} args* 0..n arguments to append to the end of
     * arguments collection supplied to the function.
     * @return {function} the wrapped function.
     */
    Y.rbind = function(f, c) {
        var xargs = arguments.length > 2 ? Y.Array(arguments, 2, true) : null;
        return function() {
            var fn = L.isString(f) ? c[f] : f,
                args = (xargs) ?
                    Y.Array(arguments, 0, true).concat(xargs) : arguments;
            return fn.apply(c || fn, args);
        };
    };



}, '3.3.0' );
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('event-custom-base', function(Y) {

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 */

Y.Env.evt = {
    handles: {},
    plugins: {}
};


/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

/**
 * Allows for the insertion of methods that are executed before or after
 * a specified method
 * @class Do
 * @static
 */

var DO_BEFORE = 0,
    DO_AFTER = 1,

DO = {

    /**
     * Cache of objects touched by the utility
     * @property objs
     * @static
     */
    objs: {},

    /**
     * Execute the supplied method before the specified function
     * @method before
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {string} handle for the subscription
     * @static
     */
    before: function(fn, obj, sFn, c) {
        var f = fn, a;
        if (c) {
            a = [fn, c].concat(Y.Array(arguments, 4, true));
            f = Y.rbind.apply(Y, a);
        }

        return this._inject(DO_BEFORE, f, obj, sFn);
    },

    /**
     * Execute the supplied method after the specified function
     * @method after
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return {string} handle for the subscription
     * @static
     */
    after: function(fn, obj, sFn, c) {
        var f = fn, a;
        if (c) {
            a = [fn, c].concat(Y.Array(arguments, 4, true));
            f = Y.rbind.apply(Y, a);
        }

        return this._inject(DO_AFTER, f, obj, sFn);
    },

    /**
     * Execute the supplied method after the specified function
     * @method _inject
     * @param when {string} before or after
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @return {string} handle for the subscription
     * @private
     * @static
     */
    _inject: function(when, fn, obj, sFn) {

        // object id
        var id = Y.stamp(obj), o, sid;

        if (! this.objs[id]) {
            // create a map entry for the obj if it doesn't exist
            this.objs[id] = {};
        }

        o = this.objs[id];

        if (! o[sFn]) {
            // create a map entry for the method if it doesn't exist
            o[sFn] = new Y.Do.Method(obj, sFn);

            // re-route the method to our wrapper
            obj[sFn] =
                function() {
                    return o[sFn].exec.apply(o[sFn], arguments);
                };
        }

        // subscriber id
        sid = id + Y.stamp(fn) + sFn;

        // register the callback
        o[sFn].register(sid, fn, when);

        return new Y.EventHandle(o[sFn], sid);

    },

    /**
     * Detach a before or after subscription
     * @method detach
     * @param handle {string} the subscription handle
     */
    detach: function(handle) {

        if (handle.detach) {
            handle.detach();
        }

    },

    _unload: function(e, me) {

    }
};

Y.Do = DO;

//////////////////////////////////////////////////////////////////////////

/**
 * Contains the return value from the wrapped method, accessible
 * by 'after' event listeners.
 *
 * @property Do.originalRetVal
 * @static
 * @since 2.3.0
 */

/**
 * Contains the current state of the return value, consumable by
 * 'after' event listeners, and updated if an after subscriber
 * changes the return value generated by the wrapped function.
 *
 * @property Do.currentRetVal
 * @static
 * @since 2.3.0
 */

//////////////////////////////////////////////////////////////////////////

/**
 * Wrapper for a displaced method with aop enabled
 * @class Do.Method
 * @constructor
 * @param obj The object to operate on
 * @param sFn The name of the method to displace
 */
DO.Method = function(obj, sFn) {
    this.obj = obj;
    this.methodName = sFn;
    this.method = obj[sFn];
    this.before = {};
    this.after = {};
};

/**
 * Register a aop subscriber
 * @method register
 * @param sid {string} the subscriber id
 * @param fn {Function} the function to execute
 * @param when {string} when to execute the function
 */
DO.Method.prototype.register = function (sid, fn, when) {
    if (when) {
        this.after[sid] = fn;
    } else {
        this.before[sid] = fn;
    }
};

/**
 * Unregister a aop subscriber
 * @method delete
 * @param sid {string} the subscriber id
 * @param fn {Function} the function to execute
 * @param when {string} when to execute the function
 */
DO.Method.prototype._delete = function (sid) {
    delete this.before[sid];
    delete this.after[sid];
};

/**
 * Execute the wrapped method
 * @method exec
 */
DO.Method.prototype.exec = function () {

    var args = Y.Array(arguments, 0, true),
        i, ret, newRet,
        bf = this.before,
        af = this.after,
        prevented = false;

    // execute before
    for (i in bf) {
        if (bf.hasOwnProperty(i)) {
            ret = bf[i].apply(this.obj, args);
            if (ret) {
                switch (ret.constructor) {
                    case DO.Halt:
                        return ret.retVal;
                    case DO.AlterArgs:
                        args = ret.newArgs;
                        break;
                    case DO.Prevent:
                        prevented = true;
                        break;
                    default:
                }
            }
        }
    }

    // execute method
    if (!prevented) {
        ret = this.method.apply(this.obj, args);
    }

    DO.originalRetVal = ret;
    DO.currentRetVal = ret;

    // execute after methods.
    for (i in af) {
        if (af.hasOwnProperty(i)) {
            newRet = af[i].apply(this.obj, args);
            // Stop processing if a Halt object is returned
            if (newRet && newRet.constructor == DO.Halt) {
                return newRet.retVal;
            // Check for a new return value
            } else if (newRet && newRet.constructor == DO.AlterReturn) {
                ret = newRet.newRetVal;
                // Update the static retval state
                DO.currentRetVal = ret;
            }
        }
    }

    return ret;
};

//////////////////////////////////////////////////////////////////////////

/**
 * Return an AlterArgs object when you want to change the arguments that
 * were passed into the function.  An example would be a service that scrubs
 * out illegal characters prior to executing the core business logic.
 * @class Do.AlterArgs
 */
DO.AlterArgs = function(msg, newArgs) {
    this.msg = msg;
    this.newArgs = newArgs;
};

/**
 * Return an AlterReturn object when you want to change the result returned
 * from the core method to the caller
 * @class Do.AlterReturn
 */
DO.AlterReturn = function(msg, newRetVal) {
    this.msg = msg;
    this.newRetVal = newRetVal;
};

/**
 * Return a Halt object when you want to terminate the execution
 * of all subsequent subscribers as well as the wrapped method
 * if it has not exectued yet.
 * @class Do.Halt
 */
DO.Halt = function(msg, retVal) {
    this.msg = msg;
    this.retVal = retVal;
};

/**
 * Return a Prevent object when you want to prevent the wrapped function
 * from executing, but want the remaining listeners to execute
 * @class Do.Prevent
 */
DO.Prevent = function(msg) {
    this.msg = msg;
};

/**
 * Return an Error object when you want to terminate the execution
 * of all subsequent method calls.
 * @class Do.Error
 * @deprecated use Y.Do.Halt or Y.Do.Prevent
 */
DO.Error = DO.Halt;


//////////////////////////////////////////////////////////////////////////

// Y["Event"] && Y.Event.addListener(window, "unload", Y.Do._unload, Y.Do);


/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */


// var onsubscribeType = "_event:onsub",
var AFTER = 'after',
    CONFIGS = [
        'broadcast',
        'monitored',
        'bubbles',
        'context',
        'contextFn',
        'currentTarget',
        'defaultFn',
        'defaultTargetOnly',
        'details',
        'emitFacade',
        'fireOnce',
        'async',
        'host',
        'preventable',
        'preventedFn',
        'queuable',
        'silent',
        'stoppedFn',
        'target',
        'type'
    ],

    YUI3_SIGNATURE = 9,
    YUI_LOG = 'yui:log';

/**
 * Return value from all subscribe operations
 * @class EventHandle
 * @constructor
 * @param {CustomEvent} evt the custom event.
 * @param {Subscriber} sub the subscriber.
 */
Y.EventHandle = function(evt, sub) {

    /**
     * The custom event
     * @type CustomEvent
     */
    this.evt = evt;

    /**
     * The subscriber object
     * @type Subscriber
     */
    this.sub = sub;
};

Y.EventHandle.prototype = {
    batch: function(f, c) {
        f.call(c || this, this);
        if (Y.Lang.isArray(this.evt)) {
            Y.Array.each(this.evt, function(h) {
                h.batch.call(c || h, f);
            });
        }
    },

    /**
     * Detaches this subscriber
     * @method detach
     * @return {int} the number of detached listeners
     */
    detach: function() {
        var evt = this.evt, detached = 0, i;
        if (evt) {
            if (Y.Lang.isArray(evt)) {
                for (i = 0; i < evt.length; i++) {
                    detached += evt[i].detach();
                }
            } else {
                evt._delete(this.sub);
                detached = 1;
            }

        }

        return detached;
    },

    /**
     * Monitor the event state for the subscribed event.  The first parameter
     * is what should be monitored, the rest are the normal parameters when
     * subscribing to an event.
     * @method monitor
     * @param what {string} what to monitor ('attach', 'detach', 'publish').
     * @return {EventHandle} return value from the monitor event subscription.
     */
    monitor: function(what) {
        return this.evt.monitor.apply(this.evt, arguments);
    }
};

/**
 * The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 *
 * @param {String} type The type of event, which is passed to the callback
 * when the event fires.
 * @param {object} o configuration object.
 * @class CustomEvent
 * @constructor
 */
Y.CustomEvent = function(type, o) {

    // if (arguments.length > 2) {
// this.log('CustomEvent context and silent are now in the config', 'warn', 'Event');
    // }

    o = o || {};

    this.id = Y.stamp(this);

    /**
     * The type of event, returned to subscribers when the event fires
     * @property type
     * @type string
     */
    this.type = type;

    /**
     * The context the the event will fire from by default.  Defaults to the YUI
     * instance.
     * @property context
     * @type object
     */
    this.context = Y;

    /**
     * Monitor when an event is attached or detached.
     *
     * @property monitored
     * @type boolean
     */
    // this.monitored = false;

    this.logSystem = (type == YUI_LOG);

    /**
     * If 0, this event does not broadcast.  If 1, the YUI instance is notified
     * every time this event fires.  If 2, the YUI instance and the YUI global
     * (if event is enabled on the global) are notified every time this event
     * fires.
     * @property broadcast
     * @type int
     */
    // this.broadcast = 0;

    /**
     * By default all custom events are logged in the debug build, set silent
     * to true to disable debug outpu for this event.
     * @property silent
     * @type boolean
     */
    this.silent = this.logSystem;

    /**
     * Specifies whether this event should be queued when the host is actively
     * processing an event.  This will effect exectution order of the callbacks
     * for the various events.
     * @property queuable
     * @type boolean
     * @default false
     */
    // this.queuable = false;

    /**
     * The subscribers to this event
     * @property subscribers
     * @type Subscriber {}
     */
    this.subscribers = {};

    /**
     * 'After' subscribers
     * @property afters
     * @type Subscriber {}
     */
    this.afters = {};

    /**
     * This event has fired if true
     *
     * @property fired
     * @type boolean
     * @default false;
     */
    // this.fired = false;

    /**
     * An array containing the arguments the custom event
     * was last fired with.
     * @property firedWith
     * @type Array
     */
    // this.firedWith;

    /**
     * This event should only fire one time if true, and if
     * it has fired, any new subscribers should be notified
     * immediately.
     *
     * @property fireOnce
     * @type boolean
     * @default false;
     */
    // this.fireOnce = false;

    /**
     * fireOnce listeners will fire syncronously unless async
     * is set to true
     * @property async
     * @type boolean
     * @default false
     */
    //this.async = false;

    /**
     * Flag for stopPropagation that is modified during fire()
     * 1 means to stop propagation to bubble targets.  2 means
     * to also stop additional subscribers on this target.
     * @property stopped
     * @type int
     */
    // this.stopped = 0;

    /**
     * Flag for preventDefault that is modified during fire().
     * if it is not 0, the default behavior for this event
     * @property prevented
     * @type int
     */
    // this.prevented = 0;

    /**
     * Specifies the host for this custom event.  This is used
     * to enable event bubbling
     * @property host
     * @type EventTarget
     */
    // this.host = null;

    /**
     * The default function to execute after event listeners
     * have fire, but only if the default action was not
     * prevented.
     * @property defaultFn
     * @type Function
     */
    // this.defaultFn = null;

    /**
     * The function to execute if a subscriber calls
     * stopPropagation or stopImmediatePropagation
     * @property stoppedFn
     * @type Function
     */
    // this.stoppedFn = null;

    /**
     * The function to execute if a subscriber calls
     * preventDefault
     * @property preventedFn
     * @type Function
     */
    // this.preventedFn = null;

    /**
     * Specifies whether or not this event's default function
     * can be cancelled by a subscriber by executing preventDefault()
     * on the event facade
     * @property preventable
     * @type boolean
     * @default true
     */
    this.preventable = true;

    /**
     * Specifies whether or not a subscriber can stop the event propagation
     * via stopPropagation(), stopImmediatePropagation(), or halt()
     *
     * Events can only bubble if emitFacade is true.
     *
     * @property bubbles
     * @type boolean
     * @default true
     */
    this.bubbles = true;

    /**
     * Supports multiple options for listener signatures in order to
     * port YUI 2 apps.
     * @property signature
     * @type int
     * @default 9
     */
    this.signature = YUI3_SIGNATURE;

    this.subCount = 0;
    this.afterCount = 0;

    // this.hasSubscribers = false;

    // this.hasAfters = false;

    /**
     * If set to true, the custom event will deliver an EventFacade object
     * that is similar to a DOM event object.
     * @property emitFacade
     * @type boolean
     * @default false
     */
    // this.emitFacade = false;

    this.applyConfig(o, true);

    // this.log("Creating " + this.type);

};

Y.CustomEvent.prototype = {

    hasSubs: function(when) {
        var s = this.subCount, a = this.afterCount, sib = this.sibling;

        if (sib) {
            s += sib.subCount;
            a += sib.afterCount;
        }

        if (when) {
            return (when == 'after') ? a : s;
        }

        return (s + a);
    },

    /**
     * Monitor the event state for the subscribed event.  The first parameter
     * is what should be monitored, the rest are the normal parameters when
     * subscribing to an event.
     * @method monitor
     * @param what {string} what to monitor ('detach', 'attach', 'publish').
     * @return {EventHandle} return value from the monitor event subscription.
     */
    monitor: function(what) {
        this.monitored = true;
        var type = this.id + '|' + this.type + '_' + what,
            args = Y.Array(arguments, 0, true);
        args[0] = type;
        return this.host.on.apply(this.host, args);
    },

    /**
     * Get all of the subscribers to this event and any sibling event
     * @method getSubs
     * @return {Array} first item is the on subscribers, second the after.
     */
    getSubs: function() {
        var s = Y.merge(this.subscribers), a = Y.merge(this.afters), sib = this.sibling;

        if (sib) {
            Y.mix(s, sib.subscribers);
            Y.mix(a, sib.afters);
        }

        return [s, a];
    },

    /**
     * Apply configuration properties.  Only applies the CONFIG whitelist
     * @method applyConfig
     * @param o hash of properties to apply.
     * @param force {boolean} if true, properties that exist on the event
     * will be overwritten.
     */
    applyConfig: function(o, force) {
        if (o) {
            Y.mix(this, o, force, CONFIGS);
        }
    },

    _on: function(fn, context, args, when) {

        if (!fn) {
            this.log('Invalid callback for CE: ' + this.type);
        }

        var s = new Y.Subscriber(fn, context, args, when);

        if (this.fireOnce && this.fired) {
            if (this.async) {
                setTimeout(Y.bind(this._notify, this, s, this.firedWith), 0);
            } else {
                this._notify(s, this.firedWith);
            }
        }

        if (when == AFTER) {
            this.afters[s.id] = s;
            this.afterCount++;
        } else {
            this.subscribers[s.id] = s;
            this.subCount++;
        }

        return new Y.EventHandle(this, s);

    },

    /**
     * Listen for this event
     * @method subscribe
     * @param {Function} fn The function to execute.
     * @return {EventHandle} Unsubscribe handle.
     * @deprecated use on.
     */
    subscribe: function(fn, context) {
        var a = (arguments.length > 2) ? Y.Array(arguments, 2, true) : null;
        return this._on(fn, context, a, true);
    },

    /**
     * Listen for this event
     * @method on
     * @param {Function} fn The function to execute.
     * @param {object} context optional execution context.
     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {EventHandle} An object with a detach method to detch the handler(s).
     */
    on: function(fn, context) {
        var a = (arguments.length > 2) ? Y.Array(arguments, 2, true) : null;
        if (this.host) {
            this.host._monitor('attach', this.type, {
                args: arguments
            });
        }
        return this._on(fn, context, a, true);
    },

    /**
     * Listen for this event after the normal subscribers have been notified and
     * the default behavior has been applied.  If a normal subscriber prevents the
     * default behavior, it also prevents after listeners from firing.
     * @method after
     * @param {Function} fn The function to execute.
     * @param {object} context optional execution context.
     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {EventHandle} handle Unsubscribe handle.
     */
    after: function(fn, context) {
        var a = (arguments.length > 2) ? Y.Array(arguments, 2, true) : null;
        return this._on(fn, context, a, AFTER);
    },

    /**
     * Detach listeners.
     * @method detach
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed.
     * @param {Object}   context The context object passed to subscribe.
     * @return {int} returns the number of subscribers unsubscribed.
     */
    detach: function(fn, context) {
        // unsubscribe handle
        if (fn && fn.detach) {
            return fn.detach();
        }

        var i, s,
            found = 0,
            subs = Y.merge(this.subscribers, this.afters);

        for (i in subs) {
            if (subs.hasOwnProperty(i)) {
                s = subs[i];
                if (s && (!fn || fn === s.fn)) {
                    this._delete(s);
                    found++;
                }
            }
        }

        return found;
    },

    /**
     * Detach listeners.
     * @method unsubscribe
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed.
     * @param {Object}   context The context object passed to subscribe.
     * @return {int|undefined} returns the number of subscribers unsubscribed.
     * @deprecated use detach.
     */
    unsubscribe: function() {
        return this.detach.apply(this, arguments);
    },

    /**
     * Notify a single subscriber
     * @method _notify
     * @param {Subscriber} s the subscriber.
     * @param {Array} args the arguments array to apply to the listener.
     * @private
     */
    _notify: function(s, args, ef) {

        this.log(this.type + '->' + 'sub: ' + s.id);

        var ret;

        ret = s.notify(args, this);

        if (false === ret || this.stopped > 1) {
            this.log(this.type + ' cancelled by subscriber');
            return false;
        }

        return true;
    },

    /**
     * Logger abstraction to centralize the application of the silent flag
     * @method log
     * @param {string} msg message to log.
     * @param {string} cat log category.
     */
    log: function(msg, cat) {
        if (!this.silent) {
        }
    },

    /**
     * Notifies the subscribers.  The callback functions will be executed
     * from the context specified when the event was created, and with the
     * following parameters:
     *   <ul>
     *   <li>The type of event</li>
     *   <li>All of the arguments fire() was executed with as an array</li>
     *   <li>The custom object (if any) that was passed into the subscribe()
     *       method</li>
     *   </ul>
     * @method fire
     * @param {Object*} arguments an arbitrary set of parameters to pass to
     *                            the handler.
     * @return {boolean} false if one of the subscribers returned false,
     *                   true otherwise.
     *
     */
    fire: function() {
        if (this.fireOnce && this.fired) {
            this.log('fireOnce event: ' + this.type + ' already fired');
            return true;
        } else {

            var args = Y.Array(arguments, 0, true);

            // this doesn't happen if the event isn't published
            // this.host._monitor('fire', this.type, args);

            this.fired = true;
            this.firedWith = args;

            if (this.emitFacade) {
                return this.fireComplex(args);
            } else {
                return this.fireSimple(args);
            }
        }
    },

    fireSimple: function(args) {
        this.stopped = 0;
        this.prevented = 0;
        if (this.hasSubs()) {
            // this._procSubs(Y.merge(this.subscribers, this.afters), args);
            var subs = this.getSubs();
            this._procSubs(subs[0], args);
            this._procSubs(subs[1], args);
        }
        this._broadcast(args);
        return this.stopped ? false : true;
    },

    // Requires the event-custom-complex module for full funcitonality.
    fireComplex: function(args) {
        args[0] = args[0] || {};
        return this.fireSimple(args);
    },

    _procSubs: function(subs, args, ef) {
        var s, i;
        for (i in subs) {
            if (subs.hasOwnProperty(i)) {
                s = subs[i];
                if (s && s.fn) {
                    if (false === this._notify(s, args, ef)) {
                        this.stopped = 2;
                    }
                    if (this.stopped == 2) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    _broadcast: function(args) {
        if (!this.stopped && this.broadcast) {

            var a = Y.Array(args);
            a.unshift(this.type);

            if (this.host !== Y) {
                Y.fire.apply(Y, a);
            }

            if (this.broadcast == 2) {
                Y.Global.fire.apply(Y.Global, a);
            }
        }
    },

    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {int} The number of listeners unsubscribed.
     * @deprecated use detachAll.
     */
    unsubscribeAll: function() {
        return this.detachAll.apply(this, arguments);
    },

    /**
     * Removes all listeners
     * @method detachAll
     * @return {int} The number of listeners unsubscribed.
     */
    detachAll: function() {
        return this.detach();
    },

    /**
     * @method _delete
     * @param subscriber object.
     * @private
     */
    _delete: function(s) {
        if (s) {
            if (this.subscribers[s.id]) {
                delete this.subscribers[s.id];
                this.subCount--;
            }
            if (this.afters[s.id]) {
                delete this.afters[s.id];
                this.afterCount--;
            }
        }

        if (this.host) {
            this.host._monitor('detach', this.type, {
                ce: this,
                sub: s
            });
        }

        if (s) {
            // delete s.fn;
            // delete s.context;
            s.deleted = true;
        }
    }
};

/////////////////////////////////////////////////////////////////////

/**
 * Stores the subscriber information to be used when the event fires.
 * @param {Function} fn       The wrapped function to execute.
 * @param {Object}   context  The value of the keyword 'this' in the listener.
 * @param {Array} args*       0..n additional arguments to supply the listener.
 *
 * @class Subscriber
 * @constructor
 */
Y.Subscriber = function(fn, context, args) {

    /**
     * The callback that will be execute when the event fires
     * This is wrapped by Y.rbind if obj was supplied.
     * @property fn
     * @type Function
     */
    this.fn = fn;

    /**
     * Optional 'this' keyword for the listener
     * @property context
     * @type Object
     */
    this.context = context;

    /**
     * Unique subscriber id
     * @property id
     * @type String
     */
    this.id = Y.stamp(this);

    /**
     * Additional arguments to propagate to the subscriber
     * @property args
     * @type Array
     */
    this.args = args;

    /**
     * Custom events for a given fire transaction.
     * @property events
     * @type {EventTarget}
     */
    // this.events = null;

    /**
     * This listener only reacts to the event once
     * @property once
     */
    // this.once = false;

};

Y.Subscriber.prototype = {

    _notify: function(c, args, ce) {
        if (this.deleted && !this.postponed) {
            if (this.postponed) {
                delete this.fn;
                delete this.context;
            } else {
                delete this.postponed;
                return null;
            }
        }
        var a = this.args, ret;
        switch (ce.signature) {
            case 0:
                ret = this.fn.call(c, ce.type, args, c);
                break;
            case 1:
                ret = this.fn.call(c, args[0] || null, c);
                break;
            default:
                if (a || args) {
                    args = args || [];
                    a = (a) ? args.concat(a) : args;
                    ret = this.fn.apply(c, a);
                } else {
                    ret = this.fn.call(c);
                }
        }

        if (this.once) {
            ce._delete(this);
        }

        return ret;
    },

    /**
     * Executes the subscriber.
     * @method notify
     * @param args {Array} Arguments array for the subscriber.
     * @param ce {CustomEvent} The custom event that sent the notification.
     */
    notify: function(args, ce) {
        var c = this.context,
            ret = true;

        if (!c) {
            c = (ce.contextFn) ? ce.contextFn() : ce.context;
        }

        // only catch errors if we will not re-throw them.
        if (Y.config.throwFail) {
            ret = this._notify(c, args, ce);
        } else {
            try {
                ret = this._notify(c, args, ce);
            } catch (e) {
                Y.error(this + ' failed: ' + e.message, e);
            }
        }

        return ret;
    },

    /**
     * Returns true if the fn and obj match this objects properties.
     * Used by the unsubscribe method to match the right subscriber.
     *
     * @method contains
     * @param {Function} fn the function to execute.
     * @param {Object} context optional 'this' keyword for the listener.
     * @return {boolean} true if the supplied arguments match this
     *                   subscriber's signature.
     */
    contains: function(fn, context) {
        if (context) {
            return ((this.fn == fn) && this.context == context);
        } else {
            return (this.fn == fn);
        }
    }

};

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

/**
 * EventTarget provides the implementation for any object to
 * publish, subscribe and fire to custom events, and also
 * alows other EventTargets to target the object with events
 * sourced from the other object.
 * EventTarget is designed to be used with Y.augment to wrap
 * EventCustom in an interface that allows events to be listened to
 * and fired by name.  This makes it possible for implementing code to
 * subscribe to an event that either has not been created yet, or will
 * not be created at all.
 * @class EventTarget
 * @param opts a configuration object
 * @config emitFacade {boolean} if true, all events will emit event
 * facade payloads by default (default false)
 * @config prefix {string} the prefix to apply to non-prefixed event names
 * @config chain {boolean} if true, on/after/detach return the host to allow
 * chaining, otherwise they return an EventHandle (default false)
 */

var L = Y.Lang,
    PREFIX_DELIMITER = ':',
    CATEGORY_DELIMITER = '|',
    AFTER_PREFIX = '~AFTER~',
    YArray = Y.Array,

    _wildType = Y.cached(function(type) {
        return type.replace(/(.*)(:)(.*)/, "*$2$3");
    }),

    /**
     * If the instance has a prefix attribute and the
     * event type is not prefixed, the instance prefix is
     * applied to the supplied type.
     * @method _getType
     * @private
     */
    _getType = Y.cached(function(type, pre) {

        if (!pre || !L.isString(type) || type.indexOf(PREFIX_DELIMITER) > -1) {
            return type;
        }

        return pre + PREFIX_DELIMITER + type;
    }),

    /**
     * Returns an array with the detach key (if provided),
     * and the prefixed event name from _getType
     * Y.on('detachcategory| menu:click', fn)
     * @method _parseType
     * @private
     */
    _parseType = Y.cached(function(type, pre) {

        var t = type, detachcategory, after, i;

        if (!L.isString(t)) {
            return t;
        }

        i = t.indexOf(AFTER_PREFIX);

        if (i > -1) {
            after = true;
            t = t.substr(AFTER_PREFIX.length);
        }

        i = t.indexOf(CATEGORY_DELIMITER);

        if (i > -1) {
            detachcategory = t.substr(0, (i));
            t = t.substr(i+1);
            if (t == '*') {
                t = null;
            }
        }

        // detach category, full type with instance prefix, is this an after listener, short type
        return [detachcategory, (pre) ? _getType(t, pre) : t, after, t];
    }),

    ET = function(opts) {


        var o = (L.isObject(opts)) ? opts : {};

        this._yuievt = this._yuievt || {

            id: Y.guid(),

            events: {},

            targets: {},

            config: o,

            chain: ('chain' in o) ? o.chain : Y.config.chain,

            bubbling: false,

            defaults: {
                context: o.context || this,
                host: this,
                emitFacade: o.emitFacade,
                fireOnce: o.fireOnce,
                queuable: o.queuable,
                monitored: o.monitored,
                broadcast: o.broadcast,
                defaultTargetOnly: o.defaultTargetOnly,
                bubbles: ('bubbles' in o) ? o.bubbles : true
            }
        };

    };


ET.prototype = {

    /**
     * Listen to a custom event hosted by this object one time.
     * This is the equivalent to <code>on</code> except the
     * listener is immediatelly detached when it is executed.
     * @method once
     * @param type    {string}   The type of the event
     * @param fn {Function} The callback
     * @param context {object} optional execution context.
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return the event target or a detach handle per 'chain' config
     */
    once: function() {
        var handle = this.on.apply(this, arguments);
        handle.batch(function(hand) {
            if (hand.sub) {
                hand.sub.once = true;
            }
        });
        return handle;
    },

    /**
     * Takes the type parameter passed to 'on' and parses out the
     * various pieces that could be included in the type.  If the
     * event type is passed without a prefix, it will be expanded
     * to include the prefix one is supplied or the event target
     * is configured with a default prefix.
     * @method parseType
     * @param {string} type the type
     * @param {string} [pre=this._yuievt.config.prefix] the prefix
     * @since 3.3.0
     * @return {Array} an array containing:
     *  * the detach category, if supplied,
     *  * the prefixed event type,
     *  * whether or not this is an after listener,
     *  * the supplied event type
     */
    parseType: function(type, pre) {
        return _parseType(type, pre || this._yuievt.config.prefix);
    },

    /**
     * Subscribe to a custom event hosted by this object
     * @method on
     * @param type    {string}   The type of the event
     * @param fn {Function} The callback
     * @param context {object} optional execution context.
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return the event target or a detach handle per 'chain' config
     */
    on: function(type, fn, context) {

        var parts = _parseType(type, this._yuievt.config.prefix), f, c, args, ret, ce,
            detachcategory, handle, store = Y.Env.evt.handles, after, adapt, shorttype,
            Node = Y.Node, n, domevent, isArr;

        // full name, args, detachcategory, after
        this._monitor('attach', parts[1], {
            args: arguments,
            category: parts[0],
            after: parts[2]
        });

        if (L.isObject(type)) {

            if (L.isFunction(type)) {
                return Y.Do.before.apply(Y.Do, arguments);
            }

            f = fn;
            c = context;
            args = YArray(arguments, 0, true);
            ret = [];

            if (L.isArray(type)) {
                isArr = true;
            }

            after = type._after;
            delete type._after;

            Y.each(type, function(v, k) {

                if (L.isObject(v)) {
                    f = v.fn || ((L.isFunction(v)) ? v : f);
                    c = v.context || c;
                }

                var nv = (after) ? AFTER_PREFIX : '';

                args[0] = nv + ((isArr) ? v : k);
                args[1] = f;
                args[2] = c;

                ret.push(this.on.apply(this, args));

            }, this);

            return (this._yuievt.chain) ? this : new Y.EventHandle(ret);

        }

        detachcategory = parts[0];
        after = parts[2];
        shorttype = parts[3];

        // extra redirection so we catch adaptor events too.  take a look at this.
        if (Node && Y.instanceOf(this, Node) && (shorttype in Node.DOM_EVENTS)) {
            args = YArray(arguments, 0, true);
            args.splice(2, 0, Node.getDOMNode(this));
            return Y.on.apply(Y, args);
        }

        type = parts[1];

        if (Y.instanceOf(this, YUI)) {

            adapt = Y.Env.evt.plugins[type];
            args  = YArray(arguments, 0, true);
            args[0] = shorttype;

            if (Node) {
                n = args[2];

                if (Y.instanceOf(n, Y.NodeList)) {
                    n = Y.NodeList.getDOMNodes(n);
                } else if (Y.instanceOf(n, Node)) {
                    n = Node.getDOMNode(n);
                }

                domevent = (shorttype in Node.DOM_EVENTS);

                // Captures both DOM events and event plugins.
                if (domevent) {
                    args[2] = n;
                }
            }

            // check for the existance of an event adaptor
            if (adapt) {
                handle = adapt.on.apply(Y, args);
            } else if ((!type) || domevent) {
                handle = Y.Event._attach(args);
            }

        }

        if (!handle) {
            ce = this._yuievt.events[type] || this.publish(type);
            handle = ce._on(fn, context, (arguments.length > 3) ? YArray(arguments, 3, true) : null, (after) ? 'after' : true);
        }

        if (detachcategory) {
            store[detachcategory] = store[detachcategory] || {};
            store[detachcategory][type] = store[detachcategory][type] || [];
            store[detachcategory][type].push(handle);
        }

        return (this._yuievt.chain) ? this : handle;

    },

    /**
     * subscribe to an event
     * @method subscribe
     * @deprecated use on
     */
    subscribe: function() {
        return this.on.apply(this, arguments);
    },

    /**
     * Detach one or more listeners the from the specified event
     * @method detach
     * @param type {string|Object}   Either the handle to the subscriber or the
     *                        type of event.  If the type
     *                        is not specified, it will attempt to remove
     *                        the listener from all hosted events.
     * @param fn   {Function} The subscribed function to unsubscribe, if not
     *                          supplied, all subscribers will be removed.
     * @param context  {Object}   The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {EventTarget} the host
     */
    detach: function(type, fn, context) {
        var evts = this._yuievt.events, i,
            Node = Y.Node, isNode = Node && (Y.instanceOf(this, Node));

        // detachAll disabled on the Y instance.
        if (!type && (this !== Y)) {
            for (i in evts) {
                if (evts.hasOwnProperty(i)) {
                    evts[i].detach(fn, context);
                }
            }
            if (isNode) {
                Y.Event.purgeElement(Node.getDOMNode(this));
            }

            return this;
        }

        var parts = _parseType(type, this._yuievt.config.prefix),
        detachcategory = L.isArray(parts) ? parts[0] : null,
        shorttype = (parts) ? parts[3] : null,
        adapt, store = Y.Env.evt.handles, detachhost, cat, args,
        ce,

        keyDetacher = function(lcat, ltype, host) {
            var handles = lcat[ltype], ce, i;
            if (handles) {
                for (i = handles.length - 1; i >= 0; --i) {
                    ce = handles[i].evt;
                    if (ce.host === host || ce.el === host) {
                        handles[i].detach();
                    }
                }
            }
        };

        if (detachcategory) {

            cat = store[detachcategory];
            type = parts[1];
            detachhost = (isNode) ? Y.Node.getDOMNode(this) : this;

            if (cat) {
                if (type) {
                    keyDetacher(cat, type, detachhost);
                } else {
                    for (i in cat) {
                        if (cat.hasOwnProperty(i)) {
                            keyDetacher(cat, i, detachhost);
                        }
                    }
                }

                return this;
            }

        // If this is an event handle, use it to detach
        } else if (L.isObject(type) && type.detach) {
            type.detach();
            return this;
        // extra redirection so we catch adaptor events too.  take a look at this.
        } else if (isNode && ((!shorttype) || (shorttype in Node.DOM_EVENTS))) {
            args = YArray(arguments, 0, true);
            args[2] = Node.getDOMNode(this);
            Y.detach.apply(Y, args);
            return this;
        }

        adapt = Y.Env.evt.plugins[shorttype];

        // The YUI instance handles DOM events and adaptors
        if (Y.instanceOf(this, YUI)) {
            args = YArray(arguments, 0, true);
            // use the adaptor specific detach code if
            if (adapt && adapt.detach) {
                adapt.detach.apply(Y, args);
                return this;
            // DOM event fork
            } else if (!type || (!adapt && Node && (type in Node.DOM_EVENTS))) {
                args[0] = type;
                Y.Event.detach.apply(Y.Event, args);
                return this;
            }
        }

        // ce = evts[type];
        ce = evts[parts[1]];
        if (ce) {
            ce.detach(fn, context);
        }

        return this;
    },

    /**
     * detach a listener
     * @method unsubscribe
     * @deprecated use detach
     */
    unsubscribe: function() {
        return this.detach.apply(this, arguments);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method detachAll
     * @param type {string}   The type, or name of the event
     */
    detachAll: function(type) {
        return this.detach(type);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method unsubscribeAll
     * @param type {string}   The type, or name of the event
     * @deprecated use detachAll
     */
    unsubscribeAll: function() {
        return this.detachAll.apply(this, arguments);
    },

    /**
     * Creates a new custom event of the specified type.  If a custom event
     * by that name already exists, it will not be re-created.  In either
     * case the custom event is returned.
     *
     * @method publish
     *
     * @param type {string} the type, or name of the event
     * @param opts {object} optional config params.  Valid properties are:
     *
     *  <ul>
     *    <li>
     *   'broadcast': whether or not the YUI instance and YUI global are notified when the event is fired (false)
     *    </li>
     *    <li>
     *   'bubbles': whether or not this event bubbles (true)
     *              Events can only bubble if emitFacade is true.
     *    </li>
     *    <li>
     *   'context': the default execution context for the listeners (this)
     *    </li>
     *    <li>
     *   'defaultFn': the default function to execute when this event fires if preventDefault was not called
     *    </li>
     *    <li>
     *   'emitFacade': whether or not this event emits a facade (false)
     *    </li>
     *    <li>
     *   'prefix': the prefix for this targets events, e.g., 'menu' in 'menu:click'
     *    </li>
     *    <li>
     *   'fireOnce': if an event is configured to fire once, new subscribers after
     *   the fire will be notified immediately.
     *    </li>
     *    <li>
     *   'async': fireOnce event listeners will fire synchronously if the event has already
     *    fired unless async is true.
     *    </li>
     *    <li>
     *   'preventable': whether or not preventDefault() has an effect (true)
     *    </li>
     *    <li>
     *   'preventedFn': a function that is executed when preventDefault is called
     *    </li>
     *    <li>
     *   'queuable': whether or not this event can be queued during bubbling (false)
     *    </li>
     *    <li>
     *   'silent': if silent is true, debug messages are not provided for this event.
     *    </li>
     *    <li>
     *   'stoppedFn': a function that is executed when stopPropagation is called
     *    </li>
     *
     *    <li>
     *   'monitored': specifies whether or not this event should send notifications about
     *   when the event has been attached, detached, or published.
     *    </li>
     *    <li>
     *   'type': the event type (valid option if not provided as the first parameter to publish)
     *    </li>
     *  </ul>
     *
     *  @return {CustomEvent} the custom event
     *
     */
    publish: function(type, opts) {
        var events, ce, ret, defaults,
            edata    = this._yuievt,
            pre      = edata.config.prefix;

        type = (pre) ? _getType(type, pre) : type;

        this._monitor('publish', type, {
            args: arguments
        });

        if (L.isObject(type)) {
            ret = {};
            Y.each(type, function(v, k) {
                ret[k] = this.publish(k, v || opts);
            }, this);

            return ret;
        }

        events = edata.events;
        ce = events[type];

        if (ce) {
// ce.log("publish applying new config to published event: '"+type+"' exists", 'info', 'event');
            if (opts) {
                ce.applyConfig(opts, true);
            }
        } else {

            defaults = edata.defaults;

            // apply defaults
            ce = new Y.CustomEvent(type,
                                  (opts) ? Y.merge(defaults, opts) : defaults);
            events[type] = ce;
        }

        // make sure we turn the broadcast flag off if this
        // event was published as a result of bubbling
        // if (opts instanceof Y.CustomEvent) {
          //   events[type].broadcast = false;
        // }

        return events[type];
    },

    /**
     * This is the entry point for the event monitoring system.
     * You can monitor 'attach', 'detach', 'fire', and 'publish'.
     * When configured, these events generate an event.  click ->
     * click_attach, click_detach, click_publish -- these can
     * be subscribed to like other events to monitor the event
     * system.  Inividual published events can have monitoring
     * turned on or off (publish can't be turned off before it
     * it published) by setting the events 'monitor' config.
     *
     * @private
     */
    _monitor: function(what, type, o) {
        var monitorevt, ce = this.getEvent(type);
        if ((this._yuievt.config.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {
            monitorevt = type + '_' + what;
            o.monitored = what;
            this.fire.call(this, monitorevt, o);
        }
    },

   /**
     * Fire a custom event by name.  The callback functions will be executed
     * from the context specified when the event was created, and with the
     * following parameters.
     *
     * If the custom event object hasn't been created, then the event hasn't
     * been published and it has no subscribers.  For performance sake, we
     * immediate exit in this case.  This means the event won't bubble, so
     * if the intention is that a bubble target be notified, the event must
     * be published on this object first.
     *
     * The first argument is the event type, and any additional arguments are
     * passed to the listeners as parameters.  If the first of these is an
     * object literal, and the event is configured to emit an event facade,
     * that object is mixed into the event facade and the facade is provided
     * in place of the original object.
     *
     * @method fire
     * @param type {String|Object} The type of the event, or an object that contains
     * a 'type' property.
     * @param arguments {Object*} an arbitrary set of parameters to pass to
     * the handler.  If the first of these is an object literal and the event is
     * configured to emit an event facade, the event facade will replace that
     * parameter after the properties the object literal contains are copied to
     * the event facade.
     * @return {EventTarget} the event host
     *
     */
    fire: function(type) {

        var typeIncluded = L.isString(type),
            t = (typeIncluded) ? type : (type && type.type),
            ce, ret, pre = this._yuievt.config.prefix, ce2,
            args = (typeIncluded) ? YArray(arguments, 1, true) : arguments;

        t = (pre) ? _getType(t, pre) : t;

        this._monitor('fire', t, {
            args: args
        });

        ce = this.getEvent(t, true);
        ce2 = this.getSibling(t, ce);

        if (ce2 && !ce) {
            ce = this.publish(t);
        }

        // this event has not been published or subscribed to
        if (!ce) {
            if (this._yuievt.hasTargets) {
                return this.bubble({ type: t }, args, this);
            }

            // otherwise there is nothing to be done
            ret = true;
        } else {
            ce.sibling = ce2;
            ret = ce.fire.apply(ce, args);
        }

        return (this._yuievt.chain) ? this : ret;
    },

    getSibling: function(type, ce) {
        var ce2;
        // delegate to *:type events if there are subscribers
        if (type.indexOf(PREFIX_DELIMITER) > -1) {
            type = _wildType(type);
            // console.log(type);
            ce2 = this.getEvent(type, true);
            if (ce2) {
                // console.log("GOT ONE: " + type);
                ce2.applyConfig(ce);
                ce2.bubbles = false;
                ce2.broadcast = 0;
                // ret = ce2.fire.apply(ce2, a);
            }
        }

        return ce2;
    },

    /**
     * Returns the custom event of the provided type has been created, a
     * falsy value otherwise
     * @method getEvent
     * @param type {string} the type, or name of the event
     * @param prefixed {string} if true, the type is prefixed already
     * @return {CustomEvent} the custom event or null
     */
    getEvent: function(type, prefixed) {
        var pre, e;
        if (!prefixed) {
            pre = this._yuievt.config.prefix;
            type = (pre) ? _getType(type, pre) : type;
        }
        e = this._yuievt.events;
        return e[type] || null;
    },

    /**
     * Subscribe to a custom event hosted by this object.  The
     * supplied callback will execute after any listeners add
     * via the subscribe method, and after the default function,
     * if configured for the event, has executed.
     * @method after
     * @param type    {string}   The type of the event
     * @param fn {Function} The callback
     * @param context {object} optional execution context.
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return the event target or a detach handle per 'chain' config
     */
    after: function(type, fn) {

        var a = YArray(arguments, 0, true);

        switch (L.type(type)) {
            case 'function':
                return Y.Do.after.apply(Y.Do, arguments);
            case 'array':
            //     YArray.each(a[0], function(v) {
            //         v = AFTER_PREFIX + v;
            //     });
            //     break;
            case 'object':
                a[0]._after = true;
                break;
            default:
                a[0] = AFTER_PREFIX + type;
        }

        return this.on.apply(this, a);

    },

    /**
     * Executes the callback before a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.  For DOM and custom
     * events, this is an alias for Y.on.
     *
     * For DOM and custom events:
     * type, callback, context, 0-n arguments
     *
     * For methods:
     * callback, object (method host), methodName, context, 0-n arguments
     *
     * @method before
     * @return detach handle
     */
    before: function() {
        return this.on.apply(this, arguments);
    }

};

Y.EventTarget = ET;

// make Y an event target
Y.mix(Y, ET.prototype, false, false, {
    bubbles: false
});

ET.call(Y);

YUI.Env.globalEvents = YUI.Env.globalEvents || new ET();

/**
 * Hosts YUI page level events.  This is where events bubble to
 * when the broadcast config is set to 2.  This property is
 * only available if the custom event module is loaded.
 * @property Global
 * @type EventTarget
 * @for YUI
 */
Y.Global = YUI.Env.globalEvents;

// @TODO implement a global namespace function on Y.Global?

/**
 * <code>YUI</code>'s <code>on</code> method is a unified interface for subscribing to
 * most events exposed by YUI.  This includes custom events, DOM events, and
 * function events.  <code>detach</code> is also provided to remove listeners
 * serviced by this function.
 *
 * The signature that <code>on</code> accepts varies depending on the type
 * of event being consumed.  Refer to the specific methods that will
 * service a specific request for additional information about subscribing
 * to that type of event.
 *
 * <ul>
 * <li>Custom events.  These events are defined by various
 * modules in the library.  This type of event is delegated to
 * <code>EventTarget</code>'s <code>on</code> method.
 *   <ul>
 *     <li>The type of the event</li>
 *     <li>The callback to execute</li>
 *     <li>An optional context object</li>
 *     <li>0..n additional arguments to supply the callback.</li>
 *   </ul>
 *   Example:
 *   <code>Y.on('drag:drophit', function() { // start work });</code>
 * </li>
 * <li>DOM events.  These are moments reported by the browser related
 * to browser functionality and user interaction.
 * This type of event is delegated to <code>Event</code>'s
 * <code>attach</code> method.
 *   <ul>
 *     <li>The type of the event</li>
 *     <li>The callback to execute</li>
 *     <li>The specification for the Node(s) to attach the listener
 *     to.  This can be a selector, collections, or Node/Element
 *     refereces.</li>
 *     <li>An optional context object</li>
 *     <li>0..n additional arguments to supply the callback.</li>
 *   </ul>
 *   Example:
 *   <code>Y.on('click', function(e) { // something was clicked }, '#someelement');</code>
 * </li>
 * <li>Function events.  These events can be used to react before or after a
 * function is executed.  This type of event is delegated to <code>Event.Do</code>'s
 * <code>before</code> method.
 *   <ul>
 *     <li>The callback to execute</li>
 *     <li>The object that has the function that will be listened for.</li>
 *     <li>The name of the function to listen for.</li>
 *     <li>An optional context object</li>
 *     <li>0..n additional arguments to supply the callback.</li>
 *   </ul>
 *   Example <code>Y.on(function(arg1, arg2, etc) { // obj.methodname was executed }, obj 'methodname');</code>
 * </li>
 * </ul>
 *
 * <code>on</code> corresponds to the moment before any default behavior of
 * the event.  <code>after</code> works the same way, but these listeners
 * execute after the event's default behavior.  <code>before</code> is an
 * alias for <code>on</code>.
 *
 * @method on
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return the event target or a detach handle per 'chain' config
 * @for YUI
 */

 /**
  * Listen for an event one time.  Equivalent to <code>on</code>, except that
  * the listener is immediately detached when executed.
  * @see on
  * @method once
  * @param type event type (this parameter does not apply for function events)
  * @param fn the callback
  * @param context optionally change the value of 'this' in the callback
  * @param args* 0..n additional arguments to pass to the callback.
  * @return the event target or a detach handle per 'chain' config
  * @for YUI
  */

/**
 * after() is a unified interface for subscribing to
 * most events exposed by YUI.  This includes custom events,
 * DOM events, and AOP events.  This works the same way as
 * the on() function, only it operates after any default
 * behavior for the event has executed. @see <code>on</code> for more
 * information.
 * @method after
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return the event target or a detach handle per 'chain' config
 * @for YUI
 */


}, '3.3.0' ,{requires:['oop']});
YUI.add('event-custom-complex', function(Y) {


/**
 * Adds event facades, preventable default behavior, and bubbling.
 * events.
 * @module event-custom
 * @submodule event-custom-complex
 */

var FACADE,
    FACADE_KEYS,
    EMPTY = {},
    CEProto = Y.CustomEvent.prototype,
    ETProto = Y.EventTarget.prototype;

/**
 * Wraps and protects a custom event for use when emitFacade is set to true.
 * Requires the event-custom-complex module
 * @class EventFacade
 * @param e {Event} the custom event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 */

Y.EventFacade = function(e, currentTarget) {

    e = e || EMPTY;

    this._event = e;

    /**
     * The arguments passed to fire
     * @property details
     * @type Array
     */
    this.details = e.details;

    /**
     * The event type, this can be overridden by the fire() payload
     * @property type
     * @type string
     */
    this.type = e.type;

    /**
     * The real event type
     * @property type
     * @type string
     */
    this._type = e.type;

    //////////////////////////////////////////////////////

    /**
     * Node reference for the targeted eventtarget
     * @propery target
     * @type Node
     */
    this.target = e.target;

    /**
     * Node reference for the element that the listener was attached to.
     * @propery currentTarget
     * @type Node
     */
    this.currentTarget = currentTarget;

    /**
     * Node reference to the relatedTarget
     * @propery relatedTarget
     * @type Node
     */
    this.relatedTarget = e.relatedTarget;

};

Y.extend(Y.EventFacade, Object, {

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */
    stopPropagation: function() {
        this._event.stopPropagation();
        this.stopped = 1;
    },

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation: function() {
        this._event.stopImmediatePropagation();
        this.stopped = 2;
    },

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     */
    preventDefault: function() {
        this._event.preventDefault();
        this.prevented = 1;
    },

    /**
     * Stops the event propagation and prevents the default
     * event behavior.
     * @method halt
     * @param immediate {boolean} if true additional listeners
     * on the current target will not be executed
     */
    halt: function(immediate) {
        this._event.halt(immediate);
        this.prevented = 1;
        this.stopped = (immediate) ? 2 : 1;
    }

});

CEProto.fireComplex = function(args) {

    var es, ef, q, queue, ce, ret, events, subs, postponed,
        self = this, host = self.host || self, next, oldbubble;

    if (self.stack) {
        // queue this event if the current item in the queue bubbles
        if (self.queuable && self.type != self.stack.next.type) {
            self.log('queue ' + self.type);
            self.stack.queue.push([self, args]);
            return true;
        }
    }

    es = self.stack || {
       // id of the first event in the stack
       id: self.id,
       next: self,
       silent: self.silent,
       stopped: 0,
       prevented: 0,
       bubbling: null,
       type: self.type,
       // defaultFnQueue: new Y.Queue(),
       afterQueue: new Y.Queue(),
       defaultTargetOnly: self.defaultTargetOnly,
       queue: []
    };

    subs = self.getSubs();

    self.stopped = (self.type !== es.type) ? 0 : es.stopped;
    self.prevented = (self.type !== es.type) ? 0 : es.prevented;

    self.target = self.target || host;

    events = new Y.EventTarget({
        fireOnce: true,
        context: host
    });

    self.events = events;

    if (self.preventedFn) {
        events.on('prevented', self.preventedFn);
    }

    if (self.stoppedFn) {
        events.on('stopped', self.stoppedFn);
    }

    self.currentTarget = host;

    self.details = args.slice(); // original arguments in the details

    // self.log("Firing " + self  + ", " + "args: " + args);
    self.log("Firing " + self.type);

    self._facade = null; // kill facade to eliminate stale properties

    ef = self._getFacade(args);

    if (Y.Lang.isObject(args[0])) {
        args[0] = ef;
    } else {
        args.unshift(ef);
    }

    // if (subCount) {
    if (subs[0]) {
        // self._procSubs(Y.merge(self.subscribers), args, ef);
        self._procSubs(subs[0], args, ef);
    }

    // bubble if this is hosted in an event target and propagation has not been stopped
    if (self.bubbles && host.bubble && !self.stopped) {

        oldbubble = es.bubbling;

        // self.bubbling = true;
        es.bubbling = self.type;

        // if (host !== ef.target || es.type != self.type) {
        if (es.type != self.type) {
            es.stopped = 0;
            es.prevented = 0;
        }

        ret = host.bubble(self, args, null, es);

        self.stopped = Math.max(self.stopped, es.stopped);
        self.prevented = Math.max(self.prevented, es.prevented);

        // self.bubbling = false;
        es.bubbling = oldbubble;

    }

    if (self.defaultFn &&
        !self.prevented &&
        ((!self.defaultTargetOnly && !es.defaultTargetOnly) || host === ef.target)) {

        self.defaultFn.apply(host, args);
    }

    // broadcast listeners are fired as discreet events on the
    // YUI instance and potentially the YUI global.
    self._broadcast(args);

    // Queue the after
    if (subs[1] && !self.prevented && self.stopped < 2) {
        if (es.id === self.id || self.type != host._yuievt.bubbling) {
            self._procSubs(subs[1], args, ef);
            while ((next = es.afterQueue.last())) {
                next();
            }
        } else {
            postponed = subs[1];
            if (es.execDefaultCnt) {
                postponed = Y.merge(postponed);
                Y.each(postponed, function(s) {
                    s.postponed = true;
                });
            }

            es.afterQueue.add(function() {
                self._procSubs(postponed, args, ef);
            });
        }
    }

    self.target = null;

    if (es.id === self.id) {
        queue = es.queue;

        while (queue.length) {
            q = queue.pop();
            ce = q[0];
            // set up stack to allow the next item to be processed
            es.next = ce;
            ce.fire.apply(ce, q[1]);
        }

        self.stack = null;
    }

    ret = !(self.stopped);

    if (self.type != host._yuievt.bubbling) {
        es.stopped = 0;
        es.prevented = 0;
        self.stopped = 0;
        self.prevented = 0;
    }

    return ret;
};

CEProto._getFacade = function() {

    var ef = this._facade, o, o2,
    args = this.details;

    if (!ef) {
        ef = new Y.EventFacade(this, this.currentTarget);
    }

    // if the first argument is an object literal, apply the
    // properties to the event facade
    o = args && args[0];

    if (Y.Lang.isObject(o, true)) {

        o2 = {};

        // protect the event facade properties
        Y.mix(o2, ef, true, FACADE_KEYS);

        // mix the data
        Y.mix(ef, o, true);

        // restore ef
        Y.mix(ef, o2, true, FACADE_KEYS);

        // Allow the event type to be faked
        // http://yuilibrary.com/projects/yui3/ticket/2528376
        ef.type = o.type || ef.type;
    }

    // update the details field with the arguments
    // ef.type = this.type;
    ef.details = this.details;

    // use the original target when the event bubbled to this target
    ef.target = this.originalTarget || this.target;

    ef.currentTarget = this.currentTarget;
    ef.stopped = 0;
    ef.prevented = 0;

    this._facade = ef;

    return this._facade;
};

/**
 * Stop propagation to bubble targets
 * @for CustomEvent
 * @method stopPropagation
 */
CEProto.stopPropagation = function() {
    this.stopped = 1;
    if (this.stack) {
        this.stack.stopped = 1;
    }
    this.events.fire('stopped', this);
};

/**
 * Stops propagation to bubble targets, and prevents any remaining
 * subscribers on the current target from executing.
 * @method stopImmediatePropagation
 */
CEProto.stopImmediatePropagation = function() {
    this.stopped = 2;
    if (this.stack) {
        this.stack.stopped = 2;
    }
    this.events.fire('stopped', this);
};

/**
 * Prevents the execution of this event's defaultFn
 * @method preventDefault
 */
CEProto.preventDefault = function() {
    if (this.preventable) {
        this.prevented = 1;
        if (this.stack) {
            this.stack.prevented = 1;
        }
        this.events.fire('prevented', this);
    }
};

/**
 * Stops the event propagation and prevents the default
 * event behavior.
 * @method halt
 * @param immediate {boolean} if true additional listeners
 * on the current target will not be executed
 */
CEProto.halt = function(immediate) {
    if (immediate) {
        this.stopImmediatePropagation();
    } else {
        this.stopPropagation();
    }
    this.preventDefault();
};

/**
 * Registers another EventTarget as a bubble target.  Bubble order
 * is determined by the order registered.  Multiple targets can
 * be specified.
 *
 * Events can only bubble if emitFacade is true.
 *
 * Included in the event-custom-complex submodule.
 *
 * @method addTarget
 * @param o {EventTarget} the target to add
 * @for EventTarget
 */
ETProto.addTarget = function(o) {
    this._yuievt.targets[Y.stamp(o)] = o;
    this._yuievt.hasTargets = true;
};

/**
 * Returns an array of bubble targets for this object.
 * @method getTargets
 * @return EventTarget[]
 */
ETProto.getTargets = function() {
    return Y.Object.values(this._yuievt.targets);
};

/**
 * Removes a bubble target
 * @method removeTarget
 * @param o {EventTarget} the target to remove
 * @for EventTarget
 */
ETProto.removeTarget = function(o) {
    delete this._yuievt.targets[Y.stamp(o)];
};

/**
 * Propagate an event.  Requires the event-custom-complex module.
 * @method bubble
 * @param evt {CustomEvent} the custom event to propagate
 * @return {boolean} the aggregated return value from Event.Custom.fire
 * @for EventTarget
 */
ETProto.bubble = function(evt, args, target, es) {

    var targs = this._yuievt.targets, ret = true,
        t, type = evt && evt.type, ce, i, bc, ce2,
        originalTarget = target || (evt && evt.target) || this,
        oldbubble;

    if (!evt || ((!evt.stopped) && targs)) {

        for (i in targs) {
            if (targs.hasOwnProperty(i)) {
                t = targs[i];
                ce = t.getEvent(type, true);
                ce2 = t.getSibling(type, ce);

                if (ce2 && !ce) {
                    ce = t.publish(type);
                }

                oldbubble = t._yuievt.bubbling;
                t._yuievt.bubbling = type;

                // if this event was not published on the bubble target,
                // continue propagating the event.
                if (!ce) {
                    if (t._yuievt.hasTargets) {
                        t.bubble(evt, args, originalTarget, es);
                    }
                } else {

                    ce.sibling = ce2;

                    // set the original target to that the target payload on the
                    // facade is correct.
                    ce.target = originalTarget;
                    ce.originalTarget = originalTarget;
                    ce.currentTarget = t;
                    bc = ce.broadcast;
                    ce.broadcast = false;

                    // default publish may not have emitFacade true -- that
                    // shouldn't be what the implementer meant to do
                    ce.emitFacade = true;

                    ce.stack = es;

                    ret = ret && ce.fire.apply(ce, args || evt.details || []);
                    ce.broadcast = bc;
                    ce.originalTarget = null;


                    // stopPropagation() was called
                    if (ce.stopped) {
                        break;
                    }
                }

                t._yuievt.bubbling = oldbubble;
            }
        }
    }

    return ret;
};

FACADE = new Y.EventFacade();
FACADE_KEYS = Y.Object.keys(FACADE);



}, '3.3.0' ,{requires:['event-custom-base']});


YUI.add('event-custom', function(Y){}, '3.3.0' ,{use:['event-custom-base', 'event-custom-complex']});

/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('dom-base', function(Y) {

(function(Y) {
/** 
 * The DOM utility provides a cross-browser abtraction layer
 * normalizing DOM tasks, and adds extra helper functionality
 * for other common tasks. 
 * @module dom
 * @submodule dom-base
 * @for DOM
 *
 */

/**
 * Provides DOM helper methods.
 * @class DOM
 *
 */
var NODE_TYPE = 'nodeType',
    OWNER_DOCUMENT = 'ownerDocument',
    DOCUMENT_ELEMENT = 'documentElement',
    DEFAULT_VIEW = 'defaultView',
    PARENT_WINDOW = 'parentWindow',
    TAG_NAME = 'tagName',
    PARENT_NODE = 'parentNode',
    FIRST_CHILD = 'firstChild',
    PREVIOUS_SIBLING = 'previousSibling',
    NEXT_SIBLING = 'nextSibling',
    CONTAINS = 'contains',
    COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
    EMPTY_STRING = '',
    EMPTY_ARRAY = [],

    documentElement = Y.config.doc.documentElement,

    re_tag = /<([a-z]+)/i,

    createFromDIV = function(html, tag) {
        var div = Y.config.doc.createElement('div'),
            ret = true;

        div.innerHTML = html;
        if (!div.firstChild || div.firstChild.tagName !== tag.toUpperCase()) {
            ret = false;
        }

        return ret;
    },

    addFeature = Y.Features.add,
    testFeature = Y.Features.test,
    
Y_DOM = {
    /**
     * Returns the HTMLElement with the given ID (Wrapper for document.getElementById).
     * @method byId         
     * @param {String} id the id attribute 
     * @param {Object} doc optional The document to search. Defaults to current document 
     * @return {HTMLElement | null} The HTMLElement with the id, or null if none found. 
     */
    byId: function(id, doc) {
        // handle dupe IDs and IE name collision
        return Y_DOM.allById(id, doc)[0] || null;
    },

    /**
     * Returns the text content of the HTMLElement. 
     * @method getText         
     * @param {HTMLElement} element The html element. 
     * @return {String} The text content of the element (includes text of any descending elements).
     */
    getText: (documentElement.textContent !== undefined) ?
        function(element) {
            var ret = '';
            if (element) {
                ret = element.textContent;
            }
            return ret || '';
        } : function(element) {
            var ret = '';
            if (element) {
                ret = element.innerText || element.nodeValue; // might be a textNode
            }
            return ret || '';
        },

    /**
     * Sets the text content of the HTMLElement. 
     * @method setText         
     * @param {HTMLElement} element The html element. 
     * @param {String} content The content to add. 
     */
    setText: (documentElement.textContent !== undefined) ?
        function(element, content) {
            if (element) {
                element.textContent = content;
            }
        } : function(element, content) {
            if ('innerText' in element) {
                element.innerText = content;
            } else if ('nodeValue' in element) {
                element.nodeValue = content;
            }

        },

    /*
     * Finds the ancestor of the element.
     * @method ancestor
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, the parentNode is returned.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan 
     * @return {HTMLElement | null} The matching DOM node or null if none found. 
     */
    ancestor: function(element, fn, testSelf) {
        var ret = null;
        if (testSelf) {
            ret = (!fn || fn(element)) ? element : null;

        }
        return ret || Y_DOM.elementByAxis(element, PARENT_NODE, fn, null);
    },

    /*
     * Finds the ancestors of the element.
     * @method ancestors
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, all ancestors are returned.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan 
     * @return {Array} An array containing all matching DOM nodes.
     */
    ancestors: function(element, fn, testSelf) {
        var ancestor = Y_DOM.ancestor.apply(Y_DOM, arguments),
            ret = (ancestor) ? [ancestor] : [];

        while ((ancestor = Y_DOM.ancestor(ancestor, fn))) {
            if (ancestor) {
                ret.unshift(ancestor);
            }
        }

        return ret;
    },

    /**
     * Searches the element by the given axis for the first matching element.
     * @method elementByAxis
     * @param {HTMLElement} element The html element.
     * @param {String} axis The axis to search (parentNode, nextSibling, previousSibling).
     * @param {Function} fn optional An optional boolean test to apply.
     * @param {Boolean} all optional Whether all node types should be returned, or just element nodes.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, the first element is returned.
     * @return {HTMLElement | null} The matching element or null if none found.
     */
    elementByAxis: function(element, axis, fn, all) {
        while (element && (element = element[axis])) { // NOTE: assignment
                if ( (all || element[TAG_NAME]) && (!fn || fn(element)) ) {
                    return element;
                }
        }
        return null;
    },

    /**
     * Determines whether or not one HTMLElement is or contains another HTMLElement.
     * @method contains
     * @param {HTMLElement} element The containing html element.
     * @param {HTMLElement} needle The html element that may be contained.
     * @return {Boolean} Whether or not the element is or contains the needle.
     */
    contains: function(element, needle) {
        var ret = false;

        if ( !needle || !element || !needle[NODE_TYPE] || !element[NODE_TYPE]) {
            ret = false;
        } else if (element[CONTAINS])  {
            if (Y.UA.opera || needle[NODE_TYPE] === 1) { // IE & SAF contains fail if needle not an ELEMENT_NODE
                ret = element[CONTAINS](needle);
            } else {
                ret = Y_DOM._bruteContains(element, needle); 
            }
        } else if (element[COMPARE_DOCUMENT_POSITION]) { // gecko
            if (element === needle || !!(element[COMPARE_DOCUMENT_POSITION](needle) & 16)) { 
                ret = true;
            }
        }

        return ret;
    },

    /**
     * Determines whether or not the HTMLElement is part of the document.
     * @method inDoc
     * @param {HTMLElement} element The containing html element.
     * @param {HTMLElement} doc optional The document to check.
     * @return {Boolean} Whether or not the element is attached to the document. 
     */
    inDoc: function(element, doc) {
        var ret = false,
            rootNode;

        if (element && element.nodeType) {
            (doc) || (doc = element[OWNER_DOCUMENT]);

            rootNode = doc[DOCUMENT_ELEMENT];

            // contains only works with HTML_ELEMENT
            if (rootNode && rootNode.contains && element.tagName) {
                ret = rootNode.contains(element);
            } else {
                ret = Y_DOM.contains(rootNode, element);
            }
        }

        return ret;

    },

   allById: function(id, root) {
        root = root || Y.config.doc;
        var nodes = [],
            ret = [],
            i,
            node;

        if (root.querySelectorAll) {
            ret = root.querySelectorAll('[id="' + id + '"]');
        } else if (root.all) {
            nodes = root.all(id);

            if (nodes) {
                // root.all may return HTMLElement or HTMLCollection.
                // some elements are also HTMLCollection (FORM, SELECT).
                if (nodes.nodeName) {
                    if (nodes.id === id) { // avoid false positive on name
                        ret.push(nodes);
                        nodes = EMPTY_ARRAY; // done, no need to filter
                    } else { //  prep for filtering
                        nodes = [nodes];
                    }
                }

                if (nodes.length) {
                    // filter out matches on node.name
                    // and element.id as reference to element with id === 'id'
                    for (i = 0; node = nodes[i++];) {
                        if (node.id === id  || 
                                (node.attributes && node.attributes.id &&
                                node.attributes.id.value === id)) { 
                            ret.push(node);
                        }
                    }
                }
            }
        } else {
            ret = [Y_DOM._getDoc(root).getElementById(id)];
        }
    
        return ret;
   },

    /**
     * Creates a new dom node using the provided markup string. 
     * @method create
     * @param {String} html The markup used to create the element
     * @param {HTMLDocument} doc An optional document context 
     * @return {HTMLElement|DocumentFragment} returns a single HTMLElement 
     * when creating one node, and a documentFragment when creating
     * multiple nodes.
     */
    create: function(html, doc) {
        if (typeof html === 'string') {
            html = Y.Lang.trim(html); // match IE which trims whitespace from innerHTML

        }

        doc = doc || Y.config.doc;
        var m = re_tag.exec(html),
            create = Y_DOM._create,
            custom = Y_DOM.creators,
            ret = null,
            creator,
            tag, nodes;

        if (html != undefined) { // not undefined or null
            if (m && m[1]) {
                creator = custom[m[1].toLowerCase()];
                if (typeof creator === 'function') {
                    create = creator; 
                } else {
                    tag = creator;
                }
            }

            nodes = create(html, doc, tag).childNodes;

            if (nodes.length === 1) { // return single node, breaking parentNode ref from "fragment"
                ret = nodes[0].parentNode.removeChild(nodes[0]);
            } else if (nodes[0] && nodes[0].className === 'yui3-big-dummy') { // using dummy node to preserve some attributes (e.g. OPTION not selected)
                if (nodes.length === 2) {
                    ret = nodes[0].nextSibling;
                } else {
                    nodes[0].parentNode.removeChild(nodes[0]); 
                     ret = Y_DOM._nl2frag(nodes, doc);
                }
            } else { // return multiple nodes as a fragment
                 ret = Y_DOM._nl2frag(nodes, doc);
            }
        }

        return ret;
    },

    _nl2frag: function(nodes, doc) {
        var ret = null,
            i, len;

        if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            doc = doc || nodes[0].ownerDocument; 
            ret = doc.createDocumentFragment();

            if (nodes.item) { // convert live list to static array
                nodes = Y.Array(nodes, 0, true);
            }

            for (i = 0, len = nodes.length; i < len; i++) {
                ret.appendChild(nodes[i]); 
            }
        } // else inline with log for minification
        return ret;
    },


    CUSTOM_ATTRIBUTES: (!documentElement.hasAttribute) ? { // IE < 8
        'for': 'htmlFor',
        'class': 'className'
    } : { // w3c
        'htmlFor': 'for',
        'className': 'class'
    },

    /**
     * Provides a normalized attribute interface. 
     * @method setAttibute
     * @param {HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to set.
     * @param {String} val The value of the attribute.
     */
    setAttribute: function(el, attr, val, ieAttr) {
        if (el && attr && el.setAttribute) {
            attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            el.setAttribute(attr, val, ieAttr);
        }
    },


    /**
     * Provides a normalized attribute interface. 
     * @method getAttibute
     * @param {HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to get.
     * @return {String} The current value of the attribute. 
     */
    getAttribute: function(el, attr, ieAttr) {
        ieAttr = (ieAttr !== undefined) ? ieAttr : 2;
        var ret = '';
        if (el && attr && el.getAttribute) {
            attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            ret = el.getAttribute(attr, ieAttr);

            if (ret === null) {
                ret = ''; // per DOM spec
            }
        }
        return ret;
    },

    isWindow: function(obj) {
        return !!(obj && obj.alert && obj.document);
    },

    _fragClones: {},

    _create: function(html, doc, tag) {
        tag = tag || 'div';

        var frag = Y_DOM._fragClones[tag];
        if (frag) {
            frag = frag.cloneNode(false);
        } else {
            frag = Y_DOM._fragClones[tag] = doc.createElement(tag);
        }
        frag.innerHTML = html;
        return frag;
    },

    _removeChildNodes: function(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    },

    /**
     * Inserts content in a node at the given location 
     * @method addHTML
     * @param {HTMLElement} node The node to insert into
     * @param {HTMLElement | Array | HTMLCollection} content The content to be inserted 
     * @param {HTMLElement} where Where to insert the content
     * If no "where" is given, content is appended to the node
     * Possible values for "where"
     * <dl>
     * <dt>HTMLElement</dt>
     * <dd>The element to insert before</dd>
     * <dt>"replace"</dt>
     * <dd>Replaces the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts before the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts content before the node</dd>
     * <dt>"after"</dt>
     * <dd>Inserts content after the node</dd>
     * </dl>
     */
    addHTML: function(node, content, where) {
        var nodeParent = node.parentNode,
            i = 0,
            item,
            ret = content,
            newNode;
            

        if (content != undefined) { // not null or undefined (maybe 0)
            if (content.nodeType) { // DOM node, just add it
                newNode = content;
            } else if (typeof content == 'string' || typeof content == 'number') {
                ret = newNode = Y_DOM.create(content);
            } else if (content[0] && content[0].nodeType) { // array or collection 
                newNode = Y.config.doc.createDocumentFragment();
                while ((item = content[i++])) {
                    newNode.appendChild(item); // append to fragment for insertion
                }
            }
        }

        if (where) {
            if (where.nodeType) { // insert regardless of relationship to node
                where.parentNode.insertBefore(newNode, where);
            } else {
                switch (where) {
                    case 'replace':
                        while (node.firstChild) {
                            node.removeChild(node.firstChild);
                        }
                        if (newNode) { // allow empty content to clear node
                            node.appendChild(newNode);
                        }
                        break;
                    case 'before':
                        nodeParent.insertBefore(newNode, node);
                        break;
                    case 'after':
                        if (node.nextSibling) { // IE errors if refNode is null
                            nodeParent.insertBefore(newNode, node.nextSibling);
                        } else {
                            nodeParent.appendChild(newNode);
                        }
                        break;
                    default:
                        node.appendChild(newNode);
                }
            }
        } else if (newNode) {
            node.appendChild(newNode);
        }

        return ret;
    },

    VALUE_SETTERS: {},

    VALUE_GETTERS: {},

    getValue: function(node) {
        var ret = '', // TODO: return null?
            getter;

        if (node && node[TAG_NAME]) {
            getter = Y_DOM.VALUE_GETTERS[node[TAG_NAME].toLowerCase()];

            if (getter) {
                ret = getter(node);
            } else {
                ret = node.value;
            }
        }

        // workaround for IE8 JSON stringify bug
        // which converts empty string values to null
        if (ret === EMPTY_STRING) {
            ret = EMPTY_STRING; // for real
        }

        return (typeof ret === 'string') ? ret : '';
    },

    setValue: function(node, val) {
        var setter;

        if (node && node[TAG_NAME]) {
            setter = Y_DOM.VALUE_SETTERS[node[TAG_NAME].toLowerCase()];

            if (setter) {
                setter(node, val);
            } else {
                node.value = val;
            }
        }
    },

    siblings: function(node, fn) {
        var nodes = [],
            sibling = node;

        while ((sibling = sibling[PREVIOUS_SIBLING])) {
            if (sibling[TAG_NAME] && (!fn || fn(sibling))) {
                nodes.unshift(sibling);
            }
        }

        sibling = node;
        while ((sibling = sibling[NEXT_SIBLING])) {
            if (sibling[TAG_NAME] && (!fn || fn(sibling))) {
                nodes.push(sibling);
            }
        }

        return nodes;
    },

    /**
     * Brute force version of contains.
     * Used for browsers without contains support for non-HTMLElement Nodes (textNodes, etc).
     * @method _bruteContains
     * @private
     * @param {HTMLElement} element The containing html element.
     * @param {HTMLElement} needle The html element that may be contained.
     * @return {Boolean} Whether or not the element is or contains the needle.
     */
    _bruteContains: function(element, needle) {
        while (needle) {
            if (element === needle) {
                return true;
            }
            needle = needle.parentNode;
        }
        return false;
    },

// TODO: move to Lang?
    /**
     * Memoizes dynamic regular expressions to boost runtime performance. 
     * @method _getRegExp
     * @private
     * @param {String} str The string to convert to a regular expression.
     * @param {String} flags optional An optinal string of flags.
     * @return {RegExp} An instance of RegExp
     */
    _getRegExp: function(str, flags) {
        flags = flags || '';
        Y_DOM._regexCache = Y_DOM._regexCache || {};
        if (!Y_DOM._regexCache[str + flags]) {
            Y_DOM._regexCache[str + flags] = new RegExp(str, flags);
        }
        return Y_DOM._regexCache[str + flags];
    },

// TODO: make getDoc/Win true privates?
    /**
     * returns the appropriate document.
     * @method _getDoc
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The document for the given element or the default document. 
     */
    _getDoc: function(element) {
        var doc = Y.config.doc;
        if (element) {
            doc = (element[NODE_TYPE] === 9) ? element : // element === document
                element[OWNER_DOCUMENT] || // element === DOM node
                element.document || // element === window
                Y.config.doc; // default
        }

        return doc;
    },

    /**
     * returns the appropriate window.
     * @method _getWin
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The window for the given element or the default window. 
     */
    _getWin: function(element) {
        var doc = Y_DOM._getDoc(element);
        return doc[DEFAULT_VIEW] || doc[PARENT_WINDOW] || Y.config.win;
    },

    _batch: function(nodes, fn, arg1, arg2, arg3, etc) {
        fn = (typeof fn === 'string') ? Y_DOM[fn] : fn;
        var result,
            args = Array.prototype.slice.call(arguments, 2),
            i = 0,
            node,
            ret;

        if (fn && nodes) {
            while ((node = nodes[i++])) {
                result = result = fn.call(Y_DOM, node, arg1, arg2, arg3, etc);
                if (typeof result !== 'undefined') {
                    (ret) || (ret = []);
                    ret.push(result);
                }
            }
        }

        return (typeof ret !== 'undefined') ? ret : nodes;
    },

    wrap: function(node, html) {
        var parent = Y.DOM.create(html),
            nodes = parent.getElementsByTagName('*');

        if (nodes.length) {
            parent = nodes[nodes.length - 1];
        }

        if (node.parentNode) { 
            node.parentNode.replaceChild(parent, node);
        }
        parent.appendChild(node);
    },

    unwrap: function(node) {
        var parent = node.parentNode,
            lastChild = parent.lastChild,
            node = parent.firstChild,
            next = node,
            grandparent;

        if (parent) {
            grandparent = parent.parentNode;
            if (grandparent) {
                while (node !== lastChild) {
                    next = node.nextSibling;
                    grandparent.insertBefore(node, parent);
                    node = next;
                }
                grandparent.replaceChild(lastChild, parent);
            } else {
                parent.removeChild(node);
            }
        }
    },

    generateID: function(el) {
        var id = el.id;

        if (!id) {
            id = Y.stamp(el);
            el.id = id; 
        }   

        return id; 
    },

    creators: {}
};

addFeature('innerhtml', 'table', {
    test: function() {
        var node = Y.config.doc.createElement('table');
        try {
            node.innerHTML = '<tbody></tbody>';
        } catch(e) {
            return false;
        }
        return (node.firstChild && node.firstChild.nodeName === 'TBODY');
    }
});

addFeature('innerhtml-div', 'tr', {
    test: function() {
        return createFromDIV('<tr></tr>', 'tr');
    }
});

addFeature('innerhtml-div', 'script', {
    test: function() {
        return createFromDIV('<script></script>', 'script');
    }
});

addFeature('value-set', 'select', {
    test: function() {
        var node = Y.config.doc.createElement('select');
        node.innerHTML = '<option>1</option><option>2</option>';
        node.value = '2';
        return (node.value && node.value === '2');
    }
});

(function(Y) {
    var creators = Y_DOM.creators,
        create = Y_DOM.create,
        re_tbody = /(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/,

        TABLE_OPEN = '<table>',
        TABLE_CLOSE = '</table>';

    if (!testFeature('innerhtml', 'table')) {
        // TODO: thead/tfoot with nested tbody
            // IE adds TBODY when creating TABLE elements (which may share this impl)
        creators.tbody = function(html, doc) {
            var frag = create(TABLE_OPEN + html + TABLE_CLOSE, doc),
                tb = frag.children.tags('tbody')[0];

            if (frag.children.length > 1 && tb && !re_tbody.test(html)) {
                tb[PARENT_NODE].removeChild(tb); // strip extraneous tbody
            }
            return frag;
        };
    }

    if (!testFeature('innerhtml-div', 'script')) {
        creators.script = function(html, doc) {
            var frag = doc.createElement('div');

            frag.innerHTML = '-' + html;
            frag.removeChild(frag[FIRST_CHILD]);
            return frag;
        }

        Y_DOM.creators.link = Y_DOM.creators.style = Y_DOM.creators.script;
    }

    
    if (!testFeature('value-set', 'select')) {
        Y_DOM.VALUE_SETTERS.select = function(node, val) {
            for (var i = 0, options = node.getElementsByTagName('option'), option;
                    option = options[i++];) {
                if (Y_DOM.getValue(option) === val) {
                    option.selected = true;
                    //Y_DOM.setAttribute(option, 'selected', 'selected');
                    break;
                }
            }
        }
    }

    Y.mix(Y_DOM.VALUE_GETTERS, {
        button: function(node) {
            return (node.attributes && node.attributes.value) ? node.attributes.value.value : '';
        }
    });

    Y.mix(Y_DOM.VALUE_SETTERS, {
        // IE: node.value changes the button text, which should be handled via innerHTML
        button: function(node, val) {
            var attr = node.attributes.value;
            if (!attr) {
                attr = node[OWNER_DOCUMENT].createAttribute('value');
                node.setAttributeNode(attr);
            }

            attr.value = val;
        }
    });


    if (!testFeature('innerhtml-div', 'tr')) {
        Y.mix(creators, {
            option: function(html, doc) {
                return create('<select><option class="yui3-big-dummy" selected></option>' + html + '</select>', doc);
            },

            tr: function(html, doc) {
                return create('<tbody>' + html + '</tbody>', doc);
            },

            td: function(html, doc) {
                return create('<tr>' + html + '</tr>', doc);
            }, 

            col: function(html, doc) {
                return create('<colgroup>' + html + '</colgroup>', doc);
            }, 

            tbody: 'table'
        });

        Y.mix(creators, {
            legend: 'fieldset',
            th: creators.td,
            thead: creators.tbody,
            tfoot: creators.tbody,
            caption: creators.tbody,
            colgroup: creators.tbody,
            optgroup: creators.option
        });
    }

    Y.mix(Y_DOM.VALUE_GETTERS, {
        option: function(node) {
            var attrs = node.attributes;
            return (attrs.value && attrs.value.specified) ? node.value : node.text;
        },

        select: function(node) {
            var val = node.value,
                options = node.options;

            if (options && options.length) {
                // TODO: implement multipe select
                if (node.multiple) {
                } else {
                    val = Y_DOM.getValue(options[node.selectedIndex]);
                }
            }

            return val;
        }
    });
})(Y);

Y.DOM = Y_DOM;
})(Y);
var addClass, hasClass, removeClass;

Y.mix(Y.DOM, {
    /**
     * Determines whether a DOM element has the given className.
     * @method hasClass
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to search for
     * @return {Boolean} Whether or not the element has the given class. 
     */
    hasClass: function(node, className) {
        var re = Y.DOM._getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        return re.test(node.className);
    },

    /**
     * Adds a class name to a given DOM element.
     * @method addClass         
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to add to the class attribute
     */
    addClass: function(node, className) {
        if (!Y.DOM.hasClass(node, className)) { // skip if already present 
            node.className = Y.Lang.trim([node.className, className].join(' '));
        }
    },

    /**
     * Removes a class name from a given element.
     * @method removeClass         
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to remove from the class attribute
     */
    removeClass: function(node, className) {
        if (className && hasClass(node, className)) {
            node.className = Y.Lang.trim(node.className.replace(Y.DOM._getRegExp('(?:^|\\s+)' +
                            className + '(?:\\s+|$)'), ' '));

            if ( hasClass(node, className) ) { // in case of multiple adjacent
                removeClass(node, className);
            }
        }                 
    },

    /**
     * Replace a class with another class for a given element.
     * If no oldClassName is present, the newClassName is simply added.
     * @method replaceClass  
     * @for DOM
     * @param {HTMLElement} element The DOM element 
     * @param {String} oldClassName the class name to be replaced
     * @param {String} newClassName the class name that will be replacing the old class name
     */
    replaceClass: function(node, oldC, newC) {
        removeClass(node, oldC); // remove first in case oldC === newC
        addClass(node, newC);
    },

    /**
     * If the className exists on the node it is removed, if it doesn't exist it is added.
     * @method toggleClass  
     * @for DOM
     * @param {HTMLElement} element The DOM element
     * @param {String} className the class name to be toggled
     * @param {Boolean} addClass optional boolean to indicate whether class
     * should be added or removed regardless of current state
     */
    toggleClass: function(node, className, force) {
        var add = (force !== undefined) ? force :
                !(hasClass(node, className));

        if (add) {
            addClass(node, className);
        } else {
            removeClass(node, className);
        }
    }
});

hasClass = Y.DOM.hasClass;
removeClass = Y.DOM.removeClass;
addClass = Y.DOM.addClass;

Y.mix(Y.DOM, {
    /**
     * Sets the width of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setWidth
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Int} size The pixel height to size to
     */

    setWidth: function(node, size) {
        Y.DOM._setSize(node, 'width', size);
    },

    /**
     * Sets the height of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setHeight
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Int} size The pixel height to size to
     */

    setHeight: function(node, size) {
        Y.DOM._setSize(node, 'height', size);
    },

    _setSize: function(node, prop, val) {
        val = (val > 0) ? val : 0;
        var size = 0;

        node.style[prop] = val + 'px';
        size = (prop === 'height') ? node.offsetHeight : node.offsetWidth;

        if (size > val) {
            val = val - (size - val);

            if (val < 0) {
                val = 0;
            }

            node.style[prop] = val + 'px';
        }
    }
});


}, '3.3.0' ,{requires:['oop']});
YUI.add('dom-style', function(Y) {

(function(Y) {
/** 
 * Add style management functionality to DOM.
 * @module dom
 * @submodule dom-style
 * @for DOM
 */

var DOCUMENT_ELEMENT = 'documentElement',
    DEFAULT_VIEW = 'defaultView',
    OWNER_DOCUMENT = 'ownerDocument',
    STYLE = 'style',
    FLOAT = 'float',
    CSS_FLOAT = 'cssFloat',
    STYLE_FLOAT = 'styleFloat',
    TRANSPARENT = 'transparent',
    GET_COMPUTED_STYLE = 'getComputedStyle',
    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',

    WINDOW = Y.config.win,
    DOCUMENT = Y.config.doc,
    UNDEFINED = undefined,

    Y_DOM = Y.DOM,

    TRANSFORM = 'transform',
    VENDOR_TRANSFORM = [
        'WebkitTransform',
        'MozTransform',
        'OTransform'
    ],

    re_color = /color$/i,
    re_unit = /width|height|top|left|right|bottom|margin|padding/i;

Y.Array.each(VENDOR_TRANSFORM, function(val) {
    if (val in DOCUMENT[DOCUMENT_ELEMENT].style) {
        TRANSFORM = val;
    }
});

Y.mix(Y_DOM, {
    DEFAULT_UNIT: 'px',

    CUSTOM_STYLES: {
    },


    /**
     * Sets a style property for a given element.
     * @method setStyle
     * @param {HTMLElement} An HTMLElement to apply the style to.
     * @param {String} att The style property to set. 
     * @param {String|Number} val The value. 
     */
    setStyle: function(node, att, val, style) {
        style = style || node.style;
        var CUSTOM_STYLES = Y_DOM.CUSTOM_STYLES;

        if (style) {
            if (val === null || val === '') { // normalize unsetting
                val = '';
            } else if (!isNaN(new Number(val)) && re_unit.test(att)) { // number values may need a unit
                val += Y_DOM.DEFAULT_UNIT;
            }

            if (att in CUSTOM_STYLES) {
                if (CUSTOM_STYLES[att].set) {
                    CUSTOM_STYLES[att].set(node, val, style);
                    return; // NOTE: return
                } else if (typeof CUSTOM_STYLES[att] === 'string') {
                    att = CUSTOM_STYLES[att];
                }
            } else if (att === '') { // unset inline styles
                att = 'cssText';
                val = '';
            }
            style[att] = val; 
        }
    },

    /**
     * Returns the current style value for the given property.
     * @method getStyle
     * @param {HTMLElement} An HTMLElement to get the style from.
     * @param {String} att The style property to get. 
     */
    getStyle: function(node, att, style) {
        style = style || node.style;
        var CUSTOM_STYLES = Y_DOM.CUSTOM_STYLES,
            val = '';

        if (style) {
            if (att in CUSTOM_STYLES) {
                if (CUSTOM_STYLES[att].get) {
                    return CUSTOM_STYLES[att].get(node, att, style); // NOTE: return
                } else if (typeof CUSTOM_STYLES[att] === 'string') {
                    att = CUSTOM_STYLES[att];
                }
            }
            val = style[att];
            if (val === '') { // TODO: is empty string sufficient?
                val = Y_DOM[GET_COMPUTED_STYLE](node, att);
            }
        }

        return val;
    },

    /**
     * Sets multiple style properties.
     * @method setStyles
     * @param {HTMLElement} node An HTMLElement to apply the styles to. 
     * @param {Object} hash An object literal of property:value pairs. 
     */
    setStyles: function(node, hash) {
        var style = node.style;
        Y.each(hash, function(v, n) {
            Y_DOM.setStyle(node, n, v, style);
        }, Y_DOM);
    },

    /**
     * Returns the computed style for the given node.
     * @method getComputedStyle
     * @param {HTMLElement} An HTMLElement to get the style from.
     * @param {String} att The style property to get. 
     * @return {String} The computed value of the style property. 
     */
    getComputedStyle: function(node, att) {
        var val = '',
            doc = node[OWNER_DOCUMENT];

        if (node[STYLE] && doc[DEFAULT_VIEW] && doc[DEFAULT_VIEW][GET_COMPUTED_STYLE]) {
            val = doc[DEFAULT_VIEW][GET_COMPUTED_STYLE](node, null)[att];
        }
        return val;
    }
});

// normalize reserved word float alternatives ("cssFloat" or "styleFloat")
if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][CSS_FLOAT] !== UNDEFINED) {
    Y_DOM.CUSTOM_STYLES[FLOAT] = CSS_FLOAT;
} else if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][STYLE_FLOAT] !== UNDEFINED) {
    Y_DOM.CUSTOM_STYLES[FLOAT] = STYLE_FLOAT;
}

// fix opera computedStyle default color unit (convert to rgb)
if (Y.UA.opera) {
    Y_DOM[GET_COMPUTED_STYLE] = function(node, att) {
        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        if (re_color.test(att)) {
            val = Y.Color.toRGB(val);
        }

        return val;
    };

}

// safari converts transparent to rgba(), others use "transparent"
if (Y.UA.webkit) {
    Y_DOM[GET_COMPUTED_STYLE] = function(node, att) {
        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        if (val === 'rgba(0, 0, 0, 0)') {
            val = TRANSPARENT; 
        }

        return val;
    };

}

Y.DOM._getAttrOffset = function(node, attr) {
    var val = Y.DOM[GET_COMPUTED_STYLE](node, attr),
        offsetParent = node.offsetParent,
        position,
        parentOffset,
        offset;

    if (val === 'auto') {
        position = Y.DOM.getStyle(node, 'position');
        if (position === 'static' || position === 'relative') {
            val = 0;    
        } else if (offsetParent && offsetParent[GET_BOUNDING_CLIENT_RECT]) {
            parentOffset = offsetParent[GET_BOUNDING_CLIENT_RECT]()[attr];
            offset = node[GET_BOUNDING_CLIENT_RECT]()[attr];
            if (attr === 'left' || attr === 'top') {
                val = offset - parentOffset;
            } else {
                val = parentOffset - node[GET_BOUNDING_CLIENT_RECT]()[attr];
            }
        }
    }

    return val;
};

Y.DOM._getOffset = function(node) {
    var pos,
        xy = null;

    if (node) {
        pos = Y_DOM.getStyle(node, 'position');
        xy = [
            parseInt(Y_DOM[GET_COMPUTED_STYLE](node, 'left'), 10),
            parseInt(Y_DOM[GET_COMPUTED_STYLE](node, 'top'), 10)
        ];

        if ( isNaN(xy[0]) ) { // in case of 'auto'
            xy[0] = parseInt(Y_DOM.getStyle(node, 'left'), 10); // try inline
            if ( isNaN(xy[0]) ) { // default to offset value
                xy[0] = (pos === 'relative') ? 0 : node.offsetLeft || 0;
            }
        } 

        if ( isNaN(xy[1]) ) { // in case of 'auto'
            xy[1] = parseInt(Y_DOM.getStyle(node, 'top'), 10); // try inline
            if ( isNaN(xy[1]) ) { // default to offset value
                xy[1] = (pos === 'relative') ? 0 : node.offsetTop || 0;
            }
        } 
    }

    return xy;

};

Y_DOM.CUSTOM_STYLES.transform = {
    set: function(node, val, style) {
        style[TRANSFORM] = val;
    },

    get: function(node, style) {
        return Y_DOM[GET_COMPUTED_STYLE](node, TRANSFORM);
    }
};


})(Y);
(function(Y) {
var PARSE_INT = parseInt,
    RE = RegExp;

Y.Color = {
    KEYWORDS: {
        black: '000',
        silver: 'c0c0c0',
        gray: '808080',
        white: 'fff',
        maroon: '800000',
        red: 'f00',
        purple: '800080',
        fuchsia: 'f0f',
        green: '008000',
        lime: '0f0',
        olive: '808000',
        yellow: 'ff0',
        navy: '000080',
        blue: '00f',
        teal: '008080',
        aqua: '0ff'
    },

    re_RGB: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
    re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
    re_hex3: /([0-9A-F])/gi,

    toRGB: function(val) {
        if (!Y.Color.re_RGB.test(val)) {
            val = Y.Color.toHex(val);
        }

        if(Y.Color.re_hex.exec(val)) {
            val = 'rgb(' + [
                PARSE_INT(RE.$1, 16),
                PARSE_INT(RE.$2, 16),
                PARSE_INT(RE.$3, 16)
            ].join(', ') + ')';
        }
        return val;
    },

    toHex: function(val) {
        val = Y.Color.KEYWORDS[val] || val;
        if (Y.Color.re_RGB.exec(val)) {
            val = [
                Number(RE.$1).toString(16),
                Number(RE.$2).toString(16),
                Number(RE.$3).toString(16)
            ];

            for (var i = 0; i < val.length; i++) {
                if (val[i].length < 2) {
                    val[i] = '0' + val[i];
                }
            }

            val = val.join('');
        }

        if (val.length < 6) {
            val = val.replace(Y.Color.re_hex3, '$1$1');
        }

        if (val !== 'transparent' && val.indexOf('#') < 0) {
            val = '#' + val;
        }

        return val.toUpperCase();
    }
};
})(Y);



}, '3.3.0' ,{requires:['dom-base']});
YUI.add('dom-screen', function(Y) {

(function(Y) {

/**
 * Adds position and region management functionality to DOM.
 * @module dom
 * @submodule dom-screen
 * @for DOM
 */

var DOCUMENT_ELEMENT = 'documentElement',
    COMPAT_MODE = 'compatMode',
    POSITION = 'position',
    FIXED = 'fixed',
    RELATIVE = 'relative',
    LEFT = 'left',
    TOP = 'top',
    _BACK_COMPAT = 'BackCompat',
    MEDIUM = 'medium',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
    GET_COMPUTED_STYLE = 'getComputedStyle',

    Y_DOM = Y.DOM,

    // TODO: how about thead/tbody/tfoot/tr?
    // TODO: does caption matter?
    RE_TABLE = /^t(?:able|d|h)$/i,

    SCROLL_NODE;

if (Y.UA.ie) {
    if (Y.config.doc[COMPAT_MODE] !== 'quirks') {
        SCROLL_NODE = DOCUMENT_ELEMENT; 
    } else {
        SCROLL_NODE = 'body';
    }
}

Y.mix(Y_DOM, {
    /**
     * Returns the inner height of the viewport (exludes scrollbar). 
     * @method winHeight
     * @return {Number} The current height of the viewport.
     */
    winHeight: function(node) {
        var h = Y_DOM._getWinSize(node).height;
        return h;
    },

    /**
     * Returns the inner width of the viewport (exludes scrollbar). 
     * @method winWidth
     * @return {Number} The current width of the viewport.
     */
    winWidth: function(node) {
        var w = Y_DOM._getWinSize(node).width;
        return w;
    },

    /**
     * Document height 
     * @method docHeight
     * @return {Number} The current height of the document.
     */
    docHeight:  function(node) {
        var h = Y_DOM._getDocSize(node).height;
        return Math.max(h, Y_DOM._getWinSize(node).height);
    },

    /**
     * Document width 
     * @method docWidth
     * @return {Number} The current width of the document.
     */
    docWidth:  function(node) {
        var w = Y_DOM._getDocSize(node).width;
        return Math.max(w, Y_DOM._getWinSize(node).width);
    },

    /**
     * Amount page has been scroll horizontally 
     * @method docScrollX
     * @return {Number} The current amount the screen is scrolled horizontally.
     */
    docScrollX: function(node, doc) {
        doc = doc || (node) ? Y_DOM._getDoc(node) : Y.config.doc; // perf optimization
        var dv = doc.defaultView,
            pageOffset = (dv) ? dv.pageXOffset : 0;
        return Math.max(doc[DOCUMENT_ELEMENT].scrollLeft, doc.body.scrollLeft, pageOffset);
    },

    /**
     * Amount page has been scroll vertically 
     * @method docScrollY
     * @return {Number} The current amount the screen is scrolled vertically.
     */
    docScrollY:  function(node, doc) {
        doc = doc || (node) ? Y_DOM._getDoc(node) : Y.config.doc; // perf optimization
        var dv = doc.defaultView,
            pageOffset = (dv) ? dv.pageYOffset : 0;
        return Math.max(doc[DOCUMENT_ELEMENT].scrollTop, doc.body.scrollTop, pageOffset);
    },

    /**
     * Gets the current position of an element based on page coordinates. 
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @method getXY
     * @param element The target element
     * @return {Array} The XY position of the element

     TODO: test inDocument/display?
     */
    getXY: function() {
        if (Y.config.doc[DOCUMENT_ELEMENT][GET_BOUNDING_CLIENT_RECT]) {
            return function(node) {
                var xy = null,
                    scrollLeft,
                    scrollTop,
                    box,
                    off1, off2,
                    bLeft, bTop,
                    mode,
                    doc,
                    inDoc,
                    rootNode;

                if (node && node.tagName) {
                    doc = node.ownerDocument;
                    rootNode = doc[DOCUMENT_ELEMENT];

                    // inline inDoc check for perf
                    if (rootNode.contains) {
                        inDoc = rootNode.contains(node); 
                    } else {
                        inDoc = Y.DOM.contains(rootNode, node);
                    }

                    if (inDoc) {
                        scrollLeft = (SCROLL_NODE) ? doc[SCROLL_NODE].scrollLeft : Y_DOM.docScrollX(node, doc);
                        scrollTop = (SCROLL_NODE) ? doc[SCROLL_NODE].scrollTop : Y_DOM.docScrollY(node, doc);
                        box = node[GET_BOUNDING_CLIENT_RECT]();
                        xy = [box.left, box.top];

                            if (Y.UA.ie) {
                                off1 = 2;
                                off2 = 2;
                                mode = doc[COMPAT_MODE];
                                bLeft = Y_DOM[GET_COMPUTED_STYLE](doc[DOCUMENT_ELEMENT], BORDER_LEFT_WIDTH);
                                bTop = Y_DOM[GET_COMPUTED_STYLE](doc[DOCUMENT_ELEMENT], BORDER_TOP_WIDTH);

                                if (Y.UA.ie === 6) {
                                    if (mode !== _BACK_COMPAT) {
                                        off1 = 0;
                                        off2 = 0;
                                    }
                                }
                                
                                if ((mode == _BACK_COMPAT)) {
                                    if (bLeft !== MEDIUM) {
                                        off1 = parseInt(bLeft, 10);
                                    }
                                    if (bTop !== MEDIUM) {
                                        off2 = parseInt(bTop, 10);
                                    }
                                }
                                
                                xy[0] -= off1;
                                xy[1] -= off2;

                            }

                        if ((scrollTop || scrollLeft)) {
                            if (!Y.UA.ios || (Y.UA.ios >= 4.2)) {
                                xy[0] += scrollLeft;
                                xy[1] += scrollTop;
                            }
                            
                        }
                    } else {
                        xy = Y_DOM._getOffset(node);       
                    }
                }
                return xy;                   
            }
        } else {
            return function(node) { // manually calculate by crawling up offsetParents
                //Calculate the Top and Left border sizes (assumes pixels)
                var xy = null,
                    doc,
                    parentNode,
                    bCheck,
                    scrollTop,
                    scrollLeft;

                if (node) {
                    if (Y_DOM.inDoc(node)) {
                        xy = [node.offsetLeft, node.offsetTop];
                        doc = node.ownerDocument;
                        parentNode = node;
                        // TODO: refactor with !! or just falsey
                        bCheck = ((Y.UA.gecko || Y.UA.webkit > 519) ? true : false);

                        // TODO: worth refactoring for TOP/LEFT only?
                        while ((parentNode = parentNode.offsetParent)) {
                            xy[0] += parentNode.offsetLeft;
                            xy[1] += parentNode.offsetTop;
                            if (bCheck) {
                                xy = Y_DOM._calcBorders(parentNode, xy);
                            }
                        }

                        // account for any scrolled ancestors
                        if (Y_DOM.getStyle(node, POSITION) != FIXED) {
                            parentNode = node;

                            while ((parentNode = parentNode.parentNode)) {
                                scrollTop = parentNode.scrollTop;
                                scrollLeft = parentNode.scrollLeft;

                                //Firefox does something funky with borders when overflow is not visible.
                                if (Y.UA.gecko && (Y_DOM.getStyle(parentNode, 'overflow') !== 'visible')) {
                                        xy = Y_DOM._calcBorders(parentNode, xy);
                                }
                                

                                if (scrollTop || scrollLeft) {
                                    xy[0] -= scrollLeft;
                                    xy[1] -= scrollTop;
                                }
                            }
                            xy[0] += Y_DOM.docScrollX(node, doc);
                            xy[1] += Y_DOM.docScrollY(node, doc);

                        } else {
                            //Fix FIXED position -- add scrollbars
                            xy[0] += Y_DOM.docScrollX(node, doc);
                            xy[1] += Y_DOM.docScrollY(node, doc);
                        }
                    } else {
                        xy = Y_DOM._getOffset(node);
                    }
                }

                return xy;                
            };
        }
    }(),// NOTE: Executing for loadtime branching

    /**
     * Gets the current X position of an element based on page coordinates. 
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @method getX
     * @param element The target element
     * @return {Int} The X position of the element
     */

    getX: function(node) {
        return Y_DOM.getXY(node)[0];
    },

    /**
     * Gets the current Y position of an element based on page coordinates. 
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @method getY
     * @param element The target element
     * @return {Int} The Y position of the element
     */

    getY: function(node) {
        return Y_DOM.getXY(node)[1];
    },

    /**
     * Set the position of an html element in page coordinates.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setXY
     * @param element The target element
     * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
     * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
     */
    setXY: function(node, xy, noRetry) {
        var setStyle = Y_DOM.setStyle,
            pos,
            delta,
            newXY,
            currentXY;

        if (node && xy) {
            pos = Y_DOM.getStyle(node, POSITION);

            delta = Y_DOM._getOffset(node);       
            if (pos == 'static') { // default to relative
                pos = RELATIVE;
                setStyle(node, POSITION, pos);
            }
            currentXY = Y_DOM.getXY(node);

            if (xy[0] !== null) {
                setStyle(node, LEFT, xy[0] - currentXY[0] + delta[0] + 'px');
            }

            if (xy[1] !== null) {
                setStyle(node, TOP, xy[1] - currentXY[1] + delta[1] + 'px');
            }

            if (!noRetry) {
                newXY = Y_DOM.getXY(node);
                if (newXY[0] !== xy[0] || newXY[1] !== xy[1]) {
                    Y_DOM.setXY(node, xy, true); 
                }
            }
          
        } else {
        }
    },

    /**
     * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setX
     * @param element The target element
     * @param {Int} x The X values for new position (coordinates are page-based)
     */
    setX: function(node, x) {
        return Y_DOM.setXY(node, [x, null]);
    },

    /**
     * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setY
     * @param element The target element
     * @param {Int} y The Y values for new position (coordinates are page-based)
     */
    setY: function(node, y) {
        return Y_DOM.setXY(node, [null, y]);
    },

    /**
     * @method swapXY
     * @description Swap the xy position with another node
     * @param {Node} node The node to swap with
     * @param {Node} otherNode The other node to swap with
     * @return {Node}
     */
    swapXY: function(node, otherNode) {
        var xy = Y_DOM.getXY(node);
        Y_DOM.setXY(node, Y_DOM.getXY(otherNode));
        Y_DOM.setXY(otherNode, xy);
    },

    _calcBorders: function(node, xy2) {
        var t = parseInt(Y_DOM[GET_COMPUTED_STYLE](node, BORDER_TOP_WIDTH), 10) || 0,
            l = parseInt(Y_DOM[GET_COMPUTED_STYLE](node, BORDER_LEFT_WIDTH), 10) || 0;
        if (Y.UA.gecko) {
            if (RE_TABLE.test(node.tagName)) {
                t = 0;
                l = 0;
            }
        }
        xy2[0] += l;
        xy2[1] += t;
        return xy2;
    },

    _getWinSize: function(node, doc) {
        doc  = doc || (node) ? Y_DOM._getDoc(node) : Y.config.doc;
        var win = doc.defaultView || doc.parentWindow,
            mode = doc[COMPAT_MODE],
            h = win.innerHeight,
            w = win.innerWidth,
            root = doc[DOCUMENT_ELEMENT];

        if ( mode && !Y.UA.opera ) { // IE, Gecko
            if (mode != 'CSS1Compat') { // Quirks
                root = doc.body; 
            }
            h = root.clientHeight;
            w = root.clientWidth;
        }
        return { height: h, width: w };
    },

    _getDocSize: function(node) {
        var doc = (node) ? Y_DOM._getDoc(node) : Y.config.doc,
            root = doc[DOCUMENT_ELEMENT];

        if (doc[COMPAT_MODE] != 'CSS1Compat') {
            root = doc.body;
        }

        return { height: root.scrollHeight, width: root.scrollWidth };
    }
});

})(Y);
(function(Y) {
var TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',

    getOffsets = function(r1, r2) {
        var t = Math.max(r1[TOP], r2[TOP]),
            r = Math.min(r1[RIGHT], r2[RIGHT]),
            b = Math.min(r1[BOTTOM], r2[BOTTOM]),
            l = Math.max(r1[LEFT], r2[LEFT]),
            ret = {};
        
        ret[TOP] = t;
        ret[RIGHT] = r;
        ret[BOTTOM] = b;
        ret[LEFT] = l;
        return ret;
    },

    DOM = Y.DOM;

Y.mix(DOM, {
    /**
     * Returns an Object literal containing the following about this element: (top, right, bottom, left)
     * @for DOM
     * @method region
     * @param {HTMLElement} element The DOM element. 
     * @return {Object} Object literal containing the following about this element: (top, right, bottom, left)
     */
    region: function(node) {
        var xy = DOM.getXY(node),
            ret = false;
        
        if (node && xy) {
            ret = DOM._getRegion(
                xy[1], // top
                xy[0] + node.offsetWidth, // right
                xy[1] + node.offsetHeight, // bottom
                xy[0] // left
            );
        }

        return ret;
    },

    /**
     * Find the intersect information for the passes nodes.
     * @method intersect
     * @for DOM
     * @param {HTMLElement} element The first element 
     * @param {HTMLElement | Object} element2 The element or region to check the interect with
     * @param {Object} altRegion An object literal containing the region for the first element if we already have the data (for performance i.e. DragDrop)
     * @return {Object} Object literal containing the following intersection data: (top, right, bottom, left, area, yoff, xoff, inRegion)
     */
    intersect: function(node, node2, altRegion) {
        var r = altRegion || DOM.region(node), region = {},
            n = node2,
            off;

        if (n.tagName) {
            region = DOM.region(n);
        } else if (Y.Lang.isObject(node2)) {
            region = node2;
        } else {
            return false;
        }
        
        off = getOffsets(region, r);
        return {
            top: off[TOP],
            right: off[RIGHT],
            bottom: off[BOTTOM],
            left: off[LEFT],
            area: ((off[BOTTOM] - off[TOP]) * (off[RIGHT] - off[LEFT])),
            yoff: ((off[BOTTOM] - off[TOP])),
            xoff: (off[RIGHT] - off[LEFT]),
            inRegion: DOM.inRegion(node, node2, false, altRegion)
        };
        
    },
    /**
     * Check if any part of this node is in the passed region
     * @method inRegion
     * @for DOM
     * @param {Object} node2 The node to get the region from or an Object literal of the region
     * $param {Boolean} all Should all of the node be inside the region
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
     * @return {Boolean} True if in region, false if not.
     */
    inRegion: function(node, node2, all, altRegion) {
        var region = {},
            r = altRegion || DOM.region(node),
            n = node2,
            off;

        if (n.tagName) {
            region = DOM.region(n);
        } else if (Y.Lang.isObject(node2)) {
            region = node2;
        } else {
            return false;
        }
            
        if (all) {
            return (
                r[LEFT]   >= region[LEFT]   &&
                r[RIGHT]  <= region[RIGHT]  && 
                r[TOP]    >= region[TOP]    && 
                r[BOTTOM] <= region[BOTTOM]  );
        } else {
            off = getOffsets(region, r);
            if (off[BOTTOM] >= off[TOP] && off[RIGHT] >= off[LEFT]) {
                return true;
            } else {
                return false;
            }
            
        }
    },

    /**
     * Check if any part of this element is in the viewport
     * @method inViewportRegion
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {Boolean} all Should all of the node be inside the region
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
     * @return {Boolean} True if in region, false if not.
     */
    inViewportRegion: function(node, all, altRegion) {
        return DOM.inRegion(node, DOM.viewportRegion(node), all, altRegion);
            
    },

    _getRegion: function(t, r, b, l) {
        var region = {};

        region[TOP] = region[1] = t;
        region[LEFT] = region[0] = l;
        region[BOTTOM] = b;
        region[RIGHT] = r;
        region.width = region[RIGHT] - region[LEFT];
        region.height = region[BOTTOM] - region[TOP];

        return region;
    },

    /**
     * Returns an Object literal containing the following about the visible region of viewport: (top, right, bottom, left)
     * @method viewportRegion
     * @for DOM
     * @return {Object} Object literal containing the following about the visible region of the viewport: (top, right, bottom, left)
     */
    viewportRegion: function(node) {
        node = node || Y.config.doc.documentElement;
        var ret = false,
            scrollX,
            scrollY;

        if (node) {
            scrollX = DOM.docScrollX(node);
            scrollY = DOM.docScrollY(node);

            ret = DOM._getRegion(scrollY, // top
                DOM.winWidth(node) + scrollX, // right
                scrollY + DOM.winHeight(node), // bottom
                scrollX); // left
        }

        return ret;
    }
});
})(Y);


}, '3.3.0' ,{requires:['dom-base', 'dom-style', 'event-base']});
YUI.add('selector-native', function(Y) {

(function(Y) {
/**
 * The selector-native module provides support for native querySelector
 * @module dom
 * @submodule selector-native
 * @for Selector
 */

/**
 * Provides support for using CSS selectors to query the DOM 
 * @class Selector 
 * @static
 * @for Selector
 */

Y.namespace('Selector'); // allow native module to standalone

var COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
    OWNER_DOCUMENT = 'ownerDocument';

var Selector = {
    _foundCache: [],

    useNative: true,

    _compare: ('sourceIndex' in Y.config.doc.documentElement) ?
        function(nodeA, nodeB) {
            var a = nodeA.sourceIndex,
                b = nodeB.sourceIndex;

            if (a === b) {
                return 0;
            } else if (a > b) {
                return 1;
            }

            return -1;

        } : (Y.config.doc.documentElement[COMPARE_DOCUMENT_POSITION] ?
        function(nodeA, nodeB) {
            if (nodeA[COMPARE_DOCUMENT_POSITION](nodeB) & 4) {
                return -1;
            } else {
                return 1;
            }
        } :
        function(nodeA, nodeB) {
            var rangeA, rangeB, compare;
            if (nodeA && nodeB) {
                rangeA = nodeA[OWNER_DOCUMENT].createRange();
                rangeA.setStart(nodeA, 0);
                rangeB = nodeB[OWNER_DOCUMENT].createRange();
                rangeB.setStart(nodeB, 0);
                compare = rangeA.compareBoundaryPoints(1, rangeB); // 1 === Range.START_TO_END
            }

            return compare;
        
    }),

    _sort: function(nodes) {
        if (nodes) {
            nodes = Y.Array(nodes, 0, true);
            if (nodes.sort) {
                nodes.sort(Selector._compare);
            }
        }

        return nodes;
    },

    _deDupe: function(nodes) {
        var ret = [],
            i, node;

        for (i = 0; (node = nodes[i++]);) {
            if (!node._found) {
                ret[ret.length] = node;
                node._found = true;
            }
        }

        for (i = 0; (node = ret[i++]);) {
            node._found = null;
            node.removeAttribute('_found');
        }

        return ret;
    },

    /**
     * Retrieves a set of nodes based on a given CSS selector. 
     * @method query
     *
     * @param {string} selector The CSS Selector to test the node against.
     * @param {HTMLElement} root optional An HTMLElement to start the query from. Defaults to Y.config.doc
     * @param {Boolean} firstOnly optional Whether or not to return only the first match.
     * @return {Array} An array of nodes that match the given selector.
     * @static
     */
    query: function(selector, root, firstOnly, skipNative) {
        root = root || Y.config.doc;
        var ret = [],
            useNative = (Y.Selector.useNative && Y.config.doc.querySelector && !skipNative),
            queries = [[selector, root]],
            query,
            result,
            i,
            fn = (useNative) ? Y.Selector._nativeQuery : Y.Selector._bruteQuery;

        if (selector && fn) {
            // split group into seperate queries
            if (!skipNative && // already done if skipping
                    (!useNative || root.tagName)) { // split native when element scoping is needed
                queries = Selector._splitQueries(selector, root);
            }

            for (i = 0; (query = queries[i++]);) {
                result = fn(query[0], query[1], firstOnly);
                if (!firstOnly) { // coerce DOM Collection to Array
                    result = Y.Array(result, 0, true);
                }
                if (result) {
                    ret = ret.concat(result);
                }
            }

            if (queries.length > 1) { // remove dupes and sort by doc order 
                ret = Selector._sort(Selector._deDupe(ret));
            }
        }

        return (firstOnly) ? (ret[0] || null) : ret;

    },

    // allows element scoped queries to begin with combinator
    // e.g. query('> p', document.body) === query('body > p')
    _splitQueries: function(selector, node) {
        var groups = selector.split(','),
            queries = [],
            prefix = '',
            i, len;

        if (node) {
            // enforce for element scoping
            if (node.tagName) {
                node.id = node.id || Y.guid();
                prefix = '[id="' + node.id + '"] ';
            }

            for (i = 0, len = groups.length; i < len; ++i) {
                selector =  prefix + groups[i];
                queries.push([selector, node]);
            }
        }

        return queries;
    },

    _nativeQuery: function(selector, root, one) {
        if (Y.UA.webkit && selector.indexOf(':checked') > -1 &&
                (Y.Selector.pseudos && Y.Selector.pseudos.checked)) { // webkit (chrome, safari) fails to find "selected"
            return Y.Selector.query(selector, root, one, true); // redo with skipNative true to try brute query
        }
        try {
            return root['querySelector' + (one ? '' : 'All')](selector);
        } catch(e) { // fallback to brute if available
            return Y.Selector.query(selector, root, one, true); // redo with skipNative true
        }
    },

    filter: function(nodes, selector) {
        var ret = [],
            i, node;

        if (nodes && selector) {
            for (i = 0; (node = nodes[i++]);) {
                if (Y.Selector.test(node, selector)) {
                    ret[ret.length] = node;
                }
            }
        } else {
        }

        return ret;
    },

    test: function(node, selector, root) {
        var ret = false,
            groups = selector.split(','),
            useFrag = false,
            parent,
            item,
            items,
            frag,
            i, j, group;

        if (node && node.tagName) { // only test HTMLElements

            // we need a root if off-doc
            if (!root && !Y.DOM.inDoc(node)) {
                parent = node.parentNode;
                if (parent) { 
                    root = parent;
                } else { // only use frag when no parent to query
                    frag = node[OWNER_DOCUMENT].createDocumentFragment();
                    frag.appendChild(node);
                    root = frag;
                    useFrag = true;
                }
            }
            root = root || node[OWNER_DOCUMENT];

            if (!node.id) {
                node.id = Y.guid();
            }
            for (i = 0; (group = groups[i++]);) { // TODO: off-dom test
                group += '[id="' + node.id + '"]';
                items = Y.Selector.query(group, root);

                for (j = 0; item = items[j++];) {
                    if (item === node) {
                        ret = true;
                        break;
                    }
                }
                if (ret) {
                    break;
                }
            }

            if (useFrag) { // cleanup
                frag.removeChild(node);
            }
        }

        return ret;
    },

    /**
     * A convenience function to emulate Y.Node's aNode.ancestor(selector).
     * @param {HTMLElement} element An HTMLElement to start the query from.
     * @param {String} selector The CSS selector to test the node against.
     * @return {HTMLElement} The ancestor node matching the selector, or null.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan 
     * @static
     * @method ancestor
     */
    ancestor: function (element, selector, testSelf) {
        return Y.DOM.ancestor(element, function(n) {
            return Y.Selector.test(n, selector);
        }, testSelf);
    }
};

Y.mix(Y.Selector, Selector, true);

})(Y);


}, '3.3.0' ,{requires:['dom-base']});
YUI.add('selector-css2', function(Y) {

/**
 * The selector module provides helper methods allowing CSS2 Selectors to be used with DOM elements.
 * @module dom
 * @submodule selector-css2
 * @for Selector
 */

/**
 * Provides helper methods for collecting and filtering DOM elements.
 */

var PARENT_NODE = 'parentNode',
    TAG_NAME = 'tagName',
    ATTRIBUTES = 'attributes',
    COMBINATOR = 'combinator',
    PSEUDOS = 'pseudos',

    Selector = Y.Selector,

    SelectorCSS2 = {
        _reRegExpTokens: /([\^\$\?\[\]\*\+\-\.\(\)\|\\])/, // TODO: move?
        SORT_RESULTS: true,
        _children: function(node, tag) {
            var ret = node.children,
                i,
                children = [],
                childNodes,
                child;

            if (node.children && tag && node.children.tags) {
                children = node.children.tags(tag);
            } else if ((!ret && node[TAG_NAME]) || (ret && tag)) { // only HTMLElements have children
                childNodes = ret || node.childNodes;
                ret = [];
                for (i = 0; (child = childNodes[i++]);) {
                    if (child.tagName) {
                        if (!tag || tag === child.tagName) {
                            ret.push(child);
                        }
                    }
                }
            }

            return ret || [];
        },

        _re: {
            //attr: /(\[.*\])/g,
            attr: /(\[[^\]]*\])/g,
            pseudos: /:([\-\w]+(?:\(?:['"]?(.+)['"]?\)))*/i
        },

        /**
         * Mapping of shorthand tokens to corresponding attribute selector 
         * @property shorthand
         * @type object
         */
        shorthand: {
            '\\#(-?[_a-z]+[-\\w]*)': '[id=$1]',
            '\\.(-?[_a-z]+[-\\w]*)': '[className~=$1]'
        },

        /**
         * List of operators and corresponding boolean functions. 
         * These functions are passed the attribute and the current node's value of the attribute.
         * @property operators
         * @type object
         */
        operators: {
            '': function(node, attr) { return Y.DOM.getAttribute(node, attr) !== ''; }, // Just test for existence of attribute
            //'': '.+',
            //'=': '^{val}$', // equality
            '~=': '(?:^|\\s+){val}(?:\\s+|$)', // space-delimited
            '|=': '^{val}-?' // optional hyphen-delimited
        },

        pseudos: {
           'first-child': function(node) { 
                return Y.Selector._children(node[PARENT_NODE])[0] === node; 
            } 
        },

        _bruteQuery: function(selector, root, firstOnly) {
            var ret = [],
                nodes = [],
                tokens = Selector._tokenize(selector),
                token = tokens[tokens.length - 1],
                rootDoc = Y.DOM._getDoc(root),
                child,
                id,
                className,
                tagName;


            // if we have an initial ID, set to root when in document
            /*
            if (tokens[0] && rootDoc === root &&  
                    (id = tokens[0].id) &&
                    rootDoc.getElementById(id)) {
                root = rootDoc.getElementById(id);
            }
            */

            if (token) {
                // prefilter nodes
                id = token.id;
                className = token.className;
                tagName = token.tagName || '*';

                if (root.getElementsByTagName) { // non-IE lacks DOM api on doc frags
                    // try ID first, unless no root.all && root not in document
                    // (root.all works off document, but not getElementById)
                    // TODO: move to allById?
                    if (id && (root.all || (root.nodeType === 9 || Y.DOM.inDoc(root)))) {
                        nodes = Y.DOM.allById(id, root);
                    // try className
                    } else if (className) {
                        nodes = root.getElementsByClassName(className);
                    } else { // default to tagName
                        nodes = root.getElementsByTagName(tagName);
                    }

                } else { // brute getElementsByTagName('*')
                    child = root.firstChild;
                    while (child) {
                        if (child.tagName) { // only collect HTMLElements
                            nodes.push(child);
                        }
                        child = child.nextSilbing || child.firstChild;
                    }
                }
                if (nodes.length) {
                    ret = Selector._filterNodes(nodes, tokens, firstOnly);
                }
            }

            return ret;
        },
        
        _filterNodes: function(nodes, tokens, firstOnly) {
            var i = 0,
                j,
                len = tokens.length,
                n = len - 1,
                result = [],
                node = nodes[0],
                tmpNode = node,
                getters = Y.Selector.getters,
                operator,
                combinator,
                token,
                path,
                pass,
                //FUNCTION = 'function',
                value,
                tests,
                test;

            //do {
            for (i = 0; (tmpNode = node = nodes[i++]);) {
                n = len - 1;
                path = null;
                
                testLoop:
                while (tmpNode && tmpNode.tagName) {
                    token = tokens[n];
                    tests = token.tests;
                    j = tests.length;
                    if (j && !pass) {
                        while ((test = tests[--j])) {
                            operator = test[1];
                            if (getters[test[0]]) {
                                value = getters[test[0]](tmpNode, test[0]);
                            } else {
                                value = tmpNode[test[0]];
                                // use getAttribute for non-standard attributes
                                if (value === undefined && tmpNode.getAttribute) {
                                    value = tmpNode.getAttribute(test[0]);
                                }
                            }

                            if ((operator === '=' && value !== test[2]) ||  // fast path for equality
                                (typeof operator !== 'string' && // protect against String.test monkey-patch (Moo)
                                operator.test && !operator.test(value)) ||  // regex test
                                (!operator.test && // protect against RegExp as function (webkit)
                                        typeof operator === 'function' && !operator(tmpNode, test[0]))) { // function test

                                // skip non element nodes or non-matching tags
                                if ((tmpNode = tmpNode[path])) {
                                    while (tmpNode &&
                                        (!tmpNode.tagName ||
                                            (token.tagName && token.tagName !== tmpNode.tagName))
                                    ) {
                                        tmpNode = tmpNode[path]; 
                                    }
                                }
                                continue testLoop;
                            }
                        }
                    }

                    n--; // move to next token
                    // now that we've passed the test, move up the tree by combinator
                    if (!pass && (combinator = token.combinator)) {
                        path = combinator.axis;
                        tmpNode = tmpNode[path];

                        // skip non element nodes
                        while (tmpNode && !tmpNode.tagName) {
                            tmpNode = tmpNode[path]; 
                        }

                        if (combinator.direct) { // one pass only
                            path = null; 
                        }

                    } else { // success if we made it this far
                        result.push(node);
                        if (firstOnly) {
                            return result;
                        }
                        break;
                    }
                }
            }// while (tmpNode = node = nodes[++i]);
            node = tmpNode = null;
            return result;
        },

        combinators: {
            ' ': {
                axis: 'parentNode'
            },

            '>': {
                axis: 'parentNode',
                direct: true
            },


            '+': {
                axis: 'previousSibling',
                direct: true
            }
        },

        _parsers: [
            {
                name: ATTRIBUTES,
                re: /^\[(-?[a-z]+[\w\-]*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,
                fn: function(match, token) {
                    var operator = match[2] || '',
                        operators = Y.Selector.operators,
                        test;

                    // add prefiltering for ID and CLASS
                    if ((match[1] === 'id' && operator === '=') ||
                            (match[1] === 'className' &&
                            Y.config.doc.documentElement.getElementsByClassName &&
                            (operator === '~=' || operator === '='))) {
                        token.prefilter = match[1];
                        token[match[1]] = match[3];
                    }

                    // add tests
                    if (operator in operators) {
                        test = operators[operator];
                        if (typeof test === 'string') {
                            match[3] = match[3].replace(Y.Selector._reRegExpTokens, '\\$1');
                            test = Y.DOM._getRegExp(test.replace('{val}', match[3]));
                        }
                        match[2] = test;
                    }
                    if (!token.last || token.prefilter !== match[1]) {
                        return match.slice(1);
                    }
                }

            },
            {
                name: TAG_NAME,
                re: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
                fn: function(match, token) {
                    var tag = match[1].toUpperCase();
                    token.tagName = tag;

                    if (tag !== '*' && (!token.last || token.prefilter)) {
                        return [TAG_NAME, '=', tag];
                    }
                    if (!token.prefilter) {
                        token.prefilter = 'tagName';
                    }
                }
            },
            {
                name: COMBINATOR,
                re: /^\s*([>+~]|\s)\s*/,
                fn: function(match, token) {
                }
            },
            {
                name: PSEUDOS,
                re: /^:([\-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
                fn: function(match, token) {
                    var test = Selector[PSEUDOS][match[1]];
                    if (test) { // reorder match array
                        return [match[2], test];
                    } else { // selector token not supported (possibly missing CSS3 module)
                        return false;
                    }
                }
            }
            ],

        _getToken: function(token) {
            return {
                tagName: null,
                id: null,
                className: null,
                attributes: {},
                combinator: null,
                tests: []
            };
        },

        /**
            Break selector into token units per simple selector.
            Combinator is attached to the previous token.
         */
        _tokenize: function(selector) {
            selector = selector || '';
            selector = Selector._replaceShorthand(Y.Lang.trim(selector)); 
            var token = Selector._getToken(),     // one token per simple selector (left selector holds combinator)
                query = selector, // original query for debug report
                tokens = [],    // array of tokens
                found = false,  // whether or not any matches were found this pass
                match,         // the regex match
                test,
                i, parser;

            /*
                Search for selector patterns, store, and strip them from the selector string
                until no patterns match (invalid selector) or we run out of chars.

                Multiple attributes and pseudos are allowed, in any order.
                for example:
                    'form:first-child[type=button]:not(button)[lang|=en]'
            */
            outer:
            do {
                found = false; // reset after full pass
                for (i = 0; (parser = Selector._parsers[i++]);) {
                    if ( (match = parser.re.exec(selector)) ) { // note assignment
                        if (parser.name !== COMBINATOR ) {
                            token.selector = selector;
                        }
                        selector = selector.replace(match[0], ''); // strip current match from selector
                        if (!selector.length) {
                            token.last = true;
                        }

                        if (Selector._attrFilters[match[1]]) { // convert class to className, etc.
                            match[1] = Selector._attrFilters[match[1]];
                        }

                        test = parser.fn(match, token);
                        if (test === false) { // selector not supported
                            found = false;
                            break outer;
                        } else if (test) {
                            token.tests.push(test);
                        }

                        if (!selector.length || parser.name === COMBINATOR) {
                            tokens.push(token);
                            token = Selector._getToken(token);
                            if (parser.name === COMBINATOR) {
                                token.combinator = Y.Selector.combinators[match[1]];
                            }
                        }
                        found = true;
                    }
                }
            } while (found && selector.length);

            if (!found || selector.length) { // not fully parsed
                tokens = [];
            }
            return tokens;
        },

        _replaceShorthand: function(selector) {
            var shorthand = Selector.shorthand,
                attrs = selector.match(Selector._re.attr), // pull attributes to avoid false pos on "." and "#"
                pseudos = selector.match(Selector._re.pseudos), // pull attributes to avoid false pos on "." and "#"
                re, i, len;

            if (pseudos) {
                selector = selector.replace(Selector._re.pseudos, '!!REPLACED_PSEUDO!!');
            }

            if (attrs) {
                selector = selector.replace(Selector._re.attr, '!!REPLACED_ATTRIBUTE!!');
            }

            for (re in shorthand) {
                if (shorthand.hasOwnProperty(re)) {
                    selector = selector.replace(Y.DOM._getRegExp(re, 'gi'), shorthand[re]);
                }
            }

            if (attrs) {
                for (i = 0, len = attrs.length; i < len; ++i) {
                    selector = selector.replace('!!REPLACED_ATTRIBUTE!!', attrs[i]);
                }
            }
            if (pseudos) {
                for (i = 0, len = pseudos.length; i < len; ++i) {
                    selector = selector.replace('!!REPLACED_PSEUDO!!', pseudos[i]);
                }
            }
            return selector;
        },

        _attrFilters: {
            'class': 'className',
            'for': 'htmlFor'
        },

        getters: {
            href: function(node, attr) {
                return Y.DOM.getAttribute(node, attr);
            }
        }
    };

Y.mix(Y.Selector, SelectorCSS2, true);
Y.Selector.getters.src = Y.Selector.getters.rel = Y.Selector.getters.href;

// IE wants class with native queries
if (Y.Selector.useNative && Y.config.doc.querySelector) {
    Y.Selector.shorthand['\\.(-?[_a-z]+[-\\w]*)'] = '[class~=$1]';
}



}, '3.3.0' ,{requires:['selector-native']});


YUI.add('selector', function(Y){}, '3.3.0' ,{use:['selector-native', 'selector-css2']});



YUI.add('dom', function(Y){}, '3.3.0' ,{use:['dom-base', 'dom-style', 'dom-screen', 'selector']});

/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
var GLOBAL_ENV = YUI.Env;

if (!GLOBAL_ENV._ready) {
    GLOBAL_ENV._ready = function() {
        GLOBAL_ENV.DOMReady = true;
        GLOBAL_ENV.remove(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);
    };

    // if (!YUI.UA.ie) {
        GLOBAL_ENV.add(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);
    // }
}

YUI.add('event-base', function(Y) {

/*
 * DOM event listener abstraction layer
 * @module event
 * @submodule event-base
 */

/**
 * The domready event fires at the moment the browser's DOM is
 * usable. In most cases, this is before images are fully
 * downloaded, allowing you to provide a more responsive user
 * interface.
 *
 * In YUI 3, domready subscribers will be notified immediately if
 * that moment has already passed when the subscription is created.
 *
 * One exception is if the yui.js file is dynamically injected into
 * the page.  If this is done, you must tell the YUI instance that
 * you did this in order for DOMReady (and window load events) to
 * fire normally.  That configuration option is 'injected' -- set
 * it to true if the yui.js script is not included inline.
 *
 * This method is part of the 'event-ready' module, which is a
 * submodule of 'event'.
 *
 * @event domready
 * @for YUI
 */
Y.publish('domready', {
    fireOnce: true,
    async: true
});

if (GLOBAL_ENV.DOMReady) {
    Y.fire('domready');
} else {
    Y.Do.before(function() { Y.fire('domready'); }, YUI.Env, '_ready');
}

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event
 * @submodule event-base
 */

/**
 * Wraps a DOM event, properties requiring browser abstraction are
 * fixed here.  Provids a security layer when required.
 * @class DOMEventFacade
 * @param ev {Event} the DOM event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 * @param wrapper {Event.Custom} the custom event wrapper for this DOM event
 */

    var ua = Y.UA,

    EMPTY = {},

    /**
     * webkit key remapping required for Safari < 3.1
     * @property webkitKeymap
     * @private
     */
    webkitKeymap = {
        63232: 38, // up
        63233: 40, // down
        63234: 37, // left
        63235: 39, // right
        63276: 33, // page up
        63277: 34, // page down
        25:     9, // SHIFT-TAB (Safari provides a different key code in
                   // this case, even though the shiftKey modifier is set)
        63272: 46, // delete
        63273: 36, // home
        63275: 35  // end
    },

    /**
     * Returns a wrapped node.  Intended to be used on event targets,
     * so it will return the node's parent if the target is a text
     * node.
     *
     * If accessing a property of the node throws an error, this is
     * probably the anonymous div wrapper Gecko adds inside text
     * nodes.  This likely will only occur when attempting to access
     * the relatedTarget.  In this case, we now return null because
     * the anonymous div is completely useless and we do not know
     * what the related target was because we can't even get to
     * the element's parent node.
     *
     * @method resolve
     * @private
     */
    resolve = function(n) {
        if (!n) {
            return n;
        }
        try {
            if (n && 3 == n.nodeType) {
                n = n.parentNode;
            }
        } catch(e) {
            return null;
        }

        return Y.one(n);
    },

    DOMEventFacade = function(ev, currentTarget, wrapper) {
        this._event = ev;
        this._currentTarget = currentTarget;
        this._wrapper = wrapper || EMPTY;

        // if not lazy init
        this.init();
    };

Y.extend(DOMEventFacade, Object, {

    init: function() {

        var e = this._event,
            overrides = this._wrapper.overrides,
            x = e.pageX,
            y = e.pageY,
            c,
            currentTarget = this._currentTarget;

        this.altKey   = e.altKey;
        this.ctrlKey  = e.ctrlKey;
        this.metaKey  = e.metaKey;
        this.shiftKey = e.shiftKey;
        this.type     = (overrides && overrides.type) || e.type;
        this.clientX  = e.clientX;
        this.clientY  = e.clientY;

        this.pageX = x;
        this.pageY = y;

        c = e.keyCode || e.charCode;

        if (ua.webkit && (c in webkitKeymap)) {
            c = webkitKeymap[c];
        }

        this.keyCode = c;
        this.charCode = c;
        this.which = e.which || e.charCode || c;
        // this.button = e.button;
        this.button = this.which;

        this.target = resolve(e.target);
        this.currentTarget = resolve(currentTarget);
        this.relatedTarget = resolve(e.relatedTarget);

        if (e.type == "mousewheel" || e.type == "DOMMouseScroll") {
            this.wheelDelta = (e.detail) ? (e.detail * -1) : Math.round(e.wheelDelta / 80) || ((e.wheelDelta < 0) ? -1 : 1);
        }

        if (this._touch) {
            this._touch(e, currentTarget, this._wrapper);
        }
    },

    stopPropagation: function() {
        this._event.stopPropagation();
        this._wrapper.stopped = 1;
        this.stopped = 1;
    },

    stopImmediatePropagation: function() {
        var e = this._event;
        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        } else {
            this.stopPropagation();
        }
        this._wrapper.stopped = 2;
        this.stopped = 2;
    },

    preventDefault: function(returnValue) {
        var e = this._event;
        e.preventDefault();
        e.returnValue = returnValue || false;
        this._wrapper.prevented = 1;
        this.prevented = 1;
    },

    halt: function(immediate) {
        if (immediate) {
            this.stopImmediatePropagation();
        } else {
            this.stopPropagation();
        }

        this.preventDefault();
    }

});

DOMEventFacade.resolve = resolve;
Y.DOM2EventFacade = DOMEventFacade;
Y.DOMEventFacade = DOMEventFacade;

    /**
     * The native event
     * @property _event
     */

    /**
     * The X location of the event on the page (including scroll)
     * @property pageX
     * @type int
     */

    /**
     * The Y location of the event on the page (including scroll)
     * @property pageY
     * @type int
     */

    /**
     * The keyCode for key events.  Uses charCode if keyCode is not available
     * @property keyCode
     * @type int
     */

    /**
     * The charCode for key events.  Same as keyCode
     * @property charCode
     * @type int
     */

    /**
     * The button that was pushed.
     * @property button
     * @type int
     */

    /**
     * The button that was pushed.  Same as button.
     * @property which
     * @type int
     */

    /**
     * Node reference for the targeted element
     * @propery target
     * @type Node
     */

    /**
     * Node reference for the element that the listener was attached to.
     * @propery currentTarget
     * @type Node
     */

    /**
     * Node reference to the relatedTarget
     * @propery relatedTarget
     * @type Node
     */

    /**
     * Number representing the direction and velocity of the movement of the mousewheel.
     * Negative is down, the higher the number, the faster.  Applies to the mousewheel event.
     * @property wheelDelta
     * @type int
     */

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     * @param returnValue {string} sets the returnValue of the event to this value
     * (rather than the default false value).  This can be used to add a customized
     * confirmation query to the beforeunload event).
     */

    /**
     * Stops the event propagation and prevents the default
     * event behavior.
     * @method halt
     * @param immediate {boolean} if true additional listeners
     * on the current target will not be executed
     */
(function() {
/**
 * DOM event listener abstraction layer
 * @module event
 * @submodule event-base
 */

/**
 * The event utility provides functions to add and remove event listeners,
 * event cleansing.  It also tries to automatically remove listeners it
 * registers during the unload event.
 *
 * @class Event
 * @static
 */

Y.Env.evt.dom_wrappers = {};
Y.Env.evt.dom_map = {};

var _eventenv = Y.Env.evt,
    config = Y.config,
    win = config.win,
    add = YUI.Env.add,
    remove = YUI.Env.remove,

    onLoad = function() {
        YUI.Env.windowLoaded = true;
        Y.Event._load();
        remove(win, "load", onLoad);
    },

    onUnload = function() {
        Y.Event._unload();
    },

    EVENT_READY = 'domready',

    COMPAT_ARG = '~yui|2|compat~',

    shouldIterate = function(o) {
        try {
            return (o && typeof o !== "string" && Y.Lang.isNumber(o.length) &&
                    !o.tagName && !o.alert);
        } catch(ex) {
            return false;
        }

    },

Event = function() {

    /**
     * True after the onload event has fired
     * @property _loadComplete
     * @type boolean
     * @static
     * @private
     */
    var _loadComplete =  false,

    /**
     * The number of times to poll after window.onload.  This number is
     * increased if additional late-bound handlers are requested after
     * the page load.
     * @property _retryCount
     * @static
     * @private
     */
    _retryCount = 0,

    /**
     * onAvailable listeners
     * @property _avail
     * @static
     * @private
     */
    _avail = [],

    /**
     * Custom event wrappers for DOM events.  Key is
     * 'event:' + Element uid stamp + event type
     * @property _wrappers
     * @type Y.Event.Custom
     * @static
     * @private
     */
    _wrappers = _eventenv.dom_wrappers,

    _windowLoadKey = null,

    /**
     * Custom event wrapper map DOM events.  Key is
     * Element uid stamp.  Each item is a hash of custom event
     * wrappers as provided in the _wrappers collection.  This
     * provides the infrastructure for getListeners.
     * @property _el_events
     * @static
     * @private
     */
    _el_events = _eventenv.dom_map;

    return {

        /**
         * The number of times we should look for elements that are not
         * in the DOM at the time the event is requested after the document
         * has been loaded.  The default is 1000@amp;40 ms, so it will poll
         * for 40 seconds or until all outstanding handlers are bound
         * (whichever comes first).
         * @property POLL_RETRYS
         * @type int
         * @static
         * @final
         */
        POLL_RETRYS: 1000,

        /**
         * The poll interval in milliseconds
         * @property POLL_INTERVAL
         * @type int
         * @static
         * @final
         */
        POLL_INTERVAL: 40,

        /**
         * addListener/removeListener can throw errors in unexpected scenarios.
         * These errors are suppressed, the method returns false, and this property
         * is set
         * @property lastError
         * @static
         * @type Error
         */
        lastError: null,


        /**
         * poll handle
         * @property _interval
         * @static
         * @private
         */
        _interval: null,

        /**
         * document readystate poll handle
         * @property _dri
         * @static
         * @private
         */
         _dri: null,

        /**
         * True when the document is initially usable
         * @property DOMReady
         * @type boolean
         * @static
         */
        DOMReady: false,

        /**
         * @method startInterval
         * @static
         * @private
         */
        startInterval: function() {
            if (!Event._interval) {
Event._interval = setInterval(Event._poll, Event.POLL_INTERVAL);
            }
        },

        /**
         * Executes the supplied callback when the item with the supplied
         * id is found.  This is meant to be used to execute behavior as
         * soon as possible as the page loads.  If you use this after the
         * initial page load it will poll for a fixed time for the element.
         * The number of times it will poll and the frequency are
         * configurable.  By default it will poll for 10 seconds.
         *
         * <p>The callback is executed with a single parameter:
         * the custom object parameter, if provided.</p>
         *
         * @method onAvailable
         *
         * @param {string||string[]}   id the id of the element, or an array
         * of ids to look for.
         * @param {function} fn what to execute when the element is found.
         * @param {object}   p_obj an optional object to be passed back as
         *                   a parameter to fn.
         * @param {boolean|object}  p_override If set to true, fn will execute
         *                   in the context of p_obj, if set to an object it
         *                   will execute in the context of that object
         * @param checkContent {boolean} check child node readiness (onContentReady)
         * @static
         * @deprecated Use Y.on("available")
         */
        // @TODO fix arguments
        onAvailable: function(id, fn, p_obj, p_override, checkContent, compat) {

            var a = Y.Array(id), i, availHandle;


            for (i=0; i<a.length; i=i+1) {
                _avail.push({
                    id:         a[i],
                    fn:         fn,
                    obj:        p_obj,
                    override:   p_override,
                    checkReady: checkContent,
                    compat:     compat
                });
            }
            _retryCount = this.POLL_RETRYS;

            // We want the first test to be immediate, but async
            setTimeout(Event._poll, 0);

            availHandle = new Y.EventHandle({

                _delete: function() {
                    // set by the event system for lazy DOM listeners
                    if (availHandle.handle) {
                        availHandle.handle.detach();
                        return;
                    }

                    var i, j;

                    // otherwise try to remove the onAvailable listener(s)
                    for (i = 0; i < a.length; i++) {
                        for (j = 0; j < _avail.length; j++) {
                            if (a[i] === _avail[j].id) {
                                _avail.splice(j, 1);
                            }
                        }
                    }
                }

            });

            return availHandle;
        },

        /**
         * Works the same way as onAvailable, but additionally checks the
         * state of sibling elements to determine if the content of the
         * available element is safe to modify.
         *
         * <p>The callback is executed with a single parameter:
         * the custom object parameter, if provided.</p>
         *
         * @method onContentReady
         *
         * @param {string}   id the id of the element to look for.
         * @param {function} fn what to execute when the element is ready.
         * @param {object}   obj an optional object to be passed back as
         *                   a parameter to fn.
         * @param {boolean|object}  override If set to true, fn will execute
         *                   in the context of p_obj.  If an object, fn will
         *                   exectute in the context of that object
         *
         * @static
         * @deprecated Use Y.on("contentready")
         */
        // @TODO fix arguments
        onContentReady: function(id, fn, obj, override, compat) {
            return Event.onAvailable(id, fn, obj, override, true, compat);
        },

        /**
         * Adds an event listener
         *
         * @method attach
         *
         * @param {String}   type     The type of event to append
         * @param {Function} fn        The method the event invokes
         * @param {String|HTMLElement|Array|NodeList} el An id, an element
         *  reference, or a collection of ids and/or elements to assign the
         *  listener to.
         * @param {Object}   context optional context object
         * @param {Boolean|object}  args 0..n arguments to pass to the callback
         * @return {EventHandle} an object to that can be used to detach the listener
         *
         * @static
         */

        attach: function(type, fn, el, context) {
            return Event._attach(Y.Array(arguments, 0, true));
        },

        _createWrapper: function (el, type, capture, compat, facade) {

            var cewrapper,
                ek  = Y.stamp(el),
                key = 'event:' + ek + type;

            if (false === facade) {
                key += 'native';
            }
            if (capture) {
                key += 'capture';
            }


            cewrapper = _wrappers[key];


            if (!cewrapper) {
                // create CE wrapper
                cewrapper = Y.publish(key, {
                    silent: true,
                    bubbles: false,
                    contextFn: function() {
                        if (compat) {
                            return cewrapper.el;
                        } else {
                            cewrapper.nodeRef = cewrapper.nodeRef || Y.one(cewrapper.el);
                            return cewrapper.nodeRef;
                        }
                    }
                });

                cewrapper.overrides = {};

                // for later removeListener calls
                cewrapper.el = el;
                cewrapper.key = key;
                cewrapper.domkey = ek;
                cewrapper.type = type;
                cewrapper.fn = function(e) {
                    cewrapper.fire(Event.getEvent(e, el, (compat || (false === facade))));
                };
                cewrapper.capture = capture;

                if (el == win && type == "load") {
                    // window load happens once
                    cewrapper.fireOnce = true;
                    _windowLoadKey = key;
                }

                _wrappers[key] = cewrapper;
                _el_events[ek] = _el_events[ek] || {};
                _el_events[ek][key] = cewrapper;

                add(el, type, cewrapper.fn, capture);
            }

            return cewrapper;

        },

        _attach: function(args, conf) {

            var compat,
                handles, oEl, cewrapper, context,
                fireNow = false, ret,
                type = args[0],
                fn = args[1],
                el = args[2] || win,
                facade = conf && conf.facade,
                capture = conf && conf.capture,
                overrides = conf && conf.overrides;

            if (args[args.length-1] === COMPAT_ARG) {
                compat = true;
                // trimmedArgs.pop();
            }

            if (!fn || !fn.call) {
// throw new TypeError(type + " attach call failed, callback undefined");
                return false;
            }

            // The el argument can be an array of elements or element ids.
            if (shouldIterate(el)) {

                handles=[];

                Y.each(el, function(v, k) {
                    args[2] = v;
                    handles.push(Event._attach(args, conf));
                });

                // return (handles.length === 1) ? handles[0] : handles;
                return new Y.EventHandle(handles);

            // If the el argument is a string, we assume it is
            // actually the id of the element.  If the page is loaded
            // we convert el to the actual element, otherwise we
            // defer attaching the event until the element is
            // ready
            } else if (Y.Lang.isString(el)) {

                // oEl = (compat) ? Y.DOM.byId(el) : Y.Selector.query(el);

                if (compat) {
                    oEl = Y.DOM.byId(el);
                } else {

                    oEl = Y.Selector.query(el);

                    switch (oEl.length) {
                        case 0:
                            oEl = null;
                            break;
                        case 1:
                            oEl = oEl[0];
                            break;
                        default:
                            args[2] = oEl;
                            return Event._attach(args, conf);
                    }
                }

                if (oEl) {

                    el = oEl;

                // Not found = defer adding the event until the element is available
                } else {

                    ret = Event.onAvailable(el, function() {

                        ret.handle = Event._attach(args, conf);

                    }, Event, true, false, compat);

                    return ret;

                }
            }

            // Element should be an html element or node
            if (!el) {
                return false;
            }

            if (Y.Node && Y.instanceOf(el, Y.Node)) {
                el = Y.Node.getDOMNode(el);
            }

            cewrapper = Event._createWrapper(el, type, capture, compat, facade);
            if (overrides) {
                Y.mix(cewrapper.overrides, overrides);
            }

            if (el == win && type == "load") {

                // if the load is complete, fire immediately.
                // all subscribers, including the current one
                // will be notified.
                if (YUI.Env.windowLoaded) {
                    fireNow = true;
                }
            }

            if (compat) {
                args.pop();
            }

            context = args[3];

            // set context to the Node if not specified
            // ret = cewrapper.on.apply(cewrapper, trimmedArgs);
            ret = cewrapper._on(fn, context, (args.length > 4) ? args.slice(4) : null);

            if (fireNow) {
                cewrapper.fire();
            }

            return ret;

        },

        /**
         * Removes an event listener.  Supports the signature the event was bound
         * with, but the preferred way to remove listeners is using the handle
         * that is returned when using Y.on
         *
         * @method detach
         *
         * @param {String} type the type of event to remove.
         * @param {Function} fn the method the event invokes.  If fn is
         * undefined, then all event handlers for the type of event are
         * removed.
         * @param {String|HTMLElement|Array|NodeList|EventHandle} el An
         * event handle, an id, an element reference, or a collection
         * of ids and/or elements to remove the listener from.
         * @return {boolean} true if the unbind was successful, false otherwise.
         * @static
         */
        detach: function(type, fn, el, obj) {

            var args=Y.Array(arguments, 0, true), compat, l, ok, i,
                id, ce;

            if (args[args.length-1] === COMPAT_ARG) {
                compat = true;
                // args.pop();
            }

            if (type && type.detach) {
                return type.detach();
            }

            // The el argument can be a string
            if (typeof el == "string") {

                // el = (compat) ? Y.DOM.byId(el) : Y.all(el);
                if (compat) {
                    el = Y.DOM.byId(el);
                } else {
                    el = Y.Selector.query(el);
                    l = el.length;
                    if (l < 1) {
                        el = null;
                    } else if (l == 1) {
                        el = el[0];
                    }
                }
                // return Event.detach.apply(Event, args);
            }

            if (!el) {
                return false;
            }

            if (el.detach) {
                args.splice(2, 1);
                return el.detach.apply(el, args);
            // The el argument can be an array of elements or element ids.
            } else if (shouldIterate(el)) {
                ok = true;
                for (i=0, l=el.length; i<l; ++i) {
                    args[2] = el[i];
                    ok = ( Y.Event.detach.apply(Y.Event, args) && ok );
                }

                return ok;
            }

            if (!type || !fn || !fn.call) {
                return Event.purgeElement(el, false, type);
            }

            id = 'event:' + Y.stamp(el) + type;
            ce = _wrappers[id];

            if (ce) {
                return ce.detach(fn);
            } else {
                return false;
            }

        },

        /**
         * Finds the event in the window object, the caller's arguments, or
         * in the arguments of another method in the callstack.  This is
         * executed automatically for events registered through the event
         * manager, so the implementer should not normally need to execute
         * this function at all.
         * @method getEvent
         * @param {Event} e the event parameter from the handler
         * @param {HTMLElement} el the element the listener was attached to
         * @return {Event} the event
         * @static
         */
        getEvent: function(e, el, noFacade) {
            var ev = e || win.event;

            return (noFacade) ? ev :
                new Y.DOMEventFacade(ev, el, _wrappers['event:' + Y.stamp(el) + e.type]);
        },

        /**
         * Generates an unique ID for the element if it does not already
         * have one.
         * @method generateId
         * @param el the element to create the id for
         * @return {string} the resulting id of the element
         * @static
         */
        generateId: function(el) {
            return Y.DOM.generateID(el);
        },

        /**
         * We want to be able to use getElementsByTagName as a collection
         * to attach a group of events to.  Unfortunately, different
         * browsers return different types of collections.  This function
         * tests to determine if the object is array-like.  It will also
         * fail if the object is an array, but is empty.
         * @method _isValidCollection
         * @param o the object to test
         * @return {boolean} true if the object is array-like and populated
         * @deprecated was not meant to be used directly
         * @static
         * @private
         */
        _isValidCollection: shouldIterate,

        /**
         * hook up any deferred listeners
         * @method _load
         * @static
         * @private
         */
        _load: function(e) {
            if (!_loadComplete) {
                _loadComplete = true;

                // Just in case DOMReady did not go off for some reason
                // E._ready();
                if (Y.fire) {
                    Y.fire(EVENT_READY);
                }

                // Available elements may not have been detected before the
                // window load event fires. Try to find them now so that the
                // the user is more likely to get the onAvailable notifications
                // before the window load notification
                Event._poll();
            }
        },

        /**
         * Polling function that runs before the onload event fires,
         * attempting to attach to DOM Nodes as soon as they are
         * available
         * @method _poll
         * @static
         * @private
         */
        _poll: function() {
            if (Event.locked) {
                return;
            }

            if (Y.UA.ie && !YUI.Env.DOMReady) {
                // Hold off if DOMReady has not fired and check current
                // readyState to protect against the IE operation aborted
                // issue.
                Event.startInterval();
                return;
            }

            Event.locked = true;

            // keep trying until after the page is loaded.  We need to
            // check the page load state prior to trying to bind the
            // elements so that we can be certain all elements have been
            // tested appropriately
            var i, len, item, el, notAvail, executeItem,
                tryAgain = !_loadComplete;

            if (!tryAgain) {
                tryAgain = (_retryCount > 0);
            }

            // onAvailable
            notAvail = [];

            executeItem = function (el, item) {
                var context, ov = item.override;
                if (item.compat) {
                    if (item.override) {
                        if (ov === true) {
                            context = item.obj;
                        } else {
                            context = ov;
                        }
                    } else {
                        context = el;
                    }
                    item.fn.call(context, item.obj);
                } else {
                    context = item.obj || Y.one(el);
                    item.fn.apply(context, (Y.Lang.isArray(ov)) ? ov : []);
                }
            };

            // onAvailable
            for (i=0,len=_avail.length; i<len; ++i) {
                item = _avail[i];
                if (item && !item.checkReady) {

                    // el = (item.compat) ? Y.DOM.byId(item.id) : Y.one(item.id);
                    el = (item.compat) ? Y.DOM.byId(item.id) : Y.Selector.query(item.id, null, true);

                    if (el) {
                        executeItem(el, item);
                        _avail[i] = null;
                    } else {
                        notAvail.push(item);
                    }
                }
            }

            // onContentReady
            for (i=0,len=_avail.length; i<len; ++i) {
                item = _avail[i];
                if (item && item.checkReady) {

                    // el = (item.compat) ? Y.DOM.byId(item.id) : Y.one(item.id);
                    el = (item.compat) ? Y.DOM.byId(item.id) : Y.Selector.query(item.id, null, true);

                    if (el) {
                        // The element is available, but not necessarily ready
                        // @todo should we test parentNode.nextSibling?
                        if (_loadComplete || (el.get && el.get('nextSibling')) || el.nextSibling) {
                            executeItem(el, item);
                            _avail[i] = null;
                        }
                    } else {
                        notAvail.push(item);
                    }
                }
            }

            _retryCount = (notAvail.length === 0) ? 0 : _retryCount - 1;

            if (tryAgain) {
                // we may need to strip the nulled out items here
                Event.startInterval();
            } else {
                clearInterval(Event._interval);
                Event._interval = null;
            }

            Event.locked = false;

            return;

        },

        /**
         * Removes all listeners attached to the given element via addListener.
         * Optionally, the node's children can also be purged.
         * Optionally, you can specify a specific type of event to remove.
         * @method purgeElement
         * @param {HTMLElement} el the element to purge
         * @param {boolean} recurse recursively purge this element's children
         * as well.  Use with caution.
         * @param {string} type optional type of listener to purge. If
         * left out, all listeners will be removed
         * @static
         */
        purgeElement: function(el, recurse, type) {
            // var oEl = (Y.Lang.isString(el)) ? Y.one(el) : el,
            var oEl = (Y.Lang.isString(el)) ?  Y.Selector.query(el, null, true) : el,
                lis = Event.getListeners(oEl, type), i, len, props, children, child;

            if (recurse && oEl) {
                lis = lis || [];
                children = Y.Selector.query('*', oEl);
                i = 0;
                len = children.length;
                for (; i < len; ++i) {
                    child = Event.getListeners(children[i], type);
                    if (child) {
                        lis = lis.concat(child);
                    }
                }
            }

            if (lis) {
                i = 0;
                len = lis.length;
                for (; i < len; ++i) {
                    props = lis[i];
                    props.detachAll();
                    remove(props.el, props.type, props.fn, props.capture);
                    delete _wrappers[props.key];
                    delete _el_events[props.domkey][props.key];
                }
            }

        },


        /**
         * Returns all listeners attached to the given element via addListener.
         * Optionally, you can specify a specific type of event to return.
         * @method getListeners
         * @param el {HTMLElement|string} the element or element id to inspect
         * @param type {string} optional type of listener to return. If
         * left out, all listeners will be returned
         * @return {Y.Custom.Event} the custom event wrapper for the DOM event(s)
         * @static
         */
        getListeners: function(el, type) {
            var ek = Y.stamp(el, true), evts = _el_events[ek],
                results=[] , key = (type) ? 'event:' + ek + type : null,
                adapters = _eventenv.plugins;

            if (!evts) {
                return null;
            }

            if (key) {
                // look for synthetic events
                if (adapters[type] && adapters[type].eventDef) {
                    key += '_synth';
                }

                if (evts[key]) {
                    results.push(evts[key]);
                }

                // get native events as well
                key += 'native';
                if (evts[key]) {
                    results.push(evts[key]);
                }

            } else {
                Y.each(evts, function(v, k) {
                    results.push(v);
                });
            }

            return (results.length) ? results : null;
        },

        /**
         * Removes all listeners registered by pe.event.  Called
         * automatically during the unload event.
         * @method _unload
         * @static
         * @private
         */
        _unload: function(e) {
            Y.each(_wrappers, function(v, k) {
                v.detachAll();
                remove(v.el, v.type, v.fn, v.capture);
                delete _wrappers[k];
                delete _el_events[v.domkey][k];
            });
            remove(win, "unload", onUnload);
        },

        /**
         * Adds a DOM event directly without the caching, cleanup, context adj, etc
         *
         * @method nativeAdd
         * @param {HTMLElement} el      the element to bind the handler to
         * @param {string}      type   the type of event handler
         * @param {function}    fn      the callback to invoke
         * @param {boolen}      capture capture or bubble phase
         * @static
         * @private
         */
        nativeAdd: add,

        /**
         * Basic remove listener
         *
         * @method nativeRemove
         * @param {HTMLElement} el      the element to bind the handler to
         * @param {string}      type   the type of event handler
         * @param {function}    fn      the callback to invoke
         * @param {boolen}      capture capture or bubble phase
         * @static
         * @private
         */
        nativeRemove: remove
    };

}();

Y.Event = Event;

if (config.injected || YUI.Env.windowLoaded) {
    onLoad();
} else {
    add(win, "load", onLoad);
}

// Process onAvailable/onContentReady items when when the DOM is ready in IE
if (Y.UA.ie) {
    Y.on(EVENT_READY, Event._poll);
}

add(win, "unload", onUnload);

Event.Custom = Y.CustomEvent;
Event.Subscriber = Y.Subscriber;
Event.Target = Y.EventTarget;
Event.Handle = Y.EventHandle;
Event.Facade = Y.EventFacade;

Event._poll();

})();

/**
 * DOM event listener abstraction layer
 * @module event
 * @submodule event-base
 */

/**
 * Executes the callback as soon as the specified element
 * is detected in the DOM.  This function expects a selector
 * string for the element(s) to detect.  If you already have
 * an element reference, you don't need this event.
 * @event available
 * @param type {string} 'available'
 * @param fn {function} the callback function to execute.
 * @param el {string} an selector for the element(s) to attach
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.Env.evt.plugins.available = {
    on: function(type, fn, id, o) {
        var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : null;
        return Y.Event.onAvailable.call(Y.Event, id, fn, o, a);
    }
};

/**
 * Executes the callback as soon as the specified element
 * is detected in the DOM with a nextSibling property
 * (indicating that the element's children are available).
 * This function expects a selector
 * string for the element(s) to detect.  If you already have
 * an element reference, you don't need this event.
 * @event contentready
 * @param type {string} 'contentready'
 * @param fn {function} the callback function to execute.
 * @param el {string} an selector for the element(s) to attach.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.Env.evt.plugins.contentready = {
    on: function(type, fn, id, o) {
        var a = arguments.length > 4 ? Y.Array(arguments, 4, true) : null;
        return Y.Event.onContentReady.call(Y.Event, id, fn, o, a);
    }
};


}, '3.3.0' ,{requires:['event-custom-base']});
YUI.add('event-delegate', function(Y) {

/**
 * Adds event delegation support to the library.
 * 
 * @module event
 * @submodule event-delegate
 */

var toArray          = Y.Array,
    YLang            = Y.Lang,
    isString         = YLang.isString,
    isObject         = YLang.isObject,
    isArray          = YLang.isArray,
    selectorTest     = Y.Selector.test,
    detachCategories = Y.Env.evt.handles;

/**
 * <p>Sets up event delegation on a container element.  The delegated event
 * will use a supplied selector or filtering function to test if the event
 * references at least one node that should trigger the subscription
 * callback.</p>
 *
 * <p>Selector string filters will trigger the callback if the event originated
 * from a node that matches it or is contained in a node that matches it.
 * Function filters are called for each Node up the parent axis to the
 * subscribing container node, and receive at each level the Node and the event
 * object.  The function should return true (or a truthy value) if that Node
 * should trigger the subscription callback.  Note, it is possible for filters
 * to match multiple Nodes for a single event.  In this case, the delegate
 * callback will be executed for each matching Node.</p>
 *
 * <p>For each matching Node, the callback will be executed with its 'this'
 * object set to the Node matched by the filter (unless a specific context was
 * provided during subscription), and the provided event's
 * <code>currentTarget</code> will also be set to the matching Node.  The
 * containing Node from which the subscription was originally made can be
 * referenced as <code>e.container</code>.
 *
 * @method delegate
 * @param type {String} the event type to delegate
 * @param fn {Function} the callback function to execute.  This function
 *              will be provided the event object for the delegated event.
 * @param el {String|node} the element that is the delegation container
 * @param spec {string|Function} a selector that must match the target of the
 *              event or a function to test target and its parents for a match
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 *              These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
function delegate(type, fn, el, filter) {
    var args     = toArray(arguments, 0, true),
        query    = isString(el) ? el : null,
        typeBits, synth, container, categories, cat, i, len, handles, handle;

    // Support Y.delegate({ click: fnA, key: fnB }, context, filter, ...);
    // and Y.delegate(['click', 'key'], fn, context, filter, ...);
    if (isObject(type)) {
        handles = [];

        if (isArray(type)) {
            for (i = 0, len = type.length; i < len; ++i) {
                args[0] = type[i];
                handles.push(Y.delegate.apply(Y, args));
            }
        } else {
            // Y.delegate({'click', fn}, context, filter) =>
            // Y.delegate('click', fn, context, filter)
            args.unshift(null); // one arg becomes two; need to make space

            for (i in type) {
                if (type.hasOwnProperty(i)) {
                    args[0] = i;
                    args[1] = type[i];
                    handles.push(Y.delegate.apply(Y, args));
                }
            }
        }

        return new Y.EventHandle(handles);
    }

    typeBits = type.split(/\|/);

    if (typeBits.length > 1) {
        cat  = typeBits.shift();
        type = typeBits.shift();
    }

    synth = Y.Node.DOM_EVENTS[type];

    if (isObject(synth) && synth.delegate) {
        handle = synth.delegate.apply(synth, arguments);
    }

    if (!handle) {
        if (!type || !fn || !el || !filter) {
            return;
        }

        container = (query) ? Y.Selector.query(query, null, true) : el;

        if (!container && isString(el)) {
            handle = Y.on('available', function () {
                Y.mix(handle, Y.delegate.apply(Y, args), true);
            }, el);
        }

        if (!handle && container) {
            args.splice(2, 2, container); // remove the filter

            handle = Y.Event._attach(args, { facade: false });
            handle.sub.filter  = filter;
            handle.sub._notify = delegate.notifySub;
        }
    }

    if (handle && cat) {
        categories = detachCategories[cat]  || (detachCategories[cat] = {});
        categories = categories[type] || (categories[type] = []);
        categories.push(handle);
    }

    return handle;
}

/**
 * Overrides the <code>_notify</code> method on the normal DOM subscription to
 * inject the filtering logic and only proceed in the case of a match.
 * 
 * @method delegate.notifySub
 * @param thisObj {Object} default 'this' object for the callback
 * @param args {Array} arguments passed to the event's <code>fire()</code>
 * @param ce {CustomEvent} the custom event managing the DOM subscriptions for
 *              the subscribed event on the subscribing node.
 * @return {Boolean} false if the event was stopped
 * @private
 * @static
 * @since 3.2.0
 */
delegate.notifySub = function (thisObj, args, ce) {
    // Preserve args for other subscribers
    args = args.slice();
    if (this.args) {
        args.push.apply(args, this.args);
    }

    // Only notify subs if the event occurred on a targeted element
    var currentTarget = delegate._applyFilter(this.filter, args, ce),
        //container     = e.currentTarget,
        e, i, len, ret;

    if (currentTarget) {
        // Support multiple matches up the the container subtree
        currentTarget = toArray(currentTarget);

        // The second arg is the currentTarget, but we'll be reusing this
        // facade, replacing the currentTarget for each use, so it doesn't
        // matter what element we seed it with.
        e = args[0] = new Y.DOMEventFacade(args[0], ce.el, ce);

        e.container = Y.one(ce.el);
    
        for (i = 0, len = currentTarget.length; i < len && !e.stopped; ++i) {
            e.currentTarget = Y.one(currentTarget[i]);

            ret = this.fn.apply(this.context || e.currentTarget, args);

            if (ret === false) { // stop further notifications
                break;
            }
        }

        return ret;
    }
};

/**
 * <p>Compiles a selector string into a filter function to identify whether
 * Nodes along the parent axis of an event's target should trigger event
 * notification.</p>
 *
 * <p>This function is memoized, so previously compiled filter functions are
 * returned if the same selector string is provided.</p>
 *
 * <p>This function may be useful when defining synthetic events for delegate
 * handling.</p>
 *
 * @method delegate.compileFilter
 * @param selector {String} the selector string to base the filtration on
 * @return {Function}
 * @since 3.2.0
 * @static
 */
delegate.compileFilter = Y.cached(function (selector) {
    return function (target, e) {
        return selectorTest(target._node, selector, e.currentTarget._node);
    };
});

/**
 * Walks up the parent axis of an event's target, and tests each element
 * against a supplied filter function.  If any Nodes, including the container,
 * satisfy the filter, the delegated callback will be triggered for each.
 *
 * @method delegate._applyFilter
 * @param filter {Function} boolean function to test for inclusion in event
 *                  notification
 * @param args {Array} the arguments that would be passed to subscribers
 * @param ce   {CustomEvent} the DOM event wrapper
 * @return {Node|Node[]|undefined} The Node or Nodes that satisfy the filter
 * @protected
 */
delegate._applyFilter = function (filter, args, ce) {
    var e         = args[0],
        container = ce.el, // facadeless events in IE, have no e.currentTarget
        target    = e.target || e.srcElement,
        match     = [],
        isContainer = false;

    // Resolve text nodes to their containing element
    if (target.nodeType === 3) {
        target = target.parentNode;
    }

    // passing target as the first arg rather than leaving well enough alone
    // making 'this' in the filter function refer to the target.  This is to
    // support bound filter functions.
    args.unshift(target);

    if (isString(filter)) {
        while (target) {
            isContainer = (target === container);
            if (selectorTest(target, filter, (isContainer ?null: container))) {
                match.push(target);
            }

            if (isContainer) {
                break;
            }

            target = target.parentNode;
        }
    } else {
        // filter functions are implementer code and should receive wrappers
        args[0] = Y.one(target);
        args[1] = new Y.DOMEventFacade(e, container, ce);

        while (target) {
            // filter(target, e, extra args...) - this === target
            if (filter.apply(args[0], args)) {
                match.push(target);
            }

            if (target === container) {
                break;
            }

            target = target.parentNode;
            args[0] = Y.one(target);
        }
        args[1] = e; // restore the raw DOM event
    }

    if (match.length <= 1) {
        match = match[0]; // single match or undefined
    }

    // remove the target
    args.shift();

    return match;
};

/**
 * Sets up event delegation on a container element.  The delegated event
 * will use a supplied filter to test if the callback should be executed.
 * This filter can be either a selector string or a function that returns
 * a Node to use as the currentTarget for the event.
 *
 * The event object for the delegated event is supplied to the callback
 * function.  It is modified slightly in order to support all properties
 * that may be needed for event delegation.  'currentTarget' is set to
 * the element that matched the selector string filter or the Node returned
 * from the filter function.  'container' is set to the element that the
 * listener is delegated from (this normally would be the 'currentTarget').
 *
 * Filter functions will be called with the arguments that would be passed to
 * the callback function, including the event object as the first parameter.
 * The function should return false (or a falsey value) if the success criteria
 * aren't met, and the Node to use as the event's currentTarget and 'this'
 * object if they are.
 *
 * @method delegate
 * @param type {string} the event type to delegate
 * @param fn {function} the callback function to execute.  This function
 * will be provided the event object for the delegated event.
 * @param el {string|node} the element that is the delegation container
 * @param filter {string|function} a selector that must match the target of the
 * event or a function that returns a Node or false.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.delegate = Y.Event.delegate = delegate;


}, '3.3.0' ,{requires:['node-base']});
YUI.add('event-synthetic', function(Y) {

/**
 * Define new DOM events that can be subscribed to from Nodes.
 *
 * @module event
 * @submodule event-synthetic
 */
var DOMMap   = Y.Env.evt.dom_map,
    toArray  = Y.Array,
    YLang    = Y.Lang,
    isObject = YLang.isObject,
    isString = YLang.isString,
    query    = Y.Selector.query,
    noop     = function () {};

/**
 * <p>The triggering mechanism used by SyntheticEvents.</p>
 *
 * <p>Implementers should not instantiate these directly.  Use the Notifier
 * provided to the event's implemented <code>on(node, sub, notifier)</code> or
 * <code>delegate(node, sub, notifier, filter)</code> methods.</p>
 *
 * @class SyntheticEvent.Notifier
 * @constructor
 * @param handle {EventHandle} the detach handle for the subscription to an
 *              internal custom event used to execute the callback passed to
 *              on(..) or delegate(..)
 * @param emitFacade {Boolean} take steps to ensure the first arg received by
 *              the subscription callback is an event facade
 * @private
 * @since 3.2.0
 */
function Notifier(handle, emitFacade) {
    this.handle     = handle;
    this.emitFacade = emitFacade;
}

/**
 * <p>Executes the subscription callback, passing the firing arguments as the
 * first parameters to that callback. For events that are configured with
 * emitFacade=true, it is common practice to pass the triggering DOMEventFacade
 * as the first parameter.  Barring a proper DOMEventFacade or EventFacade
 * (from a CustomEvent), a new EventFacade will be generated.  In that case, if
 * fire() is called with a simple object, it will be mixed into the facade.
 * Otherwise, the facade will be prepended to the callback parameters.</p>
 *
 * <p>For notifiers provided to delegate logic, the first argument should be an
 * object with a &quot;currentTarget&quot; property to identify what object to
 * default as 'this' in the callback.  Typically this is gleaned from the
 * DOMEventFacade or EventFacade, but if configured with emitFacade=false, an
 * object must be provided.  In that case, the object will be removed from the
 * callback parameters.</p>
 *
 * <p>Additional arguments passed during event subscription will be
 * automatically added after those passed to fire().</p>
 *
 * @method fire
 * @param e {EventFacade|DOMEventFacade|Object|any} (see description)
 * @param arg* {any} additional arguments received by all subscriptions
 * @private
 */
Notifier.prototype.fire = function (e) {
    // first arg to delegate notifier should be an object with currentTarget
    var args     = toArray(arguments, 0, true),
        handle   = this.handle,
        ce       = handle.evt,
        sub      = handle.sub,
        thisObj  = sub.context,
        delegate = sub.filter,
        event    = e || {};

    if (this.emitFacade) {
        if (!e || !e.preventDefault) {
            event = ce._getFacade();

            if (isObject(e) && !e.preventDefault) {
                Y.mix(event, e, true);
                args[0] = event;
            } else {
                args.unshift(event);
            }
        }

        event.type    = ce.type;
        event.details = args.slice();

        if (delegate) {
            event.container = ce.host;
        }
    } else if (delegate && isObject(e) && e.currentTarget) {
        args.shift();
    }

    sub.context = thisObj || event.currentTarget || ce.host;
    ce.fire.apply(ce, args);
    sub.context = thisObj; // reset for future firing
};


/**
 * <p>Wrapper class for the integration of new events into the YUI event
 * infrastructure.  Don't instantiate this object directly, use
 * <code>Y.Event.define(type, config)</code>.  See that method for details.</p>
 *
 * <p>Properties that MAY or SHOULD be specified in the configuration are noted
 * below and in the description of <code>Y.Event.define</code>.</p>
 *
 * @class SyntheticEvent
 * @constructor
 * @param cfg {Object} Implementation pieces and configuration
 * @since 3.1.0
 * @in event-synthetic
 */
function SyntheticEvent() {
    this._init.apply(this, arguments);
}

Y.mix(SyntheticEvent, {
    Notifier: Notifier,

    /**
     * Returns the array of subscription handles for a node for the given event
     * type.  Passing true as the third argument will create a registry entry
     * in the event system's DOM map to host the array if one doesn't yet exist.
     *
     * @method getRegistry
     * @param node {Node} the node
     * @param type {String} the event
     * @param create {Boolean} create a registration entry to host a new array
     *                  if one doesn't exist.
     * @return {Array}
     * @static
     * @protected
     * @since 3.2.0
     */
    getRegistry: function (node, type, create) {
        var el     = node._node,
            yuid   = Y.stamp(el),
            key    = 'event:' + yuid + type + '_synth',
            events = DOMMap[yuid] || (DOMMap[yuid] = {});

        if (!events[key] && create) {
            events[key] = {
                type      : '_synth',
                fn        : noop,
                capture   : false,
                el        : el,
                key       : key,
                domkey    : yuid,
                notifiers : [],

                detachAll : function () {
                    var notifiers = this.notifiers,
                        i = notifiers.length;

                    while (--i >= 0) {
                        notifiers[i].detach();
                    }
                }
            };
        }

        return (events[key]) ? events[key].notifiers : null;
    },

    /**
     * Alternate <code>_delete()</code> method for the CustomEvent object
     * created to manage SyntheticEvent subscriptions.
     *
     * @method _deleteSub
     * @param sub {Subscription} the subscription to clean up
     * @private
     * @since 3.2.0
     */
    _deleteSub: function (sub) {
        if (sub && sub.fn) {
            var synth = this.eventDef,
                method = (sub.filter) ? 'detachDelegate' : 'detach';

            this.subscribers = {};
            this.subCount = 0;

            synth[method](sub.node, sub, this.notifier, sub.filter);
            synth._unregisterSub(sub);

            delete sub.fn;
            delete sub.node;
            delete sub.context;
        }
    },

    prototype: {
        constructor: SyntheticEvent,

        /**
         * Construction logic for the event.
         *
         * @method _init
         * @protected
         */
        _init: function () {
            var config = this.publishConfig || (this.publishConfig = {});

            // The notification mechanism handles facade creation
            this.emitFacade = ('emitFacade' in config) ?
                                config.emitFacade :
                                true;
            config.emitFacade  = false;
        },

        /**
         * <p>Implementers MAY provide this method definition.</p>
         *
         * <p>Implement this function if the event supports a different
         * subscription signature.  This function is used by both
         * <code>on()</code> and <code>delegate()</code>.  The second parameter
         * indicates that the event is being subscribed via
         * <code>delegate()</code>.</p>
         *
         * <p>Implementations must remove extra arguments from the args list
         * before returning.  The required args for <code>on()</code>
         * subscriptions are</p>
         * <pre><code>[type, callback, target, context, argN...]</code></pre>
         *
         * <p>The required args for <code>delegate()</code>
         * subscriptions are</p>
         *
         * <pre><code>[type, callback, target, filter, context, argN...]</code></pre>
         *
         * <p>The return value from this function will be stored on the
         * subscription in the '_extra' property for reference elsewhere.</p>
         *
         * @method processArgs
         * @param args {Array} parmeters passed to Y.on(..) or Y.delegate(..)
         * @param delegate {Boolean} true if the subscription is from Y.delegate
         * @return {any}
         */
        processArgs: noop,

        /**
         * <p>Implementers MAY override this property.</p>
         *
         * <p>Whether to prevent multiple subscriptions to this event that are
         * classified as being the same.  By default, this means the subscribed
         * callback is the same function.  See the <code>subMatch</code>
         * method.  Setting this to true will impact performance for high volume
         * events.</p>
         *
         * @property preventDups
         * @type {Boolean}
         * @default false
         */
        //preventDups  : false,

        /**
         * <p>Implementers SHOULD provide this method definition.</p>
         *
         * Implementation logic for subscriptions done via <code>node.on(type,
         * fn)</code> or <code>Y.on(type, fn, target)</code>.  This
         * function should set up the monitor(s) that will eventually fire the
         * event.  Typically this involves subscribing to at least one DOM
         * event.  It is recommended to store detach handles from any DOM
         * subscriptions to make for easy cleanup in the <code>detach</code>
         * method.  Typically these handles are added to the <code>sub</code>
         * object.  Also for SyntheticEvents that leverage a single DOM
         * subscription under the hood, it is recommended to pass the DOM event
         * object to <code>notifier.fire(e)</code>.  (The event name on the
         * object will be updated).
         *
         * @method on
         * @param node {Node} the node the subscription is being applied to
         * @param sub {Subscription} the object to track this subscription
         * @param notifier {SyntheticEvent.Notifier} call notifier.fire(..) to
         *              trigger the execution of the subscribers
         */
        on: noop,

        /**
         * <p>Implementers SHOULD provide this method definition.</p>
         *
         * <p>Implementation logic for detaching subscriptions done via
         * <code>node.on(type, fn)</code>.  This function should clean up any
         * subscriptions made in the <code>on()</code> phase.</p>
         *
         * @method detach
         * @param node {Node} the node the subscription was applied to
         * @param sub {Subscription} the object tracking this subscription
         * @param notifier {SyntheticEvent.Notifier} the Notifier used to
         *              trigger the execution of the subscribers
         */
        detach: noop,

        /**
         * <p>Implementers SHOULD provide this method definition.</p>
         *
         * <p>Implementation logic for subscriptions done via
         * <code>node.delegate(type, fn, filter)</code> or
         * <code>Y.delegate(type, fn, container, filter)</code>.  Like with
         * <code>on()</code> above, this function should monitor the environment
         * for the event being fired, and trigger subscription execution by
         * calling <code>notifier.fire(e)</code>.</p>
         *
         * <p>This function receives a fourth argument, which is the filter
         * used to identify which Node's are of interest to the subscription.
         * The filter will be either a boolean function that accepts a target
         * Node for each hierarchy level as the event bubbles, or a selector
         * string.  To translate selector strings into filter functions, use
         * <code>Y.delegate.compileFilter(filter)</code>.</p>
         *
         * @method delegate
         * @param node {Node} the node the subscription is being applied to
         * @param sub {Subscription} the object to track this subscription
         * @param notifier {SyntheticEvent.Notifier} call notifier.fire(..) to
         *              trigger the execution of the subscribers
         * @param filter {String|Function} Selector string or function that
         *              accepts an event object and returns null, a Node, or an
         *              array of Nodes matching the criteria for processing.
         * @since 3.2.0
         */
        delegate       : noop,

        /**
         * <p>Implementers SHOULD provide this method definition.</p>
         *
         * <p>Implementation logic for detaching subscriptions done via
         * <code>node.delegate(type, fn, filter)</code> or
         * <code>Y.delegate(type, fn, container, filter)</code>.  This function
         * should clean up any subscriptions made in the
         * <code>delegate()</code> phase.</p>
         *
         * @method detachDelegate
         * @param node {Node} the node the subscription was applied to
         * @param sub {Subscription} the object tracking this subscription
         * @param notifier {SyntheticEvent.Notifier} the Notifier used to
         *              trigger the execution of the subscribers
         * @param filter {String|Function} Selector string or function that
         *              accepts an event object and returns null, a Node, or an
         *              array of Nodes matching the criteria for processing.
         * @since 3.2.0
         */
        detachDelegate : noop,

        /**
         * Sets up the boilerplate for detaching the event and facilitating the
         * execution of subscriber callbacks.
         *
         * @method _on
         * @param args {Array} array of arguments passed to
         *              <code>Y.on(...)</code> or <code>Y.delegate(...)</code>
         * @param delegate {Boolean} true if called from
         * <code>Y.delegate(...)</code>
         * @return {EventHandle} the detach handle for this subscription
         * @private
         * since 3.2.0
         */
        _on: function (args, delegate) {
            var handles  = [],
                extra    = this.processArgs(args, delegate),
                selector = args[2],
                method   = delegate ? 'delegate' : 'on',
                nodes, handle;

            // Can't just use Y.all because it doesn't support window (yet?)
            nodes = (isString(selector)) ? query(selector) : toArray(selector);

            if (!nodes.length && isString(selector)) {
                handle = Y.on('available', function () {
                    Y.mix(handle, Y[method].apply(Y, args), true);
                }, selector);

                return handle;
            }

            Y.Array.each(nodes, function (node) {
                var subArgs = args.slice(),
                    filter;

                node = Y.one(node);

                if (node) {
                    if (delegate) {
                        filter = subArgs.splice(3, 1)[0];
                    }

                    // (type, fn, el, thisObj, ...) => (fn, thisObj, ...)
                    subArgs.splice(0, 4, subArgs[1], subArgs[3]);

                    if (!this.preventDups || !this.getSubs(node, args,null,true)) {
                        handle = this._getNotifier(node, subArgs, extra,filter);

                        this[method](node, handle.sub, handle.notifier, filter);

                        handles.push(handle);
                    }
                }
            }, this);

            return (handles.length === 1) ?
                handles[0] :
                new Y.EventHandle(handles);
        },

        /**
         * Creates a new Notifier object for use by this event's
         * <code>on(...)</code> or <code>delegate(...)</code> implementation.
         *
         * @method _getNotifier
         * @param node {Node} the Node hosting the event
         * @param args {Array} the subscription arguments passed to either
         *              <code>Y.on(...)</code> or <code>Y.delegate(...)</code>
         *              after running through <code>processArgs(args)</code> to
         *              normalize the argument signature
         * @param extra {any} Extra data parsed from
         *              <code>processArgs(args)</code>
         * @param filter {String|Function} the selector string or function
         *              filter passed to <code>Y.delegate(...)</code> (not
         *              present when called from <code>Y.on(...)</code>)
         * @return {SyntheticEvent.Notifier}
         * @private
         * @since 3.2.0
         */
        _getNotifier: function (node, args, extra, filter) {
            var dispatcher = new Y.CustomEvent(this.type, this.publishConfig),
                handle     = dispatcher.on.apply(dispatcher, args),
                notifier   = new Notifier(handle, this.emitFacade),
                registry   = SyntheticEvent.getRegistry(node, this.type, true),
                sub        = handle.sub;

            handle.notifier   = notifier;

            sub.node   = node;
            sub.filter = filter;
            if (extra) {
                this.applyArgExtras(extra, sub);
            }

            Y.mix(dispatcher, {
                eventDef     : this,
                notifier     : notifier,
                host         : node,       // I forget what this is for
                currentTarget: node,       // for generating facades
                target       : node,       // for generating facades
                el           : node._node, // For category detach

                _delete      : SyntheticEvent._deleteSub
            }, true);

            registry.push(handle);

            return handle;
        },

        /**
         * <p>Implementers MAY provide this method definition.</p>
         *
         * <p>Implement this function if you want extra data extracted during
         * processArgs to be propagated to subscriptions on a per-node basis.
         * That is to say, if you call <code>Y.on('xyz', fn, xtra, 'div')</code>
         * the data returned from processArgs will be shared
         * across the subscription objects for all the divs.  If you want each
         * subscription to receive unique information, do that processing
         * here.</p>
         *
         * <p>The default implementation adds the data extracted by processArgs
         * to the subscription object as <code>sub._extra</code>.</p>
         *
         * @method applyArgExtras
         * @param extra {any} Any extra data extracted from processArgs
         * @param sub {Subscription} the individual subscription
         */
        applyArgExtras: function (extra, sub) {
            sub._extra = extra;
        },

        /**
         * Removes the subscription from the Notifier registry.
         *
         * @method _unregisterSub
         * @param sub {Subscription} the subscription
         * @private
         * @since 3.2.0
         */
        _unregisterSub: function (sub) {
            var notifiers = SyntheticEvent.getRegistry(sub.node, this.type),
                i;

            if (notifiers) {
                for (i = notifiers.length - 1; i >= 0; --i) {
                    if (notifiers[i].sub === sub) {
                        notifiers.splice(i, 1);
                        break;
                    }
                }
            }
        },

        /**
         * Removes the subscription(s) from the internal subscription dispatch
         * mechanism.  See <code>SyntheticEvent._deleteSub</code>.
         *
         * @method _detach
         * @param args {Array} The arguments passed to
         *                  <code>node.detach(...)</code>
         * @private
         * @since 3.2.0
         */
        _detach: function (args) {
            // Can't use Y.all because it doesn't support window (yet?)
            // TODO: Does Y.all support window now?
            var target = args[2],
                els    = (isString(target)) ?
                            query(target) : toArray(target),
                node, i, len, handles, j;

            // (type, fn, el, context, filter?) => (type, fn, context, filter?)
            args.splice(2, 1);

            for (i = 0, len = els.length; i < len; ++i) {
                node = Y.one(els[i]);

                if (node) {
                    handles = this.getSubs(node, args);

                    if (handles) {
                        for (j = handles.length - 1; j >= 0; --j) {
                            handles[j].detach();
                        }
                    }
                }
            }
        },

        /**
         * Returns the detach handles of subscriptions on a node that satisfy a
         * search/filter function.  By default, the filter used is the
         * <code>subMatch</code> method.
         *
         * @method getSubs
         * @param node {Node} the node hosting the event
         * @param args {Array} the array of original subscription args passed
         *              to <code>Y.on(...)</code> (before
         *              <code>processArgs</code>
         * @param filter {Function} function used to identify a subscription
         *              for inclusion in the returned array
         * @param first {Boolean} stop after the first match (used to check for
         *              duplicate subscriptions)
         * @return {Array} detach handles for the matching subscriptions
         */
        getSubs: function (node, args, filter, first) {
            var notifiers = SyntheticEvent.getRegistry(node, this.type),
                handles = [],
                i, len, handle;

            if (notifiers) {
                if (!filter) {
                    filter = this.subMatch;
                }

                for (i = 0, len = notifiers.length; i < len; ++i) {
                    handle = notifiers[i];
                    if (filter.call(this, handle.sub, args)) {
                        if (first) {
                            return handle;
                        } else {
                            handles.push(notifiers[i]);
                        }
                    }
                }
            }

            return handles.length && handles;
        },

        /**
         * <p>Implementers MAY override this to define what constitutes a
         * &quot;same&quot; subscription.  Override implementations should
         * consider the lack of a comparator as a match, so calling
         * <code>getSubs()</code> with no arguments will return all subs.</p>
         *
         * <p>Compares a set of subscription arguments against a Subscription
         * object to determine if they match.  The default implementation
         * compares the callback function against the second argument passed to
         * <code>Y.on(...)</code> or <code>node.detach(...)</code> etc.</p>
         *
         * @method subMatch
         * @param sub {Subscription} the existing subscription
         * @param args {Array} the calling arguments passed to
         *                  <code>Y.on(...)</code> etc.
         * @return {Boolean} true if the sub can be described by the args
         *                  present
         * @since 3.2.0
         */
        subMatch: function (sub, args) {
            // Default detach cares only about the callback matching
            return !args[1] || sub.fn === args[1];
        }
    }
}, true);

Y.SyntheticEvent = SyntheticEvent;

/**
 * <p>Defines a new event in the DOM event system.  Implementers are
 * responsible for monitoring for a scenario whereby the event is fired.  A
 * notifier object is provided to the functions identified below.  When the
 * criteria defining the event are met, call notifier.fire( [args] ); to
 * execute event subscribers.</p>
 *
 * <p>The first parameter is the name of the event.  The second parameter is a
 * configuration object which define the behavior of the event system when the
 * new event is subscribed to or detached from.  The methods that should be
 * defined in this configuration object are <code>on</code>,
 * <code>detach</code>, <code>delegate</code>, and <code>detachDelegate</code>.
 * You are free to define any other methods or properties needed to define your
 * event.  Be aware, however, that since the object is used to subclass
 * SyntheticEvent, you should avoid method names used by SyntheticEvent unless
 * your intention is to override the default behavior.</p>
 *
 * <p>This is a list of properties and methods that you can or should specify
 * in the configuration object:</p>
 *
 * <dl>
 *   <dt><code>on</code></dt>
 *       <dd><code>function (node, subscription, notifier)</code> The
 *       implementation logic for subscription.  Any special setup you need to
 *       do to create the environment for the event being fired--E.g. native
 *       DOM event subscriptions.  Store subscription related objects and
 *       state on the <code>subscription</code> object.  When the
 *       criteria have been met to fire the synthetic event, call
 *       <code>notifier.fire(e)</code>.  See Notifier's <code>fire()</code>
 *       method for details about what to pass as parameters.</dd>
 *
 *   <dt><code>detach</code></dt>
 *       <dd><code>function (node, subscription, notifier)</code> The
 *       implementation logic for cleaning up a detached subscription. E.g.
 *       detach any DOM subscriptions added in <code>on</code>.</dd>
 *
 *   <dt><code>delegate</code></dt>
 *       <dd><code>function (node, subscription, notifier, filter)</code> The
 *       implementation logic for subscription via <code>Y.delegate</code> or
 *       <code>node.delegate</code>.  The filter is typically either a selector
 *       string or a function.  You can use
 *       <code>Y.delegate.compileFilter(selectorString)</code> to create a
 *       filter function from a selector string if needed.  The filter function
 *       expects an event object as input and should output either null, a
 *       matching Node, or an array of matching Nodes.  Otherwise, this acts
 *       like <code>on</code> DOM event subscriptions.  Store subscription
 *       related objects and information on the <code>subscription</code>
 *       object.  When the criteria have been met to fire the synthetic event,
 *       call <code>notifier.fire(e)</code> as noted above.</dd>
 *
 *   <dt><code>detachDelegate</code></dt>
 *       <dd><code>function (node, subscription, notifier)</code> The
 *       implementation logic for cleaning up a detached delegate subscription.
 *       E.g. detach any DOM delegate subscriptions added in
 *       <code>delegate</code>.</dd>
 *
 *   <dt><code>publishConfig</code></dt>
 *       <dd>(Object) The configuration object that will be used to instantiate
 *       the underlying CustomEvent. See Notifier's <code>fire</code> method
 *       for details.</dd>
 *
 *   <dt><code>processArgs</code></dt
 *       <dd>
 *          <p><code>function (argArray, fromDelegate)</code> Optional method
 *          to extract any additional arguments from the subscription
 *          signature.  Using this allows <code>on</code> or
 *          <code>delegate</code> signatures like
 *          <code>node.on(&quot;hover&quot;, overCallback,
 *          outCallback)</code>.</p>
 *          <p>When processing an atypical argument signature, make sure the
 *          args array is returned to the normal signature before returning
 *          from the function.  For example, in the &quot;hover&quot; example
 *          above, the <code>outCallback</code> needs to be <code>splice</code>d
 *          out of the array.  The expected signature of the args array for
 *          <code>on()</code> subscriptions is:</p>
 *          <pre>
 *              <code>[type, callback, target, contextOverride, argN...]</code>
 *          </pre>
 *          <p>And for <code>delegate()</code>:</p>
 *          <pre>
 *              <code>[type, callback, target, filter, contextOverride, argN...]</code>
 *          </pre>
 *          <p>where <code>target</code> is the node the event is being
 *          subscribed for.  You can see these signatures documented for
 *          <code>Y.on()</code> and <code>Y.delegate()</code> respectively.</p>
 *          <p>Whatever gets returned from the function will be stored on the
 *          <code>subscription</code> object under
 *          <code>subscription._extra</code>.</p></dd>
 *   <dt><code>subMatch</code></dt>
 *       <dd>
 *           <p><code>function (sub, args)</code>  Compares a set of
 *           subscription arguments against a Subscription object to determine
 *           if they match.  The default implementation compares the callback
 *           function against the second argument passed to
 *           <code>Y.on(...)</code> or <code>node.detach(...)</code> etc.</p>
 *       </dd>
 * </dl>
 *
 * @method Event.define
 * @param type {String} the name of the event
 * @param config {Object} the prototype definition for the new event (see above)
 * @param force {Boolean} override an existing event (use with caution)
 * @static
 * @return {SyntheticEvent} the subclass implementation instance created to
 *              handle event subscriptions of this type
 * @for Event
 * @since 3.1.0
 * @in event-synthetic
 */
Y.Event.define = function (type, config, force) {
    if (!config) {
        config = {};
    }

    var eventDef = (isObject(type)) ? type : Y.merge({ type: type }, config),
        Impl, synth;

    if (force || !Y.Node.DOM_EVENTS[eventDef.type]) {
        Impl = function () {
            SyntheticEvent.apply(this, arguments);
        };
        Y.extend(Impl, SyntheticEvent, eventDef);
        synth = new Impl();

        type = synth.type;

        Y.Node.DOM_EVENTS[type] = Y.Env.evt.plugins[type] = {
            eventDef: synth,

            on: function () {
                return synth._on(toArray(arguments));
            },

            delegate: function () {
                return synth._on(toArray(arguments), true);
            },

            detach: function () {
                return synth._detach(toArray(arguments));
            }
        };

    }

    return synth;
};


}, '3.3.0' ,{requires:['node-base', 'event-custom']});
YUI.add('event-mousewheel', function(Y) {

/**
 * Adds mousewheel event support
 * @module event
 * @submodule event-mousewheel
 */
var DOM_MOUSE_SCROLL = 'DOMMouseScroll',
    fixArgs = function(args) {
        var a = Y.Array(args, 0, true), target;
        if (Y.UA.gecko) {
            a[0] = DOM_MOUSE_SCROLL;
            target = Y.config.win;
        } else {
            target = Y.config.doc;
        }

        if (a.length < 3) {
            a[2] = target;
        } else {
            a.splice(2, 0, target);
        }

        return a;
    };

/**
 * Mousewheel event.  This listener is automatically attached to the
 * correct target, so one should not be supplied.  Mouse wheel 
 * direction and velocity is stored in the 'mouseDelta' field.
 * @event mousewheel
 * @param type {string} 'mousewheel'
 * @param fn {function} the callback to execute
 * @param context optional context object
 * @param args 0..n additional arguments to provide to the listener.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.Env.evt.plugins.mousewheel = {
    on: function() {
        return Y.Event._attach(fixArgs(arguments));
    },

    detach: function() {
        return Y.Event.detach.apply(Y.Event, fixArgs(arguments));
    }
};


}, '3.3.0' ,{requires:['node-base']});
YUI.add('event-mouseenter', function(Y) {

/**
 * <p>Adds subscription and delegation support for mouseenter and mouseleave
 * events.  Unlike mouseover and mouseout, these events aren't fired from child
 * elements of a subscribed node.</p>
 *
 * <p>This avoids receiving three mouseover notifications from a setup like</p>
 *
 * <pre><code>div#container > p > a[href]</code></pre>
 *
 * <p>where</p>
 *
 * <pre><code>Y.one('#container').on('mouseover', callback)</code></pre>
 *
 * <p>When the mouse moves over the link, one mouseover event is fired from
 * #container, then when the mouse moves over the p, another mouseover event is
 * fired and bubbles to #container, causing a second notification, and finally
 * when the mouse moves over the link, a third mouseover event is fired and
 * bubbles to #container for a third notification.</p>
 *
 * <p>By contrast, using mouseenter instead of mouseover, the callback would be
 * executed only once when the mouse moves over #container.</p>
 *
 * @module event
 * @submodule event-mouseenter
 */
function notify(e, notifier) {
    var current = e.currentTarget,
        related = e.relatedTarget;

    if (current !== related && !current.contains(related)) {
        notifier.fire(e);
    }
}

var config = {
    proxyType: "mouseover",

    on: function (node, sub, notifier) {
        sub.onHandle = node.on(this.proxyType, notify, null, notifier);
    },

    detach: function (node, sub) {
        sub.onHandle.detach();
    },

    delegate: function (node, sub, notifier, filter) {
        sub.delegateHandle =
            Y.delegate(this.proxyType, notify, node, filter, null, notifier);
    },

    detachDelegate: function (node, sub) {
        sub.delegateHandle.detach();
    }
};

Y.Event.define("mouseenter", config, true);
Y.Event.define("mouseleave", Y.merge(config, { proxyType: "mouseout" }), true);


}, '3.3.0' ,{requires:['event-synthetic']});
YUI.add('event-key', function(Y) {

/**
 * Functionality to listen for one or more specific key combinations.
 * @module event
 * @submodule event-key
 */

/**
 * Add a key listener.  The listener will only be notified if the
 * keystroke detected meets the supplied specification.  The
 * spec consists of the key event type, followed by a colon,
 * followed by zero or more comma separated key codes, followed
 * by zero or more modifiers delimited by a plus sign.  Ex:
 * press:12,65+shift+ctrl
 * @event key
 * @for YUI
 * @param type {string} 'key'
 * @param fn {function} the function to execute
 * @param id {string|HTMLElement|collection} the element(s) to bind
 * @param spec {string} the keyCode and modifier specification
 * @param o optional context object
 * @param args 0..n additional arguments to provide to the listener.
 * @return {Event.Handle} the detach handle
 */
Y.Env.evt.plugins.key = {

    on: function(type, fn, id, spec, o) {
        var a = Y.Array(arguments, 0, true), parsed, etype, criteria, ename;

        parsed = spec && spec.split(':');

        if (!spec || spec.indexOf(':') == -1 || !parsed[1]) {
            a[0] = 'key' + ((parsed && parsed[0]) || 'press');
            return Y.on.apply(Y, a);
        }

        // key event type: 'down', 'up', or 'press'
        etype = parsed[0];

        // list of key codes optionally followed by modifiers
        criteria = (parsed[1]) ? parsed[1].split(/,|\+/) : null;

        // the name of the custom event that will be created for the spec
        ename = (Y.Lang.isString(id) ? id : Y.stamp(id)) + spec;

        ename = ename.replace(/,/g, '_');

        if (!Y.getEvent(ename)) {

            // subscribe spec validator to the DOM event
            Y.on(type + etype, function(e) {

                
                var passed = false, failed = false, i, crit, critInt;

                for (i=0; i<criteria.length; i=i+1) {
                    crit = criteria[i]; 
                    critInt = parseInt(crit, 10);

                    // pass this section if any supplied keyCode 
                    // is found
                    if (Y.Lang.isNumber(critInt)) {

                        if (e.charCode === critInt) {
                            passed = true;
                        } else {
                            failed = true;
                        }

                    // only check modifier if no keyCode was specified
                    // or the keyCode check was successful.  pass only 
                    // if every modifier passes
                    } else if (passed || !failed) {
                        passed = (e[crit + 'Key']);
                        failed = !passed;
                    }                    
                }

                // fire spec custom event if spec if met
                if (passed) {
                    Y.fire(ename, e);
                }

            }, id);

        }

        // subscribe supplied listener to custom event for spec validator
        // remove element and spec.
        a.splice(2, 2);
        a[0] = ename;

        return Y.on.apply(Y, a);
    }
};


}, '3.3.0' ,{requires:['node-base']});
YUI.add('event-focus', function(Y) {

/**
 * Adds bubbling and delegation support to DOM events focus and blur.
 * 
 * @module event
 * @submodule event-focus
 */
var Event    = Y.Event,
    YLang    = Y.Lang,
    isString = YLang.isString,
    useActivate = YLang.isFunction(
        Y.DOM.create('<p onbeforeactivate=";"/>').onbeforeactivate);

function define(type, proxy, directEvent) {
    var nodeDataKey = '_' + type + 'Notifiers';

    Y.Event.define(type, {

        _attach: function (el, notifier, delegate) {
            if (Y.DOM.isWindow(el)) {
                return Event._attach([type, function (e) {
                    notifier.fire(e);
                }, el]);
            } else {
                return Event._attach(
                    [proxy, this._proxy, el, this, notifier, delegate],
                    { capture: true });
            }
        },

        _proxy: function (e, notifier, delegate) {
            var node       = e.target,
                notifiers  = node.getData(nodeDataKey),
                yuid       = Y.stamp(e.currentTarget._node),
                defer      = (useActivate || e.target !== e.currentTarget),
                sub        = notifier.handle.sub,
                filterArgs = [node, e].concat(sub.args || []),
                directSub;
                
            notifier.currentTarget = (delegate) ? node : e.currentTarget;
            notifier.container     = (delegate) ? e.currentTarget : null;

            if (!sub.filter || sub.filter.apply(node, filterArgs)) {
                // Maintain a list to handle subscriptions from nested
                // containers div#a>div#b>input #a.on(focus..) #b.on(focus..),
                // use one focus or blur subscription that fires notifiers from
                // #b then #a to emulate bubble sequence.
                if (!notifiers) {
                    notifiers = {};
                    node.setData(nodeDataKey, notifiers);

                    // only subscribe to the element's focus if the target is
                    // not the current target (
                    if (defer) {
                        directSub = Event._attach(
                            [directEvent, this._notify, node._node]).sub;
                        directSub.once = true;
                    }
                }

                if (!notifiers[yuid]) {
                    notifiers[yuid] = [];
                }

                notifiers[yuid].push(notifier);

                if (!defer) {
                    this._notify(e);
                }
            }
        },

        _notify: function (e, container) {
            var node        = e.currentTarget,
                notifiers   = node.getData(nodeDataKey),
                              // document.get('ownerDocument') returns null
                doc         = node.get('ownerDocument') || node,
                target      = node,
                nots        = [],
                notifier, i, len;

            if (notifiers) {
                // Walk up the parent axis until the origin node, 
                while (target && target !== doc) {
                    nots.push.apply(nots, notifiers[Y.stamp(target)] || []);
                    target = target.get('parentNode');
                }
                nots.push.apply(nots, notifiers[Y.stamp(doc)] || []);

                for (i = 0, len = nots.length; i < len; ++i) {
                    notifier = nots[i];
                    e.currentTarget = nots[i].currentTarget;

                    if (notifier.container) {
                        e.container = notifier.container;
                    } else {
                        delete e.container;
                    }

                    notifier.fire(e);
                }

                // clear the notifications list (mainly for delegation)
                node.clearData(nodeDataKey);
            }
        },

        on: function (node, sub, notifier) {
            sub.onHandle = this._attach(node._node, notifier);
        },

        detach: function (node, sub) {
            sub.onHandle.detach();
        },

        delegate: function (node, sub, notifier, filter) {
            if (isString(filter)) {
                sub.filter = Y.delegate.compileFilter(filter);
            }

            sub.delegateHandle = this._attach(node._node, notifier, true);
        },

        detachDelegate: function (node, sub) {
            sub.delegateHandle.detach();
        }
    }, true);
}

// For IE, we need to defer to focusin rather than focus because
// `el.focus(); doSomething();` executes el.onbeforeactivate, el.onactivate,
// el.onfocusin, doSomething, then el.onfocus.  All others support capture
// phase focus, which executes before doSomething.  To guarantee consistent
// behavior for this use case, IE's direct subscriptions are made against
// focusin so subscribers will be notified before js following el.focus() is
// executed.
if (useActivate) {
    //     name     capture phase       direct subscription
    define("focus", "beforeactivate",   "focusin");
    define("blur",  "beforedeactivate", "focusout");
} else {
    define("focus", "focus", "focus");
    define("blur",  "blur",  "blur");
}


}, '3.3.0' ,{requires:['event-synthetic']});
YUI.add('event-resize', function(Y) {

/**
 * Adds a window resize event that has its behavior normalized to fire at the
 * end of the resize rather than constantly during the resize.
 * @module event
 * @submodule event-resize
 */
(function() {

var detachHandle,

    timerHandle,

    CE_NAME = 'window:resize',

    handler = function(e) {

        if (Y.UA.gecko) {

            Y.fire(CE_NAME, e);

        } else {

            if (timerHandle) {
                timerHandle.cancel();
            }

            timerHandle = Y.later(Y.config.windowResizeDelay || 40, Y, function() {
                Y.fire(CE_NAME, e);
            });
        }
        
    };


/**
 * Firefox fires the window resize event once when the resize action
 * finishes, other browsers fire the event periodically during the
 * resize.  This code uses timeout logic to simulate the Firefox 
 * behavior in other browsers.
 * @event windowresize
 * @for YUI
 */
Y.Env.evt.plugins.windowresize = {

    on: function(type, fn) {

        // check for single window listener and add if needed
        if (!detachHandle) {
            detachHandle = Y.Event._attach(['resize', handler]);
        }

        var a = Y.Array(arguments, 0, true);
        a[0] = CE_NAME;

        return Y.on.apply(Y, a);
    }
};

})();


}, '3.3.0' ,{requires:['node-base']});
YUI.add('event-hover', function(Y) {

/**
 * Adds support for a "hover" event.  The event provides a convenience wrapper
 * for subscribing separately to mouseenter and mouseleave.  The signature for
 * subscribing to the event is</p>
 *
 * <pre><code>node.on("hover", overFn, outFn);
 * node.delegate("hover", overFn, outFn, ".filterSelector");
 * Y.on("hover", overFn, outFn, ".targetSelector");
 * Y.delegate("hover", overFn, outFn, "#container", ".filterSelector");
 * </code></pre>
 *
 * <p>Additionally, for compatibility with a more typical subscription
 * signature, the following are also supported:</p>
 *
 * <pre><code>Y.on("hover", overFn, ".targetSelector", outFn);
 * Y.delegate("hover", overFn, "#container", outFn, ".filterSelector");
 * </code></pre>
 *
 * @module event
 * @submodule event-hover
 */
var isFunction = Y.Lang.isFunction,
    noop = function () {},
    conf = {
        processArgs: function (args) {
            // Y.delegate('hover', over, out, '#container', '.filter')
            // comes in as ['hover', over, out, '#container', '.filter'], but
            // node.delegate('hover', over, out, '.filter')
            // comes in as ['hover', over, containerEl, out, '.filter']
            var i = isFunction(args[2]) ? 2 : 3;

            return (isFunction(args[i])) ? args.splice(i,1)[0] : noop;
        },

        on: function (node, sub, notifier, filter) {
            sub._detach = node[(filter) ? "delegate" : "on"]({
                mouseenter: Y.bind(notifier.fire, notifier),
                mouseleave: sub._extra
            }, filter);
        },

        detach: function (node, sub, notifier) {
            sub._detacher.detach();
        }
    };

conf.delegate = conf.on;
conf.detachDelegate = conf.detach;

Y.Event.define("hover", conf);


}, '3.3.0' ,{requires:['event-mouseenter']});


YUI.add('event', function(Y){}, '3.3.0' ,{use:['event-base', 'event-delegate', 'event-synthetic', 'event-mousewheel', 'event-mouseenter', 'event-key', 'event-focus', 'event-resize', 'event-hover']});

/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('pluginhost-base', function(Y) {

    /**
     * Provides the augmentable PluginHost interface, which can be added to any class.
     * @module pluginhost
     */

    /**
     * Provides the augmentable PluginHost interface, which can be added to any class.
     * @module pluginhost-base
     */

    /**
     * <p>
     * An augmentable class, which provides the augmented class with the ability to host plugins.
     * It adds <a href="#method_plug">plug</a> and <a href="#method_unplug">unplug</a> methods to the augmented class, which can 
     * be used to add or remove plugins from instances of the class.
     * </p>
     *
     * <p>Plugins can also be added through the constructor configuration object passed to the host class' constructor using
     * the "plugins" property. Supported values for the "plugins" property are those defined by the <a href="#method_plug">plug</a> method. 
     * 
     * For example the following code would add the AnimPlugin and IOPlugin to Overlay (the plugin host):
     * <xmp>
     * var o = new Overlay({plugins: [ AnimPlugin, {fn:IOPlugin, cfg:{section:"header"}}]});
     * </xmp>
     * </p>
     * <p>
     * Plug.Host's protected <a href="#method_initPlugins">_initPlugins</a> and <a href="#method_destroyPlugins">_destroyPlugins</a> 
     * methods should be invoked by the host class at the appropriate point in the host's lifecyle.  
     * </p>
     *
     * @class Plugin.Host
     */

    var L = Y.Lang;

    function PluginHost() {
        this._plugins = {};
    }

    PluginHost.prototype = {

        /**
         * Adds a plugin to the host object. This will instantiate the 
         * plugin and attach it to the configured namespace on the host object.
         *
         * @method plug
         * @chainable
         * @param P {Function | Object |Array} Accepts the plugin class, or an 
         * object with a "fn" property specifying the plugin class and 
         * a "cfg" property specifying the configuration for the Plugin.
         * <p>
         * Additionally an Array can also be passed in, with the above function or 
         * object values, allowing the user to add multiple plugins in a single call.
         * </p>
         * @param config (Optional) If the first argument is the plugin class, the second argument
         * can be the configuration for the plugin.
         * @return {Base} A reference to the host object
         */
        plug: function(Plugin, config) {
            var i, ln, ns;

            if (L.isArray(Plugin)) {
                for (i = 0, ln = Plugin.length; i < ln; i++) {
                    this.plug(Plugin[i]);
                }
            } else {
                if (Plugin && !L.isFunction(Plugin)) {
                    config = Plugin.cfg;
                    Plugin = Plugin.fn;
                }

                // Plugin should be fn by now
                if (Plugin && Plugin.NS) {
                    ns = Plugin.NS;
        
                    config = config || {};
                    config.host = this;
        
                    if (this.hasPlugin(ns)) {
                        // Update config
                        this[ns].setAttrs(config);
                    } else {
                        // Create new instance
                        this[ns] = new Plugin(config);
                        this._plugins[ns] = Plugin;
                    }
                }
            }
            return this;
        },

        /**
         * Removes a plugin from the host object. This will destroy the 
         * plugin instance and delete the namepsace from the host object. 
         *
         * @method unplug
         * @param {String | Function} plugin The namespace of the plugin, or the plugin class with the static NS namespace property defined. If not provided,
         * all registered plugins are unplugged.
         * @return {Base} A reference to the host object
         * @chainable
         */
        unplug: function(plugin) {
            var ns = plugin, 
                plugins = this._plugins;
            
            if (plugin) {
                if (L.isFunction(plugin)) {
                    ns = plugin.NS;
                    if (ns && (!plugins[ns] || plugins[ns] !== plugin)) {
                        ns = null;
                    }
                }
        
                if (ns) {
                    if (this[ns]) {
                        this[ns].destroy();
                        delete this[ns];
                    }
                    if (plugins[ns]) {
                        delete plugins[ns];
                    }
                }
            } else {
                for (ns in this._plugins) {
                    if (this._plugins.hasOwnProperty(ns)) {
                        this.unplug(ns);
                    }
                }
            }
            return this;
        },

        /**
         * Determines if a plugin has plugged into this host.
         *
         * @method hasPlugin
         * @param {String} ns The plugin's namespace
         * @return {boolean} returns true, if the plugin has been plugged into this host, false otherwise.
         */
        hasPlugin : function(ns) {
            return (this._plugins[ns] && this[ns]);
        },

        /**
         * Initializes static plugins registered on the host (using the
         * Base.plug static method) and any plugins passed to the 
         * instance through the "plugins" configuration property.
         *
         * @method _initPlugins
         * @param {Config} config The configuration object with property name/value pairs.
         * @private
         */
        
        _initPlugins: function(config) {
            this._plugins = this._plugins || {};

            if (this._initConfigPlugins) {
                this._initConfigPlugins(config);
            }
        },

        /**
         * Unplugs and destroys all plugins on the host
         * @method _destroyPlugins
         * @private
         */
        _destroyPlugins: function() {
            this.unplug();
        }
    };

    Y.namespace("Plugin").Host = PluginHost;


}, '3.3.0' ,{requires:['yui-base']});
YUI.add('pluginhost-config', function(Y) {

    /**
     * Adds pluginhost constructor configuration and static configuration support
     * @submodule pluginhost-config
     */

    /**
     * Constructor and static configuration support for plugins
     * 
     * @for Plugin.Host
     */
    var PluginHost = Y.Plugin.Host,
        L = Y.Lang;

    PluginHost.prototype._initConfigPlugins = function(config) {

        // Class Configuration
        var classes = (this._getClasses) ? this._getClasses() : [this.constructor],
            plug = [],
            unplug = {},
            constructor, i, classPlug, classUnplug, pluginClassName;

        // TODO: Room for optimization. Can we apply statically/unplug in same pass?
        for (i = classes.length - 1; i >= 0; i--) {
            constructor = classes[i];

            classUnplug = constructor._UNPLUG;
            if (classUnplug) {
                // subclasses over-write
                Y.mix(unplug, classUnplug, true);
            }

            classPlug = constructor._PLUG;
            if (classPlug) {
                // subclasses over-write
                Y.mix(plug, classPlug, true);
            }
        }

        for (pluginClassName in plug) {
            if (plug.hasOwnProperty(pluginClassName)) {
                if (!unplug[pluginClassName]) {
                    this.plug(plug[pluginClassName]);
                }
            }
        }

        // User Configuration
        if (config && config.plugins) {
            this.plug(config.plugins);
        }
    };
    
    /**
     * Registers plugins to be instantiated at the class level (plugins 
     * which should be plugged into every instance of the class by default).
     *
     * @method Plugin.Host.plug
     * @static
     *
     * @param {Function} hostClass The host class on which to register the plugins
     * @param {Function | Array} plugin Either the plugin class, an array of plugin classes or an array of objects (with fn and cfg properties defined)
     * @param {Object} config (Optional) If plugin is the plugin class, the configuration for the plugin
     */
    PluginHost.plug = function(hostClass, plugin, config) {
        // Cannot plug into Base, since Plugins derive from Base [ will cause infinite recurrsion ]
        var p, i, l, name;
    
        if (hostClass !== Y.Base) {
            hostClass._PLUG = hostClass._PLUG || {};
    
            if (!L.isArray(plugin)) {
                if (config) {
                    plugin = {fn:plugin, cfg:config};
                }
                plugin = [plugin];
            }
    
            for (i = 0, l = plugin.length; i < l;i++) {
                p = plugin[i];
                name = p.NAME || p.fn.NAME;
                hostClass._PLUG[name] = p;
            }
        }
    };

    /**
     * Unregisters any class level plugins which have been registered by the host class, or any
     * other class in the hierarchy.
     *
     * @method Plugin.Host.unplug
     * @static
     *
     * @param {Function} hostClass The host class from which to unregister the plugins
     * @param {Function | Array} plugin The plugin class, or an array of plugin classes
     */
    PluginHost.unplug = function(hostClass, plugin) {
        var p, i, l, name;
    
        if (hostClass !== Y.Base) {
            hostClass._UNPLUG = hostClass._UNPLUG || {};
    
            if (!L.isArray(plugin)) {
                plugin = [plugin];
            }
    
            for (i = 0, l = plugin.length; i < l; i++) {
                p = plugin[i];
                name = p.NAME;
                if (!hostClass._PLUG[name]) {
                    hostClass._UNPLUG[name] = p;
                } else {
                    delete hostClass._PLUG[name];
                }
            }
        }
    };


}, '3.3.0' ,{requires:['pluginhost-base']});


YUI.add('pluginhost', function(Y){}, '3.3.0' ,{use:['pluginhost-base', 'pluginhost-config']});

/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('node-base', function(Y) {

/**
 * The Node Utility provides a DOM-like interface for interacting with DOM nodes.
 * @module node
 * @submodule node-base
 */

/**
 * The Node class provides a wrapper for manipulating DOM Nodes.
 * Node properties can be accessed via the set/get methods.
 * Use Y.get() to retrieve Node instances.
 *
 * <strong>NOTE:</strong> Node properties are accessed using
 * the <code>set</code> and <code>get</code> methods.
 *
 * @class Node
 * @constructor
 * @param {DOMNode} node the DOM node to be mapped to the Node instance.
 * @for Node
 */

// "globals"
var DOT = '.',
    NODE_NAME = 'nodeName',
    NODE_TYPE = 'nodeType',
    OWNER_DOCUMENT = 'ownerDocument',
    TAG_NAME = 'tagName',
    UID = '_yuid',

    _slice = Array.prototype.slice,

    Y_DOM = Y.DOM,

    Y_Node = function(node) {
        var uid = (node.nodeType !== 9) ? node.uniqueID : node[UID];

        if (uid && Y_Node._instances[uid] && Y_Node._instances[uid]._node !== node) {
            node[UID] = null; // unset existing uid to prevent collision (via clone or hack)
        }

        uid = uid || Y.stamp(node);
        if (!uid) { // stamp failed; likely IE non-HTMLElement
            uid = Y.guid();
        }

        this[UID] = uid;

        /**
         * The underlying DOM node bound to the Y.Node instance
         * @property _node
         * @private
         */
        this._node = node;
        Y_Node._instances[uid] = this;

        this._stateProxy = node; // when augmented with Attribute

        Y.EventTarget.call(this, {emitFacade:true});

        if (this._initPlugins) { // when augmented with Plugin.Host
            this._initPlugins();
        }

        this.SHOW_TRANSITION = Y_Node.SHOW_TRANSITION;
        this.HIDE_TRANSITION = Y_Node.HIDE_TRANSITION;
    },

    // used with previous/next/ancestor tests
    _wrapFn = function(fn) {
        var ret = null;
        if (fn) {
            ret = (typeof fn == 'string') ?
            function(n) {
                return Y.Selector.test(n, fn);
            } :
            function(n) {
                return fn(Y.one(n));
            };
        }

        return ret;
    };
// end "globals"

/**
 * The name of the component
 * @static
 * @property NAME
 */
Y_Node.NAME = 'node';

/*
 * The pattern used to identify ARIA attributes
 */
Y_Node.re_aria = /^(?:role$|aria-)/;

Y_Node.SHOW_TRANSITION = 'fadeIn';
Y_Node.HIDE_TRANSITION = 'fadeOut';

/**
 * List of events that route to DOM events
 * @static
 * @property DOM_EVENTS
 */

Y_Node.DOM_EVENTS = {
    abort: 1,
    beforeunload: 1,
    blur: 1,
    change: 1,
    click: 1,
    close: 1,
    command: 1,
    contextmenu: 1,
    dblclick: 1,
    DOMMouseScroll: 1,
    drag: 1,
    dragstart: 1,
    dragenter: 1,
    dragover: 1,
    dragleave: 1,
    dragend: 1,
    drop: 1,
    error: 1,
    focus: 1,
    key: 1,
    keydown: 1,
    keypress: 1,
    keyup: 1,
    load: 1,
    message: 1,
    mousedown: 1,
    mouseenter: 1,
    mouseleave: 1,
    mousemove: 1,
    mousemultiwheel: 1,
    mouseout: 1,
    mouseover: 1,
    mouseup: 1,
    mousewheel: 1,
    orientationchange: 1,
    reset: 1,
    resize: 1,
    select: 1,
    selectstart: 1,
    submit: 1,
    scroll: 1,
    textInput: 1,
    unload: 1
};

// Add custom event adaptors to this list.  This will make it so
// that delegate, key, available, contentready, etc all will
// be available through Node.on
Y.mix(Y_Node.DOM_EVENTS, Y.Env.evt.plugins);

/**
 * A list of Node instances that have been created
 * @private
 * @property _instances
 * @static
 *
 */
Y_Node._instances = {};

/**
 * Retrieves the DOM node bound to a Node instance
 * @method getDOMNode
 * @static
 *
 * @param {Y.Node || HTMLNode} node The Node instance or an HTMLNode
 * @return {HTMLNode} The DOM node bound to the Node instance.  If a DOM node is passed
 * as the node argument, it is simply returned.
 */
Y_Node.getDOMNode = function(node) {
    if (node) {
        return (node.nodeType) ? node : node._node || null;
    }
    return null;
};

/**
 * Checks Node return values and wraps DOM Nodes as Y.Node instances
 * and DOM Collections / Arrays as Y.NodeList instances.
 * Other return values just pass thru.  If undefined is returned (e.g. no return)
 * then the Node instance is returned for chainability.
 * @method scrubVal
 * @static
 *
 * @param {any} node The Node instance or an HTMLNode
 * @return {Y.Node | Y.NodeList | any} Depends on what is returned from the DOM node.
 */
Y_Node.scrubVal = function(val, node) {
    if (val) { // only truthy values are risky
         if (typeof val == 'object' || typeof val == 'function') { // safari nodeList === function
            if (NODE_TYPE in val || Y_DOM.isWindow(val)) {// node || window
                val = Y.one(val);
            } else if ((val.item && !val._nodes) || // dom collection or Node instance
                    (val[0] && val[0][NODE_TYPE])) { // array of DOM Nodes
                val = Y.all(val);
            }
        }
    } else if (typeof val === 'undefined') {
        val = node; // for chaining
    } else if (val === null) {
        val = null; // IE: DOM null not the same as null
    }

    return val;
};

/**
 * Adds methods to the Y.Node prototype, routing through scrubVal.
 * @method addMethod
 * @static
 *
 * @param {String} name The name of the method to add
 * @param {Function} fn The function that becomes the method
 * @param {Object} context An optional context to call the method with
 * (defaults to the Node instance)
 * @return {any} Depends on what is returned from the DOM node.
 */
Y_Node.addMethod = function(name, fn, context) {
    if (name && fn && typeof fn == 'function') {
        Y_Node.prototype[name] = function() {
            var args = _slice.call(arguments),
                node = this,
                ret;

            if (args[0] && Y.instanceOf(args[0], Y_Node)) {
                args[0] = args[0]._node;
            }

            if (args[1] && Y.instanceOf(args[1], Y_Node)) {
                args[1] = args[1]._node;
            }
            args.unshift(node._node);

            ret = fn.apply(node, args);

            if (ret) { // scrub truthy
                ret = Y_Node.scrubVal(ret, node);
            }

            (typeof ret != 'undefined') || (ret = node);
            return ret;
        };
    } else {
    }
};

/**
 * Imports utility methods to be added as Y.Node methods.
 * @method importMethod
 * @static
 *
 * @param {Object} host The object that contains the method to import.
 * @param {String} name The name of the method to import
 * @param {String} altName An optional name to use in place of the host name
 * @param {Object} context An optional context to call the method with
 */
Y_Node.importMethod = function(host, name, altName) {
    if (typeof name == 'string') {
        altName = altName || name;
        Y_Node.addMethod(altName, host[name], host);
    } else {
        Y.Array.each(name, function(n) {
            Y_Node.importMethod(host, n);
        });
    }
};

/**
 * Returns a single Node instance bound to the node or the
 * first element matching the given selector. Returns null if no match found.
 * <strong>Note:</strong> For chaining purposes you may want to
 * use <code>Y.all</code>, which returns a NodeList when no match is found.
 * @method Y.one
 * @static
 * @param {String | HTMLElement} node a node or Selector
 * @return {Y.Node | null} a Node instance or null if no match found.
 */
Y_Node.one = function(node) {
    var instance = null,
        cachedNode,
        uid;

    if (node) {
        if (typeof node == 'string') {
            if (node.indexOf('doc') === 0) { // doc OR document
                node = Y.config.doc;
            } else if (node.indexOf('win') === 0) { // win OR window
                node = Y.config.win;
            } else {
                node = Y.Selector.query(node, null, true);
            }
            if (!node) {
                return null;
            }
        } else if (Y.instanceOf(node, Y_Node)) {
            return node; // NOTE: return
        }

        if (node.nodeType || Y.DOM.isWindow(node)) { // avoid bad input (numbers, boolean, etc)
            uid = (node.uniqueID && node.nodeType !== 9) ? node.uniqueID : node._yuid;
            instance = Y_Node._instances[uid]; // reuse exising instances
            cachedNode = instance ? instance._node : null;
            if (!instance || (cachedNode && node !== cachedNode)) { // new Node when nodes don't match
                instance = new Y_Node(node);
            }
        }
    }
    return instance;
};

/**
 * Returns a new dom node using the provided markup string.
 * @method create
 * @static
 * @param {String} html The markup used to create the element
 * @param {HTMLDocument} doc An optional document context
 * @return {Node} A Node instance bound to a DOM node or fragment
 */
Y_Node.create = function(html, doc) {
    if (doc && doc._node) {
        doc = doc._node;
    }
    return Y.one(Y_DOM.create(html, doc));
};

/**
 * Static collection of configuration attributes for special handling
 * @property ATTRS
 * @static
 * @type object
 */
Y_Node.ATTRS = {
    /**
     * Allows for getting and setting the text of an element.
     * Formatting is preserved and special characters are treated literally.
     * @config text
     * @type String
     */
    text: {
        getter: function() {
            return Y_DOM.getText(this._node);
        },

        setter: function(content) {
            Y_DOM.setText(this._node, content);
            return content;
        }
    },

    'options': {
        getter: function() {
            return this._node.getElementsByTagName('option');
        }
    },

    /**
     * Returns a NodeList instance of all HTMLElement children.
     * @readOnly
     * @config children
     * @type NodeList
     */
    'children': {
        getter: function() {
            var node = this._node,
                children = node.children,
                childNodes, i, len;

            if (!children) {
                childNodes = node.childNodes;
                children = [];

                for (i = 0, len = childNodes.length; i < len; ++i) {
                    if (childNodes[i][TAG_NAME]) {
                        children[children.length] = childNodes[i];
                    }
                }
            }
            return Y.all(children);
        }
    },

    value: {
        getter: function() {
            return Y_DOM.getValue(this._node);
        },

        setter: function(val) {
            Y_DOM.setValue(this._node, val);
            return val;
        }
    }
};

/**
 * The default setter for DOM properties
 * Called with instance context (this === the Node instance)
 * @method DEFAULT_SETTER
 * @static
 * @param {String} name The attribute/property being set
 * @param {any} val The value to be set
 * @return {any} The value
 */
Y_Node.DEFAULT_SETTER = function(name, val) {
    var node = this._stateProxy,
        strPath;

    if (name.indexOf(DOT) > -1) {
        strPath = name;
        name = name.split(DOT);
        // only allow when defined on node
        Y.Object.setValue(node, name, val);
    } else if (typeof node[name] != 'undefined') { // pass thru DOM properties
        node[name] = val;
    }

    return val;
};

/**
 * The default getter for DOM properties
 * Called with instance context (this === the Node instance)
 * @method DEFAULT_GETTER
 * @static
 * @param {String} name The attribute/property to look up
 * @return {any} The current value
 */
Y_Node.DEFAULT_GETTER = function(name) {
    var node = this._stateProxy,
        val;

    if (name.indexOf && name.indexOf(DOT) > -1) {
        val = Y.Object.getValue(node, name.split(DOT));
    } else if (typeof node[name] != 'undefined') { // pass thru from DOM
        val = node[name];
    }

    return val;
};

// Basic prototype augment - no lazy constructor invocation.
Y.mix(Y_Node, Y.EventTarget, false, null, 1);

Y.mix(Y_Node.prototype, {
/**
 * The method called when outputting Node instances as strings
 * @method toString
 * @return {String} A string representation of the Node instance
 */
    toString: function() {
        var str = this[UID] + ': not bound to a node',
            node = this._node,
            attrs, id, className;

        if (node) {
            attrs = node.attributes;
            id = (attrs && attrs.id) ? node.getAttribute('id') : null;
            className = (attrs && attrs.className) ? node.getAttribute('className') : null;
            str = node[NODE_NAME];

            if (id) {
                str += '#' + id;
            }

            if (className) {
                str += '.' + className.replace(' ', '.');
            }

            // TODO: add yuid?
            str += ' ' + this[UID];
        }
        return str;
    },

    /**
     * Returns an attribute value on the Node instance.
     * Unless pre-configured (via Node.ATTRS), get hands
     * off to the underlying DOM node.  Only valid
     * attributes/properties for the node will be set.
     * @method get
     * @param {String} attr The attribute
     * @return {any} The current value of the attribute
     */
    get: function(attr) {
        var val;

        if (this._getAttr) { // use Attribute imple
            val = this._getAttr(attr);
        } else {
            val = this._get(attr);
        }

        if (val) {
            val = Y_Node.scrubVal(val, this);
        } else if (val === null) {
            val = null; // IE: DOM null is not true null (even though they ===)
        }
        return val;
    },

    /**
     * Helper method for get.
     * @method _get
     * @private
     * @param {String} attr The attribute
     * @return {any} The current value of the attribute
     */
    _get: function(attr) {
        var attrConfig = Y_Node.ATTRS[attr],
            val;

        if (attrConfig && attrConfig.getter) {
            val = attrConfig.getter.call(this);
        } else if (Y_Node.re_aria.test(attr)) {
            val = this._node.getAttribute(attr, 2);
        } else {
            val = Y_Node.DEFAULT_GETTER.apply(this, arguments);
        }

        return val;
    },

    /**
     * Sets an attribute on the Node instance.
     * Unless pre-configured (via Node.ATTRS), set hands
     * off to the underlying DOM node.  Only valid
     * attributes/properties for the node will be set.
     * To set custom attributes use setAttribute.
     * @method set
     * @param {String} attr The attribute to be set.
     * @param {any} val The value to set the attribute to.
     * @chainable
     */
    set: function(attr, val) {
        var attrConfig = Y_Node.ATTRS[attr];

        if (this._setAttr) { // use Attribute imple
            this._setAttr.apply(this, arguments);
        } else { // use setters inline
            if (attrConfig && attrConfig.setter) {
                attrConfig.setter.call(this, val, attr);
            } else if (Y_Node.re_aria.test(attr)) { // special case Aria
                this._node.setAttribute(attr, val);
            } else {
                Y_Node.DEFAULT_SETTER.apply(this, arguments);
            }
        }

        return this;
    },

    /**
     * Sets multiple attributes.
     * @method setAttrs
     * @param {Object} attrMap an object of name/value pairs to set
     * @chainable
     */
    setAttrs: function(attrMap) {
        if (this._setAttrs) { // use Attribute imple
            this._setAttrs(attrMap);
        } else { // use setters inline
            Y.Object.each(attrMap, function(v, n) {
                this.set(n, v);
            }, this);
        }

        return this;
    },

    /**
     * Returns an object containing the values for the requested attributes.
     * @method getAttrs
     * @param {Array} attrs an array of attributes to get values
     * @return {Object} An object with attribute name/value pairs.
     */
    getAttrs: function(attrs) {
        var ret = {};
        if (this._getAttrs) { // use Attribute imple
            this._getAttrs(attrs);
        } else { // use setters inline
            Y.Array.each(attrs, function(v, n) {
                ret[v] = this.get(v);
            }, this);
        }

        return ret;
    },

    /**
     * Creates a new Node using the provided markup string.
     * @method create
     * @param {String} html The markup used to create the element
     * @param {HTMLDocument} doc An optional document context
     * @return {Node} A Node instance bound to a DOM node or fragment
     */
    create: Y_Node.create,

    /**
     * Compares nodes to determine if they match.
     * Node instances can be compared to each other and/or HTMLElements.
     * @method compareTo
     * @param {HTMLElement | Node} refNode The reference node to compare to the node.
     * @return {Boolean} True if the nodes match, false if they do not.
     */
    compareTo: function(refNode) {
        var node = this._node;

        if (Y.instanceOf(refNode, Y_Node)) {
            refNode = refNode._node;
        }
        return node === refNode;
    },

    /**
     * Determines whether the node is appended to the document.
     * @method inDoc
     * @param {Node|HTMLElement} doc optional An optional document to check against.
     * Defaults to current document.
     * @return {Boolean} Whether or not this node is appended to the document.
     */
    inDoc: function(doc) {
        var node = this._node;
        doc = (doc) ? doc._node || doc : node[OWNER_DOCUMENT];
        if (doc.documentElement) {
            return Y_DOM.contains(doc.documentElement, node);
        }
    },

    getById: function(id) {
        var node = this._node,
            ret = Y_DOM.byId(id, node[OWNER_DOCUMENT]);
        if (ret && Y_DOM.contains(node, ret)) {
            ret = Y.one(ret);
        } else {
            ret = null;
        }
        return ret;
    },

   /**
     * Returns the nearest ancestor that passes the test applied by supplied boolean method.
     * @method ancestor
     * @param {String | Function} fn A selector string or boolean method for testing elements.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} The matching Node instance or null if not found
     */
    ancestor: function(fn, testSelf) {
        return Y.one(Y_DOM.ancestor(this._node, _wrapFn(fn), testSelf));
    },

   /**
     * Returns the ancestors that pass the test applied by supplied boolean method.
     * @method ancestors
     * @param {String | Function} fn A selector string or boolean method for testing elements.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {NodeList} A NodeList instance containing the matching elements 
     */
    ancestors: function(fn, testSelf) {
        return Y.all(Y_DOM.ancestors(this._node, _wrapFn(fn), testSelf));
    },

    /**
     * Returns the previous matching sibling.
     * Returns the nearest element node sibling if no method provided.
     * @method previous
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} Node instance or null if not found
     */
    previous: function(fn, all) {
        return Y.one(Y_DOM.elementByAxis(this._node, 'previousSibling', _wrapFn(fn), all));
    },

    /**
     * Returns the next matching sibling.
     * Returns the nearest element node sibling if no method provided.
     * @method next
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} Node instance or null if not found
     */
    next: function(fn, all) {
        return Y.one(Y_DOM.elementByAxis(this._node, 'nextSibling', _wrapFn(fn), all));
    },

    /**
     * Returns all matching siblings.
     * Returns all siblings if no method provided.
     * @method siblings
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {NodeList} NodeList instance bound to found siblings
     */
    siblings: function(fn) {
        return Y.all(Y_DOM.siblings(this._node, _wrapFn(fn)));
    },

    /**
     * Retrieves a Node instance of nodes based on the given CSS selector.
     * @method one
     *
     * @param {string} selector The CSS selector to test against.
     * @return {Node} A Node instance for the matching HTMLElement.
     */
    one: function(selector) {
        return Y.one(Y.Selector.query(selector, this._node, true));
    },

    /**
     * Retrieves a nodeList based on the given CSS selector.
     * @method all
     *
     * @param {string} selector The CSS selector to test against.
     * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
     */
    all: function(selector) {
        var nodelist = Y.all(Y.Selector.query(selector, this._node));
        nodelist._query = selector;
        nodelist._queryRoot = this._node;
        return nodelist;
    },

    // TODO: allow fn test
    /**
     * Test if the supplied node matches the supplied selector.
     * @method test
     *
     * @param {string} selector The CSS selector to test against.
     * @return {boolean} Whether or not the node matches the selector.
     */
    test: function(selector) {
        return Y.Selector.test(this._node, selector);
    },

    /**
     * Removes the node from its parent.
     * Shortcut for myNode.get('parentNode').removeChild(myNode);
     * @method remove
     * @param {Boolean} destroy whether or not to call destroy() on the node
     * after removal.
     * @chainable
     *
     */
    remove: function(destroy) {
        var node = this._node,
            parentNode = node.parentNode;

        if (parentNode) {
            parentNode.removeChild(node);
        }

        if (destroy) {
            this.destroy();
        }

        return this;
    },

    /**
     * Replace the node with the other node. This is a DOM update only
     * and does not change the node bound to the Node instance.
     * Shortcut for myNode.get('parentNode').replaceChild(newNode, myNode);
     * @method replace
     * @param {Y.Node || HTMLNode} newNode Node to be inserted
     * @chainable
     *
     */
    replace: function(newNode) {
        var node = this._node;
        if (typeof newNode == 'string') {
            newNode = Y_Node.create(newNode);
        }
        node.parentNode.replaceChild(Y_Node.getDOMNode(newNode), node);
        return this;
    },

    /**
     * @method replaceChild
     * @for Node
     * @param {String | HTMLElement | Node} node Node to be inserted 
     * @param {HTMLElement | Node} refNode Node to be replaced 
     * @return {Node} The replaced node
     */
    replaceChild: function(node, refNode) {
        if (typeof node == 'string') {
            node = Y_DOM.create(node);
        }

        return Y.one(this._node.replaceChild(Y_Node.getDOMNode(node), Y_Node.getDOMNode(refNode)));
    },

    /**
     * @method appendChild
     * @param {String | HTMLElement | Node} node Node to be appended 
     * @return {Node} The appended node 
     */
    appendChild: function(node) {
        return Y_Node.scrubVal(this._insert(node));
    },

    /**
     * @method insertBefore
     * @param {String | HTMLElement | Node} newNode Node to be appended 
     * @param {HTMLElement | Node} refNode Node to be inserted before 
     * @return {Node} The inserted node 
     */
    insertBefore: function(newNode, refNode) {
        return Y.Node.scrubVal(this._insert(newNode, refNode));
    },

    /**
     * Removes event listeners from the node and (optionally) its subtree
     * @method purge
     * @param {Boolean} recurse (optional) Whether or not to remove listeners from the
     * node's subtree
     * @param {String} type (optional) Only remove listeners of the specified type
     * @chainable
     *
     */
    purge: function(recurse, type) {
        Y.Event.purgeElement(this._node, recurse, type);
        return this;
    },

    /**
     * Nulls internal node references, removes any plugins and event listeners
     * @method destroy
     * @param {Boolean} recursivePurge (optional) Whether or not to remove listeners from the
     * node's subtree (default is false)
     *
     */
    destroy: function(recursive) {
        this.purge(); // TODO: only remove events add via this Node

        if (this.unplug) { // may not be a PluginHost
            this.unplug();
        }

        this.clearData();

        if (recursive) {
            this.all('*').destroy();
        }

        this._node = null;
        this._stateProxy = null;

        delete Y_Node._instances[this[UID]];
    },

    /**
     * Invokes a method on the Node instance
     * @method invoke
     * @param {String} method The name of the method to invoke
     * @param {Any}  a, b, c, etc. Arguments to invoke the method with.
     * @return Whatever the underly method returns.
     * DOM Nodes and Collections return values
     * are converted to Node/NodeList instances.
     *
     */
    invoke: function(method, a, b, c, d, e) {
        var node = this._node,
            ret;

        if (a && Y.instanceOf(a, Y_Node)) {
            a = a._node;
        }

        if (b && Y.instanceOf(b, Y_Node)) {
            b = b._node;
        }

        ret = node[method](a, b, c, d, e);
        return Y_Node.scrubVal(ret, this);
    },

    /**
     * Inserts the content before the reference node.
     * @method insert
     * @param {String | Y.Node | HTMLElement | Y.NodeList | HTMLCollection} content The content to insert
     * @param {Int | Y.Node | HTMLElement | String} where The position to insert at.
     * Possible "where" arguments
     * <dl>
     * <dt>Y.Node</dt>
     * <dd>The Node to insert before</dd>
     * <dt>HTMLElement</dt>
     * <dd>The element to insert before</dd>
     * <dt>Int</dt>
     * <dd>The index of the child element to insert before</dd>
     * <dt>"replace"</dt>
     * <dd>Replaces the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts before the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts content before the node</dd>
     * <dt>"after"</dt>
     * <dd>Inserts content after the node</dd>
     * </dl>
     * @chainable
     */
    insert: function(content, where) {
        this._insert(content, where);
        return this;
    },

    _insert: function(content, where) {
        var node = this._node,
            ret = null;

        if (typeof where == 'number') { // allow index
            where = this._node.childNodes[where];
        } else if (where && where._node) { // Node
            where = where._node;
        }

        if (content && typeof content != 'string') { // allow Node or NodeList/Array instances
            content = content._node || content._nodes || content;
        }
        ret = Y_DOM.addHTML(node, content, where);

        return ret;
    },

    /**
     * Inserts the content as the firstChild of the node.
     * @method prepend
     * @param {String | Y.Node | HTMLElement} content The content to insert
     * @chainable
     */
    prepend: function(content) {
        return this.insert(content, 0);
    },

    /**
     * Inserts the content as the lastChild of the node.
     * @method append
     * @param {String | Y.Node | HTMLElement} content The content to insert
     * @chainable
     */
    append: function(content) {
        return this.insert(content, null);
    },

    /**
     * Appends the node to the given node. 
     * @method appendTo
     * @param {Y.Node | HTMLElement} node The node to append to
     * @chainable
     */
    appendTo: function(node) {
        Y.one(node).append(this);
        return this;
    },

    /**
     * Replaces the node's current content with the content.
     * @method setContent
     * @param {String | Y.Node | HTMLElement | Y.NodeList | HTMLCollection} content The content to insert
     * @chainable
     */
    setContent: function(content) {
        this._insert(content, 'replace');
        return this;
    },

    /**
     * Returns the node's current content (e.g. innerHTML) 
     * @method getContent
     * @return {String} The current content
     */
    getContent: function(content) {
        return this.get('innerHTML');
    },

    /**
    * @method swap
    * @description Swap DOM locations with the given node.
    * This does not change which DOM node each Node instance refers to.
    * @param {Node} otherNode The node to swap with
     * @chainable
    */
    swap: Y.config.doc.documentElement.swapNode ?
        function(otherNode) {
            this._node.swapNode(Y_Node.getDOMNode(otherNode));
        } :
        function(otherNode) {
            otherNode = Y_Node.getDOMNode(otherNode);
            var node = this._node,
                parent = otherNode.parentNode,
                nextSibling = otherNode.nextSibling;

            if (nextSibling === node) {
                parent.insertBefore(node, otherNode);
            } else if (otherNode === node.nextSibling) {
                parent.insertBefore(otherNode, node);
            } else {
                node.parentNode.replaceChild(otherNode, node);
                Y_DOM.addHTML(parent, node, nextSibling);
            }
            return this;
        },


    /**
    * @method getData
    * @description Retrieves arbitrary data stored on a Node instance.
    * This is not stored with the DOM node.
    * @param {string} name Optional name of the data field to retrieve.
    * If no name is given, all data is returned.
    * @return {any | Object} Whatever is stored at the given field,
    * or an object hash of all fields.
    */
    getData: function(name) {
        var ret;
        this._data = this._data || {};
        if (arguments.length) {
            ret = this._data[name];
        } else {
            ret = this._data;
        }

        return ret;

    },

    /**
    * @method setData
    * @description Stores arbitrary data on a Node instance.
    * This is not stored with the DOM node.
    * @param {string} name The name of the field to set. If no name
    * is given, name is treated as the data and overrides any existing data.
    * @param {any} val The value to be assigned to the field.
    * @chainable
    */
    setData: function(name, val) {
        this._data = this._data || {};
        if (arguments.length > 1) {
            this._data[name] = val;
        } else {
            this._data = name;
        }

       return this;
    },

    /**
    * @method clearData
    * @description Clears stored data.
    * @param {string} name The name of the field to clear. If no name
    * is given, all data is cleared.
    * @chainable
    */
    clearData: function(name) {
        if ('_data' in this) {
            if (name) {
                delete this._data[name];
            } else {
                delete this._data;
            }
        }

        return this;
    },

    hasMethod: function(method) {
        var node = this._node;
        return !!(node && method in node &&
                typeof node[method] != 'unknown' &&
            (typeof node[method] == 'function' ||
                String(node[method]).indexOf('function') === 1)); // IE reports as object, prepends space
    },

    SHOW_TRANSITION: null,
    HIDE_TRANSITION: null,

    /**
     * Makes the node visible.
     * If the "transition" module is loaded, show optionally
     * animates the showing of the node using either the default
     * transition effect ('fadeIn'), or the given named effect.
     * @method show
     * @param {String} name A named Transition effect to use as the show effect. 
     * @param {Object} config Options to use with the transition. 
     * @param {Function} callback An optional function to run after the transition completes. 
     * @chainable
     */
    show: function(callback) {
        callback = arguments[arguments.length - 1];
        this.toggleView(true, callback);
        return this;
    },

    /**
     * The implementation for showing nodes.
     * Default is to toggle the style.display property.
     * @protected
     * @chainable
     */
    _show: function() {
        this.setStyle('display', '');

    },

    _isHidden: function() {
        return Y.DOM.getStyle(this._node, 'display') === 'none';
    },

    toggleView: function(on, callback) {
        this._toggleView.apply(this, arguments);
    },

    _toggleView: function(on, callback) {
        callback = arguments[arguments.length - 1];

        // base on current state if not forcing 
        if (typeof on != 'boolean') {
            on = (this._isHidden()) ? 1 : 0;
        }

        if (on) {
            this._show();
        }  else {
            this._hide();
        }

        if (typeof callback == 'function') {
            callback.call(this);
        }

        return this;
    },

    /**
     * Hides the node.
     * If the "transition" module is loaded, hide optionally
     * animates the hiding of the node using either the default
     * transition effect ('fadeOut'), or the given named effect.
     * @method hide
     * @param {String} name A named Transition effect to use as the show effect. 
     * @param {Object} config Options to use with the transition. 
     * @param {Function} callback An optional function to run after the transition completes. 
     * @chainable
     */
    hide: function(callback) {
        callback = arguments[arguments.length - 1];
        this.toggleView(false, callback);
        return this;
    },

    /**
     * The implementation for hiding nodes.
     * Default is to toggle the style.display property.
     * @protected
     * @chainable
     */
    _hide: function() {
        this.setStyle('display', 'none');
    },

    isFragment: function() {
        return (this.get('nodeType') === 11);
    },

    /**
     * Removes all of the child nodes from the node.
     * @param {Boolean} destroy Whether the nodes should also be destroyed. 
     * @chainable
     */
    empty: function(destroy) {
        this.get('childNodes').remove(destroy);
        return this;
    }

}, true);

Y.Node = Y_Node;
Y.one = Y.Node.one;
/**
 * The NodeList module provides support for managing collections of Nodes.
 * @module node
 * @submodule nodelist
 */

/**
 * The NodeList class provides a wrapper for manipulating DOM NodeLists.
 * NodeList properties can be accessed via the set/get methods.
 * Use Y.all() to retrieve NodeList instances.
 *
 * @class NodeList
 * @constructor
 */

var NodeList = function(nodes) {
    var tmp = [];
    if (typeof nodes === 'string') { // selector query
        this._query = nodes;
        nodes = Y.Selector.query(nodes);
    } else if (nodes.nodeType || Y_DOM.isWindow(nodes)) { // domNode || window
        nodes = [nodes];
    } else if (Y.instanceOf(nodes, Y.Node)) {
        nodes = [nodes._node];
    } else if (Y.instanceOf(nodes[0], Y.Node)) { // allow array of Y.Nodes
        Y.Array.each(nodes, function(node) {
            if (node._node) {
                tmp.push(node._node);
            }
        });
        nodes = tmp;
    } else { // array of domNodes or domNodeList (no mixed array of Y.Node/domNodes)
        nodes = Y.Array(nodes, 0, true);
    }

    /**
     * The underlying array of DOM nodes bound to the Y.NodeList instance
     * @property _nodes
     * @private
     */
    this._nodes = nodes;
};

NodeList.NAME = 'NodeList';

/**
 * Retrieves the DOM nodes bound to a NodeList instance
 * @method NodeList.getDOMNodes
 * @static
 *
 * @param {Y.NodeList} nodelist The NodeList instance
 * @return {Array} The array of DOM nodes bound to the NodeList
 */
NodeList.getDOMNodes = function(nodelist) {
    return (nodelist && nodelist._nodes) ? nodelist._nodes : nodelist;
};

NodeList.each = function(instance, fn, context) {
    var nodes = instance._nodes;
    if (nodes && nodes.length) {
        Y.Array.each(nodes, fn, context || instance);
    } else {
    }
};

NodeList.addMethod = function(name, fn, context) {
    if (name && fn) {
        NodeList.prototype[name] = function() {
            var ret = [],
                args = arguments;

            Y.Array.each(this._nodes, function(node) {
                var UID = (node.uniqueID && node.nodeType !== 9 ) ? 'uniqueID' : '_yuid',
                    instance = Y.Node._instances[node[UID]],
                    ctx,
                    result;

                if (!instance) {
                    instance = NodeList._getTempNode(node);
                }
                ctx = context || instance;
                result = fn.apply(ctx, args);
                if (result !== undefined && result !== instance) {
                    ret[ret.length] = result;
                }
            });

            // TODO: remove tmp pointer
            return ret.length ? ret : this;
        };
    } else {
    }
};

NodeList.importMethod = function(host, name, altName) {
    if (typeof name === 'string') {
        altName = altName || name;
        NodeList.addMethod(name, host[name]);
    } else {
        Y.Array.each(name, function(n) {
            NodeList.importMethod(host, n);
        });
    }
};

NodeList._getTempNode = function(node) {
    var tmp = NodeList._tempNode;
    if (!tmp) {
        tmp = Y.Node.create('<div></div>');
        NodeList._tempNode = tmp;
    }

    tmp._node = node;
    tmp._stateProxy = node;
    return tmp;
};

Y.mix(NodeList.prototype, {
    /**
     * Retrieves the Node instance at the given index.
     * @method item
     *
     * @param {Number} index The index of the target Node.
     * @return {Node} The Node instance at the given index.
     */
    item: function(index) {
        return Y.one((this._nodes || [])[index]);
    },

    /**
     * Applies the given function to each Node in the NodeList.
     * @method each
     * @param {Function} fn The function to apply. It receives 3 arguments:
     * the current node instance, the node's index, and the NodeList instance
     * @param {Object} context optional An optional context to apply the function with
     * Default context is the current Node instance
     * @chainable
     */
    each: function(fn, context) {
        var instance = this;
        Y.Array.each(this._nodes, function(node, index) {
            node = Y.one(node);
            return fn.call(context || node, node, index, instance);
        });
        return instance;
    },

    batch: function(fn, context) {
        var nodelist = this;

        Y.Array.each(this._nodes, function(node, index) {
            var instance = Y.Node._instances[node[UID]];
            if (!instance) {
                instance = NodeList._getTempNode(node);
            }

            return fn.call(context || instance, instance, index, nodelist);
        });
        return nodelist;
    },

    /**
     * Executes the function once for each node until a true value is returned.
     * @method some
     * @param {Function} fn The function to apply. It receives 3 arguments:
     * the current node instance, the node's index, and the NodeList instance
     * @param {Object} context optional An optional context to execute the function from.
     * Default context is the current Node instance
     * @return {Boolean} Whether or not the function returned true for any node.
     */
    some: function(fn, context) {
        var instance = this;
        return Y.Array.some(this._nodes, function(node, index) {
            node = Y.one(node);
            context = context || node;
            return fn.call(context, node, index, instance);
        });
    },

    /**
     * Creates a documenFragment from the nodes bound to the NodeList instance
     * @method toFrag
     * @return Node a Node instance bound to the documentFragment
     */
    toFrag: function() {
        return Y.one(Y.DOM._nl2frag(this._nodes));
    },

    /**
     * Returns the index of the node in the NodeList instance
     * or -1 if the node isn't found.
     * @method indexOf
     * @param {Y.Node || DOMNode} node the node to search for
     * @return {Int} the index of the node value or -1 if not found
     */
    indexOf: function(node) {
        return Y.Array.indexOf(this._nodes, Y.Node.getDOMNode(node));
    },

    /**
     * Filters the NodeList instance down to only nodes matching the given selector.
     * @method filter
     * @param {String} selector The selector to filter against
     * @return {NodeList} NodeList containing the updated collection
     * @see Selector
     */
    filter: function(selector) {
        return Y.all(Y.Selector.filter(this._nodes, selector));
    },


    /**
     * Creates a new NodeList containing all nodes at every n indices, where
     * remainder n % index equals r.
     * (zero-based index).
     * @method modulus
     * @param {Int} n The offset to use (return every nth node)
     * @param {Int} r An optional remainder to use with the modulus operation (defaults to zero)
     * @return {NodeList} NodeList containing the updated collection
     */
    modulus: function(n, r) {
        r = r || 0;
        var nodes = [];
        NodeList.each(this, function(node, i) {
            if (i % n === r) {
                nodes.push(node);
            }
        });

        return Y.all(nodes);
    },

    /**
     * Creates a new NodeList containing all nodes at odd indices
     * (zero-based index).
     * @method odd
     * @return {NodeList} NodeList containing the updated collection
     */
    odd: function() {
        return this.modulus(2, 1);
    },

    /**
     * Creates a new NodeList containing all nodes at even indices
     * (zero-based index), including zero.
     * @method even
     * @return {NodeList} NodeList containing the updated collection
     */
    even: function() {
        return this.modulus(2);
    },

    destructor: function() {
    },

    /**
     * Reruns the initial query, when created using a selector query
     * @method refresh
     * @chainable
     */
    refresh: function() {
        var doc,
            nodes = this._nodes,
            query = this._query,
            root = this._queryRoot;

        if (query) {
            if (!root) {
                if (nodes && nodes[0] && nodes[0].ownerDocument) {
                    root = nodes[0].ownerDocument;
                }
            }

            this._nodes = Y.Selector.query(query, root);
        }

        return this;
    },

    _prepEvtArgs: function(type, fn, context) {
        // map to Y.on/after signature (type, fn, nodes, context, arg1, arg2, etc)
        var args = Y.Array(arguments, 0, true);

        if (args.length < 2) { // type only (event hash) just add nodes
            args[2] = this._nodes;
        } else {
            args.splice(2, 0, this._nodes);
        }

        args[3] = context || this; // default to NodeList instance as context

        return args;
    },

    /**
     * Applies an event listener to each Node bound to the NodeList.
     * @method on
     * @param {String} type The event being listened for
     * @param {Function} fn The handler to call when the event fires
     * @param {Object} context The context to call the handler with.
     * Default is the NodeList instance.
     * @param {Object} context The context to call the handler with.
     * param {mixed} arg* 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {Object} Returns an event handle that can later be use to detach().
     * @see Event.on
     */
    on: function(type, fn, context) {
        return Y.on.apply(Y, this._prepEvtArgs.apply(this, arguments));
    },

    /**
     * Applies an one-time event listener to each Node bound to the NodeList.
     * @method once
     * @param {String} type The event being listened for
     * @param {Function} fn The handler to call when the event fires
     * @param {Object} context The context to call the handler with.
     * Default is the NodeList instance.
     * @return {Object} Returns an event handle that can later be use to detach().
     * @see Event.on
     */
    once: function(type, fn, context) {
        return Y.once.apply(Y, this._prepEvtArgs.apply(this, arguments));
    },

    /**
     * Applies an event listener to each Node bound to the NodeList.
     * The handler is called only after all on() handlers are called
     * and the event is not prevented.
     * @method after
     * @param {String} type The event being listened for
     * @param {Function} fn The handler to call when the event fires
     * @param {Object} context The context to call the handler with.
     * Default is the NodeList instance.
     * @return {Object} Returns an event handle that can later be use to detach().
     * @see Event.on
     */
    after: function(type, fn, context) {
        return Y.after.apply(Y, this._prepEvtArgs.apply(this, arguments));
    },

    /**
     * Returns the current number of items in the NodeList.
     * @method size
     * @return {Int} The number of items in the NodeList.
     */
    size: function() {
        return this._nodes.length;
    },

    /**
     * Determines if the instance is bound to any nodes
     * @method isEmpty
     * @return {Boolean} Whether or not the NodeList is bound to any nodes
     */
    isEmpty: function() {
        return this._nodes.length < 1;
    },

    toString: function() {
        var str = '',
            errorMsg = this[UID] + ': not bound to any nodes',
            nodes = this._nodes,
            node;

        if (nodes && nodes[0]) {
            node = nodes[0];
            str += node[NODE_NAME];
            if (node.id) {
                str += '#' + node.id;
            }

            if (node.className) {
                str += '.' + node.className.replace(' ', '.');
            }

            if (nodes.length > 1) {
                str += '...[' + nodes.length + ' items]';
            }
        }
        return str || errorMsg;
    }

}, true);

NodeList.importMethod(Y.Node.prototype, [
    /**
     * Called on each Node instance
     * @for NodeList
     * @method append
     * @see Node.append
     */
    'append',

    /** Called on each Node instance
      * @method destroy
      * @see Node.destroy
      */
    'destroy',

    /**
      * Called on each Node instance
      * @method detach
      * @see Node.detach
      */
    'detach',

    /** Called on each Node instance
      * @method detachAll
      * @see Node.detachAll
      */
    'detachAll',

    /** Called on each Node instance
      * @method empty
      * @see Node.empty
      */
    'empty',

    /** Called on each Node instance
      * @method insert
      * @see Node.insert
      */
    'insert',

    /** Called on each Node instance
      * @method prepend
      * @see Node.prepend
      */
    'prepend',

    /** Called on each Node instance
      * @method remove
      * @see Node.remove
      */
    'remove',

    /** Called on each Node instance
      * @method set
      * @see Node.set
      */
    'set',

    /** Called on each Node instance
      * @method setContent
      * @see Node.setContent
      */
    'setContent',

    /**
     * Makes each node visible.
     * If the "transition" module is loaded, show optionally
     * animates the showing of the node using either the default
     * transition effect ('fadeIn'), or the given named effect.
     * @method show
     * @param {String} name A named Transition effect to use as the show effect. 
     * @param {Object} config Options to use with the transition. 
     * @param {Function} callback An optional function to run after the transition completes. 
     * @chainable
     */
    'show',

    /**
     * Hides each node.
     * If the "transition" module is loaded, hide optionally
     * animates the hiding of the node using either the default
     * transition effect ('fadeOut'), or the given named effect.
     * @method hide
     * @param {String} name A named Transition effect to use as the show effect. 
     * @param {Object} config Options to use with the transition. 
     * @param {Function} callback An optional function to run after the transition completes. 
     * @chainable
     */
    'hide',

    'toggleView'
]);

// one-off implementation to convert array of Nodes to NodeList
// e.g. Y.all('input').get('parentNode');

/** Called on each Node instance
  * @method get
  * @see Node
  */
NodeList.prototype.get = function(attr) {
    var ret = [],
        nodes = this._nodes,
        isNodeList = false,
        getTemp = NodeList._getTempNode,
        instance,
        val;

    if (nodes[0]) {
        instance = Y.Node._instances[nodes[0]._yuid] || getTemp(nodes[0]);
        val = instance._get(attr);
        if (val && val.nodeType) {
            isNodeList = true;
        }
    }

    Y.Array.each(nodes, function(node) {
        instance = Y.Node._instances[node._yuid];

        if (!instance) {
            instance = getTemp(node);
        }

        val = instance._get(attr);
        if (!isNodeList) { // convert array of Nodes to NodeList
            val = Y.Node.scrubVal(val, instance);
        }

        ret.push(val);
    });

    return (isNodeList) ? Y.all(ret) : ret;
};

Y.NodeList = NodeList;

Y.all = function(nodes) {
    return new NodeList(nodes);
};

Y.Node.all = Y.all;
Y.Array.each([
    /**
     * Passes through to DOM method.
     * @for Node
     * @method removeChild
     * @param {HTMLElement | Node} node Node to be removed 
     * @return {Node} The removed node 
     */
    'removeChild',

    /**
     * Passes through to DOM method.
     * @method hasChildNodes
     * @return {Boolean} Whether or not the node has any childNodes 
     */
    'hasChildNodes',

    /**
     * Passes through to DOM method.
     * @method cloneNode
     * @param {Boolean} deep Whether or not to perform a deep clone, which includes
     * subtree and attributes
     * @return {Node} The clone 
     */
    'cloneNode',

    /**
     * Passes through to DOM method.
     * @method hasAttribute
     * @param {String} attribute The attribute to test for 
     * @return {Boolean} Whether or not the attribute is present 
     */
    'hasAttribute',

    /**
     * Passes through to DOM method.
     * @method removeAttribute
     * @param {String} attribute The attribute to be removed 
     * @chainable
     */
    'removeAttribute',

    /**
     * Passes through to DOM method.
     * @method scrollIntoView
     * @chainable
     */
    'scrollIntoView',

    /**
     * Passes through to DOM method.
     * @method getElementsByTagName
     * @param {String} tagName The tagName to collect 
     * @return {NodeList} A NodeList representing the HTMLCollection
     */
    'getElementsByTagName',

    /**
     * Passes through to DOM method.
     * @method focus
     * @chainable
     */
    'focus',

    /**
     * Passes through to DOM method.
     * @method blur
     * @chainable
     */
    'blur',

    /**
     * Passes through to DOM method.
     * Only valid on FORM elements
     * @method submit
     * @chainable
     */
    'submit',

    /**
     * Passes through to DOM method.
     * Only valid on FORM elements
     * @method reset
     * @chainable
     */
    'reset',

    /**
     * Passes through to DOM method.
     * @method select
     * @chainable
     */
     'select',

    /**
     * Passes through to DOM method.
     * Only valid on TABLE elements
     * @method createCaption
     * @chainable
     */
    'createCaption'

], function(method) {
    Y.Node.prototype[method] = function(arg1, arg2, arg3) {
        var ret = this.invoke(method, arg1, arg2, arg3);
        return ret;
    };
});

Y.Node.importMethod(Y.DOM, [
    /**
     * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy.
     * @method contains
     * @param {Node | HTMLElement} needle The possible node or descendent
     * @return {Boolean} Whether or not this node is the needle its ancestor
     */
    'contains',
    /**
     * Allows setting attributes on DOM nodes, normalizing in some cases.
     * This passes through to the DOM node, allowing for custom attributes.
     * @method setAttribute
     * @for Node
     * @for NodeList
     * @chainable
     * @param {string} name The attribute name 
     * @param {string} value The value to set
     */
    'setAttribute',
    /**
     * Allows getting attributes on DOM nodes, normalizing in some cases.
     * This passes through to the DOM node, allowing for custom attributes.
     * @method getAttribute
     * @for Node
     * @for NodeList
     * @param {string} name The attribute name 
     * @return {string} The attribute value 
     */
    'getAttribute',

    /**
     * Wraps the given HTML around the node.
     * @method wrap
     * @param {String} html The markup to wrap around the node. 
     * @chainable
     */
    'wrap',

    /**
     * Removes the node's parent node. 
     * @method unwrap
     * @chainable
     */
    'unwrap',

    /**
     * Applies a unique ID to the node if none exists
     * @method generateID
     * @return {String} The existing or generated ID
     */
    'generateID'
]);

Y.NodeList.importMethod(Y.Node.prototype, [
/**
 * Allows getting attributes on DOM nodes, normalizing in some cases.
 * This passes through to the DOM node, allowing for custom attributes.
 * @method getAttribute
 * @see Node
 * @for NodeList
 * @param {string} name The attribute name 
 * @return {string} The attribute value 
 */

    'getAttribute',
/**
 * Allows setting attributes on DOM nodes, normalizing in some cases.
 * This passes through to the DOM node, allowing for custom attributes.
 * @method setAttribute
 * @see Node
 * @for NodeList
 * @chainable
 * @param {string} name The attribute name 
 * @param {string} value The value to set
 */
    'setAttribute',
 
/**
 * Allows for removing attributes on DOM nodes.
 * This passes through to the DOM node, allowing for custom attributes.
 * @method removeAttribute
 * @see Node
 * @for NodeList
 * @param {string} name The attribute to remove 
 */
    'removeAttribute',
/**
 * Removes the parent node from node in the list. 
 * @method unwrap
 * @chainable
 */
    'unwrap',
/**
 * Wraps the given HTML around each node.
 * @method wrap
 * @param {String} html The markup to wrap around the node. 
 * @chainable
 */
    'wrap',

/**
 * Applies a unique ID to each node if none exists
 * @method generateID
 * @return {String} The existing or generated ID
 */
    'generateID'
]);
(function(Y) {
    var methods = [
    /**
     * Determines whether each node has the given className.
     * @method hasClass
     * @for Node
     * @param {String} className the class name to search for
     * @return {Boolean} Whether or not the element has the specified class 
     */
     'hasClass',

    /**
     * Adds a class name to each node.
     * @method addClass         
     * @param {String} className the class name to add to the node's class attribute
     * @chainable
     */
     'addClass',

    /**
     * Removes a class name from each node.
     * @method removeClass         
     * @param {String} className the class name to remove from the node's class attribute
     * @chainable
     */
     'removeClass',

    /**
     * Replace a class with another class for each node.
     * If no oldClassName is present, the newClassName is simply added.
     * @method replaceClass  
     * @param {String} oldClassName the class name to be replaced
     * @param {String} newClassName the class name that will be replacing the old class name
     * @chainable
     */
     'replaceClass',

    /**
     * If the className exists on the node it is removed, if it doesn't exist it is added.
     * @method toggleClass  
     * @param {String} className the class name to be toggled
     * @param {Boolean} force Option to force adding or removing the class. 
     * @chainable
     */
     'toggleClass'
    ];

    Y.Node.importMethod(Y.DOM, methods);
    /**
     * Determines whether each node has the given className.
     * @method hasClass
     * @see Node.hasClass
     * @for NodeList
     * @param {String} className the class name to search for
     * @return {Array} An array of booleans for each node bound to the NodeList. 
     */

    /**
     * Adds a class name to each node.
     * @method addClass         
     * @see Node.addClass
     * @param {String} className the class name to add to the node's class attribute
     * @chainable
     */

    /**
     * Removes a class name from each node.
     * @method removeClass         
     * @see Node.removeClass
     * @param {String} className the class name to remove from the node's class attribute
     * @chainable
     */

    /**
     * Replace a class with another class for each node.
     * If no oldClassName is present, the newClassName is simply added.
     * @method replaceClass  
     * @see Node.replaceClass
     * @param {String} oldClassName the class name to be replaced
     * @param {String} newClassName the class name that will be replacing the old class name
     * @chainable
     */

    /**
     * If the className exists on the node it is removed, if it doesn't exist it is added.
     * @method toggleClass  
     * @see Node.toggleClass
     * @param {String} className the class name to be toggled
     * @chainable
     */
    Y.NodeList.importMethod(Y.Node.prototype, methods);
})(Y);

if (!Y.config.doc.documentElement.hasAttribute) { // IE < 8
    Y.Node.prototype.hasAttribute = function(attr) {
        if (attr === 'value') {
            if (this.get('value') !== "") { // IE < 8 fails to populate specified when set in HTML
                return true;
            }
        }
        return !!(this._node.attributes[attr] &&
                this._node.attributes[attr].specified);
    };
}

// IE throws an error when calling focus() on an element that's invisible, not
// displayed, or disabled.
Y.Node.prototype.focus = function () {
    try {
        this._node.focus();
    } catch (e) {
    }
};

// IE throws error when setting input.type = 'hidden',
// input.setAttribute('type', 'hidden') and input.attributes.type.value = 'hidden'
Y.Node.ATTRS.type = {
    setter: function(val) {
        if (val === 'hidden') {
            try {
                this._node.type = 'hidden';
            } catch(e) {
                this.setStyle('display', 'none');
                this._inputType = 'hidden';
            }
        } else {
            try { // IE errors when changing the type from "hidden'
                this._node.type = val;
            } catch (e) {
            }
        }
        return val;
    },

    getter: function() {
        return this._inputType || this._node.type;
    },

    _bypassProxy: true // don't update DOM when using with Attribute
};

if (Y.config.doc.createElement('form').elements.nodeType) {
    // IE: elements collection is also FORM node which trips up scrubVal.
    Y.Node.ATTRS.elements = {
            getter: function() {
                return this.all('input, textarea, button, select');
            }
    };
}

Y.mix(Y.Node.ATTRS, {
    offsetHeight: {
        setter: function(h) {
            Y.DOM.setHeight(this._node, h);
            return h;
        },

        getter: function() {
            return this._node.offsetHeight;
        }
    },

    offsetWidth: {
        setter: function(w) {
            Y.DOM.setWidth(this._node, w);
            return w;
        },

        getter: function() {
            return this._node.offsetWidth;
        }
    }
});

Y.mix(Y.Node.prototype, {
    sizeTo: function(w, h) {
        var node;
        if (arguments.length < 2) {
            node = Y.one(w);
            w = node.get('offsetWidth');
            h = node.get('offsetHeight');
        }

        this.setAttrs({
            offsetWidth: w,
            offsetHeight: h
        });
    }
});
var Y_NodeList = Y.NodeList,
    ArrayProto = Array.prototype,
    ArrayMethods = [
        /** Returns a new NodeList combining the given NodeList(s) 
          * @for NodeList
          * @method concat
          * @param {NodeList | Array} valueN Arrays/NodeLists and/or values to
          * concatenate to the resulting NodeList
          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.
          */
        'concat',
        /** Removes the first last from the NodeList and returns it.
          * @for NodeList
          * @method pop
          * @return {Node} The last item in the NodeList.
          */
        'pop',
        /** Adds the given Node(s) to the end of the NodeList. 
          * @for NodeList
          * @method push
          * @param {Node | DOMNode} nodeN One or more nodes to add to the end of the NodeList. 
          */
        'push',
        /** Removes the first item from the NodeList and returns it.
          * @for NodeList
          * @method shift
          * @return {Node} The first item in the NodeList.
          */
        'shift',
        /** Returns a new NodeList comprising the Nodes in the given range. 
          * @for NodeList
          * @method slice
          * @param {Number} begin Zero-based index at which to begin extraction.
          As a negative index, start indicates an offset from the end of the sequence. slice(-2) extracts the second-to-last element and the last element in the sequence.
          * @param {Number} end Zero-based index at which to end extraction. slice extracts up to but not including end.
          slice(1,4) extracts the second element through the fourth element (elements indexed 1, 2, and 3).
          As a negative index, end indicates an offset from the end of the sequence. slice(2,-1) extracts the third element through the second-to-last element in the sequence.
          If end is omitted, slice extracts to the end of the sequence.
          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.
          */
        'slice',
        /** Changes the content of the NodeList, adding new elements while removing old elements.
          * @for NodeList
          * @method splice
          * @param {Number} index Index at which to start changing the array. If negative, will begin that many elements from the end.
          * @param {Number} howMany An integer indicating the number of old array elements to remove. If howMany is 0, no elements are removed. In this case, you should specify at least one new element. If no howMany parameter is specified (second syntax above, which is a SpiderMonkey extension), all elements after index are removed.
          * {Node | DOMNode| element1, ..., elementN 
          The elements to add to the array. If you don't specify any elements, splice simply removes elements from the array.
          * @return {NodeList} The element(s) removed.
          */
        'splice',
        /** Adds the given Node(s) to the beginning of the NodeList. 
          * @for NodeList
          * @method push
          * @param {Node | DOMNode} nodeN One or more nodes to add to the NodeList. 
          */
        'unshift'
    ];


Y.Array.each(ArrayMethods, function(name) {
    Y_NodeList.prototype[name] = function() {
        var args = [],
            i = 0,
            arg;

        while ((arg = arguments[i++])) { // use DOM nodes/nodeLists 
            args.push(arg._node || arg._nodes || arg);
        }
        return Y.Node.scrubVal(ArrayProto[name].apply(this._nodes, args));
    };
});


}, '3.3.0' ,{requires:['dom-base', 'selector-css2', 'event-base']});
YUI.add('node-style', function(Y) {

(function(Y) {
/**
 * Extended Node interface for managing node styles.
 * @module node
 * @submodule node-style
 */

var methods = [
    /**
     * Returns the style's current value.
     * @method getStyle
     * @for Node
     * @param {String} attr The style attribute to retrieve. 
     * @return {String} The current value of the style property for the element.
     */
    'getStyle',

    /**
     * Returns the computed value for the given style property.
     * @method getComputedStyle
     * @param {String} attr The style attribute to retrieve. 
     * @return {String} The computed value of the style property for the element.
     */
    'getComputedStyle',

    /**
     * Sets a style property of the node.
     * @method setStyle
     * @param {String} attr The style attribute to set. 
     * @param {String|Number} val The value. 
     * @chainable
     */
    'setStyle',

    /**
     * Sets multiple style properties on the node.
     * @method setStyles
     * @param {Object} hash An object literal of property:value pairs. 
     * @chainable
     */
    'setStyles'
];
Y.Node.importMethod(Y.DOM, methods);
/**
 * Returns an array of values for each node.
 * @method getStyle
 * @for NodeList
 * @see Node.getStyle
 * @param {String} attr The style attribute to retrieve. 
 * @return {Array} The current values of the style property for the element.
 */

/**
 * Returns an array of the computed value for each node.
 * @method getComputedStyle
 * @see Node.getComputedStyle
 * @param {String} attr The style attribute to retrieve. 
 * @return {Array} The computed values for each node.
 */

/**
 * Sets a style property on each node.
 * @method setStyle
 * @see Node.setStyle
 * @param {String} attr The style attribute to set. 
 * @param {String|Number} val The value. 
 * @chainable
 */

/**
 * Sets multiple style properties on each node.
 * @method setStyles
 * @see Node.setStyles
 * @param {Object} hash An object literal of property:value pairs. 
 * @chainable
 */
Y.NodeList.importMethod(Y.Node.prototype, methods);
})(Y);


}, '3.3.0' ,{requires:['dom-style', 'node-base']});
YUI.add('node-screen', function(Y) {

/**
 * Extended Node interface for managing regions and screen positioning.
 * Adds support for positioning elements and normalizes window size and scroll detection. 
 * @module node
 * @submodule node-screen
 */

// these are all "safe" returns, no wrapping required
Y.each([
    /**
     * Returns the inner width of the viewport (exludes scrollbar). 
     * @config winWidth
     * @for Node
     * @type {Int}
     */
    'winWidth',

    /**
     * Returns the inner height of the viewport (exludes scrollbar). 
     * @config winHeight
     * @type {Int}
     */
    'winHeight',

    /**
     * Document width 
     * @config winHeight
     * @type {Int}
     */
    'docWidth',

    /**
     * Document height 
     * @config docHeight
     * @type {Int}
     */
    'docHeight',

    /**
     * Amount page has been scroll vertically 
     * @config docScrollX
     * @type {Int}
     */
    'docScrollX',

    /**
     * Amount page has been scroll horizontally 
     * @config docScrollY
     * @type {Int}
     */
    'docScrollY'
    ],
    function(name) {
        Y.Node.ATTRS[name] = {
            getter: function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(Y.Node.getDOMNode(this));

                return Y.DOM[name].apply(this, args);
            }
        };
    }
);

Y.Node.ATTRS.scrollLeft = {
    getter: function() {
        var node = Y.Node.getDOMNode(this);
        return ('scrollLeft' in node) ? node.scrollLeft : Y.DOM.docScrollX(node);
    },

    setter: function(val) {
        var node = Y.Node.getDOMNode(this);
        if (node) {
            if ('scrollLeft' in node) {
                node.scrollLeft = val;
            } else if (node.document || node.nodeType === 9) {
                Y.DOM._getWin(node).scrollTo(val, Y.DOM.docScrollY(node)); // scroll window if win or doc
            }
        } else {
        }
    }
};

Y.Node.ATTRS.scrollTop = {
    getter: function() {
        var node = Y.Node.getDOMNode(this);
        return ('scrollTop' in node) ? node.scrollTop : Y.DOM.docScrollY(node);
    },

    setter: function(val) {
        var node = Y.Node.getDOMNode(this);
        if (node) {
            if ('scrollTop' in node) {
                node.scrollTop = val;
            } else if (node.document || node.nodeType === 9) {
                Y.DOM._getWin(node).scrollTo(Y.DOM.docScrollX(node), val); // scroll window if win or doc
            }
        } else {
        }
    }
};

Y.Node.importMethod(Y.DOM, [
/**
 * Gets the current position of the node in page coordinates. 
 * @method getXY
 * @for Node
 * @return {Array} The XY position of the node
*/
    'getXY',

/**
 * Set the position of the node in page coordinates, regardless of how the node is positioned.
 * @method setXY
 * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
 * @chainable
 */
    'setXY',

/**
 * Gets the current position of the node in page coordinates. 
 * @method getX
 * @return {Int} The X position of the node
*/
    'getX',

/**
 * Set the position of the node in page coordinates, regardless of how the node is positioned.
 * @method setX
 * @param {Int} x X value for new position (coordinates are page-based)
 * @chainable
 */
    'setX',

/**
 * Gets the current position of the node in page coordinates. 
 * @method getY
 * @return {Int} The Y position of the node
*/
    'getY',

/**
 * Set the position of the node in page coordinates, regardless of how the node is positioned.
 * @method setY
 * @param {Int} y Y value for new position (coordinates are page-based)
 * @chainable
 */
    'setY',

/**
 * Swaps the XY position of this node with another node. 
 * @method swapXY
 * @param {Y.Node || HTMLElement} otherNode The node to swap with.
 * @chainable
 */
    'swapXY'
]);

/**
 * Returns a region object for the node
 * @config region
 * @for Node
 * @type Node
 */
Y.Node.ATTRS.region = {
    getter: function() {
        var node = Y.Node.getDOMNode(this),
            region;

        if (node && !node.tagName) {
            if (node.nodeType === 9) { // document
                node = node.documentElement;
            }
        }
        if (node.alert) {
            region = Y.DOM.viewportRegion(node);
        } else {
            region = Y.DOM.region(node);
        }
        return region;
    }
};

/**
 * Returns a region object for the node's viewport
 * @config viewportRegion
 * @type Node
 */
Y.Node.ATTRS.viewportRegion = {
    getter: function() {
        return Y.DOM.viewportRegion(Y.Node.getDOMNode(this));
    }
};

Y.Node.importMethod(Y.DOM, 'inViewportRegion');

// these need special treatment to extract 2nd node arg
/**
 * Compares the intersection of the node with another node or region
 * @method intersect
 * @for Node
 * @param {Node|Object} node2 The node or region to compare with.
 * @param {Object} altRegion An alternate region to use (rather than this node's).
 * @return {Object} An object representing the intersection of the regions.
 */
Y.Node.prototype.intersect = function(node2, altRegion) {
    var node1 = Y.Node.getDOMNode(this);
    if (Y.instanceOf(node2, Y.Node)) { // might be a region object
        node2 = Y.Node.getDOMNode(node2);
    }
    return Y.DOM.intersect(node1, node2, altRegion);
};

/**
 * Determines whether or not the node is within the giving region.
 * @method inRegion
 * @param {Node|Object} node2 The node or region to compare with.
 * @param {Boolean} all Whether or not all of the node must be in the region.
 * @param {Object} altRegion An alternate region to use (rather than this node's).
 * @return {Object} An object representing the intersection of the regions.
 */
Y.Node.prototype.inRegion = function(node2, all, altRegion) {
    var node1 = Y.Node.getDOMNode(this);
    if (Y.instanceOf(node2, Y.Node)) { // might be a region object
        node2 = Y.Node.getDOMNode(node2);
    }
    return Y.DOM.inRegion(node1, node2, all, altRegion);
};


}, '3.3.0' ,{requires:['dom-screen']});
YUI.add('node-pluginhost', function(Y) {

/**
 * Registers plugins to be instantiated at the class level (plugins 
 * which should be plugged into every instance of Node by default).
 *
 * @method Node.plug
 * @static
 *
 * @param {Function | Array} plugin Either the plugin class, an array of plugin classes or an array of objects (with fn and cfg properties defined)
 * @param {Object} config (Optional) If plugin is the plugin class, the configuration for the plugin
 */
Y.Node.plug = function() {
    var args = Y.Array(arguments);
    args.unshift(Y.Node);
    Y.Plugin.Host.plug.apply(Y.Base, args);
    return Y.Node;
};

/**
 * Unregisters any class level plugins which have been registered by the Node
 *
 * @method Node.unplug
 * @static
 *
 * @param {Function | Array} plugin The plugin class, or an array of plugin classes
 */
Y.Node.unplug = function() {
    var args = Y.Array(arguments);
    args.unshift(Y.Node);
    Y.Plugin.Host.unplug.apply(Y.Base, args);
    return Y.Node;
};

Y.mix(Y.Node, Y.Plugin.Host, false, null, 1);

// allow batching of plug/unplug via NodeList
// doesn't use NodeList.importMethod because we need real Nodes (not tmpNode)
Y.NodeList.prototype.plug = function() {
    var args = arguments;
    Y.NodeList.each(this, function(node) {
        Y.Node.prototype.plug.apply(Y.one(node), args);
    });
};

Y.NodeList.prototype.unplug = function() {
    var args = arguments;
    Y.NodeList.each(this, function(node) {
        Y.Node.prototype.unplug.apply(Y.one(node), args);
    });
};


}, '3.3.0' ,{requires:['node-base', 'pluginhost']});
YUI.add('node-event-delegate', function(Y) {

/**
 * Functionality to make the node a delegated event container
 * @module node
 * @submodule node-event-delegate
 */

/**
 * <p>Sets up a delegation listener for an event occurring inside the Node.
 * The delegated event will be verified against a supplied selector or
 * filtering function to test if the event references at least one node that
 * should trigger the subscription callback.</p>
 *
 * <p>Selector string filters will trigger the callback if the event originated
 * from a node that matches it or is contained in a node that matches it.
 * Function filters are called for each Node up the parent axis to the
 * subscribing container node, and receive at each level the Node and the event
 * object.  The function should return true (or a truthy value) if that Node
 * should trigger the subscription callback.  Note, it is possible for filters
 * to match multiple Nodes for a single event.  In this case, the delegate
 * callback will be executed for each matching Node.</p>
 *
 * <p>For each matching Node, the callback will be executed with its 'this'
 * object set to the Node matched by the filter (unless a specific context was
 * provided during subscription), and the provided event's
 * <code>currentTarget</code> will also be set to the matching Node.  The
 * containing Node from which the subscription was originally made can be
 * referenced as <code>e.container</code>.
 *
 * @method delegate
 * @param type {String} the event type to delegate
 * @param fn {Function} the callback function to execute.  This function
 *              will be provided the event object for the delegated event.
 * @param spec {String|Function} a selector that must match the target of the
 *              event or a function to test target and its parents for a match
 * @param context {Object} optional argument that specifies what 'this' refers to.
 * @param args* {any} 0..n additional arguments to pass on to the callback function.
 *              These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for Node
 */
Y.Node.prototype.delegate = function(type) {

    var args = Y.Array(arguments, 0, true),
        index = (Y.Lang.isObject(type) && !Y.Lang.isArray(type)) ? 1 : 2;

    args.splice(index, 0, this._node);

    return Y.delegate.apply(Y, args);
};


}, '3.3.0' ,{requires:['node-base', 'event-delegate']});


YUI.add('node', function(Y){}, '3.3.0' ,{requires:['dom', 'event-base', 'event-delegate', 'pluginhost'], use:['node-base', 'node-style', 'node-screen', 'node-pluginhost', 'node-event-delegate'], skinnable:false});

/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('cookie', function(Y) {

/**
 * Utilities for cookie management
 * @module cookie
 */

    //shortcuts
    var L       = Y.Lang,
        O       = Y.Object,
        NULL    = null,
        
        //shortcuts to functions
        isString    = L.isString,
        isObject    = L.isObject,
        isUndefined = L.isUndefined,
        isFunction  = L.isFunction,
        encode      = encodeURIComponent,
        decode      = decodeURIComponent,
        
        //shortcut to document
        doc         = Y.config.doc;
        
    /*
     * Throws an error message.
     */
    function error(message){
        throw new TypeError(message);
    }        
    
    /*
     * Checks the validity of a cookie name.
     */
    function validateCookieName(name){
        if (!isString(name) || name === ""){
            error("Cookie name must be a non-empty string.");
        }               
    }
    
    /*
     * Checks the validity of a subcookie name.
     */    
    function validateSubcookieName(subName){
        if (!isString(subName) || subName === ""){
            error("Subcookie name must be a non-empty string.");
        }    
    }
    
    /**
     * Cookie utility.
     * @class Cookie
     * @static
     */
    Y.Cookie = {
                    
        //-------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------
        
        /**
         * Creates a cookie string that can be assigned into document.cookie.
         * @param {String} name The name of the cookie.
         * @param {String} value The value of the cookie.
         * @param {Boolean} encodeValue True to encode the value, false to leave as-is.
         * @param {Object} options (Optional) Options for the cookie.
         * @return {String} The formatted cookie string.
         * @method _createCookieString
         * @private
         * @static
         */
        _createCookieString : function (name /*:String*/, value /*:Variant*/, encodeValue /*:Boolean*/, options /*:Object*/) /*:String*/ {
        
            options = options || {};
            
            var text /*:String*/ = encode(name) + "=" + (encodeValue ? encode(value) : value),
                expires = options.expires,
                path    = options.path,
                domain  = options.domain;
            
        
            if (isObject(options)){
                //expiration date
                if (expires instanceof Date){
                    text += "; expires=" + expires.toUTCString();
                }
            
                //path
                if (isString(path) && path !== ""){
                    text += "; path=" + path;
                }
        
                //domain
                if (isString(domain) && domain !== ""){
                    text += "; domain=" + domain;
                }
                
                //secure
                if (options.secure === true){
                    text += "; secure";
                }
            }
            
            return text;
        },
        
        /**
         * Formats a cookie value for an object containing multiple values.
         * @param {Object} hash An object of key-value pairs to create a string for.
         * @return {String} A string suitable for use as a cookie value.
         * @method _createCookieHashString
         * @private
         * @static
         */
        _createCookieHashString : function (hash /*:Object*/) /*:String*/ {
            if (!isObject(hash)){
                error("Cookie._createCookieHashString(): Argument must be an object.");
            }
            
            var text /*:Array*/ = [];

            O.each(hash, function(value, key){
                if (!isFunction(value) && !isUndefined(value)){
                    text.push(encode(key) + "=" + encode(String(value)));
                }            
            });
            
            return text.join("&");
        },
        
        /**
         * Parses a cookie hash string into an object.
         * @param {String} text The cookie hash string to parse (format: n1=v1&n2=v2).
         * @return {Object} An object containing entries for each cookie value.
         * @method _parseCookieHash
         * @private
         * @static
         */
        _parseCookieHash : function (text) {
        
            var hashParts   = text.split("&"),
                hashPart    = NULL,
                hash        = {};
            
            if (text.length){
                for (var i=0, len=hashParts.length; i < len; i++){
                    hashPart = hashParts[i].split("=");
                    hash[decode(hashPart[0])] = decode(hashPart[1]);
                }
            }
            
            return hash;          
        },
        
        /**
         * Parses a cookie string into an object representing all accessible cookies.
         * @param {String} text The cookie string to parse.
         * @param {Boolean} shouldDecode (Optional) Indicates if the cookie values should be decoded or not. Default is true.
         * @return {Object} An object containing entries for each accessible cookie.
         * @method _parseCookieString
         * @private
         * @static
         */
        _parseCookieString : function (text /*:String*/, shouldDecode /*:Boolean*/) /*:Object*/ {
        
            var cookies /*:Object*/ = {};        
            
            if (isString(text) && text.length > 0) {
            
                var decodeValue = (shouldDecode === false ? function(s){return s;} : decode),  
                    cookieParts = text.split(/;\s/g),
                    cookieName  = NULL,
                    cookieValue = NULL,
                    cookieNameValue = NULL;
                
                for (var i=0, len=cookieParts.length; i < len; i++){
                
                    //check for normally-formatted cookie (name-value)
                    cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                    if (cookieNameValue instanceof Array){
                        try {
                            cookieName = decode(cookieNameValue[1]);
                            cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length+1));
                        } catch (ex){
                            //intentionally ignore the cookie - the encoding is wrong
                        }
                    } else {
                        //means the cookie does not have an "=", so treat it as a boolean flag
                        cookieName = decode(cookieParts[i]);
                        cookieValue = "";
                    }
                    cookies[cookieName] = cookieValue;
                }

            }
            
            return cookies;
        },    
        
        /**
         * Sets the document object that the cookie utility uses for setting
         * cookies. This method is necessary to ensure that the cookie utility
         * unit tests can pass even when run on a domain instead of locally.
         * This method should not be used otherwise; you should use 
         * <code>Y.config.doc</code> to change the document that the cookie
         * utility uses for everyday purposes.
         * @param {Object} newDoc The object to use as the document.
         * @return {void}
         * @method _setDoc
         * @private
         */         
        _setDoc: function(newDoc){
            doc = newDoc;
        },
        
        //-------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------
    
        /**
         * Determines if the cookie with the given name exists. This is useful for
         * Boolean cookies (those that do not follow the name=value convention).
         * @param {String} name The name of the cookie to check.
         * @return {Boolean} True if the cookie exists, false if not.
         * @method exists
         * @static
         */
        exists: function(name) {
    
            validateCookieName(name);   //throws error
    
            var cookies = this._parseCookieString(doc.cookie, true);
            
            return cookies.hasOwnProperty(name);
        },    
        
        /**
         * Returns the cookie value for the given name.
         * @param {String} name The name of the cookie to retrieve.
         * @param {Function|Object} options (Optional) An object containing one or more
         *      cookie options: raw (true/false) and converter (a function).
         *      The converter function is run on the value before returning it. The
         *      function is not used if the cookie doesn't exist. The function can be
         *      passed instead of the options object for backwards compatibility. When
         *      raw is set to true, the cookie value is not URI decoded.
         * @return {Variant} If no converter is specified, returns a string or null if
         *      the cookie doesn't exist. If the converter is specified, returns the value
         *      returned from the converter or null if the cookie doesn't exist.
         * @method get
         * @static
         */
        get : function (name, options) {
            
            validateCookieName(name);   //throws error                        
            
            var cookies,
                cookie,
                converter;
                
            //if options is a function, then it's the converter
            if (isFunction(options)) {
                converter = options;
                options = {};
            } else if (isObject(options)) {
                converter = options.converter;
            } else {
                options = {};
            }
            
            cookies = this._parseCookieString(doc.cookie, !options.raw);
            cookie = cookies[name];
            
            //should return null, not undefined if the cookie doesn't exist
            if (isUndefined(cookie)) {
                return NULL;
            }
            
            if (!isFunction(converter)){
                return cookie;
            } else {
                return converter(cookie);
            }
        },
        
        /**
         * Returns the value of a subcookie.
         * @param {String} name The name of the cookie to retrieve.
         * @param {String} subName The name of the subcookie to retrieve.
         * @param {Function} converter (Optional) A function to run on the value before returning
         *      it. The function is not used if the cookie doesn't exist.
         * @return {Variant} If the cookie doesn't exist, null is returned. If the subcookie
         *      doesn't exist, null if also returned. If no converter is specified and the
         *      subcookie exists, a string is returned. If a converter is specified and the
         *      subcookie exists, the value returned from the converter is returned.
         * @method getSub
         * @static
         */
        getSub : function (name /*:String*/, subName /*:String*/, converter /*:Function*/) /*:Variant*/ {
          
            var hash /*:Variant*/ = this.getSubs(name);  
    
            if (hash !== NULL) {
                
                validateSubcookieName(subName);   //throws error
                
                if (isUndefined(hash[subName])){
                    return NULL;
                }            
            
                if (!isFunction(converter)){
                    return hash[subName];
                } else {
                    return converter(hash[subName]);
                }
            } else {
                return NULL;
            }
        
        },
        
        /**
         * Returns an object containing name-value pairs stored in the cookie with the given name.
         * @param {String} name The name of the cookie to retrieve.
         * @return {Object} An object of name-value pairs if the cookie with the given name
         *      exists, null if it does not.
         * @method getSubs
         * @static
         */
        getSubs : function (name) {
            
            validateCookieName(name);   //throws error
            
            var cookies = this._parseCookieString(doc.cookie, false);
            if (isString(cookies[name])){
                return this._parseCookieHash(cookies[name]);
            }
            return NULL;
        },
        
        /**
         * Removes a cookie from the machine by setting its expiration date to
         * sometime in the past.
         * @param {String} name The name of the cookie to remove.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), 
         *      and secure (true/false). The expires option will be overwritten
         *      by the method.
         * @return {String} The created cookie string.
         * @method remove
         * @static
         */
        remove : function (name, options) {
            
            validateCookieName(name);   //throws error
            
            //set options
            options = Y.merge(options || {}, {
                expires: new Date(0)
            });
            
            //set cookie
            return this.set(name, "", options);
        },
    
        /**
         * Removes a sub cookie with a given name.
         * @param {String} name The name of the cookie in which the subcookie exists.
         * @param {String} subName The name of the subcookie to remove.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a Date object),
         *      removeIfEmpty (true/false), and secure (true/false). This must be the same
         *      settings as the original subcookie.
         * @return {String} The created cookie string.
         * @method removeSub
         * @static
         */
        removeSub : function(name, subName, options) {
        
            validateCookieName(name);   //throws error
            
            validateSubcookieName(subName);   //throws error
            
            options = options || {};
            
            //get all subcookies for this cookie
            var subs = this.getSubs(name);
            
            //delete the indicated subcookie
            if (isObject(subs) && subs.hasOwnProperty(subName)){
                delete subs[subName];
                
                if (!options.removeIfEmpty) {
                    //reset the cookie
    
                    return this.setSubs(name, subs, options);
                } else {
                    //reset the cookie if there are subcookies left, else remove
                    for (var key in subs){
                        if (subs.hasOwnProperty(key) && !isFunction(subs[key]) && !isUndefined(subs[key])){
                            return this.setSubs(name, subs, options);
                        }
                    }
                    
                    return this.remove(name, options);
                }                
            } else {
                return "";
            }
            
        },
    
        /**
         * Sets a cookie with a given name and value.
         * @param {String} name The name of the cookie to set.
         * @param {Variant} value The value to set for the cookie.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a Date object),
         *      secure (true/false), and raw (true/false). Setting raw to true indicates
         *      that the cookie should not be URI encoded before being set.
         * @return {String} The created cookie string.
         * @method set
         * @static
         */
        set : function (name, value, options) {
        
            validateCookieName(name);   //throws error
            
            if (isUndefined(value)){
                error("Cookie.set(): Value cannot be undefined.");
            }
            
            options = options || {};
        
            var text = this._createCookieString(name, value, !options.raw, options);
            doc.cookie = text;
            return text;
        },
            
        /**
         * Sets a sub cookie with a given name to a particular value.
         * @param {String} name The name of the cookie to set.
         * @param {String} subName The name of the subcookie to set.
         * @param {Variant} value The value to set.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a Date object),
         *      and secure (true/false).
         * @return {String} The created cookie string.
         * @method setSub
         * @static
         */
        setSub : function (name, subName, value, options) {

            validateCookieName(name);   //throws error
    
            validateSubcookieName(subName);   //throws error
            
            if (isUndefined(value)){
                error("Cookie.setSub(): Subcookie value cannot be undefined.");
            }
    
            var hash = this.getSubs(name);
            
            if (!isObject(hash)){
                hash = {};
            }
            
            hash[subName] = value;        
            
            return this.setSubs(name, hash, options);
            
        },
        
        /**
         * Sets a cookie with a given name to contain a hash of name-value pairs.
         * @param {String} name The name of the cookie to set.
         * @param {Object} value An object containing name-value pairs.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a Date object),
         *      and secure (true/false).
         * @return {String} The created cookie string.
         * @method setSubs
         * @static
         */
        setSubs : function (name, value, options) {
            
            validateCookieName(name);   //throws error
            
            if (!isObject(value)){
                error("Cookie.setSubs(): Cookie value must be an object.");
            }
        
            var text /*:String*/ = this._createCookieString(name, this._createCookieHashString(value), false, options);
            doc.cookie = text;
            return text;        
        }     
    
    };



}, '3.3.0' ,{requires:['yui-base']});
YUI.namespace('Y.Modernizr');
YUI.add('trip-modernizr' , function(Y){
/*!  
 * Modernizr JavaScript library 1.2
 * http://modernizr.com/
 *
 * Copyright (c) 2009-2010 Faruk Ates - http://farukat.es/
 * Dual-licensed under the BSD and MIT licenses.
 * http://modernizr.com/license/
 * 
 * Featuring major contributions by
 * Paul Irish  - http://paulirish.com
 */
/*
 * Modernizr is a script that will detect native CSS3 and HTML5 features
 * available in the current UA and provide an object containing all
 * features with a true/false value, depending on whether the UA has
 * native support for it or not.
 *
 * In addition to that, Modernizr will add classes to the <html>
 * element of the page, one for each cutting-edge feature. If the UA
 * supports it, a class like "cssgradients" will be added. If not,
 * the class name will be "no-cssgradients". This allows for simple
 * if-conditionals in CSS styling, making it easily to have fine
 * control over the look and feel of your website.
 *
 * @author        Faruk Ates
 * @copyright     (c) 2009-2010 Faruk Ates.
 *
 * @contributor   Paul Irish
 * @contributor   Ben Alman
 */

	Y.Modernizr = {
		input : {}
	};
	if( "placeholder" in document.createElement("input")){
         Y.Modernizr.input.placeholder = true ;
    }else{
		 Y.Modernizr.input.placeholder = false ;
	}
},'',{requires:['node-base']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('json-parse', function(Y) {

/**
 * <p>The JSON module adds support for serializing JavaScript objects into
 * JSON strings and parsing JavaScript objects from strings in JSON format.</p>
 *
 * <p>The JSON namespace is added to your YUI instance including static methods
 * Y.JSON.parse(..) and Y.JSON.stringify(..).</p>
 *
 * <p>The functionality and method signatures follow the ECMAScript 5
 * specification.  In browsers with native JSON support, the native
 * implementation is used.</p>
 *
 * <p>The <code>json</code> module is a rollup of <code>json-parse</code> and
 * <code>json-stringify</code>.</p>
 * 
 * <p>As their names suggest, <code>json-parse</code> adds support for parsing
 * JSON data (Y.JSON.parse) and <code>json-stringify</code> for serializing
 * JavaScript data into JSON strings (Y.JSON.stringify).  You may choose to
 * include either of the submodules individually if you don't need the
 * complementary functionality, or include the rollup for both.</p>
 *
 * @module json
 * @class JSON
 * @static
 */

/**
 * Provides Y.JSON.parse method to accept JSON strings and return native
 * JavaScript objects.
 *
 * @module json
 * @submodule json-parse
 * @for JSON
 * @static
 */


// All internals kept private for security reasons
function fromGlobal(ref) {
    return (Y.config.win || this || {})[ref];
}


    /**
     * Alias to native browser implementation of the JSON object if available.
     *
     * @property Native
     * @type {Object}
     * @private
     */
var _JSON  = fromGlobal('JSON'),
    // Create an indirect reference to eval to allow for minification
    _eval  = fromGlobal('eval'),
    Native = (Object.prototype.toString.call(_JSON) === '[object JSON]' && _JSON),
    useNative = !!Native,

    /**
     * Replace certain Unicode characters that JavaScript may handle incorrectly
     * during eval--either by deleting them or treating them as line
     * endings--with escape sequences.
     * IMPORTANT NOTE: This regex will be used to modify the input if a match is
     * found.
     *
     * @property _UNICODE_EXCEPTIONS
     * @type {RegExp}
     * @private
     */
    _UNICODE_EXCEPTIONS = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,


    /**
     * First step in the safety evaluation.  Regex used to replace all escape
     * sequences (i.e. "\\", etc) with '@' characters (a non-JSON character).
     *
     * @property _ESCAPES
     * @type {RegExp}
     * @private
     */
    _ESCAPES = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,

    /**
     * Second step in the safety evaluation.  Regex used to replace all simple
     * values with ']' characters.
     *
     * @property _VALUES
     * @type {RegExp}
     * @private
     */
    _VALUES  = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,

    /**
     * Third step in the safety evaluation.  Regex used to remove all open
     * square brackets following a colon, comma, or at the beginning of the
     * string.
     *
     * @property _BRACKETS
     * @type {RegExp}
     * @private
     */
    _BRACKETS = /(?:^|:|,)(?:\s*\[)+/g,

    /**
     * Final step in the safety evaluation.  Regex used to test the string left
     * after all previous replacements for invalid characters.
     *
     * @property _UNSAFE
     * @type {RegExp}
     * @private
     */
    _UNSAFE = /[^\],:{}\s]/,
    
    /**
     * Replaces specific unicode characters with their appropriate \unnnn
     * format. Some browsers ignore certain characters during eval.
     *
     * @method escapeException
     * @param c {String} Unicode character
     * @return {String} the \unnnn escapement of the character
     * @private
     */
    _escapeException = function (c) {
        return '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
    },

    /**
     * Traverses nested objects, applying a reviver function to each (key,value)
     * from the scope if the key:value's containing object.  The value returned
     * from the function will replace the original value in the key:value pair.
     * If the value returned is undefined, the key will be omitted from the
     * returned object.
     *
     * @method _revive
     * @param data {MIXED} Any JavaScript data
     * @param reviver {Function} filter or mutation function
     * @return {MIXED} The results of the filtered data
     * @private
     */
    _revive = function (data, reviver) {
        var walk = function (o,key) {
            var k,v,value = o[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (value.hasOwnProperty(k)) {
                        v = walk(value, k);
                        if (v === undefined) {
                            delete value[k];
                        } else {
                            value[k] = v;
                        }
                    }
                }
            }
            return reviver.call(o,key,value);
        };

        return typeof reviver === 'function' ? walk({'':data},'') : data;
    },

    /**
     * Parse a JSON string, returning the native JavaScript representation.
     *
     * @param s {string} JSON string data
     * @param reviver {function} (optional) function(k,v) passed each key value
     *          pair of object literals, allowing pruning or altering values
     * @return {MIXED} the native JavaScript representation of the JSON string
     * @throws SyntaxError
     * @method parse
     * @static
     */
    // JavaScript implementation in lieu of native browser support.  Based on
    // the json2.js library from http://json.org
    _parse = function (s,reviver) {
        // Replace certain Unicode characters that are otherwise handled
        // incorrectly by some browser implementations.
        // NOTE: This modifies the input if such characters are found!
        s = s.replace(_UNICODE_EXCEPTIONS, _escapeException);
        
        // Test for any remaining invalid characters
        if (!_UNSAFE.test(s.replace(_ESCAPES,'@').
                            replace(_VALUES,']').
                            replace(_BRACKETS,''))) {

            // Eval the text into a JavaScript data structure, apply any
            // reviver function, and return
            return _revive( _eval('(' + s + ')'), reviver );
        }

        throw new SyntaxError('JSON.parse');
    };
    
Y.namespace('JSON').parse = function (s,reviver) {
        if (typeof s !== 'string') {
            s += '';
        }

        return Native && Y.JSON.useNativeParse ?
            Native.parse(s,reviver) : _parse(s,reviver);
};

function workingNative( k, v ) {
    return k === "ok" ? true : v;
}

// Double check basic functionality.  This is mainly to catch early broken
// implementations of the JSON API in Firefox 3.1 beta1 and beta2
if ( Native ) {
    try {
        useNative = ( Native.parse( '{"ok":false}', workingNative ) ).ok;
    }
    catch ( e ) {
        useNative = false;
    }
}

/**
 * Leverage native JSON parse if the browser has a native implementation.
 * In general, this is a good idea.  See the Known Issues section in the
 * JSON user guide for caveats.  The default value is true for browsers with
 * native JSON support.
 *
 * @property useNativeParse
 * @type Boolean
 * @default true
 * @static
 */
Y.JSON.useNativeParse = useNative;


}, '3.3.0' );
YUI.add('json-stringify', function(Y) {

/**
 * Provides Y.JSON.stringify method for converting objects to JSON strings.
 *
 * @module json
 * @submodule json-stringify
 * @for JSON
 * @static
 */
var _JSON     = (Y.config.win || {}).JSON,
    Lang      = Y.Lang,
    isFunction= Lang.isFunction,
    isObject  = Lang.isObject,
    isArray   = Lang.isArray,
    _toStr    = Object.prototype.toString,
    Native    = (_toStr.call(_JSON) === '[object JSON]' && _JSON),
    useNative = !!Native,
    UNDEFINED = 'undefined',
    OBJECT    = 'object',
    NULL      = 'null',
    STRING    = 'string',
    NUMBER    = 'number',
    BOOLEAN   = 'boolean',
    DATE      = 'date',
    _allowable= {
        'undefined'        : UNDEFINED,
        'string'           : STRING,
        '[object String]'  : STRING,
        'number'           : NUMBER,
        '[object Number]'  : NUMBER,
        'boolean'          : BOOLEAN,
        '[object Boolean]' : BOOLEAN,
        '[object Date]'    : DATE,
        '[object RegExp]'  : OBJECT
    },
    EMPTY     = '',
    OPEN_O    = '{',
    CLOSE_O   = '}',
    OPEN_A    = '[',
    CLOSE_A   = ']',
    COMMA     = ',',
    COMMA_CR  = ",\n",
    CR        = "\n",
    COLON     = ':',
    COLON_SP  = ': ',
    QUOTE     = '"',

    // Regex used to capture characters that need escaping before enclosing
    // their containing string in quotes.
    _SPECIAL_CHARS = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

    // Character substitution map for common escapes and special characters.
    _CHARS = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };


// Utility function used to determine how to serialize a variable.
function _type(o) {
    var t = typeof o;
    return  _allowable[t] ||              // number, string, boolean, undefined
            _allowable[_toStr.call(o)] || // Number, String, Boolean, Date
            (t === OBJECT ?
                (o ? OBJECT : NULL) :     // object, array, null, misc natives
                UNDEFINED);               // function, unknown
}

// Escapes a special character to a safe Unicode representation
function _char(c) {
    if (!_CHARS[c]) {
        _CHARS[c] =  '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
    }
    return _CHARS[c];
}

// Enclose escaped strings in quotes
function _string(s) {
    return QUOTE + s.replace(_SPECIAL_CHARS, _char) + QUOTE;
}

// Adds the provided space to the beginning of every line in the input string
function _indent(s,space) {
    return s.replace(/^/gm, space);
}

// JavaScript implementation of stringify (see API declaration of stringify)
function _stringify(o,w,space) {
    if (o === undefined) {
        return undefined;
    }

    var replacer = isFunction(w) ? w : null,
        format   = _toStr.call(space).match(/String|Number/) || [],
        _date    = Y.JSON.dateToString,
        stack    = [],
        tmp,i,len;

    if (replacer || !isArray(w)) {
        w = undefined;
    }

    // Ensure whitelist keys are unique (bug 2110391)
    if (w) {
        tmp = {};
        for (i = 0, len = w.length; i < len; ++i) {
            tmp[w[i]] = true;
        }
        w = tmp;
    }

    // Per the spec, strings are truncated to 10 characters and numbers
    // are converted to that number of spaces (max 10)
    space = format[0] === 'Number' ?
                new Array(Math.min(Math.max(0,space),10)+1).join(" ") :
                (space || EMPTY).slice(0,10);

    function _serialize(h,key) {
        var value = h[key],
            t     = _type(value),
            a     = [],
            colon = space ? COLON_SP : COLON,
            arr, i, keys, k, v;

        // Per the ECMA 5 spec, toJSON is applied before the replacer is
        // called.  Also per the spec, Date.prototype.toJSON has been added, so
        // Date instances should be serialized prior to exposure to the
        // replacer.  I disagree with this decision, but the spec is the spec.
        if (isObject(value) && isFunction(value.toJSON)) {
            value = value.toJSON(key);
        } else if (t === DATE) {
            value = _date(value);
        }

        if (isFunction(replacer)) {
            value = replacer.call(h,key,value);
        }

        if (value !== h[key]) {
            t = _type(value);
        }

        switch (t) {
            case DATE    : // intentional fallthrough.  Pre-replacer Dates are
                           // serialized in the toJSON stage.  Dates here would
                           // have been produced by the replacer.
            case OBJECT  : break;
            case STRING  : return _string(value);
            case NUMBER  : return isFinite(value) ? value+EMPTY : NULL;
            case BOOLEAN : return value+EMPTY;
            case NULL    : return NULL;
            default      : return undefined;
        }

        // Check for cyclical references in nested objects
        for (i = stack.length - 1; i >= 0; --i) {
            if (stack[i] === value) {
                throw new Error("JSON.stringify. Cyclical reference");
            }
        }

        arr = isArray(value);

        // Add the object to the processing stack
        stack.push(value);

        if (arr) { // Array
            for (i = value.length - 1; i >= 0; --i) {
                a[i] = _serialize(value, i) || NULL;
            }
        } else {   // Object
            // If whitelist provided, take only those keys
            keys = w || value;
            i = 0;

            for (k in keys) {
                if (keys.hasOwnProperty(k)) {
                    v = _serialize(value, k);
                    if (v) {
                        a[i++] = _string(k) + colon + v;
                    }
                }
            }
        }

        // remove the array from the stack
        stack.pop();

        if (space && a.length) {
            return arr ?
                OPEN_A + CR + _indent(a.join(COMMA_CR), space) + CR + CLOSE_A :
                OPEN_O + CR + _indent(a.join(COMMA_CR), space) + CR + CLOSE_O;
        } else {
            return arr ?
                OPEN_A + a.join(COMMA) + CLOSE_A :
                OPEN_O + a.join(COMMA) + CLOSE_O;
        }
    }

    // process the input
    return _serialize({'':o},'');
}

// Double check basic native functionality.  This is primarily to catch broken
// early JSON API implementations in Firefox 3.1 beta1 and beta2.
if ( Native ) {
    try {
        useNative = ( '0' === Native.stringify(0) );
    } catch ( e ) {
        useNative = false;
    }
}

Y.mix(Y.namespace('JSON'),{
    /**
     * Leverage native JSON stringify if the browser has a native
     * implementation.  In general, this is a good idea.  See the Known Issues
     * section in the JSON user guide for caveats.  The default value is true
     * for browsers with native JSON support.
     *
     * @property JSON.useNativeStringify
     * @type Boolean
     * @default true
     * @static
     */
    useNativeStringify : useNative,

    /**
     * Serializes a Date instance as a UTC date string.  Used internally by
     * stringify.  Override this method if you need Dates serialized in a
     * different format.
     *
     * @method dateToString
     * @param d {Date} The Date to serialize
     * @return {String} stringified Date in UTC format YYYY-MM-DDTHH:mm:SSZ
     * @deprecated Use a replacer function
     * @static
     */
    dateToString : function (d) {
        function _zeroPad(v) {
            return v < 10 ? '0' + v : v;
        }

        return d.getUTCFullYear()           + '-' +
              _zeroPad(d.getUTCMonth() + 1) + '-' +
              _zeroPad(d.getUTCDate())      + 'T' +
              _zeroPad(d.getUTCHours())     + COLON +
              _zeroPad(d.getUTCMinutes())   + COLON +
              _zeroPad(d.getUTCSeconds())   + 'Z';
    },

    /**
     * <p>Converts an arbitrary value to a JSON string representation.</p>
     *
     * <p>Objects with cyclical references will trigger an exception.</p>
     *
     * <p>If a whitelist is provided, only matching object keys will be
     * included.  Alternately, a replacer function may be passed as the
     * second parameter.  This function is executed on every value in the
     * input, and its return value will be used in place of the original value.
     * This is useful to serialize specialized objects or class instances.</p>
     *
     * <p>If a positive integer or non-empty string is passed as the third
     * parameter, the output will be formatted with carriage returns and
     * indentation for readability.  If a String is passed (such as "\t") it
     * will be used once for each indentation level.  If a number is passed,
     * that number of spaces will be used.</p>
     *
     * @method stringify
     * @param o {MIXED} any arbitrary value to convert to JSON string
     * @param w {Array|Function} (optional) whitelist of acceptable object
     *                  keys to include, or a replacer function to modify the
     *                  raw value before serialization
     * @param ind {Number|String} (optional) indentation character or depth of
     *                  spaces to format the output.
     * @return {string} JSON string representation of the input
     * @static
     */
    stringify : function (o,w,ind) {
        return Native && Y.JSON.useNativeStringify ?
            Native.stringify(o,w,ind) : _stringify(o,w,ind);
    }
});


}, '3.3.0' );


YUI.add('json', function(Y){}, '3.3.0' ,{use:['json-parse', 'json-stringify']});

YUI.add('trip-storage-lite', function(Y) {
/**
 * Implements a persistent local key/value data store similar to HTML5's
 * localStorage. Should work in IE5+, Firefox 2+, Safari 3.1+, Chrome 4+, and
 * Opera 10.5+.
 *
 * @module gallery-storage-lite
 */

// -- Shorthand ----------------------------------------------------------------
var d           = Y.config.doc,
    w           = Y.config.win,
    JSON        = Y.JSON,
    StorageLite = Y.namespace('StorageLite'),

// -- Private Constants --------------------------------------------------------
DB_NAME           = 'yui_storage_lite',
DB_DISPLAYNAME    = 'YUI StorageLite data',
DB_MAXSIZE        = 1048576,
DB_VERSION        = '1.0',

EVT_READY         = 'ready',

MODE_NOOP         = 0,
MODE_HTML5        = 1,
MODE_GECKO        = 2,
MODE_DB           = 3,
MODE_USERDATA     = 4,

USERDATA_PATH     = 'yui_storage_lite',
USERDATA_NAME     = 'data',

// -- Private Variables --------------------------------------------------------
data = {},
storageDriver,
storageMode;

// -- Implementation -----------------------------------------------------------

// Determine the best available storage mode.
if (w.localStorage) {
    storageMode = MODE_HTML5;
} else if (w.globalStorage) {
    storageMode = MODE_GECKO;
} else if (w.openDatabase && navigator.userAgent.indexOf('Chrome') === -1) {
    storageMode = MODE_DB;
} else if (Y.UA.ie >= 5) {
    storageMode = MODE_USERDATA;
} else {
    storageMode = MODE_NOOP;
}

Y.StorageFullError = function (message) {
    Y.StorageFullError.superclass.constructor.call(message);

    this.name    = 'StorageFullError';
    this.message = message || 'Maximum storage capacity reached';

    if (Y.UA.ie) {
        this.description = this.message;
    }
};

Y.extend(Y.StorageFullError, Error);

/**
 * Provides a persistent local key/value data store similar to HTML5's
 * localStorage.
 *
 * @class StorageLite
 * @static
 */

// -- Public Events ------------------------------------------------------------
Y.augment(StorageLite, Y.EventTarget, true, null, {
    emitFacade : true,
    prefix     : 'storage-lite',
    preventable: false
});

/**
 * Fired when the storage interface is loaded and ready for use.
 *
 * @event storage-lite:ready
 */
StorageLite.publish(EVT_READY, {fireOnce: true});

Y.mix(StorageLite, {
    // -- Public Methods -------------------------------------------------------

    /**
     * Removes all items from the data store.
     *
     * @method clear
     */
    clear: function () {},

    /**
     * Returns the item with the specified key, or <code>null</code> if the item
     * was not found.
     *
     * @method getItem
     * @param {String} key
     * @param {bool} json (optional) <code>true</code> if the item is a JSON
     *     string and should be parsed before being returned
     * @return {Object|null} item or <code>null</code> if not found
     */
    getItem: function (key, json) { return null; },

    /**
     * Returns the number of items in the data store.
     *
     * @method length
     * @return {Number} number of items in the data store
     */
    length: function () { return 0; },

    /**
     * Removes the item with the specified key.
     *
     * @method removeItem
     * @param {String} key
     */
    removeItem: function (key) {},

    /**
     * Stores an item under the specified key. If the key already exists in the
     * data store, it will be replaced.
     *
     * @method setItem
     * @param {String} key
     * @param {Object} value
     * @param {bool} json (optional) <code>true</code> if the item should be
     *     serialized to a JSON string before being stored
     */
    setItem: function (key, value) {}

});

if (storageMode === MODE_HTML5 || storageMode === MODE_GECKO) {

    // Common methods shared by the HTML5 and Gecko implementations.
    Y.mix(StorageLite, {
        length: function () {
            return storageDriver.length;
        },

        removeItem: function (key) {
            storageDriver.removeItem(key);
        },

        setItem: function (key, value, json) {
            storageDriver.setItem(key, json ? JSON.stringify(value) : value);
        }
    }, true);

    if (storageMode === MODE_HTML5) {

        // HTML5 localStorage methods. Currently supported by IE8, Firefox 3.5+,
        // Safari 4+, Chrome 4+, and Opera 10.5+.
        storageDriver = w.localStorage;

        Y.mix(StorageLite, {
            clear: function () {
                storageDriver.clear();
            },

            getItem: function (key, json) {
                try {
                    return json ? JSON.parse(storageDriver.getItem(key)) :
                            storageDriver.getItem(key);
                } catch (ex) {
                    return null;
                }
            }
        }, true);

    } else if (storageMode === MODE_GECKO) {

        // Gecko globalStorage methods. Supported by Firefox 2 and 3.0.
        storageDriver = w.globalStorage[w.location.hostname];

        Y.mix(StorageLite, {
            clear: function () {
                for (var key in storageDriver) {
                    if (storageDriver.hasOwnProperty(key)) {
                        storageDriver.removeItem(key);
                        delete storageDriver[key];
                    }
                }
            },

            getItem: function (key, json) {
                try {
                    return json ? JSON.parse(storageDriver[key].value) :
                            storageDriver[key].value;
                } catch (ex) {
                    return null;
                }
            }
        }, true);

    }

    StorageLite.fire(EVT_READY);

} else if (storageMode === MODE_DB || storageMode === MODE_USERDATA) {

    // Common methods shared by the database and userdata implementations.
    Y.mix(StorageLite, {
        clear: function () {
            data = {};
            StorageLite._save();
        },

        getItem: function (key, json) {
            return data.hasOwnProperty(key) ? data[key] : null;
        },

        length: function () {
            var count = 0, key;

            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    count += 1;
                }
            }

            return count;
        },

        removeItem: function (key) {
            delete data[key];
            StorageLite._save();
        },

        setItem: function (key, value, json) {
            data[key] = value;
            StorageLite._save();
        }

    }, true);

    if (storageMode === MODE_DB) {

        // Database storage methods. Supported by Safari 3.1 and 3.2.
        storageDriver = w.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAYNAME, DB_MAXSIZE);

        Y.mix(StorageLite, {
            _save: function () {
                storageDriver.transaction(function (t) {
                    t.executeSql("REPLACE INTO " + DB_NAME + " (name, value) VALUES ('data', ?)", [JSON.stringify(data)]);
                });
            }
        }, true);

        storageDriver.transaction(function (t) {
            t.executeSql("CREATE TABLE IF NOT EXISTS " + DB_NAME + "(name TEXT PRIMARY KEY, value TEXT NOT NULL)");
            t.executeSql("SELECT value FROM " + DB_NAME + " WHERE name = 'data'", [], function (t, results) {
                if (results.rows.length) {
                    try {
                        data = JSON.parse(results.rows.item(0).value);
                    } catch (ex) {
                        data = {};
                    }
                }

                StorageLite.fire(EVT_READY);
            });
        });

    } else if (storageMode === MODE_USERDATA) {

        // userData storage methods. Supported by IE5, 6, and 7.
        storageDriver = d.createElement('span');
        storageDriver.addBehavior('#default#userData');

        Y.mix(StorageLite, {
            _save: function () {
                var _data = JSON.stringify(data);

                try {
                    storageDriver.setAttribute(USERDATA_NAME, _data);
                    storageDriver.save(USERDATA_PATH);
                } catch (ex) {
                    //throw new Y.StorageFullError();
                }
            }
        }, true);

        Y.on('domready', function () {
            d.body.appendChild(storageDriver);

            try {
				storageDriver.load(USERDATA_PATH);
                data = JSON.parse(storageDriver.getAttribute(USERDATA_NAME) || '{}');
            } catch (ex) {
                data = {};
            }

            StorageLite.fire(EVT_READY);
        });

    }

} else {

    // Fire the ready event for browsers that only support the noop mode.
    StorageLite.fire(EVT_READY);

}


}, 'gallery-2010.12.01-21-32' ,{requires:['event-base','event-custom','event-custom-complex','json']});/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('attribute-base', function(Y) {

    /**
     * The State class maintains state for a collection of named items, with 
     * a varying number of properties defined.
     *
     * It avoids the need to create a separate class for the item, and separate instances 
     * of these classes for each item, by storing the state in a 2 level hash table, 
     * improving performance when the number of items is likely to be large.
     *
     * @constructor
     * @class State
     */
    Y.State = function() { 
        /**
         * Hash of attributes
         * @property data
         */
        this.data = {};
    };

    Y.State.prototype = {

        /**
         * Adds a property to an item.
         *
         * @method add
         * @param name {String} The name of the item.
         * @param key {String} The name of the property.
         * @param val {Any} The value of the property.
         */
        add : function(name, key, val) {
            var d = this.data;
            d[key] = d[key] || {};
            d[key][name] = val;
        },

        /**
         * Adds multiple properties to an item.
         *
         * @method addAll
         * @param name {String} The name of the item.
         * @param o {Object} A hash of property/value pairs.
         */
        addAll: function(name, o) {
            var key;
            for (key in o) {
                if (o.hasOwnProperty(key)) {
                    this.add(name, key, o[key]);
                }
            }
        },

        /**
         * Removes a property from an item.
         *
         * @method remove
         * @param name {String} The name of the item.
         * @param key {String} The property to remove.
         */
        remove: function(name, key) {
            var d = this.data;
            if (d[key] && (name in d[key])) {
                delete d[key][name];
            }
        },

        /**
         * Removes multiple properties from an item, or remove the item completely.
         *
         * @method removeAll
         * @param name {String} The name of the item.
         * @param o {Object|Array} Collection of properties to delete. If not provided, the entire item is removed.
         */
        removeAll: function(name, o) {
            var d = this.data;

            Y.each(o || d, function(v, k) {
                if(Y.Lang.isString(k)) {
                    this.remove(name, k);
                } else {
                    this.remove(name, v);
                }
            }, this);
        },

        /**
         * For a given item, returns the value of the property requested, or undefined if not found.
         *
         * @method get
         * @param name {String} The name of the item
         * @param key {String} Optional. The property value to retrieve.
         * @return {Any} The value of the supplied property.
         */
        get: function(name, key) {
            var d = this.data;
            return (d[key] && name in d[key]) ?  d[key][name] : undefined;
        },

        /**
         * For the given item, returns a disposable object with all of the
         * item's property/value pairs.
         *
         * @method getAll
         * @param name {String} The name of the item
         * @return {Object} An object with property/value pairs for the item.
         */
        getAll : function(name) {
            var d = this.data, o;

            Y.each(d, function(v, k) {
                if (name in d[k]) {
                    o = o || {};
                    o[k] = v[name];
                }
            }, this);

            return o;
        }
    };
    /**
     * The attribute module provides an augmentable Attribute implementation, which 
     * adds configurable attributes and attribute change events to the class being 
     * augmented. It also provides a State class, which is used internally by Attribute,
     * but can also be used independently to provide a name/property/value data structure to
     * store state.
     *
     * @module attribute
     */

    /**
     * The attribute-base submodule provides core attribute handling support, with everything
     * aside from complex attribute handling in the provider's constructor.
     *
     * @module attribute
     * @submodule attribute-base
     */
    var O = Y.Object,
        Lang = Y.Lang,
        EventTarget = Y.EventTarget,

        DOT = ".",
        CHANGE = "Change",

        // Externally configurable props
        GETTER = "getter",
        SETTER = "setter",
        READ_ONLY = "readOnly",
        WRITE_ONCE = "writeOnce",
        INIT_ONLY = "initOnly",
        VALIDATOR = "validator",
        VALUE = "value",
        VALUE_FN = "valueFn",
        BROADCAST = "broadcast",
        LAZY_ADD = "lazyAdd",
        BYPASS_PROXY = "_bypassProxy",

        // Used for internal state management
        ADDED = "added",
        INITIALIZING = "initializing",
        INIT_VALUE = "initValue",
        PUBLISHED = "published",
        DEF_VALUE = "defaultValue",
        LAZY = "lazy",
        IS_LAZY_ADD = "isLazyAdd",

        INVALID_VALUE,

        MODIFIABLE = {};

        // Properties which can be changed after the attribute has been added.
        MODIFIABLE[READ_ONLY] = 1;
        MODIFIABLE[WRITE_ONCE] = 1;
        MODIFIABLE[GETTER] = 1;
        MODIFIABLE[BROADCAST] = 1;

    /**
     * <p>
     * Attribute provides configurable attribute support along with attribute change events. It is designed to be 
     * augmented on to a host class, and provides the host with the ability to configure attributes to store and retrieve state, 
     * along with attribute change events.
     * </p>
     * <p>For example, attributes added to the host can be configured:</p>
     * <ul>
     *     <li>As read only.</li>
     *     <li>As write once.</li>
     *     <li>With a setter function, which can be used to manipulate
     *     values passed to Attribute's <a href="#method_set">set</a> method, before they are stored.</li>
     *     <li>With a getter function, which can be used to manipulate stored values,
     *     before they are returned by Attribute's <a href="#method_get">get</a> method.</li>
     *     <li>With a validator function, to validate values before they are stored.</li>
     * </ul>
     *
     * <p>See the <a href="#method_addAttr">addAttr</a> method, for the complete set of configuration
     * options available for attributes</p>.
     *
     * <p><strong>NOTE:</strong> Most implementations will be better off extending the <a href="Base.html">Base</a> class, 
     * instead of augmenting Attribute directly. Base augments Attribute and will handle the initial configuration 
     * of attributes for derived classes, accounting for values passed into the constructor.</p>
     *
     * @class Attribute
     * @uses EventTarget
     */
    function Attribute() {

        var host = this, // help compression
            attrs = this.constructor.ATTRS,
            Base = Y.Base;

        // Perf tweak - avoid creating event literals if not required.
        host._ATTR_E_FACADE = {};

        EventTarget.call(host, {emitFacade:true});

        // _conf maintained for backwards compat
        host._conf = host._state = new Y.State();

        host._stateProxy = host._stateProxy || null;
        host._requireAddAttr = host._requireAddAttr || false;

        // ATTRS support for Node, which is not Base based
        if ( attrs && !(Base && Y.instanceOf(host, Base))) {
            host.addAttrs(this._protectAttrs(attrs));
        }
    }

    /**
     * <p>The value to return from an attribute setter in order to prevent the set from going through.</p>
     *
     * <p>You can return this value from your setter if you wish to combine validator and setter 
     * functionality into a single setter function, which either returns the massaged value to be stored or 
     * Attribute.INVALID_VALUE to prevent invalid values from being stored.</p>
     *
     * @property Attribute.INVALID_VALUE
     * @type Object
     * @static
     * @final
     */
    Attribute.INVALID_VALUE = {};
    INVALID_VALUE = Attribute.INVALID_VALUE;

    /**
     * The list of properties which can be configured for 
     * each attribute (e.g. setter, getter, writeOnce etc.).
     *
     * This property is used internally as a whitelist for faster
     * Y.mix operations.
     *
     * @property Attribute._ATTR_CFG
     * @type Array
     * @static
     * @protected
     */
    Attribute._ATTR_CFG = [SETTER, GETTER, VALIDATOR, VALUE, VALUE_FN, WRITE_ONCE, READ_ONLY, LAZY_ADD, BROADCAST, BYPASS_PROXY];

    Attribute.prototype = {
        /**
         * <p>
         * Adds an attribute with the provided configuration to the host object.
         * </p>
         * <p>
         * The config argument object supports the following properties:
         * </p>
         * 
         * <dl>
         *    <dt>value &#60;Any&#62;</dt>
         *    <dd>The initial value to set on the attribute</dd>
         *
         *    <dt>valueFn &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>A function, which will return the initial value to set on the attribute. This is useful
         *    for cases where the attribute configuration is defined statically, but needs to 
         *    reference the host instance ("this") to obtain an initial value. If both the value and valueFn properties are defined, 
         *    the value returned by the valueFn has precedence over the value property, unless it returns undefined, in which 
         *    case the value property is used.</p>
         *
         *    <p>valueFn can also be set to a string, representing the name of the instance method to be used to retrieve the value.</p>
         *    </dd>
         *
         *    <dt>readOnly &#60;boolean&#62;</dt>
         *    <dd>Whether or not the attribute is read only. Attributes having readOnly set to true
         *        cannot be modified by invoking the set method.</dd>
         *
         *    <dt>writeOnce &#60;boolean&#62; or &#60;string&#62;</dt>
         *    <dd>
         *        Whether or not the attribute is "write once". Attributes having writeOnce set to true, 
         *        can only have their values set once, be it through the default configuration, 
         *        constructor configuration arguments, or by invoking set.
         *        <p>The writeOnce attribute can also be set to the string "initOnly", in which case the attribute can only be set during initialization
         *        (when used with Base, this means it can only be set during construction)</p>
         *    </dd>
         *
         *    <dt>setter &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>The setter function used to massage or normalize the value passed to the set method for the attribute. 
         *    The value returned by the setter will be the final stored value. Returning
         *    <a href="#property_Attribute.INVALID_VALUE">Attribute.INVALID_VALUE</a>, from the setter will prevent
         *    the value from being stored.
         *    </p>
         *    
         *    <p>setter can also be set to a string, representing the name of the instance method to be used as the setter function.</p>
         *    </dd>
         *      
         *    <dt>getter &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>
         *    The getter function used to massage or normalize the value returned by the get method for the attribute.
         *    The value returned by the getter function is the value which will be returned to the user when they 
         *    invoke get.
         *    </p>
         *
         *    <p>getter can also be set to a string, representing the name of the instance method to be used as the getter function.</p>
         *    </dd>
         *
         *    <dt>validator &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>
         *    The validator function invoked prior to setting the stored value. Returning
         *    false from the validator function will prevent the value from being stored.
         *    </p>
         *    
         *    <p>validator can also be set to a string, representing the name of the instance method to be used as the validator function.</p>
         *    </dd>
         *    
         *    <dt>broadcast &#60;int&#62;</dt>
         *    <dd>If and how attribute change events for this attribute should be broadcast. See CustomEvent's <a href="CustomEvent.html#property_broadcast">broadcast</a> property for 
         *    valid values. By default attribute change events are not broadcast.</dd>
         *
         *    <dt>lazyAdd &#60;boolean&#62;</dt>
         *    <dd>Whether or not to delay initialization of the attribute until the first call to get/set it. 
         *    This flag can be used to over-ride lazy initialization on a per attribute basis, when adding multiple attributes through 
         *    the <a href="#method_addAttrs">addAttrs</a> method.</dd>
         *
         * </dl>
         *
         * <p>The setter, getter and validator are invoked with the value and name passed in as the first and second arguments, and with
         * the context ("this") set to the host object.</p>
         *
         * <p>Configuration properties outside of the list mentioned above are considered private properties used internally by attribute, and are not intended for public use.</p>
         * 
         * @method addAttr
         *
         * @param {String} name The name of the attribute.
         * @param {Object} config An object with attribute configuration property/value pairs, specifying the configuration for the attribute.
         *
         * <p>
         * <strong>NOTE:</strong> The configuration object is modified when adding an attribute, so if you need 
         * to protect the original values, you will need to merge the object.
         * </p>
         *
         * @param {boolean} lazy (optional) Whether or not to add this attribute lazily (on the first call to get/set). 
         *
         * @return {Object} A reference to the host object.
         *
         * @chainable
         */
        addAttr: function(name, config, lazy) {


            var host = this, // help compression
                state = host._state,
                value,
                hasValue;

            lazy = (LAZY_ADD in config) ? config[LAZY_ADD] : lazy;

            if (lazy && !host.attrAdded(name)) {
                state.add(name, LAZY, config || {});
                state.add(name, ADDED, true);
            } else {


                if (!host.attrAdded(name) || state.get(name, IS_LAZY_ADD)) {

                    config = config || {};

                    hasValue = (VALUE in config);


                    if(hasValue) {
                        // We'll go through set, don't want to set value in config directly
                        value = config.value;
                        delete config.value;
                    }

                    config.added = true;
                    config.initializing = true;

                    state.addAll(name, config);

                    if (hasValue) {
                        // Go through set, so that raw values get normalized/validated
                        host.set(name, value);
                    }

                    state.remove(name, INITIALIZING);
                }
            }

            return host;
        },

        /**
         * Checks if the given attribute has been added to the host
         *
         * @method attrAdded
         * @param {String} name The name of the attribute to check.
         * @return {boolean} true if an attribute with the given name has been added, false if it hasn't. This method will return true for lazily added attributes.
         */
        attrAdded: function(name) {
            return !!this._state.get(name, ADDED);
        },

        /**
         * Updates the configuration of an attribute which has already been added.
         * <p>
         * The properties which can be modified through this interface are limited
         * to the following subset of attributes, which can be safely modified
         * after a value has already been set on the attribute: readOnly, writeOnce, 
         * broadcast and getter.
         * </p>
         * @method modifyAttr
         * @param {String} name The name of the attribute whose configuration is to be updated.
         * @param {Object} config An object with configuration property/value pairs, specifying the configuration properties to modify.
         */
        modifyAttr: function(name, config) {
            var host = this, // help compression
                prop, state;

            if (host.attrAdded(name)) {

                if (host._isLazyAttr(name)) {
                    host._addLazyAttr(name);
                }

                state = host._state;
                for (prop in config) {
                    if (MODIFIABLE[prop] && config.hasOwnProperty(prop)) {
                        state.add(name, prop, config[prop]);

                        // If we reconfigured broadcast, need to republish
                        if (prop === BROADCAST) {
                            state.remove(name, PUBLISHED);
                        }
                    }
                }
            }

        },

        /**
         * Removes an attribute from the host object
         *
         * @method removeAttr
         * @param {String} name The name of the attribute to be removed.
         */
        removeAttr: function(name) {
            this._state.removeAll(name);
        },

        /**
         * Returns the current value of the attribute. If the attribute
         * has been configured with a 'getter' function, this method will delegate
         * to the 'getter' to obtain the value of the attribute.
         *
         * @method get
         *
         * @param {String} name The name of the attribute. If the value of the attribute is an Object, 
         * dot notation can be used to obtain the value of a property of the object (e.g. <code>get("x.y.z")</code>)
         *
         * @return {Any} The value of the attribute
         */
        get : function(name) {
            return this._getAttr(name);
        },

        /**
         * Checks whether or not the attribute is one which has been
         * added lazily and still requires initialization.
         *
         * @method _isLazyAttr
         * @private
         * @param {String} name The name of the attribute
         * @return {boolean} true if it's a lazily added attribute, false otherwise.
         */
        _isLazyAttr: function(name) {
            return this._state.get(name, LAZY);
        },

        /**
         * Finishes initializing an attribute which has been lazily added.
         *
         * @method _addLazyAttr
         * @private
         * @param {Object} name The name of the attribute
         */
        _addLazyAttr: function(name) {
            var state = this._state,
                lazyCfg = state.get(name, LAZY);

            state.add(name, IS_LAZY_ADD, true);
            state.remove(name, LAZY);
            this.addAttr(name, lazyCfg);
        },

        /**
         * Sets the value of an attribute.
         *
         * @method set
         * @chainable
         *
         * @param {String} name The name of the attribute. If the 
         * current value of the attribute is an Object, dot notation can be used
         * to set the value of a property within the object (e.g. <code>set("x.y.z", 5)</code>).
         *
         * @param {Any} value The value to set the attribute to.
         *
         * @param {Object} opts (Optional) Optional event data to be mixed into
         * the event facade passed to subscribers of the attribute's change event. This 
         * can be used as a flexible way to identify the source of a call to set, allowing 
         * the developer to distinguish between set called internally by the host, vs. 
         * set called externally by the application developer.
         *
         * @return {Object} A reference to the host object.
         */
        set : function(name, val, opts) {
            return this._setAttr(name, val, opts);
        },

        /**
         * Resets the attribute (or all attributes) to its initial value, as long as
         * the attribute is not readOnly, or writeOnce.
         *
         * @method reset
         * @param {String} name Optional. The name of the attribute to reset.  If omitted, all attributes are reset.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        reset : function(name) {
            var host = this,  // help compression
                added;

            if (name) {
                if (host._isLazyAttr(name)) {
                    host._addLazyAttr(name);
                }
                host.set(name, host._state.get(name, INIT_VALUE));
            } else {
                added = host._state.data.added;
                Y.each(added, function(v, n) {
                    host.reset(n);
                }, host);
            }
            return host;
        },

        /**
         * Allows setting of readOnly/writeOnce attributes. See <a href="#method_set">set</a> for argument details.
         *
         * @method _set
         * @protected
         * @chainable
         * 
         * @param {String} name The name of the attribute.
         * @param {Any} val The value to set the attribute to.
         * @param {Object} opts (Optional) Optional event data to be mixed into
         * the event facade passed to subscribers of the attribute's change event.
         * @return {Object} A reference to the host object.
         */
        _set : function(name, val, opts) {
            return this._setAttr(name, val, opts, true);
        },

        /**
         * Provides the common implementation for the public get method,
         * allowing Attribute hosts to over-ride either method.
         *
         * See <a href="#method_get">get</a> for argument details.
         *
         * @method _getAttr
         * @protected
         * @chainable
         *
         * @param {String} name The name of the attribute.
         * @return {Any} The value of the attribute.
         */
        _getAttr : function(name) {
            var host = this, // help compression
                fullName = name,
                state = host._state,
                path,
                getter,
                val,
                cfg;

            if (name.indexOf(DOT) !== -1) {
                path = name.split(DOT);
                name = path.shift();
            }

            // On Demand - Should be rare - handles out of order valueFn references
            if (host._tCfgs && host._tCfgs[name]) {
                cfg = {};
                cfg[name] = host._tCfgs[name];
                delete host._tCfgs[name];
                host._addAttrs(cfg, host._tVals);
            }

            // Lazy Init
            if (host._isLazyAttr(name)) {
                host._addLazyAttr(name);
            }

            val = host._getStateVal(name);
            getter = state.get(name, GETTER);

            if (getter && !getter.call) {
                getter = this[getter];
            }

            val = (getter) ? getter.call(host, val, fullName) : val;
            val = (path) ? O.getValue(val, path) : val;

            return val;
        },

        /**
         * Provides the common implementation for the public set and protected _set methods.
         *
         * See <a href="#method_set">set</a> for argument details.
         *
         * @method _setAttr
         * @protected
         * @chainable
         *
         * @param {String} name The name of the attribute.
         * @param {Any} value The value to set the attribute to.
         * @param {Object} opts (Optional) Optional event data to be mixed into
         * the event facade passed to subscribers of the attribute's change event.
         * @param {boolean} force If true, allows the caller to set values for 
         * readOnly or writeOnce attributes which have already been set.
         *
         * @return {Object} A reference to the host object.
         */
        _setAttr : function(name, val, opts, force) {
            var allowSet = true,
                state = this._state,
                stateProxy = this._stateProxy,
                data = state.data,
                initialSet,
                strPath,
                path,
                currVal,
                writeOnce,
                initializing;

            if (name.indexOf(DOT) !== -1) {
                strPath = name;
                path = name.split(DOT);
                name = path.shift();
            }

            if (this._isLazyAttr(name)) {
                this._addLazyAttr(name);
            }

            initialSet = (!data.value || !(name in data.value));

            if (stateProxy && name in stateProxy && !this._state.get(name, BYPASS_PROXY)) {
                // TODO: Value is always set for proxy. Can we do any better? Maybe take a snapshot as the initial value for the first call to set? 
                initialSet = false;
            }

            if (this._requireAddAttr && !this.attrAdded(name)) {
            } else {

                writeOnce = state.get(name, WRITE_ONCE);
                initializing = state.get(name, INITIALIZING);

                if (!initialSet && !force) {

                    if (writeOnce) {
                        allowSet = false;
                    }

                    if (state.get(name, READ_ONLY)) {
                        allowSet = false;
                    }
                }

                if (!initializing && !force && writeOnce === INIT_ONLY) {
                    allowSet = false;
                }

                if (allowSet) {
                    // Don't need currVal if initialSet (might fail in custom getter if it always expects a non-undefined/non-null value)
                    if (!initialSet) {
                        currVal =  this.get(name);
                    }

                    if (path) {
                       val = O.setValue(Y.clone(currVal), path, val);

                       if (val === undefined) {
                           allowSet = false;
                       }
                    }

                    if (allowSet) {
                        if (initializing) {
                            this._setAttrVal(name, strPath, currVal, val);
                        } else {
                            this._fireAttrChange(name, strPath, currVal, val, opts);
                        }
                    }
                }
            }

            return this;
        },

        /**
         * Utility method to help setup the event payload and fire the attribute change event.
         * 
         * @method _fireAttrChange
         * @private
         * @param {String} attrName The name of the attribute
         * @param {String} subAttrName The full path of the property being changed, 
         * if this is a sub-attribute value being change. Otherwise null.
         * @param {Any} currVal The current value of the attribute
         * @param {Any} newVal The new value of the attribute
         * @param {Object} opts Any additional event data to mix into the attribute change event's event facade.
         */
        _fireAttrChange : function(attrName, subAttrName, currVal, newVal, opts) {
            var host = this,
                eventName = attrName + CHANGE,
                state = host._state,
                facade;

            if (!state.get(attrName, PUBLISHED)) {
                host.publish(eventName, {
                    queuable:false,
                    defaultTargetOnly: true, 
                    defaultFn:host._defAttrChangeFn, 
                    silent:true,
                    broadcast : state.get(attrName, BROADCAST)
                });
                state.add(attrName, PUBLISHED, true);
            }

            facade = (opts) ? Y.merge(opts) : host._ATTR_E_FACADE;

            // Not using the single object signature for fire({type:..., newVal:...}), since 
            // we don't want to override type. Changed to the fire(type, {newVal:...}) signature.

            // facade.type = eventName;
            facade.attrName = attrName;
            facade.subAttrName = subAttrName;
            facade.prevVal = currVal;
            facade.newVal = newVal;

            // host.fire(facade);
            host.fire(eventName, facade);
        },

        /**
         * Default function for attribute change events.
         *
         * @private
         * @method _defAttrChangeFn
         * @param {EventFacade} e The event object for attribute change events.
         */
        _defAttrChangeFn : function(e) {
            if (!this._setAttrVal(e.attrName, e.subAttrName, e.prevVal, e.newVal)) {
                // Prevent "after" listeners from being invoked since nothing changed.
                e.stopImmediatePropagation();
            } else {
                e.newVal = this.get(e.attrName);
            }
        },

        /**
         * Gets the stored value for the attribute, from either the 
         * internal state object, or the state proxy if it exits
         * 
         * @method _getStateVal
         * @private
         * @param {String} name The name of the attribute
         * @return {Any} The stored value of the attribute
         */
        _getStateVal : function(name) {
            var stateProxy = this._stateProxy;
            return stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY) ? stateProxy[name] : this._state.get(name, VALUE);
        },

        /**
         * Sets the stored value for the attribute, in either the 
         * internal state object, or the state proxy if it exits
         *
         * @method _setStateVal
         * @private
         * @param {String} name The name of the attribute
         * @param {Any} value The value of the attribute
         */
        _setStateVal : function(name, value) {
            var stateProxy = this._stateProxy;
            if (stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY)) {
                stateProxy[name] = value;
            } else {
                this._state.add(name, VALUE, value);
            }
        },

        /**
         * Updates the stored value of the attribute in the privately held State object,
         * if validation and setter passes.
         *
         * @method _setAttrVal
         * @private
         * @param {String} attrName The attribute name.
         * @param {String} subAttrName The sub-attribute name, if setting a sub-attribute property ("x.y.z").
         * @param {Any} prevVal The currently stored value of the attribute.
         * @param {Any} newVal The value which is going to be stored.
         * 
         * @return {booolean} true if the new attribute value was stored, false if not.
         */
        _setAttrVal : function(attrName, subAttrName, prevVal, newVal) {

            var host = this,
                allowSet = true,
                state = host._state,

                validator = state.get(attrName, VALIDATOR),
                setter = state.get(attrName, SETTER),
                initializing = state.get(attrName, INITIALIZING),
                prevValRaw = this._getStateVal(attrName),

                name = subAttrName || attrName,
                retVal,
                valid;

            if (validator) {
                if (!validator.call) { 
                    // Assume string - trying to keep critical path tight, so avoiding Lang check
                    validator = this[validator];
                }
                if (validator) {
                    valid = validator.call(host, newVal, name);

                    if (!valid && initializing) {
                        newVal = state.get(attrName, DEF_VALUE);
                        valid = true; // Assume it's valid, for perf.
                    }
                }
            }

            if (!validator || valid) {
                if (setter) {
                    if (!setter.call) {
                        // Assume string - trying to keep critical path tight, so avoiding Lang check
                        setter = this[setter];
                    }
                    if (setter) {
                        retVal = setter.call(host, newVal, name);

                        if (retVal === INVALID_VALUE) {
                            allowSet = false;
                        } else if (retVal !== undefined){
                            newVal = retVal;
                        }
                    }
                }

                if (allowSet) {
                    if(!subAttrName && (newVal === prevValRaw) && !Lang.isObject(newVal)) {
                        allowSet = false;
                    } else {
                        // Store value
                        if (state.get(attrName, INIT_VALUE) === undefined) {
                            state.add(attrName, INIT_VALUE, newVal);
                        }
                        host._setStateVal(attrName, newVal);
                    }
                }

            } else {
                allowSet = false;
            }

            return allowSet;
        },

        /**
         * Sets multiple attribute values.
         *
         * @method setAttrs
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        setAttrs : function(attrs, opts) {
            return this._setAttrs(attrs, opts);
        },

        /**
         * Implementation behind the public setAttrs method, to set multiple attribute values.
         *
         * @method _setAttrs
         * @protected
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        _setAttrs : function(attrs, opts) {
            for (var attr in attrs) {
                if ( attrs.hasOwnProperty(attr) ) {
                    this.set(attr, attrs[attr]);
                }
            }
            return this;
        },

        /**
         * Gets multiple attribute values.
         *
         * @method getAttrs
         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are
         * returned. If set to true, all attributes modified from their initial values are returned.
         * @return {Object} An object with attribute name/value pairs.
         */
        getAttrs : function(attrs) {
            return this._getAttrs(attrs);
        },

        /**
         * Implementation behind the public getAttrs method, to get multiple attribute values.
         *
         * @method _getAttrs
         * @protected
         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are
         * returned. If set to true, all attributes modified from their initial values are returned.
         * @return {Object} An object with attribute name/value pairs.
         */
        _getAttrs : function(attrs) {
            var host = this,
                o = {}, 
                i, l, attr, val,
                modifiedOnly = (attrs === true);

            attrs = (attrs && !modifiedOnly) ? attrs : O.keys(host._state.data.added);

            for (i = 0, l = attrs.length; i < l; i++) {
                // Go through get, to honor cloning/normalization
                attr = attrs[i];
                val = host.get(attr);

                if (!modifiedOnly || host._getStateVal(attr) != host._state.get(attr, INIT_VALUE)) {
                    o[attr] = host.get(attr); 
                }
            }

            return o;
        },

        /**
         * Configures a group of attributes, and sets initial values.
         *
         * <p>
         * <strong>NOTE:</strong> This method does not isolate the configuration object by merging/cloning. 
         * The caller is responsible for merging/cloning the configuration object if required.
         * </p>
         *
         * @method addAttrs
         * @chainable
         *
         * @param {Object} cfgs An object with attribute name/configuration pairs.
         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.
         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.
         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.
         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.
         * See <a href="#method_addAttr">addAttr</a>.
         * 
         * @return {Object} A reference to the host object.
         */
        addAttrs : function(cfgs, values, lazy) {
            var host = this; // help compression
            if (cfgs) {
                host._tCfgs = cfgs;
                host._tVals = host._normAttrVals(values);
                host._addAttrs(cfgs, host._tVals, lazy);
                host._tCfgs = host._tVals = null;
            }

            return host;
        },

        /**
         * Implementation behind the public addAttrs method. 
         * 
         * This method is invoked directly by get if it encounters a scenario 
         * in which an attribute's valueFn attempts to obtain the 
         * value an attribute in the same group of attributes, which has not yet 
         * been added (on demand initialization).
         *
         * @method _addAttrs
         * @private
         * @param {Object} cfgs An object with attribute name/configuration pairs.
         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.
         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.
         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.
         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.
         * See <a href="#method_addAttr">addAttr</a>.
         */
        _addAttrs : function(cfgs, values, lazy) {
            var host = this, // help compression
                attr,
                attrCfg,
                value;

            for (attr in cfgs) {
                if (cfgs.hasOwnProperty(attr)) {

                    // Not Merging. Caller is responsible for isolating configs
                    attrCfg = cfgs[attr];
                    attrCfg.defaultValue = attrCfg.value;

                    // Handle simple, complex and user values, accounting for read-only
                    value = host._getAttrInitVal(attr, attrCfg, host._tVals);

                    if (value !== undefined) {
                        attrCfg.value = value;
                    }

                    if (host._tCfgs[attr]) {
                        delete host._tCfgs[attr];
                    }

                    host.addAttr(attr, attrCfg, lazy);
                }
            }
        },

        /**
         * Utility method to protect an attribute configuration
         * hash, by merging the entire object and the individual 
         * attr config objects. 
         *
         * @method _protectAttrs
         * @protected
         * @param {Object} attrs A hash of attribute to configuration object pairs.
         * @return {Object} A protected version of the attrs argument.
         */
        _protectAttrs : function(attrs) {
            if (attrs) {
                attrs = Y.merge(attrs);
                for (var attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        attrs[attr] = Y.merge(attrs[attr]);
                    }
                }
            }
            return attrs;
        },

        /**
         * Utility method to normalize attribute values. The base implementation 
         * simply merges the hash to protect the original.
         *
         * @method _normAttrVals
         * @param {Object} valueHash An object with attribute name/value pairs
         *
         * @return {Object}
         *
         * @private
         */
        _normAttrVals : function(valueHash) {
            return (valueHash) ? Y.merge(valueHash) : null;
        },

        /**
         * Returns the initial value of the given attribute from
         * either the default configuration provided, or the 
         * over-ridden value if it exists in the set of initValues 
         * provided and the attribute is not read-only.
         *
         * @param {String} attr The name of the attribute
         * @param {Object} cfg The attribute configuration object
         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals
         *
         * @return {Any} The initial value of the attribute.
         *
         * @method _getAttrInitVal
         * @private
         */
        _getAttrInitVal : function(attr, cfg, initValues) {
            var val, valFn;
            // init value is provided by the user if it exists, else, provided by the config
            if (!cfg[READ_ONLY] && initValues && initValues.hasOwnProperty(attr)) {
                val = initValues[attr];
            } else {
                val = cfg[VALUE];
                valFn = cfg[VALUE_FN];
 
                if (valFn) {
                    if (!valFn.call) {
                        valFn = this[valFn];
                    }
                    if (valFn) {
                        val = valFn.call(this);
                    }
                }
            }


            return val;
        },

        /**
         * Returns an object with the configuration properties (and value)
         * for the given attrubute. If attrName is not provided, returns the
         * configuration properties for all attributes.
         *
         * @method _getAttrCfg
         * @protected
         * @param {String} name Optional. The attribute name. If not provided, the method will return the configuration for all attributes.
         * @return {Object} The configuration properties for the given attribute, or all attributes.
         */
        _getAttrCfg : function(name) {
            var o,
                data = this._state.data;

            if (data) {
                o = {};

                Y.each(data, function(cfg, cfgProp) {
                    if (name) {
                        if(name in cfg) {
                            o[cfgProp] = cfg[name];
                        }
                    } else {
                        Y.each(cfg, function(attrCfg, attr) {
                           o[attr] = o[attr] || {};
                           o[attr][cfgProp] = attrCfg;
                        });
                    }
                });
            }

            return o;
        }
    };

    // Basic prototype augment - no lazy constructor invocation.
    Y.mix(Attribute, EventTarget, false, null, 1);

    Y.Attribute = Attribute;


}, '3.3.0' ,{requires:['event-custom']});
YUI.add('attribute-complex', function(Y) {

    /**
     * Adds support for attribute providers to handle complex attributes in the constructor
     *
     * @module attribute
     * @submodule attribute-complex
     * @for Attribute
     */

    var O = Y.Object,
        DOT = ".";

    Y.Attribute.Complex = function() {};
    Y.Attribute.Complex.prototype = {

        /**
         * Utility method to split out simple attribute name/value pairs ("x") 
         * from complex attribute name/value pairs ("x.y.z"), so that complex
         * attributes can be keyed by the top level attribute name.
         *
         * @method _normAttrVals
         * @param {Object} valueHash An object with attribute name/value pairs
         *
         * @return {Object} An object literal with 2 properties - "simple" and "complex",
         * containing simple and complex attribute values respectively keyed 
         * by the top level attribute name, or null, if valueHash is falsey.
         *
         * @private
         */
        _normAttrVals : function(valueHash) {
            var vals = {},
                subvals = {},
                path,
                attr,
                v, k;

            if (valueHash) {
                for (k in valueHash) {
                    if (valueHash.hasOwnProperty(k)) {
                        if (k.indexOf(DOT) !== -1) {
                            path = k.split(DOT);
                            attr = path.shift();
                            v = subvals[attr] = subvals[attr] || [];
                            v[v.length] = {
                                path : path, 
                                value: valueHash[k]
                            };
                        } else {
                            vals[k] = valueHash[k];
                        }
                    }
                }
                return { simple:vals, complex:subvals };
            } else {
                return null;
            }
        },

        /**
         * Returns the initial value of the given attribute from
         * either the default configuration provided, or the 
         * over-ridden value if it exists in the set of initValues 
         * provided and the attribute is not read-only.
         *
         * @param {String} attr The name of the attribute
         * @param {Object} cfg The attribute configuration object
         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals
         *
         * @return {Any} The initial value of the attribute.
         *
         * @method _getAttrInitVal
         * @private
         */
        _getAttrInitVal : function(attr, cfg, initValues) {

            var val = cfg.value,
                valFn = cfg.valueFn,
                simple,
                complex,
                i,
                l,
                path,
                subval,
                subvals;

            if (valFn) {
                if (!valFn.call) {
                    valFn = this[valFn];
                }
                if (valFn) {
                    val = valFn.call(this);
                }
            }

            if (!cfg.readOnly && initValues) {

                // Simple Attributes
                simple = initValues.simple;
                if (simple && simple.hasOwnProperty(attr)) {
                    val = simple[attr];
                }

                // Complex Attributes (complex values applied, after simple, incase both are set)
                complex = initValues.complex;
                if (complex && complex.hasOwnProperty(attr)) {
                    subvals = complex[attr];
                    for (i = 0, l = subvals.length; i < l; ++i) {
                        path = subvals[i].path;
                        subval = subvals[i].value;
                        O.setValue(val, path, subval);
                    }
                }
            }

            return val;
        }
    };

    Y.mix(Y.Attribute, Y.Attribute.Complex, true, null, 1);


}, '3.3.0' ,{requires:['attribute-base']});


YUI.add('attribute', function(Y){}, '3.3.0' ,{use:['attribute-base', 'attribute-complex']});

/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('base-base', function(Y) {

    /**
     * The base module provides the Base class, which objects requiring attribute and custom event support can extend. 
     * The module also provides two ways to reuse code - It augments Base with the Plugin.Host interface which provides 
     * plugin support and also provides the Base.build method which provides a way to build custom classes using extensions.
     *
     * @module base
     */

    /**
     * The base-base submodule provides the Base class without the Plugin support, provided by Plugin.Host, 
     * and without the extension support provided by Base.build.
     *
     * @module base
     * @submodule base-base
     */
    var O = Y.Object,
        L = Y.Lang,
        DOT = ".",
        DESTROY = "destroy",
        INIT = "init",
        INITIALIZED = "initialized",
        DESTROYED = "destroyed",
        INITIALIZER = "initializer",
        BUBBLETARGETS = "bubbleTargets",
        _BUBBLETARGETS = "_bubbleTargets",
        OBJECT_CONSTRUCTOR = Object.prototype.constructor,
        DEEP = "deep",
        SHALLOW = "shallow",
        DESTRUCTOR = "destructor",

        Attribute = Y.Attribute;

    /**
     * <p>
     * A base class which objects requiring attributes and custom event support can 
     * extend. Base also handles the chaining of initializer and destructor methods across 
     * the hierarchy as part of object construction and destruction. Additionally, attributes configured 
     * through the static <a href="#property_Base.ATTRS">ATTRS</a> property for each class 
     * in the hierarchy will be initialized by Base.
     * </p>
     *
     * <p>
     * The static <a href="#property_Base.NAME">NAME</a> property of each class extending 
     * from Base will be used as the identifier for the class, and is used by Base to prefix 
     * all events fired by instances of that class.
     * </p>
     *
     * @class Base
     * @constructor
     * @uses Attribute
     * @uses Plugin.Host
     *
     * @param {Object} config Object with configuration property name/value pairs. The object can be 
     * used to provide default values for the objects published attributes.
     *
     * <p>
     * The config object can also contain the following non-attribute properties, providing a convenient 
     * way to configure events listeners and plugins for the instance, as part of the constructor call:
     * </p>
     *
     * <dl>
     *     <dt>on</dt>
     *     <dd>An event name to listener function map, to register event listeners for the "on" moment of the event. A constructor convenience property for the <a href="Base.html#method_on">on</a> method.</dd>
     *     <dt>after</dt>
     *     <dd>An event name to listener function map, to register event listeners for the "after" moment of the event. A constructor convenience property for the <a href="Base.html#method_after">after</a> method.</dd>
     *     <dt>bubbleTargets</dt>
     *     <dd>An object, or array of objects, to register as bubble targets for bubbled events fired by this instance. A constructor convenience property for the <a href="EventTarget.html#method_addTarget">addTarget</a> method.</dd>
     *     <dt>plugins</dt>
     *     <dd>A plugin, or array of plugins to be plugged into the instance (see PluginHost's plug method for signature details). A constructor convenience property for the <a href="Plugin.Host.html#method_plug">plug</a> method.</dd>
     * </dl>
     */
    function Base() {

        // So the object can be used as a hash key (as DD does)
        Y.stamp(this);

        Attribute.call(this);

        // If Plugin.Host has been augmented [ through base-pluginhost ], setup it's
        // initial state, but don't initialize Plugins yet. That's done after initialization.
        var PluginHost = Y.Plugin && Y.Plugin.Host;  
        if (this._initPlugins && PluginHost) {
            PluginHost.call(this);
        }

        if (this._lazyAddAttrs !== false) { this._lazyAddAttrs = true; }

        /**
         * The string used to identify the class of this object.
         *
         * @deprecated Use this.constructor.NAME
         * @property name
         * @type String
         */
        this.name = this.constructor.NAME;
        this._eventPrefix = this.constructor.EVENT_PREFIX || this.constructor.NAME;

        this.init.apply(this, arguments);
    }

    /**
     * The list of properties which can be configured for 
     * each attribute (e.g. setter, getter, writeOnce, readOnly etc.)
     *
     * @property Base._ATTR_CFG
     * @type Array
     * @static
     * @private
     */
    Base._ATTR_CFG = Attribute._ATTR_CFG.concat("cloneDefaultValue");

    /**
     * <p>
     * The string to be used to identify instances of 
     * this class, for example in prefixing events.
     * </p>
     * <p>
     * Classes extending Base, should define their own
     * static NAME property, which should be camelCase by
     * convention (e.g. MyClass.NAME = "myClass";).
     * </p>
     * @property Base.NAME
     * @type String
     * @static
     */
    Base.NAME = "base";

    /**
     * The default set of attributes which will be available for instances of this class, and 
     * their configuration. In addition to the configuration properties listed by 
     * Attribute's <a href="Attribute.html#method_addAttr">addAttr</a> method, the attribute 
     * can also be configured with a "cloneDefaultValue" property, which defines how the statically
     * defined value field should be protected ("shallow", "deep" and false are supported values). 
     *
     * By default if the value is an object literal or an array it will be "shallow" cloned, to 
     * protect the default value.
     *
     * @property Base.ATTRS
     * @type Object
     * @static
     */
    Base.ATTRS = {
        /**
         * Flag indicating whether or not this object
         * has been through the init lifecycle phase.
         *
         * @attribute initialized
         * @readonly
         * @default false
         * @type boolean
         */
        initialized: {
            readOnly:true,
            value:false
        },

        /**
         * Flag indicating whether or not this object
         * has been through the destroy lifecycle phase.
         *
         * @attribute destroyed
         * @readonly
         * @default false
         * @type boolean
         */
        destroyed: {
            readOnly:true,
            value:false
        }
    };

    Base.prototype = {

        /**
         * Init lifecycle method, invoked during construction.
         * Fires the init event prior to setting up attributes and 
         * invoking initializers for the class hierarchy.
         *
         * @method init
         * @final
         * @chainable
         * @param {Object} config Object with configuration property name/value pairs
         * @return {Base} A reference to this object
         */
        init: function(config) {

            this._yuievt.config.prefix = this._eventPrefix;

            /**
             * <p>
             * Lifecycle event for the init phase, fired prior to initialization. 
             * Invoking the preventDefault() method on the event object provided 
             * to subscribers will prevent initialization from occuring.
             * </p>
             * <p>
             * Subscribers to the "after" momemt of this event, will be notified
             * after initialization of the object is complete (and therefore
             * cannot prevent initialization).
             * </p>
             *
             * @event init
             * @preventable _defInitFn
             * @param {EventFacade} e Event object, with a cfg property which 
             * refers to the configuration object passed to the constructor.
             */
            this.publish(INIT, {
                queuable:false,
                fireOnce:true,
                defaultTargetOnly:true,
                defaultFn:this._defInitFn
            });

            this._preInitEventCfg(config);

            this.fire(INIT, {cfg: config});

            return this;
        },

        /**
         * Handles the special on, after and target properties which allow the user to
         * easily configure on and after listeners as well as bubble targets during 
         * construction, prior to init.
         *
         * @private
         * @method _preInitEventCfg
         * @param {Object} config The user configuration object
         */
        _preInitEventCfg : function(config) {
            if (config) {
                if (config.on) {
                    this.on(config.on);
                }
                if (config.after) {
                    this.after(config.after);
                }
            }

            var i, l, target,
                userTargets = (config && BUBBLETARGETS in config);

            if (userTargets || _BUBBLETARGETS in this) {
                target = userTargets ? (config && config.bubbleTargets) : this._bubbleTargets;
                if (L.isArray(target)) {
                    for (i = 0, l = target.length; i < l; i++) { 
                        this.addTarget(target[i]);
                    }
                } else if (target) {
                    this.addTarget(target);
                }
            }
        },

        /**
         * <p>
         * Destroy lifecycle method. Fires the destroy
         * event, prior to invoking destructors for the
         * class hierarchy.
         * </p>
         * <p>
         * Subscribers to the destroy
         * event can invoke preventDefault on the event object, to prevent destruction
         * from proceeding.
         * </p>
         * @method destroy
         * @return {Base} A reference to this object
         * @final
         * @chainable
         */
        destroy: function() {

            /**
             * <p>
             * Lifecycle event for the destroy phase, 
             * fired prior to destruction. Invoking the preventDefault 
             * method on the event object provided to subscribers will 
             * prevent destruction from proceeding.
             * </p>
             * <p>
             * Subscribers to the "after" moment of this event, will be notified
             * after destruction is complete (and as a result cannot prevent
             * destruction).
             * </p>
             * @event destroy
             * @preventable _defDestroyFn
             * @param {EventFacade} e Event object
             */
            this.publish(DESTROY, {
                queuable:false,
                fireOnce:true,
                defaultTargetOnly:true,
                defaultFn: this._defDestroyFn
            });
            this.fire(DESTROY);

            this.detachAll();
            return this;
        },

        /**
         * Default init event handler
         *
         * @method _defInitFn
         * @param {EventFacade} e Event object, with a cfg property which 
         * refers to the configuration object passed to the constructor.
         * @protected
         */
        _defInitFn : function(e) {
            this._initHierarchy(e.cfg);
            if (this._initPlugins) {
                // Need to initPlugins manually, to handle constructor parsing, static Plug parsing
                this._initPlugins(e.cfg);
            }
            this._set(INITIALIZED, true);
        },

        /**
         * Default destroy event handler
         *
         * @method _defDestroyFn
         * @param {EventFacade} e Event object
         * @protected
         */
        _defDestroyFn : function(e) {
            this._destroyHierarchy();
            if (this._destroyPlugins) {
                this._destroyPlugins();
            }
            this._set(DESTROYED, true);
        },

        /**
         * Returns the class hierarchy for this object, with Base being the last class in the array.
         *
         * @method _getClasses
         * @protected
         * @return {Function[]} An array of classes (constructor functions), making up the class hierarchy for this object.
         * This value is cached the first time the method, or _getAttrCfgs, is invoked. Subsequent invocations return the 
         * cached value.
         */
        _getClasses : function() {
            if (!this._classes) {
                this._initHierarchyData();
            }
            return this._classes;
        },

        /**
         * Returns an aggregated set of attribute configurations, by traversing the class hierarchy.
         *
         * @method _getAttrCfgs
         * @protected
         * @return {Object} The hash of attribute configurations, aggregated across classes in the hierarchy
         * This value is cached the first time the method, or _getClasses, is invoked. Subsequent invocations return
         * the cached value.
         */
        _getAttrCfgs : function() {
            if (!this._attrs) {
                this._initHierarchyData();
            }
            return this._attrs;
        },

        /**
         * A helper method used when processing ATTRS across the class hierarchy during 
         * initialization. Returns a disposable object with the attributes defined for 
         * the provided class, extracted from the set of all attributes passed in .
         *
         * @method _filterAttrCfs
         * @private
         *
         * @param {Function} clazz The class for which the desired attributes are required.
         * @param {Object} allCfgs The set of all attribute configurations for this instance. 
         * Attributes will be removed from this set, if they belong to the filtered class, so
         * that by the time all classes are processed, allCfgs will be empty.
         * 
         * @return {Object} The set of attributes belonging to the class passed in, in the form
         * of an object with attribute name/configuration pairs.
         */
        _filterAttrCfgs : function(clazz, allCfgs) {
            var cfgs = null, attr, attrs = clazz.ATTRS;

            if (attrs) {
                for (attr in attrs) {
                    if (attrs.hasOwnProperty(attr) && allCfgs[attr]) {
                        cfgs = cfgs || {};
                        cfgs[attr] = allCfgs[attr];
                        delete allCfgs[attr];
                    }
                }
            }

            return cfgs;
        },

        /**
         * A helper method used by _getClasses and _getAttrCfgs, which determines both
         * the array of classes and aggregate set of attribute configurations
         * across the class hierarchy for the instance.
         * 
         * @method _initHierarchyData
         * @private
         */
        _initHierarchyData : function() {
            var c = this.constructor, 
                classes = [],
                attrs = [];

            while (c) {
                // Add to classes
                classes[classes.length] = c;

                // Add to attributes
                if (c.ATTRS) {
                    attrs[attrs.length] = c.ATTRS;
                }
                c = c.superclass ? c.superclass.constructor : null;
            }

            this._classes = classes;
            this._attrs = this._aggregateAttrs(attrs);
        },

        /**
         * A helper method, used by _initHierarchyData to aggregate 
         * attribute configuration across the instances class hierarchy.
         *
         * The method will potect the attribute configuration value to protect the statically defined 
         * default value in ATTRS if required (if the value is an object literal, array or the 
         * attribute configuration has cloneDefaultValue set to shallow or deep).
         *
         * @method _aggregateAttrs
         * @private
         * @param {Array} allAttrs An array of ATTRS definitions across classes in the hierarchy 
         * (subclass first, Base last)
         * @return {Object} The aggregate set of ATTRS definitions for the instance
         */
        _aggregateAttrs : function(allAttrs) {
            var attr,
                attrs,
                cfg,
                val,
                path,
                i, 
                clone, 
                cfgProps = Base._ATTR_CFG,
                aggAttrs = {};

            if (allAttrs) {
                for (i = allAttrs.length-1; i >= 0; --i) {
                    attrs = allAttrs[i];

                    for (attr in attrs) {
                        if (attrs.hasOwnProperty(attr)) {

                            // Protect config passed in
                            cfg = Y.mix({}, attrs[attr], true, cfgProps);

                            val = cfg.value;
                            clone = cfg.cloneDefaultValue;

                            if (val) {
                                if ( (clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || L.isArray(val))) || clone === DEEP || clone === true) {
                                    cfg.value = Y.clone(val);
                                } else if (clone === SHALLOW) {
                                    cfg.value = Y.merge(val);
                                }
                                // else if (clone === false), don't clone the static default value. 
                                // It's intended to be used by reference.
                            }

                            path = null;
                            if (attr.indexOf(DOT) !== -1) {
                                path = attr.split(DOT);
                                attr = path.shift();
                            }

                            if (path && aggAttrs[attr] && aggAttrs[attr].value) {
                                O.setValue(aggAttrs[attr].value, path, val);
                            } else if (!path){
                                if (!aggAttrs[attr]) {
                                    aggAttrs[attr] = cfg;
                                } else {
                                    Y.mix(aggAttrs[attr], cfg, true, cfgProps);
                                }
                            }
                        }
                    }
                }
            }

            return aggAttrs;
        },

        /**
         * Initializes the class hierarchy for the instance, which includes 
         * initializing attributes for each class defined in the class's 
         * static <a href="#property_Base.ATTRS">ATTRS</a> property and 
         * invoking the initializer method on the prototype of each class in the hierarchy.
         *
         * @method _initHierarchy
         * @param {Object} userVals Object with configuration property name/value pairs
         * @private
         */
        _initHierarchy : function(userVals) {
            var lazy = this._lazyAddAttrs,
                constr,
                constrProto,
                ci,
                ei,
                el,
                classes = this._getClasses(),
                attrCfgs = this._getAttrCfgs();

            for (ci = classes.length-1; ci >= 0; ci--) {

                constr = classes[ci];
                constrProto = constr.prototype;

                if (constr._yuibuild && constr._yuibuild.exts) {
                    for (ei = 0, el = constr._yuibuild.exts.length; ei < el; ei++) {
                        constr._yuibuild.exts[ei].apply(this, arguments);
                    }
                }

                this.addAttrs(this._filterAttrCfgs(constr, attrCfgs), userVals, lazy);

                // Using INITIALIZER in hasOwnProperty check, for performance reasons (helps IE6 avoid GC thresholds when
                // referencing string literals). Not using it in apply, again, for performance "." is faster. 
                if (constrProto.hasOwnProperty(INITIALIZER)) {
                    constrProto.initializer.apply(this, arguments);
                }
            }
        },

        /**
         * Destroys the class hierarchy for this instance by invoking
         * the descructor method on the prototype of each class in the hierarchy.
         *
         * @method _destroyHierarchy
         * @private
         */
        _destroyHierarchy : function() {
            var constr,
                constrProto,
                ci, cl,
                classes = this._getClasses();

            for (ci = 0, cl = classes.length; ci < cl; ci++) {
                constr = classes[ci];
                constrProto = constr.prototype;
                if (constrProto.hasOwnProperty(DESTRUCTOR)) {
                    constrProto.destructor.apply(this, arguments);
                }
            }
        },

        /**
         * Default toString implementation. Provides the constructor NAME
         * and the instance guid, if set.
         *
         * @method toString
         * @return {String} String representation for this object
         */
        toString: function() {
            return this.name + "[" + Y.stamp(this, true) + "]";
        }

    };

    // Straightup augment, no wrapper functions
    Y.mix(Base, Attribute, false, null, 1);

    // Fix constructor
    Base.prototype.constructor = Base;

    Y.Base = Base;


}, '3.3.0' ,{requires:['attribute-base']});
YUI.add('base-pluginhost', function(Y) {

    /**
     * The base-pluginhost submodule adds Plugin support to Base, by augmenting Base with 
     * Plugin.Host and setting up static (class level) Base.plug and Base.unplug methods.
     *
     * @module base
     * @submodule base-pluginhost
     * @for Base
     */

    var Base = Y.Base,
        PluginHost = Y.Plugin.Host;

    Y.mix(Base, PluginHost, false, null, 1);

    /**
     * Alias for <a href="Plugin.Host.html#method_Plugin.Host.plug">Plugin.Host.plug</a>. See aliased 
     * method for argument and return value details.
     *
     * @method Base.plug
     * @static
     */
    Base.plug = PluginHost.plug;

    /**
     * Alias for <a href="Plugin.Host.html#method_Plugin.Host.unplug">Plugin.Host.unplug</a>. See the 
     * aliased method for argument and return value details.
     *
     * @method Base.unplug
     * @static
     */
    Base.unplug = PluginHost.unplug;


}, '3.3.0' ,{requires:['base-base', 'pluginhost']});
YUI.add('base-build', function(Y) {

    /**
     * The base-build submodule provides Base.build functionality, which
     * can be used to create custom classes, by aggregating extensions onto 
     * a main class.
     *
     * @module base
     * @submodule base-build
     * @for Base
     */
    var Base = Y.Base,
        L = Y.Lang,
        build;

    Base._build = function(name, main, extensions, px, sx, cfg) {

        var build = Base._build,

            builtClass = build._ctor(main, cfg),
            buildCfg = build._cfg(main, cfg),

            _mixCust = build._mixCust,

            aggregates = buildCfg.aggregates,
            custom = buildCfg.custom,

            dynamic = builtClass._yuibuild.dynamic,

            i, l, val, extClass;

        if (dynamic && aggregates) {
            for (i = 0, l = aggregates.length; i < l; ++i) {
                val = aggregates[i];
                if (main.hasOwnProperty(val)) {
                    builtClass[val] = L.isArray(main[val]) ? [] : {};
                }
            }
        }

        // Augment/Aggregate
        for (i = 0, l = extensions.length; i < l; i++) {
            extClass = extensions[i];

            // Prototype, old non-displacing augment
            Y.mix(builtClass, extClass, true, null, 1);
             // Custom Statics
            _mixCust(builtClass, extClass, aggregates, custom);

            builtClass._yuibuild.exts.push(extClass);
        }

        if (px) {
            Y.mix(builtClass.prototype, px, true);
        }

        if (sx) {
            Y.mix(builtClass, build._clean(sx, aggregates, custom), true);
            _mixCust(builtClass, sx, aggregates, custom);
        }

        builtClass.prototype.hasImpl = build._impl;

        if (dynamic) {
            builtClass.NAME = name;
            builtClass.prototype.constructor = builtClass;
        }

        return builtClass;
    };

    build = Base._build;

    Y.mix(build, {

        _mixCust: function(r, s, aggregates, custom) {

            if (aggregates) {
                Y.aggregate(r, s, true, aggregates);
            }

            if (custom) {
                for (var j in custom) {
                    if (custom.hasOwnProperty(j)) {
                        custom[j](j, r, s);
                    }
                }
            }
        },

        _tmpl: function(main) {

            function BuiltClass() {
                BuiltClass.superclass.constructor.apply(this, arguments);
            }
            Y.extend(BuiltClass, main);

            return BuiltClass;
        },

        _impl : function(extClass) {
            var classes = this._getClasses(), i, l, cls, exts, ll, j;
            for (i = 0, l = classes.length; i < l; i++) {
                cls = classes[i];
                if (cls._yuibuild) {
                    exts = cls._yuibuild.exts;
                    ll = exts.length;
    
                    for (j = 0; j < ll; j++) {
                        if (exts[j] === extClass) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        _ctor : function(main, cfg) {

           var dynamic = (cfg && false === cfg.dynamic) ? false : true,
               builtClass = (dynamic) ? build._tmpl(main) : main,
               buildCfg = builtClass._yuibuild;

            if (!buildCfg) {
                buildCfg = builtClass._yuibuild = {};
            }

            buildCfg.id = buildCfg.id || null;
            buildCfg.exts = buildCfg.exts || [];
            buildCfg.dynamic = dynamic;

            return builtClass;
        },

        _cfg : function(main, cfg) {
            var aggr = [], 
                cust = {},
                buildCfg,
                cfgAggr = (cfg && cfg.aggregates),
                cfgCustBuild = (cfg && cfg.custom),
                c = main;

            while (c && c.prototype) {
                buildCfg = c._buildCfg; 
                if (buildCfg) {
                    if (buildCfg.aggregates) {
                        aggr = aggr.concat(buildCfg.aggregates);
                    }
                    if (buildCfg.custom) {
                        Y.mix(cust, buildCfg.custom, true);
                    }
                }
                c = c.superclass ? c.superclass.constructor : null;
            }

            if (cfgAggr) {
                aggr = aggr.concat(cfgAggr);
            }
            if (cfgCustBuild) {
                Y.mix(cust, cfg.cfgBuild, true);
            }

            return {
                aggregates: aggr,
                custom: cust
            };
        },

        _clean : function(sx, aggregates, custom) {
            var prop, i, l, sxclone = Y.merge(sx);

            for (prop in custom) {
                if (sxclone.hasOwnProperty(prop)) {
                    delete sxclone[prop];
                }
            }

            for (i = 0, l = aggregates.length; i < l; i++) {
                prop = aggregates[i];
                if (sxclone.hasOwnProperty(prop)) {
                    delete sxclone[prop];
                }
            }

            return sxclone;
        }
    });

    /**
     * <p>
     * Builds a custom constructor function (class) from the
     * main function, and array of extension functions (classes)
     * provided. The NAME field for the constructor function is 
     * defined by the first argument passed in.
     * </p>
     * <p>
     * The cfg object supports the following properties
     * </p>
     * <dl>
     *    <dt>dynamic &#60;boolean&#62;</dt>
     *    <dd>
     *    <p>If true (default), a completely new class
     *    is created which extends the main class, and acts as the 
     *    host on which the extension classes are augmented.</p>
     *    <p>If false, the extensions classes are augmented directly to
     *    the main class, modifying the main class' prototype.</p>
     *    </dd>
     *    <dt>aggregates &#60;String[]&#62;</dt>
     *    <dd>An array of static property names, which will get aggregated
     *    on to the built class, in addition to the default properties build 
     *    will always aggregate as defined by the main class' static _buildCfg
     *    property.
     *    </dd>
     * </dl>
     *
     * @method Base.build
     * @deprecated Use the more convenient Base.create and Base.mix methods instead
     * @static
     * @param {Function} name The name of the new class. Used to defined the NAME property for the new class.
     * @param {Function} main The main class on which to base the built class
     * @param {Function[]} extensions The set of extension classes which will be
     * augmented/aggregated to the built class.
     * @param {Object} cfg Optional. Build configuration for the class (see description).
     * @return {Function} A custom class, created from the provided main and extension classes
     */
    Base.build = function(name, main, extensions, cfg) {
        return build(name, main, extensions, null, null, cfg);
    };

    /**
     * <p>Creates a new class (constructor function) which extends the base class passed in as the second argument, 
     * and mixes in the array of extensions provided.</p>
     * <p>Prototype properties or methods can be added to the new class, using the px argument (similar to Y.extend).</p>
     * <p>Static properties or methods can be added to the new class, using the sx argument (similar to Y.extend).</p>
     * <p>
     * 
     * </p>
     * @method Base.create
     * @static
     * @param {Function} name The name of the newly created class. Used to defined the NAME property for the new class.
     * @param {Function} main The base class which the new class should extend. This class needs to be Base or a class derived from base (e.g. Widget).
     * @param {Function[]} extensions The list of extensions which will be mixed into the built class.
     * @param {Object} px The set of prototype properties/methods to add to the built class.
     * @param {Object} sx The set of static properties/methods to add to the built class.
     * @return {Function} The newly created class.
     */
    Base.create = function(name, base, extensions, px, sx) {
        return build(name, base, extensions, px, sx);
    };

    /**
     * <p>Mixes in a list of extensions to an existing class.</p>
     * @method Base.mix
     * @static
     * @param {Function} main The existing class into which the extensions should be mixed.  The class needs to be Base or class derived from base (e.g. Widget)
     * @param {Function[]} extensions The set of extension classes which will mixed into the existing main class.
     * @return {Function} The modified main class, with extensions mixed in.
     */
    Base.mix = function(main, extensions) {
        return build(null, main, extensions, null, null, {dynamic:false});
    };

    /**
     * The build configuration for the Base class.
     *
     * Defines the static fields which need to be aggregated
     * when the Base class is used as the main class passed to
     * the <a href="#method_Base.build">Base.build</a> method.
     *
     * @property Base._buildCfg
     * @type Object
     * @static
     * @final
     * @private
     */
    Base._buildCfg = {
        custom : { 
            ATTRS : function(prop, r, s) {

                r.ATTRS = r.ATTRS || {};

                if (s.ATTRS) {

                    var sAttrs = s.ATTRS,
                        rAttrs = r.ATTRS,
                        a;

                    for (a in sAttrs) {
                        if (sAttrs.hasOwnProperty(a)) {
                            rAttrs[a] = rAttrs[a] || {};
                            Y.mix(rAttrs[a], sAttrs[a], true);
                        }
                    }
                }
            }
        },
        aggregates : ["_PLUG", "_UNPLUG"]
    };


}, '3.3.0' ,{requires:['base-base']});


YUI.add('base', function(Y){}, '3.3.0' ,{after:['attribute-complex'], use:['base-base', 'base-pluginhost', 'base-build']});

/**
 * @fileOverview 表单功能模块 包含功能 1.搜索表单验证 2.默认填入用户当前城市（依赖开发的COOKIES） 3.用户搜索历史记录和回填 4.城市切换
 * @author shuke.cl
 * version 1.0
 * @requires ［"widget",  "calendar"］
 */
var TG = TG || {};
TG.SearchForm = TG.SearchForm || {};
YUI.add('trip-search-form',function(Y){
	var isSupportPlaceholder = Y.Modernizr.input.placeholder , Array = Y.Array , Cookie = Y.Cookie ;
	var dateReg = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/;

	var SearchForm  = Y.Base.create('searchForm' , Y.Base ,[],{
			allSubmit : true ,
			initializer: function (){
				this.form = this.get('node');
				this.radioNodes = this.form.all('.J_type_radio');
        this.inputNodes = this.form.all('.J_TripCityInput ,.J_DateInput');
				this._syncUI();
				this._bindUI();
			},
			_syncUI : function (){
				this.setDefaultValue();
			},
			_bindUI: function (){
				var _form = this.form ,tradeBtn = _form.one('.search-trade') , SELF = this;
				_form.on('submit' , this.doSubmit , this);
				_form.delegate('click',this.setFlightType, '.J_type_radio' , this);
				if (tradeBtn) {
					tradeBtn.on('click' , this._trade , this);
				}

				//选择返程时间，自动重置航程类型为往返
				var backNode = this.form.one('.search-backitem'),
					radioNodes = this.radioNodes ,
					backDateInput = null ;
				var doCheckFlightType = function (){
          if (radioNodes.size() < 1 ) {
              return false;
          }
					radioNodes.item(1).set('checked' , true);
					SELF.setFlightType();
				};
				if (backNode) {
					backDateInput = backNode.one('.J_endDate');
					backDateInput && backDateInput.on('keyup',this.checkOneWay,this);
				}
        /*
        当INPUT有data-autotab属性时，绑定自动切换事件
        */
        this.inputNodes.each(function (item){
            var curAc  , curCal;
            if (item.hasClass('J_TripCityInput') && item.hasAttribute('data-autotab')) {//自动完成组件自动切换
                curAc = TG.SearchForm['#'+item.get('id')];
                curAc && curAc.on('select' , function (){
                   var el = Y.one('#'+ item.getAttribute('data-autotab'));
                    setTimeout(function (){
                        el && el.focus();
                    },200);
                })
            }else if (item.hasClass('J_DateInput')) { 
                curCal = TG.SearchForm['#'+item.get('id')];
                curCal && curCal.on('select' , function (e){
                    if (item.hasAttribute('data-autotab')) {
                        var el =  Y.one('#'+ item.getAttribute('data-autotab'));
                        if (!e.inputNode.hasClass('J_endDate') && el && el.hasClass('required')) {
                            setTimeout(function (){
                                el.focus();
                            },200);
                        }
                    }
                    //如果SELECT事件被返程日历选框触发
                    if (e.inputNode.hasClass('J_endDate')) {
                      doCheckFlightType();
                    }

                });
            }
        });
			},
			/**
			 * 用户删除返程时间内的值时，自动切换为单程
			 */
			checkOneWay : function (e){
				var target = e.currentTarget ;
				if (e.keyCode == 8 && target.get('value') == '') {
					this.radioNodes.item(0).set('checked' , true );
					this.setFlightType();
				}
			},
			/**
			 * 表单提交验证
			 * @param e
			 */
			doSubmit : function(e){
				e.halt();//阻止提交
				if(this._validateForm()){
					if (this.get('storage')) {//存储用户搜索结果
						this._storageForm();
					}
					//恶心的国际搜索：当选择航程类型为单程时，仍必须传入返程时间字段，值为yyyy-mm-dd
					var ieBackInput = this.form.one('.J_ieEndDate') ,flightType = this.getTypeValue();
					if (ieBackInput && flightType=='0') {
						//ieBackInput.set('disabled' , false);
						ieBackInput.set('value' , 'yyyy-mm-dd');
					}
					if (typeof this.get('afterValidate') === 'function') {//回调
						this.get('afterValidate')(this.form);
					}else{
						this.form.submit();
					}
					setTimeout(function(){
						if (ieBackInput && flightType=='0') {
							ieBackInput.set('value' , '');
						}
					},100);
				}
			},
			/**
			 * 验证表单
			 * @type function
			 */
			_validateForm : function (){
				var _form = this.form , SELF = this ,bDate ,eDate , bDateDesc , formType = 'flight' ,nowTime ;
				var inputNodes  = _form.all('input'),
					requiresNodes = [],
					dateFormatNodes = [],
          cityNodes = [];
        var bindWidget = null , curNode , AC , msgStr ;
				/*
				//返程时间为空，则自动切换为单程
				var endDateInput =_form.one('.J_endDate') ; 
				if (endDateInput && _form.one('.J_type_radio')) {
					if (endDateInput.get('value')=='') {
						this.radioNodes.each(function (item){
							if (item.get('value') == '0') {
								item.set('checked' , true) ;
							}
						});
						this.setFlightType();
					}
				}
				*/
				inputNodes.each(function (item , index){
					if (item.hasClass('required')) {//必填项检查
						if(!SELF._requiredItemCheck(item)){
							requiresNodes.push(item);
							return false;
						}
					}
					var nodeVal = item.get('value');
					if (item.hasClass('dateformat')) {//日期格式必须正确
						if (!dateReg.test(nodeVal)) {
							dateFormatNodes.push(item);
							return false;
						}
					}
          else if ((item.hasClass('J_TripCityInput'))) {
              cityNodes.push(item);
          }
				});
				if (requiresNodes.length > 0) {
          curNode = requiresNodes[0];
					curNode.select();
          bindWidget = TG.SearchForm['#' + requiresNodes[0].get('id')];
          if(bindWidget && curNode.hasAttribute('data-description')){//需要显示错误信息
              bindWidget.showMessage && bindWidget.showMessage('请选择' + curNode.getAttribute('data-description') , curNode);
          }
					return false ;
				}
				if (dateFormatNodes.length > 0) {
          bindWidget = TG.SearchForm['#' + dateFormatNodes[0].get('id')];
          bindWidget && bindWidget.showMessage('日期格式为：yyyy-mm-dd' , 	dateFormatNodes[0]);
					dateFormatNodes[0].select();
					return false ;
				}
				/*验证返程时间不能早于出发时间*/
				bDate = _form.one('.J_depDate');
        eDate = _form.one('.J_endDate');
				if (eDate && bDate && eDate.hasAttribute('data-description') &&  bDate.hasAttribute('data-description')) {
          bDateDesc = bDate.getAttribute('data-description');
          msgStr = "不能早于";
          nowTime = new Date();
          if (bDateDesc.indexOf('入住')>-1) {
              msgStr = '不能早于/等于';
              formType = 'hotel';
          }
          //出发日期不能早于今天
          if ( this._toMs(bDate.get('value'))  < new Date(nowTime.getFullYear(),nowTime.getMonth(),nowTime.getDate())) {
              bindWidget = TG.SearchForm['#' + bDate.get('id')];
              bindWidget && bindWidget.showMessage(bDate.getAttribute('data-description')+'不能早于今天，请重新选择', 	bDate);
              return false ;
          }
          //出发日期不能早于今天
					if ((formType=='flight' && this._toMs(eDate.get('value')) < this._toMs(bDate.get('value'))) || (formType=='hotel' && this._toMs(eDate.get('value')) <= this._toMs(bDate.get('value')))) {
            bindWidget = TG.SearchForm['#' + eDate.get('id')];
						Y.later(50,this,function(){
							eDate.select();
              bindWidget && bindWidget.showMessage(eDate.getAttribute('data-description')+ msgStr +bDate.getAttribute('data-description') +'，请重新选择', 	eDate);
						});
						return false ;
					}
				}
        
        //验证出发到达城市是否相同
        if (typeof cityNodes[1] != 'undefined') {//可能只有一个城市输入框
          cityNodes[1].get && (AC = TG.SearchForm['#'+ cityNodes[1].get('id')]);
        }
        if (AC && cityNodes.length > 1 && cityNodes[0].get('value') == cityNodes[1].get('value') && cityNodes[0].hasClass('required') && cityNodes[1].hasClass('required')) {
          if(AC.showMessage){
              AC.inputNode.focus();
              AC.showMessage('出发城市和到达城市不能相同，请重新输入');
              return false;
          }
        }
				return true;
			},
      /*
      *将日期转化为毫秒
       */
      _toMs : function (date){
          date = date.split('-');
          return new Date(date[0]/1 , date[1]/1 - 1 , date[2]/1 );
      },
			/**
			 * 保存表单数据
			 */
			_storageForm : function(){
				var inputNodes = this.form.all('input'),
					storageArr = [],
					itemStr  = '';
				inputNodes.each(function (node , i){
					var attr = node.getAttribute('type'),
						nodeValue = node.get('value');
					if (attr == 'text' || attr == 'hidden') {//文本框
						if (nodeValue!='' && !node.get('disabled')) {
							itemStr = node.get('id') + ':' + nodeValue ;
							storageArr.push(itemStr);
						}
						
					}else if(attr == 'radio'){//radio 
						if (node.get('checked')) {
							itemStr = node.get('id') + ':' + nodeValue ;
							storageArr.push(itemStr);
						}
					}
				});
				//保存到本地
				Y.StorageLite.setItem(this.form.get('id') , storageArr.join(','));
			},
			/**
			 * 填充表单默认数据 1.用户当前所在城市 2.用户搜索历史记录
			 */
			setDefaultValue :function (){
				var userCityInput = this.get('defaultCity') ;//用户当前所在城市要填入的INPUT
				var userCity = '';
				if (userCityInput) {
					if (!this.get('storage') && Cookie.get('ect') && this.get('fillCurrentCity')) {
						userCity = Cookie.get('ect').split('|')[1];
						userCityInput.set('value',userCity);
					}
				}
				if (this.get('storage') && Y.StorageLite.getItem(this.form.get('id'))) {//搜索记录数据
					this.storageToInput(Y.StorageLite.getItem(this.form.get('id')));
				}
			},
			/**
			 * 本地数据回填
			 * @param node
			 */
			storageToInput : function (data){
				var SELF = this, isResetDate = false;
				data = data.split(',');
				Array.each(data , function (item,i){
					var item = item.split(':');
					var node = Y.one('#'+item[0]) , nodeValue = item[1] ,bindWidget;
					if (node) {
						switch (node.getAttribute('type')){
							case 'text':
                bindWidget = TG.SearchForm['#' + node.get('id')];
								if (node.hasClass('J_DateInput')) {//输入框为日历时
									if (node.hasClass('J_depDate')) { //出发日期
										if (SELF.isResetDate(nodeValue)) {//如果日期早于今天则设置出发日期为明天
											nodeValue = SELF.getDate(1);
										}
									}else if(node.hasClass('J_endDate')){//返程日期
										if (SELF.isResetDate(nodeValue)) {
											nodeValue = SELF.getDate(3);
										}
									}
								}
								node.set('value' , nodeValue);
                if (node.hasClass('J_DateInput')) {
                   bindWidget && bindWidget.setDateInfo(false , node);
                }
								if (!isSupportPlaceholder) {
									node.removeClass('trip-placeholder');
								}
								break;
							case 'hidden' :
								node.set('value' , nodeValue);
								break ;
							case 'radio' :
								node.set('checked' , true);
								//往返输入框切换
								SELF.setFlightType();
								break;
							default :
								break;
						}
					}	
				});
			},
			/**
			 * 日期检查,返回
			 * @param aData 日期 ['2011-05-14','2011-06-14']
			 * @return Array
			 */
			isResetDate : function (date){
				date = date.split('-');
				return new Date() > new Date(date[0],date[1]-1,date[2]);
			},
			/*
			*获取指定日期的
			*@num_date 指定日期的前后天数 1为明天,2为后天,-1为昨天...
			*/
			getDate : function (num_date){
				function formatdate(str){
					str +='';
					if (str.length == 1) {
						return '0'+str;
					}else{
						return str;
					}
				}
				num_date = num_date || 0;
				var _y,_m,_d;
				var _T = new Date();
				_T.setDate(_T.getDate()+num_date);
				_y = _T.getFullYear();
				_m = formatdate(_T.getMonth() + 1);
				_d = formatdate(_T.getDate()) ;
				return [_y,_m,_d].join('-');
			},
			/**
			 * 必填项检查
			 *@parm node
			 *@return boolean
			 */
			_requiredItemCheck : function(node){
				if (node.get('value') == ''){
					return false;
				}else{
					return true ;
				}
			},
			/**
			 * 出发到达城市互换
			 */
			_trade : function (){
				var _form = this.form ;
				tradeNodes = _form.all('input[data-trade]');
				var arr1 = [] , arr2 = [];
				tradeNodes.each(function (item ,i){
					var _tradeNode = Y.one('#'+item.getAttribute('data-trade'));
					if (_tradeNode) {
						arr1.push(item);
						arr2.push(_tradeNode);
					}
				});
				this.tradeAction(arr1,arr2);
			},
			/**
			 * 互换INPUT节点的VALUE
			 * @param arr1 nodeArray
			 * @param arr2	nodeArray
			 */
			tradeAction : function (arr1,arr2){
				var _tmp ="" , _tmp2 = "";
				Array.each(arr1,function(item,i){
					_tmp = item.get('value');
					_tmp2 = arr2[i].get('value');
					item.set('value', _tmp2);
					arr2[i].set('value',_tmp);
					if (!isSupportPlaceholder) {
						if (_tmp2 == '') {
							item.addClass('trip-placeholder');
							item.set('value', item.getAttribute('placeholder'));
						}else{
							item.removeClass('trip-placeholder');
						}
						if (_tmp == '') {
							arr2[i].addClass('trip-placeholder');
							arr2[i].set('value', arr2[i].getAttribute('placeholder'));
						}else{
							arr2[i].removeClass('trip-placeholder');
						}
					}
				});
			},
			/**
			 * 单程往返类型切换
			 */
			setFlightType : function (){
				var _type = this.getTypeValue(),
					backNode = this.form.one('.search-backitem'),
					backDateNode = backNode.one('input[type=text]');
          
				if (_type == '1') {
					backNode.removeClass('disabled');
					//backDateNode.set('disabled',false);
					backDateNode.addClass('required');
					backDateNode.addClass('dateformat');
				}else{
					backNode.addClass('disabled');
					backDateNode.removeClass('required');
					backDateNode.removeClass('dateformat');

					if (!Y.Modernizr.input.placeholder) {
						backDateNode.set('value',backDateNode.getAttribute('placeholder'));
						backDateNode.addClass('trip-placeholder');
					}else{
						backDateNode.set('value','');
					}
					//backDateNode.set('disabled' , true);
				}
			},
			/**
			 * 获取往返radio值
			 */
			getTypeValue : function (){
				var radioNodes = this.radioNodes ;
				for(var i=0 ; i < radioNodes.size() ; i++){
					if (radioNodes.item(i).get('checked')) {
						return radioNodes.item(i).get('value');
						break;
					}
				}
			}
		},{
			ATTRS:{
				node : {
					setter : Y.one
				},
        fillCurrentCity : {
            value : false 
        },
				storage :{
					value : false
				},
				defaultCity : {
					value : '',
					setter : Y.one
				},
				afterValidate : {
					value : null
				}
			}
		});
	Y.SearchForm= SearchForm;
},'',{requires:['node-base','event-base','cookie','base','trip-modernizr']});/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('jsonp', function(Y) {

var isFunction = Y.Lang.isFunction;

/**
 * <p>Provides a JSONPRequest class for repeated JSONP calls, and a convenience
 * method Y.jsonp(url, callback) to instantiate and send a JSONP request.</p>
 *
 * <p>Both the constructor as well as the convenience function take two
 * parameters: a url string and a callback.</p>
 *
 * <p>The url provided must include the placeholder string
 * &quot;{callback}&quot; which will be replaced by a dynamically
 * generated routing function to pass the data to your callback function.
 * An example url might look like
 * &quot;http://example.com/service?callback={callback}&quot;.</p>
 *
 * <p>The second parameter can be a callback function that accepts the JSON
 * payload as its argument, or a configuration object supporting the keys:</p>
 * <ul>
 *   <li>on - map of callback subscribers
 *      <ul>
 *         <li>success - function handler for successful transmission</li>
 *         <li>failure - function handler for failed transmission</li>
 *         <li>timeout - function handler for transactions that timeout</li>
 *      </ul>
 *  </li>
 *  <li>format  - override function for inserting the proxy name in the url</li>
 *  <li>timeout - the number of milliseconds to wait before giving up</li>
 *  <li>context - becomes <code>this</code> in the callbacks</li>
 *  <li>args    - array of subsequent parameters to pass to the callbacks</li>
 *  <li>allowCache - use the same proxy name for all requests? (boolean)</li>
 * </ul>
 *
 * @module jsonp
 * @class JSONPRequest
 * @constructor
 * @param url {String} the url of the JSONP service
 * @param callback {Object|Function} the default callback configuration or
 *                                   success handler
 */
function JSONPRequest() {
    this._init.apply(this, arguments);
}

JSONPRequest.prototype = {
    /**
     * Number of requests currently pending responses.  Used by connections
     * configured to allowCache to make sure the proxy isn't deleted until
     * the last response has returned.
     *
     * @property _requests
     * @private
     * @type {Number}
     */
    _requests: 0,

    /**
     * Set up the success and failure handlers and the regex pattern used
     * to insert the temporary callback name in the url.
     *
     * @method _init
     * @param url {String} the url of the JSONP service
     * @param callback {Object|Function} Optional success callback or config
     *                  object containing success and failure functions and
     *                  the url regex.
     * @protected
     */
    _init : function (url, callback) {
        this.url = url;

        // Accept a function, an object, or nothing
        callback = (isFunction(callback)) ?
            { on: { success: callback } } :
            callback || {};

        var subs = callback.on || {};

        if (!subs.success) {
            subs.success = this._defaultCallback(url, callback);
        }

        // Apply defaults and store
        this._config = Y.merge({
                context: this,
                args   : [],
                format : this._format,
                allowCache: false
            }, callback, { on: subs });
    },

    /** 
     * Override this method to provide logic to default the success callback if
     * it is not provided at construction.  This is overridden by jsonp-url to
     * parse the callback from the url string.
     * 
     * @method _defaultCallback
     * @param url {String} the url passed at construction
     * @param config {Object} (optional) the config object passed at
     *                        construction
     * @return {Function}
     */
    _defaultCallback: function () {},

    /** 
     * Issues the JSONP request.
     *
     * @method send
     * @param args* {any} any additional arguments to pass to the url formatter
     *              beyond the base url and the proxy function name
     * @chainable
     */
    send : function () {
        var self   = this,
            args   = Y.Array(arguments, 0, true),
            config = self._config,
            proxy  = self._proxy || Y.guid(),
            url;
            
        // TODO: support allowCache as time value
        if (config.allowCache) {
            self._proxy = proxy;

            // In case additional requests are issued before the current request
            // returns, don't remove the proxy.
            self._requests++;
        }

        args.unshift(self.url, 'YUI.Env.JSONP.' + proxy);
        url = config.format.apply(self, args);

        if (!config.on.success) {
            return self;
        }

        function wrap(fn) {
            return (isFunction(fn)) ?
                function (data) {
                    if (!config.allowCache || !--self._requests) {
                        delete YUI.Env.JSONP[proxy];
                    }
                    fn.apply(config.context, [data].concat(config.args));
                } :
                null;
        }

        // Temporary un-sandboxed function alias
        // TODO: queuing
        YUI.Env.JSONP[proxy] = wrap(config.on.success);

        Y.Get.script(url, {
            onFailure: wrap(config.on.failure),
            onTimeout: wrap(config.on.timeout),
            timeout  : config.timeout
        });

        return self;
    },

    /**
     * Default url formatter.  Looks for callback= in the url and appends it
     * if not present.  The supplied proxy name will be assigned to the query
     * param.  Override this method by passing a function as the
     * &quot;format&quot; property in the config object to the constructor.
     *
     * @method _format
     * @param url { String } the original url
     * @param proxy {String} the function name that will be used as a proxy to
     *      the configured callback methods.
     * @param args* {any} additional args passed to send()
     * @return {String} fully qualified JSONP url
     * @protected
     */
    _format: function (url, proxy) {
        return url.replace(/\{callback\}/, proxy);
    }
};

Y.JSONPRequest = JSONPRequest;

/**
 *
 * @method Y.jsonp
 * @param url {String} the url of the JSONP service with the {callback}
 *          placeholder where the callback function name typically goes.
 * @param c {Function|Object} Callback function accepting the JSON payload
 *          as its argument, or a configuration object (see above).
 * @param args* {any} additional arguments to pass to send()
 * @return {JSONPRequest}
 * @static
 */
Y.jsonp = function (url,c) {
    var req = new Y.JSONPRequest(url,c);
    return req.send.apply(req, Y.Array(arguments, 2, true));
};

if (!YUI.Env.JSONP) {
    YUI.Env.JSONP = {};
}


}, '3.3.0' ,{requires:['get','oop']});
YUI.namespace('Y.Mustache');
YUI.add('trip-mustache' , function(Y){

	/*
	  mustache.js — Logic-less templates in JavaScript

	  See http://mustache.github.com/ for more info.
	*/

	var Mustache = function() {
	  var Renderer = function() {}; 

	  Renderer.prototype = {
		otag: "{{",
		ctag: "}}",
		pragmas: {},
		buffer: [],
		pragmas_implemented: {
		  "IMPLICIT-ITERATOR": true
		},
		context: {},

		render: function(template, context, partials, in_recursion) {
		  // reset buffer & set context
		  if(!in_recursion) {
			this.context = context;
			this.buffer = []; // TODO: make this non-lazy
		  }

		  // fail fast
		  if(!this.includes("", template)) {
			if(in_recursion) {
			  return template;
			} else {
			  this.send(template);
			  return;
			}
		  }

		  template = this.render_pragmas(template);
		  var html = this.render_section(template, context, partials);
		  if(in_recursion) {
			return this.render_tags(html, context, partials, in_recursion);
		  }

		  this.render_tags(html, context, partials, in_recursion);
		},

		/*
		  Sends parsed lines
		*/
		send: function(line) {
		  if(line != "") {
			this.buffer.push(line);
		  }
		},

		/*
		  Looks for %PRAGMAS
		*/
		render_pragmas: function(template) {
		  // no pragmas
		  if(!this.includes("%", template)) {
			return template;
		  }

		  var that = this;
		  var regex = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" +
				this.ctag);
		  return template.replace(regex, function(match, pragma, options) {
			if(!that.pragmas_implemented[pragma]) {
			  throw({message:
				"This implementation of mustache doesn't understand the '" +
				pragma + "' pragma"});
			}
			that.pragmas[pragma] = {};
			if(options) {
			  var opts = options.split("=");
			  that.pragmas[pragma][opts[0]] = opts[1];
			}
			return "";
			// ignore unknown pragmas silently
		  });
		},

		/*
		  Tries to find a partial in the curent scope and render it
		*/
		render_partial: function(name, context, partials) {
		  name = this.trim(name);
		  if(!partials || partials[name] === undefined) {
			throw({message: "unknown_partial '" + name + "'"});
		  }
		  if(typeof(context[name]) != "object") {
			return this.render(partials[name], context, partials, true);
		  }
		  return this.render(partials[name], context[name], partials, true);
		},

		/*
		  Renders inverted (^) and normal (#) sections
		*/
		render_section: function(template, context, partials) {
		  if(!this.includes("#", template) && !this.includes("^", template)) {
			return template;
		  }

		  var that = this;
		  // CSW - Added "+?" so it finds the tighest bound, not the widest
		  var regex = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag +
				  "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag +
				  "\\s*", "mg");

		  // for each {{#foo}}{{/foo}} section do...
		  return template.replace(regex, function(match, type, name, content) {
			var value = that.find(name, context);
			if(type == "^") { // inverted section
			  if(!value || that.is_array(value) && value.length === 0) {
				// false or empty list, render it
				return that.render(content, context, partials, true);
			  } else {
				return "";
			  }
			} else if(type == "#") { // normal section
			  if(that.is_array(value)) { // Enumerable, Let's loop!
				return that.map(value, function(row) {
				  return that.render(content, that.create_context(row),
					partials, true);
				}).join("");
			  } else if(that.is_object(value)) { // Object, Use it as subcontext!
				return that.render(content, that.create_context(value),
				  partials, true);
			  } else if(typeof value === "function") {
				// higher order section
				return value.call(context, content, function(text) {
				  return that.render(text, context, partials, true);
				});
			  } else if(value) { // boolean section
				return that.render(content, context, partials, true);
			  } else {
				return "";
			  }
			}
		  });
		},

		/*
		  Replace {{foo}} and friends with values from our view
		*/
		render_tags: function(template, context, partials, in_recursion) {
		  // tit for tat
		  var that = this;

		  var new_regex = function() {
			return new RegExp(that.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" +
			  that.ctag + "+", "g");
		  };

		  var regex = new_regex();
		  var tag_replace_callback = function(match, operator, name) {
			switch(operator) {
			case "!": // ignore comments
			  return "";
			case "=": // set new delimiters, rebuild the replace regexp
			  that.set_delimiters(name);
			  regex = new_regex();
			  return "";
			case ">": // render partial
			  return that.render_partial(name, context, partials);
			case "{": // the triple mustache is unescaped
			  return that.find(name, context);
			default: // escape the value
			  return that.escape(that.find(name, context));
			}
		  };
		  var lines = template.split("\n");
		  for(var i = 0; i < lines.length; i++) {
			lines[i] = lines[i].replace(regex, tag_replace_callback, this);
			if(!in_recursion) {
			  this.send(lines[i]);
			}
		  }

		  if(in_recursion) {
			return lines.join("\n");
		  }
		},

		set_delimiters: function(delimiters) {
		  var dels = delimiters.split(" ");
		  this.otag = this.escape_regex(dels[0]);
		  this.ctag = this.escape_regex(dels[1]);
		},

		escape_regex: function(text) {
		  // thank you Simon Willison
		  if(!arguments.callee.sRE) {
			var specials = [
			  '/', '.', '*', '+', '?', '|',
			  '(', ')', '[', ']', '{', '}', '\\'
			];
			arguments.callee.sRE = new RegExp(
			  '(\\' + specials.join('|\\') + ')', 'g'
			);
		  }
		  return text.replace(arguments.callee.sRE, '\\$1');
		},

		/*
		  find `name` in current `context`. That is find me a value
		  from the view object
		*/
		find: function(name, context) {
		  name = this.trim(name);

		  // Checks whether a value is thruthy or false or 0
		  function is_kinda_truthy(bool) {
			return bool === false || bool === 0 || bool;
		  }

		  var value;
		  if(is_kinda_truthy(context[name])) {
			value = context[name];
		  } else if(is_kinda_truthy(this.context[name])) {
			value = this.context[name];
		  }

		  if(typeof value === "function") {
			return value.apply(context);
		  }
		  if(value !== undefined) {
			return value;
		  }
		  // silently ignore unkown variables
		  return "";
		},

		// Utility methods

		/* includes tag */
		includes: function(needle, haystack) {
		  return haystack.indexOf(this.otag + needle) != -1;
		},

		/*
		  Does away with nasty characters
		*/
		escape: function(s) {
		  s = String(s === null ? "" : s);
		  return s.replace(/&(?!\w+;)|["'<>\\]/g, function(s) {
			switch(s) {
			case "&": return "&amp;";
			case "\\": return "\\\\";
			case '"': return '&quot;';
			case "'": return '&#39;';
			case "<": return "&lt;";
			case ">": return "&gt;";
			default: return s;
			}
		  });
		},

		// by @langalex, support for arrays of strings
		create_context: function(_context) {
		  if(this.is_object(_context)) {
			return _context;
		  } else {
			var iterator = ".";
			if(this.pragmas["IMPLICIT-ITERATOR"]) {
			  iterator = this.pragmas["IMPLICIT-ITERATOR"].iterator;
			}
			var ctx = {};
			ctx[iterator] = _context;
			return ctx;
		  }
		},

		is_object: function(a) {
		  return a && typeof a == "object";
		},

		is_array: function(a) {
		  return Object.prototype.toString.call(a) === '[object Array]';
		},

		/*
		  Gets rid of leading and trailing whitespace
		*/
		trim: function(s) {
		  return s.replace(/^\s*|\s*$/g, "");
		},

		/*
		  Why, why, why? Because IE. Cry, cry cry.
		*/
		map: function(array, fn) {
		  if (typeof array.map == "function") {
			return array.map(fn);
		  } else {
			var r = [];
			var l = array.length;
			for(var i = 0; i < l; i++) {
			  r.push(fn(array[i]));
			}
			return r;
		  }
		}
	  };

	  return({
		name: "mustache.js",
		version: "0.3.1-dev",

		/*
		  Turns a template and view into HTML
		*/
		to_html: function(template, view, partials, send_fun) {
		  var renderer = new Renderer();
		  if(send_fun) {
			renderer.send = send_fun;
		  }
		  renderer.render(template, view, partials);
		  if(!send_fun) {
			return renderer.buffer.join("\n");
		  }
		}
	  });
	}();

	Y.Mustache  = Mustache ;
},'0.3.1');


/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('intl', function(Y) {

var _mods = {},

    ROOT_LANG = "yuiRootLang",
    ACTIVE_LANG = "yuiActiveLang",
    NONE = [];

/**
 * Provides utilities to support the management of localized resources (strings and formatting patterns).
 *
 * @module intl
 */

/**
 * The Intl utility provides a central location for managing sets of localized resources (strings and formatting patterns).
 *
 * @class Intl
 * @uses EventTarget
 * @static
 */
Y.mix(Y.namespace("Intl"), {

    /**
     * Private method to retrieve the language hash for a given module.
     *
     * @method _mod
     * @private
     *
     * @param {String} module The name of the module
     * @return {Object} The hash of localized resources for the module, keyed by BCP language tag
     */
    _mod : function(module) {
        if (!_mods[module]) {
            _mods[module] = {};
        }
        return _mods[module];
    },

    /**
     * Sets the active language for the given module.
     *
     * Returns false on failure, which would happen if the language had not been registered through the <a href="#method_add">add()</a> method.
     *
     * @method setLang
     *
     * @param {String} module The module name.
     * @param {String} lang The BCP 47 language tag.
     * @return boolean true if successful, false if not.
     */
    setLang : function(module, lang) {
        var langs = this._mod(module),
            currLang = langs[ACTIVE_LANG],
            exists = !!langs[lang];

        if (exists && lang !== currLang) {
            langs[ACTIVE_LANG] = lang;
            this.fire("intl:langChange", {module: module, prevVal: currLang, newVal: (lang === ROOT_LANG) ? "" : lang});
        }

        return exists;
    },

    /**
     * Get the currently active language for the given module.
     *
     * @method getLang
     *
     * @param {String} module The module name.
     * @return {String} The BCP 47 language tag.
     */
    getLang : function(module) {
        var lang = this._mod(module)[ACTIVE_LANG];
        return (lang === ROOT_LANG) ? "" : lang;
    },

    /**
     * Register a hash of localized resources for the given module and language
     *
     * @method add
     *
     * @param {String} module The module name.
     * @param {String} lang The BCP 47 language tag.
     * @param {Object} strings The hash of localized values, keyed by the string name.
     */
    add : function(module, lang, strings) {
        lang = lang || ROOT_LANG;
        this._mod(module)[lang] = strings;
        this.setLang(module, lang);
    },

    /**
     * Gets the module's localized resources for the currently active language (as provided by the <a href="#method_getLang">getLang</a> method).
     * <p>
     * Optionally, the localized resources for alternate languages which have been added to Intl (see the <a href="#method_add">add</a> method) can
     * be retrieved by providing the BCP 47 language tag as the lang parameter.
     * </p>
     * @method get
     *
     * @param {String} module The module name.
     * @param {String} key Optional. A single resource key. If not provided, returns a copy (shallow clone) of all resources.
     * @param {String} lang Optional. The BCP 47 language tag. If not provided, the module's currently active language is used.
     * @return String | Object A copy of the module's localized resources, or a single value if key is provided.
     */
    get : function(module, key, lang) {
        var mod = this._mod(module),
            strs;

        lang = lang || mod[ACTIVE_LANG];
        strs = mod[lang] || {};

        return (key) ? strs[key] : Y.merge(strs);
    },

    /**
     * Gets the list of languages for which localized resources are available for a given module, based on the module
     * meta-data (part of loader). If loader is not on the page, returns an empty array.
     *
     * @method getAvailableLangs
     * @param {String} module The name of the module
     * @return {Array} The array of languages available.
     */
    getAvailableLangs : function(module) {
        var loader = Y.Env._loader,
            mod = loader && loader.moduleInfo[module],
            langs = mod && mod.lang;
        return (langs) ? langs.concat() : NONE;

    }
});

Y.augment(Y.Intl, Y.EventTarget);

/**
 * Notification event to indicate when the lang for a module has changed. There is no default behavior associated with this event,
 * so the on and after moments are equivalent.
 *
 * @event intl:langChange
 * @param {EventFacade} e The event facade
 * <p>The event facade contains:</p>
 * <dl>
 *     <dt>module</dt><dd>The name of the module for which the language changed</dd>
 *     <dt>newVal</dt><dd>The new language tag</dd>
 *     <dt>prevVal</dt><dd>The current language tag</dd>
 * </dl>
 */
Y.Intl.publish("intl:langChange", {emitFacade:true});


}, '3.3.0' ,{requires:['event-custom']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add("lang/autocomplete-list",function(a){a.Intl.add("autocomplete-list","",{item_selected:"{item} selected.",items_available:"Suggestions are available. Use the up and down arrow keys to select suggestions."});},"3.3.0");YUI.add("lang/autocomplete",function(a){},"3.3.0",{use:["lang/autocomplete-list"]});/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('array-extras', function(Y) {

/**
 * Collection utilities beyond what is provided in the YUI core
 * @module collection
 * @submodule array-extras
 */

var L = Y.Lang, Native = Array.prototype, A = Y.Array;

/**
 * Adds the following array utilities to the YUI instance
 * (Y.Array).  This is in addition to the methods provided
 * in the core.
 * @class YUI~array~extras
 */

/**
 * Returns the index of the last item in the array that contains the specified
 * value, or -1 if the value isn't found.
 * @method Array.lastIndexOf
 * @static
 * @param {Array} a Array to search in.
 * @param {any} val Value to search for.
 * @param {Number} fromIndex (optional) Index at which to start searching
 *   backwards. Defaults to the array's length - 1. If negative, it will be
 *   taken as an offset from the end of the array. If the calculated index is
 *   less than 0, the array will not be searched and -1 will be returned.
 * @return {Number} Index of the item that contains the value, or -1 if not
 *   found.
 */
A.lastIndexOf = Native.lastIndexOf ?
    function(a, val, fromIndex) {
        // An undefined fromIndex is still considered a value by some (all?)
        // native implementations, so we can't pass it unless it's actually
        // specified.
        return fromIndex || fromIndex === 0 ? a.lastIndexOf(val, fromIndex) :
                a.lastIndexOf(val);
    } :
    function(a, val, fromIndex) {
        var len = a.length,
            i   = len - 1;

        if (fromIndex || fromIndex === 0) {
            i = Math.min(fromIndex < 0 ? len + fromIndex : fromIndex, len);
        }

        if (i > -1 && len > 0) {
            for (; i > -1; --i) {
                if (a[i] === val) {
                    return i;
                }
            }
        }

        return -1;
    };

/**
 * Returns a copy of the specified array with duplicate items removed.
 * @method Array.unique
 * @param {Array} a Array to dedupe.
 * @return {Array} Copy of the array with duplicate items removed.
 * @static
 */
A.unique = function(a, sort) {
    // Note: the sort param is deprecated and intentionally undocumented since
    // YUI 3.3.0. It never did what the API docs said it did (see the older
    // comment below as well).
    var i       = 0,
        len     = a.length,
        results = [],
        item, j;

    for (; i < len; ++i) {
        item = a[i];

        // This loop iterates over the results array in reverse order and stops
        // if it finds an item that matches the current input array item (a
        // dupe). If it makes it all the way through without finding a dupe, the
        // current item is pushed onto the results array.
        for (j = results.length; j > -1; --j) {
            if (item === results[j]) {
                break;
            }
        }

        if (j === -1) {
            results.push(item);
        }
    }

    // Note: the sort option doesn't really belong here... I think it was added
    // because there was a way to fast path the two operations together.  That
    // implementation was not working, so I replaced it with the following.
    // Leaving it in so that the API doesn't get broken.
    if (sort) {
        if (L.isNumber(results[0])) {
            results.sort(A.numericSort);
        } else {
            results.sort();
        }
    }

    return results;
};

/**
* Executes the supplied function on each item in the array. Returns a new array
* containing the items for which the supplied function returned a truthy value.
* @method Array.filter
* @param {Array} a Array to filter.
* @param {Function} f Function to execute on each item.
* @param {Object} o Optional context object.
* @static
* @return {Array} Array of items for which the supplied function returned a
*   truthy value (empty if it never returned a truthy value).
*/
A.filter = Native.filter ?
    function(a, f, o) {
        return a.filter(f, o);
    } :
    function(a, f, o) {
        var i       = 0,
            len     = a.length,
            results = [],
            item;

        for (; i < len; ++i) {
            item = a[i];

            if (f.call(o, item, i, a)) {
                results.push(item);
            }
        }

        return results;
    };

/**
* The inverse of filter. Executes the supplied function on each item.
* Returns a new array containing the items that the supplied
* function returned *false* for.
* @method Array.reject
* @param {Array} a the array to iterate.
* @param {Function} f the function to execute on each item.
* @param {object} o Optional context object.
* @static
* @return {Array} The items on which the supplied function
* returned false.
*/
A.reject = function(a, f, o) {
    return A.filter(a, function(item, i, a) {
        return !f.call(o, item, i, a);
    });
};

/**
* Executes the supplied function on each item in the array.
* Iteration stops if the supplied function does not return
* a truthy value.
* @method Array.every
* @param {Array} a the array to iterate.
* @param {Function} f the function to execute on each item.
* @param {object} o Optional context object.
* @static
* @return {boolean} true if every item in the array returns true
* from the supplied function.
*/
A.every = Native.every ?
    function(a, f, o) {
        return a.every(f, o);
    } :
    function(a, f, o) {
        for (var i = 0, l = a.length; i < l; ++i) {
            if (!f.call(o, a[i], i, a)) {
                return false;
            }
        }

        return true;
    };

/**
* Executes the supplied function on each item in the array.
* @method Array.map
* @param {Array} a the array to iterate.
* @param {Function} f the function to execute on each item.
* @param {object} o Optional context object.
* @static
* @return {Array} A new array containing the return value
* of the supplied function for each item in the original
* array.
*/
A.map = Native.map ?
    function(a, f, o) {
        return a.map(f, o);
    } :
    function(a, f, o) {
        var i       = 0,
            len     = a.length,
            results = a.concat();

        for (; i < len; ++i) {
            results[i] = f.call(o, a[i], i, a);
        }

        return results;
    };


/**
* Executes the supplied function on each item in the array.
* Reduce "folds" the array into a single value.  The callback
* function receives four arguments:
* the value from the previous callback call (or the initial value),
* the value of the current element, the current index, and
* the array over which iteration is occurring.
* @method Array.reduce
* @param {Array} a the array to iterate.
* @param {any} init The initial value to start from.
* @param {Function} f the function to execute on each item. It
* is responsible for returning the updated value of the
* computation.
* @param {object} o Optional context object.
* @static
* @return {any} A value that results from iteratively applying the
* supplied function to each element in the array.
*/
A.reduce = Native.reduce ?
    function(a, init, f, o) {
        // ES5 Array.reduce doesn't support a thisObject, so we need to
        // implement it manually
        return a.reduce(function(init, item, i, a) {
            return f.call(o, init, item, i, a);
        }, init);
    } :
    function(a, init, f, o) {
        var i      = 0,
            len    = a.length,
            result = init;

        for (; i < len; ++i) {
            result = f.call(o, result, a[i], i, a);
        }

        return result;
    };


/**
* Executes the supplied function on each item in the array,
* searching for the first item that matches the supplied
* function.
* @method Array.find
* @param {Array} a the array to search.
* @param {Function} f the function to execute on each item.
* Iteration is stopped as soon as this function returns true
* on an item.
* @param {object} o Optional context object.
* @static
* @return {object} the first item that the supplied function
* returns true for, or null if it never returns true.
*/
A.find = function(a, f, o) {
    for (var i = 0, l = a.length; i < l; i++) {
        if (f.call(o, a[i], i, a)) {
            return a[i];
        }
    }
    return null;
};

/**
* Iterates over an array, returning a new array of all the elements
* that match the supplied regular expression
* @method Array.grep
* @param {Array} a a collection to iterate over.
* @param {RegExp} pattern The regular expression to test against
* each item.
* @static
* @return {Array} All the items in the collection that
* produce a match against the supplied regular expression.
* If no items match, an empty array is returned.
*/
A.grep = function(a, pattern) {
    return A.filter(a, function(item, index) {
        return pattern.test(item);
    });
};


/**
* Partitions an array into two new arrays, one with the items
* that match the supplied function, and one with the items that
* do not.
* @method Array.partition
* @param {Array} a a collection to iterate over.
* @param {Function} f a function that will receive each item
* in the collection and its index.
* @param {object} o Optional execution context of f.
* @static
* @return {object} An object with two members, 'matches' and 'rejects',
* that are arrays containing the items that were selected or
* rejected by the test function (or an empty array).
*/
A.partition = function(a, f, o) {
    var results = {
        matches: [],
        rejects: []
    };

    A.each(a, function(item, index) {
        var set = f.call(o, item, index, a) ? results.matches : results.rejects;
        set.push(item);
    });

    return results;
};

/**
* Creates an array of arrays by pairing the corresponding
* elements of two arrays together into a new array.
* @method Array.zip
* @param {Array} a a collection to iterate over.
* @param {Array} a2 another collection whose members will be
* paired with members of the first parameter.
* @static
* @return {array} An array of arrays formed by pairing each element
* of the first collection with an item in the second collection
* having the corresponding index.
*/
A.zip = function(a, a2) {
    var results = [];
    A.each(a, function(item, index) {
        results.push([item, a2[index]]);
    });
    return results;
};

/**
 * forEach is an alias of Array.each.  This is part of the
 * collection module.
 * @method Array.forEach
 */
A.forEach = A.each;


}, '3.3.0' );
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('escape', function(Y) {

/**
 * Provides utility methods for escaping strings.
 *
 * @module escape
 * @class Escape
 * @static
 * @since 3.3.0
 */

var HTML_CHARS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;'
    },

Escape = {
    // -- Public Static Methods ------------------------------------------------

    /**
     * <p>
     * Returns a copy of the specified string with special HTML characters
     * escaped. The following characters will be converted to their
     * corresponding character entities:
     * <code>&amp; &lt; &gt; &quot; &#x27; &#x2F; &#x60;</code>
     * </p>
     *
     * <p>
     * This implementation is based on the
     * <a href="http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet">OWASP
     * HTML escaping recommendations</a>. In addition to the characters
     * in the OWASP recommendation, we also escape the <code>&#x60;</code>
     * character, since IE interprets it as an attribute delimiter when used in
     * innerHTML.
     * </p>
     *
     * @method html
     * @param {String} string String to escape.
     * @return {String} Escaped string.
     * @static
     */
    html: function (string) {
        return string.replace(/[&<>"'\/`]/g, Escape._htmlReplacer);
    },

    /**
     * Returns a copy of the specified string with special regular expression
     * characters escaped, allowing the string to be used safely inside a regex.
     * The following characters, and all whitespace characters, are escaped:
     * <code>- # $ ^ * ( ) + [ ] { } | \ , . ?</code>
     *
     * @method regex
     * @param {String} string String to escape.
     * @return {String} Escaped string.
     * @static
     */
    regex: function (string) {
        return string.replace(/[\-#$\^*()+\[\]{}|\\,.?\s]/g, '\\$&');
    },

    // -- Protected Static Methods ---------------------------------------------

    /**
     * Regex replacer for HTML escaping.
     *
     * @method _htmlReplacer
     * @param {String} match Matched character (must exist in HTML_CHARS).
     * @returns {String} HTML entity.
     * @static
     * @protected
     */
    _htmlReplacer: function (match) {
        return HTML_CHARS[match];
    }
};

Escape.regexp = Escape.regex;

Y.Escape = Escape;


}, '3.3.0' );
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('event-valuechange', function(Y) {

/**
 * Adds a synthetic <code>valueChange</code> event that fires when the
 * <code>value</code> property of an input field or textarea changes as a result
 * of a keystroke, mouse operation, or input method editor (IME) input event.
 *
 * @module event-valuechange
 */

/**
 * Provides the implementation for the synthetic <code>valueChange</code> event.
 *
 * @class ValueChange
 * @static
 */

var YArray = Y.Array,

    VALUE = 'value',

// Just a simple namespace to make methods overridable.
VC = {
    // -- Static Constants -----------------------------------------------------

    /**
     * Interval (in milliseconds) at which to poll for changes to the value of
     * an element with one or more <code>valueChange</code> subscribers when the
     * user is likely to be interacting with it.
     *
     * @property POLL_INTERVAL
     * @type Number
     * @default 50
     * @static
     */
    POLL_INTERVAL: 50,

    /**
     * Timeout (in milliseconds) after which to stop polling when there hasn't
     * been any new activity (keypresses, mouse clicks, etc.) on an element.
     *
     * @property TIMEOUT
     * @type Number
     * @default 10000
     * @static
     */
    TIMEOUT: 10000,

    // -- Protected Static Properties ------------------------------------------
    _history  : {},
    _intervals: {},
    _notifiers: {},
    _timeouts : {},

    // -- Protected Static Methods ---------------------------------------------

    /**
     * Called at an interval to poll for changes to the value of the specified
     * node.
     *
     * @method _poll
     * @param {Node} node
     * @param {String} stamp
     * @param {EventFacade} e
     * @protected
     * @static
     */
    _poll: function (node, stamp, e) {
        var domNode = node._node, // performance cheat; getValue() is a big hit when polling
            newVal  = domNode && domNode.value,
            prevVal = VC._history[stamp],
            facade;

        if (!domNode) {
            VC._stopPolling(node, stamp);
            return;
        }

        if (newVal !== prevVal) {
            VC._history[stamp] = newVal;

            facade = {
                _event : e,
                newVal : newVal,
                prevVal: prevVal
            };

            YArray.each(VC._notifiers[stamp], function (notifier) {
                notifier.fire(facade);
            });

            VC._refreshTimeout(node, stamp);
        }
    },

    /**
     * Restarts the inactivity timeout for the specified node.
     *
     * @method _refreshTimeout
     * @param {Node} node
     * @param {String} stamp
     * @protected
     * @static
     */
    _refreshTimeout: function (node, stamp) {
        VC._stopTimeout(node, stamp); // avoid dupes

        // If we don't see any changes within the timeout period (10 seconds by
        // default), stop polling.
        VC._timeouts[stamp] = setTimeout(function () {
            VC._stopPolling(node, stamp);
        }, VC.TIMEOUT);

    },

    /**
     * Begins polling for changes to the <code>value</code> property of the
     * specified node. If polling is already underway for the specified node,
     * it will not be restarted unless the <i>force</i> parameter is
     * <code>true</code>
     *
     * @method _startPolling
     * @param {Node} node Node to watch.
     * @param {String} stamp (optional) Object stamp for the node. Will be
     *   generated if not provided (provide it to improve performance).
     * @param {EventFacade} e (optional) Event facade of the event that
     *   initiated the polling (if any).
     * @param {Boolean} force (optional) If <code>true</code>, polling will be
     *   restarted even if we're already polling this node.
     * @protected
     * @static
     */
    _startPolling: function (node, stamp, e, force) {
        if (!stamp) {
            stamp = Y.stamp(node);
        }

        // Don't bother continuing if we're already polling.
        if (!force && VC._intervals[stamp]) {
            return;
        }

        VC._stopPolling(node, stamp); // avoid dupes

        // Poll for changes to the node's value. We can't rely on keyboard
        // events for this, since the value may change due to a mouse-initiated
        // paste event, an IME input event, or for some other reason that
        // doesn't trigger a key event.
        VC._intervals[stamp] = setInterval(function () {
            VC._poll(node, stamp, e);
        }, VC.POLL_INTERVAL);

        VC._refreshTimeout(node, stamp, e);

    },

    /**
     * Stops polling for changes to the specified node's <code>value</code>
     * attribute.
     *
     * @method _stopPolling
     * @param {Node} node
     * @param {String} stamp (optional)
     * @protected
     * @static
     */
    _stopPolling: function (node, stamp) {
        if (!stamp) {
            stamp = Y.stamp(node);
        }

        VC._intervals[stamp] = clearInterval(VC._intervals[stamp]);
        VC._stopTimeout(node, stamp);

    },

    /**
     * Clears the inactivity timeout for the specified node, if any.
     *
     * @method _stopTimeout
     * @param {Node} node
     * @param {String} stamp (optional)
     * @protected
     * @static
     */
    _stopTimeout: function (node, stamp) {
        if (!stamp) {
            stamp = Y.stamp(node);
        }

        VC._timeouts[stamp] = clearTimeout(VC._timeouts[stamp]);
    },

    // -- Protected Static Event Handlers --------------------------------------

    /**
     * Stops polling when a node's blur event fires.
     *
     * @method _onBlur
     * @param {EventFacade} e
     * @protected
     * @static
     */
    _onBlur: function (e) {
        VC._stopPolling(e.currentTarget);
    },

    /**
     * Resets a node's history and starts polling when a focus event occurs.
     *
     * @method _onFocus
     * @param {EventFacade} e
     * @protected
     * @static
     */
    _onFocus: function (e) {
        var node = e.currentTarget;

        VC._history[Y.stamp(node)] = node.get(VALUE);
        VC._startPolling(node, null, e);
    },

    /**
     * Starts polling when a node receives a keyDown event.
     *
     * @method _onKeyDown
     * @param {EventFacade} e
     * @protected
     * @static
     */
    _onKeyDown: function (e) {
        VC._startPolling(e.currentTarget, null, e);
    },

    /**
     * Starts polling when an IME-related keyUp event occurs on a node.
     *
     * @method _onKeyUp
     * @param {EventFacade} e
     * @protected
     * @static
     */
    _onKeyUp: function (e) {
        // These charCodes indicate that an IME has started. We'll restart
        // polling and give the IME up to 10 seconds (by default) to finish.
        if (e.charCode === 229 || e.charCode === 197) {
            VC._startPolling(e.currentTarget, null, e, true);
        }
    },

    /**
     * Starts polling when a node receives a mouseDown event.
     *
     * @method _onMouseDown
     * @param {EventFacade} e
     * @protected
     * @static
     */
    _onMouseDown: function (e) {
        VC._startPolling(e.currentTarget, null, e);
    },

    /**
     * Called when event-valuechange receives a new subscriber.
     *
     * @method _onSubscribe
     * @param {Node} node
     * @param {Subscription} subscription
     * @param {SyntheticEvent.Notifier} notifier
     * @protected
     * @static
     */
    _onSubscribe: function (node, subscription, notifier) {
        var stamp     = Y.stamp(node),
            notifiers = VC._notifiers[stamp];

        VC._history[stamp] = node.get(VALUE);

        notifier._handles = node.on({
            blur     : VC._onBlur,
            focus    : VC._onFocus,
            keydown  : VC._onKeyDown,
            keyup    : VC._onKeyUp,
            mousedown: VC._onMouseDown
        });

        if (!notifiers) {
            notifiers = VC._notifiers[stamp] = [];
        }

        notifiers.push(notifier);
    },

    /**
     * Called when event-valuechange loses a subscriber.
     *
     * @method _onUnsubscribe
     * @param {Node} node
     * @param {Subscription} subscription
     * @param {SyntheticEvent.Notifier} notifier
     * @protected
     * @static
     */
    _onUnsubscribe: function (node, subscription, notifier) {
        var stamp     = Y.stamp(node),
            notifiers = VC._notifiers[stamp],
            index     = YArray.indexOf(notifiers, notifier);

        notifier._handles.detach();

        if (index !== -1) {
            notifiers.splice(index, 1);

            if (!notifiers.length) {
                VC._stopPolling(node, stamp);

                delete VC._notifiers[stamp];
                delete VC._history[stamp];
            }
        }
    }
};

/**
 * <p>
 * Synthetic event that fires when the <code>value</code> property of an input
 * field or textarea changes as a result of a keystroke, mouse operation, or
 * input method editor (IME) input event.
 * </p>
 *
 * <p>
 * Unlike the <code>onchange</code> event, this event fires when the value
 * actually changes and not when the element loses focus. This event also
 * reports IME and multi-stroke input more reliably than <code>oninput</code> or
 * the various key events across browsers.
 * </p>
 *
 * <p>
 * This event is provided by the <code>event-valuechange</code> module.
 * </p>
 *
 * <p>
 * <strong>Usage example:</strong>
 * </p>
 *
 * <code><pre>
 * YUI().use('event-valuechange', function (Y) {
 * &nbsp;&nbsp;Y.one('input').on('valueChange', function (e) {
 * &nbsp;&nbsp;&nbsp;&nbsp;// Handle valueChange events on the first input element on the page.
 * &nbsp;&nbsp;});
 * });
 * </pre></code>
 *
 * @event valueChange
 * @param {EventFacade} e Event facade with the following additional
 *   properties:
 *
 * <dl>
 *   <dt>prevVal (String)</dt>
 *   <dd>
 *     Previous value before the latest change.
 *   </dd>
 *
 *   <dt>newVal (String)</dt>
 *   <dd>
 *     New value after the latest change.
 *   </dd>
 * </dl>
 *
 * @for YUI
 */

Y.Event.define('valueChange', {
    detach: VC._onUnsubscribe,
    on    : VC._onSubscribe,

    publishConfig: {
        emitFacade: true
    }
});

Y.ValueChange = VC;


}, '3.3.0' ,{requires:['event-focus', 'event-synthetic']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('selector-css3', function(Y) {

/**
 * The selector css3 module provides support for css3 selectors.
 * @module dom
 * @submodule selector-css3
 * @for Selector
 */

/*
    an+b = get every _a_th node starting at the _b_th
    0n+b = no repeat ("0" and "n" may both be omitted (together) , e.g. "0n+1" or "1", not "0+1"), return only the _b_th element
    1n+b =  get every element starting from b ("1" may may be omitted, e.g. "1n+0" or "n+0" or "n")
    an+0 = get every _a_th element, "0" may be omitted 
*/

Y.Selector._reNth = /^(?:([\-]?\d*)(n){1}|(odd|even)$)*([\-+]?\d*)$/;

Y.Selector._getNth = function(node, expr, tag, reverse) {
    Y.Selector._reNth.test(expr);
    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
        result = [],
        siblings = Y.Selector._children(node.parentNode, tag),
        op;

    if (oddeven) {
        a = 2; // always every other
        op = '+';
        n = 'n';
        b = (oddeven === 'odd') ? 1 : 0;
    } else if ( isNaN(a) ) {
        a = (n) ? 1 : 0; // start from the first or no repeat
    }

    if (a === 0) { // just the first
        if (reverse) {
            b = siblings.length - b + 1; 
        }

        if (siblings[b - 1] === node) {
            return true;
        } else {
            return false;
        }

    } else if (a < 0) {
        reverse = !!reverse;
        a = Math.abs(a);
    }

    if (!reverse) {
        for (var i = b - 1, len = siblings.length; i < len; i += a) {
            if ( i >= 0 && siblings[i] === node ) {
                return true;
            }
        }
    } else {
        for (var i = siblings.length - b, len = siblings.length; i >= 0; i -= a) {
            if ( i < len && siblings[i] === node ) {
                return true;
            }
        }
    }
    return false;
};

Y.mix(Y.Selector.pseudos, {
    'root': function(node) {
        return node === node.ownerDocument.documentElement;
    },

    'nth-child': function(node, expr) {
        return Y.Selector._getNth(node, expr);
    },

    'nth-last-child': function(node, expr) {
        return Y.Selector._getNth(node, expr, null, true);
    },

    'nth-of-type': function(node, expr) {
        return Y.Selector._getNth(node, expr, node.tagName);
    },
     
    'nth-last-of-type': function(node, expr) {
        return Y.Selector._getNth(node, expr, node.tagName, true);
    },
     
    'last-child': function(node) {
        var children = Y.Selector._children(node.parentNode);
        return children[children.length - 1] === node;
    },

    'first-of-type': function(node) {
        return Y.Selector._children(node.parentNode, node.tagName)[0] === node;
    },
     
    'last-of-type': function(node) {
        var children = Y.Selector._children(node.parentNode, node.tagName);
        return children[children.length - 1] === node;
    },
     
    'only-child': function(node) {
        var children = Y.Selector._children(node.parentNode);
        return children.length === 1 && children[0] === node;
    },

    'only-of-type': function(node) {
        var children = Y.Selector._children(node.parentNode, node.tagName);
        return children.length === 1 && children[0] === node;
    },

    'empty': function(node) {
        return node.childNodes.length === 0;
    },

    'not': function(node, expr) {
        return !Y.Selector.test(node, expr);
    },

    'contains': function(node, expr) {
        var text = node.innerText || node.textContent || '';
        return text.indexOf(expr) > -1;
    },

    'checked': function(node) {
        return (node.checked === true || node.selected === true);
    },

    enabled: function(node) {
        return (node.disabled !== undefined && !node.disabled);
    },

    disabled: function(node) {
        return (node.disabled);
    }
});

Y.mix(Y.Selector.operators, {
    '^=': '^{val}', // Match starts with value
    '$=': '{val}$', // Match ends with value
    '*=': '{val}' // Match contains value as substring 
});

Y.Selector.combinators['~'] = {
    axis: 'previousSibling'
};


}, '3.3.0' ,{requires:['dom-base', 'selector-native', 'selector-css2']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('classnamemanager', function(Y) {

/**
* Contains a singleton (ClassNameManager) that enables easy creation and caching of 
* prefixed class names.
* @module classnamemanager
*/

/**
 * A singleton class providing: 
 * 
 * <ul>
 *    <li>Easy creation of prefixed class names</li>
 *    <li>Caching of previously created class names for improved performance.</li>
 * </ul>
 * 
 * @class ClassNameManager
 * @static 
 */

// String constants
var CLASS_NAME_PREFIX = 'classNamePrefix',
	CLASS_NAME_DELIMITER = 'classNameDelimiter',
    CONFIG = Y.config;

// Global config

/**
 * Configuration property indicating the prefix for all CSS class names in this YUI instance.
 *
 * @property Y.config.classNamePrefix
 * @type {String}
 * @default "yui"
 * @static
 */
CONFIG[CLASS_NAME_PREFIX] = CONFIG[CLASS_NAME_PREFIX] || 'yui3';

/**
 * Configuration property indicating the delimiter used to compose all CSS class names in
 * this YUI instance.
 *
 * @property Y.config.classNameDelimiter
 * @type {String}
 * @default "-"
 * @static
 */
CONFIG[CLASS_NAME_DELIMITER] = CONFIG[CLASS_NAME_DELIMITER] || '-';

Y.ClassNameManager = function () {

	var sPrefix    = CONFIG[CLASS_NAME_PREFIX],
		sDelimiter = CONFIG[CLASS_NAME_DELIMITER];

	return {

		/**
		 * Returns a class name prefixed with the the value of the 
		 * <code>Y.config.classNamePrefix</code> attribute + the provided strings.
		 * Uses the <code>Y.config.classNameDelimiter</code> attribute to delimit the 
		 * provided strings. E.g. Y.ClassNameManager.getClassName('foo','bar'); // yui-foo-bar
		 *
		 * @method getClassName
		 * @param {String}+ classnameSection one or more classname sections to be joined
		 * @param {Boolean} skipPrefix If set to true, the classname will not be prefixed with the default Y.config.classNameDelimiter value.  
		 */
		getClassName: Y.cached(function () {

            var args = Y.Array(arguments);

            if (args[args.length-1] !== true) {
                args.unshift(sPrefix);
            } else {
                args.pop();
            }

			return args.join(sDelimiter);
		})

	};

}();


}, '3.3.0' );
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('widget-base', function(Y) {

/**
 * Provides the base Widget class, with HTML Parser support
 *
 * @module widget
 */

/**
 * Provides the base Widget class
 *
 * @module widget
 * @submodule widget-base
 */
var L = Y.Lang,
    Node = Y.Node,

    ClassNameManager = Y.ClassNameManager,

    _getClassName = ClassNameManager.getClassName,
    _getWidgetClassName,

    _toInitialCap = Y.cached(function(str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }),

    // K-Weight, IE GC optimizations
    CONTENT = "content",
    VISIBLE = "visible",
    HIDDEN = "hidden",
    DISABLED = "disabled",
    FOCUSED = "focused",
    WIDTH = "width",
    HEIGHT = "height",
    BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    PARENT_NODE = "parentNode",
    OWNER_DOCUMENT = "ownerDocument",
    AUTO = "auto",
    SRC_NODE = "srcNode",
    BODY = "body",
    TAB_INDEX = "tabIndex",
    ID = "id",
    RENDER = "render",
    RENDERED = "rendered",
    DESTROYED = "destroyed",
    STRINGS = "strings",
    DIV = "<div></div>",
    CHANGE = "Change",
    LOADING = "loading",
 
    _UISET = "_uiSet",

    EMPTY_STR = "",
    EMPTY_FN = function() {},

    TRUE = true,
    FALSE = false,

    UI,
    ATTRS = {},
    UI_ATTRS = [VISIBLE, DISABLED, HEIGHT, WIDTH, FOCUSED],

    WEBKIT = Y.UA.webkit,

    // Widget nodeguid-to-instance map.
    _instances = {};

/**
 * A base class for widgets, providing:
 * <ul>
 *    <li>The render lifecycle method, in addition to the init and destroy 
 *        lifecycle methods provide by Base</li>
 *    <li>Abstract methods to support consistent MVC structure across 
 *        widgets: renderer, renderUI, bindUI, syncUI</li>
 *    <li>Support for common widget attributes, such as boundingBox, contentBox, visible, 
 *        disabled, focused, strings</li>
 * </ul>
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class Widget
 * @constructor
 * @extends Base
 */
function Widget(config) {

    // kweight
    var widget = this,
        parentNode,
        render, 
        constructor = widget.constructor; 

    widget._strs = {};
    widget._cssPrefix = constructor.CSS_PREFIX || _getClassName(constructor.NAME.toLowerCase());

    Widget.superclass.constructor.apply(widget, arguments);

    render = widget.get(RENDER);

    if (render) {
        // Render could be a node or boolean
        if (render !== TRUE) {
            parentNode = render;
        }
        widget.render(parentNode);
    }
}

/**
 * Static property provides a string to identify the class.
 * <p>
 * Currently used to apply class identifiers to the bounding box 
 * and to classify events fired by the widget.
 * </p>
 *
 * @property Widget.NAME
 * @type String
 * @static
 */
Widget.NAME = "widget";

/**
 * Constant used to identify state changes originating from
 * the DOM (as opposed to the JavaScript model).
 *
 * @property Widget.UI_SRC
 * @type String
 * @static
 * @final
 */
UI = Widget.UI_SRC = "ui";

/**
 * Static property used to define the default attribute 
 * configuration for the Widget.
 * 
 * @property Widget.ATTRS
 * @type Object
 * @static
 */
Widget.ATTRS = ATTRS;

// Trying to optimize kweight by setting up attrs this way saves about 0.4K min'd

/**
 * @attribute id
 * @writeOnce
 * @default Generated using guid()
 * @type String
 */

ATTRS[ID] = {
    valueFn: "_guid",
    writeOnce: TRUE
};

/**
 * Flag indicating whether or not this Widget
 * has been through the render lifecycle phase.
 *
 * @attribute rendered
 * @readOnly
 * @default false
 * @type boolean
 */
ATTRS[RENDERED] = {
    value:FALSE,
    readOnly: TRUE
};

/**
 * @attribute boundingBox
 * @description The outermost DOM node for the Widget, used for sizing and positioning 
 * of a Widget as well as a containing element for any decorator elements used 
 * for skinning.
 * @type String | Node
 * @writeOnce
 */
ATTRS[BOUNDING_BOX] = {
    value:null,
    setter: "_setBB",
    writeOnce: TRUE
};

/**
 * @attribute contentBox
 * @description A DOM node that is a direct descendant of a Widget's bounding box that 
 * houses its content.
 * @type String | Node
 * @writeOnce
 */
ATTRS[CONTENT_BOX] = {
    valueFn:"_defaultCB",
    setter: "_setCB",
    writeOnce: TRUE
};

/**
 * @attribute tabIndex
 * @description Number (between -32767 to 32767) indicating the widget's 
 * position in the default tab flow.  The value is used to set the 
 * "tabIndex" attribute on the widget's bounding box.  Negative values allow
 * the widget to receive DOM focus programmatically (by calling the focus
 * method), while being removed from the default tab flow.  A value of 
 * null removes the "tabIndex" attribute from the widget's bounding box.
 * @type Number
 * @default null
 */
ATTRS[TAB_INDEX] = {
    value: null,
    validator: "_validTabIndex"
};

/**
 * @attribute focused
 * @description Boolean indicating if the Widget, or one of its descendants, 
 * has focus.
 * @readOnly
 * @default false
 * @type boolean
 */
ATTRS[FOCUSED] = {
    value: FALSE,
    readOnly:TRUE
};

/**
 * @attribute disabled
 * @description Boolean indicating if the Widget should be disabled. The disabled implementation
 * is left to the specific classes extending widget.
 * @default false
 * @type boolean
 */
ATTRS[DISABLED] = {
    value: FALSE
};

/**
 * @attribute visible
 * @description Boolean indicating weather or not the Widget is visible.
 * @default TRUE
 * @type boolean
 */
ATTRS[VISIBLE] = {
    value: TRUE
};

/**
 * @attribute height
 * @description String with units, or number, representing the height of the Widget. If a number is provided,
 * the default unit, defined by the Widgets DEF_UNIT, property is used.
 * @default EMPTY_STR
 * @type {String | Number}
 */
ATTRS[HEIGHT] = {
    value: EMPTY_STR
};

/**
 * @attribute width
 * @description String with units, or number, representing the width of the Widget. If a number is provided,
 * the default unit, defined by the Widgets DEF_UNIT, property is used.
 * @default EMPTY_STR
 * @type {String | Number}
 */
ATTRS[WIDTH] = {
    value: EMPTY_STR
};

/**
 * @attribute strings
 * @description Collection of strings used to label elements of the Widget's UI.
 * @default null
 * @type Object
 */
ATTRS[STRINGS] = {
    value: {},
    setter: "_strSetter",
    getter: "_strGetter"
};

/**
 * Whether or not to render the widget automatically after init, and optionally, to which parent node.
 *
 * @attribute render
 * @type boolean | Node
 * @writeOnce
 */
ATTRS[RENDER] = {
    value:FALSE,
    writeOnce:TRUE
};

/**
 * The css prefix which the static Widget.getClassName method should use when constructing class names
 *
 * @property Widget.CSS_PREFIX
 * @type String
 * @default Widget.NAME.toLowerCase()
 * @private
 * @static
 */
Widget.CSS_PREFIX = _getClassName(Widget.NAME.toLowerCase());

/**
 * Generate a standard prefixed classname for the Widget, prefixed by the default prefix defined
 * by the <code>Y.config.classNamePrefix</code> attribute used by <code>ClassNameManager</code> and 
 * <code>Widget.NAME.toLowerCase()</code> (e.g. "yui-widget-xxxxx-yyyyy", based on default values for 
 * the prefix and widget class name).
 * <p>
 * The instance based version of this method can be used to generate standard prefixed classnames,
 * based on the instances NAME, as opposed to Widget.NAME. This method should be used when you
 * need to use a constant class name across different types instances.
 * </p>
 * @method getClassName
 * @param {String*} args* 0..n strings which should be concatenated, using the default separator defined by ClassNameManager, to create the class name
 */
Widget.getClassName = function() {
    // arguments needs to be array'fied to concat
    return _getClassName.apply(ClassNameManager, [Widget.CSS_PREFIX].concat(Y.Array(arguments), true));
};

_getWidgetClassName = Widget.getClassName;

/**
 * Returns the widget instance whose bounding box contains, or is, the given node. 
 * <p>
 * In the case of nested widgets, the nearest bounding box ancestor is used to
 * return the widget instance.
 * </p>
 * @method Widget.getByNode
 * @static
 * @param node {Node | String} The node for which to return a Widget instance. If a selector
 * string is passed in, which selects more than one node, the first node found is used.
 * @return {Widget} Widget instance, or null if not found.
 */
Widget.getByNode = function(node) {
    var widget,
        widgetMarker = _getWidgetClassName();

    node = Node.one(node);
    if (node) {
        node = node.ancestor("." + widgetMarker, true);
        if (node) {
            widget = _instances[Y.stamp(node, TRUE)];
        }
    }

    return widget || null;
};

Y.extend(Widget, Y.Base, {

    /**
     * Returns a class name prefixed with the the value of the 
     * <code>YUI.config.classNamePrefix</code> attribute + the instances <code>NAME</code> property.
     * Uses <code>YUI.config.classNameDelimiter</code> attribute to delimit the provided strings.
     * e.g. 
     * <code>
     * <pre>
     *    // returns "yui-slider-foo-bar", for a slider instance
     *    var scn = slider.getClassName('foo','bar');
     *
     *    // returns "yui-overlay-foo-bar", for an overlay instance
     *    var ocn = overlay.getClassName('foo','bar');
     * </pre>
     * </code>
     *
     * @method getClassName
     * @param {String}+ One or more classname bits to be joined and prefixed
     */
    getClassName: function () {
        return _getClassName.apply(ClassNameManager, [this._cssPrefix].concat(Y.Array(arguments), true));
    },

    /**
     * Initializer lifecycle implementation for the Widget class. Registers the 
     * widget instance, and runs through the Widget's HTML_PARSER definition. 
     *
     * @method initializer
     * @protected
     * @param  config {Object} Configuration object literal for the widget
     */
    initializer: function(config) {

        _instances[Y.stamp(this.get(BOUNDING_BOX))] = this;

        /**
         * Notification event, which widget implementations can fire, when
         * they change the content of the widget. This event has no default
         * behavior and cannot be prevented, so the "on" or "after"
         * moments are effectively equivalent (with on listeners being invoked before 
         * after listeners).
         *
         * @event widget:contentUpdate
         * @preventable false
         * @param {EventFacade} e The Event Facade
         */

        if (this._applyParser) {
            this._applyParser(config);
        }
    },

    /**
     * Destructor lifecycle implementation for the Widget class. Purges events attached
     * to the bounding box (and all child nodes) and removes the Widget from the 
     * list of registered widgets.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {

        var boundingBox = this.get(BOUNDING_BOX),
            contentBox = this.get(CONTENT_BOX),
            bbGuid = Y.stamp(boundingBox, TRUE);

        if (bbGuid in _instances) {
            delete _instances[bbGuid];
        }

        if (this.UI_EVENTS) {
            this._destroyUIEvents();
        }

        this._unbindUI(boundingBox);

        if (contentBox) { // Just to be safe because it's a last minute change. Really shouldn't be required.
            contentBox.remove(TRUE);
        }
        boundingBox.remove(TRUE);
    },

    /**
     * Establishes the initial DOM for the widget. Invoking this
     * method will lead to the creating of all DOM elements for
     * the widget (or the manipulation of existing DOM elements 
     * for the progressive enhancement use case).
     * <p>
     * This method should only be invoked once for an initialized
     * widget.
     * </p>
     * <p>
     * It delegates to the widget specific renderer method to do
     * the actual work.
     * </p>
     *
     * @method render
     * @chainable
     * @final 
     * @param  parentNode {Object | String} Optional. The Node under which the 
     * Widget is to be rendered. This can be a Node instance or a CSS selector string. 
     * <p>
     * If the selector string returns more than one Node, the first node will be used 
     * as the parentNode. NOTE: This argument is required if both the boundingBox and contentBox
     * are not currently in the document. If it's not provided, the Widget will be rendered
     * to the body of the current document in this case.
     * </p>
     */
    render: function(parentNode) {

        if (!this.get(DESTROYED) && !this.get(RENDERED)) {
             /**
              * Lifecycle event for the render phase, fired prior to rendering the UI 
              * for the widget (prior to invoking the widget's renderer method).
              * <p>
              * Subscribers to the "on" moment of this event, will be notified 
              * before the widget is rendered.
              * </p>
              * <p>
              * Subscribers to the "after" moment of this event, will be notified
              * after rendering is complete.
              * </p>
              *
              * @event widget:render
              * @preventable _defRenderFn
              * @param {EventFacade} e The Event Facade
              */
            this.publish(RENDER, {
                queuable:FALSE,
                fireOnce:TRUE,
                defaultTargetOnly:TRUE,
                defaultFn: this._defRenderFn
            });

            this.fire(RENDER, {parentNode: (parentNode) ? Node.one(parentNode) : null});
        }
        return this;
    },

    /**
     * Default render handler
     *
     * @method _defRenderFn
     * @protected
     * @param {EventFacade} e The Event object
     * @param {Node} parentNode The parent node to render to, if passed in to the <code>render</code> method
     */
    _defRenderFn : function(e) {
        this._parentNode = e.parentNode;
         
        this.renderer();
        this._set(RENDERED, TRUE);

        this._removeLoadingClassNames();
    },

    /**
     * Creates DOM (or manipulates DOM for progressive enhancement)
     * This method is invoked by render() and is not chained 
     * automatically for the class hierarchy (unlike initializer, destructor) 
     * so it should be chained manually for subclasses if required.
     *
     * @method renderer
     * @protected
     */
    renderer: function() {
        // kweight
        var widget = this;

        widget._renderUI();
        widget.renderUI();

        widget._bindUI();
        widget.bindUI();

        widget._syncUI();
        widget.syncUI();
    },

    /**
     * Configures/Sets up listeners to bind Widget State to UI/DOM
     * 
     * This method is not called by framework and is not chained 
     * automatically for the class hierarchy.
     * 
     * @method bindUI
     * @protected
     */
    bindUI: EMPTY_FN,

    /**氓
     * Adds nodes to the DOM 
     * 
     * This method is not called by framework and is not chained 
     * automatically for the class hierarchy.
     * 
     * @method renderUI
     * @protected
     */
    renderUI: EMPTY_FN,

    /**
     * Refreshes the rendered UI, based on Widget State
     * 
     * This method is not called by framework and is not chained
     * automatically for the class hierarchy.
     *
     * @method syncUI
     * @protected
     *
     */
    syncUI: EMPTY_FN,

    /**
     * @method hide
     * @description Hides the Widget by setting the "visible" attribute to "false".
     * @chainable
     */
    hide: function() {
        return this.set(VISIBLE, FALSE);
    },

    /**
     * @method show
     * @description Shows the Widget by setting the "visible" attribute to "true".
     * @chainable
     */
    show: function() {
        return this.set(VISIBLE, TRUE);
    },

    /**
     * @method focus
     * @description Causes the Widget to receive the focus by setting the "focused" 
     * attribute to "true".
     * @chainable
     */
    focus: function () {
        return this._set(FOCUSED, TRUE);
    },

    /**
     * @method blur
     * @description Causes the Widget to lose focus by setting the "focused" attribute 
     * to "false"
     * @chainable
     */
    blur: function () {
        return this._set(FOCUSED, FALSE);
    },

    /**
     * @method enable
     * @description Set the Widget's "disabled" attribute to "false".
     * @chainable
     */
    enable: function() {
        return this.set(DISABLED, FALSE);
    },

    /**
     * @method disable
     * @description Set the Widget's "disabled" attribute to "true".
     * @chainable
     */
    disable: function() {
        return this.set(DISABLED, TRUE);
    },

    /**
     * @method _uiSizeCB
     * @protected
     * @param {boolean} expand
     */
    _uiSizeCB : function(expand) {
        this.get(CONTENT_BOX).toggleClass(_getWidgetClassName(CONTENT, "expanded"), expand);        
    },

    /**
     * Helper method to collect the boundingBox and contentBox, set styles and append to the provided parentNode, if not
     * already a child. The owner document of the boundingBox, or the owner document of the contentBox will be used 
     * as the document into which the Widget is rendered if a parentNode is node is not provided. If both the boundingBox and
     * the contentBox are not currently in the document, and no parentNode is provided, the widget will be rendered 
     * to the current document's body.
     *
     * @method _renderBox
     * @private
     * @param {Node} parentNode The parentNode to render the widget to. If not provided, and both the boundingBox and
     * the contentBox are not currently in the document, the widget will be rendered to the current document's body.
     */
    _renderBox: function(parentNode) {

        // TODO: Performance Optimization [ More effective algo to reduce Node refs, compares, replaces? ]
        
        var widget = this, // kweight
            contentBox = widget.get(CONTENT_BOX),
            boundingBox = widget.get(BOUNDING_BOX),
            srcNode = widget.get(SRC_NODE),
            defParentNode = widget.DEF_PARENT_NODE,

            doc = (srcNode && srcNode.get(OWNER_DOCUMENT)) || boundingBox.get(OWNER_DOCUMENT) || contentBox.get(OWNER_DOCUMENT);

        // If srcNode (assume it's always in doc), have contentBox take its place (widget render responsible for re-use of srcNode contents)
        if (srcNode && !srcNode.compareTo(contentBox) && !contentBox.inDoc(doc)) {
            srcNode.replace(contentBox);
        }

        if (!boundingBox.compareTo(contentBox.get(PARENT_NODE)) && !boundingBox.compareTo(contentBox)) {
            // If contentBox box is already in the document, have boundingBox box take it's place
            if (contentBox.inDoc(doc)) {
                contentBox.replace(boundingBox);
            }
            boundingBox.appendChild(contentBox);
        }

        parentNode = parentNode || (defParentNode && Node.one(defParentNode));

        if (parentNode) {
            parentNode.appendChild(boundingBox);
        } else if (!boundingBox.inDoc(doc)) {
            Node.one(BODY).insert(boundingBox, 0);
        }
    },

    /**
     * Setter for the boundingBox attribute
     *
     * @method _setBB
     * @private
     * @param Node/String
     * @return Node
     */
    _setBB: function(node) {
        return this._setBox(this.get(ID), node, this.BOUNDING_TEMPLATE);
    },

    /**
     * Setter for the contentBox attribute
     *
     * @method _setCB
     * @private
     * @param {Node|String} node
     * @return Node
     */
    _setCB: function(node) {
        return (this.CONTENT_TEMPLATE === null) ? this.get(BOUNDING_BOX) : this._setBox(null, node, this.CONTENT_TEMPLATE);
    },

    /**
     * Returns the default value for the contentBox attribute. 
     *
     * For the Widget class, this will be the srcNode if provided, otherwise null (resulting in
     * a new contentBox node instance being created)
     *
     * @method _defaultCB
     * @protected
     */
    _defaultCB : function(node) {
        return this.get(SRC_NODE) || null;
    },

    /**
     * Helper method to set the bounding/content box, or create it from
     * the provided template if not found.
     *
     * @method _setBox
     * @private
     *
     * @param {String} id The node's id attribute
     * @param {Node|String} node The node reference
     * @param {String} template HTML string template for the node
     * @return {Node} The node
     */
    _setBox : function(id, node, template) {
        node = Node.one(node) || Node.create(template);
        if (!node.get(ID)) {
            node.set(ID, id || Y.guid());
        }
        return node;
    },

    /**
     * Initializes the UI state for the Widget's bounding/content boxes.
     *
     * @method _renderUI
     * @protected
     */
    _renderUI: function() {
        this._renderBoxClassNames();
        this._renderBox(this._parentNode);
    },

    /**
     * Applies standard class names to the boundingBox and contentBox
     *
     * @method _renderBoxClassNames
     * @protected
     */
    _renderBoxClassNames : function() {
        var classes = this._getClasses(),
            cl,
            boundingBox = this.get(BOUNDING_BOX),
            i;

        boundingBox.addClass(_getWidgetClassName());

        // Start from Widget Sub Class
        for (i = classes.length-3; i >= 0; i--) {
            cl = classes[i];
            boundingBox.addClass(cl.CSS_PREFIX || _getClassName(cl.NAME.toLowerCase()));
        }

        // Use instance based name for content box
        this.get(CONTENT_BOX).addClass(this.getClassName(CONTENT));
    },

    /**
     * Removes class names representative of the widget's loading state from 
     * the boundingBox.
     *
     * @method _removeLoadingClassNames
     * @protected
     */
    _removeLoadingClassNames: function () {

        var boundingBox = this.get(BOUNDING_BOX),
            contentBox = this.get(CONTENT_BOX),
            instClass = this.getClassName(LOADING),
            widgetClass = _getWidgetClassName(LOADING);

        boundingBox.removeClass(widgetClass)
                   .removeClass(instClass);

        contentBox.removeClass(widgetClass)
                  .removeClass(instClass);
    },

    /**
     * Sets up DOM and CustomEvent listeners for the widget.
     *
     * @method _bindUI
     * @protected
     */
    _bindUI: function() {
        this._bindAttrUI(this._UI_ATTRS.BIND);
        this._bindDOM();
    },

    /**
     * @method _unbindUI
     * @protected
     */
    _unbindUI : function(boundingBox) {
        this._unbindDOM(boundingBox);
    },

    /**
     * Sets up DOM listeners, on elements rendered by the widget.
     * 
     * @method _bindDOM
     * @protected
     */
    _bindDOM : function() {
        var oDocument = this.get(BOUNDING_BOX).get(OWNER_DOCUMENT);

        // TODO: Perf Optimization: Use Widget.getByNode delegation, to get by 
        // with just one _onDocFocus subscription per sandbox, instead of one per widget
        this._hDocFocus = oDocument.on("focus", this._onDocFocus, this);

        //	Fix for Webkit:
        //	Document doesn't receive focus in Webkit when the user mouses 
        //	down on it, so the "focused" attribute won't get set to the 
        //	correct value.
        if (WEBKIT) {
            this._hDocMouseDown = oDocument.on("mousedown", this._onDocMouseDown, this);
        }
    },

    /**
     * @method _unbindDOM
     * @protected
     */   
    _unbindDOM : function(boundingBox) {
        if (this._hDocFocus) {
            this._hDocFocus.detach();
        }

        if (WEBKIT && this._hDocMouseDown) {
            this._hDocMouseDown.detach();
        }
    },

    /**
     * Updates the widget UI to reflect the attribute state.
     *
     * @method _syncUI
     * @protected
     */
    _syncUI: function() {
        this._syncAttrUI(this._UI_ATTRS.SYNC);
    },

    /**
     * Sets the height on the widget's bounding box element
     *
     * @method _uiSetHeight
     * @protected
     * @param {String | Number} val
     */
    _uiSetHeight: function(val) {
        this._uiSetDim(HEIGHT, val);
        this._uiSizeCB((val !== EMPTY_STR && val !== AUTO));
    },

    /**
     * Sets the width on the widget's bounding box element
     *
     * @method _uiSetWidth
     * @protected
     * @param {String | Number} val
     */
    _uiSetWidth: function(val) {
        this._uiSetDim(WIDTH, val);
    },

    /**
     * @method _uiSetDim
     * @private
     * @param {String} dim The dimension - "width" or "height"
     * @param {Number | String} val The value to set
     */
    _uiSetDim: function(dimension, val) {
        this.get(BOUNDING_BOX).setStyle(dimension, L.isNumber(val) ? val + this.DEF_UNIT : val);
    },

    /**
     * Sets the visible state for the UI
     * 
     * @method _uiSetVisible
     * @protected
     * @param {boolean} val
     */
    _uiSetVisible: function(val) {
        this.get(BOUNDING_BOX).toggleClass(this.getClassName(HIDDEN), !val);
    },

    /**
     * Sets the disabled state for the UI
     *
     * @protected
     * @param {boolean} val
     */
    _uiSetDisabled: function(val) {
        this.get(BOUNDING_BOX).toggleClass(this.getClassName(DISABLED), val);
    },

    /**
     * Sets the focused state for the UI
     *
     * @protected
     * @param {boolean} val
     * @param {string} src String representing the source that triggered an update to 
     * the UI.     
     */
    _uiSetFocused: function(val, src) {
         var boundingBox = this.get(BOUNDING_BOX);
         boundingBox.toggleClass(this.getClassName(FOCUSED), val);

         if (src !== UI) {
            if (val) {
                boundingBox.focus();  
            } else {
                boundingBox.blur();
            }
         }
    },

    /**
     * Set the tabIndex on the widget's rendered UI
     *
     * @method _uiSetTabIndex
     * @protected
     * @param Number
     */
    _uiSetTabIndex: function(index) {
        var boundingBox = this.get(BOUNDING_BOX);

        if (L.isNumber(index)) {
            boundingBox.set(TAB_INDEX, index);
        } else {
            boundingBox.removeAttribute(TAB_INDEX);
        }
    },

    /**
     * @method _onDocMouseDown
     * @description "mousedown" event handler for the owner document of the 
     * widget's bounding box.
     * @protected
     * @param {EventFacade} evt The event facade for the DOM focus event
     */
    _onDocMouseDown: function (evt) {
        if (this._domFocus) {
            this._onDocFocus(evt);
        }
    },

    /**
     * DOM focus event handler, used to sync the state of the Widget with the DOM
     * 
     * @method _onDocFocus
     * @protected
     * @param {EventFacade} evt The event facade for the DOM focus event
     */
    _onDocFocus: function (evt) {
        this._domFocus = this.get(BOUNDING_BOX).contains(evt.target); // contains() checks invoking node also
        this._set(FOCUSED, this._domFocus, { src: UI });
    },

    /**
     * Generic toString implementation for all widgets.
     *
     * @method toString
     * @return {String} The default string value for the widget [ displays the NAME of the instance, and the unique id ]
     */
    toString: function() {
        // Using deprecated name prop for kweight squeeze.
        return this.name + "[" + this.get(ID) + "]";
    },

    /**
     * Default unit to use for dimension values
     * 
     * @property DEF_UNIT
     * @type String
     */
    DEF_UNIT : "px",

    /** 
     * Default node to render the bounding box to. If not set,
     * will default to the current document body.
     * 
     * @property DEF_PARENT_NODE
     * @type String | Node
     */ 
    DEF_PARENT_NODE : null,

    /**
     * Property defining the markup template for content box. If your Widget doesn't
     * need the dual boundingBox/contentBox structure, set CONTENT_TEMPLATE to null,
     * and contentBox and boundingBox will both point to the same Node. 
     *
     * @property CONTENT_TEMPLATE
     * @type String
     */
    CONTENT_TEMPLATE : DIV,

    /**
     * Property defining the markup template for bounding box.
     *
     * @property BOUNDING_TEMPLATE
     * @type String
     */
    BOUNDING_TEMPLATE : DIV,

    /**
     * @method _guid
     * @protected
     */
    _guid : function() {
        return Y.guid();
    },

    /**
     * @method _validTabIndex
     * @protected
     * @param {Number} tabIndex
     */
    _validTabIndex : function (tabIndex) {
        return (L.isNumber(tabIndex) || L.isNull(tabIndex));
    },

    /**
     * Binds after listeners for the list of attributes provided
     * 
     * @method _bindAttrUI
     * @private
     * @param {Array} attrs
     */
    _bindAttrUI : function(attrs) {
        var i, 
            l = attrs.length; 

        for (i = 0; i < l; i++) {
            this.after(attrs[i] + CHANGE, this._setAttrUI);
        }
    },

    /**
     * Invokes the _uiSet&#61;ATTR NAME&#62; method for the list of attributes provided  
     *
     * @method _syncAttrUI
     * @private
     * @param {Array} attrs
     */
    _syncAttrUI : function(attrs) {
        var i, l = attrs.length, attr;
        for (i = 0; i < l; i++) {
            attr = attrs[i];
            this[_UISET + _toInitialCap(attr)](this.get(attr));
        }
    },

    /**
     * @method _setAttrUI
     * @private
     * @param {EventFacade} e
     */
    _setAttrUI : function(e) {
        this[_UISET + _toInitialCap(e.attrName)](e.newVal, e.src);
    },

    /**
     * The default setter for the strings attribute. Merges partial sets
     * into the full string set, to allow users to partial sets of strings  
     *
     * @method _strSetter
     * @protected
     * @param {Object} strings
     * @return {String} The full set of strings to set
     */
    _strSetter : function(strings) {
        return Y.merge(this.get(STRINGS), strings);
    },

    /**
     * Helper method to get a specific string value
     *
     * @deprecated Used by deprecated WidgetLocale implementations. 
     * @method getString
     * @param {String} key
     * @return {String} The string
     */
    getString : function(key) {
        return this.get(STRINGS)[key];
    },

    /**
     * Helper method to get the complete set of strings for the widget
     *
     * @deprecated  Used by deprecated WidgetLocale implementations.
     * @method getString
     * @param {String} key
     * @return {String} The string
     */
    getStrings : function() {
        return this.get(STRINGS);
    },

    /**
     * The lists of UI attributes to bind and sync for widget's _bindUI and _syncUI implementations
     *
     * @property _UI_ATTRS
     * @type Object
     * @private
     */
    _UI_ATTRS : {
        BIND: UI_ATTRS,
        SYNC: UI_ATTRS.concat(TAB_INDEX)
    }
});

Y.Widget = Widget;


}, '3.3.0' ,{requires:['attribute', 'event-focus', 'base-base', 'base-pluginhost', 'node-base', 'node-style', 'node-event-delegate', 'classnamemanager']});
YUI.add('widget-uievents', function(Y) {

/**
 * Support for Widget UI Events (Custom Events fired by the widget, which wrap the underlying DOM events - e.g. widget:click, widget:mousedown)
 *
 * @module widget
 * @submodule widget-uievents
 */

var BOUNDING_BOX = "boundingBox",
    Widget = Y.Widget,
    RENDER = "render",
    L = Y.Lang,
    EVENT_PREFIX_DELIMITER = ":",

    //  Map of Node instances serving as a delegation containers for a specific
    //  event type to Widget instances using that delegation container.
    _uievts = Y.Widget._uievts = Y.Widget._uievts || {};

Y.mix(Widget.prototype, {

    /**
     * Destructor logic for UI event infrastructure,
     * invoked during Widget destruction.
     *
     * @method _destroyUIEvents
     * @for Widget
     * @private
     */
    _destroyUIEvents: function() {

        var widgetGuid = Y.stamp(this, true);

        Y.each(_uievts, function (info, key) {
            if (info.instances[widgetGuid]) {
                //  Unregister this Widget instance as needing this delegated
                //  event listener.
                delete info.instances[widgetGuid];

                //  There are no more Widget instances using this delegated 
                //  event listener, so detach it.

                if (Y.Object.isEmpty(info.instances)) {
                    info.handle.detach();

                    if (_uievts[key]) {
                        delete _uievts[key];
                    }
                }
            }
        });
    },

    /**
     * Map of DOM events that should be fired as Custom Events by the  
     * Widget instance.
     *
     * @property UI_EVENTS
     * @for Widget
     * @type Object
     */
    UI_EVENTS: Y.Node.DOM_EVENTS,

    /**
     * Returns the node on which to bind delegate listeners.
     *
     * @method _getUIEventNode
     * @for Widget
     * @protected
     */
    _getUIEventNode: function () {
        return this.get(BOUNDING_BOX);
    },

    /**
     * Binds a delegated DOM event listener of the specified type to the 
     * Widget's outtermost DOM element to facilitate the firing of a Custom
     * Event of the same type for the Widget instance.  
     *
     * @private
     * @for Widget 
     * @method _createUIEvent
     * @param type {String} String representing the name of the event
     */
    _createUIEvent: function (type) {

        var uiEvtNode = this._getUIEventNode(),
            key = (Y.stamp(uiEvtNode) + type),
            info = _uievts[key],
            handle;

        //  For each Node instance: Ensure that there is only one delegated
        //  event listener used to fire Widget UI events.

        if (!info) {

            handle = uiEvtNode.delegate(type, function (evt) {

                var widget = Widget.getByNode(this);
                //  Make the DOM event a property of the custom event
                //  so that developers still have access to it.
                widget.fire(evt.type, { domEvent: evt });

            }, "." + Y.Widget.getClassName());

            _uievts[key] = info = { instances: {}, handle: handle };
        }

        //  Register this Widget as using this Node as a delegation container.
        info.instances[Y.stamp(this)] = 1;
    },

    /**
     * Determines if the specified event is a UI event.
     *
     * @private
     * @method _isUIEvent
     * @for Widget 
     * @param type {String} String representing the name of the event
     * @return {String} Event Returns the name of the UI Event, otherwise 
     * undefined.
     */
    _getUIEvent: function (type) {

        if (L.isString(type)) {
            var sType = this.parseType(type)[1],
                iDelim,
                returnVal;

            if (sType) {
                // TODO: Get delimiter from ET, or have ET support this.
                iDelim = sType.indexOf(EVENT_PREFIX_DELIMITER);
                if (iDelim > -1) {
                    sType = sType.substring(iDelim + EVENT_PREFIX_DELIMITER.length);
                }

                if (this.UI_EVENTS[sType]) {
                    returnVal = sType;
                }
            }

            return returnVal;
        }
    },

    /**
     * Sets up infrastructure required to fire a UI event.
     * 
     * @private
     * @method _initUIEvent
     * @for Widget
     * @param type {String} String representing the name of the event
     * @return {String}     
     */
    _initUIEvent: function (type) {
        var sType = this._getUIEvent(type),
            queue = this._uiEvtsInitQueue || {};

        if (sType && !queue[sType]) {

            this._uiEvtsInitQueue = queue[sType] = 1;

            this.after(RENDER, function() { 
                this._createUIEvent(sType);
                delete this._uiEvtsInitQueue[sType];
            });
        }
    },

    //  Override of "on" from Base to facilitate the firing of Widget events
    //  based on DOM events of the same name/type (e.g. "click", "mouseover").
    //  Temporary solution until we have the ability to listen to when 
    //  someone adds an event listener (bug 2528230)
    on: function (type) {
        this._initUIEvent(type);
        return Widget.superclass.on.apply(this, arguments);
    },

    //  Override of "publish" from Base to facilitate the firing of Widget events
    //  based on DOM events of the same name/type (e.g. "click", "mouseover").    
    //  Temporary solution until we have the ability to listen to when 
    //  someone publishes an event (bug 2528230)     
    publish: function (type, config) {
        var sType = this._getUIEvent(type);
        if (sType && config && config.defaultFn) {
            this._initUIEvent(sType);
        }        
        return Widget.superclass.publish.apply(this, arguments);
    }

}, true); // overwrite existing EventTarget methods


}, '3.3.0' ,{requires:['widget-base', 'node-event-delegate']});
YUI.add('widget-htmlparser', function(Y) {

/**
 * Adds HTML Parser support to the base Widget class
 *
 * @module widget
 * @submodule widget-htmlparser
 * @for Widget
 */


var Widget = Y.Widget,
    Node = Y.Node,
    Lang = Y.Lang,

    SRC_NODE = "srcNode",
    CONTENT_BOX = "contentBox";

/**
 * Object hash, defining how attribute values are to be parsed from
 * markup contained in the widget's content box. e.g.:
 * <pre>
 *   {
 *       // Set single Node references using selector syntax 
 *       // (selector is run through node.one)
 *       titleNode: "span.yui-title",
 *       // Set NodeList references using selector syntax 
 *       // (array indicates selector is to be run through node.all)
 *       listNodes: ["li.yui-item"],
 *       // Set other attribute types, using a parse function. 
 *       // Context is set to the widget instance.
 *       label: function(contentBox) {
 *           return contentBox.one("span.title").get("innerHTML");
 *       }
 *   }
 * </pre>
 * 
 * @property Widget.HTML_PARSER
 * @type Object
 * @static
 */
Widget.HTML_PARSER = {};

/**
 * The build configuration for the Widget class.
 * <p>
 * Defines the static fields which need to be aggregated,
 * when this class is used as the main class passed to 
 * the <a href="Base.html#method_build">Base.build</a> method.
 * </p>
 * @property _buildCfg
 * @type Object
 * @static
 * @final
 * @private
 */
Widget._buildCfg = {
    aggregates : ["HTML_PARSER"]
};

/**
 * The DOM node to parse for configuration values, passed to the Widget's HTML_PARSER definition
 *
 * @attribute srcNode
 * @type String | Node
 * @writeOnce
 */
Widget.ATTRS[SRC_NODE] = {
    value: null,
    setter: Node.one,
    getter: "_getSrcNode",
    writeOnce: true
};

Y.mix(Widget.prototype, {

    /**
     * @method _getSrcNode
     * @protected
     * @return {Node} The Node to apply HTML_PARSER to
     */
    _getSrcNode : function(val) {
        return val || this.get(CONTENT_BOX);
    },

    /**
     * @method _applyParsedConfig
     * @protected
     * @return {Object} The merged configuration literal
     */
    _applyParsedConfig : function(node, cfg, parsedCfg) {
        return (parsedCfg) ? Y.mix(cfg, parsedCfg, false) : cfg;
    },

    /**
     * Utilitity method used to apply the <code>HTML_PARSER</code> configuration for the 
     * instance, to retrieve config data values.
     *
     * @method _applyParser
     * @protected
     * @param config {Object} User configuration object (will be populated with values from Node) 
     */
    _applyParser : function(config) {

        var widget = this,
            srcNode = widget.get(SRC_NODE),
            schema = widget._getHtmlParser(),
            parsedConfig,
            val;

        if (schema && srcNode) {
            Y.Object.each(schema, function(v, k, o) {
                val = null;

                if (Lang.isFunction(v)) {
                    val = v.call(widget, srcNode);
                } else {
                    if (Lang.isArray(v)) {
                        val = srcNode.all(v[0]);
                        if (val.isEmpty()) {
                            val = null;
                        }
                    } else {
                        val = srcNode.one(v);
                    }
                }

                if (val !== null && val !== undefined) {
                    parsedConfig = parsedConfig || {};
                    parsedConfig[k] = val;
                }
            });
        }
        config = widget._applyParsedConfig(srcNode, config, parsedConfig);
    },

    /**
     * Gets the HTML_PARSER definition for this instance, by merging HTML_PARSER
     * definitions across the class hierarchy.
     *
     * @private
     * @method _getHtmlParser
     * @return {Object} HTML_PARSER definition for this instance
     */
    _getHtmlParser : function() {
        // Removed caching for kweight. This is a private method
        // and only called once so don't need to cache HTML_PARSER
        var classes = this._getClasses(),
            parser = {},
            i, p;

        for (i = classes.length - 1; i >= 0; i--) {
            p = classes[i].HTML_PARSER;
            if (p) {
                Y.mix(parser, p, true);
            }
        }
        return parser;
    }
});


}, '3.3.0' ,{requires:['widget-base']});
YUI.add('widget-skin', function(Y) {

/**
 * Provides skin related utlility methods.
 *
 * @module widget
 * @submodule widget-skin
 */

var BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    SKIN = "skin",
    _getClassName = Y.ClassNameManager.getClassName;

/**
 * Returns the name of the skin that's currently applied to the widget.
 * This is only really useful after the widget's DOM structure is in the
 * document, either by render or by progressive enhancement.  Searches up
 * the Widget's ancestor axis for a class yui3-skin-(name), and returns the
 * (name) portion.  Otherwise, returns null.
 *
 * @method getSkinName
 * @for Widget
 * @return {String} the name of the skin, or null (yui3-skin-sam => sam)
 */

Y.Widget.prototype.getSkinName = function () {
    var root = this.get( CONTENT_BOX ) || this.get( BOUNDING_BOX ),
        search = new RegExp( '\\b' + _getClassName( SKIN ) + '-(\\S+)' ),
        match;

    if ( root ) {
        root.ancestor( function ( node ) {
            match = node.get( 'className' ).match( search );
            return match;
        } );
    }

    return ( match ) ? match[1] : null;
};


}, '3.3.0' ,{requires:['widget-base']});


YUI.add('widget', function(Y){}, '3.3.0' ,{use:['widget-base', 'widget-uievents', 'widget-htmlparser', 'widget-skin']});

/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('widget-position', function(Y) {

/**
 * Provides basic XY positioning support for Widgets, though an extension
 *
 * @module widget-position
 */
    var Lang = Y.Lang,
        Widget = Y.Widget,

        XY_COORD = "xy",

        POSITION = "position",
        POSITIONED = "positioned",
        BOUNDING_BOX = "boundingBox",
        RELATIVE = "relative",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI",

        UI = Widget.UI_SRC,

        XYChange = "xyChange";

    /**
     * Widget extension, which can be used to add positioning support to the base Widget class, 
     * through the <a href="Base.html#method_build">Base.build</a> method.
     *
     * @class WidgetPosition
     * @param {Object} config User configuration object
     */
    function Position(config) {
        this._posNode = this.get(BOUNDING_BOX);

        // WIDGET METHOD OVERLAP
        Y.after(this._renderUIPosition, this, RENDERUI);
        Y.after(this._syncUIPosition, this, SYNCUI);
        Y.after(this._bindUIPosition, this, BINDUI);
    }

    /**
     * Static property used to define the default attribute 
     * configuration introduced by WidgetPosition.
     *
     * @property WidgetPosition.ATTRS
     * @static
     * @type Object
     */
    Position.ATTRS = {

        /**
         * @attribute x
         * @type number
         * @default 0
         *
         * @description Page X co-ordinate for the widget. This attribute acts as a facade for the 
         * xy attribute. Changes in position can be monitored by listening for xyChange events.
         */
        x: {
            setter: function(val) {
                this._setX(val);
            },
            getter: function() {
                return this._getX();
            },
            lazyAdd:false
        },

        /**
         * @attribute y
         * @type number
         * @default 0
         *
         * @description Page Y co-ordinate for the widget. This attribute acts as a facade for the 
         * xy attribute. Changes in position can be monitored by listening for xyChange events.
         */
        y: {
            setter: function(val) {
                this._setY(val);
            },
            getter: function() {
                return this._getY();
            },
            lazyAdd: false
        },

        /**
         * @attribute xy
         * @type Array
         * @default [0,0]
         *
         * @description Page XY co-ordinate pair for the widget.
         */
        xy: {
            value:[0,0],
            validator: function(val) {
                return this._validateXY(val);
            }
        }
    };

    /**
     * Default class used to mark the boundingBox of a positioned widget.
     *
     * @property WidgetPosition.POSITIONED_CLASS_NAME
     * @type String
     * @default "yui-widget-positioned"
     * @static
     */
    Position.POSITIONED_CLASS_NAME = Widget.getClassName(POSITIONED);

    Position.prototype = {

        /**
         * Creates/Initializes the DOM to support xy page positioning.
         * <p>
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIPosition
         * @protected
         */
        _renderUIPosition : function() {
            this._posNode.addClass(Position.POSITIONED_CLASS_NAME);
        },

        /**
         * Synchronizes the UI to match the Widgets xy page position state.
         * <p>
         * This method in invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _syncUIPosition
         * @protected
         */
        _syncUIPosition : function() {
            var posNode = this._posNode;
            if (posNode.getStyle(POSITION) === RELATIVE) {
                this.syncXY();
            }
            this._uiSetXY(this.get(XY_COORD));
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to 
         * Widget position related state changes.
         * <p>
         * This method in invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIPosition
         * @protected
         */
        _bindUIPosition :function() {
            this.after(XYChange, this._afterXYChange);
        },

        /**
         * Moves the Widget to the specified page xy co-ordinate position.
         *
         * @method move
         *
         * @param {Number} x The new x position
         * @param {Number} y The new y position
         * <p>Or</p>
         * @param {Array} x, y values passed as an array ([x, y]), to support
         * simple pass through of Node.getXY results
         */
        move: function () {
            var args = arguments,
                coord = (Lang.isArray(args[0])) ? args[0] : [args[0], args[1]];
                this.set(XY_COORD, coord);
        },

        /**
         * Synchronizes the Panel's "xy", "x", and "y" properties with the 
         * Widget's position in the DOM.
         *
         * @method syncXY
         */
        syncXY : function () {
            this.set(XY_COORD, this._posNode.getXY(), {src: UI});
        },

        /**
         * Default validator for the XY attribute
         *
         * @method _validateXY
         * @param {Array} val The XY page co-ordinate value which is being set.
         * @return {boolean} true if valid, false if not.
         */
        _validateXY : function(val) {
            return (Lang.isArray(val) && Lang.isNumber(val[0]) && Lang.isNumber(val[1]));
        },

        /**
         * Default setter for the X attribute. The setter passes the X value through
         * to the XY attribute, which is the sole store for the XY state.
         *
         * @method _setX
         * @param {Number} val The X page co-ordinate value
         */
        _setX : function(val) {
            this.set(XY_COORD, [val, this.get(XY_COORD)[1]]);
        },

        /**
         * Default setter for the Y attribute. The setter passes the Y value through
         * to the XY attribute, which is the sole store for the XY state.
         *
         * @method _setY
         * @param {Number} val The Y page co-ordinate value
         */
        _setY : function(val) {
            this.set(XY_COORD, [this.get(XY_COORD)[0], val]);
        },

        /**
         * Default getter for the X attribute. The value is retrieved from 
         * the XY attribute, which is the sole store for the XY state.
         *
         * @method _getX
         * @return {Number} The X page co-ordinate value
         */
        _getX : function() {
            return this.get(XY_COORD)[0];
        },

        /**
         * Default getter for the Y attribute. The value is retrieved from 
         * the XY attribute, which is the sole store for the XY state.
         *
         * @method _getY
         * @return {Number} The Y page co-ordinate value
         */
        _getY : function() {
            return this.get(XY_COORD)[1];
        },

        /**
         * Default attribute change listener for the xy attribute, responsible
         * for updating the UI, in response to attribute changes.
         * 
         * @method _afterXYChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterXYChange : function(e) {
            if (e.src != UI) {
                this._uiSetXY(e.newVal);
            }
        },

        /**
         * Updates the UI to reflect the XY page co-ordinates passed in.
         * 
         * @method _uiSetXY
         * @protected
         * @param {String} val The XY page co-ordinates value to be reflected in the UI
         */
        _uiSetXY : function(val) {
            this._posNode.setXY(val);
        }
    };

    Y.WidgetPosition = Position;


}, '3.3.0' ,{requires:['base-build', 'node-screen', 'widget']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('widget-position-align', function(Y) {

/**
 * Provides extended/advanced XY positioning support for Widgets, through an extension.
 *
 * It builds on top of the widget-position module, to provide alignmentment and centering support.
 * Future releases aim to add constrained and fixed positioning support.
 *
 * @module widget-position-align
 */
        var L = Y.Lang,
            ALIGN = "align",

            BINDUI = "bindUI",
            SYNCUI = "syncUI",

            OFFSET_WIDTH = "offsetWidth",
            OFFSET_HEIGHT = "offsetHeight",
            VIEWPORT_REGION = "viewportRegion",
            REGION = "region",

            AlignChange = "alignChange";

        /**
         * Widget extension, which can be used to add extended XY positioning support to the base Widget class,
         * through the <a href="Base.html#method_build">Base.build</a> method. This extension requires that 
         * the WidgetPosition extension be added to the Widget (before WidgetPositionAlign, if part of the same 
         * extension list passed to Base.build).
         *
         * @class WidgetPositionAlign
         * @param {Object} User configuration object
         */
        function PositionAlign(config) {
            if (!this._posNode) {
                Y.error("WidgetPosition needs to be added to the Widget, before WidgetPositionAlign is added"); 
            }
            Y.after(this._syncUIPosAlign, this, SYNCUI);
            Y.after(this._bindUIPosAlign, this, BINDUI);
        }

        /**
         * Static property used to define the default attribute 
         * configuration introduced by WidgetPositionAlign.
         * 
         * @property WidgetPositionAlign.ATTRS
         * @type Object
         * @static
         */
        PositionAlign.ATTRS = {

            /**
             * @attribute align
             * @type Object
             * @default null
             * @desciption The align attribute is used to align a reference point on the widget, with the refernce point on another node, or the viewport. 
             * The object which align expects has the following properties:
             * <dl>
             *       <dt>node</dt>
             *       <dd>
             *         The node to which the Widget is to be aligned. If set to null, or not provided, the Widget is aligned to the viewport
             *       </dd>
             *       <dt>points</dt>
             *       <dd>
             *         <p>
             *         A two element array, defining the two points on the Widget and node/viewport which are to be aligned. The first element is the point on the Widget, and the second element is the point on the node/viewport.
             *         Supported alignment points are defined as static properties on <code>WidgetPositionAlign</code>.
             *         </p>
             *         <p>
             *         e.g. <code>[WidgetPositionAlign.TR, WidgetPositionAlign.TL]</code> aligns the Top-Right corner of the Widget with the
             *         Top-Left corner of the node/viewport, and <code>[WidgetPositionAlign.CC, WidgetPositionAlign.TC]</code> aligns the Center of the 
             *         Widget with the Top-Center edge of the node/viewport.
             *         </p>
             *       </dd>
             *   </dl>
             */
            align: {
                value:null
            },

            /**
             * @attribute centered
             * @type {boolean | node} 
             * @default false
             * @description A convenience attribute, which can be used as a shortcut for the align attribute.
             * If set to true, the Widget is centered in the viewport. If set to a node reference or valid selector string,
             * the Widget will be centered within the node. If set the false, no center positioning is applied.
             */
            centered: {
                setter: "_setAlignCenter",
                lazyAdd:false,
                value:false
            }
        };

        /**
         * Constant used to specify the top-left corner for alignment
         * 
         * @property WidgetPositionAlign.TL
         * @type String
         * @static
         * @value "tl"
         */
        PositionAlign.TL = "tl";
        /**
         * Constant used to specify the top-right corner for alignment
         * 
         * @property WidgetPositionAlign.TR
         * @type String
         * @static
         * @value "tr"
         */
        PositionAlign.TR = "tr";
        /**
         * Constant used to specify the bottom-left corner for alignment
         * 
         * @property WidgetPositionAlign.BL
         * @type String
         * @static
         * @value "bl"
         */
        PositionAlign.BL = "bl";
        /**
         * Constant used to specify the bottom-right corner for alignment
         * 
         * @property WidgetPositionAlign.BR
         * @type String
         * @static
         * @value "br"
         */
        PositionAlign.BR = "br";
        /**
         * Constant used to specify the top edge-center point for alignment
         * 
         * @property WidgetPositionAlign.TC
         * @type String
         * @static
         * @value "tc"
         */
        PositionAlign.TC = "tc";
        /**
         * Constant used to specify the right edge, center point for alignment
         * 
         * @property WidgetPositionAlign.RC
         * @type String
         * @static
         * @value "rc"
         */
        PositionAlign.RC = "rc";
        /**
         * Constant used to specify the bottom edge, center point for alignment
         * 
         * @property WidgetPositionAlign.BC
         * @type String
         * @static
         * @value "bc"
         */
        PositionAlign.BC = "bc";
        /**
         * Constant used to specify the left edge, center point for alignment
         * 
         * @property WidgetPositionAlign.LC
         * @type String
         * @static
         * @value "lc"
         */
        PositionAlign.LC = "lc";
        /**
         * Constant used to specify the center of widget/node/viewport for alignment
         * 
         * @property WidgetPositionAlign.CC
         * @type String
         * @static
         * @value "cc"
         */
        PositionAlign.CC = "cc";

        PositionAlign.prototype = {

            /**
             * Synchronizes the UI to match the Widgets align configuration.
             * 
             * This method in invoked after syncUI is invoked for the Widget class
             * using YUI's aop infrastructure.
             *
             * @method _syncUIPosAlign
             * @protected
             */
            _syncUIPosAlign : function() {
                var align = this.get(ALIGN);
                if (align) {
                    this._uiSetAlign(align.node, align.points);
                }
            },

            /**
             * Binds event listeners responsible for updating the UI state in response to 
             * Widget extended positioning related state changes.
             * <p>
             * This method is invoked after bindUI is invoked for the Widget class
             * using YUI's aop infrastructure.
             * </p>
             * @method _bindUIStack
             * @protected
             */
            _bindUIPosAlign : function() {
                this.after(AlignChange, this._afterAlignChange);
            },

            /**
             * Default setter for center attribute changes. Sets up the appropriate value, and passes 
             * it through the to the align attribute.
             *
             * @method _setAlignCenter
             * @protected
             * @param {boolean | node} The attribute value being set. 
             * @return {Number} The attribute value being set.
             */
            _setAlignCenter : function(val) {
                if (val) {
                    this.set(ALIGN, {
                        node: val === true ? null : val,
                        points: [PositionAlign.CC, PositionAlign.CC]
                    });
                }
                return val;
            },

            /**
             * Default attribute change listener for the align attribute, responsible
             * for updating the UI, in response to attribute changes.
             * 
             * @method _afterAlignChange
             * @protected
             * @param {EventFacade} e The event facade for the attribute change
             */
            _afterAlignChange : function(e) {
                if (e.newVal) {
                    this._uiSetAlign(e.newVal.node, e.newVal.points);
                }
            },

            /**
             * Updates the UI to reflect the align value passed in (see the align attribute documentation, for the object stucture expected)
             * @method _uiSetAlign
             * @protected
             * @param {Node | null} The node to align to, or null to indicate the viewport
             */
            _uiSetAlign: function (node, points) {

                if (!L.isArray(points) || points.length != 2) {
                    Y.error("align: Invalid Points Arguments");
                    return;
                }

                var nodeRegion = this._getRegion(node), 
                    widgetPoint, 
                    nodePoint, 
                    xy;

                if (nodeRegion) {

                    widgetPoint = points[0];
                    nodePoint = points[1];

                    // TODO: Optimize KWeight - Would lookup table help?
                    switch (nodePoint) {
                        case PositionAlign.TL:
                            xy = [nodeRegion.left, nodeRegion.top];
                            break;
                        case PositionAlign.TR:
                            xy = [nodeRegion.right, nodeRegion.top];
                            break;
                        case PositionAlign.BL:
                            xy = [nodeRegion.left, nodeRegion.bottom];
                            break;
                        case PositionAlign.BR:
                            xy = [nodeRegion.right, nodeRegion.bottom];
                            break;
                        case PositionAlign.TC:
                            xy = [nodeRegion.left + Math.floor(nodeRegion.width/2), nodeRegion.top];
                            break;
                        case PositionAlign.BC:
                            xy = [nodeRegion.left + Math.floor(nodeRegion.width/2), nodeRegion.bottom];
                            break;
                        case PositionAlign.LC:
                            xy = [nodeRegion.left, nodeRegion.top + Math.floor(nodeRegion.height/2)];
                            break;
                        case PositionAlign.RC:
                            xy = [nodeRegion.right, nodeRegion.top + Math.floor(nodeRegion.height/2), widgetPoint];
                            break;
                        case PositionAlign.CC:
                            xy = [nodeRegion.left + Math.floor(nodeRegion.width/2), nodeRegion.top + Math.floor(nodeRegion.height/2), widgetPoint];
                            break;
                        default:
                            break;
                    }

                    if (xy) {
                        this._doAlign(widgetPoint, xy[0], xy[1]);
                    }
                }
            },

            /**
             * Helper method, used to align the given point on the widget, with the XY page co-ordinates provided.
             *
             * @method _doAlign
             * @private
             * @param {String} widgetPoint Supported point constant (e.g. WidgetPositionAlign.TL)
             * @param {Number} x X page co-ordinate to align to
             * @param {Number} y Y page co-ordinate to align to
             */
            _doAlign : function(widgetPoint, x, y) {
                var widgetNode = this._posNode,
                    xy;

                switch (widgetPoint) {
                    case PositionAlign.TL:
                        xy = [x, y];
                        break;
                    case PositionAlign.TR:
                        xy = [x - widgetNode.get(OFFSET_WIDTH), y];
                        break;
                    case PositionAlign.BL:
                        xy = [x, y - widgetNode.get(OFFSET_HEIGHT)];
                        break;
                    case PositionAlign.BR:
                        xy = [x - widgetNode.get(OFFSET_WIDTH), y - widgetNode.get(OFFSET_HEIGHT)];
                        break;
                    case PositionAlign.TC:
                        xy = [x - (widgetNode.get(OFFSET_WIDTH)/2), y];
                        break;
                    case PositionAlign.BC:
                        xy = [x - (widgetNode.get(OFFSET_WIDTH)/2), y - widgetNode.get(OFFSET_HEIGHT)];
                        break;
                    case PositionAlign.LC:
                        xy = [x, y - (widgetNode.get(OFFSET_HEIGHT)/2)];
                        break;
                    case PositionAlign.RC:
                        xy = [(x - widgetNode.get(OFFSET_WIDTH)), y - (widgetNode.get(OFFSET_HEIGHT)/2)];
                        break;
                    case PositionAlign.CC:
                        xy = [x - (widgetNode.get(OFFSET_WIDTH)/2), y - (widgetNode.get(OFFSET_HEIGHT)/2)];
                        break;
                    default:
                        break;
                }

                if (xy) {
                    this.move(xy);
                }
            },

            _getRegion : function(node) {
                var nodeRegion;
                if (!node) {
                    nodeRegion = this._posNode.get(VIEWPORT_REGION);
                } else {
                    node = Y.Node.one(node);
                    if (node) {
                        nodeRegion = node.get(REGION);
                    }
                }
                return nodeRegion;
            },

            /**
             * Aligns the Widget to the provided node (or viewport) using the provided
             * points. The method can be invoked directly, however it will result in 
             * the align attribute being out of sync with current position of the of Widget.
             * 
             * @method align
             * @param {Node | String | null} node A reference (or selector string) for the Node which with the Widget is to be aligned.
             * If null is passed in, the Widget will be aligned with the viewport.
             * @param {Array[2]} points A two element array, specifying the points on the Widget and node/viewport which need to be aligned. 
             * The first entry is the point on the Widget, and the second entry is the point on the node/viewport which need to align.
             * Valid point references are defined as static constants on the WidgetPositionAlign class. 
             * 
             * e.g. [WidgetPositionAlign.TL, WidgetPositionAlign.TR] will align the top-left corner of the Widget with the top-right corner of the node/viewport.
             */
            align: function (node, points) {
                this.set(ALIGN, {node: node, points:points});
            },

            /**
             * Centers the container in the viewport, or if a node is passed in,
             * the node.
             *
             * @method centered
             * @param {Node | String} node Optional. A node reference or selector string defining the node 
             * inside which the Widget is to be centered. If not passed in, the Widget will be centered in the 
             * viewport.
             */
            centered: function (node) {
                this.align(node, [PositionAlign.CC, PositionAlign.CC]);
            }
        };

        Y.WidgetPositionAlign = PositionAlign;


}, '3.3.0' ,{requires:['widget-position']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('widget-stack', function(Y) {

/**
 * Provides stackable (z-index) support for Widgets through an extension.
 *
 * @module widget-stack
 */
    var L = Y.Lang,
        UA = Y.UA,
        Node = Y.Node,
        Widget = Y.Widget,

        ZINDEX = "zIndex",
        SHIM = "shim",
        VISIBLE = "visible",

        BOUNDING_BOX = "boundingBox",

        RENDER_UI = "renderUI",
        BIND_UI = "bindUI",
        SYNC_UI = "syncUI",

        OFFSET_WIDTH = "offsetWidth",
        OFFSET_HEIGHT = "offsetHeight",
        PARENT_NODE = "parentNode",
        FIRST_CHILD = "firstChild",
        OWNER_DOCUMENT = "ownerDocument",

        WIDTH = "width",
        HEIGHT = "height",
        PX = "px",

        // HANDLE KEYS
        SHIM_DEFERRED = "shimdeferred",
        SHIM_RESIZE = "shimresize",

        // Events
        VisibleChange = "visibleChange",
        WidthChange = "widthChange",
        HeightChange = "heightChange",
        ShimChange = "shimChange",
        ZIndexChange = "zIndexChange",
        ContentUpdate = "contentUpdate",

        // CSS
        STACKED = "stacked";

    /**
     * Widget extension, which can be used to add stackable (z-index) support to the 
     * base Widget class along with a shimming solution, through the 
     * <a href="Base.html#method_build">Base.build</a> method.
     *
     * @class WidgetStack
     * @param {Object} User configuration object
     */
    function Stack(config) {
        this._stackNode = this.get(BOUNDING_BOX);
        this._stackHandles = {};

        // WIDGET METHOD OVERLAP
        Y.after(this._renderUIStack, this, RENDER_UI);
        Y.after(this._syncUIStack, this, SYNC_UI);
        Y.after(this._bindUIStack, this, BIND_UI);
    }

    // Static Properties
    /**
     * Static property used to define the default attribute 
     * configuration introduced by WidgetStack.
     * 
     * @property WidgetStack.ATTRS
     * @type Object
     * @static
     */
    Stack.ATTRS = {
        /**
         * @attribute shim
         * @type boolean
         * @default false, for all browsers other than IE6, for which a shim is enabled by default.
         * 
         * @description Boolean flag to indicate whether or not a shim should be added to the Widgets
         * boundingBox, to protect it from select box bleedthrough.
         */
        shim: {
            value: (UA.ie == 6)
        },

        /**
         * @attribute zIndex
         * @type number
         * @default 0
         * @description The z-index to apply to the Widgets boundingBox. Non-numerical values for 
         * zIndex will be converted to 0
         */
        zIndex: {
            value:0,
            setter: function(val) {
                return this._setZIndex(val);
            }
        }
    };

    /**
     * The HTML parsing rules for the WidgetStack class.
     * 
     * @property WidgetStack.HTML_PARSER
     * @static
     * @type Object
     */
    Stack.HTML_PARSER = {
        zIndex: function(contentBox) {
            return contentBox.getStyle(ZINDEX);
        }
    };

    /**
     * Default class used to mark the shim element
     *
     * @property WidgetStack.SHIM_CLASS_NAME
     * @type String
     * @static
     * @default "yui-widget-shim"
     */
    Stack.SHIM_CLASS_NAME = Widget.getClassName(SHIM);

    /**
     * Default class used to mark the boundingBox of a stacked widget.
     * 
     * @property WidgetStack.STACKED_CLASS_NAME
     * @type String
     * @static
     * @default "yui-widget-stacked"
     */
    Stack.STACKED_CLASS_NAME = Widget.getClassName(STACKED);

    /**
     * Default markup template used to generate the shim element.
     * 
     * @property WidgetStack.SHIM_TEMPLATE
     * @type String
     * @static
     */
    Stack.SHIM_TEMPLATE = '<iframe class="' + Stack.SHIM_CLASS_NAME + '" frameborder="0" title="Widget Stacking Shim" src="javascript:false" tabindex="-1" role="presentation"></iframe>';

    Stack.prototype = {

        /**
         * Synchronizes the UI to match the Widgets stack state. This method in 
         * invoked after syncUI is invoked for the Widget class using YUI's aop infrastructure.
         *
         * @method _syncUIStack
         * @protected
         */
        _syncUIStack: function() {
            this._uiSetShim(this.get(SHIM));
            this._uiSetZIndex(this.get(ZINDEX));
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to 
         * Widget stack related state changes.
         * <p>
         * This method is invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIStack
         * @protected
         */
        _bindUIStack: function() {
            this.after(ShimChange, this._afterShimChange);
            this.after(ZIndexChange, this._afterZIndexChange);
        },

        /**
         * Creates/Initializes the DOM to support stackability.
         * <p>
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIStack
         * @protected
         */
        _renderUIStack: function() {
            this._stackNode.addClass(Stack.STACKED_CLASS_NAME);
        },

        /**
         * Default setter for zIndex attribute changes. Normalizes zIndex values to 
         * numbers, converting non-numerical values to 0.
         *
         * @method _setZIndex
         * @protected
         * @param {String | Number} zIndex
         * @return {Number} Normalized zIndex
         */
        _setZIndex: function(zIndex) {
            if (L.isString(zIndex)) {
                zIndex = parseInt(zIndex, 10);
            }
            if (!L.isNumber(zIndex)) {
                zIndex = 0;
            }
            return zIndex;
        },

        /**
         * Default attribute change listener for the shim attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterShimChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterShimChange : function(e) {
            this._uiSetShim(e.newVal);
        },

        /**
         * Default attribute change listener for the zIndex attribute, responsible
         * for updating the UI, in response to attribute changes.
         * 
         * @method _afterZIndexChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterZIndexChange : function(e) {
            this._uiSetZIndex(e.newVal);
        },

        /**
         * Updates the UI to reflect the zIndex value passed in.
         *
         * @method _uiSetZIndex
         * @protected
         * @param {number} zIndex The zindex to be reflected in the UI
         */
        _uiSetZIndex: function (zIndex) {
            this._stackNode.setStyle(ZINDEX, zIndex);
        },

        /**
         * Updates the UI to enable/disable the shim. If the widget is not currently visible,
         * creation of the shim is deferred until it is made visible, for performance reasons.
         *
         * @method _uiSetShim
         * @protected
         * @param {boolean} enable If true, creates/renders the shim, if false, removes it.
         */
        _uiSetShim: function (enable) {
            if (enable) {
                // Lazy creation
                if (this.get(VISIBLE)) {
                    this._renderShim();
                } else {
                    this._renderShimDeferred();
                }
            } else {
                this._destroyShim();
            }
        },

        /**
         * Sets up change handlers for the visible attribute, to defer shim creation/rendering 
         * until the Widget is made visible.
         * 
         * @method _renderShimDeferred
         * @private
         */
        _renderShimDeferred : function() {

            this._stackHandles[SHIM_DEFERRED] = this._stackHandles[SHIM_DEFERRED] || [];

            var handles = this._stackHandles[SHIM_DEFERRED],
                createBeforeVisible = function(e) {
                    if (e.newVal) {
                        this._renderShim();
                    }
                };

            handles.push(this.on(VisibleChange, createBeforeVisible));
        },

        /**
         * Sets up event listeners to resize the shim when the size of the Widget changes.
         * <p>
         * NOTE: This method is only used for IE6 currently, since IE6 doesn't support a way to
         * resize the shim purely through CSS, when the Widget does not have an explicit width/height 
         * set.
         * </p>
         * @method _addShimResizeHandlers
         * @private
         */
        _addShimResizeHandlers : function() {

            this._stackHandles[SHIM_RESIZE] = this._stackHandles[SHIM_RESIZE] || [];

            var sizeShim = this.sizeShim,
                handles = this._stackHandles[SHIM_RESIZE];

            this.sizeShim();

            handles.push(this.after(VisibleChange, sizeShim));
            handles.push(this.after(WidthChange, sizeShim));
            handles.push(this.after(HeightChange, sizeShim));
            handles.push(this.after(ContentUpdate, sizeShim));
        },

        /**
         * Detaches any handles stored for the provided key
         *
         * @method _detachStackHandles
         * @param String handleKey The key defining the group of handles which should be detached
         * @private
         */
        _detachStackHandles : function(handleKey) {
            var handles = this._stackHandles[handleKey],
                handle;

            if (handles && handles.length > 0) {
                while((handle = handles.pop())) {
                    handle.detach();
                }
            }
        },

        /**
         * Creates the shim element and adds it to the DOM
         *
         * @method _renderShim
         * @private
         */
        _renderShim : function() {
            var shimEl = this._shimNode,
                stackEl = this._stackNode;

            if (!shimEl) {
                shimEl = this._shimNode = this._getShimTemplate();
                stackEl.insertBefore(shimEl, stackEl.get(FIRST_CHILD));

                if (UA.ie == 6) {
                    this._addShimResizeHandlers();
                }
                this._detachStackHandles(SHIM_DEFERRED);
            }
        },

        /**
         * Removes the shim from the DOM, and detaches any related event
         * listeners.
         *
         * @method _destroyShim
         * @private
         */
        _destroyShim : function() {
            if (this._shimNode) {
                this._shimNode.get(PARENT_NODE).removeChild(this._shimNode);
                this._shimNode = null;

                this._detachStackHandles(SHIM_DEFERRED);
                this._detachStackHandles(SHIM_RESIZE);
            }
        },

        /**
         * For IE6, synchronizes the size and position of iframe shim to that of 
         * Widget bounding box which it is protecting. For all other browsers,
         * this method does not do anything.
         *
         * @method sizeShim
         */
        sizeShim: function () {
            var shim = this._shimNode,
                node = this._stackNode;

            if (shim && UA.ie === 6 && this.get(VISIBLE)) {
                shim.setStyle(WIDTH, node.get(OFFSET_WIDTH) + PX);
                shim.setStyle(HEIGHT, node.get(OFFSET_HEIGHT) + PX);
            }
        },

        /**
         * Creates a cloned shim node, using the SHIM_TEMPLATE html template, for use on a new instance.
         *
         * @method _getShimTemplate
         * @private
         * @return {Node} node A new shim Node instance.
         */
        _getShimTemplate : function() {
            return Node.create(Stack.SHIM_TEMPLATE, this._stackNode.get(OWNER_DOCUMENT));
        }
    };

    Y.WidgetStack = Stack;


}, '3.3.0' ,{requires:['base-build', 'widget']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('autocomplete-base', function(Y) {

/**
 * Provides automatic input completion or suggestions for text input fields and
 * textareas.
 *
 * @module autocomplete
 * @since 3.3.0
 */

/**
 * <code>Y.Base</code> extension that provides core autocomplete logic (but no
 * UI implementation) for a text input field or textarea. Must be mixed into a
 * <code>Y.Base</code>-derived class to be useful.
 *
 * @module autocomplete
 * @submodule autocomplete-base
 */

/**
 * <p>
 * Extension that provides core autocomplete logic (but no UI implementation)
 * for a text input field or textarea.
 * </p>
 *
 * <p>
 * The <code>AutoCompleteBase</code> class provides events and attributes that
 * abstract away core autocomplete logic and configuration, but does not provide
 * a widget implementation or suggestion UI. For a prepackaged autocomplete
 * widget, see <code>AutoCompleteList</code>.
 * </p>
 *
 * <p>
 * This extension cannot be instantiated directly, since it doesn't provide an
 * actual implementation. It's intended to be mixed into a
 * <code>Y.Base</code>-based class or widget.
 * </p>
 *
 * <p>
 * <code>Y.Widget</code>-based example:
 * </p>
 *
 * <pre>
 * YUI().use('autocomplete-base', 'widget', function (Y) {
 * &nbsp;&nbsp;var MyAC = Y.Base.create('myAC', Y.Widget, [Y.AutoCompleteBase], {
 * &nbsp;&nbsp;&nbsp;&nbsp;// Custom prototype methods and properties.
 * &nbsp;&nbsp;}, {
 * &nbsp;&nbsp;&nbsp;&nbsp;// Custom static methods and properties.
 * &nbsp;&nbsp;});
 * &nbsp;
 * &nbsp;&nbsp;// Custom implementation code.
 * });
 * </pre>
 *
 * <p>
 * <code>Y.Base</code>-based example:
 * </p>
 *
 * <pre>
 * YUI().use('autocomplete-base', function (Y) {
 * &nbsp;&nbsp;var MyAC = Y.Base.create('myAC', Y.Base, [Y.AutoCompleteBase], {
 * &nbsp;&nbsp;&nbsp;&nbsp;initializer: function () {
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this._bindUIACBase();
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this._syncUIACBase();
 * &nbsp;&nbsp;&nbsp;&nbsp;},
 * &nbsp;
 * &nbsp;&nbsp;&nbsp;&nbsp;// Custom prototype methods and properties.
 * &nbsp;&nbsp;}, {
 * &nbsp;&nbsp;&nbsp;&nbsp;// Custom static methods and properties.
 * &nbsp;&nbsp;});
 * &nbsp;
 * &nbsp;&nbsp;// Custom implementation code.
 * });
 * </pre>
 *
 * @class AutoCompleteBase
 */

var Escape  = Y.Escape,
    Lang    = Y.Lang,
    YArray  = Y.Array,
    YObject = Y.Object,

    isFunction = Lang.isFunction,
    isString   = Lang.isString,
    trim       = Lang.trim,

    INVALID_VALUE = Y.Attribute.INVALID_VALUE,

    _FUNCTION_VALIDATOR = '_functionValidator',
    _SOURCE_SUCCESS     = '_sourceSuccess',

    ALLOW_BROWSER_AC    = 'allowBrowserAutocomplete',
    INPUT_NODE          = 'inputNode',
    QUERY               = 'query',
    QUERY_DELIMITER     = 'queryDelimiter',
    REQUEST_TEMPLATE    = 'requestTemplate',
    RESULTS             = 'results',
    RESULT_LIST_LOCATOR = 'resultListLocator',
    VALUE               = 'value',
    VALUE_CHANGE        = 'valueChange',

    EVT_CLEAR   = 'clear',
    EVT_QUERY   = QUERY,
    EVT_RESULTS = RESULTS;

function AutoCompleteBase() {
    // AOP bindings.
    Y.before(this._bindUIACBase, this, 'bindUI');
    Y.before(this._destructorACBase, this, 'destructor');
    Y.before(this._syncUIACBase, this, 'syncUI');

    // -- Public Events --------------------------------------------------------

    /**
     * Fires after the query has been completely cleared or no longer meets the
     * minimum query length requirement.
     *
     * @event clear
     * @param {EventFacade} e Event facade with the following additional
     *   properties:
     *
     * <dl>
     *   <dt>prevVal (String)</dt>
     *   <dd>
     *     Value of the query before it was cleared.
     *   </dd>
     * </dl>
     *
     * @preventable _defClearFn
     */
    this.publish(EVT_CLEAR, {
        defaultFn: this._defClearFn
    });

    /**
     * Fires when the contents of the input field have changed and the input
     * value meets the criteria necessary to generate an autocomplete query.
     *
     * @event query
     * @param {EventFacade} e Event facade with the following additional
     *   properties:
     *
     * <dl>
     *   <dt>inputValue (String)</dt>
     *   <dd>
     *     Full contents of the text input field or textarea that generated
     *     the query.
     *   </dd>
     *
     *   <dt>query (String)</dt>
     *   <dd>
     *     Autocomplete query. This is the string that will be used to
     *     request completion results. It may or may not be the same as
     *     <code>inputValue</code>.
     *   </dd>
     * </dl>
     *
     * @preventable _defQueryFn
     */
    this.publish(EVT_QUERY, {
        defaultFn: this._defQueryFn
    });

    /**
     * Fires after query results are received from the <code>source</code>. If
     * no source has been set, this event will not fire.
     *
     * @event results
     * @param {EventFacade} e Event facade with the following additional
     *   properties:
     *
     * <dl>
     *   <dt>data (Array|Object)</dt>
     *   <dd>
     *     Raw, unfiltered result data (if available).
     *   </dd>
     *
     *   <dt>query (String)</dt>
     *   <dd>
     *     Query that generated these results.
     *   </dd>
     *
     *   <dt>results (Array)</dt>
     *   <dd>
     *     Array of filtered, formatted, and highlighted results. Each item in
     *     the array is an object with the following properties:
     *
     *     <dl>
     *       <dt>display (Node|HTMLElement|String)</dt>
     *       <dd>
     *         Formatted result HTML suitable for display to the user. If no
     *         custom formatter is set, this will be an HTML-escaped version of
     *         the string in the <code>text</code> property.
     *       </dd>
     *
     *       <dt>highlighted (String)</dt>
     *       <dd>
     *         Highlighted (but not formatted) result text. This property will
     *         only be set if a highlighter is in use.
     *       </dd>
     *
     *       <dt>raw (mixed)</dt>
     *       <dd>
     *         Raw, unformatted result in whatever form it was provided by the
     *         <code>source</code>.
     *       </dd>
     *
     *       <dt>text (String)</dt>
     *       <dd>
     *         Plain text version of the result, suitable for being inserted
     *         into the value of a text input field or textarea when the result
     *         is selected by a user. This value is not HTML-escaped and should
     *         not be inserted into the page using innerHTML.
     *       </dd>
     *     </dl>
     *   </dd>
     * </dl>
     *
     * @preventable _defResultsFn
     */
    this.publish(EVT_RESULTS, {
        defaultFn: this._defResultsFn
    });
}

// -- Public Static Properties -------------------------------------------------
AutoCompleteBase.ATTRS = {
    /**
     * Whether or not to enable the browser's built-in autocomplete
     * functionality for input fields.
     *
     * @attribute allowBrowserAutocomplete
     * @type Boolean
     * @default false
     */
    allowBrowserAutocomplete: {
        value: false
    },

    /**
     * When a <code>queryDelimiter</code> is set, trailing delimiters will
     * automatically be stripped from the input value by default when the
     * input node loses focus. Set this to <code>true</code> to allow trailing
     * delimiters.
     *
     * @attribute allowTrailingDelimiter
     * @type Boolean
     * @default false
     */
    allowTrailingDelimiter: {
        value: false
    },

    /**
     * Node to monitor for changes, which will generate <code>query</code>
     * events when appropriate. May be either an input field or a textarea.
     *
     * @attribute inputNode
     * @type Node|HTMLElement|String
     * @writeonce
     */
    inputNode: {
        setter: Y.one,
        writeOnce: 'initOnly'
    },

    /**
     * Maximum number of results to return. A value of <code>0</code> or less
     * will allow an unlimited number of results.
     *
     * @attribute maxResults
     * @type Number
     * @default 0
     */
    maxResults: {
        value: 0
    },

    /**
     * Minimum number of characters that must be entered before a
     * <code>query</code> event will be fired. A value of <code>0</code>
     * allows empty queries; a negative value will effectively disable all
     * <code>query</code> events.
     *
     * @attribute minQueryLength
     * @type Number
     * @default 1
     */
    minQueryLength: {
        value: 1
    },

    /**
     * <p>
     * Current query, or <code>null</code> if there is no current query.
     * </p>
     *
     * <p>
     * The query might not be the same as the current value of the input
     * node, both for timing reasons (due to <code>queryDelay</code>) and
     * because when one or more <code>queryDelimiter</code> separators are
     * in use, only the last portion of the delimited input string will be
     * used as the query value.
     * </p>
     *
     * @attribute query
     * @type String|null
     * @default null
     * @readonly
     */
    query: {
        readOnly: true,
        value: null
    },

    /**
     * <p>
     * Number of milliseconds to delay after input before triggering a
     * <code>query</code> event. If new input occurs before this delay is
     * over, the previous input event will be ignored and a new delay will
     * begin.
     * </p>
     *
     * <p>
     * This can be useful both to throttle queries to a remote data source
     * and to avoid distracting the user by showing them less relevant
     * results before they've paused their typing.
     * </p>
     *
     * @attribute queryDelay
     * @type Number
     * @default 100
     */
    queryDelay: {
        value: 100
    },

    /**
     * Query delimiter string. When a delimiter is configured, the input value
     * will be split on the delimiter, and only the last portion will be used in
     * autocomplete queries and updated when the <code>query</code> attribute is
     * modified.
     *
     * @attribute queryDelimiter
     * @type String|null
     * @default null
     */
    queryDelimiter: {
        value: null
    },

    /**
     * <p>
     * Source request template. This can be a function that accepts a query as a
     * parameter and returns a request string, or it can be a string containing
     * the placeholder "{query}", which will be replaced with the actual
     * URI-encoded query. In either case, the resulting string will be appended
     * to the request URL when the <code>source</code> attribute is set to a
     * remote DataSource, JSONP URL, or XHR URL (it will not be appended to YQL
     * URLs).
     * </p>
     *
     * <p>
     * While <code>requestTemplate</code> may be set to either a function or
     * a string, it will always be returned as a function that accepts a
     * query argument and returns a string.
     * </p>
     *
     * @attribute requestTemplate
     * @type Function|String|null
     * @default null
     */
    requestTemplate: {
        setter: '_setRequestTemplate',
        value: null
    },

    /**
     * <p>
     * Array of local result filter functions. If provided, each filter
     * will be called with two arguments when results are received: the query
     * and an array of result objects. See the documentation for the
     * <code>results</code> event for a list of the properties available on each
     * result object.
     * </p>
     *
     * <p>
     * Each filter is expected to return a filtered or modified version of the
     * results array, which will then be passed on to subsequent filters, then
     * the <code>resultHighlighter</code> function (if set), then the
     * <code>resultFormatter</code> function (if set), and finally to
     * subscribers to the <code>results</code> event.
     * </p>
     *
     * <p>
     * If no <code>source</code> is set, result filters will not be called.
     * </p>
     *
     * <p>
     * Prepackaged result filters provided by the autocomplete-filters and
     * autocomplete-filters-accentfold modules can be used by specifying the
     * filter name as a string, such as <code>'phraseMatch'</code> (assuming
     * the necessary filters module is loaded).
     * </p>
     *
     * @attribute resultFilters
     * @type Array
     * @default []
     */
    resultFilters: {
        setter: '_setResultFilters',
        value: []
    },

    /**
     * <p>
     * Function which will be used to format results. If provided, this function
     * will be called with two arguments after results have been received and
     * filtered: the query and an array of result objects. The formatter is
     * expected to return an array of HTML strings or Node instances containing
     * the desired HTML for each result.
     * </p>
     *
     * <p>
     * See the documentation for the <code>results</code> event for a list of
     * the properties available on each result object.
     * </p>
     *
     * <p>
     * If no <code>source</code> is set, the formatter will not be called.
     * </p>
     *
     * @attribute resultFormatter
     * @type Function|null
     */
    resultFormatter: {
        validator: _FUNCTION_VALIDATOR
    },

    /**
     * <p>
     * Function which will be used to highlight results. If provided, this
     * function will be called with two arguments after results have been
     * received and filtered: the query and an array of filtered result objects.
     * The highlighter is expected to return an array of highlighted result
     * text in the form of HTML strings.
     * </p>
     *
     * <p>
     * See the documentation for the <code>results</code> event for a list of
     * the properties available on each result object.
     * </p>
     *
     * <p>
     * If no <code>source</code> is set, the highlighter will not be called.
     * </p>
     *
     * @attribute resultHighlighter
     * @type Function|null
     */
    resultHighlighter: {
        setter: '_setResultHighlighter'
    },

    /**
     * <p>
     * Locator that should be used to extract an array of results from a
     * non-array response.
     * </p>
     *
     * <p>
     * By default, no locator is applied, and all responses are assumed to be
     * arrays by default. If all responses are already arrays, you don't need to
     * define a locator.
     * </p>
     *
     * <p>
     * The locator may be either a function (which will receive the raw response
     * as an argument and must return an array) or a string representing an
     * object path, such as "foo.bar.baz" (which would return the value of
     * <code>result.foo.bar.baz</code> if the response is an object).
     * </p>
     *
     * <p>
     * While <code>resultListLocator</code> may be set to either a function or a
     * string, it will always be returned as a function that accepts a response
     * argument and returns an array.
     * </p>
     *
     * @attribute resultListLocator
     * @type Function|String|null
     */
    resultListLocator: {
        setter: '_setLocator'
    },

    /**
     * Current results, or an empty array if there are no results.
     *
     * @attribute results
     * @type Array
     * @default []
     * @readonly
     */
    results: {
        readOnly: true,
        value: []
    },

    /**
     * <p>
     * Locator that should be used to extract a plain text string from a
     * non-string result item. The resulting text value will typically be the
     * value that ends up being inserted into an input field or textarea when
     * the user of an autocomplete implementation selects a result.
     * </p>
     *
     * <p>
     * By default, no locator is applied, and all results are assumed to be
     * plain text strings. If all results are already plain text strings, you
     * don't need to define a locator.
     * </p>
     *
     * <p>
     * The locator may be either a function (which will receive the raw result
     * as an argument and must return a string) or a string representing an
     * object path, such as "foo.bar.baz" (which would return the value of
     * <code>result.foo.bar.baz</code> if the result is an object).
     * </p>
     *
     * <p>
     * While <code>resultTextLocator</code> may be set to either a function or a
     * string, it will always be returned as a function that accepts a result
     * argument and returns a string.
     * </p>
     *
     * @attribute resultTextLocator
     * @type Function|String|null
     */
    resultTextLocator: {
        setter: '_setLocator'
    },

    /**
     * <p>
     * Source for autocomplete results. The following source types are
     * supported:
     * </p>
     *
     * <dl>
     *   <dt>Array</dt>
     *   <dd>
     *     <p>
     *     <i>Example:</i> <code>['first result', 'second result', 'etc']</code>
     *     </p>
     *
     *     <p>
     *     The full array will be provided to any configured filters for each
     *     query. This is an easy way to create a fully client-side autocomplete
     *     implementation.
     *     </p>
     *   </dd>
     *
     *   <dt>DataSource</dt>
     *   <dd>
     *     <p>
     *     A <code>DataSource</code> instance or other object that provides a
     *     DataSource-like <code>sendRequest</code> method. See the
     *     <code>DataSource</code> documentation for details.
     *     </p>
     *   </dd>
     *
     *   <dt>Function</dt>
     *   <dd>
     *     <p>
     *     <i>Example:</i> <code>function (query) { return ['foo', 'bar']; }</code>
     *     </p>
     *
     *     <p>
     *     A function source will be called with the current query as a
     *     parameter, and should return an array of results.
     *     </p>
     *   </dd>
     *
     *   <dt>Object</dt>
     *   <dd>
     *     <p>
     *     <i>Example:</i> <code>{foo: ['foo result 1', 'foo result 2'], bar: ['bar result']}</code>
     *     </p>
     *
     *     <p>
     *     An object will be treated as a query hashmap. If a property on the
     *     object matches the current query, the value of that property will be
     *     used as the response.
     *     </p>
     *
     *     <p>
     *     The response is assumed to be an array of results by default. If the
     *     response is not an array, provide a <code>resultListLocator</code> to
     *     process the response and return an array.
     *     </p>
     *   </dd>
     * </dl>
     *
     * <p>
     * If the optional <code>autocomplete-sources</code> module is loaded, then
     * the following additional source types will be supported as well:
     * </p>
     *
     * <dl>
     *   <dt>String (JSONP URL)</dt>
     *   <dd>
     *     <p>
     *     <i>Example:</i> <code>'http://example.com/search?q={query}&callback={callback}'</code>
     *     </p>
     *
     *     <p>
     *     If a URL with a <code>{callback}</code> placeholder is provided, it
     *     will be used to make a JSONP request. The <code>{query}</code>
     *     placeholder will be replaced with the current query, and the
     *     <code>{callback}</code> placeholder will be replaced with an
     *     internally-generated JSONP callback name. Both placeholders must
     *     appear in the URL, or the request will fail. An optional
     *     <code>{maxResults}</code> placeholder may also be provided, and will
     *     be replaced with the value of the maxResults attribute (or 1000 if
     *     the maxResults attribute is 0 or less).
     *     </p>
     *
     *     <p>
     *     The response is assumed to be an array of results by default. If the
     *     response is not an array, provide a <code>resultListLocator</code> to
     *     process the response and return an array.
     *     </p>
     *
     *     <p>
     *     <strong>The <code>jsonp</code> module must be loaded in order for
     *     JSONP URL sources to work.</strong> If the <code>jsonp</code> module
     *     is not already loaded, it will be loaded on demand if possible.
     *     </p>
     *   </dd>
     *
     *   <dt>String (XHR URL)</dt>
     *   <dd>
     *     <p>
     *     <i>Example:</i> <code>'http://example.com/search?q={query}'</code>
     *     </p>
     *
     *     <p>
     *     If a URL without a <code>{callback}</code> placeholder is provided,
     *     it will be used to make a same-origin XHR request. The
     *     <code>{query}</code> placeholder will be replaced with the current
     *     query. An optional <code>{maxResults}</code> placeholder may also be
     *     provided, and will be replaced with the value of the maxResults
     *     attribute (or 1000 if the maxResults attribute is 0 or less).
     *     </p>
     *
     *     <p>
     *     The response is assumed to be a JSON array of results by default. If
     *     the response is a JSON object and not an array, provide a
     *     <code>resultListLocator</code> to process the response and return an
     *     array. If the response is in some form other than JSON, you will
     *     need to use a custom DataSource instance as the source.
     *     </p>
     *
     *     <p>
     *     <strong>The <code>io-base</code> and <code>json-parse</code> modules
     *     must be loaded in order for XHR URL sources to work.</strong> If
     *     these modules are not already loaded, they will be loaded on demand
     *     if possible.
     *     </p>
     *   </dd>
     *
     *   <dt>String (YQL query)</dt>
     *   <dd>
     *     <p>
     *     <i>Example:</i> <code>'select * from search.suggest where query="{query}"'</code>
     *     </p>
     *
     *     <p>
     *     If a YQL query is provided, it will be used to make a YQL request.
     *     The <code>{query}</code> placeholder will be replaced with the
     *     current autocomplete query. This placeholder must appear in the YQL
     *     query, or the request will fail. An optional
     *     <code>{maxResults}</code> placeholder may also be provided, and will
     *     be replaced with the value of the maxResults attribute (or 1000 if
     *     the maxResults attribute is 0 or less).
     *     </p>
     *
     *     <p>
     *     <strong>The <code>yql</code> module must be loaded in order for YQL
     *     sources to work.</strong> If the <code>yql</code> module is not
     *     already loaded, it will be loaded on demand if possible.
     *     </p>
     *   </dd>
     * </dl>
     *
     * <p>
     * As an alternative to providing a source, you could simply listen for
     * <code>query</code> events and handle them any way you see fit. Providing
     * a source is optional, but will usually be simpler.
     * </p>
     *
     * @attribute source
     * @type Array|DataSource|Function|Object|String|null
     */
    source: {
        setter: '_setSource'
    },

    /**
     * If the <code>inputNode</code> specified at instantiation time has a
     * <code>node-tokeninput</code> plugin attached to it, this attribute will
     * be a reference to the <code>Y.Plugin.TokenInput</code> instance.
     *
     * @attribute tokenInput
     * @type Plugin.TokenInput
     * @readonly
     */
    tokenInput: {
        readOnly: true
    },

    /**
     * Current value of the input node.
     *
     * @attribute value
     * @type String
     * @default ''
     */
    value: {
        // Why duplicate this._inputNode.get('value')? Because we need a
        // reliable way to track the source of value changes. We want to perform
        // completion when the user changes the value, but not when we change
        // the value.
        value: ''
    }
};

AutoCompleteBase.CSS_PREFIX = 'ac';
AutoCompleteBase.UI_SRC = (Y.Widget && Y.Widget.UI_SRC) || 'ui';

AutoCompleteBase.prototype = {
    // -- Public Prototype Methods ---------------------------------------------

    /**
     * <p>
     * Sends a request to the configured source. If no source is configured,
     * this method won't do anything.
     * </p>
     *
     * <p>
     * Usually there's no reason to call this method manually; it will be
     * called automatically when user input causes a <code>query</code> event to
     * be fired. The only time you'll need to call this method manually is if
     * you want to force a request to be sent when no user input has occurred.
     * </p>
     *
     * @method sendRequest
     * @param {String} query (optional) Query to send. If specified, the
     *   <code>query</code> attribute will be set to this query. If not
     *   specified, the current value of the <code>query</code> attribute will
     *   be used.
     * @param {Function} requestTemplate (optional) Request template function.
     *   If not specified, the current value of the <code>requestTemplate</code>
     *   attribute will be used.
     * @chainable
     */
    sendRequest: function (query, requestTemplate) {
        var request,
            source = this.get('source');

        if (query || query === '') {
            this._set(QUERY, query);
        } else {
            query = this.get(QUERY);
        }

        if (source) {
            if (!requestTemplate) {
                requestTemplate = this.get(REQUEST_TEMPLATE);
            }

            request = requestTemplate ? requestTemplate(query) : query;


            source.sendRequest({
                request: request,
                callback: {
                    success: Y.bind(this._onResponse, this, query)
                }
            });
        }

        return this;
    },

    // -- Protected Lifecycle Methods ------------------------------------------

    /**
     * Attaches event listeners and behaviors.
     *
     * @method _bindUIACBase
     * @protected
     */
    _bindUIACBase: function () {
        var inputNode  = this.get(INPUT_NODE),
            tokenInput = inputNode && inputNode.tokenInput;

        // If the inputNode has a node-tokeninput plugin attached, bind to the
        // plugin's inputNode instead.
        if (tokenInput) {
            inputNode = tokenInput.get(INPUT_NODE);
            this._set('tokenInput', tokenInput);
        }

        if (!inputNode) {
            Y.error('No inputNode specified.');
            return;
        }

        this._inputNode = inputNode;

        this._acBaseEvents = [
            // This is the valueChange event on the inputNode, provided by the
            // event-valuechange module, not our own valueChange.
            inputNode.on(VALUE_CHANGE, this._onInputValueChange, this),

            inputNode.on('blur', this._onInputBlur, this),

            this.after(ALLOW_BROWSER_AC + 'Change', this._syncBrowserAutocomplete),
            this.after(VALUE_CHANGE, this._afterValueChange)
        ];
    },

    /**
     * Detaches AutoCompleteBase event listeners.
     *
     * @method _destructorACBase
     * @protected
     */
    _destructorACBase: function () {
        var events = this._acBaseEvents;

        while (events && events.length) {
            events.pop().detach();
        }
    },

    /**
     * Synchronizes the UI state of the <code>inputNode</code>.
     *
     * @method _syncUIACBase
     * @protected
     */
    _syncUIACBase: function () {
        this._syncBrowserAutocomplete();
        this.set(VALUE, this.get(INPUT_NODE).get(VALUE));
    },

    // -- Protected Prototype Methods ------------------------------------------

    /**
     * Creates a DataSource-like object that simply returns the specified array
     * as a response. See the <code>source</code> attribute for more details.
     *
     * @method _createArraySource
     * @param {Array} source
     * @return {Object} DataSource-like object.
     * @protected
     */
    _createArraySource: function (source) {
        var that = this;

        return {sendRequest: function (request) {
            that[_SOURCE_SUCCESS](source.concat(), request);
        }};
    },

    /**
     * Creates a DataSource-like object that passes the query to a
     * custom-defined function, which is expected to return an array as a
     * response. See the <code>source</code> attribute for more details.
     *
     * @method _createFunctionSource
     * @param {Function} source Function that accepts a query parameter and
     *   returns an array of results.
     * @return {Object} DataSource-like object.
     * @protected
     */
    _createFunctionSource: function (source) {
        var that = this;

        return {sendRequest: function (request) {
            that[_SOURCE_SUCCESS](source(request.request) || [], request);
        }};
    },

    /**
     * Creates a DataSource-like object that looks up queries as properties on
     * the specified object, and returns the found value (if any) as a response.
     * See the <code>source</code> attribute for more details.
     *
     * @method _createObjectSource
     * @param {Object} source
     * @return {Object} DataSource-like object.
     * @protected
     */
    _createObjectSource: function (source) {
        var that = this;

        return {sendRequest: function (request) {
            var query = request.request;

            that[_SOURCE_SUCCESS](
                YObject.owns(source, query) ? source[query] : [],
                request
            );
        }};
    },

    /**
     * Returns <code>true</code> if <i>value</i> is either a function or
     * <code>null</code>.
     *
     * @method _functionValidator
     * @param {Function|null} value Value to validate.
     * @protected
     */
    _functionValidator: function (value) {
        return value === null || isFunction(value);
    },

    /**
     * Faster and safer alternative to Y.Object.getValue(). Doesn't bother
     * casting the path to an array (since we already know it's an array) and
     * doesn't throw an error if a value in the middle of the object hierarchy
     * is neither <code>undefined</code> nor an object.
     *
     * @method _getObjectValue
     * @param {Object} obj
     * @param {Array} path
     * @return {mixed} Located value, or <code>undefined</code> if the value was
     *   not found at the specified path.
     * @protected
     */
    _getObjectValue: function (obj, path) {
        if (!obj) {
            return;
        }

        for (var i = 0, len = path.length; obj && i < len; i++) {
            obj = obj[path[i]];
        }

        return obj;
    },

    /**
     * Parses result responses, performs filtering and highlighting, and fires
     * the <code>results</code> event.
     *
     * @method _parseResponse
     * @param {String} query Query that generated these results.
     * @param {Object} response Response containing results.
     * @param {Object} data Raw response data.
     * @protected
     */
    _parseResponse: function (query, response, data) {
        var facade = {
                data   : data,
                query  : query,
                results: []
            },

            listLocator = this.get(RESULT_LIST_LOCATOR),
            results     = [],
            unfiltered  = response && response.results,

            filters,
            formatted,
            formatter,
            highlighted,
            highlighter,
            i,
            len,
            maxResults,
            result,
            text,
            textLocator;

        if (unfiltered && listLocator) {
            unfiltered = listLocator(unfiltered);
        }

        if (unfiltered && unfiltered.length) {
            filters     = this.get('resultFilters');
            textLocator = this.get('resultTextLocator');

            // Create a lightweight result object for each result to make them
            // easier to work with. The various properties on the object
            // represent different formats of the result, and will be populated
            // as we go.
            for (i = 0, len = unfiltered.length; i < len; ++i) {
                result = unfiltered[i];
                text   = textLocator ? textLocator(result) : result.toString();

                results.push({
                    display: Escape.html(text),
                    raw    : result,
                    text   : text
                });
            }

            // Run the results through all configured result filters. Each
            // filter returns an array of (potentially fewer) result objects,
            // which is then passed to the next filter, and so on.
            for (i = 0, len = filters.length; i < len; ++i) {
                results = filters[i](query, results.concat());

                if (!results) {
                    return;
                }

                if (!results.length) {
                    break;
                }
            }

            if (results.length) {
                formatter   = this.get('resultFormatter');
                highlighter = this.get('resultHighlighter');
                maxResults  = this.get('maxResults');

                // If maxResults is set and greater than 0, limit the number of
                // results.
                if (maxResults && maxResults > 0 &&
                        results.length > maxResults) {
                    results.length = maxResults;
                }

                // Run the results through the configured highlighter (if any).
                // The highlighter returns an array of highlighted strings (not
                // an array of result objects), and these strings are then added
                // to each result object.
                if (highlighter) {
                    highlighted = highlighter(query, results.concat());

                    if (!highlighted) {
                        return;
                    }

                    for (i = 0, len = highlighted.length; i < len; ++i) {
                        result = results[i];
                        result.highlighted = highlighted[i];
                        result.display     = result.highlighted;
                    }
                }

                // Run the results through the configured formatter (if any) to
                // produce the final formatted results. The formatter returns an
                // array of strings or Node instances (not an array of result
                // objects), and these strings/Nodes are then added to each
                // result object.
                if (formatter) {
                    formatted = formatter(query, results.concat());

                    if (!formatted) {
                        return;
                    }

                    for (i = 0, len = formatted.length; i < len; ++i) {
                        results[i].display = formatted[i];
                    }
                }
            }
        }

        facade.results = results;
        this.fire(EVT_RESULTS, facade);
    },

    /**
     * <p>
     * Returns the query portion of the specified input value, or
     * <code>null</code> if there is no suitable query within the input value.
     * </p>
     *
     * <p>
     * If a query delimiter is defined, the query will be the last delimited
     * part of of the string.
     * </p>
     *
     * @method _parseValue
     * @param {String} value Input value from which to extract the query.
     * @return {String|null} query
     * @protected
     */
    _parseValue: function (value) {
        var delim = this.get(QUERY_DELIMITER);

        if (delim) {
            value = value.split(delim);
            value = value[value.length - 1];
        }

        return Lang.trimLeft(value);
    },

    /**
     * Setter for locator attributes.
     *
     * @method _setLocator
     * @param {Function|String|null} locator
     * @return {Function|null}
     * @protected
     */
    _setLocator: function (locator) {
        if (this[_FUNCTION_VALIDATOR](locator)) {
            return locator;
        }

        var that = this;

        locator = locator.toString().split('.');

        return function (result) {
            return result && that._getObjectValue(result, locator);
        };
    },

    /**
     * Setter for the <code>requestTemplate</code> attribute.
     *
     * @method _setRequestTemplate
     * @param {Function|String|null} template
     * @return {Function|null}
     * @protected
     */
    _setRequestTemplate: function (template) {
        if (this[_FUNCTION_VALIDATOR](template)) {
            return template;
        }

        template = template.toString();

        return function (query) {
            return Lang.sub(template, {query: encodeURIComponent(query)});
        };
    },

    /**
     * Setter for the <code>resultFilters</code> attribute.
     *
     * @method _setResultFilters
     * @param {Array|Function|String|null} filters <code>null</code>, a filter
     *   function, an array of filter functions, or a string or array of strings
     *   representing the names of methods on
     *   <code>Y.AutoCompleteFilters</code>.
     * @return {Array} Array of filter functions (empty if <i>filters</i> is
     *   <code>null</code>).
     * @protected
     */
    _setResultFilters: function (filters) {
        var acFilters, getFilterFunction;

        if (filters === null) {
            return [];
        }

        acFilters = Y.AutoCompleteFilters;

        getFilterFunction = function (filter) {
            if (isFunction(filter)) {
                return filter;
            }

            if (isString(filter) && acFilters &&
                    isFunction(acFilters[filter])) {
                return acFilters[filter];
            }

            return false;
        };

        if (Lang.isArray(filters)) {
            filters = YArray.map(filters, getFilterFunction);
            return YArray.every(filters, function (f) { return !!f; }) ?
                    filters : INVALID_VALUE;
        } else {
            filters = getFilterFunction(filters);
            return filters ? [filters] : INVALID_VALUE;
        }
    },

    /**
     * Setter for the <code>resultHighlighter</code> attribute.
     *
     * @method _setResultHighlighter
     * @param {Function|String|null} highlighter <code>null</code>, a
     *   highlighter function, or a string representing the name of a method on
     *   <code>Y.AutoCompleteHighlighters</code>.
     * @return {Function|null}
     * @protected
     */
    _setResultHighlighter: function (highlighter) {
        var acHighlighters;

        if (this._functionValidator(highlighter)) {
            return highlighter;
        }

        acHighlighters = Y.AutoCompleteHighlighters;

        if (isString(highlighter) && acHighlighters &&
                isFunction(acHighlighters[highlighter])) {
            return acHighlighters[highlighter];
        }

        return INVALID_VALUE;
    },

    /**
     * Setter for the <code>source</code> attribute. Returns a DataSource or
     * a DataSource-like object depending on the type of <i>source</i>.
     *
     * @method _setSource
     * @param {Array|DataSource|Object|String} source AutoComplete source. See
     *   the <code>source</code> attribute for details.
     * @return {DataSource|Object}
     * @protected
     */
    _setSource: function (source) {
        var sourcesNotLoaded = 'autocomplete-sources module not loaded';

        if ((source && isFunction(source.sendRequest)) || source === null) {
            // Quacks like a DataSource instance (or null). Make it so!
            return source;
        }

        switch (Lang.type(source)) {
        case 'string':
            if (this._createStringSource) {
                return this._createStringSource(source);
            }

            Y.error(sourcesNotLoaded);
            return INVALID_VALUE;

        case 'array':
            // Wrap the array in a teensy tiny fake DataSource that just returns
            // the array itself for each request. Filters will do the rest.
            return this._createArraySource(source);

        case 'function':
            return this._createFunctionSource(source);

        case 'object':
            // If the object is a JSONPRequest instance, use it as a JSONP
            // source.
            if (Y.JSONPRequest && source instanceof Y.JSONPRequest) {
                if (this._createJSONPSource) {
                    return this._createJSONPSource(source);
                }

                Y.error(sourcesNotLoaded);
                return INVALID_VALUE;
            }

            // Not a JSONPRequest instance. Wrap the object in a teensy tiny
            // fake DataSource that looks for the request as a property on the
            // object and returns it if it exists, or an empty array otherwise.
            return this._createObjectSource(source);
        }

        return INVALID_VALUE;
    },

    /**
     * Shared success callback for non-DataSource sources.
     *
     * @method _sourceSuccess
     * @param {mixed} data Response data.
     * @param {Object} request Request object.
     * @protected
     */
    _sourceSuccess: function (data, request) {
        request.callback.success({
            data: data,
            response: {results: data}
        });
    },

    /**
     * Synchronizes the UI state of the <code>allowBrowserAutocomplete</code>
     * attribute.
     *
     * @method _syncBrowserAutocomplete
     * @protected
     */
    _syncBrowserAutocomplete: function () {
        var inputNode = this.get(INPUT_NODE);

        if (inputNode.get('nodeName').toLowerCase() === 'input') {
            inputNode.setAttribute('autocomplete',
                    this.get(ALLOW_BROWSER_AC) ? 'on' : 'off');
        }
    },

    /**
     * <p>
     * Updates the query portion of the <code>value</code> attribute.
     * </p>
     *
     * <p>
     * If a query delimiter is defined, the last delimited portion of the input
     * value will be replaced with the specified <i>value</i>.
     * </p>
     *
     * @method _updateValue
     * @param {String} newVal New value.
     * @protected
     */
    _updateValue: function (newVal) {
        var delim = this.get(QUERY_DELIMITER),
            insertDelim,
            len,
            prevVal;

        newVal = Lang.trimLeft(newVal);

        if (delim) {
            insertDelim = trim(delim); // so we don't double up on spaces
            prevVal     = YArray.map(trim(this.get(VALUE)).split(delim), trim);
            len         = prevVal.length;

            if (len > 1) {
                prevVal[len - 1] = newVal;
                newVal = prevVal.join(insertDelim + ' ');
            }

            newVal = newVal + insertDelim + ' ';
        }

        this.set(VALUE, newVal);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handles change events for the <code>value</code> attribute.
     *
     * @method _afterValueChange
     * @param {EventFacade} e
     * @protected
     */
    _afterValueChange: function (e) {
        var delay,
            fire,
            minQueryLength,
            newVal = e.newVal,
            query,
            that;

        // Don't query on value changes that didn't come from the user.
        if (e.src !== AutoCompleteBase.UI_SRC) {
            this._inputNode.set(VALUE, newVal);
            return;
        }


        minQueryLength = this.get('minQueryLength');
        query          = this._parseValue(newVal) || '';

        if (minQueryLength >= 0 && query.length >= minQueryLength) {
            delay = this.get('queryDelay');
            that  = this;

            fire = function () {
                that.fire(EVT_QUERY, {
                    inputValue: newVal,
                    query     : query
                });
            };

            if (delay) {
                clearTimeout(this._delay);
                this._delay = setTimeout(fire, delay);
            } else {
                fire();
            }
        } else {
            clearTimeout(this._delay);

            this.fire(EVT_CLEAR, {
                prevVal: e.prevVal ? this._parseValue(e.prevVal) : null
            });
        }
    },

    /**
     * Handles <code>blur</code> events on the input node.
     *
     * @method _onInputBlur
     * @param {EventFacade} e
     * @protected
     */
    _onInputBlur: function (e) {
        var delim = this.get(QUERY_DELIMITER),
            delimPos,
            newVal,
            value;

        // If a query delimiter is set and the input's value contains one or
        // more trailing delimiters, strip them.
        if (delim && !this.get('allowTrailingDelimiter')) {
            delim = Lang.trimRight(delim);
            value = newVal = this._inputNode.get(VALUE);

            if (delim) {
                while ((newVal = Lang.trimRight(newVal)) &&
                        (delimPos = newVal.length - delim.length) &&
                        newVal.lastIndexOf(delim) === delimPos) {

                    newVal = newVal.substring(0, delimPos);
                }
            } else {
                // Delimiter is one or more space characters, so just trim the
                // value.
                newVal = Lang.trimRight(newVal);
            }

            if (newVal !== value) {
                this.set(VALUE, newVal);
            }
        }
    },

    /**
     * Handles <code>valueChange</code> events on the input node and fires a
     * <code>query</code> event when the input value meets the configured
     * criteria.
     *
     * @method _onInputValueChange
     * @param {EventFacade} e
     * @protected
     */
    _onInputValueChange: function (e) {
        var newVal = e.newVal;

        // Don't query if the internal value is the same as the new value
        // reported by valueChange.
        if (newVal === this.get(VALUE)) {
            return;
        }

        this.set(VALUE, newVal, {src: AutoCompleteBase.UI_SRC});
    },

    /**
     * Handles source responses and fires the <code>results</code> event.
     *
     * @method _onResponse
     * @param {EventFacade} e
     * @protected
     */
    _onResponse: function (query, e) {
        // Ignore stale responses that aren't for the current query.
        if (query === this.get(QUERY)) {
            this._parseResponse(query, e.response, e.data);
        }
    },

    // -- Protected Default Event Handlers -------------------------------------

    /**
     * Default <code>clear</code> event handler. Sets the <code>results</code>
     * property to an empty array and <code>query</code> to null.
     *
     * @method _defClearFn
     * @protected
     */
    _defClearFn: function () {
        this._set(QUERY, null);
        this._set(RESULTS, []);
    },

    /**
     * Default <code>query</code> event handler. Sets the <code>query</code>
     * property and sends a request to the source if one is configured.
     *
     * @method _defQueryFn
     * @param {EventFacade} e
     * @protected
     */
    _defQueryFn: function (e) {
        var query = e.query;

        this.sendRequest(query); // sendRequest will set the 'query' attribute
    },

    /**
     * Default <code>results</code> event handler. Sets the <code>results</code>
     * property to the latest results.
     *
     * @method _defResultsFn
     * @param {EventFacade} e
     * @protected
     */
    _defResultsFn: function (e) {
        this._set(RESULTS, e[RESULTS]);
    }
};

Y.AutoCompleteBase = AutoCompleteBase;


}, '3.3.0' ,{optional:['autocomplete-sources'], requires:['array-extras', 'base-build', 'escape', 'event-valuechange', 'node-base']});
YUI.add('autocomplete-sources', function(Y) {

/**
 * Mixes support for JSONP and YQL result sources into AutoCompleteBase.
 *
 * @module autocomplete
 * @submodule autocomplete-sources
 */

var Lang = Y.Lang,

    _SOURCE_SUCCESS = '_sourceSuccess',

    MAX_RESULTS         = 'maxResults',
    REQUEST_TEMPLATE    = 'requestTemplate',
    RESULT_LIST_LOCATOR = 'resultListLocator';

function ACSources() {}

ACSources.prototype = {
    /**
     * Regular expression used to determine whether a String source is a YQL
     * query.
     *
     * @property _YQL_SOURCE_REGEX
     * @type RegExp
     * @protected
     * @for AutoCompleteBase
     */
    _YQL_SOURCE_REGEX: /^(?:select|set|use)\s+/i,

    /**
     * Creates a DataSource-like object that uses <code>Y.io</code> as a source.
     * See the <code>source</code> attribute for more details.
     *
     * @method _createIOSource
     * @param {String} source URL.
     * @return {Object} DataSource-like object.
     * @protected
     * @for AutoCompleteBase
     */
    _createIOSource: function (source) {
        var cache    = {},
            ioSource = {},
            that     = this,
            ioRequest, lastRequest, loading;

        ioSource.sendRequest = function (request) {
            var _sendRequest = function (request) {
                var query = request.request,
                    maxResults, requestTemplate, url;

                if (cache[query]) {
                    that[_SOURCE_SUCCESS](cache[query], request);
                } else {
                    maxResults      = that.get(MAX_RESULTS);
                    requestTemplate = that.get(REQUEST_TEMPLATE);
                    url             = source;

                    if (requestTemplate) {
                        url += requestTemplate(query);
                    }

                    url = Lang.sub(url, {
                        maxResults: maxResults > 0 ? maxResults : 1000,
                        query     : encodeURIComponent(query)
                    });

                    // Cancel any outstanding requests.
                    if (ioRequest && ioRequest.isInProgress()) {
                        ioRequest.abort();
                    }

                    ioRequest = Y.io(url, {
                        on: {
                            success: function (tid, response) {
                                var data;

                                try {
                                    data = Y.JSON.parse(response.responseText);
                                } catch (ex) {
                                    Y.error('JSON parse error', ex);
                                }

                                if (data) {
                                    cache[query] = data;
                                    that[_SOURCE_SUCCESS](data, request);
                                }
                            }
                        }
                    });
                }
            };

            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the IO module to load. Only the
            // most recent request will be sent.
            lastRequest = request;

            if (!loading) {
                loading = true;

                // Lazy-load the io and json-parse modules if necessary, then
                // overwrite the sendRequest method to bypass this check in the
                // future.
                Y.use('io-base', 'json-parse', function () {
                    ioSource.sendRequest = _sendRequest;
                    _sendRequest(lastRequest);
                });
            }
        };

        return ioSource;
    },

    /**
     * Creates a DataSource-like object that uses the specified JSONPRequest
     * instance as a source. See the <code>source</code> attribute for more
     * details.
     *
     * @method _createJSONPSource
     * @param {JSONPRequest|String} source URL string or JSONPRequest instance.
     * @return {Object} DataSource-like object.
     * @protected
     * @for AutoCompleteBase
     */
    _createJSONPSource: function (source) {
        var cache       = {},
            jsonpSource = {},
            that        = this,
            lastRequest, loading;

        jsonpSource.sendRequest = function (request) {
            var _sendRequest = function (request) {
                var query = request.request;

                if (cache[query]) {
                    that[_SOURCE_SUCCESS](cache[query], request);
                } else {
                    // Hack alert: JSONPRequest currently doesn't support
                    // per-request callbacks, so we're reaching into the protected
                    // _config object to make it happen.
                    //
                    // This limitation is mentioned in the following JSONP
                    // enhancement ticket:
                    //
                    // http://yuilibrary.com/projects/yui3/ticket/2529371
                    source._config.on.success = function (data) {
                        cache[query] = data;
                        that[_SOURCE_SUCCESS](data, request);
                    };

                    source.send(query);
                }
            };

            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the JSONP module to load. Only
            // the most recent request will be sent.
            lastRequest = request;

            if (!loading) {
                loading = true;

                // Lazy-load the JSONP module if necessary, then overwrite the
                // sendRequest method to bypass this check in the future.
                Y.use('jsonp', function () {
                    // Turn the source into a JSONPRequest instance if it isn't
                    // one already.
                    if (!(source instanceof Y.JSONPRequest)) {
                        source = new Y.JSONPRequest(source, {
                            format: Y.bind(that._jsonpFormatter, that)
                        });
                    }

                    jsonpSource.sendRequest = _sendRequest;
                    _sendRequest(lastRequest);
                });
            }
        };

        return jsonpSource;
    },

    /**
     * Creates a DataSource-like object that calls the specified  URL or
     * executes the specified YQL query for results. If the string starts
     * with "select ", "use ", or "set " (case-insensitive), it's assumed to be
     * a YQL query; otherwise, it's assumed to be a URL (which may be absolute
     * or relative). URLs containing a "{callback}" placeholder are assumed to
     * be JSONP URLs; all others will use XHR. See the <code>source</code>
     * attribute for more details.
     *
     * @method _createStringSource
     * @param {String} source URL or YQL query.
     * @return {Object} DataSource-like object.
     * @protected
     * @for AutoCompleteBase
     */
    _createStringSource: function (source) {
        if (this._YQL_SOURCE_REGEX.test(source)) {
            // Looks like a YQL query.
            return this._createYQLSource(source);
        } else if (source.indexOf('{callback}') !== -1) {
            // Contains a {callback} param and isn't a YQL query, so it must be
            // JSONP.
            return this._createJSONPSource(source);
        } else {
            // Not a YQL query or JSONP, so we'll assume it's an XHR URL.
            return this._createIOSource(source);
        }
    },

    /**
     * Creates a DataSource-like object that uses the specified YQL query string
     * to create a YQL-based source. See the <code>source</code> attribute for
     * details. If no <code>resultListLocator</code> is defined, this method
     * will set a best-guess locator that might work for many typical YQL
     * queries.
     *
     * @method _createYQLSource
     * @param {String} source YQL query.
     * @return {Object} DataSource-like object.
     * @protected
     * @for AutoCompleteBase
     */
    _createYQLSource: function (source) {
        var cache     = {},
            yqlSource = {},
            that      = this,
            lastRequest, loading;

        if (!this.get(RESULT_LIST_LOCATOR)) {
            this.set(RESULT_LIST_LOCATOR, this._defaultYQLLocator);
        }

        yqlSource.sendRequest = function (request) {
            var yqlRequest,

            _sendRequest = function (request) {
                var query = request.request,
                    callback, env, maxResults, opts, yqlQuery;

                if (cache[query]) {
                    that[_SOURCE_SUCCESS](cache[query], request);
                } else {
                    callback = function (data) {
                        cache[query] = data;
                        that[_SOURCE_SUCCESS](data, request);
                    };

                    env        = that.get('yqlEnv');
                    maxResults = that.get(MAX_RESULTS);

                    opts = {proto: that.get('yqlProtocol')};

                    yqlQuery = Lang.sub(source, {
                        maxResults: maxResults > 0 ? maxResults : 1000,
                        query     : query
                    });

                    // Only create a new YQLRequest instance if this is the
                    // first request. For subsequent requests, we'll reuse the
                    // original instance.
                    if (yqlRequest) {
                        yqlRequest._callback   = callback;
                        yqlRequest._opts       = opts;
                        yqlRequest._params.q   = yqlQuery;

                        if (env) {
                            yqlRequest._params.env = env;
                        }
                    } else {
                        yqlRequest = new Y.YQLRequest(yqlQuery, {
                            on: {success: callback},
                            allowCache: false // temp workaround until JSONP has per-URL callback proxies
                        }, env ? {env: env} : null, opts);
                    }

                    yqlRequest.send();
                }
            };

            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the YQL module to load. Only the
            // most recent request will be sent.
            lastRequest = request;

            if (!loading) {
                // Lazy-load the YQL module if necessary, then overwrite the
                // sendRequest method to bypass this check in the future.
                loading = true;

                Y.use('yql', function () {
                    yqlSource.sendRequest = _sendRequest;
                    _sendRequest(lastRequest);
                });
            }
        };

        return yqlSource;
    },

    /**
     * Default resultListLocator used when a string-based YQL source is set and
     * the implementer hasn't already specified one.
     *
     * @method _defaultYQLLocator
     * @param {Object} response YQL response object.
     * @return {Array}
     * @protected
     * @for AutoCompleteBase
     */
    _defaultYQLLocator: function (response) {
        var results = response && response.query && response.query.results,
            values;

        if (results && Lang.isObject(results)) {
            // If there's only a single value on YQL's results object, that
            // value almost certainly contains the array of results we want. If
            // there are 0 or 2+ values, then the values themselves are most
            // likely the results we want.
            values  = Y.Object.values(results) || [];
            results = values.length === 1 ? values[0] : values;

            if (!Lang.isArray(results)) {
                results = [results];
            }
        } else {
            results = [];
        }

        return results;
    },

    /**
     * URL formatter passed to <code>JSONPRequest</code> instances.
     *
     * @method _jsonpFormatter
     * @param {String} url
     * @param {String} proxy
     * @param {String} query
     * @return {String} Formatted URL
     * @protected
     * @for AutoCompleteBase
     */
    _jsonpFormatter: function (url, proxy, query) {
        var maxResults      = this.get(MAX_RESULTS),
            requestTemplate = this.get(REQUEST_TEMPLATE);

        if (requestTemplate) {
            url += requestTemplate(query);
        }

        return Lang.sub(url, {
            callback  : proxy,
            maxResults: maxResults > 0 ? maxResults : 1000,
            query     : encodeURIComponent(query)
        });
    }
};

ACSources.ATTRS = {
    /**
     * YQL environment file URL to load when the <code>source</code> is set to
     * a YQL query. Set this to <code>null</code> to use the default Open Data
     * Tables environment file (http://datatables.org/alltables.env).
     *
     * @attribute yqlEnv
     * @type String
     * @default null
     * @for AutoCompleteBase
     */
    yqlEnv: {
        value: null
    },

    /**
     * URL protocol to use when the <code>source</code> is set to a YQL query.
     *
     * @attribute yqlProtocol
     * @type String
     * @default 'http'
     * @for AutoCompleteBase
     */
    yqlProtocol: {
        value: 'http'
    }
};

Y.Base.mix(Y.AutoCompleteBase, [ACSources]);


}, '3.3.0' ,{optional:['io-base', 'json-parse', 'jsonp', 'yql'], requires:['autocomplete-base']});
YUI.add('autocomplete-list', function(Y) {

/**
 * Traditional autocomplete dropdown list widget, just like Mom used to make.
 *
 * @module autocomplete
 * @submodule autocomplete-list
 * @class AutoCompleteList
 * @extends Widget
 * @uses AutoCompleteBase
 * @uses WidgetPosition
 * @uses WidgetPositionAlign
 * @uses WidgetStack
 * @constructor
 * @param {Object} config Configuration object.
 */

var Lang   = Y.Lang,
    Node   = Y.Node,
    YArray = Y.Array,

    // keyCode constants.
    KEY_TAB = 9,

    // String shorthand.
    _CLASS_ITEM        = '_CLASS_ITEM',
    _CLASS_ITEM_ACTIVE = '_CLASS_ITEM_ACTIVE',
    _CLASS_ITEM_HOVER  = '_CLASS_ITEM_HOVER',
    _SELECTOR_ITEM     = '_SELECTOR_ITEM',

    ACTIVE_ITEM      = 'activeItem',
    ALWAYS_SHOW_LIST = 'alwaysShowList',
    CIRCULAR         = 'circular',
    HOVERED_ITEM     = 'hoveredItem',
    ID               = 'id',
    ITEM             = 'item',
    LIST             = 'list',
    RESULT           = 'result',
    RESULTS          = 'results',
    VISIBLE          = 'visible',
    WIDTH            = 'width',

    // Event names.
    EVT_SELECT = 'select',

List = Y.Base.create('autocompleteList', Y.Widget, [
    Y.AutoCompleteBase,
    Y.WidgetPosition,
    Y.WidgetPositionAlign,
    Y.WidgetStack
], {
    // -- Prototype Properties -------------------------------------------------
    ARIA_TEMPLATE: '<div/>',
    ITEM_TEMPLATE: '<li/>',
    LIST_TEMPLATE: '<ul/>',

    // -- Lifecycle Prototype Methods ------------------------------------------
    initializer: function () {
        var inputNode = this.get('inputNode');

        if (!inputNode) {
            Y.error('No inputNode specified.');
            return;
        }

        this._inputNode  = inputNode;
        this._listEvents = [];

        // This ensures that the list is rendered inside the same parent as the
        // input node by default, which is necessary for proper ARIA support.
        this.DEF_PARENT_NODE = inputNode.get('parentNode');

        // Cache commonly used classnames and selectors for performance.
        this[_CLASS_ITEM]        = this.getClassName(ITEM);
        this[_CLASS_ITEM_ACTIVE] = this.getClassName(ITEM, 'active');
        this[_CLASS_ITEM_HOVER]  = this.getClassName(ITEM, 'hover');
        this[_SELECTOR_ITEM]     = '.' + this[_CLASS_ITEM];

        /**
         * Fires when an autocomplete suggestion is selected from the list,
         * typically via a keyboard action or mouse click.
         *
         * @event select
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *
         * <dl>
         *   <dt>itemNode (Node)</dt>
         *   <dd>
         *     List item node that was selected.
         *   </dd>
         *
         *   <dt>result (Object)</dt>
         *   <dd>
         *     AutoComplete result object.
         *   </dd>
         * </dl>
         *
         * @preventable _defSelectFn
         */
        this.publish(EVT_SELECT, {
            defaultFn: this._defSelectFn
        });
    },

    destructor: function () {
        while (this._listEvents.length) {
            this._listEvents.pop().detach();
        }
    },

    bindUI: function () {
        this._bindInput();
        this._bindList();
    },

    renderUI: function () {
        var ariaNode   = this._createAriaNode(),
            contentBox = this.get('contentBox'),
            inputNode  = this._inputNode,
            listNode,
            parentNode = inputNode.get('parentNode');

        listNode = this._createListNode();
        this._set('listNode', listNode);
        contentBox.append(listNode);

        inputNode.addClass(this.getClassName('input')).setAttrs({
            'aria-autocomplete': LIST,
            'aria-expanded'    : false,
            'aria-owns'        : listNode.get('id'),
            role               : 'combobox'
        });

        // ARIA node must be outside the widget or announcements won't be made
        // when the widget is hidden.
        parentNode.append(ariaNode);

        this._ariaNode    = ariaNode;
        this._boundingBox = this.get('boundingBox');
        this._contentBox  = contentBox;
        this._listNode    = listNode;
        this._parentNode  = parentNode;
    },

    syncUI: function () {
        this._syncResults();
        this._syncVisibility();
    },

    // -- Public Prototype Methods ---------------------------------------------

    /**
     * Hides the list, unless the <code>alwaysShowList</code> attribute is
     * <code>true</code>.
     *
     * @method hide
     * @see show
     * @chainable
     */
    hide: function () {
        return this.get(ALWAYS_SHOW_LIST) ? this : this.set(VISIBLE, false);
    },

    /**
     * Selects the specified <i>itemNode</i>, or the current
     * <code>activeItem</code> if <i>itemNode</i> is not specified.
     *
     * @method selectItem
     * @param {Node} itemNode (optional) Item node to select.
     * @chainable
     */
    selectItem: function (itemNode) {
        if (itemNode) {
            if (!itemNode.hasClass(this[_CLASS_ITEM])) {
                return this;
            }
        } else {
            itemNode = this.get(ACTIVE_ITEM);

            if (!itemNode) {
                return this;
            }
        }

        this.fire(EVT_SELECT, {
            itemNode: itemNode,
            result  : itemNode.getData(RESULT)
        });

        return this;
    },

    // -- Protected Prototype Methods ------------------------------------------

    /**
     * Activates the next item after the currently active item. If there is no
     * next item and the <code>circular</code> attribute is <code>true</code>,
     * focus will wrap back to the input node.
     *
     * @method _activateNextItem
     * @chainable
     * @protected
     */
    _activateNextItem: function () {
        var item = this.get(ACTIVE_ITEM),
            nextItem;

        if (item) {
            nextItem = item.next(this[_SELECTOR_ITEM]) ||
                    (this.get(CIRCULAR) ? null : item);
        } else {
            nextItem = this._getFirstItemNode();
        }

        this.set(ACTIVE_ITEM, nextItem);

        return this;
    },

    /**
     * Activates the item previous to the currently active item. If there is no
     * previous item and the <code>circular</code> attribute is
     * <code>true</code>, focus will wrap back to the input node.
     *
     * @method _activatePrevItem
     * @chainable
     * @protected
     */
    _activatePrevItem: function () {
        var item     = this.get(ACTIVE_ITEM),
            prevItem = item ? item.previous(this[_SELECTOR_ITEM]) :
                    this.get(CIRCULAR) && this._getLastItemNode();

        this.set(ACTIVE_ITEM, prevItem || null);

        return this;
    },

    /**
     * Appends the specified result <i>items</i> to the list inside a new item
     * node.
     *
     * @method _add
     * @param {Array|Node|HTMLElement|String} items Result item or array of
     *   result items.
     * @return {NodeList} Added nodes.
     * @protected
     */
    _add: function (items) {
        var itemNodes = [];

        YArray.each(Lang.isArray(items) ? items : [items], function (item) {
            itemNodes.push(this._createItemNode(item).setData(RESULT, item));
        }, this);

        itemNodes = Y.all(itemNodes);
        this._listNode.append(itemNodes.toFrag());

        return itemNodes;
    },

    /**
     * Updates the ARIA live region with the specified message.
     *
     * @method _ariaSay
     * @param {String} stringId String id (from the <code>strings</code>
     *   attribute) of the message to speak.
     * @param {Object} subs (optional) Substitutions for placeholders in the
     *   string.
     * @protected
     */
    _ariaSay: function (stringId, subs) {
        var message = this.get('strings.' + stringId);
        this._ariaNode.setContent(subs ? Lang.sub(message, subs) : message);
    },

    /**
     * Binds <code>inputNode</code> events and behavior.
     *
     * @method _bindInput
     * @protected
     */
    _bindInput: function () {
        var inputNode = this._inputNode,
            alignNode, alignWidth, tokenInput;

        // Null align means we can auto-align. Set align to false to prevent
        // auto-alignment, or a valid alignment config to customize the
        // alignment.
        if (this.get('align') === null) {
            // If this is a tokenInput, align with its bounding box.
            // Otherwise, align with the inputNode. Bit of a cheat.
            tokenInput = this.get('tokenInput');
            alignNode  = (tokenInput && tokenInput.get('boundingBox')) || inputNode;

            this.set('align', {
                node  : alignNode,
                points: ['tl', 'bl']
            });

            // If no width config is set, attempt to set the list's width to the
            // width of the alignment node. If the alignment node's width is
            // falsy, do nothing.
            if (!this.get(WIDTH) && (alignWidth = alignNode.get('offsetWidth'))) {
                this.set(WIDTH, alignWidth);
            }
        }

        // Attach inputNode events.
        this._listEvents.push(inputNode.on('blur', this._onListInputBlur, this));
    },

    /**
     * Binds list events.
     *
     * @method _bindList
     * @protected
     */
    _bindList: function () {
        this._listEvents.concat([
            this.after({
              mouseover: this._afterMouseOver,
              mouseout : this._afterMouseOut,

              activeItemChange    : this._afterActiveItemChange,
              alwaysShowListChange: this._afterAlwaysShowListChange,
              hoveredItemChange   : this._afterHoveredItemChange,
              resultsChange       : this._afterResultsChange,
              visibleChange       : this._afterVisibleChange
            }),

            this._listNode.delegate('click', this._onItemClick, this[_SELECTOR_ITEM], this)
        ]);
    },

    /**
     * Clears the contents of the tray.
     *
     * @method _clear
     * @protected
     */
    _clear: function () {
        this.set(ACTIVE_ITEM, null);
        this._set(HOVERED_ITEM, null);

        this._listNode.get('children').remove(true);
    },

    /**
     * Creates and returns an ARIA live region node.
     *
     * @method _createAriaNode
     * @return {Node} ARIA node.
     * @protected
     */
    _createAriaNode: function () {
        var ariaNode = Node.create(this.ARIA_TEMPLATE);

        return ariaNode.addClass(this.getClassName('aria')).setAttrs({
            'aria-live': 'polite',
            role       : 'status'
        });
    },

    /**
     * Creates and returns an item node with the specified <i>content</i>.
     *
     * @method _createItemNode
     * @param {Object} result Result object.
     * @return {Node} Item node.
     * @protected
     */
    _createItemNode: function (result) {
        var itemNode = Node.create(this.ITEM_TEMPLATE);

        return itemNode.addClass(this[_CLASS_ITEM]).setAttrs({
            id  : Y.stamp(itemNode),
            role: 'option'
        }).setAttribute('data-text', result.text).append(result.display);
    },

    /**
     * Creates and returns a list node.
     *
     * @method _createListNode
     * @return {Node} List node.
     * @protected
     */
    _createListNode: function () {
        var listNode = Node.create(this.LIST_TEMPLATE);

        return listNode.addClass(this.getClassName(LIST)).setAttrs({
            id  : Y.stamp(listNode),
            role: 'listbox'
        });
    },

    /**
     * Gets the first item node in the list, or <code>null</code> if the list is
     * empty.
     *
     * @method _getFirstItemNode
     * @return {Node|null}
     * @protected
     */
    _getFirstItemNode: function () {
        return this._listNode.one(this[_SELECTOR_ITEM]);
    },

    /**
     * Gets the last item node in the list, or <code>null</code> if the list is
     * empty.
     *
     * @method _getLastItemNode
     * @return {Node|null}
     * @protected
     */
    _getLastItemNode: function () {
        return this._listNode.one(this[_SELECTOR_ITEM] + ':last-child');
    },

    /**
     * Synchronizes the results displayed in the list with those in the
     * <i>results</i> argument, or with the <code>results</code> attribute if an
     * argument is not provided.
     *
     * @method _syncResults
     * @param {Array} results (optional) Results.
     * @protected
     */
    _syncResults: function (results) {
        var items;

        if (!results) {
            results = this.get(RESULTS);
        }

        this._clear();

        if (results.length) {
            items = this._add(results);
            this._ariaSay('items_available');
        }

        if (this.get('activateFirstItem') && !this.get(ACTIVE_ITEM)) {
            this.set(ACTIVE_ITEM, this._getFirstItemNode());
        }
    },

    /**
     * Synchronizes the visibility of the tray with the <i>visible</i> argument,
     * or with the <code>visible</code> attribute if an argument is not
     * provided.
     *
     * @method _syncVisibility
     * @param {Boolean} visible (optional) Visibility.
     * @protected
     */
    _syncVisibility: function (visible) {
        if (this.get(ALWAYS_SHOW_LIST)) {
            visible = true;
            this.set(VISIBLE, visible);
        }

        if (typeof visible === 'undefined') {
            visible = this.get(VISIBLE);
        }

        this._inputNode.set('aria-expanded', visible);
        this._boundingBox.set('aria-hidden', !visible);

        if (visible) {
            // Force WidgetPositionAlign to refresh its alignment.
            this._syncUIPosAlign();
        } else {
            this.set(ACTIVE_ITEM, null);
            this._set(HOVERED_ITEM, null);

            // Force a reflow to work around a glitch in IE6 and 7 where some of
            // the contents of the list will sometimes remain visible after the
            // container is hidden.
            this._boundingBox.get('offsetWidth');
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handles <code>activeItemChange</code> events.
     *
     * @method _afterActiveItemChange
     * @param {EventTarget} e
     * @protected
     */
    _afterActiveItemChange: function (e) {
        var inputNode = this._inputNode,
            newVal    = e.newVal,
            prevVal   = e.prevVal;

        // The previous item may have disappeared by the time this handler runs,
        // so we need to be careful.
        if (prevVal && prevVal._node) {
            prevVal.removeClass(this[_CLASS_ITEM_ACTIVE]);
        }

        if (newVal) {
            newVal.addClass(this[_CLASS_ITEM_ACTIVE]);
            inputNode.set('aria-activedescendant', newVal.get(ID));
        } else {
            inputNode.removeAttribute('aria-activedescendant');
        }

        if (this.get('scrollIntoView')) {
            (newVal || inputNode).scrollIntoView();
        }
    },

    /**
     * Handles <code>alwaysShowListChange</code> events.
     *
     * @method _afterAlwaysShowListChange
     * @param {EventTarget} e
     * @protected
     */
    _afterAlwaysShowListChange: function (e) {
        this.set(VISIBLE, e.newVal || this.get(RESULTS).length > 0);
    },

    /**
     * Handles <code>hoveredItemChange</code> events.
     *
     * @method _afterHoveredItemChange
     * @param {EventTarget} e
     * @protected
     */
    _afterHoveredItemChange: function (e) {
        var newVal  = e.newVal,
            prevVal = e.prevVal;

        if (prevVal) {
            prevVal.removeClass(this[_CLASS_ITEM_HOVER]);
        }

        if (newVal) {
            newVal.addClass(this[_CLASS_ITEM_HOVER]);
        }
    },

    /**
     * Handles <code>mouseover</code> events.
     *
     * @method _afterMouseOver
     * @param {EventTarget} e
     * @protected
     */
    _afterMouseOver: function (e) {
        var itemNode = e.domEvent.target.ancestor(this[_SELECTOR_ITEM], true);

        this._mouseOverList = true;

        if (itemNode) {
            this._set(HOVERED_ITEM, itemNode);
        }
    },

    /**
     * Handles <code>mouseout</code> events.
     *
     * @method _afterMouseOut
     * @param {EventTarget} e
     * @protected
     */
    _afterMouseOut: function () {
        this._mouseOverList = false;
        this._set(HOVERED_ITEM, null);
    },

    /**
     * Handles <code>resultsChange</code> events.
     *
     * @method _afterResultsChange
     * @param {EventFacade} e
     * @protected
     */
    _afterResultsChange: function (e) {
        this._syncResults(e.newVal);

        if (!this.get(ALWAYS_SHOW_LIST)) {
            this.set(VISIBLE, !!e.newVal.length);
        }
    },

    /**
     * Handles <code>visibleChange</code> events.
     *
     * @method _afterVisibleChange
     * @param {EventFacade} e
     * @protected
     */
    _afterVisibleChange: function (e) {
        this._syncVisibility(!!e.newVal);
    },

    /**
     * Handles <code>inputNode</code> <code>blur</code> events.
     *
     * @method _onListInputBlur
     * @param {EventTarget} e
     * @protected
     */
    _onListInputBlur: function (e) {
        // Hide the list on inputNode blur events, unless the mouse is currently
        // over the list (which indicates that the user is probably interacting
        // with it). The _lastInputKey property comes from the
        // autocomplete-list-keys module.
        if (!this._mouseOverList || this._lastInputKey === KEY_TAB) {
            this.hide();
        }
    },

    /**
     * Delegated event handler for item <code>click</code> events.
     *
     * @method _onItemClick
     * @param {EventTarget} e
     * @protected
     */
    _onItemClick: function (e) {
        var itemNode = e.currentTarget;

        this.set(ACTIVE_ITEM, itemNode);
        this.selectItem(itemNode);
    },

    // -- Protected Default Event Handlers -------------------------------------

    /**
     * Default <code>select</code> event handler.
     *
     * @method _defSelectFn
     * @param {EventTarget} e
     * @protected
     */
    _defSelectFn: function (e) {
        var text = e.result.text;

        // TODO: support typeahead completion, etc.
        this._inputNode.focus();
        this._updateValue(text);
        this._ariaSay('item_selected', {item: text});
        this.hide();
    }
}, {
    ATTRS: {
        /**
         * If <code>true</code>, the first item in the list will be activated by
         * default when the list is initially displayed and when results change.
         *
         * @attribute activateFirstItem
         * @type Boolean
         * @default false
         */
        activateFirstItem: {
            value: false
        },

        /**
         * Item that's currently active, if any. When the user presses enter,
         * this is the item that will be selected.
         *
         * @attribute activeItem
         * @type Node
         */
        activeItem: {
            setter: Y.one,
            value: null
        },

        /**
         * If <code>true</code>, the list will remain visible even when there
         * are no results to display.
         *
         * @attribute alwaysShowList
         * @type Boolean
         * @default false
         */
        alwaysShowList: {
            value: false
        },

        /**
         * If <code>true</code>, keyboard navigation will wrap around to the
         * opposite end of the list when navigating past the first or last item.
         *
         * @attribute circular
         * @type Boolean
         * @default true
         */
        circular: {
            value: true
        },

        /**
         * Item currently being hovered over by the mouse, if any.
         *
         * @attribute hoveredItem
         * @type Node|null
         * @readonly
         */
        hoveredItem: {
            readOnly: true,
            value: null
        },

        /**
         * Node that will contain result items.
         *
         * @attribute listNode
         * @type Node|null
         * @readonly
         */
        listNode: {
            readOnly: true,
            value: null
        },

        /**
         * If <code>true</code>, the viewport will be scrolled to ensure that
         * the active list item is visible when necessary.
         *
         * @attribute scrollIntoView
         * @type Boolean
         * @default false
         */
        scrollIntoView: {
            value: false
        },

        /**
         * Translatable strings used by the AutoCompleteList widget.
         *
         * @attribute strings
         * @type Object
         */
        strings: {
            valueFn: function () {
                return Y.Intl.get('autocomplete-list');
            }
        },

        /**
         * If <code>true</code>, pressing the tab key while the list is visible
         * will select the active item, if any.
         *
         * @attribute tabSelect
         * @type Boolean
         * @default true
         */
        tabSelect: {
            value: true
        },

        // The "visible" attribute is documented in Widget.
        visible: {
            value: false
        }
    },

    CSS_PREFIX: Y.ClassNameManager.getClassName('aclist')
});

Y.AutoCompleteList = List;

/**
 * Alias for <a href="AutoCompleteList.html"><code>AutoCompleteList</code></a>.
 * See that class for API docs.
 *
 * @class AutoComplete
 */

Y.AutoComplete = List;


}, '3.3.0' ,{lang:['en'], requires:['autocomplete-base', 'selector-css3', 'widget', 'widget-position', 'widget-position-align', 'widget-stack'], after:['autocomplete-sources'], skinnable:true});
YUI.add('autocomplete-plugin', function(Y) {

/**
 * Binds an AutoCompleteList instance to a Node instance.
 *
 * @module autocomplete
 * @submodule autocomplete-plugin
 */

/**
 * <p>
 * Binds an AutoCompleteList instance to a Node instance.
 * </p>
 *
 * <p>
 * Example:
 * </p>
 *
 * <pre>
 * Y.one('#my-input').plug(Y.Plugin.AutoComplete, {
 * &nbsp;&nbsp;source: 'select * from search.suggest where query="{query}"'
 * });
 * &nbsp;
 * // You can now access the AutoCompleteList instance at Y.one('#my-input').ac
 * </pre>
 *
 * @class Plugin.AutoComplete
 * @extends AutoCompleteList
 */

var Plugin = Y.Plugin;

function ACListPlugin(config) {
    config.inputNode = config.host;

    // Render by default.
    if (!config.render && config.render !== false) {
      config.render = true;
    }

    ACListPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ACListPlugin, Y.AutoCompleteList, {}, {
    NAME      : 'autocompleteListPlugin',
    NS        : 'ac',
    CSS_PREFIX: Y.ClassNameManager.getClassName('aclist')
});

Plugin.AutoComplete     = ACListPlugin;
Plugin.AutoCompleteList = ACListPlugin;


}, '3.3.0' ,{requires:['autocomplete-list', 'node-pluginhost']});


YUI.add('autocomplete', function(Y){}, '3.3.0' ,{use:['autocomplete-base', 'autocomplete-sources', 'autocomplete-list', 'autocomplete-plugin']});

/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('autocomplete-list-keys', function(Y) {

/**
 * Mixes keyboard support into AutoCompleteList. By default, this module is not
 * loaded for iOS and Android devices.
 *
 * @module autocomplete
 * @submodule autocomplete-list-keys
 */

 // keyCode constants.
var KEY_DOWN  = 40,
    KEY_ENTER = 13,
    KEY_ESC   = 27,
    KEY_TAB   = 9,
    KEY_UP    = 38;

function ListKeys() {
    Y.before(this._unbindKeys, this, 'destructor');
    Y.before(this._bindKeys, this, 'bindUI');

    this._initKeys();
}

ListKeys.prototype = {
    // -- Lifecycle Methods ----------------------------------------------------

    /**
     * Initializes keyboard command mappings.
     *
     * @method _initKeys
     * @protected
     * @for AutoCompleteList
     */
    _initKeys: function () {
        var keys        = {},
            keysVisible = {};

        this._keyEvents = [];

        // Register keyboard command handlers. _keys contains handlers that will
        // always be called; _keysVisible contains handlers that will only be
        // called when the list is visible.
        keys[KEY_DOWN] = this._keyDown;

        keysVisible[KEY_ENTER] = this._keyEnter;
        keysVisible[KEY_ESC]   = this._keyEsc;
        keysVisible[KEY_TAB]   = this._keyTab;
        keysVisible[KEY_UP]    = this._keyUp;

        this._keys        = keys;
        this._keysVisible = keysVisible;
    },

    /**
     * Binds keyboard events.
     *
     * @method _bindKeys
     * @protected
     */
    _bindKeys: function () {
        this._keyEvents.push(this._inputNode.on(
                Y.UA.gecko ? 'keypress' : 'keydown', this._onInputKey, this));
    },

    /**
     * Unbinds keyboard events.
     *
     * @method _unbindKeys
     * @protected
     */
    _unbindKeys: function () {
        while (this._keyEvents.length) {
            this._keyEvents.pop().detach();
        }
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Called when the down arrow key is pressed.
     *
     * @method _keyDown
     * @protected
     */
    _keyDown: function () {
        if (this.get('visible')) {
            this._activateNextItem();
        } else {
            this.show();
        }
    },

    /**
     * Called when the enter key is pressed.
     *
     * @method _keyEnter
     * @protected
     */
    _keyEnter: function () {
        var item = this.get('activeItem');

        if (item) {
            this.selectItem(item);
        } else {
            // Don't prevent form submission when there's no active item.
            return false;
        }
    },

    /**
     * Called when the escape key is pressed.
     *
     * @method _keyEsc
     * @protected
     */
    _keyEsc: function () {
        this.hide();
    },

    /**
     * Called when the tab key is pressed.
     *
     * @method _keyTab
     * @protected
     */
    _keyTab: function () {
        var item;

        if (this.get('tabSelect')) {
            item = this.get('activeItem');

            if (item) {
                this.selectItem(item);
                return true;
            }
        }

        return false;
    },

    /**
     * Called when the up arrow key is pressed.
     *
     * @method _keyUp
     * @protected
     */
    _keyUp: function () {
        this._activatePrevItem();
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handles <code>inputNode</code> key events.
     *
     * @method _onInputKey
     * @param {EventTarget} e
     * @protected
     */
    _onInputKey: function (e) {
        var handler,
            keyCode = e.keyCode;

        this._lastInputKey = keyCode;

        if (this.get('results').length) {
            handler = this._keys[keyCode];

            if (!handler && this.get('visible')) {
                handler = this._keysVisible[keyCode];
            }

            if (handler) {
                // A handler may return false to indicate that it doesn't wish
                // to prevent the default key behavior.
                if (handler.call(this, e) !== false) {
                    e.preventDefault();
                }
            }
        }
    }
};

Y.Base.mix(Y.AutoCompleteList, [ListKeys]);


}, '3.3.0' ,{requires:['autocomplete-list', 'base-build']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('anim-base', function(Y) {

/**
* The Animation Utility provides an API for creating advanced transitions.
* @module anim
*/

/**
* Provides the base Anim class, for animating numeric properties.
*
* @module anim
* @submodule anim-base
*/

    /**
     * A class for constructing animation instances.
     * @class Anim
     * @for Anim
     * @constructor
     * @extends Base
     */

    var RUNNING = 'running',
        START_TIME = 'startTime',
        ELAPSED_TIME = 'elapsedTime',
        /**
        * @for Anim
        * @event start
        * @description fires when an animation begins.
        * @param {Event} ev The start event.
        * @type Event.Custom
        */
        START = 'start',

        /**
        * @event tween
        * @description fires every frame of the animation.
        * @param {Event} ev The tween event.
        * @type Event.Custom
        */
        TWEEN = 'tween',

        /**
        * @event end
        * @description fires after the animation completes.
        * @param {Event} ev The end event.
        * @type Event.Custom
        */
        END = 'end',
        NODE = 'node',
        PAUSED = 'paused',
        REVERSE = 'reverse', // TODO: cleanup
        ITERATION_COUNT = 'iterationCount',

        NUM = Number;

    var _running = {},
        _timer;

    Y.Anim = function() {
        Y.Anim.superclass.constructor.apply(this, arguments);
        Y.Anim._instances[Y.stamp(this)] = this;
    };

    Y.Anim.NAME = 'anim';

    Y.Anim._instances = {};

    /**
     * Regex of properties that should use the default unit.
     *
     * @property RE_DEFAULT_UNIT
     * @static
     */
    Y.Anim.RE_DEFAULT_UNIT = /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i;

    /**
     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.
     *
     * @property DEFAULT_UNIT
     * @static
     */
    Y.Anim.DEFAULT_UNIT = 'px';

    Y.Anim.DEFAULT_EASING = function (t, b, c, d) {
        return c * t / d + b; // linear easing
    };

    /**
     * Time in milliseconds passed to setInterval for frame processing 
     *
     * @property intervalTime
     * @default 20
     * @static
     */
    Y.Anim._intervalTime = 20;

    /**
     * Bucket for custom getters and setters
     *
     * @property behaviors
     * @static
     */
    Y.Anim.behaviors = {
        left: {
            get: function(anim, attr) {
                return anim._getOffset(attr);
            }
        }
    };

    Y.Anim.behaviors.top = Y.Anim.behaviors.left;

    /**
     * The default setter to use when setting object properties.
     *
     * @property DEFAULT_SETTER
     * @static
     */
    Y.Anim.DEFAULT_SETTER = function(anim, att, from, to, elapsed, duration, fn, unit) {
        var node = anim._node,
            val = fn(elapsed, NUM(from), NUM(to) - NUM(from), duration);

        if (att in node._node.style || att in Y.DOM.CUSTOM_STYLES) {
            unit = unit || '';
            node.setStyle(att, val + unit);
        } else if (node._node.attributes[att]) {
            node.setAttribute(att, val);
        } else {
            node.set(att, val);
        }
    };

    /**
     * The default getter to use when getting object properties.
     *
     * @property DEFAULT_GETTER
     * @static
     */
    Y.Anim.DEFAULT_GETTER = function(anim, att) {
        var node = anim._node,
            val = '';

        if (att in node._node.style || att in Y.DOM.CUSTOM_STYLES) {
            val = node.getComputedStyle(att);
        } else if (node._node.attributes[att]) {
            val = node.getAttribute(att);
        } else {
            val = node.get(att);
        }

        return val;
    };

    Y.Anim.ATTRS = {
        /**
         * The object to be animated.
         * @attribute node
         * @type Node
         */
        node: {
            setter: function(node) {
                node = Y.one(node);
                this._node = node;
                if (!node) {
                }
                return node;
            }
        },

        /**
         * The length of the animation.  Defaults to "1" (second).
         * @attribute duration
         * @type NUM
         */
        duration: {
            value: 1
        },

        /**
         * The method that will provide values to the attribute(s) during the animation. 
         * Defaults to "Easing.easeNone".
         * @attribute easing
         * @type Function
         */
        easing: {
            value: Y.Anim.DEFAULT_EASING,

            setter: function(val) {
                if (typeof val === 'string' && Y.Easing) {
                    return Y.Easing[val];
                }
            }
        },

        /**
         * The starting values for the animated properties. 
         * Fields may be strings, numbers, or functions.
         * If a function is used, the return value becomes the from value.
         * If no from value is specified, the DEFAULT_GETTER will be used. 
         * @attribute from
         * @type Object
         * supports any unit, provided it matches the "to" (or default)
         * unit (e.g. "{width: 10em', color: 'rgb(0, 0 0)', borderColor: '#ccc'}".
         * If using the default ('px' for length-based units), the unit may be omitted  (
         * (e.g. "{width: 100}, borderColor: 'ccc'}", which defaults to pixels 
         * and hex, respectively).
         */
        from: {},

        /**
         * The ending values for the animated properties. 
         * Fields may be strings, numbers, or functions.
         * @attribute to
         * @type Object
         * supports any unit, provided it matches the "from" (or default)
         * unit (e.g. "{width: '50%', color: 'red', borderColor: '#ccc'}".
         * If using the default ('px' for length-based units), the unit may be omitted (
         * (e.g. "{width: 100}, borderColor: 'ccc'}", which defaults to pixels 
         * and hex, respectively).
         */
        to: {},

        /**
         * Date stamp for the first frame of the animation.
         * @attribute startTime
         * @type Int
         * @default 0 
         * @readOnly
         */
        startTime: {
            value: 0,
            readOnly: true
        },

        /**
         * Current time the animation has been running.
         * @attribute elapsedTime
         * @type Int
         * @default 0 
         * @readOnly
         */
        elapsedTime: {
            value: 0,
            readOnly: true
        },

        /**
         * Whether or not the animation is currently running.
         * @attribute running 
         * @type Boolean
         * @default false 
         * @readOnly
         */
        running: {
            getter: function() {
                return !!_running[Y.stamp(this)];
            },
            value: false,
            readOnly: true
        },

        /**
         * The number of times the animation should run 
         * @attribute iterations
         * @type Int
         * @default 1 
         */
        iterations: {
            value: 1
        },

        /**
         * The number of iterations that have occurred.
         * Resets when an animation ends (reaches iteration count or stop() called). 
         * @attribute iterationCount
         * @type Int
         * @default 0
         * @readOnly
         */
        iterationCount: {
            value: 0,
            readOnly: true
        },

        /**
         * How iterations of the animation should behave. 
         * Possible values are "normal" and "alternate".
         * Normal will repeat the animation, alternate will reverse on every other pass.
         *
         * @attribute direction
         * @type String
         * @default "normal"
         */
        direction: {
            value: 'normal' // | alternate (fwd on odd, rev on even per spec)
        },

        /**
         * Whether or not the animation is currently paused.
         * @attribute paused 
         * @type Boolean
         * @default false 
         * @readOnly
         */
        paused: {
            readOnly: true,
            value: false
        },

        /**
         * If true, animation begins from last frame
         * @attribute reverse
         * @type Boolean
         * @default false 
         */
        reverse: {
            value: false
        }


    };

    /**
     * Runs all animation instances.
     * @method run
     * @static
     */    
    Y.Anim.run = function() {
        var instances = Y.Anim._instances;
        for (var i in instances) {
            if (instances[i].run) {
                instances[i].run();
            }
        }
    };

    /**
     * Pauses all animation instances.
     * @method pause
     * @static
     */    
    Y.Anim.pause = function() {
        for (var i in _running) { // stop timer if nothing running
            if (_running[i].pause) {
                _running[i].pause();
            }
        }

        Y.Anim._stopTimer();
    };

    /**
     * Stops all animation instances.
     * @method stop
     * @static
     */    
    Y.Anim.stop = function() {
        for (var i in _running) { // stop timer if nothing running
            if (_running[i].stop) {
                _running[i].stop();
            }
        }
        Y.Anim._stopTimer();
    };
    
    Y.Anim._startTimer = function() {
        if (!_timer) {
            _timer = setInterval(Y.Anim._runFrame, Y.Anim._intervalTime);
        }
    };

    Y.Anim._stopTimer = function() {
        clearInterval(_timer);
        _timer = 0;
    };

    /**
     * Called per Interval to handle each animation frame.
     * @method _runFrame
     * @private
     * @static
     */    
    Y.Anim._runFrame = function() {
        var done = true;
        for (var anim in _running) {
            if (_running[anim]._runFrame) {
                done = false;
                _running[anim]._runFrame();
            }
        }

        if (done) {
            Y.Anim._stopTimer();
        }
    };

    Y.Anim.RE_UNITS = /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/;

    var proto = {
        /**
         * Starts or resumes an animation.
         * @method run
         * @chainable
         */    
        run: function() {
            if (this.get(PAUSED)) {
                this._resume();
            } else if (!this.get(RUNNING)) {
                this._start();
            }
            return this;
        },

        /**
         * Pauses the animation and
         * freezes it in its current state and time.
         * Calling run() will continue where it left off.
         * @method pause
         * @chainable
         */    
        pause: function() {
            if (this.get(RUNNING)) {
                this._pause();
            }
            return this;
        },

        /**
         * Stops the animation and resets its time.
         * @method stop
         * @param {Boolean} finish If true, the animation will move to the last frame
         * @chainable
         */    
        stop: function(finish) {
            if (this.get(RUNNING) || this.get(PAUSED)) {
                this._end(finish);
            }
            return this;
        },

        _added: false,

        _start: function() {
            this._set(START_TIME, new Date() - this.get(ELAPSED_TIME));
            this._actualFrames = 0;
            if (!this.get(PAUSED)) {
                this._initAnimAttr();
            }
            _running[Y.stamp(this)] = this;
            Y.Anim._startTimer();

            this.fire(START);
        },

        _pause: function() {
            this._set(START_TIME, null);
            this._set(PAUSED, true);
            delete _running[Y.stamp(this)];

            /**
            * @event pause
            * @description fires when an animation is paused.
            * @param {Event} ev The pause event.
            * @type Event.Custom
            */
            this.fire('pause');
        },

        _resume: function() {
            this._set(PAUSED, false);
            _running[Y.stamp(this)] = this;
            this._set(START_TIME, new Date() - this.get(ELAPSED_TIME));
            Y.Anim._startTimer();

            /**
            * @event resume
            * @description fires when an animation is resumed (run from pause).
            * @param {Event} ev The pause event.
            * @type Event.Custom
            */
            this.fire('resume');
        },

        _end: function(finish) {
            var duration = this.get('duration') * 1000;
            if (finish) { // jump to last frame
                this._runAttrs(duration, duration, this.get(REVERSE));
            }

            this._set(START_TIME, null);
            this._set(ELAPSED_TIME, 0);
            this._set(PAUSED, false);

            delete _running[Y.stamp(this)];
            this.fire(END, {elapsed: this.get(ELAPSED_TIME)});
        },

        _runFrame: function() {
            var d = this._runtimeAttr.duration,
                t = new Date() - this.get(START_TIME),
                reverse = this.get(REVERSE),
                done = (t >= d),
                attribute,
                setter;
                
            this._runAttrs(t, d, reverse);
            this._actualFrames += 1;
            this._set(ELAPSED_TIME, t);

            this.fire(TWEEN);
            if (done) {
                this._lastFrame();
            }
        },

        _runAttrs: function(t, d, reverse) {
            var attr = this._runtimeAttr,
                customAttr = Y.Anim.behaviors,
                easing = attr.easing,
                lastFrame = d,
                done = false,
                attribute,
                setter,
                i;

            if (t >= d) {
                done = true;
            }

            if (reverse) {
                t = d - t;
                lastFrame = 0;
            }

            for (i in attr) {
                if (attr[i].to) {
                    attribute = attr[i];
                    setter = (i in customAttr && 'set' in customAttr[i]) ?
                            customAttr[i].set : Y.Anim.DEFAULT_SETTER;

                    if (!done) {
                        setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit); 
                    } else {
                        setter(this, i, attribute.from, attribute.to, lastFrame, d, easing, attribute.unit); 
                    }
                }
            }


        },

        _lastFrame: function() {
            var iter = this.get('iterations'),
                iterCount = this.get(ITERATION_COUNT);

            iterCount += 1;
            if (iter === 'infinite' || iterCount < iter) {
                if (this.get('direction') === 'alternate') {
                    this.set(REVERSE, !this.get(REVERSE)); // flip it
                }
                /**
                * @event iteration
                * @description fires when an animation begins an iteration.
                * @param {Event} ev The iteration event.
                * @type Event.Custom
                */
                this.fire('iteration');
            } else {
                iterCount = 0;
                this._end();
            }

            this._set(START_TIME, new Date());
            this._set(ITERATION_COUNT, iterCount);
        },

        _initAnimAttr: function() {
            var from = this.get('from') || {},
                to = this.get('to') || {},
                attr = {
                    duration: this.get('duration') * 1000,
                    easing: this.get('easing')
                },
                customAttr = Y.Anim.behaviors,
                node = this.get(NODE), // implicit attr init
                unit, begin, end;

            Y.each(to, function(val, name) {
                if (typeof val === 'function') {
                    val = val.call(this, node);
                }

                begin = from[name];
                if (begin === undefined) {
                    begin = (name in customAttr && 'get' in customAttr[name])  ?
                            customAttr[name].get(this, name) : Y.Anim.DEFAULT_GETTER(this, name);
                } else if (typeof begin === 'function') {
                    begin = begin.call(this, node);
                }

                var mFrom = Y.Anim.RE_UNITS.exec(begin);
                var mTo = Y.Anim.RE_UNITS.exec(val);

                begin = mFrom ? mFrom[1] : begin;
                end = mTo ? mTo[1] : val;
                unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units

                if (!unit && Y.Anim.RE_DEFAULT_UNIT.test(name)) {
                    unit = Y.Anim.DEFAULT_UNIT;
                }

                if (!begin || !end) {
                    Y.error('invalid "from" or "to" for "' + name + '"', 'Anim');
                    return;
                }

                attr[name] = {
                    from: begin,
                    to: end,
                    unit: unit
                };

            }, this);

            this._runtimeAttr = attr;
        },


        // TODO: move to computedStyle? (browsers dont agree on default computed offsets)
        _getOffset: function(attr) {
            var node = this._node,
                val = node.getComputedStyle(attr),
                get = (attr === 'left') ? 'getX': 'getY',
                set = (attr === 'left') ? 'setX': 'setY';

            if (val === 'auto') {
                var position = node.getStyle('position');
                if (position === 'absolute' || position === 'fixed') {
                    val = node[get]();
                    node[set](val);
                } else {
                    val = 0;
                }
            }

            return val;
        },

        destructor: function() {
            delete Y.Anim._instances[Y.stamp(this)];
        }
    };

    Y.extend(Y.Anim, Y.Base, proto);


}, '3.3.0' ,{requires:['base-base', 'node-style']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('anim-easing', function(Y) {

/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * The easing module provides methods for customizing
 * how an animation behaves during each run.
 * @class Easing
 * @module anim
 * @submodule anim-easing
 */

var Easing = {

    /**
     * Uniform speed between points.
     * @for Easing
     * @method easeNone
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeNone: function (t, b, c, d) {
        return c*t/d + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quadratic)
     * @method easeIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeIn: function (t, b, c, d) {
        return c*(t/=d)*t + b;
    },

    /**
     * Begins quickly and decelerates towards end.  (quadratic)
     * @method easeOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOut: function (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quadratic)
     * @method easeBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBoth: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quartic)
     * @method easeInStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeInStrong: function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    
    /**
     * Begins quickly and decelerates towards end.  (quartic)
     * @method easeOutStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOutStrong: function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quartic)
     * @method easeBothStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBothStrong: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },

    /**
     * Snap in elastic effect.
     * @method elasticIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */

    elasticIn: function (t, b, c, d, a, p) {
        var s;
        if (t === 0) {
            return b;
        }
        if ( (t /= d) === 1 ) {
            return b+c;
        }
        if (!p) {
            p = d* 0.3;
        }
        
        if (!a || a < Math.abs(c)) {
            a = c; 
            s = p/4;
        }
        else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },

    /**
     * Snap out elastic effect.
     * @method elasticOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticOut: function (t, b, c, d, a, p) {
        var s;
        if (t === 0) {
            return b;
        }
        if ( (t /= d) === 1 ) {
            return b+c;
        }
        if (!p) {
            p=d * 0.3;
        }
        
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    
    /**
     * Snap both elastic effect.
     * @method elasticBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticBoth: function (t, b, c, d, a, p) {
        var s;
        if (t === 0) {
            return b;
        }
        
        if ( (t /= d/2) === 2 ) {
            return b+c;
        }
        
        if (!p) {
            p = d*(0.3*1.5);
        }
        
        if ( !a || a < Math.abs(c) ) {
            a = c; 
            s = p/4;
        }
        else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
        if (t < 1) {
            return -0.5*(a*Math.pow(2,10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },


    /**
     * Backtracks slightly, then reverses direction and moves to end.
     * @method backIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backIn: function (t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        if (t === d) {
            t -= 0.001;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },

    /**
     * Overshoots end, then reverses and comes back to end.
     * @method backOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backOut: function (t, b, c, d, s) {
        if (typeof s === 'undefined') {
            s = 1.70158;
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    
    /**
     * Backtracks slightly, then reverses direction, overshoots end, 
     * then reverses and comes back to end.
     * @method backBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backBoth: function (t, b, c, d, s) {
        if (typeof s === 'undefined') {
            s = 1.70158; 
        }
        
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },

    /**
     * Bounce off of start.
     * @method bounceIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceIn: function (t, b, c, d) {
        return c - Y.Easing.bounceOut(d-t, 0, c, d) + b;
    },
    
    /**
     * Bounces off end.
     * @method bounceOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceOut: function (t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    
    /**
     * Bounces off start and end.
     * @method bounceBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceBoth: function (t, b, c, d) {
        if (t < d/2) {
            return Y.Easing.bounceIn(t * 2, 0, c, d) * 0.5 + b;
        }
        return Y.Easing.bounceOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
};

Y.Easing = Easing;


}, '3.3.0' ,{requires:['anim-base']});
//作者：lijing00333@163.com
YUI.namespace('Y.Slide');
YUI.add('trip-slide',function(Y){
	if(typeof Y.Node.prototype.queryAll == 'undefined'){
		Y.Node.prototype.queryAll = Y.Node.prototype.all;
		Y.Node.prototype.query = Y.Node.prototype.one;
		Y.Node.get = Y.Node.one;
		Y.get = Y.one;
	}

	var Slide = function(){
		this.init.apply(this,arguments);
	};
	Y.mix(Slide,{
		init:function(id,config){
			var that = this;
			that.id = id;
			//接受参数
			that.buildParam(config);
			//构建事件中心
			that.buildEventCenter();
			//构造函数
			that.construct();
			//绑定事件
			that.bindEvent();

			//执行ready
			that.ready({
				index:0,
				navnode:that.tabs.item(0),
				pannelnode:that.pannels.item(0)
			});

			if(that.reverse){
				var _t ;
				_t = that.previous,
				that.previous = that.next,
				that.next = _t;
			}

			return this;
		},
		//渲染textarea中的内容，并放在与之相邻的一个div中，若有脚本，执行其中脚本
		renderLazyData:function(textarea){
			textarea.setStyle('display','none');
			if(textarea.getAttribute('lazy-data')=='1'){
				return ;
			}
			textarea.setAttribute('lazy-data','1');
			var	id = Y.stamp(div),
				html = textarea.get('innerHTML').replace(/&lt;/ig,'<').replace(/&gt;/ig,'>').replace(/&amp;/ig,'&'),
				div = Y.Node.create('<div>'+html+'</div>');
			textarea.insert(div,'before');

			var globalEval = function(data){
				if (data && /\S/.test(data)) {
					var head = document.getElementsByTagName('head')[0],
						script = document.createElement('script');

					// It works! All browsers support!
					script.text = data;

					head.insertBefore(script, head.firstChild);
					head.removeChild(script);
				}
			};

			var id = 'K_'+new Date().getTime().toString(),
				re_script = new RegExp(/<script([^>]*)>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/ig); // 防止


			var hd = Y.Node.getDOMNode(Y.one('head')),
				match, attrs, srcMatch, charsetMatch,
				t, s, text,
				RE_SCRIPT_SRC = /\ssrc=(['"])(.*?)\1/i,
				RE_SCRIPT_CHARSET = /\scharset=(['"])(.*?)\1/i;

			re_script.lastIndex = 0;
			while ((match = re_script.exec(html))) {
				attrs = match[1];
				srcMatch = attrs ? attrs.match(RE_SCRIPT_SRC) : false;
				// script via src
				if (srcMatch && srcMatch[2]) {
					s = document.createElement('script');
					s.src = srcMatch[2];
					// set charset
					if ((charsetMatch = attrs.match(RE_SCRIPT_CHARSET)) && charsetMatch[2]) {
						s.charset = charsetMatch[2];
					}
					s.async = true; // make sure async in gecko
					hd.appendChild(s);
				}
				// inline script
				else if ((text = match[2]) && text.length > 0) {
					globalEval(text);
				}
			}

		},
		/**
		 * 事件中心
		 */
		buildEventCenter:function(){
			var that = this;
			var EventFactory = function(){
				this.publish("switch");
			};
			Y.augment(EventFactory, Y.Event.Target);
			that.EventCenter = new EventFactory();
			return this;
		},
		/**
		 * 绑定函数
		 */
		on:function(type,foo){
			var that = this;
			that.EventCenter.subscribe(type,foo);
			return this;
		},
		construct: function() {
            var that = this;
			var con = that.con = Y.one('#' + that.id);
            that.tabs = con.all('.' + that.navClass + ' li');
            var tmp_pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
            that.length = tmp_pannels.size();
            if (that.tabs.size() == 0) {
                //nav.li没有指定，默认指定1234
                var t_con = con.all('.' + that.navClass);
				var t_str = '';
                for (var i = 0; i < that.length; i++) {
                    var t_str_prefix = '';
                    if (i == 0) {
                        t_str_prefix = that.selectedClass;
                    }
                    t_str += '<li class="' + t_str_prefix + '"><a href="javascript:void(0);" target="_self">' + (i + 1) + '</a></li>';
                }
                t_con.set('innerHTML', t_str);
            }
            that.tabs = con.all('.' + that.navClass + ' li');//重新赋值
            that.animcon = con.query('.' + that.contentClass);
            that.animwrap = null;
            if (that.effect == 'none') {
                that.pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
            } else if (that.effect == 'v-slide') {
                that.animwrap = Y.Node.create('<div style="position:absolute;"></div>');
                that.animwrap.set('innerHTML', that.animcon.get('innerHTML'));
                that.animcon.set('innerHTML', '');
                that.animcon.appendChild(that.animwrap);
                that.pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
                //统一容器和item的宽高及选中默认值
                var animconRegion = that.animcon.get('region');
				var _width = that.itemWidth || animconRegion.width ;
                that.pannels.setStyles({
					'height' : animconRegion.height,
                    'float': 'none',
                    'overflow': 'hidden'
                });
                that.animwrap.setStyles({
                    'height': that.length * animconRegion.height + 'px',
                    'overflow': 'hidden',
                    'top': -1 * that.defaultTab * animconRegion.height + 'px'
                });
            } else if (that.effect == 'h-slide') {
                that.animwrap = Y.Node.create('<div style="position:absolute;"></div>');
				var _itemHtml = that.animcon.get('innerHTML');
				if(that.loop){//循环处理：复制HTML
					_itemHtml = _itemHtml + _itemHtml ;
				}
                that.animwrap.set('innerHTML', _itemHtml);
                that.animcon.set('innerHTML', '');
                that.animcon.appendChild(that.animwrap);
                that.pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
                //统一容器和item的宽高及选中默认值
                var animconRegion = that.animcon.get('region');
				var _width = that.itemWidth || animconRegion.width ;
                that.pannels.setStyles({
					'height' : animconRegion.height,
                    'float': 'left',
                    'overflow': 'hidden'
                });
				var _wrapWidth = that.length * _width ;
				if (that.loop) {
					_wrapWidth =_wrapWidth * 2;
				}
                that.animwrap.setStyles({
                    'width': _wrapWidth ,
                    'overflow': 'hidden',
					'zoom' : 1,
                    'left': -1 * that.defaultTab * _width + 'px'
                });
            } else if (that.effect == 'fade') {
                that.pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
                that.pannels.setStyles({
                    'position': 'absolute',
                    'zIndex': 0
                });
                that.pannels.each(function(node, i){
                    if (i == that.defaultTab) {
                        node.removeClass('hidden');
                        node.setStyle('opacity', 1);
                    } else {
                        node.addClass('hidden');
                        node.setStyle('opacity', 0);
                    }
                });
            }
            //添加选中的class
            //that.tabs.removeClass(that.selectedClass);
            //that.tabs.item(that.defaultTab).addClass(that.selectedClass);
			that.switch_to(that.defaultTab);//modify by shuke 改为默认值
            //是否自动播放
            if (that.autoSlide == true) {
                that.play();
            }
            return this;
        },

		bindEvent:function(){
			var that = this;
			if(that.eventype == 'click' || that.eventype == 'mouseover'){
				that.con.delegate(that.eventype,function(e){
					e.preventDefault();
					that.goto(Number(that.tabs.indexOf(e.currentTarget)));
					if(that.autoSlide)that.stop().play();
				},'.'+that.navClass+' li');
			}
			if(that.hoverStop){
				that.con.delegate('mouseover',function(e){
					//e.halt();
					if(that.autoSlide)that.stop();
				},'.'+that.contentClass+' div.'+that.pannelClass);
				that.con.delegate('mouseout',function(e){
					//e.halt();
					if(that.autoSlide)that.play();
				},'.'+that.contentClass+' div.'+that.pannelClass);
			}
			return this;

		},
		buildParam:function(o){
			var that = this;
			//基本参数
			var o = (typeof o == 'undefined' || o == null)?{}:o;
			that.autoSlide = (typeof o.autoSlide == 'undefined' || o.autoSlide == null)?false:o.autoSlide;
			that.speed = (typeof o.speed == 'undefined' || o.speed == null)?0.5:o.speed;
			that.timeout = (typeof o.timeout == 'undefined' || o.timeout == null)?1000:o.timeout;
			that.effect = (typeof o.effect == 'undefined' || o.effect == null)?'none':o.effect;
			that.eventype = (typeof o.eventype == 'undefined' || o.eventype == null)?'click':o.eventype;
			that.easing = (typeof o.easing == 'undefined' || o.easing == null)?'easeBoth':o.easing;
			that.hoverStop = (typeof o.hoverStop== 'undefined' || o.hoverStop == null)?true:o.hoverStop;
			that.selectedClass = (typeof o.selectedClass == 'undefined' || o.selectedClass == null)?'selected':o.selectedClass;
			that.conClass = (typeof o.conClass == 'undefined' || o.conClass == null)?'t-slide':o.conClass;
			that.navClass = (typeof o.navClass == 'undefined' || o.navClass == null)?'tab-nav':o.navClass;
			that.contentClass = (typeof o.contentClass == 'undefined' || o.contentClass == null)?'tab-content':o.contentClass;
			that.pannelClass = (typeof o.pannelClass == 'undefined' || o.pannelClass == null)?'tab-pannel':o.pannelClass;
			that.before_switch = (typeof o.before_switch== 'undefined' || o.before_switch == null)?new Function:o.before_switch;
			that.ready = (typeof o.ready == 'undefined' || o.ready == null)?new Function:o.ready;
			that.carousel = (typeof o.carousel == 'undefined' || o.carousel == null)?false:o.carousel;
			that.reverse = (typeof o.reverse == 'undefined' || o.reverse == null)?false:o.reverse;
			that.itemWidth = (typeof o.itemWidth == 'undefined' || o.itemWidth == null) ? false : o.itemWidth;//指定每次切换的移动距离，不指定时为tab-content宽度
			that.loop = (typeof o.loop == 'undefined' || o.loop == null) ? false : o.loop; //add by shuke.cl 用于无限循环
			that.id = that.id;
			//构造参数
			that.tabs = [];
			that.animcon = null;
			that.pannels = [];
			that.timer = null;
			//默认选中的tab，默认值为0，添加默认选中的功能
			//modified by huya
            that.defaultTab = (typeof o.defaultTab == 'undefined' || o.defaultTab == null) ? 0 : Number(o.defaultTab) - 1;//隐藏所有pannel
            //that.current_tab = that.defaultTab;//0,1,2,3...
			that.current_tab = -1; //bu shuke
            return this;

		},
		//接口函数
		//上一个
		previous:function(){
			var that = this;
			//防止旋转木马状态下切换过快带来的晃眼
			try{
				if(that.anim.get('running') && that.carousel){
					return this;
				}
			}catch(e){}
			var _index = that.current_tab+that.length-1;
			if(_index >= that.length){
				_index = _index % that.length;
			}
			if(that.carousel){
				if((_index%that.length) == (that.length-1) && that.current_tab == 0){
					that.fix_pre_carousel();
					arguments.callee.call(that);
					return this;
				}
			}
			if (that.loop && (_index >= that.length-1)) {//无限循环时
				_index = that.length-1;

				if(that.effect == 'v-slide'){ //垂直
					that.animwrap.setStyle('top', (-(that.length) * that.itemWidth));
				}else if(that.effect == 'h-slide'){//水平
					that.animwrap.setStyle('left', (-(that.length) * that.itemWidth));
				}
			}
			that.goto(_index);
			return this;
		},
		//下一个
		next:function(){
			var that = this;
			//防止旋转木马状态下切换过快带来的晃眼
			try{
				if(that.anim.get('running') && that.carousel){
					return this;
				}
			}catch(e){}
			var _index = that.current_tab+1;
			if(_index >= that.length){
				_index = _index % that.length;
			}
			if(that.carousel){
				if((_index%that.length) == 0 && that.current_tab == (that.length-1)){
					that.fix_next_carousel();
					arguments.callee.call(that);
					return this;
				}
			}
			if (that.loop && (_index%that.length) == 0 && that.current_tab == (that.length-1)) {//无限循环时
				_index = that.length;
			}
			that.goto(_index);
			return this;
		},
		fix_next_carousel:function(){
			var that = this;
			that.current_tab = that.current_tab -1;
			var con = that.con = Y.one('#'+that.id);
			if(that.effect != 'none'){
				that.pannels = con.all('.'+that.contentClass+' div.'+that.pannelClass);
			}
			var first_node = that.pannels.item(0);
			that.animwrap.appendChild(first_node);
			//first_node.remove();
			if(that.effect == 'v-slide'){ //垂直
				var top = that.animwrap.getStyle('top').replace(/[^\d]/ig,'');
				that.animwrap.setStyle('top',-(Number(top)-that.animcon.get('region').height).toString()+'px');
			}else if(that.effect == 'h-slide'){//水平
				var left = that.animwrap.getStyle('left').replace(/[^\d]/ig,'');
				that.animwrap.setStyle('left',-(Number(left)-that.animcon.get('region').width).toString()+'px');
			}

		},
		fix_pre_carousel:function(){
			var that = this;
			that.current_tab = that.current_tab + 1;
			var con = that.con = Y.one('#'+that.id);
			if(that.effect != 'none'){
				that.pannels = con.all('.'+that.contentClass+' div.'+that.pannelClass);
			}
			var last_node = that.pannels.item(that.pannels.size()-1);
			var first_node = that.pannels.item(0);
			that.animwrap.prepend(last_node);
			//first_node.remove();
			if(that.effect == 'v-slide'){ //垂直
				var top = that.animwrap.getStyle('top').replace(/[^\d]/ig,'');
				that.animwrap.setStyle('top',-(Number(top)+that.animcon.get('region').height).toString()+'px');
			}else if(that.effect == 'h-slide'){//水平
				var left = that.animwrap.getStyle('left').replace(/[^\d]/ig,'');
				that.animwrap.setStyle('left',-(Number(left)+that.animcon.get('region').width).toString()+'px');
			}

		},
		//切换至index
		switch_to:function(index){
			var that = this;
            if (index >= that.length && !that.loop) {//不需要无限循环时还按照老方法处理
                index = index % that.length;
            }
            if (index == that.current_tab) {
                return this;
            }
            if (that.effect == 'none') {
                that.pannels.addClass('hidden');
                that.pannels.item(index).removeClass('hidden');
            }
            else if (that.effect == 'v-slide') {
                if (that.anim) {
                    try {
                        that.anim.stop();
                        //fix IE6下内存泄露的问题，仅支持3.2.0及3.3.0,3.1.0及3.0.0需修改Y.Anim的代码
						//modified by huya
                        that.anim.destroy();
                        that.anim = null;
                    } catch (e) {}
                }
                that.anim = new Y.Anim({
                    node: that.animwrap,
                    to: {
                        top: -1 * index * that.animcon.get('region').height
                    },
                    easing: that.easing,
                    duration: that.speed
                });
                that.anim.run();
            } else if (that.effect == 'h-slide') {
                if (that.anim) {
                    try {
                        that.anim.stop();
                        that.anim.destroy();
                        that.anim = null;
                    } catch (e) {}
                }
				var _animWidth = that.itemWidth || that.animcon.get('region').width;
                that.anim = new Y.Anim({
                    node: that.animwrap,
                    to: {
                        left: -1 * index * _animWidth
                    },
                    easing: that.easing,
                    duration: that.speed
                });
                that.anim.run();
				if (that.loop && index >= that.length) {
					that.anim.on('end',function(){
						that.animwrap.setStyle('left' , '0px');
					})
				}
            } else if (that.effect == 'fade') {
				//重写fade效果逻辑
				//modified by huya
                var _curr = that.current_tab == -1 ? 0 : that.current_tab;
                if (that.anim) {
                    try {
                        that.anim.stop();
                        that.anim.destroy();
                        that.anim = null;
                    } catch (e) {}
                }
                that.anim = new Y.Anim({
                    node: that.pannels.item(index),
                    to: {
                        opacity: 1
                    },
                    easing: that.easing,
                    duration: that.speed
                });
                that.anim.on('start', function(){
                    that.pannels.item(index).removeClass('hidden');
                    that.pannels.item(index).setStyle('opacity', 0);
                    that.pannels.item(_curr).setStyle('zIndex', 1);
                    that.pannels.item(index).setStyle('zIndex', 2);
                });
                that.anim.on('end', function(){
                    that.pannels.item(_curr).setStyle('zIndex', 0);
                    that.pannels.item(index).setStyle('zIndex', 1);
                    that.pannels.item(_curr).setStyle('opacity', 0);
                    that.pannels.item(_curr).addClass('hidden');
                });
                that.anim.run();
            }
			if(that.loop && index >= that.length){//重置当前TAB的索引值
				index = 0;
			}
            that.tabs.removeClass(that.selectedClass);
            that.tabs.item(index).addClass(that.selectedClass);
            that.current_tab = index;
            that.EventCenter.fire('switch', {
                index: index,
                navnode: that.tabs.item(index),
                pannelnode: that.pannels.item(index)
            });
			//延迟执行的脚本
			var scriptsArea = that.pannels.item(index).all('.lazyload');
			if(scriptsArea){
				scriptsArea.each(function(node,i){
					that.renderLazyData(node);
					//that.pannels.item(index).append(node.get('value'));
				});
				//scriptsArea.remove();
			}
		},
		//去往任意一个,0,1,2,3...
		goto:function(index){
			var that = this;
			if (!that.loop) {
				if(that.before_switch({
					index:index,
					navnode:that.tabs.item(index),
					pannelnode:that.pannels.item(index)
				}) == false){
					return;
				}
			}
			that.switch_to(index);
		},
		//自动播放
		play:function(){
			var that = this;
			if(that.timer != null)clearTimeout(that.timer);
			that.timer = setTimeout(function(){
				that.next();
				that.timer = setTimeout(arguments.callee,Number(that.timeout));	
			},Number(that.timeout));
			return this;
		},
		//停止自动播放
		stop:function(){
			var that = this;
			clearTimeout(that.timer);
			that.timer = null;
			return this;
		}

	},0,null,4);

	Y.Slide = Slide;
	
},'',{requires:['node-base','node-event-delegate','node-screen','anim-easing']});/*!
 * Copyright koubei.com All rights reserved.
 * placeholder js
 * @file placeholder.js
 * @author <a href="mailto:zhengle.zl@taobao.com">zhengle</a>
 * @revision:
 * @version:1-0-0
 */ 
YUI.add("trip-placeholder",function(Y){
   //判断浏览器是否原生支持placeholder属性
   //&& "placeholder" in document.createElement("textarea"); //判断一个就够了
   if(Y.Modernizr.input.placeholder){
	 Y.TripPlaceholder =  { init:function(){} };
	 return;
   }
   var Node = Y.Node,
	   NodeList = Y.NodeList;
   var fnGet = Node.prototype.get;

   Node.prototype.get = function(attr){
	   if(attr === "value" && this.getAttribute("placeholder")){
		   return (this._node.value == this.getAttribute("placeholder"))?"":this._node.value;
	   } else {
		   return fnGet.apply(this,arguments);
	   }
   };

   Y.TripPlaceholder  = function(){
	   function _init(elems){

		   elems.on("focus",function(evt){
			   var node = evt.target;
			   var str = node.getAttribute("placeholder");
			   if(node._node.value == str){
				   node.set("value","");
				   node.removeClass("trip-placeholder");
			   }
		   });

		   elems.on("blur",function(evt){
			   var node = evt.target;
			   var str = node.getAttribute("placeholder");
			   if(node._node.value == ""){
				   node.set("value",str);
				   node.addClass("trip-placeholder");
			   }
		   });

		   function getValue(){
			   var ythis = Y.one(this);
			   var val = ythis.get("value"),
				   plhTxt = ythis.getAttribute("placeholder");
			   return (val && val == plhTxt)? "" : val;
		   }

		   //init
		   (function(){
			   elems.each(function(node){
				   if(node._node.value == node.getAttribute("placeholder") || node._node.value == ""){
					   node.addClass("trip-placeholder");
					   node.set("value",node.getAttribute("placeholder"));
				   } else {
					   node.removeClass("trip-placeholder");
				   }
				   node.getValue = node._node.getValue = getValue;

			   });
		   })()
	   }
	   return {
		 init:function(elems){
			   if(!elems){
				   _init(Y.all(".trip-placeholder"));
			   } else if((elems instanceof NodeList)){
				   _init(elems);
			   } else {
				   _init(Y.all(elems));
			   }
		   }
	   }
   }();
},'1.0.0',{requires:['node-base','event-base','trip-modernizr']});
 /**
 * @fileOverview 旅行通用自动完成组件
 * @author shuke.cl
 * version 1.0
 * @requires ［"widget",  "autocomplete"］
 */
var TG = TG || {};
TG.SearchForm = TG.SearchForm || {};
YUI.namespace('Y.TripAutoComplete');
YUI.add('trip-autocomplete',function(Y){
	/*
	*默认设置
	 */
	var DEF_CONFIG = {
		resultTemplate :'<span class="ac-cityname">{cityName}</span><span class="ac-citypy">{py}</span>',
		resultFormatter : acFormatter ,
		requestTemplate : function(query){
			return query;
		},
		maxResults: 10,
		resultListLocator: 'result',
		resultTextLocator: 'cityName',
		activateFirstItem : true,
		width : 250,
		noResultMessage : '对不起，没有找到"<span class="highlight">{query}</span>"',
		hotWidth : 320,
		source: 'http://jipiao.trip.taobao.com/remote/livesearch.do?callback={callback}&q=',
		hotSource : 'http://www.taobao.com/go/rgn/trip/chinahotcity.php'
	};
	/*
	热门城市数据
	 */
	var HOT_CITY_DATA={},//缓存热门城市数据
		bakHotCityData ,//返回数据临时存储
		TEMPLATE = '<div class="yui3-hot-city"><div class="yui3-acinput-hot-tit">热门城市/国家(支持汉字/拼音/英文字母)</div><ul class="tab-nav">{{#results}}<li>{{tabname}}</li>{{/results}}</ul><div class="tab-content">{{#results}}<div class="tab-pannel">{{#tabdata}}<dl><dt>{{dt}}</dt><dd>{{#dd}}<span><a data-code="{{cityCode}}" href="#">{{cityName}}</a></span>{{/dd}}</dd></dl>{{/tabdata}}</div>{{/results}}</div></div>',//热门城市模板
		PLACEHOLDER_CLASS = 'trip-placeholder',
		INPUT_FOCUS_CLASS = 'yui3-acinput-focus',
		isSupportPlaceHolder = Y.Modernizr.input.placeholder ;
	YUI.Env.JSONP.getHotCityData = function(o){
		backHotCityData =  o ;
	};
	/*
	*格式化和高亮搜索结果内容
	 */
	function highLight(str,key){
		//return str.replace(key,'<span class="yui3-highlight">'+ key +'</span>');
		return str;
	}
	function acFormatter(query, results) {
	  return Y.Array.map(results, function (result) {
		result = result.raw ;
		return Y.Lang.sub(DEF_CONFIG.resultTemplate, {
		  cityName: highLight(result.cityName,query),
		  py : highLight(result.py, query)
		});
	  });
	}
	/*
	*旅行定制SUGGEST构造函数
	 */
	var TripAutoComplete = Y.Base.create('tripAutoComplete' , Y.Base , [] , {
			initializer : function (arg){
				this.config = arg ;
				Y.mix(this.config,DEF_CONFIG);

				this.AC = new Y.AutoComplete(this.config);

				var AC= this.AC;
				AC.DEF_PARENT_NODE = null ;
				AC.render();

				this.inputNode = AC.get('inputNode');
				this.listNode = AC.get('listNode');
				this.contentBox = AC.get('contentBox');
        this.boundingBox = AC.get('boundingBox');
        this.msgBox = Y.Node.create('<div class="yui3-msg-box" style="display:none"></div>');
        this.contentBox.insertBefore(this.msgBox ,this.contentBox.get('firstChild'));
        this.boundingBox.setStyle('position' , 'absolute');
				AC.set('zIndex' , '99999');
				var codeInputNode = this.config.codeInputNode;
				this.codeInputNode = typeof codeInputNode  !== 'undefined' ? Y.one(codeInputNode) : null ;

				this.isAllowFocus = true  ; //是否允许出发FOCUS事件
				this.isFillFirstItem = true ;//是否需要用第一条数据填充
				this.isLoadedHotData = false ;//热门城市是否已加载
				this.isHotVisible = false ; //热门城市是否可见
				this.isMouseOverHot = false ;//鼠标是否在热门城市框区域内
				this.hotNode = null ;
        this.doc = Y.one(document);
				Y.TripPlaceholder.init(this.inputNode);//自动填充
        this.config.createIcon && this._createIcon();//创建ICON
        this.inputNode.addClass('J_TripCityInput');
				//自定义事件
				this.publish('select');
				this._bindUI();
				this._syncUI();
        TG.SearchForm['#'+this.inputNode.get('id')] = this ;//将实例存储到全局对象，将ID作为KEY
			},
			_syncUI : function (){
         this.inputNode.setAttribute('x-webkit-speech','x-webkit-speech');
         this.boundingBox.addClass('has-anim-fast');
			},
      _createIcon : function (){
          var parent = this.inputNode.get('parentNode');
          var node = Y.Node.create('<div class="yui3-acinput-box"><s class="yui3-acinput-icon"></s></div>');
          parent.insertBefore(node,this.inputNode);
          node.appendChild(this.inputNode);
          this.inputBoxNode = node ;
          return this;
      },
      /*
      显示错误或者提示信息
       */
      showMessage : function(msg){
        var that = this ;
        this.msgBox.setContent(msg);
        this.msgBox.show();
        this.AC.show();
        this.boundingBox.addClass('anim-pulse');
        setTimeout(function (){
          that.boundingBox.removeClass('anim-pulse');
        },100);
        return this ;
      },
      //显示自动完成组件
      show : function (){
        this.AC.show();
      },
      //隐藏自动完成组件
      hide : function (){
        this.AC.hide();
      },
      //获取焦点
      focus : function (){
        this.inputNode.focus();
      },
			/*
			同步默认城市数据 同步后展示
			 */
			_syncHot : function(htmlStr){
				var SELF = this ;
				this.hotNode = this.contentBox.appendChild(htmlStr);
				this.hotNode.hide();
				this.hotNode.setAttrs({
					id : Y.stamp(this.hotNode)
				});
				var tabView = new Y.Slide(this.hotNode.get('id'));
				tabView.on('switch',function(){
                    SELF.AC.sizeShim && SELF.AC.sizeShim();
				});
				this._bindHot() ;
				if (this.listNode.get('children').size() < 1) {//可能出现热门城市数据返回比用户输入后的匹配城市数据慢，出现这种情况时，不再默认展示热梦城市
					this.hotNode && this.hotNode.show();
					this.AC.render();
					this.AC.show();
                    this.AC.sizeShim && this.AC.sizeShim();
					this.isHotVisible = true;
					this.AC.set('width' ,this.config.hotWidth);
				}
        return this ;
			},
			_bindUI : function (){
				var inputNode = this.AC.get('inputNode');
        inputNode.on('keyup' , function (){
            if (inputNode.get('value')=='') {
                this.msgBox && this.msgBox.hide();
                this.showHot();
            }
        } , this);
				this._bindAC();
				this._bindInput();
        return this ;
			},
			/*
			*给autoComplete对象绑定自定义事件
			 */
			_bindAC : function(){
				var AC = this.AC  , SELF =  this ;
        var selectHoverItem = function (e){//选中鼠标HOVER的ITEM
            AC.set('activeItem' , e.currentTarget);
        };
				AC.on('select' , this._fillInput , this );//填充数据
				AC.on('results', this._afterResults , this);//显示错误提示
				AC.on('visibleChange', this._visibleChange , this);
        AC.on('hoveredItemChange' , selectHoverItem, this);
				//用户鼠标选择时，不触发默认填充功能
				this.listNode.on('mousedown' , function (e){
					SELF.isFillFirstItem = false ;
				});
			},
			_bindHot : function(){
				var hotNode = this.hotNode ;
				Y.delegate('click' , this._afterHotItemClick , hotNode , 'a', this);
				hotNode.on('mouseenter' , this._afterHotMouseOver , this );
				hotNode.on('mouseleave' , this._afterHotMouseOut , this );
				hotNode.on('click' , this._afterHotClick, this);
			},
			/*
			输入框事件绑定
			 */
			_bindInput : function (){
				var inputNode = this.inputNode , SELF = this;
        var focusInput = function (){
            setTimeout(function (){
                inputNode.focus();
            },10)
        };
				inputNode.on('focus' , this._afterFocus , this);
				inputNode.on('blur' , this._afterBlur , this);//如果用户没做选择，隐藏SUGGEST时默认用第一条数据填充
        this.config.createIcon && this.inputBoxNode.on('click' , focusInput);
			},
			/*
			没有结果时，返回无结果提示信息
			 */
			_afterResults : function (e){
				var AC = this.AC ,SELF = this ;
				var contentBox = this.AC.get('contentBox');
				var qReg = new RegExp('{query}','g');
				//用户输入关键字后返回数据时隐藏热门城市
				this.listNode.removeClass('hidden');
				if(this.isHotVisible){
					this.hotNode.hide();
				}
				//显示无结果提示
				if (e.results.length < 1) {
					e.preventDefault();
					//contentBox.get('firstChild').setContent('<li class="yui3-aclist-noresult">'+ SELF.config.noResultMessage.replace(qReg, e.query) +'</li>');
          this.showMessage(SELF.config.noResultMessage.replace(qReg, e.query));//显示错误信息
					this.codeInputNode && this.codeInputNode.set('value','');//重置三字码为空
					//AC.show();
				}else{
          this.msgBox.hide();
					this.isFillFirstItem = true ;
					//默认填入返回数据的第一个城市
					this.codeInputNode && this.codeInputNode.set('value',e.data.result[0].cityCode);
				}
				AC.set('width' ,SELF.config.width);
			},
			_visibleChange : function(e){
				if (e.newVal == true ) {
					this.doc.on('click' , this._afterDocClick , this);
                    this.AC.sizeShim && this.AC.sizeShim();
				}else{
					if (this.isHotVisible && this.isMouseOverHot) {
						e.preventDefault();
					}
				}
			},
			/*
			*选中后填充选中数据到input
			 */
			_fillInput : function (e){
				var _data = e.result.raw ,o={},
					codeInputNode = this.codeInputNode,
					SELF = this ;
				//填充附加代码
				if (codeInputNode) {
					codeInputNode.set('value',_data.cityCode);
					o.cityCode = _data.cityCode;
				}
				if (!isSupportPlaceHolder) {
					this.inputNode.removeClass(PLACEHOLDER_CLASS);
				}
				this.isFillFirstItem = false ;

				//由于IE6下会触发FOCUS，做一个变量短时间内不允许执行FOCUS事件
				this.isAllowFocus = false ;
				o.value =  _data.cityName;
				o.data = _data ;
				setTimeout(function(){
					SELF.isAllowFocus = true ;
					SELF.fire('select',o);
				},200);
			},
			/*
			获得焦点时，需要显示热门城市
			foucs被触发的一些条件：
			1.用户点击输入框
			2.TAB切换至输入框
			3.IE6在SUGGEST里选择完城市以后重新获得焦点:此时不需要显示热门推荐城市
			 */
			_afterFocus : function(e){
        this.msgBox.hide();
				var SELF = this , target = e.target ;
				target.addClass(INPUT_FOCUS_CLASS);
				setTimeout(function(){
					if (SELF.isAllowFocus) {
						target.select();
						SELF.showHot();
						SELF.isAllowFocus = false ;
					}
				},100);
			},
			/*
			inputNode失去焦点时，检查是否要隐藏热门推荐
			以下情况会触发此事件
			1.用户点击外部区域
			2.ie下用户点击热门推荐区域
			 */
			_afterBlur : function(e){
				var listNode = this.listNode , SELF = this ;
				e.target.removeClass(INPUT_FOCUS_CLASS);
				if (this.isFillFirstItem) {
					//用户没做选择则默认填充第一条数据
					setTimeout(function(){
						if(listNode && listNode.get('children').size() > 0 && SELF.isFillFirstItem){
							SELF.AC.selectItem(listNode.get('firstChild'));
						}
					},100);
				}
				setTimeout(function(){
					SELF.isAllowFocus = true ;
				},300);
			},
			_afterDocClick : function(e){
				var target = e.target , SELF = this;
				if (!this.isMouseOverHot && target != this.inputNode) {
					SELF.hideHot('doc');
          //Y.log('doc listener has moved '  + this.isMouseOverHot );
				}
			},
			_afterHotClick :function(e){
				e.stopPropagation();
			},
			_afterHotMouseOver :function(){
				this.isMouseOverHot = true ;
			},
			_afterHotMouseOut : function(){
				this.isMouseOverHot = false ;
			},
			/*
			加载热门城市数据
			 */
			_loadHotData : function(){
				var SELF = this , urlStr = this.config.hotSource;
				this.isLoadedHotData = true;
				if (typeof HOT_CITY_DATA[urlStr] !== 'undefined') {
					SELF._syncHot(Y.Mustache.to_html(TEMPLATE , HOT_CITY_DATA[urlStr]));
					return this ;
				}
				Y.Get.script( urlStr ,{
					charset : 'utf-8',
					onSuccess: function(o){
						var data = o.data ;
						if (typeof backHotCityData === 'object') {
							HOT_CITY_DATA[data.url] = backHotCityData ;
							SELF._syncHot(Y.Mustache.to_html(TEMPLATE , backHotCityData));
						}
					},
					data : {
						url : urlStr
					}
				});
			},
      /*
      *显示热门城市
       */
			showHot : function(){
				var listNode = this.listNode ;
				listNode.empty();//要显示热门城市先清空LISTNODE
				listNode.addClass('hidden');
				if (!this.isLoadedHotData) {
					this._loadHotData();
          return this ;
				}
        this.AC.set('width' ,this.config.hotWidth);
        if(this.hotNode){
            this.hotNode.show();
            //IE6 7触发 reflow
            this.hotNode.setStyle('zoom' , '0.95');
            this.hotNode.setStyle('zoom' , '1');
        }
        this.AC.render();
        this.AC.show();
        this.isHotVisible = true;
        return this;

			},
      /*
      *隐藏热门城市
       */
			hideHot : function(){
				this.isHotVisible = false ;
				this.isMouseOverHot = false ;
				this.hotNode && this.hotNode.hide();
			  this.doc.detach('click' , this._afterDocClick);
				this.AC.hide();
			},
			/*
			热点城市点击链接后填充数据
			*/
			_afterHotItemClick : function(e){
				var SELF = this ,o = {};
				e.halt();
				var node = e.currentTarget ;
				if (!isSupportPlaceHolder) {
					this.inputNode.removeClass(PLACEHOLDER_CLASS);
				}
				var val = node.get('innerHTML') ;
				o.value = val ;
        o.node = node;
				this.inputNode.set('value' , val);
				var codeInputNode = this.codeInputNode,
					codeValue = node.getAttribute('data-code');
				if (codeValue && codeInputNode) {
					codeInputNode.set('value' , codeValue);
					o.cityCode = codeValue ;
				}
				this.hideHot();
				setTimeout(function(){
					SELF.fire('select',o);
				},200);
			}
		},{
			ATTRS:{
				config : {
					value : null
				}
			}
		});
	Y.TripAutoComplete = TripAutoComplete;
},'0.0.1',{requires:['autocomplete','trip-mustache','trip-slide','trip-placeholder']});/**
 * @fileOverview 日历控件，主要功能是日历的生成，日历显示。没有其他的交互行为
 * @author lanmeng
 * @version 1.0
 * @requires ［"widget", "widget-position"］
 */

YUI.namespace('Y.Calendar');
YUI.add('calendar',function(Y){

    /**
     * @description {String} 日历显示样式控制
     * @field
     */
     var  calandarHtml = '<div class="oneCalendar">'
                      + '<s class="J_pre pre <% if(!isFirstNode) {%>hidden<% } %>">上</s>'
                      + '<s class="J_next next <% if(!isLastNode) {%>hidden<% } %>">下</s>'
                      + '<h5>'
                         + '<% if(isSelect) {%>'
                         + '<select class="J_selectYear">'
                           + '<% for(var i = (limitBeginDate.getFullYear() - date.getFullYear()), len = (limitEndDate.getFullYear() - date.getFullYear()); i < len; i++) {%>'
                           + '<option value="<%=date.getFullYear() + i%>"  <% if(date.getFullYear() + i == date.getFullYear()) {%>selected="true"<%}%>><%=date.getFullYear() + i%></option>'
                           + '<% } %>'
                         +'</select>年'
                         + '<select class="J_selectMonth">'
                           + '<% for(var i = 1; i < 13; i++) {%>'
                           + '<option value="<%=i%>" <% if(i == date.getMonth() + 1) {%>selected="true"<%}%>><%=i%></option>'
                           + '<% } %>'
                         +'</select>月'
                         + '<% } else {%>'
                         + '<span class="J_selectYear"><%=date.getFullYear()%></span>年<span class="J_selectMonth"><%=date.getMonth()+1%></span>月'
                         + '<% } %>'
                      +'</h5>'
                      + '<h6><em>日</em><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><em>六</em></h6>'
                      + '<ul class="calendar-day">'
                        + '<% for(var i = 0, len = days.length; i < len; i ++) { %>'
                        + '<% var nowDay = new Date(date.getFullYear(), date.getMonth(), days[i]); %>'
                        + '<li class="<% if(beginDate && beginDate.toString() == nowDay.toString()){%>select-begin-date<% } else if(endDate && endDate.toString() == nowDay.toString()){%>select-end-date<% } else if(beginDate && beginDate.getTime() < nowDay.getTime() && endDate && endDate.getTime() > nowDay.getTime()){%>select-date<% } %>">'
                           + '<% if(days[i] && (!limitBeginDate || nowDay.getTime() >= limitBeginDate.getTime()) && (!limitEndDate || nowDay.getTime() <= limitEndDate.getTime())) {%>'
                           + '<a href="javascript:;" <% if(nowDay.getTime() == toDay.getTime()){%> class="current" <%}%>><%=days[i]%></a>'
                           + '<% } else { %>'
                           + '<span class="disable" <% if(days[i] && (!limitEndDate || nowDay.getTime() > limitEndDate.getTime())) {%>title="<%=titleTips%>"<%}%>><%=days[i]%></span>'
                           + '<% } %>'
                        + '</li>'
                        + '<% } %>'
                      + '</ul>'
                    + '</div>';

    /**
     * @name Y.Calendar
     * @class Y.Calendar
     * @constructor
     * @public
     * @param {Date} [beginDate] 开始时间，默认为空，即日历初始化没有选中的日期
     * @param {Date} [endDate]  结束时间，默认为空，即日历初始化没有选中的日期
     * @param {Date} [limitBeginDate] 最小时间，为空则不作限制，默认为空
     * @param {Date} [limitEndDate]  最大时间，为空则不作限制，默认为空
     * @param {Date} [date] 当前第一个呈现的月
     * @param {String} [id] 日历的id，目前没有使用
     * @param {Boolean} [isSelect] 是否有下拉框可以切换日期，目前较少测试
     * @example new Y.Calendar({beginDate: null, endDate: null});
     * @description 日历构造函数，使用的是widget中的base和position定位
     */
    Y.Calendar = Y.Base.create("calendar", Y.Widget,  [Y.WidgetPosition],{


       /**
        * @name Y.Calendar#initializer
        * @function
        * @public
        * @description 初始化日历信息，主要是日历外边框样式，日历IE的hack
        */
        initializer: function () {
            var t = this;

            /*
             * @description {Boolean} 日历当前是否是显示的
             * @field
             */
            t.render();

            t.get("contentBox").set("className", "calendar-main clearfix");
            t.calendarNode = t.get("contentBox").get("parentNode");
            t.calendarNode.addClass("calendar shadow").append("<span class='cal-close J_close'>关闭</span>");
            t._iehack();

        },
		//angtian add
		festival: {
		   'today': '今天',
		   '2012-01-01': '元旦',
           '2012-01-22': '除夕',
           '2012-01-23': '春节',
           '2012-04-04': '清明节',
           '2012-05-01': '劳动节',
           '2012-06-23': '端午节',
           '2012-09-30': '中秋节',
           '2012-10-01': '国庆节',
		   '2013-01-01': '元旦',
           '2013-02-09': '除夕',
           '2013-02-10': '春节',
           '2013-04-04': '清明节',
           '2013-05-01': '劳动节',
           '2013-06-12': '端午节',
           '2013-09-19': '中秋节',
           '2013-10-01': '国庆节',
		   '2014-01-01': '元旦',
           '2014-01-30': '除夕',
           '2014-01-31': '春节',
           '2014-04-05': '清明节',
           '2014-05-01': '劳动节',
           '2014-06-02': '端午节',
           '2014-09-08': '中秋节',
           '2014-10-01': '国庆节',
		   '2015-01-01': '元旦',
           '2015-02-18': '除夕',
           '2015-02-19': '春节',
           '2015-04-05': '清明节',
           '2015-05-01': '劳动节',
           '2015-06-20': '端午节',
           '2015-09-27': '中秋节',
           '2015-10-01': '国庆节',
		   '2016-01-01': '元旦',
           '2016-02-07': '除夕',
           '2016-02-08': '春节',
           '2016-04-04': '清明节',
           '2016-05-01': '劳动节',
           '2016-06-09': '端午节',
           '2016-09-15': '中秋节',
           '2016-10-01': '国庆节',
		   '2017-01-01': '元旦',
           '2017-01-27': '除夕',
           '2017-01-28': '春节',
           '2017-04-04': '清明节',
           '2017-05-01': '劳动节',
           '2017-05-30': '端午节',
           '2017-10-04': '中秋节',
           '2017-10-01': '国庆节',
		   '2018-01-01': '元旦',
           '2018-02-15': '除夕',
           '2018-02-16': '春节',
           '2018-04-05': '清明节',
           '2018-05-01': '劳动节',
           '2018-06-18': '端午节',
           '2018-09-24': '中秋节',
           '2018-10-01': '国庆节',
		   '2019-01-01': '元旦',
           '2019-02-04': '除夕',
           '2019-02-05': '春节',
           '2019-04-05': '清明节',
           '2019-05-01': '劳动节',
           '2019-06-07': '端午节',
           '2019-09-13': '中秋节',
           '2019-10-01': '国庆节',
		   '2020-01-01': '元旦',
           '2020-01-24': '除夕',
           '2020-01-25': '春节',
           '2020-04-04': '清明节',
           '2020-05-01': '劳动节',
           '2020-06-25': '端午节',
           '2020-10-01': '国庆节'
       },

       /**
        * @name Y.Calendar#renderUI
        * @function
        * @description 初始化日历，让日历渲染出来
        */
        renderUI: function(){
            var t = this;

            if(!t.calendarNode){
                t.get("contentBox").get("parentNode").setStyles({position: "absolute", display: "none"});
            }


            /*
             * @description {Date} 日历数据，主要保存当前第一个日历需要显示的日期
             * @field
             */
            var date = t.get("date");
            var html = [];

            /*
             * @description {String} 获取当前所需要展示的多个日历中所有日历的天数数组
             * @field
             */
            var htmlDay = t.getHtmlDay();

            for(var i = 0, len = t.get("calendarCount"); i < len;){
                t.set("days", htmlDay[i]);
                t.set("isFirstNode", false);
                t.set("isLastNode", false);
                i == 0 && (t.set("isFirstNode", true));
                ++i == len && (t.set("isLastNode", true));

                html.push(t.tempReplace(calandarHtml, t.getAttrs()));
                t.set("date", new Date(t.get("date").getFullYear(), t.get("date").getMonth()+1, 1));
            }

			/*
			 * angtian add
			 * 将特殊日期转为文字/图片显示
			 */
			for(var i = html.length; i--;) {
				(function() {
					var iYear = html[i].match(/<span class="J_selectYear">(\d+)<\/span>/)[1];
					var iMonth = html[i].match(/<span class="J_selectMonth">(\d+)<\/span>/)[1].replace(/^(\d)$/, "0$1");
					var reg = /(<a[^>]+>)(\d+)(<\/a>)/g;					
					html[i] = html[i].replace(reg, function() {
						var aClass = ["jiantian", "shiyi", "qingming"]
						var oDate = new Date();
						var sToday = oDate.getFullYear() + "-" + (oDate.getMonth() + 1).toString().replace(/^(\d)$/, "0$1") + "-" + oDate.getDate().toString().replace(/^(\d)$/, "0$1");
						var args = arguments;
						var iDate = iYear + "-" + iMonth + "-" + args[2].replace(/^(\d)$/, "0$1");
						iDate == sToday && (iDate = "today");
						
						//添加class时使用
						var tmp = args[1]
						var sss = ["yuandan", "chuxi", "chunjie", "yuanxiao", "qingming", "wuyi", "duanwu", "zhongqiu", "guoqing", "today"];
						var index = 0;
						if(iDate in t.festival) {
							switch(t.festival[iDate].substr(0, 2)) {
								case "元旦":
									index = 0;
									break;
								case "除夕":
									index = 1;
									break;
								case "春节":
									index = 2;
									break;
								case "元宵":
									index = 3;
									break;
								case "清明":
									index = 4;
									break;
								case "劳动":
									index = 5;
									break;
								case "端午":
									index = 6;
									break;
								case "中秋":
									index = 7;
									break;
								case "国庆":
									index = 8;
									break;
								case "今天":
									index = 9;
									break;
							}
							args[1] = "<a href=\"javascript:;\" class=\""+ sss[index] +"\">";	
						}
						return args[1] + args[2] + args[3]

						//return args[1] + (iDate in t.festival ? t.festival[iDate] : args[2]) + args[3]
					});
				})(i);	
			}

            t.get("contentBox").set("innerHTML", html.join(""));

            t.set("date", date);
        },

       /**
        * @name Y.Calendar#bindUI
        * @function
        * @description 事件绑定，主要是上一个月，下一个月的事件绑定以及如果有下拉框，下拉框事件绑定
        */
        bindUI: function(){
            var t = this;
            Y.delegate("click", t.showPreDays,  t.get("contentBox"), ".J_pre", t);
            Y.delegate("click", t.showNextDays,  t.get("contentBox"), ".J_next", t);
            Y.delegate("change", t.selectDate,  t.get("contentBox"), ".J_selectYear", t);
            Y.delegate("change", t.selectDate,  t.get("contentBox"), ".J_selectMonth", t);
            Y.delegate("click", t.hide,  t.get("contentBox"), ".J_close", t);
        },

       /**
        * @name Y.Calendar#show
        * @function
        * @param ｛Int｝［x］左边距
        * @param ｛Int｝［y］上边距
        * @description 显示日历控件，其中IE6hack一下
        */
        show: function(x, y){
            var t = this;
            t.calendarNode.setStyles({display: "block", position: "absolute"});
            t._iehack();

            y = Y.UA.ie == 6? (y-1) : y;
            t.move(x, y);
        },

       /**
        * @name Y.Calendar#hide
        * @function
        * @description 隐藏日历控件
        */
        hide: function(){
            var t = this;
			t.fire("close", {});
            t.calendarNode.setStyle("display", "none");
        },

        /**
        * @name Y.Calendar#setNowShowDays
        * @function
        * @param ｛Date｝［date］当前选中的天，即第一个日历中被选中的那天
        * @description 设置日历当前选中的天
        */
        setNowShowDays: function(date){
            var t = this;
            t.set("date", date);
        },

        /**
        * @name Y.Calendar#setLimitDays
        * @function
        * @param ｛Date｝［limitBeginDate］最小日期
        * @param ｛Date｝［limitEndDate］最大日期
        * @description 设置日历中需要限制的范围，如果为空，则没有限制
        */
        setLimitDays: function(limitBeginDate, limitEndDate){
            var t = this;
            t.set("limitBeginDate", limitBeginDate);
            t.set("limitEndDate", limitEndDate);
        },

        /**
        * @name Y.Calendar#setBeginAndEndDate
        * @function
        * @param ｛Date｝［beginDate］开始时间
        * @param ｛Date｝［endTime］结束时间
        * @description 设置日历中的开始时间和结束时间，主要是为了给这个时间段加一个范围
        */
        setBeginAndEndDate: function(beginDate, endTime){
            var t = this;
            t.set("beginDate", beginDate);
            t.set("endDate", endTime);
        },

        /**
        * @name Y.Calendar#showPreDays
        * @function
        * @description 获取上一个月日历信息，呈现
        */
        showPreDays: function(e){
            var t = this;
            t.set("date", t.getPreAndNextMonth(t.get("date"), -1));
            t.renderUI();
			e.halt();
        },

        /**
        * @name Y.Calendar#showNextDays
        * @function
        * @param ｛YUIDom｝［node］触发事件的节点
        * @param ｛Obj｝［t］日历对象
        * @description 获取下一个月日历信息，呈现
        */
        showNextDays: function(e){
            var t = this;
            t.set("date", t.getPreAndNextMonth(t.get("date"), 1));
            t.renderUI();
			e.halt();
        },

        /**
        * @name Y.Calendar#selectDate
        * @function
        * @param ｛Event｝［e］触发事件
        * @description 下拉框选中某个年份或者月份
        */
        selectDate: function(e){
            var t = this;
            var node = e.currentTarget;
            var year = node.ancestor("h5").one(".J_selectYear").get("value");
            var month = node.ancestor("h5").one(".J_selectMonth").get("value");
            t.set("date", new Date(year, month - 1, 1));
            t.renderUI();
        },

        /**
        * @name Y.Calendar#getPreAndNextMonth
        * @function
        * @param ｛Date｝［date］当前的日期
        * @param ｛Date｝［flag］1为下一个月，－1为上一个月
        * @return ｛Date｝
        * @description 通过当前日期，或者上一个月的信息或者下一个月的信息
        */
        getPreAndNextMonth: function(date, flag){
            var month = date.getMonth() + flag;
            if(month > 11){
                return new Date(date.getFullYear() + 1, 0, date.getDate());
            }
            if(month < 0){
                return new Date(date.getFullYear() - 1, 11, date.getDate());
            }
            return new Date(date.getFullYear() , month, date.getDate());
        },


       /**
        * @name Y.Calendar#getHtmlDay
        * @function
        * @description 通过第一个月需要显示的天数，获取后面各个月的天数信息。需要注意保持所有的月份所占方格数一致。
        * @return ｛Array｝ 返回所有的月份需要显示的天数信息
        */
        getHtmlDay:function(){
              var t = this;
              var firstItem = t.get("date");
              var count = t.get("calendarCount");
              var daysArr = [];
              var dateArr = [];
              var htmlDayArr = {};

              for(var i = 0; i < count; i++){
                  dateArr.push(new Date(firstItem.getFullYear(), firstItem.getMonth() + i, 1));
                  daysArr.push(t.getOneMonthDay(firstItem.getFullYear(), firstItem.getMonth() + i + 1) + dateArr[i].getDay());
                  htmlDayArr[i] = [];
              };

              daysArr.sort(function(a, b){
                  return b-a;
              });

              for(var i = 0; i < count; i++){

                  var startDay = new Date(dateArr[i].getFullYear(), dateArr[i].getMonth(), 1).getDay();

                  for(var j = 0; j < startDay; j++){
                      htmlDayArr[i].push("");
                  };
                  for(var j = 0, len = t.getOneMonthDay(dateArr[i].getFullYear(), dateArr[i].getMonth() + 1); j < len;){
                      htmlDayArr[i].push(++j);
                  }

                  var maxLength =  daysArr[0] + (daysArr[0]%7 == 0? 0 : 1)*7 - daysArr[0]%7;
                  for(var j = htmlDayArr[i].length; j < maxLength; j++){
                      htmlDayArr[i].push("");
                  }
              }
              return htmlDayArr;

        },

        /**
        * @name Y.Calendar#getOneMonthDay
        * @function
        * @param ｛Int｝［year］年
        * @param ｛Int｝［month］月
        * @description 通过年和月获取这个月的天数
        * @return ｛Int｝ 天数
        */
        getOneMonthDay:function(year,month){
			 return 32-new Date(year,month-1,32).getDate();
		},

        /**
        * @name Y.Calendar#_iehack
        * @function
        * @description IE下面需要添加iframe，同时需要去掉投影
        */
        _iehack: function(){
            if(Y.UA.ie == 6){
                var t = this;
                if(!t.calendarNode.one("iframe")){
                    this.calendarNode.append('<iframe></iframe>');
                }
                var width = t.calendarNode.get("offsetWidth");
                var height = t.calendarNode.get("offsetHeight");
                t.calendarNode.removeClass("shadow");
                t.calendarNode.one("iframe").setStyles({width: width, height: height});
            }
        },

        /**
        * @name Y.Calendar#tempReplace
        * @function
        * @param ｛String｝［str］模板
        * @param ｛Json｝［data］处理的数据
        * @description 模板函数
        * @return ｛String｝ 代码片段
        */
        tempReplace: function(str, data){
             var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(str) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};"
                                                   + "with(obj){p.push('"
                                                   + str.replace(/[\r\t\n]/g, " ")
                                                        .split("<%").join("\t")
                                                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                                                        .replace(/\t=(.*?)%>/g, "',$1,'")
                                                        .split("\t").join("');")
                                                        .split("%>").join("p.push('")
                                                        .split("\r").join("\\'")
                                                   + "');}return p.join('');");


              return data ? fn( data ) : fn;
        }
    },{
        ATTRS: {
             beginDate: {
                 value: null
             },
             endDate: {
                 value: null
             },
             limitBeginDate: {
                 value: null
             },
             limitEndDate: {
                 value: null
             },
             calendarCount: {
                 value: 2
             },
             toDay: {
                 value: new Date(new Date().setHours(0, 0, 0, 0))
             },
             date: {
                 value: new Date()
             },
             days: [],
             isFirstNode: {
                 value: false
             },
             isLastNode: {
                 value: false
             },
             id: {
                 value: "J_calendar"
             },
             isSelect: {
                 value: false
             },
            titleTips:{
                value: ""
            }
        }
    });


}, '1.0' ,{requires:["widget", "widget-position"]});/**
 * @fileOverview 旅行日历控件，主要结合旅行有关的需求做的个性化设置
 * @author lanmeng
 * version 1.0
 * @requires ［"widget",  "calendar"］
 */
var TG = TG || {};
TG.SearchForm = TG.SearchForm || {};

YUI.namespace('Y.TripCalandar');
YUI.add('trip-calendar',function(Y) {
    var trim = Y.Lang.trim;

    /**
     * @namespace 常量以及配置信息
     */
    
    var config = {
       weekStr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
       today: new Date(new Date().setHours(0, 0, 0, 0)),
       dataExp: /^(\d{2,4})-(?:[0]?)(\d{1,2})-(?:[0]?)(\d{1,2})$/,
       time: 24 * 60 * 60 * 1000
    };

     /**
     * @name Y.TripCalendar
     * @constructor
     * @param isWeek 是否显示星期
     * @param isFestival  是否显示节假日
     * @param calendarCount 日历的个数，默认为2
     * @param limitBeginDate 最小时间，为空则不作限制，默认为空
     * @param limitEndDate  最大时间，为空则不作限制，默认为空
     * @param limitDays 限制天数，主要酒店使用
     * @param beginNode 开始日期节点，不可以为空
     * @param endNode 结束日期节点，可选
     * @param isSelect 是否有下拉框可以切换日期，目前较少测试
     * @description 日历构造函数，使用的是widget中的base和position定位
     */
    Y.TripCalendar = function(){
        Y.TripCalendar.superclass.constructor.apply(this,arguments);
    };

    Y.TripCalendar.NAME = "tripCalendar";

    Y.TripCalendar.ATTRS = {
        isWeek: {
            value: true
        },
        isFestival: {
            value: true
        },
        calendarCount: {
            value: 2
        },
        limitBeginDate: {
            value: ''
        },
        limitEndDate:{
            value: ''
        },
        limitDays: {
            value: 0
        },
        beginNode:{
            value: ""
        },
        endNode: {
            value: ""
        },
        beginDate: {
            value: ""
        },
        endDate: {
            value: ""
        },
        isSelect: {
            value: false
        },
        titleTips: {
            value: ""
        },
        limitBox: {
            value: ""
        }
    };

    /**
     * @name Y.TripCalendar#initializer
     * @function
     * @description 初始化日历，绑定事件
     */
    Y.extend(Y.TripCalendar,Y.Widget,{

        initializer:function () {
            var t = this;
            var oInputB = null;
            var oInputE = null;
            t.isCalendarShow = false;
            t.hideCalendar = false;
            t.calendarTimeout = null;
            t.limitBox = Y.one(t.get("limitBox") ? t.get("limitBox") : "body");
            t.beginNode = Y.one(t.get("beginNode"));
            t.endNode = Y.one(t.get("endNode"));
            t.beginDate = t.beginNode.get("value");
            t.endDate = t.endNode ? t.endNode.get("value") : "";
            oInputB = t.beginNode.one("input[type=text]");
            oInputB.addClass("J_DateInput");
            oInputE = t.endNode && t.endNode.one("input[type=text]");
            oInputE && oInputE.addClass("J_DateInput");

            oInputB.calendarObj = this;
            t.endNode && (oInputE.calendarObj = this);

            TG.SearchForm['#' + oInputB.get('id')] = this;
            oInputE && (TG.SearchForm['#' + oInputE.get('id')] = this);

            Y.TripPlaceholder.init(t.beginNode.one("input"));
            t.endNode && Y.TripPlaceholder.init(t.endNode.one("input"));

            t.oneCalendar = new Y.Calendar({
                calendarCount:t.get("calendarCount"),
                isSelect:t.get("isSelect"),
                beginDate:t.formatDate(t.beginDate),
                endDate:t.formatDate(t.endDate),
                limitBeginTime:"",
                limitEndTime:"",
                titleTips:t.get("titleTips")
            });

            t.calendarNode = t.oneCalendar.calendarNode;
            t.calendarNode.addClass('has-anim-fast');
            t.calendarNode.setStyle("width", 453);
            t.renderUI();
            t.bindUI();

            var oBeginWeek = t.beginNode.one("span");
            var oEndWeek = t.endNode ? t.endNode.one("span") : null;
            oBeginWeek && oBeginWeek.addClass("b");
            oEndWeek && oEndWeek.addClass("e");
        },

        /**
        * @name Y.TripCalendar#renderUI
        * @function
        * @description 设置input不可以有提示，且设置当前输入框的选中时间对应的星期或节日
        */
        renderUI: function(){
            var t = this;
            t.beginNode.one("input").setAttribute("autocomplete", "off");
            t.endNode && t.endNode.one("input").setAttribute("autocomplete", "off");
            t.setDateInputDayInfo(t.beginNode, t.beginDate);
            t.setDateInputDayInfo(t.endNode, t.endDate);
        },

        /**
        * @name Y.TripCalendar#bindUI
        * @function
        * @description 事件绑定，鼠标在时间输入框内点击或者tab切换选中都需要弹出日历控件；
        * 鼠标在日历控件中及日历输入可外点击，日历消失；
        * 窗口变化，日历位置移动；
        * 日历时间点击，触发事件
        */
        bindUI: function(){
            var t = this;
            var doc = Y.one("document");
            t.onSelectBoxBindEvent(t.beginNode);
            t.onSelectBoxBindEvent(t.endNode);

            doc.on("mousedown", function(e){
                var nowNode = e.target;
                clearTimeout(t.calendarTimeout); 
                
                if(!t.beginNode.one("input")){
                	 return;
                }

                if(nowNode.ancestor(".calendar") == t.calendarNode && !nowNode.hasClass("J_close")){
                    e.halt();
                    t.ieTimeout();
                    return;
                }
                t.hideCalendar = true;
                t.inputBlur();
            });
            t.calendarNode.delegate("click", function(e){
                t.selectDay(e);
                t.hideCalendar = true;
                t.inputBlur();
            }, "a", t);

            var aResizeTimeout = null;
            Y.one("window").on("resize", function(){
                aResizeTimeout && clearTimeout(aResizeTimeout);
                aResizeTimeout = setTimeout(function(){
                    t.isCalendarShow && t.showClalender();
                },10);
            }, t);
			
			//
			Y.all(".J_DateInput").on("keyup", function(e) {
				var sValue = e.target.get("value");				
				t.setDateInfo(sValue);
				e.target.get("id") == "J_jipiao_depDate" && t.oneCalendar.setBeginAndEndDate(t.formatDate(sValue), t.formatDate(t.endDate));
				e.target.get("id") == "J_jipiao_endDate" && t.oneCalendar.setBeginAndEndDate(t.formatDate(t.beginDate), t.formatDate(sValue));
				t.oneCalendar.renderUI();
			});
        },

        /**
        * @name Y.TripCalendar#onSelectBoxBindEvent
        * @function
        * @param ｛YUIDom｝［selectBox] 点击会弹出日历的div
        * @description 给div绑定事件
        */
        onSelectBoxBindEvent: function(selectBox){
            var t = this;
            if(selectBox){
                selectBox.one("input").on("focus", t.inputFocus, t);

                selectBox.one("input").on("blur", function(){
                    t.hideCalendar = true;
                    t.calendarTimeout = setTimeout(function(){
                        t.inputBlur();
                    },10);
                });

                selectBox.on("mousedown", function(e){
                    if(e.target != selectBox.one("input")){
                        e.halt();
                        t.ieTimeout();
                        selectBox.one("input").focus();
                    } else {
                        e.stopPropagation();
                    }

                });
            }
        },

        /**
        * @name Y.TripCalendar#setDateInputDayInfo
        * @function
        * @param ｛YUIDom｝［node］节点
        * @param ｛String｝［dateStr］节点日期信息
        * @description 设置选择日期的input的值以及星期（这个方法可以修改）
        */
        setDateInputDayInfo: function(node, dateStr){
            if(node){
                var t = this;
                t.nowSelNode = node;
                t.setDateInfo(dateStr);
            }
        },

        /**
        * @name Y.TripCalendar#inputFocus
        * @function
        * @param ｛event｝［e］触发事件
        * @param ｛Boolean｝［isBeginDate］是否是开始节点
        * @description 当出发或者结束时间被选中以后，弹出日历控件
        * 需要判断日历控件是否已经显示
        * 日历控件的日期需要修改（开始点击，显示开始时间；结束点击，显示结束时间）
        */
        inputFocus: function(e){
            var t = this;
            var nowNode = e.target.get("parentNode");
            e.target.addClass("yui3-acinput-focus");

            clearTimeout(t.calendarTimeout);
            if(nowNode != t.nowSelNode){
                t.hideCalendar = true;
                t.inputBlur();
            }
			
            t.beginDate = t.getInputVal(t.beginNode);
            t.endDate = t.endNode? t.getInputVal(t.endNode) : "";

            if(!t.isCalendarShow || (t.getInputVal(nowNode) != t.getInputVal(t.nowSelNode))){
                var nowDate = t.getInputVal(nowNode) || config.today;
                if(t.endDate == "" && nowNode == t.endNode){
                    nowDate = t.beginDate || nowDate;
                }
                t.oneCalendar.setNowShowDays(t.formatDate(nowDate) || new Date());
            }
            if(nowNode == t.endNode){
                t.calendarNode.addClass("end-select");
                t.setLimitDate(t.get("limitBeginDate"), t.get("limitEndDate"), true);
            } else {
                t.setLimitDate(t.get("limitBeginDate"), t.get("limitEndDate"), false);
            }

            t.nowSelNode = nowNode;
            t.nowSelNode.addClass("cal-input-focus");
            t.oneCalendar.setBeginAndEndDate(t.formatDate(t.beginDate), t.formatDate(t.endDate));			
            t.showClalender();	
			
			var oInput = nowNode.one("input");
			setTimeout(function() {
				oInput.select()
			}, 50);
			
			t.calendarNode.all(".oneCalendar li").set("title", "");
			var oSelectBegin = Y.one(".select-begin-date");
			var oSelectEnd = Y.one(".select-end-date");
			oSelectBegin && oSelectBegin.set("title", "出发时间");
			oSelectEnd && oSelectEnd.set("title", "返程时间");	
        },

        /**
        * @name Y.TripCalendar#inputBlur
        * @function
        * @description 操作移出时间选择框
        */
        inputBlur: function(){
            var t = this;
			var oCal = t.calendarNode;
            if(t.hideCalendar){
                t.setDateInfo();
                t.oneCalendar.hide();
                t.isCalendarShow = false;
                t.nowSelNode.one("input").removeClass("yui3-acinput-focus");
                t.calendarNode.removeClass("end-select");
                t.hideCalendar = false;	
				oCal.one(".message-tips") && oCal.one(".message-tips").remove();
				oCal.one('.calendar-main').setStyle('paddingTop', 20);
				oCal.one('.J_close').setStyle("top", 8);
            }
        },

        /**
        * @name Y.TripCalendar#getInputVal
        * @function
        * @param ｛YUIDom｝［node］输入框节点
        * @description 获取输入框中的信息
        */
        getInputVal: function(node){
             return trim(node.one("input").get("value"));
        },


        /**
        * @name Y.TripCalendar#showClalender
        * @function
        * @description 显示日历控件，获取当前操作的元素的位置，传递给日历控件
        */
        showClalender: function(){
            var t = this;
            t.isCalendarShow = true;
            t.oneCalendar.renderUI();
            t.calendarNode.setStyles({display: "block", visibility: "hidden", top: "0px", left: "0px"});

            var position = t.getShowXY();
            t.oneCalendar.show(position.x, position.y);
            t.calendarNode.setStyle("visibility", "visible");
        },

        getShowXY: function(){
            var t = this;
			var oCal = t.calendarNode;
			var nodeH = t.nowSelNode.get("region").height - 1;  //get('region')
	  	  	var winW = parseInt(t.oneCalendar.calendarNode.get("scrollWidth"));
	  	  	var winH = parseInt(t.oneCalendar.calendarNode.get("scrollHeight"));
	  	  	var limitW = t.limitBox == Y.one("body")? Y.DOM.docWidth() : t.limitBox.get("scrollWidth");
	  	  	var limitH = t.limitBox == Y.one("body")? Y.DOM.docHeight() : t.limitBox.get("scrollHeight");

            var position = {};
            if((t.nowSelNode.getX() - t.limitBox.getX()) > (limitW - winW)){
                position.x = t.limitBox.getX() + limitW - winW - 2;
            } else {
                position.x = t.nowSelNode.getX();
            }
            if((t.nowSelNode.getY() + nodeH - t.limitBox.getY()) > (limitH - winH)){				
                position.y = t.nowSelNode.getY() - winH;
            } else {
                position.y = t.nowSelNode.getY() + nodeH;
            }
            return position;
        },

        /**
        * @name Y.TripCalendar#setLimitDate
        * @function
        * @param ｛String｝［limitBeginDate］最小日期
        * @param ｛String｝［limitEndDate］最大日期
        * @description 如果有限制天数，则以最小日期加上天数处理
        */
        setLimitDate: function(limitBeginDate, limitEndDate, isLimited){
            var t = this;
            limitBeginDate = t.formatDate(limitBeginDate);
            if(isLimited && limitBeginDate && t.get("limitDays") && t.formatDate(t.beginDate)){
                limitEndDate =  new Date(t.formatDate(t.beginDate).getTime() + config.time * parseInt(t.get("limitDays")));
            }
            if(isLimited && limitEndDate){
                limitEndDate = t.formatDate(limitEndDate);
            }
            t.oneCalendar.setLimitDays(limitBeginDate, limitEndDate);
        },


        /**
        * @name Y.TripCalendar#selectDay
        * @function
        * @param ｛event｝［e］当前触发事件
        * @description 选中某天，输入框中日期变化，对应的星期或者节日变化
        */
        selectDay: function(e){
            var t = this;
            e.preventDefault();

            var node = e.currentTarget;
            var oneCalendar = node.ancestor("div");
            var year = oneCalendar.one(".J_selectYear").get("value") || oneCalendar.one(".J_selectYear").get("innerHTML");
            var month = oneCalendar.one(".J_selectMonth").get("value") || oneCalendar.one(".J_selectMonth").get("innerHTML");
            var day = node.get("innerHTML");

            var nowDate = year + "-"+ t.gerDoubleNum(month) + "-" + t.gerDoubleNum(day);
            t.fire("select", {dateStr:nowDate, inputNode: t.nowSelNode.one("input[type=text]")});
            t.nowSelNode.one("input").set("value", year + "-"+ t.gerDoubleNum(month) + "-" + t.gerDoubleNum(day));
            t.nowSelNode.one("input").removeClass("trip-placeholder");

            t.setDateInfo(nowDate);
            t.inputBlur();
			
			//angtian add
			t.nowSelNode.one("input").blur();
			if(t.nowSelNode.get("id") == "J_jipiao_depDateBox" && Y.one("#J_jipiao_FlightTypeRadio_2").get("checked")) {
				setTimeout(function() {
					Y.one("#J_jipiao_endDate")._node.focus();
				}, 0)
			}
        },

        /**
        * @name Y.TripCalendar#setDateInfo
        * @function
        * @param ｛Date｝［nowDate］当前选中的天
        * @description 通过当前选中的天获取对应的星期或者节日信息
        */
        setDateInfo:function (nowDate, node) {
            var t = this;
            var inputNode = node || t.nowSelNode.one("input");
            var dayInfo = "";
            var oHoliday = {
                '2012-01-01':'元旦',
                '2012-01-19':'除夕前三天',
                '2012-01-20':'除夕前二天',
                '2012-01-21':'除夕前一天',
                '2012-01-22':'除夕',
                '2012-01-23':'春节',
                '2012-01-24':'春节后一天',
                '2012-01-25':'春节后二天',
                '2012-01-26':'春节后三天',
                '2012-04-01':'清明节前三天',
                '2012-04-02':'清明节前二天',
                '2012-04-03':'清明节前一天',
                '2012-04-04':'清明节',
                '2012-04-05':'清明节后一天',
                '2012-04-06':'清明节后二天',
                '2012-04-07':'清明节后三天',
                '2012-04-28':'劳动节前三天',
                '2012-04-29':'劳动节前二天',
                '2012-04-30':'劳动节前一天',
                '2012-05-01':'劳动节',
                '2012-05-02':'劳动节后一天',
                '2012-05-03':'劳动节后二天',
                '2012-05-04':'劳动节后三天',
                '2012-06-20':'端午节前三天',
                '2012-06-21':'端午节前二天',
                '2012-06-22':'端午节前一天',
                '2012-06-23':'端午节',
                '2012-06-24':'端午节后一天',
                '2012-06-25':'端午节后二天',
                '2012-06-26':'端午节后三天',
                '2012-09-27':'中秋节前三天',
                '2012-09-28':'中秋节前二天',
                '2012-09-29':'中秋节前一天',
                '2012-09-30':'中秋节',
                '2012-10-01':'国庆节',
                '2012-10-02':'国庆节后一天',
                '2012-10-03':'国庆节后二天',
                '2012-10-04':'国庆节后三天',
                '2012-12-29':'元旦前三天',
                '2012-12-30':'元旦前二天',
                '2012-12-31':'元旦前一天',
                '2013-01-01':'元旦',
                '2013-01-02':'元旦后一天',
                '2013-01-03':'元旦后二天',
                '2013-01-04':'元旦后三天',
                '2013-02-06':'除夕前三天',
                '2013-02-07':'除夕前二天',
                '2013-02-08':'除夕前一天',
                '2013-02-09':'除夕',
                '2013-02-10':'春节',
                '2013-02-11':'春节后一天',
                '2013-02-12':'春节后二天',
                '2013-02-13':'春节后三天',
                '2013-04-01':'清明节前三天',
                '2013-04-02':'清明节前二天',
                '2013-04-03':'清明节前一天',
                '2013-04-04':'清明节',
                '2013-04-05':'清明节后一天',
                '2013-04-06':'清明节后二天',
                '2013-04-07':'清明节后三天',
                '2013-04-28':'劳动节前三天',
                '2013-04-29':'劳动节前二天',
                '2013-04-30':'劳动节前一天',
                '2013-05-01':'劳动节',
                '2013-05-02':'劳动节后一天',
                '2013-05-03':'劳动节后二天',
                '2013-05-04':'劳动节后三天',
                '2013-06-09':'端午节前三天',
                '2013-06-10':'端午节前二天',
                '2013-06-11':'端午节前一天',
                '2013-06-12':'端午节',
                '2013-06-13':'端午节后一天',
                '2013-06-14':'端午节后二天',
                '2013-06-15':'端午节后三天',
                '2013-09-16':'中秋节前三天',
                '2013-09-17':'中秋节前二天',
                '2013-09-18':'中秋节前一天',
                '2013-09-19':'中秋节',
                '2013-09-20':'中秋节后一天',
                '2013-09-21':'中秋节后二天',
                '2013-09-22':'中秋节后三天',
                '2013-09-28':'国庆节前三天',
                '2013-09-29':'国庆节前二天',
                '2013-09-30':'国庆节前一天',
                '2013-10-01':'国庆节',
                '2013-10-01':'国庆节后一天',
                '2013-10-01':'国庆节后二天',
                '2013-10-01':'国庆节后三天',
                '2014-01-01':'元旦',
                '2014-01-30':'除夕',
                '2014-01-31':'春节',
                '2014-04-05':'清明节',
                '2014-05-01':'劳动节',
                '2014-06-02':'端午节',
                '2014-09-08':'中秋节',
                '2014-10-01':'国庆节',
                '2015-01-01':'元旦',
                '2015-02-18':'除夕',
                '2015-02-19':'春节',
                '2015-04-05':'清明节',
                '2015-05-01':'劳动节',
                '2015-06-20':'端午节',
                '2015-09-27':'中秋节',
                '2015-10-01':'国庆节',
                '2016-01-01':'元旦',
                '2016-02-07':'除夕',
                '2016-02-08':'春节',
                '2016-04-04':'清明节',
                '2016-05-01':'劳动节',
                '2016-06-09':'端午节',
                '2016-09-15':'中秋节',
                '2016-10-01':'国庆节',
                '2017-01-01':'元旦',
                '2017-01-27':'除夕',
                '2017-01-28':'春节',
                '2017-04-04':'清明节',
                '2017-05-01':'劳动节',
                '2017-05-30':'端午节',
                '2017-10-04':'中秋节',
                '2017-10-01':'国庆节',
                '2018-01-01':'元旦',
                '2018-02-15':'除夕',
                '2018-02-16':'春节',
                '2018-04-05':'清明节',
                '2018-05-01':'劳动节',
                '2018-06-18':'端午节',
                '2018-09-24':'中秋节',
                '2018-10-01':'国庆节',
                '2019-01-01':'元旦',
                '2019-02-04':'除夕',
                '2019-02-05':'春节',
                '2019-04-05':'清明节',
                '2019-05-01':'劳动节',
                '2019-06-07':'端午节',
                '2019-09-13':'中秋节',
                '2019-10-01':'国庆节',
                '2020-01-01':'元旦',
                '2020-01-24':'除夕',
                '2020-01-25':'春节',
                '2020-04-04':'清明节',
                '2020-05-01':'劳动节',
                '2020-06-25':'端午节',
                '2020-09-28':'国庆节前三天',
                '2020-09-29':'国庆节前两天',
                '2020-09-30':'国庆节前一天',
                '2020-10-01':'国庆节',
                '2020-10-02':'国庆节后一天',
                '2020-10-03':'国庆节后两天',
                '2020-10-04':'国庆节后三天'
            };

            nowDate = nowDate ? nowDate : inputNode.get("value");
            if (t.get("isFestival")) {
                var nowDateObj = t.formatDate(nowDate);
                if (nowDate && nowDateObj) {
                    dayInfo = config.weekStr[nowDateObj.getDay()] ? config.weekStr[nowDateObj.getDay()] : "";
                }
                if (nowDateObj) {
                    var disDays = (nowDateObj.getTime() - config.today.getTime()) / config.time + 1;
                    switch (disDays) {
                        case 1:
                            dayInfo = "今天";
                            break;
                        case 2:
                            dayInfo = "明天";
                            break;
                        case 3:
                            dayInfo = "后天";
                            break;
                    }

                }
                if (oHoliday[nowDate]) {
                    dayInfo = oHoliday[nowDate];
                }

            }
            // inputNode.get('parentNode').one("span").set("innerHTML", dayInfo);
        },

        ieTimeout: function(){
            var t = this;
            setTimeout(function(){
                t.hideCalendar = false;
            },1);

        },

        /**
        * @name Y.TripCalendar#gerDoubleNum
        * @function
        * @param ｛Int}［num］数字
        * @return {Int}
        * @description 获取双数
        */
        gerDoubleNum: function(num){
            if(num.length < 2){
                return "0" + num;
            }
            return num;
        },

        /**
        * @name Y.TripCalendar#formatDate
        * @function
        * @param ｛String｝［dateStr］将字符串转化为date
        * @return {obj}
        * @description 时间信息
        */
        formatDate: function(dateStr){
            if(typeof dateStr == "object"){
                return new Date(dateStr.getFullYear(), dateStr.getMonth(), dateStr.getDate());
            }
            var date = dateStr.match(config.dataExp);
            if(dateStr && date){
                return new Date(date[1], date[2] - 1, date[3]);
            }
            return null;
        },
        showMessage: function(message, input) {
          var oCal = this.calendarNode ,
              that = this;
          input._node.focus();
          oCal.prepend('<div class="message-tips"><p>'+message+'</p></div>');
          oCal.one('.calendar-main').setStyle('paddingTop', oCal.one('.message-tips').get('offsetHeight') + 20);
          oCal.one('.J_close').setStyle("top", oCal.one(".message-tips").get("offsetHeight") + 8);
          oCal.setStyle('zoom', 1);
          this.calendarNode.addClass('anim-shake');
          setTimeout(function (){
            that.calendarNode.removeClass('anim-shake');
          },100);
        }
    });
}, '1.0' ,{requires:["widget",  "calendar"]});/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('widget-stdmod', function(Y) {

/**
 * Provides standard module support for Widgets through an extension.
 * 
 * @module widget-stdmod
 */
    var L = Y.Lang,
        Node = Y.Node,
        UA = Y.UA,
        Widget = Y.Widget,

        EMPTY = "",
        HD = "hd",
        BD = "bd",
        FT = "ft",
        HEADER = "header",
        BODY = "body",
        FOOTER = "footer",
        FILL_HEIGHT = "fillHeight",
        STDMOD = "stdmod",
        
        NODE_SUFFIX = "Node",
        CONTENT_SUFFIX = "Content",

        FIRST_CHILD = "firstChild",
        CHILD_NODES = "childNodes",
        OWNER_DOCUMENT = "ownerDocument",

        CONTENT_BOX = "contentBox",

        HEIGHT = "height",
        OFFSET_HEIGHT = "offsetHeight",
        AUTO = "auto",

        HeaderChange = "headerContentChange",
        BodyChange = "bodyContentChange",
        FooterChange = "footerContentChange",
        FillHeightChange = "fillHeightChange",
        HeightChange = "heightChange",
        ContentUpdate = "contentUpdate",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI",

        APPLY_PARSED_CONFIG = "_applyParsedConfig",

        UI = Y.Widget.UI_SRC;

    /**
     * Widget extension, which can be used to add Standard Module support to the 
     * base Widget class, through the <a href="Base.html#method_build">Base.build</a> 
     * method.
     * <p>
     * The extension adds header, body and footer sections to the Widget's content box and 
     * provides the corresponding methods and attributes to modify the contents of these sections.
     * </p>
     * @class WidgetStdMod
     * @param {Object} The user configuration object
     */
    function StdMod(config) {

        this._stdModNode = this.get(CONTENT_BOX);

        Y.before(this._renderUIStdMod, this, RENDERUI);
        Y.before(this._bindUIStdMod, this, BINDUI);
        Y.before(this._syncUIStdMod, this, SYNCUI);
    }

    /**
     * Constant used to refer the the standard module header, in methods which expect a section specifier
     * 
     * @property WidgetStdMod.HEADER
     * @static
     * @type String
     */
    StdMod.HEADER = HEADER;

    /**
     * Constant used to refer the the standard module body, in methods which expect a section specifier
     * 
     * @property WidgetStdMod.BODY
     * @static
     * @type String
     */
    StdMod.BODY = BODY;

    /**
     * Constant used to refer the the standard module footer, in methods which expect a section specifier
     * 
     * @property WidgetStdMod.FOOTER
     * @static
     * @type String
     */
    StdMod.FOOTER = FOOTER;

    /**
     * Constant used to specify insertion position, when adding content to sections of the standard module in 
     * methods which expect a "where" argument.
     * <p>
     * Inserts new content <em>before</em> the sections existing content.
     * </p>
     * @property WidgetStdMod.AFTER
     * @static
     * @type String
     */
    StdMod.AFTER = "after";

    /**
     * Constant used to specify insertion position, when adding content to sections of the standard module in
     * methods which expect a "where" argument.
     * <p>
     * Inserts new content <em>before</em> the sections existing content.
     * </p>
     * @property WidgetStdMod.BEFORE
     * @static
     * @type String
     */
    StdMod.BEFORE = "before";
    /**
     * Constant used to specify insertion position, when adding content to sections of the standard module in
     * methods which expect a "where" argument.
     * <p>
     * <em>Replaces</em> the sections existing content, with new content.
     * </p>
     * @property WidgetStdMod.REPLACE
     * @static
     * @type String
     */
    StdMod.REPLACE = "replace";

    var STD_HEADER = StdMod.HEADER,
        STD_BODY = StdMod.BODY,
        STD_FOOTER = StdMod.FOOTER,
        
        HEADER_CONTENT = STD_HEADER + CONTENT_SUFFIX,
        FOOTER_CONTENT = STD_FOOTER + CONTENT_SUFFIX,
        BODY_CONTENT = STD_BODY + CONTENT_SUFFIX;

    /**
     * Static property used to define the default attribute 
     * configuration introduced by WidgetStdMod.
     * 
     * @property WidgetStdMod.ATTRS
     * @type Object
     * @static
     */
    StdMod.ATTRS = {

        /**
         * @attribute headerContent
         * @type {String | Node}
         * @default undefined
         * @description The content to be added to the header section. This will replace any existing content
         * in the header. If you want to append, or insert new content, use the <a href="#method_setStdModContent">setStdModContent</a> method.
         */
        headerContent: {
            value:null
        },

        /**
         * @attribute footerContent
         * @type {String | Node}
         * @default undefined
         * @description The content to be added to the footer section. This will replace any existing content
         * in the footer. If you want to append, or insert new content, use the <a href="#method_setStdModContent">setStdModContent</a> method.
         */
        footerContent: {
            value:null
        },
        
        /**
         * @attribute bodyContent
         * @type {String | Node}
         * @default undefined
         * @description The content to be added to the body section. This will replace any existing content
         * in the body. If you want to append, or insert new content, use the <a href="#method_setStdModContent">setStdModContent</a> method.
         */
        bodyContent: {
            value:null
        },
        
        /**
         * @attribute fillHeight
         * @type {String}
         * @default WidgetStdMod.BODY
         * @description The section (WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER) which should be resized to fill the height of the standard module, when a 
         * height is set on the Widget. If a height is not set on the widget, then all sections are sized based on 
         * their content.
         */
        fillHeight: {
            value: StdMod.BODY,
            validator: function(val) {
                 return this._validateFillHeight(val);
            }
        }
    };

    /**
     * The HTML parsing rules for the WidgetStdMod class.
     * 
     * @property WidgetStdMod.HTML_PARSER
     * @static
     * @type Object
     */
    StdMod.HTML_PARSER = {
        headerContent: function(contentBox) {
            return this._parseStdModHTML(STD_HEADER);
        },

        bodyContent: function(contentBox) {
            return this._parseStdModHTML(STD_BODY);
        },

        footerContent : function(contentBox) {
            return this._parseStdModHTML(STD_FOOTER);
        }
    };

    /**
     * Static hash of default class names used for the header,
     * body and footer sections of the standard module, keyed by
     * the section identifier (WidgetStdMod.STD_HEADER, WidgetStdMod.STD_BODY, WidgetStdMod.STD_FOOTER)
     *
     * @property WidgetStdMod.SECTION_CLASS_NAMES
     * @static
     * @type Object
     */
    StdMod.SECTION_CLASS_NAMES = {
        header: Widget.getClassName(HD),
        body: Widget.getClassName(BD),
        footer: Widget.getClassName(FT)
    };

    /**
     * The template HTML strings for each of the standard module sections. Section entries are keyed by the section constants,
     * WidgetStdMod.HEADER, WidgetStdMod.BODY, WidgetStdMod.FOOTER, and contain the HTML to be added for each section.
     * e.g.
     * <pre>
     *    {
     *       header : '&lt;div class="yui-widget-hd"&gt;&lt;/div&gt;',
     *       body : '&lt;div class="yui-widget-bd"&gt;&lt;/div&gt;',
     *       footer : '&lt;div class="yui-widget-ft"&gt;&lt;/div&gt;'
     *    }
     * </pre>
     * @property WidgetStdMod.TEMPLATES
     * @type Object
     * @static
     */
    StdMod.TEMPLATES = {
        header : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_HEADER] + '"></div>',
        body : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_BODY] + '"></div>',
        footer : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_FOOTER] + '"></div>'
    };

    StdMod.prototype = {

        /**
         * Synchronizes the UI to match the Widgets standard module state.
         * <p>
         * This method is invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _syncUIStdMod
         * @protected
         */
        _syncUIStdMod : function() {
            var stdModParsed = this._stdModParsed;

            if (!stdModParsed || !stdModParsed[HEADER_CONTENT]) { 
                this._uiSetStdMod(STD_HEADER, this.get(HEADER_CONTENT)); 
            }

            if (!stdModParsed || !stdModParsed[BODY_CONTENT]) { 
                this._uiSetStdMod(STD_BODY, this.get(BODY_CONTENT));
            }

            if (!stdModParsed || !stdModParsed[FOOTER_CONTENT]) {
                this._uiSetStdMod(STD_FOOTER, this.get(FOOTER_CONTENT));
            }

            this._uiSetFillHeight(this.get(FILL_HEIGHT));
        },

        /**
         * Creates/Initializes the DOM for standard module support.
         * <p>
         * This method is invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIStdMod
         * @protected
         */
        _renderUIStdMod : function() {
            this._stdModNode.addClass(Widget.getClassName(STDMOD));
            this._renderStdModSections();
        },

        _renderStdModSections : function() {
            if (L.isValue(this.get(HEADER_CONTENT))) { this._renderStdMod(STD_HEADER); }
            if (L.isValue(this.get(BODY_CONTENT))) { this._renderStdMod(STD_BODY); }
            if (L.isValue(this.get(FOOTER_CONTENT))) { this._renderStdMod(STD_FOOTER); }
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to 
         * Widget standard module related state changes.
         * <p>
         * This method is invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIStdMod
         * @protected
         */
        _bindUIStdMod : function() {
            this.after(HeaderChange, this._afterHeaderChange);
            this.after(BodyChange, this._afterBodyChange);
            this.after(FooterChange, this._afterFooterChange);

            this.after(FillHeightChange, this._afterFillHeightChange);
            this.after(HeightChange, this._fillHeight);            
            this.after(ContentUpdate, this._fillHeight);
        },

        /**
         * Default attribute change listener for the headerContent attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterHeaderChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterHeaderChange : function(e) {
            if (e.src !== UI) {
                this._uiSetStdMod(STD_HEADER, e.newVal, e.stdModPosition);
            }
        },

        /**
         * Default attribute change listener for the bodyContent attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterBodyChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterBodyChange : function(e) {
            if (e.src !== UI) {
                this._uiSetStdMod(STD_BODY, e.newVal, e.stdModPosition);
            }
        },

        /**
         * Default attribute change listener for the footerContent attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterFooterChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterFooterChange : function(e) {
            if (e.src !== UI) {
                this._uiSetStdMod(STD_FOOTER, e.newVal, e.stdModPosition);
            }
        },

        /**
         * Default attribute change listener for the fillHeight attribute, responsible
         * for updating the UI, in response to attribute changes.
         * 
         * @method _afterFillHeightChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterFillHeightChange: function (e) {
            this._uiSetFillHeight(e.newVal);
        },

        /**
         * Default validator for the fillHeight attribute. Verifies that the 
         * value set is a valid section specifier - one of WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER,
         * or a falsey value if fillHeight is to be disabled.
         *
         * @method _validateFillHeight
         * @protected
         * @param {String} val The section which should be setup to fill height, or false/null to disable fillHeight
         * @return true if valid, false if not
         */
        _validateFillHeight : function(val) {
            return !val || val == StdMod.BODY || val == StdMod.HEADER || val == StdMod.FOOTER;    
        },

        /**
         * Updates the rendered UI, to resize the provided section so that the standard module fills out 
         * the specified widget height. Note: This method does not check whether or not a height is set 
         * on the Widget.
         * 
         * @method _uiSetFillHeight
         * @protected
         * @param {String} fillSection A valid section specifier - one of WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER
         */
        _uiSetFillHeight : function(fillSection) {
            var fillNode = this.getStdModNode(fillSection);
            var currNode = this._currFillNode;

            if (currNode && fillNode !== currNode){
                currNode.setStyle(HEIGHT, EMPTY);
            }

            if (fillNode) {
                this._currFillNode = fillNode;
            }

            this._fillHeight();
        },

        /**
         * Updates the rendered UI, to resize the current section specified by the fillHeight attribute, so
         * that the standard module fills out the Widget height. If a height has not been set on Widget,
         * the section is not resized (height is set to "auto").
         * 
         * @method _fillHeight
         * @private
         */
        _fillHeight : function() {
            if (this.get(FILL_HEIGHT)) {
                var height = this.get(HEIGHT);
                if (height != EMPTY && height != AUTO) {
                    this.fillHeight(this._currFillNode);    
                }
            }
        },

        /**
         * Updates the rendered UI, adding the provided content (either an HTML string, or node reference),
         * to the specified section. The content is either added before, after or replaces existing content
         * in the section, based on the value of the <code>where</code> argument.
         * 
         * @method _uiSetStdMod
         * @protected
         * 
         * @param {String} section The section to be updated. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER. 
         * @param {String | Node} content The new content (either as an HTML string, or Node reference) to add to the section
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace existing content in the section.
         */
        _uiSetStdMod : function(section, content, where) {
            // Using isValue, so that "" is valid content 
            if (L.isValue(content)) {
                var node = this.getStdModNode(section) || this._renderStdMod(section);

                this._addStdModContent(node, content, where);

                this.set(section + CONTENT_SUFFIX, this._getStdModContent(section), {src:UI});
            } else {
                this._eraseStdMod(section);
            }
            this.fire(ContentUpdate);
        },

        /**
         * Creates the DOM node for the given section, and inserts it into the correct location in the contentBox.
         *
         * @method _renderStdMod
         * @protected
         * @param {String} section The section to create/render. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} A reference to the added section node
         */
        _renderStdMod : function(section) {

            var contentBox = this.get(CONTENT_BOX),
                sectionNode = this._findStdModSection(section);

            if (!sectionNode) {
                sectionNode = this._getStdModTemplate(section);
            }

            this._insertStdModSection(contentBox, section, sectionNode);

            this[section + NODE_SUFFIX] = sectionNode;
            return this[section + NODE_SUFFIX];
        },

        /**
         * Removes the DOM node for the given section.
         *
         * @method _eraseStdMod
         * @protected
         * @param {String} section The section to remove. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         */
        _eraseStdMod : function(section) {
            var sectionNode = this.getStdModNode(section);
            if (sectionNode) {
                sectionNode.remove(true);
                delete this[section + NODE_SUFFIX];
            }
        },

        /**
         * Helper method to insert the Node for the given section into the correct location in the contentBox.
         *
         * @method _insertStdModSection
         * @private
         * @param {Node} contentBox A reference to the Widgets content box.
         * @param {String} section The section to create/render. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @param {Node} sectionNode The Node for the section.
         */
        _insertStdModSection : function(contentBox, section, sectionNode) {
            var fc = contentBox.get(FIRST_CHILD);

            if (section === STD_FOOTER || !fc) {
                contentBox.appendChild(sectionNode);
            } else {
                if (section === STD_HEADER) {
                    contentBox.insertBefore(sectionNode, fc);
                } else {
                    var footer = this[STD_FOOTER + NODE_SUFFIX];
                    if (footer) {
                        contentBox.insertBefore(sectionNode, footer);
                    } else {
                        contentBox.appendChild(sectionNode);
                    }
                }
            }
        },

        /**
         * Gets a new Node reference for the given standard module section, by cloning
         * the stored template node.
         *
         * @method _getStdModTemplate
         * @protected
         * @param {String} section The section to create a new node for. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The new Node instance for the section
         */
        _getStdModTemplate : function(section) {
            return Node.create(StdMod.TEMPLATES[section], this._stdModNode.get(OWNER_DOCUMENT));
        },

        /**
         * Helper method to add content to a StdMod section node.
         * The content is added either before, after or replaces the existing node content 
         * based on the value of the <code>where</code> argument.
         * 
         * @method _addStdModContent
         * @private
         * 
         * @param {Node} node The section Node to be updated.
         * @param {Node|NodeList|String} children The new content Node, NodeList or String to be added to section Node provided.
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace existing content in the Node.
         */
        _addStdModContent : function(node, children, where) {

            // StdMod where to Node where
            switch (where) {
                case StdMod.BEFORE:  // 0 is before fistChild
                    where = 0;
                    break;
                case StdMod.AFTER:   // undefined is appendChild
                    where = undefined;
                    break;
                default:            // replace is replace, not specified is replace
                    where = StdMod.REPLACE; 
            }

            node.insert(children, where);
        },

        /**
         * Helper method to obtain the precise height of the node provided, including padding and border.
         * The height could be a sub-pixel value for certain browsers, such as Firefox 3.
         *
         * @method _getPreciseHeight
         * @private
         * @param {Node} node The node for which the precise height is required.
         * @return {Number} The height of the Node including borders and padding, possibly a float.
         */
        _getPreciseHeight : function(node) {
            var height = (node) ? node.get(OFFSET_HEIGHT) : 0,
                getBCR = "getBoundingClientRect";

            if (node && node.hasMethod(getBCR)) {
                var preciseRegion = node.invoke(getBCR);
                if (preciseRegion) {
                    height = preciseRegion.bottom - preciseRegion.top;
                }
            }

            return height;
        },

        /**
         * Helper method to to find the rendered node for the given section,
         * if it exists.
         * 
         * @method _findStdModSection
         * @private
         * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The rendered node for the given section, or null if not found.
         */
        _findStdModSection: function(section) {
            return this.get(CONTENT_BOX).one("> ." + StdMod.SECTION_CLASS_NAMES[section]);
        },

        /**
         * Utility method, used by WidgetStdMods HTML_PARSER implementation
         * to extract data for each section from markup.
         *
         * @method _parseStdModHTML
         * @private
         * @param {String} section
         * @return {String} Inner HTML string with the contents of the section
         */
        _parseStdModHTML : function(section) {

            var node = this._findStdModSection(section);

            if (node) {
                if (!this._stdModParsed) {
                    this._stdModParsed = {};
                    Y.before(this._applyStdModParsedConfig, this, APPLY_PARSED_CONFIG);
                }
                this._stdModParsed[section + CONTENT_SUFFIX] = 1;

                return node.get("innerHTML");
            }

            return null;
        },

        /**
         * This method is injected before the _applyParsedConfig step in 
         * the application of HTML_PARSER, and sets up the state to 
         * identify whether or not we should remove the current DOM content
         * or not, based on whether or not the current content attribute value
         * was extracted from the DOM, or provided by the user configuration
         * 
         * @method _applyStdModParsedConfig
         * @private
         */
        _applyStdModParsedConfig : function(node, cfg, parsedCfg) {
            var parsed = this._stdModParsed; 
            if (parsed) {
                parsed[HEADER_CONTENT] = !(HEADER_CONTENT in cfg) && (HEADER_CONTENT in parsed);
                parsed[BODY_CONTENT] = !(BODY_CONTENT in cfg) && (BODY_CONTENT in parsed);
                parsed[FOOTER_CONTENT] = !(FOOTER_CONTENT in cfg) && (FOOTER_CONTENT in parsed);
            }
        },

        /**
         * Retrieves the child nodes (content) of a standard module section
         * 
         * @method _getStdModContent
         * @private
         * @param {String} section The standard module section whose child nodes are to be retrieved. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The child node collection of the standard module section.
         */
        _getStdModContent : function(section) {
            return (this[section + NODE_SUFFIX]) ? this[section + NODE_SUFFIX].get(CHILD_NODES) : null;
        },

        /**
         * Updates the body section of the standard module with the content provided (either an HTML string, or node reference).
         * <p>
         * This method can be used instead of the corresponding section content attribute if you'd like to retain the current content of the section,
         * and insert content before or after it, by specifying the <code>where</code> argument.
         * </p>
         * @method setStdModContent
         * @param {String} section The standard module section whose content is to be updated. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @param {String | Node} content The content to be added, either an HTML string or a Node reference.
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace existing content in the section.
         */
        setStdModContent : function(section, content, where) {
            this.set(section + CONTENT_SUFFIX, content, {stdModPosition:where});
        },

        /**
         * Returns the node reference for the given section. Note: The DOM is not queried for the node reference. The reference
         * stored by the widget instance is returned if set.
         * 
         * @method getStdModNode
         * @param {String} section The section whose node reference is required. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The node reference for the section, or null if not set.
         */
        getStdModNode : function(section) {
            return this[section + NODE_SUFFIX] || null;
        },

        /**
         * Sets the height on the provided header, body or footer element to 
         * fill out the height of the Widget. It determines the height of the 
         * widgets bounding box, based on it's configured height value, and 
         * sets the height of the provided section to fill out any 
         * space remaining after the other standard module section heights 
         * have been accounted for.
         * 
         * <p><strong>NOTE:</strong> This method is not designed to work if an explicit 
         * height has not been set on the Widget, since for an "auto" height Widget, 
         * the heights of the header/body/footer will drive the height of the Widget.</p>
         *
         * @method fillHeight
         * @param {Node} node The node which should be resized to fill out the height
         * of the Widget bounding box. Should be a standard module section node which belongs
         * to the widget.
         */
        fillHeight : function(node) {
            if (node) {
                var contentBox = this.get(CONTENT_BOX),
                    stdModNodes = [this.headerNode, this.bodyNode, this.footerNode],
                    stdModNode,
                    cbContentHeight,
                    filled = 0,
                    remaining = 0,

                    validNode = false;

                for (var i = 0, l = stdModNodes.length; i < l; i++) {
                    stdModNode = stdModNodes[i];
                    if (stdModNode) {
                        if (stdModNode !== node) {
                            filled += this._getPreciseHeight(stdModNode);
                        } else {
                            validNode = true;
                        }
                    }
                }

                if (validNode) {
                    if (UA.ie || UA.opera) {
                        // Need to set height to 0, to allow height to be reduced
                        node.set(OFFSET_HEIGHT, 0);
                    }

                    cbContentHeight = contentBox.get(OFFSET_HEIGHT) -
                            parseInt(contentBox.getComputedStyle("paddingTop"), 10) - 
                            parseInt(contentBox.getComputedStyle("paddingBottom"), 10) - 
                            parseInt(contentBox.getComputedStyle("borderBottomWidth"), 10) - 
                            parseInt(contentBox.getComputedStyle("borderTopWidth"), 10);

                    if (L.isNumber(cbContentHeight)) {
                        remaining = cbContentHeight - filled;
                        if (remaining >= 0) {
                            node.set(OFFSET_HEIGHT, remaining);
                        }
                    }
                }
            }
        }
    };

    Y.WidgetStdMod = StdMod;


}, '3.3.0' ,{requires:['base-build', 'widget']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('widget-position-constrain', function(Y) {

/**
 * Provides constrained xy positioning support for Widgets, through an extension.
 *
 * It builds on top of the widget-position module, to provide constrained positioning support.
 *
 * @module widget-position-constrain
 */
var CONSTRAIN = "constrain",
    CONSTRAIN_XYCHANGE = "constrain|xyChange",
    CONSTRAIN_CHANGE = "constrainChange",

    PREVENT_OVERLAP = "preventOverlap",
    ALIGN = "align",
    
    EMPTY_STR = "",

    BINDUI = "bindUI",

    XY = "xy",
    X_COORD = "x",
    Y_COORD = "y",

    Node = Y.Node,

    VIEWPORT_REGION = "viewportRegion",
    REGION = "region",

    PREVENT_OVERLAP_MAP;

/**
 * A widget extension, which can be used to add constrained xy positioning support to the base Widget class,
 * through the <a href="Base.html#method_build">Base.build</a> method. This extension requires that 
 * the WidgetPosition extension be added to the Widget (before WidgetPositionConstrain, if part of the same 
 * extension list passed to Base.build).
 *
 * @class WidgetPositionConstrain
 * @param {Object} User configuration object
 */
function PositionConstrain(config) {
    if (!this._posNode) {
        Y.error("WidgetPosition needs to be added to the Widget, before WidgetPositionConstrain is added"); 
    }
    Y.after(this._bindUIPosConstrained, this, BINDUI);
}

/**
 * Static property used to define the default attribute 
 * configuration introduced by WidgetPositionConstrain.
 *
 * @property WidgetPositionConstrain.ATTRS
 * @type Object
 * @static
 */
PositionConstrain.ATTRS = {

    /**
     * @attribute constrain
     * @type boolean | Node
     * @default null
     * @description The node to constrain the widget's bounding box to, when setting xy. Can also be
     * set to true, to constrain to the viewport.
     */
    constrain : {
        value: null,
        setter: "_setConstrain"
    },

    /**
     * @attribute preventOverlap
     * @type boolean
     * @description If set to true, and WidgetPositionAlign is also added to the Widget, 
     * constrained positioning will attempt to prevent the widget's bounding box from overlapping 
     * the element to which it has been aligned, by flipping the orientation of the alignment
     * for corner based alignments  
     */
    preventOverlap : {
        value:false
    }
};

/**
 * @property WidgetPositionConstrain._PREVENT_OVERLAP
 * @static
 * @protected
 * @type Object
 * @description The set of positions for which to prevent
 * overlap.
 */
PREVENT_OVERLAP_MAP = PositionConstrain._PREVENT_OVERLAP = {
    x: {
        "tltr": 1,
        "blbr": 1,
        "brbl": 1,
        "trtl": 1
    },
    y : {
        "trbr": 1,
        "tlbl": 1,
        "bltl": 1,
        "brtr": 1
    }
};

PositionConstrain.prototype = {

    /**
     * Calculates the constrained positions for the XY positions provided, using
     * the provided node argument is passed in. If no node value is passed in, the value of 
     * the "constrain" attribute is used.
     * 
     * @method getConstrainedXY
     * @param {Array} xy The xy values to constrain
     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport
     * @return {Array} The constrained xy values
     */
    getConstrainedXY : function(xy, node) {
        node = node || this.get(CONSTRAIN);

        var constrainingRegion = this._getRegion((node === true) ? null : node),
            nodeRegion = this._posNode.get(REGION);

        return [
            this._constrain(xy[0], X_COORD, nodeRegion, constrainingRegion),
            this._constrain(xy[1], Y_COORD, nodeRegion, constrainingRegion)
        ];
    },

    /**
     * Constrains the widget's bounding box to a node (or the viewport). If xy or node are not 
     * passed in, the current position and the value of "constrain" will be used respectively.
     * 
     * The widget's position will be changed to the constrained position.
     * 
     * @param {Array} xy Optional. The xy values to constrain
     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport
     */
    constrain : function(xy, node) {
        var currentXY, 
            constrainedXY,
            constraint = node || this.get(CONSTRAIN);

        if (constraint) {
            currentXY = xy || this.get(XY);
            constrainedXY = this.getConstrainedXY(currentXY, constraint);

            if (constrainedXY[0] !== currentXY[0] || constrainedXY[1] !== currentXY[1]) {
                this.set(XY, constrainedXY, { constrained:true });
            }
        }
    },

    /**
     * The setter implementation for the "constrain" attribute.
     *
     * @method _setConstrain
     * @protected
     * @param {Node | boolean} val The attribute value 
     */
    _setConstrain : function(val) {
        return (val === true) ? val : Node.one(val);
    },

    /**
     * The method which performs the actual constrain calculations for a given axis ("x" or "y") based
     * on the regions provided.
     * 
     * @method _constrain
     * @protected
     * 
     * @param {Number} val The value to constrain
     * @param {String} axis The axis to use for constrainment
     * @param {Region} nodeRegion The region of the node to constrain
     * @param {Region} constrainingRegion The region of the node (or viewport) to constrain to
     * 
     * @return {Number} The constrained value
     */
    _constrain: function(val, axis, nodeRegion, constrainingRegion) {
        if (constrainingRegion) {

            if (this.get(PREVENT_OVERLAP)) {
                val = this._preventOverlap(val, axis, nodeRegion, constrainingRegion);
            }

            var x = (axis == X_COORD),

                regionSize    = (x) ? constrainingRegion.width : constrainingRegion.height,
                nodeSize      = (x) ? nodeRegion.width : nodeRegion.height,
                minConstraint = (x) ? constrainingRegion.left : constrainingRegion.top,
                maxConstraint = (x) ? constrainingRegion.right - nodeSize : constrainingRegion.bottom - nodeSize;

            if (val < minConstraint || val > maxConstraint) {
                if (nodeSize < regionSize) {
                    if (val < minConstraint) {
                        val = minConstraint;
                    } else if (val > maxConstraint) {
                        val = maxConstraint;
                    }
                } else {
                    val = minConstraint;
                }
            }
        }

        return val;
    },

    /**
     * The method which performs the preventOverlap calculations for a given axis ("x" or "y") based
     * on the value and regions provided.
     * 
     * @method _preventOverlap
     * @protected
     *
     * @param {Number} val The value being constrain
     * @param {String} axis The axis to being constrained
     * @param {Region} nodeRegion The region of the node being constrained
     * @param {Region} constrainingRegion The region of the node (or viewport) we need to constrain to
     * 
     * @return {Number} The constrained value
     */
    _preventOverlap : function(val, axis, nodeRegion, constrainingRegion) {

        var align = this.get(ALIGN),
            x = (axis === X_COORD),
            nodeSize,
            alignRegion,
            nearEdge,
            farEdge,
            spaceOnNearSide, 
            spaceOnFarSide;

        if (align && align.points && PREVENT_OVERLAP_MAP[axis][align.points.join(EMPTY_STR)]) {

            alignRegion = this._getRegion(align.node);

            if (alignRegion) {
                nodeSize        = (x) ? nodeRegion.width : nodeRegion.height;
                nearEdge        = (x) ? alignRegion.left : alignRegion.top;
                farEdge         = (x) ? alignRegion.right : alignRegion.bottom;
                spaceOnNearSide = (x) ? alignRegion.left - constrainingRegion.left : alignRegion.top - constrainingRegion.top;
                spaceOnFarSide  = (x) ? constrainingRegion.right - alignRegion.right : constrainingRegion.bottom - alignRegion.bottom;
            }
 
            if (val > nearEdge) {
                if (spaceOnFarSide < nodeSize && spaceOnNearSide > nodeSize) {
                    val = nearEdge - nodeSize;
                }
            } else {
                if (spaceOnNearSide < nodeSize && spaceOnFarSide > nodeSize) {
                    val = farEdge;
                }
            }
        }

        return val;
    },

    /**
     * Binds event listeners responsible for updating the UI state in response to 
     * Widget constrained positioning related state changes.
     * <p>
     * This method is invoked after bindUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     *
     * @method _bindUIPosConstrained
     * @protected
     */
    _bindUIPosConstrained : function() {
        this.after(CONSTRAIN_CHANGE, this._afterConstrainChange);
        this._enableConstraints(this.get(CONSTRAIN));
    },

    /**
     * After change listener for the "constrain" attribute, responsible
     * for updating the UI, in response to attribute changes.
     *
     * @method _afterConstrainChange
     * @protected
     * @param {EventFacade} e The event facade
     */
    _afterConstrainChange : function(e) {
        this._enableConstraints(e.newVal);
    },

    /**
     * Updates the UI if enabling constraints, and sets up the xyChange event listeners
     * to constrain whenever the widget is moved. Disabling constraints removes the listeners.
     * 
     * @method enable or disable constraints listeners
     * @private
     * @param {boolean} enable Enable or disable constraints 
     */
    _enableConstraints : function(enable) {
        if (enable) {
            this.constrain();
            this._cxyHandle = this._cxyHandle || this.on(CONSTRAIN_XYCHANGE, this._constrainOnXYChange);
        } else if (this._cxyHandle) {
            this._cxyHandle.detach();
            this._cxyHandle = null;    
        }
    },

    /**
     * The on change listener for the "xy" attribute. Modifies the event facade's
     * newVal property with the constrained XY value.
     *
     * @method _constrainOnXYChange
     * @protected
     * @param {EventFacade} e The event facade for the attribute change
     */
    _constrainOnXYChange : function(e) {
        if (!e.constrained) {
            e.newVal = this.getConstrainedXY(e.newVal);
        }
    },

    /**
     * Utility method to normalize region retrieval from a node instance, 
     * or the viewport, if no node is provided. 
     * 
     * @method _getRegion
     * @private
     * @param {Node} node Optional.
     */
    _getRegion : function(node) {
        var region;
        if (!node) {
            region = this._posNode.get(VIEWPORT_REGION);
        } else {
            node = Node.one(node);
            if (node) {
                region = node.get(REGION);
            }
        }
        return region;
    }
};

Y.WidgetPositionConstrain = PositionConstrain;


}, '3.3.0' ,{requires:['widget-position']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('overlay', function(Y) {

/**
 * Provides a basic Overlay widget, with Standard Module content support. The Overlay widget
 * provides Page XY positioning support, alignment and centering support along with basic 
 * stackable support (z-index and shimming).
 *
 * @module overlay
 */

/**
 * A basic Overlay Widget, which can be positioned based on Page XY co-ordinates and is stackable (z-index support).
 * It also provides alignment and centering support and uses a standard module format for it's content, with header,
 * body and footer section support.
 *
 * @class Overlay
 * @constructor
 * @extends Widget
 * @uses WidgetStdMod
 * @uses WidgetPosition
 * @uses WidgetStack
 * @uses WidgetPositionAlign
 * @uses WidgetPositionConstrain
 * @param {Object} object The user configuration for the instance.
 */
Y.Overlay = Y.Base.create("overlay", Y.Widget, [Y.WidgetStdMod, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain]);


}, '3.3.0' ,{requires:['widget', 'widget-stdmod', 'widget-position', 'widget-stack', 'widget-position-align', 'widget-position-constrain']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('dd-ddm-base', function(Y) {


    /**
     * Provides the base Drag Drop Manger required for making a Node draggable.
     * @module dd
     * @submodule dd-ddm-base
     */     
     /**
     * Provides the base Drag Drop Manger required for making a Node draggable.
     * @class DDM
     * @extends Base
     * @constructor
     * @namespace DD
     */
    
    var DDMBase = function() {
        DDMBase.superclass.constructor.apply(this, arguments);
    };

    DDMBase.NAME = 'ddm';

    DDMBase.ATTRS = {
        /**
        * @attribute dragCursor
        * @description The cursor to apply when dragging, if shimmed the shim will get the cursor.
        * @type String
        */
        dragCursor: {
            value: 'move'
        },
        /**
        * @attribute clickPixelThresh
        * @description The number of pixels to move to start a drag operation, default is 3.
        * @type Number
        */
        clickPixelThresh: {
            value: 3
        },
        /**
        * @attribute clickTimeThresh
        * @description The number of milliseconds a mousedown has to pass to start a drag operation, default is 1000.
        * @type Number
        */        
        clickTimeThresh: {
            value: 1000
        },
        /**
        * @attribute throttleTime
        * @description The number of milliseconds to throttle the mousemove event. Default: 150
        * @type Number
        */        
        throttleTime: {
            //value: 150
            value: -1
        },
        /**
        * @attribute dragMode
        * @description This attribute only works if the dd-drop module is active. It will set the dragMode (point, intersect, strict) of all future Drag instances. 
        * @type String
        */        
        dragMode: {
            value: 'point',
            setter: function(mode) {
                this._setDragMode(mode);
                return mode;
            }           
        }

    };

    Y.extend(DDMBase, Y.Base, {
        _createPG: function() {},
        /**
        * @property _active
        * @description flag set when we activate our first drag, so DDM can start listening for events.
        * @type {Boolean}
        */
        _active: null,
        /**
        * @private
        * @method _setDragMode
        * @description Handler for dragMode attribute setter.
        * @param String/Number The Number value or the String for the DragMode to default all future drag instances to.
        * @return Number The Mode to be set
        */
        _setDragMode: function(mode) {
            if (mode === null) {
                mode = Y.DD.DDM.get('dragMode');
            }
            switch (mode) {
                case 1:
                case 'intersect':
                    return 1;
                case 2:
                case 'strict':
                    return 2;
                case 0:
                case 'point':
                    return 0;
            }
            return 0;       
        },
        /**
        * @property CSS_PREFIX
        * @description The PREFIX to attach to all DD CSS class names
        * @type {String}
        */
        CSS_PREFIX: Y.ClassNameManager.getClassName('dd'),
        _activateTargets: function() {},        
        /**
        * @private
        * @property _drags
        * @description Holder for all registered drag elements.
        * @type {Array}
        */
        _drags: [],
        /**
        * @property activeDrag
        * @description A reference to the currently active draggable object.
        * @type {Drag}
        */
        activeDrag: false,
        /**
        * @private
        * @method _regDrag
        * @description Adds a reference to the drag object to the DDM._drags array, called in the constructor of Drag.
        * @param {Drag} d The Drag object
        */
        _regDrag: function(d) {
            if (this.getDrag(d.get('node'))) {
                return false;
            }
            
            if (!this._active) {
                this._setupListeners();
            }
            this._drags.push(d);
            return true;
        },
        /**
        * @private
        * @method _unregDrag
        * @description Remove this drag object from the DDM._drags array.
        * @param {Drag} d The drag object.
        */
        _unregDrag: function(d) {
            var tmp = [];
            Y.each(this._drags, function(n, i) {
                if (n !== d) {
                    tmp[tmp.length] = n;
                }
            });
            this._drags = tmp;
        },
        /**
        * @private
        * @method _setupListeners
        * @description Add the document listeners.
        */
        _setupListeners: function() {
            this._createPG();
            this._active = true;

            var doc = Y.one(Y.config.doc);
            doc.on('mousemove', Y.throttle(Y.bind(this._move, this), this.get('throttleTime')));
            doc.on('mouseup', Y.bind(this._end, this));
        },
        /**
        * @private
        * @method _start
        * @description Internal method used by Drag to signal the start of a drag operation
        */
        _start: function() {
            this.fire('ddm:start');
            this._startDrag();
        },
        /**
        * @private
        * @method _startDrag
        * @description Factory method to be overwritten by other DDM's
        * @param {Number} x The x position of the drag element
        * @param {Number} y The y position of the drag element
        * @param {Number} w The width of the drag element
        * @param {Number} h The height of the drag element
        */
        _startDrag: function() {},
        /**
        * @private
        * @method _endDrag
        * @description Factory method to be overwritten by other DDM's
        */
        _endDrag: function() {},
        _dropMove: function() {},
        /**
        * @private
        * @method _end
        * @description Internal method used by Drag to signal the end of a drag operation
        */
        _end: function() {
            if (this.activeDrag) {
                this._endDrag();
                this.fire('ddm:end');
                this.activeDrag.end.call(this.activeDrag);
                this.activeDrag = null;
            }
        },
        /**
        * @method stopDrag
        * @description Method will forcefully stop a drag operation. For example calling this from inside an ESC keypress handler will stop this drag.
        * @return {Self}
        * @chainable
        */       
        stopDrag: function() {
            if (this.activeDrag) {
                this._end();
            }
            return this;
        },
        /**
        * @private
        * @method _move
        * @description Internal listener for the mousemove DOM event to pass to the Drag's move method.
        * @param {Event.Facade} ev The Dom mousemove Event
        */
        _move: function(ev) {
            if (this.activeDrag) {
                this.activeDrag._move.call(this.activeDrag, ev);
                this._dropMove();
            }
        },
        /**
        * //TODO Private, rename??...
        * @private
        * @method cssSizestoObject
        * @description Helper method to use to set the gutter from the attribute setter.
        * @param {String} gutter CSS style string for gutter: '5 0' (sets top and bottom to 5px, left and right to 0px), '1 2 3 4' (top 1px, right 2px, bottom 3px, left 4px)
        * @return {Object} The gutter Object Literal.
        */
        cssSizestoObject: function(gutter) {
            var x = gutter.split(' ');
                
            switch (x.length) {
                case 1: x[1] = x[2] = x[3] = x[0]; break;
                case 2: x[2] = x[0]; x[3] = x[1]; break;
                case 3: x[3] = x[1]; break;
            }

            return {
                top   : parseInt(x[0],10),
                right : parseInt(x[1],10),
                bottom: parseInt(x[2],10),
                left  : parseInt(x[3],10)
            };
        },
        /**
        * @method getDrag
        * @description Get a valid Drag instance back from a Node or a selector string, false otherwise
        * @param {String/Object} node The Node instance or Selector string to check for a valid Drag Object
        * @return {Object}
        */
        getDrag: function(node) {
            var drag = false,
                n = Y.one(node);
            if (n instanceof Y.Node) {
                Y.each(this._drags, function(v, k) {
                    if (n.compareTo(v.get('node'))) {
                        drag = v;
                    }
                });
            }
            return drag;
        },
        /**
        * @method swapPosition
        * @description Swap the position of 2 nodes based on their CSS positioning.
        * @param {Node} n1 The first node to swap
        * @param {Node} n2 The first node to swap
        * @return {Node}
        */
        swapPosition: function(n1, n2) {
            n1 = Y.DD.DDM.getNode(n1);
            n2 = Y.DD.DDM.getNode(n2);
            var xy1 = n1.getXY(),
                xy2 = n2.getXY();

            n1.setXY(xy2);
            n2.setXY(xy1);
            return n1;
        },
        /**
        * @method getNode
        * @description Return a node instance from the given node, selector string or Y.Base extended object.
        * @param {Node/Object/String} n The node to resolve.
        * @return {Node}
        */
        getNode: function(n) {
            if (n && n.get) {
                if (Y.Widget && (n instanceof Y.Widget)) {
                    n = n.get('boundingBox');
                } else {
                    n = n.get('node');
                }
            } else {
                n = Y.one(n);
            }
            return n;
        },
        /**
        * @method swapNode
        * @description Swap the position of 2 nodes based on their DOM location.
        * @param {Node} n1 The first node to swap
        * @param {Node} n2 The first node to swap
        * @return {Node}
        */
        swapNode: function(n1, n2) {
            n1 = Y.DD.DDM.getNode(n1);
            n2 = Y.DD.DDM.getNode(n2);
            var p = n2.get('parentNode'),
                s = n2.get('nextSibling');

            if (s == n1) {
                p.insertBefore(n1, n2);
            } else if (n2 == n1.get('nextSibling')) {
                p.insertBefore(n2, n1);
            } else {
                n1.get('parentNode').replaceChild(n2, n1);
                p.insertBefore(n1, s);
            }
            return n1;
        }
    });

    Y.namespace('DD');
    Y.DD.DDM = new DDMBase();

    /**
    * @event ddm:start
    * @description Fires from the DDM before all drag events fire.
    * @type {Event.Custom}
    */
    /**
    * @event ddm:end
    * @description Fires from the DDM after the DDM finishes, before the drag end events.
    * @type {Event.Custom}
    */




}, '3.3.0' ,{requires:['node', 'base', 'yui-throttle', 'classnamemanager'], skinnable:false});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('dd-drag', function(Y) {


    /**
     * Provides the ability to drag a Node.
     * @module dd
     * @submodule dd-drag
     */     
    /**
     * Provides the ability to drag a Node.
     * @class Drag
     * @extends Base
     * @constructor
     * @namespace DD
     */

    var DDM = Y.DD.DDM,
        NODE = 'node',
        DRAGGING = 'dragging',
        DRAG_NODE = 'dragNode',
        OFFSET_HEIGHT = 'offsetHeight',
        OFFSET_WIDTH = 'offsetWidth',        
        /**
        * @event drag:mouseup
        * @description Handles the mouseup DOM event, does nothing internally just fires.
        * @bubbles DDM
        * @type {Event.Custom}
        */
        /**
        * @event drag:mouseDown
        * @description Handles the mousedown DOM event, checks to see if you have a valid handle then starts the drag timers.
        * @preventable _defMouseDownFn
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl><dt>ev</dt><dd>The original mousedown event.</dd></dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_MOUSE_DOWN = 'drag:mouseDown',
        /**
        * @event drag:afterMouseDown
        * @description Fires after the mousedown event has been cleared.
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl><dt>ev</dt><dd>The original mousedown event.</dd></dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_AFTER_MOUSE_DOWN = 'drag:afterMouseDown',
        /**
        * @event drag:removeHandle
        * @description Fires after a handle is removed.
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl><dt>handle</dt><dd>The handle that was removed.</dd></dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_REMOVE_HANDLE = 'drag:removeHandle',
        /**
        * @event drag:addHandle
        * @description Fires after a handle is added.
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl><dt>handle</dt><dd>The handle that was added.</dd></dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_ADD_HANDLE = 'drag:addHandle',
        /**
        * @event drag:removeInvalid
        * @description Fires after an invalid selector is removed.
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl><dt>handle</dt><dd>The handle that was removed.</dd></dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_REMOVE_INVALID = 'drag:removeInvalid',
        /**
        * @event drag:addInvalid
        * @description Fires after an invalid selector is added.
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl><dt>handle</dt><dd>The handle that was added.</dd></dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_ADD_INVALID = 'drag:addInvalid',
        /**
        * @event drag:start
        * @description Fires at the start of a drag operation.
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The original node position X.</dd>
        * <dt>pageY</dt><dd>The original node position Y.</dd>
        * <dt>startTime</dt><dd>The startTime of the event. getTime on the current Date object.</dd>
        * </dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_START = 'drag:start',
        /**
        * @event drag:end
        * @description Fires at the end of a drag operation.
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The current node position X.</dd>
        * <dt>pageY</dt><dd>The current node position Y.</dd>
        * <dt>startTime</dt><dd>The startTime of the event, from the start event.</dd>
        * <dt>endTime</dt><dd>The endTime of the event. getTime on the current Date object.</dd>
        * </dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_END = 'drag:end',
        /**
        * @event drag:drag
        * @description Fires every mousemove during a drag operation.
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The current node position X.</dd>
        * <dt>pageY</dt><dd>The current node position Y.</dd>
        * <dt>scroll</dt><dd>Should a scroll action occur.</dd>
        * <dt>info</dt><dd>Object hash containing calculated XY arrays: start, xy, delta, offset</dd>
        * </dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_DRAG = 'drag:drag',
        /**
        * @event drag:align
        * @preventable _defAlignFn
        * @description Fires when this node is aligned.
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The current node position X.</dd>
        * <dt>pageY</dt><dd>The current node position Y.</dd>
        * </dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        EV_ALIGN = 'drag:align',
        /**
        * @event drag:over
        * @description Fires when this node is over a Drop Target. (Fired from dd-drop)
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>
        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>
        * </dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        /**
        * @event drag:enter
        * @description Fires when this node enters a Drop Target. (Fired from dd-drop)
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>
        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>
        * </dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        /**
        * @event drag:exit
        * @description Fires when this node exits a Drop Target. (Fired from dd-drop)
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>
        * </dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        /**
        * @event drag:drophit
        * @description Fires when this node is dropped on a valid Drop Target. (Fired from dd-ddm-drop)
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The best guess on what was dropped on.</dd>
        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>
        * <dt>others</dt><dd>An array of all the other drop targets that was dropped on.</dd>
        * </dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
        /**
        * @event drag:dropmiss
        * @description Fires when this node is dropped on an invalid Drop Target. (Fired from dd-ddm-drop)
        * @param {Event.Facade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The current node position X.</dd>
        * <dt>pageY</dt><dd>The current node position Y.</dd>
        * </dl>
        * @bubbles DDM
        * @type {Event.Custom}
        */
    
    Drag = function(o) {
        this._lazyAddAttrs = false;
        Drag.superclass.constructor.apply(this, arguments);

        var valid = DDM._regDrag(this);
        if (!valid) {
            Y.error('Failed to register node, already in use: ' + o.node);
        }
    };

    Drag.NAME = 'drag';
    
    /**
    * This property defaults to "mousedown", but when drag-gestures is loaded, it is changed to "gesturemovestart"
    * @static
    * @property START_EVENT
    */
    Drag.START_EVENT = 'mousedown';

    Drag.ATTRS = {
        /**
        * @attribute node
        * @description Y.Node instance to use as the element to initiate a drag operation
        * @type Node
        */
        node: {
            setter: function(node) {
                var n = Y.one(node);
                if (!n) {
                    Y.error('DD.Drag: Invalid Node Given: ' + node);
                }
                return n;
            }
        },
        /**
        * @attribute dragNode
        * @description Y.Node instance to use as the draggable element, defaults to node
        * @type Node
        */
        dragNode: {
            setter: function(node) {
                var n = Y.one(node);
                if (!n) {
                    Y.error('DD.Drag: Invalid dragNode Given: ' + node);
                }
                return n;
            }
        },
        /**
        * @attribute offsetNode
        * @description Offset the drag element by the difference in cursor position: default true
        * @type Boolean
        */
        offsetNode: {
            value: true
        },
        /**
        * @attribute startCentered
        * @description Center the dragNode to the mouse position on drag:start: default false
        * @type Boolean
        */
        startCentered: {
            value: false
        },
        /**
        * @attribute clickPixelThresh
        * @description The number of pixels to move to start a drag operation, default is 3.
        * @type Number
        */
        clickPixelThresh: {
            value: DDM.get('clickPixelThresh')
        },
        /**
        * @attribute clickTimeThresh
        * @description The number of milliseconds a mousedown has to pass to start a drag operation, default is 1000.
        * @type Number
        */
        clickTimeThresh: {
            value: DDM.get('clickTimeThresh')
        },
        /**
        * @attribute lock
        * @description Set to lock this drag element so that it can't be dragged: default false.
        * @type Boolean
        */
        lock: {
            value: false,
            setter: function(lock) {
                if (lock) {
                    this.get(NODE).addClass(DDM.CSS_PREFIX + '-locked');
                } else {
                    this.get(NODE).removeClass(DDM.CSS_PREFIX + '-locked');
                }
                return lock;
            }
        },
        /**
        * @attribute data
        * @description A payload holder to store arbitrary data about this drag object, can be used to store any value.
        * @type Mixed
        */
        data: {
            value: false
        },
        /**
        * @attribute move
        * @description If this is false, the drag element will not move with the cursor: default true. Can be used to "resize" the element.
        * @type Boolean
        */
        move: {
            value: true
        },
        /**
        * @attribute useShim
        * @description Use the protective shim on all drag operations: default true. Only works with dd-ddm, not dd-ddm-base.
        * @type Boolean
        */
        useShim: {
            value: true
        },
        /**
        * @attribute activeHandle
        * @description This config option is set by Drag to inform you of which handle fired the drag event (in the case that there are several handles): default false.
        * @type Node
        */
        activeHandle: {
            value: false
        },
        /**
        * @attribute primaryButtonOnly
        * @description By default a drag operation will only begin if the mousedown occurred with the primary mouse button. Setting this to false will allow for all mousedown events to trigger a drag.
        * @type Boolean
        */
        primaryButtonOnly: {
            value: true
        },
        /**
        * @attribute dragging
        * @description This attribute is not meant to be used by the implementor, it is meant to be used as an Event tracker so you can listen for it to change.
        * @type Boolean
        */
        dragging: {
            value: false
        },
        parent: {
            value: false
        },
        /**
        * @attribute target
        * @description This attribute only works if the dd-drop module has been loaded. It will make this node a drop target as well as draggable.
        * @type Boolean
        */
        target: {
            value: false,
            setter: function(config) {
                this._handleTarget(config);
                return config;
            }
        },
        /**
        * @attribute dragMode
        * @description This attribute only works if the dd-drop module is active. It will set the dragMode (point, intersect, strict) of this Drag instance.
        * @type String
        */
        dragMode: {
            value: null,
            setter: function(mode) {
                return DDM._setDragMode(mode);
            }
        },
        /**
        * @attribute groups
        * @description Array of groups to add this drag into.
        * @type Array
        */
        groups: {
            value: ['default'],
            getter: function() {
                if (!this._groups) {
                    this._groups = {};
                }
                var ret = [];
                Y.each(this._groups, function(v, k) {
                    ret[ret.length] = k;
                });
                return ret;
            },
            setter: function(g) {
                this._groups = {};
                Y.each(g, function(v, k) {
                    this._groups[v] = true;
                }, this);
                return g;
            }
        },
        /**
        * @attribute handles
        * @description Array of valid handles to add. Adding something here will set all handles, even if previously added with addHandle
        * @type Array
        */
        handles: {
            value: null,
            setter: function(g) {
                if (g) {
                    this._handles = {};
                    Y.each(g, function(v, k) {
                        var key = v;
                        if (v instanceof Y.Node || v instanceof Y.NodeList) {
                            key = v._yuid;
                        }
                        this._handles[key] = v;
                    }, this);
                } else {
                    this._handles = null;
                }
                return g;
            }
        },
        /**
        * @deprecated
        * @attribute bubbles
        * @description Controls the default bubble parent for this Drag instance. Default: Y.DD.DDM. Set to false to disable bubbling. Use bubbleTargets in config
        * @type Object
        */
        bubbles: {
            setter: function(t) {
                this.addTarget(t);
                return t;
            }
        },
        /**
        * @attribute haltDown
        * @description Should the mousedown event be halted. Default: true
        * @type Boolean
        */
        haltDown: {
            value: true
        }
    };

    Y.extend(Drag, Y.Base, {
        /**
        * @private
        * @property _bubbleTargets
        * @description The default bubbleTarget for this object. Default: Y.DD.DDM
        */
        _bubbleTargets: Y.DD.DDM,
        /**
        * @method addToGroup
        * @description Add this Drag instance to a group, this should be used for on-the-fly group additions.
        * @param {String} g The group to add this Drag Instance to.
        * @return {Self}
        * @chainable
        */
        addToGroup: function(g) {
            this._groups[g] = true;
            DDM._activateTargets();
            return this;
        },
        /**
        * @method removeFromGroup
        * @description Remove this Drag instance from a group, this should be used for on-the-fly group removals.
        * @param {String} g The group to remove this Drag Instance from.
        * @return {Self}
        * @chainable
        */
        removeFromGroup: function(g) {
            delete this._groups[g];
            DDM._activateTargets();
            return this;
        },
        /**
        * @property target
        * @description This will be a reference to the Drop instance associated with this drag if the target: true config attribute is set..
        * @type {Object}
        */
        target: null,
        /**
        * @private
        * @method _handleTarget
        * @description Attribute handler for the target config attribute.
        * @param {Boolean/Object}
        * @return {Boolean/Object}
        */
        _handleTarget: function(config) {
            if (Y.DD.Drop) {
                if (config === false) {
                    if (this.target) {
                        DDM._unregTarget(this.target);
                        this.target = null;
                    }
                    return false;
                } else {
                    if (!Y.Lang.isObject(config)) {
                        config = {};
                    }
                    config.bubbleTargets = ('bubbleTargets' in config) ? config.bubbleTargets : Y.Object.values(this._yuievt.targets);
                    config.node = this.get(NODE);
                    config.groups = config.groups || this.get('groups');
                    this.target = new Y.DD.Drop(config);
                }
            } else {
                return false;
            }
        },
        /**
        * @private
        * @property _groups
        * @description Storage Array for the groups this drag belongs to.
        * @type {Array}
        */
        _groups: null,
        /**
        * @private
        * @method _createEvents
        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.
        */
        _createEvents: function() {
            
            this.publish(EV_MOUSE_DOWN, {
                defaultFn: this._defMouseDownFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });
            
            this.publish(EV_ALIGN, {
                defaultFn: this._defAlignFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });
            
            this.publish(EV_DRAG, {
                defaultFn: this._defDragFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });
            
            this.publish(EV_END, {
                defaultFn: this._defEndFn,
                preventedFn: this._prevEndFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });
            
            var ev = [
                EV_AFTER_MOUSE_DOWN,
                EV_REMOVE_HANDLE,
                EV_ADD_HANDLE,
                EV_REMOVE_INVALID,
                EV_ADD_INVALID,
                EV_START,
                'drag:drophit',
                'drag:dropmiss',
                'drag:over',
                'drag:enter',
                'drag:exit'
            ];
            
            Y.each(ev, function(v, k) {
                this.publish(v, {
                    type: v,
                    emitFacade: true,
                    bubbles: true,
                    preventable: false,
                    queuable: false,
                    prefix: 'drag'
                });
            }, this);
        },
        /**
        * @private
        * @property _ev_md
        * @description A private reference to the mousedown DOM event
        * @type {Event.Facade}
        */
        _ev_md: null,
        /**
        * @private
        * @property _startTime
        * @description The getTime of the mousedown event. Not used, just here in case someone wants/needs to use it.
        * @type Date
        */
        _startTime: null,
        /**
        * @private
        * @property _endTime
        * @description The getTime of the mouseup event. Not used, just here in case someone wants/needs to use it.
        * @type Date
        */
        _endTime: null,
        /**
        * @private
        * @property _handles
        * @description A private hash of the valid drag handles
        * @type {Object}
        */
        _handles: null,
        /**
        * @private
        * @property _invalids
        * @description A private hash of the invalid selector strings
        * @type {Object}
        */
        _invalids: null,
        /**
        * @private
        * @property _invalidsDefault
        * @description A private hash of the default invalid selector strings: {'textarea': true, 'input': true, 'a': true, 'button': true, 'select': true}
        * @type {Object}
        */
        _invalidsDefault: {'textarea': true, 'input': true, 'a': true, 'button': true, 'select': true },
        /**
        * @private
        * @property _dragThreshMet
        * @description Private flag to see if the drag threshhold was met
        * @type {Boolean}
        */
        _dragThreshMet: null,
        /**
        * @private
        * @property _fromTimeout
        * @description Flag to determine if the drag operation came from a timeout
        * @type {Boolean}
        */
        _fromTimeout: null,
        /**
        * @private
        * @property _clickTimeout
        * @description Holder for the setTimeout call
        * @type {Boolean}
        */
        _clickTimeout: null,
        /**
        * @property deltaXY
        * @description The offset of the mouse position to the element's position
        * @type {Array}
        */
        deltaXY: null,
        /**
        * @property startXY
        * @description The initial mouse position
        * @type {Array}
        */
        startXY: null,
        /**
        * @property nodeXY
        * @description The initial element position
        * @type {Array}
        */
        nodeXY: null,
        /**
        * @property lastXY
        * @description The position of the element as it's moving (for offset calculations)
        * @type {Array}
        */
        lastXY: null,
        /**
        * @property actXY
        * @description The xy that the node will be set to. Changing this will alter the position as it's dragged.
        * @type {Array}
        */
        actXY: null,
        /**
        * @property realXY
        * @description The real xy position of the node.
        * @type {Array}
        */
        realXY: null,
        /**
        * @property mouseXY
        * @description The XY coords of the mousemove
        * @type {Array}
        */
        mouseXY: null,
        /**
        * @property region
        * @description A region object associated with this drag, used for checking regions while dragging.
        * @type Object
        */
        region: null,       
        /**
        * @private
        * @method _handleMouseUp
        * @description Handler for the mouseup DOM event
        * @param {Event.Facade}
        */
        _handleMouseUp: function(ev) {
            this.fire('drag:mouseup');
            this._fixIEMouseUp();
            if (DDM.activeDrag) {
                DDM._end();
            }
        },
        /** 
        * @private
        * @method _fixDragStart
        * @description The function we use as the ondragstart handler when we start a drag in Internet Explorer. This keeps IE from blowing up on images as drag handles.
        */
        _fixDragStart: function(e) {
            e.preventDefault();
        },
        /** 
        * @private
        * @method _ieSelectFix
        * @description The function we use as the onselectstart handler when we start a drag in Internet Explorer
        */
        _ieSelectFix: function() {
            return false;
        },
        /** 
        * @private
        * @property _ieSelectBack
        * @description We will hold a copy of the current "onselectstart" method on this property, and reset it after we are done using it.
        */
        _ieSelectBack: null,
        /**
        * @private
        * @method _fixIEMouseDown
        * @description This method copies the onselectstart listner on the document to the _ieSelectFix property
        */
        _fixIEMouseDown: function(e) {
            if (Y.UA.ie) {
                this._ieSelectBack = Y.config.doc.body.onselectstart;
                Y.config.doc.body.onselectstart = this._ieSelectFix;
            }           
        },
        /**
        * @private
        * @method _fixIEMouseUp
        * @description This method copies the _ieSelectFix property back to the onselectstart listner on the document.
        */
        _fixIEMouseUp: function() {
            if (Y.UA.ie) {
                Y.config.doc.body.onselectstart = this._ieSelectBack;
            }           
        },
        /**
        * @private
        * @method _handleMouseDownEvent
        * @description Handler for the mousedown DOM event
        * @param {Event.Facade}
        */
        _handleMouseDownEvent: function(ev) {
            this.fire(EV_MOUSE_DOWN, { ev: ev });
        },
        /**
        * @private
        * @method _defMouseDownFn
        * @description Handler for the mousedown DOM event
        * @param {Event.Facade}
        */
        _defMouseDownFn: function(e) {
            var ev = e.ev;

            this._dragThreshMet = false;
            this._ev_md = ev;
            
            if (this.get('primaryButtonOnly') && ev.button > 1) {
                return false;
            }
            if (this.validClick(ev)) {
                this._fixIEMouseDown(ev);
                if (this.get('haltDown')) {
                    ev.halt();
                } else {
                    ev.preventDefault();
                }
                
                this._setStartPosition([ev.pageX, ev.pageY]);

                DDM.activeDrag = this;
                
                this._clickTimeout = Y.later(this.get('clickTimeThresh'), this, this._timeoutCheck);
            }
            this.fire(EV_AFTER_MOUSE_DOWN, { ev: ev });
        },
        /**
        * @method validClick
        * @description Method first checks to see if we have handles, if so it validates the click against the handle. Then if it finds a valid handle, it checks it against the invalid handles list. Returns true if a good handle was used, false otherwise.
        * @param {Event.Facade}
        * @return {Boolean}
        */
        validClick: function(ev) {
            var r = false, n = false,
            tar = ev.target,
            hTest = null,
            els = null,
            nlist = null,
            set = false;
            if (this._handles) {
                Y.each(this._handles, function(i, n) {
                    if (i instanceof Y.Node || i instanceof Y.NodeList) {
                        if (!r) {
                            nlist = i;
                            if (nlist instanceof Y.Node) {
                                nlist = new Y.NodeList(i._node);
                            }
                            nlist.each(function(nl) {
                                if (nl.contains(tar)) {
                                    r = true;
                                }
                            });
                        }
                    } else if (Y.Lang.isString(n)) {
                        //Am I this or am I inside this
                        if (tar.test(n + ', ' + n + ' *') && !hTest) {
                            hTest = n;
                            r = true;
                        }
                    }
                });
            } else {
                n = this.get(NODE);
                if (n.contains(tar) || n.compareTo(tar)) {
                    r = true;
                }
            }
            if (r) {
                if (this._invalids) {
                    Y.each(this._invalids, function(i, n) {
                        if (Y.Lang.isString(n)) {
                            //Am I this or am I inside this
                            if (tar.test(n + ', ' + n + ' *')) {
                                r = false;
                            }
                        }
                    });
                }
            }
            if (r) {
                if (hTest) {
                    els = ev.currentTarget.all(hTest);
                    set = false;
                    els.each(function(n, i) {
                        if ((n.contains(tar) || n.compareTo(tar)) && !set) {
                            set = true;
                            this.set('activeHandle', n);
                        }
                    }, this);
                } else {
                    this.set('activeHandle', this.get(NODE));
                }
            }
            return r;
        },
        /**
        * @private
        * @method _setStartPosition
        * @description Sets the current position of the Element and calculates the offset
        * @param {Array} xy The XY coords to set the position to.
        */
        _setStartPosition: function(xy) {
            this.startXY = xy;
            
            this.nodeXY = this.lastXY = this.realXY = this.get(NODE).getXY();
            
            if (this.get('offsetNode')) {
                this.deltaXY = [(this.startXY[0] - this.nodeXY[0]), (this.startXY[1] - this.nodeXY[1])];
            } else {
                this.deltaXY = [0, 0];
            }
        },
        /**
        * @private
        * @method _timeoutCheck
        * @description The method passed to setTimeout to determine if the clickTimeThreshold was met.
        */
        _timeoutCheck: function() {
            if (!this.get('lock') && !this._dragThreshMet && this._ev_md) {
                this._fromTimeout = this._dragThreshMet = true;
                this.start();
                this._alignNode([this._ev_md.pageX, this._ev_md.pageY], true);
            }
        },
        /**
        * @method removeHandle
        * @description Remove a Selector added by addHandle
        * @param {String} str The selector for the handle to be removed. 
        * @return {Self}
        * @chainable
        */
        removeHandle: function(str) {
            var key = str;
            if (str instanceof Y.Node || str instanceof Y.NodeList) {
                key = str._yuid;
            }
            if (this._handles[key]) {
                delete this._handles[key];
                this.fire(EV_REMOVE_HANDLE, { handle: str });
            }
            return this;
        },
        /**
        * @method addHandle
        * @description Add a handle to a drag element. Drag only initiates when a mousedown happens on this element.
        * @param {String} str The selector to test for a valid handle. Must be a child of the element.
        * @return {Self}
        * @chainable
        */
        addHandle: function(str) {
            if (!this._handles) {
                this._handles = {};
            }
            var key = str;
            if (str instanceof Y.Node || str instanceof Y.NodeList) {
                key = str._yuid;
            }
            this._handles[key] = str;
            this.fire(EV_ADD_HANDLE, { handle: str });
            return this;
        },
        /**
        * @method removeInvalid
        * @description Remove an invalid handle added by addInvalid
        * @param {String} str The invalid handle to remove from the internal list.
        * @return {Self}
        * @chainable
        */
        removeInvalid: function(str) {
            if (this._invalids[str]) {
                this._invalids[str] = null;
                delete this._invalids[str];
                this.fire(EV_REMOVE_INVALID, { handle: str });
            }
            return this;
        },
        /**
        * @method addInvalid
        * @description Add a selector string to test the handle against. If the test passes the drag operation will not continue.
        * @param {String} str The selector to test against to determine if this is an invalid drag handle.
        * @return {Self}
        * @chainable
        */
        addInvalid: function(str) {
            if (Y.Lang.isString(str)) {
                this._invalids[str] = true;
                this.fire(EV_ADD_INVALID, { handle: str });
            }
            return this;
        },
        /**
        * @private
        * @method initializer
        * @description Internal init handler
        */
        initializer: function(cfg) {
            this.get(NODE).dd = this;

            if (!this.get(NODE).get('id')) {
                var id = Y.stamp(this.get(NODE));
                this.get(NODE).set('id', id);
            }

            this.actXY = [];
            
            this._invalids = Y.clone(this._invalidsDefault, true);

            this._createEvents();
            
            if (!this.get(DRAG_NODE)) {
                this.set(DRAG_NODE, this.get(NODE));
            }

            //Fix for #2528096
            //Don't prep the DD instance until all plugins are loaded.
            this.on('initializedChange', Y.bind(this._prep, this));

            //Shouldn't have to do this..
            this.set('groups', this.get('groups'));
        },
        /**
        * @private
        * @method _prep
        * @description Attach event listners and add classname
        */
        _prep: function() {
            this._dragThreshMet = false;
            var node = this.get(NODE);
            node.addClass(DDM.CSS_PREFIX + '-draggable');
            node.on(Drag.START_EVENT, Y.bind(this._handleMouseDownEvent, this));
            node.on('mouseup', Y.bind(this._handleMouseUp, this));
            node.on('dragstart', Y.bind(this._fixDragStart, this));
        },
        /**
        * @private
        * @method _unprep
        * @description Detach event listeners and remove classname
        */
        _unprep: function() {
            var node = this.get(NODE);
            node.removeClass(DDM.CSS_PREFIX + '-draggable');
            node.detachAll();
        },
        /**
        * @method start
        * @description Starts the drag operation
        * @return {Self}
        * @chainable
        */
        start: function() {
            if (!this.get('lock') && !this.get(DRAGGING)) {
                var node = this.get(NODE), ow, oh, xy;
                this._startTime = (new Date()).getTime();

                DDM._start();
                node.addClass(DDM.CSS_PREFIX + '-dragging');
                this.fire(EV_START, {
                    pageX: this.nodeXY[0],
                    pageY: this.nodeXY[1],
                    startTime: this._startTime
                });
                node = this.get(DRAG_NODE);
                xy = this.nodeXY;
                
                ow = node.get(OFFSET_WIDTH);
                oh = node.get(OFFSET_HEIGHT);
                
                if (this.get('startCentered')) {
                    this._setStartPosition([xy[0] + (ow / 2), xy[1] + (oh / 2)]);
                }
                
                
                this.region = {
                    '0': xy[0], 
                    '1': xy[1],
                    area: 0,
                    top: xy[1],
                    right: xy[0] + ow,
                    bottom: xy[1] + oh,
                    left: xy[0]
                };
                this.set(DRAGGING, true);
            }
            return this;
        },
        /**
        * @method end
        * @description Ends the drag operation
        * @return {Self}
        * @chainable
        */
        end: function() {
            this._endTime = (new Date()).getTime();
            if (this._clickTimeout) {
                this._clickTimeout.cancel();
            }
            this._dragThreshMet = this._fromTimeout = false;

            if (!this.get('lock') && this.get(DRAGGING)) {
                this.fire(EV_END, {
                    pageX: this.lastXY[0],
                    pageY: this.lastXY[1],
                    startTime: this._startTime,
                    endTime: this._endTime
                });
            }
            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-dragging');
            this.set(DRAGGING, false);
            this.deltaXY = [0, 0];

            return this;
        },
        /**
        * @private
        * @method _defEndFn
        * @description Handler for fixing the selection in IE
        */
        _defEndFn: function(e) {
            this._fixIEMouseUp();
            this._ev_md = null;
        },
        /**
        * @private
        * @method _prevEndFn
        * @description Handler for preventing the drag:end event. It will reset the node back to it's start position
        */
        _prevEndFn: function(e) {
            this._fixIEMouseUp();
            //Bug #1852577
            this.get(DRAG_NODE).setXY(this.nodeXY);
            this._ev_md = null;
            this.region = null;
        },
        /**
        * @private
        * @method _align
        * @description Calculates the offsets and set's the XY that the element will move to.
        * @param {Array} xy The xy coords to align with.
        */
        _align: function(xy) {
            this.fire(EV_ALIGN, {pageX: xy[0], pageY: xy[1] });
        },
        /**
        * @private
        * @method _defAlignFn
        * @description Calculates the offsets and set's the XY that the element will move to.
        * @param {Event.Facade} e The drag:align event.
        */
        _defAlignFn: function(e) {
            this.actXY = [e.pageX - this.deltaXY[0], e.pageY - this.deltaXY[1]];
        },
        /**
        * @private
        * @method _alignNode
        * @description This method performs the alignment before the element move.
        * @param {Array} eXY The XY to move the element to, usually comes from the mousemove DOM event.
        */
        _alignNode: function(eXY) {
            this._align(eXY);
            this._moveNode();
        },
        /**
        * @private
        * @method _moveNode
        * @description This method performs the actual element move.
        */
        _moveNode: function(scroll) {
            //if (!this.get(DRAGGING)) {
            //    return;
            //}
            var diffXY = [], diffXY2 = [], startXY = this.nodeXY, xy = this.actXY;

            diffXY[0] = (xy[0] - this.lastXY[0]);
            diffXY[1] = (xy[1] - this.lastXY[1]);

            diffXY2[0] = (xy[0] - this.nodeXY[0]);
            diffXY2[1] = (xy[1] - this.nodeXY[1]);


            this.region = {
                '0': xy[0], 
                '1': xy[1],
                area: 0,
                top: xy[1],
                right: xy[0] + this.get(DRAG_NODE).get(OFFSET_WIDTH),
                bottom: xy[1] + this.get(DRAG_NODE).get(OFFSET_HEIGHT),
                left: xy[0]
            };

            this.fire(EV_DRAG, {
                pageX: xy[0],
                pageY: xy[1],
                scroll: scroll,
                info: {
                    start: startXY,
                    xy: xy,
                    delta: diffXY,
                    offset: diffXY2
                } 
            });
            
            this.lastXY = xy;
        },
        /**
        * @private
        * @method _defDragFn
        * @description Default function for drag:drag. Fired from _moveNode.
        * @param {Event.Facade} ev The drag:drag event
        */
        _defDragFn: function(e) {
            if (this.get('move')) {
                if (e.scroll) {
                    e.scroll.node.set('scrollTop', e.scroll.top);
                    e.scroll.node.set('scrollLeft', e.scroll.left);
                }
                this.get(DRAG_NODE).setXY([e.pageX, e.pageY]);
                this.realXY = [e.pageX, e.pageY];
            }
        },
        /**
        * @private
        * @method _move
        * @description Fired from DragDropMgr (DDM) on mousemove.
        * @param {Event.Facade} ev The mousemove DOM event
        */
        _move: function(ev) {
            if (this.get('lock')) {
                return false;
            } else {
                this.mouseXY = [ev.pageX, ev.pageY];
                if (!this._dragThreshMet) {
                    var diffX = Math.abs(this.startXY[0] - ev.pageX),
                    diffY = Math.abs(this.startXY[1] - ev.pageY);
                    if (diffX > this.get('clickPixelThresh') || diffY > this.get('clickPixelThresh')) {
                        this._dragThreshMet = true;
                        this.start();
                        this._alignNode([ev.pageX, ev.pageY]);
                    }
                } else {
                    if (this._clickTimeout) {
                        this._clickTimeout.cancel();
                    }
                    this._alignNode([ev.pageX, ev.pageY]);
                }
            }
        },
        /**
        * @method stopDrag
        * @description Method will forcefully stop a drag operation. For example calling this from inside an ESC keypress handler will stop this drag.
        * @return {Self}
        * @chainable
        */
        stopDrag: function() {
            if (this.get(DRAGGING)) {
                DDM._end();
            }
            return this;
        },
        /**
        * @private
        * @method destructor
        * @description Lifecycle destructor, unreg the drag from the DDM and remove listeners
        */
        destructor: function() {
            this._unprep();
            this.detachAll();
            if (this.target) {
                this.target.destroy();
            }
            DDM._unregDrag(this);
        }
    });
    Y.namespace('DD');    
    Y.DD.Drag = Drag;





}, '3.3.0' ,{requires:['dd-ddm-base'], skinnable:false});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('dd-plugin', function(Y) {


       /**
        * Simple Drag plugin that can be attached to a Node via the plug method.
        * @module dd
        * @submodule dd-plugin
        */
       /**
        * Simple Drag plugin that can be attached to a Node via the plug method.
        * @class Drag
        * @extends DD.Drag
        * @constructor
        * @namespace Plugin
        */


        var Drag = function(config) {
            config.node = ((Y.Widget && config.host instanceof Y.Widget) ? config.host.get('boundingBox') : config.host);
            Drag.superclass.constructor.call(this, config);
        };
        
        /**
        * @property NAME
        * @description dd-plugin
        * @type {String}
        */
        Drag.NAME = "dd-plugin";

        /**
        * @property NS
        * @description The Drag instance will be placed on the Node instance under the dd namespace. It can be accessed via Node.dd;
        * @type {String}
        */
        Drag.NS = "dd";


        Y.extend(Drag, Y.DD.Drag);
        Y.namespace('Plugin');
        Y.Plugin.Drag = Drag;





}, '3.3.0' ,{requires:['dd-drag'], skinnable:false, optional:['dd-constrain', 'dd-proxy']});
/**
 * box.js | cubee 弹出框控件
 * autohr:bachi@taobao.com
 * @class Y.Box
 * @param { object } 配置项
 * @return { object } 生成一个box实例
 * @requires { 'node','event','overlay','dd-plugin' }
 * @requires { box-skin-default或者box-skin-sea } 皮肤
 * 
 * Y.Box：	
 *	说明：	窗口构造器，通过new Y.Box来render一个box，可以使用Y.Box定制自己的alert、comfirm、prompt等等
 *	使用：	new Y.Box(options);
 *	配置：	head:{string} box头部
 *			body:{string} box主题部分
 *			foot:{string} box尾部
 *			fixed:{boolean} true,box不会随着窗口滚动而滚动，false，box会随着窗口滚动而滚动，默认为true（ie6下始终会跟随页面滚动而滚动）
 *			afterDrag:{function} 拖拽结束的回调，参数为box本身
 *			draggable:{boolean} 是否可拖拽,默认为true
 *			resizeable:{boolean} 是否可resize，默认为false
 *			afterResize:{function} resize结束的回调，参数为box，（未实现）
 *			shownImmediately:{boolean} 是否初始化完成立即显示，默认为true
 *			afterHide:{function} 隐藏完毕后的回调，参数为box
 *			afterShow:{function} 显示完成后的回调，参数为box
 *			onload:{function} 初始化完成后的回调，在render后立即执行，参数为box
 *			modal:{boolean} 是否带阴影，默认为false，阴影的动画效果未实现
 *			beforeUnload:{function} 窗口关闭之前的回调,参数为box
 *			afterUnload:{function} 窗口关闭之后的回调,参数为box
 *			antijam:{boolean} 是否隐藏media干扰物，默认为false
 *			maskOpacity:{float} 设定遮盖层的透明度，范围是[0,1]，默认为0.6，当modal为true时才起作用
 *		Y.Box的实例的方法：
 *			init:初始化，参数为options
 *			bringToTop:将box的z-index调到所有box之上
 *			render:渲染，init在new的时候调用，render可以在运行时任意时刻调用，参数为options，其成员可覆盖原参数
 *			close:关闭，并将窗口删除
 *			hide:隐藏，不会删除窗口
 *			show:显示窗口
 *			buildParam:构造配置项，在init的时候调用
 *			parseParam:重置配置项，在render的时候调用
 *			addMask:添加遮罩
 *			removeMask:删除遮罩
 *			hideMedias:隐藏media干扰物
 *			showMedias:解除media干扰物隐藏
 *		
 */
YUI.namespace('Y.Box');
YUI.add('trip-box', function (Y) {

	/*
		兼容老版本的yui
	*/

	if(typeof Y.Node.prototype.queryAll == 'undefined'){
		Y.Node.prototype.queryAll = Y.Node.prototype.all;
		Y.Node.prototype.query = Y.Node.prototype.one;
		Y.Node.get = Y.Node.one;
		Y.get = Y.one;
	}

	
	/**
     * Y.Box构造器
     * @class Y.Box
	 */
	Y.Box = function(){
		this.init.apply(this,arguments);
	};
	/**
	 * 全局的overlays存储
	 * @static { Array }
	 */
	Y.Box.overlays = [];

	Y.Box.prototype = {
		/**
		 * 初始化
		 * @memberof Y.Box
		 * @param { object } 配置项
		 * @return this
		 */
		init:function(opt){
			var that = this;
			that.buildParam(opt);

			that.overlay = new Y.Overlay({
				contentBox: "myContent",
				height:that.height,
				width:that.width,
				zIndex:1000,
				visible:false,
				shim:true,
				centered:true,
				align : that.align,
				headerContent: that.head,
				bodyContent: that.body,
				footerContent:that.foot
			});

			Y.Box.overlays.push(that.overlay);
			//处理zindex
			that.bringToTop();
			that.overlay._posNode.on('focus',function(e){
				//e.target.blur();
			});
			that.overlay._posNode.on('mousedown',function(e){
				var widget = Y.Widget.getByNode(e.target);
				if (widget && widget instanceof Y.Overlay) {
					that.bringToTop();
					Y.log('bringToTop()');
				}
				Y.Box._xy = widget._posNode.getXY();
			});
			//处理afterdrag
			that.overlay._posNode.on('mouseup',function(e){
				var widget = Y.Widget.getByNode(e.target);
				if (widget && widget instanceof Y.Overlay) {
					var _xy =  widget._posNode.getXY();
					if(_xy[0] != Y.Box._xy[0] || _xy[1] != Y.Box._xy[1]){
						that.afterDrag(widget);
						Y.log('拖拽结束')
					}
				}
			});

			if(that.resizeable){
				that.resize = new Y.Resize({
					node:that.overlay._posNode
				});
			}

			return this;
		},
		/**
		 * 处理层级关系
		 * @memberof Y.Box
		 * @return this
		 */
		bringToTop:function(){
			var that = this;
			if(Y.Box.overlays.length == 1){
				return undefined;
			}
			var topIndex = 0;
			for(var i = 0;i<Y.Box.overlays.length;i++){
				var t = Number(Y.Box.overlays[i].get('zIndex'));
				if(t > topIndex)topIndex = t;
			}
			that.overlay.set('zIndex',topIndex+1);
			return this;
		},
		/**
		 * 渲染弹层
		 * @memberof Y.Box
		 * @param { object }配置项
		 * @return this
		 */
		render:function(opt){
			var that = this;
			that.parseParam(opt);
			that.overlay.render("#overlay-align");
			var __x = that.overlay.get('x');
			var __y = that.overlay.get('y');
			if(that.height == 'auto' || that.width == 'auto'){
				var _R = that.overlay._posNode.get('region');
				if(that.height == 'auto'){
					__y -= Number(_R.height/2);
				}
				if(that.width == 'auto'){
					if(Y.UA.ie < 7 && Y.UA.ie > 0 ){//hack for ie6 when width was auto
						//that.overlay._posNode.query('div.yui3-widget-bd').setStyle('width','100%');
						that.overlay.set('width',that.overlay._posNode.query('div.yui3-widget-bd').get('region').width);
					}
					if(Y.UA.ie >= 7  ){//hack for ie7 when width was auto
						that.overlay._posNode.query('div.yui3-widget-bd').setStyle('width','100%');
						that.overlay.set('width',that.overlay._posNode.query('div.yui3-widget-bd').get('region').width);
					}
					__x -= Number(that.overlay._posNode.get('region').width/2);
				}
				that.overlay.move([__x,__y < 0 ? 0 : __y]);
			}
			if(that.shownImmediately)that.overlay.set('visible',true);
			if(that.fixed){
				//ie6始终是absolute
				if(/6/i.test(Y.UA.ie)){
					that.overlay._posNode.setStyle('position','absolute');
				}else{
					//若fixed则需要减去滚动条的top
					__y -= Y.get('docscrollY').get('scrollTop');
					__x -= Y.get('docscrollX').get('scrollLeft');
					that.overlay.move([__x,__y < 0 ? 0 : __y]);
					that.overlay._posNode.setStyle('position','fixed');
				}
			}
			if(that.x)that.overlay.set('x',Number(that.x));
			if(that.y)that.overlay.set('y',Number(that.y) < 0 ? 0 : Number(that.y));
			if(that.draggable){
				that.overlay.headerNode.setStyle('cursor','move');
				if(!that.overlay._posNode.dd){
					that.overlay._posNode.plug(Y.Plugin.Drag);
					that.overlay._posNode.dd.addHandle('.yui3-widget-hd');
				}
			}
			that.onload(that);
			//Y.log('load()');
			if(that.modal){
				that.addMask();
			}
			if(that.antijam){
				that.hideMedias();
			}
			if(that.resizeable){
				try {
					var _hd = that.overlay._posNode.query('.yui3-widget-hd');
					var _bd = that.overlay._posNode.query('.yui3-widget-bd');
					var _ft = that.overlay._posNode.query('.yui3-widget-ft');
					that.resize.on('resize:resize',function(e){
						var o_height = that.overlay._posNode.get('region').height;
						var h_height = _hd.get('region').height;
						var f_height = _ft.get('region').height;
						var b_height = o_height - h_height - f_height - 20 - 2;//减去body的上下内边距,减去边界
						_bd.setStyle('height',b_height+'px');
					});
				}catch(e){}
			}
			return this;
		},
		/**
		 * 删除数组项，应当在base中
		 * @memberof Y.Box
		 * @param { value }值
		 * @param { array }数组
		 * @return this
		 */
		removeArray : function(v, a){
			for(var i=0,m=a.length; i<m; i++){
				if(a[i] == v){
					a.splice(i, 1);
					break;
				}
			}
		},
		/**
		 * 关闭弹层
		 * @method Y.Box.close
		 * @memberof Y.Box
		 * @return this
		 */
		close:function(){
			var that = this;
			that.beforeUnload(that);
			that.overlay.hide();
			that.showMedias();
			that.removeArray(that.overlay,Y.Box.overlays);
			that.overlay._posNode.remove();
			that.removeMask();
			that.afterUnload(that);
			that = null;
			Y.log('close()');
			return this;
		},
		/**
		 * 隐藏弹层
		 * @method Y.Box.hide
		 * @memberof Y.Box
		 * @return this
		 */
		hide:function(){
			var that = this;
			that.overlay.hide();
			that.showMedias();
			that.afterHide(that);
			return this;
		},
		/**
		 * 显示弹层
		 * @method Y.Box.show
		 * @memberof Y.Box
		 * @return this
		 */
		show:function(){
			var that = this;
			that.overlay.show();
			that.hideMedias();
			that.afterShow(that);
			return this;
		},
		/**
		 * 构造参数列表
		 * @method Y.Box.buildParam
		 * @memberof Y.Box
		 * @return this
		 */
		buildParam:function(o){
			var o = o || {};
			this.head = (typeof o.head == 'undefined'||o.head == null)?'':o.head;
			this.body= (typeof o.body== 'undefined'||o.body == null)?'':o.body;
			this.foot= (typeof o.foot== 'undefined'|| o.foot ==null)?'':o.foot;
			//this.anim = (typeof o.anim == 'undefined'||o.anim == null)?true:o.anim;
			this.skin = (typeof o.skin== 'undefined'||o.skin== null)?'default':o.skin;
			this.draggable = (typeof o.draggable == 'undefined'||o.draggable == null)?true:o.draggable;
			this.fixed= (typeof o.fixed == 'undefined'||o.fixed == null)?true:o.fixed;
			this.shownImmediately = (typeof o.shownImmediately == 'undefined'||o.shownImmediately == null)?true:o.shownImmediately;
			this.modal= (typeof o.modal == 'undefined'||o.modal == null)?false:o.modal;
			this.maskOpacity= (typeof o.maskOpacity == 'undefined'||o.maskOpacity == null)?0.6:o.maskOpacity;
			this.x= (typeof o.x == 'undefined'||o.x == null)?false:o.x;
			this.y= (typeof o.y == 'undefined'||o.y == null)?false:o.y;
			this.align = o.align || null;
			this.width = (typeof o.width == 'undefined'||o.width == null)?'300px':o.width;
			this.height = (typeof o.height == 'undefined'||o.height == null)?'auto':o.height;
			this.clickToFront= (typeof o.clickToFront == 'undefined'||o.clickToFront == null)?'':o.clickToFront;
			this.behaviours = (typeof o.behaviours == 'undefined'||o.behaviours == null)?'':o.behaviours;
			this.afterHide = (typeof o.afterHide == 'undefined'||o.afterHide == null)?new Function:o.afterHide;
			this.afterDrag= (typeof o.afterDrag == 'undefined'||o.afterDrag == null)?new Function:o.afterDrag;
			this.afterShow = (typeof o.afterShow== 'undefined'|| o.afterShow == null)?new Function:o.afterShow;
			this.beforeUnload = (typeof o.beforeUnload== 'undefined'||o.beforeUnload == null)?new Function:o.beforeUnload;
			this.afterUnload = (typeof o.afterUnload== 'undefined'||o.afterUnload == null)?new Function:o.afterUnload;
			this.onload = (typeof o.onload== 'undefined'||o.onload == null)?new Function:o.onload;//load ok后的回调,参数为box
			this.duration = (typeof o.duration == 'undefined'||o.duration == null)?0.3:o.duration;
			this.antijam = (typeof o.antijam == 'undefined'||o.antijam == null)?false:o.antijam;//是否隐藏干扰因素
			this.resizeable = (typeof o.resizeable == 'undefined'||o.resizeable == null)?false:o.resizeable;//是否隐藏干扰因素
			
			return this;
		},
		/**
		 * 重设参数
		 * @method Y.Box.parseParam
		 * @memberof Y.Box
		 * @return this
		 */
		parseParam:function(opt){
			var opt = opt || {};
			for(var i in opt){
				this[i] = opt[i];
			}
			return this;
		},
		/**
		 * 隐藏干扰因素
		 * @method Y.Box.hideMedias
		 * @memberof Y.Box
		 * @return this
		 */
		hideMedias:function(){
			var that = this;
			if(that.antijam == false)return this;
			that.hiddenMedia = [];
			var obj_array = document.body.getElementsByTagName('object');
			for(var i=0, m=obj_array.length; i<m; i++){
				if(obj_array[i].type.indexOf("x-oleobject") > 0){
					that.hiddenMedia.push(obj_array[i]);
					obj_array[i].style.visibility = 'hidden';
				}
			}
			return this;
		},
		/**
		 * 关闭后的解除隐藏
		 * @method Y.Box.showMedias
		 * @memberof Y.Box
		 * @return this
		 */
		showMedias:function(){
			var that = this;
			if(that.antijam == false)return this;
			if(that.hiddenMedia.length > 0){
				for(var i=0, m=that.hiddenMedia.length; i<m; i++){
					that.hiddenMedia[i].style.visibility = 'visible';
				}
				that.hiddenMedia = new Array();
			}
			return this;
		},
		/**
		 * 添加遮罩
		 * @method Y.Box.addMask
		 * @memberof Y.Box
		 * @return this
		 */
		addMask:function(){
			var that = this;
			if(Y.one('#t-shade-tmp'))return this;
			var node = Y.Node.create('<div id="t-shade-tmp" style="display: block; z-index: 999;background-color:black;left:0;position:absolute;top:0;width:100%;display:none"></div>');
			node.setStyle('opacity',that.maskOpacity.toString());
			node.setStyle('height',Y.one('body').get('docHeight')+'px');
			Y.one("html").setStyle('overflow','hidden');
			Y.one('body').append(node);
			node.setStyle('display','block');
			return this;
		},
		/**
		 * 删除遮罩
		 * @method Y.Box.removeMask
		 * @memberof Y.Box
		 * @return this
		 */
		removeMask:function(){
			var that = this;
			if(Y.Box.overlays.length == 0 && Y.one('#t-shade-tmp')){
				Y.one('#t-shade-tmp').remove();
				Y.one("html").setStyle('overflow','');
			}
			return this;
		}
	};//box prototype end

	/**
	 * Y.Box.alert提示框 
	 * @method Y.Box.alert
	 *	Y.Box.alert：
	 *		说明：	alert弹出框，基于Y.Box的一种定制
	 *		使用：	Y.Box.alert(msg,callback,options)
	 *		参数：	msg:{string} 消息体
	 *				callback:{function} 点击确定的回调，参数为box，默认点击确定会关闭窗口
	 *				options:{
	 *					title:{string} 标题
	 *					closeable:{boolean} 是否有关闭按钮，默认为true
	 *					closeText:{string} 可以自定义按钮
	 *					btnText:{string} 确定按钮的文案
	 *					（其他字段同Y.Box的options）
	 *				}
	 */
	Y.Box.alert = function(msg,callback,opt){
		if(typeof msg == 'undefined'||msg==null)var msg = '';
		if(typeof callback == 'undefined'||callback == null)var callback = new Function;
		if(typeof opt == 'undefined'||opt == null)var opt = {};
		var title = (typeof opt.title == 'undefined'||opt.title == null)?'提示':opt.title;

		var closeable = (typeof opt.closeable == 'undefined'||opt.closeable == null)?true:opt.closeable;
		var closeText = (typeof opt.closeText == 'undefined'||opt.closeText == null)?'<img src="http://img04.taobaocdn.com/tps/i4/T1m6tpXfxBXXXXXXXX-14-14.gif" border=0>':opt.closeText;
		var btnText = (typeof opt.btnText == 'undefined'||opt.btnText == null)?'确定':opt.btnText;
		
		var closestr = closeable?'<a class="close closebtn">'+closeText+'</a>':'';
		var headstr = '<span class="title">'+title+'</span>'+closestr;
		opt.head = headstr;
		opt.body = msg;
		opt.foot = '<div align=right><button class="okbtn">'+btnText+'</div>';
		opt._onload = opt.onload || new Function;
		opt.onload = function(box){
			var node = box.overlay._posNode;
			node.query('.okbtn').on('click',function(e){
				e.halt();
				callback(box);
				box.close();
			});
			try{
				node.query('.closebtn').setStyle('cursor','pointer');
				node.query('.closebtn').on('click',function(e){
					e.halt();
					box.close();
				});
			}catch(e){}
			opt._onload(box);
		};

		var box = new Y.Box(opt);
		return box.render();
	};


	/**
	 * Y.Box.confirm
	 * @method Y.Box.confirm
	 *
	 *	Y.Box.confirm：
	 *		说明：	comfirm弹出框，基于Y.Box的一种定制
	 *		使用：	Y.Box.confirm(msg,callback,options)
	 *		参数：	msg:{string} 消息体
	 *				callback:{function} 点击确定的回调，参数为box，默认点击确定会关闭窗口
	 *				options:{
	 *					title:{string} 标题
	 *					yes:{function} 点击是的回调，参数为box，默认点击会关闭，此项会覆盖callback
	 *					no:{function} 点击否的回调，参数为box
	 *					yesText:{string} 按钮“是”的文案
	 *					noText:{string} 按钮"否"的文案
	 *					cancleBtn:{boolean} 是否显示"关闭"按钮，默认为true
	 *					cancleText:{string} 按钮“取消”的文案
	 *					（其他字段同Y.Box的options）
	 *				}
	 */
	Y.Box.confirm = function(msg,callback,opt){
		if(typeof msg == 'undefined'||msg == null)var msg = '';
		if(typeof callback == 'undefined'||callback == null)var callback = new Function;
		if(typeof opt == 'undefined'||opt == null)var opt = {};
		var title = (typeof opt.title == 'undefined'||opt.title == null)?'提示':opt.title;

		var closeable = (typeof opt.closeable == 'undefined'||opt.closeable == null)?true:opt.closeable;
		var closeText = (typeof opt.closeText == 'undefined'||opt.closeText == null)?'<img src="http://img04.taobaocdn.com/tps/i4/T1m6tpXfxBXXXXXXXX-14-14.gif" border=0>':opt.closeText;
			opt.yes = (typeof opt.yes == 'undefined'||opt.yes == null)?callback:opt.yes;
			opt.no= (typeof opt.no == 'undefined' || opt.no == null)?new Function:opt.no;
		var yesText = (typeof opt.yesText == 'undefined' || opt.yesText == null)?'确定':opt.yesText;
		var noText = (typeof opt.noText == 'undefined' || opt.noText == null)?'取消':opt.noText;
		var cancleBtn = (typeof opt.cancleBtn == 'undefined'||opt.cancleBtn == null)?false:opt.cancleBtn;
		var cancleText = (typeof opt.cancleText == 'undefined'||opt.cancleText == null)?'关闭':opt.cancleText;


		var canclestr = cancleBtn?'<button class="canclebtn">'+cancleText+'</button>':'';
		var closestr = closeable?'<a class="close closebtn">'+closeText+'</a>':'';
		var headstr = '<span class="title">'+title+'</span>'+closestr;
		opt.head = headstr;
		opt.body = msg;
		opt.foot = '<div align=right><button class="yesbtn">'+yesText+'</button>&nbsp;<button class="nobtn">'+noText+'</button>&nbsp;'+canclestr+'</div>';
		opt._onload = opt.onload || new Function;
		opt.onload = function(box){
			var node = box.overlay._posNode;
			node.query('.yesbtn').on('click',function(e){
				e.halt();
				opt.yes(box);
				box.close();
			});
			node.query('.nobtn').on('click',function(e){
				e.halt();
				opt.no(box);
				box.close();
			});
			if(cancleBtn){
				node.query('.canclebtn').on('click',function(e){
					e.halt();
					box.close();
				});
			}
			try{
				node.query('.closebtn').setStyle('cursor','pointer');
				node.query('.closebtn').on('click',function(e){
					e.halt();
					box.close();
				});
			}catch(e){}
			opt._onload(box);
		};

		var box = new Y.Box(opt);
		return box.render();

	};


},'0.1',{requires:['node-base','event-base','overlay','dd-plugin']});
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('imageloader', function(Y) {

/**
 * The ImageLoader Utility is a framework to dynamically load images according to certain triggers,
 * enabling faster load times and a more responsive UI.
 *
 * @module imageloader
 * @requires base-base, node-style, node-screen
 */


	/**
	 * A group for images. A group can have one time limit and a series of triggers. Thus the images belonging to this group must share these constraints.
	 * @class ImgLoadGroup
	 * @extends Base
	 * @constructor
	 */
	Y.ImgLoadGroup = function() {
		// call init first, because it sets up local vars for storing attribute-related info
		this._init();
		Y.ImgLoadGroup.superclass.constructor.apply(this, arguments);
	};

	Y.ImgLoadGroup.NAME = 'imgLoadGroup';

	Y.ImgLoadGroup.ATTRS = {
		
		/**
		 * Name for the group. Only used to identify the group in logging statements.
		 * @attribute name
		 * @type String
		 */
		name: {
			value: ''
		},

		/**
		 * Time limit, in seconds, after which images are fetched regardless of trigger events.
		 * @attribute timeLimit
		 * @type Number
		 */
		timeLimit: {
			value: null
		},

		/**
		 * Distance below the fold for which images are loaded. Images are not loaded until they are at most this distance away from (or above) the fold.
		 * This check is performed at page load (domready) and after any window scroll or window resize event (until all images are loaded).
		 * @attribute foldDistance
		 * @type Number
		 */
		foldDistance: {
			validator: Y.Lang.isNumber,
			setter: function(val) { this._setFoldTriggers(); return val; },
			lazyAdd: false
		},

		/**
		 * Class name that will identify images belonging to the group. This class name will be removed from each element in order to fetch images.
		 * This class should have, in its CSS style definition, "<code>background:none !important;</code>".
		 * @attribute className
		 * @type String
		 */
		className: {
			value: null,
			setter: function(name) { this._className = name; return name; },
			lazyAdd: false
		}

	};

	var groupProto = {

		/**
		 * Initialize all private members needed for the group.
		 * @method _init
		 * @private
		 */
		_init: function() {

			/**
			 * Collection of triggers for this group.
			 * Keeps track of each trigger's event handle, as returned from <code>Y.on</code>.
			 * @property _triggers
			 * @private
			 * @type Array
			 */
			this._triggers = [];

			/**
			 * Collection of images (<code>Y.ImgLoadImgObj</code> objects) registered with this group, keyed by DOM id.
			 * @property _imgObjs
			 * @private
			 * @type Object
			 */
			this._imgObjs = {};

			/**
			 * Timeout object to keep a handle on the time limit.
			 * @property _timeout
			 * @private
			 * @type Object
			 */
			this._timeout = null;

			/**
			 * DOM elements having the class name that is associated with this group.
			 * Elements are stored during the <code>_foldCheck</code> function and reused later during any subsequent <code>_foldCheck</code> calls - gives a slight performance improvement when the page fold is repeatedly checked.
			 * @property _classImageEls
			 * @private
			 * @type Array
			 */
			this._classImageEls = null;

			/**
			 * Keep the CSS class name in a member variable for ease and speed.
			 * @property _className
			 * @private
			 * @type String
			 */
			this._className = null;

			/**
			 * Boolean tracking whether the window scroll and window resize triggers have been set if this is a fold group.
			 * @property _areFoldTriggersSet
			 * @private
			 * @type Boolean
			 */
			this._areFoldTriggersSet = false;

			/**
			 * The maximum pixel height of the document that has been made visible.
			 * During fold checks, if the user scrolls up then there's no need to check for newly exposed images.
			 * @property _maxKnownHLimit
			 * @private
			 * @type Int
			 */
			this._maxKnownHLimit = 0;

			// add a listener to domready that will start the time limit
			Y.on('domready', this._onloadTasks, this);
		},

		/**
		 * Adds a trigger to the group. Arguments are passed to <code>Y.on</code>.
		 * @method addTrigger
		 * @chainable
		 * @param {Object} obj  The DOM object to attach the trigger event to
		 * @param {String} type  The event type
		 */
		addTrigger: function(obj, type) {
			if (! obj || ! type) {
				return this;
			}


			/* Need to wrap the fetch function. Event Util can't distinguish prototyped functions of different instantiations.
			 *   Leads to this scenario: groupA and groupZ both have window-scroll triggers. groupZ also has a 2-sec timeout (groupA has no timeout).
			 *   groupZ's timeout fires; we remove the triggers. The detach call finds the first window-scroll event with Y.ILG.p.fetch, which is groupA's. 
			 *   groupA's trigger is removed and never fires, leaving images unfetched.
			 */
			var wrappedFetch = function() {
				this.fetch();
			};
			this._triggers.push( Y.on(type, wrappedFetch, obj, this) );

			return this;
		},

		/**
		 * Adds a custom event trigger to the group.
		 * @method addCustomTrigger
		 * @chainable
		 * @param {String} name  The name of the event
		 * @param {Object} obj  The object on which to attach the event. <code>obj</code> is optional - by default the event is attached to the <code>Y</code> instance
		 */
		addCustomTrigger: function(name, obj) {
			if (! name) {
				return this;
			}


			// see comment in addTrigger()
			var wrappedFetch = function() {
				this.fetch();
			};
			if (Y.Lang.isUndefined(obj)) {
				this._triggers.push( Y.on(name, wrappedFetch, this) );
			}
			else {
				this._triggers.push( obj.on(name, wrappedFetch, this) );
			}

			return this;
		},

		/**
		 * Sets the window scroll and window resize triggers for any group that is fold-conditional (i.e., has a fold distance set).
		 * @method _setFoldTriggers
		 * @private
		 */
		_setFoldTriggers: function() {
			if (this._areFoldTriggersSet) {
				return;
			}


			var wrappedFoldCheck = function() {
				this._foldCheck();
			};
			this._triggers.push( Y.on('scroll', wrappedFoldCheck, window, this) );
			this._triggers.push( Y.on('resize', wrappedFoldCheck, window, this) );
			this._areFoldTriggersSet = true;
		},

		/**
		 * Performs necessary setup at domready time.
		 * Initiates time limit for group; executes the fold check for the images.
		 * @method _onloadTasks
		 * @private
		 */
		_onloadTasks: function() {
			var timeLim = this.get('timeLimit');
			if (timeLim && timeLim > 0) {
				this._timeout = setTimeout(this._getFetchTimeout(), timeLim * 1000);
			}

			if (! Y.Lang.isUndefined(this.get('foldDistance'))) {
				this._foldCheck();
			}
		},

		/**
		 * Returns the group's <code>fetch</code> method, with the proper closure, for use with <code>setTimeout</code>.
		 * @method _getFetchTimeout
		 * @return {Function}  group's <code>fetch</code> method
		 * @private
		 */
		_getFetchTimeout: function() {
			var self = this;
			return function() { self.fetch(); };
		},

		/**
		 * Registers an image with the group.
		 * Arguments are passed through to a <code>Y.ImgLoadImgObj</code> constructor; see that class' attribute documentation for detailed information. "<code>domId</code>" is a required attribute.
		 * @method registerImage
		 * @param {Object} *  A configuration object literal with attribute name/value pairs  (passed through to a <code>Y.ImgLoadImgObj</code> constructor)
		 * @return {Object}  <code>Y.ImgLoadImgObj</code> that was registered
		 */
		registerImage: function() {
			var domId = arguments[0].domId;
			if (! domId) {
				return null;
			}


			this._imgObjs[domId] = new Y.ImgLoadImgObj(arguments[0]);
			return this._imgObjs[domId];
		},

		/**
		 * Displays the images in the group.
		 * This method is called when a trigger fires or the time limit expires; it shouldn't be called externally, but is not private in the rare event that it needs to be called immediately.
		 * @method fetch
		 */
		fetch: function() {

			// done with the triggers
			this._clearTriggers();

			// fetch whatever we need to by className
			this._fetchByClass();

			// fetch registered images
			for (var id in this._imgObjs) {
				if (this._imgObjs.hasOwnProperty(id)) {
					this._imgObjs[id].fetch();
				}
			}
		},

		/**
		 * Clears the timeout and all triggers associated with the group.
		 * @method _clearTriggers
		 * @private
		 */
		_clearTriggers: function() {
			clearTimeout(this._timeout);
			// detach all listeners
			for (var i=0, len = this._triggers.length; i < len; i++) {
				this._triggers[i].detach();
			}
		},

		/**
		 * Checks the position of each image in the group. If any part of the image is within the specified distance (<code>foldDistance</code>) of the client viewport, the image is fetched immediately.
		 * @method _foldCheck
		 * @private
		 */
		_foldCheck: function() {

			var allFetched = true,
			    viewReg = Y.DOM.viewportRegion(),
			    hLimit = viewReg.bottom + this.get('foldDistance'),
					id, imgFetched, els, i, len;

			// unless we've uncovered new frontiers, there's no need to continue
			if (hLimit <= this._maxKnownHLimit) {
				return;
			}
			this._maxKnownHLimit = hLimit;

			for (id in this._imgObjs) {
				if (this._imgObjs.hasOwnProperty(id)) {
					imgFetched = this._imgObjs[id].fetch(hLimit);
					allFetched = allFetched && imgFetched;
				}
			}

			// and by class
			if (this._className) {
				if (this._classImageEls === null) {
					// get all the relevant elements and store them
					this._classImageEls = [];
					els = Y.all('.' + this._className);
					els.each( function(node) { this._classImageEls.push( { el: node, y: node.getY(), fetched: false } ); }, this);
				}
				els = this._classImageEls;
				for (i=0, len = els.length; i < len; i++) {
					if (els[i].fetched) {
						continue;
					}
					if (els[i].y && els[i].y <= hLimit) {
						els[i].el.removeClass(this._className);
						els[i].fetched = true;
					}
					else {
						allFetched = false;
					}
				}
			}
			
			// if allFetched, remove listeners
			if (allFetched) {
				this._clearTriggers();
			}
		},

		/**
		 * Finds all elements in the DOM with the class name specified in the group. Removes the class from the element in order to let the style definitions trigger the image fetching.
		 * @method _fetchByClass
		 * @private
		 */
		_fetchByClass: function() {
			if (! this._className) {
				return;
			}


			Y.all('.' + this._className).removeClass(this._className);
		}

	};


	Y.extend(Y.ImgLoadGroup, Y.Base, groupProto);


	//------------------------------------------------


	/**
	 * Image objects to be registered with the groups
	 * @class ImgLoadImgObj
	 * @extends Base
	 * @constructor
	 */
	Y.ImgLoadImgObj = function() {
		Y.ImgLoadImgObj.superclass.constructor.apply(this, arguments);
		this._init();
	};
		
	Y.ImgLoadImgObj.NAME = 'imgLoadImgObj';

	Y.ImgLoadImgObj.ATTRS = {
		/**
		 * HTML DOM id of the image element.
		 * @attribute domId
		 * @type String
		 */
		domId: {
			value: null,
			writeOnce: true
		},

		/**
		 * Background URL for the image.
		 * For an image whose URL is specified by "<code>background-image</code>" in the element's style.
		 * @attribute bgUrl
		 * @type String
		 */
		bgUrl: {
			value: null
		},

		/**
		 * Source URL for the image.
		 * For an image whose URL is specified by a "<code>src</code>" attribute in the DOM element.
		 * @attribute srcUrl
		 * @type String
		 */
		srcUrl: {
			value: null
		},

		/**
		 * Pixel width of the image. Will be set as a <code>width</code> attribute on the DOM element after the image is fetched.
		 * Defaults to the natural width of the image (no <code>width</code> attribute will be set).
		 * Usually only used with src images.
		 * @attribute width
		 * @type Int
		 */
		width: {
			value: null
		},

		/**
		 * Pixel height of the image. Will be set as a <code>height</code> attribute on the DOM element after the image is fetched.
		 * Defaults to the natural height of the image (no <code>height</code> attribute will be set).
		 * Usually only used with src images.
		 * @attribute height
		 * @type Int
		 */
		height: {
			value: null
		},

		/**
		 * Whether the image's <code>style.visibility</code> should be set to <code>visible</code> after the image is fetched.
		 * Used when setting images as <code>visibility:hidden</code> prior to image fetching.
		 * @attribute setVisible
		 * @type Boolean
		 */
		setVisible: {
			value: false
		},

		/**
		 * Whether the image is a PNG.
		 * PNG images get special treatment in that the URL is specified through AlphaImageLoader for IE, versions 6 and earlier.
		 * Only used with background images.
		 * @attribute isPng
		 * @type Boolean
		 */
		isPng: {
			value: false
		},

		/**
		 * AlphaImageLoader <code>sizingMethod</code> property to be set for the image.
		 * Only set if <code>isPng</code> value for this image is set to <code>true</code>.
		 * Defaults to <code>scale</code>.
		 * @attribute sizingMethod
		 * @type String
		 */
		sizingMethod: {
			value: 'scale'
		},

		/**
		 * AlphaImageLoader <code>enabled</code> property to be set for the image.
		 * Only set if <code>isPng</code> value for this image is set to <code>true</code>.
		 * Defaults to <code>true</code>.
		 * @attribute enabled
		 * @type String
		 */
		enabled: {
			value: 'true'
		}

	};

	var imgProto = {

		/**
		 * Initialize all private members needed for the group.
		 * @method _init
		 * @private
		 */
		_init: function() {

			/**
			 * Whether this image has already been fetched.
			 * In the case of fold-conditional groups, images won't be fetched twice.
			 * @property _fetched
			 * @private
			 * @type Boolean
			 */
			this._fetched = false;

			/**
			 * The Node object returned from <code>Y.one</code>, to avoid repeat calls to access the DOM.
			 * @property _imgEl
			 * @private
			 * @type Object
			 */
			this._imgEl = null;

			/**
			 * The vertical position returned from <code>getY</code>, to avoid repeat calls to access the DOM.
			 * The Y position is checked only for images registered with fold-conditional groups. The position is checked first at page load (domready)
			 *   and this caching enhancement assumes that the image's vertical position won't change after that first check.
			 * @property _yPos
			 * @private
			 * @type Int
			 */
			this._yPos = null;
		},

		/**
		 * Displays the image; puts the URL into the DOM.
		 * This method shouldn't be called externally, but is not private in the rare event that it needs to be called immediately.
		 * @method fetch
		 * @param {Int} withinY  The pixel distance from the top of the page, for which if the image lies within, it will be fetched. Undefined indicates that no check should be made, and the image should always be fetched
		 * @return {Boolean}  Whether the image has been fetched (either during this execution or previously)
		 */
		fetch: function(withinY) {
			if (this._fetched) {
				return true;
			}

			var el = this._getImgEl(),
			    yPos;
			if (! el) {
				return false;
			}

			if (withinY) {
				// need a distance check
				yPos = this._getYPos();
				if (! yPos || yPos > withinY) {
					return false;
				}
			}


			// apply url
			if (this.get('bgUrl') !== null) {
				// bg url
				if (this.get('isPng') && Y.UA.ie && Y.UA.ie <= 6) {
					// png for which to apply AlphaImageLoader
					el.setStyle('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + this.get('bgUrl') + '", sizingMethod="' + this.get('sizingMethod') + '", enabled="' + this.get('enabled') + '")');
				}
				else {
					// regular bg image
					el.setStyle('backgroundImage', "url('" + this.get('bgUrl') + "')");
				}
			}
			else if (this.get('srcUrl') !== null) {
				// regular src image
				el.setAttribute('src', this.get('srcUrl'));
			}

			// apply attributes
			if (this.get('setVisible')) {
				el.setStyle('visibility', 'visible');
			}
			if (this.get('width')) {
				el.setAttribute('width', this.get('width'));
			}
			if (this.get('height')) {
				el.setAttribute('height', this.get('height'));
			}

			this._fetched = true;

			return true;
		},

		/**
		 * Gets the object (as a <code>Y.Node</code>) of the DOM element indicated by "<code>domId</code>".
		 * @method _getImgEl
		 * @returns {Object} DOM element of the image as a <code>Y.Node</code> object
		 * @private
		 */
		_getImgEl: function() {
			if (this._imgEl === null) {
				this._imgEl = Y.one('#' + this.get('domId'));
			}
			return this._imgEl;
		},

		/**
		 * Gets the Y position of the node in page coordinates.
		 * Expects that the page-coordinate position of the image won't change.
		 * @method _getYPos
		 * @returns {Object} The Y position of the image
		 * @private
		 */
		_getYPos: function() {
			if (this._yPos === null) {
				this._yPos = this._getImgEl().getY();
			}
			return this._yPos;
		}

	};


	Y.extend(Y.ImgLoadImgObj, Y.Base, imgProto);




}, '3.3.0' ,{requires:['base-base', 'node-style', 'node-screen']});
