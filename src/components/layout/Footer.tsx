import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const iconUrl = "https://static.wixstatic.com/media/c5947c_105b98aad40c4d4c8ca7de374634e9fa~mv2.png";

  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 text-primary mb-4">
              <Image src={iconUrl} alt="Sparkle" width={32} height={32} />
              <span className="text-2xl font-headline font-semibold">Viva La Beauty</span>
            </Link>
            <p className="text-sm">
              Your premier destination for waxing and beauty services in Sugar Land, Texas.
            </p>
            <p className="text-sm mt-2">
              15315 Southwest Fwy ste. 192, Sugar Land, TX 77478
            </p>
            <p className="text-sm">
              (832)316-1814
            </p>
          </div>

          <div>
            <h3 className="text-lg font-headline font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/book" className="hover:text-primary transition-colors">Book Appointment</Link></li>
              <li><Link href="/#testimonials" className="hover:text-primary transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-headline font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
            
              <a href="https://www.instagram.com/vivalabeautywax/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-secondary-foreground hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
             
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm">
          <p>&copy; {currentYear} Viva La Beauty. All rights reserved.</p>
          <p className="mt-1">Designed with <HeartIcon className="inline h-4 w-4 text-primary" /> in Sugar Land, TX</p>
        </div>
      </div>
    </footer>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
