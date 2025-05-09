import { useEffect, useRef, useState } from "react"

export const useWebSocket = () => {
  const socketRef = useRef(null);
  const [isConnetcted, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      console.log("サーバーに接続しました");
    };

    socket.onclose = () => {
      setIsConnected(false);
    }

  },[]);

  const joinRoom = (competitionId, panel, role) => {
    if(!isConnetcted || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "join",
        competitionId: competitionId,
        panel,
        role,
      })
    )
  }

  const setMessageHandler = (callback) => {
    socketRef.current.onmessage = callback;
  }

  const socketClose = () => {
    socketRef.current?.close();
    socketRef.current = null;
    setIsConnected(false);
  }

  return { socket: socketRef.current, isConnetcted, joinRoom, socketClose, setMessageHandler };

}