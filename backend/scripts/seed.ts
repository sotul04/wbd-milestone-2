import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { User } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
    // Clear existing data to prevent duplicates
    await prisma.feed.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // Array to store created users
    const users: User[] = [];

    // Create 10 users
    for (let i = 0; i < 10; i++) {
        const username = `user${i+1}`;
        const email = `user${i+1}@user.com`;

        // Hash a consistent password 
        const saltRounds = 10;
        const password = 'password';
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password_hash,
                updated_at: new Date(),
                feeds: {
                    create: Array.from({ length: 15 }).map(() => ({
                        content: faker.lorem.paragraph()
                    }))
                },
                profile: {
                    create: {
                        name: username,
                        description: faker.lorem.paragraph()
                    }
                }
            }
        });

        users.push(user);
    }

    console.log('Seeding completed successfully.');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${await prisma.feed.count()} feeds`);
}

// Execute the seeding
seedDatabase()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

export default seedDatabase