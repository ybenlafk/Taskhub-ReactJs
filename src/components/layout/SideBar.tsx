import {
  LayoutDashboard,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/",
  },
  {
    title: "Projects",
    icon: <FolderKanban className="w-5 h-5" />,
    path: "/projects",
  },
];

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) => {
  const location = useLocation();
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    setTimeout(
      () => {
        setShowTitle(collapsed);
      },
      collapsed ? 0 : 100
    );
  }, [collapsed]);
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen border-r bg-background text-foreground transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 bg-black dark:bg-white dark:text-black text-white rounded-md font-bold">
            T
          </div>
          {!showTitle && <span className="text-xl font-bold">TaskHub</span>}
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                to={item.path}
                key={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  collapsed ? "justify-center" : "gap-3",
                  isActive
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full border shadow-sm bg-background z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </Button>
    </aside>
  );
};

export default Sidebar;
