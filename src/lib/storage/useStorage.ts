import { useEffect, useMemo } from "react"
import useMediator from "../mediator/useMediator"
import { useObjectState } from "../core/hooks/useObjectState"
import MediatoredStorage from "./MediatoredStorage"

type ReturnValue<K extends string, V extends unknown, Storage extends MediatoredStorage<any, any, any>, Values extends unknown> =
  | ReturnType<Storage["getMany"]> extends Promise<any>
    ? [null | Record<K, V>, (newValues:Values) => void]
    : [Record<K, V>, (newValues:Values) => void]

export default function useStorage<
  V,
  Values extends Record<K, V>,
  K extends string = string,
  PK extends string = string,
>(
  storage:MediatoredStorage<V, K, PK>,
): [null | Record<K, V>, (newValues:Values) => void]  {
  const initialValue = useMemo<null | Record<K, V>>( () => {
    const values = storage.getMany()

    return values instanceof Promise ? null : values
  }, [] )

  const [ values, setValues ] = useObjectState( initialValue )
  const valuesSetter = (newValues:Values) => {
    storage.setMany( newValues )
  }

  useEffect( () => {
    const keys = storage.getkeys()

    if (!keys) throw new Error( `You have to provide storage with limited keys` )

    const values = storage.getMany()

    setValues( values instanceof Promise ? null : values )
  }, [] )

  useMediator( storage.mediator, `update`, values => setValues( values ) )

  return [ values, valuesSetter ] as ReturnValue<K, V, typeof storage, Values>
}
