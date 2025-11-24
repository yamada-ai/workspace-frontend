import { isInArea } from '../domain/area/Area';
import { ID } from '../domain/ID';
import { SPRITE_MARGIN, SPRITE_STEP_PX } from '../domain/scene/constants';
import { Direction } from '../domain/user/Direction';
import { UserModel } from '../domain/user/UserModel';
import { useUserViewStore } from '../infra/cache/UserViewStore';
import { useUserStore } from '../infra/cache/useUserStore';

const directionToDelta: Record<Direction, { dx: number; dy: number }> = {
  [Direction.Up]: { dx: 0, dy: -SPRITE_STEP_PX },
  [Direction.Down]: { dx: 0, dy: SPRITE_STEP_PX },
  [Direction.Left]: { dx: -SPRITE_STEP_PX, dy: 0 },
  [Direction.Right]: { dx: SPRITE_STEP_PX, dy: 0 },
};

export const moveUser = (id: ID<UserModel>) => {
  const user = useUserStore.getState().getUser(id);
  const view = useUserViewStore.getState().getView(id);
  if (!user?.canWalk() || !view) return;

  const delta = directionToDelta[view.direction];
  const newX = view.position.x + delta.dx;
  const newY = view.position.y + delta.dy;

  if (!isInArea(newX, newY, user.area, SPRITE_MARGIN)) {
    // はみ出すならキャンセル
    return;
  }

  useUserViewStore.getState().setPosition(id, newX, newY);
};
