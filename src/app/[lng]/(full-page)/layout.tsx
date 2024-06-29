import LayoutFooter from '@/layout/footer';
import HeaderLogo from '@/layout/header-logo';

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <>
      <header className='sticky top-0 z-40 h-auto w-full border-b pt-[calc(env(safe-area-inset-top))] backdrop-blur-md'>
        <div className='container flex h-16 items-center justify-between'>
          <HeaderLogo />
        </div>
      </header>
      <main className='relative min-h-[calc(100dvh-65px-138px-env(safe-area-inset-top))] lg:min-h-[calc(100dvh-65px-85px)]'>
        {children}
      </main>
      <LayoutFooter className='container' />
    </>
  );
}
