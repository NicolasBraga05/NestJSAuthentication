import { SetMetadata } from '@nestjs/common';

const Roles = (...roles: number[]) => SetMetadata('roles', roles);

export default Roles;
