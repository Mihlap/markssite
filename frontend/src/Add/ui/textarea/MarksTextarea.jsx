import React from 'react'

export default function MarksTextarea({ label, placeholder, ...props }) {
  return (
    <textarea label={label} placeholder={placeholder} {...props} />
  )
}
