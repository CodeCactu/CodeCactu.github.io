import test, { describe } from "node:test"
import assert from "node:assert"
import { parseNumberStr } from "./stringUtils"

describe( `Function named "parseNumberStr" `, () => {
  describe( `Basic usage`, () => {
    test( `Parse   "123" ==  "123"`, () => assert.equal( parseNumberStr( `123` ), `123` ) )
    test( `Parse  "-123" == "-123"`, () => assert.equal( parseNumberStr( `-123` ), `-123` ) )

    test( `Parse  "0123" ==  "123"`, () => assert.equal( parseNumberStr( `0123` ), `123` ) )
    test( `Parse "-0123" == "-123"`, () => assert.equal( parseNumberStr( `-0123` ), `-123` ) )

    test( `Parse   "000" ==  "0"`, () => assert.equal( parseNumberStr( `000` ), `0` ) )
    test( `Parse  "-000" ==  "0"`, () => assert.equal( parseNumberStr( `-000` ), `-0` ) )

    test( `Parse  "00." ==  "0."`, () => assert.equal( parseNumberStr( `00.` ), `0.` ) )
    test( `Parse "-00." == "-0."`, () => assert.equal( parseNumberStr( `-00.` ), `-0.` ) )

    test( `Parse  "00.1" ==  "0.1"`, () => assert.equal( parseNumberStr( `00.1` ), `0.1` ) )
    test( `Parse "-00.1" == "-0.1"`, () => assert.equal( parseNumberStr( `-00.1` ), `-0.1` ) )

    test( `Parse  "0,1" ==  "0.1"`, () => assert.equal( parseNumberStr( `0,1` ), `0.1` ) )
  } )

  describe( `Options`, () => {
    test( `Parse "123456",        but max integer  length is 5 == "12345"`, () => assert.equal( parseNumberStr( `123456`, { maxIntegerDigits:5 } ), `12345` ) )
    test( `Parse "123456.789",    but max integer  length is 5 == "12345.789"`, () => assert.equal( parseNumberStr( `123456.789`, { maxIntegerDigits:5 } ), `12345.789` ) )
    test( `Parse    "123.456789", but max integer  length is 5 == "123.456789"`, () => assert.equal( parseNumberStr( `123.456789`, { maxIntegerDigits:5 } ), `123.456789` ) )

    test( `Parse "123456",        but max fraction length is 2 == "123456"`, () => assert.equal( parseNumberStr( `123456`, { maxFractionDigits:2 } ), `123456` ) )
    test( `Parse "123456.789",    but max fraction length is 2 == "123456.78"`, () => assert.equal( parseNumberStr( `123456.789`, { maxFractionDigits:2 } ), `123456.78` ) )
    test( `Parse    "123.456789", but max fraction length is 2 == "123.45"`, () => assert.equal( parseNumberStr( `123.456789`, { maxFractionDigits:2 } ), `123.45` ) )

    test( `Parse "-123", negative not allowed`, () => assert.equal( parseNumberStr( `-123`, { allowNegatives:false } ), `123` ) )
  } )

  describe( `Non-number strings`, () => {
    test( `Parse         "" == ""`, () => assert.equal( parseNumberStr( `` ), `` ) )
    test( `Parse        "-" == "-"`, () => assert.equal( parseNumberStr( `-` ), `-` ) )
    test( `Parse      "abc" == ""`, () => assert.equal( parseNumberStr( `abc` ), `` ) )

    test( `Parse   "123abc" == "123"`, () => assert.equal( parseNumberStr( `123abc` ), `123` ) )
    test( `Parse  "-123abc" == "123"`, () => assert.equal( parseNumberStr( `-123abc` ), `-123` ) )

    test( `Parse  "123 abc" == "123"`, () => assert.equal( parseNumberStr( `123 abc` ), `123` ) )
    test( `Parse "-123 abc" == "123"`, () => assert.equal( parseNumberStr( `-123 abc` ), `-123` ) )

    test( `Parse   "abc123" == ""`, () => assert.equal( parseNumberStr( `abc123` ), `` ) )
    test( `Parse  "abc-123" == ""`, () => assert.equal( parseNumberStr( `abc-123` ), `` ) )

    test( `Parse "abc  123" == ""`, () => assert.equal( parseNumberStr( `abc  123` ), `` ) )
    test( `Parse "abc -123" == ""`, () => assert.equal( parseNumberStr( `abc -123` ), `` ) )
  } )
} )
