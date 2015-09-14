(function(global, undefined) {

    util.extendEvent = function(prototype) {
        return util.merger(prototype, event);
    };

    var event = {
        on: function(types, handle) {
            var events = this.__events__;
            if (!events) {
                events = this.__events__ = {};
            }
            util.each(types.split(" "), function(i, type) {
                if (type) {
                    var array = events[type];
                    if (!array) {
                        events[type] = array = [];
                    }
                    array.push(handle);
                }
            }, this);
            return this;
        },
        once: function(types, handle) {
            handle.__is_once__ = 1;
            this.on.apply(this, arguments);
        },
        off: function(types, handle) {
            var typeArray = types.split(" "),
                l = 0,
                m = 0,
                array,
                event,
                events = this.__events__;
            if (!events) {
                return;
            }

            while (typeArray[l]) {
                type = typeArray[l];
                array = events[type];
                m = 0;
                if (array) {
                    if (handle) {
                        while (array[m]) {
                            if (array[m] == handle) {
                                array.splice(m, 1);
                            } else {
                                m++;
                            }
                        }
                    }
                    if (!handle || array.length == 0) {
                        delete this.__events__[type];
                        array = null;
                    }
                }
                l++;
            }
        },
        hasListener: function(type, handle) {
            var events = this.__events__;
            if (events && events[type]) {
                var result = util.each(events[type], function(i, fn) {
                    if (fn == handle) {
                        return false;
                    }
                });
                return result == false;
            }
            return false;
        },
        __createEvent__: function(type, data) {
            return util.merger(data, {
                __isEvent__: true,
                __type__: type
            });
        },
        emit: function(type, data) {
            var events = this.__events__,
                event, array, i;

            if (!events) {
                return;
            }
            event = this.__createEvent__(type, data);

            array = events[type];

            i = 0;

            while (array[i]) {
                var handle = array[i];
                if (util.isFunction(handle)) {
                    if (handle.__is_once__) {
                        array.splice(i, 1);
                    } else {
                        i++;
                    }
                    if (handle.call(this, event) == false) {
                        break;
                    }
                }
            }
        }
    };


})(window);
