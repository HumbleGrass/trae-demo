# 测试规范

## 文档信息

| 项目 | 内容 |
|------|------|
| 版本 | v1.0.0 |
| 更新日期 | 2025-03-27 |
| 作者 | Trae |

---

## 一、测试策略

### 1.1 测试金字塔

```
                    ┌─────────────┐
                    │    E2E     │  少量端到端测试
                    │   Tests    │  验证完整业务流程
                    ├─────────────┤
                    │ Integration│  中量集成测试
                    │   Tests    │  验证模块间协作
                    ├─────────────┤
                    │   Unit     │  大量单元测试
                    │   Tests    │  验证函数/方法逻辑
                    └─────────────┘
```

### 1.2 测试类型

| 测试类型 | 覆盖率目标 | 说明 |
|----------|------------|------|
| 单元测试 | ≥ 80% | 测试单个函数/方法 |
| 集成测试 | ≥ 60% | 测试模块间协作 |
| E2E 测试 | 关键流程 100% | 测试完整业务流程 |

---

## 二、后端测试 (NestJS)

### 2.1 单元测试

#### 测试文件命名

```
src/modules/books/books.service.ts
src/modules/books/books.service.spec.ts  # 单元测试
```

#### Service 单元测试示例

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BooksService } from './books.service'
import { Book } from '../../entities/book.entity'
import { NotFoundException } from '@nestjs/common'

describe('BooksService', () => {
  let service: BooksService
  let repository: Repository<Book>

  const mockRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository
        }
      ]
    }).compile()

    service = module.get<BooksService>(BooksService)
    repository = module.get<Repository<Book>>(getRepositoryToken(Book))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findOne', () => {
    it('should return a book when found', async () => {
      const mockBook = { id: 1, title: 'Test Book', isbn: '123' }
      mockRepository.findOne.mockResolvedValue(mockBook)

      const result = await service.findOne(1)

      expect(result).toEqual(mockBook)
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should throw NotFoundException when book not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create and return a book', async () => {
      const createDto = { title: 'New Book', isbn: '456' }
      const mockBook = { id: 1, ...createDto }
      
      mockRepository.create.mockReturnValue(mockBook)
      mockRepository.save.mockResolvedValue(mockBook)

      const result = await service.create(createDto)

      expect(result).toEqual(mockBook)
      expect(mockRepository.create).toHaveBeenCalledWith(createDto)
      expect(mockRepository.save).toHaveBeenCalledWith(mockBook)
    })
  })
})
```

### 2.2 集成测试 (E2E)

#### 测试文件命名

```
test/books.e2e-spec.ts
```

#### E2E 测试示例

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('BooksController (e2e)', () => {
  let app: INestApplication
  let token: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    // 获取登录 Token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: '123456' })
    token = loginResponse.body.data.token
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/api/v1/books (GET)', () => {
    it('should return books list', () => {
      return request(app.getHttpServer())
        .get('/api/v1/books')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(res => {
          expect(res.body.code).toBe(200)
          expect(res.body.data).toHaveProperty('list')
          expect(res.body.data).toHaveProperty('pagination')
        })
    })
  })

  describe('/api/v1/books (POST)', () => {
    it('should create a book', () => {
      return request(app.getHttpServer())
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          isbn: '9787115428028',
          title: 'JavaScript高级程序设计',
          author: 'Nicholas C. Zakas',
          quantity: 10
        })
        .expect(201)
        .expect(res => {
          expect(res.body.code).toBe(201)
          expect(res.body.data).toHaveProperty('id')
        })
    })

    it('should return 400 for invalid ISBN', () => {
      return request(app.getHttpServer())
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          isbn: 'invalid-isbn',
          title: 'Test Book'
        })
        .expect(400)
    })
  })
})
```

### 2.3 测试覆盖率配置

```json
// package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    },
    "collectCoverageFrom": [
      "src/**/*.ts",
      "!src/main.ts",
      "!src/**/*.module.ts",
      "!src/**/*.dto.ts",
      "!src/**/*.interface.ts"
    ]
  }
}
```

---

## 三、前端测试 (Vue 3)

### 3.1 组件测试 (Vitest)

#### 测试文件命名

```
src/components/common/BaseButton.vue
src/components/common/BaseButton.spec.ts
```

#### 组件测试示例

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })
    
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('base-button')
  })

  it('renders with type prop', () => {
    const wrapper = mount(BaseButton, {
      props: { type: 'primary' }
    })
    
    expect(wrapper.classes()).toContain('base-button--primary')
  })

  it('emits click event', async () => {
    const wrapper = mount(BaseButton)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('disables button when loading', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true }
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
```

### 3.2 Composable 测试

```typescript
import { describe, it, expect } from 'vitest'
import { usePagination } from './usePagination'

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { page, pageSize, total } = usePagination()
    
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(20)
    expect(total.value).toBe(0)
  })

  it('initializes with custom values', () => {
    const { page, pageSize } = usePagination({
      defaultPage: 2,
      defaultPageSize: 50
    })
    
    expect(page.value).toBe(2)
    expect(pageSize.value).toBe(50)
  })

  it('calculates totalPages correctly', () => {
    const { total, totalPages, setTotal } = usePagination()
    
    setTotal(100)
    expect(totalPages.value).toBe(5)
    
    setTotal(21)
    expect(totalPages.value).toBe(2)
  })

  it('resets to default values', () => {
    const { page, pageSize, total, setPage, setTotal, reset } = usePagination()
    
    setPage(5)
    setTotal(100)
    
    reset()
    
    expect(page.value).toBe(1)
    expect(total.value).toBe(0)
  })
})
```

### 3.3 E2E 测试 (Playwright)

#### 测试文件命名

```
e2e/books.spec.ts
e2e/auth.spec.ts
```

#### E2E 测试示例

```typescript
import { test, expect } from '@playwright/test'

test.describe('Books Management', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.fill('[name="username"]', 'admin')
    await page.fill('[name="password"]', '123456')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should display books list', async ({ page }) => {
    await page.goto('/books')
    
    await expect(page.locator('.book-list')).toBeVisible()
    await expect(page.locator('.el-table')).toBeVisible()
  })

  test('should create a new book', async ({ page }) => {
    await page.goto('/books')
    
    // 点击新增按钮
    await page.click('button:has-text("新增")')
    
    // 填写表单
    await page.fill('[name="isbn"]', '9787115428028')
    await page.fill('[name="title"]', 'JavaScript高级程序设计')
    await page.fill('[name="author"]', 'Nicholas C. Zakas')
    await page.fill('[name="quantity"]', '10')
    
    // 提交
    await page.click('button:has-text("确定")')
    
    // 验证成功提示
    await expect(page.locator('.el-message--success')).toBeVisible()
  })

  test('should search books', async ({ page }) => {
    await page.goto('/books')
    
    // 输入搜索关键词
    await page.fill('.search-input', 'JavaScript')
    await page.click('button:has-text("搜索")')
    
    // 等待表格更新
    await page.waitForTimeout(500)
    
    // 验证搜索结果
    const rows = await page.locator('.el-table__row').count()
    expect(rows).toBeGreaterThan(0)
  })
})
```

---

## 四、测试用例规范

### 4.1 测试用例命名

```typescript
// 格式：should + 预期行为 + when + 条件
it('should return 404 when book not found', () => {})

// 或使用 Given-When-Then 格式
it('given invalid credentials when login then return 401', () => {})
```

### 4.2 测试用例结构 (AAA 模式)

```typescript
it('should calculate overdue fine correctly', () => {
  // Arrange (准备)
  const borrowDate = new Date('2025-03-01')
  const dueDate = new Date('2025-03-15')
  const returnDate = new Date('2025-03-20')
  
  // Act (执行)
  const fine = calculateOverdueFine(dueDate, returnDate)
  
  // Assert (断言)
  expect(fine.days).toBe(5)
  expect(fine.amount).toBe(2.5) // 5天 * 0.5元
})
```

### 4.3 边界条件测试

```typescript
describe('borrow limit validation', () => {
  it('should allow borrow when under limit', () => {
    // 当前借阅 4 本，上限 5 本
    expect(canBorrow(4, 5)).toBe(true)
  })

  it('should reject borrow when at limit', () => {
    // 当前借阅 5 本，上限 5 本
    expect(canBorrow(5, 5)).toBe(false)
  })

  it('should handle zero borrow limit', () => {
    // 上限为 0
    expect(canBorrow(0, 0)).toBe(false)
  })

  it('should handle negative values', () => {
    // 负数情况
    expect(canBorrow(-1, 5)).toBe(false)
  })
})
```

---

## 五、测试数据管理

### 5.1 测试数据工厂

```typescript
// test/factories/book.factory.ts
export class BookFactory {
  static create(overrides: Partial<Book> = {}): Book {
    return {
      id: 1,
      isbn: '9787115428028',
      title: 'Test Book',
      author: 'Test Author',
      category: 'Test',
      quantity: 10,
      available: 10,
      status: BookStatus.AVAILABLE,
      ...overrides
    }
  }

  static createMany(count: number, overrides: Partial<Book> = {}): Book[] {
    return Array.from({ length: count }, (_, i) => 
      this.create({ id: i + 1, ...overrides })
    )
  }
}

// 使用
const book = BookFactory.create({ title: 'Custom Title' })
const books = BookFactory.createMany(5)
```

### 5.2 测试数据库

```typescript
// test/setup/database.ts
import { Connection, createConnection } from 'typeorm'

let connection: Connection

export async function setupTestDatabase() {
  connection = await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'library_test',
    synchronize: true,
    dropSchema: true
  })
  return connection
}

export async function teardownTestDatabase() {
  if (connection) {
    await connection.close()
  }
}

export async function clearDatabase() {
  const entities = connection.entityMetadatas
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name)
    await repository.clear()
  }
}
```

---

## 六、测试命令

### 6.1 后端测试命令

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- books.service.spec.ts

# 运行测试并生成覆盖率报告
npm test -- --coverage

# 监听模式
npm test -- --watch

# 运行 E2E 测试
npm run test:e2e
```

### 6.2 前端测试命令

```bash
# 运行所有测试
npm run test

# 运行特定测试文件
npm run test -- BaseButton.spec.ts

# 运行测试并生成覆盖率报告
npm run test -- --coverage

# 监听模式
npm run test -- --watch

# 运行 E2E 测试
npm run test:e2e

# 打开 Playwright UI
npm run test:e2e -- --ui
```
