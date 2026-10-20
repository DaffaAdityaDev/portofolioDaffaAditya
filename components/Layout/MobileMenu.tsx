import React from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';
import { X } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import type { NavItem, SocialLink } from '@/types/navigation';

interface MobileMenuProps {
  id: string;
  /** Page links, without the desktop-only SOCIALS entry. */
  navItems: NavItem[];
  socialLinks: SocialLink[];
  isActive: (item: NavItem) => boolean;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => void;
  onClose: () => void;
}

/**
 * The open mobile menu sheet. Split out of Navbar so its markup only loads once the menu is opened
 * (Navbar warms the chunk on the trigger's pointerdown/focus). Render it inside Navbar's <AnimatePresence>.
 */
const MobileMenu = ({ id, navItems, socialLinks, isActive, onNavigate, onClose }: MobileMenuProps) => (
  <m.div
    id={id}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="flex flex-col w-full h-full pt-4 px-4 pb-6 pointer-events-auto absolute inset-0 justify-between"
  >
    <div className="flex items-center justify-between w-full pb-3 border-b border-border shrink-0">
      <div className="flex items-center gap-1.5">
        <span className="font-sans font-black text-xs tracking-[0.2em] text-white uppercase">DAFFA ADITYA</span>
        <span className="text-2xs font-mono text-muted-foreground font-medium tracking-wider">{'// PORTFOLIO'}</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge pulse boxed label="Available" />
        <button
          type="button"
          onClick={onClose}
          aria-expanded={true}
          aria-controls={id}
          className="text-muted-foreground hover:text-white rounded-lg p-1 cursor-pointer transition-colors duration-200"
          aria-label="Close navigation menu"
        >
          <X size={16} />
        </button>
      </div>
    </div>
    <nav className="flex flex-col gap-1 py-2 grow justify-center" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.path || `/#${item.id}`}
          onClick={(e) => { onClose(); onNavigate(e, item); }}
          className={`block py-2.5 px-4 text-xs font-bold font-mono tracking-widest uppercase rounded-lg transition-colors ${isActive(item) ? 'bg-white/[0.06] text-white font-black' : 'text-muted-foreground hover:text-white hover:bg-white/[0.02]'}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>

    {/* Social Links */}
    <div className="flex items-center justify-center gap-6 py-2.5 border-t border-border shrink-0">
      {socialLinks.map(({ label, href, Icon, external, aria }) => (
        <a
          key={label}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-muted-foreground hover:text-white transition-colors duration-200 p-1 rounded-lg"
          aria-label={aria}
        >
          {Icon && <Icon size={16} />}
        </a>
      ))}
    </div>

    <div className="pt-2.5 border-t border-border shrink-0">
      <Link
        href="/resume"
        onClick={onClose}
        className={buttonClasses({ variant: 'primary', size: 'sm', className: 'w-full' })}
      >
        Resume
      </Link>
    </div>
  </m.div>
);

export default MobileMenu;
