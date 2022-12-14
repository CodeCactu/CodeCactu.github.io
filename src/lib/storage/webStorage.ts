import { JSONValue } from "../core/types"
import getWindow from "../core/functions/getWindow"
import { KeysArr } from "."
import webStorageDummy from "./webStorageDummy"
import MediatoredStorage from "./MediatoredStorage"

class WebStorage<Key extends string = string, ParentKey extends string=string> extends MediatoredStorage<JSONValue, Key, ParentKey> {
  #nativeStorage:globalThis.Storage
  #keys:undefined | Key[]

  constructor( nativeStorage:globalThis.Storage, keys?:Key[], parentStorage?:WebStorage<ParentKey> ) {
    super( parentStorage )
    this.#nativeStorage = nativeStorage
    this.#keys = keys
  }

  getkeys = (): undefined | Key[] => this.#keys ? [ ...this.#keys ] : undefined
  getSubstorageForKeys = <Subkey extends Key>( keys:KeysArr<Subkey> ): WebStorage<Subkey, Key> => new WebStorage( this.#nativeStorage, keys, this )

  set( key:Key, value:JSONValue ): Record<Key, JSONValue> {
    this.#nativeStorage.setItem( key, JSON.stringify( value ) )
    super.dispatchNewValues( { [ key ]:value } as Record<Key, JSONValue> )

    return { [ key ]:value } as Record<Key, JSONValue>
  }
  setMany( items:Record<Key, JSONValue> ): Record<Key, JSONValue> {
    Object.entries( items ).forEach( ([ k, v ]) => this.#nativeStorage.setItem( k, JSON.stringify( v ) ) )

    super.dispatchNewValues( items )

    return items
  }

  get( key:Key, defaultValue?:JSONValue ): JSONValue {
    const item = this.#nativeStorage.getItem( key )
    let value

    try {
      value = item ? JSON.parse( item ) : undefined
    } catch {
      value = undefined
    }

    if (!value && defaultValue) {
      this.#nativeStorage.setItem( key, JSON.stringify( defaultValue ) )

      value = defaultValue
    }

    return value
  }
  getMany( keys?:Key[] | Record<Key, JSONValue> ): Record<Key, JSONValue> {
    if (!keys) {
      if (this.#keys) keys = this.#keys
      else {
        const entries = Object.entries<JSONValue>( this.#nativeStorage )
        return Object.fromEntries( entries ) as Record<Key, JSONValue>
      }
    }

    const entries = (Array.isArray( keys ) ? keys.map( k => [ k ] ) : Object.entries( keys )) as [string, undefined | JSONValue][]

    const values = entries.reduce( (obj, [ k, v ]) => {
      const item = this.#nativeStorage.getItem( k )
      const value = item ? JSON.parse( item ) : undefined

      if (!value && v) this.#nativeStorage.setItem( k, JSON.stringify( v ) )

      return { ...obj, [ k ]:value }
    }, {} ) as Record<Key, JSONValue>

    return values
  }

  delete( key:Key ): JSONValue {
    const item = this.#nativeStorage.getItem( key )
    const value = item ? JSON.parse( item ) : undefined

    this.#nativeStorage.removeItem( key )
    super.dispatchRemovedValues( { [ key ]:value } as Record<Key, JSONValue> )

    return value
  }
  deleteMany( keys:Key[] ): Record<Key, JSONValue> {
    const values = keys.reduce( (obj, k) => {
      const item = this.#nativeStorage.getItem( k )
      const value = item ? JSON.parse( item ) : undefined

      this.#nativeStorage.removeItem( k )

      return { ...obj, [ k ]:value }
    }, {} ) as Record<Key, JSONValue>

    super.dispatchRemovedValues( values )

    return values
  }
  clear(): Record<Key, JSONValue> {
    const keys = this.#keys

    if (keys) {
      const values = this.deleteMany( keys )
      super.dispatchRemovedValues( values )
      return values
    }

    const values = this.getMany()
    this.#nativeStorage.clear()
    super.dispatchRemovedValues( values )
    return values
  }
}

const window = getWindow()
export const localStorage:WebStorage = new WebStorage( window ? window.localStorage : webStorageDummy )
export const sessionStorage = new WebStorage( window ? window.sessionStorage : webStorageDummy )
