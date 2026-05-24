import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const companies = [
  { name: 'Stripe',   logo: 'https://logo.clearbit.com/stripe.com',   website: 'https://stripe.com',   description: 'Financial infrastructure for the internet.' },
  { name: 'Vercel',   logo: 'https://logo.clearbit.com/vercel.com',   website: 'https://vercel.com',   description: 'Platform for frontend developers.' },
  { name: 'Linear',   logo: 'https://logo.clearbit.com/linear.app',   website: 'https://linear.app',   description: 'Issue tracking built for modern teams.' },
  { name: 'Supabase', logo: 'https://logo.clearbit.com/supabase.io',  website: 'https://supabase.io',  description: 'Open source Firebase alternative.' },
  { name: 'PlanetScale', logo: 'https://logo.clearbit.com/planetscale.com', website: 'https://planetscale.com', description: 'MySQL-compatible serverless database.' },
];

const jobTemplates = [
  {
    title: 'Senior Frontend Engineer',
    location: 'San Francisco, CA', remote: true,  type: 'FULL_TIME',
    salaryMin: 160000, salaryMax: 220000, featured: true,
    description: 'Build the next generation of developer tools. You\'ll work on our core product, improving performance, accessibility, and developer experience.',
    requirements: JSON.stringify(['5+ years React experience', 'TypeScript expert', 'Testing (RTL, Playwright)', 'Performance optimization']),
    techStack:    JSON.stringify(['React', 'TypeScript', 'Next.js', 'Vitest', 'Tailwind CSS']),
  },
  {
    title: 'Full Stack Engineer',
    location: 'Remote', remote: true, type: 'FULL_TIME',
    salaryMin: 140000, salaryMax: 190000, featured: true,
    description: 'Join a small, high-impact team building developer infrastructure. You\'ll own features end-to-end from database schema to UI.',
    requirements: JSON.stringify(['Node.js + TypeScript', 'React (hooks, performance)', 'PostgreSQL + Prisma', 'CI/CD experience']),
    techStack:    JSON.stringify(['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker']),
  },
  {
    title: 'React Native Engineer',
    location: 'New York, NY', remote: false, type: 'FULL_TIME',
    salaryMin: 130000, salaryMax: 175000, featured: false,
    description: 'Build cross-platform mobile apps for millions of users. Work closely with our design team to deliver polished, performant experiences.',
    requirements: JSON.stringify(['React Native 3+ years', 'Expo experience', 'Native module bridging', 'App Store deployment']),
    techStack:    JSON.stringify(['React Native', 'TypeScript', 'Expo', 'Redux Toolkit']),
  },
  {
    title: 'Frontend Engineer — Design Systems',
    location: 'London, UK', remote: true, type: 'FULL_TIME',
    salaryMin: 90000, salaryMax: 130000, featured: false,
    description: 'Own our component library and design tokens. Collaborate with designers to build accessible, themeable components used by 50+ product teams.',
    requirements: JSON.stringify(['Component library experience', 'Accessibility (WCAG)', 'Storybook', 'CSS-in-JS or Tailwind']),
    techStack:    JSON.stringify(['React', 'TypeScript', 'Storybook', 'Radix UI', 'CSS Modules']),
  },
  {
    title: 'Contract Frontend Developer',
    location: 'Remote', remote: true, type: 'CONTRACT',
    salaryMin: 80, salaryMax: 120, featured: false,
    description: '6-month contract to rebuild our customer dashboard. Fast-paced environment, direct collaboration with the CTO.',
    requirements: JSON.stringify(['React + TypeScript', 'GraphQL / Apollo', 'Charting libraries', 'Available immediately']),
    techStack:    JSON.stringify(['React', 'TypeScript', 'GraphQL', 'Recharts', 'Apollo']),
  },
  {
    title: 'Junior Frontend Engineer',
    location: 'Austin, TX', remote: true, type: 'FULL_TIME',
    salaryMin: 80000, salaryMax: 110000, featured: false,
    description: 'Great opportunity to grow your React skills alongside senior engineers. We invest heavily in mentorship and learning budgets.',
    requirements: JSON.stringify(['React fundamentals', 'JavaScript/TypeScript basics', 'Git workflow', 'Willingness to learn']),
    techStack:    JSON.stringify(['React', 'JavaScript', 'Tailwind CSS', 'REST APIs']),
  },
  {
    title: 'Staff Engineer — Platform',
    location: 'Remote', remote: true, type: 'FULL_TIME',
    salaryMin: 220000, salaryMax: 300000, featured: true,
    description: 'Define the technical direction for our platform team. You\'ll drive architectural decisions, mentor engineers, and ship foundational infrastructure.',
    requirements: JSON.stringify(['10+ years engineering', 'Distributed systems', 'React + Node at scale', 'Technical leadership']),
    techStack:    JSON.stringify(['React', 'TypeScript', 'Kubernetes', 'Go', 'PostgreSQL']),
  },
  {
    title: 'Frontend Intern',
    location: 'San Francisco, CA', remote: false, type: 'INTERNSHIP',
    salaryMin: 50, salaryMax: 60, featured: false,
    description: 'Summer internship (12 weeks) on our growth team. Ship real features used by our customers from day one.',
    requirements: JSON.stringify(['Computer Science student', 'React basics', 'Eager to learn', 'Available June–August']),
    techStack:    JSON.stringify(['React', 'JavaScript', 'HTML/CSS']),
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Seed companies
  const createdCompanies = await Promise.all(
    companies.map((c) => prisma.company.create({ data: c })),
  );
  console.log(`✅ Created ${createdCompanies.length} companies`);

  // Seed jobs (distribute across companies)
  const jobs = await Promise.all(
    jobTemplates.map((job, i) =>
      prisma.job.create({
        data: { ...job, companyId: createdCompanies[i % createdCompanies.length].id },
      }),
    ),
  );
  console.log(`✅ Created ${jobs.length} jobs`);

  // Seed demo user
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: { email: 'demo@example.com', name: 'Demo User', passwordHash },
  });
  console.log(`✅ Created demo user: ${user.email} / password123`);

  // Seed some saved jobs for the demo user
  await prisma.savedJob.createMany({
    data: [
      { userId: user.id, jobId: jobs[0].id },
      { userId: user.id, jobId: jobs[1].id },
    ],
  });

  // Seed some applications
  await prisma.application.createMany({
    data: [
      { userId: user.id, jobId: jobs[0].id, status: 'INTERVIEWING', notes: 'Had a great first call', appliedAt: new Date('2024-01-15') },
      { userId: user.id, jobId: jobs[1].id, status: 'APPLIED', appliedAt: new Date('2024-01-20') },
      { userId: user.id, jobId: jobs[2].id, status: 'OFFER', notes: 'Offer letter received!', appliedAt: new Date('2024-01-10') },
    ],
  });

  console.log('🎉 Seed complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
