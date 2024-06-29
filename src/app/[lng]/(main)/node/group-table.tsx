'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminNodeGroupCreate,
  postAdminNodeGroupList,
  postAdminNodeGroupOpenApiDelete,
  postAdminNodeGroupUpdate,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import DeleteButton from '@/components/delete-button';
import GroupForm from './group-form';

export default function GroupTable() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'node');

  const { data, refetch } = useQuery({
    queryKey: ['postAdminNodeGroupList'],
    queryFn: async () => {
      const { data } = await postAdminNodeGroupList({
        size: 0,
      });
      return data.data;
    },
  });

  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<API.NodeGroup>[] = [
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
            <GroupForm<API.NodeGroup>
              trigger={t('group.edit')}
              title={t('group.editNodeGroup')}
              loading={loading}
              initialValues={row.original}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await postAdminNodeGroupUpdate({
                    ...row.original,
                    id: row.original.id!,
                    ...values,
                  });
                  toast.success(t('group.createdSuccessfully'));
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
                await postAdminNodeGroupOpenApiDelete({
                  id: row.original.id!,
                });
                toast.success(t('group.deletedSuccessfully'));
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
          <GroupForm<API.NodeGroup>
            trigger={t('group.create')}
            title={t('group.createNodeGroup')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await postAdminNodeGroupCreate(values);
                toast.success(t('group.createdSuccessfully'));
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
            await postAdminNodeGroupOpenApiDelete({
              id: element.id!,
            });
          });
          toast.success(t('group.deletedSuccessfully'));
          refetch();
        },
      }}
    />
  );
}
