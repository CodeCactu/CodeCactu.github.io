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
    constructor( x, y, width, length ) {
      this.x = x
      this.y = y
      this.width = width
      this.length = length
    }
  }

  /** @type {BackgroundLines.Line[]} */
  lines = []

  generateObjects() {
    const { lines } = this
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const random = (min, max) =>
      Math.floor( Math.random() * (max - min + 1) ) + min
    const distance = ({ x:aX, y:aY }, { x:bX, y:bY }) =>
      Math.sqrt( (aX - bX) ** 2 + (aY - bY) ** 2 )

    lines.splice( 0 )

    for (let fails = 0; fails < 100;) {
      const x = random( 0, windowWidth )
      const y = random( 0, windowHeight )
      const width = random( 1, 3 )
      const length = random( 10, 50 )

      const line = new BackgroundLines.Line( x, y, width, length )
      let addIt = true

      for (const { x, y } of lines) if (distance( line, { x, y } ) < 100) {
        addIt = false
        break
      }

      if (addIt) lines.push( line )
      else fails++
    }
  }

  animate = () => {
    const { ctx, lines } = this

    ctx.fillStyle = `red`

    lines.forEach( ({ x, y, width, length }) => {
      ctx.beginPath()
      ctx.fillRect( x, y - width / 2, length, width )
    } )
  }
}