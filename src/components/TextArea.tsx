import React, { HTMLAttributes, forwardRef } from 'react'

import classNames from 'classnames'

export interface Props extends HTMLAttributes<HTMLTextAreaElement> {
  name: string
  value?: string
  disabled?: boolean
  required?: boolean
  valid?: boolean
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { className = '', disabled = false, valid, ...other },
  ref
) {
  return (
    <textarea
      className={classNames(
        'w-full px-3 py-2 border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400',
        {
          'cursor-not-allowed opacity-50': disabled,
          'border-green-600 focus:border-green-400 focus:shadow-outline-green':
            valid !== undefined && valid,
          'border-red-600 focus:border-red-400 focus:shadow-outline-red':
            valid !== undefined && !valid
        },
        className
      )}
      disabled={disabled}
      id={other.name}
      ref={ref}
      {...other}
    />
  )
})

export default TextArea
