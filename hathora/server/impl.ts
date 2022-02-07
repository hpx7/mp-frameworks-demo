import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import { PlayerState, UserId, ISetDirectionRequest } from "../api/types";

type InternalState = {};

export class Impl implements Methods<InternalState> {
  initialize(userId: UserId, ctx: Context): InternalState {
    return {};
  }
  setDirection(state: InternalState, userId: UserId, ctx: Context, request: ISetDirectionRequest): Response {
    return Response.error("Not implemented");
  }
  getUserState(state: InternalState, userId: UserId): PlayerState {
    return {
      players: [],
    };
  }
  onTick(state: InternalState, ctx: Context, timeDelta: number): void {}
}
