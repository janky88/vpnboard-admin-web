'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminAnnouncementCreate,
  postAdminAnnouncementList,
  postAdminAnnouncementOpenApiDelete,
  postAdminAnnouncementUpdate,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/data-table';
import DeleteButton from '@/components/delete-button';
import NoticeForm from './notice-form';

export default function Page() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'notice');

  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState<API.ListAnnouncementRequest>({
    page: 1,
    size: 50,
  });

  const { data, refetch } = useQuery<API.ListAnnouncementResponse>({
    queryKey: ['postAdminAnnouncementList', params],
    queryFn: async () => {
      const { data } = await postAdminAnnouncementList(params);
      return data.data;
    },
  });

  const columns: ColumnDef<API.Announcement>[] = [
    {
      accessorKey: 'enable',
      header: t('enable'),
      cell: ({ row }) => {
        return (
          <Switch
            defaultChecked={row.getValue('enable')}
            onCheckedChange={async (checked) => {
              await postAdminAnnouncementUpdate({
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
      accessorKey: 'content',
      header: t('content'),
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
            <NoticeForm<API.Announcement>
              trigger={t('edit')}
              title={t('editAnnouncement')}
              loading={loading}
              initialValues={row.original}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await postAdminAnnouncementUpdate({
                    ...row.original,
                    id: row.original.id!,
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
                await postAdminAnnouncementOpenApiDelete({
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
          <h1>{t('announcementList')}</h1>
          <NoticeForm<API.Announcement>
            trigger={t('create')}
            title={t('createAnnouncement')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await postAdminAnnouncementCreate(values);
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
            await postAdminAnnouncementOpenApiDelete({
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
