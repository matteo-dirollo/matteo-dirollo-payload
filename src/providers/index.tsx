import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <SpeedInsights />
        {children}
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
