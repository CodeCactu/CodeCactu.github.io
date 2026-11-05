/* The page so far: the header. The hero cut as a hole in the void, the navigation and the cast list */

/*
  Version 4: v3's rules (pixels only inside zones, the cactu letters' curves on every edge), with the hero's hole cut in
  blocks like the current site: the void crumbles into the world in squares, with lone squares on both sides of the edge
*/

// The hero world's pixel size in CSS px
const HERO_PIXEL = 2

const hero = { hole:document.getElementById( `heroWorld` ), pixel:HERO_PIXEL, switchId:0 }

/*
  The character the user chose (kept in ?character=, so it survives a refresh), or null; and the character whose world is
  shown: the chosen one, or without a choice the first of the shuffled cast (defaultCharacter, set by fillRoster)
*/
let chosenCharacter = NIGHT[ params.get( `character` ) ] ? params.get( `character` ) : null
let defaultCharacter = null
let currentCharacter = chosenCharacter

start()

async function start() {
  startShell()
  fillRoster()
  tintPage( currentCharacter )

  await loadCactuFont()
  await document.fonts.ready
  await Promise.all( [ `evolveye`, `ranfisz` ].map( loadSheet ) )

  for (const field of document.querySelectorAll( `[data-field]` )) {
    buildField( field )
    watchField( field )
  }

  buildCastPanel( document.getElementById( `castPanel` ) )

  showSelectedInRoster()
  await showHero()
}

/* ================= ZONES ================= */

// A zone is rebuilt when its size changes; worlds inside are rebuilt with it
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
      if (field.id === `heroField`) {
        buildCastPanel( document.getElementById( `castPanel` ) )
        showHero()
      }
    }, 200 )
  } ).observe( field )
}

function buildField( field ) {
  const shape = createHeroShape( field )
  const toPx = loop => loop.map( ({ x, y }) => ({ x:x * G, y:y * G }) )

  // The hero is a hole: every loop counts (the crumbs too), and the void, not the world, gets the letters' round corners
  const path = traceCells( shape.isInside, shape.from, shape.to, { isSmoothed:false, isAllLoops:true } ).map( loop => roundedPath( toPx( loop ), HOLE_CURVE ) ).join( `` )

  field.shape = { ...shape, path }

  // The world is cut to the hole
  field.querySelector( `.world` ).style.clipPath = `path( evenodd, "${path}" )`

  // The void lies over the world like a sheet with a hole cut in it, so it casts a soft shadow down and right into the hole
  prepareShapeSvg( field, `fieldEdge` ).innerHTML = `
    <defs>
      <clipPath id="heroHole"><path d="${path}" clip-rule="evenodd" /></clipPath>
      <filter id="heroShadow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4" /></filter>
    </defs>
    <g clip-path="url(#heroHole)"><path class="holeShadow" d="${path}" fill-rule="evenodd" transform="translate( 3 4 )" filter="url(#heroShadow)" /></g>`
}

/* ================= HERO ================= */

/**
 * The hero is a hole in the void, cut in blocks like the current site, with the selected character's world inside.
 * Its left edge is a keyhole of void around the sticky signet and the navigation, on the right it ends straight against the
 * cast list's column, and from below the void bites into its ground
 */
function createHeroShape( field ) {
  const random = seeded( Number( field.dataset.seed ) )
  const cols = Math.ceil( field.clientWidth / G )
  const rows = Math.floor( field.clientHeight / G )
  const block = HOLE_BLOCK * G
  const blockCols = Math.ceil( cols / HOLE_BLOCK ) + 1
  const blockRows = Math.ceil( rows / HOLE_BLOCK )
  const space = clearances( field )
  const isBeside = Boolean( space )
  const isHero = Array.from({ length:blockRows }, () => new Array( blockCols ).fill( true ) )
  const set = (x, y, value) => {
    if (x >= 0 && y >= 0 && x < blockCols && y < blockRows) isHero[ y ][ x ] = value
  }

  /*
    The left edge is cut in blocks like the current site. It always keeps clear of the sticky signet's column (the hero
    scrolls past it) and, from the navigation's place at the hero's bottom down, of the navigation and the account: the
    navigation starts there and, once it reaches the signet, sticks while the rest of the hero scrolls under it, so only
    the rows from its place down ever pass behind it. Every row of blocks steps a little in or out around the curve, so no
    part of the edge runs straight, and the corner into the bottom edge is rounded in steps. Next to the edge, one block
    away from it, lone blocks: holes of void in the world and pieces of the world out in the void (never where the rail's
    things are)
  */
  const toBlocks = px => Math.ceil( px / block )
  const signetMin = isBeside ? toBlocks( space.signetRight + 10 ) : 0
  const nav = isBeside ? { top:Math.floor( space.navTop / block ), right:toBlocks( space.navRight + 12 ) } : null
  /*
    Around the full logo the void steps in diagonally, from the top right down towards the signet's column: a block wider
    above the logo's last row, the logo's own width on its rows, and a block less on the row just below it
  */
  const brandMin = isBeside ? toBlocks( space.brandRight + 14 ) : 0
  const brandLastRow = isBeside ? Math.floor( (space.brandBottom - 1) / block ) : -1
  const headAt = row => row < brandLastRow ? brandMin + Math.max( 0, brandLastRow - 1 - row ) : row === brandLastRow ? brandMin : row === brandLastRow + 1 ? brandMin - 1 : 0
  const nearest = row => !isBeside ? 0 : row >= nav.top - 1 ? nav.right : Math.max( signetMin, headAt( row ) )
  const left = new Array( blockRows ).fill( 0 )

  /*
    The edge follows one smooth curve, in px from the hero's top: from wide at the top right it runs diagonally past the
    full logo down to its narrowest beside the signet, then rises in a straight diagonal into the navigation's corner,
    slopes out past the navigation and sweeps out wide into the bottom edge. Its points come from what the rail holds, so it fits any height
  */
  const height = rows * G
  let rise = { from:Infinity, to:-Infinity }
  const profile = !isBeside ? [] : (() => {
    // The narrowest place, and from there a straight diagonal into the navigation's corner, so the world reaches in as far
    // as it can above the navigation
    // The neck stays narrow down to about three blocks above the navigation; only then does the edge climb out to it
    const neckY = Math.max( space.brandBottom + 120, space.navTop - 200 )
    const neckEndY = Math.max( neckY + 36, space.navTop - 110 )
    const riseY = Math.max( neckEndY + 30, space.navTop - 40 )
    rise = { from:neckY, to:space.navTop }
    return [
      [ 0, space.brandRight + 95 ],
      [ space.brandBottom + 20, space.brandRight - 50 ],
      [ neckY, space.signetRight + 15 ],
      [ neckEndY, space.signetRight + 19 ],
      [ riseY, (space.signetRight + space.navRight) / 2 + 30 ],
      [ space.navTop, space.navRight + 30 ],
      [ height, space.navRight + 175 ],
    ]
  })()
  const edgeAt = y => curveThrough( profile, y )

  // The corner into the bottom edge: a quarter circle of this many blocks, drawn in steps
  const corner = 5

  for (let row = 0; row < blockRows && isBeside; row++) {
    const curve = edgeAt( (row + 0.5) * block ) / block
    const fromBottom = blockRows - row - 0.5
    const rounding = fromBottom < corner ? Math.round( corner - Math.sqrt( corner ** 2 - (corner - fromBottom) ** 2 ) ) : 0
    // Every row is its own step, like the current site: a block in or out around the curve (on the rise into the
    // navigation only in, so the world keeps that room), never more than two blocks from the row above, and never three
    // rows in one straight line
    const isOnRise = (row + 0.5) * block > rise.from && (row + 0.5) * block < rise.to
    const shift = isOnRise ? [ -1, 0, 0 ][ Math.floor( random() * 3 ) ] : [ -1, 0, 0, 1 ][ Math.floor( random() * 4 ) ]
    const previous = left[ row - 1 ] ?? Math.round( curve )
    let value = Math.max( nearest( row ), Math.min( previous + 2, Math.max( previous - 2, Math.round( curve ) + shift ) ) ) + rounding

    if (row >= 2 && value === left[ row - 1 ] && value === left[ row - 2 ]) value += value > nearest( row ) && random() < 0.5 ? -1 : 1

    left[ row ] = value
    for (let x = 0; x < value; x++) set( x, row, false )

    if (random() < 0.2) set( value + 1, row, false )
    if (value - 2 >= nearest( row ) && random() < 0.15) set( value - 2, row, true )
  }

  // On the right the scene ends in a straight line, where the cast list's column touches it (the column lies over it a little)
  const sceneRight = isBeside ? Math.ceil( space.panelLeft / G ) : cols + FLUSH_PAD

  // Below, the void rises into the ground by a block or two in short, uneven runs; beside the round corner on the left the
  // ground stays whole
  const cut = new Array( blockCols ).fill( 0 )
  const cornerEnd = (left[ blockRows - 1 ] ?? 0) + 2


  // Short runs, each at another depth than the one before, so the edge never runs straight for long
  const unevenRuns = () => {
    const depths = new Array( blockCols ).fill( 0 )
    for (let start = 0, previousDepth = 0; start < blockCols; ) {
      const run = 1 + Math.floor( random() * 3 )
      let depth = [ 0, 0, 1, 1, 1, 2 ][ Math.floor( random() * 6 ) ]
      if (depth === previousDepth) depth = (depth + 1 + Math.floor( random() * 2 )) % 3
      for (let x = start; x < Math.min( blockCols, start + run ); x++) depths[ x ] = depth
      previousDepth = depth
      start += run
    }
    return depths
  }

  unevenRuns().forEach( (depth, x) => cut[ x ] = isBeside && x <= cornerEnd ? 0 : depth )

  for (let x = 0; x < blockCols; x++) {
    for (let y = blockRows - cut[ x ]; y < blockRows; y++) set( x, y, false )
    if (x > cornerEnd && random() < 0.15) set( x, blockRows - cut[ x ] - 2, false )
  }

  /*
    On phones the logo lies over the hero's top left: the void comes down over the top around it, under the logo a block
    or so below it and stepping a block up and down every couple of blocks, beyond it only two blocks deep, so the world
    reaches up beside the logo
  */
  if (!isBeside) {
    const brand = document.querySelector( `.brandHead` ).getBoundingClientRect()
    const box = field.getBoundingClientRect()
    const underBrand = toBlocks( brand.right - box.left + 6 )
    const deep = toBlocks( brand.bottom - box.top + 8 )

    for (let start = 0, step = 1; start < blockCols; step = 1 - step) {
      const run = start < underBrand ? 2 : blockCols
      for (let x = start; x < Math.min( blockCols, start + run ); x++) {
        const depth = x < underBrand ? deep + step : 2
        for (let y = 0; y < depth; y++) set( x, y, false )
      }
      start += run
    }
  }

  // Cells: the blocks, with the top (and on phones the right) running on past the window's edges
  const isInside = (x, y) => {
    if (x >= sceneRight) return false
    if (x >= cols) x = cols - 1
    if (x < 0 && !isBeside) x = 0
    if (y < 0) y = 0
    if (x < 0 || y >= rows) return false

    return isHero[ Math.floor( y / HOLE_BLOCK ) ]?.[ Math.floor( x / HOLE_BLOCK ) ] ?? false
  }

  return {
    cols, rows, isInside, isBeside,

    // The blocks alone, without the left edge and the scene's right end: the cast list's column shares the hero's bottom
    isBlock: (x, y) => isHero[ Math.floor( Math.max( 0, y ) / HOLE_BLOCK ) ]?.[ Math.floor( Math.min( x, cols - 1 ) / HOLE_BLOCK ) ] ?? false,
    sceneRight: Math.min( sceneRight, cols ) * G,
    left: Array.from({ length:rows }, (_, y) => left[ Math.floor( y / HOLE_BLOCK ) ] * HOLE_BLOCK ),
    cut: Array.from({ length:cols }, (_, x) => cut[ Math.floor( x / HOLE_BLOCK ) ] * HOLE_BLOCK ),
    from:{ x:isBeside ? 0 : -FLUSH_PAD, y:-FLUSH_PAD }, to:{ x:cols + FLUSH_PAD, y:rows },
  }
}

/*
  The navigation starts at the hero's bottom left, NAV_BOTTOM px above it: style.css places it there from the hero's height
  (--hero-height) and its own fixed height (--nav-height), before any script runs. From there it scrolls up with the hero
  until it reaches the signet, and sticks right below it
*/
const NAV_BOTTOM = 28

// What the hero's edges must keep clear of, in px from the hero's top left: the sticky signet's column, the navigation at the
// bottom left and the cast list at the top right (null on phones, where the navigation is a bar and the cast a strip)
function clearances( field ) {
  const signet = document.querySelector( `.signet` )
  const nav = document.querySelector( `.mainNav` )
  const account = document.querySelector( `.railAccount` )
  if (getComputedStyle( nav ).position === `fixed` || !signet.offsetWidth) return null

  const box = field.getBoundingClientRect()
  const navRect = nav.getBoundingClientRect()
  const panelRect = document.getElementById( `castPanel` ).getBoundingClientRect()

  // Measured unscaled and unclipped: the full logo at the top, the signet alone (as it is once folded) further down
  const left = signet.getBoundingClientRect().left - box.left
  const railTop = parseFloat( getComputedStyle( signet.parentElement ).paddingTop )

  return {
    brandRight: left + BRAND.width,
    brandBottom: railTop + BRAND.height,
    signetRight: left + BRAND.signetWidth,
    // The navigation's place at the hero's bottom, and the room it and the account need from there down
    navTop: field.offsetHeight - NAV_BOTTOM - nav.offsetHeight,
    navRight: Math.max( navRect.right, account.getBoundingClientRect().right ) - box.left,
    panelLeft: panelRect.left - box.left,
  }
}


/**
 * The cast list's column: a plain, slightly lifted piece of night against the scene's straight right side, as tall as the
 * hero. Its bottom is the hero's bottom: the void bites into it in the same blocks, so the header ends in one ragged edge
 */
function buildCastPanel( panel ) {
  const svg = prepareShapeSvg( panel, `castShape` )
  const shape = document.getElementById( `heroField` ).shape

  if (!shape) {
    panel.style.clipPath = ``
    return svg.replaceChildren()
  }

  /*
    Drawn in the hero's own cells, so the void bites into the list's bottom exactly where it bites into the scene: the
    column on the right of wide screens, the band along the bottom on phones. The whole list is cut to that shape, so it
    lies under the void's blocks instead of over them. The shape starts past the list's left side and top (the hero's
    cells run on past its left edge), so those edges meet the bottom square, not rounded
  */
  const left = panel.offsetLeft
  const top = panel.offsetTop
  const isInside = (x, y) => y < shape.rows && shape.isBlock( Math.max( 0, x ), y )
  const from = { x:Math.floor( left / G ) - FLUSH_PAD, y:Math.floor( top / G ) - FLUSH_PAD }
  const path = traceCells( isInside, from, { x:shape.cols + FLUSH_PAD, y:shape.rows }, { isSmoothed:false, isAllLoops:true } )
    .map( loop => roundedPath( loop.map( ({ x, y }) => ({ x:x * G - left, y:y * G - top }) ), HOLE_CURVE ) ).join( `` )

  panel.style.clipPath = `path( evenodd, "${path}" )`
  svg.innerHTML = `<path class="castFill" d="${path}" fill-rule="evenodd" />`
}

// Fade the old world out, then build the selected character's world around the logo and fade it in
async function showHero() {
  const switchId = ++hero.switchId
  const scene = NIGHT[ currentCharacter ]
  const isNarrow = hero.hole.clientWidth < 700
  const shape = document.getElementById( `heroField` ).shape
  const pixel = HERO_PIXEL

  // The ground's surface lies above the deepest bite of the void, so some of it always shows; on phones above the cast's
  // band along the bottom too
  const castBand = shape.isBeside ? Infinity : document.getElementById( `castPanel` ).offsetTop - 12
  const groundTop = Math.min( castBand, shape.rows * G - Math.max( ...shape.cut ) * G - Math.round( hero.hole.clientHeight * 0.05 ) - 30 )
  hero.groundHeight = Math.ceil( hero.hole.clientHeight / pixel ) - Math.round( groundTop / pixel )
  const skyHeight = Math.round( groundTop / pixel )

  // The old world fades out
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
    lineCount: isNarrow ? 25 : 60,
    driftingClouds: scene.driftingClouds ?? 0,
    characters: scene.characters.map( character => keepVisible( character, shape ) ),
    backdrop: createSkyArt( currentCharacter ),
  } )

  if (switchId !== hero.switchId) return destroy()

  // The new world fades in
  hero.destroy = destroy
  hero.hole.getBoundingClientRect()
  hero.hole.classList.remove( `isSwitching` )
}

// Characters walk only where the void has not bitten off the ground, and not behind the cast list
function keepVisible( character, shape ) {
  const width = shape.cols * G
  const visibleFrom = Math.min( 0.5, (Math.max( ...shape.left.slice( -12 ) ) * G + 20) / width )
  const [ from, to ] = character.walkRange ?? [ character.startX, character.startX ]
  const visibleTo = (shape.sceneRight - 40) / width
  const startX = Math.min( visibleTo - 0.06, Math.max( visibleFrom, character.startX ) )

  return { ...character, startX, walkRange:character.walkRange && [ Math.max( visibleFrom, from ), Math.min( visibleTo, to ) ] }
}

/* ================= CHARACTERS ================= */

function fillRoster() {
  const list = document.getElementById( `roster` )
  const unlocked = CHARACTERS.filter( character => character.id )
  const locked = CHARACTERS.filter( character => !character.id )

  /*
    A new order on every visit, the first character's world shown. A character chosen before the page was refreshed comes
    first (choosing one does not reorder the list until the next refresh)
  */
  const order = shuffle( unlocked ).sort( (a, b) => (b.id === chosenCharacter) - (a.id === chosenCharacter) )
  defaultCharacter = order.find( character => NIGHT[ character.id ] ).id
  currentCharacter ??= defaultCharacter

  for (const character of [ ...order, ...locked ]) {
    const item = document.createElement( `li` )
    const button = document.createElement( character.id ? `button` : `div` )
    const portrait = character.id ? `<span class="portrait"><img src="${character.sprite ?? placeholderPortrait( character.id )}" alt=""></span>` : `<span class="portrait isUnknown">?</span>`
    const note = character.id ? character.note : `Odblokujesz na poziomie ${character.unlockLevel}`

    // A row is the portrait and the name; the description is only in the tooltip, so the list stays narrow
    button.className = `member`
    button.title = `${character.name}: ${note}`
    button.innerHTML = `${portrait}<b class="cactu">${character.name.toLowerCase()}</b>`

    if (character.id) {
      button.type = `button`
      button.dataset.character = character.id
      button.style.setProperty( `--character`, NIGHT[ character.id ].glow )
      button.classList.toggle( `isSelected`, character.id === chosenCharacter )
      button.setAttribute( `aria-pressed`, character.id === chosenCharacter )
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

// The hero world and the page's colours follow the character
/**
 * Chooses a character, or, clicked again, takes the choice back: then no one is chosen and the default character's world
 * (the first of the list) shows again
 */
function selectCharacter( id ) {
  chosenCharacter = id === chosenCharacter ? null : id

  if (chosenCharacter) params.set( `character`, chosenCharacter )
  else params.delete( `character` )
  history.replaceState( null, ``, params.size ? `?${params}` : location.pathname )
  keepCharacterInLinks()

  for (const button of document.querySelectorAll( `[data-character]` )) {
    button.classList.toggle( `isSelected`, button.dataset.character === chosenCharacter )
    button.setAttribute( `aria-pressed`, button.dataset.character === chosenCharacter )
  }

  const shown = chosenCharacter ?? defaultCharacter
  if (shown === currentCharacter) return

  currentCharacter = shown
  tintPage( shown )
  showHero()
}

/* ================= SMALL THINGS ================= */

/**
 * A smooth curve through points [ y, x ] (y increasing), read at y: cubic pieces with Catmull-Rom slopes, so it passes
 * every point without corners
 */
function curveThrough( points, y ) {
  if (!points.length) return 0
  const index = Math.max( 0, Math.min( points.length - 2, points.findIndex( ([ pointY ], i) => y < (points[ i + 1 ]?.[ 0 ] ?? Infinity) ) ) )
  const [ y0, x0 ] = points[ index ]
  const [ y1, x1 ] = points[ index + 1 ]
  const slopeAt = i => {
    const [ beforeY, beforeX ] = points[ Math.max( 0, i - 1 ) ]
    const [ afterY, afterX ] = points[ Math.min( points.length - 1, i + 1 ) ]
    return (afterX - beforeX) / (afterY - beforeY)
  }
  const span = y1 - y0
  const t = Math.min( 1, Math.max( 0, (y - y0) / span ) )
  const [ h00, h10, h01, h11 ] = [ 2 * t ** 3 - 3 * t ** 2 + 1, t ** 3 - 2 * t ** 2 + t, -2 * t ** 3 + 3 * t ** 2, t ** 3 - t ** 2 ]

  return h00 * x0 + h10 * span * slopeAt( index ) + h01 * x1 + h11 * span * slopeAt( index + 1 )
}
