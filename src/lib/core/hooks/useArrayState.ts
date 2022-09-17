import { useState } from "react"

type ArWithAtLeastOneItem<T> = T[]

export type UseArrayStateActions<TValue = unknown> = {
  push: (...items:TValue[]) => void
  unshift: (...items:TValue[]) => void
  pop: (count?:number) => void
  shift: (count:number) => void
  remove: (...items:TValue[]) => void
  removeFound: (predicate:(item:TValue) => boolean) => void
  replaceFound: (item:TValue, predicate:(item:TValue) => boolean) => void
}
export type UseArrayStateReturnValue<TValue = unknown> = [readonly TValue[], UseArrayStateActions<TValue>]

export default function useArrayState<TValue = unknown>( initialValues:TValue[] = [] ): UseArrayStateReturnValue<TValue> {
  const [ items, setItems ] = useState<TValue[]>(initialValues)

  const push = (...items:TValue[]) => setItems( i => [ ...i, ...items ] )
  const unshift = (...items:TValue[]) => setItems( i => [ ...items, ...i ] )

  const pop = (count = 1) => setItems( i => [ ...i.slice( 0, -count ) ] )
  const shift = (count = 1) => setItems( i => [ ...i.slice( count ) ] )

  const remove = (...items:TValue[]) => setItems( i => i.filter( j => !items.includes( j ) ) )
  const removeFound = (predicate:(item:TValue) => boolean) =>
    setItems( items => {
      const newItems = items.filter( item => !predicate( item ) )

      if (newItems.length !== items.length) return [ ...newItems ]

      return items
    } )

  const replaceFound = (item:TValue, predicate:(item:TValue) => boolean) =>
    setItems( items => {
      let replaced = false
      const newItems = items.map( it => {
        if (!predicate( it )) return it
        replaced = true
        return item
      } )

      if (replaced) return [ ...newItems ]
      return items
    } )

  return [ items, { push, unshift, pop, shift, remove, removeFound, replaceFound } ]
}

// function Test() {
//   const [ arr_1, arrActions_1 ] = useArrayState()
//   const [ arr_2, arrActions_2 ] = useArrayState<number>()

//   const length = arr_1.length
//   const unknownItem_1:unknown = arr_1[ 5 ]
//   const unknownItem_2:unknown = arr_2[ 5 ]
//   const numItem_1:number = arr_1[ 5 ]
//   const numItem_2:number = arr_2[ 5 ]

//   console.log( length, unknownItem_1, unknownItem_2, numItem_1, numItem_2 )

//   arrActions_1.pop()
//   arrActions_1.pop( 2 )
//   arrActions_1.push()
//   arrActions_1.push( 2 )
//   arrActions_1.push( `str` )
//   arrActions_1.remove()
//   arrActions_1.remove( 2 )
//   arrActions_1.remove( `str` )
//   arrActions_1.removeFound()
//   arrActions_1.removeFound( `str` )
//   arrActions_1.removeFound( item => item === `str` )
//   arrActions_1.shift()
//   arrActions_1.shift( 2 )
//   arrActions_1.unshift()
//   arrActions_1.unshift( 2 )
//   arrActions_1.unshift( `str` )

//   arrActions_2.pop()
//   arrActions_2.pop( 2 )
//   arrActions_2.push()
//   arrActions_2.push( 2 )
//   arrActions_2.push( `str` )
//   arrActions_2.remove()
//   arrActions_2.remove( 2 )
//   arrActions_2.remove( `str` )
//   arrActions_2.removeFound()
//   arrActions_2.removeFound( `str` )
//   arrActions_2.removeFound( num => num === `str` )
//   arrActions_2.removeFound( num => num === 2 )
//   arrActions_2.shift()
//   arrActions_2.shift( 2 )
//   arrActions_2.unshift()
//   arrActions_2.unshift( 2 )
//   arrActions_2.unshift( `str` )
// }
