import { JSONValue } from "@lib/core/types"

export type EnvVarKey = Uppercase<string>
export type EnvVarValue = undefined | JSONValue
export type EnvVarConfig = {
  rawValue: undefined | string
  description?: string
} & (
  {
    optional?: false
    parser?: (envValue:string) => EnvVarValue
  } | {
    optional: true
    parser?: (envValue:undefined | string) => EnvVarValue
  }
)

export type EnvVarsConfigs = Record<EnvVarKey, EnvVarConfig>

export type EnvObj<T extends EnvVarsConfigs = EnvVarsConfigs> = {
  [ Key in keyof T ]:T[Key] extends { parser: (envValue:string) => infer R }
    ? R
    : T[Key] extends { optional: true } ? undefined | string : string
}

export type ConfigPreparerOptions<TInherited extends EnvObj = {}> = { // eslint-disable-line @typescript-eslint/no-empty-object-type
  inherited?: TInherited
}

export function prepareConfig<T extends EnvVarsConfigs, TInherited extends EnvObj = {}>( envVarConfigs:T, { inherited }:ConfigPreparerOptions<TInherited> = {} ) { // eslint-disable-line @typescript-eslint/no-empty-object-type
  type Key = Extract<keyof T, EnvVarKey>

  const envVars = { ...inherited } as EnvObj<T> & TInherited

  for (const envConfig of Object.entries( envVarConfigs )) {
    const [ varName, varConfig ] = envConfig as [ Key, EnvVarConfig ]
    const env = varConfig.rawValue

    envVars[ varName ] = (env !== undefined && varConfig.parser ? varConfig.parser( env ) : env) as typeof envVars[ Key ]
  }

  const proxiedEnvVars = new Proxy( envVars, {
    get( target, property ) {
      if (typeof window !== `undefined`) {
        const config = window.clientConfig as undefined | T
        return config?.[ property as Key ]
      }

      return target[ property as Key ]
    },
  } )

  return [ proxiedEnvVars, {} as TInherited ] as const
}

declare global {
  interface Window {
    clientConfig?: EnvVarConfig
  }
}
