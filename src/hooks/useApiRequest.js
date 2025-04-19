import axiosInstance from "@api/axiosInstance";

export const useApiRequest = ( endpoint ) => {
  const sendRequest = async ( method, data = null, params=null, onSuccess, onError ) => {
    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data,
        params,
      });

      if( onSuccess ) onSuccess( response.data ); //成功時のカスタム処理
      return response.data;
    } catch ( error ){
      // リフレッシュトークンが無効ならログインページへリダイレクト
      if (error.code === "401_UNAUTHORIZED") {
        return { errorCode: "401_UNAUTHORIZED"}
      }
      if( onError ) onError( error ); //エラー時のカスタム処理
      throw error;
    }
  };

  const get = ( params, onSuccess, onError ) => sendRequest( "GET", null, params, onSuccess, onError );
  const post = ( data, onSuccess, onError ) => sendRequest( "POST", data, null, onSuccess, onError );
  const patch = (data, onSuccess, onError ) => sendRequest( "PATCH", data, null, onSuccess, onError );
  const del = ( data, onSuccess, onError ) => sendRequest( "DELETE", data, null, onSuccess, onError );

  return { get, post, patch, del }
};
