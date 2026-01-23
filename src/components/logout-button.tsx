"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {},
        });
        router.push("/");
        router.refresh();
      }}
    >
      Logout
    </Button>
  );
}
