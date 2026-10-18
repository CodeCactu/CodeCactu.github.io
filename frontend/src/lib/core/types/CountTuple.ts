export type Tuple<T, L extends number, Arr extends unknown[] = []> =
  | Arr[`length`] extends L
    ? Arr
    : Tuple<T, L, [...Arr, T]>;

type TupleCounter<Tuple extends readonly unknown[], ToFind, CountArr extends unknown[] = []> =
  | Tuple extends readonly [infer First, ...infer Tail]
    ? First extends ToFind
      ? TupleCounter<Tail, ToFind, [...CountArr, unknown]>
      : TupleCounter<Tail, ToFind, CountArr>
    : Tuple extends []
      ? CountArr[`length`]
      : never

type NegativeTupleCounter<Tuple extends readonly unknown[], ToFind, CountArr extends unknown[] = []> =
  | Tuple extends readonly [infer First, ...infer Tail]
    ? First extends ToFind
      ? NegativeTupleCounter<Tail, ToFind, CountArr>
      : NegativeTupleCounter<Tail, ToFind, [...CountArr, unknown]>
    : Tuple extends []
      ? CountArr[`length`]
      : never

export type TupleCount<Tuple extends readonly unknown[], ToFind> = TupleCounter<Tuple, ToFind>
export type NegativeTupleCount<Tuple extends readonly unknown[], ToFind> = NegativeTupleCounter<Tuple, ToFind>

export type FilterTuple<T, Pred> =
  | T extends [infer Head, ...infer Tail]
    ? [Head] extends [Pred]
      ? [ Head, ...FilterTuple<Tail, Pred> ]
      : FilterTuple<Tail, Pred>
    : []
