import React, { useState, useEffect } from 'react';
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from "next-themes";
import { FaGithub } from "react-icons/fa";
import { MoonIcon, SunIcon } from "../icons";
import { motion } from 'framer-motion';
import { opacity } from '../PageTransition/anim';
import { useAnimation } from '@/contexts/AnimationContext';

const anim = (variants: any) => {
    return {
        initial: "initial",
        animate: "enter",
        exit: "exit",
        variants
    }
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { setIsAnimating, setPrevPath, startPageTransition } = useAnimation();

  const menuItems = [
    { name: "Home", href: "/", comingSoon: false },
    { name: "Blog", href: "/blog", comingSoon: false },
    { name: "Tutorial", href: "#", comingSoon: true },
    { name: "QnA", href: "#", comingSoon: true },
    { name: "About", href: "#", comingSoon: true },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = async (e: React.MouseEvent, href: string, comingSoon: boolean) => {
    e.preventDefault();
    
    if (comingSoon) {
      setIsModalOpen(true);
      setIsMenuOpen(false);
      return;
    }

    const currentScroll = window.scrollY;
    sessionStorage.setItem('scrollPosition', currentScroll.toString());

    setIsMenuOpen(false);
    startPageTransition(router.asPath);
    
    await router.push(href, undefined, { scroll: false });
  };

  if (!mounted) return null;

  return (
    <>
      <div className="fixed top-4 z-50 flex w-full justify-center px-2 sm:px-4 md:px-6 lg:px-8 text-foreground">
        <NextUINavbar
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
          className={`transition-all duration-500 ease-in-out max-w-[100%] ${
            scrolled
              ? 'w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] bg-background/20 backdrop-blur-xl border-1 border-default-200'
              : 'w-full px-2 sm:px-4 md:px-6 lg:px-8 bg-transparent'
          }`}
          classNames={{
            base: "rounded-full",
            wrapper: "px-2 sm:px-4",
            toggle: "text-foreground",
            menu: "bg-background/20 backdrop-blur-xl",
          }}
          height={scrolled ? "3rem" : "4rem"}
        >
          <NavbarContent className="sm:hidden" justify="start">
            <NavbarMenuToggle 
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="text-foreground"
            />
          </NavbarContent>

          <NavbarContent className="hidden sm:flex" justify="start">
            <NavbarBrand>
              
                <Link
                  href="https://github.com/DaffaAdityaDev"
                  className={`flex items-center gap-1 sm:gap-2 font-bold transition-all ${
                  scrolled ? 'scale-90' : 'scale-100'
                }`}
                >
                  <FaGithub className='w-8 h-8 sm:w-10 sm:h-10 fill-foreground' />
                </Link>
             
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-2 md:gap-4" justify="center">
            {menuItems.map((item, index) => (
              <NavbarItem className='h-full' key={`${item.name}-${index}`}>
                <Link 
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href, item.comingSoon)}
                  className="text-foreground text-sm md:text-base h-full flex items-center justify-center"
                >
                  {item.name}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>

          <NavbarContent justify="end">
            <NavbarItem className="flex items-center justify-center">
              <Button
                isIconOnly
                variant="light"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="mr-2 sm:mr-4"
              >
                {theme === 'dark' ? 
                  <SunIcon height={18} width={18} className="sm:h-5 sm:w-5" /> : 
                  <MoonIcon height={18} width={18} className="sm:h-5 sm:w-5" />
                }
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Link
                href="https://drive.google.com/file/d/16bp1lgGaVHe670IO1bR7khk01h6GaXdC/view?usp=share_link"
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-full bg-foreground px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-background transition-all duration-500 ease-in-out ${
                  scrolled ? 'scale-90' : 'scale-100'
                }`}
              >
                Resume
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarMenu className="bg-background/20 backdrop-blur-xl mt-4">
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.name}-${index}`}>
                <Link
                  href={item.href}
                  className="text-foreground w-full"
                  onClick={(e) => handleLinkClick(e, item.href, item.comingSoon)}
                >
                  {item.name}
                </Link>
              </NavbarMenuItem>
            ))}
           
          </NavbarMenu>
        </NextUINavbar>
      </div>

  
      <Modal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Coming Soon</ModalHeader>
          <ModalBody>
            <p className='mb-4'>This feature is currently under development. Stay tuned!</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Navbar;
