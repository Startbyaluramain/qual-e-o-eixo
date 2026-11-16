import { Cpu, Globe, Layers } from 'lucide-react';
import { AxisId } from '../data/cards';

export function AxisIcon({
  axisId,
  className = 'w-5 h-5 shrink-0',
}: {
  axisId: AxisId;
  className?: string;
}) {
  switch (axisId) {
    case 'pensamento_computacional':
      return <Layers className={className} aria-hidden="true" />;
    case 'mundo_digital':
      return <Cpu className={className} aria-hidden="true" />;
    case 'cultura_digital':
      return <Globe className={className} aria-hidden="true" />;
  }
}

export const AXIS_STYLES: Record<
  AxisId,
  {
    iconColor: string;
    selectedBg: string;
    selectedBorder: string;
    selectedText: string;
    subtleText: string;
  }
> = {
  pensamento_computacional: {
    iconColor: 'text-[#2076aa] dark:text-[#31b1ff]',
    selectedBg: 'bg-[#31b1ff]',
    selectedBorder: 'border-[#1e1d1d] dark:border-[#31b1ff]',
    selectedText: 'text-[#1e1d1d]',
    subtleText: 'text-[#2076aa] dark:text-[#31b1ff]',
  },
  mundo_digital: {
    iconColor: 'text-[#9a4cbf] dark:text-[#ce66ff]',
    selectedBg: 'bg-[#ce66ff]',
    selectedBorder: 'border-[#1e1d1d] dark:border-[#ce66ff]',
    selectedText: 'text-[#1e1d1d]',
    subtleText: 'text-[#9a4cbf] dark:text-[#ce66ff]',
  },
  cultura_digital: {
    iconColor: 'text-[#8a5a00] dark:text-[#ffcd40]',
    selectedBg: 'bg-[#ffcd40]',
    selectedBorder: 'border-[#1e1d1d] dark:border-[#ffcd40]',
    selectedText: 'text-[#1e1d1d]',
    subtleText: 'text-[#8a5a00] dark:text-[#ffcd40]',
  },
};
