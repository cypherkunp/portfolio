import { useEffect } from 'react';

//TODO - buggy needs to be fixed
const useCustomCursor = () => {
  useEffect(() => {
    const cursorSmall = document.querySelector('.custom-cursor') as HTMLElement;

    const positionElement = (e: MouseEvent) => {
      const mouseY = e.clientY;
      const mouseX = e.clientX;

      cursorSmall.style.transform = `translate3d(${mouseX - 1300}px, ${mouseY - 100}px, 0)`;
    };

    window.addEventListener('mousemove', positionElement);

    return () => {
      window.removeEventListener('mousemove', positionElement);
    };
  }, []);
};

export default useCustomCursor;
