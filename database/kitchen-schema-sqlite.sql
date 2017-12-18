-- Creator:       MySQL Workbench 6.3.6/ExportSQLite Plugin 0.1.0
-- Author:        310191460
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2017-12-17 15:26
-- Created:       2017-12-08 00:15
PRAGMA foreign_keys = OFF;

-- Schema: kitchen_schema
ATTACH "kitchen_schema.sdb" AS "kitchen_schema";
BEGIN;
CREATE TABLE "kitchen_schema"."category"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "kitchen_schema"."status"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "update" DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "kitchen_schema"."station"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "kitchen_schema"."measurement"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "kitchen_schema"."type"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "kitchen_schema"."substance"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "type" INTEGER NOT NULL,
  "measurement" INTEGER NOT NULL,
  "category" INTEGER,
  "recipe_available" BOOLEAN DEFAULT 0,
  CONSTRAINT "substance_type_fk"
    FOREIGN KEY("type")
    REFERENCES "type"("id"),
  CONSTRAINT "substance_measurement_fk"
    FOREIGN KEY("measurement")
    REFERENCES "measurement"("id"),
  CONSTRAINT "substance_category_fk"
    FOREIGN KEY("category")
    REFERENCES "category"("id")
);
CREATE INDEX "kitchen_schema"."substance.substance_type_idx" ON "substance" ("type");
CREATE INDEX "kitchen_schema"."substance.substance_measurement_idx" ON "substance" ("measurement");
CREATE INDEX "kitchen_schema"."substance.substance_category_fk_idx" ON "substance" ("category");
CREATE TABLE "kitchen_schema"."menu"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "substance" INTEGER NOT NULL,
  "quantity" FLOAT NOT NULL,
  "count" INTEGER DEFAULT 0,
  "parent" INTEGER,
  CONSTRAINT "menu_substance_fk"
    FOREIGN KEY("substance")
    REFERENCES "substance"("id"),
  CONSTRAINT "menu_menu_fk"
    FOREIGN KEY("parent")
    REFERENCES "menu"("id")
);
CREATE INDEX "kitchen_schema"."menu.menu_substance_fk_idx" ON "menu" ("substance");
CREATE INDEX "kitchen_schema"."menu.menu_menu_fk_idx" ON "menu" ("parent");
CREATE TABLE "kitchen_schema"."recipe"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(450) NOT NULL,
  "substance" INTEGER,
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "duration" INTEGER,
  "station" INTEGER,
  CONSTRAINT "recipe_substance_fk"
    FOREIGN KEY("substance")
    REFERENCES "substance"("id"),
  CONSTRAINT "recipe_station_fk"
    FOREIGN KEY("station")
    REFERENCES "station"("id")
);
CREATE INDEX "kitchen_schema"."recipe.recipe_substance_fk_idx" ON "recipe" ("substance");
CREATE INDEX "kitchen_schema"."recipe.recipe_station_fk_idx" ON "recipe" ("station");
CREATE TABLE "kitchen_schema"."job"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "date" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "recipe" INTEGER NOT NULL,
  "status" INTEGER NOT NULL,
  "quantity" FLOAT,
  "completed" FLOAT,
  CONSTRAINT "job_recipe_fk"
    FOREIGN KEY("recipe")
    REFERENCES "recipe"("id"),
  CONSTRAINT "job_status_fk"
    FOREIGN KEY("status")
    REFERENCES "status"("id")
);
CREATE INDEX "kitchen_schema"."job.job_recipe_fk_idx" ON "job" ("recipe");
CREATE INDEX "kitchen_schema"."job.job_status_fk_idx" ON "job" ("status");
CREATE TABLE "kitchen_schema"."recipe_sub_tasks"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(45),
  "updated" DATETIME,
  "main_recipe_task" INTEGER NOT NULL,
  "sequence" INTEGER NOT NULL,
  CONSTRAINT "sub_task_recipe_fk"
    FOREIGN KEY("main_recipe_task")
    REFERENCES "recipe"("id")
);
CREATE INDEX "kitchen_schema"."recipe_sub_tasks.sub_task_recipe_fk_idx" ON "recipe_sub_tasks" ("main_recipe_task");
CREATE TABLE "kitchen_schema"."net_stock"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "substance" INTEGER NOT NULL,
  "net_quantity" FLOAT NOT NULL,
  CONSTRAINT "substance_UNIQUE"
    UNIQUE("substance"),
  CONSTRAINT "net_stock_substance_fk"
    FOREIGN KEY("substance")
    REFERENCES "substance"("id")
);
CREATE TABLE "kitchen_schema"."step"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "sequence" INTEGER NOT NULL,
  "substance" INTEGER NOT NULL,
  "recipe" INTEGER NOT NULL,
  "next_step" INTEGER,
  "prev_step" INTEGER,
  CONSTRAINT "step_substance_fk"
    FOREIGN KEY("substance")
    REFERENCES "substance"("id"),
  CONSTRAINT "step_next_fk"
    FOREIGN KEY("next_step")
    REFERENCES "step"("id"),
  CONSTRAINT "step_prev_fk"
    FOREIGN KEY("prev_step")
    REFERENCES "step"("id"),
  CONSTRAINT "step_recipe_fk"
    FOREIGN KEY("recipe")
    REFERENCES "recipe"("id")
);
CREATE INDEX "kitchen_schema"."step.step_substance_fk_idx" ON "step" ("substance");
CREATE INDEX "kitchen_schema"."step.step_next_fk_idx" ON "step" ("next_step");
CREATE INDEX "kitchen_schema"."step.step_prev_fk_idx" ON "step" ("prev_step");
CREATE INDEX "kitchen_schema"."step.step_recipe_fk_idx" ON "step" ("recipe");
CREATE TABLE "kitchen_schema"."composition"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "substance" INTEGER NOT NULL,
  "composition" INTEGER NOT NULL,-- composition represents the parent substance from which the composition will be derived.
  "proportion" FLOAT NOT NULL,
  CONSTRAINT "composition_substance_fk"
    FOREIGN KEY("substance")
    REFERENCES "substance"("id"),
  CONSTRAINT "composition_composition_fk"
    FOREIGN KEY("composition")
    REFERENCES "substance"("id")
);
CREATE INDEX "kitchen_schema"."composition.composition_substance_fk_idx" ON "composition" ("substance");
CREATE INDEX "kitchen_schema"."composition.composition_composition_fk_idx" ON "composition" ("composition");
CREATE TABLE "kitchen_schema"."stock"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" VARCHAR(45) NOT NULL,
  "description" VARCHAR(100),
  "date" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "quantity" FLOAT NOT NULL,
  "transaction_type" INTEGER NOT NULL DEFAULT 0,
  "substance" INTEGER NOT NULL,
  CONSTRAINT "stock_substance_fk"
    FOREIGN KEY("substance")
    REFERENCES "substance"("id")
);
CREATE INDEX "kitchen_schema"."stock.stock_substance_fk_idx" ON "stock" ("substance");
CREATE TABLE "kitchen_schema"."requirement"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "substance" INTEGER NOT NULL,
  "date" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "updated" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "quantity" FLOAT NOT NULL,
  "status" INTEGER NOT NULL,
  "completed" FLOAT,
  CONSTRAINT "requirement_substance_fk"
    FOREIGN KEY("substance")
    REFERENCES "substance"("id"),
  CONSTRAINT "requirement_status_fk"
    FOREIGN KEY("status")
    REFERENCES "status"("id")
);
CREATE INDEX "kitchen_schema"."requirement.requirement_substance_fk_idx" ON "requirement" ("substance");
CREATE INDEX "kitchen_schema"."requirement.requirement_status_fk_idx" ON "requirement" ("status");
COMMIT;
