import { generateClasses, generateRandId, parseClasses } from "@/scripts/tools/utils";
import React, { Children, useState, useEffect } from "react";
import DropdownOption from "./DropdownOption";
import Image from "next/image";


interface Props {
  children: any
  className?: string
  variant?: ('small' | 'input' | 'label-space-between' | 'label-stack')[]
  label?: string
  value?: string
  onChange?: (value?: any) => void
}

export default function Dropdown({ children, className = '', variant, label = '', value, onChange }: Props) {
  const classes = generateClasses(className, variant && variant.filter((v) => !v.includes('label-stack' || 'label-space-between')), 'dropdown');
  const dropdownOptions: any = Children.toArray(children);
  const defaultValue = value || dropdownOptions[0].props.value;
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [previouslySelectedOption, setPreviouslySelectedOption] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [idProp, setIdProp] = useState('');
  let id = '';

  useEffect(() => {
    dropdownOptions.forEach((child: any) => {
      if (child.props.defaultOption) {
        setSelectedOption(child.props.value);
      }
    });

    id = generateRandId();
    setIdProp(id);
    window.addEventListener('click', (e: any) => handleScreenClick(e));
  }, []);


  const handleScreenClick = (e: any) => {
    const clickedDropdown = e.target.closest('.dropdown__option');
  
    if(clickedDropdown) {
      const array = (Array.from(clickedDropdown.classList).find((c: any) => c.includes('drop-id-')));
      if (!array) return;
      const clickedId = (array as string).replace('drop-id-', '');
      if (clickedId !== id) setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const selectOption = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
    if (onChange && previouslySelectedOption !== value) {
      onChange(value);
      setPreviouslySelectedOption(value);
    }
  };

  const getSortedDropdownOptions = dropdownOptions.sort((a: any, b: any) => {
    return a.props.value === selectedOption ? -1 : b.props.value === selectedOption ? 1 : 0;
  });

  const orderDropdownOptions = (dropdownOptions: any[]) => {
    dropdownOptions.sort((a, b) => a.props.value.localeCompare(b.props.value));
    const selected = dropdownOptions.find((child: any) => child.props.value === selectedOption);
    dropdownOptions.unshift(selected);
    return dropdownOptions;
  };

  let labelClass = '';
  if (variant) {
    if (variant.includes('label-space-between')) {
      labelClass += 'input--label-space-between ';
    }
    if (variant.includes('label-stack')) {
      labelClass += 'dropdown--label-stack ';
    }
  }

  let containerClass = '';
  if (variant) {
    if (variant.includes('small')) {
      containerClass = 'dropdown--small';
    }
  }


  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }} className={labelClass}>
      <p className="dropdown__label">{ label }</p>
      <div className={`dropdown__container ${containerClass}`}>
        <ul {...parseClasses(classes)} style={isOpen ? { position: 'absolute', zIndex: 1 } : {}}>
          {isOpen ?
            orderDropdownOptions([...dropdownOptions])
              .map((child: any, i: number) => {
                const { value, children } = child.props;

                return (
                  <DropdownOption
                    {...child.props}
                    className={`${value === selectedOption && i === 0 ? 'dropdown__option--selected' : ''}`}
                    onClick={() => selectOption(value)}
                    key={i}
                  >
                    <React.Fragment key={i}>
                      { children }
                      { (value === selectedOption && i === 0) && <Image className="dropdown__arrow" src="/images/icons/arrow-up.svg" alt="arrow" width={20} height={20} /> }
                    </React.Fragment>
                  </DropdownOption>
                );
              })
            :
            getSortedDropdownOptions.map((child: any) => {
              const { value, children, className } = child.props;

              if (value === selectedOption) {
                return (
                  <DropdownOption
                    {...child.props}
                    className={`${className} dropdown__option--selected drop-id-${idProp}`}
                    value={value}
                    onClick={() => setIsOpen(true)}
                    key={value}
                  >
                    <React.Fragment key={value}>
                      { children }
                      <Image className="dropdown__arrow" src="/images/icons/arrow-down.svg" alt="arrow" width={20} height={20} />
                    </React.Fragment>
                  </DropdownOption>
                );
              }
            })
          }
        </ul>
      </div>
    </div>
  );
}
