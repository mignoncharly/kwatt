CREATE TABLE "bootstrap_fixture" (
    "key" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bootstrap_fixture_pkey" PRIMARY KEY ("key")
);
