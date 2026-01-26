"use client";

import React from "react";
import { useSuspenseWorkflow } from "../hooks/use-workflow";

const WorkflowList = () => {
  const workflows = useSuspenseWorkflow();
  console.log("data: ", workflows);
  return <div>workflow component.</div>;
};

export default WorkflowList;
