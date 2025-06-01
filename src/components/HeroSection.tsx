
import { Button } from "@/components/ui/button";
import { Search, Users, Trophy, Calendar } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-sport"></div>
      
      {/* Content */}
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
            <Button size="lg" className="bg-sport-orange hover:bg-sport-orange/90 text-white px-8 py-3 text-lg">
              <Users className="mr-2 h-5 w-5" />
              Найти команду
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sport-blue px-8 py-3 text-lg">
              <Search className="mr-2 h-5 w-5" />
              Найти игроков
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-fade-in">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Users className="h-12 w-12 text-sport-orange mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">1,200+</div>
                <div className="text-lg opacity-90">Активных игроков</div>
              </div>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Trophy className="h-12 w-12 text-sport-orange mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">300+</div>
                <div className="text-lg opacity-90">Команд</div>
              </div>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Calendar className="h-12 w-12 text-sport-orange mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-lg opacity-90">Тренировок в месяц</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-12 md:h-20 text-white">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
