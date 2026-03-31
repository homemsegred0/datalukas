import { motion } from 'framer-motion';
import PodiumCard from './PodiumCard';
import ScoreBar from './ScoreBar';
import type { Attendant } from '../types';

interface RankingProps {
  attendants: Attendant[];
}

export default function Ranking({ attendants }: RankingProps) {
  const podium = [attendants[1], attendants[0], attendants[2]].filter(Boolean);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="space-y-6"
    >
      <div>
        <div className="mb-3 text-xs uppercase tracking-[0.22em] text-zinc-500">Pódio</div>
        <div className="grid gap-4 lg:grid-cols-3">
          {podium[0] && <PodiumCard item={podium[0]} place={2} />}
          {podium[1] && <PodiumCard item={podium[1]} place={1} />}
          {podium[2] && <PodiumCard item={podium[2]} place={3} />}
        </div>
      </div>

      <div>
        <div className="mb-3 text-xs uppercase tracking-[0.22em] text-zinc-500">Classificação completa</div>
        <div className="space-y-3 pt-24 md:pt-28">
          {attendants.map((item, index) => (
            <ScoreBar key={item.username} item={item} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
