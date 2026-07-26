import React from "react";
import { motion } from "framer-motion";
import { TrendingUpIcon, TrendingDownIcon, BoxIcon } from "lucide-react";
export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  delay = 0










}: {icon: BoxIcon;label: string;value: string;trend?: {dir: 'up' | 'down';value: string;};color: string;delay?: number;}) {
  return <motion.div initial={{
    opacity: 0,
    y: 16
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay
  }} className="rounded-xl2 border-2 border-ink bg-paper p-5 shadow-hard-sm transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink text-paper" style={{
        backgroundColor: color
      }}>
          <Icon className="h-5 w-5" />
        </span>
        {trend && <span className={`inline-flex items-center gap-1 rounded-full border-2 border-ink px-2 py-0.5 text-xs font-bold ${trend.dir === 'up' ? 'bg-lime-soft text-lime-dark' : 'bg-coral-soft text-coral'}`}>
            {trend.dir === 'up' ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
            {trend.value}
          </span>}
      </div>
      <p className="mt-4 font-display text-3xl font-extrabold leading-none">{value}</p>
      <p className="mt-1 text-sm text-smoke">{label}</p>
    </motion.div>;
}