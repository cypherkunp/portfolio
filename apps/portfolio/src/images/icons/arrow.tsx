import React from 'react';

interface ArrowIconProps {
  className?: string;
}

export function ArrowIcon({ className = '' }: ArrowIconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
    >
      <path
        d="M7.73438 0.194236L12.8906 5.11611C13.0371 5.2626 13.125 5.43838 13.125 5.64346C13.125 5.81924 13.0371 5.99502 12.8906 6.1415L7.73438 11.0634C7.4707 11.327 7.00195 11.327 6.73828 11.0341C6.47461 10.7704 6.47461 10.3017 6.76758 10.038L10.6641 6.34658H0.703125C0.292969 6.34658 0 6.02431 0 5.64346C0 5.2333 0.292969 4.94033 0.703125 4.94033H10.6641L6.76758 1.21963C6.47461 0.955955 6.47461 0.487205 6.73828 0.223533C7.00195 -0.0694354 7.44141 -0.0694354 7.73438 0.194236Z"
        fill="currentColor"
      />
    </svg>
  );
}
