import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import ECellFanout from '../components/home/whatwedo';
import StatsSection from '../components/home/StatsSection';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Home = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <HeroSection />
      <ECellFanout />
      <StatsSection />
    </motion.div>
  );
};

export default Home;
