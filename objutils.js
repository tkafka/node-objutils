exports.bind = function (fn, scope) {
	return function () {
		return fn.apply(scope, arguments);
	}
};

/**
 * @callback objutilsObjMapCallback
 * @param item
 * @param {string|number} key
 * @param {object} obj
 */

/**
 * Note: Returns a shallow copy of object.
 *
 * @param {object} obj
 * @param {objutilsObjMapCallback|function} fn (item, key, obj) -> (newValue)
 * @param [thisArg] optional
 * */
exports.objMap = function(obj, fn, thisArg) {
	if (thisArg) {
		fn = exports.bind(fn, thisArg);
	}

	var newObj = {};
	if (obj && fn) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				newObj[key] = fn(obj[key], key, obj);
			}
		}
	}
	return newObj;
};

/**
 * @callback objutilsObjReduceCallback
 * @param accumulated
 * @param item
 * @param {string|number} key
 * @param {object} obj
 */

/**
 * @param {object} obj
 * @param {objutilsObjReduceCallback|function}  fn (accumulated, item, key, obj) -> (newAccumulatedValue)
 * @param initialValue
 * @param [thisArg] optional
 * */
exports.objReduce = function(obj, fn, initialValue, thisArg) {
	if (thisArg) {
		fn = exports.bind(fn, thisArg);
	}

	var value = initialValue;

	if (obj && fn) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				value = fn(value, obj[key], key, obj);
			}
		}
	}
	return value;
};

/**
 * @param {object} obj
 * @param {objutilsObjMapCallback|function} fn (item, key, obj)
 * @param [thisArg] optional
 * */
exports.objForEach = function (obj, fn, thisArg) {
	if (thisArg) {
		fn = exports.bind(fn, thisArg);
	}

	for (var key in obj) {
		if (!obj.hasOwnProperty(key)) continue;
		fn(obj[key], key, obj);
	}
};

