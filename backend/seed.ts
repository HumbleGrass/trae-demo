import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_management',
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const booksData = [
    {
      title: '百年孤独',
      author: '加西亚·马尔克斯',
      isbn: '9787544253994',
      publisher: '南海出版公司',
      quantity: 10,
      availableQuantity: 8,
      description: '《百年孤独》是魔幻现实主义文学的代表作，描写了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰。',
    },
    {
      title: '活着',
      author: '余华',
      isbn: '9787506365437',
      publisher: '作家出版社',
      quantity: 15,
      availableQuantity: 12,
      description: '《活着》讲述了农村人福贵悲惨的人生遭遇。福贵本是个阔少爷，可他嗜赌如命，终于赌光了家业。',
    },
    {
      title: '三体',
      author: '刘慈欣',
      isbn: '9787536692930',
      publisher: '重庆出版社',
      quantity: 20,
      availableQuantity: 15,
      description: '《三体》是刘慈欣创作的系列长篇科幻小说，由《三体》、《三体Ⅱ·黑暗森林》、《三体Ⅲ·死神永生》组成。',
    },
    {
      title: '围城',
      author: '钱钟书',
      isbn: '9787020024759',
      publisher: '人民文学出版社',
      quantity: 12,
      availableQuantity: 10,
      description: '《围城》是钱钟书所著的长篇小说，是中国现代文学史上一部风格独特的讽刺小说。',
    },
    {
      title: '红楼梦',
      author: '曹雪芹',
      isbn: '9787020002207',
      publisher: '人民文学出版社',
      quantity: 25,
      availableQuantity: 20,
      description: '《红楼梦》是一部具有世界影响力的人情小说、中国封建社会的百科全书、传统文化的集大成者。',
    },
    {
      title: '西游记',
      author: '吴承恩',
      isbn: '9787020008735',
      publisher: '人民文学出版社',
      quantity: 18,
      availableQuantity: 14,
      description: '《西游记》是中国古代第一部浪漫主义章回体长篇神魔小说。',
    },
    {
      title: '三国演义',
      author: '罗贯中',
      isbn: '9787020008728',
      publisher: '人民文学出版社',
      quantity: 16,
      availableQuantity: 13,
      description: '《三国演义》是中国古典四大名著之一，是中国第一部长篇章回体历史演义小说。',
    },
    {
      title: '水浒传',
      author: '施耐庵',
      isbn: '9787020008742',
      publisher: '人民文学出版社',
      quantity: 14,
      availableQuantity: 11,
      description: '《水浒传》是中国古典四大名著之一，是中国历史上最早用白话文写成的章回小说之一。',
    },
  ];

  for (const book of booksData) {
    const existingBook = await AppDataSource.query(
      'SELECT id FROM books WHERE isbn = ?',
      [book.isbn]
    );

    if (existingBook.length === 0) {
      await AppDataSource.query(
        `INSERT INTO books (title, author, isbn, publisher, quantity, available_quantity, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [book.title, book.author, book.isbn, book.publisher, book.quantity, book.availableQuantity, book.description]
      );
      console.log(`Inserted book: ${book.title}`);
    } else {
      console.log(`Book already exists: ${book.title}`);
    }
  }

  const adminExists = await AppDataSource.query(
    "SELECT id FROM users WHERE username = 'admin'"
  );

  if (adminExists.length === 0) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await AppDataSource.query(
      `INSERT INTO users (username, password, email, phone, bio, role, created_at, updated_at)
       VALUES ('admin', ?, 'admin@library.com', '13800138000', '图书馆系统管理员，负责维护系统的正常运行和用户管理', 'admin', NOW(), NOW())`,
      [hashedPassword]
    );
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  const adminUser: any = await AppDataSource.query(
    "SELECT id FROM users WHERE username = 'admin'"
  );

  if (adminUser.length > 0) {
    const adminId = adminUser[0].id;
    const memberExists = await AppDataSource.query(
      'SELECT id FROM members WHERE user_id = ?',
      [adminId]
    );

    if (memberExists.length === 0) {
      await AppDataSource.query(
        `INSERT INTO members (user_id, name, phone, idCard, email, borrow_limit, created_at, updated_at)
         VALUES (?, '管理员', '13800138000', '110101199001011234', 'admin@library.com', 10, NOW(), NOW())`,
        [adminId]
      );
      console.log('Admin member created');
    } else {
      console.log('Admin member already exists');
    }
  }

  await AppDataSource.destroy();
  console.log('Seed completed');
}

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});
