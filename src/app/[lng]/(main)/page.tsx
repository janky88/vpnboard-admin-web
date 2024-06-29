import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Dashboard() {
  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-8'>
      <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>总用户</CardTitle>
            <Icon icon='mdi:users' className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>1,845,231</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>上月新增</CardTitle>
            <Icon icon='mdi:users' className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>5,231</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>本月新增</CardTitle>
            <Icon icon='mdi:users' className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>4,231</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>今日新增</CardTitle>
            <Icon icon='mdi:users' className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>231</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>总收入</CardTitle>
            <Icon icon='mdi:money' className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>999,999,999</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>上月收入</CardTitle>
            <Icon icon='mdi:money' className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>9,999,999</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>本月收入</CardTitle>
            <Icon icon='mdi:money' className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>8,999,999</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>今日收入</CardTitle>
            <Icon icon='mdi:money' className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>9,999</CardContent>
        </Card>
      </div>
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader>
            <CardTitle>今日节点流量排行</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类型</TableHead>
                  <TableHead>节点</TableHead>
                  <TableHead className='text-right'>流量</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {new Array(10)
                  .toString()
                  .split(',')
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge>Trojan</Badge>
                      </TableCell>
                      <TableCell>
                        <div className='font-medium'>节点名称</div>
                        <div className='hidden text-sm text-muted-foreground md:inline'>
                          127.0.0.1:443
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>1,000 GB</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>今日用户流量排行</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            {new Array(15)
              .toString()
              .split(',')
              .map((item, index) => (
                <div className='flex items-center gap-4' key={index}>
                  <div className='text-sm font-medium leading-none'>olivia.martin@email.com</div>
                  <div className='ml-auto font-medium'>100 GB</div>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card className='xl:col-span-2'>
          <CardHeader>
            <CardTitle>昨日节点流量排行</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类型</TableHead>
                  <TableHead>节点</TableHead>
                  <TableHead className='text-right'>流量</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {new Array(10)
                  .toString()
                  .split(',')
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge>Vless</Badge>
                      </TableCell>
                      <TableCell>
                        <div className='font-medium'>节点名称</div>
                        <div className='hidden text-sm text-muted-foreground md:inline'>
                          127.0.0.1:443
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>1,000 GB</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>昨日用户流量排行</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            {new Array(15)
              .toString()
              .split(',')
              .map((item, index) => (
                <div className='flex items-center gap-4' key={index}>
                  <div className='text-sm font-medium leading-none'>olivia.martin@email.com</div>
                  <div className='ml-auto font-medium'>999 GB</div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
