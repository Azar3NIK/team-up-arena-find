import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Trophy } from "lucide-react";
const CTASection = () => {
  return <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-sport"></div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
            Готовы найти свою команду?
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
            Присоединяйтесь к спортсменам, которые уже нашли своих партнеров для игры
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-slide-up">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[200px]">
              <Users className="h-8 w-8 text-sport-orange mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">Для игроков</div>
              <div className="text-sm opacity-80">Найди команду мечты</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[200px]">
              <Trophy className="h-8 w-8 text-sport-orange mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">Для команд</div>
              <div className="text-sm opacity-80">Найди идеальных игроков</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button size="lg" className="bg-sport-orange hover:bg-sport-orange/90 text-white px-8 py-3 text-lg">
              Начать поиск
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white px-8 py-3 text-lg text-gray-800">
              Создать команду
            </Button>
          </div>
          
          <p className="text-sm opacity-75 mt-6">
            Бесплатная регистрация • Без скрытых платежей • Мгновенный доступ
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-sport-orange/20 rounded-full animate-pulse" style={{
      animationDelay: '1s'
    }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-sport-green/20 rounded-full animate-pulse" style={{
      animationDelay: '2s'
    }}></div>
    </section>;
};
export default CTASection;