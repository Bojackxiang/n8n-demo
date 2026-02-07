import z from "zod";

export type HttpRequestFormValues = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
};

export const httpRequestSchema = z.object({
  endpoint: z.string().url({ message: "Invalid URL format" }),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  body: z.string().optional(),
});
