/* The page version of CactuShadyTrail: cells of the dot grid light up under the pointer and fade out in pixel steps */

// Must match the dot grid in tokens.css
const TRAIL_CELL = 10
const TRAIL_LIFETIME = 1100

// Square sizes a cell goes through as it ages; each stays centered on its grid dot
const TRAIL_STEPS = [ 8, 6, 4, 2 ]

function createPointerTrail( color ) {
  const canvas = document.createElement( `canvas` )
  const ctx = canvas.getContext( `2d` )
  const cells = []
  const trail = { color }

  const resize = () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
  }

  canvas.className = `pointerTrail`
  document.body.prepend( canvas )
  resize()

  addEventListener( `resize`, resize )
  addEventListener( `pointermove`, event => {
    const x = Math.floor( event.clientX / TRAIL_CELL )
    const y = Math.floor( event.clientY / TRAIL_CELL )
    if (cells[ 0 ]?.x === x && cells[ 0 ]?.y === y) return

    cells.unshift({ x, y, createdAt:performance.now() })
  } )

  requestAnimationFrame( function frame( time ) {
    while (cells.length && time - cells.at( -1 ).createdAt > TRAIL_LIFETIME) cells.pop()

    ctx.clearRect( 0, 0, canvas.width, canvas.height )
    ctx.fillStyle = trail.color

    for (const cell of cells) {
      const size = TRAIL_STEPS[ Math.floor( (time - cell.createdAt) / TRAIL_LIFETIME * TRAIL_STEPS.length ) ]
      const offset = (TRAIL_CELL - size) / 2

      ctx.fillRect( cell.x * TRAIL_CELL + offset, cell.y * TRAIL_CELL + offset, size, size )
    }

    requestAnimationFrame( frame )
  } )

  return trail
}
