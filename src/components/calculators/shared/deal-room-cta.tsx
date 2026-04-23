import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DealRoomCtaProps {
  params: Record<string, string>;
  label?: string;
}

export function DealRoomCta({
  params,
  label = "Get Indicative Terms",
}: DealRoomCtaProps) {
  const searchParams = new URLSearchParams(params);
  
return (
    <Button
      asChild
      size="lg"
      className="cta-shimmer h-14 w-full bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
    >
      <Link href={`/deal-room?${searchParams.toString()}`}>
        {label}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </Button>
  );
}
