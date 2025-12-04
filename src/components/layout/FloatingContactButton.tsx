import { useState, useEffect, useRef } from 'react';
import { Phone, X, MessageCircle } from 'lucide-react';

export const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-[100px] right-6 z-[999] md:bottom-[100px] md:right-[25px]"
    >
      {/* Contact Menu */}
      <div 
        className={`absolute bottom-20 right-0 flex flex-col gap-3 transition-all duration-400 ${
          isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible translate-y-5'
        }`}
      >
        {/* WhatsApp */}
        <a
          href="https://wa.me/989123456789?text=سلام%20%F0%9F%91%8B%0Aاز%20سایت%20tm-brand%20تماس%20می‌گیرم..."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-card text-card-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2 border-r-4 border-[#25d366] min-w-[180px] justify-end"
          dir="rtl"
        >
          <span className="font-semibold text-sm">چت در واتس‌اپ</span>
          <MessageCircle className="w-6 h-6 text-[#25d366]" />
        </a>

        {/* Phone */}
        <a
          href="tel:+989123456789"
          className="flex items-center gap-3 bg-card text-card-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2 border-r-4 border-primary min-w-[180px] justify-end"
          dir="rtl"
        >
          <span className="font-semibold text-sm">تماس تلفنی</span>
          <Phone className="w-6 h-6 text-primary" />
        </a>
      </div>

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-[62px] h-[62px] rounded-full shadow-xl flex items-center justify-center transition-all duration-400 hover:scale-110 ${
          isOpen 
            ? 'bg-destructive' 
            : 'bg-gradient-to-br from-primary to-accent'
        }`}
      >
        <Phone 
          className={`w-8 h-8 text-primary-foreground absolute transition-all duration-400 ${
            isOpen 
              ? 'opacity-0 -rotate-180 scale-50' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <X 
          className={`w-8 h-8 text-destructive-foreground absolute transition-all duration-400 ${
            isOpen 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-180 scale-50'
          }`}
        />
      </button>
    </div>
  );
};
