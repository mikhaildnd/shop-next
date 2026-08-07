-- CreateTable
CREATE TABLE "rate_limits" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rate_limits_action_identifier_key" ON "rate_limits"("action", "identifier");
