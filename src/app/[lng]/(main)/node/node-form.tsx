'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { postAdminNodeGroupList } from '@/services/api/admin';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';

const transferSchema = z.object({
  transfer_address: z.string().optional(),
  transfer_port: z.number().optional(),
});

const shadowsocksSchema = z.object({
  method: z.string(),
  server_key: z.string(),
});

const vmessSchema = z.object({
  network: z.string(),
  enable_tls: z.boolean(),
  service_name: z.string().optional(),
  path: z.string().optional(),
});

const vlessSchema = z.object({
  network: z.string(),
  enable_tls: z.boolean(),
  service_name: z.string().optional(),
  path: z.string().optional(),
});

const trojanSchema = z.object({
  network: z.string(),
  service_name: z.string().optional(),
  path: z.string().optional(),
});

const extraConfigSchema = z.union([shadowsocksSchema, vmessSchema, vlessSchema, trojanSchema]);

const formSchema = z.object({
  name: z.string().min(2, { message: 'name must be at least 2 characters.' }),
  remarks: z.string().optional(),
  address: z.string(),
  port: z.number(),
  node_speed_limit: z.number().optional(),
  traffic_rate: z.number().optional(),
  protocol: z.enum(['shadowsocks', 'vmess', 'vless', 'trojan', 'transfer']),
  node_group_id: z.number().optional().nullish(),
  extra_config: extraConfigSchema.optional().and(transferSchema),
});

interface NodeFormProps<T> {
  onSubmit: (data: T) => Promise<boolean> | boolean;
  initialValues?: T;
  loading?: boolean;
  trigger: string;
  title: string;
}

export default function NodeForm<T extends { [x: string]: any }>({
  onSubmit,
  initialValues,
  loading,
  trigger,
  title,
}: NodeFormProps<T>) {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'node');

  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
    },
  });
  const protocol = form.watch('protocol');

  useEffect(() => {
    if (initialValues?.protocol !== protocol) {
      form?.setValue('extra_config', {} as any);
    }
  }, [form, protocol, initialValues?.protocol]);

  useEffect(() => {
    form?.reset(initialValues);
  }, [form, initialValues]);

  async function handleSubmit(data: { [x: string]: any }) {
    const bool = await onSubmit(data as T);
    if (bool) setOpen(false);
  }

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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className='-mx-6 h-[calc(100vh-48px-36px-36px)]'>
          <Form {...form}>
            <form className='grid grid-cols-2 gap-2 px-6 pt-4'>
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
                    <FormLabel>{t('form.remarks')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t('form.nodeSpeedLimit')}</FormLabel>
                    <FormControl>
                      <Input
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
                name='traffic_rate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.trafficRate')}</FormLabel>
                    <FormControl>
                      <Input
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
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.serverAddress')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='port'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.serverPort')}</FormLabel>
                    <FormControl>
                      <Input
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
                name='protocol'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.protocol')}</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('form.selectProtocol')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='shadowsocks'>Shadowsocks</SelectItem>
                          <SelectItem value='vmess'>Vmess</SelectItem>
                          <SelectItem value='vless'>Vless</SelectItem>
                          <SelectItem value='trojan'>Trojan</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='node_group_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.nodeGroupId')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          if (value === 'empty') {
                            field.onChange(undefined);
                          } else {
                            field.onChange(Number(value));
                          }
                        }}
                        defaultValue={String(field.value!)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('form.selectNodeGroup')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='empty'>{t('form.noGroup')}</SelectItem>
                          {groups?.map((group: API.NodeGroup) => (
                            <SelectItem key={group.id} value={String(group.id)}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {protocol && (
                <Accordion
                  type='multiple'
                  defaultValue={['protocol']}
                  className='col-span-2 w-full'
                >
                  <AccordionItem value='protocol'>
                    <AccordionTrigger className='uppercase'>{protocol}</AccordionTrigger>
                    <AccordionContent className='grid grid-cols-2 gap-2'>
                      {protocol === 'shadowsocks' && (
                        <>
                          <FormField
                            control={form.control}
                            name='extra_config.method'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.encryptionMethod')}</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder={t('form.selectEncryptionMethod')}
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value='2022-blake3-aes-256-gcm'>
                                        2022-blake3-aes-256-gcm
                                      </SelectItem>
                                      <SelectItem value='2022-blake3-chacha20-poly1305'>
                                        2022-blake3-chacha20-poly1305
                                      </SelectItem>
                                      <SelectItem value='aes-256-gcm'>aes-256-gcm</SelectItem>
                                      <SelectItem value='aes-128-gcm'>aes-128-gcm</SelectItem>
                                      <SelectItem value='chacha20-ietf-poly1305'>
                                        chacha20-ietf-poly1305
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='extra_config.server_key'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.password')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      {protocol === 'vmess' && (
                        <>
                          <FormField
                            control={form.control}
                            name='extra_config.network'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.networkType')}</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || 'tcp'}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t('form.networkType')} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value='tcp'>TCP</SelectItem>
                                      <SelectItem value='websocket'>WebSocket</SelectItem>
                                      <SelectItem value='grpc'>gRPC</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='extra_config.enable_tls'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.enableTLS')}</FormLabel>
                                <FormControl>
                                  <div className='pt-2'>
                                    <Switch
                                      checked={!!field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='extra_config.service_name'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.serviceName')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='extra_config.path'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.path')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      {protocol === 'vless' && (
                        <>
                          <FormField
                            control={form.control}
                            name='extra_config.network'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.networkType')}</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || 'tcp'}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t('form.networkType')} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value='tcp'>TCP</SelectItem>
                                      <SelectItem value='websocket'>WebSocket</SelectItem>
                                      <SelectItem value='grpc'>gRPC</SelectItem>
                                      <SelectItem value='http2'>HTTP/2</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='extra_config.enable_tls'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.enableTLS')}</FormLabel>
                                <FormControl>
                                  <div className='pt-2'>
                                    <Switch
                                      checked={!!field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='extra_config.service_name'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.serviceName')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='extra_config.path'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.path')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      {protocol === 'trojan' && (
                        <>
                          <FormField
                            control={form.control}
                            name='extra_config.network'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.networkType')}</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || 'tcp'}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t('form.networkType')} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value='tcp'>TCP</SelectItem>
                                      <SelectItem value='websocket'>WebSocket</SelectItem>
                                      <SelectItem value='grpc'>gRPC</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='extra_config.service_name'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.serviceName')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='extra_config.path'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('form.path')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value='transfer'>
                    <AccordionTrigger>{t('form.transferConfig')}</AccordionTrigger>
                    <AccordionContent className='grid grid-cols-2 gap-2'>
                      <FormField
                        control={form.control}
                        name='extra_config.transfer_address'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.transferAddress')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='extra_config.transfer_port'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.transferPort')}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type='number'
                                value={field.value ? Number(field.value) : undefined}
                                onChange={(e) => {
                                  field.onChange(
                                    e.target.value ? Number(e.target.value) : undefined,
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
