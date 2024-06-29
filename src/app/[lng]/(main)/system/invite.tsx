'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminConfigGetInviteConfig,
  postAdminConfigUpdateInviteConfig,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function Invite() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'system.invite');

  const { data, refetch } = useQuery<API.GetInviteConfigResponse>({
    queryKey: ['postAdminConfigGetInviteConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetInviteConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateInviteConfig({
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
            <Label>{t('enableForcedInvite')}</Label>
            <p className='text-xs text-muted-foreground'>{t('enableForcedInviteDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.forced_invite}
              onCheckedChange={(checked) => {
                updateConfig('forced_invite', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('inviteCommissionPercentage')}</Label>
            <p className='text-xs text-muted-foreground'>
              {t('inviteCommissionPercentageDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Input
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.referral_percentage}
              onBlur={(e) => {
                updateConfig('referral_percentage', Number(e.target.value));
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('commissionFirstTimeOnly')}</Label>
            <p className='text-xs text-muted-foreground'>
              {t('commissionFirstTimeOnlyDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              defaultChecked={data?.only_first_purchase}
              onCheckedChange={(checked) => {
                updateConfig('only_first_purchase', checked);
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
