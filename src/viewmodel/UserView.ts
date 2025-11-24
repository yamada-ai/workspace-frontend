import { Direction } from '../domain/user/Direction';

export type UserView = {
  id: string;
  direction: Direction;
  position: { x: number; y: number };
  comment: string | null;
  commentUntil?: number; // UNIX msでの期限
  isFadingOut?: boolean; // フェードアウト中フラグ
};
