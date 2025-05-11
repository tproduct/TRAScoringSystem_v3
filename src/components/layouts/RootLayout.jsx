import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Flex, HStack, Stack } from "@chakra-ui/react";
import Sidebar from "@parts/navbar/Sidebar";
import AdminPage from "@pages/admin/AdminPage";
import HumbergerMenu from "@parts/navbar/HumbergerMenu";

const RootLayout = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <Stack>
      <HumbergerMenu />
      <Flex textStyle="body" layerStyle="body" width="100%">
        <Sidebar />
        {isLoggedIn ? <Outlet /> : <Navigate to="/login/" />}
      </Flex>
    </Stack>
  );
};

export default RootLayout;
