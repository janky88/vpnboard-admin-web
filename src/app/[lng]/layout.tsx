import { Noto_Sans as FontSans } from 'next/font/google';
import { BodyAnalytics, HeadAnalytics } from '@/analytics';
import { dir, languages } from '@/i18n';
import { ConfigProvider, ReactQueryProvider } from '@/providers';
import { DEFAULT_SYSTEM_MODE, DEFAULT_THEME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import '../../../tailwind.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export { metadata, viewport } from '@/lib/site';

export async function generateStaticParams() {
  return languages.map((lng: string) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html
      lang={lng}
      dir={dir(lng)}
      data-mode={DEFAULT_SYSTEM_MODE}
      data-theme={DEFAULT_THEME}
      style={{
        colorScheme: DEFAULT_SYSTEM_MODE,
      }}
      suppressHydrationWarning
    >
      <head>
        <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
        <HeadAnalytics />
        <ConfigProvider />
      </head>
      <body className={cn('w-screen overflow-x-hidden font-sans antialiased', fontSans.variable)}>
        <ReactQueryProvider>
          {children}
          <Toaster closeButton richColors visibleToasts={9} />
        </ReactQueryProvider>
        <BodyAnalytics />
      </body>
    </html>
  );
}
