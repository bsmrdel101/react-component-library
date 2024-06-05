interface Props {
  children: any
  value: string
  className?: string
  defaultOption?: boolean
  onClick?: () => void
}

export default function DropdownOption({ children, value, className, defaultOption, onClick }: Props) {
  return (
    <li className={`dropdown__option ${className || ''}`} onClick={() => onClick && onClick()} key={value}>
      { children }
    </li>
  );
}