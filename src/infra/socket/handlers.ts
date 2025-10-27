import { SessionStartEvent, SessionEndEvent } from "../../domain/ws/WsEvent";
import { UserModel } from "../../domain/user/UserModel";
import { ID } from "../../domain/ID";
import { UserState } from "../../domain/user/UserState";
import { Area } from "../../domain/area/Area";
import { registerUser } from "../../app/registerUser";
import { useUserViewStore } from "../cache/UserViewStore";

// Tier番号からArea enumへの変換
function tierToArea(tier: number): Area {
  switch (tier) {
    case 1: return Area.Tier1;
    case 2: return Area.Tier2;
    case 3: return Area.Tier3;
    default: return Area.Tier1; // デフォルト
  }
}

// セッション開始時の処理
export function handleSessionStart(msg: SessionStartEvent) {
  const { setComment } = useUserViewStore.getState();

  const area = tierToArea(msg.tier);
  const icon = msg.icon || "princess.png";

  const user = new UserModel(
    msg.id as ID<UserModel>,
    msg.user_name,
    msg.work_name,
    icon,
    UserState.Idle,
    area
  );
  registerUser(user);
  setComment(user.id, `${msg.user_name}が「${msg.work_name}」開始`);
}

// （例）セッション終了時の処理
export function handleSessionEnd(msg: SessionEndEvent) {
//   const { removeUser } = useUserStore.getState();
//   removeUser(msg.id as ID<UserModel>);
    console.log(msg)
    return
}
