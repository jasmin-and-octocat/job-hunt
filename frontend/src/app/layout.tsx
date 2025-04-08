import { ThemeProvider } from '@/components/context/themeProvider';
import { AuthProvider } from '@/components/context/auth-context';
import { AuthSync } from '@/components/auth-sync';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobHunt | Find Your Dream Job',
  description: 'Discover thousands of job opportunities from top companies. Create your profile, apply for jobs, and advance your career with JobHunt.',
  keywords: 'jobs, career, employment, job search, hiring, recruitment, job board',
  authors: [{ name: 'JobHunt' }],
  openGraph: {
    title: 'JobHunt | Find Your Dream Job',
    description: 'Discover thousands of job opportunities from top companies. Create your profile, apply for jobs, and advance your career with JobHunt.',
    url: 'https://jobhunt.example.com',
    siteName: 'JobHunt',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JobHunt - Find Your Dream Job',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobHunt | Find Your Dream Job',
    description: 'Discover thousands of job opportunities from top companies. Create your profile, apply for jobs, and advance your career with JobHunt.',
    images: ['/twitter-image.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

const wrapperClass = 'md:container mx-auto';

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="flex justify-center mx-auto max-w-7xl">
        <main
          className={cn(wrapperClass, 'flex flex-1 flex-col mt-4 gap-y-4 ')}
        >
          {children}
        </main>
        <div className=""></div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* AuthSync component handles global authentication state */}
            <AuthSync />
            <div className="min-h-screen">
              <MainContent>{children}</MainContent>
              <div className={cn(wrapperClass)}>
                <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-8">
                  <p>Developed by Jasmin Rai as part of an academic project during Spring 2025, Bachelor of Technology, 2nd Semester, Alliance University</p>
                </footer>
              </div>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
