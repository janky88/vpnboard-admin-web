'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminKnowledgeCreate,
  postAdminKnowledgeList,
  postAdminKnowledgeOpenApiDelete,
  postAdminKnowledgeUpdate,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/data-table';
import DeleteButton from '@/components/delete-button';
import KnowledgeForm from './knowledge-form';

export default function Page() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'knowledge');
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState<API.ListKnowledgeRequest>({
    page: 1,
    size: 50,
  });

  const { data, refetch } = useQuery<API.ListKnowledgeResponse>({
    queryKey: ['postAdminKnowledgeList', params],
    queryFn: async () => {
      const { data } = await postAdminKnowledgeList(params);
      return data.data;
    },
  });

  const columns: ColumnDef<API.Knowledge>[] = [
    {
      accessorKey: 'enable',
      header: t('show'),
      cell: ({ row }) => {
        return (
          <Switch
            defaultChecked={row.getValue('enable')}
            onCheckedChange={async (checked) => {
              await postAdminKnowledgeUpdate({
                ...row.original,
                id: row.original.id!,
                enable: checked,
              });
              refetch();
            }}
          />
        );
      },
    },
    {
      accessorKey: 'title',
      header: t('title'),
    },
    {
      accessorKey: 'category',
      header: t('category'),
    },
    {
      accessorKey: 'updated_at',
      header: t('updatedAt'),
      cell: ({ row }) => format(row.getValue('updated_at'), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'actions',
      accessorKey: 'id',
      header: () => <div className='text-right'>{t('actions')}</div>,
      cell: ({ row }) => {
        return (
          <div className='flex justify-end gap-2'>
            <KnowledgeForm<API.UpdateKnowledgeRequest>
              trigger={t('edit')}
              title={t('editKnowledge')}
              loading={loading}
              initialValues={row.original}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await postAdminKnowledgeUpdate({
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
                await postAdminKnowledgeOpenApiDelete({
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
          <h1>{t('knowledgeList')}</h1>
          <KnowledgeForm<API.CreateKnowledgeRequest>
            trigger={t('create')}
            title={t('createKnowledge')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await postAdminKnowledgeCreate(values);
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
            await postAdminKnowledgeOpenApiDelete({
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
