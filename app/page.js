import Hero from '@/components/Hero';
import About from '@/components/About';
import CatalogPreview from '@/components/CatalogPreview';
import GameSection from '@/components/GameSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <CatalogPreview />
      <GameSection />
      <Footer />
    </main>
  );
}
