/* eslint-disable @typescript-eslint/no-explicit-any */

/* UTILS */

type AnyFn = (...params:any[]) => any


type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]]

type UnionToIntersection<U> = (U extends any ? (k:U) => void : never) extends ((k:infer I) => void) ? I : never

type Join<K, P> =
  | K extends string | number
    ? P extends string | number
      ? `${K}${`` extends P ? `` : `.`}${P}`
      : never
    : never;


/* MAIN TYPES */


type Paths<T, U = never, D extends number = 5> =
  | [D] extends [never]
    ? never
    : T extends U
      ? ``
      : T extends object
        ? { [Key in keyof T]-?:Key extends string | number  ?  (`${Key}` | Join<Key, Paths<T[Key], U, Prev[D]>>)  :  never }[keyof T]
        : ``

type Leaves<T, FilterVal = never, StrictFilter extends boolean = false, D extends number = 6> =
  | [D] extends [never]
    ? never
    : T extends FilterVal
      ? StrictFilter extends true ? never : ``
      : T extends object
        ? { [Key in keyof T]-?:T[Key] extends AnyFn
          ? T[Key] extends FilterVal ? (StrictFilter extends true ? never : ``) : Key
          : Join<Key, Leaves<T[Key], FilterVal, StrictFilter, Prev[D]>>
        }[keyof T]
        : ``;

type LeavesValues<T, U = never, D extends number = 5> =
  | [D] extends [never]
    ? never
    : T extends object
      ? { [Key in keyof T]-?:T[Key] extends object
        ? T[Key] extends U | AnyFn
          ? { [K in Key]:T[Key] }
          : LeavesValues<T[Key], U, Prev[D]> extends infer Obj ? { [K in keyof Obj as Join<Key, K>]:Obj[K] } : never
        : { [K in Key]:T[Key] }
      }[keyof T] extends infer Obj
        ? UnionToIntersection<Obj> extends infer IntersectedObj ? { [k in keyof IntersectedObj]:IntersectedObj[k] } : never
        : never
      : T

type DefinedValues<T, V, D extends number = 5> =
  | [D] extends [never]
    ? never
    : T extends V
      ? T
      : T extends object
        ? T extends AnyFn
          ? never
          : { [K in keyof T]:K extends string ? DefinedValues<T[K], V, Prev[D]> : never }
        : never

type Recurention<T, D extends number = 5> =
  | [D] extends [never]
    ? never
    : { [key:string]: T | Recurention<T, Prev[D]> }

type ValueFromKeysChain<T extends Record<string, any>, KChain extends string, D extends number = 5> =
  | [D] extends [never]
    ? never
    : KChain extends `${infer S}.${infer Next}`
      ? ValueFromKeysChain<T[S], Next, Prev[D]>
      : T[KChain]


type GetObjDifferentKeys<T, U> = Omit<T, keyof U> & Omit<U, keyof T>
type GetObjSameKeys<T, U> = Omit<T | U, keyof GetObjDifferentKeys<T, U>>
type MergeTwoObjects<T, U> = GetObjDifferentKeys<T, U> & { [K in keyof GetObjSameKeys<T, U>]:ObjectsDeepMerge<T[K], U[K]> }
type DeepMergeTwoTypes<T, U> =
  | [T, U] extends [{ [key:string]: unknown }, { [key:string]: unknown } ]
    ? MergeTwoObjects<T, U>
    : U

type ObjectFilter<T extends Record<string, unknown>, Filter> = { [Key in keyof T]:T[Key] extends Filter ? T[Key] : never }
type ObjectFilterPicker<T extends Record<string, unknown>, U> = ObjectFilter<T, U> extends infer V ? Pick<V, { [K in keyof V]:V[K] extends never ? never : K }[keyof V]> : never

type ObjectFilterByInclude<T extends Record<string, unknown>, Filter> = { [Key in keyof T]:Filter extends T[Key] ? T[Key] : never }
type ObjectFilterPickerByInclude<T extends Record<string, unknown>, U> = ObjectFilterByInclude<T, U> extends infer V ? Pick<V, { [K in keyof V]:V[K] extends never ? never : K }[keyof V]> : never



/* EXPORTED ABSTRACTION */


// example: type Obj = { a:1, b:"two", next:{ c:3 }, otherNest:{ c:() => void } }

// example: type ObjectPaths<Obj> = "a" | "b" | "nest" | "otherNest" | "nest.c" | "otherNest.c"
export type ObjectPaths<TObj, ValueFilter = never> = Paths<TObj, ValueFilter>;

// example: type ObjectLeaves<Obj> = "a" | "b" | "nest.c" | "otherNest.c"
export type ObjectLeaves<TObj, ValueFilter = never, ExcludeFilter extends boolean = false> = Leaves<TObj, ValueFilter, ExcludeFilter>

// example: type ObjectLeavesValues<Obj> = {"a":1, "b":'two', "nest.c":3, "otherNest.c":()=>void }
export type ObjectLeavesValues<TObj, ValueFilter = never> = LeavesValues<TObj, ValueFilter>

// example: type ObjectWithDefinedValues<Obj, number> = never
// example: type ObjectWithDefinedValues<Obj, number | string | () => void> = Obj
export type ObjectWithDefinedValues<TObj, Values = string | number> = DefinedValues<TObj, Values>

// example: type RecursiveObject<string | number> = Record<string, string | number | Record<string, string | number | Record<...>>>
export type RecursiveObject<Value> = Recurention<Value>

// example: type ObjectValueFromKeysChain<Obj, "next.c""> = 3
export type ObjectValueFromKeysChain<TObj extends Record<string, any>, KeysChain extends string> = ValueFromKeysChain<TObj, KeysChain>

// example: type DeepMergeTwoTypes<Obj, { otherNest:"otherNest", d:4 }> = { a:1, b:"two", next:{ c:3 }, otherNest:"otherNest", d:4 }
export type ObjectsDeepMerge<T, U> = DeepMergeTwoTypes<T, U>

// example: type FilterObject<Obj, number> = { a:1 }
export type FilterObject<T extends Record<string, unknown>, U> = ObjectFilterPicker<T, U>

// example: type FilterObject<Obj, number> = { a:1 }
export type FilterObjectByInclude<T extends Record<string, unknown>, U> = ObjectFilterPickerByInclude<T, U>

