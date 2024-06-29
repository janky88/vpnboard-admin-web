'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { postAdminProductList } from '@/services/api/admin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Combobox from '@/components/combobox';

const formSchema = z.object({
  name: z.string(),
  code: z.string().optional(),
  coupon_type: z.number().optional(),
  discount: z.number().optional(),
  amount: z.number().optional(),
  expire: z.any().optional(),
  max_use: z.number().optional(),
  max_use_per_user: z.number().optional(),
  product_ids: z.any().optional(),
  quantity: z.number().optional(),
});

interface CouponFormProps<T> {
  onSubmit: (data: T) => Promise<boolean> | boolean;
  initialValues?: T;
  loading?: boolean;
  trigger: string;
  title: string;
  type?: string;
}

export default function CouponForm<T extends Record<string, any>>({
  onSubmit,
  initialValues,
  loading,
  trigger,
  title,
  type,
}: CouponFormProps<T>) {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'coupon');

  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
    },
  });

  useEffect(() => {
    form?.reset(initialValues);
  }, [form, initialValues]);

  async function handleSubmit(data: { [x: string]: any }) {
    const bool = await onSubmit(data as T);
    if (bool) setOpen(false);
  }

  const coupon_type = form.watch('coupon_type');

  const { data } = useQuery({
    queryKey: ['postAdminProductList'],
    queryFn: async () => {
      const { data } = await postAdminProductList({});
      return data.data;
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size='sm'
          onClick={() => {
            form.reset();
            setOpen(true);
          }}
        >
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className='-mx-6 h-[calc(100vh-48px-36px-36px)]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 px-6 pt-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.enterCouponName')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.customCouponCode')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.customCouponCodePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='coupon_type'
                defaultValue={1}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.couponType')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={String(field.value)}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                        }}
                        className='flex gap-2'
                      >
                        <FormItem className='flex items-center space-x-3 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='1' />
                          </FormControl>
                          <FormLabel className='font-normal'>
                            {t('form.percentageDiscount')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-x-3 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='2' />
                          </FormControl>
                          <FormLabel className='font-normal'>{t('form.amountDiscount')}</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {coupon_type === 1 && (
                <FormField
                  control={form.control}
                  name='discount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.percentageDiscount')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('form.enterValue')}
                          {...field}
                          type='number'
                          value={field.value ? Number(field.value) : undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value ? Number(e.target.value) : undefined);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {coupon_type === 2 && (
                <FormField
                  control={form.control}
                  name='amount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.amountDiscount')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('form.enterValue')}
                          {...field}
                          type='number'
                          value={field.value ? Number(field.value) : undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value ? Number(e.target.value) : undefined);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='expire'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.couponValidityPeriod')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className='mr-2 size-4' />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, 'y-LL-dd')} -{' '}
                                  {format(field.value.to, 'y-LL-dd')}
                                </>
                              ) : (
                                format(field.value.from, 'y-LL-dd')
                              )
                            ) : (
                              <span>{t('form.selectTime')}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='range'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(Date.now() - 24 * 60 * 60 * 1000)}
                          initialFocus
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='max_use'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.maxUsage')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.maxUsagePlaceholder')}
                        {...field}
                        type='number'
                        value={field.value ? Number(field.value) : undefined}
                        onChange={(e) => {
                          field.onChange(e.target.value ? Number(e.target.value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='max_use_per_user'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.maxUsagePerUser')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.maxUsagePerUserPlaceholder')}
                        {...field}
                        type='number'
                        value={field.value ? Number(field.value) : undefined}
                        onChange={(e) => {
                          field.onChange(e.target.value ? Number(e.target.value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='product_ids'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.specifiedProducts')}</FormLabel>
                    <FormControl>
                      <Combobox
                        placeholder={t('form.selectProduct')}
                        value={field.value?.map((item: number) => String(item)) || []}
                        onChange={(value) => {
                          field.onChange(value?.map((item) => Number(item)));
                        }}
                        options={(data?.list || []).map((item: API.Product) => ({
                          value: String(item.id),
                          label: item.name,
                        }))}
                        multiple
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {type !== 'update' && (
                <FormField
                  control={form.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.generateQuantity')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('form.generateQuantityPlaceholder')}
                          {...field}
                          type='number'
                          value={field.value ? Number(field.value) : undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value ? Number(e.target.value) : undefined);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className='flex-row justify-end gap-2 pt-3'>
          <Button
            variant='outline'
            disabled={loading}
            onClick={() => {
              setOpen(false);
            }}
          >
            {t('form.cancel')}
          </Button>
          <Button disabled={loading} onClick={form.handleSubmit(handleSubmit)}>
            {loading && <Icon icon='mdi:loading' className='mr-2 animate-spin' />}{' '}
            {t('form.confirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
