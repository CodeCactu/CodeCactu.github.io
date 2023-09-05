import UIController from "../UIController"

let i = 0

export default class CactuGradientsController extends UIController {
  constructor( canvas:HTMLCanvasElement ) {
    super( canvas )
    this.registerCtx( `main`, canvas )
  }

  logic() {
    // Enjoy the silence
  }

  draw() {
    const { ctxs, wrapperShape } = this
    const ctx = ctxs.get( `main` )!

    ctx.strokeStyle = `red`

    ctx.arc( wrapperShape.center.x, wrapperShape.center.y, 5, 0, Math.PI * 2 )
    ctx.stroke()

    console.log( i++, wrapperShape )
  }
}
