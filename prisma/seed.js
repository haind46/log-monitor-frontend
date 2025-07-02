const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

const labels = ["bug", "beature", "documentation"];
const statuses = ["backlog", "todo", "in-progress", "done", "canceled"];
const priorities = ["low", "medium", "high"];

async function main() {
  await prisma.task.deleteMany();

  const tasks = Array.from({ length: 1000 }, () => ({
    code: `TASK-${faker.datatype.number({ min: 1000, max: 9999 })}`,
    title: faker.hacker
      .phrase()
      .replace(/^./, (letter) => letter.toUpperCase()),
    status: faker.helpers.arrayElement(statuses),
    label: faker.helpers.arrayElement(labels),
    priority: faker.helpers.arrayElement(priorities),
  }));

  for (let task of tasks) {
    await prisma.task.create({ data: task });
  }
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
