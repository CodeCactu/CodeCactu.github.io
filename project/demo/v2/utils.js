/* Small helpers shared by cast.js and main.js */

// Mixes two hex colours into a hex colour (the worlds read their colours as hex)
function mix( from, to, amount ) {
  const [ fromR, fromG, fromB ] = hexToRgb( from )
  const [ toR, toG, toB ] = hexToRgb( to )
  const channel = (a, b) => Math.round( a + (b - a) * amount ).toString( 16 ).padStart( 2, `0` )

  return `#${channel( fromR, toR )}${channel( fromG, toG )}${channel( fromB, toB )}`
}

// A small seeded random generator, so every field keeps its shape between visits and resizes
function seeded( seed ) {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = Math.imul( state ^ (state >>> 15), 1 | state )
    value ^= value + Math.imul( value ^ (value >>> 7), 61 | value )
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}
