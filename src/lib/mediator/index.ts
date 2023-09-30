export type MedEvents<T extends Mediator<any>> = T extends Mediator<infer Events> ? Events : never
export type MedEventsNames<T extends Mediator<any>> = keyof MedEvents<T>
export type MediatorEvents<K extends string = string> = Record<K, (...args) => void>
export type MediatorListenersOptions = {
  initWithLastValue?: boolean
}

type MediatorUnsubscriber = () => void
export interface IMediator {
  mediator: Mediator<any>
}

type MediatorData<Events extends MediatorEvents> = {
  lastValue: undefined | Parameters<Events[keyof Events]>
  listeners: Set<Events[keyof Events]>
}
export type MediatorDataset<Events extends MediatorEvents> = Map<keyof Events, MediatorData<Events>>

export class Mediator<Events extends MediatorEvents> {
  #dataset: MediatorDataset<Events> = new Map()

  addEventListener( eventname:keyof Events, callback:Events[keyof Events] ) {
    this.on( eventname, callback )
  }
  on( eventname:keyof Events, callback:Events[keyof Events], { initWithLastValue = false }:MediatorListenersOptions = {} ): MediatorUnsubscriber {
    const dataset = this.#dataset

    if (!dataset.has( eventname )) dataset.set( eventname, {
      lastValue: undefined,
      listeners: new Set(),
    } )

    const data = dataset.get( eventname )!

    data.listeners.add( callback )

    if (initWithLastValue && data.listeners) callback( ...data.listeners )

    return () => { data.listeners.delete( callback ) }
  }

  dispatch( eventname:keyof Events, ...args:Parameters<Events[typeof eventname]> ) {
    const data = this.#dataset.get( eventname )

    if (!data) return

    data.lastValue = args
    data.listeners.forEach( cb => cb( ...args ) )
  }
}

export default Mediator
