import Loop from "../Loop"

type Point = {
  x: number
  y: number
}

type MouseHoverTile = Point & {
  createdAt: number
}

export default class CactuShadyTrail {
  ctx: CanvasRenderingContext2D
  uiData = {
    test: true,
  }

  tileSize = 10
  mouseTileHistory: MouseHoverTile[] = []
  loop = new Loop()

  constructor( canvas:HTMLCanvasElement ) {
    const ctx = canvas.getContext(`2d`)
    if (!ctx) throw new Error( `Cannot create canvas 2D context` )

    const style = window.getComputedStyle( canvas )
    canvas.width = parseInt( style.width )
    canvas.height = parseInt( style.height )

    this.ctx = ctx
    window.addEventListener( `mousemove`, e => this.handleMouseMove( e ) )
    this.loop.startLoop( () => this.update() )
  }

  update() {
    const { ctx, tileSize } = this
    const padding = 2

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height )

    ctx.shadowBlur = tileSize * 2
    ctx.shadowColor = `rgb(3, 49, 20)`

    for (let i = 0;  i < this.mouseTileHistory.length;  ++i) {
      const { x, y, createdAt } = this.mouseTileHistory[ i ]
      const seconds = Math.floor( (Date.now() - createdAt ) )

      if (seconds > 1000) {
        this.mouseTileHistory.splice( i )
        break
      }

      ctx.beginPath()
      ctx.fillStyle = `rgba( 0, 49, 20, ${1 - seconds / 1000} )`
      ctx.arc( x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, tileSize, 0, Math.PI * 2 )
      ctx.fill()
    }

    ctx.shadowBlur = 0
    ctx.fillStyle = `#fff2`

    for (const { x, y } of this.mouseTileHistory) {
      ctx.fillRect( x * tileSize + padding, y * tileSize + padding, tileSize - padding, tileSize - padding )
    }
  }

  getTileByabsoluteCoords( x:number, y:number ) {
    return {
      x: Math.floor( x / this.tileSize ),
      y: Math.floor( y / this.tileSize ),
    }
  }

  handleMouseMove( e:MouseEvent ) {
    const mouseTile = this.getTileByabsoluteCoords( e.clientX, e.clientY )
    const newestTile = this.mouseTileHistory[ 0 ]

    if (newestTile && newestTile.x === mouseTile.x && newestTile.y === mouseTile.y) return

    this.mouseTileHistory.unshift({ ...mouseTile, createdAt:Date.now() })
  }
}
