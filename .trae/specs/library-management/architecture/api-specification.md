# API 详细规范

## 文档信息

| 项目 | 内容 |
|------|------|
| 版本 | v1.0.0 |
| 更新日期 | 2025-03-27 |
| 作者 | Trae |

---

## 一、API 设计原则

### 1.1 URL 规范

- 基础路径：`/api/v1`
- 资源命名：使用名词复数形式，如 `/books`、`/members`
- 路径参数：使用小写，如 `/books/:id`
- 查询参数：使用驼峰命名，如 `?pageSize=20`

### 1.2 HTTP 方法

| 方法 | 用途 | 示例 |
|------|------|------|
| GET | 查询资源 | `GET /books` 获取书籍列表 |
| POST | 创建资源 | `POST /books` 创建书籍 |
| PATCH | 部分更新 | `PATCH /books/:id` 更新书籍 |
| PUT | 完整更新 | `PUT /books/:id` 替换书籍 |
| DELETE | 删除资源 | `DELETE /books/:id` 删除书籍 |

### 1.3 响应格式

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": "2025-03-27T10:00:00Z"
}
```

#### 分页响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    }
  },
  "timestamp": "2025-03-27T10:00:00Z"
}
```

#### 错误响应

```json
{
  "code": 400,
  "message": "参数验证失败",
  "errors": [
    {
      "field": "isbn",
      "message": "ISBN 格式不正确"
    }
  ],
  "timestamp": "2025-03-27T10:00:00Z"
}
```

### 1.4 状态码定义

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | 成功 | 请求成功 |
| 201 | 创建成功 | POST 创建资源成功 |
| 204 | 无内容 | DELETE 成功 |
| 400 | 参数错误 | 请求参数验证失败 |
| 401 | 未认证 | 未登录或 Token 过期 |
| 403 | 禁止访问 | 无权限访问 |
| 404 | 未找到 | 资源不存在 |
| 409 | 冲突 | 资源冲突（如重复） |
| 422 | 业务错误 | 业务逻辑校验失败 |
| 500 | 服务器错误 | 内部错误 |

---

## 二、认证模块 API

### 2.1 用户登录

**POST** `/api/v1/auth/login`

**请求体**：
```json
{
  "username": "admin",
  "password": "123456"
}
```

**成功响应** (200)：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

**错误响应** (401)：
```json
{
  "code": 401,
  "message": "用户名或密码错误"
}
```

### 2.2 用户注册

**POST** `/api/v1/auth/register`

**请求体**：
```json
{
  "username": "newuser",
  "password": "password123",
  "name": "张三",
  "phone": "13800138001",
  "idCard": "110101199001011234",
  "email": "zhangsan@example.com"
}
```

**成功响应** (201)：
```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "id": 2,
    "username": "newuser",
    "role": "user"
  }
}
```

### 2.3 获取用户信息

**GET** `/api/v1/auth/profile`

**请求头**：
```
Authorization: Bearer <token>
```

**成功响应** (200)：
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "member": {
      "id": 1,
      "memberNo": "M20240001",
      "name": "管理员",
      "phone": "13800138000"
    }
  }
}
```

---

## 三、书籍模块 API

### 3.1 获取书籍列表

**GET** `/api/v1/books`

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |
| keyword | string | 否 | 搜索关键词 |
| category | string | 否 | 分类筛选 |
| status | string | 否 | 状态筛选 |

**请求示例**：
```
GET /api/v1/books?page=1&pageSize=20&keyword=JavaScript&category=编程
```

**成功响应** (200)：
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "isbn": "9787115428028",
        "title": "JavaScript高级程序设计",
        "author": "Nicholas C. Zakas",
        "category": "编程",
        "quantity": 10,
        "available": 8,
        "status": "available"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    }
  }
}
```

### 3.2 创建书籍

**POST** `/api/v1/books`

**请求体**：
```json
{
  "isbn": "9787115428028",
  "title": "JavaScript高级程序设计",
  "author": "Nicholas C. Zakas",
  "publisher": "人民邮电出版社",
  "publishDate": "2020-01-01",
  "category": "编程",
  "description": "JavaScript经典著作",
  "quantity": 10,
  "location": "A区-01-01"
}
```

**成功响应** (201)：
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 1,
    "isbn": "9787115428028",
    "title": "JavaScript高级程序设计"
  }
}
```

**错误响应** (409)：
```json
{
  "code": 409,
  "message": "ISBN 已存在"
}
```

### 3.3 更新书籍

**PATCH** `/api/v1/books/:id`

**请求体**：
```json
{
  "title": "JavaScript高级程序设计（第4版）",
  "quantity": 15,
  "available": 13
}
```

**成功响应** (200)：
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "title": "JavaScript高级程序设计（第4版）",
    "quantity": 15,
    "available": 13
  }
}
```

### 3.4 删除书籍

**DELETE** `/api/v1/books/:id`

**成功响应** (204)：
无内容

**错误响应** (422)：
```json
{
  "code": 422,
  "message": "该书籍有未归还的借阅记录，无法删除"
}
```

---

## 四、会员模块 API

### 4.1 获取会员列表

**GET** `/api/v1/members`

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| pageSize | int | 否 | 每页数量 |
| keyword | string | 否 | 搜索关键词（姓名/手机/会员号） |
| status | string | 否 | 状态筛选 |

**成功响应** (200)：
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "memberNo": "M20240001",
        "name": "张三",
        "phone": "13800138001",
        "currentBorrow": 2,
        "borrowLimit": 5,
        "status": 1
      }
    ],
    "pagination": { ... }
  }
}
```

### 4.2 创建会员

**POST** `/api/v1/members`

**请求体**：
```json
{
  "username": "zhangsan",
  "password": "password123",
  "name": "张三",
  "phone": "13800138001",
  "idCard": "110101199001011234",
  "email": "zhangsan@example.com",
  "gender": "male",
  "birthDate": "1990-01-01",
  "borrowLimit": 5
}
```

**成功响应** (201)：
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 2,
    "memberNo": "M20240002",
    "name": "张三"
  }
}
```

---

## 五、借阅模块 API

### 5.1 创建借阅

**POST** `/api/v1/borrow`

**请求体**：
```json
{
  "memberId": 1,
  "bookId": 1
}
```

**成功响应** (201)：
```json
{
  "code": 201,
  "message": "借阅成功",
  "data": {
    "id": 1,
    "memberId": 1,
    "bookId": 1,
    "borrowDate": "2025-03-27",
    "dueDate": "2025-04-10",
    "status": "borrowed"
  }
}
```

**错误响应** (422)：
```json
{
  "code": 422,
  "message": "借阅失败",
  "errors": [
    {
      "field": "memberId",
      "message": "会员借阅数量已达上限"
    }
  ]
}
```

### 5.2 归还书籍

**PATCH** `/api/v1/borrow/:id/return`

**成功响应** (200)：
```json
{
  "code": 200,
  "message": "归还成功",
  "data": {
    "id": 1,
    "returnDate": "2025-04-05",
    "status": "returned",
    "overdue": {
      "days": 0,
      "fine": 0
    }
  }
}
```

### 5.3 续借书籍

**PATCH** `/api/v1/borrow/:id/renew`

**成功响应** (200)：
```json
{
  "code": 200,
  "message": "续借成功",
  "data": {
    "id": 1,
    "dueDate": "2025-04-17",
    "renewCount": 1
  }
}
```

**错误响应** (422)：
```json
{
  "code": 422,
  "message": "续借失败",
  "errors": [
    {
      "field": "renewCount",
      "message": "已达最大续借次数"
    }
  ]
}
```

---

## 六、预约模块 API

### 6.1 创建预约

**POST** `/api/v1/reservations`

**请求体**：
```json
{
  "memberId": 1,
  "bookId": 1
}
```

**成功响应** (201)：
```json
{
  "code": 201,
  "message": "预约成功",
  "data": {
    "id": 1,
    "memberId": 1,
    "bookId": 1,
    "reserveDate": "2025-03-27T10:00:00Z",
    "queuePosition": 3,
    "status": "pending"
  }
}
```

### 6.2 取消预约

**DELETE** `/api/v1/reservations/:id`

**成功响应** (204)：
无内容

---

## 七、费用模块 API

### 7.1 获取费用列表

**GET** `/api/v1/fines`

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| memberId | int | 否 | 会员 ID |
| status | string | 否 | 状态筛选 |

### 7.2 缴纳费用

**PATCH** `/api/v1/fines/:id/pay`

**请求体**：
```json
{
  "amount": 5.00
}
```

**成功响应** (200)：
```json
{
  "code": 200,
  "message": "支付成功",
  "data": {
    "id": 1,
    "paidAmount": 5.00,
    "status": "paid",
    "paidAt": "2025-03-27T10:00:00Z"
  }
}
```

---

## 八、报表模块 API

### 8.1 借阅报表

**GET** `/api/v1/reports/borrows`

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| startDate | date | 是 | 开始日期 |
| endDate | date | 是 | 结束日期 |

**成功响应** (200)：
```json
{
  "code": 200,
  "data": {
    "totalBorrows": 1000,
    "totalReturns": 950,
    "totalOverdues": 50,
    "dailyStats": [
      {
        "date": "2025-03-01",
        "borrows": 30,
        "returns": 25
      }
    ]
  }
}
```

---

## 九、数据分析模块 API

### 9.1 热门书籍推荐

**GET** `/api/v1/analytics/popular-books`

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 返回数量，默认 10 |

### 9.2 借阅趋势分析

**GET** `/api/v1/analytics/borrowing-trends`

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| period | string | 否 | 统计周期：day/week/month，默认 month |
| startDate | date | 否 | 开始日期 |
| endDate | date | 否 | 结束日期 |

### 9.3 书籍排行榜

**GET** `/api/v1/analytics/book-rankings`

**成功响应** (200)：
```json
{
  "code": 200,
  "data": {
    "borrowRank": [...],
    "newBookRank": [...],
    "reserveRank": [...]
  }
}
```
