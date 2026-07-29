"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface NavButtonProps extends ButtonProps {
  href: string;
  children: React.ReactNode;
}

export function NavButton({ href, children, ...props }: NavButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigate = () => {
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Button {...props} onClick={handleNavigate} disabled={isPending || props.disabled}>
      {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
      {children}
    </Button>
  );
}
