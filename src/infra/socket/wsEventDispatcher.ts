import { WsEvent, WsEventType } from '../../domain/ws/WsEvent';
import { handleSessionEnd, handleSessionStart } from './handlers';

export const dispatchWsEvent = (msg: WsEvent) => {
  console.log('📩 WebSocket受信:', msg);

  switch (msg.type) {
    case WsEventType.SessionStart:
      handleSessionStart(msg);
      return;
    case WsEventType.SessionEnd:
      handleSessionEnd(msg);
      return;
    default: {
      // 将来イベント追加時にコンパイルで検知
      const _exhaustive: never = msg;
      return _exhaustive;
    }
  }
};
