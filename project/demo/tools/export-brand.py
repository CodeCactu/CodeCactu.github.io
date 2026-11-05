"""
Exports the chosen smooth brand (brand-smooth.html, FINAL) to SVG and PNG files in project/brand/smooth/.

  python tools/export-brand.py

1. Opens brand-smooth.html?export in a headless Chromium browser (Edge or Chrome, found by find_browser), which draws the chosen logo on the dark and the light background exactly
   as the page does and writes its geometry and its pixel sky (and the favicon's pixels) into <pre id="export">.
2. Builds the SVGs: the pixel sky and the favicon's pixels as crisp rectangles, the cactus from the vector signet
   (lib/smooth/signet.svg), and the wordmark as outlines of the cactu font (lib/cactu-font.js), so the files need no font.
3. Renders the PNGs from the SVGs with sharp (from frontend/node_modules), see export-brand-png.cjs.
4. Copies the files a prototype version uses into its folder (VERSION_COPIES), so they are regenerated with the brand.

Without fontTools and brotli installed: uv run --with fonttools --with brotli python tools/export-brand.py
"""

import base64
import html
import io
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

DEMO = Path( __file__ ).resolve().parent.parent
OUT = DEMO.parent / 'brand' / 'smooth'

# Chromium browsers that can draw the page headless, by their command names (also their Windows App Paths names, plus .exe)
BROWSERS = [ 'msedge', 'chrome', 'google-chrome', 'chromium', 'chromium-browser' ]

# The exported files a prototype version keeps its own copies of: its path in project/demo -> the exported file's name
VERSION_COPIES = {
  'v3/brand.svg': 'cactu-logo-dark-lines-spread.svg',
  'v3/brand-word.svg': 'cactu-logo-dark-lines-spread-word.svg',
  'v3/favicon-16.png': 'favicon-16.png',
  'v3/favicon-32.png': 'favicon-32.png',
  'v3/favicon-192.png': 'favicon-192.png',
}

# PNG scales of the logo, and the favicon's PNG sizes (16 uses the 16 grid, the rest whole multiples of the 32 grid)
LOGO_SCALES = [ 1, 2, 4 ]
FAVICON_SIZES = [ 16, 32, 64, 128, 192, 256, 512 ]


def read_export():
  page = ( DEMO / 'brand-smooth.html' ).as_uri() + '?export'
  dom = subprocess.run(
    [ find_browser(), '--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--virtual-time-budget=20000',
      '--window-size=1600,2000', '--dump-dom', page ],
    capture_output=True, text=True, encoding='utf-8' ).stdout

  # The page's own code mentions the element too, so the data is the last match that holds an object
  found = re.findall( r'<pre id="export">(\{.*?)</pre>', dom, re.S )
  if not found: sys.exit( 'No export data: did brand-smooth.html?export finish drawing?' )
  return json.loads( html.unescape( found[ -1 ] ) )


def find_browser():
  """A Chromium browser: the BROWSER environment variable, else the first of BROWSERS on the PATH, else (on Windows) where
  its installer registered it"""
  if os.environ.get( 'BROWSER' ): return os.environ[ 'BROWSER' ]

  for name in BROWSERS:
    found = shutil.which( name )
    if found: return found

  if sys.platform == 'win32':
    import winreg
    for root in ( winreg.HKEY_CURRENT_USER, winreg.HKEY_LOCAL_MACHINE ):
      for name in BROWSERS:
        try: return winreg.QueryValue( root, rf'SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\{name}.exe' )
        except OSError: continue

  sys.exit( f'No Chromium browser found: install one of {", ".join( BROWSERS )} or set BROWSER to its path' )


def pretty_svg( svg ):
  """The SVG one element per line, indented by its depth; an element holding only text (the title) stays on one line"""
  tokens = re.findall( r'<[^>]+>|[^<]+', svg )
  lines = []
  depth = 0
  index = 0

  while index < len( tokens ):
    token = tokens[ index ]
    is_open = token.startswith( '<' ) and not token.startswith( '</' ) and not token.endswith( '/>' )

    if is_open and index + 2 < len( tokens ) and not tokens[ index + 1 ].startswith( '<' ) and tokens[ index + 2 ].startswith( '</' ):
      lines.append( '  ' * depth + ''.join( tokens[ index:index + 3 ] ) )
      index += 3
      continue

    if token.startswith( '</' ): depth -= 1
    if token.strip(): lines.append( '  ' * depth + token.strip() )
    if is_open: depth += 1
    index += 1

  return '\n'.join( lines ) + '\n'


def write_svg( path, svg ):
  path.write_text( pretty_svg( svg ), encoding='utf-8', newline='\n' )


def pixel_paths( runs, scale = 1 ):
  """Runs of pixels ([ x, y, length, colour ]) as one path per colour"""
  by_color = {}
  for x, y, length, color in runs:
    by_color.setdefault( color, [] ).append( f'M{x * scale} {y * scale}h{length * scale}v{scale}h{-length * scale}z' )
  return ''.join( f'<path fill="{color}" d="{"".join( parts )}"/>' for color, parts in by_color.items() )


def signet_parts():
  """The vector signet: its outline path and its dots, in its own 294 × 345 units"""
  svg = ( DEMO / 'lib' / 'smooth' / 'signet.svg' ).read_text( encoding='utf-8' )
  outline = re.search( r'<path\s[^>]*?\bid="cactus"[^>]*?\bd="([^"]+)"', svg, re.S )
  dots = re.findall( r'<circle\s+cx="([\d.]+)"\s+cy="([\d.]+)"\s+r="([\d.]+)"', svg )
  return outline.group( 1 ), dots


def signet_svg( left, top, width, prefix ):
  outline, dots = signet_parts()
  scale = width / 294
  circles = ''.join( f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x, y, r in dots )
  return (
    f'<g transform="translate({left:.3f} {top:.3f}) scale({scale:.6f})">'
    f'<clipPath id="{prefix}cactus"><path d="{outline}"/></clipPath>'
    f'<path fill="#5da234" d="{outline}"/>'
    f'<g fill="#3e721d" clip-path="url(#{prefix}cactus)">{circles}</g>'
    '</g>' )


def cactu_font():
  source = ( DEMO / 'lib' / 'cactu-font.js' ).read_text( encoding='utf-8' )
  data = re.search( r'base64,([A-Za-z0-9+/=]+)', source ).group( 1 )
  return TTFont( io.BytesIO( base64.b64decode( data ) ) )


def wordmark_svg( font, text, left, size, letter_spacing, ink_bottom ):
  """The word as outlines: each letter at its advance plus the letter spacing, the letters' ink bottom on `ink_bottom`"""
  glyphs = font.getGlyphSet()
  cmap = font.getBestCmap()
  scale = size / font[ 'head' ].unitsPerEm

  lowest = None
  for char in text:
    bounds = BoundsPen( glyphs )
    glyphs[ cmap[ ord( char ) ] ].draw( bounds )
    if bounds.bounds: lowest = bounds.bounds[ 1 ] if lowest is None else min( lowest, bounds.bounds[ 1 ] )

  baseline = ink_bottom + lowest * scale
  parts = []
  x = left
  ink_right = left
  for char in text:
    name = cmap[ ord( char ) ]
    pen = SVGPathPen( glyphs )
    glyphs[ name ].draw( pen )
    parts.append( f'<path transform="translate({x:.3f} {baseline:.3f}) scale({scale:.6f} {-scale:.6f})" d="{pen.getCommands()}"/>' )
    bounds = BoundsPen( glyphs )
    glyphs[ name ].draw( bounds )
    if bounds.bounds: ink_right = x + bounds.bounds[ 2 ] * scale
    x += glyphs[ name ].width * scale + letter_spacing

  return f'<g fill="#5da234">{"".join( parts )}</g>', ink_right


# The sky's star colours (PLATE_COLORS.dark in lib/brand.js: the star and its glow)
STAR_COLORS = { '#fff4c8', '#6c67a6' }


def is_ending( run, logo, ink_right ):
  """Whether a run of the sky's pixels is part of the ending: right of the last letter, around the letters' height"""
  unit = logo[ 'unit' ]
  foot = logo[ 'signet' ][ 'top' ] + logo[ 'signet' ][ 'height' ]
  return run[ 0 ] * unit > ink_right + 2 and foot - logo[ 'size' ] * 0.8 < run[ 1 ] * unit < foot + logo[ 'size' ] * 0.2


# The sky's coloured lines (STATIC_LINES in lib/brand.js), one colour each
LINE_COLORS = [ '#ca5b35', '#4273b3', '#7a55ff', '#e5be4b' ]


def spread_lines( pixels, logo ):
  """The sky's lines moved up and down (not sideways) so they fill more of the sky evenly: the top one halfway between
  where it was and the top of the cactus, the lowest where it is, the others evenly between; on whole pixels of the sky"""
  centers = {}
  for x, y, length, color in pixels:
    if color in LINE_COLORS: centers.setdefault( color, [] ).append( y )
  lines = sorted( centers, key=lambda color: sum( centers[ color ] ) / len( centers[ color ] ) )
  middle = { color: round( sum( centers[ color ] ) / len( centers[ color ] ) ) for color in lines }
  top = round( (round( logo[ 'signet' ][ 'top' ] / logo[ 'unit' ] ) + 1 + middle[ lines[ 0 ] ]) / 2 )
  bottom = middle[ lines[ -1 ] ]
  shift = { color: round( top + (bottom - top) * index / max( 1, len( lines ) - 1 ) ) - middle[ color ] for index, color in enumerate( lines ) }
  return [ [ x, y + shift.get( color, 0 ), length, color ] for x, y, length, color in pixels ]


def logo_svg( logo, font, with_background, with_signet = True, with_stars = True, spread = False ):
  """The logo; without the signet, its sky and wordmark alone in the same box; without stars, the sky keeps only its lines
  (and the ending keeps its own star)"""
  width, height = logo[ 'width' ], logo[ 'height' ]
  signet = logo[ 'signet' ]
  background = f'<rect width="{width}" height="{height}" fill="{logo[ "background" ]}"/>' if with_background else ''
  ink_right = wordmark_svg( font, 'cactu', logo[ 'wordLeft' ], logo[ 'size' ], logo[ 'letterSpacing' ], signet[ 'top' ] + signet[ 'height' ] )[ 1 ]
  pixels = [ run for run in logo[ 'pixels' ] if with_stars or run[ 3 ] not in STAR_COLORS or is_ending( run, logo, ink_right ) ]
  if spread: pixels = spread_lines( pixels, logo )
  sky = f'<g shape-rendering="crispEdges">{pixel_paths( pixels, logo[ "unit" ] )}</g>'

  return (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{width:g}" height="{height:g}" viewBox="0 0 {width:g} {height:g}">'
    f'<title>Cactu</title>{background}{sky}'
    f'{signet_svg( signet[ "left" ], signet[ "top" ], signet[ "width" ], logo[ "theme" ] + "-" ) if with_signet else ""}'
    f'{wordmark_svg( font, "cactu", logo[ "wordLeft" ], logo[ "size" ], logo[ "letterSpacing" ], signet[ "top" ] + signet[ "height" ] )[ 0 ]}'
    '</svg>' )


def core_svg( logo, font, with_signet = True ):
  """The logo without its sky: the signet, the wordmark and the pixel ending, cropped to them, on a transparent background.
  The ending's pixels are the sky's pixels that lie right of the last letter, around the letters' height. Without the signet it is the wordmark and the ending alone, in the same box, so the two can be
  laid over each other (the v3 page moves them apart while scrolling)"""
  signet = logo[ 'signet' ]
  unit = logo[ 'unit' ]
  foot = signet[ 'top' ] + signet[ 'height' ]
  word, ink_right = wordmark_svg( font, 'cactu', logo[ 'wordLeft' ], logo[ 'size' ], logo[ 'letterSpacing' ], foot )
  # Only near the letters' height, so the sky's stars above the word stay out
  ending = [ run for run in logo[ 'pixels' ] if is_ending( run, logo, ink_right ) ]

  left = signet[ 'left' ]
  top = signet[ 'top' ]
  right = max( ( x + length ) * unit for x, y, length, color in ending )
  bottom = max( foot, max( ( y + 1 ) * unit for x, y, length, color in ending ) )

  # Whole pixels of the sky's grid at the crop's edge, so the ending's pixels stay on whole pixels of the file
  left = int( left // unit * unit )
  top = int( top // unit * unit )
  width = int( -( -( right - left ) // unit ) * unit )
  height = int( -( -( bottom - top ) // unit ) * unit )

  return (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="{left} {top} {width} {height}">'
    f'<title>Cactu</title><g shape-rendering="crispEdges">{pixel_paths( ending, unit )}</g>'
    f'{signet_svg( signet[ "left" ], signet[ "top" ], signet[ "width" ], "core-" ) if with_signet else ""}{word}'
    '</svg>' ), width, height


def favicon_svg( runs, grid, cactus ):
  height = grid * cactus
  width = height * 294 / 345
  return (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{grid}" height="{grid}" viewBox="0 0 {grid} {grid}">'
    f'<title>Cactu</title><g shape-rendering="crispEdges">{pixel_paths( runs )}</g>'
    f'{signet_svg( ( grid - width ) / 2, ( grid - height ) / 2, width, f"favicon{grid}-" )}'
    '</svg>' )


def main():
  data = read_export()
  font = cactu_font()
  OUT.mkdir( parents=True, exist_ok=True )
  jobs = []

  for logo in data[ 'logos' ]:
    for with_background in ( True, False ):
      name = f'cactu-logo-{logo[ "theme" ]}{"" if with_background else "-transparent"}'
      write_svg( OUT / f'{name}.svg', logo_svg( logo, font, with_background ) )
      for scale in LOGO_SCALES:
        jobs.append({ 'svg':str( OUT / f'{name}.svg' ), 'png':str( OUT / f'{name}@{scale}x.png' ), 'width':round( logo[ 'width' ] * scale ), 'height':round( logo[ 'height' ] * scale ) })

  # The dark logo's sky and wordmark without the signet, in the same box, to lay under a separate signet (v3 moves them apart
  # while scrolling)
  write_svg( OUT / 'cactu-logo-dark-sky-word.svg', logo_svg( data[ 'logos' ][ 0 ], font, False, with_signet=False ) )
  # The same with the sky's lines but no stars: the whole logo, and without the signet
  write_svg( OUT / 'cactu-logo-dark-lines.svg', logo_svg( data[ 'logos' ][ 0 ], font, False, with_stars=False ) )
  write_svg( OUT / 'cactu-logo-dark-lines-word.svg', logo_svg( data[ 'logos' ][ 0 ], font, False, with_signet=False, with_stars=False ) )
  # And with the lines spread up the whole sky, from the top of the cactus down
  write_svg( OUT / 'cactu-logo-dark-lines-spread.svg', logo_svg( data[ 'logos' ][ 0 ], font, False, with_stars=False, spread=True ) )
  write_svg( OUT / 'cactu-logo-dark-lines-spread-word.svg', logo_svg( data[ 'logos' ][ 0 ], font, False, with_signet=False, with_stars=False, spread=True ) )

  # The logo without its sky, for placing on other backgrounds (the hero of v3 uses it)
  core, core_width, core_height = core_svg( data[ 'logos' ][ 0 ], font )
  write_svg( OUT / 'cactu-logo-core.svg', core )
  write_svg( OUT / 'cactu-logo-word.svg', core_svg( data[ 'logos' ][ 0 ], font, with_signet=False )[ 0 ] )
  for scale in LOGO_SCALES:
    jobs.append({ 'svg':str( OUT / 'cactu-logo-core.svg' ), 'png':str( OUT / f'cactu-logo-core@{scale}x.png' ), 'width':core_width * scale, 'height':core_height * scale })

  for grid in ( 32, 16 ):
    write_svg( OUT / f'favicon-{grid}-grid.svg', favicon_svg( data[ 'favicon' ][ str( grid ) ], grid, data[ 'cactus' ] ) )
  # The favicon to use: the 32 grid; browsers scale it, and the 16 px PNG keeps the sharp 16 grid
  write_svg( OUT / 'favicon.svg', ( OUT / 'favicon-32-grid.svg' ).read_text( encoding='utf-8' ) )

  for size in FAVICON_SIZES:
    grid = 16 if size < 32 else 32
    jobs.append({ 'svg':str( OUT / f'favicon-{grid}-grid.svg' ), 'png':str( OUT / f'favicon-{size}.png' ), 'width':size, 'height':size })

  ( OUT / 'png-jobs.json' ).write_text( json.dumps( jobs, indent=2 ), encoding='utf-8' )
  subprocess.run([ 'node', str( Path( __file__ ).with_name( 'export-brand-png.cjs' ) ), str( OUT / 'png-jobs.json' ) ], check=True )
  ( OUT / 'png-jobs.json' ).unlink()

  for copy, exported in VERSION_COPIES.items():
    ( DEMO / copy ).write_bytes( ( OUT / exported ).read_bytes() )

  for path in sorted( OUT.iterdir() ): print( path.name )
  for copy in VERSION_COPIES: print( copy )


if __name__ == '__main__':
  main()
