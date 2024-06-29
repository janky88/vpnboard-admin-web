'use client';

import { ReactNode, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DeleteButton from './delete-button';
import { ScrollBar } from './ui/scroll-area';

interface DataTableProps<TData, TValue> {
  header?: ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    page?: number;
    size?: number;
    total?: number;
    onChange?: (page: number, size: number) => void;
  };
  operations?: {
    remove?: (rowSelection: TData[]) => Promise<void>;
  };
}

export function DataTable<TData, TValue>({
  header,
  columns,
  data,
  pagination = {},
  operations = {},
}: DataTableProps<TData, TValue>) {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'common');

  const { page = 1, size = 50, total = 0, onChange } = pagination;
  const { remove } = operations;
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns: [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={t('data.table.selectAll')}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t('data.table.selectRow')}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ] as ColumnDef<TData, TValue>[],
    getCoreRowModel: getCoreRowModel(),
    pageCount: parseInt(((total + size - 1) / size).toString()),
    onRowSelectionChange: setRowSelection,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
      rowSelection,
    },
  });

  return (
    <div className='flex w-full flex-col gap-2'>
      {header}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <Alert>
          <AlertTitle className='mb-0 flex items-center justify-between'>
            <span>
              {t('data.table.selectedItems', {
                count: table.getFilteredSelectedRowModel().rows.length,
              })}
            </span>
            <DeleteButton
              trigger={t('data.table.batchDelete')}
              title={t('data.table.confirmDelete')}
              description={t('data.table.deleteDescription')}
              onConfirm={() => {
                remove?.(
                  Object.keys(rowSelection).map((key) => {
                    return data[Number(key)];
                  }),
                );
              }}
              onCancelText={t('data.table.cancel')}
              onConfirmText={t('data.table.confirm')}
            />
          </AlertTitle>
        </Alert>
      )}
      <ScrollArea className='w-[calc(100vw-32px)] md:w-auto'>
        <Table className='min-w-[800px]'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {t('data.table.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <div className='mt-4 flex items-center justify-between px-2'>
        <div className='text-sm text-muted-foreground'>
          {t('data.table.totalItems')}:{total}
        </div>
        {table.getPageCount() > 1 && (
          <>
            <div className='text-sm text-muted-foreground'>
              {t('data.table.page')} {table.getState().pagination.pageIndex + 1}{' '}
              {t('data.table.of')} {table.getPageCount()}
            </div>
            <div className='flex items-center space-x-6 lg:space-x-8'>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  className='hidden size-8 p-0 lg:flex'
                  onClick={() => {
                    onChange?.(1, size);
                  }}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className='sr-only'>{t('data.table.goToFirstPage')}</span>
                  <DoubleArrowLeftIcon className='size-4' />
                </Button>
                <Button
                  variant='outline'
                  className='size-8 p-0'
                  onClick={() => {
                    onChange?.(page - 1, size);
                  }}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className='sr-only'>{t('data.table.goToPreviousPage')}</span>
                  <ChevronLeftIcon className='size-4' />
                </Button>
                <Button
                  variant='outline'
                  className='size-8 p-0'
                  onClick={() => {
                    onChange?.(page + 1, size);
                  }}
                  disabled={!table.getCanNextPage()}
                >
                  <span className='sr-only'>{t('data.table.goToNextPage')}</span>
                  <ChevronRightIcon className='size-4' />
                </Button>
                <Button
                  variant='outline'
                  className='hidden size-8 p-0 lg:flex'
                  onClick={() => {
                    onChange?.(table.getPageCount(), size);
                  }}
                  disabled={!table.getCanNextPage()}
                >
                  <span className='sr-only'>{t('data.table.goToLastPage')}</span>
                  <DoubleArrowRightIcon className='size-4' />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
