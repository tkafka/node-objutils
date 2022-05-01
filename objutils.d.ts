export function bind(fn: function, scope: any): function

export function objMap(obj: object, fn: (item: any, key: string, obj: object) => any, thisArg?: any): object

export function objReduce(obj: object, fn: (accumulated: any, item: any, key: string, obj: object) => any, initialValue: any, thisArg?: any): object

export function objForEach(obj: object, fn: (item: any, key: string, obj: object) => undefined, thisArg?: any): undefined
export function objForEachSorted(obj: object, fn: (item: any, key: string, obj: object) => undefined, sortFn: function, thisArg?: any): undefined

export function objFilter(obj: object, fn: (item: any, key: string, obj: object) => boolean, thisArg?: any): object

export function objLength(obj: object): number

export function dfs(obj: object, functor: (value: any, key: string, path: string[], isLeaf: boolean) => undefined): number
export function dfsMod(obj: object, functor: (value: any, key: string, path: string[], isLeaf: boolean) => undefined): number


