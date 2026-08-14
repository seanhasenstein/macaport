import React from 'react';
import { useRouter } from 'next/router';

// Next scrolls to a hash target itself once a route change completes, but the
// target element is not reliably in the DOM at the moment it tries, so arriving
// at /#gang-sheets from another page can land at the top of the homepage
// instead. This runs the scroll again after the new page has painted.
//
// Same page hash clicks are handled by utils/scroll, which animates. Arriving
// from another page jumps instead, since animating a fresh page from the top
// reads as the page moving on its own.
export default function useHashScroll() {
  const router = useRouter();

  React.useEffect(() => {
    const scrollToCurrentHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;

      window.requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (!target) return;

        const html = document.documentElement;
        const previous = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
        target.scrollIntoView();
        html.style.scrollBehavior = previous;
      });
    };

    router.events.on('routeChangeComplete', scrollToCurrentHash);

    return () => {
      router.events.off('routeChangeComplete', scrollToCurrentHash);
    };
  }, [router.events]);
}
