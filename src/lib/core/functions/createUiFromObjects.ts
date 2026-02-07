export default function createUiFromObjects<const T extends Record<string, unknown>>( objects:(undefined | null | false | T)[], render:(obj:T, index:number) => React.ReactNode ) {
  return objects.filter( (obj): obj is T => !!obj ).map( (obj, i) => render( obj, i ) )
}
