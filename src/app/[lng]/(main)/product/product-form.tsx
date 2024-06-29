import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { postAdminNodeGroupList, postAdminNodeList } from '@/services/api/admin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import PriceInput from './price-input';
import ProductGroupSelect from './product-group-select';

const priceItemSchema = z.object({
  month: z.number().optional(),
  price: z.number().optional(),
});

interface ProductFormProps<T> {
  onSubmit: (data: T) => Promise<boolean> | boolean;
  initialValues?: T;
  loading?: boolean;
  trigger: string;
  title: string;
}

export default function ProductForm<T extends Record<string, any>>({
  onSubmit,
  initialValues,
  loading,
  trigger,
  title,
}: ProductFormProps<T>) {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'product');
  const [open, setOpen] = useState(false);

  const formSchema = z
    .object({
      name: z.string(),
      remarks: z.string().optional(),
      stock: z.number().optional(),
      total_bandwidth: z.number().optional(),
      node_speed_limit: z.number().optional(),
      node_connector: z.number().optional(),
      quota: z.number().optional(),
      price: z.array(priceItemSchema).optional(),
      price_traffic_reset: z.number().optional(),
      node_groups: z.array(z.number()).optional(),
      nodes: z.array(z.number()).optional(),
      product_group_id: z.number().optional(),
    })
    .superRefine(({ price }, ctx) => {
      const value =
        price &&
        price.filter(
          (field) => field.month && !isNaN(field.month) && field.price && !isNaN(field.price),
        );
      if (!value?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('form.validPrice'),
          path: ['price'],
        });
      }
    });

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

  const { data: nodes } = useQuery({
    queryKey: ['postAdminNodeList', 'all'],
    queryFn: async () => {
      const { data } = await postAdminNodeList({
        size: 0,
      });
      return data.data.list;
    },
  });

  const { data: groups } = useQuery({
    queryKey: ['postAdminNodeGroupList', 'all'],
    queryFn: async () => {
      const { data } = await postAdminNodeGroupList({
        size: 0,
      });
      return data.data.list;
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
      <SheetContent className='sm:max-w-[100vw]'>
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='remarks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.description')}</FormLabel>
                    <FormControl>
                      <Textarea className=' min-h-24' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='stock'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.stock')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('form.noLimit')}
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
                    name='total_bandwidth'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.totalBandwidth')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('form.noLimit')}
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
                    name='node_speed_limit'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.speedLimit')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('form.noLimit')}
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
                    name='node_connector'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.deviceLimit')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('form.noLimit')}
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
                    name='quota'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.quota')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('form.noLimit')}
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
                </div>

                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.priceSettings')}</FormLabel>
                        <FormControl>
                          <PriceInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='price_traffic_reset'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.resetPrice')}</FormLabel>
                        <FormControl>
                          <Input
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
                    name='product_group_id'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.productGroup')}</FormLabel>
                        <FormControl>
                          <ProductGroupSelect
                            placeholder={t('form.selectProductGroup')}
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(value) => {
                              field.onChange(value ? Number(value) : undefined);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='node_groups'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.nodeGroups')}</FormLabel>
                      <FormControl>
                        <Accordion type='single' collapsible className='w-full'>
                          {groups?.map((group: API.NodeGroup) => {
                            const value = field.value || [];
                            return (
                              <AccordionItem key={group.id} value={String(group.id)}>
                                <AccordionTrigger>
                                  <div className='flex items-center gap-2'>
                                    <Checkbox
                                      checked={value.includes(group.id!)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...value, group.id])
                                          : field.onChange(
                                              value.filter((value: number) => value !== group.id),
                                            );
                                      }}
                                    />
                                    <Label>{group.name}</Label>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className='list-disc [&>li]:mt-2'>
                                    {nodes
                                      .filter((node: API.Node) => node.node_group_id === group.id)
                                      .map((node: API.Node) => {
                                        return (
                                          <li
                                            key={node.id}
                                            className='flex items-center justify-between *:flex-1 '
                                          >
                                            <span>{node.name}</span>
                                            <span>
                                              {node.address}:{node.port}
                                            </span>
                                            <span className='text-right'>{node.protocol}</span>
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='nodes'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.nodes')}</FormLabel>
                      <FormControl>
                        <div className='flex flex-col gap-2'>
                          {nodes
                            ?.filter((node: API.Node) => !node.node_group_id)
                            ?.map((node: API.Node) => {
                              const value = field.value || [];
                              return (
                                <div className='flex items-center gap-2' key={node.id}>
                                  <Checkbox
                                    checked={value.includes(node.id!)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...value, node.id])
                                        : field.onChange(
                                            value.filter((value: number) => value !== node.id),
                                          );
                                    }}
                                  />
                                  <Label className='flex w-full items-center justify-between *:flex-1'>
                                    <span>{node.name}</span>
                                    <span>
                                      {node.address}:{node.port}
                                    </span>
                                    <span className='text-right'>{node.protocol}</span>
                                  </Label>
                                </div>
                              );
                            })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
