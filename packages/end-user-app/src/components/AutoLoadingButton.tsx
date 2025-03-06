import { Button, ButtonProps } from '@mui/material'
import React from 'react'

type AutoLoadingButtonProps = Omit<ButtonProps, 'onClick'> & {
  readonly onClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>
}

export default React.forwardRef(function AutoLoadingButton(
  { onClick, ...props }: AutoLoadingButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true)
    try {
      await onClick(event)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      ref={ref}
      loading={isLoading}
      onClick={handleClick}
      sx={{ width: 'fit-content', ...props.sx }}
      {...props}
    />
  )
})
