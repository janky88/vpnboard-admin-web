import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { Input } from '@/components/ui/input';

interface Price {
  month: number;
  price: number;
}

interface PriceInputProps {
  value: Price[];
  onChange: (value: Price[]) => void;
}

export default function PriceInput({ value = [], onChange }: PriceInputProps) {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'product');

  // Ensure the value array has a length of 5
  const fixedLengthValue = [...Array(5)].map(
    (_, i) => value[i] || { month: undefined, price: undefined },
  );

  const handleFieldChange = (index: number, fieldName: string, value: number | undefined) => {
    const updatedValues = fixedLengthValue
      .map((field, i) => {
        if (i === index) {
          // 复制当前字段，并设置新的字段值
          const updatedField = { ...field, [fieldName]: value };

          // 过滤掉所有字段值都是 undefined 的情况
          const hasDefinedValues = Object.values(updatedField).some((val) => val !== undefined);
          return hasDefinedValues ? updatedField : field;
        } else {
          return field;
        }
      })
      .filter((item) => item.month || item.price);
    onChange(updatedValues);
  };

  return (
    <div className='flex flex-col gap-1.5'>
      {fixedLengthValue.map((field, index) => (
        <div className='flex gap-2' key={index}>
          <Input
            type='number'
            placeholder={t('form.duration')}
            value={field.month ? field.month : undefined}
            onChange={(e) => handleFieldChange(index, 'month', Number(e.target.value))}
          />
          <Input
            type='number'
            placeholder={t('form.price')}
            value={field.price ? field.price : undefined}
            onChange={(e) => handleFieldChange(index, 'price', Number(e.target.value))}
          />
        </div>
      ))}
    </div>
  );
}
