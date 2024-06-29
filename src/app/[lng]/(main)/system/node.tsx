'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetNodeConfig,
  postAdminConfigUpdateNodeConfig,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function Node() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'system.node');

  const { data, refetch } = useQuery<API.GetNodeConfigResponse>({
    queryKey: ['postAdminConfigGetNodeConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetNodeConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateNodeConfig({
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
            <Label>{t('communicationKey')}</Label>
            <p className='text-xs text-muted-foreground'>{t('communicationKeyDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.node_key}
              onBlur={(e) => {
                updateConfig('node_key', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('nodePullInterval')}</Label>
            <p className='text-xs text-muted-foreground'>{t('nodePullIntervalDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.node_pull_interval}
              onBlur={(e) => {
                updateConfig('node_pull_interval', Number(e.target.value));
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('nodePushInterval')}</Label>
            <p className='text-xs text-muted-foreground'>{t('nodePushIntervalDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.node_push_interval}
              onBlur={(e) => {
                updateConfig('node_push_interval', Number(e.target.value));
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
