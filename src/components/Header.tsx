
import { Button } from "@/components/ui/button";
import { Menu, Search, Users, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-sport rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-sport-navy">FindPlayer</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/register" className="text-gray-600 hover:text-sport-blue transition-colors">
              Найти команду
            </Link>
            <Link to="/register" className="text-gray-600 hover:text-sport-blue transition-colors">
              Найти игроков
            </Link>
          </nav>

          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-gray-600">
                Войти
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gradient-orange text-white border-0 hover:opacity-90">
                Регистрация
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-sport-blue transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-up">
            <div className="flex flex-col space-y-4">
              <Link to="/register" className="text-gray-600 hover:text-sport-blue transition-colors">
                Найти команду
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-sport-blue transition-colors">
                Найти игроков
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="justify-start w-full">
                    Войти
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gradient-orange text-white border-0 hover:opacity-90 w-full">
                    Регистрация
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
