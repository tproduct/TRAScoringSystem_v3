import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Flex, HStack, Stack } from "@chakra-ui/react";
import Navbar from "@parts/navbar/Navbar";

const RootLayout = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <Flex
      textStyle="body"
      layerStyle="body"
      width="100%"
      direction={{ base: "column", md: "row" }}
    >
      <Navbar />
      {isLoggedIn ? <Outlet /> : <Navigate to="/login/" />}
    </Flex>
  );
};

export default RootLayout;
