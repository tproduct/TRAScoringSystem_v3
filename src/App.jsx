import { useEffect, useState } from "react";
import { Provider as ChakraProvider } from "@ui/provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@store/store";
import RootLayout from "@layouts/RootLayout";
import LoginPage from "@pages/user/LoginPage";
import { Toaster } from "@ui/toaster";
import UserRoutes from "@components/routes/UserRoutes";
import CompetitionRoutes from "@components/routes/CompetitionRoutes";
import ScorePage from "@pages/score/ScorePage";
import ResultPage from "@pages/result/ResultPage";
import TeamResultPage from "@pages/result/TeamResultPage";
import ResultListPage from "@pages/result/ResultListPage";
import JudgePage from "@pages/judge/JudgePage";
import MonitorRootPage from "@pages/monitor/MonitorRootPage";
import MonitorPage from "@pages/monitor/MonitorPage";
import MessagePage from "@pages/message/MessagePage";
import StartListPage from "@pages/startlist/StartListPage";

function App() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login/" element={<LoginPage />} />
            {/* リザルト */}
            <Route path="result/:competitionId" element={<ResultListPage />} />
            <Route
              path="result/:competitionId/:type/:gender/:categoryId/:round/"
              element={<ResultPage />}
            />
            <Route
              path="result/:competitionId/:type/:gender/:categoryId/:round/:routine/"
              element={<ResultPage />}
            />
            <Route
              path="result/:competitionId/team/:gender/:categoryId/"
              element={<TeamResultPage />}
            />
            <Route
              path="result/:competitionId/team/:gender/"
              element={<TeamResultPage />}
            />

            {/* スタートリスト */}
            <Route
              path="startlist/:competitionId/:type/:gender/:categoryId/:round/"
              element={<StartListPage />}
            />

            {/* モニター */}
            <Route
              path="monitor/:competitionId/"
              element={<MonitorRootPage />}
            />

            {/* 審判 */}
            <Route path="/judge/:competitionId" element={<JudgePage />} />

            <Route key="root" path="system/" element={<RootLayout />}>
              {/* ユーザーダッシュボード */}
              <Route path="user/*" element={<UserRoutes />} />

              {/* 大会ダッシュボード */}
              <Route path="competition/*" element={<CompetitionRoutes />} />
              <Route path="score/" element={<ScorePage />} />
              <Route path="result/" element={<ResultListPage />} />
              <Route path="monitor/" element={<MonitorPage />} />
              <Route path="message/" element={<MessagePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
