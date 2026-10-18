export default function createUiFromObjects<const T extends Record<string, unknown>>( objects:(undefined | null | false | T)[], render:(obj:T) => React.ReactNode ) {
  return objects.filter( (obj): obj is T => !!obj ).map( obj => render( obj ) )
}
