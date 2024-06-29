'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetVerifyCodeConfig,
  postAdminConfigUpdateVerifyCodeConfig,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function Verify() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'system.verify');

  const { data, refetch } = useQuery<API.GetVerifyCodeConfigResponse>({
    queryKey: ['postAdminConfigGetVerifyCodeConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetVerifyCodeConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateVerifyCodeConfig({
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
            <Label>{t('turnstileSiteKey')}</Label>
            <p className='text-xs text-muted-foreground'>{t('turnstileSiteKeyDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.turnstile_site_key}
              onBlur={(e) => {
                updateConfig('turnstile_site_key', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('turnstileSecret')}</Label>
            <p className='text-xs text-muted-foreground'>{t('turnstileSecretDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.turnstile_secret}
              onBlur={(e) => {
                updateConfig('turnstile_secret', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('registrationVerificationCode')}</Label>
            <p className='text-xs text-muted-foreground'>
              {t('registrationVerificationCodeDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.enable_register_verify_code}
              onCheckedChange={(checked) => {
                updateConfig('enable_register_verify_code', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('loginVerificationCode')}</Label>
            <p className='text-xs text-muted-foreground'>{t('loginVerificationCodeDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.enable_login_verify_code}
              onCheckedChange={(checked) => {
                updateConfig('enable_login_verify_code', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('resetPasswordVerificationCode')}</Label>
            <p className='text-xs text-muted-foreground'>
              {t('resetPasswordVerificationCodeDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.enable_reset_password_verify_code}
              onCheckedChange={(checked) => {
                updateConfig('enable_reset_password_verify_code', checked);
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
