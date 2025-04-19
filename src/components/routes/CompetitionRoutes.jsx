import CompetitionRootpage from "@pages/competition/CompetitionRootPage";
import CompetitionInfoPage from "@pages/competition/CompetitionInfoPage";
import { Route, Routes } from "react-router-dom";

const CompetitionRoutes = () => {
  return(
    <Routes>
      <Route path="/" element={<CompetitionRootpage />}>
        {/* <Route path="/info/" element={<CompetitionInfoPage />} /> */}
        {/* <Route path="/category/" element={<CategoryPage />} /> */}
        {/* <Route path="/rule/" element={<RuleBasePage />} /> */}
        {/* <Route path="/player/" element={<PlayerBasePage />} /> */}
        {/* <Route path="/routine/" element={<RoutineConfigPage />} /> */}
        {/* <Route path="/system/" element={<SystemBasePage />} /> */}
      </Route>
    </Routes>
    
  )
}

export default CompetitionRoutes