import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box,HStack } from "@chakra-ui/react";
import Sidebar from "@parts/navbar/Sidebar";
import AdminPage from "@pages/admin/AdminPage";

const RootLayout = () => {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  return (
      <HStack textStyle="body" layerStyle="body" width="100%">
        <Sidebar />
        {isLoggedIn ? <Outlet /> : <Navigate to="/login/" />}
      </HStack>
  )
}

export default RootLayout;