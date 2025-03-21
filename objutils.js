/**
 * Binds a function to a scope
 * @param {Function} fn - The function to bind
 * @param {Object} scope - The scope to bind the function to
 * @returns {Function} - The bound function
 */
export function bind(fn, scope) {
	return (...args) => fn.apply(scope, args);
}

/**
 * Maps an object using the provided function.
 *
 * @template T, U
 * @param {object} obj - The object to be mapped.
 * @param {function(this:any, T, string, object):U} fn - The mapping function.
 * @param {any} [thisArg] - The `this` value for the mapping function.
 * @returns {Object.<string, U>} - A new object with the mapped values.
 */
export function objMap(obj, fn, thisArg) {
	const newObj = /** @type {Object.<string, U>} */ ({});
	let key;

	if (thisArg) {
		const boundFn = bind(fn, thisArg);
		for (key in obj) {
			if (Object.hasOwn(obj, key)) {
				newObj[key] = boundFn(obj[key], key, obj);
			}
		}
	} else if (obj && fn) {
		for (key in obj) {
			if (Object.hasOwn(obj, key)) {
				newObj[key] = fn(obj[key], key, obj);
			}
		}
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
 */
export function objReduce(obj, fn, initialValue, thisArg) {
	let value = initialValue;
	let key;

	if (thisArg) {
		const boundFn = bind(fn, thisArg);
		if (obj) {
			for (key in obj) {
				if (Object.hasOwn(obj, key)) {
					value = boundFn(value, obj[key], key, obj);
				}
			}
		}
	} else if (obj && fn) {
		for (key in obj) {
			if (Object.hasOwn(obj, key)) {
				value = fn(value, obj[key], key, obj);
			}
		}
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
 */
export function objForEach(obj, fn, thisArg) {
	let key;

	if (thisArg) {
		const boundFn = bind(fn, thisArg);
		for (key in obj) {
			if (Object.hasOwn(obj, key)) {
				boundFn(obj[key], key, obj);
			}
		}
	} else {
		for (key in obj) {
			if (Object.hasOwn(obj, key)) {
				fn(obj[key], key, obj);
			}
		}
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
 */
export function objForEachSorted(obj, fn, sortFn, thisArg) {
	const keys = [];
	let key;
	let i;

	if (thisArg) {
		const boundFn = bind(fn, thisArg);

		for (key in obj) {
			if (Object.hasOwn(obj, key)) {
				keys.push(key);
			}
		}

		if (typeof sortFn === 'function') {
			keys.sort(sortFn);
		} else {
			keys.sort();
		}

		for (i = 0; i < keys.length; i++) {
			boundFn(obj[keys[i]], keys[i], obj);
		}
	} else {
		for (key in obj) {
			if (Object.hasOwn(obj, key)) {
				keys.push(key);
			}
		}

		if (typeof sortFn === 'function') {
			keys.sort(sortFn);
		} else {
			keys.sort();
		}

		for (i = 0; i < keys.length; i++) {
			fn(obj[keys[i]], keys[i], obj);
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
 */
export function objFilter(obj, fn, thisArg) {
	const filteredObj = /** @type {Object.<string, T>} */ ({});
	let key;

	if (thisArg) {
		const boundFn = bind(fn, thisArg);
		for (key in obj) {
			if (Object.hasOwn(obj, key) && boundFn(obj[key], key, obj)) {
				filteredObj[key] = obj[key];
			}
		}
	} else {
		for (key in obj) {
			if (Object.hasOwn(obj, key) && fn(obj[key], key, obj)) {
				filteredObj[key] = obj[key];
			}
		}
	}

	return filteredObj;
}

/**
 * Returns the length of an object.
 *
 * @param {object} obj - The object to get the length of.
 * @returns {number} - The length of the object.
 */
export function objLength(obj) {
	let l = 0;
	let key;

	for (key in obj) {
		if (Object.hasOwn(obj, key)) {
			l += 1;
		}
	}
	return l;
}

// DFS

const _dfs = (obj, functor, path) => {
	let k;

	// when we encounter the string, this if branch makes sure we don't iterate it by letters :)
	if (typeof obj === 'object') {
		for (k in obj) {
			if (Object.hasOwn(obj, k)) {
				path.push(k);
				_dfs(obj[k], functor, path);
				functor(obj[k], k, path, typeof obj[k] !== 'object');
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
	let k;

	// when we encounter the string, this if branch makes sure we don't iterate it by letters :)
	if (typeof obj === 'object') {
		// first functor, to allow renaming keys
		for (k in obj) {
			if (Object.hasOwn(obj, k)) {
				path.push(k);
				functor(obj[k], k, obj, path, typeof obj[k] !== 'object');
				path.pop();
			}
		}

		for (k in obj) {
			if (Object.hasOwn(obj, k)) {
				path.push(k);
				_dfsMod(obj[k], functor, path);
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
