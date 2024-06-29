'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetEmailConfig,
  postAdminConfigUpdateEmailConfig,
} from '@/services/api/admin';
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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

export default function Email() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'system.email');

  const { data, refetch } = useQuery<API.GetEmailConfigResponse>({
    queryKey: ['postAdminConfigGetEmailConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetEmailConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateEmailConfig({
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
            <Label>{t('smtpServerAddress')}</Label>
            <p className='text-xs text-muted-foreground'>{t('smtpServerAddressDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.smtp_host}
              onBlur={(e) => {
                updateConfig('smtp_host', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('smtpServerPort')}</Label>
            <p className='text-xs text-muted-foreground'>{t('smtpServerPortDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.smtp_port}
              onBlur={(e) => {
                updateConfig('smtp_port', Number(e.target.value));
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('smtpEncryptionMethod')}</Label>
            <p className='text-xs text-muted-foreground'>{t('smtpEncryptionMethodDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Select
              value={data?.smtp_encrypted}
              onValueChange={(value) => {
                updateConfig('smtp_encrypted', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>NONE</SelectItem>
                <SelectItem value='SSL'>SSL</SelectItem>
                <SelectItem value='TLS'>TLS</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('smtpAccount')}</Label>
            <p className='text-xs text-muted-foreground'>{t('smtpAccountDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.smtp_username}
              onBlur={(e) => {
                updateConfig('smtp_username', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('smtpPassword')}</Label>
            <p className='text-xs text-muted-foreground'>{t('smtpPasswordDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              type='password'
              defaultValue={data?.smtp_password}
              onBlur={(e) => {
                updateConfig('smtp_password', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('senderAddress')}</Label>
            <p className='text-xs text-muted-foreground'>{t('senderAddressDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.from_email}
              onBlur={(e) => {
                updateConfig('from_email', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('emailTemplate')}</Label>
            <p className='text-xs text-muted-foreground'>{t('emailTemplateDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Textarea
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.email_template}
              onBlur={(e) => {
                updateConfig('email_template', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('sendTestEmail')}</Label>
            <p className='text-xs text-muted-foreground'>{t('sendTestEmailDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Button>{t('sendTestEmail')}</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
