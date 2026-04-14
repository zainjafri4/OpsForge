import { PrismaClient } from '@prisma/client';
import { topics } from './seed-data/topics';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting minimal database seeding...\n');

  // Seed topics only
  console.log('📂 Seeding topics...');
  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: topic,
      create: topic,
    });
  }
  console.log(`✅ Seeded ${topics.length} topics`);

  console.log('\n🎉 Minimal seeding completed!');
  console.log('ℹ️  Questions data needs fixing - will be added later');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
