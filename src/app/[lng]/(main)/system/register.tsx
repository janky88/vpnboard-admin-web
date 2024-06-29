'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetRegisterConfig,
  postAdminConfigUpdateRegisterConfig,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

export default function Register() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'system.register');

  const { data, refetch } = useQuery<API.GetRegisterConfigResponse>({
    queryKey: ['postAdminConfigGetRegisterConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetRegisterConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateRegisterConfig({
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
            <Label>{t('stopNewUserRegistration')}</Label>
            <p className='text-xs text-muted-foreground'>
              {t('stopNewUserRegistrationDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.stop_register}
              onCheckedChange={(checked) => {
                updateConfig('stop_register', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('trialRegistration')}</Label>
            <p className='text-xs text-muted-foreground'>{t('trialRegistrationDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.trial}
              onCheckedChange={(checked) => {
                updateConfig('trial', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('emailVerification')}</Label>
            <p className='text-xs text-muted-foreground'>{t('emailVerificationDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.email_verify}
              onCheckedChange={(checked) => {
                updateConfig('email_verify', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('emailSuffixWhitelist')}</Label>
            <p className='text-xs text-muted-foreground'>{t('emailSuffixWhitelistDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.enable_email_whitelist}
              onCheckedChange={(checked) => {
                updateConfig('enable_email_whitelist', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('whitelistSuffixes')}</Label>
            <p className='text-xs text-muted-foreground'>{t('whitelistSuffixesDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Textarea
              placeholder={t('whitelistSuffixesPlaceholder')}
              defaultValue={data?.email_whitelist}
              onBlur={(e) => {
                updateConfig('email_whitelist', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('ipRegistrationLimit')}</Label>
            <p className='text-xs text-muted-foreground'>{t('ipRegistrationLimitDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.enable_ip_limit}
              onCheckedChange={(checked) => {
                updateConfig('enable_ip_limit', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('registrationLimitCount')}</Label>
            <p className='text-xs text-muted-foreground'>
              {t('registrationLimitCountDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              type='number'
              defaultValue={data?.ip_limit}
              onBlur={(e) => {
                updateConfig('ip_limit', Number(e.target.value));
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('penaltyTime')}</Label>
            <p className='text-xs text-muted-foreground'>{t('penaltyTimeDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              type='number'
              defaultValue={data?.ip_limit_duration}
              onBlur={(e) => {
                updateConfig('ip_limit_duration', Number(e.target.value));
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
