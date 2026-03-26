import React from 'react'

export default function Icon3({ color = 'currentColor' }) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="3" width="11" height="1" rx="0.5" fill={color} />
        <rect x="1" y="3" width="1" height="1" rx="0.5" fill={color} />
        <rect x="4" y="7" width="11" height="1" rx="0.5" fill={color} />
        <rect x="1" y="7" width="1" height="1" rx="0.5" fill={color} />
        <rect x="4" y="11" width="11" height="1" rx="0.5" fill={color} />
        <rect x="1" y="11" width="1" height="1" rx="0.5" fill={color} />
      </svg>
    );
}
