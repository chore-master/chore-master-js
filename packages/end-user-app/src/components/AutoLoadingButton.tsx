import LoadingButton from '@mui/lab/LoadingButton'
import React from 'react'

export default function AutoLoadingButton({ onClick, ...props }: any) {
  const [isLoading, setIsLoading] = React.useState(false)
  const handleClick = async (event: any) => {
    setIsLoading(true)
    try {
      await onClick(event)
    } finally {
      setIsLoading(false)
    }
  }
  return <LoadingButton loading={isLoading} onClick={handleClick} {...props} />
}
