'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetTelegramConfig,
  postAdminConfigUpdateTelegramConfig,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function Telegram() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'system.telegram');

  const { data, refetch } = useQuery<API.GetTelegramConfigResponse>({
    queryKey: ['postAdminConfigGetTelegramConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetTelegramConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateTelegramConfig({
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
            <Label>{t('botToken')}</Label>
            <p className='text-xs text-muted-foreground'>{t('botTokenDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholderBotToken')}
              defaultValue={data?.bot_token}
              onBlur={(e) => {
                updateConfig('bot_token', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('enableBotNotifications')}</Label>
            <p className='text-xs text-muted-foreground'>
              {t('enableBotNotificationsDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.enable_notify}
              onCheckedChange={(checked) => {
                updateConfig('enable_notify', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('groupURL')}</Label>
            <p className='text-xs text-muted-foreground'>{t('groupURLDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholderGroupURL')}
              defaultValue={data?.group_url}
              onBlur={(e) => {
                updateConfig('group_url', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
