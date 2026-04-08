-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "path" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "errorCode" TEXT NOT NULL,
    "session_id" INTEGER,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
