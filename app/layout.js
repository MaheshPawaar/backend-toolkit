import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata = {
  verification: {
    google: 'WikW1haLi-ImrBRnA04vikVciLyfK-FpmZVZ1jpI6QE',
  },
  title: 'BackendKit — Every Tool a Backend Dev Googles Daily',
  description:
    'Privacy-first, client-side collection of tools for backend engineers. No server. No tracking. No data leaves the browser.',
  metadataBase: new URL('https://backendkit.maheshpawar.me'),
  openGraph: {
    title: 'backendKit — Every Tool a Backend Dev Googles Daily',
    description:
      'JSON formatter, JWT decoder, Base64 codec, UUID generator and more. 100% client-side, no data leaves the browser.',
    url: 'https://backendkit.maheshpawar.me',
    siteName: 'backendKit',
    type: 'website',
    images: [{ url: '/image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'backendKit — Every Tool a Backend Dev Googles Daily',
    description:
      'JSON formatter, JWT decoder, Base64 codec, UUID generator and more. 100% client-side, no data leaves the browser.',
    images: ['/image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-SQD61X2W18"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SQD61X2W18');
        `}
      </Script>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            {children}
            <Toaster position="bottom-right" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
