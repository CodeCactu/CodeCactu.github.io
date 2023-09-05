import { useRef } from "react"

export class ElementShape<T extends HTMLElement> {
  element: T
  width: number
  height: number
  center: {
    x: number
    y: number
  }

  constructor( element:T ) {
    this.element = element
    this.width = element.clientWidth
    this.height = element.clientHeight
    this.center = {
      x: element.clientWidth / 2,
      y: element.clientHeight / 2,
    }
  }

  setDimensions( width:number, height:number ) {
    this.width = width
    this.height = height
    this.center = {
      x: width / 2,
      y: height / 2,
    }
  }
}

export default abstract class UIController {
  #loopId: number = -1
  ctxs = new Map<string, CanvasRenderingContext2D>()
  wrapperShape: ElementShape<HTMLElement>

  constructor( canvas:HTMLElement ) {
    this.wrapperShape = new ElementShape( canvas )
    this.enable()
  }

  enable() {
    window.addEventListener( `resize`, this.#handleResize )
    this.#handleResize()
    this.startLoop()
  }

  disable() {
    window.removeEventListener( `resize`, this.#handleResize )
    this.stopLoop()
  }

  startLoop() {
    const loop = () => requestAnimationFrame( () => {
      this.draw()

      this.#loopId = window.setTimeout( loop, 1000 )
    } )

    loop()
  }

  stopLoop() {
    window.clearTimeout( this.#loopId )
  }

  #setupCanvas( canvas:HTMLCanvasElement ) {
    canvas.width = this.wrapperShape.element.clientWidth
    canvas.height = this.wrapperShape.element.clientHeight
  }

  #handleResize = () => {
    this.wrapperShape.setDimensions( this.wrapperShape.element.clientWidth, this.wrapperShape.element.clientHeight )
    this.ctxs.forEach( ctx => this.#setupCanvas( ctx.canvas ) )
  }

  protected registerCtx( name:string, canvasSelector:string | HTMLCanvasElement ) {
    const maybeCanvas:null | HTMLCanvasElement = typeof canvasSelector !== `string` ? canvasSelector : this.wrapperShape.element.querySelector( canvasSelector )
    const ctx = maybeCanvas?.getContext( `2d` )

    if (!ctx) throw new Error( `Cannot create 2D context for "${name}" canvas` )

    this.ctxs.set( name, ctx )
    this.#setupCanvas( ctx.canvas )
  }

  abstract draw(): void
  abstract logic(): void
}

export function useUIControllerHandler<Ele extends HTMLElement, Ctrl extends UIController>( handler:(ref:Ele) => Ctrl ): [(ref:Ele) => void, null | Ctrl] {
  const controllerRef = useRef<null | Ctrl>(null)

  const handleRef = (ref:Ele) => {
    if (ref) controllerRef.current = handler( ref )
    else controllerRef.current?.disable()
  }

  return [ handleRef, controllerRef.current ]
}
