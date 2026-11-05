/* The frame every v3 page shares: the logo, the rail (signet, navigation, account), the void's colours and the worlds' skies */

/*
  Loaded after the shared libraries (world.js, brand.js, utils.js, cast.js, curves.js) and before the page's own script
  (main.js for the home page, jam.js for CactuJam). Classic scripts share globals, so the page scripts use these directly
*/


// The hero's hole is cut in blocks of this many cells (36 px, the size of the current site's squares). Its corners are
// the letters' corners seen from the void: the void's outer corners are wide, the world's corners tight
const HOLE_BLOCK = 3
const HOLE_CURVE = { convex:6, concave:14, roundness:0.62 }

// Smooth icons on a 24 px grid, drawn with the round strokes of the cactu letters
const ICONS = {
  home: `<path d="M4.5 11 12 4.8l7.5 6.2v7.7a1.3 1.3 0 0 1-1.3 1.3h-3.7v-5.5h-5V20H5.8a1.3 1.3 0 0 1-1.3-1.3z"/>`,
  gamepad: `<path d="M7.5 7.5h9a4.5 4.5 0 0 1 4.5 4.5v.5a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 12.5V12a4.5 4.5 0 0 1 4.5-4.5zM8 10.3v4M6 12.3h4"/><circle cx="15.3" cy="11.2" r=".6"/><circle cx="17.4" cy="13.4" r=".6"/>`,
  book: `<path d="M4 6.2c2.6-1.3 5.3-1.1 8 .9 2.7-2 5.4-2.2 8-.9v12c-2.6-1.3-5.3-1.1-8 .9-2.7-2-5.4-2.2-8-.9zM12 7.1v12"/>`,
  cube: `<path d="M12 3.6 19.5 7.6v8.8L12 20.4l-7.5-4V7.6zM4.5 7.6 12 11.7l7.5-4.1M12 11.7v8.7"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
  close: `<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>`,
  login: `<path d="M13.5 4.5h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-4M4.5 12h10M11 8l4 4-4 4"/>`,
}

// The brand's fixed dark colours: the dark logo plate of brand.js, and the base of the whole dark page
const BRAND_DARK = PLATE_COLORS.dark

/*
  The logo in the void's top left corner: the final logo with its sky's coloured lines (brand.svg) at half its exported
  size, so its pixels stay whole. While the page scrolls the wordmark and the sky scroll away and only the signet stays,
  shrinking to `compactHeight` over the first `foldDistance` px. Sizes in CSS px, the same as in style.css; `width` and
  `height` are the signet's, wordmark's and ending's box (the sky reaches a little past it)
*/
const BRAND = { top:24, width:261, height:79, signetWidth:67.2, signetHeight:78.86, compactHeight:58, foldDistance:80 }

/*
  Every world's sky has its own art, in the character's colours: a big glowing body (a sun low on the horizon, a planet or a
  moon high up) and auroras, ribbons of light that drift slowly. Shooting stars cross every sky now and then
*/
const SKY_ART = {
  evolveye: { aurora:[ `#5b8ff0`, `#b07ce8` ] },
  ranfisz: { body:{ x:0.74, y:0.42, radius:30, color:`#f6b04e`, rim:`#e0603a` }, aurora:[ `#f0a64a`, `#e0603a` ] },
  goral: { aurora:[ `#7ee0c0`, `#a9bdd8` ], body:{ x:0.2, y:0.16, radius:10, color:`#f2f5ff` } },
  mszak: { aurora:[ `#b07ce8`, `#7ee08a` ] },
  unux: { aurora:[ `#ff6a3d`, `#ffb03b` ] },
}

/*
  The least lightness (CIE L*, 0 to 100) of a world's darkest layers, against the void's L* 3: the sky's top two colours,
  the far hills, the near hills with the ground, and the rims along their tops. A darker layer is brightened in its own hue
  until it reaches its floor, so every world keeps its own colours and its night, and the zone's cut edges
  (the stepped bottom one most of all, which runs along the ground) still read
*/
const LIGHTNESS_FLOOR = { sky:[ 8, 11 ], far:15, near:17, rim:30 }

/*
  What the pointer's trail sheds in a character's world (world.js, SPARK_KINDS): snow in the mountains, fireflies in the
  moss, embers in the desert and the fire; every other world a twinkle in its own light
*/
const TRAIL_SPARKS = {
  goral: { kind:`snow`, color:`#f7f9fc` },
  mszak: { kind:`firefly`, color:`#e8f78a` },
  ranfisz: { kind:`ember`, color:`#ffb04a` },
  unux: { kind:`ember`, color:`#ff8a3d` },
}

const params = new URLSearchParams( location.search )
const reducedMotion = matchMedia( `(prefers-reduced-motion: reduce)` ).matches
const trail = { ramp:[ `#ffffff`, `#5b8ff0` ] }

// The character whose colours the pages show, kept for the session, so every page is tinted alike
const SHOWN_CHARACTER_KEY = `cactu.shownCharacter`

/* ================= PAGES ================= */

/**
 * Links between the pages keep the chosen character (?character=), so the colours do not change on the way. Every page
 * sets up its frame with this, before its own content
 */
function startShell() {
  fillIcons()
  fillPills()
  drawCactusAvatar( document.getElementById( `avatar` ), `#2a2747`, `#5a4436` )
  keepCharacterInLinks()
  startTrail( document.getElementById( `trail` ) )
  foldBrandOnScroll()
}

function keepCharacterInLinks() {
  const character = params.get( `character` )

  for (const link of document.querySelectorAll( `a[data-page]` )) {
    const url = new URL( link.href )

    if (character) url.searchParams.set( `character`, character )
    else url.searchParams.delete( `character` )

    link.href = url.href
  }
}

// The character a page without its own choice shows: the one the last page showed, or Evolveye
function shownCharacter() {
  const chosen = params.get( `character` )
  if (NIGHT[ chosen ]) return chosen

  const last = sessionStorage.getItem( SHOWN_CHARACTER_KEY )
  return NIGHT[ last ] ? last : `evolveye`
}

/* ================= CHARACTER COLOURS ================= */

/**
 * The page's colours. The base is the brand's fixed dark colour (BRAND_DARK), the same for every character, so the logo
 * always sits on the page's own colours; the selected character adds its light (edges, the background's glows) and its own
 * night in the skies of its worlds
 */
function ambientOf( id ) {
  const { base, glow } = NIGHT[ id ]
  const { fill, shade, tone, outline } = BRAND_DARK

  return {
    glow,
    void: mix( shade, `#000000`, 0.72 ),
    // The worlds' skies are the character's own night, deep at the top and lit by its colour towards the horizon
    sky: [ mix( base, `#000000`, 0.3 ), base, mix( base, glow, 0.2 ), mix( base, glow, 0.38 ) ],
    edge: mix( outline, glow, 0.55 ),
  }
}

function tintPage( id ) {
  const ambient = ambientOf( id )

  document.documentElement.style.setProperty( `--void`, ambient.void )
  document.documentElement.style.setProperty( `--glow`, ambient.glow )
  document.documentElement.style.setProperty( `--edge`, ambient.edge )
  document.documentElement.style.setProperty( `--earth`, NIGHT[ id ].colors.ground )
  trail.ramp = trailRamp( id )

  sessionStorage.setItem( SHOWN_CHARACTER_KEY, id )
}


/* ================= WORLDS ================= */


// Everything a world needs from a scene, with its sky in the character's colours
function worldOptions( id ) {
  const scene = NIGHT[ id ]
  const groundShape = SCENERY[ id ]?.groundShape ?? `flat`
  const { glow } = scene

  // The darkest layers are lifted to a floor of lightness, so the zone's cut edges still read against the void
  const sky = ambientOf( id ).sky.map( (color, index) => withFloor( color, LIGHTNESS_FLOOR.sky[ index ] ?? 0 ) )
  const farHills = withFloor( scene.colors.farHills, LIGHTNESS_FLOOR.far )
  const nearHills = withFloor( scene.colors.nearHills, LIGHTNESS_FLOOR.near )

  // Without ground nothing stands on it, everything floats. The hills' tops catch the character's light
  return {
    terrain: scene.terrain,
    groundShape,
    horizonGlow: 1.2,
    cacti: groundShape === `none` ? [] : scene.cacti,
    props: [ ...scatteredProps( id ), ...scene.props.filter( prop => groundShape !== `none` || prop.y !== undefined ) ],
    colors: {
      ...scene.colors,
      sky,
      farHills,
      ...(scene.colors.farBands && { farBands:scene.colors.farBands.map( band => withFloor( band, LIGHTNESS_FLOOR.far ) ) }),
      nearHills,
      ground: withFloor( scene.colors.ground ?? WORLD_COLORS.ground, LIGHTNESS_FLOOR.near ),
      groundRim: withFloor( scene.colors.groundRim ?? WORLD_COLORS.groundRim, LIGHTNESS_FLOOR.rim ),
      farRim: scene.colors.farRim ?? mix( farHills, glow, 0.45 ),
      nearRim: withFloor( scene.colors.nearRim ?? mix( nearHills, glow, 0.35 ), LIGHTNESS_FLOOR.rim ),
      lineGray: mix( BRAND_DARK.fill, `#ffffff`, 0.2 ),
      edgeShade: `transparent`,
    },
    trail: reducedMotion ? null : { ramp:trailRamp( id ), sparks:TRAIL_SPARKS[ id ] ?? { kind:`twinkle`, color:mix( glow, `#ffffff`, 0.45 ) } },
  }
}

// The steps a trail's pixel goes through as it ages: nearly white at the pointer, then the character's light, dimming into its sky
function trailRamp( id ) {
  const { glow } = NIGHT[ id ]
  const sky = ambientOf( id ).sky[ 1 ]

  return [ mix( glow, `#ffffff`, 0.75 ), mix( glow, `#ffffff`, 0.4 ), glow, mix( glow, sky, 0.45 ), mix( glow, sky, 0.7 ) ]
}


/**
 * The selected world's sky art, drawn by the world between its stars and its drifting lines: a glowing body with dithered
 * rings of light, auroras drifting slowly across the upper sky, and now and then a shooting star
 */
function createSkyArt( id ) {
  const { glow, base } = NIGHT[ id ]
  const art = SKY_ART[ id ] ?? { aurora:[ glow, mix( glow, `#ffffff`, 0.35 ) ] }
  const skyColor = mix( base, glow, 0.1 )
  const shooting = []
  let layers

  // Built on the first frame, when the world's size is known
  const build = (width, groundY) => {
    const body = art.body && createGlowingBody( art.body, skyColor )
    const aurora = art.aurora && createAurora( width, Math.round( groundY * (art.auroraY ?? 0.07) ), art.aurora )

    return { body, aurora, bodyX:art.body ? Math.round( art.body.x * width - body.width / 2 ) : 0, bodyY:art.body ? Math.round( art.body.y * groundY - body.height / 2 ) : 0 }
  }

  return (ctx, { width, groundY, time, deltaSeconds, shift }) => {
    layers ??= build( width, groundY )

    if (layers.aurora) {
      const offset = Math.floor( (time / 220) % layers.aurora.width )
      ctx.globalAlpha = 0.5 + Math.sin( time / 2600 ) * 0.12
      ctx.drawImage( layers.aurora, -offset + shift( 1 ), 0 )
      ctx.drawImage( layers.aurora, layers.aurora.width - offset + shift( 1 ), 0 )
      ctx.globalAlpha = 1
    }

    if (layers.body) ctx.drawImage( layers.body, layers.bodyX + shift( 1 ), layers.bodyY )

    if (!reducedMotion && Math.random() < deltaSeconds * 0.25) shooting.push({ x:width * (0.2 + Math.random() * 0.8), y:groundY * Math.random() * 0.35, age:0 })

    for (const star of shooting) {
      star.age += deltaSeconds
      const x = Math.round( star.x - star.age * 90 )
      const y = Math.round( star.y + star.age * 45 )

      for (let tail = 0; tail < 8; tail++) {
        ctx.fillStyle = tail ? mix( glow, `#ffffff`, 0.5 ) : `#ffffff`
        ctx.globalAlpha = 1 - tail / 8
        ctx.fillRect( x + tail * 2, y - tail, 1, 1 )
      }

      ctx.globalAlpha = 1
    }

    while (shooting.length && shooting[ 0 ].age > 0.9) shooting.shift()
  }
}

// A disc of light with dithered rings around it, fading into the sky
function createGlowingBody( { radius, color, rim }, skyColor ) {
  const halo = radius + 14
  const { canvas, ctx } = createPixelLayer( halo * 2, halo * 2 )

  for (let y = 0; y < halo * 2; y++) for (let x = 0; x < halo * 2; x++) {
    const distance = Math.hypot( x + 0.5 - halo, y + 0.5 - halo )
    const dither = BAYER[ (y % 4) * 4 + (x % 4) ] / 16

    if (distance < radius) {
      const isRim = distance > radius - 2 || (distance > radius - 4 && dither < 0.5)
      put( ctx, isRim ? rim ?? mix( color, skyColor, 0.25 ) : color, x, y )
    } else if (distance < halo) {
      const light = 1 - (distance - radius) / (halo - radius)
      if (dither < light * 0.75) put( ctx, mix( skyColor, color, 0.18 + light * 0.3 ), x, y )
    }
  }

  return canvas
}

// Two wavy ribbons of light across the sky, dithered thin at their edges; as wide as the world, so it can repeat
function createAurora( width, top, colors ) {
  const height = top + 40
  const { canvas, ctx } = createPixelLayer( width, height )

  colors.forEach( (color, index) => {
    for (let x = 0; x < width; x++) {
      const turn = x / width * Math.PI * 2
      const center = top + Math.sin( turn * 2 + index * 2 ) * 8 + Math.sin( turn * 5 + index ) * 3 + index * 9
      const thickness = 6 + Math.sin( turn * 3 + index * 1.7 ) * 3

      for (let y = Math.floor( center - thickness ); y < center + thickness * 2.2; y++) {
        const below = y > center ? (y - center) / (thickness * 2.2) : (center - y) / thickness
        const light = 1 - below
        if (BAYER[ (y % 4) * 4 + (x % 4) ] / 16 < light * 0.7) put( ctx, color, x, y )
      }
    }
  } )

  return canvas
}


function put( ctx, color, x, y ) {
  ctx.fillStyle = color
  ctx.fillRect( x, y, 1, 1 )
}


/**
 * The sticky signet shrinks while the page scrolls (the wordmark and the sky scroll away by themselves). It follows the
 * scroll position itself, not a timer, so however fast the page moves the logo never lags over the world
 */
function foldBrandOnScroll() {
  const signet = document.querySelector( `.signet` )

  // The signet shrinks from the logo's size to its compact size over the first `foldDistance` px of scrolling
  const fold = () => {
    const progress = Math.min( 1, Math.max( 0, scrollY / BRAND.foldDistance ) )
    signet.style.setProperty( `--signet-scale`, 1 - (1 - BRAND.compactHeight / BRAND.signetHeight) * progress )
  }

  let isQueued = false
  const update = () => {
    if (isQueued) return
    isQueued = true
    requestAnimationFrame( () => { isQueued = false; fold() } )
  }

  addEventListener( `scroll`, update, { passive:true } )
  addEventListener( `resize`, update )
  fold()
}

/*
  The pointer leaves a short trail of round dots in the void, which shrink as they fade. They step through the same colours
  as the trail in the worlds (trailRamp), so a stroke from the void into a world stays one stroke; here they stay smooth,
  as everything outside the zones does. A fast move is filled in, so the dots never fall apart
*/
function startTrail( canvas ) {
  const ctx = canvas.getContext( `2d` )
  const dots = []
  const ratio = devicePixelRatio || 1
  const spacing = 12
  const lifetime = 700

  const resize = () => {
    canvas.width = innerWidth * ratio
    canvas.height = innerHeight * ratio
    canvas.style.width = `${innerWidth}px`
    canvas.style.height = `${innerHeight}px`
  }

  resize()
  addEventListener( `resize`, resize )
  if (reducedMotion) return

  addEventListener( `pointermove`, event => {
    const last = dots[ 0 ]
    const now = performance.now()
    if (!last) return dots.unshift({ x:event.clientX, y:event.clientY, createdAt:now })

    const distance = Math.hypot( event.clientX - last.x, event.clientY - last.y )
    const steps = Math.floor( distance / spacing )

    for (let step = 1; step <= steps; step++) {
      dots.unshift({ x:last.x + (event.clientX - last.x) * step / steps, y:last.y + (event.clientY - last.y) * step / steps, createdAt:now - (steps - step) * 6 })
    }
  } )

  requestAnimationFrame( function frame( time ) {
    while (dots.length && time - dots.at( -1 ).createdAt > lifetime) dots.pop()

    ctx.setTransform( ratio, 0, 0, ratio, 0, 0 )
    ctx.clearRect( 0, 0, innerWidth, innerHeight )

    for (let index = dots.length - 1; index >= 0; index--) {
      const { x, y, createdAt } = dots[ index ]
      const age = Math.max( 0, (time - createdAt) / lifetime )
      const life = 1 - age

      ctx.fillStyle = trail.ramp[ Math.min( trail.ramp.length - 1, Math.floor( age * trail.ramp.length ) ) ]
      ctx.globalAlpha = life * 0.4
      ctx.beginPath()
      ctx.arc( x, y, 1.5 + life * 3.5, 0, Math.PI * 2 )
      ctx.fill()
    }

    requestAnimationFrame( frame )
  } )
}

// Rows of 10 round pills: [data-xp] (the account's level) of them full
function fillPills() {
  for (const row of document.querySelectorAll( `[data-blocks], [data-xp]` )) {
    const full = Number( row.dataset.blocks ?? row.dataset.xp )
    row.innerHTML = Array.from({ length:10 }, (_, index) => `<i class="${index < full ? `isFull` : ``}"></i>` ).join( `` )
  }
}

function fillIcons() {
  for (const element of document.querySelectorAll( `[data-icon]` )) element.outerHTML = iconSvg( element.dataset.icon )
}

function iconSvg( name ) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[ name ]}</svg>`
}

// The colour brightened in small steps, its channels in proportion so it keeps its hue, until its lightness reaches `floor`;
// a lighter colour is kept as it is
function withFloor( color, floor ) {
  const channels = hexToRgb( color )
  const brightened = scale => `#${channels.map( channel => Math.min( 255, Math.round( Math.max( channel, 4 ) * scale ) ).toString( 16 ).padStart( 2, `0` ) ).join( `` )}`
  let lifted = color

  for (let scale = 1.05; lightnessOf( lifted ) < floor && scale <= 8; scale += 0.05) lifted = brightened( scale )

  return lifted
}

// CIE L* of a hex colour: how light it looks, from 0 (black) to 100 (white)
function lightnessOf( hex ) {
  const linear = hexToRgb( hex ).map( channel => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  } )
  const luminance = 0.2126 * linear[ 0 ] + 0.7152 * linear[ 1 ] + 0.0722 * linear[ 2 ]

  return luminance > 216 / 24389 ? 116 * Math.cbrt( luminance ) - 16 : luminance * 24389 / 27
}
