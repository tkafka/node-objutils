// @ts-check
/// <reference path="./objutils.d.ts" />

/**
 * Binds a function to a scope
 * @param {Function} fn - The function to bind
 * @param {Object} scope - The scope to bind the function to
 * @returns {Function} - The bound function
 * @deprecated Use the native Function.prototype.bind method instead: fn.bind(scope)
 * Replace `bind(myFunction, myObject)` with `myFunction.bind(myObject)`
 */
export function bind(fn, scope) {
	// ES6 arrow functions maintain lexical 'this'
	return (...args) => fn.apply(scope, args);
	// Note: We could also use the native fn.bind(scope), but keeping this implementation
	// as it may have specific behavior tests depend on
}

/**
 * Maps an object using the provided function.
 *
 * @template T, U
 * @param {object} obj - The object to be mapped.
 * @param {function(this:any, T, string, object):U} fn - The mapping function.
 * @param {any} [thisArg] - The `this` value for the mapping function.
 * @returns {Object.<string, U>} - A new object with the mapped values.
 * @deprecated Consider using Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value, key, obj)]))
 * Replace `objMap(myObject, myFunction)` with `Object.fromEntries(Object.entries(myObject).map(([key, value]) => [key, myFunction(value, key, myObject)]))`
 */
export function objMap(obj, fn, thisArg) {
	const newObj = /** @type {Object.<string, U>} */ ({});
	
	if (!obj || !fn) return newObj;
	
	if (thisArg) {
		const boundFn = bind(fn, thisArg);
		// Using Object.entries for cleaner iteration
		Object.entries(obj).forEach(([key, value]) => {
			if (Object.hasOwn(obj, key)) {
				newObj[key] = boundFn(value, key, obj);
			}
		});
	} else {
		Object.entries(obj).forEach(([key, value]) => {
			if (Object.hasOwn(obj, key)) {
				newObj[key] = fn(value, key, obj);
			}
		});
	}

	return newObj;
}

/**
 * Reduces an object using the provided function.
 *
 * @template T, U
 * @param {object} obj - The object to be reduced.
 * @param {function(this:any, U, T, string, object):U} fn - The reducing function.
 * @param {U} initialValue - The initial value for the reduction.
 * @param {any} [thisArg] - The `this` value for the reducing function.
 * @returns {U} - The final reduced value.
 * @deprecated Consider using Object.entries(obj).reduce((acc, [key, value]) => fn(acc, value, key, obj), initialValue)
 * Replace `objReduce(myObject, myFunction, initialValue)` with `Object.entries(myObject).reduce((acc, [key, value]) => myFunction(acc, value, key, myObject), initialValue)`
 */
export function objReduce(obj, fn, initialValue, thisArg) {
	let value = initialValue;
	
	if (!obj || !fn) return value;
	
	if (thisArg) {
		const boundFn = bind(fn, thisArg);
		Object.entries(obj).forEach(([key, val]) => {
			if (Object.hasOwn(obj, key)) {
				value = boundFn(value, val, key, obj);
			}
		});
	} else {
		Object.entries(obj).forEach(([key, val]) => {
			if (Object.hasOwn(obj, key)) {
				value = fn(value, val, key, obj);
			}
		});
	}

	return value;
}

/**
 * Iterates over an object, calling the provided function for each key-value pair.
 *
 * @template T
 * @param {object} obj - The object to iterate over.
 * @param {function(this:any, T, string, object):void} fn - The function to call for each key-value pair.
 * @param {any} [thisArg] - The `this` value for the function.
 * @returns {void}
 * @deprecated Consider using Object.entries(obj).forEach(([key, value]) => fn(value, key, obj))
 * Replace `objForEach(myObject, myFunction)` with `Object.entries(myObject).forEach(([key, value]) => myFunction(value, key, myObject))`
 */
export function objForEach(obj, fn, thisArg) {
	if (!obj || !fn) return;
	
	if (thisArg) {
		const boundFn = bind(fn, thisArg);
		Object.entries(obj).forEach(([key, value]) => {
			if (Object.hasOwn(obj, key)) {
				boundFn(value, key, obj);
			}
		});
	} else {
		Object.entries(obj).forEach(([key, value]) => {
			if (Object.hasOwn(obj, key)) {
				fn(value, key, obj);
			}
		});
	}
}

/**
 * Iterates over an object, calling the provided function for each key-value pair, sorted by the provided sort function.
 *
 * @template T
 * @param {object} obj - The object to iterate over.
 * @param {function(this:any, T, string, object):void} fn - The function to call for each key-value pair.
 * @param {function(string, string):number} sortFn - The function to sort the keys.
 * @param {any} [thisArg] - The `this` value for the function.
 * @returns {void}
 * @deprecated Consider using Object.keys(obj).sort(sortFn).forEach(key => fn(obj[key], key, obj))
 * Replace `objForEachSorted(myObject, myFunction, mySortFn)` with `Object.keys(myObject).sort(mySortFn || undefined).forEach(key => myFunction(myObject[key], key, myObject))`
 */
export function objForEachSorted(obj, fn, sortFn, thisArg) {
	if (!obj || !fn) return;
	
	// Extract keys and sort them
	const keys = Object.keys(obj).filter(key => Object.hasOwn(obj, key));
	
	if (typeof sortFn === 'function') {
		keys.sort(sortFn);
	} else {
		keys.sort();
	}
	
	if (thisArg) {
		const boundFn = bind(fn, thisArg);
		for (const key of keys) {
			boundFn(obj[key], key, obj);
		}
	} else {
		for (const key of keys) {
			fn(obj[key], key, obj);
		}
	}
}

/**
 * Filters an object using the provided function.
 *
 * @template T, U
 * @param {object} obj - The object to be filtered.
 * @param {function(this:any, T, string, object):boolean} fn - The filtering function.
 * @param {any} [thisArg] - The `this` value for the filtering function.
 * @returns {Object.<string, T>} - A new object with the filtered values.
 * @deprecated Consider using Object.fromEntries(Object.entries(obj).filter(([key, value]) => fn(value, key, obj)))
 * Replace `objFilter(myObject, myFunction)` with `Object.fromEntries(Object.entries(myObject).filter(([key, value]) => myFunction(value, key, myObject)))`
 */
export function objFilter(obj, fn, thisArg) {
	const filteredObj = /** @type {Object.<string, T>} */ ({});
	
	if (!obj || !fn) return filteredObj;
	
	if (thisArg) {
		const boundFn = bind(fn, thisArg);
		Object.entries(obj).forEach(([key, value]) => {
			if (Object.hasOwn(obj, key) && boundFn(value, key, obj)) {
				filteredObj[key] = value;
			}
		});
	} else {
		Object.entries(obj).forEach(([key, value]) => {
			if (Object.hasOwn(obj, key) && fn(value, key, obj)) {
				filteredObj[key] = value;
			}
		});
	}

	return filteredObj;
}

/**
 * Returns the length of an object.
 *
 * @param {object} obj - The object to get the length of.
 * @returns {number} - The length of the object.
 * @deprecated Use Object.keys(obj).length instead
 * Replace `objLength(myObject)` with `Object.keys(myObject).length`
 */
export function objLength(obj) {
	if (!obj) return 0;
	return Object.keys(obj).filter(key => Object.hasOwn(obj, key)).length;
}

// DFS

const _dfs = (obj, functor, path) => {
	// when we encounter the string, this if branch makes sure we don't iterate it by letters :)
	if (typeof obj === 'object' && obj !== null) {
		for (const [k, v] of Object.entries(obj)) {
			if (Object.hasOwn(obj, k)) {
				path.push(k);
				_dfs(v, functor, path);
				functor(v, k, path, typeof v !== 'object' || v === null);
				path.pop();
			}
		}
	}
};

/**
 * Performs a depth-first search on an object, calling the provided function for each value.
 *
 * @template T
 * @param {object} obj - The object to perform the depth-first search on.
 * @param {function(this:any, T, string, string[], boolean):void} functor - The function to call for each value.
 * @returns {void}
 */
export function dfs(obj, functor) {
	_dfs(obj, functor, []);
}

const _dfsMod = (obj, functor, path) => {
	// when we encounter the string, this if branch makes sure we don't iterate it by letters :)
	if (typeof obj === 'object' && obj !== null) {
		// first functor, to allow renaming keys
		for (const [k, v] of Object.entries(obj)) {
			if (Object.hasOwn(obj, k)) {
				path.push(k);
				functor(v, k, obj, path, typeof v !== 'object' || v === null);
				path.pop();
			}
		}

		for (const [k, v] of Object.entries(obj)) {
			if (Object.hasOwn(obj, k)) {
				path.push(k);
				_dfsMod(v, functor, path);
				path.pop();
			}
		}
	}
};

/**
 * Performs a depth-first search on an object, calling the provided function for each value and modifying the object.
 *
 * @template T
 * @param {object} obj - The object to perform the depth-first search on.
 * @param {function(this:any, T, string, object, string[], boolean):void} functor - The function to call for each value.
 * @returns {void}
 */
export function dfsMod(obj, functor) {
	_dfsMod(obj, functor, []);
}

// legacy export with property shorthand
export default {
  bind,
  objMap,
  objReduce,
  objForEach,
  objForEachSorted,
  objFilter,
  objLength,
  dfs,
  dfsMod,
};
