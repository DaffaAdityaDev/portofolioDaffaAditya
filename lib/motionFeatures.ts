// Loaded lazily by LazyMotion in _app so the animation features stay out of the shared bundle.
// domAnimation (animations, variants, exit, gestures, inView) is enough for every route. Layout animations
// (layoutId morphs, `layout`) need domMax, about 25 kB more, so components/LayoutMotion loads ./motionFeaturesMax
// through a nested LazyMotion around only the subtrees that use them. The navbar slides its pill with CSS
// so it doesn't pull domMax onto every page.
import { domAnimation } from 'framer-motion';

export default domAnimation;
