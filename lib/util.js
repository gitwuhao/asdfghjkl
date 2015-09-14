(function(global, undefined) {

    var util = {};

    global.util = util;

    var ArraySlice = Array.prototype.slice,
        ObjectPrototype = Object.prototype,
        FunctionPrototype = Function.prototype,
        ObjectHasOwnProperty = ObjectPrototype.hasOwnProperty,
        toString = ObjectPrototype.toString,
        emptyFunction = function() {};

    function isObject(value) {
        return toString.call(value) === '[object Object]';
    };

    function isString(value) {
        return typeof value === 'string';
    };

    function isFunction(value) {
        return typeof value === 'function';
    };


    function it(array, handle, scope) {
        if (!array || !handle) {
            return;
        }
        scope = scope || null;
        for (var key in array) {
            if (scope == null) {
                scope = array[key];
            }
            if (ObjectHasOwnProperty.call(array, key) && handle.call(scope, key, array[key]) === false) {
                return false;
            }
        }
    };


    function each(array, handle, scope) {
        if (!array || !handle) {
            return;
        }
        if (array.length >= 0) {
            for (var i = 0, size = array.length; i < size; i++) {
                if (scope == null) {
                    scope = array[i];
                }
                if (handle.call(scope, i, array[i], size) === false) {
                    return false;
                }
            }
        }
    };


    function mergerAndApply(isApply, isDeep, target, list) {
        each(list, function(index, copy) {
            it(copy, function(key, copyItem) {
                var targetItem = target[key];
                if (isApply && targetItem) {

                } else if (isDeep && copyItem && isObject(copyItem) && targetItem) {
                    if (!isObject(targetItem)) {
                        targetItem = {};
                    }
                    target[key] = mergerAndApply(isApply, isDeep, targetItem, [copyItem]);
                } else {
                    target[key] = copyItem;
                }
            });
        });
        return target;
    };


    function getArgs() {
        var args = arguments,
            target,
            isDeep = false,
            index;
        if (args[0] === true || args[0] === false) {
            isDeep = args[0];
            target = args[1] || {};
            index = 2;
        } else {
            target = args[0] || {};
            index = 1;
        }
        return {
            isDeep: isDeep,
            target: target,
            list: ArraySlice.call(args, index)
        };
    };

    function merger(isDeep, target, config1, configN) {
        var arg = getArgs.apply({}, arguments);
        return mergerAndApply(false, arg.isDeep, arg.target, arg.list);
    };

    function apply(isDeep, target, config1, configN) {
        var arg = getArgs.apply({}, arguments);
        mergerAndApply(true, arg.isDeep, arg.target, arg.list);
    };


    merger(util, {
        isObject: isObject,
        isString: isString,
        isFunction: isFunction,
        it: it,
        each: each,
        merger: merger,
        apply: apply,
        emptyFN: emptyFunction,
        exec: function(handle, args, scope) {
            if (!handle) {
                return false;
            }
            scope = scope || global;
            handle.apply(scope, args||[]);
            return true;
        }
    });


})(window);
