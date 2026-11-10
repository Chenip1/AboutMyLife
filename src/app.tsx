import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import HomePage from "@/pages/HomePage/HomePage";
import MemoirsPage from "@/pages/MemoirsPage/MemoirsPage";
import TimeCapsulePage from "@/pages/TimeCapsulePage/TimeCapsulePage";
import GrowthPage from "@/pages/GrowthPage/GrowthPage";
import DesirePage from "@/pages/DesirePage/DesirePage";
import MoodPage from "@/pages/MoodPage/MoodPage";
import FirstsPage from "@/pages/FirstsPage/FirstsPage";
import BirthdayPage from "@/pages/BirthdayPage/BirthdayPage";
import LifeAlbumPage from "@/pages/LifeAlbumPage/LifeAlbumPage";
import TravelPage from "@/pages/TravelPage/TravelPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="memoirs" element={<MemoirsPage />} />
        <Route path="time-capsule" element={<TimeCapsulePage />} />
        <Route path="growth" element={<GrowthPage />} />
        <Route path="desire" element={<DesirePage />} />
        <Route path="mood" element={<MoodPage />} />
        <Route path="firsts" element={<FirstsPage />} />
        <Route path="birthday" element={<BirthdayPage />} />
        <Route path="life-album" element={<LifeAlbumPage />} />
        <Route path="travel" element={<TravelPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
