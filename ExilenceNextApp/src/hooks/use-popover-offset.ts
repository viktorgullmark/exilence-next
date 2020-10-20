import { useEffect, useRef, useState } from 'react';

interface Offset {
  top: number;
  left: number;
}

function usePopoverOffset(windowSize?: number[]) {
  const [offset, setOffset] = useState<Offset>({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const current = ref.current as HTMLElement;
    const bounds = current.getBoundingClientRect();
    const top = current ? bounds.top + current.clientHeight : 0;
    const left = current ? bounds.left : 0;
    setOffset({ top, left });
  }, [windowSize]);

  return { offset, ref };
}

export default usePopoverOffset;
