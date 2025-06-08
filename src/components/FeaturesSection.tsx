
import { Users, Search, Calendar } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Умный поиск",
    description: "Находите команды и игроков с помощью различных фильтров"
  },
  {
    icon: Users,
    title: "Управление командой",
    description: "Создавайте команды, приглашайте игроков и управляйте составом"
  },
  {
    icon: Calendar,
    title: "Планирование тренировок",
    description: "Организуйте тренировки с удобным планированием"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sport-navy mb-4">
            Все для командного спорта
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мощные инструменты для поиска, организации и развития спортивных команд
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 gradient-orange rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-sport-navy mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
