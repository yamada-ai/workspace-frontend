import { SessionStartEvent, SessionEndEvent } from '../../domain/ws/WsEvent';
import { UserModel } from '../../domain/user/UserModel';
import { ID } from '../../domain/ID';
import { UserState } from '../../domain/user/UserState';
import { Area } from '../../domain/area/Area';
import { registerUser } from '../../app/registerUser';
import { useUserStore } from '../cache/useUserStore';
import { useUserViewStore } from '../cache/UserViewStore';

// Tier番号からArea enumへの変換
function tierToArea(tier: number): Area {
  switch (tier) {
    case 1:
      return Area.Tier1;
    case 2:
      return Area.Tier2;
    case 3:
      return Area.Tier3;
    default:
      return Area.Tier1; // デフォルト
  }
}

// セッション開始時の処理
export function handleSessionStart(msg: SessionStartEvent) {
  const { setComment } = useUserViewStore.getState();

  const area = tierToArea(msg.tier);
  const icon = msg.icon || 'princess.png';

  const user = new UserModel(
    msg.user_id as ID<UserModel>, // user_idを使う（session idではない）
    msg.user_name,
    msg.work_name,
    icon,
    UserState.Idle,
    area
  );
  registerUser(user);
  setComment(user.id, `${msg.user_name}が「${msg.work_name}」開始`);
}

// セッション終了時の処理
export function handleSessionEnd(msg: SessionEndEvent) {
  const { getUser, removeUser } = useUserStore.getState();
  const { setComment, setFadingOut, removeView } = useUserViewStore.getState();

  const userId = msg.user_id as ID<UserModel>;
  const user = getUser(userId);

  console.log(`🚪 セッション終了: user_id=${msg.user_id}, session_id=${msg.id}`);

  if (!user) {
    console.warn(`User ${userId} not found for SessionEnd`);
    return;
  }

  // 1. コメントバブルで終了メッセージを表示（5秒間）
  setComment(userId, `${user.name}が作業を終了しました`);

  // 2. 3秒後にフェードアウトアニメーション開始
  setTimeout(() => {
    setFadingOut(userId, true);
  }, 3000);

  // 3. 4秒後（フェードアウト完了後）にDOMから削除
  setTimeout(() => {
    removeUser(userId);
    removeView(userId);
  }, 4000);
}
