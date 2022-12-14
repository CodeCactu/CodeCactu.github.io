import { Asyncable } from "../types/enhancedTypes"

export type AsyncableRecord<Key extends string, Value> = Asyncable<Record<Key, Value>>
export type StorageKeyInterface<V> = {
  set: ( value:V ) => Promise<V>
  get: ( defaultValue?:V ) => Promise<V>
  delete: () => Promise<V>
}

export type KeysArr<K> =
  | [K, K, K, K, K]
  | [K, K, K, K]
  | [K, K, K]
  | [K, K]
  | [K]

export default abstract class Storage<Value, Key extends string> {
  abstract getkeys(): undefined | Key[]

  abstract set( key:Key, value:Value ): AsyncableRecord<Key, Value>
  abstract setMany( items:Record<Key, Value> ): AsyncableRecord<Key, Value>

  abstract get( key:Key, defaultValue?:Value ): Asyncable<undefined | Value>
  abstract getMany( keys?:Key[] | Record<Key, Value>): AsyncableRecord<Key, undefined | Value>

  abstract delete( key:Key ): Asyncable<undefined | Value>
  abstract deleteMany( keys:Key[] ): AsyncableRecord<Key, undefined | Value>
  abstract clear(): AsyncableRecord<Key, undefined | Value>

  abstract getSubstorageForKeys<Subkey extends Key>( keys:KeysArr<Subkey> ): Storage<Value, Subkey>
}
