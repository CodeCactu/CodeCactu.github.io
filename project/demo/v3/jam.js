/* CactuJam: the voting page. The band of the character's world with the jam's title, the source list of games, the
   categories' tier tables (drag and drop) and a game's card over the instruction */

/*
  Rules of the voting, the same as on the current site: every game sits once in the source list and at most once in every
  category; in a category's row the games further right are rated higher. A game dragged from the list is copied into a row,
  a game dragged inside a category moves between its rows (never into another category), and a game dragged from a row back
  over the list leaves the category. Only a logged in user can drag. The vote is valid once every game sits in every category
*/

// The band's world pixel size in CSS px, and the room its shape keeps around the logo, the title's pocket of void and the panel, in px
const BAND_PIXEL = 2
const BAND_CLEARANCE = { brand:14, pocket:12, panel:28 }

/*
  The header: the title in a pocket of void bitten into the band's bottom left corner. With ?header=panel the title lies on
  a panel floating in the world's sky instead, in pixels like everything else there (kept to try again later)
*/
const HEADER_VARIANTS = [ `space`, `panel` ]

/*
  The panel, in world pixels: the painted title's font size (the page's h1 lies over it at twice that, its text
  transparent), the lines' pixel font (real text, at twice its native size, so each of its pixels is one world pixel), the
  panel's padding around the page's title
*/
const PANEL = { left:168, titleSize:30, lineFont:`Tiny5`, lineSize:10, padding:{ x:8, y:7 } }
const PANEL_COLORS = { outline:`#07060d`, fill:`#17142a`, light:`#2b2748`, shade:`#0e0b1a`, bolts:`#4a4470` }
const HASH_PALETTE = { outline:`#3a2a04`, light:`#ffe08a`, base:`#e5be4b`, shade:`#b08a20` }

const DRAG_START_DISTANCE = 6
const FLIP_DURATION = 200
const FLIP_EASING = `cubic-bezier( 0.2, 0.8, 0.2, 1 )`

// Dragging near the window's top or bottom edge scrolls the page, faster the closer the pointer is
const AUTOSCROLL = { edge:90, speed:18 }

const VOTES_KEY = `cactu.jam5.votes`
const COMMENTS_KEY = `cactu.jam5.comments`

// Stand-in games, made up for the demo (the real ones come from the backend's /api/games); `palette` is the stand-in
// thumbnail's (GAME_PALETTES)
const GAMES = [
  { id:`1`, name:`Światło we mgle`, author:`latarnik`, palette:0, description:`Prowadź statki przez gęstą mgłę, obracając snop światła latarni. Każdy statek, który bezpiecznie dopłynie do portu, rozwiewa mgłę na chwilę dłużej, ale olej w lampie kończy się szybciej, niż myślisz` },
  { id:`2`, name:`Kot latarnika`, author:`mglista`, palette:1, description:`Jako kot latarnika pilnujesz, żeby nocą nie zgasł knot: ganiasz ćmy, przeskakujesz między półkami i budzisz śpiącego gospodarza, kiedy wiatr zaczyna szarpać okiennicami. Czy dotrwacie razem do świtu?` },
  { id:`3`, name:`Ostatni rejs`, author:`bosman`, palette:2, description:`Krótka opowieść o rybaku, który po raz ostatni wraca do portu. Rozmowy po drodze zmieniają to, kto będzie na niego czekał na brzegu` },
  { id:`4`, name:`Sygnały`, author:`pikselarz`, palette:3, description:null },
  { id:`5`, name:`Wieża 404`, author:`rybik`, palette:4, description:null },
  { id:`6`, name:`Mgła nad zatoką`, author:`szkwał`, palette:5, description:`Strategia na jedną latarnię i trzy łodzie. Wysyłasz łodzie po zagubionych żeglarzy, a światłem latarni odsłaniasz kawałki zatoki: mgła zakrywa je z powrotem, gdy tylko odwrócisz snop w inną stronę. Uratuj wszystkich, zanim nadejdzie sztorm` },
  { id:`7`, name:`ŚWIATŁO!!!`, author:`kotka_ola`, palette:6, description:`(Absolutnie autentyczna awaria aparatury). Gra o krzyczeniu na mgłę: im głośniej, tym jaśniej świeci latarnia. Mikrofon opcjonalny, klawiatura też działa, sąsiedzi mniej się skarżą` },
]

// The categories, from frontend/src/pages/cactu-jam/_utils/GamesTable.svelte; tiers from the highest rating down
const CATEGORIES = [
  { id:`theme`, name:`Temat`, description:`Zgodność z tematem, w tym tematami dodatkowymi`, tiers:[
    `Temat został zaimplementowany w mechanikach dzieła, mechaniki są spójne z tematem a ich podmiana zupełnie by zmieniła produkt.`,
    `Temat występuje przykładowo w tle, okala produkcję, gra jakoś nawiązuje do tematu.`,
    `Temat nie jest dostrzegalny, lub jest niezwykle szczątkowy.`,
  ] },
  { id:`readability`, name:`Czytelność`, description:`Czytelność i jasność zasad. Czy wiadomo co robić (jeśli błądzisz, czy wiesz o tym, że czegoś szukasz)`, tiers:[
    `Nikt nic nie musi dopowiadać. Jeśli tak się dzieje, to tylko w sytuacji gdy z gry nie wynika, że powinno się do czegoś dojść samemu.`,
    `Autor musi wyjaśnić drobne kwestie, ale poza prostymi dopowiedzeniami produkt względnie się tłumaczy.`,
    `Niczego nie zrozumiałeś. Produkt niczego nie tłumaczy i bez pomocy autora nic nie zrobisz.`,
  ] },
  { id:`impressions`, name:`Ogólne wrażenie`, description:null, tiers:[
    `Chcesz więcej, nawet jeśli było coś nie tak, to nie ma to zestawienia z plusami. Bardzo przyjemna gra.`,
    `Sympatyczna produkcja, wywołała przyjemne odczucia lub zachęciła do ponownej gry. Być może zagrałbyś w kontynuację lub wersję 2.0.`,
    `Nic dodać, nic ująć: wartość domyślna, zaznacz, jeśli nic szczególnie nie wpłynęło na Twoje wrażenia.`,
    `Powiewa delikatną nudą, fajne, ale nie rób więcej.`,
    `Monotonia, nuda, brak zaciekawienia odbiorcy, niechęć do przejścia całości lub przejście z trudem.`,
  ] },
  { id:`rules`, name:`Zgodność z zasadami`, description:null, tiers:[
    `Produkcja zdaje się być w zgodzie z ustalonymi zasadami: wartość domyślna.`,
    `Praca budzi wątpliwości pod kątem ustalonych zasad.`,
    `Praca ewidentnie naruszyła zasady konkursu. Nadanie tej oceny to istotny zarzut, konieczny do zweryfikowania.`,
  ] },
  { id:`realisation`, name:`Ogólna realizacja`, description:`Spójność produktu, dobrze dobrane wizualia`, tiers:[
    `Wszystko świetnie ze sobą współgra, razem tworząc jedność.`,
    `Dobrze dobrane elementy.`,
    `Nic dodać, nic ująć: wartość domyślna, zaznacz, jeśli nic szczególnie nie wpłynęło na Twoje wrażenia.`,
    `Niektóre elementy do siebie nie pasują, całość nie współgra najlepiej.`,
    `Bez składu i ładu: mało co do siebie pasuje.`,
  ] },
  { id:`bonus`, name:`Wyróżnienie`, description:`Okazja na docenienie lub wyróżnienie czyjejś pracy, możliwość przyznania osobistego bonusu`, tiers:[
    `Wyraz uznania dla danej produkcji. Można docenić grę lub autora za wykonaną pracę (zaleca się przydzielanie bonusów z oszczędnością: standardowo 1, góra 2 wyróżnienia).`,
    `Brak bonusu, wartość domyślna.`,
  ] },
]

// A first visit shows a vote already started, like the reference screenshot (?empty starts without votes)
const SAMPLE_VOTES = {
  theme: { t2:[ `2`, `6` ], t1:[ `3`, `4`, `1`, `7` ], t0:[ `5` ] },
  readability: { t2:[ `1` ], t1:[ `2`, `3` ] },
}

const TOTAL_PLACES = GAMES.length * CATEGORIES.length

const jam = {
  isLoggedIn: !params.has( `guest` ),
  votes: loadStored( VOTES_KEY, params.has( `empty` ) ? {} : SAMPLE_VOTES ),
  comments: loadStored( COMMENTS_KEY, {} ),
  openGameId: null,
  savedTimeout: undefined,
}

const band = { switchId:0, destroy:undefined, character:shownCharacter(), variant:HEADER_VARIANTS.includes( params.get( `header` ) ) ? params.get( `header` ) : `space` }
const thumbnails = new Map()
const stripLayout = matchMedia( `(max-width: 820px)` )

// A press on a game that may turn into a drag, and the drag itself
let press = null
let drag = null
let isClickSuppressed = false

start()

async function start() {
  startShell()
  tintPage( band.character )

  fillSource()
  fillLadders()
  showLogin()
  listenToDrags()
  listenToCard()

  document.getElementById( `account` ).addEventListener( `click`, toggleLogin )
  document.getElementById( `loginButton` ).addEventListener( `click`, toggleLogin )

  document.body.dataset.header = band.variant

  await loadCactuFont()
  await document.fonts.load( `${PANEL.lineSize}px ${PANEL.lineFont}`, `ĄĘŁÓŚŻŹĆŃ` )
  await document.fonts.ready
  await Promise.all( [ `evolveye`, `ranfisz` ].map( loadSheet ) )

  const field = document.getElementById( `jamBand` )

  buildBand( field )
  watchBand( field )
  await showBandWorld()
}

/* ================= BAND ================= */

// The band is rebuilt when its size changes, with its world
function watchBand( field ) {
  let size = `${field.clientWidth}×${field.clientHeight}`
  let timeout

  new ResizeObserver( () => {
    const newSize = `${field.clientWidth}×${field.clientHeight}`
    if (newSize === size) return

    size = newSize
    clearTimeout( timeout )
    timeout = setTimeout( () => {
      buildBand( field )
      showBandWorld()
    }, 200 )
  } ).observe( field )
}

function buildBand( field ) {
  const shape = createBandShape( field )
  const toPx = loop => loop.map( ({ x, y }) => ({ x:x * G, y:y * G }) )
  const path = traceCells( shape.isInside, shape.from, shape.to, { isSmoothed:false, isAllLoops:true } ).map( loop => roundedPath( toPx( loop ), HOLE_CURVE ) ).join( `` )

  field.shape = shape
  field.querySelector( `.world` ).style.clipPath = `path( evenodd, "${path}" )`

  // The void's soft shadow falls into the hole, as on the home page
  prepareShapeSvg( field, `fieldEdge` ).innerHTML = `
    <defs>
      <clipPath id="bandHole"><path d="${path}" clip-rule="evenodd" /></clipPath>
      <filter id="bandShadow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4" /></filter>
    </defs>
    <g clip-path="url(#bandHole)"><path class="holeShadow" d="${path}" fill-rule="evenodd" transform="translate( 3 4 )" filter="url(#bandShadow)" /></g>`
}

/**
 * The band: a low hole in the void, cut in the home hero's blocks. It runs flush past the window's top and right; on the left
 * it steps around the logo's corner, and along the bottom it rises into the ground in long, calm runs. A few lone blocks
 * crumble off its left edge. Where the title goes depends on the header: `space` bites a straight pocket for it from
 * the bottom left, and `panel` keeps the left edge straight beside the panel the world draws
 */
function createBandShape( field ) {
  const random = seeded( Number( field.dataset.seed ) )
  const cols = Math.ceil( field.clientWidth / G )
  const rows = Math.floor( field.clientHeight / G )
  const block = HOLE_BLOCK * G
  const blockCols = Math.ceil( cols / HOLE_BLOCK ) + 1
  const blockRows = Math.ceil( rows / HOLE_BLOCK )
  const isBand = Array.from({ length:blockRows }, () => new Array( blockCols ).fill( true ))
  const isFlushLeft = stripLayout.matches
  const variant = isFlushLeft ? `strip` : band.variant
  const toBlocks = px => Math.max( 0, Math.ceil( px / block ) )
  const set = (x, y, value) => {
    if (x >= 0 && y >= 0 && x < blockCols && y < blockRows) isBand[ y ][ x ] = value
  }

  // The ground's top in CSS px: above the deepest cut of the bottom edge (a block)
  const groundTop = rows * G - block - 30

  // What the left edge keeps clear of: the title's pocket, or the panel; on phones the title lies below the band
  const brand = brandRows( field, block )
  const hasPocket = variant === `space`
  const title = hasPocket ? rectIn( document.getElementById( `jamTitle` ), field, BAND_CLEARANCE.pocket ) : null
  const panel = variant === `panel` ? panelRect( groundTop ) : null
  const clear = title ?? (panel && expandRect({ left:panel.x, top:panel.y, right:panel.x + panel.width, bottom:panel.y + panel.height }, BAND_CLEARANCE.panel ))
  const clearRows = clear ? { from:Math.floor( clear.top / block ), to:Math.ceil( clear.bottom / block ) - 1 } : { from:Infinity, to:-Infinity }
  const left = new Array( blockRows ).fill( 0 )

  // The left edge: around the logo, then a block in or out on every row, never three rows in one straight line
  for (let row = 0; row < blockRows; row++) {
    const isBesideBrand = row <= brand.lastRow
    const isBelowBrand = row === brand.lastRow + 1
    const isBesideTitle = hasPocket && row >= clearRows.from
    const isNearClear = row >= clearRows.from - 1 && row <= clearRows.to + 1
    const isStraight = isBesideBrand || isBesideTitle || isNearClear
    const base = isBesideBrand ? brand.min + Math.max( 0, brand.lastRow - 1 - row ) : isBelowBrand ? brand.min - 1 : isBesideTitle ? toBlocks( title.right ) : isNearClear ? 1 : 0
    let value = Math.max( 0, base + (isStraight ? 0 : [ 0, 0, 1 ][ Math.floor( random() * 3 ) ]) )

    if (row >= 2 && value === left[ row - 1 ] && value === left[ row - 2 ] && !isStraight) value += 1

    left[ row ] = value
    for (let x = 0; x < value; x++) set( x, row, false )

    // Lone blocks: holes of void just inside the edge, and none near the title, the panel or the logo
    if (!isStraight && random() < 0.2) set( value + 1, row, false )
  }

  // Below, the void rises into the ground by a block in long, calm runs, every other run at the full depth
  const groundFrom = (left[ blockRows - 1 ] ?? 0) + 1
  const cut = new Array( blockCols ).fill( 0 )

  for (let start = groundFrom, depth = 1; start < blockCols; depth = 1 - depth) {
    const run = 4 + Math.floor( random() * 6 )

    for (let x = start; x < Math.min( blockCols, start + run ); x++) cut[ x ] = depth
    start += run
  }

  for (let x = 0; x < blockCols; x++) {
    for (let y = blockRows - cut[ x ]; y < blockRows; y++) set( x, y, false )
  }

  // Cells: the blocks, running on past the window's top and right (and on phones its left)
  const isInside = (x, y) => {
    if (x >= cols) x = cols - 1
    if (x < 0 && isFlushLeft) x = 0
    if (y < 0) y = 0
    if (x < 0 || y >= rows) return false

    return isBand[ Math.floor( y / HOLE_BLOCK ) ]?.[ Math.floor( x / HOLE_BLOCK ) ] ?? false
  }

  return {
    cols, rows, isInside, groundTop, panel,
    titleRight: clear ? toBlocks( clear.right ) * block : 0,
    deepestCut: Math.max( ...cut ) * block,
    from:{ x:isFlushLeft ? -FLUSH_PAD : 0, y:-FLUSH_PAD }, to:{ x:cols + FLUSH_PAD, y:rows },
  }
}


/*
  The rows of blocks around the full logo, as on the home page: the void steps in diagonally from the top right down
  towards the signet's column, a block wider above the logo's last row, the logo's own width on its rows, and a block less
  on the row just below it. Measured from the logo's unscaled size, so a band rebuilt while the logo is folded stays the same
*/
function brandRows( field, block ) {
  const head = rectIn( document.querySelector( `.brandHead` ), field, 0 )
  const right = head.left + BRAND.width + BAND_CLEARANCE.brand
  const bottom = head.top + BRAND.height

  return { min:Math.ceil( right / block ), lastRow:Math.floor( (bottom - 1) / block ) }
}

// Fade the old world out, then build the shown character's world in the band and fade it in
async function showBandWorld() {
  const switchId = ++band.switchId
  const field = document.getElementById( `jamBand` )
  const hole = document.getElementById( `jamWorld` )
  const scene = NIGHT[ band.character ]
  const { shape } = field

  const { groundTop } = shape
  const groundHeight = Math.ceil( hole.clientHeight / BAND_PIXEL ) - Math.round( groundTop / BAND_PIXEL )
  const skyHeight = Math.round( groundTop / BAND_PIXEL )

  hole.classList.add( `isSwitching` )
  if (band.destroy) await new Promise( resolve => setTimeout( resolve, 350 ) )
  if (switchId !== band.switchId) return

  band.destroy?.()
  band.destroy = undefined

  const destroy = await createPixelWorld( hole, {
    ...worldOptions( band.character ),
    pixel: BAND_PIXEL,
    groundHeight,
    hillHeights: [ Math.round( skyHeight * 0.45 ), Math.round( skyHeight * 0.22 ) ],
    lineCount: hole.clientWidth < 700 ? 18 : 40,
    driftingClouds: scene.driftingClouds ?? 0,
    characters: scene.characters.map( character => keepBesideTitle( character, shape ) ),
    backdrop: createSkyArt( band.character ),
    ...(shape.panel && { logo:shape.panel, plate:{ image:shape.panel.image } }),
  } )

  if (switchId !== band.switchId) return destroy()

  band.destroy = destroy
  hole.getBoundingClientRect()
  hole.classList.remove( `isSwitching` )
}

// Characters walk only right of the title's pocket, where the band reaches down to the ground
function keepBesideTitle( character, shape ) {
  const width = shape.cols * G
  const visibleFrom = Math.min( 0.6, (shape.titleRight + 30) / width )
  const [ from, to ] = character.walkRange ?? [ character.startX, character.startX ]
  const startX = Math.min( 0.94, Math.max( visibleFrom, character.startX ) )

  return { ...character, startX, walkRange:character.walkRange && [ Math.max( visibleFrom, from ), Math.min( 0.97, Math.max( visibleFrom + 0.05, to ) ) ] }
}


/* ================= PANEL ================= */

// Where the panel floats in the band, in CSS px: near the left edge, in the middle of the sky between the logo and the ground
function panelRect( groundTop ) {
  const title = document.getElementById( `jamTitle` )
  const field = document.getElementById( `jamBand` )
  const image = panelImage( band.character, panelLayout( title ) )
  const width = image.width * BAND_PIXEL
  const height = image.height * BAND_PIXEL
  const skyTop = (brandRows( field, HOLE_BLOCK * G ).lastRow + 2) * HOLE_BLOCK * G
  const y = Math.round( (skyTop + groundTop - height) / 2 / BAND_PIXEL ) * BAND_PIXEL
  const rect = { x:PANEL.left, y:Math.max( skyTop, y ), width, height, image }

  // The page's title lies on the board, inside its padding
  title.style.setProperty( `--panel-x`, `${field.offsetLeft + rect.x + (PANEL.padding.x + 1) * BAND_PIXEL}px` )
  title.style.setProperty( `--panel-y`, `${field.offsetTop + rect.y + (PANEL.padding.y + 1) * BAND_PIXEL}px` )

  return rect
}

// The page's title as the board holds it, in world pixels: its size, and where its heading lies in it
function panelLayout( title ) {
  const box = title.getBoundingClientRect()
  const heading = title.querySelector( `h1` ).getBoundingClientRect()
  const toWorld = px => Math.ceil( px / BAND_PIXEL )

  return {
    width: toWorld( box.width ),
    height: toWorld( box.height ),
    heading: { left:Math.round( (heading.left - box.left) / BAND_PIXEL ), top:Math.round( (heading.top - box.top) / BAND_PIXEL ), height:toWorld( heading.height ) },
  }
}

/**
 * The title on a panel, in world pixels: the jam's name in the cactu font, made of the shown character's cactus (as
 * the logo's wordmark is) and the edition's # in gold, on a dark slab floating in the sky, sized to
 * the page's title that lies over it. Only the name is painted: the theme and the time left are the page's own text, in a pixel font, and the page's
 * heading lies over the painted name with its text transparent, so the whole board can be selected, copied and read out.
 * Drawn once per character and size
 */
function panelImage( character, layout ) {
  const cacheKey = `panel ${character} ${layout.width}×${layout.height}`
  if (thumbnails.has( cacheKey )) return thumbnails.get( cacheKey )

  const name = rasterizeText( `cactujam`, PANEL.titleSize, Math.round( PANEL.titleSize * 0.19 ) )
  const number = rasterizeText( document.querySelector( `#jamTitle h1` ).textContent.match( /\d+$/ )[ 0 ], PANEL.titleSize, Math.round( PANEL.titleSize * 0.19 ) )
  const hash = hashMask( name.height )
  const gap = Math.round( name.height * 0.45 )

  const boardWidth = layout.width + PANEL.padding.x * 2 + 2
  const boardHeight = layout.height + PANEL.padding.y * 2 + 2
  const { canvas, ctx } = createPixelLayer( boardWidth, boardHeight )

  drawSlabPlate( ctx, { left:0, top:0, right:boardWidth, bottom:boardHeight }, PANEL_COLORS )

  // The name, the # and the number on one line, centred on the heading that lies over them
  const palette = CACTUS_PALETTES[ character ] ?? CACTUS_PALETTES.cactu
  const left = PANEL.padding.x + 1 + layout.heading.left
  const top = PANEL.padding.y + 1 + layout.heading.top + Math.round( (layout.heading.height - name.height) / 2 )

  paintSprite( ctx, name.isFilled, palette, left, top, SHADINGS.word )
  paintSprite( ctx, hash.isFilled, HASH_PALETTE, left + name.width + gap, top + name.height - hash.height, SHADINGS.word )
  paintSprite( ctx, number.isFilled, palette, left + name.width + gap + hash.width + Math.round( gap * 0.6 ), top + name.height - number.height, SHADINGS.word )

  thumbnails.set( cacheKey, canvas )

  return canvas
}

// The cactu font has no #: one drawn as tall as its letters, in strokes as thick as theirs
function hashMask( height ) {
  const width = height + 2
  const stroke = Math.max( 2, Math.round( height * 0.2 ) )
  const barAt = (size, share) => Math.round( size * share - stroke / 2 )
  const columns = [ barAt( width, 0.32 ), barAt( width, 0.68 ) ]
  const rows = [ barAt( height, 0.3 ), barAt( height, 0.7 ) ]
  const isFilled = Array.from({ length:height }, (_, y) => Array.from({ length:width }, (_, x) => columns.some( column => x >= column && x < column + stroke ) || rows.some( row => y >= row && y < row + stroke ) ) )

  return { width, height, isFilled }
}

// A letter's stroke: the run of filled pixels from the first one, across the mask's middle row
/* ================= SOURCE AND LADDERS ================= */

function fillSource() {
  const list = document.getElementById( `sourceList` )

  document.getElementById( `sourceCount` ).textContent = `${GAMES.length} ${plural( GAMES.length, `gra`, `gry`, `gier` )}`

  list.replaceChildren( ...GAMES.map( game => {
    const item = document.createElement( `li` )
    const pills = CATEGORIES.map( category => `<i data-category="${category.id}"></i>` ).join( `` )

    item.className = `sourceRow`
    item.dataset.game = game.id
    item.innerHTML = `
      <button class="sourceButton" type="button" aria-label="${game.name}: opis i oceny">
        <span class="thumb"><img src="${thumbnailOf( game )}" alt=""></span>
        <span class="sourceText"><b>${game.name}</b><span class="label">${game.author}</span><span class="pills sourcePills" aria-hidden="true">${pills}</span></span>
      </button>`

    return item
  } ) )
}

// The categories' tables, filled from the votes (empty for a guest: the votes load only with an account)
function fillLadders() {
  const ladders = document.getElementById( `ladders` )
  const votes = jam.isLoggedIn ? jam.votes : {}

  ladders.replaceChildren( ...CATEGORIES.map( category => {
    const section = document.createElement( `section` )
    const titleId = `category-${category.id}`

    section.className = `category`
    section.dataset.category = category.id
    section.setAttribute( `aria-labelledby`, titleId )
    section.innerHTML = `
      <header class="categoryHead">
        <div class="categoryName">
          <h2 class="cactu" id="${titleId}">${category.name.toLowerCase()}</h2>
          ${category.description ? `<p>${category.description}</p>` : ``}
        </div>
        <p class="categoryCount"><b></b><span class="label">gier ocenionych</span></p>
      </header>
      <p class="label categoryScale" aria-hidden="true"><span>← niżej oceniane</span><span>wyżej oceniane →</span></p>
      <ol class="tiers"></ol>`

    const tiers = section.querySelector( `.tiers` )

    category.tiers.forEach( (description, index) => {
      const value = category.tiers.length - index - 1
      const tierId = `t${value}`
      const row = document.createElement( `li` )
      const games = document.createElement( `ol` )

      row.className = `tier`
      row.style.setProperty( `--tier-light`, `${Math.round( value / (category.tiers.length - 1) * 100 )}%` )
      row.innerHTML = `<span class="tierValue cactu">${value}</span><p class="tierText">${description}</p>`

      games.className = `tierGames`
      games.dataset.tier = tierId
      games.setAttribute( `aria-label`, `${category.name}, ocena ${value}` )
      games.append( ...(votes[ category.id ]?.[ tierId ] ?? []).filter( gameById ).map( id => createTile( gameById( id ) ) ) )

      row.querySelector( `.tierValue` ).after( games )
      tiers.append( row )
    } )

    return section
  } ) )

  showProgress()
}

// A game in a table: its thumbnail, a button that opens its card
function createTile( game ) {
  const tile = document.createElement( `li` )

  tile.className = `tile`
  tile.dataset.game = game.id
  tile.innerHTML = `<button class="tileButton" type="button" aria-label="${game.name}: opis i oceny"><img src="${thumbnailOf( game )}" alt=""></button>`
  tile.classList.toggle( `isOpen`, game.id === jam.openGameId )

  return tile
}

// How far the vote is: in every category, on every game of the list and in the instruction
function showProgress() {
  const votes = readVotes()
  let placedCount = 0
  let doneCategories = 0

  for (const category of CATEGORIES) {
    const section = document.querySelector( `[data-category="${category.id}"].category` )
    const placed = Object.values( votes[ category.id ] ?? {} ).flat().length
    const isDone = placed === GAMES.length

    placedCount += placed
    doneCategories += isDone ? 1 : 0

    section.classList.toggle( `isDone`, isDone )
    section.querySelector( `.categoryCount b` ).textContent = `${placed} / ${GAMES.length}`
  }

  for (const row of document.querySelectorAll( `.sourceRow` )) {
    let placedIn = 0

    for (const pill of row.querySelectorAll( `.sourcePills i` )) {
      const isPlaced = Object.values( votes[ pill.dataset.category ] ?? {} ).flat().includes( row.dataset.game )
      pill.classList.toggle( `isFull`, isPlaced )
      placedIn += isPlaced ? 1 : 0
    }

    row.classList.toggle( `isDone`, placedIn === CATEGORIES.length )
    row.title = `Oceniona w ${placedIn} z ${CATEGORIES.length} kategorii`
  }

  const missing = TOTAL_PLACES - placedCount
  const missingCategories = CATEGORIES.length - doneCategories

  document.getElementById( `progressCount` ).textContent = `${placedCount} / ${TOTAL_PLACES}`
  document.getElementById( `progressPills` ).innerHTML = CATEGORIES.map( (category, index) => `<i class="${index < doneCategories ? `isFull` : ``}"></i>` ).join( `` )
  document.getElementById( `progress` ).classList.toggle( `isValid`, !missing )
  document.getElementById( `progressState` ).textContent = !missing
    ? `Twój głos jest ważny. Możesz go zmieniać do końca głosowania.`
    : `Do ważnego głosu brakuje ${missing} ${plural( missing, `oceny`, `ocen`, `ocen` )} w ${missingCategories} ${plural( missingCategories, `kategorii`, `kategoriach`, `kategoriach` )}.`
}

// The votes as the tables show them: category → tier → games, left to right
function readVotes() {
  const votes = {}

  for (const section of document.querySelectorAll( `.category` )) {
    votes[ section.dataset.category ] = {}

    for (const area of section.querySelectorAll( `[data-tier]` )) {
      votes[ section.dataset.category ][ area.dataset.tier ] = [ ...area.querySelectorAll( `.tile[data-game]` ) ].map( tile => tile.dataset.game )
    }
  }

  return votes
}

// After every change: the votes are saved at once, and the instruction says so
function commitVotes() {
  jam.votes = readVotes()
  localStorage.setItem( VOTES_KEY, JSON.stringify( jam.votes ) )

  showProgress()
  showSaved()
  if (jam.openGameId) fillCard( jam.openGameId )
}

function showSaved() {
  const saved = document.getElementById( `saved` )
  const time = new Date().toLocaleTimeString( `pl`, { hour:`2-digit`, minute:`2-digit` } )

  saved.innerHTML = `${iconSvg( `check` )}Zapisano o ${time}`
  saved.classList.remove( `isFresh` )
  saved.getBoundingClientRect()
  saved.classList.add( `isFresh` )
}

/**
 * Puts a game into a category's tier at its end, or with `tierId` null takes it out of the category: the way the card's
 * buttons vote, without dragging. The tables move smoothly
 */
function placeGame( gameId, categoryId, tierId ) {
  const section = document.querySelector( `.category[data-category="${categoryId}"]` )
  const current = section.querySelector( `.tile[data-game="${gameId}"]` )
  const area = tierId && section.querySelector( `[data-tier="${tierId}"]` )
  if (current && current.parentElement === area) return

  flip( [ ...section.querySelectorAll( `[data-tier]` ) ], () => {
    current?.remove()
    if (area) area.append( createTile( gameById( gameId ) ) )
  } )

  commitVotes()
}

/* ================= DRAG AND DROP ================= */

function listenToDrags() {
  document.addEventListener( `pointerdown`, onPointerDown )
  document.addEventListener( `pointermove`, onPointerMove )
  document.addEventListener( `pointerup`, onPointerUp )
  document.addEventListener( `pointercancel`, () => drag ? finishDrag( false ) : press = null )
  document.addEventListener( `keydown`, event => event.key === `Escape` && drag && finishDrag( false ) )

  // The thumbnails are images: the browser's own drag of an image would cancel the pointer
  document.addEventListener( `dragstart`, event => event.target.closest?.( `[data-game]` ) && event.preventDefault() )

  // A drag ends with a click on the game it started from, which must not open the card
  document.addEventListener( `click`, event => {
    if (!isClickSuppressed) return
    event.stopPropagation()
    event.preventDefault()
  }, true )
}

function onPointerDown( event ) {
  const item = event.button === 0 && jam.isLoggedIn && event.target.closest( `.sourceRow, .tile` )
  if (!item || drag) return

  press = { item, pointerId:event.pointerId, x:event.clientX, y:event.clientY }
}

function onPointerMove( event ) {
  if (drag && event.pointerId === drag.pointerId) return moveDrag( event.clientX, event.clientY )
  if (!press || event.pointerId !== press.pointerId) return

  const dx = event.clientX - press.x
  const dy = event.clientY - press.y
  if (Math.hypot( dx, dy ) < DRAG_START_DISTANCE) return

  // On phones the list is a sideways strip: a sideways move scrolls it, only a move up or down picks a game up
  const isStripScroll = stripLayout.matches && press.item.classList.contains( `sourceRow` ) && Math.abs( dx ) > Math.abs( dy )
  if (isStripScroll) return press = null

  startDrag( event )
}

function onPointerUp( event ) {
  if (drag && event.pointerId === drag.pointerId) return finishDrag( true )
  press = null
}

/**
 * Picks the pressed game up. A copy follows the pointer (the ghost). From the list, a new slot opens where the game would land;
 * from a table the game itself is that slot, emptied, and moves with the pointer between the category's rows
 */
function startDrag( event ) {
  const { item } = press
  const fromArea = item.closest( `[data-tier]` )
  const picture = fromArea ? item : item.querySelector( `.thumb` )
  const rect = picture.getBoundingClientRect()
  const slot = fromArea ? item : createSlot()

  drag = {
    item, fromArea, slot,
    gameId: item.dataset.game,
    pointerId: event.pointerId,
    fromCategory: fromArea?.closest( `.category` ) ?? null,
    origin: { parent:item.parentElement, next:item.nextElementSibling },
    offset: { x:event.clientX - rect.left, y:event.clientY - rect.top },
    pointer: { x:event.clientX, y:event.clientY },
    ghost: createGhost( gameById( item.dataset.game ), rect ),
    target: null,
    highlighted: null,
    scrollFrame: 0,
  }

  press = null

  slot.classList.add( `isSlot` )
  document.body.classList.add( `isDragging`, fromArea ? `isDraggingPlaced` : `isDraggingNew` )
  document.documentElement.setPointerCapture( event.pointerId )
  autoScroll()
  moveDrag( event.clientX, event.clientY )
}

// The ghost follows the pointer; under it, a row takes the game (or refuses it) and the list takes it back
function moveDrag( x, y ) {
  drag.pointer = { x, y }
  drag.ghost.style.translate = `${x - drag.offset.x}px ${y - drag.offset.y}px`

  const element = document.elementFromPoint( x, y )
  const source = element?.closest( `[data-source]` )
  const area = element?.closest( `[data-tier]` )
  const category = area?.closest( `.category` )
  const isAllowed = area && (drag.fromArea ? category === drag.fromCategory : !category.querySelector( `.tile[data-game="${drag.gameId}"]` ))

  if (source && drag.fromArea) {
    highlight( source, `isRemoving` )
    drag.target = source
    return
  }

  if (area && !isAllowed) {
    highlight( area, `isBlocked` )
    drag.ghost.dataset.hint = drag.fromArea ? `Tylko w tej samej kategorii` : `Ta gra już jest w tej kategorii`
    drag.target = null
    if (!drag.fromArea) moveSlot( null )
    return
  }

  delete drag.ghost.dataset.hint

  if (area) {
    highlight( area, `isOver` )
    drag.target = area
    moveSlot( area, slotPlace( area, x, y ) )
    return
  }

  // Nowhere: a new game's slot closes; a placed game's slot stays where it was, so dropping here puts it back
  highlight( null )
  drag.target = null
  if (!drag.fromArea) moveSlot( null )
}

function finishDrag( isDropped ) {
  const { ghost, slot, item, fromArea, target, origin } = drag
  const area = isDropped && target?.dataset.tier !== undefined ? target : null
  const isRemoved = isDropped && fromArea && target?.dataset.source !== undefined

  cancelAnimationFrame( drag.scrollFrame )
  highlight( null )
  document.body.classList.remove( `isDragging`, `isDraggingPlaced`, `isDraggingNew` )

  if (area && !fromArea) {
    // A new game lands in its slot
    const tile = createTile( gameById( drag.gameId ) )
    slot.replaceWith( tile )
    landGhost( ghost, tile )
  } else if (area) {
    slot.classList.remove( `isSlot` )
    landGhost( ghost, slot )
  } else if (isRemoved) {
    // A placed game goes back to the list: its row in the list catches the ghost
    flip( [ fromArea ], () => item.remove() )
    landGhost( ghost, document.querySelector( `.sourceRow[data-game="${drag.gameId}"] .thumb` ), true )
  } else if (fromArea) {
    // Dropped nowhere: the game goes back where it was
    flip( [ ...drag.fromCategory.querySelectorAll( `[data-tier]` ) ], () => origin.parent.insertBefore( item, origin.next ) )
    item.classList.remove( `isSlot` )
    landGhost( ghost, item )
  } else {
    moveSlot( null )
    landGhost( ghost, item.querySelector( `.thumb` ), true )
  }

  const isChanged = Boolean( area ) || isRemoved

  drag = null
  isClickSuppressed = true
  setTimeout( () => isClickSuppressed = false, 0 )

  if (isChanged) commitVotes()
}

// Near the window's top or bottom edge the page scrolls while dragging, and what lies under the pointer is checked again
function autoScroll() {
  if (!drag) return

  const { y } = drag.pointer
  const towardsTop = AUTOSCROLL.edge - y
  const towardsBottom = y - (innerHeight - AUTOSCROLL.edge)
  const speed = towardsTop > 0 ? -towardsTop / AUTOSCROLL.edge : towardsBottom > 0 ? towardsBottom / AUTOSCROLL.edge : 0

  if (speed) {
    scrollBy( 0, speed * AUTOSCROLL.speed )
    moveDrag( drag.pointer.x, drag.pointer.y )
  }

  drag.scrollFrame = requestAnimationFrame( autoScroll )
}

// The slot moves to its new place (or closes, with `area` null), and the games around it slide out of the way
function moveSlot( area, before = null ) {
  const { slot } = drag
  const isInPlace = area ? slot.parentElement === area && (slot.nextElementSibling === before || before === slot) : !slot.isConnected
  if (isInPlace) return

  const areas = new Set( [ slot.parentElement, area ].filter( Boolean ) )
  flip( [ ...areas ], () => area ? area.insertBefore( slot, before ) : slot.remove() )
}

// The game before which the slot goes, from the pointer: rows of games read left to right, then top to bottom
function slotPlace( area, x, y ) {
  const tiles = [ ...area.children ].filter( child => child !== drag.slot )

  for (const tile of tiles) {
    const rect = tile.getBoundingClientRect()
    if (y < rect.top) return tile
    if (y <= rect.bottom && x < rect.left + rect.width / 2) return tile
  }

  return null
}

function highlight( element, className ) {
  const previous = drag.highlighted
  if (previous?.element === element && previous?.className === className) return

  previous?.element.classList.remove( previous.className )
  drag.highlighted = element ? { element, className } : null
  element?.classList.add( className )
}

function createSlot() {
  const slot = document.createElement( `li` )
  slot.className = `tile isSlot`
  slot.setAttribute( `aria-hidden`, `true` )

  return slot
}

function createGhost( game, rect ) {
  const ghost = document.createElement( `div` )

  ghost.className = `ghost`
  ghost.style.width = `${rect.width}px`
  ghost.style.height = `${rect.height}px`
  ghost.innerHTML = `<img src="${thumbnailOf( game )}" alt="">`
  document.body.append( ghost )

  return ghost
}

// The ghost flies onto the game where it landed (or into the list, shrinking away) and disappears
function landGhost( ghost, target, isFading = false ) {
  const from = ghost.getBoundingClientRect()
  const to = target?.getBoundingClientRect()
  const duration = reducedMotion ? 0 : FLIP_DURATION * 1.2

  ghost.classList.add( `isLanding` )
  target?.classList.add( `isLanded` )

  const keyframes = to
    ? [ { translate:`${from.left}px ${from.top}px`, scale:1.08 }, { translate:`${to.left}px ${to.top}px`, scale:isFading ? 0.6 : 1, opacity:isFading ? 0 : 1, width:`${to.width}px`, height:`${to.height}px` } ]
    : [ { opacity:1 }, { opacity:0 } ]

  ghost.animate( keyframes, { duration, easing:FLIP_EASING, fill:`forwards` } ).finished.then( () => {
    ghost.remove()
    target?.classList.remove( `isLanded` )
  } )
}

/**
 * Animates the change made by `mutate`: every game in the given lists slides from where it was to where it is now (FLIP),
 * so nothing jumps when a slot opens or a game leaves
 */
function flip( containers, mutate ) {
  const elements = containers.flatMap( container => [ ...container.children ] )
  const before = new Map( elements.map( element => [ element, element.getBoundingClientRect() ] ) )

  mutate()
  if (reducedMotion) return

  for (const [ element, rect ] of before) {
    if (!element.isConnected) continue

    const after = element.getBoundingClientRect()
    const dx = rect.left - after.left
    const dy = rect.top - after.top
    if (!dx && !dy) continue

    element.animate( [ { transform:`translate( ${dx}px, ${dy}px )` }, { transform:`none` } ], { duration:FLIP_DURATION, easing:FLIP_EASING } )
  }
}

/* ================= GAME CARD ================= */

/*
  A click on a game opens its card over the instruction (the card is anchored to it in CSS); clicking the same game again,
  the card's close button or Escape closes it. It stays open while dragging, so a game can be read while it is rated. The
  card votes too: a row of the category's ratings for every category, a way to vote without dragging (and with a keyboard)
*/
function listenToCard() {
  const card = document.getElementById( `gameCard` )

  document.addEventListener( `click`, event => {
    const opener = event.target.closest( `.sourceButton, .tileButton` )
    if (!opener) return

    const gameId = opener.closest( `[data-game]` ).dataset.game
    if (gameId === jam.openGameId) return closeCard()

    openCard( gameId )
  } )

  document.addEventListener( `keydown`, event => event.key === `Escape` && !drag && jam.openGameId && closeCard() )

  card.addEventListener( `click`, event => {
    const button = event.target.closest( `[data-assign]` )
    if (event.target.closest( `.cardClose` )) return closeCard()
    if (!button) return

    const [ categoryId, tierId ] = button.dataset.assign.split( `:` )
    placeGame( jam.openGameId, categoryId, button.getAttribute( `aria-pressed` ) === `true` ? null : tierId )
  } )

  card.addEventListener( `input`, event => {
    if (!event.target.matches( `textarea` )) return

    jam.comments[ jam.openGameId ] = event.target.value
    localStorage.setItem( COMMENTS_KEY, JSON.stringify( jam.comments ) )

    clearTimeout( jam.savedTimeout )
    jam.savedTimeout = setTimeout( showSaved, 600 )
  } )
}

function openCard( gameId ) {
  const card = document.getElementById( `gameCard` )

  jam.openGameId = gameId
  fillCard( gameId )
  markOpenGame()

  if (!card.matches( `:popover-open` )) card.showPopover()
}

function closeCard() {
  const card = document.getElementById( `gameCard` )

  jam.openGameId = null
  markOpenGame()

  if (card.matches( `:popover-open` )) card.hidePopover()
}

function fillCard( gameId ) {
  const card = document.getElementById( `gameCard` )
  const game = gameById( gameId )
  const votes = readVotes()
  const description = game.description ? `<p class="cardText">${game.description}</p>` : `<p class="cardText isEmpty">Autor nie dodał opisu.</p>`

  // For every category, its ratings from the lowest to the highest, like the rows read left to right
  const rows = CATEGORIES.map( category => {
    const tierOf = Object.entries( votes[ category.id ] ?? {} ).find( ([ , games ]) => games.includes( gameId ) )?.[ 0 ]
    const buttons = category.tiers.map( (_, index) => {
      const tierId = `t${index}`
      return `<button type="button" data-assign="${category.id}:${tierId}" aria-pressed="${tierOf === tierId}" title="${category.tiers[ category.tiers.length - index - 1 ]}">${index}</button>`
    } ).join( `` )

    return `<li class="cardVote"><span>${category.name}</span><span class="segments" role="group" aria-label="${category.name}">${buttons}</span></li>`
  } ).join( `` )

  const voting = jam.isLoggedIn
    ? `<section class="cardVotes"><h4 class="label">Twoje oceny</h4><ol>${rows}</ol></section>
       <label class="cardComment"><span class="label">Komentarz dla autora</span><textarea rows="3" placeholder="Co Ci się podobało, co poprawić?">${jam.comments[ gameId ] ?? ``}</textarea></label>`
    : `<p class="cardLogin">Zaloguj się, aby ocenić tę grę i zostawić komentarz.</p>`

  // The focus stays where it was when the card is refilled after a vote: on the same rating, or in the comment with its caret
  const focused = document.activeElement?.closest( `#gameCard textarea, #gameCard [data-assign]` )
  const caret = focused?.selectionStart

  card.innerHTML = `
    <header class="cardHead">
      <span class="cardThumb"><img src="${thumbnailOf( game )}" alt=""></span>
      <div class="cardName">
        <h3 id="gameCardTitle">${game.name}</h3>
        <p class="cardAuthor">${authorPortrait( game.author )}<span>${game.author}</span></p>
      </div>
      <button class="cardClose" type="button" aria-label="Zamknij opis">${iconSvg( `close` )}</button>
    </header>
    ${description}
    ${voting}`

  if (!focused) return

  const refocused = focused.dataset.assign ? card.querySelector( `[data-assign="${focused.dataset.assign}"]` ) : card.querySelector( `textarea` )
  refocused?.focus()
  if (!focused.dataset.assign) refocused?.setSelectionRange( caret, caret )
}

// The open game is marked in the list and in every table
function markOpenGame() {
  for (const element of document.querySelectorAll( `[data-game]` )) element.classList.toggle( `isOpen`, element.dataset.game === jam.openGameId )
}

// An author with a character of the cast shows its portrait, anyone else the first letter of their name
function authorPortrait( author ) {
  const character = CHARACTERS.find( character => character.id && character.name.toLowerCase() === author.toLowerCase() )
  if (!character) return `<span class="portrait isLetter">${author[ 0 ].toUpperCase()}</span>`

  return `<span class="portrait"><img src="${character.sprite ?? placeholderPortrait( character.id )}" alt=""></span>`
}

/* ================= LOGIN ================= */

// In this demo the account and the login button switch between logged in and out
function toggleLogin() {
  jam.isLoggedIn = !jam.isLoggedIn

  showLogin()
  fillLadders()
  if (jam.openGameId) fillCard( jam.openGameId )
}

function showLogin() {
  const account = document.getElementById( `account` )

  document.body.classList.toggle( `isGuest`, !jam.isLoggedIn )
  account.title = jam.isLoggedIn ? `Wyloguj (demo)` : `Zaloguj (demo)`
}

/* ================= SMALL THINGS ================= */

// A stand-in thumbnail for a game: a small pixel picture, drawn once and shared by every place that shows the game
function thumbnailOf( game ) {
  if (thumbnails.has( game.id )) return thumbnails.get( game.id )

  const canvas = document.createElement( `canvas` )
  drawThumbnail( canvas, GAME_PALETTES[ game.palette ], Number( game.id ) * 7 )
  thumbnails.set( game.id, canvas.toDataURL() )

  return thumbnails.get( game.id )
}

function gameById( id ) {
  return GAMES.find( game => game.id === id )
}

// An element's box relative to the field's top left, grown by `padding` on every side
function rectIn( element, field, padding ) {
  const box = field.getBoundingClientRect()
  const rect = element.getBoundingClientRect()

  return { left:rect.left - box.left - padding, top:rect.top - box.top - padding, right:rect.right - box.left + padding, bottom:rect.bottom - box.top + padding }
}

function loadStored( key, fallback ) {
  try {
    return JSON.parse( localStorage.getItem( key ) ) ?? fallback
  } catch {
    return fallback
  }
}

// Polish plurals: 1 gra, 2–4 gry (but 12–14 gier), 5 gier
function plural( count, one, few, many ) {
  if (count === 1) return one

  const isFew = count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14)
  return isFew ? few : many
}
