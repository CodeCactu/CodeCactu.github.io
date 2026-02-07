"use client"

import { useEffect, useState, useRef } from "react"
import cn from "../functions/createClassName"
import "./Accordion.css"
import classes from "./Accordion.module.css"

export type AccordionProps = {
  className?: string
  style?: React.CSSProperties
  titleClassName?: string
  bodyClassName?: string
  children?: React.ReactNode
  body?: React.ReactNode
  title: React.ReactNode
  onClick?: (state:boolean) => void
  opened?: boolean
}

const AccordionState = {
  OPENING: `OPENING`,
  OPEN: `OPEN`,
  CLOSING: `CLOSING`,
  CLOSED: `CLOSED`,
}

export default function Accordion({ title, children, body, onClick, opened:externalIsOpen, className, style, titleClassName, bodyClassName }:AccordionProps) {
  children ||= body

  const bodyRef = useRef<HTMLDivElement>( null )
  const [ state, setState ] = useState( AccordionState.CLOSED )

  const open = () => {
    const body = bodyRef.current

    if (!body) return

    setState( AccordionState.OPENING )

    body.classList.add( classes.isOpening )
    body.addEventListener(
      `animationend`,
      () => setState( AccordionState.OPEN ),
      { once:true },
    )
  }

  const close = () => {
    const body = bodyRef.current
    if (!body) return

    setState( AccordionState.CLOSING )

    body.classList.add( classes.isClosing )
    body.addEventListener( `animationend`, () => {
      setState( AccordionState.CLOSED )
    }, { once:true } )
  }

  const handleTitleClick = () => {
    if ([ AccordionState.OPENING, AccordionState.CLOSING ].includes( state )) return
    if (typeof externalIsOpen === `boolean`) return onClick?.( externalIsOpen )

    if (state === AccordionState.OPEN) close()
    else open()
  }

  const handleAccordionClick = (e:React.MouseEvent<HTMLDetailsElement, MouseEvent>) => {
    if (e.nativeEvent.composedPath().some( e => `tagName` in e && e.tagName === `SUMMARY` )) e.preventDefault()
  }

  useEffect( () => {
    if (typeof externalIsOpen !== `boolean`) return
    if (externalIsOpen) open()
    else close()
  }, [ externalIsOpen ] )

  useEffect( () => {
    if (state !== AccordionState.OPEN && state !== AccordionState.CLOSED) return
    bodyRef.current?.removeAttribute( `class` )
  }, [ state ] )

  return (
    <details
      onClick={handleAccordionClick}
      className={className}
      style={style}
      open={state !== AccordionState.CLOSED}
    >
      <summary onClick={handleTitleClick} className={titleClassName}>
        {title}
      </summary>

      <div ref={bodyRef} className={cn( classes.body )}>
        <div className={bodyClassName}>
          {children}
        </div>
      </div>
    </details>
  )
}
