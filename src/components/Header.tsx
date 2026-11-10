import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Mail,
  TreePine,
  Heart,
  CloudSun,
  Sparkles,
  Gift,
  Home as HomeIcon,
  Map,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: '首页', icon: Home },
  { path: '/memoirs', label: '回忆录', icon: BookOpen },
  { path: '/time-capsule', label: '时间胶囊', icon: Mail },
  { path: '/growth', label: '成长史', icon: TreePine },
  { path: '/desire', label: '欲望清单', icon: Heart },
  { path: '/mood', label: '心情日记', icon: CloudSun },
  { path: '/firsts', label: '第一次', icon: Sparkles },
  { path: '/birthday', label: '生日礼物', icon: Gift },
  { path: '/life-album', label: '生活图鉴', icon: HomeIcon },
  { path: '/travel', label: '旅行', icon: Map },
];

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-lg font-bold">
            ✨
          </div>
          <span
            className="text-xl font-bold text-foreground tracking-wide"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            我的手账本
          </span>
        </NavLink>

        {/* Desktop nav - scrollable */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-[65%]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? pathname === '/'
                : pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-card">
            <SheetHeader>
              <SheetTitle
                className="text-xl"
                style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
              >
                手账本目录 ✨
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-6">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? pathname === '/'
                    : pathname === item.path ||
                      pathname.startsWith(`${item.path}/`);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
