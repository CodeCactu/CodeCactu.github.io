if (!import.meta.env.SSR) {
  console.trace( new Error( `Server side code only` ) )
  throw new Error( `Server side code only` )
}
