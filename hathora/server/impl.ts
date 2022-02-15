import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import { PlayerState, UserId, ISetDirectionRequest, Direction } from "../api/types";
import ForestGenerator from "./ForestGenerator";

type Player = {
  id: UserId;
  x: number;
  y: number;
  direction: Direction;
};
type InternalState = {
  players: Player[];
  walls: boolean[];
  width: number;
};

const TILE_WIDTH = 6;
const TILE_HEIGHT = 5;
const PIXEL_WIDTH = 150;
const PIXEL_HEIGHT = 150;
const SPEED = 200;

const gen = new ForestGenerator();

export class Impl implements Methods<InternalState> {
  initialize(userId: UserId, ctx: Context): InternalState {
    const { fields, width } = gen.generate(TILE_WIDTH, TILE_HEIGHT);
    return {
      players: [createPlayer(ctx, userId, Direction.NONE)],
      walls: fields,
      width,
    };
  }
  setDirection(state: InternalState, userId: UserId, ctx: Context, request: ISetDirectionRequest): Response {
    const player = state.players.find((p) => p.id === userId);
    if (player === undefined) {
      state.players.push(createPlayer(ctx, userId, request.direction));
    } else {
      player.direction = request.direction;
    }
    return Response.ok();
  }
  getUserState(state: InternalState, userId: UserId): PlayerState {
    return {
      players: state.players.map((player) => ({ x: player.x, y: player.y })),
      walls: state.walls,
      width: state.width,
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

function createPlayer(ctx: Context, userId: UserId, direction: Direction) {
  const x = ctx.chance.natural({ max: TILE_WIDTH * PIXEL_WIDTH - 1 });
  const y = ctx.chance.natural({ max: TILE_HEIGHT * PIXEL_HEIGHT - 1 });
  return { id: userId, x, y, direction };
}
