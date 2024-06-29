'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminProductGroupCreate,
  postAdminProductGroupList,
  postAdminProductGroupOpenApiDelete,
  postAdminProductGroupUpdate,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import DeleteButton from '@/components/delete-button';
import GroupForm from './group-form';

const GroupTable = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'product');

  const { data, refetch } = useQuery({
    queryKey: ['postAdminProductGroupList'],
    queryFn: async () => {
      const { data } = await postAdminProductGroupList({
        size: 0,
      });
      return data.data;
    },
  });

  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<API.ProductGroup>[] = [
    {
      accessorKey: 'name',
      header: t('group.name'),
    },
    {
      accessorKey: 'remarks',
      header: t('group.description'),
    },
    {
      accessorKey: 'updated_at',
      header: t('group.updatedAt'),
      cell: ({ row }) => formatDate(row.getValue('updated_at'), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'actions',
      accessorKey: 'id',
      header: () => <div className='text-right'>{t('group.actions')}</div>,
      cell: ({ row }) => {
        return (
          <div className='flex justify-end gap-2'>
            <GroupForm<API.ProductGroup>
              trigger={t('group.edit')}
              title={t('group.editProductGroup')}
              loading={loading}
              initialValues={row.original}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await postAdminProductGroupUpdate({
                    ...row.original,
                    id: row.original.id!,
                    ...values,
                  });
                  toast.success(t('group.updateSuccess'));
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
              trigger={t('group.delete')}
              title={t('group.confirmDelete')}
              description={t('group.deleteWarning')}
              onConfirm={async () => {
                await postAdminProductGroupOpenApiDelete({
                  id: row.original.id!,
                });
                toast.success(t('group.deleteSuccess'));
                refetch();
              }}
              onCancelText={t('group.cancel')}
              onConfirmText={t('group.confirm')}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      header={
        <div className='flex justify-end'>
          <GroupForm<API.ProductGroup>
            trigger={t('group.create')}
            title={t('group.createProductGroup')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await postAdminProductGroupCreate(values);
                toast.success(t('group.createSuccess'));
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
        page: 1,
        size: data?.total,
        total: data?.total,
      }}
      operations={{
        remove: async (rowSelection) => {
          rowSelection.forEach(async (element) => {
            await postAdminProductGroupOpenApiDelete({
              id: element.id!,
            });
          });
          toast.success(t('group.deleteSuccess'));
          refetch();
        },
      }}
    />
  );
};

export default GroupTable;
