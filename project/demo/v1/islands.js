/* Floating islands, one per character biome, shared by the brand sheets */

// Island looks: top surface, its lit rim, the body and its shaded side; extras are drawn by drawIslandDetails
const ISLAND_BIOMES = {
  home: { top:`#69a948`, rim:`#98cf6c`, body:`#a0714a`, shade:`#7a5236` },
  desert: { top:`#e2b674`, rim:`#f3d39b`, body:`#c98d4f`, shade:`#a06a35`, cacti:true },
  mountain: { top:`#f7f9fc`, rim:`#ffffff`, body:`#7d8b9d`, shade:`#5f6b7a`, ore:`#cf7638` },
  moss: { top:`#69a948`, rim:`#98cf6c`, body:`#8f7f60`, shade:`#6f6248`, flowers:true },
  mesa: { top:`#d98a5f`, rim:`#efc09a`, body:`#d98a5f`, shade:`#b8603e`, bands:[ `#d98a5f`, `#e8a878`, `#c9704a`, `#efc09a` ] },
  goo: { top:`#d36ad3`, rim:`#f2aef0`, body:`#9c42aa`, shade:`#7a2a86`, drips:true },
}

const ISLAND_OUTLINE = `#2b2318`

const BANNER_SKY = [ `#b7c6ee`, `#c9d4f2`, `#e0dbef`, `#f6e2dc` ]

// Draws one animation frame of a character standing with its feet on (centerX, surfaceY)
function drawCharacterFrame( ctx, name, centerX, surfaceY, time, phase, row = 1 ) {
  const sheet = SHEETS[ name ]
  const column = Math.floor( time / 180 + phase * 3 ) % 8

  ctx.drawImage( sheetImages[ name ], column * (sheet.width + 1), row * (sheet.height + 1), sheet.width, sheet.height, centerX - Math.floor( sheet.width / 2 ), surfaceY - sheet.height + 1, sheet.width, sheet.height )
}

/**
 * A floating island as its own little canvas. The top is flat, the body tapers into a stepped point.
 * Returns the canvas and where its top surface center is, so it can be placed by that point.
 */
function createIsland( biome, width, isLarge ) {
  const depth = Math.round( width * (isLarge ? 0.32 : 0.55) )
  const margin = 8
  const { canvas, ctx } = createPixelLayer( width + margin * 2, depth + margin * 2 )
  const centerX = margin + width / 2
  const surfaceY = margin
  const halfWidths = Array.from({ length:depth }, (_, row) => {
    const taper = 1 - (row / depth) ** 1.5
    const jitter = row > 2 ? (row * 7) % 3 - 1 : 0
    return Math.max( 1, Math.round( width / 2 * taper / 2 ) * 2 + jitter )
  } )

  // Silhouette one pixel larger in the outline colour first, then the island over it
  ctx.fillStyle = ISLAND_OUTLINE
  halfWidths.forEach( (half, row) => ctx.fillRect( Math.round( centerX - half ) - 1, surfaceY + row - 1, half * 2 + 2, 3 ) )

  halfWidths.forEach( (half, row) => {
    for (let x = Math.round( centerX - half ); x < Math.round( centerX + half ); x++) {
      const isShaded = x > centerX + half * 0.25 && BAYER[ (row % 4) * 4 + (x % 4) ] < 9
      const bodyColor = biome.bands ? biome.bands[ Math.floor( row / 2 ) % biome.bands.length ] : biome.body

      ctx.fillStyle = row === 0 ? biome.rim : row < 3 ? biome.top : isShaded ? biome.shade : bodyColor
      ctx.fillRect( x, surfaceY + row, 1, 1 )
    }
  } )

  drawIslandDetails( ctx, biome, centerX, surfaceY, width, halfWidths )

  return { canvas, surfaceX:Math.round( centerX ), surfaceY }
}

function drawIslandDetails( ctx, biome, centerX, surfaceY, width, halfWidths ) {
  const left = Math.round( centerX - width / 2 )

  if (biome.cacti) drawPixelCactus( ctx, left + width - 6, surfaceY, 0 )

  if (biome.ore) {
    ctx.fillStyle = biome.ore
    for (const [ x, y ] of [ [ -6, 5 ], [ 3, 8 ], [ -2, 12 ], [ 7, 4 ] ]) ctx.fillRect( Math.round( centerX ) + x, surfaceY + y, 2, 1 )
  }

  if (biome.flowers) for (let x = left + 2; x < left + width - 2; x += 5) {
    ctx.fillStyle = `#f08cb4`
    ctx.fillRect( x, surfaceY - 1, 1, 1 )
    ctx.fillStyle = `#ffe08a`
    ctx.fillRect( x, surfaceY - 2, 1, 1 )
  }

  // Goo drips hang from the underside
  if (biome.drips) for (const [ offset, length ] of [ [ -6, 3 ], [ -1, 5 ], [ 4, 2 ], [ 8, 4 ] ]) {
    const row = halfWidths.findIndex( half => half < Math.abs( offset ) + 1 )
    const y = surfaceY + (row < 0 ? halfWidths.length : row)

    ctx.fillStyle = ISLAND_OUTLINE
    ctx.fillRect( Math.round( centerX ) + offset - 1, y - 1, 3, length + 2 )
    ctx.fillStyle = biome.body
    ctx.fillRect( Math.round( centerX ) + offset, y - 1, 1, length + 1 )
  }
}
