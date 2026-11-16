import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { AXES, MANDATORY_GUIDANCE } from '../data/cards';
import { AXIS_STYLES, AxisIcon } from './AxisMeta';

interface AxisLegendProps {
  variant?: 'full' | 'sidebar';
}

export function AxisLegend({ variant = 'full' }: AxisLegendProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (variant === 'sidebar') {
    return (
      <aside
        aria-label="Legenda dos eixos"
        className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]">
            Legenda dos eixos
          </h2>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="legend-content-mobile"
            className="lg:hidden inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-sm font-semibold text-[#2076aa] dark:text-[#c8ff00] hover:bg-zinc-100 dark:hover:bg-[#2e2d2d] rounded-lg whitespace-nowrap shrink-0"
          >
            <span>{mobileOpen ? 'Ocultar guia' : 'Ver guia'}</span>
            {mobileOpen ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <div
          id="legend-content-mobile"
          className={`${mobileOpen ? 'block' : 'hidden'} lg:block mt-4 space-y-4`}
        >
          <p className="text-sm leading-relaxed text-[#1e1d1d] dark:text-[#e4e4e4] flex items-start gap-2.5 bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg p-3.5">
            <Info
              className="w-4 h-4 text-[#2076aa] dark:text-[#c8ff00] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{MANDATORY_GUIDANCE}</span>
          </p>

          <dl className="divide-y divide-zinc-200 dark:divide-[#3d3b3b]">
            {AXES.map((axis) => {
              const style = AXIS_STYLES[axis.id];
              return (
                <div key={axis.id} className="py-3.5 first:pt-1 last:pb-0">
                  <dt className="flex items-center gap-2 text-sm font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]">
                    <AxisIcon axisId={axis.id} className={`w-4 h-4 ${style.iconColor}`} />
                    <span>{axis.name}</span>
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-700 dark:text-[#c4c2c2] leading-relaxed pl-6">
                    {axis.guidingQuestion}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </aside>
    );
  }

  return (
    <section aria-labelledby="legend-heading" className="space-y-5">
      <div className="flex flex-col gap-2">
        <h2
          id="legend-heading"
          className="font-display text-xl font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]"
        >
          Os três eixos da computação
        </h2>
        <p className="text-base text-zinc-700 dark:text-[#d4d2d2] leading-relaxed max-w-3xl">
          {MANDATORY_GUIDANCE}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AXES.map((axis) => {
          const style = AXIS_STYLES[axis.id];
          return (
            <div
              key={axis.id}
              className="relative bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl p-5 flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-2.5">
                <AxisIcon axisId={axis.id} className={`w-5 h-5 ${style.iconColor}`} />
                <h3 className="font-display text-base font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]">
                  {axis.name}
                </h3>
              </div>
              <p className="text-sm text-zinc-700 dark:text-[#c4c2c2] leading-relaxed">
                {axis.guidingQuestion}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
