
import { Users, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-sport-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-orange rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">FindPlayer</span>
            </div>
            <p className="text-gray-300 mb-4">
              Платформа для объединения спортивных команд и игроков. Найди свою команду уже сегодня!
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-sport-orange transition-colors cursor-pointer">
                <span className="text-sm">VK</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-sport-orange transition-colors cursor-pointer">
                <span className="text-sm">TG</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-sport-orange transition-colors cursor-pointer">
                <span className="text-sm">IG</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Найти команду</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Найти игроков</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Создать команду</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Тренировки</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Турниры</a></li>
            </ul>
          </div>

          {/* Sports */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Виды спорта</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Футбол</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Баскетбол</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Волейбол</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Теннис</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">Хоккей</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-sport-orange" />
                <span className="text-gray-300">support@findplayer.ru</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-sport-orange" />
                <span className="text-gray-300">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-sport-orange" />
                <span className="text-gray-300">Москва, Россия</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm mb-4 md:mb-0">
            © 2024 FindPlayer. Все права защищены.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">
              Условия использования
            </a>
            <a href="#" className="text-gray-300 hover:text-sport-orange transition-colors">
              Поддержка
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
