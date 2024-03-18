import { PrismaClient } from 'prisma-client';

const prisma = new PrismaClient();

async function createTestUsers() {
  // Password is the hash for pass123
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    create: {
      firstName: 'yui',
      lastName: 'dumb',
      email: 'user@test.com',
      password: '$2a$10$bQsXqnDSTW27ESapuHq2xe1DhTjvj67s2WZylaB5U6XX9NzczhsT.',
      phoneNumber: '+262692000000',
    },
    update: {},
  });

  return [user];
}

async function main() {
  const createdUsers = await createTestUsers();

  console.log('Inserted: ', JSON.stringify(createdUsers));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
