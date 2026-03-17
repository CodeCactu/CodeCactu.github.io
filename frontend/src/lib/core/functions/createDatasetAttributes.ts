import { makeKebabCaseFromCamelCase } from "./stringUtils"

export type Dataset = Record<string, string | number>

export default function createDatasetAttributes( dataset:Dataset = {} ) {
  return Object.fromEntries(
    Object.entries( dataset ).map( ([ k, v ]) => [ `data-${makeKebabCaseFromCamelCase( k )}`, v ] ),
  )
}
