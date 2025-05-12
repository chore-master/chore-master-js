export function offsetInMinutesToTimedeltaString(
  offsetInMinutes: number
): string {
  const sign = offsetInMinutes >= 0 ? '+' : '-'
  const hours = Math.floor(Math.abs(offsetInMinutes) / 60)
  const minutes = Math.abs(offsetInMinutes) % 60
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}`
}

// export function UTCStringToDate(dateTime: string): Date {
//   let isoDateString = dateTime
//   if (!dateTime.endsWith('Z')) {
//     isoDateString = `${dateTime}Z`
//   }
//   return new Date(isoDateString)
// }

// export function localStringToUTCString(dateTime: string): string {
//   return new Date(dateTime).toISOString().slice(0, -5)
// }

// export function dateToLocalString(date: Date): string {
//   const offset = date.getTimezoneOffset() * 60000
//   const localDate = new Date(date.getTime() - offset)
//   return localDate.toISOString().slice(0, -1)
// }

// export function humanReadableRelativeDateTime(
//   dateTime: string,
//   baseDateTime: Date
// ): string {
//   const date = UTCStringToDate(dateTime)
//   const seconds = Math.floor((baseDateTime.getTime() - date.getTime()) / 1000)
//   const absoluteSeconds = Math.abs(seconds)
//   let suffix = ''
//   if (seconds < 0) {
//     suffix = '後'
//   } else if (seconds > 0) {
//     suffix = '前'
//   }
//   let unit
//   let interval
//   if (absoluteSeconds < 60) {
//     interval = absoluteSeconds
//     unit = '秒'
//   } else if (absoluteSeconds < 3600) {
//     interval = Math.floor(absoluteSeconds / 60)
//     unit = '分鐘'
//   } else if (absoluteSeconds < 86400) {
//     interval = Math.floor(absoluteSeconds / 3600)
//     unit = '小時'
//   } else if (absoluteSeconds < 2592000) {
//     interval = Math.floor(absoluteSeconds / 86400)
//     unit = '天'
//   } else if (absoluteSeconds < 31536000) {
//     interval = Math.floor(absoluteSeconds / 2592000)
//     unit = '個月'
//   } else {
//     interval = Math.floor(absoluteSeconds / 31536000)
//     unit = '年'
//   }
//   return `${String(interval)} ${unit}${suffix}`
// }

// export function humanReadableTimeDeltaText(timeDeltaInSeconds: number): string {
//   const absoluteSeconds = Math.abs(timeDeltaInSeconds)
//   if (absoluteSeconds <= 1) {
//     return '現在'
//   }
//   let suffix = ''
//   if (timeDeltaInSeconds < 0) {
//     suffix = '後'
//   } else if (timeDeltaInSeconds > 0) {
//     suffix = '前'
//   }
//   let unit
//   let interval
//   if (absoluteSeconds < 60) {
//     interval = absoluteSeconds
//     unit = '秒'
//   } else if (absoluteSeconds < 3600) {
//     interval = Math.floor(absoluteSeconds / 60)
//     unit = '分鐘'
//   } else if (absoluteSeconds < 86400) {
//     interval = Math.floor(absoluteSeconds / 3600)
//     unit = '小時'
//   } else if (absoluteSeconds < 2592000) {
//     interval = Math.floor(absoluteSeconds / 86400)
//     unit = '天'
//   } else if (absoluteSeconds < 31536000) {
//     interval = Math.floor(absoluteSeconds / 2592000)
//     unit = '個月'
//   } else {
//     interval = Math.floor(absoluteSeconds / 31536000)
//     unit = '年'
//   }
//   return `${String(interval)} ${unit}${suffix}`
// }

export function getTimeDeltaTranslationParts(timeDeltaInSeconds: number): {
  value: number
  unitKey: string
  suffixKey: string
} {
  let value
  let unitKey
  let suffixKey

  const absoluteSeconds = Math.abs(timeDeltaInSeconds)

  if (absoluteSeconds <= 1) {
    value = 0
  } else if (absoluteSeconds < 60) {
    value = absoluteSeconds
  } else if (absoluteSeconds < 3600) {
    value = Math.floor(absoluteSeconds / 60)
  } else if (absoluteSeconds < 86400) {
    value = Math.floor(absoluteSeconds / 3600)
  } else if (absoluteSeconds < 2592000) {
    value = Math.floor(absoluteSeconds / 86400)
  } else if (absoluteSeconds < 31536000) {
    value = Math.floor(absoluteSeconds / 2592000)
  } else {
    value = Math.floor(absoluteSeconds / 31536000)
  }

  if (absoluteSeconds <= 1) {
    unitKey = 'now'
  } else if (absoluteSeconds < 60) {
    unitKey = 'second'
  } else if (absoluteSeconds < 3600) {
    unitKey = 'minute'
  } else if (absoluteSeconds < 86400) {
    unitKey = 'hour'
  } else if (absoluteSeconds < 2592000) {
    unitKey = 'day'
  } else if (absoluteSeconds < 31536000) {
    unitKey = 'month'
  } else {
    unitKey = 'year'
  }

  if (timeDeltaInSeconds < 0) {
    suffixKey = 'after'
  } else if (timeDeltaInSeconds > 0) {
    suffixKey = 'before'
  } else {
    suffixKey = ''
  }

  return {
    value,
    unitKey,
    suffixKey,
  }
}
