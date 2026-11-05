import test, { describe } from "node:test"
import assert from "node:assert"
import { createTranslator } from "."

const t = createTranslator({
  pl: {
    nav: { home:`Start` },
    level: `Poziom {{level}}`,
    gameCount: {
      one: `{{count}} gra`,
      few: `{{count}} gry`,
      many: `{{count}} gier`,
      other: `{{count}} gry`,
    },
  },
})

describe( `t`, () => {
  test( `returns a nested text`, () => assert.equal( t( `nav.home` ), `Start` ) )
  test( `fills the placeholders`, () => assert.equal( t( `level`, { level:3 } ), `Poziom 3` ) )
  test( `keeps a placeholder without a value`, () => assert.equal( t( `level` ), `Poziom {{level}}` ) )
  test( `has: texts and plurals exist, other keys do not`, () => assert.deepEqual( [ `nav.home`, `gameCount`, `nav`, `nav.missing` ].map( t.has ), [ true, true, false, false ] ) )
} )

describe( `t with plural forms`, () => {
  const games = (count:number) => t( `gameCount`, { count } )

  test( `one for exactly 1`, () => assert.equal( games( 1 ), `1 gra` ) )
  test( `few for 2–4 and their tens`, () => assert.deepEqual( [ 2, 22, 104 ].map( games ), [ `2 gry`, `22 gry`, `104 gry` ] ) )
  test( `many for 0, 5–21 and 12–14`, () => assert.deepEqual( [ 0, 5, 12, 21 ].map( games ), [ `0 gier`, `5 gier`, `12 gier`, `21 gier` ] ) )
  test( `other for fractions, in Polish number format`, () => assert.equal( games( 1.5 ), `1,5 gry` ) )
} )
