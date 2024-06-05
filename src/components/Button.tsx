import React from "react";
import { generateClasses, parseClasses } from "../utils";

interface Props extends React.HTMLProps<HTMLButtonElement> {
  children: any
  className?: string
  variant?: ('small' | 'x-small' | 'large' | 'hover-move' | 'search' | 'X' | 'circle' | 'center' | 'plain' | 'save' | 'blue' | 'green' | 'red-color' | 'link')[]
  type?: 'submit' | 'reset' | 'button'
}


export default function Button({ children, className = '', variant, type, ...props }: Props) {
  const classes = generateClasses(className, variant, 'button');

  return (
    <button
      type={type}
      {...parseClasses(classes)}
      {...props}
    >
      { children }
    </button>
  );
}
