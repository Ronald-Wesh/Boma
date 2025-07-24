import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from '../context/AuthContext';
import { 
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useAuth();

  const getRoleVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'landlord':
        return 'info';
      case 'tenant':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getUserInitials = (username) => {
    if (!username) return 'U';
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border backdrop-blur-xl bg-background/80 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-2 font-bold text-xl gradient-text hover:opacity-80 transition-opacity"
        >
          <HomeIcon className="h-6 w-6" />
          <span>Boma</span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Listings
          </Link>
          <Link 
            to="/dashboard" 
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Dashboard
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* User Role Badge */}
          {user?.role && (
            <Badge variant={getRoleVariant(user.role)} className="hidden sm:inline-flex">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getUserInitials(user?.username)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-slide-in">
              {user && (
                <>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem className="gap-2">
                <UserCircleIcon className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2">
                <Cog6ToothIcon className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={logout}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}