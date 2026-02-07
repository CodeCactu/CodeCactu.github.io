import { UiManager, UiManagerHolder } from "@lib/dynamicUi"

type Point = {
  x: number
  y: number
}

type Rect = {
  x: number
  y: number
  width: number
  height: number
}

class Color {
  constructor(
    public r:number,
    public g:number,
    public b:number,
  ) {}

  static fromCssColor( color:string ) {
    const ctx = document.createElement( `canvas` ).getContext( `2d` )
    if (!ctx) throw new Error()

    ctx.fillStyle = color
    ctx.fillRect( 0, 0, 1, 1 )

    const [ r, g, b ] = ctx.getImageData( 0, 0, 1, 1 ).data
    return new Color( r, g, b )
  }
}



export class Line {
  lastUpdateColorPair: [from:Color, to:Color] = [ { r:0, g:0, b:0 }, { r:0, g:0, b:0 } ]
  initialColor: Color = { r:0, g:0, b:0 }
  color: Color = { r:0, g:0, b:0 }
  initialWidth: number

  colorUpdateProgresss = 1
  showing = true

  constructor(
    public x:number,
    public y:number,
    public width:number,
    public length:number,
    public showingSpeed:number,
    public speed:number,
    public opacity:number,
    color:Color,
  ) {
    this.initialWidth = width
    this.resetColor( color )
  }

  update( newColor?:Color ) {
    if (newColor) {
      if (this.width < this.initialWidth + 10) this.width += 0.1
    } else {
      if (this.width > this.initialWidth) this.width -= 0.1
    }

    const color = newColor ?? this.initialColor

    let [ from, to ] = this.lastUpdateColorPair
    if (color.r !== to.r || color.g !== to.g || color.b !== to.b) {
      this.colorUpdateProgresss = 0
      this.lastUpdateColorPair = [ to, color ]

      ;[ from, to ] = this.lastUpdateColorPair
    }

    if (this.colorUpdateProgresss >= 1) return

    this.color.r = Math.round( from.r + (to.r - from.r) * this.colorUpdateProgresss )
    this.color.g = Math.round( from.g + (to.g - from.g) * this.colorUpdateProgresss )
    this.color.b = Math.round( from.b + (to.b - from.b) * this.colorUpdateProgresss )
    this.colorUpdateProgresss += 0.01
  }

  resetColor( color:Color ) {
    this.color = { ...color }
    this.initialColor = { ...color }
    this.lastUpdateColorPair = [ this.initialColor, this.initialColor ]
  }

  draw( ctx:CanvasRenderingContext2D ) {
    const { x, y, length, width } = this

    const halfW = width / 2

    ctx.arc( x, y, halfW, Math.PI * 0.5, Math.PI * 1.5 )
    ctx.arc( x + length, y, halfW, -Math.PI * 0.5, -Math.PI * 1.5 )
    ctx.lineTo( x, y + halfW )
  }
}

export class Cross {
  showing = true

  constructor(
    public x:number,
    public y:number,
    public size:number,
    public showingSpeed:number,
    public opacity:number,
    public color:Color,
  ) {}

  draw( ctx:CanvasRenderingContext2D ) {
    const { x, y, size } = this

    ctx.moveTo( x + -size / 2, y )
    ctx.lineTo( x + size * 1.5, y )

    ctx.moveTo( x + -size / 2, y + size )
    ctx.lineTo( x + size * 1.5, y + size )

    ctx.moveTo( x, y + -size / 2 )
    ctx.lineTo( x, y + size * 1.5 )

    ctx.moveTo( x + size, y + -size / 2 )
    ctx.lineTo( x + size, y + size * 1.5 )
  }
}

export default class CactuBlinkingLinesController implements UiManagerHolder {
  uiManager: UiManager<HTMLDivElement>
  uiData = {}
  lines: Line[] = []
  ctx: CanvasRenderingContext2D

  tileSize = 20
  backgroundColor = { r:68, g:68, b:68 }
  colors: Color[] = [
    { r:202, g:91,  b:53  },
    { r:66,  g:115, b:179 },
    { r:110, g:69,  b:245 },
    { r:229, g:190, b:75  },
  ]

  effects = {
    luminatingBoxes: [] as (Rect & { color: Color })[],
  }

  constructor( divRef:HTMLDivElement ) {
    this.uiManager = new UiManager( divRef )
    this.ctx = this.uiManager.registerCtx( `main`, `canvas` )
    this.generateObjects()
    this.uiManager.startLoop( () => this.update() )

    this.luminateDomElements()
    window.addEventListener( `resize`, () => this.luminateDomElements() )
  }

  luminateDomElements() {
    const offset = 50

    this.effects = {
      luminatingBoxes: [],
    }

    for (const element of document.querySelectorAll<HTMLElement>( `[data-bgr-effect^="luminate"]` )) {
      const color = element.dataset[ `bgrEffect` ]!.match( /luminate (.+)/ )?.[ 1 ]
      if (!color) continue

      const { x, y, width, height } = element.getBoundingClientRect()

      this.effects.luminatingBoxes.push({
        x: x - offset,
        y: y - offset,
        width: width + offset * 2,
        height: height + offset * 2,
        color: Color.fromCssColor( color ),
      })
    }
  }

  generateObjects() {
    const { lines } = this
    const distance = ({ x:aX, y:aY }:Point, { x:bX, y:bY }:Point) => Math.sqrt( (aX - bX) ** 2 + (aY - bY) ** 2 )

    lines.splice( 0 )

    for (let fails = 0;  fails < 100;) {
      const line = this.createLine()
      let addIt = true

      for (const { x, y } of lines) if (distance( line, { x, y } ) < 50) {
        addIt = false
        break
      }

      if (addIt) lines.push( line )
      else fails++
    }
  }

  createLine( line?:Line, xZero = false ) {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const random = (min:number, max:number) => Math.floor( Math.random() * (max - min + 1) ) + min

    let width = random( 1, 3 )

    const length = random( 10, 50 )
    const x = xZero ? -length : random( 0, windowWidth )
    const y = random( 0, windowHeight )
    const showingSpeed = random( 1, 3 )
    const speed = random( 2, 10 ) / 10
    const opacity = 1 / random( 1, 10 )
    const colored = Math.random() > 0.92
    const color = !colored ? this.backgroundColor : this.colors[ random( 0, this.colors.length - 1 ) ]

    if (colored) width += 5
    if (!line) return new Line( x, y, width, length, showingSpeed, speed, opacity, color )

    line.x = x
    line.y = y
    line.width = width
    line.length = length
    line.showingSpeed = showingSpeed
    line.speed = speed
    line.resetColor( color )

    return line
  }

  update() {
    const { ctx, lines, effects } = this
    const { width:canvasWidth, height:canvasHeight } = ctx.canvas

    ctx.clearRect( 0, 0, canvasWidth, canvasHeight )

    lines.forEach( line => {
      const luminatingEffect = effects.luminatingBoxes.find( b =>
        line.x + line.length > b.x && line.x < b.x + b.width &&
        line.y > b.y && line.y < b.y + b.height,
      )

      line.opacity += line.showingSpeed * (line.showing ? 0.003 : -0.003)

      if (line.opacity < 0) line.opacity = 0
      else if (line.opacity > 1) line.opacity = 1

      if (luminatingEffect || line.opacity == 0) line.showing = true
      else if (line.opacity >= 1) line.showing = false

      line.update( luminatingEffect?.color )

      if (line.x > canvasWidth) this.createLine( line, true )
      else line.x += line.speed

      ctx.fillStyle = `rgba( ${line.color.r}, ${line.color.g}, ${line.color.b}, ${line.opacity} )`
      ctx.beginPath()
      line.draw( ctx )
      ctx.fill()
    } )
  }
}
