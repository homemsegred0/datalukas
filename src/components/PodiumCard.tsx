import { motion } from 'framer-motion';
import { Crown, Star } from 'lucide-react';
import { cn } from '../utils/helpers';
import type { Attendant } from '../types';

interface PodiumCardProps {
  item: Attendant;
  place: 1 | 2 | 3;
}

export default function PodiumCard({ item, place }: PodiumCardProps) {
  const badge = {
    1: { label: "1º lugar", icon: <Crown className="h-5 w-5 text-amber-300" /> },
    2: { label: "2º lugar", icon: <Star className="h-4 w-4 text-slate-300" /> },
    3: { label: "3º lugar", icon: <Star className="h-4 w-4 text-orange-300" /> },
  }[place];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 md:p-8",
        place === 1 ? "border-amber-400/25 bg-amber-400/[0.05]" : "border-white/8 bg-white/[0.03]"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
      <div className="relative flex min-h-[150px] flex-col items-center justify-center text-center">
        <div className="mb-2 text-zinc-400">{badge.label}</div>
        <div className="mb-3">{badge.icon}</div>
        <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-bold", item.soft)}>
          {item.initials}
        </div>
        <div className="text-lg font-semibold text-white">{item.name}</div>
        <div className={cn("mt-1 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent", item.color)}>
          {item.score.toFixed(1)}
        </div>
      </div>
    </motion.div>
  );
}
