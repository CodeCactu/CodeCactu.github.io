/** The languages the app is translated to. The first is the default: every slice's texts must exist in it */
export const languages = [ `pl` ] as const

export type Language = typeof languages[number]

export const defaultLanguage:Language = languages[ 0 ]
