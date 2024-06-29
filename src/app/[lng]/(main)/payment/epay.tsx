'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetEpayConfig,
  postAdminConfigUpdateEpayConfig,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function Epay() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'payment.epay');

  const { data, refetch } = useQuery<API.GetEPayConfigResponse>({
    queryKey: ['postAdminConfigGetEpayConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetEpayConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateEpayConfig({
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
            <Label>{t('enable')}</Label>
            <p className='text-xs text-muted-foreground'>{t('enableDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.enable}
              onCheckedChange={(checked) => {
                updateConfig('enable', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('showName')}</Label>
            <p className='text-xs text-muted-foreground'>{t('showNameDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.show_name}
              onBlur={(e) => {
                updateConfig('show_name', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('iconUrl')}</Label>
            <p className='text-xs text-muted-foreground'>{t('iconUrlDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.icon_url}
              onBlur={(e) => {
                updateConfig('icon_url', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('notifyUrl')}</Label>
            <p className='text-xs text-muted-foreground'>{t('notifyUrlDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.notify_url}
              onBlur={(e) => {
                updateConfig('notify_url', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('feePercent')}</Label>
            <p className='text-xs text-muted-foreground'>{t('feePercentDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              type='number'
              defaultValue={data?.fee_percent ? Number(data?.fee_percent) : undefined}
              onBlur={(e) => {
                updateConfig('fee_percent', Number(e.target.value));
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('fixedFee')}</Label>
            <p className='text-xs text-muted-foreground'>{t('fixedFeeDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              type='number'
              defaultValue={data?.fee ? Number(data?.fee) : undefined}
              onBlur={(e) => {
                updateConfig('fee', Number(e.target.value));
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('url')}</Label>
            <p className='text-xs text-muted-foreground'></p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.url}
              onBlur={(e) => {
                updateConfig('url', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('pid')}</Label>
            <p className='text-xs text-muted-foreground'></p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.pid}
              onBlur={(e) => {
                updateConfig('pid', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('key')}</Label>
            <p className='text-xs text-muted-foreground'></p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.key}
              onBlur={(e) => {
                updateConfig('key', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
