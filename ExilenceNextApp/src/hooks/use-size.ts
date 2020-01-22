import { useState, useRef, useEffect } from 'react';

function useSize(listener?: number) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const width = ref.current ? ref.current.clientWidth : 0;
    const height = ref.current ? ref.current.clientHeight : 0;
    setWidth(width);
    setHeight(height);
  }, [listener]);

  return { width, height, ref };
}

export default useSize;

