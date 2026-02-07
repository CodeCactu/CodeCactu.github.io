import { JSONValue } from "@lib/core/types"

export type EnvVarKey = Uppercase<string>
export type EnvVarValue = undefined | JSONValue
export type EnvVarConfig = {
  rawValue: undefined | string
  description?: string
  parser?: (envValue:string) => EnvVarValue
}

export type EnvVarsConfigs = Record<EnvVarKey, EnvVarConfig>

export type EnvObj<T extends EnvVarsConfigs> = {
  [ Key in keyof T ]:T[Key] extends EnvVarConfig ? (undefined extends T[Key][`parser`] ? string : ReturnType<NonNullable<T[Key][`parser`]>>) : never
}

export function prepareConfig<T extends EnvVarsConfigs>( envVarConfigs:T ) {
  type Key = Extract<keyof T, EnvVarKey>

  const envVars = {} as EnvObj<T>

  for (const envConfig of Object.entries( envVarConfigs )) {
    const [ varName, varConfig ] = envConfig as [ Key, EnvVarConfig ]
    const env = varConfig.rawValue

    envVars[ varName ] = (env !== undefined && varConfig.parser ? varConfig.parser( env ) : env) as typeof envVars[ Key ]
  }

  return [ envVars ] as const
}
