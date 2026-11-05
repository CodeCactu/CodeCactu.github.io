/* The edges of the zones, drawn like the letters of the cactu font */

/*
  The cactu letters are built from straight strokes that meet in round corners: the outer corners are wide and round, the
  inner ones are tight. Every zone edge on the page follows that rule. A shape is first laid out as cells of a grid (G CSS px),
  so its steps stay calm and orthogonal like the letters; its outline is then traced and every corner is rounded, convex ones
  with CURVE.convex, concave ones with CURVE.concave. Where two corners share a short stroke, both shrink in proportion.
*/

// One cell of the shapes' grid, in CSS px
const G = 12

// Corner radii in CSS px, and how far the corners bulge (0.55 is a circle; more is squarer, like the font's corners)
const CURVE = { convex:26, concave:9, roundness:0.62 }

// Cells added around a flush side, so its outline runs outside the field's box and never shows
const FLUSH_PAD = 6

/**
 * Traces the outline of the cells where isInside( x, y ) is true, between `from` and `to` (cells, exclusive), clockwise,
 * as the corners of an orthogonal polygon in cells
 */
function traceCells( isInside, from, to, { isSmoothed = true, isAllLoops = false } = {} ) {
  const edges = new Map()
  const add = (x1, y1, x2, y2) => {
    const key = `${x1},${y1}`
    if (!edges.has( key )) edges.set( key, [] )
    edges.get( key ).push({ x1, y1, x2, y2 })
  }

  const inside = isSmoothed ? withoutSlivers( isInside, from, to ) : (x, y) => x >= from.x && y >= from.y && x < to.x && y < to.y && isInside( x, y )

  // Every side of an inside cell that faces outside, oriented so the inside is on the right (clockwise on screen)
  for (let y = from.y; y < to.y; y++) for (let x = from.x; x < to.x; x++) {
    if (!inside( x, y )) continue
    if (!inside( x, y - 1 )) add( x, y, x + 1, y )
    if (!inside( x + 1, y )) add( x + 1, y, x + 1, y + 1 )
    if (!inside( x, y + 1 )) add( x + 1, y + 1, x, y + 1 )
    if (!inside( x - 1, y )) add( x, y + 1, x, y )
  }

  const loops = []

  while (edges.size) {
    const [ startKey ] = edges.keys()
    const points = []
    let key = startKey
    let previous = null

    do {
      const list = edges.get( key )
      // Where two loops touch at a corner, keep turning right, so each loop stays one simple shape
      const index = previous && list.length > 1 ? Math.max( 0, list.findIndex( edge => cross( previous, edge ) > 0 ) ) : 0
      const [ edge ] = list.splice( index, 1 )
      if (!list.length) edges.delete( key )

      points.push({ x:edge.x1, y:edge.y1 })
      previous = edge
      key = `${edge.x2},${edge.y2}`
    } while (key !== startKey && edges.has( key ))

    loops.push( withoutStraightPoints( points ) )
  }

  // Outer outlines run clockwise and holes counterclockwise, so all loops together make one shape (nonzero or evenodd).
  // Without isAllLoops only the largest loop is kept, dropping single cells cut off at a corner
  const sorted = loops.sort( (a, b) => polygonArea( b ) - polygonArea( a ) )
  return isAllLoops ? sorted : sorted[ 0 ] ?? []
}

/**
 * The cells, with every part thinner than a stroke (MIN_STROKE cells) filled in or cut off, so no corner is left without
 * room for its curve: first narrow gaps are closed, then narrow spikes are opened
 */
const MIN_STROKE = 3

function withoutSlivers( isInside, from, to ) {
  const width = to.x - from.x
  const height = to.y - from.y
  const reach = Math.floor( MIN_STROKE / 2 )
  let cells = new Uint8Array( width * height )

  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) cells[ y * width + x ] = isInside( x + from.x, y + from.y ) ? 1 : 0

  // A cell becomes `value` when any cell within reach has it. Outside the bounds counts as `outside`
  const spread = (source, value, outside) => {
    const result = new Uint8Array( source )

    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      search: for (let offsetY = -reach; offsetY <= reach; offsetY++) for (let offsetX = -reach; offsetX <= reach; offsetX++) {
        const nearX = x + offsetX
        const nearY = y + offsetY
        const near = nearX < 0 || nearY < 0 || nearX >= width || nearY >= height ? outside : source[ nearY * width + nearX ]

        if (near === value) {
          result[ y * width + x ] = value
          break search
        }
      }
    }

    return result
  }

  // Close (grow, then shrink) and open (shrink, then grow). Outside the bounds keeps what the bounds' edge would be
  cells = spread( spread( cells, 1, 0 ), 0, 1 )
  cells = spread( spread( cells, 0, 1 ), 1, 0 )

  return (x, y) => x >= from.x && y >= from.y && x < to.x && y < to.y && cells[ (y - from.y) * width + (x - from.x) ] === 1
}

function cross( a, b ) {
  return (a.x2 - a.x1) * (b.y2 - b.y1) - (a.y2 - a.y1) * (b.x2 - b.x1)
}

function withoutStraightPoints( points ) {
  return points.filter( (point, index) => {
    const before = points.at( index - 1 )
    const after = points[ (index + 1) % points.length ]
    return !((before.x === point.x && point.x === after.x) || (before.y === point.y && point.y === after.y))
  } )
}

function polygonArea( points ) {
  return Math.abs( points.reduce( (sum, point, index) => {
    const next = points[ (index + 1) % points.length ]
    return sum + point.x * next.y - next.x * point.y
  }, 0 ) ) / 2
}

/**
 * An SVG path through the corners of a clockwise orthogonal polygon (in px), every corner rounded like in the cactu letters.
 * `curve` overrides CURVE
 */
function roundedPath( points, curve = CURVE ) {
  const count = points.length
  if (count < 3) return ``

  const corners = points.map( (point, index) => {
    const before = points.at( index - 1 )
    const after = points[ (index + 1) % count ]
    const inDirection = unit( point.x - before.x, point.y - before.y )
    const outDirection = unit( after.x - point.x, after.y - point.y )
    const isConvex = inDirection.x * outDirection.y - inDirection.y * outDirection.x > 0

    return { point, inDirection, outDirection, radius:isConvex ? curve.convex : curve.concave }
  } )

  // Two corners on one stroke share its length in proportion to the radii they want
  const fitted = corners.map( (corner, index) => {
    const before = corners.at( index - 1 )
    const after = corners[ (index + 1) % count ]
    const inLength = distance( before.point, corner.point )
    const outLength = distance( corner.point, after.point )
    const inShare = inLength * corner.radius / (corner.radius + before.radius)
    const outShare = outLength * corner.radius / (corner.radius + after.radius)

    return Math.min( corner.radius, inShare, outShare )
  } )

  const k = curve.roundness ?? CURVE.roundness
  const at = (corner, radius, direction, sign) => ({ x:corner.point.x + direction.x * radius * sign, y:corner.point.y + direction.y * radius * sign })
  const format = ({ x, y }) => `${round( x )} ${round( y )}`

  let path = ``

  corners.forEach( (corner, index) => {
    const radius = fitted[ index ]
    const start = at( corner, radius, corner.inDirection, -1 )
    const end = at( corner, radius, corner.outDirection, 1 )
    const control1 = at( corner, radius * (1 - k), corner.inDirection, -1 )
    const control2 = at( corner, radius * (1 - k), corner.outDirection, 1 )

    path += `${index ? `L` : `M`}${format( start )}C${format( control1 )} ${format( control2 )} ${format( end )}`
  } )

  return `${path}Z`
}

function unit( x, y ) {
  const length = Math.hypot( x, y ) || 1
  return { x:x / length, y:y / length }
}

function distance( a, b ) {
  return Math.hypot( b.x - a.x, b.y - a.y )
}

function round( value ) {
  return Math.round( value * 10 ) / 10
}

/**
 * Runs of 6 to 14 cells, each `step` cells deeper or shallower than the last, between minLevel and maxLevel steps.
 * Steps of whole strokes keep room for an outer and an inner corner on every rise
 */
function steppedProfile( length, random, step, minLevel, maxLevel, runs = [ 6, 14 ] ) {
  const values = new Array( length ).fill( 0 )
  let level = minLevel + Math.floor( random() * (maxLevel - minLevel + 1) )

  for (let start = 0; start < length; ) {
    const run = runs[ 0 ] + Math.floor( random() * (runs[ 1 ] - runs[ 0 ] + 1) )
    for (let index = start; index < Math.min( length, start + run ); index++) values[ index ] = level * step

    start += run
    level = Math.max( minLevel, Math.min( maxLevel, level + (random() < 0.5 ? -1 : 1) ) )
  }

  return values
}

/* ---- Shapes on the page ---- */

/**
 * An SVG laid over (or under) a field, as big as its box, that may draw outside it. Returns the svg and its paths:
 * `fill` under the content, `edge` for the outline
 */
function prepareShapeSvg( field, className ) {
  let svg = field.querySelector( `:scope > svg.${className}` )

  if (!svg) {
    svg = document.createElementNS( `http://www.w3.org/2000/svg`, `svg` )
    svg.classList.add( `fieldSvg`, className )
    svg.setAttribute( `aria-hidden`, `true` )
    field.insertAdjacentElement( className === `fieldEdge` ? `beforeend` : `afterbegin`, svg )
  }

  svg.setAttribute( `width`, field.clientWidth )
  svg.setAttribute( `height`, field.clientHeight )
  svg.setAttribute( `viewBox`, `0 0 ${field.clientWidth} ${field.clientHeight}` )

  return svg
}
