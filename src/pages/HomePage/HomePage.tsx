import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Mail,
  TreePine,
  Heart,
  CloudSun,
  Sparkles,
  Gift,
  Home as HomeIcon,
  Map,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import diaryCover from '@/assets/diary-cover.jpg';
import { Image } from '@/components/ui/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDiaryStore } from '@/hooks/use-diary-store';
import {
  MOCK_MEMOIRS,
  MOCK_TIME_CAPSULES,
  MOCK_GROWTHS,
  MOCK_DESIRES,
  MOCK_MOODS,
  MOCK_FIRSTS,
  MOCK_BIRTHDAYS,
  MOCK_LIFE_ALBUMS,
  MOCK_TRAVELS,
} from '@/data/diary';

const MODULES = [
  { path: '/memoirs', label: '回忆录与畅想', icon: BookOpen, color: 'from-pink-200 to-pink-100', key: 'memoir' },
  { path: '/time-capsule', label: '时间胶囊', icon: Mail, color: 'from-amber-200 to-amber-100', key: 'capsule' },
  { path: '/growth', label: '成长史', icon: TreePine, color: 'from-green-200 to-green-100', key: 'growth' },
  { path: '/desire', label: '欲望清单', icon: Heart, color: 'from-rose-200 to-rose-100', key: 'desire' },
  { path: '/mood', label: '心情日记', icon: CloudSun, color: 'from-blue-200 to-blue-100', key: 'mood' },
  { path: '/firsts', label: '第一次收藏馆', icon: Sparkles, color: 'from-purple-200 to-purple-100', key: 'first' },
  { path: '/birthday', label: '生日礼物', icon: Gift, color: 'from-orange-200 to-orange-100', key: 'birthday' },
  { path: '/life-album', label: '生活图鉴', icon: HomeIcon, color: 'from-teal-200 to-teal-100', key: 'life' },
  { path: '/travel', label: '旅行记录', icon: Map, color: 'from-cyan-200 to-cyan-100', key: 'travel' },
];


function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 12) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export default function HomePage() {
  const { items: memoirs } = useDiaryStore('__app_diary_memoirs', MOCK_MEMOIRS);
  const { items: capsules } = useDiaryStore('__app_diary_timeCapsule', MOCK_TIME_CAPSULES);
  const { items: growths } = useDiaryStore('__app_diary_growth', MOCK_GROWTHS);
  const { items: desires } = useDiaryStore('__app_diary_desire', MOCK_DESIRES);
  const { items: moods } = useDiaryStore('__app_diary_mood', MOCK_MOODS);
  const { items: firsts } = useDiaryStore('__app_diary_firsts', MOCK_FIRSTS);
  const { items: birthdays } = useDiaryStore('__app_diary_birthday', MOCK_BIRTHDAYS);
  const { items: lifeAlbums } = useDiaryStore('__app_diary_lifeAlbum', MOCK_LIFE_ALBUMS);
  const { items: travels } = useDiaryStore('__app_diary_travel', MOCK_TRAVELS);

  const counts = {
    memoir: memoirs.length,
    capsule: capsules.length,
    growth: growths.length,
    desire: desires.length,
    mood: moods.length,
    first: firsts.length,
    birthday: birthdays.length,
    life: lifeAlbums.length,
    travel: travels.length,
  };

  const recentRecords = useMemo(() => {
    type RecentItem = {
      id: string;
      moduleKey: string;
      moduleLabel: string;
      modulePath: string;
      title: string;
      date: string;
      createdAt: number;
    };

    const all: RecentItem[] = [
      ...memoirs.map((m) => ({
        id: m.id,
        moduleKey: 'memoir',
        moduleLabel: '回忆录',
        modulePath: '/memoirs',
        title: m.title,
        date: m.date,
        createdAt: m.createdAt,
      })),
      ...capsules.filter((c) => c.isUnlocked).map((c) => ({
        id: c.id,
        moduleKey: 'capsule',
        moduleLabel: '时间胶囊',
        modulePath: '/time-capsule',
        title: c.type === 'letter' ? '一封来自过去的信' : '一个来自过去的问题',
        date: new Date(c.createdAt).toISOString().slice(0, 10),
        createdAt: c.createdAt,
      })),
      ...growths.map((g) => ({
        id: g.id,
        moduleKey: 'growth',
        moduleLabel: '成长史',
        modulePath: '/growth',
        title: g.title,
        date: g.date,
        createdAt: g.createdAt,
      })),
      ...desires.map((d) => ({
        id: d.id,
        moduleKey: 'desire',
        moduleLabel: '欲望清单',
        modulePath: '/desire',
        title: d.content,
        date: new Date(d.createdAt).toISOString().slice(0, 10),
        createdAt: d.createdAt,
      })),
      ...moods.map((m) => ({
        id: m.id,
        moduleKey: 'mood',
        moduleLabel: '心情日记',
        modulePath: '/mood',
        title: m.content.slice(0, 20) + (m.content.length > 20 ? '...' : ''),
        date: m.date,
        createdAt: m.createdAt,
      })),
      ...firsts.map((f) => ({
        id: f.id,
        moduleKey: 'first',
        moduleLabel: '第一次',
        modulePath: '/firsts',
        title: f.title,
        date: f.date,
        createdAt: f.createdAt,
      })),
      ...birthdays.map((b) => ({
        id: b.id,
        moduleKey: 'birthday',
        moduleLabel: '生日礼物',
        modulePath: '/birthday',
        title: `${b.year}年 · ${b.giftName}`,
        date: `${b.year}-00-00`,
        createdAt: b.createdAt,
      })),
      ...lifeAlbums.map((l) => ({
        id: l.id,
        moduleKey: 'life',
        moduleLabel: '生活图鉴',
        modulePath: '/life-album',
        title: l.title,
        date: new Date(l.createdAt).toISOString().slice(0, 10),
        createdAt: l.createdAt,
      })),
      ...travels.map((t) => ({
        id: t.id,
        moduleKey: 'travel',
        moduleLabel: '旅行',
        modulePath: '/travel',
        title: t.location,
        date: t.startDate,
        createdAt: t.createdAt,
      })),
    ];

    return all.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  }, [memoirs, capsules, growths, desires, moods, firsts, birthdays, lifeAlbums, travels]);

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen">
      <main className="space-y-12 md:space-y-16">
        {/* Hero */}
        <section className="w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <div className="aspect-[21/9] w-full">
                <Image
                  src={diaryCover}
                  alt="手账本封面"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-sm md:text-base text-muted-foreground mb-2"
                >
                  {getGreeting()}，欢迎翻开你的手账本 🌷
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-3xl md:text-5xl font-bold text-foreground mb-3"
                  style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                >
                  记录每一个珍贵的瞬间
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-muted-foreground text-sm md:text-base max-w-xl"
                >
                  这是专属于你的电子手账本，用文字和照片留住所有美好。
                  已经记录了 <span className="font-semibold text-primary">{totalCount}</span> 条回忆啦~
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* Module Cards */}
        <section className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
              >
                手账本目录 📒
              </h2>
              <span className="text-sm text-muted-foreground">{MODULES.length} 个模块</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {MODULES.map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <motion.div
                    key={mod.path}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Link to={mod.path}>
                      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-border/40">
                        <CardContent className="p-5">
                          <div
                            className={`size-12 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-3`}
                          >
                            <Icon className="size-6 text-foreground/70" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{mod.label}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {counts[mod.key as keyof typeof counts]} 条记录
                            </span>
                            <ArrowRight className="size-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Records */}
        <section className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
              >
                最近的记录 🌟
              </h2>
            </div>
            <Card className="border border-border/40">
              <CardContent className="p-0 divide-y divide-border/40">
                {recentRecords.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Sparkles className="size-8 mx-auto mb-2 opacity-50" />
                    <p>还没有记录哦，快去写下第一篇吧~</p>
                  </div>
                ) : (
                  recentRecords.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Link to={item.modulePath}>
                        <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.moduleLabel}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="size-3" />
                                {item.date}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.title}
                            </p>
                          </div>
                          <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer spacer */}
        <section className="w-full pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>✨ 你的手账本，你说了算 ✨</p>
              <p className="mt-1 text-xs">所有数据保存在本地，请放心记录</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
