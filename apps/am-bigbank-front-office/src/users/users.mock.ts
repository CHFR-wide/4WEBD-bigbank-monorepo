import { ERole } from '.prisma/client';

const dbUser = {
  id: 0,
  email: 'mockUser@test.com',
  username: 'mockUser',
  password: 'hashedPassword',
  role: ERole.USER,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
};

const dbEmplyee = { ...dbUser, id: 1, role: ERole.EMPLOYEE };
const dbAdmin = { ...dbUser, id: 2, role: ERole.ADMIN };

const { password: userPassword, ...dbSafeUser } = dbUser;
const { password: employeePassword, ...dbSafeEmployee } = dbEmplyee;
const { password: adminPassword, ...dbSafeAdmin } = dbAdmin;

dbSafeUser.createdAt = dbSafeUser.createdAt.toISOString() as any;
dbSafeEmployee.createdAt = dbSafeEmployee.createdAt.toISOString() as any;
dbSafeAdmin.createdAt = dbSafeAdmin.createdAt.toISOString() as any;

const jwtUser = {
  sub: 0,
  username: 'mockUser',
  role: ERole.USER,
};
const jwtEmployee = {
  sub: 1,
  username: 'mockEmployee',
  role: ERole.EMPLOYEE,
};
const jwtAdmin = {
  sub: 2,
  username: 'mockAdmin',
  role: ERole.ADMIN,
};

export const userMocks = {
  dbUser,
  dbEmplyee,
  dbAdmin,
  dbSafeUser,
  dbSafeEmployee,
  dbSafeAdmin,
  jwtUser,
  jwtEmployee,
  jwtAdmin,
};
