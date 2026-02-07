import { useImperativeHandle, useRef, useState } from "react"

export type InputEvent<T> = T & { value: string, setValue: (value:string) => void }
export type InputFocusEvent = InputEvent<React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>>
export type InputChangeEvent = InputEvent<React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>>
export type InputChangeParameterType<TRef> = boolean | string | FileList | React.ChangeEvent<TRef>
export type InputOnChange<TRef, TValues = InputChangeParameterType<TRef>> = (eOrcheckOrVal:TValues) => void
export type InputOnBlur<TRef> = (e:React.FocusEvent<TRef>) => void

export type InputProps<TRef, TValues> = {
  ref?: React.ForwardedRef<TRef | null>
  value?: string
  checked?: boolean
  defaultValue?: string
  defaultChecked?: boolean
  ensureControlledState?: boolean
  onChange?: InputOnChange<TRef, TValues>
  onBlur?: InputOnBlur<TRef>
  validate?: (newValue:string) => string
}
export type NativeInputProps<TRef extends HTMLElement, TValues> = {
  ref?: React.RefObject<null | TRef>
  value?: string
  checked?: boolean
  defaultValue?: string
  defaultChecked?: boolean
  onChange: InputOnChange<TRef, TValues>
}

export default function useFormInputStateProps<
  TRef extends HTMLTextAreaElement | HTMLInputElement = HTMLInputElement,
  TValues extends InputChangeParameterType<TRef> = InputChangeParameterType<TRef>
>({ value:externalValue, checked:externalChecked, defaultValue, defaultChecked, ...props }:InputProps<TRef, TValues>) {
  const ref = useRef<TRef>( null )

  useImperativeHandle( props.ref, () => ref.current as TRef )

  const [ internalState, setInternalState ] = useState({
    value: !props.ensureControlledState || externalValue ? undefined : defaultValue,
    checked: !props.ensureControlledState || externalChecked ? undefined : defaultChecked,
    files: undefined as FileList | undefined,
  })

  const currentValue = externalValue ?? internalState.value ?? ``
  const currentChecked = externalChecked ?? internalState.checked ?? false

  const inputStateProps:NativeInputProps<TRef, TValues> = {
    ref,
    onChange: (eOrcheckOrVal:Parameters<InputOnChange<TRef, TValues>>[0]) => {
      if (eOrcheckOrVal instanceof FileList) {
        setInternalState({ value:undefined, checked:undefined, files:eOrcheckOrVal })
        props.onChange?.( eOrcheckOrVal )
        return
      }

       
      let [ newValue, newChecked ] = typeof eOrcheckOrVal === `boolean` ? [ externalValue, eOrcheckOrVal ]
        : typeof eOrcheckOrVal === `string` ? [ eOrcheckOrVal, externalChecked ]
          : [ eOrcheckOrVal.target.value, eOrcheckOrVal.target.tagName === `INPUT` ? (eOrcheckOrVal.target as HTMLInputElement).checked : undefined ]

      if (typeof newValue === `string` && props.validate) newValue = props.validate( newValue )

      const isChangedValue = newValue !== currentValue
      const isChangedChecked = newChecked !== currentChecked

      if (!isChangedValue && !isChangedChecked && (typeof eOrcheckOrVal !== `object` || (eOrcheckOrVal.currentTarget as HTMLInputElement).files?.length === 0)) return
      if (props.ensureControlledState) setInternalState({
        value: externalValue ? undefined : newValue ?? internalState.value,
        checked: externalChecked ? undefined : newChecked ?? internalState.checked,
        files: typeof eOrcheckOrVal === `object` ? (eOrcheckOrVal.currentTarget as HTMLInputElement).files ?? undefined : undefined,
      })

      props.onChange?.( eOrcheckOrVal )
    },
  }

  if (internalState.value !== undefined || externalValue !== undefined) inputStateProps.value = internalState.value ?? externalValue
  if (internalState.checked !== undefined || externalChecked !== undefined) inputStateProps.checked = internalState.checked ?? externalChecked
  if (inputStateProps.value === undefined && defaultValue !== undefined) inputStateProps.defaultValue = defaultValue
  if (inputStateProps.checked === undefined && defaultChecked !== undefined) inputStateProps.defaultChecked = defaultChecked

  const isControlled = inputStateProps.value !== undefined || inputStateProps.checked !== undefined

  return [ inputStateProps, isControlled ] as const
}

export const inputValueTesters = {
  checkIsEmail: (v:string) => /[\w.-]+@[\w.-]+\.[a-z]{2,}$/.test( v ),
  checkIsName: (v:string) => /^\p{L}[ \p{L}\p{M}.'-]{0,254}$/u.test( v ),
}
