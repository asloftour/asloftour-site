import Link from 'next/link';
import { MessageCircleMore } from 'lucide-react';

export function WhatsAppButton() {
  const number = process.env.WHATSAPP_NUMBER || '905319185163';
  return (
    <Link
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-black shadow-soft transition hover:scale-[1.03]"
      aria-label="WhatsApp"
    >
      <MessageCircleMore className="h-6 w-6" />
    </Link>
  );
}
