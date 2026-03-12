import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturesSection from '../components/FeaturesSection';
import CTASection from '../components/CTASection';
import '../styles/home.css';

const HomePage = () => (
  <div className="home-page w-full text-foreground dark:text-white">
    <div className="hero-overlay">
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <CTASection />
    </div>
  </div>
);

export default HomePage;
