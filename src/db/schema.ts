import { pgTable, serial, varchar, text, date, timestamp, boolean, integer, doublePrecision, jsonb } from "drizzle-orm/pg-core";

// ==================== USERS ====================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("employee"), // admin | employee
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==================== PATIENTS ====================
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  cpf: varchar("cpf", { length: 14 }),
  rg: varchar("rg", { length: 20 }),
  birthDate: date("birth_date"),
  gender: varchar("gender", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  email: varchar("email", { length: 200 }),
  address: varchar("address", { length: 300 }),
  neighborhood: varchar("neighborhood", { length: 100 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  postalCode: varchar("postal_code", { length: 10 }),
  emergencyContact: varchar("emergency_contact", { length: 200 }),
  emergencyPhone: varchar("emergency_phone", { length: 20 }),
  objective: varchar("objective", { length: 300 }),
  observations: text("observations"),
  photoUrl: varchar("photo_url", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==================== EVALUATIONS ====================
export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  userId: integer("user_id").notNull(),
  evaluationDate: date("evaluation_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==================== BODY MEASUREMENTS ====================
export const bodyMeasurements = pgTable("body_measurements", {
  id: serial("id").primaryKey(),
  evaluationId: integer("evaluation_id").notNull().unique(),
  height: doublePrecision("height"),
  weight: doublePrecision("weight"),
  waist: doublePrecision("waist"),
  hip: doublePrecision("hip"),
  chest: doublePrecision("chest"),
  neck: doublePrecision("neck"),
  leftArm: doublePrecision("left_arm"),
  rightArm: doublePrecision("right_arm"),
  leftForearm: doublePrecision("left_forearm"),
  rightForearm: doublePrecision("right_forearm"),
  leftThigh: doublePrecision("left_thigh"),
  rightThigh: doublePrecision("right_thigh"),
  leftCalf: doublePrecision("left_calf"),
  rightCalf: doublePrecision("right_calf"),
  shoulders: doublePrecision("shoulders"),
  abdomen: doublePrecision("abdomen"),
});

// ==================== BIOIMPEDANCE ====================
export const bioimpedance = pgTable("bioimpedance", {
  id: serial("id").primaryKey(),
  evaluationId: integer("evaluation_id").notNull().unique(),
  bodyFatPct: doublePrecision("body_fat_pct"),
  bodyFatKg: doublePrecision("body_fat_kg"),
  leanMass: doublePrecision("lean_mass"),
  muscleMass: doublePrecision("muscle_mass"),
  musclePct: doublePrecision("muscle_pct"),
  waterPct: doublePrecision("water_pct"),
  waterKg: doublePrecision("water_kg"),
  boneMass: doublePrecision("bone_mass"),
  proteinPct: doublePrecision("protein_pct"),
  subcutaneousFat: doublePrecision("subcutaneous_fat"),
  visceralFat: doublePrecision("visceral_fat"),
  metabolicAge: doublePrecision("metabolic_age"),
  basalMetabolism: doublePrecision("basal_metabolism"),
  bmi: doublePrecision("bmi"),
  bodyScore: doublePrecision("body_score"),
});

// ==================== CALCULATED RESULTS ====================
export const calculatedResults = pgTable("calculated_results", {
  id: serial("id").primaryKey(),
  evaluationId: integer("evaluation_id").notNull().unique(),
  bmi: doublePrecision("bmi"),
  bmiClassification: varchar("bmi_classification", { length: 50 }),
  idealWeight: doublePrecision("ideal_weight"),
  leanBodyMass: doublePrecision("lean_body_mass"),
  fatMass: doublePrecision("fat_mass"),
  bodyFatPctCalc: doublePrecision("body_fat_pct_calc"),
  waistHipRatio: doublePrecision("waist_hip_ratio"),
  bodyDensity: doublePrecision("body_density"),
  bodyAdiposityIndex: doublePrecision("body_adiposity_index"),
  bmr: doublePrecision("bmr"),
  dailyCalorieNeed: doublePrecision("daily_calorie_need"),
  tee: doublePrecision("tee"),
  healthyWeightMin: doublePrecision("healthy_weight_min"),
  healthyWeightMax: doublePrecision("healthy_weight_max"),
  metabolicAgeClass: varchar("metabolic_age_class", { length: 50 }),
  visceralFatClass: varchar("visceral_fat_class", { length: 50 }),
  muscleClass: varchar("muscle_class", { length: 50 }),
  waterClass: varchar("water_class", { length: 50 }),
  proteinClass: varchar("protein_class", { length: 50 }),
  interpretation: text("interpretation"),
});

// ==================== SETTINGS ====================
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
