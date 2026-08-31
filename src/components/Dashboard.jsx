import React from 'react';
import { motion } from 'framer-motion';
import StatusCard from './StatusCard';
import HeroBanner from './HeroBanner';
import StatsGrid from './StatsGrid';

const Dashboard = ({ isDefending, isProcessing, isBreached, stats, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="h-full overflow-y-auto scrollbar-hide space-y-1"
    >
      <StatusCard isDefending={isDefending} isProcessing={isProcessing} isBreached={isBreached} />
      <HeroBanner stats={stats} onNavigate={onNavigate} />
      <StatsGrid stats={stats} />
    </motion.div>
  );
};

export default Dashboard;
