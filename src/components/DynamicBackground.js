import React from "react"

export class DynamicBackground extends React.Component {
  /** @type {React.RefObject<HTMLCanvasElement>} */
  ref = React.createRef()

  /** @type {CanvasRenderingContext2D} */
  ctx = null

  componentDidMount() {
    const canvas = this.ref.current
    const ctx = canvas.getContext( `2d` )

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.ctx = ctx
    this.generateObjects()

    requestAnimationFrame( this.animate )
  }

  generateObjects() {
    throw new Error( `You should override that method` )
  }

  animate() {
    throw new Error( `You should override that method` )
  }

  render = () => <canvas className="dynamic_background" ref={this.ref} />
}

export default class BackgroundLines extends DynamicBackground {
  static Line = class Line {
    constructor( x, y, width, length, showingSpeed, speed ) {
      this.x = x
      this.y = y
      this.width = width
      this.length = length

      this.showingSpeed = showingSpeed
      this.speed = speed

      this.showing = true
      this.opacity = 0
    }
  }

  /** @type {BackgroundLines.Line[]} */
  lines = []

  generateObjects() {
    const { lines } = this
    const distance = ({ x:aX, y:aY }, { x:bX, y:bY }) =>
      Math.sqrt( (aX - bX) ** 2 + (aY - bY) ** 2 )

    lines.splice( 0 )

    for (let fails = 0; fails < 100;) {
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

  createLine( line, xZero=false ) {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const random = (min, max) =>
      Math.floor( Math.random() * (max - min + 1) ) + min

    const x = xZero ? 0 : random( 0, windowWidth )
    const y = random( 0, windowHeight )
    const width = random( 1, 3 )
    const length = random( 10, 50 )
    const showingSpeed = random( 2, 5 )
    const speed = random( 1, 10 ) / 10

    if (line) {
      line.x = x
      line.y = y
      line.width = width
      line.length = length
      line.showingSpeed = showingSpeed
      line.speed = speed
    } else return new BackgroundLines.Line( x, y, width, length, showingSpeed, speed )
  }

  animate = () => {
    const { ctx, lines } = this
    const { width:canvasWidth, height:canvasHeight } = ctx.canvas

    ctx.clearRect( 0, 0, canvasWidth, canvasHeight )

    lines.forEach( line => {
      const { x, y, width, length, showing, opacity, showingSpeed, speed } = line

      ctx.fillStyle = `#444444${(opacity).toString( 16 ).padStart( 2, 0 )}`
      ctx.fillRect( x, y - width / 2, length, width )

      line.opacity += showingSpeed * (showing ? 1 : -1)

      if (line.opacity <= 0) {
        line.opacity = 0
        line.showing = true
      } else if (line.opacity >= 255) {
        line.opacity = 255
        line.showing = false
      }

      if (x > canvasWidth) this.createLine( line, true )
      else line.x += speed
    } )

    requestAnimationFrame( this.animate )
  }
}