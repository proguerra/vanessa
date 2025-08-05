import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
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
              <a 
                href="https://www.instagram.com/vivalabeautywax2025" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-secondary-foreground hover:text-primary transition-colors"
              >
                <Instagram size={24} />
              </a>

              <a 
                href="https://www.facebook.com/vanessa.avellaneda.257916" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-secondary-foreground hover:text-primary transition-colors"
              >
                <Facebook size={24} />
              </a>

              <a 
                href="https://www.tiktok.com/@vivalabeauty_tx" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-secondary-foreground hover:text-primary transition-colors"
              >
                {/* Nuevo ícono de TikTok con diseño reconocible */}
                <TiktokIcon size={24} />
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
}// Componente actualizado para el ícono de TikTok con diseño reconocible
function TiktokIcon({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
        fill="currentColor"
      />
    </svg>
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
