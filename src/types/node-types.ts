/**
 * Node Type Enumeration
 *
 * This enum is kept in sync with the Prisma schema enum NodeType.
 * It's defined separately to avoid importing Prisma Client in client-side code.
 *
 * @see prisma/schema.prisma - enum NodeType
 */
export enum NodeType {
  INITIAL = "INITIAL", // 初始节点
  TRIGGER = "TRIGGER", // 触发器
  MANUAL_TRIGGER = "MANUAL_TRIGGER", // 手动触发器
  HTTP_REQUEST = "HTTP_REQUEST", // HTTP 请求
  ACTION = "ACTION", // 动作
  CONDITION = "CONDITION", // 条件
  WEBHOOK = "WEBHOOK", // Webhook
  LOOP = "LOOP", // 循环
  MERGE = "MERGE", // 合并
}
