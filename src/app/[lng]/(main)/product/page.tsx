import { getTranslation } from '@/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GroupTable from './group-table';
import ProductTable from './product-table';

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await getTranslation(lng, 'product');

  return (
    <Tabs defaultValue='product'>
      <TabsList>
        <TabsTrigger value='product'>{t('product')}</TabsTrigger>
        <TabsTrigger value='group'>{t('productGroup')}</TabsTrigger>
      </TabsList>
      <TabsContent value='product'>
        <ProductTable />
      </TabsContent>
      <TabsContent value='group'>
        <GroupTable />
      </TabsContent>
    </Tabs>
  );
}
