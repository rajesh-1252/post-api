import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const imageUrl = "/uploads/372e5d91-135d-47da-929a-b2ca01b1dd5f.png";

  const posts = Array.from({ length: 50 }, (_, i) => ({
    title: `Post ${i + 1}`,
    text: `This is post number ${i + 1}`,
    imageUrl,
  }));

  await prisma.post.createMany({ data: posts });

  console.log("✅ 50 posts inserted successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
