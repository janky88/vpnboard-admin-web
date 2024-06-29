'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminNodeCreate,
  postAdminNodeGroupList,
  postAdminNodeList,
  postAdminNodeOpenApiDelete,
  postAdminNodeUpdate,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/data-table';
import DeleteButton from '@/components/delete-button';
import NodeForm from './node-form';

export default function NodeTable() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'node');

  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState<API.ListNodeRequest>({
    page: 1,
    size: 50,
  });
  const { data, refetch } = useQuery({
    queryKey: ['postAdminNodeList', params],
    queryFn: async () => {
      const { data } = await postAdminNodeList(params);
      return data.data;
    },
  });

  const { data: groups } = useQuery({
    queryKey: ['postAdminNodeGroupList', 'all'],
    queryFn: async () => {
      const { data } = await postAdminNodeGroupList({
        size: 0,
      });
      return data.data.list;
    },
  });

  const columns: ColumnDef<API.Node>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'protocol',
      header: t('type'),
    },
    {
      accessorKey: 'address',
      header: t('address'),
      cell: ({ row }) => {
        return `${row.original.address}:${row.original.port}`;
      },
    },
    {
      accessorKey: 'node_speed_limit',
      header: t('speedLimit'),
    },
    {
      accessorKey: 'traffic_rate',
      header: t('rate'),
    },
    {
      accessorKey: 'enabled',
      header: t('status'),
      cell: ({ row }) => {
        return (
          <Switch
            checked={row.getValue('enabled')}
            onCheckedChange={async (checked) => {
              await postAdminNodeUpdate({
                ...row.original,
                id: row.original.id!,
                enabled: checked,
              });
              refetch();
            }}
          />
        );
      },
    },
    {
      accessorKey: 'node_group_id',
      header: t('nodeGroup'),
      cell: ({ row }) =>
        groups?.find((group: API.NodeGroup) => group.id === row.getValue('node_group_id'))?.name,
    },
    {
      accessorKey: 'updated_at',
      header: t('updatedAt'),
      cell: ({ row }) => formatDate(row.getValue('updated_at'), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'actions',
      accessorKey: 'id',
      header: () => <div className='text-right'>{t('actions')}</div>,
      cell: ({ row }) => {
        return (
          <div className='flex justify-end gap-2'>
            <NodeForm<API.Node>
              trigger={t('edit')}
              title={t('editNode')}
              loading={loading}
              initialValues={row.original}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await postAdminNodeUpdate({ ...row.original, id: row.original.id!, ...values });
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
                await postAdminNodeOpenApiDelete({
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
        <div className='flex justify-between'>
          <Select
            onValueChange={(value) => {
              setParams({
                ...params,
                node_group_id: value === 'all' ? undefined : Number(value),
              });
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={t('nodeGroup')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='all'>{t('all')}</SelectItem>
                {groups?.map((group: API.NodeGroup) => (
                  <SelectItem key={group.id} value={String(group.id)}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <NodeForm<API.Node>
            trigger={t('create')}
            title={t('createNode')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await postAdminNodeCreate({ ...values, enabled: true } as API.Node);
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
            await postAdminNodeOpenApiDelete({
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
