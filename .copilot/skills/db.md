# Database Management Skill

这个 skill 用于管理 Prisma 数据库迁移和生成。

## 触发条件

当用户说以下任何一种表达时，自动执行数据库更新流程：

- "更新数据库"
- "同步数据库"
- "migrate database"
- "更新 schema"
- "推送数据库"
- "运行迁移"

## 执行步骤

### 1. 询问迁移名称

首先询问用户这次迁移的描述性名称（例如：add_user_table, update_post_schema）

### 2. 运行数据库迁移

```bash
pnpm run db:dev:migrate
```

注意：将 `__define_your_name__` 替换为用户提供的迁移名称

### 3. 生成 Prisma Client

迁移成功后，自动运行：

```bash
pnpm run db:dev:generate
```

### 4. 确认完成

告知用户：

- 迁移已完成
- Prisma Client 已重新生成
- 可以在代码中使用更新后的类型

## 示例对话

**用户**: "我更新了 schema，需要更新数据库"

**助手**:

1. 询问："这次迁移的名称是什么？（例如：add_user_table）"
2. 用户回答后，运行 `pnpm run db:dev:migrate` （替换迁移名称）
3. 自动运行 `pnpm run db:dev:generate`
4. 确认："✅ 数据库迁移完成，Prisma Client 已生成！"

## 错误处理

### 如果执行过程中出现任何错误，必须：

1. **立即停止后续步骤** - 不要继续执行下一个命令
2. **显示完整错误信息** - 向用户展示终端输出的错误
3. **分析错误原因** - 解释错误的可能原因
4. **提供解决方案** - 给出具体的修复步骤

### 常见错误及解决方案

#### 错误 1: 命令未找到

```
Command 'prisma' not found
```

**原因**: Prisma 未安装或版本不兼容
**解决方案**:

- 检查 Node.js 版本（需要 20.19+, 22.12+, 或 24.0+）
- 运行 `pnpm install` 重新安装依赖
- 检查 package.json 中是否有 prisma 依赖

#### 错误 2: 数据库连接失败

```
Can't reach database server
Error: P1001
```

**原因**: DATABASE_URL 未配置或数据库服务未启动
**解决方案**:

- 检查 .env 文件是否存在且包含 DATABASE_URL
- 确认数据库服务是否运行（PostgreSQL/MySQL/SQLite）
- 验证连接字符串格式是否正确

#### 错误 3: Schema 语法错误

```
Error validating: ...
```

**原因**: prisma/schema.prisma 文件有语法错误
**解决方案**:

- 检查 schema 文件的语法
- 确认所有 model、field、relation 定义正确
- 使用 VS Code Prisma 插件查看错误提示

#### 错误 4: 迁移冲突

```
Migration ... failed
```

**原因**: 数据库状态与迁移历史不一致
**解决方案**:

- 运行 `pnpm prisma migrate status` 查看状态
- 如果是开发环境，可以运行 `pnpm prisma migrate reset`（会清空数据）
- 如果是生产环境，需要手动解决冲突

#### 错误 5: Node.js 版本不兼容

```
Prisma only supports Node.js versions 20.19+, 22.12+, 24.0+
```

**原因**: Node.js 版本过低
**解决方案**:

- 使用 nvm 升级：`nvm install 22 && nvm use 22`
- 或降级 Prisma 到 v6：`pnpm add -D prisma@6 && pnpm add @prisma/client@6`

## 相关命令参考

- `pnpm run db:studio` - 打开 Prisma Studio 查看数据
- `pnpm run db:dev:migrate` - 运行数据库迁移
- `pnpm run db:dev:generate` - 生成 Prisma Client
- `pnpm prisma migrate status` - 查看迁移状态
- `pnpm prisma migrate reset` - 重置数据库（开发环境）
