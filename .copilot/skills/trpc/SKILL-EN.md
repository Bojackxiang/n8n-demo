# tRPC Usage Guide

A comprehensive guide for using tRPC in this project, covering everything from creating procedures to using them in components.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Creating tRPC Procedures](#creating-trpc-procedures)
3. [Using in Server Components](#using-in-server-components)
4. [Using in Client Components](#using-in-client-components)
5. [Error Handling](#error-handling)
6. [Advanced Usage](#advanced-usage)
7. [Best Practices](#best-practices)

---

## Architecture Overview

### File Structure

```
src/
├── trpc/
│   ├── init.ts              # tRPC initialization and context config
│   ├── client.tsx           # Client-side tRPC Provider
│   ├── server.tsx           # Server-side tRPC calls
│   ├── query-client.ts      # React Query configuration
│   └── routers/
│       └── _app.ts          # Main router file (all procedures defined here)
├── app/
│   └── api/trpc/[trpc]/
│       └── route.ts         # tRPC HTTP handler
```

### Core Concepts

- **Procedure**: The basic unit of tRPC, can be `query` (read) or `mutation` (modify)
- **Router**: Container that organizes multiple procedures
- **Context**: Request context information (e.g., authentication status, database connection)
- **Input Validation**: Type-safe input validation using Zod

---

## Creating tRPC Procedures

### 1. Basic Query (Read Data)

**File: `src/trpc/routers/_app.ts`**

```typescript
import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma";

export const appRouter = createTRPCRouter({
  // Simple query - no authentication required
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  // Read data from Prisma - authentication required
  getWorkflows: protectedProcedure.query(async () => {
    const workflows = await prisma.workflow.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return workflows;
  }),

  // Query with parameters
  getWorkflowById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
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

### 2. Mutation (Modify Data)

```typescript
export const appRouter = createTRPCRouter({
  // Create data
  createWorkflow: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
      })
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

  // Update data
  updateWorkflow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      })
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

  // Delete data
  deleteWorkflow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
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

### 3. Accessing Authentication Context

In `protectedProcedure`, you can access current user information:

```typescript
export const appRouter = createTRPCRouter({
  getMyWorkflows: protectedProcedure.query(async (opts) => {
    const userId = opts.ctx.auth.user.id; // ✅ Get user ID from context
    
    const workflows = await prisma.workflow.findMany({
      where: {
        userId: userId, // Only return current user's data
      },
    });
    return workflows;
  }),
});
```

---

## Using in Server Components

Server Components use `trpc` imported from `@/trpc/server`.

### Basic Usage

```tsx
// src/app/dashboard/page.tsx
import { trpc } from "@/trpc/server";

export default async function DashboardPage() {
  // ✅ Directly await, no useQuery needed
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

### Query with Parameters

```tsx
import { trpc } from "@/trpc/server";

export default async function WorkflowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ Pass parameters
  const workflow = await trpc.getWorkflowById({ id: params.id });

  return (
    <div>
      <h1>{workflow.name}</h1>
      <p>{workflow.description}</p>
    </div>
  );
}
```

### Error Handling

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
    // ✅ Error handling in Server Component
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      redirect("/dashboard");
    }
    throw error; // Let Error Boundary handle it
  }
}
```

### Using Hydration (Recommended)

Server Components can prefetch data and pass it to Client Components:

```tsx
import { trpc, HydrateClient } from "@/trpc/server";

export default async function DashboardPage() {
  // Prefetch data on the server
  void trpc.getWorkflows.prefetch();

  return (
    <HydrateClient>
      {/* Client Component can immediately use cached data */}
      <WorkflowList />
    </HydrateClient>
  );
}
```

---

## Using in Client Components

Client Components use `trpc` imported from `@/trpc/client`.

### 1. Query (Read Data)

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

### 2. Query with Parameters

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

### 3. Mutation (Modify Data)

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CreateWorkflowForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const utils = trpc.useUtils(); // ✅ Get utils for cache management
  
  const createWorkflow = trpc.createWorkflow.useMutation({
    onSuccess: (data) => {
      // ✅ Success handling
      toast.success(`Workflow "${data.name}" created successfully!`);
      
      // ✅ Invalidate query cache, automatically refetch
      utils.getWorkflows.invalidate();
      
      // Reset form
      setName("");
      setDescription("");
    },
    onError: (error) => {
      // ✅ Error handling
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
      <Button 
        type="submit" 
        disabled={createWorkflow.isPending}
      >
        {createWorkflow.isPending ? "Creating..." : "Create Workflow"}
      </Button>
    </form>
  );
}
```

### 4. Complete Update Example

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function UpdateWorkflowButton({ 
  id, 
  currentName 
}: { 
  id: string; 
  currentName: string;
}) {
  const utils = trpc.useUtils();
  
  const updateWorkflow = trpc.updateWorkflow.useMutation({
    onSuccess: (data) => {
      toast.success(`Updated to "${data.name}"`);
      
      // ✅ Method 1: Invalidate entire list
      utils.getWorkflows.invalidate();
      
      // ✅ Method 2: Only update specific query cache (more efficient)
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
    <Button 
      onClick={handleUpdate}
      disabled={updateWorkflow.isPending}
    >
      {updateWorkflow.isPending ? "Updating..." : "Update"}
    </Button>
  );
}
```

### 5. Delete Data

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
    // ✅ Add confirmation dialog
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

## Error Handling

### 1. Throwing Errors on Server

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
        // ✅ Throw standard tRPC error
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
        // ✅ Handle Prisma errors
        if (error.code === 'P2025') {
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

### 2. Client Component Error Handling

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
      // ✅ Show different messages based on error type
      if (error.data?.code === "NOT_FOUND") {
        toast.error("Workflow not found");
      } else if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You don't have permission to delete this workflow");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    },
  });

  return (
    <Button onClick={() => deleteWorkflow.mutate({ id })}>
      Delete
    </Button>
  );
}
```

### 3. Query Error Handling

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useEffect } from "react";

export function WorkflowList() {
  const { data, isLoading, error } = trpc.getWorkflows.useQuery();

  // ✅ Use useEffect to show error toast
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
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
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

### 4. Global Error Handling

Create an error handling hook:

```tsx
// src/hooks/use-trpc-error-handler.ts
import { useEffect } from "react";
import { toast } from "sonner";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

export function useTRPCErrorHandler(
  error: TRPCClientErrorLike<AppRouter> | null
) {
  useEffect(() => {
    if (!error) return;

    // Show different messages based on error code
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

// Usage example
export function WorkflowList() {
  const { data, isLoading, error } = trpc.getWorkflows.useQuery();
  
  useTRPCErrorHandler(error); // ✅ Automatically handle errors

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return <div>{/* Render data */}</div>;
}
```

---

## Advanced Usage

### 1. Optimistic Updates

Update UI immediately before mutation executes for better UX:

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";

export function UpdateWorkflowName({ 
  id, 
  currentName 
}: { 
  id: string; 
  currentName: string;
}) {
  const utils = trpc.useUtils();
  
  const updateWorkflow = trpc.updateWorkflow.useMutation({
    // ✅ Update UI before mutation executes
    onMutate: async (newData) => {
      // Cancel ongoing queries
      await utils.getWorkflows.cancel();
      
      // Save current data for rollback
      const previousWorkflows = utils.getWorkflows.getData();
      
      // Optimistically update UI
      utils.getWorkflows.setData(undefined, (old) =>
        old?.map((workflow) =>
          workflow.id === id
            ? { ...workflow, name: newData.name || workflow.name }
            : workflow
        )
      );
      
      // Return context for rollback
      return { previousWorkflows };
    },
    
    onError: (err, newData, context) => {
      // ✅ Rollback on error
      if (context?.previousWorkflows) {
        utils.getWorkflows.setData(undefined, context.previousWorkflows);
      }
      toast.error("Failed to update workflow");
    },
    
    onSuccess: () => {
      toast.success("Workflow updated");
    },
    
    // ✅ Ensure data sync eventually
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

### 2. Infinite Scroll (Infinite Queries)

```typescript
// First create paginated query in router
export const appRouter = createTRPCRouter({
  getWorkflowsPaginated: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async (opts) => {
      const { limit, cursor } = opts.input;
      
      const workflows = await prisma.workflow.findMany({
        take: limit + 1, // Take one more to check if there's a next page
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
// Use in Client Component
"use client";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";

export function InfiniteWorkflowList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = trpc.getWorkflowsPaginated.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.pages.map((page) =>
        page.workflows.map((workflow) => (
          <div key={workflow.id}>{workflow.name}</div>
        ))
      )}
      
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
```

### 3. Conditional Queries (Enabled/Disabled)

```tsx
"use client";

import { trpc } from "@/trpc/client";

export function WorkflowDetail({ id }: { id: string | null }) {
  // ✅ Only execute query when id exists
  const { data } = trpc.getWorkflowById.useQuery(
    { id: id! },
    {
      enabled: !!id, // Conditionally enable
    }
  );

  if (!id) {
    return <div>Please select a workflow</div>;
  }

  return <div>{data?.name}</div>;
}
```

### 4. Manual Query Trigger

```tsx
"use client";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";

export function ManualQueryExample() {
  const { data, refetch, isRefetching } = trpc.getWorkflows.useQuery(
    undefined,
    {
      enabled: false, // ✅ Don't auto-execute initially
    }
  );

  return (
    <div>
      <Button 
        onClick={() => refetch()}
        disabled={isRefetching}
      >
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

### 5. Using Multiple Mutations

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

## Best Practices

### 1. Type Safety

✅ **Always export AppRouter type**

```typescript
// src/trpc/routers/_app.ts
export const appRouter = createTRPCRouter({
  // ...
});

export type AppRouter = typeof appRouter; // ✅ Must export
```

✅ **Use Zod for input validation**

```typescript
// ❌ Bad
.input(z.string()) // Too broad

// ✅ Good
.input(
  z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().email("Invalid email"),
  })
)
```

### 2. Error Handling

✅ **Throw meaningful errors in procedures**

```typescript
if (!workflow) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: `Workflow with id ${id} not found`,
  });
}
```

✅ **Always handle errors in Client**

```tsx
const mutation = trpc.createWorkflow.useMutation({
  onError: (error) => {
    toast.error(error.message); // ✅ Always provide feedback
  },
});
```

### 3. Cache Management

✅ **Use invalidate instead of refetch**

```tsx
// ❌ Bad
onSuccess: () => {
  refetch(); // Only refreshes current component
}

// ✅ Good
onSuccess: () => {
  utils.getWorkflows.invalidate(); // Refreshes all components using this query
}
```

✅ **Precisely invalidate cache**

```tsx
// Invalidate all related queries
utils.getWorkflows.invalidate();

// Only invalidate query with specific parameters
utils.getWorkflowById.invalidate({ id: "123" });
```

### 4. Performance Optimization

✅ **Use Server Components for initial data loading**

```tsx
// ✅ Prefetch in Server Component
export default async function Page() {
  void trpc.getWorkflows.prefetch();
  
  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

✅ **Use enabled option to avoid unnecessary requests**

```tsx
const { data } = trpc.getWorkflowById.useQuery(
  { id },
  { enabled: !!id } // ✅ Only query when id exists
);
```

### 5. Code Organization

✅ **Group related procedures**

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

✅ **Use sub-routers for large applications**

```typescript
// src/trpc/routers/workflow.ts
export const workflowRouter = createTRPCRouter({
  list: protectedProcedure.query(...),
  byId: protectedProcedure.input(...).query(...),
  create: protectedProcedure.input(...).mutation(...),
});

// src/trpc/routers/_app.ts
export const appRouter = createTRPCRouter({
  workflow: workflowRouter, // ✅ Nested router
  user: userRouter,
});

// Usage: trpc.workflow.list.useQuery()
```

### 6. Testing

✅ **Create caller for testing**

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

## Common Questions

### Q: tRPC errors after Prisma update?

**A:** You must restart dev server after running `npx prisma generate`:

```bash
npx prisma generate
# Restart server
npm run dev
```

### Q: How to use tRPC in middleware?

**A:** tRPC recommends handling authentication at the procedure level, not middleware:

```typescript
// ✅ Use protectedProcedure
export const appRouter = createTRPCRouter({
  protectedRoute: protectedProcedure.query(...),
});
```

### Q: How to handle file uploads?

**A:** tRPC doesn't directly support file uploads, use a separate API route instead:

```typescript
// app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  // Handle file
}
```

### Q: How to debug tRPC errors?

**A:** 

1. Check browser Network tab
2. Check dev server console
3. Use `console.log` in procedures

```typescript
.query(async (opts) => {
  console.log('Input:', opts.input); // ✅ Debug
  const result = await prisma.workflow.findMany();
  console.log('Result:', result); // ✅ Debug
  return result;
})
```

---

## Summary

This guide covers all key aspects of using tRPC in this project:

1. ✅ Creating type-safe procedures (query and mutation)
2. ✅ Properly using tRPC in Server and Client Components
3. ✅ Cache management and auto-refresh with React Query
4. ✅ User-friendly error notifications using Sonner toast
5. ✅ Advanced features like optimistic updates, infinite scroll, etc.
6. ✅ Best practices and performance optimization tips

Remember: **Type Safety + Automatic Cache Management = Better DX!** 🚀
