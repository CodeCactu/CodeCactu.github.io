import { UiManager, UiManagerHolder } from "@lib/dynamicUi"

let i = 0

export default class CactuGradientsController implements UiManagerHolder {
  uiManager: UiManager<HTMLDivElement>
  ctx: CanvasRenderingContext2D
  uiData = {
    test: true,
  }


  constructor( root:HTMLDivElement ) {
    this.uiManager = new UiManager( root )
    this.ctx = this.uiManager.registerCtx( `main`, `canvas` )

    this.uiManager.startLoop( () => {
      this.draw()
    } )
  }

  logic() {
    // Enjoy the silence
  }

  draw() {
    const { ctx } = this

    ctx.strokeStyle = `red`

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height )

    ctx.beginPath()
    ctx.arc( i % ctx.canvas.width, ctx.canvas.height / 2, 5, 0, Math.PI * 2 )
    ctx.stroke()

    i++
  }
}
