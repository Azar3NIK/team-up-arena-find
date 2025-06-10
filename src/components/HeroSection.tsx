import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
const HeroSection = () => {
  return <section className="relative overflow-hidden">
      
      <div className="absolute inset-0 gradient-sport"></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Найди свою команду
            <span className="block text-sport-orange">или игрока мечты</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto animate-slide-up">
            Платформа для объединения спортивных команд и игроков. 
            Тренируйтесь вместе, побеждайте вместе!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Link to="/register">
            <Button size="lg" className="bg-sport-orange hover:bg-sport-orange/90 text-white px-8 py-3 text-lg">
              <Users className="mr-2 h-5 w-5" />
              Найти команду
            </Button>
            </Link>
            <Link to="/register">
            <Button size="lg" variant="outline" className="border-white hover:bg-white px-8 py-3 text-lg text-gray-800">
              <Search className="mr-2 h-5 w-5" />
              Найти игроков
            </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-12 md:h-20 text-white">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>;
};
export default HeroSection;