import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Voting Ended | Avurudu Wasanthaya - Winners Announced',
  description: 'Celebrating the winners of Avurudu Wasanthaya. Thank you for participating in this year\'s event.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: 'https://drive.google.com/file/d/1xGKoN1Bz1sY0U9TEZEUDuvgc9l5Y8GCn/view?usp=drive_link',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'https://drive.google.com/file/d/1xGKoN1Bz1sY0U9TEZEUDuvgc9l5Y8GCn/view?usp=drive_link',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'https://drive.google.com/file/d/1xGKoN1Bz1sY0U9TEZEUDuvgc9l5Y8GCn/view?usp=drive_link',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
