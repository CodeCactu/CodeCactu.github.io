import Mediator, { IMediator, MediatorListenersOptions } from "../mediator"
import Storage from "."

export type MediatoredStorageEvents<Value, Key extends string = string> = {
  update: (updatedValues:Record<Key, undefined | Value>) => void
  test: (a:number, b:2) => void
}

type Ev<Value, Key extends string> = MediatoredStorageEvents<Value, Key>

export default abstract class MediatoredStorage<
  Value,
  Key extends string = string,
  ParentKey extends string=string,
  Values extends Record<Key, Value> = Record<string, Value>,
> extends Storage<Value, Key> implements IMediator {
  mediator: Mediator<MediatoredStorageEvents<Value, Key>> = new Mediator<Ev<Value, Key>>()

  constructor( parentStorage?:MediatoredStorage<Value, ParentKey> ) {
    super()

    parentStorage?.on( `update`, v => this.#handleParentUpdate( v ) )
  }

  on( eventname:keyof Ev<Value, Key>, callback:Ev<Value, Key>[keyof Ev<Value, Key>], options?:MediatorListenersOptions ) {
    return this.mediator.on( eventname, callback, options )
  }

  protected dispatchNewValues( data:Values ) {
    this.mediator.dispatch( `update`, data )
  }

  protected dispatchRemovedValues( data:Values ) {
    const clearedEntries = Object.entries( data ).map( ([ k ]) => [ k, undefined ] )

    this.mediator.dispatch( `update`, Object.fromEntries( clearedEntries ) )
  }

  #handleParentUpdate( updatedValues:Record<Key, undefined | Value> ) {
    const keys = this.getkeys()
    let filteredValuesEntries = Object.entries( updatedValues ) as [Key, undefined | Value][]

    if (keys) {
      filteredValuesEntries = filteredValuesEntries.filter( ([ k ]) => keys.includes( k as Key ) )
      if (!filteredValuesEntries.length) return
    }

    const filteredValues = Object.fromEntries( filteredValuesEntries ) as Values

    this.mediator.dispatch( `update`, filteredValues )
  }
}

