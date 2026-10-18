export * from "./CountTuple"
export * from "./ObjectKeys"

export type TODO<T> = T
export type Primitive = string | number | boolean
export type OnlyPrimitiveFields<T extends Record<string, unknown>> = { [K in keyof T]:T[K] extends Primitive ? T[K] : never }
export type EmailString = `${string}@${string}.${string}`
export type FullDateFormatString = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
export type NumberString = `${number}` | `${number}.${number}`
export type Asyncable<T> = T | Promise<T>
export type AbsolutePath = `/${string}`
export type URLString = `http${`s` | ``}://${string}.${string}`
export type Arrayable<T> = T | T[]
export type Promiseable<T> = T | Promise<T>
export type Override<What, With> = Omit<What, keyof With> & With

export type OptionalExcess<Shape extends Record<string, unknown>, RequiredShape extends Record<string, unknown>> =
  | Partial<Shape> & Required<RequiredShape>

export type JSONValue =
  | null
  | string
  | number
  | boolean
  | Date
  | { [x:string]: JSONValue }
  | Array<JSONValue>;

export type ObjectJSONValue = Record<string, JSONValue>
export type OnlyFields<T> = {
  [K in keyof T as T[K] extends (...params:unknown[]) => unknown ? never : K]:T[K];
}
