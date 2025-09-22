
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/training', label: 'Training' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const iconUrl = "https://static.wixstatic.com/media/c5947c_105b98aad40c4d4c8ca7de374634e9fa~mv2.png";

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
            <Image src={iconUrl} alt="Sparkle" width={32} height={32} />
            <span className="text-2xl font-headline font-semibold">Viva La Beauty</span>
          </Link>

          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground hover:text-primary transition-colors font-medium">
                {link.label}
              </Link>
            ))}
            <Button asChild>
              <Link href="/book">Book Now</Link>
            </Button>
          </nav>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background p-6">
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-between items-center">
                     <Link href="/" className="flex items-center space-x-2 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                        <Image src={iconUrl} alt="Sparkle" width={28} height={28} />
                        <span className="text-xl font-headline font-semibold">Viva La Beauty</span>
                    </Link>
                    <SheetClose asChild>
                         <Button variant="ghost" size="icon" aria-label="Close menu">
                            <X className="h-6 w-6" />
                        </Button>
                    </SheetClose>
                  </div>
                  
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="text-lg text-foreground hover:text-primary transition-colors py-2 block"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Button asChild className="w-full">
                      <Link href="/book">Book Now</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
