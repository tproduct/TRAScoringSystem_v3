import { Route, Routes } from "react-router-dom";
import UserInfoPage from "@pages/user/UserInfopage";
import UserRootLayout from "@layouts/UserRootLayout";
import Dashboard from "@pages/user/Dashboard";

const UserRoutes = () => {
  return(
    <Routes>
      <Route path="/">
        <Route index element={<UserRootLayout />} />
        <Route path="/home/" element={<Dashboard />} />
        <Route path="/info/" element={<UserInfoPage />} />
      </Route>
    </Routes>
    
  )
}

export default UserRoutes