# 编码规范

## 文档信息

| 项目 | 内容 |
|------|------|
| 版本 | v1.0.0 |
| 更新日期 | 2025-03-27 |
| 作者 | Trae |

---

## 一、通用规范

### 1.1 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 类名 | 大驼峰 (PascalCase) | `UserService`, `BookController` |
| 函数/方法 | 小驼峰 (camelCase) | `getUserById`, `createBook` |
| 变量 | 小驼峰 (camelCase) | `userName`, `bookList` |
| 常量 | 全大写下划线 (UPPER_SNAKE_CASE) | `MAX_BORROW_LIMIT`, `DEFAULT_PAGE_SIZE` |
| 文件名 | 短横线分隔 (kebab-case) | `user-service.ts`, `book-list.vue` |
| 数据库表名 | 小写下划线 (snake_case) | `borrow_records`, `overdue_fines` |
| 数据库字段 | 小写下划线 (snake_case) | `created_at`, `member_id` |

### 1.2 注释规范

#### 文件头注释

```typescript
/**
 * @file 用户服务
 * @description 提供用户相关的业务逻辑处理
 * @author Trae
 * @date 2025-03-27
 */
```

#### 函数注释

```typescript
/**
 * 根据ID获取用户信息
 * @param id 用户ID
 * @returns 用户信息对象
 * @throws NotFoundException 用户不存在时抛出异常
 */
async getUserById(id: number): Promise<User> {
  // ...
}
```

#### 行内注释

```typescript
const MAX_RETRY = 3; // 最大重试次数
```

### 1.3 代码格式

- 缩进：2 空格
- 分号：不使用分号
- 引号：使用单引号
- 逗号：末尾不加逗号（单行），多行加尾逗号
- 最大行宽：100 字符

---

## 二、后端规范 (NestJS + TypeORM)

### 2.1 目录结构

```
backend/
├── src/
│   ├── main.ts                 # 入口文件
│   ├── app.module.ts           # 根模块
│   ├── common/                 # 公共模块
│   │   ├── decorators/         # 自定义装饰器
│   │   ├── filters/            # 异常过滤器
│   │   ├── guards/             # 守卫
│   │   ├── interceptors/       # 拦截器
│   │   ├── pipes/              # 管道
│   │   └── utils/              # 工具函数
│   ├── config/                 # 配置文件
│   ├── modules/                # 业务模块
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── interfaces/
│   │   ├── books/
│   │   ├── members/
│   │   └── ...
│   └── entities/               # 数据库实体
└── test/                       # 测试文件
```

### 2.2 模块命名

| 文件类型 | 命名规则 | 示例 |
|----------|----------|------|
| Module | XxxModule | `AuthModule` |
| Controller | XxxController | `AuthController` |
| Service | XxxService | `AuthService` |
| DTO | XxxDto / CreateXxxDto / UpdateXxxDto | `LoginDto`, `CreateBookDto` |
| Entity | Xxx | `User`, `Book` |
| Interface | IXxx | `IUser`, `IBook` |
| Enum | XxxEnum / XxxType | `UserRole`, `BookStatus` |

### 2.3 Controller 规范

```typescript
@Controller('api/v1/books')
@ApiTags('书籍管理')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: '获取书籍列表' })
  @ApiResponse({ status: 200, description: '成功' })
  async findAll(@Query() query: QueryBookDto) {
    return this.booksService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取书籍详情' })
  async findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id)
  }

  @Post()
  @ApiOperation({ summary: '创建书籍' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新书籍' })
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto
  ) {
    return this.booksService.update(+id, updateBookDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除书籍' })
  async remove(@Param('id') id: string) {
    return this.booksService.remove(+id)
  }
}
```

### 2.4 Service 规范

```typescript
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) {}

  async findAll(query: QueryBookDto): Promise<PaginatedResult<Book>> {
    const { page = 1, pageSize = 20, keyword, category } = query
    
    const qb = this.bookRepository.createQueryBuilder('book')
    
    if (keyword) {
      qb.andWhere(
        '(book.title LIKE :keyword OR book.author LIKE :keyword)',
        { keyword: `%${keyword}%` }
      )
    }
    
    if (category) {
      qb.andWhere('book.category = :category', { category })
    }
    
    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()
    
    return { list, total, page, pageSize }
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } })
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`)
    }
    return book
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto)
    return this.bookRepository.save(book)
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id)
    Object.assign(book, updateBookDto)
    return this.bookRepository.save(book)
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id)
    await this.bookRepository.remove(book)
  }
}
```

### 2.5 DTO 规范

```typescript
import { IsString, IsNumber, IsOptional, IsISBN, MaxLength, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBookDto {
  @ApiProperty({ description: 'ISBN', example: '9787115428028' })
  @IsISBN()
  isbn: string

  @ApiProperty({ description: '书名', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  title: string

  @ApiPropertyOptional({ description: '作者', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  author?: string

  @ApiPropertyOptional({ description: '分类', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string

  @ApiProperty({ description: '库存数量', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number
}
```

### 2.6 Entity 规范

```typescript
@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 20, unique: true })
  isbn: string

  @Column({ length: 200 })
  title: string

  @Column({ length: 100, nullable: true })
  author: string

  @Column({ length: 50, nullable: true })
  category: string

  @Column({ default: 0 })
  quantity: number

  @Column({ default: 0 })
  available: number

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.AVAILABLE
  })
  status: BookStatus

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
```

---

## 三、前端规范 (Vue 3 + TypeScript)

### 3.1 目录结构

```
frontend/
├── src/
│   ├── main.ts                 # 入口文件
│   ├── App.vue                 # 根组件
│   ├── api/                    # API 接口
│   │   ├── request.ts          # Axios 封装
│   │   ├── auth.ts
│   │   ├── books.ts
│   │   └── members.ts
│   ├── assets/                 # 静态资源
│   │   ├── images/
│   │   └── styles/
│   ├── components/             # 组件
│   │   ├── common/             # 通用组件
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseTable.vue
│   │   │   └── BaseModal.vue
│   │   └── business/           # 业务组件
│   │       ├── BookCard.vue
│   │       └── MemberSelector.vue
│   ├── composables/            # 组合式函数
│   │   ├── usePagination.ts
│   │   └── useSearch.ts
│   ├── layouts/                # 布局组件
│   ├── locales/                # 国际化
│   │   ├── zh-CN.ts
│   │   └── en.ts
│   ├── router/                 # 路由
│   │   └── index.ts
│   ├── store/                  # 状态管理
│   │   ├── index.ts
│   │   └── modules/
│   │       ├── user.ts
│   │       └── books.ts
│   ├── types/                  # 类型定义
│   │   ├── api.d.ts
│   │   └── global.d.ts
│   ├── utils/                  # 工具函数
│   │   ├── date.ts
│   │   └── storage.ts
│   └── views/                  # 页面
│       ├── login/
│       ├── books/
│       ├── members/
│       └── ...
├── public/
└── vite.config.ts
```

### 3.2 组件规范

```vue
<template>
  <div class="book-list">
    <el-table :data="books" v-loading="loading">
      <el-table-column prop="title" :label="t('book.title')" />
      <el-table-column prop="author" :label="t('book.author')" />
      <el-table-column prop="category" :label="t('book.category')" />
      <el-table-column :label="t('common.actions')">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            {{ t('common.edit') }}
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            {{ t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      @change="fetchBooks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBooks, deleteBook } from '@/api/books'
import type { Book, Pagination } from '@/types/api'

const { t } = useI18n()

const books = ref<Book[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 20,
  total: 0
})

const fetchBooks = async () => {
  loading.value = true
  try {
    const res = await getBooks(pagination.value)
    books.value = res.data.list
    pagination.value.total = res.data.pagination.total
  } finally {
    loading.value = false
  }
}

const handleEdit = (row: Book) => {
  // 编辑逻辑
}

const handleDelete = async (row: Book) => {
  await deleteBook(row.id)
  fetchBooks()
}

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.book-list {
  padding: 20px;
}
</style>
```

### 3.3 API 封装规范

```typescript
import request from './request'
import type { Book, Pagination, ApiResponse } from '@/types/api'

export interface BookQuery extends Pagination {
  keyword?: string
  category?: string
}

export const getBooks = (params: BookQuery): Promise<ApiResponse<{ list: Book[], pagination: Pagination }>> => {
  return request.get('/books', { params })
}

export const getBook = (id: number): Promise<ApiResponse<Book>> => {
  return request.get(`/books/${id}`)
}

export const createBook = (data: Partial<Book>): Promise<ApiResponse<Book>> => {
  return request.post('/books', data)
}

export const updateBook = (id: number, data: Partial<Book>): Promise<ApiResponse<Book>> => {
  return request.patch(`/books/${id}`, data)
}

export const deleteBook = (id: number): Promise<void> => {
  return request.delete(`/books/${id}`)
}
```

### 3.4 Composable 规范

```typescript
import { ref, computed } from 'vue'

export interface PaginationOptions {
  defaultPage?: number
  defaultPageSize?: number
}

export function usePagination(options: PaginationOptions = {}) {
  const { defaultPage = 1, defaultPageSize = 20 } = options
  
  const page = ref(defaultPage)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)
  
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  
  const setPage = (newPage: number) => {
    page.value = newPage
  }
  
  const setPageSize = (newPageSize: number) => {
    pageSize.value = newPageSize
    page.value = 1
  }
  
  const setTotal = (newTotal: number) => {
    total.value = newTotal
  }
  
  const reset = () => {
    page.value = defaultPage
    pageSize.value = defaultPageSize
    total.value = 0
  }
  
  return {
    page,
    pageSize,
    total,
    totalPages,
    setPage,
    setPageSize,
    setTotal,
    reset
  }
}
```

---

## 四、错误处理规范

### 4.1 后端异常处理

```typescript
// 自定义业务异常
export class BusinessException extends HttpException {
  constructor(message: string, code: number = 400) {
    super({ code, message, timestamp: new Date().toISOString() }, HttpStatus.OK)
  }
}

// 全局异常过滤器
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let code = 500
    
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || message
      code = (exceptionResponse as any).code || status
    }
    
    response.status(status).json({
      code,
      message,
      timestamp: new Date().toISOString()
    })
  }
}
```

### 4.2 前端错误处理

```typescript
// request.ts
import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000
})

request.interceptors.response.use(
  response => {
    const { data } = response
    if (data.code !== 200) {
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
    return data
  },
  error => {
    const { response } = error
    let message = '网络错误'
    
    if (response) {
      switch (response.status) {
        case 401:
          message = '未登录或登录已过期'
          // 跳转登录页
          break
        case 403:
          message = '无权限访问'
          break
        case 404:
          message = '请求资源不存在'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          message = response.data?.message || '请求失败'
      }
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default request
```
