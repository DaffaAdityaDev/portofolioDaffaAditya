import type { ComponentType } from 'react';
import { lazyOnView as lazyOnViewShared } from '@/components/LazyOnView';
import { LAZY_WIDGET_ROOT_MARGIN } from '../constants';

/**
 * Blog widget whose HTML is part of the static page but whose JS chunk loads only when it
 * scrolls near the viewport. The shared `lazyOnView` with the blog's load margin.
 */
export function lazyOnView<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  return lazyOnViewShared(load, { rootMargin: LAZY_WIDGET_ROOT_MARGIN });
}
