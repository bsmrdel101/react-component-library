import { generateClasses, parseClasses } from "@/scripts/tools/utils";
import React, { useEffect, useRef } from "react";
import Draggable from "./Draggable";
import Button from "./Button";
import { useAtom } from "jotai";
import { dialogsAtom } from "@/scripts/atoms/components";

interface Props {
  children: React.ReactNode
  className?: string
  variant?: ('default')[]
  title?: string
  closeOnOutsideClick?: boolean
  width?: number
  height?: number
  maxHeight?: string
  open?: boolean
  setOpen?: (open: boolean) => void
  x?: number
  y?: number
}


export default function Dialog({ children, className, variant, title, closeOnOutsideClick, width, height, maxHeight, open, setOpen, x, y, ...props }: Props) {
  const [dialogs, setDialogs] = useAtom<{ order: number, div: HTMLDivElement }[]>(dialogsAtom);
  const container = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const classes = generateClasses(className, variant, 'dialog');

  useEffect(() => {
    bindEventListeners();
    setupOrder();
  }, []);

  useEffect(() => {
    if (open) bringToFront();
  }, [open]);

  const setupOrder = () => {
    setDialogs(Array.from(document.querySelectorAll('.dialog__container')).map((div, i) => {
      const zIndex = Number((div as HTMLDivElement).style.zIndex);
      const order = zIndex > 0 ? zIndex : i;
      return { order, div: div as HTMLDivElement};
    }));
  };
  
  const bindEventListeners = () => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDialog();
      }
    };
  
    if (closeOnOutsideClick) {
      window.addEventListener('click', handleOutsideClick);
      return () => {
        window.removeEventListener('click', handleOutsideClick);
      };
    }
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const bringToFront = () => {
    const currentDialog = container.current;
    const maxOrder = Math.max(...dialogs.map(dialog => dialog.order));
    const updatedDialogs = dialogs.map(dialog => {
      if (dialog.div === currentDialog) {
        return { order: maxOrder + 1, div: dialog.div };
      } else if (dialog.order > Number(currentDialog.style.zIndex)) {
        return { order: dialog.order - 1, div: dialog.div };
      } else {
        return dialog;
      }
    }).sort((a, b) => a.order - b.order);
  
    updatedDialogs.forEach((dialog, index) => {
      dialog.div.style.zIndex = String(index);
    });
    setDialogs(updatedDialogs);
  };
    

  return (
    <div ref={container} style={{ zIndex: '0', position: 'absolute', top: 0, left: 0, height: '100%' }} className="dialog__container">
      <Draggable handle=".dialog__handlebar" y={y} x={x}>
        <dialog open={open} ref={ref} {...parseClasses(classes)} style={{ width: width, height: height }} onPointerDown={bringToFront}>
          <div className="dialog__handlebar draggable"></div>
          <div
            {...props}
          >
            <h3 className="dialog__title">{ title }</h3>
            <Button variant={["X"]} onClick={closeDialog}>X</Button>
            <div className="dialog__content" style={{ maxHeight: maxHeight }}>
              { children }
            </div>
          </div>
        </dialog>
      </Draggable>
    </div>
  );
}
