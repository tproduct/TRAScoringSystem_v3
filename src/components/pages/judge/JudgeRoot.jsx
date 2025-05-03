import { useSelector } from "react-redux";
import JudgePage from "./JudgePage";
import LoginPage from "@pages/user/LoginPage";

const JudgeRoot = () => {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  return isLoggedIn ? (
    <JudgePage />
  ) : (
    <LoginPage />
  )
}

export default JudgeRoot;