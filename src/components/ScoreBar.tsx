import { motion } from 'framer-motion';
import { Star, Search } from 'lucide-react';
import { cn } from '../utils/helpers';
import type { Attendant } from '../types';

interface ScoreBarProps {
  item: Attendant;
  index: number;
}

export default function ScoreBar({ item, index }: ScoreBarProps) {
  const width = `${(item.score / 10) * 100}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.4 }}
      className="group relative z-0 overflow-visible rounded-2xl border border-white/8 bg-white/[0.035] p-4 backdrop-blur-sm transition group-hover:z-30"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-white/[0.03] to-transparent" />

      <div className="relative flex items-center gap-3 md:gap-4">
        <div className="w-8 text-center text-xs font-semibold text-zinc-500">
          {index === 0 ? <Star className="mx-auto h-4 w-4 text-amber-300" /> : `${index + 1}º`}
        </div>

        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold", item.soft)}>
          {item.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-white">{item.name}</div>
              <div className="text-xs text-zinc-500">Passe o mouse para ver a explicação</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">{item.score.toFixed(1)}</div>
              <div className="text-xs text-zinc-500">{item.level}</div>
            </div>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width }}
              transition={{ duration: 0.9, delay: 0.12 * index }}
              className={cn("h-full rounded-full bg-gradient-to-r", item.color)}
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-full left-4 right-4 z-40 mb-3 -translate-y-2 rounded-2xl border border-white/10 bg-zinc-950/97 p-4 opacity-0 shadow-2xl transition-all duration-250 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:left-16 md:right-24">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <Search className="h-4 w-4 text-zinc-400" />
          Motivos da nota de {item.name}
        </div>
        <ul className="space-y-2 text-sm text-zinc-300">
          {item.reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
