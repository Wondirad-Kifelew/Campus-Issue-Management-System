import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ProviderWrapper } from '@/components/providers'

export const metadata = {
  title: 'AAU Students Issue Management',
  description: 'Student portal for campus issue reporting and tracking',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-slate-50">
      <body className="font-sans antialiased">
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
