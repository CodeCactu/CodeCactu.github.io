/* The cast and their worlds: who they are, how their stand-in sprites look, the props of their biomes and their scenes */

// Ids are the sprite sheet names. Unlocked characters are shuffled on every visit; the locked ones stay at the end
const CHARACTERS = [
  { id:`evolveye`, name:`Evolveye`, note:`Duch, który żyje na niebie`, sprite:`../../characters/evolveye/idle_right.png` },
  { id:`ranfisz`, name:`Ranfisz`, note:`Z pustyni, kocha rośliny`, sprite:`../../characters/ranfisz/idle_right.png` },
  { id:`goral`, name:`Tomangelo`, note:`Góry i żelazo` },
  { id:`mszak`, name:`Mechutea`, note:`Mech i fioletowe kwiaty` },
  { id:`zabek`, name:`Pooshek`, note:`Laboratorium na mesie` },
  { id:`glutek`, name:`Somka`, note:`Ciągnie się jak glut` },
  { id:`klimax`, name:`Klimax`, note:`Inżynier jądrowy, pracuje z Pooshkiem` },
  { id:`svebran`, name:`Svebran`, note:`Góry i moc samej ziemi` },
  { id:`kubixii`, name:`Kubixii`, note:`Otwiera portale` },
  { id:`emajster`, name:`EMajster`, note:`Równiny, akwaria i trochę prądu` },
  { id:`mergatic`, name:`Mergatic`, note:`Księżycowy maruda, ceni dobrą sztukę` },
  { id:`unux`, name:`Unux`, note:`Złowieszczy, z piekielnych ziem` },
  { id:`heartofmoe`, name:`Heartofmoe`, note:`Biały lis` },
  { id:`selcior`, name:`Selcior`, note:`Żółty, kocha klocki i bloki` },
  { id:`blacky`, name:`Blacky`, note:`Cień, który potrafi zniknąć` },
  { id:`murshtin`, name:`Murshtin`, note:`Artysta, chowa się za murami` },
  { name:`Postać 17`, unlockLevel:4 },
  { name:`Postać 18`, unlockLevel:6 },
]

/**
 * Stand-ins for the characters without sprite sheets, about the size of the real ones (Ranfisz, Evolveye). Each is drawn from
 * a short description, so it has its own silhouette: a body (round, rock, blob or block) on two feet, eyes, a mouth and the
 * parts that make the character, shaded from the top left and outlined like the real sprites. They face right; the result
 * has world.js's placeholder keys: o outline, l light, b base, s shade, w eye white, k pupil (w and k blink)
 */
const STAND_INS = {
  goral: {
    width:32, height:30, body:{ shape:`rock`, x:16, y:17, rx:12, ry:10 },
    palette:{ o:`#1c2028`, l:`#b3bfcc`, b:`#7d8a99`, s:`#56616f`, n:`#f4f7fb`, a:`#cf7638`, w:`#f4f7fb`, k:`#1c2028` },
    parts:[ { type:`ellipse`, x:15, y:9, rx:8, ry:3, key:`n` } ],
    marks:[ [ 8, 20, `a` ], [ 9, 20, `a` ], [ 22, 22, `a` ], [ 23, 22, `a` ], [ 18, 24, `a` ], [ 12, 24, `a` ] ],
    eyes:{ y:15, gap:5 }, mouth:{ y:21, type:`line`, width:4 },
  },
  mszak: {
    width:32, height:30, body:{ shape:`round`, x:16, y:18, rx:12, ry:9 },
    palette:{ o:`#24331c`, l:`#98cf6c`, b:`#69a948`, s:`#467d31`, m:`#4f8a36`, p:`#a46ad8`, y:`#f2d6ff`, w:`#ffffff`, k:`#24331c` },
    parts:[
      { type:`ellipse`, x:9, y:10, rx:4, ry:2, key:`m` }, { type:`ellipse`, x:16, y:9, rx:4, ry:2, key:`m` }, { type:`ellipse`, x:23, y:10, rx:4, ry:2, key:`m` },
      { type:`map`, x:6, y:3, rows:[ `.p.......p......`, `pyp.....pyp...p.`, `.p.......p...pyp`, `.m.......m....p.`, `.m.......m....m.` ] },
    ],
    eyes:{ y:17, gap:5 }, mouth:{ y:22, type:`smile`, width:4 },
  },
  zabek: {
    width:34, height:28, body:{ shape:`round`, x:17, y:17, rx:14, ry:8 },
    palette:{ o:`#14302a`, l:`#7fd6b5`, b:`#35a585`, s:`#25785f`, c:`#f4f7f9`, d:`#c9d2d8`, a:`#e05aa0`, w:`#ffffff`, k:`#14302a` },
    parts:[ { type:`ellipse`, x:10, y:9, rx:4, ry:4, key:`b` }, { type:`ellipse`, x:24, y:9, rx:4, ry:4, key:`b` }, { type:`rect`, x:6, y:19, w:22, h:6, key:`c` }, { type:`rect`, x:16, y:19, w:2, h:6, key:`d` } ],
    marks:[ [ 8, 14, `a` ], [ 27, 14, `a` ] ],
    eyes:{ y:8, gap:7 }, mouth:{ y:15, type:`line`, width:8 },
  },
  glutek: {
    width:30, height:28, body:{ shape:`blob`, x:15, y:16, rx:12, ry:10 }, feet:false,
    palette:{ o:`#3a1842`, l:`#f2aef0`, b:`#d36ad3`, s:`#9c42aa`, w:`#ffffff`, k:`#3a1842` },
    parts:[ { type:`rect`, x:7, y:25, w:2, h:2, key:`s` }, { type:`rect`, x:21, y:25, w:2, h:1, key:`s` } ],
    marks:[ [ 9, 10, `l` ], [ 10, 10, `l` ], [ 9, 11, `l` ] ],
    eyes:{ y:15, gap:5 }, mouth:{ y:20, type:`smile`, width:4 },
  },
  klimax: {
    width:30, height:32, body:{ shape:`round`, x:15, y:19, rx:11, ry:10 },
    palette:{ o:`#2a2410`, h:`#f2f2f2`, g:`#c8c8c8`, l:`#f6e08a`, b:`#e8c43a`, s:`#b8902a`, v:`#9fe8ff`, r:`#2a2410`, w:`#ffffff`, k:`#14302a` },
    parts:[ { type:`ellipse`, x:15, y:10, rx:10, ry:5, key:`h` }, { type:`rect`, x:3, y:13, w:24, h:1, key:`g` }, { type:`rect`, x:6, y:15, w:18, h:5, key:`v` }, { type:`map`, x:13, y:22, rows:[ `.r.r.`, `rr.rr`, `..r..`, `.rrr.` ] } ],
    eyes:{ y:16, gap:4 },
  },
  svebran: {
    width:32, height:31, body:{ shape:`rock`, x:16, y:18, rx:12, ry:10 },
    palette:{ o:`#241a12`, a:`#8a94a8`, l:`#b08a5a`, b:`#8a6a4a`, s:`#5a4230`, m:`#4f8a36`, w:`#ffffff`, k:`#241a12` },
    parts:[ { type:`ellipse`, x:9, y:8, rx:3, ry:2, key:`a` }, { type:`ellipse`, x:16, y:6, rx:3, ry:3, key:`a` }, { type:`ellipse`, x:23, y:8, rx:3, ry:2, key:`a` }, { type:`map`, x:20, y:20, rows:[ `s.`, `.s`, `s.`, `.s` ] } ],
    marks:[ [ 7, 14, `m` ], [ 8, 13, `m` ], [ 24, 25, `m` ], [ 25, 25, `m` ] ],
    eyes:{ y:16, gap:5, style:`grumpy` }, mouth:{ y:23, type:`line`, width:5 },
  },
  kubixii: {
    width:30, height:33, body:{ shape:`round`, x:15, y:21, rx:11, ry:9 },
    palette:{ o:`#102a30`, p:`#f08a3a`, v:`#b07ce8`, q:`#4aa8ff`, l:`#8ae0e8`, b:`#3fb8c8`, s:`#23808c`, w:`#ffffff`, k:`#102a30` },
    parts:[ { type:`ellipse`, x:15, y:5, rx:7, ry:3, key:`p` }, { type:`ellipse`, x:15, y:5, rx:5, ry:1.6, key:`v` }, { type:`ellipse`, x:7, y:24, rx:2, ry:1, key:`q` }, { type:`ellipse`, x:23, y:24, rx:2, ry:1, key:`q` } ],
    eyes:{ y:19, gap:5 }, mouth:{ y:25, type:`o` },
  },
  emajster: {
    width:30, height:33, body:{ shape:`round`, x:15, y:21, rx:11, ry:9 },
    palette:{ o:`#10283a`, g:`#5da234`, y:`#ffe14a`, l:`#9ad0f0`, b:`#5aa0d8`, s:`#3a70a8`, w:`#ffffff`, k:`#10283a` },
    parts:[ { type:`map`, x:12, y:3, rows:[ `gg...gg`, `ggg.ggg`, `.gg.gg.`, `...g...`, `...g...`, `...g...`, `...g...`, `...g...`, `...g...` ] }, { type:`map`, x:18, y:22, rows:[ `..y`, `.yy`, `yyy`, `yy.`, `y..` ] } ],
    eyes:{ y:19, gap:5 }, mouth:{ y:24, type:`smile`, width:4, x:12 },
  },
  mergatic: {
    width:32, height:30, body:{ shape:`round`, x:16, y:16, rx:13, ry:11 },
    palette:{ o:`#3a2c08`, l:`#fff2a8`, b:`#f2d24a`, s:`#c8a42a`, c:`#d8b43a`, w:`#ffffff`, k:`#3a2c08` },
    parts:[ { type:`ellipse`, x:9, y:9, rx:2, ry:1, key:`c` }, { type:`ellipse`, x:23, y:22, rx:2, ry:2, key:`c` }, { type:`ellipse`, x:21, y:8, rx:1, ry:1, key:`c` }, { type:`ellipse`, x:8, y:21, rx:1, ry:1, key:`c` } ],
    eyes:{ y:14, gap:5, style:`grumpy` }, mouth:{ y:21, type:`frown`, width:6 },
  },
  unux: {
    width:34, height:32, body:{ shape:`round`, x:17, y:19, rx:11, ry:10 },
    palette:{ o:`#1a0606`, h:`#2a0a0a`, l:`#c84a3a`, b:`#8a1f1f`, s:`#5a1010`, w:`#ffcc33`, k:`#1a0606`, t:`#ffffff` },
    parts:[
      { type:`map`, x:4, y:2, rows:[ `h.....`, `hh....`, `hh....`, `.hh...`, `.hhh..`, `..hhh.`, `...hhh`, `....hh` ] },
      { type:`map`, x:24, y:2, rows:[ `.....h`, `....hh`, `....hh`, `...hh.`, `..hhh.`, `.hhh..`, `hhh...`, `hh....` ] },
      { type:`map`, x:2, y:22, rows:[ `s...`, `ss..`, `.sss`, `..ss` ] },
    ],
    eyes:{ y:17, gap:5, style:`glow` }, mouth:{ y:23, type:`fangs`, width:6 },
  },
  heartofmoe: {
    width:36, height:33, body:{ shape:`round`, x:15, y:20, rx:9, ry:10 },
    palette:{ o:`#3a3a48`, a:`#f2a6c0`, l:`#ffffff`, b:`#e8ecf4`, s:`#b8bfcc`, n:`#ffffff`, w:`#2a2a3a`, k:`#1a1a2a`, p:`#f05a8a` },
    parts:[
      { type:`map`, x:7, y:4, rows:[ `b....`, `bb...`, `bab..`, `baab.`, `baaab`, `bbbbb` ] },
      { type:`map`, x:19, y:4, rows:[ `....b`, `...bb`, `..bab`, `.baab`, `baaab`, `bbbbb` ] },
      { type:`ellipse`, x:28, y:23, rx:5, ry:4, key:`b` }, { type:`ellipse`, x:32, y:21, rx:2, ry:2, key:`n` },
      { type:`ellipse`, x:18, y:23, rx:4, ry:2, key:`n` }, { type:`map`, x:11, y:26, rows:[ `p.p`, `ppp`, `.p.` ] },
    ],
    marks:[ [ 21, 22, `k` ], [ 22, 22, `k` ] ],
    eyes:{ y:18, gap:4, style:`narrow` },
  },
  selcior: {
    width:30, height:30, body:{ shape:`block`, x:15, y:17, rx:12, ry:9 },
    palette:{ o:`#3a2a08`, l:`#ffe68a`, b:`#f2c94a`, s:`#c09a2a`, w:`#ffffff`, k:`#3a2a08` },
    parts:[ { type:`rect`, x:12, y:4, w:6, h:5, key:`b` }, { type:`rect`, x:12, y:4, w:6, h:1, key:`l` } ],
    marks:[ [ 5, 10, `l` ], [ 24, 10, `l` ], [ 15, 9, `s` ], [ 15, 10, `s` ] ],
    eyes:{ y:15, gap:5, style:`square` }, mouth:{ y:21, type:`line`, width:6 },
  },
  blacky: {
    width:30, height:30, body:{ shape:`blob`, x:15, y:14, rx:11, ry:10 }, feet:false,
    palette:{ o:`#000000`, l:`#3a3a4a`, b:`#1a1a22`, s:`#0e0e14`, w:`#c8f0ff`, k:`#c8f0ff` },
    parts:[ { type:`map`, x:5, y:24, rows:[ `bbbbbbbbbbbbbbbbbbbb`, `bb.bbb.bbb.bbb.bbb.b`, `b...b...b...b....b..` ] } ],
    eyes:{ y:13, gap:5, style:`glow` },
  },
  murshtin: {
    width:32, height:32, body:{ shape:`round`, x:16, y:20, rx:11, ry:9 },
    palette:{ o:`#2a1a24`, r:`#b03a5a`, h:`#8a6a40`, l:`#f0c8a8`, b:`#d89a78`, s:`#a86a50`, y:`#ffe14a`, g:`#4fbf6a`, c:`#4a8aff`, w:`#ffffff`, k:`#2a1a24` },
    parts:[ { type:`ellipse`, x:14, y:10, rx:9, ry:3, key:`r` }, { type:`rect`, x:14, y:5, w:2, h:3, key:`r` }, { type:`map`, x:24, y:12, rows:[ `....yy`, `...yyy`, `..hh..`, `.hh...`, `hh....` ] } ],
    marks:[ [ 9, 24, `y` ], [ 11, 26, `g` ], [ 12, 26, `g` ], [ 20, 25, `c` ], [ 21, 25, `c` ], [ 21, 26, `c` ] ],
    eyes:{ y:18, gap:5 }, mouth:{ y:23, type:`smile`, width:4 },
  },
}

for (const [ name, standIn ] of Object.entries( STAND_INS )) {
  const sprite = drawStandIn( standIn )
  SHEETS[ name ] = { width:standIn.width, height:sprite.rows.length + 1, sprite }
}

function drawStandIn( { width, height, body, palette, parts = [], marks = [], eyes, mouth, feet = true } ) {
  const grid = Array.from({ length:height }, () => new Array( width ).fill( `.` ) )
  const set = (x, y, key) => { if (x >= 0 && y >= 0 && x < width && y < height) grid[ y ][ x ] = key }
  const fill = (left, top, w, h, key) => { for (let y = top; y < top + h; y++) for (let x = left; x < left + w; x++) set( x, y, key ) }
  const { x:centerX, y:centerY, rx, ry } = body

  const isInBody = (x, y) => {
    const dx = (x + 0.5 - centerX) / rx
    const dy = (y + 0.5 - centerY) / ry

    if (body.shape === `block`) return Math.abs( dx ) <= 1 && Math.abs( dy ) <= 1 && !(Math.abs( dx ) > 0.9 && Math.abs( dy ) > 0.85)
    if (body.shape === `blob`) return dy > 0 ? dy <= 1 && Math.abs( dx ) <= 1 - dy * dy * 0.15 : dx * dx + dy * dy <= 1

    const wobble = body.shape === `rock` ? Math.sin( Math.atan2( dy, dx ) * 5 ) * 0.1 : 0
    return dx * dx + dy * dy <= 1 + wobble
  }

  // Feet first, so the body covers their tops
  if (feet) for (const side of [ -1, 1 ]) fill( Math.round( centerX + side * rx * 0.5 ) - 2, Math.round( centerY + ry ) - 1, 4, 3, `s` )

  // The body, lit from the top left and shaded towards the bottom right
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!isInBody( x, y )) continue

    const nx = (x + 0.5 - centerX) / rx
    const ny = (y + 0.5 - centerY) / ry
    set( x, y, nx + ny < -1 ? `l` : nx * 0.4 + ny > 0.7 || nx > 0.85 ? `s` : `b` )
  }

  for (const part of parts) {
    if (part.type === `rect`) fill( part.x, part.y, part.w, part.h, part.key )
    else if (part.type === `map`) part.rows.forEach( (row, y) => [ ...row ].forEach( (key, x) => key !== `.` && set( part.x + x, part.y + y, key ) ) )
    else for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if (((x + 0.5 - part.x) / part.rx) ** 2 + ((y + 0.5 - part.y) / part.ry) ** 2 <= 1) set( x, y, part.key )
    }
  }

  for (const [ x, y, key ] of marks) set( x, y, key )

  // Eyes look right; their whites and pupils turn into the body colour when the character blinks
  if (eyes) for (const side of [ -1, 1 ]) {
    const x = Math.round( (eyes.x ?? centerX) + side * eyes.gap )
    const { y, style = `round` } = eyes

    if (style === `glow`) fill( x - 1, y, 2, 2, `w` )
    else if (style === `narrow`) { fill( x - 1, y, 3, 2, `w` ); fill( x + 1, y, 1, 2, `k` ) }
    else if (style === `square`) { fill( x - 1, y - 1, 3, 3, `w` ); fill( x, y, 2, 2, `k` ) }
    else {
      fill( x - 1, y - 1, 3, 4, `w` )
      fill( x, y, 2, 2, `k` )

      // Grumpy brows slope down towards the middle
      if (style === `grumpy`) for (let index = -2; index <= 1; index++) set( x + index, y - 2 + (Math.sign( index + 0.5 ) === -side ? 1 : 0), `k` )
    }
  }

  if (mouth) {
    const { y, type, width:mouthWidth = 4 } = mouth
    const left = mouth.x ?? Math.round( centerX - mouthWidth / 2 )

    if (type === `o`) fill( left - 1, y, 2, 2, `k` )
    else {
      fill( left, y, mouthWidth, 1, `k` )
      if (type === `smile`) { set( left - 1, y - 1, `k` ); set( left + mouthWidth, y - 1, `k` ) }
      if (type === `frown`) { set( left - 1, y + 1, `k` ); set( left + mouthWidth, y + 1, `k` ) }
      if (type === `fangs`) { set( left + 1, y + 1, `t` ); set( left + mouthWidth - 2, y + 1, `t` ) }
    }
  }

  // A one pixel outline around everything, like the real sprites
  const isFilled = (x, y) => grid[ y ]?.[ x ] !== undefined && grid[ y ][ x ] !== `.`
  const outline = []

  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!isFilled( x, y ) && (isFilled( x - 1, y ) || isFilled( x + 1, y ) || isFilled( x, y - 1 ) || isFilled( x, y + 1 ))) outline.push( [ x, y ] )
  }

  for (const [ x, y ] of outline) set( x, y, `o` )

  return { rows:grid.map( row => row.join( `` ) ), palette }
}

// Small things standing on the ground of a biome, in the worlds and in the footer, and a few hanging in the sky
const PROPS = {
  // Evolveye: the sky, with souls, floating islets and the ruins of a cloud temple
  moon: { rows:[ `..mmmm..`, `.mmmmsm.`, `mmmmmmmm`, `mmsmmmmm`, `mmmmmmsm`, `mmmmmmmm`, `.mmsmmm.`, `..mmmm..` ], palette:{ m:`#f3efd8`, s:`#cfc8a8` } },
  islet: { rows:[ `..gggggg....`, `.gggggggggg.`, `dddddddddddd`, `.dddsddddsd.`, `..dddddddd..`, `...dddddd...`, `.....dd.....` ], palette:{ g:`#4f7fb0`, d:`#2e2b52`, s:`#4a457c` } },
  wisp: { rows:[ `..w..`, `.wvw.`, `.wvw.`, `wvvvw`, `.www.` ], palette:{ w:`#7aa6f0`, v:`#e8f2ff` } },
  column: { rows:[ `.cc..`, `ccccc`, `.cdc.`, `.cdc.`, `.cdc.`, `.cdc.`, `.cdc.`, `ccccc` ], palette:{ c:`#5a5590`, d:`#3e3a6e` } },
  brokenColumn: { rows:[ `..c..`, `.cdc.`, `.cdc.`, `ccccc` ], palette:{ c:`#5a5590`, d:`#3e3a6e` } },
  cloudlet: { rows:[ `...ccc....`, `..cccccc..`, `.ccccccccc`, `cccccccccc` ], palette:{ c:`#4a457c` } },

  // Ranfisz: the desert and its plants
  barrel: { rows:[ `.pyp.`, `.ooo.`, `olggo`, `olggo`, `olggo`, `.ooo.` ], palette:{ o:`#1d3a12`, g:`#3f7d24`, l:`#5da234`, p:`#f08cb4`, y:`#ffe08a` } },
  agave: { rows:[ `l...l...l`, `.g..g..g.`, `.gl.g.lg.`, `..glglg..`, `.ggggggg.` ], palette:{ g:`#3f7d24`, l:`#69a948` } },
  pot: { rows:[ `.l.l.l.`, `l.lll.l`, `.l.g.l.`, `...g...`, `.ppppp.`, `.pqqqp.`, `..ppp..` ], palette:{ l:`#69a948`, g:`#3f7d24`, p:`#b5623a`, q:`#8a4527` } },
  skull: { rows:[ `h.......h`, `hh.bbb.hh`, `.hbbbbbh.`, `..bkbkb..`, `..bbbbb..`, `...bbb...` ], palette:{ h:`#b8ad94`, b:`#d8cfb8`, k:`#2a1f17` } },
  rock: { rows:[ `..rrr...`, `.rrlrrr.`, `rrrrrrsr`, `srrrrsrr` ], palette:{ r:`#6b4f3a`, l:`#8a6a4a`, s:`#4a3628` } },
  tumbleweed: { rows:[ `.t.tt.`, `t.tt.t`, `.tt.tt`, `t.t.t.`, `.tt.t.` ], palette:{ t:`#8a6a40` } },
  saguaro: { rows:[ `...g...`, `..ggg..`, `..ggg.g`, `g.ggg.g`, `g.ggggg`, `ggggg..`, `..ggg..`, `..ggg..`, `..ggg..`, `..ggg..` ], palette:{ g:`#2f5a24` } },
  desertMoon: { rows:[ `..mmmm..`, `.mmmmsm.`, `mmmmmmmm`, `mmsmmmmm`, `mmmmmmsm`, `mmmmmmmm`, `.mmsmmm.`, `..mmmm..` ], palette:{ m:`#f6d9a0`, s:`#d9b070` } },

  // Tomangelo: mountains, pines and iron
  pine: { rows:[ `...w...`, `..wdw..`, `..ddd..`, `.wdddw.`, `.ddddd.`, `wdddddw`, `ddddddd`, `...b...`, `...b...` ], palette:{ d:`#1f3a2c`, w:`#c9d3ea`, b:`#3a2a22` } },
  ore: { rows:[ `...ooo...`, `..osssoo.`, `.osrsssso`, `ossssrsso`, `osrssssso`, `ooooooooo` ], palette:{ o:`#1c2028`, s:`#56616f`, r:`#cf7638` } },
  mine: { rows:[ `....ssssss....`, `..ssssssssss..`, `.sswwwwwwwwss.`, `.sswkkkkkkwss.`, `ssswkkkkkkwsss`, `ssswkkkkkkwsss`, `ssswkkkkkkwsss`, `ssswkkkkkkwsss`, `ssswrkkkkrwsss`, `ssswrrrrrrwsss` ], palette:{ s:`#3a4560`, w:`#6b4a2a`, k:`#07090f`, r:`#8a94a8` } },
  cart: { rows:[ `...rr.r..`, `.orrrrro.`, `.mmmmmmm.`, `.mdmmmdm.`, `..mmmmm..`, `..k...k..` ], palette:{ r:`#cf7638`, o:`#8a4a22`, m:`#56616f`, d:`#2a3040`, k:`#0e1016` } },
  anvil: { rows:[ `llllllll`, `.mmmmmm.`, `...mm...`, `..mmmm..`, `.mmmmmm.` ], palette:{ l:`#8a94a8`, m:`#3a4150` } },
  crescent: { rows:[ `..mmm.`, `.mm...`, `mm....`, `mm....`, `mm....`, `.mm...`, `..mmm.` ], palette:{ m:`#dfe6f5` } },

  // Mechutea: moss, ferns, mushrooms and purple flowers, with fireflies above
  flowers: { rows:[ `.p...p...`, `pyp.pyp..`, `.p...p.p.`, `.g.g.gpyp`, `.gg.gg.p.`, `gggggggg.` ], palette:{ p:`#a46ad8`, y:`#f2d6ff`, g:`#4f8a36` } },
  mossRock: { rows:[ `..mmmm..`, `.mmpmmm.`, `mmssmmmm`, `osssssso`, `.oooooo.` ], palette:{ m:`#4f8a36`, p:`#a46ad8`, s:`#4a4a3a`, o:`#24331c` } },
  mushroom: { rows:[ `..ppp..`, `.ppwpp.`, `ppppppp`, `...s...`, `...s...`, `..sss..` ], palette:{ p:`#8a4fc4`, w:`#f2d6ff`, s:`#d8cfb8` } },
  fern: { rows:[ `f.....f`, `.f.f.f.`, `..fff..`, `f.fff.f`, `.fffff.`, `...f...` ], palette:{ f:`#4f8a36` } },
  log: { rows:[ `.mmmmmmmmm..`, `bbbbbbbbbbrr`, `bbbbbbbbbrwr`, `bbbbbbbbbbrr` ], palette:{ m:`#5f9e3a`, b:`#4a3424`, r:`#8a6a40`, w:`#b08a5a` } },
  firefly: { rows:[ `.y.`, `ywy`, `.y.` ], palette:{ y:`#c8e86a`, w:`#ffffcc` } },

  // Pooshek: a laboratory on the mesa
  lab: { rows:[ `.....r......`, `.....o......`, `...oooooo...`, `..owwwwwwo..`, `.oooooooooo.`, `.owwwwwwwwo.`, `.owggwwggwo.`, `.owggwwggwo.`, `.owwwoowwwo.`, `.owwwoowwwo.`, `oooooooooooo` ], palette:{ o:`#14302a`, w:`#5d6f79`, g:`#7ee08a`, r:`#e05aa0` } },
  flask: { rows:FLASK_ROWS, palette:{ o:`#14302a`, w:`#9fb4c0`, a:`#7ee08a` } },
  beaker: { rows:[ `o...o`, `o...o`, `oaaao`, `oaaao`, `ooooo` ], palette:{ o:`#14302a`, a:`#e05aa0` } },
  antenna: { rows:[ `...r...`, `...m...`, `..mmm..`, `...m...`, `..m.m..`, `..mmm..`, `..m.m..`, `.m.m.m.`, `.mmmmm.`, `.m...m.`, `m.m.m.m`, `mmmmmmm`, `m.....m` ], palette:{ m:`#5d6f79`, r:`#e05aa0` } },
  gooBarrel: { rows:[ `.ggg.`, `ooooo`, `oyyyo`, `ooooo`, `oyyyo`, `ooooo` ], palette:{ o:`#2a3a34`, y:`#7ee08a`, g:`#b6f5c0` } },
  coil: { rows:[ `.ccc.`, `ccccc`, `.ccc.`, `..m..`, `.mmm.`, `..m..`, `.mmm.`, `..m..`, `mmmmm` ], palette:{ c:`#9fe8ff`, m:`#5d6f79` } },
  spark: { rows:[ `.c.`, `ccc`, `.c.` ], palette:{ c:`#9fe8ff` } },

  // Somka: slime everywhere, and bubbles rising from it
  slime: { rows:[ `...l.....`, `..l.l....`, `...l..l..`, `.........`, `..ssss...`, `.sllsss..`, `sssssssss` ], palette:{ s:`#9c42aa`, l:`#f2aef0` } },
  gooJar: { rows:[ `.ooo.`, `.o.o.`, `o...o`, `ogglo`, `ogggo`, `.ooo.` ], palette:{ o:`#c9b8e0`, g:`#9c42aa`, l:`#f2aef0` } },
  slimePillar: { rows:[ `..s..`, `..s..`, `.sss.`, `.sls.`, `sssss`, `sslss` ], palette:{ s:`#9c42aa`, l:`#f2aef0` } },
  blob: { rows:[ `..sss..`, `.sllss.`, `sssssss` ], palette:{ s:`#7a2f88`, l:`#c88ad8` } },
  bubble: { rows:[ `.ll.`, `l.wl`, `l..l`, `.ll.` ], palette:{ l:`#e07aee`, w:`#ffffff` } },

  // Klimax: a nuclear plant next to Pooshek's mesa
  coolingTower: { rows:[ `.cccccc.`, `..cccc..`, `..cccc..`, `..cccc..`, `.cccccc.`, `cccccccc`, `cccccccc` ], palette:{ c:`#6f7680` } },
  steam: { rows:[ `.ss.`, `s..s`, `.ss.` ], palette:{ s:`#9aa2ac` } },
  wasteBarrel: { rows:[ `.yyy.`, `ykkky`, `yykyy`, `ykkky`, `.yyy.` ], palette:{ y:`#e8c43a`, k:`#2a2410` } },
  pylon: { rows:[ `..m..`, `mmmmm`, `..m..`, `.m.m.`, `.mmm.`, `m...m`, `m...m` ], palette:{ m:`#5d6f79` } },

  // Svebran: mountains made of earth and stone
  stonePillar: { rows:[ `.ss.`, `ssss`, `slss`, `ssss`, `sssl`, `ssss`, `slss` ], palette:{ s:`#6b5a48`, l:`#8a7a62` } },
  boulder: { rows:[ `..bbbb..`, `.blbbbb.`, `bbbbbbsb`, `bbbbbsbb`, `sbbbbbbs` ], palette:{ b:`#7a6a58`, l:`#a08a70`, s:`#4a3c30` } },

  // Kubixii: portals and cubes that fell through them
  portal: { rows:[ `..pppp..`, `.p....p.`, `p..vv..p`, `p.vvvv.p`, `p.vvvv.p`, `p..vv..p`, `.p....p.`, `..pppp..` ], palette:{ p:`#f08a3a`, v:`#b07ce8` } },
  cube: { rows:[ `ccc`, `cdc`, `ccc` ], palette:{ c:`#4aa8ff`, d:`#1d4a8a` } },

  // EMajster: plains, an aquarium and a little electricity
  aquarium: { rows:[ `gggggggg`, `gwwwwwwg`, `gwfwwpwg`, `gwwwwpwg`, `gwwfwpwg`, `gssssssg`, `kkkkkkkk`, `.k....k.` ], palette:{ g:`#9fd0e8`, w:`#2a5a8a`, f:`#f08a3a`, p:`#5da234`, s:`#d8c48e`, k:`#3a3028` } },
  powerPole: { rows:[ `mmmmmmm`, `m..m..m`, `...m...`, `...m...`, `...m...`, `...m...`, `...m...`, `...m...` ], palette:{ m:`#6b4a2a` } },
  tallGrass: { rows:[ `.g..g.`, `.g.gg.`, `gggggg` ], palette:{ g:`#4f8a36` } },
  bolt: { rows:[ `..y`, `.y.`, `yyy`, `.y.`, `y..` ], palette:{ y:`#ffe14a` } },

  // Mergatic: a grey moonscape with art worth looking at
  artFrame: { rows:[ `ffffffff`, `fabbcaaf`, `fabcccaf`, `faabbaaf`, `ffffffff`, `..f..f..`, `.f....f.` ], palette:{ f:`#c8a24a`, a:`#2a3a6a`, b:`#e05a5a`, c:`#ffe14a` } },
  statue: { rows:[ `.ss.`, `ssss`, `.ss.`, `.ss.`, `ssss`, `pppp` ], palette:{ s:`#c9cfe0`, p:`#6f7680` } },

  // Unux: a red, burning land
  lavaPool: { rows:[ `..llll...`, `.lyyyyll.`, `lllllllll` ], palette:{ l:`#e0502a`, y:`#ffcc33` } },
  flame: { rows:[ `..f..`, `.fyf.`, `fyyyf`, `.fyf.` ], palette:{ f:`#e0502a`, y:`#ffcc33` } },
  spike: { rows:[ `..s..`, `..s..`, `.sss.`, `.sss.`, `sssss` ], palette:{ s:`#3a1414` } },
  ember: { rows:[ `.e.`, `eye`, `.e.` ], palette:{ e:`#e0502a`, y:`#ffcc33` } },

  // Heartofmoe: a snowy birch forest
  birch: { rows:[ `.ggg.`, `ggggg`, `ggggg`, `.ggg.`, `..w..`, `..k..`, `..w..`, `..w..` ], palette:{ g:`#b8c8d8`, w:`#f4f4f4`, k:`#2a2a2a` } },
  heartFlower: { rows:[ `p.p`, `ppp`, `.p.`, `.g.` ], palette:{ p:`#f05a8a`, g:`#4f8a36` } },
  snowflake: { rows:[ `.w.`, `www`, `.w.` ], palette:{ w:`#ffffff` } },

  // Selcior: everything built of blocks
  crate: { rows:[ `oooooo`, `oyyyyo`, `oyooyo`, `oyyyyo`, `oooooo` ], palette:{ o:`#8a6a1a`, y:`#f2c94a` } },
  blockTower: { rows:[ `bbbb`, `bkkb`, `bbbb`, `bkkb`, `bbbb`, `bkkb`, `bbbb` ], palette:{ b:`#c09a2a`, k:`#ffe68a` } },
  stairs: { rows:[ `.....bb`, `...bbbb`, `.bbbbbb`, `bbbbbbb` ], palette:{ b:`#6f7680` } },

  // Blacky: darkness, dead trees and eyes in it
  deadTree: { rows:[ `t...t.t`, `.t.t.t.`, `..ttt..`, `...t...`, `...t...`, `..ttt..` ], palette:{ t:`#2a2a38` } },
  shadowWisp: { rows:[ `.s.`, `sss`, `.s.` ], palette:{ s:`#3a3a5a` } },
  eyesInDark: { rows:[ `w...w` ], palette:{ w:`#c8f0ff` } },

  // Murshtin: walls to paint on and hide behind
  wall: { rows:[ `bbbmbbbmbbbm`, `mmmmmmmmmmmm`, `bmbbbmbbbmbb`, `mmmmmmmmmmmm`, `bbbmbbbmbbbm`, `mmmmmmmmmmmm`, `bmbbbmbbbmbb` ], palette:{ b:`#8a3a2a`, m:`#5a2a20` } },
  mural: { rows:[ `bbbmbbbmbbbm`, `mmmmmmmmmmmm`, `bmyybmbbcbbb`, `mmyymmmcccmm`, `bbbmbgggbbbm`, `mmmmmmgmmmmm`, `bmbbbmbbbmbb` ], palette:{ b:`#8a3a2a`, m:`#5a2a20`, y:`#ffe14a`, c:`#4a8aff`, g:`#4fbf6a` } },
  easel: { rows:[ `.ffff.`, `.fabf.`, `.fbaf.`, `.ffff.`, `.f..f.`, `f....f` ], palette:{ f:`#8a6a40`, a:`#b03a5a`, b:`#4fbf6a` } },
  splat: { rows:[ `.c..c`, `ccc.c`, `.cccc`, `c.cc.`, `..c..` ], palette:{ c:`#ffe14a` } },
  bird: { rows:[ `m...m`, `.m.m.`, `..m..` ], palette:{ m:`#0c0c14` } },
  paintCan: { rows:[ `.kk.`, `cccc`, `cyyc`, `cccc` ], palette:{ c:`#4a8aff`, y:`#ffe14a`, k:`#2a2a2a` } },
}

/**
 * Props in a world: [ name, x ] stands on the ground; options can hang it in the sky ({ y }), make it twinkle, draw it
 * bigger ({ scale }), put it far away behind the near hills ({ back }) or give it other colours ({ palette })
 */
const props = (...entries) => entries.map( ([ name, x, options = {} ]) => ({ x, ...PROPS[ name ], ...options }) )

// Far away things are darker and lose their details into the night
const far = (name, base, amount = 0.55) => Object.fromEntries( Object.entries( PROPS[ name ].palette ).map( ([ key, color ]) => [ key, mix( color, base, amount ) ] ) )

/**
 * Every character's world at night. `base` is the colour of its sky (and of the page while it is selected), `glow` its light.
 * `ground` is how its ground looks in the footer: rim, top layer, soil, deep soil, specks, and which props stand on it
 */
const NIGHT = {
  evolveye: {
    base: `#16152c`, glow: `#5b8ff0`,
    terrain: `puffs`,
    driftingClouds: 7,
    colors: { farHills:`#24213f`, nearHills:`#2e2b52`, nearRim:`#4a457c`, ground:`#2e2b52`, groundRim:`#4a457c`, pebble:`#3a3768`, cloud:`#2a2747`, cloudShade:`#221f3c` },
    props: props(
      [ `moon`, 0.13, { y:0.06, scale:3 } ], [ `islet`, 0.22, { y:0.3, scale:2 } ], [ `islet`, 0.86, { y:0.12, scale:2 } ], [ `column`, 0.33, { back:true, scale:3, palette:far( `column`, `#16152c` ) } ], [ `column`, 0.7, { back:true, scale:2, palette:far( `column`, `#16152c` ) } ],
      [ `islet`, 0.06, { y:0.52 } ],
      [ `wisp`, 0.2, { y:0.42, twinkle:true } ], [ `wisp`, 0.42, { y:0.12, twinkle:true } ], [ `wisp`, 0.7, { y:0.3, twinkle:true } ], [ `wisp`, 0.94, { y:0.16, twinkle:true } ], [ `wisp`, 0.55, { y:0.68, twinkle:true } ],
      [ `column`, 0.08 ], [ `brokenColumn`, 0.11 ], [ `cloudlet`, 0.24 ], [ `column`, 0.46 ], [ `cloudlet`, 0.62 ], [ `brokenColumn`, 0.78 ], [ `column`, 0.92 ],
    ),
    characters: [
      { sheet:`evolveye`, startX:0.06, isFloating:true, altitude:0.62, walkRange:[ 0.02, 0.3 ], speed:3 },
      { sheet:`evolveye`, startX:0.84, isFloating:true, altitude:0.7, walkRange:[ 0.66, 0.96 ], speed:4, phase:2 },
      { sheet:`evolveye`, startX:0.9, isFloating:true, altitude:0.25, phase:4 },
      { sheet:`evolveye`, startX:0.6, isFloating:true, altitude:0.12, walkRange:[ 0.02, 0.98 ], speed:6, phase:1 },
    ],
    ground: { rim:`#4a457c`, top:`#34315a`, soil:`#24213f`, deep:`#1a1830`, speck:`#fff4c8`, props:[ `cloudlet`, `column`, `cloudlet`, `brokenColumn` ] },
  },
  ranfisz: {
    base: `#211819`, glow: `#f0a64a`,
    terrain: `dunes`,
    colors: { farHills:`#3a2b2a`, nearHills:`#4a3630`, ground:`#4a3630`, groundRim:`#7a5a40`, pebble:`#5a4234` },
    cacti: [ { x:0.03, size:2 }, { x:0.1, size:0 }, { x:0.36, size:1 }, { x:0.66, size:0 }, { x:0.86, size:1 }, { x:0.97, size:2 } ],
    props: props(
      [ `desertMoon`, 0.86, { y:0.16, scale:3 } ], [ `saguaro`, 0.12, { back:true, scale:4, palette:far( `saguaro`, `#211819`, 0.5 ) } ], [ `saguaro`, 0.31, { back:true, scale:3, palette:far( `saguaro`, `#211819`, 0.6 ) } ], [ `saguaro`, 0.74, { back:true, scale:5, palette:far( `saguaro`, `#211819`, 0.45 ) } ],
      [ `pot`, 0.06 ], [ `barrel`, 0.15 ], [ `skull`, 0.19 ], [ `agave`, 0.25 ], [ `rock`, 0.31 ], [ `pot`, 0.41 ], [ `tumbleweed`, 0.48 ],
      [ `barrel`, 0.56 ], [ `rock`, 0.61 ], [ `agave`, 0.7 ], [ `pot`, 0.76 ], [ `skull`, 0.8 ], [ `barrel`, 0.91 ],
    ),
    characters: [
      { sheet:`ranfisz`, startX:0.15, walkRange:[ 0, 1 ] },
      { sheet:`ranfisz`, startX:0.86, walkRange:[ 0, 1 ], phase:2.5 },
      { sheet:`ranfisz`, startX:0.7, walkRange:[ 0, 1 ], phase:4, speed:12 },
    ],
    ground: { rim:`#9a7650`, top:`#6b4f33`, soil:`#3f2e22`, deep:`#2a1f17`, speck:`#5a4230`, props:[ `cactus`, `barrel`, `pot`, `agave`, `skull`, `rock` ] },
  },
  goral: {
    base: `#141a25`, glow: `#a9bdd8`,
    terrain: `peaks`,
    colors: { farHills:`#262d42`, nearHills:`#1b2131`, snow:`#c9d3ea`, ground:`#1b2131`, groundRim:`#3a4560`, pebble:`#cf7638` },
    props: props(
      [ `crescent`, 0.9, { y:0.16, scale:3 } ], [ `mine`, 0.36, { back:true, scale:3, palette:far( `mine`, `#141a25`, 0.4 ) } ], [ `pine`, 0.2, { back:true, scale:3, palette:far( `pine`, `#141a25` ) } ], [ `pine`, 0.24, { back:true, scale:2, palette:far( `pine`, `#141a25` ) } ], [ `pine`, 0.64, { back:true, scale:3, palette:far( `pine`, `#141a25` ) } ], [ `pine`, 0.69, { back:true, scale:4, palette:far( `pine`, `#141a25` ) } ],
      [ `pine`, 0.02 ], [ `pine`, 0.05 ], [ `mine`, 0.09 ], [ `cart`, 0.15 ], [ `ore`, 0.21 ], [ `pine`, 0.28 ], [ `anvil`, 0.34 ], [ `pine`, 0.4 ],
      [ `ore`, 0.5 ], [ `pine`, 0.58 ], [ `cart`, 0.66 ], [ `ore`, 0.74 ], [ `mine`, 0.8 ], [ `pine`, 0.88 ], [ `pine`, 0.91 ], [ `pine`, 0.96 ],
    ),
    characters: [ { sheet:`goral`, startX:0.14, walkRange:[ 0, 1 ], speed:5 }, { sheet:`goral`, startX:0.82, walkRange:[ 0, 1 ], speed:4, phase:2 } ],
    ground: { rim:`#c9d3ea`, top:`#6f7d8e`, soil:`#353c4c`, deep:`#232834`, speck:`#cf7638`, props:[ `pine`, `ore`, `pine`, `cart`, `anvil` ] },
  },
  mszak: {
    base: `#151b1a`, glow: `#b07ce8`,
    terrain: `puffs`,
    colors: { farHills:`#1d2b22`, nearHills:`#18241c`, nearRim:`#2f5a2a`, ground:`#18241c`, groundRim:`#3f6b38`, pebble:`#a46ad8` },
    props: props(
      [ `mushroom`, 0.14, { back:true, scale:5, palette:far( `mushroom`, `#151b1a`, 0.45 ) } ], [ `mushroom`, 0.24, { back:true, scale:3, palette:far( `mushroom`, `#151b1a`, 0.55 ) } ], [ `mushroom`, 0.78, { back:true, scale:4, palette:far( `mushroom`, `#151b1a`, 0.5 ) } ], [ `fern`, 0.55, { back:true, scale:4, palette:far( `fern`, `#151b1a` ) } ],
      [ `firefly`, 0.08, { y:0.5, twinkle:true } ], [ `firefly`, 0.18, { y:0.7, twinkle:true } ], [ `firefly`, 0.33, { y:0.3, twinkle:true } ], [ `firefly`, 0.47, { y:0.78, twinkle:true } ], [ `firefly`, 0.62, { y:0.62, twinkle:true } ],
      [ `firefly`, 0.74, { y:0.42, twinkle:true } ], [ `firefly`, 0.88, { y:0.7, twinkle:true } ], [ `firefly`, 0.95, { y:0.24, twinkle:true } ], [ `firefly`, 0.26, { y:0.86, twinkle:true } ],
      [ `flowers`, 0.03 ], [ `mushroom`, 0.09 ], [ `fern`, 0.12 ], [ `mossRock`, 0.17 ], [ `log`, 0.23 ], [ `flowers`, 0.3 ], [ `mushroom`, 0.36 ], [ `fern`, 0.43 ],
      [ `flowers`, 0.52 ], [ `log`, 0.6 ], [ `mushroom`, 0.67 ], [ `flowers`, 0.71 ], [ `fern`, 0.77 ], [ `mossRock`, 0.82 ], [ `mushroom`, 0.88 ], [ `flowers`, 0.93 ],
    ),
    characters: [ { sheet:`mszak`, startX:0.1, walkRange:[ 0, 1 ], speed:3 }, { sheet:`mszak`, startX:0.38, walkRange:[ 0, 1 ], speed:4, phase:1.5 }, { sheet:`mszak`, startX:0.86, walkRange:[ 0, 1 ], speed:3, phase:3 } ],
    ground: { rim:`#5f9e3a`, top:`#36621e`, soil:`#2a281c`, deep:`#1b1a12`, speck:`#a46ad8`, props:[ `flowers`, `mushroom`, `mossRock`, `fern`, `flowers`, `log` ] },
  },
  zabek: {
    base: `#22161a`, glow: `#6fdba0`,
    terrain: `mesa`,
    colors: { farHills:`#3a2228`, farBands:[ `#3a2228`, `#45282c`, `#321c22`, `#4d2e2e` ], nearHills:`#2a1a1f`, ground:`#2a1a1f`, groundRim:`#5a3028`, pebble:`#3a2026` },
    props: props(
      [ `antenna`, 0.33, { back:true, scale:4, palette:far( `antenna`, `#22161a`, 0.4 ) } ], [ `lab`, 0.12, { back:true, scale:3, palette:far( `lab`, `#22161a`, 0.45 ) } ], [ `coil`, 0.76, { back:true, scale:4, palette:far( `coil`, `#22161a`, 0.45 ) } ],
      [ `spark`, 0.27, { y:0.5, twinkle:true } ], [ `spark`, 0.7, { y:0.6, twinkle:true } ], [ `spark`, 0.9, { y:0.3, twinkle:true } ],
      [ `antenna`, 0.02 ], [ `lab`, 0.06 ], [ `flask`, 0.15 ], [ `beaker`, 0.18 ], [ `gooBarrel`, 0.22 ], [ `coil`, 0.28 ], [ `gooBarrel`, 0.38 ], [ `flask`, 0.44 ],
      [ `beaker`, 0.55 ], [ `coil`, 0.62 ], [ `gooBarrel`, 0.68 ], [ `flask`, 0.76 ], [ `lab`, 0.82 ], [ `antenna`, 0.92 ], [ `beaker`, 0.96 ],
    ),
    characters: [ { sheet:`zabek`, startX:0.26, walkRange:[ 0, 1 ], speed:7 }, { sheet:`zabek`, startX:0.72, walkRange:[ 0, 1 ], speed:5, phase:2 } ],
    ground: { rim:`#c9704a`, top:`#8a4a32`, soil:`#4a2620`, deep:`#311814`, speck:`#7ee08a`, bands:[ `#4a2620`, `#5a2f24`, `#3d1f1a` ], props:[ `lab`, `flask`, `gooBarrel`, `beaker`, `coil`, `antenna` ] },
  },
  glutek: {
    base: `#1f1428`, glow: `#e07aee`,
    terrain: `puffs`,
    colors: { farHills:`#2c1c3a`, nearHills:`#22162e`, nearRim:`#4a2a5c`, ground:`#22162e`, groundRim:`#6a3a7c`, pebble:`#c88ad8` },
    props: props(
      [ `slimePillar`, 0.18, { back:true, scale:5, palette:far( `slimePillar`, `#1f1428`, 0.45 ) } ], [ `slimePillar`, 0.3, { back:true, scale:3, palette:far( `slimePillar`, `#1f1428`, 0.55 ) } ], [ `slimePillar`, 0.74, { back:true, scale:4, palette:far( `slimePillar`, `#1f1428`, 0.5 ) } ], [ `bubble`, 0.5, { y:0.1, scale:3, twinkle:true } ], [ `bubble`, 0.84, { y:0.36, scale:2, twinkle:true } ],
      [ `bubble`, 0.1, { y:0.36, twinkle:true } ], [ `bubble`, 0.24, { y:0.6, twinkle:true } ], [ `bubble`, 0.4, { y:0.2, twinkle:true } ], [ `bubble`, 0.58, { y:0.74, twinkle:true } ], [ `bubble`, 0.76, { y:0.5, twinkle:true } ], [ `bubble`, 0.92, { y:0.28, twinkle:true } ],
      [ `slime`, 0.04 ], [ `slimePillar`, 0.1 ], [ `blob`, 0.15 ], [ `gooJar`, 0.2 ], [ `slime`, 0.27 ], [ `slimePillar`, 0.34 ], [ `blob`, 0.42 ],
      [ `slime`, 0.5 ], [ `gooJar`, 0.58 ], [ `blob`, 0.64 ], [ `slime`, 0.72 ], [ `slimePillar`, 0.8 ], [ `gooJar`, 0.86 ], [ `slime`, 0.92 ],
    ),
    characters: [ { sheet:`glutek`, startX:0.14, walkRange:[ 0, 1 ], speed:4 }, { sheet:`glutek`, startX:0.4, walkRange:[ 0, 1 ], speed:3, phase:1 }, { sheet:`glutek`, startX:0.8, walkRange:[ 0, 1 ], speed:5, phase:2.5 } ],
    ground: { rim:`#e07aee`, top:`#9c42aa`, soil:`#41204a`, deep:`#2a1430`, speck:`#f2aef0`, props:[ `slime`, `gooJar`, `slimePillar`, `blob` ] },
  },
  klimax: {
    base: `#141c14`, glow: `#c8f04a`,
    terrain: `mesa`,
    colors: { farHills:`#1f2a1c`, farBands:[ `#1f2a1c`, `#24301f`, `#1a2418`, `#2a3424` ], nearHills:`#161f14`, ground:`#161f14`, groundRim:`#3f5a2a`, pebble:`#c8f04a` },
    props: props(
      [ `coolingTower`, 0.26, { back:true, scale:6, palette:far( `coolingTower`, `#141c14`, 0.35 ) } ], [ `coolingTower`, 0.36, { back:true, scale:4, palette:far( `coolingTower`, `#141c14`, 0.5 ) } ],
      [ `steam`, 0.28, { y:0.3, scale:3, twinkle:true } ], [ `steam`, 0.37, { y:0.45, scale:2, twinkle:true } ], [ `pylon`, 0.8, { back:true, scale:5, palette:far( `pylon`, `#141c14`, 0.45 ) } ],
      [ `wasteBarrel`, 0.05 ], [ `pylon`, 0.12 ], [ `wasteBarrel`, 0.18 ], [ `lab`, 0.46 ], [ `wasteBarrel`, 0.55 ], [ `flask`, 0.6 ], [ `pylon`, 0.7 ], [ `wasteBarrel`, 0.88 ], [ `wasteBarrel`, 0.9 ],
    ),
    characters: [ { sheet:`klimax`, startX:0.2, walkRange:[ 0, 1 ], speed:5 }, { sheet:`zabek`, startX:0.6, walkRange:[ 0, 1 ], speed:6, phase:2 }, { sheet:`klimax`, startX:0.85, walkRange:[ 0, 1 ], speed:4, phase:3 } ],
    ground: { rim:`#8ab83a`, top:`#4a6a2a`, soil:`#2a3420`, deep:`#1a2214`, speck:`#c8f04a`, props:[ `wasteBarrel`, `pylon`, `wasteBarrel`, `flask` ] },
  },
  svebran: {
    base: `#18161c`, glow: `#c9a27a`,
    terrain: `peaks`,
    colors: { farHills:`#2a2630`, nearHills:`#201c24`, snow:`#b8a890`, ground:`#201c24`, groundRim:`#6b5a48`, pebble:`#8a7a62` },
    props: props(
      [ `crescent`, 0.12, { y:0.14, scale:3 } ], [ `stonePillar`, 0.3, { back:true, scale:6, palette:far( `stonePillar`, `#18161c`, 0.4 ) } ], [ `stonePillar`, 0.36, { back:true, scale:4, palette:far( `stonePillar`, `#18161c`, 0.5 ) } ], [ `stonePillar`, 0.78, { back:true, scale:7, palette:far( `stonePillar`, `#18161c`, 0.35 ) } ],
      [ `boulder`, 0.04 ], [ `pine`, 0.1 ], [ `stonePillar`, 0.16 ], [ `boulder`, 0.22 ], [ `rock`, 0.42 ], [ `pine`, 0.5 ], [ `boulder`, 0.58 ], [ `stonePillar`, 0.66 ], [ `pine`, 0.86 ], [ `boulder`, 0.94 ],
    ),
    characters: [ { sheet:`svebran`, startX:0.2, walkRange:[ 0, 1 ], speed:4 }, { sheet:`goral`, startX:0.55, walkRange:[ 0, 1 ], speed:5, phase:2 }, { sheet:`svebran`, startX:0.85, walkRange:[ 0, 1 ], speed:3, phase:1 } ],
    ground: { rim:`#a08a70`, top:`#6b5a48`, soil:`#3a3028`, deep:`#241e18`, speck:`#8a94a8`, props:[ `boulder`, `stonePillar`, `pine`, `rock` ] },
  },
  kubixii: {
    base: `#120f24`, glow: `#b07ce8`,
    terrain: `puffs`,
    colors: { farHills:`#1d1838`, nearHills:`#171330`, nearRim:`#3a2f6a`, ground:`#171330`, groundRim:`#4aa8ff`, pebble:`#f08a3a` },
    props: props(
      [ `portal`, 0.2, { y:0.18, scale:3 } ], [ `portal`, 0.82, { y:0.3, scale:3, palette:{ p:`#4aa8ff`, v:`#b07ce8` } } ], [ `portal`, 0.5, { back:true, scale:5, palette:far( `portal`, `#120f24`, 0.4 ) } ],
      [ `cube`, 0.3, { y:0.36, twinkle:true } ], [ `cube`, 0.42, { y:0.6, scale:2 } ], [ `cube`, 0.7, { y:0.5, twinkle:true } ], [ `cube`, 0.92, { y:0.66, scale:2 } ], [ `cube`, 0.1, { y:0.58, twinkle:true } ],
      [ `portal`, 0.08 ], [ `cube`, 0.16 ], [ `cube`, 0.18 ], [ `portal`, 0.4, { palette:{ p:`#4aa8ff`, v:`#b07ce8` } } ], [ `cube`, 0.62 ], [ `portal`, 0.74 ], [ `cube`, 0.9 ],
    ),
    characters: [ { sheet:`kubixii`, startX:0.25, walkRange:[ 0, 1 ], speed:6 }, { sheet:`kubixii`, startX:0.75, walkRange:[ 0, 1 ], speed:5, phase:2 } ],
    ground: { rim:`#6a5ac8`, top:`#3a2f6a`, soil:`#221c40`, deep:`#16122c`, speck:`#f08a3a`, props:[ `portal`, `cube`, `cube` ] },
  },
  emajster: {
    base: `#0f1a22`, glow: `#5ac8f0`,
    terrain: `puffs`,
    colors: { farHills:`#16303a`, nearHills:`#12262e`, nearRim:`#2f6a4a`, ground:`#12262e`, groundRim:`#4f8a36`, pebble:`#5ac8f0` },
    props: props(
      [ `bolt`, 0.2, { y:0.2, scale:2, twinkle:true } ], [ `bolt`, 0.76, { y:0.12, scale:3, twinkle:true } ], [ `powerPole`, 0.3, { back:true, scale:5, palette:far( `powerPole`, `#0f1a22`, 0.4 ) } ], [ `powerPole`, 0.66, { back:true, scale:5, palette:far( `powerPole`, `#0f1a22`, 0.4 ) } ],
      [ `tallGrass`, 0.03 ], [ `aquarium`, 0.08 ], [ `fern`, 0.15 ], [ `tallGrass`, 0.2 ], [ `powerPole`, 0.26 ], [ `tallGrass`, 0.38 ], [ `aquarium`, 0.48 ], [ `fern`, 0.56 ], [ `tallGrass`, 0.62 ], [ `powerPole`, 0.72 ], [ `aquarium`, 0.84 ], [ `tallGrass`, 0.94 ],
    ),
    characters: [ { sheet:`emajster`, startX:0.2, walkRange:[ 0, 1 ], speed:4 }, { sheet:`emajster`, startX:0.8, walkRange:[ 0, 1 ], speed:5, phase:2 } ],
    ground: { rim:`#6aae4a`, top:`#3f7d24`, soil:`#22301e`, deep:`#161f14`, speck:`#5ac8f0`, props:[ `tallGrass`, `aquarium`, `fern`, `powerPole` ] },
  },
  mergatic: {
    base: `#17150f`, glow: `#f2d24a`,
    terrain: `dunes`,
    colors: { farHills:`#24242f`, nearHills:`#1c1c26`, ground:`#1c1c26`, groundRim:`#5a5a70`, pebble:`#3a3a4a` },
    props: props(
      [ `moon`, 0.14, { y:0.1, scale:6, palette:{ m:`#f6e08a`, s:`#d8b43a` } } ], [ `statue`, 0.3, { back:true, scale:6, palette:far( `statue`, `#15151f`, 0.4 ) } ],
      [ `rock`, 0.05, { palette:{ r:`#4a4a5a`, l:`#6a6a7a`, s:`#2a2a36` } } ], [ `artFrame`, 0.12 ], [ `statue`, 0.2 ], [ `rock`, 0.4, { palette:{ r:`#4a4a5a`, l:`#6a6a7a`, s:`#2a2a36` } } ], [ `artFrame`, 0.5 ], [ `statue`, 0.64 ], [ `artFrame`, 0.82 ], [ `rock`, 0.92, { palette:{ r:`#4a4a5a`, l:`#6a6a7a`, s:`#2a2a36` } } ],
    ),
    characters: [ { sheet:`mergatic`, startX:0.3, walkRange:[ 0, 1 ], speed:2 }, { sheet:`mergatic`, startX:0.8, walkRange:[ 0, 1 ], speed:3, phase:3 } ],
    ground: { rim:`#7a7a90`, top:`#4a4a5a`, soil:`#2a2a36`, deep:`#1c1c26`, speck:`#c9cfe0`, props:[ `artFrame`, `statue`, `rock` ] },
  },
  unux: {
    base: `#240a0a`, glow: `#ff5a2a`,
    terrain: `peaks`,
    colors: { farHills:`#3a1010`, nearHills:`#2a0a0a`, snow:`#ff7a3a`, ground:`#2a0a0a`, groundRim:`#e0502a`, pebble:`#ffcc33` },
    props: props(
      [ `ember`, 0.12, { y:0.4, twinkle:true } ], [ `ember`, 0.3, { y:0.62, twinkle:true } ], [ `ember`, 0.52, { y:0.3, twinkle:true } ], [ `ember`, 0.7, { y:0.7, twinkle:true } ], [ `ember`, 0.9, { y:0.2, twinkle:true } ],
      [ `spike`, 0.32, { back:true, scale:7, palette:far( `spike`, `#240a0a`, 0.2 ) } ], [ `spike`, 0.38, { back:true, scale:4, palette:far( `spike`, `#240a0a`, 0.2 ) } ], [ `spike`, 0.8, { back:true, scale:6, palette:far( `spike`, `#240a0a`, 0.2 ) } ],
      [ `lavaPool`, 0.04 ], [ `spike`, 0.12 ], [ `flame`, 0.18, { twinkle:true } ], [ `lavaPool`, 0.26 ], [ `spike`, 0.44 ], [ `flame`, 0.5 ], [ `lavaPool`, 0.6 ], [ `flame`, 0.7, { twinkle:true } ], [ `spike`, 0.86 ], [ `lavaPool`, 0.92 ],
    ),
    characters: [ { sheet:`unux`, startX:0.22, walkRange:[ 0, 1 ], speed:3 }, { sheet:`unux`, startX:0.78, walkRange:[ 0, 1 ], speed:4, phase:2 } ],
    ground: { rim:`#ff7a3a`, top:`#8a1f1f`, soil:`#3a0e0e`, deep:`#240808`, speck:`#ffcc33`, props:[ `spike`, `lavaPool`, `flame` ] },
  },
  heartofmoe: {
    base: `#121a24`, glow: `#f05a8a`,
    terrain: `puffs`,
    colors: { farHills:`#22303f`, nearHills:`#1a2633`, nearRim:`#c9d3ea`, ground:`#1a2633`, groundRim:`#e8eef6`, pebble:`#f05a8a` },
    props: props(
      [ `snowflake`, 0.08, { y:0.3, twinkle:true } ], [ `snowflake`, 0.24, { y:0.6, twinkle:true } ], [ `snowflake`, 0.44, { y:0.16, twinkle:true } ], [ `snowflake`, 0.62, { y:0.7, twinkle:true } ], [ `snowflake`, 0.8, { y:0.4, twinkle:true } ], [ `snowflake`, 0.95, { y:0.6, twinkle:true } ],
      [ `birch`, 0.22, { back:true, scale:5, palette:far( `birch`, `#121a24`, 0.45 ) } ], [ `birch`, 0.3, { back:true, scale:4, palette:far( `birch`, `#121a24`, 0.55 ) } ], [ `birch`, 0.76, { back:true, scale:6, palette:far( `birch`, `#121a24`, 0.4 ) } ],
      [ `birch`, 0.04 ], [ `heartFlower`, 0.1 ], [ `pine`, 0.14 ], [ `birch`, 0.34 ], [ `heartFlower`, 0.42 ], [ `birch`, 0.56 ], [ `heartFlower`, 0.62 ], [ `pine`, 0.7 ], [ `birch`, 0.88 ], [ `heartFlower`, 0.94 ],
    ),
    characters: [ { sheet:`heartofmoe`, startX:0.24, walkRange:[ 0, 1 ], speed:8 }, { sheet:`heartofmoe`, startX:0.8, walkRange:[ 0, 1 ], speed:6, phase:2 } ],
    ground: { rim:`#ffffff`, top:`#c9d3ea`, soil:`#3a4658`, deep:`#232c3a`, speck:`#f05a8a`, props:[ `birch`, `heartFlower`, `pine` ] },
  },
  selcior: {
    base: `#1a1708`, glow: `#f2c94a`,
    terrain: `mesa`,
    colors: { farHills:`#2a2510`, farBands:[ `#2a2510`, `#332d14`, `#24200c`, `#3a3218` ], nearHills:`#1f1c0a`, ground:`#1f1c0a`, groundRim:`#c09a2a`, pebble:`#3a3218` },
    props: props(
      [ `blockTower`, 0.28, { back:true, scale:6, palette:far( `blockTower`, `#1a1708`, 0.35 ) } ], [ `blockTower`, 0.34, { back:true, scale:4, palette:far( `blockTower`, `#1a1708`, 0.45 ) } ], [ `blockTower`, 0.8, { back:true, scale:7, palette:far( `blockTower`, `#1a1708`, 0.3 ) } ],
      [ `cube`, 0.16, { y:0.3, scale:2, palette:{ c:`#f2c94a`, d:`#c09a2a` } } ], [ `cube`, 0.66, { y:0.18, scale:3, palette:{ c:`#f2c94a`, d:`#c09a2a` } } ],
      [ `crate`, 0.04 ], [ `stairs`, 0.1 ], [ `blockTower`, 0.16 ], [ `crate`, 0.22 ], [ `crate`, 0.24 ], [ `stairs`, 0.42 ], [ `crate`, 0.52 ], [ `blockTower`, 0.62 ], [ `crate`, 0.72 ], [ `stairs`, 0.86 ], [ `crate`, 0.94 ],
    ),
    characters: [ { sheet:`selcior`, startX:0.2, walkRange:[ 0, 1 ], speed:4 }, { sheet:`selcior`, startX:0.76, walkRange:[ 0, 1 ], speed:5, phase:2 } ],
    ground: { rim:`#f2c94a`, top:`#c09a2a`, soil:`#4a3c14`, deep:`#2a2208`, speck:`#ffe68a`, props:[ `crate`, `blockTower`, `stairs` ] },
  },
  blacky: {
    base: `#0a0a10`, glow: `#8a8ab0`,
    terrain: `puffs`,
    colors: { farHills:`#121218`, nearHills:`#0e0e14`, nearRim:`#22222e`, ground:`#0e0e14`, groundRim:`#2c2c3a`, pebble:`#1a1a22` },
    props: props(
      [ `shadowWisp`, 0.14, { y:0.4, twinkle:true } ], [ `shadowWisp`, 0.36, { y:0.2, scale:2, twinkle:true } ], [ `shadowWisp`, 0.58, { y:0.66, twinkle:true } ], [ `shadowWisp`, 0.86, { y:0.34, scale:2, twinkle:true } ],
      [ `deadTree`, 0.26, { back:true, scale:6, palette:far( `deadTree`, `#0a0a10`, 0.3 ) } ], [ `deadTree`, 0.78, { back:true, scale:7, palette:far( `deadTree`, `#0a0a10`, 0.3 ) } ],
      [ `eyesInDark`, 0.2, { y:0.84, twinkle:true } ], [ `eyesInDark`, 0.48, { y:0.88, twinkle:true } ], [ `eyesInDark`, 0.9, { y:0.86, twinkle:true } ],
      [ `deadTree`, 0.04 ], [ `deadTree`, 0.16 ], [ `shadowWisp`, 0.3 ], [ `deadTree`, 0.44 ], [ `deadTree`, 0.62 ], [ `shadowWisp`, 0.72 ], [ `deadTree`, 0.9 ],
    ),
    characters: [ { sheet:`blacky`, startX:0.3, walkRange:[ 0, 1 ], speed:6 }, { sheet:`blacky`, startX:0.74, walkRange:[ 0, 1 ], speed:7, phase:2 } ],
    ground: { rim:`#3a3a4a`, top:`#1a1a22`, soil:`#121218`, deep:`#0a0a10`, speck:`#c8f0ff`, props:[ `deadTree`, `shadowWisp` ] },
  },
  murshtin: {
    base: `#1c1416`, glow: `#f08a5a`,
    terrain: `mesa`,
    colors: { farHills:`#2a1e20`, farBands:[ `#2a1e20`, `#33242a`, `#24181c`, `#3a2a2c` ], nearHills:`#22181a`, ground:`#22181a`, groundRim:`#8a3a2a`, pebble:`#3a2a2c` },
    props: props(
      [ `wall`, 0.24, { back:true, scale:5, palette:far( `wall`, `#1c1416`, 0.45 ) } ], [ `mural`, 0.72, { back:true, scale:5, palette:far( `mural`, `#1c1416`, 0.3 ) } ],
      [ `wall`, 0.04 ], [ `easel`, 0.13 ], [ `paintCan`, 0.17 ], [ `mural`, 0.34 ], [ `paintCan`, 0.44 ], [ `wall`, 0.52 ], [ `easel`, 0.62 ], [ `mural`, 0.84 ], [ `paintCan`, 0.94 ],
    ),
    characters: [ { sheet:`murshtin`, startX:0.2, walkRange:[ 0, 1 ], speed:4 }, { sheet:`murshtin`, startX:0.7, walkRange:[ 0, 1 ], speed:3, phase:2 } ],
    ground: { rim:`#c05a3a`, top:`#8a3a2a`, soil:`#3a2224`, deep:`#241416`, speck:`#ffe14a`, props:[ `wall`, `easel`, `paintCan`, `mural` ] },
  },
}

/**
 * How each hero scene spreads over the whole window: the shape of its ground (Evolveye has none, it lives in the clouds) and
 * the small things scattered all over its sky: [ name, how many, options ]. Positions are seeded, so a scene keeps its look
 */
const SCENERY = {
  evolveye: { groundShape:`none`, scatter:[ [ `wisp`, 12, { twinkle:true } ], [ `islet`, 5 ], [ `islet`, 2, { scale:2 } ], [ `cloudlet`, 8 ], [ `column`, 3 ] ] },
  ranfisz: { groundShape:`rolling`, scatter:[ [ `bird`, 5 ], [ `tumbleweed`, 3 ], [ `spark`, 6, { twinkle:true, palette:{ c:`#f6d9a0` } } ] ] },
  goral: { groundShape:`rolling`, scatter:[ [ `bird`, 6 ], [ `snowflake`, 12, { twinkle:true } ] ] },
  mszak: { groundShape:`rolling`, scatter:[ [ `firefly`, 22, { twinkle:true } ], [ `flowers`, 3 ] ] },
  zabek: { groundShape:`flat`, scatter:[ [ `spark`, 12, { twinkle:true } ], [ `steam`, 4 ], [ `flask`, 3 ] ] },
  glutek: { groundShape:`rolling`, scatter:[ [ `bubble`, 14, { twinkle:true } ], [ `bubble`, 4, { scale:2 } ], [ `blob`, 3 ] ] },
  klimax: { groundShape:`flat`, scatter:[ [ `steam`, 8 ], [ `spark`, 12, { twinkle:true, palette:{ c:`#c8f04a` } } ] ] },
  svebran: { groundShape:`rolling`, scatter:[ [ `boulder`, 6 ], [ `rock`, 5 ], [ `boulder`, 2, { scale:2 } ] ] },
  kubixii: { groundShape:`rolling`, scatter:[ [ `cube`, 14, { twinkle:true } ], [ `cube`, 4, { scale:2 } ], [ `portal`, 2, { palette:{ p:`#4aa8ff`, v:`#b07ce8` } } ] ] },
  emajster: { groundShape:`rolling`, scatter:[ [ `bolt`, 8, { twinkle:true } ], [ `bird`, 5 ] ] },
  mergatic: { groundShape:`rolling`, scatter:[ [ `spark`, 14, { twinkle:true, palette:{ c:`#f2d24a` } } ], [ `crescent`, 2 ], [ `artFrame`, 2 ] ] },
  unux: { groundShape:`rolling`, scatter:[ [ `ember`, 24, { twinkle:true } ], [ `flame`, 4, { twinkle:true } ] ] },
  heartofmoe: { groundShape:`rolling`, scatter:[ [ `snowflake`, 22, { twinkle:true } ], [ `heartFlower`, 3 ] ] },
  selcior: { groundShape:`flat`, scatter:[ [ `cube`, 12, { palette:{ c:`#f2c94a`, d:`#c09a2a` } } ], [ `crate`, 3 ], [ `cube`, 3, { scale:2, palette:{ c:`#f2c94a`, d:`#c09a2a` } } ] ] },
  blacky: { groundShape:`rolling`, scatter:[ [ `shadowWisp`, 14, { twinkle:true } ], [ `eyesInDark`, 8, { twinkle:true } ] ] },
  murshtin: { groundShape:`flat`, scatter:[ [ `splat`, 14 ], [ `paintCan`, 2 ] ] },
}

function scatteredProps( id ) {
  const random = seeded( [ ...id ].reduce( (sum, letter) => sum * 31 + letter.charCodeAt( 0 ), 7 ) )
  const entries = SCENERY[ id ]?.scatter ?? []

  return entries.flatMap( ([ name, count, options = {} ]) => Array.from({ length:count }, () => {
    const palette = name === `splat` ? { c:[ `#ffe14a`, `#4a8aff`, `#4fbf6a`, `#e05a5a`, `#b07ce8` ][ Math.floor( random() * 5 ) ] } : undefined
    return { ...PROPS[ name ], x:0.02 + random() * 0.94, y:0.04 + random() * 0.72, ...(palette && { palette }), ...options }
  } ) )
}
