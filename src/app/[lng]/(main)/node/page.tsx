import { getTranslation } from '@/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GroupTable from './group-table';
import NodeTable from './node-table';

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await getTranslation(lng, 'node');

  return (
    <Tabs defaultValue='node'>
      <TabsList>
        <TabsTrigger value='node'>{t('node')}</TabsTrigger>
        <TabsTrigger value='group'>{t('nodeGroup')}</TabsTrigger>
      </TabsList>
      <TabsContent value='node'>
        <NodeTable />
      </TabsContent>
      <TabsContent value='group'>
        <GroupTable />
      </TabsContent>
    </Tabs>
  );
}
