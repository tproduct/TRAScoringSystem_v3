import { Box, Button, IconButton, Menu, Portal, VStack } from "@chakra-ui/react";
import { FaGear, FaUser } from "react-icons/fa6";
import { FaHome, FaDatabase, FaNewspaper } from "react-icons/fa";
import { LuMonitor } from "react-icons/lu";
import { TbMessageFilled } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import NavButton from "./NavButton";
import { useApiRequest } from "@hooks/useApiRequest";
import { logout } from "@store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { LuSquareMenu } from "react-icons/lu";
import MenuButton from "./MenuButton";


const HumbergerMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const handleLogout = async () => {
    const { get } = useApiRequest(`/logout/${user?.info.Id}`);
    const res = await get();
    dispatch(logout());
  }

  return (
    <Box display={{base:"block", md:"none"}}>
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton variant="outline" size="lg">
          <LuSquareMenu />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item><MenuButton icon={<FaHome />} label="HOME" href="/system/user/home/"/></Menu.Item>
            <Menu.Item><MenuButton icon={<FaGear />} label="大会設定" href="/system/competition/"/></Menu.Item>
            <Menu.Item><MenuButton icon={<FaDatabase />} label="得点集計" href="/system/score/"/></Menu.Item>
            <Menu.Item><MenuButton icon={<FaNewspaper />} label="リザルト" href="/system/result/"/></Menu.Item>
            <Menu.Item><MenuButton icon={<LuMonitor />} label="速報" href="/system/monitor/"/></Menu.Item>
            <Menu.Item><MenuButton icon={<FaUser />} label="ユーザー" href="/system/user/info/"/></Menu.Item>
            <Menu.Item><MenuButton icon={<TbMessageFilled />} label="掲示板" href="/system/message/"/></Menu.Item>
            <Menu.Item><MenuButton icon={<MdLogout />} label="LOGOUT" href="/login/" handler={handleLogout}/></Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
    </Box>
  );
};

export default HumbergerMenu;
