"use client"

import React, { useId, useMemo, useState } from "react"
import useFormInputStateProps from "../hooks/useFormInputStateProps"
import useElementClick from "../hooks/useElementClick"
import cn from "../functions/createClassName"
import { makeSpacing, makeStyleSpacings, SpacingsValue } from "../flow/makeStyleSpacings"
import { ResponsivePropertyValue, updateResponsivePropertiesToStyle } from "../flow/ResponsiveAreaNames"
import { inputIsHiddenClassName } from "./Input"
import classes from "./Dropdown.module.css"
import { ButtonProps } from "./ButtonInteractions"

export type DropdownOptionAsButton = {
  name: string
  label: React.ReactNode
  onClick?: ButtonProps[`onClick`]
}

export type DropdownOptionAsLabel = {
  name: string
  label: React.ReactNode
  value: string
  defaultChecked?: boolean
}

export type DropdownOption = DropdownOptionAsLabel | DropdownOptionAsButton

type ItemsRenderer = (props?:React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => React.ReactNode
export type ItemRendererConfig<T extends string | DropdownOption> = {
  option: T
  getItemKey: () => string
  Item: (props:{ children: React.ReactNode } & Pick<DropdownItemProps, `wrapperClassName` | `className` | `style` | `renderInput`>) => React.ReactNode
}
export type DropdownProps<T extends string | DropdownOption> = {
  name: string
  className?: string
  style?: React.CSSProperties
  margin?: ResponsivePropertyValue<SpacingsValue>
  checkedName?: string
  defaultCheckedName?: string
  optionsClassName?: string
  optionsFilter?: string
  hoverable?: boolean
  multiselect?: boolean | number
  options: T[]
  optionsReloadDependency?: unknown[]
  disableRelativeWrapper?: boolean
  chooseShouldCloseDropdown?: boolean
  disabled?: boolean
  onChange?: (value:T & DropdownOptionAsLabel) => void
  renderLabel?: (data:{
    values: (T & DropdownOptionAsLabel)[]
    htmlFor: string
    onClick: () => void
  }) => React.ReactNode
  renderCustomList?: (data:{
    renderItems: ItemsRenderer
  }) => React.ReactNode
  renderItem: (data:ItemRendererConfig<T>) => React.ReactNode
}

export default function Dropdown<T extends string | DropdownOption>({ className, style, margin, disabled, optionsFilter, disableRelativeWrapper, checkedName, defaultCheckedName, optionsClassName, chooseShouldCloseDropdown, name, multiselect, hoverable, onChange, renderLabel, renderCustomList, renderItem, options, optionsReloadDependency = [] }:DropdownProps<T>) {
  const [ inputProps ] = useFormInputStateProps({
    value: checkedName,
    ensureControlledState: true,
    defaultValue: typeof defaultCheckedName === `string`
      ? (options.find( o => isValueOption( o ) && o.name === defaultCheckedName ) as T & DropdownOptionAsLabel)?.name
      : undefined,
  })

  const [ isOpened, setOpened ] = useState( false )
  const dropdownRef = useElementClick<HTMLDivElement>({ activate:isOpened, withFocusChanges:true, cb:elementClicked => !elementClicked && setOpened( false ) })
  const id = `${useId()}input`

  const inputType = multiselect ? `checkbox` : `radio`
  const valueNames = new Set( (inputProps.value ?? inputProps.defaultValue)?.split( `,` ).filter( Boolean ) )
  const multiSelectLimit = typeof multiselect === `number` ? multiselect : !multiselect ? false : Infinity

  const finalStyle = { ...style }
  updateResponsivePropertiesToStyle( finalStyle, `margin`, margin, m => makeStyleSpacings( m, `margin` ), v => typeof v !== `object` && makeSpacing( v ) )

  const handleItemChangeEvent = (e:React.ChangeEvent<HTMLInputElement>, option:T & DropdownOptionAsLabel) => {
    if (valueNames.has( option.name )) valueNames.delete( option.name )
    else if (multiSelectLimit === false) {
      valueNames.clear()
      valueNames.add( option.name )
      window.queueMicrotask( () => e.target.focus() )
    } else if (valueNames.size < multiSelectLimit) valueNames.add( option.name )

    inputProps.onChange( [ ...valueNames ].join( `,` ) )
    onChange?.( option )

    const event = e.nativeEvent
    if (chooseShouldCloseDropdown && (!(event instanceof PointerEvent) || event.clientX !== 0 || event.clientY !== 0)) {
      setOpened( false )
    }
  }

  const selectedOptions = useMemo( () => {
    const selectedOptions:(T & DropdownOptionAsLabel)[] = []

    for (const option of options) {
      if (isValueOption( option ) && valueNames.has( option.name )) selectedOptions.push( option )
    }

    return selectedOptions
  }, [ inputProps.value ] )

  const optionsList = useMemo( () => {
    const optionsList:React.ReactNode[] = []
    let decorationId = 0

    for (const option of options) {
      if (optionsFilter && isLabelOption( option ) && !option.name.includes( optionsFilter ) && !option.value?.includes( optionsFilter )) continue
      optionsList.push( renderItem({
        option,
        getItemKey: () => typeof option === `object` ? option.name : `${decorationId++}`,
        Item: ({ children, ...props }) => {
          if (typeof option !== `object` || !(`value` in option)) throw new Error( `Select item should be an object with a value` )
          return (
            <DropdownItem
              key={option.name}
              name={multiselect ? `${name}:${option.name}` : name}
              {...props}
              label={children}
              onChange={e => handleItemChangeEvent( e, option as T & DropdownOptionAsLabel )}
              checked={valueNames.has( option.name )}
              type={inputType}
              value={option.value}
            />
          )
        },
      }) )
    }

    return optionsList
  }, [ inputProps.value, optionsFilter, ...optionsReloadDependency ] )

  const renderItems:ItemsRenderer = props => <ul {...props}>{optionsList}</ul>

  const optionsListWrapper = useMemo( () => {
    return renderCustomList
      ? <div className={cn( classes.options, optionsClassName )}>{renderCustomList({ renderItems })}</div>
      : renderItems({ className:cn( classes.options, optionsClassName ) })
  }, [ optionsList ] )

  return (
    <div ref={dropdownRef} className={cn( classes.dropdown, !disableRelativeWrapper && classes.optionsWrapper, hoverable && classes.isHoverable, className )} style={finalStyle}>
      <input type="checkbox" id={id} disabled={disabled} checked={isOpened} className={inputIsHiddenClassName} onChange={() => setOpened( b => !b )} />

      {
        renderLabel?.({
          htmlFor: id,
          onClick: () => {},
          values: selectedOptions,
        }) ?? (
          <label className={classes.dropdownLabel} htmlFor={id}>
            <span>Select</span>
            <output>{selectedOptions.map( o => <React.Fragment key={o.name}>{o.label}</React.Fragment> )}</output>
          </label>
        )
      }

      {optionsListWrapper}
    </div>
  )
}

export type DropdownItemInputProps = {
  type: `checkbox` | `radio`
  value: string
  name: string
  checked?: boolean
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void
}

export type DropdownItemProps =  Omit<DropdownItemInputProps, `value`> & Partial<Pick<DropdownItemInputProps, `value`>> & {
  wrapperClassName?: string
  className?: string
  style?: React.CSSProperties
  label: React.ReactNode
  renderInput?: (props:DropdownItemInputProps) => React.ReactNode
}

export function DropdownItem({ wrapperClassName, className, style, label, renderInput, ...inputProps }:DropdownItemProps) {
  const handleRef = (ref:HTMLInputElement) => {
    if (document.activeElement?.tagName === `BODY` && inputProps.checked) ref?.focus()
  }

  return (
    <li className={wrapperClassName} style={style}>
      <label className={className}>
        {
          inputProps.value && renderInput
            ? renderInput( inputProps as DropdownItemInputProps )
            : <input ref={handleRef} {...inputProps} className={inputIsHiddenClassName} />
        }
        {label}
      </label>
    </li>
  )
}

function isValueOption<T extends string | DropdownOption>(option:T): option is T & DropdownOptionAsLabel {
  return typeof option === `object` && `value` in option
}

function isLabelOption<T extends string | DropdownOption>(option:T): option is T & DropdownOption & Partial<Pick<DropdownOptionAsLabel, `value`>> {
  return typeof option === `object` && `label` in option
}
