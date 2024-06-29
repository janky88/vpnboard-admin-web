'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetSubscribeConfig,
  postAdminConfigListSubscribeSchemeType,
  postAdminConfigUpdateSubscribeConfig,
} from '@/services/api/admin';
import { TabsContent } from '@radix-ui/react-tabs';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function Subscription() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'system.subscription');

  const [app, setApp] = useState<API.SubscribeAppConfig>();

  const { data, refetch } = useQuery<API.GetSubscribeConfigResponse>({
    queryKey: ['postAdminConfigGetSubscribeConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetSubscribeConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateSubscribeConfig({
        ...data,
        [key]: value,
      });
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {}
  }

  const { data: scheme_types } = useQuery<string[]>({
    queryKey: ['postAdminConfigListSubscribeSchemeType'],
    queryFn: async () => {
      const { data } = await postAdminConfigListSubscribeSchemeType();
      return data.data.scheme_types || [];
    },
  });

  useEffect(() => {
    if (!app) setApp(data?.app);
  }, [app, data]);

  return (
    <>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Label>{t('singleSubscriptionMode')}</Label>
              <p className='text-xs text-muted-foreground'>
                {t('singleSubscriptionModeDescription')}
              </p>
            </TableCell>
            <TableCell className='text-right'>
              <Switch
                disabled={data?.single_model}
                defaultChecked={data?.single_model}
                onCheckedChange={(checked) => {
                  updateConfig('single_model', checked);
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Label>{t('subscriptionURL')}</Label>
              <p className='text-xs text-muted-foreground'>{t('subscriptionURLDescription')}</p>
            </TableCell>
            <TableCell className='text-right'>
              <Textarea
                placeholder={t('subscriptionURLPlaceholder')}
                defaultValue={data?.subscribe_url}
                onBlur={(e) => {
                  updateConfig('subscribe_url', e.target.value);
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Label>{t('wildcardResolution')}</Label>
              <p className='text-xs text-muted-foreground'>{t('wildcardResolutionDescription')}</p>
            </TableCell>
            <TableCell className='text-right'>
              <Switch
                defaultChecked={data?.wildcard_resolution}
                onCheckedChange={(checked) => {
                  updateConfig('wildcard_resolution', checked);
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Label>{t('subscriptionPath')}</Label>
              <p className='text-xs text-muted-foreground'>{t('subscriptionPathDescription')}</p>
            </TableCell>
            <TableCell className='flex items-center gap-2 text-right'>
              <Input
                placeholder={t('subscriptionPathPlaceholder')}
                defaultValue={data?.subscribe_path}
                onBlur={(e) => {
                  updateConfig('subscribe_path', e.target.value);
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Label>{t('app')}</Label>
              <p className='text-xs text-muted-foreground'>{t('appDescription')}</p>
            </TableCell>
            <TableCell className='flex justify-end gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  setApp(data?.app);
                }}
              >
                {t('reset')}
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  updateConfig('app', app);
                }}
              >
                {t('save')}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Tabs defaultValue='windows'>
        <TabsList className='h-full flex-wrap'>
          {Object.keys(app || {}).map((type) => {
            return (
              <TabsTrigger value={type} key={type} className='uppercase'>
                {type}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {Object.keys(app || {}).map((type) => {
          //@ts-ignore
          const list = app[type] as API.SubscribeAppItemConfig[];
          const updatedList = (key: string, value: string, index: number) => {
            const newList = list.map((item, i) => (i === index ? { ...item, [key]: value } : item));
            setApp({ ...app, [type]: newList });
          };
          return (
            <TabsContent value={type} key={type} className='mt-4 space-y-4'>
              {list.map((item, index) => {
                return (
                  <div className='flex flex-col items-center gap-2 lg:flex-row' key={index}>
                    <Select
                      defaultValue={item.scheme_type}
                      onValueChange={(value) => {
                        updatedList('scheme_type', value, index);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('subscriptionProtocol')} />
                      </SelectTrigger>
                      <SelectContent>
                        {scheme_types?.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={t('appName')}
                      defaultValue={item.name}
                      onChange={(e) => {
                        updatedList('name', e.target.value, index);
                      }}
                    />
                    <Input
                      placeholder={t('appIcon')}
                      defaultValue={item.icon}
                      onChange={(e) => {
                        updatedList('icon', e.target.value, index);
                      }}
                    />
                    <Input
                      placeholder={t('appDownloadURL')}
                      defaultValue={item.url}
                      onChange={(e) => {
                        updatedList('url', e.target.value, index);
                      }}
                    />
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => {
                        setApp({
                          ...app,
                          [type]: list.filter((l, i) => i !== index),
                        });
                      }}
                    >
                      {t('delete')}
                    </Button>
                  </div>
                );
              })}
              <Button
                className='w-full'
                variant='outline'
                onClick={() => {
                  setApp({
                    ...app,
                    [type]: [...list, {}],
                  });
                }}
              >
                {t('add')}
              </Button>
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}
