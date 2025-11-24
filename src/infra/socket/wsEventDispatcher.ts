import { WsEvent, WsEventType } from '../../domain/ws/WsEvent';
import {
  handleSessionEnd,
  handleSessionExtend,
  handleSessionStart,
  handleWorkNameChange,
} from './handlers';

export const dispatchWsEvent = (msg: WsEvent) => {
  console.log('📩 WebSocket受信:', msg);

  switch (msg.type) {
    case WsEventType.SessionStart:
      handleSessionStart(msg);
      return;
    case WsEventType.SessionEnd:
      handleSessionEnd(msg);
      return;
    case WsEventType.SessionExtend:
      handleSessionExtend(msg);
      return;
    case WsEventType.WorkNameChange:
      handleWorkNameChange(msg);
      return;
    default: {
      // 将来イベント追加時にコンパイルで検知
      const _exhaustive: never = msg;
      return _exhaustive;
    }
  }
};
