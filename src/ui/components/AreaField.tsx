import { Area, getAreaRect, getAreaStyle, fieldWidth, fieldHeight } from '../../domain/area/Area';
import { useUserStore } from '../../infra/cache/useUserStore';
import { UserCard } from './UserCard';

export const AreaField = () => {
  const getAllUsers = useUserStore((s) => s.getAllUsers);
  const allUsers = getAllUsers();

  return (
    <div
      className="relative border border-gray-300"
      style={{ width: fieldWidth, height: fieldHeight }}
    >
      {/* エリアの背景 */}
      {Object.values(Area).map((area, idx) => {
        const { x, y, width, height } = getAreaRect(area);
        const style = getAreaStyle(area);

        return (
          <div
            key={area}
            className="absolute border border-gray-500"
            style={{ left: x, top: y, width, height, zIndex: idx, ...style }}
          >
            <p className="text-xs text-center bg-white px-2 py-0.5 inline-block shadow-sm">
              {area}
            </p>
          </div>
        );
      })}

      {/* UserCardは全てAreaFieldの直下に配置（全エリア背景より上に表示） */}
      {allUsers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
