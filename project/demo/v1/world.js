/* Pixel worlds rendered inside .hole elements */

const PIXEL = 5

const WORLD_COLORS = {
  sky: [ `#0c0b16`, `#121226`, `#1a1934`, `#252248` ],
  farHills: `#221e3e`,
  nearHills: `#17142c`,
  ground: `#0e0c1a`,
  groundRim: `#3a3462`,
  pebble: `#1c1930`,
  star: `#cfd6ff`,
  snow: `#ffffff`,
  cloud: `#ffffff`,
  cloudShade: `#dfe6f6`,
  edgeShade: `rgba( 30, 24, 60, 0.2 )`,
  trail: `rgba( 255, 255, 255, 0.55 )`,
  lineGray: `#5d5a80`,
  lineAccents: [ `#ca5b35`, `#4273b3`, `#7a55ff`, `#e5be4b` ],
  cactus: [ `#8fd14a`, `#5da234`, `#2f6b1f`, `#08070d` ],
}

// Sprite sheets live in project/characters: two folders up from this file, wherever its copy is (lib/, v1/, v2/…)
const CHARACTERS_URL = new URL( `../../characters/`, document.currentScript.src ).href

const SHEETS = {
  evolveye: { src:`${CHARACTERS_URL}evolveye/spritesheet.png`, width:35, height:35 },
  ranfisz: { src:`${CHARACTERS_URL}ranfisz/spritesheet.png`, width:31, height:29 },
}

// Stand-ins for characters that have no sprites yet. Keys: o outline, l light, b base, s shade, w eye white, k pupil, the rest are accents
const PLACEHOLDER_SPRITES = {
  goral: {
    palette: { o:`#1c2028`, k:`#1c2028`, w:`#f4f7fb`, n:`#f7f9fc`, l:`#b3bfcc`, b:`#7d8a99`, s:`#56616f`, a:`#cf7638` },
    rows: [
      `.....oooooooo.....`,
      `...oonnnnnnnnoo...`,
      `..onnnnnnnnnnnno..`,
      `..onnlllllllnnno..`,
      `.olllbbbbbbbblllo.`,
      `.olbbbbbbbbbbbbso.`,
      `.olbwwkbbbbwwkbso.`,
      `.olbwwkbbbbwwkbso.`,
      `.olbbbbbbbbbbbbso.`,
      `.olbbabbbbbbbbbso.`,
      `.olbbbbbbbbbbabso.`,
      `.olbbbbbabbbbbbso.`,
      `.osbbbbbbbbbbbsso.`,
      `..ossssssssssso...`,
      `..oso.......oso...`,
      `..ooo.......ooo...`,
    ],
  },
  mszak: {
    palette: { o:`#24331c`, k:`#24331c`, w:`#ffffff`, l:`#98cf6c`, b:`#69a948`, s:`#467d31`, p:`#a46ad8`, y:`#f2d6ff` },
    rows: [
      `....pp......pp....`,
      `...pyyp....pyyp...`,
      `....pp..pp..pp....`,
      `....oo.pyyp.oo....`,
      `...olloopploolo...`,
      `..ollbbbbbbbbbso..`,
      `.olbbbbbbbbbbbbso.`,
      `.olbbwwkbbbwwkbso.`,
      `.olbbwwkbbbwwkbso.`,
      `.olbbbbbbbbbbbbso.`,
      `.olbbbbbpbbbbbbso.`,
      `.osbbbbbbbbbpbsso.`,
      `..osssssssssssso..`,
      `...oo.oo..oo.oo...`,
    ],
  },
  zabek: {
    palette: { o:`#14302a`, k:`#14302a`, w:`#ffffff`, y:`#f2c14a`, l:`#7fd6b5`, b:`#35a585`, s:`#25785f`, c:`#f4f7f9`, d:`#c9d2d8`, a:`#e05aa0` },
    rows: [
      `..oooo......oooo..`,
      `.oyyyyo....oyyyyo.`,
      `.oywwyo....oywwyo.`,
      `.oywkyooooooywkyo.`,
      `.oyyyyobbbboyyyyo.`,
      `.olbbbbbbbbbbbbbo.`,
      `.olbbbkkkkkkkbbbo.`,
      `.olbbbbbbbbbbbbso.`,
      `oocccccccccccccdoo`,
      `occccccaccccccccdo`,
      `occccccccccccccddo`,
      `.oddddddddddddddo.`,
      `..obbo......obbo..`,
      `..oooo......oooo..`,
    ],
  },
  glutek: {
    palette: { o:`#3a1842`, k:`#3a1842`, w:`#ffffff`, l:`#f2aef0`, b:`#d36ad3`, s:`#9c42aa` },
    rows: [
      `.......oooo.......`,
      `.....oolllloo.....`,
      `....ollbbbbbbo....`,
      `...olwbbbbbbbbo...`,
      `..olwbbbbbbbbbbo..`,
      `..olbbwwkbbwwkbo..`,
      `.olbbbwwkbbwwkbso.`,
      `.olbbbbbbbbbbbbso.`,
      `.olbbbbbkkkbbbbso.`,
      `.osbbbbbbbbbbbsso.`,
      `.ossbbbbbbbbbssso.`,
      `..oossssssssssoo..`,
      `....oooooooooo....`,
    ],
  },
}

// A lab flask standing on the frog's plate
const FLASK_ROWS = [
  `..ooo..`,
  `..owo..`,
  `..owo..`,
  `.oowoo.`,
  `owwwwwo`,
  `oaaaaao`,
  `oaaaaao`,
  `.ooooo.`,
]

// The Cactu signet in pixels: rounded parts that form one shape, cracks where the arms meet the trunk, and darker dots
const LOGO_CACTUS = {
  width: 22,
  height: 26,
  colors: { light:`#8fd14a`, base:`#5da234`, shade:`#3f7d24`, dot:`#2f6b1f` },
  parts: [
    { rect:[ 7, 0, 8, 26 ], corners:[ `topLeft`, `topRight` ] },
    { rect:[ 16, 2, 5, 12 ], corners:[ `topLeft`, `topRight`, `bottomRight` ] },
    { rect:[ 13, 10, 4, 4 ] },
    { rect:[ 1, 7, 5, 12 ], corners:[ `topLeft`, `topRight`, `bottomLeft` ] },
    { rect:[ 5, 15, 3, 4 ] },
  ],
  cracks: [ [ 15, 11 ], [ 15, 13 ], [ 6, 15 ], [ 6, 17 ] ],
  dots: [ [ 10, 3 ], [ 12, 7 ], [ 9, 11 ], [ 12, 16 ], [ 10, 20 ], [ 12, 23 ], [ 18, 5 ], [ 19, 9 ], [ 3, 10 ], [ 2, 14 ] ],
}

const BAYER = [ 0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5 ]

const GAME_PALETTES = [
  [ `#2f6b3a`, `#3f8a4a`, `#d8c08a`, `#1d3f24` ],
  [ `#f2b5c4`, `#e98aa3`, `#3a2a2a`, `#ffffff` ],
  [ `#1a1430`, `#2d2450`, `#9c95c9`, `#ffffff` ],
  [ `#1a0606`, `#8a1010`, `#e02020`, `#3a0a0a` ],
  [ `#c9c3bd`, `#a59e98`, `#5c7a3a`, `#7a2a2a` ],
  [ `#5a4030`, `#3a281c`, `#8a6a4a`, `#c9a67a` ],
  [ `#e8d6a8`, `#3a7ad0`, `#6fb3f0`, `#2f6b1f` ],
]

// Space between the logo and its plate, and between the plate and anything in the world, in world pixels
const PLATE_PADDING = { x:4, y:3 }
const KEEP_OUT_PADDING = 3

const sheetImages = {}
const logoImageCache = {}

for (const [ name, sprite ] of Object.entries( PLACEHOLDER_SPRITES )) {
  SHEETS[ name ] = { width:Math.max( ...sprite.rows.map( row => row.length ) ), height:sprite.rows.length + 1, sprite }
}

/**
 * `logo` is the logo's rectangle in CSS pixels of the hole (from placeLogo). The world draws the pixel logo there on a plate
 * and keeps the plate clear: cacti are skipped, characters turn back or move aside.
 */
async function createPixelWorld( hole, options = {} ) {
  const { groundHeight = 18, cacti = [], props = [], characters = [], lineCount = 60, horizonGlow = 1, pixel = PIXEL, terrain = `mesa`, driftingClouds = 0, hillHeights = [ 22, 12 ], groundShape = `flat`, groundWave = 8, logo, plate } = options
  const colors = { ...WORLD_COLORS, ...options.colors }
  const { width:holeWidth, height:holeHeight } = hole.getBoundingClientRect()
  const margin = 4

  // A few extra pixels around the edges let parallax move without showing gaps
  const width = Math.ceil( holeWidth / pixel ) + margin * 2
  const height = Math.ceil( holeHeight / pixel ) + margin * 2
  const { canvas, ctx } = createWorldCanvas( width, height, margin, pixel )

  hole.prepend( canvas )

  const groundY = height - groundHeight - margin
  const sky = createWorldSky( width, height, groundY, horizonGlow, colors.sky )
  // Taller hills are also wider, so their shapes keep their proportions
  const [ farHeight, nearHeight ] = hillHeights
  const farHills = createHills( width + 20, height, groundY - 2, farHeight, colors.farHills, 1, terrain, { snow:colors.snow, bands:colors.farBands, rim:colors.farRim, stretch:farHeight / 22 } )
  const nearHills = createHills( width + 20, height, groundY + 1, nearHeight, colors.nearHills, 2, terrain, { snow:colors.snow, rim:colors.nearRim, stretch:nearHeight / 12 } )
  // The ground is flat, rolls in gentle steps or is left out (the near hills then reach down to the bottom). Things standing on
  // it follow its height: groundAt( x ) is its surface under world column x, which the ground canvas draws 10 columns in
  const groundTops = Array.from({ length:width + 20 }, (_, index) => groundShape === `rolling` ? groundY - Math.round( ((Math.sin( index * 0.043 + 1 ) * 0.6 + Math.sin( index * 0.017 + 3 ) * 0.4) + 1) / 2 * groundWave ) : groundY )
  const groundAt = x => groundTops[ Math.max( 0, Math.min( groundTops.length - 1, Math.round( x ) + 10 ) ) ]
  const ground = groundShape !== `none` && createGround( width + 20, height, groundTops, colors )
  const edgeShade = createEdgeShade( width, height, margin, colors.edgeShade )
  const logoPlate = logo && plate && createPlate( width, height, toWorldRect( logo, pixel, margin ), plate, groundY )
  const blocked = logoPlate && expandRect( logoPlate.bounds, KEEP_OUT_PADDING )

  const stars = Array.from({ length:Math.round( width * groundY / 900 ) }, () => ({ x:Math.random() * width, y:Math.random() * (groundY - 30), phase:Math.random() * 6 }) )
  const lines = Array.from({ length:lineCount }, () => createWorldLine( width, groundY - 6, colors ) )
  const clouds = Array.from({ length:driftingClouds }, (_, index) => ({ image:createCloudPuff( 12 + (index % 3) * 6, colors ), x:Math.random() * width, y:2 + Math.random() * groundY * 0.7, speed:1 + Math.random() * 2 }) )
  const visibleCacti = cacti.filter( cactus => !blocked || !overlaps( cactusRect( Math.round( cactus.x * width ), groundY, cactus.size ), blocked ) )

  // Props are small pixel maps ({ x, rows, palette }) standing on the ground, like the cacti. With `y` (a fraction of the sky's
  // height) they hang in the sky instead and move less with the pointer; with `twinkle` they blink like the stars. `scale`
  // draws every pixel of the map as a block of world pixels, and `back` puts the prop behind the ground's own props, as bigger scenery further away
  const propSize = prop => ({ width:prop.rows[ 0 ].length * (prop.scale ?? 1), height:prop.rows.length * (prop.scale ?? 1) })
  const propTop = prop => prop.y === undefined ? groundAt( prop.x * width + propSize( prop ).width / 2 ) + (prop.back ? 1 : 0) - propSize( prop ).height : Math.round( prop.y * groundY )
  const visibleProps = props.filter( prop => !blocked || !overlaps({ left:Math.round( prop.x * width ), top:propTop( prop ), right:Math.round( prop.x * width ) + propSize( prop ).width, bottom:propTop( prop ) + propSize( prop ).height }, blocked ) )
  const skyProps = visibleProps.filter( prop => prop.y !== undefined )
  const backProps = visibleProps.filter( prop => prop.y === undefined && prop.back )
  const groundProps = visibleProps.filter( prop => prop.y === undefined && !prop.back )
  const isHidden = (prop, time) => prop.twinkle && Math.sin( time / 900 + prop.x * 47 ) < -0.5
  const drawProps = (list, time, shiftX) => {
    for (const prop of list) if (!isHidden( prop, time )) drawPixelMap( ctx, prop.rows, prop.palette, Math.round( prop.x * width ) + shiftX, propTop( prop ), false, prop.scale )
  }

  await Promise.all( characters.map( character => loadSheet( character.sheet ) ) )

  for (const character of characters) {
    character.groundAt = groundAt
    placeCharacter( character, characters, width, groundY, margin, blocked )
  }

  const pointer = { x:0, targetX:0 }
  const trail = []

  // Besides the parallax, the pointer leaves a short trail of light pixels in the world
  const onPointerMove = event => {
    const holeRect = hole.getBoundingClientRect()
    const cell = { x:Math.floor( (event.clientX - holeRect.left) / pixel / 2 ) * 2 + margin, y:Math.floor( (event.clientY - holeRect.top) / pixel / 2 ) * 2 + margin, createdAt:performance.now() }
    const isInside = event.clientX > holeRect.left && event.clientX < holeRect.right && event.clientY > holeRect.top && event.clientY < holeRect.bottom

    pointer.targetX = event.clientX / innerWidth - 0.5

    if (isInside && (trail[ 0 ]?.x !== cell.x || trail[ 0 ]?.y !== cell.y)) trail.unshift( cell )
  }

  let isRunning = true
  let lastTime = performance.now()

  addEventListener( `pointermove`, onPointerMove )

  requestAnimationFrame( function frame( time ) {
    if (!isRunning) return

    const deltaSeconds = Math.min( (time - lastTime) / 1000, 0.1 )
    lastTime = time

    pointer.x += (pointer.targetX - pointer.x) * Math.min( 1, deltaSeconds * 4 )

    // Layers move by whole pixels only, further layers move less
    const shift = depth => Math.round( -pointer.x * depth )

    ctx.drawImage( sky, 0, 0 )

    for (const star of stars) {
      if (Math.sin( time / 700 + star.phase ) < -0.6) continue

      ctx.fillStyle = colors.star
      ctx.fillRect( Math.floor( star.x + shift( 1 ) ), Math.floor( star.y ), 1, 1 )
    }

    for (const line of lines) {
      updateWorldLine( line, deltaSeconds, width, groundY - 6, colors )
      drawWorldLine( ctx, line, shift( 2 ), colors.sky[ 1 ], blocked )
    }

    for (const cloud of clouds) {
      cloud.x += cloud.speed * deltaSeconds
      if (cloud.x > width + 10) cloud.x = -cloud.image.width - 10

      ctx.drawImage( cloud.image, Math.round( cloud.x ) + shift( 2 ), Math.round( cloud.y ) )
    }

    drawProps( skyProps, time, shift( 2 ) )

    ctx.drawImage( farHills, shift( 3 ) - 10, 0 )
    ctx.drawImage( nearHills, shift( 5 ) - 10, 0 )
    drawProps( backProps, time, shift( 6 ) )
    if (ground) ctx.drawImage( ground, shift( 8 ) - 10, 0 )

    for (const cactus of visibleCacti) drawPixelCactus( ctx, Math.round( cactus.x * width ) + shift( 8 ), groundAt( cactus.x * width + 3 ), cactus.size )
    drawProps( groundProps, time, shift( 8 ) )

    // The plate stays still so it lines up with the logo above the canvas
    // With `isShownOutside` the page shows the plate itself (so it can stay while worlds change); the world only keeps it clear
    if (logoPlate && !plate.isShownOutside) ctx.drawImage( logoPlate.canvas, 0, 0 )

    for (const character of characters) updateCharacter( ctx, character, characters, time, deltaSeconds, blocked, shift( 8 ) )

    drawPointerTrail( ctx, trail, time, colors.trail )
    ctx.drawImage( edgeShade, 0, 0 )

    requestAnimationFrame( frame )
  } )

  return function destroyPixelWorld() {
    isRunning = false
    removeEventListener( `pointermove`, onPointerMove )
    canvas.remove()
  }
}

// Puts the character at its start and moves it out of the blocked area, or hides it when there is no room
function placeCharacter( character, characters, width, groundY, margin, blocked ) {
  const sheet = SHEETS[ character.sheet ]
  const altitude = Math.round( (character.altitude ?? 0) * (groundY - sheet.height) )

  character.x = Math.round( character.startX * width )
  character.y = groundY - sheet.height + (character.isFloating ? -altitude : 1)
  character.direction ??= -1
  character.pauseLeft = 1 + (character.phase ?? 0) * 0.4

  // Characters stay fully inside the visible part of the world
  const [ minFraction, maxFraction ] = character.walkRange ?? [ 0, 1 ]

  character.minX = Math.max( margin, Math.round( minFraction * width ) )
  character.maxX = Math.min( width - margin - sheet.width, Math.round( maxFraction * width ) )
  character.x = Math.min( character.maxX, Math.max( character.minX, character.x ) )

  if (blocked && overlaps( characterRect( character, character.x ), blocked )) {
    const isLeft = character.x + sheet.width / 2 < (blocked.left + blocked.right) / 2
    character.x = isLeft ? blocked.left - sheet.width : blocked.right
  }

  const isOutside = character.x < character.minX || character.x > character.maxX
  const isOnOther = characters.some( other => other !== character && other.x !== undefined && !other.isHidden && overlaps( characterRect( character, character.x ), characterRect( other, other.x ) ) )

  character.isHidden = isOutside || isOnOther
}

function updateCharacter( ctx, character, characters, time, deltaSeconds, blocked, shiftX ) {
  if (character.isHidden) return

  const sheet = SHEETS[ character.sheet ]
  const phase = character.phase ?? 0
  const isMoving = character.walkRange && character.pauseLeft <= 0

  if (isMoving) {
    const nextX = character.x + character.direction * (character.speed ?? 9) * deltaSeconds
    const nextRect = characterRect( character, nextX )
    const isAtEdge = nextX <= character.minX || nextX >= character.maxX
    const isAtLogo = blocked && overlaps( nextRect, blocked )

    // Characters turn back when they bump into each other, but only the one walking towards the other
    const isAtOther = characters.some( other => other !== character && !other.isHidden && Math.sign( other.x - character.x ) === character.direction && overlaps( nextRect, characterRect( other, other.x ) ) )

    if (isAtEdge || isAtLogo || isAtOther) {
      character.direction *= -1
      character.pauseLeft = 2.5
    } else {
      character.x = nextX
    }
  } else {
    character.pauseLeft -= deltaSeconds
  }

  let row = character.direction > 0 ? 1 : 0
  let frameTime = 180

  if (character.isFloating) {
    row = character.direction > 0 ? 2 : 3
    frameTime = 140
  } else if (isMoving) {
    row = character.direction > 0 ? 3 : 2
    frameTime = 140
  }

  // Walkers follow the ground's height under their middle
  if (!character.isFloating && character.groundAt) character.y = character.groundAt( character.x + sheet.width / 2 ) - sheet.height + 1

  const bob = character.isFloating ? Math.round( Math.sin( time / 600 + phase ) * 2 ) : 0
  const column = Math.floor( time / frameTime + phase * 3 ) % 8

  ctx.drawImage( sheetImages[ character.sheet ], column * (sheet.width + 1), row * (sheet.height + 1), sheet.width, sheet.height, Math.round( character.x ) + shiftX, character.y + bob, sheet.width, sheet.height )
}

/* ---- Logo plate: a pixel backing for the smooth logo, styled after the biome ---- */

function createPlate( width, height, logoRect, plate, groundY ) {
  const { canvas, ctx } = createPixelLayer( width, height )
  const rect = { left:logoRect.left - PLATE_PADDING.x, top:logoRect.top - PLATE_PADDING.y, right:logoRect.right + PLATE_PADDING.x, bottom:logoRect.bottom + PLATE_PADDING.y }

  // A ready-made image (the logo already on its own plate) replaces both the drawn plate and the logo
  if (plate.image) ctx.drawImage( plate.image, logoRect.left, logoRect.top )
  else if (plate.style === `cloud`) drawCloudPlate( ctx, rect, plate )
  else drawSlabPlate( ctx, rect, plate )

  // The logo is drawn by the world itself, so its pixels sit on the same grid as everything else
  if (!plate.image) ctx.drawImage( createLogoImage(), logoRect.left, logoRect.top )

  // Posts are left out of the blocked area: characters can walk in front of them
  const bounds = drawnBounds( ctx, width, height )

  if (plate.hasPosts && !plate.image) drawPlatePosts( ctx, rect, plate, groundY )

  return { canvas, bounds }
}

function drawSlabPlate( ctx, rect, plate ) {
  const { left, top, right, bottom } = rect
  const width = right - left
  const height = bottom - top

  // Outline with notched corners, then the face with a lit top and shaded bottom and right edges
  ctx.fillStyle = plate.outline
  ctx.fillRect( left + 1, top, width - 2, height )
  ctx.fillRect( left, top + 1, width, height - 2 )

  ctx.fillStyle = plate.fill
  ctx.fillRect( left + 2, top + 1, width - 4, height - 2 )
  ctx.fillRect( left + 1, top + 2, width - 2, height - 4 )

  ctx.fillStyle = plate.light
  ctx.fillRect( left + 2, top + 1, width - 4, 1 )

  ctx.fillStyle = plate.shade
  ctx.fillRect( left + 2, bottom - 2, width - 4, 1 )
  ctx.fillRect( right - 2, top + 2, 1, height - 4 )

  if (plate.snow) {
    ctx.fillStyle = plate.snow
    for (let x = left + 1; x < right - 1; x++) ctx.fillRect( x, top, 1, 2 + ((x * 7) % 5 === 0 ? 2 : (x * 3) % 4 === 0 ? 1 : 0) )
  }

  if (plate.drips) {
    ctx.fillStyle = plate.drips
    ctx.fillRect( left + 1, top, width - 2, 2 )
    for (let x = left + 2; x < right - 2; x++) if ((x * 7) % 5 === 0) ctx.fillRect( x, top + 2, (x % 2) + 1, 1 + (x * 3) % 5 )
  }

  if (plate.moss) {
    ctx.fillStyle = plate.moss
    for (let x = left + 1; x < right - 1; x++) ctx.fillRect( x, top, 1, 1 + (x * 5) % 3 )

    for (let x = left + 3; x < right - 3; x += 6 + (x % 3)) {
      ctx.fillStyle = plate.flower
      ctx.fillRect( x, top - 2, 1, 3 )
      ctx.fillRect( x - 1, top - 1, 3, 1 )
      ctx.fillStyle = plate.flowerCenter
      ctx.fillRect( x, top - 1, 1, 1 )
    }
  }

  if (plate.bolts) {
    ctx.fillStyle = plate.bolts
    for (const [ x, y ] of [ [ left + 2, top + 2 ], [ right - 3, top + 2 ], [ left + 2, bottom - 3 ], [ right - 3, bottom - 3 ] ]) ctx.fillRect( x, y, 1, 1 )
  }

  if (plate.flask) drawPixelMap( ctx, FLASK_ROWS, plate.flask, right - 12, top - FLASK_ROWS.length + 1 )
}

function drawCloudPlate( ctx, rect, plate ) {
  const height = rect.bottom - rect.top
  const middleY = (rect.top + rect.bottom) / 2
  const puffs = [ { x:rect.left, y:middleY, radius:height / 2 }, { x:rect.right, y:middleY, radius:height / 2 } ]

  for (let x = rect.left + 6, index = 0; x < rect.right - 4; x += 10, index++) puffs.push({ x, y:rect.top + 2, radius:5 + (index % 3) * 2 })

  // Draw the shape one pixel larger in the outline colour first, then the cloud itself
  for (const [ grow, color ] of [ [ 1, plate.outline ], [ 0, plate.fill ] ]) {
    ctx.fillStyle = color
    ctx.fillRect( rect.left, rect.top - grow, rect.right - rect.left, height + grow * 2 )
    for (const puff of puffs) fillCircle( ctx, puff.x, puff.y, puff.radius + grow )
  }

  // Shade only the cloud's own pixels along its bottom
  ctx.globalCompositeOperation = `source-atop`
  ctx.fillStyle = plate.shade
  ctx.fillRect( rect.left - height, rect.bottom - 2, rect.right - rect.left + height * 2, 2 )
  ctx.globalCompositeOperation = `source-over`
}

function drawPlatePosts( ctx, rect, plate, groundY ) {
  for (const x of [ rect.left + 4, rect.right - 6 ]) {
    ctx.fillStyle = plate.outline
    ctx.fillRect( x - 1, rect.bottom, 4, groundY - rect.bottom + 1 )
    ctx.fillStyle = plate.post
    ctx.fillRect( x, rect.bottom, 2, groundY - rect.bottom + 1 )
  }
}

// Cells shrink in whole pixels as they age: 2×2, then 1×1, then gone
function drawPointerTrail( ctx, trail, time, color ) {
  const lifetime = 900

  while (trail.length && time - trail.at( -1 ).createdAt > lifetime) trail.pop()

  ctx.fillStyle = color

  for (const cell of trail) {
    const size = time - cell.createdAt < lifetime / 2 ? 2 : 1
    ctx.fillRect( cell.x, cell.y, size, size )
  }
}

// Cracks show what is behind the cactus: the plate colour when given, otherwise transparency
function drawLogoCactus( ctx, left, top, backgroundColor ) {
  const { width, height, parts, cracks, dots, colors } = LOGO_CACTUS
  const isFilled = Array.from({ length:height }, () => new Array( width ).fill( false ) )

  for (const { rect:[ x, y, partWidth, partHeight ] } of parts) {
    for (let row = y; row < y + partHeight; row++) for (let column = x; column < x + partWidth; column++) isFilled[ row ][ column ] = true
  }

  // Rounded corners are cut out after all parts are in, so a part cannot fill another part's corner back
  for (const { rect:[ x, y, partWidth, partHeight ], corners = [] } of parts) {
    const cornerPixels = { topLeft:[ x, y ], topRight:[ x + partWidth - 1, y ], bottomLeft:[ x, y + partHeight - 1 ], bottomRight:[ x + partWidth - 1, y + partHeight - 1 ] }
    for (const corner of corners) isFilled[ cornerPixels[ corner ][ 1 ] ][ cornerPixels[ corner ][ 0 ] ] = false
  }

  fillShadedMask( ctx, isFilled, left, top )

  ctx.fillStyle = backgroundColor
  for (const [ x, y ] of cracks) backgroundColor ? ctx.fillRect( left + x, top + y, 1, 1 ) : ctx.clearRect( left + x, top + y, 1, 1 )

  ctx.fillStyle = colors.dot
  for (const [ x, y ] of dots) ctx.fillRect( left + x, top + y, 1, 1 )
}

/* The signet alone on its own canvas, for small places (rail, favicon) */
function drawLogoCactusCanvas( canvas ) {
  canvas.width = LOGO_CACTUS.width
  canvas.height = LOGO_CACTUS.height
  drawLogoCactus( canvas.getContext( `2d` ), 0, 0 )
}

/**
 * The whole logo in pixels: the signet with a flower on top and the wordmark made of the same cactus,
 * so both share one set of greens. Needs the cactu font to be loaded. Drawn once, then reused.
 */
function createLogoImage() {
  if (logoImageCache.image) return logoImageCache.image

  const word = rasterizeText( `cactu`, 21, Math.round( 21 * 0.19 ) )
  const top = 2
  const gap = 3
  const { canvas, ctx } = createPixelLayer( LOGO_CACTUS.width + gap + word.width, LOGO_CACTUS.height + top )

  drawLogoCactus( ctx, 0, top )

  // A flower on the trunk
  ctx.fillStyle = `#f08cb4`
  ctx.fillRect( 11, 0, 1, 1 )
  ctx.fillRect( 10, 1, 3, 1 )
  ctx.fillStyle = `#ffe08a`
  ctx.fillRect( 11, 1, 1, 1 )

  // The wordmark stands on the same line as the cactus
  fillShadedMask( ctx, word.isFilled, LOGO_CACTUS.width + gap, canvas.height - word.height )

  ctx.fillStyle = LOGO_CACTUS.colors.dot
  word.isFilled.forEach( (row, y) => row.forEach( (isFilled, x) => {
    const isInside = isFilled && row[ x - 1 ] && row[ x + 1 ] && word.isFilled[ y - 1 ]?.[ x ] && word.isFilled[ y + 1 ]?.[ x ]
    if (isInside && (x * 7 + y * 3) % 17 === 0) ctx.fillRect( LOGO_CACTUS.width + gap + x, canvas.height - word.height + y, 1, 1 )
  } ) )

  logoImageCache.image = canvas

  return canvas
}

function drawLogoCanvas( canvas ) {
  const image = createLogoImage()

  canvas.width = image.width
  canvas.height = image.height
  canvas.getContext( `2d` ).drawImage( image, 0, 0 )
}

// Draws text with the browser, then keeps only the solid pixels: a pixel version of any font
function rasterizeText( text, fontSize, letterSpacing, family = `cactu` ) {
  const { canvas, ctx } = createPixelLayer( fontSize * text.length * 2, fontSize * 2 )

  ctx.font = `${fontSize}px ${family}`
  ctx.letterSpacing = `${letterSpacing}px`
  ctx.textBaseline = `top`
  ctx.fillText( text, 2, 2 )

  const bounds = drawnBounds( ctx, canvas.width, canvas.height )
  const { data } = ctx.getImageData( bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top )
  const width = bounds.right - bounds.left
  const height = bounds.bottom - bounds.top
  const isFilled = Array.from({ length:height }, (_, y) => Array.from({ length:width }, (_, x) => data[ (y * width + x) * 4 + 3 ] > 110 ) )

  return { width, height, isFilled }
}

// Each pixel is lit on the left edge of the shape and shaded on its right and bottom edges
function fillShadedMask( ctx, isFilled, left, top ) {
  const { colors } = LOGO_CACTUS

  isFilled.forEach( (row, y) => row.forEach( (isPixel, x) => {
    if (!isPixel) return

    const isLeftEdge = !row[ x - 1 ]
    const isShadedEdge = !row[ x + 1 ] || !isFilled[ y + 1 ]?.[ x ]

    ctx.fillStyle = isLeftEdge ? colors.light : isShadedEdge ? colors.shade : colors.base
    ctx.fillRect( left + x, top + y, 1, 1 )
  } ) )
}

// Sizes the logo slot to the logo in world pixels and moves it to the scene's spot.
// Returns the slot's rectangle, so the world can draw a plate and the logo there and keep that area clear.
// `world` is { hole, pixel, groundHeight }, `scene` is { logo:{ x, y, isOnGround }, plate }
function placeLogo( world, scene ) {
  const banner = world.hole.querySelector( `.banner` )
  const image = scene.plate.image ?? createLogoImage()
  const width = image.width * world.pixel
  const height = image.height * world.pixel

  banner.style.width = `${width}px`
  banner.style.height = `${height}px`

  const groundTop = (Math.ceil( world.hole.clientHeight / world.pixel ) - world.groundHeight) * world.pixel
  const snap = value => Math.round( value / world.pixel ) * world.pixel
  const x = snap( scene.logo.x * world.hole.clientWidth - width / 2 )

  // On the ground the plate stands on it (raised by its posts); in the sky the logo is centered on the given height
  const lift = scene.plate.image ? 0 : (PLATE_PADDING.y + (scene.plate.hasPosts ? scene.plate.postHeight ?? 0 : 0)) * world.pixel
  const y = snap( scene.logo.isOnGround ? groundTop - lift - height : scene.logo.y * groundTop - height / 2 )

  banner.style.translate = `${x}px ${y}px`

  return { x, y, width, height }
}

/* ---- Scenery ---- */

function drawPixelCactus( ctx, x, groundY, size = 1 ) {
  const [ light, base, shade, outline ] = WORLD_COLORS.cactus
  const parts = cactusParts( x, groundY, size )

  // Outline first, then the body with a lit left column and shaded right column
  ctx.fillStyle = outline
  for (const [ partX, partY, partWidth, partHeight ] of parts) ctx.fillRect( partX - 1, partY - 1, partWidth + 2, partHeight + 2 )

  for (const [ partX, partY, partWidth, partHeight ] of parts) {
    ctx.fillStyle = base
    ctx.fillRect( partX, partY, partWidth, partHeight )
    ctx.fillStyle = light
    ctx.fillRect( partX, partY, 1, partHeight )
    ctx.fillStyle = shade
    ctx.fillRect( partX + partWidth - 1, partY + 1, 1, partHeight - 1 )
  }
}

/* The default avatar: a small cactus on a patch of sand, 16×16 pixels */
function drawCactusAvatar( canvas, background = `#e7f0d9`, sand = `#d9c48e` ) {
  const ctx = canvas.getContext( `2d` )

  canvas.width = 16
  canvas.height = 16

  ctx.fillStyle = background
  ctx.fillRect( 0, 0, 16, 16 )
  ctx.fillStyle = sand
  ctx.fillRect( 0, 14, 16, 2 )

  drawPixelCactus( ctx, 7, 14, 1 )

  // A flower on top
  ctx.fillStyle = `#e2557a`
  ctx.fillRect( 7, 0, 3, 1 )
  ctx.fillRect( 8, 1, 1, 1 )
}

function createWorldSky( width, height, groundY, horizonGlow, skyColors ) {
  const { canvas, ctx } = createPixelLayer( width, height )
  const image = ctx.createImageData( width, height )
  const palette = skyColors.map( hexToRgb )

  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const verticalGlow = Math.max( 0, 1 - (groundY - y) / (groundY * 0.9) )
    const value = 0.3 + verticalGlow * 2.6 * horizonGlow
    const step = Math.min( palette.length - 1, Math.floor( value + BAYER[ (y % 4) * 4 + (x % 4) ] / 16 ) )

    image.data.set([ ...palette[ step ], 255 ], (y * width + x) * 4 )
  }

  ctx.putImageData( image, 0, 0 )

  return canvas
}

// Terrain styles: mesa (stepped), dunes (smooth), peaks (jagged with snow), puffs (round, for clouds, bushes or goo)
function createHills( width, height, baseY, amplitude, color, seed, style, details = {} ) {
  const { canvas, ctx } = createPixelLayer( width, height )
  const tops = style === `puffs` ? puffTops( width, baseY, amplitude, seed ) : Array.from({ length:width }, (_, x) => baseY - Math.round( hillHeight( x / Math.max( 1, details.stretch ?? 1 ), seed, style ) * amplitude ) )

  ctx.fillStyle = color
  for (let x = 0; x < width; x++) ctx.fillRect( x, tops[ x ], 1, height - tops[ x ] )

  // Mesa walls are striped with horizontal bands of clay
  if (details.bands) for (let x = 0; x < width; x++) for (let y = tops[ x ] + 2; y < height; y++) {
    ctx.fillStyle = details.bands[ Math.floor( y / 3 ) % details.bands.length ]
    ctx.fillRect( x, y, 1, 1 )
  }

  if (style === `peaks`) for (let x = 0; x < width; x++) {
    if (baseY - tops[ x ] < amplitude * 0.6) continue

    ctx.fillStyle = details.snow
    ctx.fillRect( x, tops[ x ], 1, 2 + (x % 3 === 0 ? 1 : 0) )
  }

  if (details.rim) {
    ctx.fillStyle = details.rim
    for (let x = 0; x < width; x++) ctx.fillRect( x, tops[ x ], 1, 1 )
  }

  return canvas
}

function hillHeight( x, seed, style ) {
  if (style === `dunes`) return (Math.sin( x * 0.016 * seed + seed ) * 0.6 + Math.sin( x * 0.041 + seed * 2 ) * 0.4) * 0.5 + 0.5

  if (style === `peaks`) {
    const period = 22 + seed * 10
    const shifted = x + seed * 13
    const slope = 1 - Math.abs( (shifted % period) / period * 2 - 1 )

    return slope * (0.55 + 0.45 * Math.sin( Math.floor( shifted / period ) * 2.1 + seed ) ** 2)
  }

  const block = Math.floor( x / 4 ) * 4
  return (Math.sin( block * 0.031 * seed + seed ) * 0.6 + Math.sin( block * 0.083 + seed * 2 ) * 0.4) * 0.5 + 0.5
}

// A row of overlapping circles, like a cloud bank or a line of bushes
function puffTops( width, baseY, amplitude, seed ) {
  const tops = new Array( width ).fill( baseY )

  for (let centerX = -6, index = 0; centerX < width + 6; index++) {
    const radius = Math.round( amplitude * (0.35 + 0.3 * (Math.sin( index * 1.7 + seed * 3 ) + 1) / 2) )
    const centerY = baseY - Math.round( amplitude * 0.25 * (Math.sin( index * 2.3 + seed ) + 1) / 2 )

    for (let x = Math.max( 0, centerX - radius ); x <= Math.min( width - 1, centerX + radius ); x++) {
      tops[ x ] = Math.min( tops[ x ], centerY - Math.floor( Math.sqrt( radius ** 2 - (x - centerX) ** 2 ) ) )
    }

    centerX += Math.max( 4, Math.round( radius * 1.3 ) )
  }

  return tops
}

// `groundY` is the surface's height, or one height per column
function createGround( width, height, groundY, colors ) {
  const { canvas, ctx } = createPixelLayer( width, height )
  const topAt = x => Array.isArray( groundY ) ? groundY[ x ] : groundY

  for (let x = 0; x < width; x++) {
    ctx.fillStyle = colors.ground
    ctx.fillRect( x, topAt( x ), 1, height - topAt( x ) )

    // The rim also runs down the side of every step up
    ctx.fillStyle = colors.groundRim
    const step = Math.max( 1, topAt( x - 1 ) - topAt( x ) + 1, topAt( x + 1 ) - topAt( x ) + 1 )
    ctx.fillRect( x, topAt( x ), 1, x > 0 && x < width - 1 ? step : 1 )
  }

  // Sparse pebbles so the ground is not a flat slab
  ctx.fillStyle = colors.pebble
  for (let x = 3; x < width; x += 7 + (x * 13) % 9) ctx.fillRect( x, topAt( x ) + 3 + (x * 7) % 9, 2, 1 )

  return canvas
}

function createCloudPuff( size, colors ) {
  const { canvas, ctx } = createPixelLayer( size + 2, Math.ceil( size * 0.6 ) + 2 )
  const radius = size / 4

  ctx.fillStyle = colors.cloud
  fillCircle( ctx, radius + 1, canvas.height - radius - 1, radius )
  fillCircle( ctx, size / 2 + 1, canvas.height - radius * 1.6 - 1, radius * 1.4 )
  fillCircle( ctx, size - radius + 1, canvas.height - radius - 1, radius )
  ctx.fillRect( radius + 1, canvas.height - radius - 1, size - radius * 2, radius )

  ctx.globalCompositeOperation = `source-atop`
  ctx.fillStyle = colors.cloudShade
  ctx.fillRect( 0, canvas.height - 2, canvas.width, 2 )
  ctx.globalCompositeOperation = `source-over`

  return canvas
}

// A dithered dark band along the edges: the world sits a little deeper than the page
function createEdgeShade( width, height, margin, color ) {
  const { canvas, ctx } = createPixelLayer( width, height )
  const densities = [ 12, 7, 3 ]

  ctx.fillStyle = color

  for (let y = margin; y < height - margin; y++) for (let x = margin; x < width - margin; x++) {
    const distance = Math.min( x - margin, width - margin - 1 - x, y - margin, height - margin - 1 - y )
    if (distance >= densities.length) continue

    if (BAYER[ (y % 4) * 4 + (x % 4) ] < densities[ distance ]) ctx.fillRect( x, y, 1, 1 )
  }

  return canvas
}

function createWorldLine( width, maxY, colors, fromLeft = false ) {
  const isAccent = Math.random() > 0.92
  const length = 2 + Math.floor( Math.random() * 8 ) + (isAccent ? 3 : 0)

  return {
    x: fromLeft ? -length : Math.random() * width,
    y: 2 + Math.floor( Math.random() * (maxY - 2) ),
    length,
    speed: 2 + Math.random() * 8,
    opacity: Math.random(),
    fadeSpeed: 0.15 + Math.random() * 0.4,
    isShowing: Math.random() > 0.5,
    isAccent,
    color: isAccent ? colors.lineAccents[ Math.floor( Math.random() * colors.lineAccents.length ) ] : colors.lineGray,
  }
}

function updateWorldLine( line, deltaSeconds, width, maxY, colors ) {
  line.x += line.speed * deltaSeconds
  line.opacity += line.fadeSpeed * deltaSeconds * (line.isShowing ? 1 : -1)
  line.opacity = Math.min( 1, Math.max( 0, line.opacity ) )

  if (line.opacity === 0) line.isShowing = true
  else if (line.opacity === 1) line.isShowing = false

  if (line.x > width + 10) Object.assign( line, createWorldLine( width, maxY, colors, true ) )
}

function drawWorldLine( ctx, line, shiftX, skyColor, blocked ) {
  const step = Math.round( line.opacity * 3 ) / 3
  if (step === 0) return

  const x = Math.floor( line.x ) + shiftX
  if (blocked && overlaps({ left:x, top:line.y - 1, right:x + line.length, bottom:line.y + 2 }, blocked )) return

  ctx.fillStyle = mixHex( skyColor, line.color, line.isAccent ? step : step * 0.45 )
  ctx.fillRect( x, line.y, line.length, 1 )

  if (line.isAccent) ctx.fillRect( x + 1, line.y - 1, line.length - 2, 3 )
}

/* Placeholder game screenshots: tiny pixel scenes with their own palette */
function drawThumbnail( canvas, palette, seed ) {
  const ctx = canvas.getContext( `2d` )
  const [ background, pattern, accent, detail ] = palette
  let state = seed * 9301 + 49297

  const random = () => (state = (state * 9301 + 49297) % 233280) / 233280

  canvas.width = 24
  canvas.height = 24

  ctx.fillStyle = background
  ctx.fillRect( 0, 0, 24, 24 )

  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    if (random() > 0.22) continue

    ctx.fillStyle = pattern
    ctx.fillRect( x, y, 1, 1 )
  }

  ctx.fillStyle = pattern
  ctx.fillRect( 0, 18, 24, 6 )

  ctx.fillStyle = accent
  ctx.fillRect( 10, 9, 4, 4 )
  ctx.fillRect( 11, 13, 2, 5 )
  ctx.fillStyle = detail
  ctx.fillRect( 11, 10, 1, 1 )
  ctx.fillRect( 13, 10, 1, 1 )
}

/* ---- Sprites ---- */

function loadSheet( name ) {
  const sheet = SHEETS[ name ]

  if (sheet.sprite) {
    sheetImages[ name ] ??= createPlaceholderSheet( sheet )
    return Promise.resolve()
  }

  if (!sheetImages[ name ]) {
    sheetImages[ name ] = new Image()
    sheetImages[ name ].src = sheet.src
  }

  return sheetImages[ name ].decode()
}

// Same layout as the real sheets: rows are idle left, idle right, walk left, walk right; 8 frames each
function createPlaceholderSheet( sheet ) {
  const { canvas, ctx } = createPixelLayer( (sheet.width + 1) * 8, (sheet.height + 1) * 4 )
  const { rows, palette } = sheet.sprite

  for (let row = 0; row < 4; row++) for (let column = 0; column < 8; column++) {
    const isWalking = row >= 2
    const lift = isWalking ? [ 0, 1, 1, 0, 0, 1, 1, 0 ][ column ] : 0
    const isBlinking = !isWalking && column === 6

    drawPixelMap( ctx, rows, isBlinking ? { ...palette, w:palette.b, k:palette.b } : palette, column * (sheet.width + 1), row * (sheet.height + 1) + 1 - lift, row % 2 === 0 )
  }

  return canvas
}

// A still frame of a placeholder character, for portraits
function placeholderPortrait( name ) {
  const sheet = SHEETS[ name ]
  const { canvas, ctx } = createPixelLayer( sheet.width, sheet.height )

  loadSheet( name )
  ctx.drawImage( sheetImages[ name ], 0, sheet.height + 1, sheet.width, sheet.height, 0, 0, sheet.width, sheet.height )

  return canvas.toDataURL()
}

function drawPixelMap( ctx, rows, palette, left, top, isMirrored = false, scale = 1 ) {
  const width = Math.max( ...rows.map( row => row.length ) )

  rows.forEach( (row, y) => [ ...row ].forEach( (key, x) => {
    if (!palette[ key ]) return

    ctx.fillStyle = palette[ key ]
    ctx.fillRect( left + (isMirrored ? width - 1 - x : x) * scale, top + y * scale, scale, scale )
  } ) )
}

function loadCactuFont() {
  return new FontFace( `cactu`, `url(${CACTU_FONT_URL})` ).load().then( font => document.fonts.add( font ) )
}

/* ---- Geometry and canvas helpers ---- */

function cactusParts( x, groundY, size ) {
  const trunkHeight = 9 + size * 4
  const top = groundY - trunkHeight

  return [
    [ x, top, 3, trunkHeight ],
    [ x - 3, top + 4, 2, 4 ],
    [ x - 3, top + 7, 3, 2 ],
    [ x + 4, top + 2, 2, 4 ],
    [ x + 3, top + 5, 3, 2 ],
  ]
}

function cactusRect( x, groundY, size = 1 ) {
  return { left:x - 4, top:groundY - 10 - size * 4, right:x + 7, bottom:groundY }
}

function characterRect( character, x ) {
  const sheet = SHEETS[ character.sheet ]
  const bob = character.isFloating ? 2 : 0

  return { left:x, top:character.y - bob, right:x + sheet.width, bottom:character.y + sheet.height + bob }
}

function toWorldRect( rect, pixel, margin ) {
  return {
    left: Math.floor( rect.x / pixel ) + margin,
    top: Math.floor( rect.y / pixel ) + margin,
    right: Math.ceil( (rect.x + rect.width) / pixel ) + margin,
    bottom: Math.ceil( (rect.y + rect.height) / pixel ) + margin,
  }
}

function expandRect( rect, amount ) {
  return { left:rect.left - amount, top:rect.top - amount, right:rect.right + amount, bottom:rect.bottom + amount }
}

function overlaps( a, b ) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

// The smallest rectangle around everything drawn on a layer so far
function drawnBounds( ctx, width, height ) {
  const { data } = ctx.getImageData( 0, 0, width, height )
  const bounds = { left:width, top:height, right:0, bottom:0 }

  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!data[ (y * width + x) * 4 + 3 ]) continue

    bounds.left = Math.min( bounds.left, x )
    bounds.top = Math.min( bounds.top, y )
    bounds.right = Math.max( bounds.right, x + 1 )
    bounds.bottom = Math.max( bounds.bottom, y + 1 )
  }

  return bounds
}

function fillCircle( ctx, centerX, centerY, radius ) {
  for (let offsetY = -Math.floor( radius ); offsetY <= radius; offsetY++) {
    const half = Math.floor( Math.sqrt( radius ** 2 - offsetY ** 2 ) )
    ctx.fillRect( Math.round( centerX ) - half, Math.round( centerY ) + offsetY, half * 2 + 1, 1 )
  }
}

function createWorldCanvas( width, height, margin, pixel ) {
  const layer = createPixelLayer( width, height )

  layer.canvas.style.inset = `${-margin * pixel}px`
  layer.canvas.style.width = `${width * pixel}px`
  layer.canvas.style.height = `${height * pixel}px`

  return layer
}

function createPixelLayer( width, height ) {
  const canvas = document.createElement( `canvas` )
  canvas.width = width
  canvas.height = height

  return { canvas, ctx:canvas.getContext( `2d`, { willReadFrequently:true } ) }
}

function hexToRgb( hex ) {
  const value = parseInt( hex.slice( 1, 7 ), 16 )
  return [ value >> 16, (value >> 8) & 255, value & 255 ]
}

function mixHex( from, to, amount ) {
  const [ fromR, fromG, fromB ] = hexToRgb( from )
  const [ toR, toG, toB ] = hexToRgb( to )
  const mix = (a, b) => Math.round( a + (b - a) * amount )

  return `rgb( ${mix( fromR, toR )}, ${mix( fromG, toG )}, ${mix( fromB, toB )} )`
}
