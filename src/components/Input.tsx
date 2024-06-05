import { generateClasses, parseClasses } from "@/scripts/tools/utils";

interface Props extends InputHTML {
  children?: any
  className?: string
  labelClass?: string
  variant?: ('thin' | 'small' | 'x-small' | 'search' | 'label-stack' | 'label-no-stack' | 'label-space-between' | 'md-text' | 'label-full-width' | 'label-bold' | 'text-area' | 'label-inline' | 'label-no-margin' | 'no-style' | 'label-fit-content')[]
  label?: string
  cols?: number
  rows?: number
}

export default function Input({ children, className = '', labelClass = '', variant = [], label, cols, rows, ...props }: Props) {
  const labelClassList = variant.filter((v) => v.includes('label'));
  const classes = generateClasses(className, variant ? variant.filter((v) => !labelClassList.includes(v)) : [], 'input');
  const labelClasses = generateClasses(labelClass, labelClassList, 'input');

  return (
    <label {...parseClasses(labelClasses)}>
      { label }

      {variant && variant.includes('text-area') ?
        <textarea
          {...parseClasses(classes)}
          {...props as any}
          cols={cols}
          rows={rows}
        />
        :
        <input
          {...parseClasses(classes)}
          {...props}
        />
      }
      { children }
    </label>
  );
}
