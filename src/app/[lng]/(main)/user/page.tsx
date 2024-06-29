'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminUserCreate,
  postAdminUserList,
  postAdminUserOpenApiDelete,
  postAdminUserUpdate,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/data-table';
import DeleteButton from '@/components/delete-button';
import UserForm from './user-form';

export default function Page() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'user');
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState<API.ListUserRequest>({
    page: 1,
    size: 50,
  });

  const { data, refetch } = useQuery<API.ListUserResponse>({
    queryKey: ['postAdminUserList', params],
    queryFn: async () => {
      const { data } = await postAdminUserList(params);
      return data.data;
    },
  });

  const columns: ColumnDef<API.User>[] = [
    {
      accessorKey: 'enable',
      header: t('enable'),
      cell: ({ row }) => {
        return <Switch checked={row.getValue('enable')} />;
      },
    },
    {
      accessorKey: 'user_name',
      header: t('userName'),
    },
    {
      accessorKey: 'balance',
      header: t('balance'),
    },
    {
      accessorKey: 'created_at',
      header: t('createdAt'),
      cell: ({ row }) => format(row.getValue('created_at'), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'actions',
      accessorKey: 'id',
      header: () => <div className='text-right'>{t('actions')}</div>,
      cell: ({ row }) => {
        return (
          <div className='flex justify-end gap-2'>
            <UserForm<API.UpdateUserRequest>
              trigger={t('edit')}
              title={t('editUser')}
              loading={loading}
              initialValues={row.original}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await postAdminUserUpdate({
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
              description={t('deleteDescription')}
              onConfirm={async () => {
                await postAdminUserOpenApiDelete({
                  id: row.original.id,
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
          <h1>{t('userList')}</h1>
          <UserForm<API.CreateUserRequest>
            trigger={t('create')}
            title={t('createUser')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await postAdminUserCreate(values);
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
            await postAdminUserOpenApiDelete({
              id: element.id,
            });
          });
          toast.success(t('deleteSuccess'));
          refetch();
        },
      }}
    />
  );
}
