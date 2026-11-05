/* The page: fields, the hero, the cast panel, the walkers and the small things */

// One unit of every field, in CSS pixels. The worlds use the same size, so all pixels on the page match
const P = 3

// The favourite configuration from brand.html
const FAVORITE = { ground:`moundLayers`, placement:`aligned`, fontSize:`fit`, ending:`dots`, decorations:[ `grass`, `lines`, `stars` ], mark:`bracesArc` }

// Pixel icons, 8 x 8, drawn at the page's 3px per pixel
const ICONS = {
  home: [ `...##...`, `..####..`, `.######.`, `########`, `.######.`, `.##..##.`, `.##..##.`, `.##..##.` ],
  gamepad: [ `........`, `.######.`, `##.###.#`, `#...####`, `##.##.##`, `########`, `##....##`, `........` ],
  book: [ `........`, `##....##`, `#.#..#.#`, `#..##..#`, `#..##..#`, `#..##..#`, `#.####.#`, `###..###` ],
  cube: [ `..####..`, `.#...##.`, `######.#`, `#....#.#`, `#....#.#`, `#....##.`, `######..`, `........` ],
}

// The brand's fixed dark colours: the dark logo plate of brand.js, and the base of the whole dark page
const BRAND_DARK = PLATE_COLORS.dark

const JAM_PALETTE = { fill:`#e5be4b`, tone:`#d9af3c`, rim:`#f6dc8a`, shade:`#c4952e`, outline:`#5a3d0c`, dash:`#cfa236`, accents:[ `#ca5b35`, `#7a55ff`, `#4273b3` ] }

const params = new URLSearchParams( location.search )
const hero = { hole:document.getElementById( `heroWorld` ), pixel:P, switchId:0 }
const reducedMotion = matchMedia( `(prefers-reduced-motion: reduce)` ).matches
const trail = { color:`#5b8ff040` }

document.documentElement.classList.toggle( `isFlat`, params.get( `gradient` ) === `off` )

let currentCharacter = NIGHT[ params.get( `character` ) ] ? params.get( `character` ) : `evolveye`

start()

async function start() {
  fillIcons()
  fillRoster()
  fillBlocks()
  fillCartridges()
  drawCactusAvatar( document.getElementById( `avatar` ), `#2a2747`, `#5a4436` )
  tintPage( currentCharacter )
  startTrail( document.getElementById( `trail` ) )

  await loadCactuFont()
  await document.fonts.ready
  await Promise.all( [ `evolveye`, `ranfisz` ].map( loadSheet ) )

  drawSignet( document.getElementById( `signet` ) )
  document.getElementById( `footer` ).dataset.walker = currentCharacter

  for (const field of document.querySelectorAll( `[data-field]` )) {
    buildField( field )
    watchField( field )
  }

  for (const field of document.querySelectorAll( `[data-walker]` )) startWalker( field )

  fitRail()
  new ResizeObserver( fitRail ).observe( document.body )
  showSelectedInRoster()

  await showHero()
  startPortals()
}

// The navigation column ends where the footer starts: the signet and the dock stop sticking there and leave with the page
function fitRail() {
  const rail = document.querySelector( `.rail` )
  const isBeside = getComputedStyle( rail ).position === `absolute`
  const footerTop = document.getElementById( `footer` ).getBoundingClientRect().top + scrollY

  rail.style.bottom = isBeside ? `auto` : ``
  rail.style.height = isBeside ? `${footerTop}px` : ``
}

/* ================= CHARACTER COLOURS ================= */

// The page's colours for a character: its sky, the void around (the sky almost black) and the pieces of sky on the page
/**
 * The page's colours. The base is the brand's fixed dark colour (BRAND_DARK), the same for every character, so the logo
 * always sits on the page's own colours; the selected character adds its light (edges, outlines, the background's glows)
 * and its own night in the skies of its worlds
 */
function ambientOf( id ) {
  const { base, glow } = NIGHT[ id ]
  const { fill, shade, tone, outline } = BRAND_DARK

  return {
    glow,
    // The void is nearly black, so the brand's navy pieces stand out of it
    void: mix( shade, `#000000`, 0.72 ),
    // The worlds' skies are the character's own night: half brand navy up around the logo, so its plate belongs there,
    // and fully the character's further down, towards its horizon
    sky: [ mix( mix( shade, `#000000`, 0.12 ), mix( base, `#000000`, 0.35 ), 0.5 ), mix( shade, base, 0.65 ), base, mix( base, glow, 0.16 ) ],
    field: { fill:mix( shade, fill, 0.4 ), tone:mix( shade, tone, 0.5 ), rim:mix( fill, glow, 0.3 ), shade:mix( shade, `#000000`, 0.3 ), outline:mix( outline, glow, 0.3 ), dash:tone, accents:ACCENT_LINES, star:mix( glow, `#ffffff`, 0.6 ) },
    card: { fill, tone, rim:mix( tone, glow, 0.35 ), shade:mix( shade, `#000000`, 0.25 ), outline:mix( outline, glow, 0.4 ), dash:mix( fill, glow, 0.25 ), accents:ACCENT_LINES },
    edge: mix( outline, glow, 0.35 ),
  }
}

function tintPage( id ) {
  const ambient = ambientOf( id )

  document.documentElement.style.setProperty( `--void`, ambient.void )
  document.documentElement.style.setProperty( `--glow`, ambient.glow )
  trail.color = `${ambient.glow}50`
}

/* ================= FIELDS ================= */

// A field is rebuilt when its size changes; worlds inside are rebuilt with it
function watchField( field ) {
  let size = `${field.clientWidth}×${field.clientHeight}`
  let timeout

  new ResizeObserver( () => {
    const newSize = `${field.clientWidth}×${field.clientHeight}`
    if (newSize === size) return

    size = newSize
    clearTimeout( timeout )
    timeout = setTimeout( () => {
      buildField( field )
      if (field.id === `heroField`) showHero()
      else if (field.dataset.portal) showPortal( field )
    }, 200 )
  } ).observe( field )
}

function buildField( field, profiles ) {
  if (field.dataset.field === `hero`) return buildHero( field )

  // A jagged side keeps its outline inside the field's box; a flush side runs on to the box's edge
  const sides = (field.dataset.edges ?? `top right bottom left`).split( ` ` )
  const cols = Math[ sides.includes( `right` ) ? `floor` : `ceil` ]( field.clientWidth / P )
  const rows = Math[ sides.includes( `bottom` ) ? `floor` : `ceil` ]( field.clientHeight / P )
  const shape = createShape( field, cols, rows, profiles )
  const ctx = prepareCanvas( field, cols, rows )
  const ambient = ambientOf( field.dataset.portal ?? currentCharacter )

  field.shape = shape

  if (field.dataset.field === `window`) {
    paintWindowEdge( ctx, shape, ambient.edge )
    maskWithShape( field.querySelector( `.world` ), shape )
  } else if (field.dataset.field === `earth`) {
    paintEarth( ctx, shape, NIGHT[ currentCharacter ].ground )
  } else {
    const palette = { jam:JAM_PALETTE, card:ambient.card, panel:{ ...ambient.card, fill:mix( ambient.card.fill, `#000000`, 0.25 ), noLines:true } }[ field.dataset.palette ] ?? ambient.field
    paintFill( ctx, shape, palette, seeded( Number( field.dataset.seed ) * 7 ), contentRects( field ) )
  }
}

// The field's canvas, one pixel per unit, shown at the size of the units
function prepareCanvas( field, cols, rows ) {
  const canvas = field.querySelector( `:scope > .fieldCanvas` ) ?? field.insertAdjacentElement( `afterbegin`, Object.assign( document.createElement( `canvas` ), { className:`fieldCanvas` } ) )

  canvas.width = cols
  canvas.height = rows
  canvas.style.width = `${cols * P}px`
  canvas.style.height = `${rows * P}px`

  return canvas.getContext( `2d` )
}

/**
 * The field's shape in units: a rectangle whose jagged sides (data-edges) step in and out by whole blocks of data-q units,
 * at most data-depth blocks deep, one block at a time, so the outline stays one calm, continuous line. Jagged sides keep
 * one unit free for the outline. data-surface lowers the top edge, to leave room above it for things standing on it
 */
function createShape( field, cols, rows, given ) {
  const random = seeded( Number( field.dataset.seed ?? 1 ) )
  const sides = (field.dataset.edges ?? `top right bottom left`).split( ` ` )
  const q = Number( field.dataset.q ?? 4 )
  const surface = Number( field.dataset.surface ?? 0 )

  // Narrow fields get shallower edges, so the void does not eat them
  const depth = Math.min( Number( field.dataset.depth ?? 3 ), Math.max( 1, Math.floor( Math.min( cols, rows ) / (q * 10) ) ) )

  const profile = (length, side) => {
    if (!sides.includes( side )) return new Array( length ).fill( 0 )
    return steppedProfile( length, random, q, 0, depth ).map( value => value + 1 )
  }

  const { top, bottom, left, right } = given ?? {
    top: profile( cols, `top` ).map( value => value + surface ),
    bottom: profile( cols, `bottom` ),
    left: profile( rows, `left` ),
    right: profile( rows, `right` ),
  }

  // Past a flush side the field goes on, so nothing is outlined or shaded there
  const isInside = (x, y) => {
    if (x < 0 && !sides.includes( `left` )) x = 0
    if (x >= cols && !sides.includes( `right` )) x = cols - 1
    if (y < 0 && !sides.includes( `top` )) y = 0
    if (y >= rows && !sides.includes( `bottom` )) y = rows - 1
    return x >= 0 && y >= 0 && x < cols && y < rows && y >= top[ x ] && y < rows - bottom[ x ] && x >= left[ y ] && x < cols - right[ y ]
  }

  return { cols, rows, top, profiles:{ top, bottom, left, right }, isInside }
}

// Runs of 2 to 5 blocks of q units, each one block deeper or shallower than the last, between minLevel and maxLevel blocks
function steppedProfile( length, random, q, minLevel, maxLevel ) {
  const values = new Array( length ).fill( 0 )
  let level = minLevel + Math.floor( random() * (maxLevel - minLevel + 1) )

  for (let start = 0; start < length; ) {
    const run = q * (2 + Math.floor( random() * 4 ))
    for (let index = start; index < Math.min( length, start + run ); index++) values[ index ] = level * q

    start += run
    level = Math.max( minLevel, Math.min( maxLevel, level + (random() < 0.5 ? -1 : 1) ) )
  }

  return values
}

/* ================= HERO ================= */

/**
 * The hero is a window into the selected character's world with its own shape: its left edge is a staircase slanting away
 * from the signet and the dock, and the void bites into its ground from below. The cast panel stands on its right side
 */
function buildHero( field ) {
  const rail = placeDock( field )
  const cols = Math.ceil( field.clientWidth / P )
  const rows = Math.floor( field.clientHeight / P )
  const shape = createHeroShape( field, cols, rows, rail )
  const ctx = prepareCanvas( field, cols, rows )

  field.shape = shape
  paintWindowEdge( ctx, shape, ambientOf( currentCharacter ).edge )
  maskWithShape( field.querySelector( `.world` ), shape )
}

function createHeroShape( field, cols, rows, rail ) {
  const random = seeded( Number( field.dataset.seed ) )
  const q = Number( field.dataset.q )
  const isBeside = Boolean( rail )
  const worldBottom = rows - 1

  // The left edge slants from beside the signet down to beside the dock, in irregular steps; the signet slides down along
  // all of it while the page scrolls, and the dock starts at its bottom
  const signet = { right:isBeside ? Math.ceil( rail.signet.right / P ) : 0 }
  const dock = isBeside ? { top:Math.floor( rail.dock.top / P ), right:Math.ceil( rail.dock.right / P ) } : { top:rows, right:0 }
  const from = isBeside ? signet.right + 8 : 2
  const to = isBeside ? Math.max( from + 50, dock.right + 44 ) : 8
  const left = new Array( rows ).fill( 0 )

  for (let start = 0; start < rows; ) {
    const run = q * (2 + Math.floor( random() * 3 ))
    const progress = Math.min( 1, (start + run / 2) / worldBottom )
    const jitter = [ -1, 0, 0, 1, 1 ][ Math.floor( random() * 5 ) ] * q
    let value = Math.round( (from + (to - from) * progress) / q ) * q + jitter

    if (start + run > dock.top - q * 2) value = Math.max( value, dock.right + 8 )
    for (let y = start; y < Math.min( rows, start + run ); y++) left[ y ] = Math.max( isBeside ? from : 1, value )
    start += run
  }

  // Below, the void bites into the ground in steps along the whole width
  const cut = steppedProfile( cols, random, q, 1, 3 )

  const isInside = (x, y) => {
    if (x >= cols) x = cols - 1
    if (y < 0) y = 0
    if (x < 0 || y >= rows || x < left[ y ]) return false

    return y < worldBottom - cut[ x ]
  }

  return { cols, rows, top:new Array( cols ).fill( 0 ), left, worldBottom, isInside }
}

/**
 * The dock starts with its bottom on the hero's bottom line (the page scrolls it up under the signet, where it sticks).
 * Returns where the signet and the dock rest before scrolling, in px from the page's top left, like the hero
 */
function placeDock( field ) {
  const dock = document.getElementById( `dock` )
  const logo = document.querySelector( `.railLogo` )
  const rail = getComputedStyle( dock.parentElement )

  if (rail.position !== `absolute`) return null

  const railLeft = parseFloat( rail.paddingLeft )
  const flowTop = parseFloat( rail.paddingTop ) + logo.offsetHeight
  const top = Math.max( flowTop + 40, Math.floor( field.clientHeight / P ) * P - P * 2 - dock.offsetHeight )

  document.documentElement.style.setProperty( `--dock-top`, `${flowTop + 36}px` )
  dock.style.setProperty( `--dock-offset`, `${top - flowTop}px` )

  // The active and hovered buttons slide right by up to 12px
  return {
    signet: { right:railLeft + logo.offsetWidth },
    dock: { top, right:railLeft + dock.offsetWidth + 12 },
  }
}

// How many units a cell is from the nearest edge, up to `max`
function edgeDistance( shape, x, y, max = 3 ) {
  for (let step = 1; step <= max; step++) {
    if (!shape.isInside( x - step, y ) || !shape.isInside( x + step, y ) || !shape.isInside( x, y - step ) || !shape.isInside( x, y + step )) return step - 1
  }

  return max
}

// Outlines include the diagonal neighbours, so they go around every step's corner without a gap
function isOutline( shape, x, y ) {
  if (shape.isInside( x, y )) return false

  for (let stepY = -1; stepY <= 1; stepY++) for (let stepX = -1; stepX <= 1; stepX++) if (shape.isInside( x + stepX, y + stepY )) return true
  return false
}

// Units covered by the field's text and cards, so the frozen code lines never run through them
function contentRects( field ) {
  const box = field.getBoundingClientRect()

  return [ ...field.querySelectorAll( `h2, h3, p, .pixelLabel, .phases, .jamActions, .cartridge, .note` ) ].map( element => {
    const rect = element.getBoundingClientRect()
    return { left:Math.floor( (rect.left - box.left) / P ) - 3, top:Math.floor( (rect.top - box.top) / P ) - 3, right:Math.ceil( (rect.right - box.left) / P ) + 3, bottom:Math.ceil( (rect.bottom - box.top) / P ) + 3 }
  } )
}

/**
 * A filled field: lit on the edges facing the top left, shaded on the others, dithered a little deeper in, a speckle
 * of a second tone, the drifting code lines frozen in place and, on the sky, stars
 */
function paintFill( ctx, shape, palette, random, content = [] ) {
  const { cols, rows } = shape
  const distances = new Uint8Array( cols * rows )

  ctx.clearRect( 0, 0, cols, rows )

  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    if (!shape.isInside( x, y )) {
      if (isOutline( shape, x, y )) put( ctx, palette.outline, x, y )
      continue
    }

    const distance = distances[ y * cols + x ] = edgeDistance( shape, x, y )
    const isFacingLight = !shape.isInside( x, y - 1 ) || !shape.isInside( x - 1, y )
    const isFacingAway = !shape.isInside( x, y + 1 ) || !shape.isInside( x + 1, y )
    const dither = BAYER[ (y % 4) * 4 + (x % 4) ]

    let color = palette.fill
    if (distance === 0) color = isFacingAway ? palette.shade : isFacingLight ? palette.rim : palette.fill
    else if (distance === 1 && dither < 6) color = palette.shade
    else if ((x * 7 + y * 13) % 29 === 0 || (x * 3 + y * 5) % 47 === 0) color = palette.tone

    put( ctx, color, x, y )
  }

  // Code lines only where they have room, so none touches an edge or the content
  const isClear = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows && distances[ y * cols + x ] >= 3 && !content.some( rect => x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom )

  for (let index = 0; index < (palette.noLines ? 0 : cols * rows / 260); index++) {
    const x = Math.floor( random() * cols )
    const y = Math.floor( random() * rows )
    const isAccent = random() < 0.1
    const length = 3 + Math.floor( random() * 10 ) + (isAccent ? 4 : 0)
    const isRoomy = Array.from({ length }, (_, offset) => isClear( x + offset, y ) && (!isAccent || (isClear( x + offset, y - 1 ) && isClear( x + offset, y + 1 ))) ).every( Boolean )
    if (!isRoomy) continue

    ctx.fillStyle = isAccent ? palette.accents[ Math.floor( random() * palette.accents.length ) ] : palette.dash
    ctx.fillRect( x, y, length, 1 )
    if (isAccent) ctx.fillRect( x + 1, y - 1, length - 2, 3 )
  }

  if (palette.star) for (let index = 0; index < cols * rows / 500; index++) {
    const x = Math.floor( random() * cols )
    const y = Math.floor( random() * rows )
    if (!isClear( x, y ) || !isClear( x - 1, y ) || !isClear( x + 1, y )) continue

    put( ctx, palette.star, x, y )

    if (random() < 0.25) for (const [ offsetX, offsetY ] of [ [ -1, 0 ], [ 1, 0 ], [ 0, -1 ], [ 0, 1 ] ]) put( ctx, palette.rim, x + offsetX, y + offsetY )
  }
}

// Over a window only its outline: one continuous line around the world
function paintWindowEdge( ctx, shape, color ) {
  ctx.clearRect( 0, 0, shape.cols, shape.rows )

  for (let y = 0; y < shape.rows; y++) for (let x = 0; x < shape.cols; x++) {
    if (isOutline( shape, x, y )) put( ctx, color, x, y )
  }
}

// The world is cut to the shape with a mask drawn at full size, so its edges stay hard
function maskWithShape( element, shape ) {
  const { canvas, ctx } = createPixelLayer( shape.cols * P, shape.rows * P )

  ctx.fillStyle = `#fff`

  for (let y = 0; y < shape.rows; y++) {
    for (let x = 0; x < shape.cols; ) {
      if (!shape.isInside( x, y )) { x++; continue }

      const start = x
      while (x < shape.cols && shape.isInside( x, y )) x++
      ctx.fillRect( start * P, y * P, (x - start) * P, P )
    }
  }

  const mask = `url(${canvas.toDataURL()}) 0 0 / ${canvas.width}px ${canvas.height}px no-repeat`
  element.style.mask = mask
  element.style.webkitMask = mask
}

/**
 * The selected character's ground: a lit rim, the top layer dithered into soil with specks, darker deeper down
 * (in bands on the mesa), little bumps on the surface and the biome's props standing on it
 */
function paintEarth( ctx, shape, ground ) {
  const { cols, rows, top } = shape
  const random = seeded( 9 )

  ctx.clearRect( 0, 0, cols, rows )

  for (let x = 0; x < cols; x++) for (let y = top[ x ]; y < rows; y++) {
    const row = y - top[ x ]
    const dither = BAYER[ (row % 4) * 4 + (x % 4) ]
    const isTop = row < 3 || (row < 6 && dither < (6 - row) * 5)
    const isDeep = row > 17 || (row > 14 && dither < 8)
    const isSpeck = row > 4 && noiseAt( x, row ) < 0.004
    const soil = ground.bands ? ground.bands[ Math.floor( (row + Math.round( Math.sin( x / 9 ) * 1.5 )) / 3 ) % ground.bands.length ] : ground.soil

    put( ctx, row === 0 ? ground.rim : isTop ? ground.top : isSpeck ? mix( ground.speck, ground.soil, 0.78 ) : isDeep ? ground.deep : soil, x, y )
  }

  for (let x = 0; x < cols; x++) {
    const height = [ 1, 0, 0, 1, 0, 2, 0, 0, 1, 0 ][ x % 10 ]
    ctx.fillStyle = x % 3 ? ground.rim : ground.top
    ctx.fillRect( x, top[ x ] - height, 1, height )
  }

  // The biome's props, spaced out along the ground and standing on the highest step under them
  for (let left = 8, index = 0; left < cols - 16; left += 26 + Math.floor( random() * 34 ), index++) {
    const name = ground.props[ index % ground.props.length ]

    if (name === `cactus`) {
      drawPixelCactus( ctx, left + 4, Math.min( ...top.slice( left, left + 8 ) ), index % 3 )
      continue
    }

    const { rows:map, palette } = PROPS[ name ]
    const surface = Math.min( ...top.slice( left, left + map[ 0 ].length ) )
    drawPixelMap( ctx, map, palette, left, surface - map.length )
  }
}

// A stable value from 0 to 1 for a cell, without any visible pattern
function noiseAt( x, y ) {
  let hash = Math.imul( x, 374761393 ) + Math.imul( y, 668265263 )
  hash = Math.imul( hash ^ (hash >>> 13), 1274126177 )
  return ((hash ^ (hash >>> 16)) >>> 0) / 4294967296
}

function put( ctx, color, x, y ) {
  ctx.fillStyle = color
  ctx.fillRect( x, y, 1, 1 )
}

/* ================= SIGNET AND WORLDS ================= */

// The brand's cactus with its bracket cuts, on a strip of grass, like the square logo in brand.html
function drawSignet( canvas ) {
  const cactus = createBigCactus( 0.12, CACTUS_PALETTES.cactu, SHADINGS.cactus, FAVORITE.mark )
  const width = cactus.width + 10
  const groundY = cactus.height + 2
  const ctx = canvas.getContext( `2d` )

  canvas.width = width
  canvas.height = groundY + 3
  canvas.style.width = `${canvas.width * 2}px`

  drawGrass( ctx, 1, width - 1, groundY )
  ctx.drawImage( cactus.canvas, 5 - cactus.padding, groundY - cactus.height - cactus.padding )
}

// A bigger logo than brand.html's large one, with more detail now that the hero's pixels are small
LOGO_SIZES.huge = { name:`Ogromny`, scale:0.26, fontSize:40 }

// The largest plate that leaves most of the world to the scenery, at the largest pixel size that allows it
function pickPlate( hole, colors ) {
  for (const pixel of [ 2 ]) for (const size of [ `huge`, `large`, `medium`, `small` ]) {
    const plate = createStaticPlate( colors, { ...FAVORITE, size } )
    if (plate.width * pixel <= hole.clientWidth * 0.62 && plate.height * pixel <= hole.clientHeight * 0.4) return { plate, pixel }
  }

  return { plate:createStaticPlate( colors, { ...FAVORITE, size:`small` } ), pixel:2 }
}

function showPlate( banner, plate, pixel ) {
  const canvas = banner.querySelector( `canvas` ) ?? banner.appendChild( document.createElement( `canvas` ) )

  canvas.width = plate.width
  canvas.height = plate.height
  canvas.style.width = `${plate.width * pixel}px`
  canvas.style.height = `${plate.height * pixel}px`
  canvas.getContext( `2d` ).drawImage( plate, 0, 0 )
}

// Everything a world needs from a scene, with its sky in the character's colours
function worldOptions( id ) {
  const scene = NIGHT[ id ]

  const groundShape = SCENERY[ id ]?.groundShape ?? `flat`

  // Without ground nothing stands on it, everything floats
  return {
    terrain: scene.terrain,
    groundShape,
    cacti: groundShape === `none` ? [] : scene.cacti,
    props: [ ...scatteredProps( id ), ...scene.props.filter( prop => groundShape !== `none` || prop.y !== undefined ) ],
    colors: { ...scene.colors, sky:ambientOf( id ).sky, lineGray:mix( BRAND_DARK.fill, `#ffffff`, 0.2 ), edgeShade:`transparent` },
  }
}

// Fade the old world out, then build the selected character's world around the logo and fade it in
async function showHero() {
  const switchId = ++hero.switchId
  const scene = NIGHT[ currentCharacter ]
  const { plate, pixel } = pickPlate( hero.hole, BRAND_DARK )
  const isNarrow = hero.hole.clientWidth < 700

  hero.pixel = pixel
  // The ground's surface lies a little above the hero's bottom line and runs down through the tabs
  const shape = document.getElementById( `heroField` ).shape
  const groundTop = shape.worldBottom * P - Math.round( hero.hole.clientHeight * 0.06 ) - 14 * P
  hero.groundHeight = Math.ceil( hero.hole.clientHeight / pixel ) - Math.round( groundTop / pixel )

  // The logo floats high up, so the scenery can fill the hero: tall far hills, nearer ones in front and the ground below
  const logo = placeLogo( hero, { logo:{ x:isNarrow ? 0.5 : 0.47, y:isNarrow ? 0.34 : 0.3 }, plate:{ image:plate } } )
  const skyHeight = Math.round( groundTop / pixel )

  // The logo is the same in every world, so it is drawn in its own slot above the world and stays while the worlds change
  showPlate( hero.hole.querySelector( `.banner` ), plate, pixel )

  hero.hole.classList.add( `isSwitching` )
  if (hero.destroy) await new Promise( resolve => setTimeout( resolve, 350 ) )
  if (switchId !== hero.switchId) return

  hero.destroy?.()
  hero.destroy = undefined

  const destroy = await createPixelWorld( hero.hole, {
    ...worldOptions( currentCharacter ),
    pixel,
    groundHeight: hero.groundHeight,
    hillHeights: [ Math.round( skyHeight * 0.5 ), Math.round( skyHeight * 0.24 ) ],
    lineCount: isNarrow ? 25 : 70,
    driftingClouds: scene.driftingClouds ?? 0,
    characters: scene.characters.map( character => keepVisible( character, shape ) ),
    logo,
    plate: { image:plate, isShownOutside:true },
  } )

  if (switchId !== hero.switchId) return destroy()

  hero.destroy = destroy
  hero.hole.getBoundingClientRect()
  hero.hole.classList.remove( `isSwitching` )
}

// Characters walk only where the void has not bitten off the ground
function keepVisible( character, shape ) {
  const visibleFrom = Math.min( 0.5, (Math.max( ...shape.left.slice( shape.worldBottom - 30, shape.worldBottom ) ) + 4) / shape.cols )
  const [ from, to ] = character.walkRange ?? [ character.startX, character.startX ]
  const panel = document.getElementById( `castPanel` )
  const visibleTo = panel.offsetTop < shape.rows * P / 2 ? (panel.offsetLeft - 24) / (shape.cols * P) : 1
  const startX = Math.min( visibleTo - 0.06, Math.max( visibleFrom, character.startX ) )

  return { ...character, startX, walkRange:character.walkRange && [ Math.max( visibleFrom, from ), Math.min( visibleTo, to ) ] }
}

function startPortals() {
  for (const field of document.querySelectorAll( `[data-portal]` )) {
    showPortal( field )

    // Hovering a portal reshapes its edges, as if it breathed
    const seed = Number( field.dataset.seed )
    field.closest( `.portal` ).addEventListener( `pointerenter`, () => {
      field.dataset.seed = seed + Math.floor( Math.random() * 1000 )
      morphField( field )
    } )
  }
}

/**
 * Moves every step of a field's edges towards a new shape (from its current data-seed) by one unit per frame, redrawing the
 * outline and the world's mask on the way, so the edges crawl into place instead of jumping
 */
function morphField( field ) {
  const from = field.shape.profiles
  const target = createShape( field, field.shape.cols, field.shape.rows ).profiles
  const current = Object.fromEntries( Object.entries( from ).map( ([ side, values ]) => [ side, [ ...values ] ] ) )
  const morphId = field.morphId = (field.morphId ?? 0) + 1

  if (reducedMotion) return buildField( field, target )

  const step = () => {
    if (morphId !== field.morphId) return

    let isMoving = false

    for (const side of Object.keys( current )) current[ side ] = current[ side ].map( (value, index) => {
      const goal = target[ side ][ index ]
      if (value === goal) return value

      isMoving = true
      return value + Math.sign( goal - value )
    } )

    buildField( field, current )
    if (isMoving) setTimeout( () => requestAnimationFrame( step ), 40 )
  }

  step()
}

async function showPortal( field ) {
  const id = field.dataset.portal
  const scene = NIGHT[ id ]

  field.destroy?.()
  field.destroy = await createPixelWorld( field.querySelector( `.world` ), {
    ...worldOptions( id ),

    // The big scenery would fill these small windows
    props: scene.props.filter( prop => !prop.scale ),
    pixel: P,
    groundHeight: 12,
    lineCount: 14,
    driftingClouds: scene.driftingClouds ? 2 : 0,
    characters: scene.characters.slice( 0, 2 ).map( character => ({ ...character, altitude:Math.min( character.altitude ?? 0, 0.4 ) }) ),
  } )
}

/* ================= CHARACTERS ================= */

function fillRoster() {
  const list = document.getElementById( `roster` )
  const unlocked = CHARACTERS.filter( character => character.id )
  const locked = CHARACTERS.filter( character => !character.id )

  document.getElementById( `castCount` ).textContent = `${unlocked.length} / ${CHARACTERS.length} · wybierz świat`

  for (const character of [ ...shuffle( unlocked ), ...locked ]) {
    const item = document.createElement( `li` )
    const button = document.createElement( character.id ? `button` : `div` )
    const portrait = character.id ? `<span class="portrait"><img src="${character.sprite ?? placeholderPortrait( character.id )}" alt=""></span>` : `<span class="portrait isUnknown">?</span>`
    const note = character.id ? character.note : `Odblokujesz na poziomie ${character.unlockLevel}`

    // On phones the rows show only the portraits, so the name is also in the tooltip
    button.className = `member`
    button.title = `${character.name}: ${note}`
    button.innerHTML = `${portrait}<span><b>${character.name.toLowerCase()}</b><small>${note}</small></span>`

    if (character.id) {
      button.type = `button`
      button.dataset.character = character.id
      button.style.setProperty( `--character`, NIGHT[ character.id ].glow )
      button.classList.toggle( `isSelected`, character.id === currentCharacter )
      button.setAttribute( `aria-pressed`, character.id === currentCharacter )
      button.addEventListener( `click`, () => selectCharacter( character.id ) )
    } else {
      button.classList.add( `isLocked` )
    }

    item.append( button )
    list.append( item )
  }

}

// Scrolls the list (not the page) so the selected character is in its middle
function showSelectedInRoster() {
  const list = document.getElementById( `roster` )
  const selected = list.querySelector( `.isSelected` )
  const isRow = getComputedStyle( list ).flexDirection === `row`

  if (!selected) return
  if (isRow) list.scrollLeft = selected.offsetLeft - (list.clientWidth - selected.offsetWidth) / 2
  else list.scrollTop = selected.offsetTop - (list.clientHeight - selected.offsetHeight) / 2
}

// A shuffled copy, so the cast is in a different order on every visit
function shuffle( list ) {
  const copy = [ ...list ]

  for (let index = copy.length - 1; index > 0; index--) {
    const other = Math.floor( Math.random() * (index + 1) )
    ;[ copy[ index ], copy[ other ] ] = [ copy[ other ], copy[ index ] ]
  }

  return copy
}

// The hero world, the page's colours, the sky pieces and the ground in the footer (with its inhabitant) all follow the character
function selectCharacter( id ) {
  if (id === currentCharacter) return

  currentCharacter = id
  params.set( `character`, id )
  history.replaceState( null, ``, `?${params}` )
  tintPage( id )

  for (const button of document.querySelectorAll( `[data-character]` )) {
    button.classList.toggle( `isSelected`, button.dataset.character === id )
    button.setAttribute( `aria-pressed`, button.dataset.character === id )
  }

  document.getElementById( `footer` ).dataset.walker = id
  for (const field of document.querySelectorAll( `[data-palette="sky"], [data-palette="card"], [data-palette="panel"], [data-field="earth"], #heroField` )) buildField( field )

  showHero()
}

/**
 * A character living on the top edge of a field (data-walker): it walks, or floats when it is a floating character, along it,
 * steps up and down with the edge, stops now and then and turns back at the ends. Drawn in units, so it matches the field
 */
function startWalker( field ) {
  const canvas = Object.assign( document.createElement( `canvas` ), { className:`walker` } )
  const ctx = canvas.getContext( `2d` )
  const headroom = 46
  const walker = { x:null, direction:1, pauseLeft:1 }

  canvas.setAttribute( `aria-hidden`, `true` )
  field.append( canvas )

  let lastTime = performance.now()

  requestAnimationFrame( function frame( time ) {
    const shape = field.shape
    const name = field.dataset.walker
    const sheet = SHEETS[ name ]
    const isFloating = name === `evolveye`
    const deltaSeconds = Math.min( (time - lastTime) / 1000, 0.1 )
    lastTime = time

    if (canvas.width !== shape.cols) {
      canvas.width = shape.cols
      canvas.height = headroom + Math.max( ...shape.top ) + 2
      canvas.style.width = `${canvas.width * P}px`
      canvas.style.height = `${canvas.height * P}px`
      canvas.style.top = `${-headroom * P}px`
    }

    walker.x ??= Math.round( shape.cols * (field.id === `footer` ? 0.14 : 0.72) )
    const isMoving = walker.pauseLeft <= 0 && !reducedMotion

    if (isMoving) {
      walker.x += walker.direction * (isFloating ? 7 : 9) * deltaSeconds

      const isAtEnd = walker.x < 2 || walker.x > shape.cols - sheet.width - 2
      if (isAtEnd || Math.random() < deltaSeconds * 0.08) {
        walker.x = Math.max( 2, Math.min( shape.cols - sheet.width - 2, walker.x ) )
        walker.direction *= isAtEnd || Math.random() < 0.5 ? -1 : 1
        walker.pauseLeft = 1.5 + Math.random() * 2.5
      }
    } else {
      walker.pauseLeft -= deltaSeconds
    }

    // It stands on the highest step under its feet
    const left = Math.round( walker.x )
    const feet = Math.round( sheet.width * 0.25 )
    const surface = headroom + Math.min( ...shape.top.slice( left + feet, left + sheet.width - feet ) )
    const row = isFloating ? (walker.direction > 0 ? 2 : 3) : isMoving ? (walker.direction > 0 ? 3 : 2) : (walker.direction > 0 ? 1 : 0)
    const column = Math.floor( time / (isMoving || isFloating ? 140 : 180) ) % 8
    const lift = isFloating ? 6 + Math.round( Math.sin( time / 600 ) * 2 ) : -1

    ctx.clearRect( 0, 0, canvas.width, canvas.height )
    ctx.drawImage( sheetImages[ name ], column * (sheet.width + 1), row * (sheet.height + 1), sheet.width, sheet.height, left, surface - sheet.height - lift, sheet.width, sheet.height )

    requestAnimationFrame( frame )
  } )
}

/* ================= SMALL THINGS ================= */

// The pointer lights cells of a 2 unit grid in the void, which shrink by whole units as they fade
function startTrail( canvas ) {
  const ctx = canvas.getContext( `2d` )
  const cell = P * 2
  const cells = []

  const resize = () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
  }

  resize()
  addEventListener( `resize`, resize )
  addEventListener( `pointermove`, event => {
    const x = Math.floor( event.clientX / cell )
    const y = Math.floor( event.clientY / cell )
    if (cells[ 0 ]?.x !== x || cells[ 0 ]?.y !== y) cells.unshift({ x, y, createdAt:performance.now() })
  } )

  requestAnimationFrame( function frame( time ) {
    while (cells.length && time - cells.at( -1 ).createdAt > 900) cells.pop()

    ctx.clearRect( 0, 0, canvas.width, canvas.height )
    ctx.fillStyle = trail.color

    for (const { x, y, createdAt } of cells) {
      const size = time - createdAt < 450 ? cell : P
      ctx.fillRect( x * cell + (cell - size) / 2, y * cell + (cell - size) / 2, size, size )
    }

    requestAnimationFrame( frame )
  } )
}

function fillCartridges() {
  const root = document.getElementById( `cartridges` )

  for (let index = 0; index < 6; index++) {
    const cartridge = document.createElement( `a` )
    const screen = document.createElement( `canvas` )

    cartridge.className = `cartridge`
    cartridge.href = `#`
    cartridge.style.setProperty( `--_offset`, `${[ 0, 9, -6, 6, -3, 3 ][ index ]}px` )
    drawThumbnail( screen, GAME_PALETTES[ index % GAME_PALETTES.length ], index )
    cartridge.append( screen )
    cartridge.insertAdjacentHTML( `beforeend`, `<span>Gra ${index + 1}</span>` )
    root.append( cartridge )
  }
}

// Rows of 10 blocks: [data-blocks] of them full, and XP the same way
function fillBlocks() {
  for (const row of document.querySelectorAll( `[data-blocks]` )) row.innerHTML = Array.from({ length:10 }, (_, index) => `<i class="${index < Number( row.dataset.blocks ) ? `isFull` : ``}"></i>` ).join( `` )
  for (const row of document.querySelectorAll( `[data-xp]` )) row.innerHTML = Array.from({ length:10 }, (_, index) => `<i class="${index < Number( row.dataset.xp ) ? `isFull` : ``}"></i>` ).join( `` )
}

function fillIcons() {
  for (const element of document.querySelectorAll( `[data-icon]` )) {
    const rects = ICONS[ element.dataset.icon ].flatMap( (row, y) => [ ...row.matchAll( /#+/g ) ].map( run => `<rect x="${run.index}" y="${y}" width="${run[ 0 ].length}" height="1"/>` ) )
    element.outerHTML = `<svg class="icon" viewBox="0 0 8 8" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">${rects.join( `` )}</svg>`
  }
}
