export function createClassName( ...classes ) {
  return classes.reduce(
    (str, name) => name && typeof name === `string` ? `${str} ${name.trim()}` : str
    , ``,
  ).trim()
}

export default function cn( ...classes ) {
  return createClassName( ...classes )
}

