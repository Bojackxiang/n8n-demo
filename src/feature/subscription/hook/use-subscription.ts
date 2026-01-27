import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await authClient.customer.state();

      return {
        ...data,
        // mock pro membership
        activeSubscriptions: [{ id: "sub_1234567890", status: "active" }],
      };
    },
  });
};

export const useIsProActive = () => {
  const { data: subscriptionData } = useSubscription();

  return (
    subscriptionData?.activeSubscriptions?.some(
      (sub: any) => sub.status === "active",
    ) ?? false
  );
};
