'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetSiteConfig,
  postAdminConfigUpdateSiteConfig,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function Site() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'system.site');

  const { data, refetch } = useQuery<API.GetSiteConfigResponse>({
    queryKey: ['postAdminConfigGetSiteConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetSiteConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateSiteConfig({
        ...data,
        [key]: value,
      });
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {}
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Label>{t('logo')}</Label>
            <p className='text-xs text-muted-foreground'>{t('logoDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('logoPlaceholder')}
              defaultValue={data?.site_logo}
              onBlur={(e) => {
                updateConfig('site_logo', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('siteName')}</Label>
            <p className='text-xs text-muted-foreground'>{t('siteNameDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('siteNamePlaceholder')}
              defaultValue={data?.site_name}
              onBlur={(e) => {
                updateConfig('site_name', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('siteDesc')}</Label>
            <p className='text-xs text-muted-foreground'>{t('siteDescDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('siteDescPlaceholder')}
              defaultValue={data?.site_desc}
              onBlur={(e) => {
                updateConfig('site_desc', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('siteURL')}</Label>
            <p className='text-xs text-muted-foreground'>{t('siteURLDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('siteURLPlaceholder')}
              defaultValue={data?.host}
              onBlur={(e) => {
                updateConfig('host', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
