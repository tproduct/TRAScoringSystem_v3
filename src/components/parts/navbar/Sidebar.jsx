import { VStack } from "@chakra-ui/react";
import { FaGear, FaUser } from "react-icons/fa6";
import { FaHome, FaDatabase, FaNewspaper } from "react-icons/fa";
import { LuMonitor } from "react-icons/lu";
import { TbMessageFilled } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import NavButton from "./NavButton";
import { useApiRequest } from "@hooks/useApiRequest";
import { logout } from "@store/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const handleLogout = async () => {
    const { get } = useApiRequest(`/logout/${user?.info.Id}`);
    const res = await get();
    dispatch(logout());
  }

  return (
    <VStack w="60px" h="100svh" bg="myBlue.900" gap="5" p="5">
      <NavButton icon={<FaHome />} label="HOME" href="/system/user/home/"/>
      <NavButton icon={<FaUser />} label="ユーザー" href="/system/user/info/"/>
      <NavButton icon={<TbMessageFilled />} label="掲示板" href="/system/message/"/>
      <NavButton icon={<FaGear />} label="大会設定" href="/system/competition/"/>
      <NavButton icon={<FaDatabase />} label="得点集計" href="/system/score/"/>
      <NavButton icon={<FaNewspaper />} label="リザルト" href="/system/result/"/>
      <NavButton icon={<LuMonitor />} label="速報" href="/system/monitor/"/>
      <NavButton icon={<MdLogout />} label="ログアウト" href="/login/" handler={handleLogout}/>
    </VStack>
  );
};

export default Sidebar;
