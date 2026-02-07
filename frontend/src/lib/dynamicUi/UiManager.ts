"use client"

import { useRef } from "react"
import { Primitive } from "@lib/core/types"
import Loop from "./Loop"

export type UiData = Record<string, Primitive>
export type UiUpdater<T extends UiData = UiData> = (data:T) => void
export type LoopCallback = (timestamp:number) => void

type RegisteredEvent = {
  element: Window | HTMLElement
  eventname: string
  handler: (e:any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default class UiManager<TEle extends HTMLElement> {
  loop = new Loop()
  #registeredEvents = new Set<RegisteredEvent>()

  ctxs = new Map<string, CanvasRenderingContext2D>()
  rootElement: TEle

  constructor( rootElement:TEle ) {
    this.rootElement = rootElement
  }
  registerEvent<TEv extends keyof HTMLElementEventMap>(element:Window | HTMLElement, eventname:TEv, handler:(e:HTMLElementEventMap[TEv]) => void) {
    this.#registeredEvents.add({ element, eventname, handler })
    element.addEventListener( eventname, handler as EventListener )
  }

  registerCtx( name:string, canvasSelector:string | HTMLCanvasElement ) {
    const maybeCanvas:null | HTMLCanvasElement = typeof canvasSelector !== `string` ? canvasSelector : this.rootElement.querySelector( canvasSelector )
    const ctx = maybeCanvas?.getContext( `2d` )

    if (typeof canvasSelector === `string` && !maybeCanvas) throw new Error( `Canvas "${name}" not found with provided selector: "${canvasSelector}"` )
    if (!ctx) throw new Error( `Cannot create 2D context for "${name}" canvas` )

    const resizeHandler = () => {
      ctx.canvas.width = ctx.canvas.clientWidth
      ctx.canvas.height = ctx.canvas.clientHeight
    }

    this.ctxs.set( name, ctx )
    this.registerEvent( window, `resize`, resizeHandler )
    resizeHandler()

    return ctx
  }

  startLoop( cb:LoopCallback ) {
    this.loop.startLoop( cb )
  }

  pauseLoop() {
    this.loop.pauseLoop()
  }

  resumeLoop() {
    this.loop.resumeLoop()
  }

  dispose() {
    console.log( `dispose` )
    this.loop.pauseLoop()
    this.#registeredEvents.forEach( data => {
      data.element.removeEventListener( data.eventname, data.handler )
    } )
  }
}

export interface UiManagerHolder {
  uiManager: UiManager<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  uiData: UiData
}

export function useUiManager<TRoot extends HTMLElement, THolder extends UiManagerHolder>( handler:(ref:TRoot) => THolder ) {
  const managerHolderRef = useRef<THolder>( null )

  const handleRef = (ref:null | TRoot) => {
    if (ref) managerHolderRef.current = handler( ref )
    else managerHolderRef.current?.uiManager.dispose()
  }

  return [ handleRef, managerHolderRef ] as const
}
