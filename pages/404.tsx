import type { NextPage } from 'next';
import Custom404Content from '@/features/Custom404';

// Title, noindex and the canonical opt-out live in Custom404Content (Seo with noCanonical).
const Custom404: NextPage = () => <Custom404Content />;

export default Custom404;
