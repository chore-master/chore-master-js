import { useTimezone } from '@/components/timezone'
import * as datetimeUtils from '@/utils/datetime'
import React from 'react'

export default function DatetimeBlock({
  isoText,
  timestampInSeconds,
  date,
}: Readonly<{
  isoText?: string | null
  timestampInSeconds?: number | null
  date?: Date | null
}>) {
  const timezone = useTimezone()
  const tzOffset = timezone.offsetInMinutes
  let ts
  if (isoText) {
    let _isoText = isoText
    if (!isoText.endsWith('Z') && !isoText.includes('+')) {
      _isoText += 'Z'
    }
    ts = Date.parse(_isoText) - timezone.deviceOffsetInMinutes * 60 * 1000
  } else if (timestampInSeconds) {
    ts = timestampInSeconds * 1000
  } else if (date) {
    ts = date.getTime() - timezone.deviceOffsetInMinutes * 60 * 1000
  } else {
    return 'N/A'
  }
  const localDate = new Date(ts + tzOffset * 60 * 1000)
  const timeDeltaInSeconds = Math.floor(
    timezone.baseTimestampInSeconds -
      timezone.deviceOffsetInMinutes * 60 -
      ts / 1000
  )
  return (
    <React.Fragment>
      {localDate.toLocaleString(undefined, { hour12: false })}
      {` (${datetimeUtils.humanReadableTimeDeltaText(timeDeltaInSeconds)})`}
    </React.Fragment>
  )
}
