import { UiManager, UiManagerHolder } from "@lib/dynamicUi"

type Point = {
  x: number
  y: number
}

type Color = {
  r: number
  g: number
  b: number
}

export class Line {
  showing = true

  constructor(
    public x:number,
    public y:number,
    public width:number,
    public length:number,
    public showingSpeed:number,
    public speed:number,
    public opacity:number,
    public color:Color,
  ) {}

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

  constructor( divRef:HTMLDivElement ) {
    this.uiManager = new UiManager( divRef )
    this.ctx = this.uiManager.registerCtx( `main`, `canvas` )
    this.generateObjects()
    this.uiManager.startLoop( () => this.update() )
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
    line.color = color

    return line
  }

  update() {
    const { ctx, lines } = this
    const { width:canvasWidth, height:canvasHeight } = ctx.canvas

    ctx.clearRect( 0, 0, canvasWidth, canvasHeight )

    lines.forEach( line => {
      const { x, showing, opacity, showingSpeed, speed, color } = line

      ctx.fillStyle = `rgba( ${color.r}, ${color.g}, ${color.b}, ${opacity} )`
      ctx.beginPath()
      line.draw( ctx )
      ctx.fill()

      line.opacity += showingSpeed * (showing ? 0.003 : -0.003)

      if (line.opacity <= 0) {
        line.opacity = 0
        line.showing = true
      } else if (line.opacity >= 1) {
        line.opacity = 1
        line.showing = false
      }

      if (x > canvasWidth) this.createLine( line, true )
      else line.x += speed
    } )
  }
}
