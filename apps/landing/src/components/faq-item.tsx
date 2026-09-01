import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function FAQItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="group border-b border-white/[0.08] py-5 last:border-b-0 transition-colors">
      <summary className="font-medium text-base text-white/90 cursor-pointer list-none flex items-center justify-between gap-4 hover:text-white transition-colors">
        <span>{question}</span>
        <ChevronDown className="h-4 w-4 text-white/40 group-open:rotate-180 group-hover:text-white/70 transition-transform duration-200 shrink-0" />
      </summary>
      <div className="text-sm text-zinc-400 leading-relaxed pt-3 pb-1 space-y-2 prose prose-invert max-w-none">
        {children}
      </div>
    </details>
  );
}
