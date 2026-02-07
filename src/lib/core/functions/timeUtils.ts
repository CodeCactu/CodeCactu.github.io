type DateParts = {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  second: string
  milis: string
}

export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

export type DateString =
  | `${number}-${number}-${number}T${number}:${number}:${number}`
  | `${number}-${number}-${number}T${number}:${number}:${number}Z`

export function formatDate( date:Date | string | number = new Date(), format = `YYYY.MM.DD hh:mm` ) {
  const dateParts = getDateparts( date )

  return `${format}`
    .replace( /YYYY/, dateParts.year as string )
    .replace( /YY/, dateParts.year.slice( -2 ) )
    .replace( /MM/, dateParts.month )
    .replace( /DD/, dateParts.day as string )
    .replace( /hh/, dateParts.hour as string )
    .replace( /mm/, dateParts.minute as string )
    .replace( /ss/, dateParts.second as string )
    .replace( /ms/, dateParts.milis.toString().slice( -4 ) )
}

export function getDateparts( date:Date | string | number = new Date() ): DateParts {
  const time = typeof date === `number` ? date : new Date( date ).getTime()
  const options:Intl.DateTimeFormatOptions = {
    year: `numeric`,
    month: `2-digit`,
    day: `2-digit`,
    hour: `2-digit`,
    minute: `2-digit`,
    second: `2-digit`,
  }

  const parts = new Intl.DateTimeFormat( `pl`, options ).formatToParts( time )
  const partsDescribedInOptions = parts.filter( ({ type }) => type in options )
  const processedParts = Object.fromEntries( partsDescribedInOptions.map( ({ type, value }) => [ type, value ] ) )

  return { ...processedParts, milis:time.toString().slice( -4 ) } as DateParts
}

export function isValidDatePattern( pattern:string ) {
  return !isNaN( Date.parse( pattern ) )
}



/*\
 * Calendar
\*/

export type WeekDays<TDay> = [ TDay, TDay, TDay, TDay, TDay, TDay, TDay ]
export type DayData = {
  dayDate: Date
  isCurrentDay: boolean
}

export type Calendar = {
  weekDayIndices: WeekDays<number>
  beforeMonthdays: DayData[]
  monthsDays: DayData[]
  afterMonthDays: DayData[]
}

export function getDaysInMonth( year:number, month:number ) {
  return new Date( year, month, 0 ).getDate() || 7
}

export function getWeekDayOfFirstMonthDay( year:number, month:number ) {
  return new Date( year, month - 1, 1 ).getDay() || 7
}
export function getWeekDayOfLastMonthDay( year:number, month:number ) {
  return new Date( year, month, 0 ).getDay() || 7
}

export function getCalendar( year:number, month:number ) {
  const calendar:Calendar = {
    weekDayIndices: [ 1, 2, 3, 4, 5, 6, 7 ],
    beforeMonthdays: [],
    monthsDays: [],
    afterMonthDays: [],
  }

  const firstMonthDay = getWeekDayOfFirstMonthDay( year, month )
  const todayTime = new Date().setHours( 0, 0, 0, 0 )

  const getDayData = (dayIndex:number) => {
    const dayDate = new Date( year, month - 1, dayIndex )
    return {
      dayDate,
      isCurrentDay: todayTime === dayDate.getTime(),
    }
  }

  for (let dayIndex = firstMonthDay - 2;  dayIndex >= 0;  --dayIndex) {
    calendar.beforeMonthdays.push( getDayData( -dayIndex ) )
  }

  for (let dayIndex = 1;  dayIndex <= getDaysInMonth( year, month );  ++dayIndex) {
    calendar.monthsDays.push( getDayData( dayIndex ) )
  }

  const countOfDaysBeforeNextMonths = calendar.beforeMonthdays.length + calendar.monthsDays.length
  for (let dayIndex = 1;  dayIndex <= 42 - countOfDaysBeforeNextMonths;  ++dayIndex) {
    calendar.afterMonthDays.push( getDayData( calendar.monthsDays.length + dayIndex ) )
  }

  return calendar
}
