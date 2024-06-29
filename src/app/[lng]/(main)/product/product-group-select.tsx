'use client';

import { postAdminProductGroupList } from '@/services/api/admin';
import { Icon } from '@iconify/react';
import { SelectProps } from '@radix-ui/react-select';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProductGroupSelect({
  className,
  placeholder,
  ...props
}: SelectProps & {
  className?: string;
  placeholder?: string;
}) {
  const { data } = useQuery<API.ProductGroup[]>({
    queryKey: ['postAdminProductGroupList', 'all'],
    queryFn: async () => {
      const { data } = await postAdminProductGroupList({
        size: 0,
      });
      return data.data.list;
    },
  });

  return (
    <div className={cn('relative', className)}>
      <Select {...props}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {data?.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {(props.value || props.defaultValue) && (
        <Icon
          icon='mdi:close'
          className='absolute right-7 top-1/2 -translate-y-1/2 cursor-pointer'
          onClick={(e) => {
            e.preventDefault();
            props.onValueChange?.('');
          }}
        />
      )}
    </div>
  );
}
