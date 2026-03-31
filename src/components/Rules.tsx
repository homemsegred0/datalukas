import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { scoreReasons, rules } from '../data/constants';

export default function Rules() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="space-y-6"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {scoreReasons.map((group) => (
          <div key={group.title} className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2 text-white">
              {group.icon}
              <h2 className="text-lg font-semibold">{group.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
        <div className="mb-5 flex items-center gap-2 text-white">
          <ClipboardList className="h-4 w-4 text-blue-300" />
          <h2 className="text-lg font-semibold">Como a nota é pensada</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/8 bg-secondary p-4"
            >
              <div className="mb-3 flex items-center gap-2 text-white">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-300">{rule.icon}</div>
                <h3 className="font-semibold">{rule.title}</h3>
              </div>
              <p className="text-sm leading-6 text-zinc-400">{rule.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
