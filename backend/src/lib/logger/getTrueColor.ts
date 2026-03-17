export type TrueColor = [ red:number, green:number, blue:number ]
export type TrueColorConfig = {
  fg?: TrueColor
  bg?: TrueColor
  isBold?: boolean
}

export default function getTrueColor( text:string, config:TrueColorConfig ) {
  const { fg, bg, isBold } = config
  const b = isBold ? `1;` : ``
  const f = fg ? `38;2;${fg.join( `;` )};` : ``
  const bkg = bg ? `48;2;${bg.join( `;` )}` : ``
  const fullCode = `\x1b[${b}${f}${bkg}`.replace( /;$/, `` ) + `m`

  return `${fullCode}${text}\x1b[0m`
}
