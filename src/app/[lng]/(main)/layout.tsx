'use client';

import { useState } from 'react';
import error from 'next/error';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import Footer from '@/layout/footer';
import HeaderLogo from '@/layout/header-logo';
import { postUserUserInfo } from '@/services/api/user';
import { userState } from '@/stores/user';
import { Icon } from '@iconify/react';
import { useMount } from 'ahooks';
import { toast } from 'sonner';
import { deleteCookie } from '@/lib/cookies';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function MainLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { t } = useTranslation(lng, 'menu');

  const routers = [
    {
      name: t('dashboard'),
      href: '',
    },
    {
      label: t('settings'),
    },
    {
      name: t('systemConfig'),
      href: '/system',
    },
    {
      name: t('paymentConfig'),
      href: '/payment',
    },
    {
      label: t('server'),
    },
    {
      name: t('nodeManagement'),
      href: '/node',
    },
    {
      label: t('finance'),
    },
    {
      name: t('productManagement'),
      href: '/product',
    },
    {
      name: t('orderManagement'),
      href: '/order',
    },
    {
      name: t('couponManagement'),
      href: '/coupon',
    },
    {
      label: t('user'),
    },
    {
      name: t('userManagement'),
      href: '/user',
    },
    {
      name: t('announcementManagement'),
      href: '/notice',
    },
    {
      name: t('ticketManagement'),
      href: '/ticket',
    },
    {
      name: t('documentManagement'),
      href: '/knowledge',
    },
  ];

  useMount(async () => {
    try {
      const { data } = await postUserUserInfo({
        skipErrorHandler: true,
      });
      if (data.data.is_manager) {
        userState.userInfo = data.data;
        setLoading(false);
      } else {
        toast.error(t('errorNoManager'));
        throw error;
      }
    } catch (error) {
      deleteCookie('Authorization');
      router.push(`/${lng}/auth`);
    }
  });

  if (loading)
    return (
      <div className='fixed left-0 top-0 z-50 flex size-full flex-col items-center justify-center'>
        <Icon icon='mdi:loading' className='size-12 animate-spin text-primary' />
        <p className='ml-2 text-primary'>Loading...</p>
      </div>
    );

  return (
    <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <div className='hidden border-r bg-muted/40 md:block'>
        <div className='flex h-full max-h-screen flex-col gap-6'>
          <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
            <HeaderLogo />
          </div>
          <div className='flex-1'>
            <nav className='grid items-start gap-1 px-2 text-sm font-medium lg:px-4'>
              {routers.map((router) => {
                if (router.label) {
                  return (
                    <span className='text-muted-foreground' key={router.label}>
                      {router.label}
                    </span>
                  );
                }
                return (
                  <Link
                    key={`/${lng}${router.href}`}
                    href={`/${lng}${router.href}`}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                      pathname === `/${lng}${router.href}`
                        ? 'bg-muted text-primary'
                        : 'text-foreground',
                    )}
                  >
                    {router.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className='flex h-screen flex-col'>
        <header className='flex h-16 shrink-0 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
                <Icon icon='mdi:menu' className='size-5' />
                <span className='sr-only'>{t('toggleNavigationMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='flex flex-col '>
              <ScrollArea>
                <nav className='grid gap-2 text-sm font-medium '>
                  {routers.map((router) => {
                    if (router.label) {
                      return (
                        <span className='text-muted-foreground' key={router.label}>
                          {router.label}
                        </span>
                      );
                    }
                    return (
                      <Link
                        key={router.href}
                        href={`/${lng}${router.href}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-4 rounded-xl px-4 py-2 hover:text-foreground',
                          pathname === `/${lng}${router.href}`
                            ? 'bg-muted text-primary'
                            : 'text-foreground',
                        )}
                      >
                        {router.name}
                      </Link>
                    );
                  })}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className='w-full flex-1'></div>
          <Button variant='secondary' size='icon' className='rounded-full'>
            <Icon icon='mdi:user' className='size-5' />
            <span className='sr-only'>{t('toggleUserMenu')}</span>
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              deleteCookie('Authorization');
              router.push(`/${lng}/auth`);
            }}
          >
            {t('logout')}
          </Button>
        </header>
        <ScrollArea className='relative flex w-screen flex-col gap-4 md:w-full lg:gap-6'>
          <main className='min-h-[calc(100dvh-162px-env(safe-area-inset-top))] p-4 lg:min-h-[calc(100dvh-162px)] lg:p-6'>
            {children}
          </main>
          <Footer className='p-4 lg:p-6' />
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </div>
  );
}
