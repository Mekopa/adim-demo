import { RefObject } from 'react';

export function useHorizontalScroll(ref: RefObject<HTMLElement>) {
  const scrollLeft = () => {
    if (!ref.current) return;
    ref.current.scrollLeft -= ref.current.clientWidth / 2;
  };

  const scrollRight = () => {
    if (!ref.current) return;
    ref.current.scrollLeft += ref.current.clientWidth / 2;
  };

  return { scrollLeft, scrollRight };
}