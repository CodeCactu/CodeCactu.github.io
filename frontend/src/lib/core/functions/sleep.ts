export default async function sleep( seconds:number ) {
  await new Promise( r => setTimeout( r, 1000 * seconds ) )
}
