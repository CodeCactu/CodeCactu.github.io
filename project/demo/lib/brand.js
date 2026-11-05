/* The Cactu logo in pixels: the big cactus, the wordmark and the plate with its ground and decorations. Shared by brand.html and index.html */

// Dots of the original signet, in its SVG units
const CACTUS_DOTS = [ [ 193, 22 ], [ 105, 55 ], [ 171, 77 ], [ 129, 138 ], [ 163, 207 ], [ 199, 242 ], [ 140, 290 ], [ 38, 125 ], [ 54, 180 ], [ 15, 220 ], [ 66, 240 ], [ 270, 66 ], [ 251, 101 ], [ 281, 151 ], [ 233, 190 ] ]

// Tops of the trunk and both arms, where flowers and shine go
const CACTUS_TOPS = { trunk:[ 150, 0 ], rightArm:[ 257, 36 ], leftArm:[ 37, 86 ] }

// Shading in pixels from the edges. light/top: lit rim on the left and top. rim: base colour kept along the right edge
// (reflected light), so the shade starts that far in. shade/dither: how wide the solid and dithered shade are
const SHADINGS = {
  old: { light:2, top:1, rim:0, shade:3, dither:6 },
  cactus: { light:2, top:2, rim:0, shade:3, dither:6 },
  word: { light:1, top:1, rim:0, shade:2, dither:3 },
}

const CACTUS_PALETTES = {
  cactu: { name:`Cactu`, outline:`#1d3a12`, light:`#8fd14a`, base:`#5da234`, shade:`#3f7d24`, dot:`#2f6b1f` },
  evolveye: { name:`Evolveye`, note:`niebieski z białymi kropkami`, character:`evolveye`, outline:`#10295a`, light:`#8fb8ff`, base:`#2f6fd6`, shade:`#1f4f9e`, dot:`#dbe6f8`, tint:`#dbe6f8` },
  ranfisz: { name:`Ranfisz`, note:`piaskowy`, character:`ranfisz`, outline:`#4a2a06`, light:`#ffc46b`, base:`#e08a1e`, shade:`#a8620f`, dot:`#7a4306`, tint:`#f8e5c9` },
  goral: { name:`Góral`, note:`żelazny, śnieg na czubkach i ruda`, character:`goral`, outline:`#1c2028`, light:`#b3bfcc`, base:`#7d8a99`, shade:`#56616f`, dot:`#cf7638`, snow:`#f7f9fc`, snowShade:`#d3dbe6`, tint:`#dfe4ea` },
  mszak: { name:`Mszak`, note:`mech, różowe kwiaty na ramionach`, character:`mszak`, outline:`#24331c`, light:`#b4dc7e`, base:`#78b34e`, shade:`#4f8434`, dot:`#36621e`, petal:`#f08cb4`, center:`#ffe08a`, hasFlowers:true, tint:`#dfedd2` },
  zabek: { name:`Żabek`, note:`żabia zieleń`, character:`zabek`, outline:`#14302a`, light:`#7fd6b5`, base:`#35a585`, shade:`#25785f`, dot:`#1b6652`, tint:`#d5ede4` },
  glutek: { name:`Glutek`, note:`glut: połysk i kapiące ramiona`, character:`glutek`, outline:`#3a1842`, light:`#f2aef0`, base:`#d36ad3`, shade:`#9c42aa`, dot:`#7a2a86`, hasDrips:true, hasShine:true, tint:`#f1ddf4` },
}

// In the original signet each arm is cut off the trunk by a gap shaped like a curly bracket. In SVG units: the column of the
// cut, from where the arm's inner notch ends to where its elbow meets the trunk, and which way the bracket's point bulges
const CACTUS_BRACES = [ { u:100, fromV:206, toV:258, side:1 }, { u:200, fromV:158, toV:222, side:-1 } ]

/**
 * Marks on the cactus, all cut into its shape like the bracket-shaped gaps of the original signet: the outline fills the cut,
 * and the cactus's own light and shade fall along its edges, so the mark is part of the plant. `braces` names the shape of the
 * gaps between the arms and the trunk; `rows` is a symbol cut into the trunk, `#` for each cut pixel. Inside a symbol the
 * cactus is recessed (shaded); `o` marks a glossy part instead, lit from the top left in the cactus's own greens
 */
const CACTUS_MARKS = {
  none: { name:`Bez` },
  braces: { name:`Klamry spiczaste`, note:`środek klamry wbija się w pień ostrym grotem`, braces:`pointed` },
  bracesRound: { name:`Klamry łagodne`, note:`środek wybrzusza się szeroko i płasko, bez grotu`, braces:`round` },
  bracesArc: { name:`Klamry łukiem`, note:`cała szczelina jest jednym łukiem, jak nawias, z podwiniętymi końcami`, braces:`arc` },
  leaf: { name:`Liść`, note:`kiełek: roślina, która rośnie`, rows:[ `.......##`, `.....##.#`, `....#...#`, `...#...#.`, `..#..##..`, `..#.#....`, `.##......`, `#........` ] },
  sun: { name:`Słońce`, note:`energia, którą kaktus zbiera`, rows:[ `....#....`, `.#.....#.`, `...###...`, `..#...#..`, `#.#...#.#`, `..#...#..`, `...###...`, `.#.....#.`, `....#....` ] },
  soul: { name:`Dusza`, note:`płomyk z okiem i kolcami wokół, trochę jak Evolveye: jasna, lśniąca tęczówka wokół źrenicy`, rows:[ `....#....`, `.#.#...#.`, `...##....`, `..#oo#...`, `#.#ooo#.#`, `.#oo##o#.`, `.#oo##o#.`, `..#ooo#..`, `...###...` ] },
  bolt: { name:`Energia`, note:`błyskawica: kaktus z mocą`, rows:[ `.....#...`, `....#....`, `...#.....`, `..#####..`, `.....#...`, `....#....`, `...#.....` ] },
  star: { name:`Gwiazda`, note:`czteroramienna gwiazda jak iskry na banerze`, rows:[ `....#....`, `...#.#...`, `...#.#...`, `.##...##.`, `#.......#`, `.##...##.`, `...#.#...`, `...#.#...`, `....#....` ] },
  monogram: { name:`Monogram „c”`, note:`litera z napisu, jak znak wyryty w korze`, rows:[ `..####...`, `.#....#..`, `#........`, `#........`, `#........`, `.#....#..`, `..####...` ] },
}

const ACCENT_LINES = [ `#ca5b35`, `#4273b3`, `#7a55ff`, `#e5be4b` ]

const GRASS_COLORS = { base:`#69a948`, light:`#98cf6c`, shade:`#467d31` }

// The plate from the sketch: one smooth outline through these points (fractions of the plate), high over the cactus,
// sloping down over the wordmark, flat at the bottom. Room around the logo is in logo pixels
const BLOB_POINTS = [ [ 0.04, 0.9 ], [ 0.01, 0.55 ], [ 0.08, 0.16 ], [ 0.27, 0.02 ], [ 0.45, 0.12 ], [ 0.58, 0.36 ], [ 0.78, 0.4 ], [ 0.95, 0.5 ], [ 0.99, 0.78 ], [ 0.88, 0.97 ], [ 0.5, 0.99 ], [ 0.18, 0.98 ] ]
const BLOB_ROOM = { left:24, right:26, top:20, bottom:16 }

// The plate's own colours, as on the homepage cloud plate: fill, a thin outline and a shade along the bottom
const PLATE_COLORS = {
  light: { fill:`#ffffff`, outline:`#b7c6e6`, shade:`#dfe6f6`, tone:`#e8eef9`, star:`#9fb3e0`, starGlow:`#d3ddf3` },
  dark: { fill:`#2a2843`, outline:`#4a457c`, shade:`#211f37`, tone:`#34315a`, star:`#fff4c8`, starGlow:`#6c67a6` },
}

const EARTH = { rim:`#98cf6c`, grass:`#69a948`, grassDeep:`#4f8a36`, soil:`#9a6a44`, soilDeep:`#74492c`, pebble:`#b88a5e`, root:`#5a3820`, outline:`#2b2318` }

/**
 * Grounds under the logo, made of traits that mix: depth (rows of ground, Infinity down to the bottom of the plate), isFullWidth
 * (across the whole plate instead of under the logo), inset (how far a row is pulled in from both ends), moundHeight (a rise under
 * the cactus), hasOutline, and body (soil, grass, or layers of grass over soil)
 */
const GROUNDS = {
  strip: { name:`Teraz`, note:`sam pasek trawy, dla porównania` },
  soil: { name:`Pas ziemi`, note:`kilka rzędów ziemi pod trawą, schodkowe końce i obrys`, depth:7, hasOutline:true, inset:row => Math.max( 0, row - 2 ), body:`soil` },
  fill: { name:`Ziemia w chmurze`, note:`płaski grunt wypełnia dół chmury`, depth:Infinity, isFullWidth:true, body:`soil` },
  mound: { name:`Pagórek`, note:`kaktus na wzniesieniu, trawa wypełnia dół chmury`, depth:Infinity, isFullWidth:true, moundHeight:4, body:`grass` },
  moundFill: { name:`Pagórek + ziemia`, note:`wzniesienie pod kaktusem, pod trawą ziemia do samego dołu chmury`, depth:Infinity, isFullWidth:true, moundHeight:4, body:`soil` },
  moundLayers: { name:`Pagórek + warstwy`, note:`wzniesienie, gruba warstwa trawy przechodząca ditheringiem w ziemię`, depth:Infinity, isFullWidth:true, moundHeight:4, body:`layers` },
  moundIsland: { name:`Pagórek + wysepka`, note:`wzniesienie, a pod nim ziemia zwęża się w dół jak wyspa, z obrysem, ale zostaje w chmurze`, depth:11, hasOutline:true, moundHeight:4, inset:row => row < 3 ? 0 : Math.round( (row - 2) ** 1.7 ), body:`soil` },
  fillIsland: { name:`Ziemia + wysepka`, note:`płaski grunt na całą szerokość, a jego dół zaokrąglony i z obrysem jak u wyspy`, depth:12, hasOutline:true, isFullWidth:true, inset:row => row < 5 ? 0 : Math.round( (row - 4) ** 1.8 ), body:`layers` },
}

// Logo sizes: the cactus scale (of the original signet) and the wordmark font size, in pixels
const LOGO_SIZES = {
  large: { name:`Duży`, scale:0.17, fontSize:26 },
  medium: { name:`Średni`, scale:0.11, fontSize:18 },
  small: { name:`Mały`, scale:0.085, fontSize:14 },
}

// How the wordmark sits next to the cactus: after it with a gap, or tucked under the right arm, next to the trunk
const WORD_PLACEMENTS = {
  apart: { name:`Jak było`, gap:6 },
  close: { name:`Bliżej`, gap:2 },
  aligned: { name:`Na linii ramienia`, gap:1 },
  tucked: { name:`Pod ramieniem`, isTucked:true, gap:2 },
}

// Every decoration can be switched on or off on its own
const DECORATION_SWITCHES = {
  lines: { name:`Kolorowe linie`, note:`linie z tła świata, zatrzymane za logo` },
  sparkles: { name:`Iskry`, note:`czteroramienne iskry w kolorach marki` },
  stars: { name:`Gwiazdy`, note:`kilka gwiazd na niebie nad kaktusem` },
  dots: { name:`Kropki`, note:`siatka kropek w drugim odcieniu chmury, gęstsza przy ziemi` },
  grass: { name:`Kępy i kwiaty`, note:`wyższe kępy trawy z kwiatkami na ziemi` },
  buried: { name:`Skarby w ziemi`, note:`w ziemi: korzenie kaktusa, kamienie, kość, kryształ i skrzynka` },
  strata: { name:`Warstwy ziemi`, note:`ciemniejsze i jaśniejsze pasy w ziemi, jak przekrój` },
}

const DECORATIONS = {
  plain: { name:`Bez dekoracji`, list:[] },
  ...Object.fromEntries( Object.entries( DECORATION_SWITCHES ).map( ([ id, decoration ]) => [ id, { ...decoration, list:[ id ] } ] ) ),
  sky: { name:`Niebo`, note:`gwiazdy, iskry i linie`, list:[ `stars`, `sparkles`, `lines` ] },
  underground: { name:`Pod ziemią`, note:`kępy, skarby i warstwy`, list:[ `grass`, `buried`, `strata` ] },
  all: { name:`Wszystko`, note:`wszystkie dekoracje naraz`, list:Object.keys( DECORATION_SWITCHES ) },
}

// Stars as fractions of the plate, mostly above the cactus: 3 is a small cross, 1 a single pixel, 5 a cross with a glow
const STARS = [ { x:0.14, y:0.2, size:3 }, { x:0.25, y:0.12, size:1 }, { x:0.36, y:0.2, size:5 }, { x:0.09, y:0.38, size:1 }, { x:0.46, y:0.14, size:1 }, { x:0.31, y:0.32, size:1 }, { x:0.62, y:0.24, size:3 }, { x:0.8, y:0.3, size:1 }, { x:0.9, y:0.16, size:3 }, { x:0.55, y:0.36, size:1 } ]

// Things buried in the ground: x as a fraction of the plate, depth in pixels below the surface. Key `o` is the outline
const BURIED = [
  { x:0.5, depth:7, rows:[ `.oo.`, `osso`, `.oo.` ], palette:{ o:`#3e2c1c`, s:`#9a8a78` } },
  { x:0.56, depth:10, rows:[ `.ooo.`, `ossso`, `.ooo.` ], palette:{ o:`#3e2c1c`, s:`#857664` } },
  { x:0.68, depth:8, rows:[ `ww...ww`, `.wwwww.`, `ww...ww` ], palette:{ w:`#efe6d2` } },
  { x:0.82, depth:6, rows:[ `..o..`, `.obo.`, `oblbo`, `.obo.`, `..o..` ], palette:{ o:`#2b2318`, b:`#5fb3d9`, l:`#d4f1fa` } },
  { x:0.92, depth:10, rows:[ `.oooooo.`, `obbbbbbo`, `oyyyyyyo`, `obbybbbo`, `obbbbbbo`, `.oooooo.` ], palette:{ o:`#2b2318`, b:`#8a5a2b`, y:`#e5be4b` } },
  { x:0.14, depth:9, rows:[ `.oo.`, `osso`, `.oo.` ], palette:{ o:`#3e2c1c`, s:`#9a8a78` } },
]

// Sparkles as fractions of the plate: size 5 or 3 pixels, colours from the brand
const SPARKLES = [ { x:0.05, y:0.2, size:5, color:`#e5be4b` }, { x:0.5, y:0.18, size:3, color:`#7a55ff` }, { x:0.62, y:0.3, size:5, color:`#4273b3` }, { x:0.9, y:0.42, size:3, color:`#ca5b35` }, { x:0.72, y:0.06, size:3, color:`#e5be4b` } ]

// Static coloured lines behind the logo, as fractions of the plate; they show only where the plate is free
const STATIC_LINES = [ { x:0.38, y:0.33, length:16, color:`#ca5b35` }, { x:0.6, y:0.45, length:22, color:`#4273b3` }, { x:0.45, y:0.5, length:10, color:`#7a55ff` }, { x:0.82, y:0.52, length:14, color:`#e5be4b` } ]

// Things that could stand where the "s" of "cactus" would be. They are shapes painted like the cactus, about as tall as the letters
const ENDINGS = {
  none: { name:`Bez niczego`, note:`obecnie` },
  sprout: { name:`Kiełek`, note:`nowy kaktus dopiero rośnie: ekipa ciągle się powiększa`, width:15 },
  crowd: { name:`Ekipa`, note:`„s” jak liczba mnoga: trzy małe głowy w kolorach postaci. Kaktus to jeden, „cactus” to my wszyscy`, width:21 },
  snake: { name:`Wąż`, note:`pustynny wąż zwinięty w „s”: litera jest, ale żywa, jak mieszkaniec świata Cactu`, width:12 },
  letter: { name:`Inne „s”`, note:`„s” jest, ale z innej czcionki i w innym kolorze: jedna osoba inna niż reszta, jak w pierwotnym logo`, width:14 },
  heart: { name:`Serce`, note:`najprostszy znak paczki przyjaciół`, width:13 },
  dots: { name:`Cztery kropki`, note:`„cactu….” w czterech kolorach marki: różni ludzie, ciąg dalszy`, width:36 },
  character: { name:`Postać`, note:`ktoś z ekipy stoi tam, gdzie powinno być „s”: to my dopełniamy słowo. Postać może się zmieniać`, width:31 },
}

const ENDING_PALETTES = {
  red: { outline:`#5a1424`, light:`#ff9db5`, base:`#e2557a`, shade:`#b03558` },
  snake: { outline:`#4a2a06`, light:`#ffe08a`, base:`#e5be4b`, shade:`#b8862a` },
  letter: { outline:`#2a1a66`, light:`#b9a4ff`, base:`#7a55ff`, shade:`#5536c9` },
}

// Heads of the crowd ending: colours of Evolveye, Ranfisz and Glutek, the middle one a bit higher
const CROWD = [
  { x:0, lift:0, palette:{ outline:`#10295a`, light:`#8fb8ff`, base:`#2f6fd6`, shade:`#1f4f9e` } },
  { x:7, lift:3, palette:{ outline:`#4a2a06`, light:`#ffc46b`, base:`#e08a1e`, shade:`#a8620f` } },
  { x:14, lift:0, palette:{ outline:`#3a1842`, light:`#f2aef0`, base:`#d36ad3`, shade:`#9c42aa` } },
]

const spriteCache = {}

/* ================= THE CACTUS ================= */

/**
 * The cactus in pixels, traced from the original signet at `scale` of its SVG size (0.2 = 58 × 69 pixels).
 * Returns its canvas with room around the shape for the outline and extras, and where the shape starts in it.
 */
function createBigCactus( scale, palette, shading = SHADINGS.cactus, mark = `none` ) {
  const isFilled = createCactusMask( scale )
  const width = isFilled[ 0 ].length
  const height = isFilled.length
  const padding = 6
  const { canvas, ctx } = createPixelLayer( width + padding * 2, height + padding * 2 )
  const toPixel = ([ u, v ]) => [ Math.round( u * scale ), Math.round( v * scale ) ]

  if (palette.hasDrips) addDrips( isFilled, scale )

  // Light and shade follow the whole cactus; cuts only add their dark line, so the green around them stays calm
  const isUncut = isFilled.map( row => [ ...row ] )
  const isNearCut = (x, y) => [ -1, 0, 1 ].some( stepY => [ -1, 0, 1 ].some( stepX => isUncut[ y + stepY ]?.[ x + stepX ] && !isFilled[ y + stepY ][ x + stepX ] ) )
  const { braces, rows } = CACTUS_MARKS[ mark ]

  // Symbols sit low on the trunk, between the arms
  if (braces && scale >= 0.1) cutBraces( isFilled, scale, braces )
  const symbolLeft = Math.round( 150 * scale ) - 4
  const symbolTop = Math.round( 190 * scale ) - Math.floor( (rows?.length ?? 0) / 2 )
  if (rows && scale >= 0.1) cutSymbol( isFilled, rows, symbolLeft, symbolTop )

  paintSprite( ctx, isFilled, palette, padding, padding, scale < 0.1 ? SHADINGS.word : shading, isUncut )

  // Cuts get depth, so they read as carved into the plant rather than drawn on it
  if ((braces || rows) && scale >= 0.1) shadeCuts( ctx, isFilled, isUncut, padding, palette )
  if (rows && scale >= 0.1) carveSymbol( ctx, isFilled, isUncut, padding, palette, CACTUS_MARKS[ mark ], symbolLeft, symbolTop )

  if (palette.snow) paintSnow( ctx, isFilled, palette, padding )

  // Dots are at least one pixel, so they survive small sizes
  const dotRadius = Math.max( 9, 0.6 / scale )
  ctx.fillStyle = palette.dot

  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const isNearDot = CACTUS_DOTS.some( ([ u, v ]) => Math.hypot( (x + 0.5) / scale - u, (y + 0.5) / scale - v ) <= dotRadius )
    if (isFilled[ y ][ x ] && isNearDot && !isNearCut( x, y )) ctx.fillRect( padding + x, padding + y, 1, 1 )
  }

  if (palette.hasShine) {
    ctx.fillStyle = `#ffffff`
    for (const [ x, y ] of Object.values( CACTUS_TOPS ).map( toPixel )) ctx.fillRect( padding + x - Math.round( 4 * scale * 5 ), padding + y + 2, 2, 1 )
  }

  if (palette.hasFlowers) for (const [ x, y ] of Object.values( CACTUS_TOPS ).map( toPixel )) drawFlower( ctx, palette, padding + x, padding + y )

  return { canvas, width, height, padding }
}

// Cuts a bold bracket-shaped gap between each arm and the trunk, two pixels wide, its ends curled towards the arm.
// The middle of the bracket bulges into the trunk: pointed (a sharp tip), round (a wide flat bump) or arc (one curve, like a parenthesis)
function cutBraces( isFilled, scale, style ) {
  for (const { u, fromV, toV, side } of CACTUS_BRACES) {
    const edge = Math.round( u * scale ) - (side > 0 ? 1 : 0)
    const top = Math.round( fromV * scale )
    const bottom = Math.round( toV * scale )
    const middle = (top + bottom) / 2

    // A short arc has too few rows for a curve with a tip: it becomes a plain round bracket, its ends tucked into the arm,
    // the rows next to them on the edge and the rest one pixel into the trunk
    const isShortArc = style === `arc` && (bottom - top) / 2 <= 4.5

    for (let y = top; y <= bottom; y++) {
      // The arc on the left arm is one pixel thin, so it is lighter than the right one, and bends deeper so its curve still shows
      const isThin = style === `arc` && side > 0
      // ... with a small spike at the middle, like the tip of a bracket
      const spike = isThin && !isShortArc && y === Math.round( middle ) ? 1 : 0
      const isEnd = y === top || y === bottom
      const shortOffset = y === top + 1 || y === bottom - 1 ? 0 : 1
      const offset = isEnd ? -1 : isShortArc ? shortOffset : braceBulge( style, Math.abs( y - middle ), (bottom - top) / 2, isThin ) + spike
      const widths = isThin ? [ 0 ] : [ 0, 1 ]
      for (const width of widths) if (isFilled[ y ]) isFilled[ y ][ edge + side * (offset + width) ] = false
    }
  }
}

/**
 * Carves the cuts with the light from the top left: the cactus just left of a cut turns away from the light into it (shade),
 * and the edge right of and below a cut catches a little light (half way between the base and the lit colour)
 */
function shadeCuts( ctx, isFilled, isUncut, padding, palette ) {
  const isCut = (x, y) => (isUncut[ y ]?.[ x ] ?? false) && !isFilled[ y ][ x ]
  const isCactus = (x, y) => isFilled[ y ]?.[ x ] ?? false
  const softLight = mixHex( palette.base, palette.light, 0.5 )
  const shaded = []
  const lit = []

  isFilled.forEach( (row, y) => row.forEach( (_, x) => {
    if (!isCut( x, y )) return
    if (isCactus( x - 1, y )) shaded.push([ x - 1, y ])
    if (isCactus( x + 1, y )) lit.push([ x + 1, y ])
    if (isCactus( x, y + 1 )) lit.push([ x, y + 1 ])
  } ) )

  ctx.fillStyle = palette.shade
  for (const [ x, y ] of shaded) ctx.fillRect( padding + x, padding + y, 1, 1 )

  ctx.fillStyle = softLight
  for (const [ x, y ] of lit) ctx.fillRect( padding + x, padding + y, 1, 1 )
}

// How far the bracket bulges into the trunk at `distance` rows from its middle
function braceBulge( style, distance, halfHeight, isThin = false ) {
  if (style === `round`) return distance <= 1.5 ? 1 : 0
  if (style === `arc`) return Math.round( (isThin ? 2.4 : 1.6) * Math.cos( distance / halfHeight * Math.PI / 2 ) )

  return Math.max( 0, 2 - Math.round( distance ) )
}

/**
 * Makes a cut symbol look built into the trunk: its lines are a deep green groove instead of the black outline, the cactus
 * enclosed by the lines is recessed one shade darker, and `o` pixels are glossy: light on their top left, softer below
 */
function carveSymbol( ctx, isFilled, isUncut, padding, palette, mark, left, top ) {
  const width = mark.rows[ 0 ].length
  const height = mark.rows.length
  const isLine = (x, y) => mark.rows[ y ]?.[ x ] === `#`
  const isOutside = new Set()
  const queue = []

  // Everything reachable from the symbol's border without crossing a line is outside it; the rest is enclosed
  for (let x = -1; x <= width; x++) queue.push([ x, -1 ], [ x, height ])
  for (let y = 0; y < height; y++) queue.push([ -1, y ], [ width, y ])

  while (queue.length) {
    const [ x, y ] = queue.pop()
    const key = `${x},${y}`
    if (isOutside.has( key ) || x < -1 || y < -1 || x > width || y > height || isLine( x, y )) continue

    isOutside.add( key )
    queue.push([ x + 1, y ], [ x - 1, y ], [ x, y + 1 ], [ x, y - 1 ])
  }

  const groove = mixHex( palette.outline, palette.shade, 0.4 )

  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const cactusX = left + x
    const cactusY = top + y
    if (!isUncut[ cactusY ]?.[ cactusX ]) continue

    const isIris = mark.rows[ y ][ x ] === `o`
    const isEnclosed = !isLine( x, y ) && !isOutside.has( `${x},${y}` )
    const glossColor = x + y < 8 ? palette.light : x + y < 10 ? mixHex( palette.base, palette.light, 0.5 ) : palette.base
    const color = isLine( x, y ) ? groove : isIris ? glossColor : isEnclosed ? palette.shade : null
    if (!color) continue

    ctx.fillStyle = color
    ctx.fillRect( padding + cactusX, padding + cactusY, 1, 1 )
  }
}

// Cuts a symbol into the trunk: each cut pixel becomes outline, and the cactus is lit and shaded along the cut
function cutSymbol( isFilled, rows, left, top ) {
  rows.forEach( (row, y) => [ ...row ].forEach( (key, x) => {
    if (key === `#` && isFilled[ top + y ]?.[ left + x ]) isFilled[ top + y ][ left + x ] = false
  } ) )
}

// Trunk and arms of the original signet, in its SVG units: each part has a round cap, the arms bend into the trunk
function isCactusAt( u, v ) {
  const isInEllipse = (centerU, centerV, radiusU, radiusV) => ((u - centerU) / radiusU) ** 2 + ((v - centerV) / radiusV) ** 2 <= 1

  const isTrunk = u >= 100 && u <= 200 && (v >= 45 || isInEllipse( 150, 45, 50, 45 ))
  const isRightArm = u >= 225 && u <= 289 && v <= 147 && (v >= 64 || isInEllipse( 257, 64, 32, 28 ))
  const isRightElbow = u >= 200 && v >= 147 && isInEllipse( 200, 147, 89, 73 ) && !isInEllipse( 200, 147, 25, 19 )
  const isLeftArm = u <= 74 && v <= 192 && (v >= 117 || isInEllipse( 37, 117, 37, 31 ))
  const isLeftElbow = u <= 100 && v >= 192 && isInEllipse( 100, 192, 100, 64 ) && !isInEllipse( 100, 192, 26, 22 )

  return isTrunk || isRightArm || isRightElbow || isLeftArm || isLeftElbow
}

function createCactusMask( scale ) {
  const width = Math.round( 289 * scale )
  const height = Math.round( 347 * scale )

  return Array.from({ length:height }, (_, y) => Array.from({ length:width }, (_, x) => isCactusAt( (x + 0.5) / scale, (y + 0.5) / scale ) ) )
}

// Goo hangs from the undersides of both elbows; drips become part of the shape, so they get the outline too
function addDrips( isFilled, scale ) {
  for (const [ u, length ] of [ [ 22, 3 ], [ 58, 5 ], [ 236, 4 ], [ 268, 2 ] ]) {
    const x = Math.round( u * scale )
    const bottom = isFilled.findLastIndex( row => row[ x ] )

    for (let y = bottom + 1; y <= Math.min( bottom + length, isFilled.length - 1 ); y++) isFilled[ y ][ x ] = true
  }
}

// Snow lies on the top of every column, a bit deeper on some
function paintSnow( ctx, isFilled, palette, padding ) {
  for (let x = 0; x < isFilled[ 0 ].length; x++) {
    const top = isFilled.findIndex( row => row[ x ] )
    const depth = 2 + (x % 3 === 0 ? 1 : 0)
    if (top < 0) continue

    for (let y = top; y < top + depth; y++) {
      ctx.fillStyle = y === top + depth - 1 ? palette.snowShade : palette.snow
      ctx.fillRect( padding + x, padding + y, 1, 1 )
    }
  }
}

// A flower sitting on a top, centered on x, its lowest row overlapping the edge
function drawFlower( ctx, palette, x, y ) {
  const rows = [ `..o.o..`, `.opopo.`, `oppcppo`, `.opppo.`, `..ooo..` ]
  drawPixelMap( ctx, rows, { o:palette.outline, p:palette.petal, c:palette.center }, x - 3, y - 3 )
}

// Outlined and shaded like the character sprites, with the light from the top left (see SHADINGS). Cuts get the outline colour
function paintSprite( ctx, isFilled, palette, left, top, shading, isLitShape = isFilled ) {
  const height = isFilled.length
  const width = isFilled[ 0 ].length
  const isAt = (x, y) => isFilled[ y ]?.[ x ] ?? false

  // Light and shade are measured on `isLitShape`: the shape before anything was cut into it
  const runTo = (x, y, stepX, stepY) => {
    let run = 0
    while (isLitShape[ y + stepY * (run + 1) ]?.[ x + stepX * (run + 1) ]) run++
    return run
  }

  ctx.fillStyle = palette.outline
  for (let y = -1; y <= height; y++) for (let x = -1; x <= width; x++) {
    if (isAt( x, y )) continue
    if (isAt( x - 1, y ) || isAt( x + 1, y ) || isAt( x, y - 1 ) || isAt( x, y + 1 )) ctx.fillRect( left + x, top + y, 1, 1 )
  }

  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!isAt( x, y )) continue

    const intoShade = runTo( x, y, 1, 0 ) - shading.rim
    const isLit = runTo( x, y, -1, 0 ) < shading.light || runTo( x, y, 0, -1 ) < shading.top
    const isDithered = intoShade >= 0 && intoShade < shading.dither && BAYER[ (y % 4) * 4 + (x % 4) ] < 8
    const isShaded = (intoShade >= 0 && intoShade < shading.shade) || runTo( x, y, 0, 1 ) < 1 || isDithered

    ctx.fillStyle = isLit ? palette.light : isShaded ? palette.shade : palette.base
    ctx.fillRect( left + x, top + y, 1, 1 )
  }
}

// The cactu wordmark in the same material as the cactus
function createWordmark( fontSize, palette, shading = SHADINGS.word ) {
  const word = rasterizeText( `cactu`, fontSize, Math.round( fontSize * 0.19 ) )
  const { canvas, ctx } = createPixelLayer( word.width + 2, word.height + 2 )

  // From this size the holes inside the letters are big enough to show square corners, so they get rounded
  if (fontSize >= 29) roundInnerCorners( word.isFilled )

  paintSprite( ctx, word.isFilled, palette, 1, 1, shading )

  ctx.fillStyle = palette.dot
  word.isFilled.forEach( (row, y) => row.forEach( (isFilled, x) => {
    const isInside = isFilled && row[ x - 2 ] && row[ x + 2 ] && word.isFilled[ y - 1 ]?.[ x ] && word.isFilled[ y + 1 ]?.[ x ]
    if (isInside && (x * 7 + y * 3) % 23 === 0) ctx.fillRect( 1 + x, 1 + y, 1, 1 )
  } ) )

  return { canvas, width:word.width, height:word.height }
}

// Fills the inner corners of holes and notches with one pixel, where two sides meet at a right angle with the corner between them filled too
function roundInnerCorners( isFilled ) {
  const isAt = (x, y) => isFilled[ y ]?.[ x ] ?? false
  const corners = []

  isFilled.forEach( (row, y) => row.forEach( (isPixel, x) => {
    if (isPixel) return

    for (const [ stepX, stepY ] of [ [ -1, -1 ], [ 1, -1 ], [ -1, 1 ], [ 1, 1 ] ]) {
      const isCorner = isAt( x + stepX, y ) && isAt( x, y + stepY ) && isAt( x + stepX, y + stepY ) && !isAt( x - stepX, y ) && !isAt( x, y - stepY )
      if (isCorner) corners.push([ x, y ])
    }
  } ) )

  for (const [ x, y ] of corners) isFilled[ y ][ x ] = true
}

// The whole logo: the cactus with the wordmark standing on the same ground, as in the original banner
function createLogo( palette, { scale = 0.17, fontSize = 26, isOldShading = false, mark = `none`, ending = `none`, placement = `apart` } = {} ) {
  const cactusKey = `cactus ${scale} ${palette.name} ${isOldShading} ${mark}`
  const cactus = spriteCache[ cactusKey ] ??= createBigCactus( scale, palette, isOldShading ? SHADINGS.old : SHADINGS.cactus, mark )
  const armBottom = Math.round( 220 * scale ) + 1

  // "fit" makes the letters as tall as the part of the cactus below its right arm, as in the original logo
  const wordSize = fontSize === `fit` ? fittingFontSize( cactus.height - armBottom ) : fontSize
  const word = spriteCache[ `word ${wordSize} ${palette.name} ${isOldShading}` ] ??= createWordmark( wordSize, palette, isOldShading ? { ...SHADINGS.word, rim:0, top:1 } : SHADINGS.word )
  const { gap, isTucked } = WORD_PLACEMENTS[ placement ]

  // Tucked, the wordmark starts just right of the trunk, under the arm, when the arm ends above the letters
  const canTuck = isTucked && cactus.height - word.height - 2 > armBottom
  const wordLeft = canTuck ? Math.round( 200 * scale ) + 4 : cactus.width + gap
  const endingWidth = measureEnding( ending )
  const width = Math.max( cactus.width, wordLeft + word.width + (endingWidth ? endingWidth + 5 : 0) )
  const height = cactus.height + 1
  const { canvas, ctx } = createPixelLayer( width + 2, height + 2 )
  const groundY = height

  ctx.drawImage( cactus.canvas, 1 - cactus.padding, groundY - cactus.height - cactus.padding )
  ctx.drawImage( word.canvas, wordLeft, groundY - word.height - 1 )
  drawEnding( ctx, ending, wordLeft + word.width + 5, groundY )

  return { canvas, groundY, wordLeft, scale }
}

// The largest font size whose wordmark is at most `height` pixels tall
function fittingFontSize( height ) {
  for (let fontSize = 48; fontSize > 12; fontSize--) {
    const wordHeight = spriteCache[ `word height ${fontSize}` ] ??= rasterizeText( `cactu`, fontSize, Math.round( fontSize * 0.19 ) ).height
    if (wordHeight <= height) return fontSize
  }

  return 12
}

function measureEnding( ending ) {
  return ENDINGS[ ending ].width ?? 0
}

// Draws the ending standing on groundY with its left edge at x
function drawEnding( ctx, ending, x, groundY ) {
  const green = CACTUS_PALETTES.cactu
  const isInCircle = (px, py, centerX, centerY, radius) => (px + 0.5 - centerX) ** 2 + (py + 0.5 - centerY) ** 2 <= radius ** 2

  // Three small heads standing together, each with two dots for eyes
  if (ending === `crowd`) for (const { x:offset, lift, palette } of CROWD) {
    const head = createMask( 7, 8, (px, py) => isInCircle( px, py, 3.5, 4, 3.6 ) || (py >= 4 && px >= 0 && px < 7) )
    const top = groundY - 8 - lift

    paintSprite( ctx, head, palette, x + offset, top, SHADINGS.word )
    ctx.fillStyle = palette.outline
    ctx.fillRect( x + offset + 2, top + 3, 1, 1 )
    ctx.fillRect( x + offset + 4, top + 3, 1, 1 )
  }

  // An S made of two rings of a thick body, with a head (eye and tongue) at the top end and a pattern of darker scales
  if (ending === `snake`) {
    const isInRing = (px, py, centerY) => {
      const distance = Math.hypot( px + 0.5 - 5.5, py + 0.5 - centerY )
      return distance >= 1.9 && distance <= 4.2
    }
    const snake = createMask( 11, 16, (px, py) => (isInRing( px, py, 4.5 ) && !(px >= 5.5 && py >= 4.5) && !(px >= 7 && py >= 3)) || (isInRing( px, py, 11.5 ) && !(px < 5.5 && py < 11.5) && !(px < 4 && py < 13)) )
    const top = groundY - 16

    paintSprite( ctx, snake, ENDING_PALETTES.snake, x, top, SHADINGS.word )

    ctx.fillStyle = ENDING_PALETTES.snake.shade
    snake.forEach( (row, py) => row.forEach( (isPixel, px) => {
      if (isPixel && (px + py) % 4 === 0) ctx.fillRect( x + px, top + py, 1, 1 )
    } ) )

    ctx.fillStyle = ENDING_PALETTES.snake.outline
    ctx.fillRect( x + 7, top + 1, 1, 1 )
    ctx.fillStyle = `#e2453f`
    ctx.fillRect( x + 10, top + 2, 1, 1 )
  }

  // The letter from a different typeface, shaded in its own colour
  if (ending === `letter`) {
    const letter = rasterizeText( `s`, 30, 0, `"Bricolage Grotesque"` )
    paintSprite( ctx, letter.isFilled, ENDING_PALETTES.letter, x + 1, groundY - letter.height - 1, SHADINGS.word )
  }

  if (ending === `character`) drawCharacterFrame( ctx, `ranfisz`, x + Math.floor( SHEETS.ranfisz.width / 2 ), groundY - 1, 0, 0 )

  // Two leaves opening into a V from a short stem, low and wide so it does not read as a letter
  if (ending === `sprout`) {
    const isInLeaf = (px, py, centerX, centerY, angle) => {
      const offsetX = px + 0.5 - centerX
      const offsetY = py + 0.5 - centerY
      const along = offsetX * Math.cos( angle ) + offsetY * Math.sin( angle )
      const across = -offsetX * Math.sin( angle ) + offsetY * Math.cos( angle )
      return (along / 4.2) ** 2 + (across / 2.1) ** 2 <= 1
    }
    const sprout = createMask( 15, 11, (px, py) => isInLeaf( px, py, 4, 4.5, 0.6 ) || isInLeaf( px, py, 11, 4.5, -0.6 ) || (px === 7 && py >= 6) )

    paintSprite( ctx, sprout, green, x, groundY - 11, SHADINGS.word )
  }

  // Four round petals around a yellow middle, on a short stem
  if (ending === `flower`) {
    const stem = createMask( 12, 16, (px, py) => px === 6 && py >= 8 )
    const petals = createMask( 12, 16, (px, py) => [ [ 6, 2.8 ], [ 3.2, 5.6 ], [ 8.8, 5.6 ], [ 6, 8.4 ] ].some( ([ centerX, centerY ]) => isInCircle( px, py, centerX, centerY, 2.7 ) ) )

    paintSprite( ctx, stem, green, x, groundY - 16, SHADINGS.word )
    paintSprite( ctx, petals, ENDING_PALETTES.pink, x, groundY - 16, SHADINGS.word )
    ctx.fillStyle = `#ffe08a`
    ctx.fillRect( x + 5, groundY - 16 + 5, 2, 2 )
  }

  if (ending === `heart`) {
    const heart = createMask( 13, 13, (px, py) => {
      const heartX = (px + 0.5 - 6.5) / 5.4
      const heartY = -(py + 0.5 - 6.4) / 5.2
      return (heartX ** 2 + heartY ** 2 - 1) ** 3 - heartX ** 2 * heartY ** 3 <= 0
    } )
    paintSprite( ctx, heart, ENDING_PALETTES.red, x, groundY - 13, SHADINGS.word )
  }

  // Round dots in the four brand colours, each shaded like the rest
  if (ending === `dots`) ACCENT_LINES.forEach( (color, index) => {
    const dot = createMask( 7, 7, (px, py) => isInCircle( px, py, 3.5, 3.5, 3.6 ) )
    const palette = { outline:mixHex( color, `#000000`, 0.6 ), light:mixHex( color, `#ffffff`, 0.35 ), base:color, shade:mixHex( color, `#000000`, 0.25 ) }

    paintSprite( ctx, dot, palette, x + 1 + index * 9, groundY - 8, SHADINGS.word )
  } )
}

// A grid of booleans: which pixels of a width × height box are inside the shape
function createMask( width, height, isInside ) {
  return Array.from({ length:height }, (_, y) => Array.from({ length:width }, (_, x) => isInside( x, y ) ) )
}

// A strip of grass the logo stands on: a solid band with blades of varied height, darker blades every few pixels
function drawGrass( ctx, left, right, groundY ) {
  const heights = [ 1, 2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1 ]

  ctx.fillStyle = GRASS_COLORS.base
  ctx.fillRect( left + 2, groundY, right - left - 4, 2 )
  ctx.fillRect( left, groundY + 1, right - left, 1 )

  for (let x = left + 1; x < right - 1; x++) {
    const height = heights[ x % heights.length ]
    ctx.fillStyle = x % 5 === 0 ? GRASS_COLORS.shade : GRASS_COLORS.light
    ctx.fillRect( x, groundY - height, 1, height )
  }
}

/* ================= STATIC LOGO AND BANNER ================= */

/**
 * The logo on the plate from the sketch, drawn like the homepage cloud plate. Decorations go on the plate behind the logo
 * (lines), at its ground (grass) and around it (sparkles). Nothing moves. With `frame` ({ width, height }) the plate fills
 * that size, so it can be a banner by itself; with `isFullFrame` too, the plate covers the whole frame with no outline
 */
function createStaticPlate( colors, { ending = `none`, decorations = [], ground = `strip`, size = `large`, placement = `apart`, fontSize, mark = `none`, frame, isFullFrame = false } = {} ) {
  const { scale, fontSize:defaultFontSize } = LOGO_SIZES[ size ]
  const logo = createLogo( CACTUS_PALETTES.cactu, { ending, scale, fontSize:fontSize ?? defaultFontSize, placement, mark } )
  const room = frame ? centerRoom( frame, logo.canvas ) : Object.fromEntries( Object.entries( BLOB_ROOM ).map( ([ side, value ]) => [ side, Math.round( value * scale / 0.17 ) ] ) )
  const width = frame?.width ?? logo.canvas.width + room.left + room.right
  const height = frame?.height ?? logo.canvas.height + room.top + room.bottom
  const { canvas, ctx } = createPixelLayer( width, height )
  const isInside = isFullFrame ? createMask( width, height, () => true ) : readMask( spriteCache[ `blob ${width} ${height}` ] ??= createHomepageBlob( width, height ) )
  const groundY = room.top + logo.groundY
  const has = decoration => decorations.includes( decoration )

  paintPlate( ctx, isInside, colors )

  // Sky first: dots and stars on the plate, then the lines, all clipped to the plate so they read as its background
  if (has( `dots` )) drawPlateDots( ctx, colors, groundY )
  if (has( `stars` )) drawStars( ctx, colors, isInside )

  if (has( `lines` )) {
    ctx.globalCompositeOperation = `source-atop`
    for (const { x, y, length, color } of STATIC_LINES) {
      ctx.fillStyle = color
      ctx.fillRect( Math.round( x * width ), Math.round( y * height ), length, 1 )
      ctx.fillRect( Math.round( x * width ) + 1, Math.round( y * height ) - 1, length - 2, 3 )
    }
    ctx.globalCompositeOperation = `source-over`
  }

  const area = { left:room.left - 10, right:room.left + logo.canvas.width + 8, groundY, logoLeft:room.left, plateHeight:height }

  if (ground !== `strip`) {
    const surfaceAt = plantLogo( ctx, logo, GROUNDS[ ground ], area, { strata:has( `strata` ) } )

    if (has( `buried` )) drawBuried( ctx, surfaceAt, area, logo.scale )
    if (has( `grass` )) drawTufts( ctx, surfaceAt, area, logo.wordLeft )
  } else {
    drawMeadow( ctx, area.left, area.right, groundY, colors )
    ctx.drawImage( logo.canvas, room.left, room.top )
  }

  if (has( `sparkles` )) for (const { x, y, size, color } of SPARKLES) drawSparkle( ctx, Math.round( x * width ), Math.round( y * height ), size, color )

  return canvas
}

// A grid of dots in the plate's second colour, denser towards the ground, only on the plate
function drawPlateDots( ctx, colors, groundY ) {
  const { width, height } = ctx.canvas

  ctx.globalCompositeOperation = `source-atop`
  ctx.fillStyle = colors.tone

  for (let y = 2; y < height; y += 4) for (let x = y % 8 === 2 ? 0 : 2; x < width; x += 4) {
    const density = Math.min( 16, Math.max( 0, (y / groundY - 0.2) * 22 ) )
    if (BAYER[ ((y >> 2) % 4) * 4 + ((x >> 2) % 4) ] < density) ctx.fillRect( x, y, 1, 1 )
  }

  ctx.globalCompositeOperation = `source-over`
}

// With a fixed frame (the plate as a whole banner) the logo sits in the middle, a little low, since the plate is highest on the left
function centerRoom( frame, logo ) {
  const left = Math.floor( (frame.width - logo.width) / 2 )
  const top = Math.floor( (frame.height - logo.height) / 2 ) + Math.round( frame.height * 0.06 )

  return { left, top, right:frame.width - logo.width - left, bottom:frame.height - logo.height - top }
}

// The ground is drawn over the logo's bottom outline, with blades in front of the cactus: it grows out of the ground, the letters stand on it
function plantLogo( ctx, logo, ground, area, { strata = false } = {} ) {
  const cactusCenter = area.logoLeft + 1 + Math.round( 150 * logo.scale )
  const moundRadius = 200 * logo.scale
  const moundHeight = Math.round( (ground.moundHeight ?? 0) * logo.scale / 0.17 )
  const surfaceAt = x => area.groundY - Math.round( moundHeight * Math.max( 0, 1 - ((x - cactusCenter) / moundRadius) ** 2 ) )
  const shape = { ...ground, surfaceAt, cactusCenter, hasStrata:strata, ...area }

  ctx.drawImage( logo.canvas, area.logoLeft, area.groundY - logo.groundY )
  paintGround( ctx, shape )

  // Blades in front of everything except the letters, so they stay readable, and the cactus's shadow falling to the right
  const wordLeft = area.logoLeft + logo.wordLeft - 1

  for (let x = area.left + 1; x < area.right - 1; x++) {
    const bladeHeight = [ 1, 0, 2, 1, 0, 1, 3, 0, 1, 2 ][ x % 10 ]
    const height = x >= wordLeft && x < area.right - 10 ? 0 : bladeHeight
    ctx.fillStyle = x % 4 === 0 ? EARTH.grassDeep : EARTH.rim
    ctx.fillRect( x, surfaceAt( x ) - height, 1, height )
  }

  const shadowStart = cactusCenter + Math.round( 60 * logo.scale )
  const shadowLength = Math.round( 60 * logo.scale )

  ctx.fillStyle = EARTH.grass
  for (let x = shadowStart; x < shadowStart + shadowLength; x++) if (x % 2 === 0 || x < shadowStart + shadowLength / 2) ctx.fillRect( x, surfaceAt( x ), 1, 1 )

  return surfaceAt
}

// Taller tufts along the ground with a flower on some, kept out of the letters' way
function drawTufts( ctx, surfaceAt, area, wordLeft ) {
  const tuft = [ [ 0, 3 ], [ 1, 5 ], [ 2, 2 ], [ 3, 4 ], [ 4, 2 ] ]
  const flowers = [ `#f08cb4`, `#ffe08a`, `#ffffff` ]

  // Only where the plate is, so no blade sticks out of the cloud
  ctx.globalCompositeOperation = `source-atop`

  for (let left = 0, index = 0; left < ctx.canvas.width - 5; left += 11 + (index * 7) % 9, index++) {
    const isUnderLetters = left + 5 > area.logoLeft + wordLeft - 2 && left < area.right - 10
    if (isUnderLetters) continue

    for (const [ offset, height ] of tuft) {
      ctx.fillStyle = offset % 2 ? EARTH.rim : EARTH.grassDeep
      ctx.fillRect( left + offset, surfaceAt( left + offset ) - height, 1, height )
    }

    if (index % 2 === 0) {
      ctx.fillStyle = flowers[ index % flowers.length ]
      ctx.fillRect( left + 1, surfaceAt( left + 1 ) - 6, 1, 1 )
    }
  }

  ctx.globalCompositeOperation = `source-over`
}

// Roots under the trunk and a few things buried in the soil, clipped to the plate
function drawBuried( ctx, surfaceAt, area, scale ) {
  const width = ctx.canvas.width
  const cactusCenter = area.logoLeft + 1 + Math.round( 150 * scale )

  ctx.globalCompositeOperation = `source-atop`
  drawRoots( ctx, cactusCenter, surfaceAt( cactusCenter ) + 3 )

  for (const { x, depth, rows, palette } of BURIED) {
    const left = Math.round( x * width - rows[ 0 ].length / 2 )
    drawPixelMap( ctx, rows, palette, left, surfaceAt( left ) + Math.round( depth * scale / 0.17 ) )
  }

  ctx.globalCompositeOperation = `source-over`
}

// Small stars on the plate's sky: single pixels, little crosses, and bigger crosses with a soft glow
function drawStars( ctx, colors, isInside ) {
  const { width, height } = ctx.canvas

  ctx.globalCompositeOperation = `source-atop`

  for (const { x, y, size } of STARS) {
    const centerX = Math.round( x * width )
    const centerY = Math.round( y * height )

    // A star needs clear sky around it: none on the cloud's outline or right next to it
    const isClear = [ -4, 0, 4 ].every( offsetY => [ -4, 0, 4 ].every( offsetX => isInside[ centerY + offsetY ]?.[ centerX + offsetX ] ) )
    if (!isClear) continue

    if (size >= 5) {
      ctx.fillStyle = colors.starGlow
      ctx.fillRect( centerX - 2, centerY, 5, 1 )
      ctx.fillRect( centerX, centerY - 2, 1, 5 )
    }

    ctx.fillStyle = colors.star
    ctx.fillRect( centerX, centerY, 1, 1 )
    if (size >= 3) {
      ctx.fillRect( centerX - 1, centerY, 3, 1 )
      ctx.fillRect( centerX, centerY - 1, 1, 3 )
    }
  }

  ctx.globalCompositeOperation = `source-over`
}

// Paints the ground row by row from its surface down. Full-width grounds span the whole plate and are clipped to it;
// the others span the logo, pulled in by `inset` row by row. The body below the grass is soil, grass, or grass turning into soil
function paintGround( ctx, shape ) {
  const left = shape.isFullWidth ? 0 : shape.left
  const right = shape.isFullWidth ? ctx.canvas.width : shape.right
  const isInside = (x, row) => {
    if (row < 0 || row >= shape.depth) return false
    const inset = shape.inset?.( row ) ?? 0
    return x >= left + inset && x < right - inset
  }
  // Under the thick grass of `layers` everything below starts lower, so the light soil shows before it darkens
  const grassDepth = shape.body === `layers` ? 6 : 0
  const bodyAt = (x, row) => {
    const dither = BAYER[ (row % 4) * 4 + (x % 4) ]
    const soilRow = row - grassDepth
    const isDeep = shape.depth === Infinity ? soilRow > 6 && dither < Math.min( 15, (soilRow - 6) * 3 ) : row >= shape.depth - 2 || (row >= shape.depth - 4 && dither < 8)

    if (shape.hasStrata && soilRow > 15 && shape.body !== `grass`) return strataAt( x, soilRow - 16, dither )
    if (shape.body === `grass`) return isDeep ? EARTH.grassDeep : EARTH.grass
    if (shape.body === `layers` && (row < 5 || (row < 7 && dither < (7 - row) * 6))) return thickGrassAt( x, row )
    return isDeep ? EARTH.soilDeep : EARTH.soil
  }

  // Full-width grounds only cover the plate
  if (shape.isFullWidth) ctx.globalCompositeOperation = `source-atop`

  for (let x = left - 1; x <= right; x++) {
    const top = shape.surfaceAt( x )

    for (let row = -1; top + row < ctx.canvas.height; row++) {
      const isPixel = isInside( x, row )
      const isOutline = shape.hasOutline && !isPixel && (isInside( x - 1, row ) || isInside( x + 1, row ) || isInside( x, row - 1 ))
      if (!isPixel && !isOutline) continue

      const body = bodyAt( x, row )
      const isPebble = row > 3 && (x * 7 + row * 13) % 37 === 0
      const pebble = body === EARTH.grass || body === EARTH.grassDeep ? EARTH.rim : EARTH.pebble

      ctx.fillStyle = isOutline ? EARTH.outline : row === 0 ? EARTH.rim : row < 3 ? EARTH.grass : isPebble ? pebble : body
      ctx.fillRect( x, top + row, 1, 1 )
    }
  }

  ctx.globalCompositeOperation = `source-over`

  if (shape.hasRoots) drawRoots( ctx, shape.cactusCenter, shape.surfaceAt( shape.cactusCenter ) + 3 )
}

// Thick grass with a little variety: a few darker clumps, lighter blades and now and then a small flower
function thickGrassAt( x, row ) {
  if (row >= 3 && (x * 17 + row * 5) % 61 === 0) return (x >> 2) % 2 ? `#f08cb4` : `#ffe08a`
  if ((x * 7 + row * 13) % 19 === 0) return EARTH.rim
  if ((x * 5 + row * 11) % 13 === 0 || ((x + row * 3) % 23 < 3 && row >= 3)) return EARTH.grassDeep

  return EARTH.grass
}

// Bands below the top soil, wavy along the width: light, soil and two darker ones dithered into each other, so no band is flat
function strataAt( x, depth, dither ) {
  const band = Math.floor( (depth + Math.round( Math.sin( x / 9 ) * 1.5 )) / 3 ) % 4
  const isEdgeRow = (depth + Math.round( Math.sin( x / 9 ) * 1.5 )) % 3 === 0

  if (band === 0) return isEdgeRow && dither < 6 ? EARTH.soil : EARTH.pebble
  if (band === 2) return dither < 5 ? EARTH.soil : EARTH.soilDeep
  if (band === 3) return isEdgeRow && dither < 8 ? EARTH.soilDeep : dither < 3 ? EARTH.pebble : EARTH.soilDeep
  return EARTH.soil
}

// Roots spread from under the trunk: one straight down, two to the sides, each ending in a short fork
function drawRoots( ctx, x, top ) {
  const paths = [ [ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ], [ 0, 4 ], [ -1, 5 ], [ 1, 5 ] ], [ [ -4, 0 ], [ -5, 1 ], [ -6, 2 ], [ -7, 3 ], [ -8, 3 ], [ -7, 4 ], [ -9, 4 ] ], [ [ 4, 0 ], [ 5, 1 ], [ 6, 1 ], [ 7, 2 ], [ 8, 3 ], [ 9, 3 ], [ 8, 4 ] ] ]

  ctx.fillStyle = EARTH.root
  for (const path of paths) for (const [ offsetX, offsetY ] of path) ctx.fillRect( x + offsetX, top + offsetY, 1, 1 )
}

// The sketch's outline with small round puffs along its top, like the homepage cloud plate. Kept 2 pixels in from the edges for the outline
function createHomepageBlob( width, height ) {
  const { canvas, ctx } = createPixelLayer( width, height )
  const blob = createBlobShape( width - 4, height - 6 )
  const isInBlob = readMask( blob )

  ctx.drawImage( blob, 2, 4 )

  for (let x = 6, index = 0; x < width - 8; x += 9, index++) {
    const top = isInBlob.findIndex( row => row[ x - 2 ] )
    if (top < 0) continue

    ctx.beginPath()
    ctx.arc( x + 0.5, top + 4 + 2.5, 3 + (index % 3) * 1.5, 0, Math.PI * 2 )
    ctx.fill()
  }

  const image = ctx.getImageData( 0, 0, width, height )
  for (let index = 3; index < image.data.length; index += 4) image.data[ index ] = image.data[ index ] > 127 ? 255 : 0
  ctx.putImageData( image, 0, 0 )

  return canvas
}

function readMask( canvas ) {
  const { data } = canvas.getContext( `2d` ).getImageData( 0, 0, canvas.width, canvas.height )
  return createMask( canvas.width, canvas.height, (x, y) => data[ (y * canvas.width + x) * 4 + 3 ] > 0 )
}

// Fill with a 1 pixel outline around, and two rows of shade along the bottom edge of every part
function paintPlate( ctx, isInside, colors ) {
  const isAt = (x, y) => isInside[ y ]?.[ x ] ?? false

  isInside.forEach( (row, y) => row.forEach( (isPixel, x) => {
    const isOutline = !isPixel && (isAt( x - 1, y ) || isAt( x + 1, y ) || isAt( x, y - 1 ) || isAt( x, y + 1 ))
    if (!isPixel && !isOutline) return

    ctx.fillStyle = isOutline ? colors.outline : !isAt( x, y + 1 ) || !isAt( x, y + 2 ) ? colors.shade : colors.fill
    ctx.fillRect( x, y, 1, 1 )
  } ) )
}

// Grass with a few flowers and pebbles in front of it
function drawMeadow( ctx, left, right, groundY, colors ) {
  drawGrass( ctx, left, right, groundY )

  for (const [ offset, color ] of [ [ 3, `#f08cb4` ], [ 0.42, `#ffe08a` ], [ 0.97, `#f08cb4` ] ].map( ([ at, color ]) => [ at < 1 ? Math.round( left + at * (right - left) ) : left + at, color ] )) {
    ctx.fillStyle = color
    ctx.fillRect( offset, groundY - 3, 1, 1 )
  }

  ctx.fillStyle = colors.outline
  for (const at of [ 0.2, 0.66, 0.86 ]) ctx.fillRect( Math.round( left + at * (right - left) ), groundY + 2, 2, 1 )
}

// A four-pointed sparkle: 5 pixels with a white middle, or a 3 pixel cross
function drawSparkle( ctx, x, y, size, color ) {
  const half = Math.floor( size / 2 )

  ctx.fillStyle = color
  ctx.fillRect( x - half, y, size, 1 )
  ctx.fillRect( x, y - half, 1, size )

  if (size < 5) return

  ctx.fillStyle = `#ffffff`
  ctx.fillRect( x, y, 1, 1 )
}

// A closed smooth curve through BLOB_POINTS (Catmull-Rom as Bézier segments), filled with hard pixel edges
function createBlobShape( width, height ) {
  const { canvas, ctx } = createPixelLayer( width, height )
  const points = BLOB_POINTS.map( ([ x, y ]) => [ x * width, y * height ] )
  const pointAt = index => points[ (index + points.length) % points.length ]

  ctx.beginPath()
  ctx.moveTo( ...points[ 0 ] )

  for (let index = 0; index < points.length; index++) {
    const [ [ beforeX, beforeY ], [ fromX, fromY ], [ toX, toY ], [ afterX, afterY ] ] = [ pointAt( index - 1 ), pointAt( index ), pointAt( index + 1 ), pointAt( index + 2 ) ]
    ctx.bezierCurveTo( fromX + (toX - beforeX) / 6, fromY + (toY - beforeY) / 6, toX - (afterX - fromX) / 6, toY - (afterY - fromY) / 6, toX, toY )
  }

  ctx.fill()

  const image = ctx.getImageData( 0, 0, width, height )
  for (let index = 3; index < image.data.length; index += 4) image.data[ index ] = image.data[ index ] > 127 ? 255 : 0
  ctx.putImageData( image, 0, 0 )

  return canvas
}
