import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from './ui/label';

type Option = {
  value: string;
  label: string;
};

type SingleSelectProps = {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
};

type MultiSelectProps = {
  multiple: true;
  value?: string[];
  onChange?: (value: string[]) => void;
};

type ComboboxProps = {
  options: Option[];
  placeholder?: string;
} & (SingleSelectProps | MultiSelectProps);

function Combobox({
  options = [],
  value,
  onChange,
  multiple = false,
  placeholder = 'Select...',
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | string[]>(multiple ? [] : '');

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const updatedValues = (internalValue as string[]).includes(optionValue)
        ? (internalValue as string[]).filter((v) => v !== optionValue)
        : [...(internalValue as string[]), optionValue];
      setInternalValue(updatedValues);
      if (onChange) (onChange as (value: string[]) => void)(updatedValues);
    } else {
      setInternalValue(optionValue);
      if (onChange) (onChange as (value: string) => void)(optionValue);
      setOpen(false);
    }
  };

  const displayValue = multiple
    ? options
        .filter((opt) => (internalValue as string[]).includes(opt.value))
        .map((opt) => opt.label)
        .join(', ')
    : options.find((opt) => opt.value === (internalValue as string))?.label;

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='flex w-full items-center justify-between'
        >
          <div className='relative h-full flex-auto'>
            <span className='absolute left-0 size-full truncate text-left'>
              {displayValue || placeholder}
            </span>
          </div>
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search...' />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className=' justify-between'
                >
                  {option.label}
                  {multiple && (
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        (internalValue as string[]).includes(option.value)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Combobox;
