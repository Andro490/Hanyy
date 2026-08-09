import { CustomizerPanel } from '../components/customizer/CustomizerPanel';
import { motion } from 'framer-motion';

export const CustomizerPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Design <span className="text-gradient-gold">Studio</span>
          </h1>
          <p className="text-white/40 max-w-md mx-auto">
            Customize your perfect piece with live preview and instant pricing
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CustomizerPanel />
        </motion.div>
      </div>
    </div>
  );
};
