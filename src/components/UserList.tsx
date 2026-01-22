"use client";

import { trpc } from "@/trpc/client";

export function UserList() {
  // 使用 tRPC React Query hook
  const { data: users, isLoading, error } = trpc.getUsers.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Users</h2>
      <ul className="space-y-2">
        {users?.map((user) => (
          <li key={user.id} className="border p-4 rounded">
            <p className="font-semibold">{user.name || "No name"}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
