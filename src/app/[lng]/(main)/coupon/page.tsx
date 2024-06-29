'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminCouponCreate,
  postAdminCouponList,
  postAdminCouponOpenApiDelete,
  postAdminCouponUpdate,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/data-table';
import DeleteButton from '@/components/delete-button';
import CouponForm from './coupon-form';

export default function Page() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'coupon');

  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<API.ListCouponRequest>({
    page: 1,
    size: 50,
  });

  const { data, refetch } = useQuery<API.ListCouponResponse>({
    queryKey: ['postAdminCouponList', params],
    queryFn: async () => {
      const { data } = await postAdminCouponList(params);
      return data.data;
    },
  });

  const columns: ColumnDef<API.Coupon>[] = [
    {
      accessorKey: 'enable',
      header: t('enable'),
      cell: ({ row }) => {
        return (
          <Switch
            defaultChecked={row.getValue('enable')}
            onCheckedChange={async (checked) => {
              await postAdminCouponUpdate({
                ...row.original,
                enable: checked,
              });
              refetch();
            }}
          />
        );
      },
    },
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'coupon_type',
      header: t('discount'),
      cell: ({ row }) => (
        <Badge variant={row.getValue('coupon_type') === 1 ? 'default' : 'secondary'}>
          {row.getValue('coupon_type') === 1 ? t('percentage') : t('amount')}
        </Badge>
      ),
    },
    {
      accessorKey: 'coupon_type',
      header: t('discount'),
      cell: ({ row }) => (
        <Badge variant={row.getValue('coupon_type') === 1 ? 'default' : 'secondary'}>
          {row.getValue('coupon_type') === 1
            ? `${row.original.discount} %`
            : `¥ ${row.original.amount}`}
        </Badge>
      ),
    },
    {
      accessorKey: 'code',
      header: t('code'),
    },
    {
      accessorKey: 'used',
      header: t('usedTimes'),
    },
    {
      accessorKey: 'max_use',
      header: t('remainingTimes'),
    },
    {
      accessorKey: 'expire',
      header: t('validityPeriod'),
      cell: ({ row }) => {
        const expire = row.original.expire;
        if (expire) {
          return expire.to ? (
            <>
              {format(expire.from!, 'y-LL-dd')} - {format(expire.to!, 'y-LL-dd')}
            </>
          ) : expire?.from ? (
            format(expire?.from!, 'y-LL-dd')
          ) : (
            '-'
          );
        }
        return '-';
      },
    },
    {
      id: 'actions',
      accessorKey: 'id',
      header: () => <div className='text-right'>{t('actions')}</div>,
      cell: ({ row }) => {
        return (
          <div className='flex justify-end gap-2'>
            <CouponForm<API.UpdateCouponRequest>
              trigger={t('edit')}
              title={t('editCoupon')}
              loading={loading}
              initialValues={row.original}
              type='update'
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await postAdminCouponUpdate({
                    ...row.original,
                    ...values,
                  });
                  toast.success(t('updateSuccess'));
                  refetch();
                  setLoading(false);
                  return true;
                } catch (error) {
                  setLoading(false);
                  return false;
                }
              }}
            />
            <DeleteButton
              trigger={t('delete')}
              title={t('confirmDelete')}
              description={t('deleteWarning')}
              onConfirm={async () => {
                await postAdminCouponOpenApiDelete({
                  id: row.original.id!,
                });
                toast.success(t('deleteSuccess'));
                refetch();
              }}
              onCancelText={t('cancel')}
              onConfirmText={t('confirm')}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      header={
        <div className='flex items-center justify-between'>
          <h1>{t('couponList')}</h1>
          <CouponForm<API.CreateCouponRequest>
            trigger={t('create')}
            title={t('createCoupon')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await postAdminCouponCreate(values);
                toast.success(t('createSuccess'));
                refetch();
                setLoading(false);
                return true;
              } catch (error) {
                setLoading(false);
                return false;
              }
            }}
          />
        </div>
      }
      columns={columns}
      data={data?.list || []}
      pagination={{
        page: params.page,
        size: params.size,
        total: data?.total,
        onChange: (page, size) => {
          setParams({
            ...params,
            page,
            size,
          });
        },
      }}
      operations={{
        remove: async (rowSelection) => {
          rowSelection.forEach(async (element) => {
            await postAdminCouponOpenApiDelete({
              id: element.id!,
            });
          });
          toast.success(t('deleteSuccess'));
          refetch();
        },
      }}
    />
  );
}
