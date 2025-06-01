
import { Button } from "@/components/ui/button";

const sports = [
  {
    name: "Футбол",
    teams: 120,
    players: 480,
    image: "⚽",
    color: "bg-green-500"
  },
  {
    name: "Баскетбол",
    teams: 85,
    players: 340,
    image: "🏀",
    color: "bg-orange-500"
  },
  {
    name: "Волейбол",
    teams: 65,
    players: 260,
    image: "🏐",
    color: "bg-blue-500"
  },
  {
    name: "Теннис",
    teams: 45,
    players: 180,
    image: "🎾",
    color: "bg-yellow-500"
  },
  {
    name: "Хоккей",
    teams: 30,
    players: 150,
    image: "🏒",
    color: "bg-gray-700"
  },
  {
    name: "Бадминтон",
    teams: 25,
    players: 100,
    image: "🏸",
    color: "bg-purple-500"
  }
];

const SportsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sport-navy mb-4">
            Популярные виды спорта
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите свой вид спорта и найдите единомышленников
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sports.map((sport, index) => (
            <div 
              key={index}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-4">
                <div className={`w-16 h-16 ${sport.color} rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform`}>
                  {sport.image}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-sport-navy mb-1">
                    {sport.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {sport.teams} команд • {sport.players} игроков
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Активных игроков: <span className="font-semibold text-sport-blue">{sport.players}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-sport-orange hover:text-sport-orange/80 hover:bg-sport-orange/10">
                  Присоединиться →
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="border-sport-blue text-sport-blue hover:bg-sport-blue hover:text-white">
            Посмотреть все виды спорта
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SportsSection;
