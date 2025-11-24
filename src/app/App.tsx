import { useSocket } from '../infra/socket/useSocket';
import { useAutoWalker } from '../viewmodel/useAutoWalker';
import { AreaField } from '../ui/components/AreaField';

import './App.css';

export const App = () => {
  // WebSocketとアクティブセッションの初期ロードを開始
  useSocket();
  useAutoWalker();

  return (
    <div style={{ textAlign: 'center' }}>
      <AreaField />
    </div>
  );
};
