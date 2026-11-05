// Renders SVGs to PNGs for tools/export-brand.py: node export-brand-png.cjs jobs.json, where jobs are { svg, png, width, height }.
// Uses sharp from the frontend's packages; SVGs are rasterised at the density that gives the wanted size, so pixel rectangles
// at whole multiples stay crisp
const path = require( `path` )
const fs = require( `fs` )
const sharp = require( path.resolve( __dirname, `../../../frontend/node_modules/sharp` ) )

const jobs = JSON.parse( fs.readFileSync( process.argv[ 2 ], `utf8` ) )

;(async () => {
  for (const { svg, png, width, height } of jobs) {
    const source = fs.readFileSync( svg )
    const { width:svgWidth } = await sharp( source ).metadata()
    const density = 72 * width / svgWidth

    await sharp( source, { density } ).resize( width, height, { kernel:`nearest` } ).png().toFile( png )
  }
})()
