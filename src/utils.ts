export const getMilliseconds = (minutes: number) => {
  return (60 * minutes) * 1000
}

export const prettifyDate = (date: Date, includeTime = true): string => {
  const tzOffset = date.getTimezoneOffset()
  const corrected = new Date(date.getTime() - (getMilliseconds(tzOffset)))

  const d = corrected.toISOString().split('T')[0]
  const t = corrected.toISOString().slice(11, 16)

  if (includeTime) {
    return `${d} ${t}`
  } else {
    return d
  }
}

export const generateID = (): string => {
  return Math.random().toString(16).substring(2, 10)
}

export const getRandomNumber = (min: number, max: number) => {
  const _min = Math.floor(min)
  const _max = Math.ceil(max)

  return Math.floor(Math.random() * (_max - _min + 1) + _min)
}
