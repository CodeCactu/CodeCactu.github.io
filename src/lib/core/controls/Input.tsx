"use client"

import { useRef, useState, useEffect } from "react"
import select from "@lib/core/functions/select"
import copy from "@lib/core/functions/copy"
import { InputOnBlur, InputOnChange } from "../hooks/useFormInputStateProps"
import cn from "../functions/createClassName"
import { AutoComplete } from "./autocomplete"
import classes from "./Input.module.css"

export const inputIsHiddenClassName = classes.isHidden

export type InputType = `text` | `multiline-text` | `password`

export type InputProps = {
  className?: string | { override: undefined | string }
  value?: string
  initialValue?: string
  style?: React.CSSProperties
  width?: number | string
  type?: InputType
  name: string
  disabled?: boolean
  readOnly?: boolean | `mode-disabled` | `mode-copy`
  maxLength?: number
  minLength?: number
  rows?: number
  placeholder?: string
  onBlur?: InputOnBlur<HTMLInputElement>
  onChange?: InputOnChange<HTMLInputElement>
  onCopy?: (value:string) => void | null | string
  autoComplete?: AutoComplete
  validate?: (value:string) => string
}

export default function Input( props:InputProps ) {
  const [ datasetProp, setDatasetProp ] = useState<undefined | string>( undefined )
  const [ internalValue, setInternalValue ] = useState<undefined | string>( props.value == undefined ? props.initialValue ?? `` : undefined )
  const inputRef = useRef<null | HTMLInputElement | HTMLTextAreaElement>( null )

  const inputType = select( props.type, {
    "multiline-text": `text`,
    password: `password`,
    default: `text`,
  } )

  const value = props.value ?? internalValue
  const nativeInputProps = {
    name: props.name,
    className: typeof props.className === `object` ? props.className.override : cn( classes.input, props.className ),
    style: props.style,
    defaultValue: props.initialValue,
    disabled: props.disabled,
    readOnly: !!props.readOnly,
    maxLength: props.maxLength,
    minLength: props.minLength,
    autoComplete: props.autoComplete,
    placeholder: props.placeholder,
    [ `data-copyable` ]: props.readOnly === `mode-copy` ? `` : undefined,
    value,
    onBlur: (e:React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (!props.onBlur) return
      props.onBlur?.( e as React.FocusEvent<HTMLInputElement> )
    },
    onChange: (e:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      let newValue = e.target.value

      if (props.validate) newValue = props.validate( newValue )

      if (newValue === value) return
      if (props.value === undefined) setInternalValue( newValue )
      props.onChange?.( e as React.FocusEvent<HTMLInputElement> )
    },
  }

  if (props.width) {
    nativeInputProps.style ||= {}
    nativeInputProps.style.width = typeof props.width === `number`
      ? `min( ${props.width}px, 100% )`
      : `min( ${props.width}, 100% )`
  }


  useEffect( () => {
    const input = inputRef.current

    if (!input || props.readOnly !== `mode-copy`) return

    const handler = async() => {
      const value = props.value ?? props.initialValue ?? ``

      const checkedValue = props.onCopy?.( value )
      const overrridedValue = checkedValue === null ? undefined : checkedValue ?? value

      if (overrridedValue) await copy( overrridedValue )

      setDatasetProp( `copied` )
    }

    input.addEventListener( `click`, handler )
    return () => input.removeEventListener( `click`, handler )
  }, [ props.readOnly, props.value, props.initialValue ] ) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect( () => {
    const id = setTimeout( () => setDatasetProp( undefined ), 1000 )
    return () => clearTimeout( id )
  }, [ datasetProp ] )


  return props.type === `multiline-text` ? (
    <textarea
      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
      rows={props.rows}
      {...nativeInputProps}
    />
  ) : (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type={inputType}
      {...nativeInputProps}
    />
  )
}
