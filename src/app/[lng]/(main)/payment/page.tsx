import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlipayF2F from './alipayf2f';
import Epay from './epay';

export default function Page() {
  return (
    <Tabs defaultValue='Epay'>
      <TabsList>
        <TabsTrigger value='Epay'>Epay</TabsTrigger>
        <TabsTrigger value='AlipayF2F'>AlipayF2F</TabsTrigger>
      </TabsList>
      <TabsContent value='Epay'>
        <Epay />
      </TabsContent>
      <TabsContent value='AlipayF2F'>
        <AlipayF2F />
      </TabsContent>
    </Tabs>
  );
}
