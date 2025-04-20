import React from 'react'

export const validateDatetimeField = (
  value: string,
  inputRef: React.RefObject<HTMLInputElement>,
  isRequired: boolean
) => {
  const isValid = inputRef.current?.checkValidity()
  if (!value && !isValid) {
    return '日期格式錯誤'
  }
  if (isRequired && !value) {
    return '必填'
  }
  return true
}
