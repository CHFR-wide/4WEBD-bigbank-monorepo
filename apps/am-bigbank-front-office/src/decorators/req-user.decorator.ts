import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type TUserJwt = {
  sub: number;
  firstName: string;
  lastName: string;
  email: string;
};

export const UserJwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
