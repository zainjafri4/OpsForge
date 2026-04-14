import { PrismaClient } from '@prisma/client';
import { topics } from './seed-data/topics';
import { linuxQuestions } from './seed-data/q-linux';
import { networkingQuestions } from './seed-data/q-networking';
import { awsCoreQuestions } from './seed-data/q-aws-core';
import { awsAdvancedQuestions } from './seed-data/q-aws-advanced';
import { dockerQuestions } from './seed-data/q-docker';
import { kubernetesQuestions } from './seed-data/q-kubernetes';
import { cicdQuestions } from './seed-data/q-cicd';
import { iacQuestions } from './seed-data/q-iac';
import { observabilityQuestions } from './seed-data/q-observability';
import { sreQuestions } from './seed-data/q-sre';
import { securityQuestions } from './seed-data/q-security';
import { finopsQuestions } from './seed-data/q-finops';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed topics
  console.log('📚 Seeding topics...');
  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: topic,
      create: topic,
    });
  }
  console.log(`✅ Seeded ${topics.length} topics`);

  // Combine all questions
  const allQuestions = [
    ...linuxQuestions,
    ...networkingQuestions,
    ...awsCoreQuestions,
    ...awsAdvancedQuestions,
    ...dockerQuestions,
    ...kubernetesQuestions,
    ...cicdQuestions,
    ...iacQuestions,
    ...observabilityQuestions,
    ...sreQuestions,
    ...securityQuestions,
    ...finopsQuestions,
  ];

  console.log(`📝 Seeding ${allQuestions.length} questions...`);
  
  // Clear related records first (foreign key constraints)
  console.log(`   🗑️  Clearing related records...`);
  await prisma.bookmark.deleteMany({});
  await prisma.testAnswer.deleteMany({});
  await prisma.sessionQuestion.deleteMany({});
  await prisma.testResult.deleteMany({});
  await prisma.testSession.deleteMany({});
  await prisma.userProgress.deleteMany({});
  
  // Clear existing questions
  await prisma.question.deleteMany({});
  console.log(`   🗑️  Cleared existing questions`);

  // Seed questions
  let count = 0;
  for (const question of allQuestions) {
    const topic = await prisma.topic.findUnique({
      where: { slug: question.topicSlug },
    });

    if (!topic) {
      console.error(`❌ Topic not found for slug: ${question.topicSlug}`);
      continue;
    }

    await prisma.question.create({
      data: {
        topicId: topic.id,
        difficulty: question.difficulty,
        type: question.type,
        question: question.question,
        options: question.options,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        tags: question.tags,
      },
    });

    count++;
    if (count % 25 === 0) {
      console.log(`   ✓ Seeded ${count} questions...`);
    }
  }

  console.log(`✅ Seeded ${count} questions successfully!`);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
