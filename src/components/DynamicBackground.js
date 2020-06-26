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
  state = {}

  generateObjects() {
  }
}