import { NextRouter } from 'next/router';

// Next's router deliberately forces instant scrolling on navigation, so the CSS
// scroll-behavior in MarketingGlobalStyles never applies to <Link> clicks. This
// takes over the click when the target is already on the rendered page and does
// the scroll itself.
//
// Returns true when it handled the scroll, meaning the caller should call
// preventDefault. Returns false for anything it should leave to Next, such as a
// hash link followed from a different page.
export function scrollToHash(href: string, router: NextRouter) {
  if (typeof window === 'undefined') return false;

  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return false;

  const path = href.slice(0, hashIndex);
  const id = href.slice(hashIndex + 1);
  if (!id) return false;

  // An empty path means the link is relative to whatever page is open.
  if (path && path !== router.asPath.split('#')[0]) return false;

  const target = document.getElementById(id);
  if (!target) return false;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const scroll = () =>
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

  // Update the URL before scrolling. router.push writes a history entry and the
  // browser resets scroll position on that new entry, which silently cancels an
  // animation that is already running. Waiting on the push promise orders the
  // scroll after that reset; requestAnimationFrame is not a strong enough
  // guarantee and drops the scroll intermittently.
  router.push(href, undefined, { scroll: false }).then(scroll, scroll);

  return true;
}
