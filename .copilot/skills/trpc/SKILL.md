# tRPC 使用指南

这是一份完整的 tRPC 在本项目中的使用指南，包含从创建 procedure 到在组件中使用的全流程。

## 目录

1. [架构概览](#架构概览)
2. [创建 tRPC Procedure](#创建-trpc-procedure)
3. [在 Server Component 中使用](#在-server-component-中使用)
4. [在 Client Component 中使用](#在-client-component-中使用)
5. [错误处理](#错误处理)
6. [高级用法](#高级用法)
7. [最佳实践](#最佳实践)

---

## 架构概览

### 文件结构

```
src/
├── trpc/
│   ├── init.ts              # tRPC 初始化和 context 配置
│   ├── client.tsx           # Client 端 tRPC Provider
│   ├── server.tsx           # Server 端 tRPC 调用
│   ├── query-client.ts      # React Query 配置
│   └── routers/
│       └── _app.ts          # 主路由文件（定义所有 procedures）
├── app/
│   └── api/trpc/[trpc]/
│       └── route.ts         # tRPC HTTP handler
```

### 核心概念

- **Procedure**: tRPC 的基本单元，可以是 `query`（读取）或 `mutation`（修改）
- **Router**: 组织多个 procedures 的容器
- **Context**: 每个请求的上下文信息（如认证状态、数据库连接）
- **Input Validation**: 使用 Zod 进行类型安全的输入验证

---

## 创建 tRPC Procedure

### 1. 基础 Query（读取数据）

**文件：`src/trpc/routers/_app.ts`**

```typescript
import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma";

export const appRouter = createTRPCRouter({
  // 简单的 query - 无需认证
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  // 从 Prisma 读取数据 - 需要认证
  getWorkflows: protectedProcedure.query(async () => {
    const workflows = await prisma.workflow.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return workflows;
  }),

  // 带参数的 query
  getWorkflowById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async (opts) => {
      const workflow = await prisma.workflow.findUnique({
        where: {
          id: opts.input.id,
        },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return workflow;
    }),
});
```

### 2. Mutation（修改数据）

```typescript
export const appRouter = createTRPCRouter({
  // 创建数据
  createWorkflow: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      const workflow = await prisma.workflow.create({
        data: {
          name: opts.input.name,
          description: opts.input.description,
        },
      });
      return workflow;
    }),

  // 更新数据
  updateWorkflow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      const workflow = await prisma.workflow.update({
        where: { id: opts.input.id },
        data: {
          name: opts.input.name,
          description: opts.input.description,
        },
      });
      return workflow;
    }),

  // 删除数据
  deleteWorkflow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async (opts) => {
      await prisma.workflow.delete({
        where: { id: opts.input.id },
      });
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
```

### 3. 访问认证上下文

在 `protectedProcedure` 中可以访问当前用户信息：

```typescript
export const appRouter = createTRPCRouter({
  getMyWorkflows: protectedProcedure.query(async (opts) => {
    const userId = opts.ctx.auth.user.id; // ✅ 从 context 获取用户 ID

    const workflows = await prisma.workflow.findMany({
      where: {
        userId: userId, // 只返回当前用户的数据
      },
    });
    return workflows;
  }),
});
```

---

## 在 Server Component 中使用

Server Components 使用 `trpc` 从 `@/trpc/server` 导入。

### 基础用法

```tsx
// src/app/dashboard/page.tsx
import { trpc } from "@/trpc/server";

export default async function DashboardPage() {
  // ✅ 直接 await，无需 useQuery
  const workflows = await trpc.getWorkflows();

  return (
    <div>
      <h1>Workflows</h1>
      {workflows.map((workflow) => (
        <div key={workflow.id}>
          <h2>{workflow.name}</h2>
          <p>{workflow.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 带参数的查询

```tsx
import { trpc } from "@/trpc/server";

export default async function WorkflowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ 传递参数
  const workflow = await trpc.getWorkflowById({ id: params.id });

  return (
    <div>
      <h1>{workflow.name}</h1>
      <p>{workflow.description}</p>
    </div>
  );
}
```

### 错误处理

```tsx
import { trpc } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function WorkflowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const workflow = await trpc.getWorkflowById({ id: params.id });

    return (
      <div>
        <h1>{workflow.name}</h1>
      </div>
    );
  } catch (error) {
    // ✅ Server Component 中的错误处理
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      redirect("/dashboard");
    }
    throw error; // 让 Error Boundary 处理
  }
}
```

### 使用 Hydration（推荐）

Server Component 可以预取数据并传给 Client Component：

```tsx
import { trpc, HydrateClient } from "@/trpc/server";

export default async function DashboardPage() {
  // 在服务端预取数据
  void trpc.getWorkflows.prefetch();

  return (
    <HydrateClient>
      {/* Client Component 可以立即使用缓存的数据 */}
      <WorkflowList />
    </HydrateClient>
  );
}
```

---

## 在 Client Component 中使用

Client Components 使用 `trpc` 从 `@/trpc/client` 导入。

### 1. Query（读取数据）

```tsx
"use client";

import { trpc } from "@/trpc/client";

export function WorkflowList() {
  const { data, isLoading, error } = trpc.getWorkflows.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data?.map((workflow) => (
        <div key={workflow.id}>
          <h2>{workflow.name}</h2>
        </div>
      ))}
    </div>
  );
}
```

### 2. 带参数的 Query

```tsx
"use client";

import { trpc } from "@/trpc/client";

export function WorkflowDetail({ id }: { id: string }) {
  const { data, isLoading } = trpc.getWorkflowById.useQuery({
    id: id,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.description}</p>
    </div>
  );
}
```

### 3. Mutation（修改数据）

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CreateWorkflowForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const utils = trpc.useUtils(); // ✅ 获取 utils 用于缓存管理

  const createWorkflow = trpc.createWorkflow.useMutation({
    onSuccess: (data) => {
      // ✅ 成功处理
      toast.success(`Workflow "${data.name}" created successfully!`);

      // ✅ 使查询缓存失效，自动重新获取
      utils.getWorkflows.invalidate();

      // 重置表单
      setName("");
      setDescription("");
    },
    onError: (error) => {
      // ✅ 错误处理
      toast.error(error.message || "Failed to create workflow");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createWorkflow.mutate({
      name,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workflow name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
      />
      <Button type="submit" disabled={createWorkflow.isPending}>
        {createWorkflow.isPending ? "Creating..." : "Create Workflow"}
      </Button>
    </form>
  );
}
```

### 4. 更新数据的完整示例

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function UpdateWorkflowButton({
  id,
  currentName,
}: {
  id: string;
  currentName: string;
}) {
  const utils = trpc.useUtils();

  const updateWorkflow = trpc.updateWorkflow.useMutation({
    onSuccess: (data) => {
      toast.success(`Updated to "${data.name}"`);

      // ✅ 方式1：使整个列表失效
      utils.getWorkflows.invalidate();

      // ✅ 方式2：只更新特定查询的缓存（更高效）
      utils.getWorkflowById.invalidate({ id });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpdate = () => {
    updateWorkflow.mutate({
      id,
      name: `${currentName} (Updated)`,
    });
  };

  return (
    <Button onClick={handleUpdate} disabled={updateWorkflow.isPending}>
      {updateWorkflow.isPending ? "Updating..." : "Update"}
    </Button>
  );
}
```

### 5. 删除数据

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteWorkflowButton({ id }: { id: string }) {
  const utils = trpc.useUtils();

  const deleteWorkflow = trpc.deleteWorkflow.useMutation({
    onSuccess: () => {
      toast.success("Workflow deleted");
      utils.getWorkflows.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    // ✅ 添加确认对话框
    if (confirm("Are you sure you want to delete this workflow?")) {
      deleteWorkflow.mutate({ id });
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={deleteWorkflow.isPending}
    >
      {deleteWorkflow.isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
```

---

## 错误处理

### 1. Server 端抛出错误

```typescript
import { TRPCError } from "@trpc/server";

export const appRouter = createTRPCRouter({
  getWorkflowById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: opts.input.id },
      });

      if (!workflow) {
        // ✅ 抛出标准 tRPC 错误
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return workflow;
    }),

  deleteWorkflow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      try {
        await prisma.workflow.delete({
          where: { id: opts.input.id },
        });
        return { success: true };
      } catch (error) {
        // ✅ 处理 Prisma 错误
        if (error.code === "P2025") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workflow not found",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete workflow",
        });
      }
    }),
});
```

### 2. Client Component 错误处理

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function WorkflowActions({ id }: { id: string }) {
  const utils = trpc.useUtils();

  const deleteWorkflow = trpc.deleteWorkflow.useMutation({
    onSuccess: () => {
      toast.success("Workflow deleted successfully");
      utils.getWorkflows.invalidate();
    },
    onError: (error) => {
      // ✅ 根据错误类型显示不同消息
      if (error.data?.code === "NOT_FOUND") {
        toast.error("Workflow not found");
      } else if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You don't have permission to delete this workflow");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    },
  });

  return <Button onClick={() => deleteWorkflow.mutate({ id })}>Delete</Button>;
}
```

### 3. Query 错误处理

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useEffect } from "react";

export function WorkflowList() {
  const { data, isLoading, error } = trpc.getWorkflows.useQuery();

  // ✅ 使用 useEffect 显示错误 toast
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load workflows");
    }
  }, [error]);

  if (isLoading) {
    return <div>Loading workflows...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Failed to load workflows</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {data?.map((workflow) => (
        <div key={workflow.id}>{workflow.name}</div>
      ))}
    </div>
  );
}
```

### 4. 全局错误处理

创建一个错误处理 hook：

```tsx
// src/hooks/use-trpc-error-handler.ts
import { useEffect } from "react";
import { toast } from "sonner";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

export function useTRPCErrorHandler(
  error: TRPCClientErrorLike<AppRouter> | null,
) {
  useEffect(() => {
    if (!error) return;

    // 根据错误代码显示不同的消息
    switch (error.data?.code) {
      case "UNAUTHORIZED":
        toast.error("Please sign in to continue");
        break;
      case "FORBIDDEN":
        toast.error("You don't have permission to do this");
        break;
      case "NOT_FOUND":
        toast.error("Resource not found");
        break;
      case "BAD_REQUEST":
        toast.error(error.message || "Invalid request");
        break;
      default:
        toast.error(error.message || "Something went wrong");
    }
  }, [error]);
}

// 使用示例
export function WorkflowList() {
  const { data, isLoading, error } = trpc.getWorkflows.useQuery();

  useTRPCErrorHandler(error); // ✅ 自动处理错误

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return <div>{/* 渲染数据 */}</div>;
}
```

---

## 高级用法

### 1. 乐观更新（Optimistic Updates）

在 mutation 执行前立即更新 UI，提升用户体验：

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";

export function UpdateWorkflowName({
  id,
  currentName,
}: {
  id: string;
  currentName: string;
}) {
  const utils = trpc.useUtils();

  const updateWorkflow = trpc.updateWorkflow.useMutation({
    // ✅ 在 mutation 执行前更新 UI
    onMutate: async (newData) => {
      // 取消正在进行的查询
      await utils.getWorkflows.cancel();

      // 保存当前数据以便回滚
      const previousWorkflows = utils.getWorkflows.getData();

      // 乐观更新 UI
      utils.getWorkflows.setData(undefined, (old) =>
        old?.map((workflow) =>
          workflow.id === id
            ? { ...workflow, name: newData.name || workflow.name }
            : workflow,
        ),
      );

      // 返回上下文以便回滚
      return { previousWorkflows };
    },

    onError: (err, newData, context) => {
      // ✅ 发生错误时回滚
      if (context?.previousWorkflows) {
        utils.getWorkflows.setData(undefined, context.previousWorkflows);
      }
      toast.error("Failed to update workflow");
    },

    onSuccess: () => {
      toast.success("Workflow updated");
    },

    // ✅ 最终确保数据同步
    onSettled: () => {
      utils.getWorkflows.invalidate();
    },
  });

  return (
    <button onClick={() => updateWorkflow.mutate({ id, name: "New Name" })}>
      Update
    </button>
  );
}
```

### 2. 无限滚动（Infinite Queries）

```typescript
// 先在 router 中创建分页 query
export const appRouter = createTRPCRouter({
  getWorkflowsPaginated: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      const { limit, cursor } = opts.input;

      const workflows = await prisma.workflow.findMany({
        take: limit + 1, // 多取一个用于判断是否有下一页
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined = undefined;
      if (workflows.length > limit) {
        const nextItem = workflows.pop();
        nextCursor = nextItem?.id;
      }

      return {
        workflows,
        nextCursor,
      };
    }),
});
```

```tsx
// Client Component 中使用
"use client";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";

export function InfiniteWorkflowList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    trpc.getWorkflowsPaginated.useInfiniteQuery(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.pages.map((page) =>
        page.workflows.map((workflow) => (
          <div key={workflow.id}>{workflow.name}</div>
        )),
      )}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
```

### 3. 条件查询（Enabled/Disabled）

```tsx
"use client";

import { trpc } from "@/trpc/client";

export function WorkflowDetail({ id }: { id: string | null }) {
  // ✅ 只有当 id 存在时才执行查询
  const { data } = trpc.getWorkflowById.useQuery(
    { id: id! },
    {
      enabled: !!id, // 条件启用
    },
  );

  if (!id) {
    return <div>Please select a workflow</div>;
  }

  return <div>{data?.name}</div>;
}
```

### 4. 手动触发查询

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";

export function ManualQueryExample() {
  const { data, refetch, isRefetching } = trpc.getWorkflows.useQuery(
    undefined,
    {
      enabled: false, // ✅ 初始不自动执行
    },
  );

  return (
    <div>
      <Button onClick={() => refetch()} disabled={isRefetching}>
        {isRefetching ? "Loading..." : "Fetch Workflows"}
      </Button>

      {data && (
        <div>
          {data.map((w) => (
            <div key={w.id}>{w.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5. 使用多个 Mutation

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function WorkflowActions({ id }: { id: string }) {
  const utils = trpc.useUtils();

  const updateWorkflow = trpc.updateWorkflow.useMutation({
    onSuccess: () => {
      toast.success("Updated!");
      utils.getWorkflows.invalidate();
    },
  });

  const deleteWorkflow = trpc.deleteWorkflow.useMutation({
    onSuccess: () => {
      toast.success("Deleted!");
      utils.getWorkflows.invalidate();
    },
  });

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => updateWorkflow.mutate({ id, name: "Updated" })}
        disabled={updateWorkflow.isPending}
      >
        Update
      </Button>

      <Button
        variant="destructive"
        onClick={() => deleteWorkflow.mutate({ id })}
        disabled={deleteWorkflow.isPending}
      >
        Delete
      </Button>
    </div>
  );
}
```

---

## 最佳实践

### 1. 类型安全

✅ **始终导出 AppRouter 类型**

```typescript
// src/trpc/routers/_app.ts
export const appRouter = createTRPCRouter({
  // ...
});

export type AppRouter = typeof appRouter; // ✅ 必须导出
```

✅ **使用 Zod 进行输入验证**

```typescript
// ❌ 不好
.input(z.string()) // 太宽泛

// ✅ 好
.input(
  z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().email("Invalid email"),
  })
)
```

### 2. 错误处理

✅ **在 procedure 中抛出有意义的错误**

```typescript
if (!workflow) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: `Workflow with id ${id} not found`,
  });
}
```

✅ **在 Client 中始终处理错误**

```tsx
const mutation = trpc.createWorkflow.useMutation({
  onError: (error) => {
    toast.error(error.message); // ✅ 总是提供反馈
  },
});
```

### 3. 缓存管理

✅ **使用 invalidate 而不是 refetch**

```tsx
// ❌ 不好
onSuccess: () => {
  refetch(); // 只刷新当前组件
};

// ✅ 好
onSuccess: () => {
  utils.getWorkflows.invalidate(); // 刷新所有使用该查询的组件
};
```

✅ **精确失效缓存**

```tsx
// 失效所有相关查询
utils.getWorkflows.invalidate();

// 只失效特定参数的查询
utils.getWorkflowById.invalidate({ id: "123" });
```

### 4. 性能优化

✅ **使用 Server Component 进行初始数据加载**

```tsx
// ✅ 在 Server Component 中预取
export default async function Page() {
  void trpc.getWorkflows.prefetch();

  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

✅ **使用 enabled 选项避免不必要的请求**

```tsx
const { data } = trpc.getWorkflowById.useQuery(
  { id },
  { enabled: !!id }, // ✅ 只在有 id 时查询
);
```

### 5. 组织代码

✅ **将相关的 procedures 分组**

```typescript
// src/trpc/routers/_app.ts
export const appRouter = createTRPCRouter({
  // Workflow procedures
  getWorkflows: protectedProcedure.query(...),
  getWorkflowById: protectedProcedure.input(...).query(...),
  createWorkflow: protectedProcedure.input(...).mutation(...),
  updateWorkflow: protectedProcedure.input(...).mutation(...),
  deleteWorkflow: protectedProcedure.input(...).mutation(...),

  // User procedures
  getUsers: protectedProcedure.query(...),
  // ...
});
```

✅ **对于大型应用，使用子路由**

```typescript
// src/trpc/routers/workflow.ts
export const workflowRouter = createTRPCRouter({
  list: protectedProcedure.query(...),
  byId: protectedProcedure.input(...).query(...),
  create: protectedProcedure.input(...).mutation(...),
});

// src/trpc/routers/_app.ts
export const appRouter = createTRPCRouter({
  workflow: workflowRouter, // ✅ 嵌套路由
  user: userRouter,
});

// 使用: trpc.workflow.list.useQuery()
```

### 6. 测试

✅ **创建测试用的 caller**

```typescript
// tests/trpc.test.ts
import { createCallerFactory } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

const createCaller = createCallerFactory(appRouter);

test("should create workflow", async () => {
  const caller = createCaller({
    // mock context
  });

  const result = await caller.createWorkflow({
    name: "Test Workflow",
  });

  expect(result.name).toBe("Test Workflow");
});
```

---

## 常见问题

### Q: Prisma 更新后 tRPC 报错？

**A:** 运行 `npx prisma generate` 后必须重启开发服务器：

```bash
npx prisma generate
# 重启服务器
npm run dev
```

### Q: 如何在 middleware 中使用 tRPC？

**A:** tRPC 建议在 procedure 层面处理认证，而不是 middleware：

```typescript
// ✅ 使用 protectedProcedure
export const appRouter = createTRPCRouter({
  protectedRoute: protectedProcedure.query(...),
});
```

### Q: 如何处理文件上传？

**A:** tRPC 不直接支持文件上传，建议使用单独的 API route：

```typescript
// app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  // 处理文件
}
```

### Q: 如何调试 tRPC 错误？

**A:**

1. 检查浏览器 Network 标签页
2. 查看开发服务器控制台
3. 使用 `console.log` 在 procedure 中打印

```typescript
.query(async (opts) => {
  console.log('Input:', opts.input); // ✅ 调试
  const result = await prisma.workflow.findMany();
  console.log('Result:', result); // ✅ 调试
  return result;
})
```

---

## 总结

这份指南涵盖了在本项目中使用 tRPC 的所有关键方面：

1. ✅ 创建类型安全的 procedures（query 和 mutation）
2. ✅ 在 Server 和 Client Components 中正确使用 tRPC
3. ✅ 使用 React Query 进行缓存管理和自动刷新
4. ✅ 使用 Sonner toast 进行用户友好的错误提示
5. ✅ 高级功能如乐观更新、无限滚动等
6. ✅ 最佳实践和性能优化建议

记住：**类型安全 + 自动缓存管理 = 更好的开发体验！** 🚀
