import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import { PlayerState, UserId, ISetDirectionRequest, Point, Direction } from "../api/types";

type Player = {
  id: UserId;
  x: number;
  y: number;
  direction: Direction;
};
type InternalState = {
  players: Player[];
};

const SPEED = 200;

export class Impl implements Methods<InternalState> {
  initialize(userId: UserId, ctx: Context): InternalState {
    return {
      players: [],
    };
  }
  setDirection(state: InternalState, userId: UserId, ctx: Context, request: ISetDirectionRequest): Response {
    const player = state.players.find((p) => p.id === userId);
    if (player === undefined) {
      const x = ctx.chance.natural({ max: 1280 - 1 });
      const y = ctx.chance.natural({ max: 720 - 1 });
      state.players.push({ id: userId, x, y, direction: request.direction });
    } else {
      player.direction = request.direction;
    }
    return Response.ok();
  }
  getUserState(state: InternalState, userId: UserId): PlayerState {
    return {
      players: state.players.map((player) => ({ x: player.x, y: player.y })),
    };
  }
  onTick(state: InternalState, ctx: Context, timeDelta: number): void {
    state.players.forEach((player) => {
      if (player.direction === Direction.UP) {
        player.y -= SPEED * timeDelta;
      } else if (player.direction === Direction.DOWN) {
        player.y += SPEED * timeDelta;
      } else if (player.direction === Direction.LEFT) {
        player.x -= SPEED * timeDelta;
      } else if (player.direction === Direction.RIGHT) {
        player.x += SPEED * timeDelta;
      }
    });
  }
}
