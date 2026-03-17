import { useReducer, useRef, useState } from "react"
import { InputChangeParameterType, InputOnBlur, InputOnChange } from "./useFormInputStateProps"

export type ValidatorData = Omit<FormInputData, `validator`>
export type InputEventAction = `change` | `blur`
export type InputValidator = (action:InputEventAction, newData:ValidatorData, oldData:ValidatorData) => ValidatorData

export type FormInputConfig = {
  required?: boolean
  initialValue?: string
  fieldset?: string
  initiallyChecked?: boolean
  initialFiles?: FileList
  validator?: keyof typeof validators | RegExp | InputValidator

}

export type FormInputData = FormInputConfig & {
  value?: string
  checked?: boolean
  files?: FileList
  err: Set<string>
}

export type StringInputProps = {
  name: string
  value?: string
  checked?: boolean
  required?: boolean
  onChange: InputOnChange<HTMLInputElement>
  onBlur: InputOnBlur<HTMLInputElement>
}

export type FormConfiguration = Record<string, string | FormInputConfig>

export default function useFormState<T extends Omit<FormConfiguration, `name`>>( config:T ) {
  type InputName = keyof T
  type Values = Record<InputName, InputChangeParameterType<HTMLInputElement>>

  const [ isPending, setPending ] = useState( false )
  const formRef = useRef<HTMLFormElement>( null )
  const [ savedInitialConfig ] = useState( normalizeFormConfiguration( config ) )
  type FormValues = typeof savedInitialConfig
  type SetterFormValues = Partial<Record<InputName, Partial<FormInputData>>>

  const [ inputDataset, dispatch ] = useReducer( (prev:FormValues, next:SetterFormValues) => ({ ...prev, ...next } as FormValues), savedInitialConfig )

  const validateData = (action:InputEventAction, name:InputName, inputData = inputDataset[ name ]) => {
    const validator = inputData.validator

    if (!validator) return inputData
    const validatorFn:undefined | InputValidator = typeof validator === `string` ? validators[ validator ]
      : typeof validator === `function` ? validator
        : validator instanceof RegExp ? (_, data) => {
          if (!data.value || !validator.test( data.value )) data.err.add( `UNAPPLIED_PATTERN` )
          return data
        }
          : undefined

    if (!validatorFn) throw new Error( `Unreachable!` )

    return { ...inputData, ...validatorFn( action, inputData, { ...inputData, err:new Set() } ) }
  }

  const setInputValues = (values:Values) => {
    Object.entries( values ).forEach( ([ name, eOrVal ]) => {
      const inputData = inputDataset[ name ]
      const newInputData:undefined | FormInputData = eOrVal instanceof FileList ? { ...inputData, files:eOrVal, err:new Set() }
        : typeof eOrVal === `string` ? { ...inputData, value:eOrVal, err:new Set() }
          : typeof eOrVal === `boolean` ? { ...inputData, checked:eOrVal, err:new Set() }
            : typeof eOrVal === `object` ? {
              ...inputData,
              value: eOrVal.currentTarget.value,
              checked: eOrVal.currentTarget.checked,
              err: new Set(),
            }
              : undefined

      if (!newInputData) throw new Error( `Unreachable!` )

      dispatch( { [ name ]:validateData( `change`, name, newInputData ) } as SetterFormValues )
    } )
  }

  const getInputProps = <T extends `string` | `boolean` = `string`>(name:InputName, type?:T): T extends `string` ? Omit<StringInputProps, `checked`> : Omit<StringInputProps, `value`> => {
    const isCheckableInput = type ? type === `boolean` : `checked` in savedInitialConfig[ name ] || `initiallyChecked` in savedInitialConfig[ name ]
    const inputData = inputDataset[ name ]

    const inputProps = {
      name: name as string,
      onChange: eOrVal => setInputValues( { [ name ]:eOrVal } as Values ),
      onBlur: () => dispatch( { [ name ]:validateData( `blur`, name ) } as SetterFormValues ),
    } as StringInputProps

    if (!(`initialFiles` in inputData)) {
      inputProps.value = inputData.value
      inputProps.checked = isCheckableInput ? inputData.checked : undefined
    }

    if (`required` in inputData) inputProps.required = inputData.required

    return inputProps
  }

  const getFieldsetFields = (name:keyof { [K in keyof T as T[K] extends { fieldset: string } ? T[K][`fieldset`] : never]:K }) => {
    const entries = Object.entries( inputDataset ).map( ([ k, v ]) => v.fieldset === name ? [ k, v ] : null ).filter( e => e ) as [InputName, Omit<FormInputData, `name`>][]
    return Object.fromEntries( entries ) as Record<InputName, Omit<FormInputData, `name`>>
  }

  const resetFields = () => {
    dispatch( savedInitialConfig )
  }

  return [ inputDataset, { formRef, isPending, setPending, setInputValues, getInputProps, resetFields, getFieldsetFields } ] as const
}

function normalizeFormConfiguration<T extends Omit<FormConfiguration, `name`>>( config:T ) {
  const entries = Object.entries( config ).map<[keyof T, FormInputData]>( ([ k, v ]) => {
    const validatedInitialData = typeof v === `string`
      ? { name:k, value:v }
      : { ...v, name:k, value:v.initialValue ?? ``, checked:v.initiallyChecked }

    return [
      k,
      {
        ...validatedInitialData,
        err: new Set<string>(),
      },
    ]
  })

  return Object.fromEntries( entries ) as Record<keyof T, FormInputData>
}

export const validators = {
  name: (action, data) => {
    if (action !== `blur`) return data
    if (!data.value || !/^\p{L}[ \p{L}\p{M}.'-]{0,254}$/u.test( data.value )) data.err.add( `NOT_NAME` )
    return data
  },

  email: (action, data) => {
    if (action !== `blur`) return data
    if (!data.value || !/[\w.-]+@[\w.-]+\.[a-z]{2,}$/.test( data.value )) data.err.add( `NOT_EMAIL` )
    return data
  },
} as const satisfies Record<string, InputValidator>
