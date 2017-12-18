-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema kitchen_schema
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema kitchen_schema
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kitchen_schema` DEFAULT CHARACTER SET utf8 ;
USE `kitchen_schema` ;

-- -----------------------------------------------------
-- Table `kitchen_schema`.`measurement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`measurement` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`substance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`substance` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `type` INT NOT NULL,
  `measurement` INT NOT NULL,
  `category` INT NULL,
  `recipe_available` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `substance_type_idx` (`type` ASC),
  INDEX `substance_measurement_idx` (`measurement` ASC),
  INDEX `substance_category_fk_idx` (`category` ASC),
  CONSTRAINT `substance_type_fk`
    FOREIGN KEY (`type`)
    REFERENCES `kitchen_schema`.`type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `substance_measurement_fk`
    FOREIGN KEY (`measurement`)
    REFERENCES `kitchen_schema`.`measurement` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `substance_category_fk`
    FOREIGN KEY (`category`)
    REFERENCES `kitchen_schema`.`category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`stock`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`stock` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` FLOAT NOT NULL,
  `transaction_type` INT NOT NULL DEFAULT 0,
  `substance` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `stock_substance_fk_idx` (`substance` ASC),
  CONSTRAINT `stock_substance_fk`
    FOREIGN KEY (`substance`)
    REFERENCES `kitchen_schema`.`substance` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`composition`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`composition` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `substance` INT NOT NULL,
  `composition` INT NOT NULL COMMENT 'composition represents the parent substance from which the composition will be derived.',
  `proportion` FLOAT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `composition_substance_fk_idx` (`substance` ASC),
  INDEX `composition_composition_fk_idx` (`composition` ASC),
  CONSTRAINT `composition_substance_fk`
    FOREIGN KEY (`substance`)
    REFERENCES `kitchen_schema`.`substance` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `composition_composition_fk`
    FOREIGN KEY (`composition`)
    REFERENCES `kitchen_schema`.`substance` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`menu`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`menu` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `substance` INT NOT NULL,
  `quantity` FLOAT NOT NULL,
  `count` INT NULL DEFAULT 0,
  `parent` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `menu_substance_fk_idx` (`substance` ASC),
  INDEX `menu_menu_fk_idx` (`parent` ASC),
  CONSTRAINT `menu_substance_fk`
    FOREIGN KEY (`substance`)
    REFERENCES `kitchen_schema`.`substance` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `menu_menu_fk`
    FOREIGN KEY (`parent`)
    REFERENCES `kitchen_schema`.`menu` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`station`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`station` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`recipe`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`recipe` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(450) NOT NULL,
  `substance` INT NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `duration` INT NULL,
  `station` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `recipe_substance_fk_idx` (`substance` ASC),
  INDEX `recipe_station_fk_idx` (`station` ASC),
  CONSTRAINT `recipe_substance_fk`
    FOREIGN KEY (`substance`)
    REFERENCES `kitchen_schema`.`substance` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `recipe_station_fk`
    FOREIGN KEY (`station`)
    REFERENCES `kitchen_schema`.`station` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`step`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`step` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `sequence` INT NOT NULL,
  `substance` INT NOT NULL,
  `recipe` INT NOT NULL,
  `next_step` INT NULL,
  `prev_step` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `step_substance_fk_idx` (`substance` ASC),
  INDEX `step_next_fk_idx` (`next_step` ASC),
  INDEX `step_prev_fk_idx` (`prev_step` ASC),
  INDEX `step_recipe_fk_idx` (`recipe` ASC),
  CONSTRAINT `step_substance_fk`
    FOREIGN KEY (`substance`)
    REFERENCES `kitchen_schema`.`substance` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `step_next_fk`
    FOREIGN KEY (`next_step`)
    REFERENCES `kitchen_schema`.`step` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `step_prev_fk`
    FOREIGN KEY (`prev_step`)
    REFERENCES `kitchen_schema`.`step` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `step_recipe_fk`
    FOREIGN KEY (`recipe`)
    REFERENCES `kitchen_schema`.`recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `update` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`job`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`job` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `recipe` INT NOT NULL,
  `status` INT NOT NULL,
  `quantity` FLOAT NULL,
  `completed` FLOAT NULL,
  PRIMARY KEY (`id`),
  INDEX `job_recipe_fk_idx` (`recipe` ASC),
  INDEX `job_status_fk_idx` (`status` ASC),
  CONSTRAINT `job_recipe_fk`
    FOREIGN KEY (`recipe`)
    REFERENCES `kitchen_schema`.`recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `job_status_fk`
    FOREIGN KEY (`status`)
    REFERENCES `kitchen_schema`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`requirement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`requirement` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `substance` INT NOT NULL,
  `date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` FLOAT NOT NULL,
  `status` INT NOT NULL,
  `completed` FLOAT NULL,
  PRIMARY KEY (`id`),
  INDEX `requirement_substance_fk_idx` (`substance` ASC),
  INDEX `requirement_status_fk_idx` (`status` ASC),
  CONSTRAINT `requirement_substance_fk`
    FOREIGN KEY (`substance`)
    REFERENCES `kitchen_schema`.`substance` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `requirement_status_fk`
    FOREIGN KEY (`status`)
    REFERENCES `kitchen_schema`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`net_stock`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`net_stock` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `substance` INT NOT NULL,
  `net_quantity` FLOAT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `substance_UNIQUE` (`substance` ASC),
  CONSTRAINT `net_stock_substance_fk`
    FOREIGN KEY (`substance`)
    REFERENCES `kitchen_schema`.`substance` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kitchen_schema`.`recipe_sub_tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kitchen_schema`.`recipe_sub_tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NULL,
  `updated` DATETIME NULL,
  `main_recipe_task` INT NOT NULL,
  `sequence` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `sub_task_recipe_fk_idx` (`main_recipe_task` ASC),
  CONSTRAINT `sub_task_recipe_fk`
    FOREIGN KEY (`main_recipe_task`)
    REFERENCES `kitchen_schema`.`recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
