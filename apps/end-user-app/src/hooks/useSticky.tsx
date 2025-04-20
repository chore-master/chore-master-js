import React from 'react'
import { useIntersection } from 'react-use'

const sentinelStyle: React.CSSProperties = {
  width: '100%',
  height: 1,
  marginBottom: -1,
  visibility: 'hidden',
}

export function useSticky({ rootMargin }: { rootMargin: number }) {
  const sentinelRef = React.useRef(null)
  const intersection = useIntersection(sentinelRef, {
    root: null,
    rootMargin: `${rootMargin}px`,
    threshold: 0,
  })
  const sentinel = <div ref={sentinelRef} style={sentinelStyle} />

  return {
    sentinel,
    isSticky: intersection?.intersectionRatio === 0,
  }
}
