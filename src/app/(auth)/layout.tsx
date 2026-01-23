import { requireUnauth } from "@/lib/auth-utils";
import React from "react";

const AuthLayout = async (props: { children: React.ReactNode }) => {
  await requireUnauth();
  return <>{props.children}</>;
};

export default AuthLayout;
