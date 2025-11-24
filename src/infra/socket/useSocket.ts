// src/infra/socket/useSocket.ts
import { useCallback, useEffect, useRef } from 'react';
import { WsEvent, WsEventType } from '../../domain/ws/WsEvent';
import { fetchActiveSessions } from '../api/sessions';
import { dispatchWsEvent } from './wsEventDispatcher';

const MAX_RECONNECT_DELAY_MS = 10_000;
const BASE_RECONNECT_DELAY_MS = 1_000;

const getWebSocketUrl = (): string =>
  import.meta.env.VITE_WS_URL || `ws://${window.location.host}/ws`;

const fetchInitialSessions = async () => {
  const data = await fetchActiveSessions();
  console.log(`📥 初期ロード: ${data.sessions.length}件のアクティブセッション`);
  data.sessions.forEach((session) => {
    dispatchWsEvent({
      type: WsEventType.SessionStart,
      id: session.session_id,
      user_id: session.user_id,
      user_name: session.user_name,
      work_name: session.work_name,
      tier: session.tier,
      icon: session.icon_id?.toString(),
      start_time: session.start_time,
      planned_end: session.planned_end,
    });
  });
};

export const useSocket = () => {
  const reconnectAttempts = useRef(0);
  const socketRef = useRef<WebSocket | null>(null);
  const closedByUnmount = useRef(false);

  const connect = useCallback(() => {
    const wsUrl = getWebSocketUrl();
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket接続成功');
      reconnectAttempts.current = 0;
      fetchInitialSessions().catch((err) => console.error('❌ 初期ロード失敗:', err));
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data) as WsEvent;
      dispatchWsEvent(msg);
    };

    socket.onerror = (err) => {
      console.error('❌ WebSocketエラー:', err);
    };

    socket.onclose = () => {
      if (closedByUnmount.current) return;
      reconnectAttempts.current += 1;
      const delay = Math.min(
        MAX_RECONNECT_DELAY_MS,
        BASE_RECONNECT_DELAY_MS * 2 ** (reconnectAttempts.current - 1)
      );
      console.warn(`⚠️ WebSocket切断。${delay}ms 後に再接続を試行します`);
      setTimeout(connect, delay);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      closedByUnmount.current = true;
      socketRef.current?.close();
    };
  }, [connect]);
};
