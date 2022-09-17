export default class DynamicBackgroundBase {
  ctx:CanvasRenderingContext2D

  constructor( canvasElement:HTMLCanvasElement ) {
    this.ctx = canvasElement.getContext( `2d` )!
  }

  onResize = () => {
    const { canvas } = this.ctx

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.generateObjects()
  }

  enable() {
    window.addEventListener( `resize`, this.onResize )

    this.onResize()
    this.generateObjects()

    requestAnimationFrame( this.animate )
  }

  disable() {
    window.removeEventListener( `resize`, this.onResize )
  }

  generateObjects() {
    throw new Error( `You should override that method` )
  }

  animate() {
    throw new Error( `You should override that method` )
  }
}
