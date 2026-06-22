import type { ReactNode } from 'react'

export interface IconProps {
  size?: number
  className?: string
}

function Svg({ size = 16, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}

export function IconSend(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.843 7.627a.498.498 0 0 0 .683.627l18-9a.498.498 0 0 0 0-.894z" /><path d="M6 12h16" />
    </Svg>
  )
}

export function IconLoader({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className ? `animate-spin ${className}` : 'animate-spin'}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </Svg>
  )
}

export function IconSparkles(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" /><path d="M20 3v4" /><path d="M22 5h-4" />
    </Svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </Svg>
  )
}

export function IconFile(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
    </Svg>
  )
}

export function IconMenu(props: IconProps) {
  return (
    <Svg {...props}>
      <line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" />
    </Svg>
  )
}

export function IconDownload(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </Svg>
  )
}

export function IconAlert(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </Svg>
  )
}

export function IconChart(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
    </Svg>
  )
}

export function IconPackage(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </Svg>
  )
}

export function IconTarget(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </Svg>
  )
}

export function IconUsers(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  )
}

export function IconTag(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </Svg>
  )
}

export function IconTrend(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" />
    </Svg>
  )
}

export function IconGrid(props: IconProps) {
  return (
    <Svg {...props}>
      <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
    </Svg>
  )
}

export function IconCheckCircle(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" />
    </Svg>
  )
}

export function IconExternal(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </Svg>
  )
}
