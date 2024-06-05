import { generateClasses, parseClasses } from "@/scripts/tools/utils";
import { useEffect } from "react";

interface Props {
  msg: string
  className?: string
  variant?: ('default')[]
  type: 'error' | 'success' | 'warning' | 'info'
  open: boolean
  setOpen: (open: boolean) => void
  duration?: number
}

export default function Toast({ msg, className = '', variant, type, open, setOpen, duration = 4000, ...props }: Props) {
  const classes = generateClasses(className, variant, 'toast');

  useEffect(() => {
    if (open) handleOpened();
  }, [open]);

  const handleOpened = () => {
    setTimeout(() => {
      setOpen(false);
    }, duration);
  };


  return (
    <>
      {open &&
        <div
          {...parseClasses(classes)}
          {...props}
        >
          <object data={`/images/notifications/${type}.svg`} className={`toast__icon--${type}`} width={65} height={65}></object>
          <p>{ msg }</p>
        </div>
      }
    </>
  );
}
