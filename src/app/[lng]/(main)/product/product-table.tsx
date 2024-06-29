'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminProductCreate,
  postAdminProductList,
  postAdminProductOpenApiDelete,
  postAdminProductUpdate,
} from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/data-table';
import DeleteButton from '@/components/delete-button';
import ProductForm from './product-form';
import ProductGroupSelect from './product-group-select';

export default function ProductTable() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'product');
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState<API.ListProductRequest>({
    product_group_id: undefined,
  });
  const { data, refetch } = useQuery<API.ListProductResponse>({
    queryKey: ['postAdminProductList', params],
    queryFn: async () => {
      const { data } = await postAdminProductList(params);
      return data.data || {};
    },
  });

  const columns: ColumnDef<API.Product>[] = [
    {
      accessorKey: 'is_show',
      header: t('show'),
      cell: ({ row }) => {
        return (
          <Switch
            defaultChecked={row.getValue('is_show')}
            onCheckedChange={async (checked) => {
              await postAdminProductUpdate({
                ...row.original,
                id: row.original.id!,
                node_groups: row.original.node_groups?.map((item) => item.id) as number[],
                nodes: row.original.nodes?.map((item) => item.id) as number[],
                is_show: checked,
              });
              refetch();
            }}
          />
        );
      },
    },
    {
      accessorKey: 'is_sale',
      header: t('sale'),
      cell: ({ row }) => {
        return (
          <Switch
            defaultChecked={row.getValue('is_sale')}
            onCheckedChange={async (checked) => {
              await postAdminProductUpdate({
                ...row.original,
                id: row.original.id!,
                node_groups: row.original.node_groups?.map((item) => item.id) as number[],
                nodes: row.original.nodes?.map((item) => item.id) as number[],
                is_sale: checked,
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
      accessorKey: 'remarks',
      header: t('description'),
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
            <ProductForm<API.UpdateProductRequest>
              trigger={t('edit')}
              title={t('editProduct')}
              loading={loading}
              initialValues={{
                ...row.original,
                id: row.original.id!,
                node_groups: row.original.node_groups?.map((item) => item.id) as number[],
                nodes: row.original.nodes?.map((item) => item.id) as number[],
              }}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await postAdminProductUpdate({
                    ...values,
                    id: row.original.id!,
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
                await postAdminProductOpenApiDelete({
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
          <ProductGroupSelect
            className='w-[180px]'
            placeholder={t('productGroup')}
            value={(params.product_group_id && String(params.product_group_id)) || ''}
            onValueChange={(value) =>
              setParams({
                product_group_id: Number(value),
              })
            }
          />
          <ProductForm<API.CreateProductRequest>
            trigger={t('create')}
            title={t('createProduct')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await postAdminProductCreate(values);
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
        page: 1,
        size: data?.list?.length,
        total: data?.list?.length,
      }}
      operations={{
        remove: async (rowSelection) => {
          rowSelection.forEach(async (element) => {
            await postAdminProductOpenApiDelete({
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
