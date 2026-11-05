// YAML imports (tools/yaml.ts): their data is untyped here; the generated `_translation/index.ts` files give it a type

declare module "*.yml" {
  const data:unknown
  export default data
}

declare module "*.yaml" {
  const data:unknown
  export default data
}
