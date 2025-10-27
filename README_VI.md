# MockLab - Công cụ Generate Mock Data

MockLab là công cụ mạnh mẽ để tạo dữ liệu mock từ schema, hoàn hảo cho frontend developer khi backend chưa có API.

## ✨ Tính năng

### 1. **Schema Builder** - Xây dựng Schema

-   ✅ Hỗ trợ nhiều kiểu dữ liệu:

    -   `string`, `number`, `boolean` - Các kiểu cơ bản
    -   `email`, `url`, `phone` - Dữ liệu có định dạng
    -   `date`, `datetime`, `uuid` - Dữ liệu đặc biệt
    -   `name`, `address`, `company` - Dữ liệu thực tế
    -   `text` - Văn bản dài
    -   `enum` - Giá trị cố định
    -   `array` - Mảng dữ liệu

-   ✅ Cấu hình chi tiết cho từng field:
    -   Required/Optional
    -   Min/Max cho số
    -   Enum values
    -   Array length và item type

### 2. **Multiple Generator Types** - Nhiều kiểu Generate

#### 🎲 Random

Generate dữ liệu hoàn toàn ngẫu nhiên

#### ✨ Realistic (Khuyến nghị)

Generate dữ liệu giống thật, phù hợp cho demo và testing

-   Email: `john123@example.com`
-   Phone: `+1 (555) 123-4567`
-   Name: `Alice Johnson`
-   Address: `123 Main St, New York`

#### 📊 Sequential

Generate dữ liệu tuần tự, dễ tracking

-   Email: `user0@example.com`, `user1@example.com`
-   ID: `0`, `1`, `2`...

#### 📝 Template (Coming soon)

Generate từ template tùy chỉnh

### 3. **Quick Templates** - Template có sẵn

Chọn nhanh từ các template phổ biến:

-   👤 **User Profile** - Hồ sơ người dùng
-   🛒 **E-commerce Product** - Sản phẩm thương mại điện tử
-   📝 **Blog Post** - Bài viết blog
-   📅 **Event/Calendar** - Sự kiện
-   🏢 **Company/Organization** - Công ty/Tổ chức

### 4. **Data Preview & Export** - Xem trước và Export

#### Xem dưới nhiều định dạng:

-   **Table View** - Dạng bảng, dễ đọc
-   **JSON** - Raw JSON
-   **TypeScript** - Có interface định nghĩa
-   **JavaScript** - ES6 export

#### Export options:

-   📋 Copy to clipboard
-   💾 Download file (.json, .ts, .js)

## 🚀 Cách sử dụng

### Bước 1: Tạo Schema

#### Cách 1: Thêm field thủ công

1. Nhập tên field (vd: `username`)
2. Chọn kiểu dữ liệu (vd: `string`)
3. Cấu hình thêm (nếu cần):
    - Number: min/max
    - Enum: các giá trị
    - Array: item type và length
4. Click "Add Field"

#### Cách 2: Dùng template có sẵn

1. Scroll xuống "Quick Templates"
2. Chọn template phù hợp
3. Click "Use Template"
4. Chỉnh sửa thêm nếu cần

### Bước 2: Chọn Generator Type

-   **Realistic**: Cho demo, presentation
-   **Sequential**: Cho testing, debugging
-   **Random**: Cho stress testing

### Bước 3: Chọn số lượng record

-   Từ 1-1000 records
-   Default: 10 records

### Bước 4: Generate!

Click nút "Generate Data" 🪄

### Bước 5: Export

1. Chọn format (JSON/TypeScript/JavaScript)
2. Copy hoặc Download
3. Dùng trong project!

## 💡 Use Cases

### 1. Frontend Development

```typescript
// Generate mock users
// Export as TypeScript
interface MockData {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

export const mockUsers: MockData[] = [...];
```

### 2. API Mocking

```javascript
// Dùng với MSW (Mock Service Worker)
import { mockUsers } from './mock-data';

rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json(mockUsers));
});
```

### 3. Testing

```javascript
// Generate test data
const testProducts = generateMockData(productSchema, {
    type: 'sequential',
    count: 50,
});
```

### 4. Documentation & Demo

```javascript
// Realistic data cho demo
const demoUsers = generateMockData(userSchema, {
    type: 'realistic',
    count: 20,
});
```

## 🎯 Ví dụ thực tế

### Example 1: User List

```typescript
// Schema
[
  { name: 'id', type: 'uuid' },
  { name: 'username', type: 'string' },
  { name: 'email', type: 'email' },
  { name: 'isActive', type: 'boolean' }
]

// Generated (Realistic, count: 3)
[
  {
    "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "isActive": true
  },
  // ... more
]
```

### Example 2: E-commerce Products

```typescript
// Schema
[
    { name: 'id', type: 'uuid' },
    { name: 'name', type: 'string' },
    { name: 'price', type: 'number', min: 10, max: 1000 },
    { name: 'category', type: 'enum', enum: ['Electronics', 'Clothing', 'Books'] },
    { name: 'tags', type: 'array', arrayOf: 'string', length: 3 },
];

// Generated data sẵn sàng để dùng!
```

## 🔧 Tips & Tricks

### Tip 1: Realistic Names

Dùng type `name` thay vì `string` để có tên thật:

-   ❌ `"abc123"` (string)
-   ✅ `"John Smith"` (name)

### Tip 2: Sequential cho Testing

Dùng Sequential khi cần track data:

```javascript
// Sequential
user0@example.com
user1@example.com
user2@example.com
// Dễ dàng identify!
```

### Tip 3: Enum cho Status

Dùng enum thay vì string cho status fields:

```typescript
status: 'active' | 'pending' | 'inactive';
// Instead of any random string
```

### Tip 4: Array cho Tags

```typescript
tags: ['tag1', 'tag2', 'tag3'];
// Realistic array data!
```

## 🛠️ Tech Stack

-   **React 19** - UI Framework
-   **TypeScript** - Type Safety
-   **shadcn/ui** - UI Components
-   **Zustand** - State Management
-   **Vite** - Build Tool
-   **Tailwind CSS** - Styling

## 📦 Built with shadcn/ui Components

-   Button, Input, Select
-   Checkbox, Label
-   Tabs, ScrollArea
-   Resizable Panels
-   Empty State
-   ...and more!

## 🎨 Features Coming Soon

-   [ ] Custom templates save/load
-   [ ] Import schema from JSON
-   [ ] More data types (image URL, color, etc.)
-   [ ] Faker.js integration
-   [ ] Relationship between entities
-   [ ] API endpoint preview
-   [ ] Dark/Light theme toggle

## 💻 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📝 License

MIT

---

**Built with ❤️ for Frontend Developers**

Không còn phải chờ backend nữa! Generate mock data ngay bây giờ! 🚀
