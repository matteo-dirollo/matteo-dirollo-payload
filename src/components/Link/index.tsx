import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

// Helper to render the custom emoji icons
const LinkIcon = ({ name }: { name?: 'none' | 'coffee' | 'arrowRight' | 'heart' | null }) => {
  switch (name) {
    case 'coffee':
      return <span className="mr-2">☕</span>
    case 'arrowRight':
      return <span className="ml-2">➜</span>
    case 'heart':
      return <span className="mr-2">❤️</span>
    default:
      return null
  }
}

// Map your Payload choices directly to standard classes or arbitrary styling hooks
const getColorClass = (color?: 'blue' | 'coffeeBrand' | 'green' | 'dark' | null) => {
  switch (color) {
    case 'coffeeBrand':
      return 'bg-[#5F7FFF] text-white hover:bg-[#4a6edb] border-transparent'
    case 'green':
      return 'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent'
    case 'dark':
      return 'bg-zinc-900 text-white hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 border-transparent'
    case 'blue':
    default:
      return 'bg-blue-600 text-white hover:bg-blue-700 border-transparent'
  }
}

type CMSLinkType = {
  appearance?: 'inline' | 'default' | 'outline' | 'button' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  icon?: 'none' | 'coffee' | 'arrowRight' | 'heart' | null
  buttonColor?: 'blue' | 'coffeeBrand' | 'green' | 'dark' | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    icon = 'none',
    buttonColor = 'blue',
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* 1. Standard inline link (Default text styling) */
  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }
  /* 2. Custom Colored Button (Our newly injected 'button' schema appearance) */
  if (appearance === 'button') {
    return (
      <Button
        asChild
        size={size || 'default'}
        className={cn(getColorClass(buttonColor), className)}
      >
        <Link href={href || url || ''} {...newTabProps}>
          {icon !== 'arrowRight' && <LinkIcon name={icon} />}
          {label && <span>{label}</span>}
          {children && children}
          {icon === 'arrowRight' && <LinkIcon name={icon} />}
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
