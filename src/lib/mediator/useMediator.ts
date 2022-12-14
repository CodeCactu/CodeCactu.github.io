import { useEffect, useRef, useState } from "react"
import Mediator, { MedEvents, MediatorListenersOptions } from "."

export default function useMediator<
  Med extends Mediator<any>,
  Ev extends MedEvents<Med>,
  EvName extends keyof Ev,
  EvHand extends Ev[EvName],
  EvHandParams extends Parameters<EvHand>,
>(
  mediator:Med,
  eventname:EvName,
  handler?:EvHand,
  options?:MediatorListenersOptions,
) {
  const [ cbArgs, setCbArgs ] = useState<EvHandParams>()
  const firstRunRef = useRef( true )

  useEffect( () => mediator.on( eventname, (...args:EvHandParams) => {
    if (handler) handler( ...args )
    else setCbArgs( args )
  }, options ), [] )

  return [ cbArgs, firstRunRef.current ]
}
