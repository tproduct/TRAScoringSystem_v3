import axios from "axios";

// Axios のインスタンスを作成
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // タイムアウト (ミリ秒)
  withCredentials: true, // HttpOnlyクッキーを送信
});

// レスポンスのエラーハンドリング
axiosInstance.interceptors.response.use(
  (response) => response, // 成功時はそのまま返す
  async (error) => {
    console.log(error);
    //トークン
    if( error.response && error.response.status === 401 && !error.config.__isRetryRequest ){
      error.config.__isRetryRequest = true;
      try {
        const refreshResponse = await axios.post(
          import.meta.env.VITE_API_BASE_URL + "refresh_token/",
          {type:"refresh_token"},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.access_token;

        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(error.config); // リトライ
      } catch (refreshError) {
        const customError = new Error("Unauthorized");
        customError.code = "401_UNAUTHORIZED";
        return Promise.reject(customError);
      }
    }

    if (import.meta.env.VITE_NODE_ENV === "production") {
      // 本番環境では 400 のエラーログを出さない
      if (error.response && error.response.status === 400) {
        return Promise.reject(error);
      }
    } else {
      // 開発環境ではエラーを表示
      console.error("APIエラー:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
