import React from 'react';
import { motion } from 'framer-motion';
import StatusCard from './StatusCard';
import HeroBanner from './HeroBanner';
import StatsGrid from './StatsGrid';

const Dashboard = ({ isDefending, isProcessing, isBreached, stats, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
      className="h-full overflow-y-auto scrollbar-hide"
    >
      {/* Subtle page-level top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-px z-10"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.5) 50%, transparent 100%)' }} />

      <div className="space-y-0">
        <HeroBanner stats={stats} onNavigate={onNavigate} />
        <StatusCard isDefending={isDefending} isProcessing={isProcessing} isBreached={isBreached} />
        <StatsGrid stats={stats} />
      </div>
    </motion.div>
  );
};

export default Dashboard;
