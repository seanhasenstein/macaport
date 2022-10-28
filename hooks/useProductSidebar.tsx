import { PersonalizationAddon } from 'interfaces';
import React from 'react';

type Props = {
  isOpen: boolean;
  sizePrice: number;
  personalization: {
    addonItems: PersonalizationAddon[];
    total: number;
  };
  resetProduct: () => void;
};

export default function useProductSidebar(props: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  const itemPrice =
    props.sizePrice +
    (props.personalization.addonItems.length > 0
      ? props.personalization.total
      : 0);

  React.useEffect(() => {
    const handleEscapeKeyup = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        props.resetProduct();
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        props.resetProduct();
    };

    if (props.isOpen) {
      closeButtonRef?.current && closeButtonRef.current.focus();
      document.addEventListener('keyup', handleEscapeKeyup);
      document.addEventListener('click', handleOutsideClick);

      const timeout = setTimeout(() => {
        props.resetProduct();
      }, 5000);

      return () => {
        document.removeEventListener('keyup', handleEscapeKeyup);
        document.removeEventListener('click', handleOutsideClick);
        clearTimeout(timeout);
      };
    }
  }, [props.isOpen, props.resetProduct]);

  return { closeButtonRef, containerRef, itemPrice };
}
