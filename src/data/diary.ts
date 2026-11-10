// EXPORTS: IDiaryImage, IMemoirRecord, ITimeCapsuleRecord, IGrowthRecord, IDesireRecord, IMoodRecord, IFirstRecord, IBirthdayRecord, ILifeAlbumRecord, ITravelRecord, IUserProfile, MOCK_MEMOIRS, MOCK_TIME_CAPSULES, MOCK_GROWTHS, MOCK_DESIRES, MOCK_MOODS, MOCK_FIRSTS, MOCK_BIRTHDAYS, MOCK_LIFE_ALBUMS, MOCK_TRAVELS, DEFAULT_USER_PROFILE

export interface IDiaryImage {
  id: string;
  dataUrl: string;
  name?: string;
}

export interface IMemoirRecord {
  id: string;
  title: string;
  stage: 'childhood' | 'youth' | 'middle' | 'oldage';
  type: 'memory' | 'imagination';
  date: string;
  content: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

export interface ITimeCapsuleRecord {
  id: string;
  type: 'letter' | 'question';
  content: string;
  createdAt: number;
  unlockAt: number;
  isUnlocked: boolean;
  reply?: string;
  repliedAt?: number;
  source?: 'mock';
}

export interface IGrowthRecord {
  id: string;
  title: string;
  date: string;
  description: string;
  tag?: string;
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

export interface IDesireRecord {
  id: string;
  content: string;
  category: 'past' | 'present' | 'future';
  priority?: number;
  achieved: boolean;
  achievedAt?: string;
  note?: string;
  createdAt: number;
  source?: 'mock';
}

export type MoodType = 'happy' | 'calm' | 'sad' | 'anxious' | 'excited' | 'angry' | 'tired';

export interface IMoodRecord {
  id: string;
  date: string;
  mood: MoodType;
  content: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

export interface IFirstRecord {
  id: string;
  title: string;
  date: string;
  feeling: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

export interface IBirthdayRecord {
  id: string;
  year: number;
  age: number;
  giftName: string;
  giver: string;
  photo?: IDiaryImage;
  description?: string;
  createdAt: number;
  source?: 'mock';
}

export interface ILifeAlbumRecord {
  id: string;
  category: 'recipe' | 'room' | 'desk';
  title: string;
  content: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

export interface ITravelRecord {
  id: string;
  location: string;
  startDate: string;
  endDate: string;
  story: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

export interface IUserProfile {
  nickname: string;
  avatarDataUrl?: string;
}

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

export const MOCK_MEMOIRS: IMemoirRecord[] = [
  {
    id: 'memoir-1',
    title: '小学三年级的夏天',
    stage: 'childhood',
    type: 'memory',
    date: '2008-07-15',
    content: '那年夏天特别热，每天下午跟小伙伴们一起去抓知了。外婆家的老风扇吱呀吱呀地转，西瓜特别甜。现在想起来，那就是童年最无忧无虑的样子。',
    images: [],
    createdAt: now - 30 * day,
    updatedAt: now - 30 * day,
    source: 'mock',
  },
  {
    id: 'memoir-2',
    title: '十年后的我',
    stage: 'middle',
    type: 'imagination',
    date: '2024-01-01',
    content: '希望30岁的自己，已经去过很多地方，有一个温暖的小窝，养一只猫。学会了和自己相处，也学会了温柔地对待这个世界。不管怎样，都要继续热爱生活呀~',
    images: [],
    createdAt: now - 10 * day,
    updatedAt: now - 10 * day,
    source: 'mock',
  },
];

export const MOCK_TIME_CAPSULES: ITimeCapsuleRecord[] = [
  {
    id: 'capsule-1',
    type: 'letter',
    content: '嗨，一年后的我，你还好吗？现在的你是不是已经实现了今年的小目标？有没有好好照顾自己？记得要多喝水、多运动、多笑一笑哦。不管遇到什么困难，都要相信自己是最棒的！',
    createdAt: now - 400 * day,
    unlockAt: now - 35 * day,
    isUnlocked: true,
    reply: '谢谢你一年前的鼓励！我现在过得还不错，目标完成了一大半，也学会了更多东西。你说得对，要多笑一笑~',
    repliedAt: now - 30 * day,
    source: 'mock',
  },
  {
    id: 'capsule-2',
    type: 'question',
    content: '三年后的我，你现在还在坚持画画吗？那时候最想做的事情有没有做成呢？',
    createdAt: now - 100 * day,
    unlockAt: now + 995 * day,
    isUnlocked: false,
    source: 'mock',
  },
];

export const MOCK_GROWTHS: IGrowthRecord[] = [
  {
    id: 'growth-1',
    title: '第一次独自旅行',
    date: '2022-08-20',
    description: '一个人去了云南，走了很多路，看了很多风景。发现自己其实比想象中更勇敢、更独立。回来之后整个人都变得更开阔了。',
    tag: '认知突破',
    createdAt: now - 80 * day,
    updatedAt: now - 80 * day,
    source: 'mock',
  },
  {
    id: 'growth-2',
    title: '学会了做饭',
    date: '2023-03-10',
    description: '从泡面选手到能做出一桌家常菜，用了大概半年时间。现在已经能独立掌勺招待朋友了，很有成就感！',
    tag: '技能获得',
    createdAt: now - 50 * day,
    updatedAt: now - 50 * day,
    source: 'mock',
  },
];

export const MOCK_DESIRES: IDesireRecord[] = [
  {
    id: 'desire-1',
    content: '一台粉色的 PSP',
    category: 'past',
    priority: 5,
    achieved: true,
    achievedAt: '2010-06-01',
    note: '小学毕业礼物，开心了整整一个暑假',
    createdAt: now - 20 * day,
    source: 'mock',
  },
  {
    id: 'desire-2',
    content: '一台拍立得相机',
    category: 'present',
    priority: 4,
    achieved: false,
    note: '想用来记录生活中的小瞬间',
    createdAt: now - 15 * day,
    source: 'mock',
  },
  {
    id: 'desire-3',
    content: '环游世界',
    category: 'future',
    priority: 5,
    achieved: false,
    note: '想去冰岛看极光，去日本看樱花，去土耳其坐热气球...',
    createdAt: now - 5 * day,
    source: 'mock',
  },
];

export const MOCK_MOODS: IMoodRecord[] = [
  {
    id: 'mood-1',
    date: new Date(now - 2 * day).toISOString().slice(0, 10),
    mood: 'happy',
    content: '今天天气特别好，出门散步的时候遇到了一只特别可爱的小猫咪。阳光洒在身上暖暖的，心情也跟着明媚起来了~',
    images: [],
    createdAt: now - 2 * day,
    updatedAt: now - 2 * day,
    source: 'mock',
  },
  {
    id: 'mood-2',
    date: new Date(now - 1 * day).toISOString().slice(0, 10),
    mood: 'calm',
    content: '安安静静地看了一下午书，喝了一杯热可可。难得的平静时光，很治愈。',
    images: [],
    createdAt: now - 1 * day,
    updatedAt: now - 1 * day,
    source: 'mock',
  },
];

export const MOCK_FIRSTS: IFirstRecord[] = [
  {
    id: 'first-1',
    title: '第一次坐飞机',
    date: '2015-07-22',
    feeling: '起飞的时候有点紧张又有点兴奋，看到云朵从窗外飘过去的时候，觉得世界好大好神奇。那时候就暗暗决定，以后一定要去更多地方看看。',
    images: [],
    createdAt: now - 25 * day,
    updatedAt: now - 25 * day,
    source: 'mock',
  },
];

export const MOCK_BIRTHDAYS: IBirthdayRecord[] = [
  {
    id: 'birthday-1',
    year: 2023,
    age: 22,
    giftName: '拍立得相机',
    giver: '自己',
    description: '工作第一年送给自己的生日礼物，算是奖励自己努力生活吧~',
    createdAt: now - 90 * day,
    source: 'mock',
  },
];

export const MOCK_LIFE_ALBUMS: ILifeAlbumRecord[] = [
  {
    id: 'life-1',
    category: 'recipe',
    title: '番茄炒蛋',
    content: '最经典的家常菜，也是我的拿手菜！先炒蛋盛出来，再炒番茄出汁，最后把蛋加进去一起炒，撒点葱花就好啦~',
    images: [],
    createdAt: now - 18 * day,
    updatedAt: now - 18 * day,
    source: 'mock',
  },
  {
    id: 'life-2',
    category: 'room',
    title: '我的小窝改造完成',
    content: '花了一个周末的时间，把房间重新布置了一下。换了新的窗帘，加了串灯，还有一个超舒服的懒人沙发。现在每天回家都特别开心~',
    images: [],
    createdAt: now - 40 * day,
    updatedAt: now - 40 * day,
    source: 'mock',
  },
  {
    id: 'life-3',
    category: 'desk',
    title: '理想中的书桌',
    content: '终于把书桌布置成了自己喜欢的样子！有小绿植、有台灯、有便签墙，还有各种可爱的小摆件。坐在这里工作学习都变得有动力了。',
    images: [],
    createdAt: now - 35 * day,
    updatedAt: now - 35 * day,
    source: 'mock',
  },
];

export const MOCK_TRAVELS: ITravelRecord[] = [
  {
    id: 'travel-1',
    location: '云南 · 大理',
    startDate: '2023-04-05',
    endDate: '2023-04-10',
    story: '第一次一个人的旅行，去了大理。洱海边的风、古城里的花、还有遇到的形形色色的人... 六天五夜，发生了好多好多故事。回来之后感觉整个人都不一样了。',
    images: [],
    createdAt: now - 60 * day,
    updatedAt: now - 60 * day,
    source: 'mock',
  },
];

export const DEFAULT_USER_PROFILE: IUserProfile = {
  nickname: '手账er',
};
