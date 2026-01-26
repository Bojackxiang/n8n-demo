-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "polarCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "polarSubscriptionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_userId_key" ON "customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_polarCustomerId_key" ON "customer"("polarCustomerId");

-- CreateIndex
CREATE INDEX "customer_userId_idx" ON "customer"("userId");

-- CreateIndex
CREATE INDEX "customer_polarCustomerId_idx" ON "customer"("polarCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_polarSubscriptionId_key" ON "subscription"("polarSubscriptionId");

-- CreateIndex
CREATE INDEX "subscription_customerId_idx" ON "subscription"("customerId");

-- CreateIndex
CREATE INDEX "subscription_polarSubscriptionId_idx" ON "subscription"("polarSubscriptionId");

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
