'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetAlipayF2FConfig,
  postAdminConfigUpdateAlipayF2FConfig,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

export default function AlipayF2F() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'paymeny.alipayf2f');

  const { data, refetch } = useQuery<API.GetAliPayF2FConfigResponse>({
    queryKey: ['postAdminConfigGetAlipayF2FConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetAlipayF2FConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateAlipayF2FConfig({
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
            <Label>{t('alipayAppId')}</Label>
            <p className='text-xs text-muted-foreground'></p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.alipay_app_id}
              onBlur={(e) => {
                updateConfig('alipay_app_id', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('alipayPrivateKey')}</Label>
            <p className='text-xs text-muted-foreground'></p>
          </TableCell>
          <TableCell className='text-right'>
            <Textarea
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.alipay_private_key}
              onBlur={(e) => {
                updateConfig('alipay_private_key', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('alipayPublicKey')}</Label>
            <p className='text-xs text-muted-foreground'></p>
          </TableCell>
          <TableCell className='text-right'>
            <Textarea
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.alipay_public_key}
              onBlur={(e) => {
                updateConfig('alipay_public_key', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('goodsName')}</Label>
            <p className='text-xs text-muted-foreground'></p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('goodsNamePlaceholder')}
              defaultValue={data?.goods_name}
              onBlur={(e) => {
                updateConfig('goods_name', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
