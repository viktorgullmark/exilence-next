import { useEffect, useRef, useState } from 'react';

function useLabelWidth(initialWidth: number) {
  const [labelWidth, setLabelWidth] = useState(initialWidth);
  const ref = useRef<HTMLLabelElement | null>(null);

  useEffect(() => {
    const width = ref.current ? ref.current.offsetWidth : 0;
    setLabelWidth(width);
  }, []);

  return { labelWidth, ref };
}

export default useLabelWidth;
