
import { Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-sport-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          {/* Brand */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-orange rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">FindPlayer</span>
            </div>
            <p className="text-gray-300">
              Платформа для объединения спортивных команд и игроков. Найди свою команду уже сегодня!
            </p>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="text-center">
          <div className="text-gray-300 text-sm">
            © 2025 FindPlayer. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
