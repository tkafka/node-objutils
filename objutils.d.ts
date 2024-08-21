/**
 * Binds a function to a specific scope.
 *
 * @template T
 * @param fn - The function to be bound.
 * @param scope - The scope to bind the function to.
 * @returns The bound function.
 */
export function bind<T>(
  fn: (this: T, ...args: any[]) => any,
  scope: T
): (...args: any[]) => any;

/**
 * Maps an object using the provided function.
 *
 * @template T, U
 * @param obj - The object to be mapped.
 * @param fn - The mapping function.
 * @param thisArg - The `this` value for the mapping function.
 * @returns A new object with the mapped values.
 */
export function objMap<T, U>(
  obj: Record<string, T>,
  fn: (this: any, value: T, key: string, object: Record<string, T>) => U,
  thisArg?: any
): Record<string, U>;

/**
 * Reduces an object using the provided function.
 *
 * @template T, U
 * @param obj - The object to be reduced.
 * @param fn - The reducing function.
 * @param initialValue - The initial value for the reduction.
 * @param thisArg - The `this` value for the reducing function.
 * @returns The final reduced value.
 */
export function objReduce<T, U>(
  obj: Record<string, T>,
  fn: (
    this: any,
    accumulator: U,
    value: T,
    key: string,
    object: Record<string, T>
  ) => U,
  initialValue: U,
  thisArg?: any
): U;

/**
 * Iterates over an object, calling the provided function for each key-value pair.
 *
 * @template T
 * @param obj - The object to iterate over.
 * @param fn - The function to call for each key-value pair.
 * @param thisArg - The `this` value for the function.
 */
export function objForEach<T>(
  obj: Record<string, T>,
  fn: (this: any, value: T, key: string, object: Record<string, T>) => void,
  thisArg?: any
): void;

/**
 * Iterates over an object, calling the provided function for each key-value pair, sorted by the provided sort function.
 *
 * @template T
 * @param obj - The object to iterate over.
 * @param fn - The function to call for each key-value pair.
 * @param sortFn - The function to sort the keys.
 * @param thisArg - The `this` value for the function.
 */
export function objForEachSorted<T>(
  obj: Record<string, T>,
  fn: (this: any, value: T, key: string, object: Record<string, T>) => void,
  sortFn: (a: string, b: string) => number,
  thisArg?: any
): void;

/**
 * Filters an object using the provided function.
 *
 * @template T, U
 * @param obj - The object to be filtered.
 * @param fn - The filtering function.
 * @param thisArg - The `this` value for the filtering function.
 * @returns A new object with the filtered values.
 */
export function objFilter<T, U>(
  obj: Record<string, T>,
  fn: (this: any, value: T, key: string, object: Record<string, T>) => boolean,
  thisArg?: any
): Record<string, T>;

/**
 * Returns the length of an object.
 *
 * @param obj - The object to get the length of.
 * @returns The length of the object.
 */
export function objLength(obj: object): number;

/**
 * Performs a depth-first search on an object, calling the provided function for each value.
 *
 * @template T
 * @param obj - The object to perform the depth-first search on.
 * @param functor - The function to call for each value.
 */
export function dfs<T>(
  obj: object,
  functor: (
    this: any,
    value: T,
    key: string,
    path: string[],
    isLeaf: boolean
  ) => void
): void;

/**
 * Performs a depth-first search on an object, calling the provided function for each value and modifying the object.
 *
 * @template T
 * @param obj - The object to perform the depth-first search on.
 * @param functor - The function to call for each value.
 */
export function dfsMod<T>(
  obj: object,
  functor: (
    this: any,
    value: T,
    key: string,
    object: object,
    path: string[],
    isLeaf: boolean
  ) => void
): void;

export default {
  bind: typeof bind,
  objMap: typeof objMap,
  objReduce: typeof objReduce,
  objForEach: typeof objForEach,
  objForEachSorted: typeof objForEachSorted,
  objFilter: typeof objFilter,
  objLength: typeof objLength,
  dfs: typeof dfs,
  dfsMod: typeof dfsMod,
};
