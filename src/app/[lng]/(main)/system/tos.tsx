'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { postAdminConfigGetTocConfig, postAdminConfigUpdateTocConfig } from '@/services/api/admin';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Markdown from '@/components/markdown';
import MarkdownEditor from '@/components/markdown-editor';

export default function Tos() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'system.tos');

  const { data, refetch } = useQuery<API.GetTOCConfigResponse>({
    queryKey: ['postAdminConfigGetTocConfig'],
    queryFn: async () => {
      const { data } = await postAdminConfigGetTocConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: any) {
    // @ts-ignore
    if (data?.[key] === value) return;
    try {
      await postAdminConfigUpdateTocConfig({
        ...data,
        [key]: value,
      });
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {}
  }

  return (
    <MarkdownEditor
      className='h-[500px]'
      renderHTML={(text) => <Markdown>{text}</Markdown>}
      defaultValue={data?.content}
      onChange={({ text }) => {
        updateConfig('content', text);
      }}
    />
  );
}
