// src/infra/socket/useSocket.ts
import { useEffect } from 'react';
import { WsEvent, WsEventType } from '../../domain/ws/WsEvent';
import { handleSessionStart, handleSessionEnd } from './handlers';
import { fetchActiveSessions } from '../api/sessions';

export const useSocket = () => {
  useEffect(() => {
    // 初期ロード: 既存のアクティブセッションを取得
    fetchActiveSessions()
      .then((data) => {
        console.log(`📥 初期ロード: ${data.sessions.length}件のアクティブセッション`);
        data.sessions.forEach((session) => {
          // SessionInfoをSessionStartEvent形式に変換してhandleSessionStart再利用
          handleSessionStart({
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
      })
      .catch((err) => {
        console.error('❌ 初期ロード失敗:', err);
      });

    // 環境変数からWebSocket URLを取得、デフォルトは相対パス（Nginx経由）
    // 直接アクセスの場合は VITE_WS_URL=ws://localhost:8000/ws を設定
    const wsUrl = import.meta.env.VITE_WS_URL || `ws://${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('✅ WebSocket接続成功');
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data) as WsEvent;
      console.log('📩 WebSocket受信:', msg);

      switch (msg.type) {
        case WsEventType.SessionStart:
          handleSessionStart(msg);
          break;
        case WsEventType.SessionEnd:
          handleSessionEnd(msg);
          break;
        default: {
          // 型が足りているかコンパイル時にチェック
          const _exhaustive: never = msg;
          return _exhaustive;
        }
      }
    };

    socket.onerror = (err) => {
      console.error('❌ WebSocketエラー:', err);
    };

    socket.onclose = () => {
      console.warn('⚠️ WebSocket切断');
    };

    return () => {
      socket.close();
    };
  }, []);
};
