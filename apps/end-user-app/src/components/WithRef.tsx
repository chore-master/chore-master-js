import React from 'react'

type WithRefProps = {
  render: (ref: React.RefObject<HTMLInputElement>) => React.ReactNode
}

export default function WithRef({ render }: WithRefProps) {
  const ref = React.useRef<HTMLInputElement>(null)
  return render(ref)
}
