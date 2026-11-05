/* Page logic shared by index.html and index2.html: views, scenes, worlds, menus */

const ICONS = {
  home: `<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>`,
  gamepad: `<rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4"/><circle cx="15.5" cy="11" r="1"/><circle cx="17.5" cy="13" r="1"/>`,
  book: `<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>`,
  cube: `<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>`,
  lock: `<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>`,
  logout: `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
  check: `<path d="M5 12.5 10 17l9-10"/>`,
  flame: `<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8a7 7 0 0 0 7 7z"/>`,
}

// `paper` is the page tint while the character's world is shown. Templates have stand-in sprites drawn in code
const CHARACTERS = [
  { id:`evolveye`, name:`Evolveye`, note:`Oko, które ewoluuje`, sprite:`../../characters/evolveye/idle_right.png`, color:`#2f6fd6`, tint:`#dbe6f8`, ink:`#1f4f9e`, paper:`#e8edf4` },
  { id:`ranfisz`, name:`Ranfisz`, note:`Wędrowiec z pustyni`, sprite:`../../characters/ranfisz/idle_right.png`, color:`#e08a1e`, tint:`#f8e5c9`, ink:`#8a4f08`, paper:`#f3eee2` },
  { id:`goral`, name:`Góral`, note:`Żelazny strażnik gór`, isTemplate:true, color:`#6f7d8e`, tint:`#dfe4ea`, ink:`#3d4856`, paper:`#ebedf0` },
  { id:`mszak`, name:`Mszak`, note:`Mech w różowych kwiatach`, isTemplate:true, color:`#5f9e3a`, tint:`#dfedd2`, ink:`#36621e`, paper:`#ecf1e5` },
  { id:`zabek`, name:`Żabek`, note:`Naukowiec z laboratorium w mesie`, isTemplate:true, color:`#2f9e80`, tint:`#d5ede4`, ink:`#1b6652`, paper:`#f3ece6` },
  { id:`glutek`, name:`Glutek`, note:`Różowo-fioletowy glut`, isTemplate:true, color:`#b84fc4`, tint:`#f1ddf4`, ink:`#7a2a86`, paper:`#f2eaf3` },
  { name:`Postać 7`, unlockLevel:4 },
  { name:`Postać 8`, unlockLevel:6 },
]

// One kind of character per scene (repeated), a biome, and a plate the logo stands on.
// `compact` replaces parts of the scene on narrow worlds, where the logo takes the whole width.
const SCENES = {
  evolveye: {
    terrain: `puffs`,
    driftingClouds: 7,
    logo: { x:0.5, y:0.46 },
    plate: { style:`cloud`, fill:`#ffffff`, shade:`#dfe6f6`, outline:`#b7c6e6` },
    colors: {
      sky: [ `#a9c3ee`, `#bbd0f1`, `#d0ddf3`, `#efe4ee` ],
      farHills: `#e4eaf8`,
      nearHills: `#f5f7fd`,
      nearRim: `#ffffff`,
      ground: `#ffffff`,
      groundRim: `#ffffff`,
      pebble: `#e8edf9`,
      star: `#ffffff`,
      lineGray: `#c4d3ee`,
      edgeShade: `rgba( 40, 60, 120, 0.2 )`,
    },
    characters: [
      { sheet:`evolveye`, startX:0.05, isFloating:true, altitude:0.72, walkRange:[ 0.02, 0.3 ], speed:3 },
      { sheet:`evolveye`, startX:0.82, isFloating:true, altitude:0.78, walkRange:[ 0.66, 0.94 ], speed:4, phase:2 },
      { sheet:`evolveye`, startX:0.9, isFloating:true, altitude:0.22, phase:4 },
      { sheet:`evolveye`, startX:0.14, isFloating:true, altitude:0.16, phase:3 },
      { sheet:`evolveye`, startX:0.62, isFloating:true, altitude:0.45, walkRange:[ 0.02, 0.98 ], speed:6, phase:1 },
    ],
    compact: {
      logo: { x:0.5, y:0.24 },
      characters: [
        { sheet:`evolveye`, startX:0.08, isFloating:true, altitude:0.02, walkRange:[ 0, 0.45 ], speed:3 },
        { sheet:`evolveye`, startX:0.7, isFloating:true, altitude:0, walkRange:[ 0.55, 1 ], speed:4, phase:2 },
      ],
    },
  },
  ranfisz: {
    terrain: `dunes`,
    horizonGlow: 1.1,
    logo: { x:0.5, isOnGround:true },
    plate: { style:`slab`, fill:`#f6e3b8`, light:`#fdf1d6`, shade:`#dcbf86`, outline:`#5a3d1c`, post:`#8a5a2b`, hasPosts:true, postHeight:7 },
    colors: {
      sky: [ `#9fd3dc`, `#b6dfe2`, `#d0e9e0`, `#f3ecd2` ],
      farHills: `#efcf98`,
      nearHills: `#e2b674`,
      ground: `#d6a45f`,
      groundRim: `#b98245`,
      pebble: `#c99352`,
      star: `#ffffff`,
      lineGray: `#b5d8d6`,
      edgeShade: `rgba( 90, 50, 10, 0.2 )`,
    },
    cacti: [ { x:0.04, size:2 }, { x:0.11, size:0 }, { x:0.8, size:1 }, { x:0.96, size:2 } ],
    characters: [
      { sheet:`ranfisz`, startX:0.15, walkRange:[ 0, 1 ] },
      { sheet:`ranfisz`, startX:0.86, walkRange:[ 0, 1 ], phase:2.5 },
      { sheet:`ranfisz`, startX:0.7, walkRange:[ 0, 1 ], phase:4, speed:12 },
      { sheet:`ranfisz`, startX:0.3, walkRange:[ 0, 1 ], phase:1, speed:6 },
    ],
    compact: {
      logo: { x:0.5, y:0.3 },
      characters: [
        { sheet:`ranfisz`, startX:0.1, walkRange:[ 0, 1 ] },
        { sheet:`ranfisz`, startX:0.75, walkRange:[ 0, 1 ], phase:2.5, speed:6 },
      ],
    },
  },
  goral: {
    terrain: `peaks`,
    logo: { x:0.5, isOnGround:true },
    plate: { style:`slab`, fill:`#d5dbe3`, light:`#eef1f5`, shade:`#aab4c1`, outline:`#2b313a`, snow:`#ffffff`, post:`#56616f` },
    colors: {
      sky: [ `#b8c7d9`, `#c9d5e3`, `#dbe3ec`, `#edf1f5` ],
      farHills: `#9aa8ba`,
      nearHills: `#7d8b9d`,
      snow: `#f7f9fc`,
      ground: `#5f6b7a`,
      groundRim: `#46505c`,
      pebble: `#cf7638`,
      star: `#ffffff`,
      lineGray: `#a7b4c4`,
    },
    characters: [
      { sheet:`goral`, startX:0.12, walkRange:[ 0, 1 ], speed:5 },
      { sheet:`goral`, startX:0.78, walkRange:[ 0, 1 ], speed:4, phase:2 },
      { sheet:`goral`, startX:0.92, walkRange:[ 0, 1 ], speed:6, phase:3.5 },
    ],
    compact: { logo:{ x:0.5, y:0.3 }, plate:{ hasPosts:true }, characters:[ { sheet:`goral`, startX:0.1, walkRange:[ 0, 1 ], speed:5 }, { sheet:`goral`, startX:0.8, walkRange:[ 0, 1 ], speed:4, phase:2 } ] },
  },
  mszak: {
    terrain: `puffs`,
    logo: { x:0.5, isOnGround:true },
    plate: { style:`slab`, fill:`#e3e6dc`, light:`#f3f5ee`, shade:`#bfc4b3`, outline:`#2c3325`, moss:`#6aa84a`, flower:`#f08cb4`, flowerCenter:`#ffe08a`, post:`#6b5a3a` },
    colors: {
      sky: [ `#cfe5d0`, `#dcecd6`, `#e8f2dc`, `#f8f3da` ],
      farHills: `#a9cf8e`,
      nearHills: `#86b96a`,
      nearRim: `#9fcd80`,
      ground: `#5d9443`,
      groundRim: `#43732f`,
      pebble: `#f08cb4`,
      star: `#ffffff`,
      lineGray: `#b5d3a3`,
    },
    characters: [
      { sheet:`mszak`, startX:0.1, walkRange:[ 0, 1 ], speed:3 },
      { sheet:`mszak`, startX:0.25, walkRange:[ 0, 1 ], speed:4, phase:1.5 },
      { sheet:`mszak`, startX:0.85, walkRange:[ 0, 1 ], speed:3, phase:3 },
    ],
    compact: { logo:{ x:0.5, y:0.3 }, plate:{ hasPosts:true }, characters:[ { sheet:`mszak`, startX:0.1, walkRange:[ 0, 1 ], speed:3 }, { sheet:`mszak`, startX:0.8, walkRange:[ 0, 1 ], speed:4, phase:2 } ] },
  },
  zabek: {
    terrain: `mesa`,
    logo: { x:0.5, isOnGround:true },
    plate: { style:`slab`, fill:`#e4ebee`, light:`#f6f9fa`, shade:`#b9c6cc`, outline:`#22303a`, bolts:`#7d8f99`, post:`#7d8f99`, flask:{ o:`#22303a`, w:`#e8f6ff`, a:`#7ee08a` } },
    colors: {
      sky: [ `#f3d3b0`, `#f6dcbd`, `#f9e6cc`, `#fdf0dc` ],
      farHills: `#d98a5f`,
      farBands: [ `#d98a5f`, `#e8a878`, `#c9704a`, `#efc09a`, `#d98a5f` ],
      nearHills: `#b8603e`,
      ground: `#a5532f`,
      groundRim: `#7d3a1f`,
      pebble: `#c46f45`,
      star: `#ffffff`,
      lineGray: `#dcae8c`,
      edgeShade: `rgba( 90, 30, 10, 0.2 )`,
    },
    cacti: [ { x:0.06, size:1 }, { x:0.93, size:0 } ],
    characters: [
      { sheet:`zabek`, startX:0.15, walkRange:[ 0, 1 ], speed:7 },
      { sheet:`zabek`, startX:0.8, walkRange:[ 0, 1 ], speed:5, phase:2 },
      { sheet:`zabek`, startX:0.3, walkRange:[ 0, 1 ], speed:6, phase:3.5 },
    ],
    compact: { logo:{ x:0.5, y:0.3 }, plate:{ hasPosts:true }, characters:[ { sheet:`zabek`, startX:0.1, walkRange:[ 0, 1 ], speed:6 }, { sheet:`zabek`, startX:0.8, walkRange:[ 0, 1 ], speed:5, phase:2 } ] },
  },
  glutek: {
    terrain: `puffs`,
    logo: { x:0.5, isOnGround:true },
    plate: { style:`slab`, fill:`#f6e9f8`, light:`#fdf6fe`, shade:`#dfc3e6`, outline:`#3a1f42`, drips:`#c96ad8`, post:`#9c42aa` },
    colors: {
      sky: [ `#e2cfee`, `#eadaf2`, `#f2e5f5`, `#fbeef4` ],
      farHills: `#d3a9df`,
      nearHills: `#bf86cf`,
      nearRim: `#d59be3`,
      ground: `#a466b8`,
      groundRim: `#7d4290`,
      pebble: `#c88ad8`,
      star: `#ffffff`,
      lineGray: `#d6b9e0`,
      edgeShade: `rgba( 70, 20, 90, 0.2 )`,
    },
    characters: [
      { sheet:`glutek`, startX:0.12, walkRange:[ 0, 1 ], speed:4 },
      { sheet:`glutek`, startX:0.3, walkRange:[ 0, 1 ], speed:3, phase:1 },
      { sheet:`glutek`, startX:0.75, walkRange:[ 0, 1 ], speed:5, phase:2.5 },
      { sheet:`glutek`, startX:0.9, walkRange:[ 0, 1 ], speed:3, phase:4 },
    ],
    compact: { logo:{ x:0.5, y:0.3 }, plate:{ hasPosts:true }, characters:[ { sheet:`glutek`, startX:0.1, walkRange:[ 0, 1 ], speed:4 }, { sheet:`glutek`, startX:0.8, walkRange:[ 0, 1 ], speed:3, phase:2 } ] },
  },
}

const params = new URLSearchParams( location.search )

// ?brand=<ground from GROUNDS in brand.js> shows the new logo plate in the wide world, ?brand=off the old logo.
// ?ending= picks what stands after "cactu", ?brandSize=small | medium | large how big the plate is
const brandGround = params.get( `brand` ) ?? `moundFill`
const brandEnding = params.get( `ending` ) ?? `none`
const brandSize = params.get( `brandSize` ) ?? `small`
const view = params.get( `view` ) ?? `desktop`
const worlds = []
const trail = createPointerTrail( `transparent` )

let currentScene = SCENES[ params.get( `character` ) ] ? params.get( `character` ) : `evolveye`

start()

async function start() {
  const isDesktop = view.startsWith( `desktop` )
  const root = document.getElementById( isDesktop ? `desktop` : view === `mobileJam` ? `mobileJam` : `mobile` )

  root.hidden = false
  if (view === `desktopAccount`) toggleAccount()
  if (view === `mobileMenu`) document.getElementById( `menu` ).hidden = false
  if (view !== `mobileJam`) tintPage( currentScene )

  fillIcons()
  fillAvatars()
  fillXpBars()
  fillRoster()
  fillStrip()
  fillGames( root )
  addMenuHandlers()

  await loadCactuFont()

  fillPixelArt()

  await document.fonts.ready

  if (isDesktop) worlds.push({ hole:document.getElementById( `desktopWorld` ), pixel:5, groundHeight:groundHeightOf( document.getElementById( `desktopWorld` ), 5, 22 ), lineCount:60, isWide:true })
  if (view === `mobile` || view === `mobileMenu`) worlds.push({ hole:document.getElementById( `mobileWorld` ), pixel:3, groundHeight:28, lineCount:25, isWide:false })

  await Promise.all( worlds.map( world => showWorld( world, SCENES[ currentScene ] ) ) )

  for (const world of worlds) new ResizeObserver( () => rebuildWorld( world ) ).observe( world.hole )

  if (isDesktop) startPortals()
  if (isDesktop) startWalker( document.getElementById( `walker` ) )

  if (view === `mobileJam`) await createPixelWorld( document.getElementById( `jamWorld` ), {
    pixel: 3,
    groundHeight: 14,
    lineCount: 15,
    terrain: SCENES.ranfisz.terrain,
    colors: SCENES.ranfisz.colors,
    cacti: [ { x:0.62, size:0 }, { x:0.9, size:1 } ],
    characters: [ { sheet:`ranfisz`, startX:0.74, walkRange:[ 0.66, 0.86 ] } ],
  } )

  // Enable the logo's slide only after the first placement
  requestAnimationFrame( () => document.body.classList.add( `isReady` ) )
}

function selectScene( name ) {
  if (name === currentScene) return

  currentScene = name
  params.set( `character`, name )
  history.replaceState( null, ``, `?${params}` )
  tintPage( name )

  for (const item of document.querySelectorAll( `[data-character]` )) item.classList.toggle( `isSelected`, item.dataset.character === name )
  for (const world of worlds) showWorld( world, SCENES[ name ] )
}

// The whole page takes a light tint of the character's colour; accents and the pointer trail take the colour itself
function tintPage( name ) {
  const character = CHARACTERS.find( character => character.id === name )

  document.documentElement.style.setProperty( `--paper`, character.paper )
  document.documentElement.style.setProperty( `--accent`, character.color )
  trail.color = `${character.color}40`
}

// Fade the old world out, move the logo, then build the new world around the logo and fade it in
async function showWorld( world, wideScene ) {
  const switchId = world.switchId = (world.switchId ?? 0) + 1
  const sceneForSize = world.isWide ? wideScene : { ...wideScene, ...wideScene.compact, plate:{ ...wideScene.plate, ...wideScene.compact?.plate } }
  const scene = withBrandPlate( adaptSceneToHole( sceneForSize, world.hole ), world )
  const logo = placeLogo( world, scene )

  world.size = `${world.hole.clientWidth}×${world.hole.clientHeight}`
  world.hole.classList.add( `isSwitching` )

  if (world.destroy) await new Promise( resolve => setTimeout( resolve, 350 ) )
  if (switchId !== world.switchId) return

  world.destroy?.()
  world.destroy = undefined

  const destroy = await createPixelWorld( world.hole, {
    pixel: world.pixel,
    groundHeight: world.groundHeight,
    lineCount: world.lineCount,
    horizonGlow: scene.horizonGlow,
    terrain: scene.terrain,
    driftingClouds: scene.driftingClouds,
    colors: scene.colors,
    cacti: scene.cacti,
    characters: scene.characters.map( character => ({ ...character }) ),
    logo,
    plate: scene.plate,
  } )

  if (switchId !== world.switchId) return destroy()

  world.destroy = destroy

  // Reading layout applies the hidden state to the new canvas first, so removing the class fades it in
  world.hole.getBoundingClientRect()
  world.hole.classList.remove( `isSwitching` )
}

// A hole can ask for its ground at a fraction of its height (data-ground) instead of the default number of world pixels
function groundHeightOf( hole, pixel, defaultHeight ) {
  if (!hole.dataset.ground) return defaultHeight
  return Math.round( hole.clientHeight / pixel * Number( hole.dataset.ground ) )
}

// A world behind the whole page can move the logo (data-logo-x) and drop the shaded edges, since its edges are the window's
// The new logo comes already on its plate, coloured like the scene's own plate
function withBrandPlate( scene, world ) {
  if (!world.isWide || brandGround === `off` || typeof createStaticPlate !== `function`) return scene

  const colors = { fill:scene.plate.fill, outline:scene.plate.outline, shade:scene.plate.shade }
  const image = createStaticPlate( colors, { decorations:DECORATIONS.all.list, ground:brandGround, ending:brandEnding, size:brandSize, placement:`close` } )

  return { ...scene, plate:{ ...scene.plate, image } }
}

function adaptSceneToHole( scene, hole ) {
  const logo = hole.dataset.logoX ? { ...scene.logo, x:Number( hole.dataset.logoX ) } : scene.logo
  const colors = hole.hasAttribute( `data-no-edge-shade` ) ? { ...scene.colors, edgeShade:`transparent` } : scene.colors

  return { ...scene, logo, colors }
}

// A world is drawn for one size, so it is built again when its hole changes size
function rebuildWorld( world ) {
  const size = `${world.hole.clientWidth}×${world.hole.clientHeight}`
  if (size === world.size) return

  world.size = size
  world.groundHeight = groundHeightOf( world.hole, world.pixel, world.groundHeight )
  clearTimeout( world.resizeTimeout )
  world.resizeTimeout = setTimeout( () => showWorld( world, SCENES[ currentScene ] ), 250 )
}

function fillRoster() {
  const list = document.getElementById( `roster` )
  if (!list) return

  for (const character of CHARACTERS) {
    const item = document.createElement( `li` )
    const tag = character.isTemplate ? `<span class="tag pixelLabel">szablon</span>` : ``
    const note = character.id ? `<small>${character.note}</small>` : `<span class="pixelLabel">${iconHtml( `lock` )}Poziom ${character.unlockLevel}</span>`

    item.className = `rosterItem`
    item.innerHTML = `${portraitHtml( character )}<div><b>${character.name}${tag}</b>${note}</div>`
    addSceneSwitch( item, character )
    list.append( item )
  }
}

function fillStrip() {
  const list = document.getElementById( `strip` )
  if (!list) return

  for (const character of CHARACTERS) {
    const item = document.createElement( `div` )

    item.className = `stripItem bevel`
    item.innerHTML = `${portraitHtml( character )}<span>${character.id ? character.name : `Poz. ${character.unlockLevel}`}</span>`
    addSceneSwitch( item, character )
    list.append( item )
  }
}

function addSceneSwitch( item, character ) {
  if (!character.id) return item.classList.add( `isLocked` )

  item.dataset.character = character.id
  item.classList.toggle( `isSelected`, character.id === currentScene )
  item.style.cssText = `--character:${character.color}; --character-tint:${character.tint}; --character-ink:${character.ink}`
  item.addEventListener( `click`, () => selectScene( character.id ) )
}

function portraitHtml( character ) {
  if (!character.id) return `<span class="portrait isUnknown">?</span>`

  const sprite = character.sprite ?? placeholderPortrait( character.id )
  return `<span class="portrait" style="--character-tint:${character.tint}"><img src="${sprite}" alt=""></span>`
}

// Each portal shows a small, logo-free version of a character's world
function startPortals() {
  for (const hole of document.querySelectorAll( `[data-portal]` )) {
    const scene = SCENES[ hole.dataset.portal ]

    createPixelWorld( hole, {
      pixel: 4,
      groundHeight: 12,
      lineCount: 15,
      terrain: scene.terrain,
      driftingClouds: scene.driftingClouds ? 3 : 0,
      horizonGlow: scene.horizonGlow,
      colors: scene.colors,
      cacti: scene.cacti,
      characters: scene.characters.slice( 0, 2 ).map( character => ({ ...character, altitude:Math.min( character.altitude ?? 0, 0.5 ) }) ),
    } )
  }
}

// A sprite walking across the page, drawn frame by frame from its sheet
async function startWalker( canvas ) {
  if (!canvas) return

  const sheet = SHEETS.ranfisz
  const scale = 3
  const ctx = canvas.getContext( `2d` )

  await loadSheet( `ranfisz` )

  canvas.width = sheet.width
  canvas.height = sheet.height
  canvas.style.width = `${sheet.width * scale}px`

  requestAnimationFrame( function frame( time ) {
    const route = canvas.parentElement.clientWidth + sheet.width * scale * 2
    const column = Math.floor( time / 140 ) % 8

    canvas.style.translate = `${Math.round( (time / 40) % route ) - sheet.width * scale}px 6px`
    ctx.clearRect( 0, 0, sheet.width, sheet.height )
    ctx.drawImage( sheetImages.ranfisz, column * (sheet.width + 1), 3 * (sheet.height + 1), sheet.width, sheet.height, 0, 0, sheet.width, sheet.height )

    requestAnimationFrame( frame )
  } )
}

function fillGames( root ) {
  for (const container of root.querySelectorAll( `[data-cartridges]` )) {
    for (let index = 0; index < Number( container.dataset.cartridges ); index++) {
      const cartridge = document.createElement( `div` )

      cartridge.className = `cartridge bevel`
      cartridge.style.setProperty( `--_tilt`, `${[ -3, 2, -1, 3, -2, 1 ][ index % 6 ]}deg` )
      cartridge.append( createGameThumb( index ) )
      cartridge.insertAdjacentHTML( `beforeend`, `<span class="pixelLabel">Gra ${index + 1}</span>` )
      container.append( cartridge )
    }
  }

  for (const container of root.querySelectorAll( `[data-thumbs]` )) {
    for (let index = 0; index < Number( container.dataset.thumbs ); index++) container.append( createGameThumb( index ) )
  }

  for (const slot of root.querySelectorAll( `[data-game]` )) {
    const thumb = createGameThumb( Number( slot.dataset.game ) )

    thumb.className += ` ${slot.className}`
    thumb.style.cssText = slot.style.cssText
    slot.replaceWith( thumb )
  }
}

function createGameThumb( index ) {
  const canvas = document.createElement( `canvas` )

  canvas.className = `thumb`
  drawThumbnail( canvas, GAME_PALETTES[ index % GAME_PALETTES.length ], index )

  return canvas
}

function fillIcons() {
  for (const element of document.querySelectorAll( `[data-icon]` )) element.insertAdjacentHTML( `afterbegin`, iconHtml( element.dataset.icon ) )
}

// The signet or the whole logo, scaled by a whole number of pixels. The logo needs the cactu font
function fillPixelArt() {
  for (const canvas of document.querySelectorAll( `[data-pixel-art]` )) {
    if (canvas.dataset.pixelArt === `cactus`) drawLogoCactusCanvas( canvas )
    else drawLogoCanvas( canvas )

    canvas.style.width = `${canvas.width * Number( canvas.dataset.scale )}px`
    canvas.style.height = `${canvas.height * Number( canvas.dataset.scale )}px`
  }
}

function fillAvatars() {
  for (const canvas of document.querySelectorAll( `[data-avatar]` )) drawCactusAvatar( canvas )
}

// XP bars are made of 10 blocks
function fillXpBars() {
  for (const bar of document.querySelectorAll( `[data-xp]` )) {
    bar.innerHTML = Array.from({ length:10 }, (_, index) => `<i class="${index < Number( bar.dataset.xp ) ? `isFull` : ``}"></i>` ).join( `` )
  }
}

function addMenuHandlers() {
  document.getElementById( `railAccount` )?.addEventListener( `click`, toggleAccount )

  for (const button of document.querySelectorAll( `[data-open-menu]` )) button.addEventListener( `click`, () => document.getElementById( `menu` ).hidden = false )
  for (const backdrop of document.querySelectorAll( `[data-close-menu]` )) backdrop.addEventListener( `click`, () => document.getElementById( `menu` ).hidden = true )
}

function toggleAccount() {
  const popover = document.getElementById( `accountPopover` )

  popover.hidden = !popover.hidden
  document.body.classList.toggle( `isAccountOpen`, !popover.hidden )
}

function iconHtml( name ) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[ name ]}</svg>`
}
