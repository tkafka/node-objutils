exports.bind = function (fn, scope) {
	return function () {
		return fn.apply(scope, arguments);
	}
};

/**
 * @param obj
 * @param fn (item, key, obj) -> (newValue)
 * @param thisArg optional
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
 * @param obj
 * @param fn (accumulated, item, key) -> (newAccumulatedValue)
 * @param initialValue
 * @param thisArg optional
 * */
exports.objReduce = function(obj, fn, initialValue, thisArg) {
	if (thisArg) {
		fn = exports.bind(fn, thisArg);
	}

	var value = initialValue;

	if (obj && fn) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				value = fn(value, obj[key], key);
			}
		}
	}
	return value;
};

/**
 * @param obj
 * @param fn (item, key, obj)
 * @param thisArg optional
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

