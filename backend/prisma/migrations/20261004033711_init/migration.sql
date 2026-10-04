-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Kitchen', 'Dispatch', 'Driver');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('Partner', 'Enterprise', 'Standard');

-- CreateEnum
CREATE TYPE "DropStatus" AS ENUM ('Kitchen_ready', 'Dispatch_ready', 'Out_for_delivery', 'Delivered');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Draft', 'Placed', 'Confirmed', 'Cancelled', 'Rejected', 'Delivered');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('Unpaid', 'Paid');

-- CreateEnum
CREATE TYPE "DishTemperature" AS ENUM ('Hot', 'Cold');

-- CreateEnum
CREATE TYPE "DishDietary" AS ENUM ('Vegan', 'Jain', 'Vegetarian', 'Non_vegetarian');

-- CreateEnum
CREATE TYPE "CombinationStatus" AS ENUM ('Pending', 'Started', 'Done');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" "UserRole" NOT NULL,
    "is_available" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "type" "CompanyType" NOT NULL,
    "address" VARCHAR NOT NULL,
    "billing_email" VARCHAR NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drop" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "driver_id" UUID NOT NULL,
    "drop_date" DATE NOT NULL,
    "drop_time" TIME NOT NULL,
    "status" "DropStatus" NOT NULL,
    "delivered_at" TIMESTAMP(3),

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "delivery_date" DATE NOT NULL,
    "delivery_time" TIME NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyCategory" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "is_visible" BOOLEAN NOT NULL,

    CONSTRAINT "CompanyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "image" VARCHAR NOT NULL,
    "temperature" "DishTemperature" NOT NULL,
    "dietary" "DishDietary" NOT NULL,
    "partner_price" DECIMAL(12,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyDish" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "dish_id" UUID NOT NULL,
    "is_visible" BOOLEAN NOT NULL,

    CONSTRAINT "CompanyDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DropOrder" (
    "id" UUID NOT NULL,
    "drop_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,

    CONSTRAINT "DropOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceOrder" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,

    CONSTRAINT "InvoiceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderLine" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "dish_id" UUID NOT NULL,
    "dish_name" VARCHAR NOT NULL,
    "dish_price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "OrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionGroup" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "is_required" BOOLEAN NOT NULL,

    CONSTRAINT "OptionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" UUID NOT NULL,
    "option_group_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "partner_price" DECIMAL(12,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Combination" (
    "id" UUID NOT NULL,
    "order_line_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "CombinationStatus" NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "Combination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CombinationOption" (
    "id" UUID NOT NULL,
    "combination_id" UUID NOT NULL,
    "option_id" UUID NOT NULL,
    "option_name" VARCHAR NOT NULL,
    "option_price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "CombinationOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyCategory_company_id_category_id_key" ON "CompanyCategory"("company_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyDish_company_id_dish_id_key" ON "CompanyDish"("company_id", "dish_id");

-- CreateIndex
CREATE UNIQUE INDEX "DropOrder_drop_id_order_id_key" ON "DropOrder"("drop_id", "order_id");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceOrder_invoice_id_order_id_key" ON "InvoiceOrder"("invoice_id", "order_id");

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCategory" ADD CONSTRAINT "CompanyCategory_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCategory" ADD CONSTRAINT "CompanyCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDish" ADD CONSTRAINT "CompanyDish_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDish" ADD CONSTRAINT "CompanyDish_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropOrder" ADD CONSTRAINT "DropOrder_drop_id_fkey" FOREIGN KEY ("drop_id") REFERENCES "Drop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropOrder" ADD CONSTRAINT "DropOrder_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceOrder" ADD CONSTRAINT "InvoiceOrder_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceOrder" ADD CONSTRAINT "InvoiceOrder_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_option_group_id_fkey" FOREIGN KEY ("option_group_id") REFERENCES "OptionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combination" ADD CONSTRAINT "Combination_order_line_id_fkey" FOREIGN KEY ("order_line_id") REFERENCES "OrderLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinationOption" ADD CONSTRAINT "CombinationOption_combination_id_fkey" FOREIGN KEY ("combination_id") REFERENCES "Combination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinationOption" ADD CONSTRAINT "CombinationOption_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
