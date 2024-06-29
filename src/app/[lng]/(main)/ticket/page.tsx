/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import {
  postAdminTicketClose,
  postAdminTicketContentGet,
  postAdminTicketContentSend,
  postAdminTicketList,
} from '@/services/api/admin';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/data-table';
import DeleteButton from '@/components/delete-button';

export default function Page() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'ticket');

  const [params, setParams] = useState<API.ListTicketRequest>({
    status: 1,
    page: 1,
    size: 50,
  });

  const { data, refetch } = useQuery<API.ListTicketResponse>({
    queryKey: ['postAdminTicketList', params],
    queryFn: async () => {
      const { data } = await postAdminTicketList(params);
      return data.data;
    },
  });

  const columns: ColumnDef<API.Ticket>[] = [
    {
      accessorKey: 'title',
      header: t('title'),
    },
    {
      accessorKey: 'created_at',
      header: t('createdAt'),
      cell: ({ row }) => formatDate(row.getValue('created_at'), 'yyyy-MM-dd HH:mm:ss'),
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
        if (params.status === 2) return;
        return (
          <div className='flex justify-end gap-2'>
            <Button size='sm' onClick={() => setTicket(row.original)}>
              {t('reply')}
            </Button>
            <DeleteButton
              trigger={t('close')}
              title={t('confirmClose')}
              description={t('closeWarning')}
              onConfirm={async () => {
                await postAdminTicketClose({
                  ticket_id: row.original.id!,
                });
                toast.success(t('closeSuccess'));
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

  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState('');

  const { data: ticketContent, refetch: refetchTicketContent } = useQuery<API.TicketContent[]>({
    queryKey: ['postAdminTicketContentGet', ticket?.id],
    enabled: !!ticket?.id,
    queryFn: async () => {
      const { data } = await postAdminTicketContentGet({
        ticket_id: ticket.id,
      });
      return data.data.list;
    },
  });

  return (
    <>
      <DataTable
        header={
          <div className='flex items-center justify-between'>
            <h1>{t('ticketList')}</h1>
            <Tabs
              value={String(params.status)}
              onValueChange={(value) => {
                setParams({
                  ...params,
                  page: 1,
                  status: Number(value) as API.TicketStatus,
                });
              }}
            >
              <TabsList>
                <TabsTrigger value='1'>{t('open')}</TabsTrigger>
                <TabsTrigger value='2'>{t('closed')}</TabsTrigger>
              </TabsList>
            </Tabs>
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
      />
      <Drawer
        open={!!ticket?.id}
        onOpenChange={(open) => {
          if (!open) setTicket(null);
        }}
      >
        <DrawerContent className='container h-screen'>
          <DrawerHeader className='border-b'>
            <DrawerTitle>{ticket?.title}</DrawerTitle>
            <DrawerDescription>{ticket?.context}</DrawerDescription>
          </DrawerHeader>
          <div className='flex flex-col gap-4 p-4'>
            {ticketContent?.map((item) => (
              <div
                key={item.id}
                className={cn('flex items-center gap-4', {
                  'flex-row-reverse': !!item.sender_id,
                })}
              >
                <div
                  className={cn('flex flex-col gap-1', {
                    'items-end': !!item.sender_id,
                  })}
                >
                  <p className='text-sm text-muted-foreground'>
                    {formatDate(item.created_at!, 'yyyy-MM-dd HH:mm:ss')}
                  </p>
                  <p
                    className={cn('w-fit rounded-lg bg-accent p-2 font-medium', {
                      'bg-primary text-primary-foreground': !!item.sender_id,
                    })}
                  >
                    {item.content_type === 'text' && item.content}
                    {item.content_type === 'image' && <img src={item.content!} alt='image' />}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <DrawerFooter>
            <form
              className='flex w-full flex-row items-center gap-2'
              onSubmit={async (event) => {
                event.preventDefault();
                if (message) {
                  await postAdminTicketContentSend({
                    content: message,
                    content_type: 'text',
                    ticket_id: ticket.id,
                  });
                  refetchTicketContent();
                  setMessage('');
                }
              }}
            >
              <Button type='button' variant='outline' className='p-0'>
                <Label htmlFor='picture' className='p-2'>
                  <Icon icon='mdi:image' className='text-2xl' />
                </Label>
                <Input
                  id='picture'
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = (e) => {
                        const img = new Image();
                        img.src = e.target?.result as string;
                        img.onload = () => {
                          const canvas = document.createElement('canvas');
                          const ctx = canvas.getContext('2d');

                          const maxWidth = 300;
                          const maxHeight = 300;
                          let width = img.width;
                          let height = img.height;

                          // 保持原始宽高比
                          if (width > height) {
                            if (width > maxWidth) {
                              height = Math.round((maxWidth / width) * height);
                              width = maxWidth;
                            }
                          } else {
                            if (height > maxHeight) {
                              width = Math.round((maxHeight / height) * width);
                              height = maxHeight;
                            }
                          }

                          canvas.width = width;
                          canvas.height = height;
                          ctx?.drawImage(img, 0, 0, width, height);

                          canvas.toBlob(
                            (blob) => {
                              const reader = new FileReader();
                              reader.readAsDataURL(blob!);
                              reader.onloadend = async () => {
                                await postAdminTicketContentSend({
                                  content: reader.result as string,
                                  content_type: 'image',
                                  ticket_id: ticket.id,
                                });
                                refetchTicketContent();
                              };
                            },
                            'image/webp',
                            0.8, // 压缩率为80%
                          );
                        };
                      };
                    }
                  }}
                />
              </Button>
              <Input
                placeholder={t('inputPlaceholder')}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <Button type='submit' disabled={!message}>
                {t('send')}
              </Button>
            </form>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
