import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  date,
  pgEnum,
  jsonb,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("worker_role", [
  "ASHA",
  "ANM",
  "MO",
  "SUPERVISOR",
  "ADMIN",
]);
export const facilityTypeEnum = pgEnum("facility_type", [
  "SC",
  "PHC",
  "CHC",
  "DH",
]);
export const riskEnum = pgEnum("risk_level", ["NORMAL", "HIGH", "CRITICAL"]);
export const immStatusEnum = pgEnum("imm_status", [
  "UPCOMING",
  "DUE",
  "GIVEN",
  "MISSED",
]);
export const nutritionEnum = pgEnum("nutrition_class", ["NORMAL", "MAM", "SAM"]);
export const alertTypeEnum = pgEnum("alert_type", [
  "SOS",
  "ANOMALY",
  "REFERRAL_DUE",
]);
export const alertStatusEnum = pgEnum("alert_status", [
  "OPEN",
  "ACK",
  "DISPATCHED",
  "CLOSED",
]);
export const referralStatusEnum = pgEnum("referral_status", [
  "PENDING",
  "ACK",
  "ACCEPTED",
  "COMPLETED",
]);
export const schemeCodeEnum = pgEnum("scheme_code", [
  "PMMVY",
  "JSY",
  "JSSK",
  "KASP",
]);
export const schemeStatusEnum = pgEnum("scheme_status", [
  "PENDING",
  "ELIGIBLE",
  "DISBURSED",
]);
export const milestoneStatusEnum = pgEnum("milestone_status", [
  "PENDING",
  "ACHIEVED",
  "DELAYED",
]);
export const syncStatusEnum = pgEnum("sync_status", [
  "PENDING",
  "SYNCED",
  "FAILED",
]);

// Tables
export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: facilityTypeEnum("type").notNull(),
  block: text("block").notNull(),
  district: text("district").notNull(),
  lat: real("lat"),
  lng: real("lng"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fieldWorkers = pgTable("field_workers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 15 }),
  role: roleEnum("role").notNull(),
  facilityId: integer("facility_id").references(() => facilities.id, {
    onDelete: "set null",
  }),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const families = pgTable("families", {
  id: serial("id").primaryKey(),
  headOfFamily: text("head_of_family").notNull(),
  village: text("village").notNull(),
  block: text("block").notNull(),
  district: text("district").notNull(),
  bplScore: integer("bpl_score").notNull(),
  schemePriorityTier: integer("scheme_priority_tier").notNull(),
  ashaId: integer("asha_id").references(() => fieldWorkers.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mothers = pgTable("mothers", {
  id: serial("id").primaryKey(),
  familyId: integer("family_id")
    .references(() => families.id, { onDelete: "cascade" })
    .notNull(),
  beneficiaryId12: varchar("beneficiary_id_12", { length: 12 })
    .notNull()
    .unique(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  lmp: date("lmp"),
  edd: date("edd"),
  pregnancyNo: integer("pregnancy_no").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  familyId: integer("family_id")
    .references(() => families.id, { onDelete: "cascade" })
    .notNull(),
  motherId: integer("mother_id").references(() => mothers.id, {
    onDelete: "set null",
  }),
  beneficiaryId12: varchar("beneficiary_id_12", { length: 12 })
    .notNull()
    .unique(),
  name: text("name"),
  dob: date("dob").notNull(),
  birthWeightG: integer("birth_weight_g"),
  sex: text("sex"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ancVisits = pgTable("anc_visits", {
  id: serial("id").primaryKey(),
  motherId: integer("mother_id")
    .references(() => mothers.id, { onDelete: "cascade" })
    .notNull(),
  visitNo: integer("visit_no").notNull(),
  visitDate: timestamp("visit_date").defaultNow().notNull(),
  bpSystolic: integer("bp_systolic"),
  bpDiastolic: integer("bp_diastolic"),
  hbValue: real("hb_value"),
  weightKg: real("weight_kg"),
  fetalHr: integer("fetal_hr"),
  complaints: text("complaints"),
  riskLevel: riskEnum("risk_level").notNull().default("NORMAL"),
  riskTriggers: jsonb("risk_triggers").$type<string[]>().default([]),
  recordedByWorkerId: integer("recorded_by_worker_id").references(
    () => fieldWorkers.id,
  ),
  kbUsed: integer("kb_used").notNull().default(0),
});

export const pncVisits = pgTable("pnc_visits", {
  id: serial("id").primaryKey(),
  motherId: integer("mother_id")
    .references(() => mothers.id, { onDelete: "cascade" })
    .notNull(),
  visitDay: integer("visit_day").notNull(),
  visitDate: timestamp("visit_date").defaultNow().notNull(),
  bpSystolic: integer("bp_systolic"),
  bpDiastolic: integer("bp_diastolic"),
  hbValue: real("hb_value"),
  complications: text("complications"),
  recordedByWorkerId: integer("recorded_by_worker_id").references(
    () => fieldWorkers.id,
  ),
  kbUsed: integer("kb_used").notNull().default(0),
});

export const immunizations = pgTable("immunizations", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  vaccineCode: text("vaccine_code").notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  givenDate: date("given_date"),
  givenAtFacilityId: integer("given_at_facility_id").references(
    () => facilities.id,
  ),
  status: immStatusEnum("status").notNull().default("UPCOMING"),
});

export const growthRecords = pgTable("growth_records", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  weightKg: real("weight_kg"),
  heightCm: real("height_cm"),
  muacCm: real("muac_cm"),
  weightZ: real("weight_z"),
  heightZ: real("height_z"),
  weightForHeightZ: real("weight_for_height_z"),
  classification: nutritionEnum("classification").notNull().default("NORMAL"),
  recordedByWorkerId: integer("recorded_by_worker_id").references(
    () => fieldWorkers.id,
  ),
  kbUsed: integer("kb_used").notNull().default(0),
});

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  milestoneCode: text("milestone_code").notNull(),
  expectedAgeMonths: integer("expected_age_months").notNull(),
  achievedDate: date("achieved_date"),
  status: milestoneStatusEnum("status").notNull().default("PENDING"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: alertTypeEnum("type").notNull(),
  status: alertStatusEnum("status").notNull().default("OPEN"),
  subjectType: text("subject_type").notNull(),
  subjectId: integer("subject_id").notNull(),
  lat: real("lat"),
  lng: real("lng"),
  raisedAt: timestamp("raised_at").defaultNow().notNull(),
  raisedByWorkerId: integer("raised_by_worker_id").references(
    () => fieldWorkers.id,
  ),
  channels: jsonb("channels").$type<
    Array<{ to: string; status: string; at?: string }>
  >().default([]),
  note: text("note"),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  subjectType: text("subject_type").notNull(),
  subjectId: integer("subject_id").notNull(),
  fromFacilityId: integer("from_facility_id").references(() => facilities.id),
  toFacilityId: integer("to_facility_id").references(() => facilities.id),
  tierFrom: facilityTypeEnum("tier_from"),
  tierTo: facilityTypeEnum("tier_to"),
  reason: text("reason"),
  status: referralStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
});

export const schemeEnrollments = pgTable("scheme_enrollments", {
  id: serial("id").primaryKey(),
  beneficiaryType: text("beneficiary_type").notNull(),
  beneficiaryId: integer("beneficiary_id").notNull(),
  schemeCode: schemeCodeEnum("scheme_code").notNull(),
  installmentNo: integer("installment_no").notNull().default(1),
  expectedDate: date("expected_date"),
  disbursedDate: date("disbursed_date"),
  amount: integer("amount"),
  status: schemeStatusEnum("status").notNull().default("PENDING"),
});

export const iecContent = pgTable("iec_content", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  language: text("language").notNull().default("ml"),
  titleEn: text("title_en").notNull(),
  titleMl: text("title_ml").notNull(),
  summary: text("summary"),
  assetUrl: text("asset_url"),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  beneficiaryType: text("beneficiary_type").notNull(),
  beneficiaryId: integer("beneficiary_id").notNull(),
  type: text("type").notNull(),
  dueDate: date("due_date").notNull(),
  channel: text("channel").notNull().default("APP"),
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
});

export const smsLog = pgTable("sms_log", {
  id: serial("id").primaryKey(),
  beneficiaryType: text("beneficiary_type").notNull(),
  beneficiaryId: integer("beneficiary_id").notNull(),
  reminderId: integer("reminder_id").references(() => reminders.id),
  language: text("language").notNull().default("ml"),
  bodyText: text("body_text").notNull(),
  senderId: text("sender_id").notNull().default("KLNHM-MCH"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const syncEvents = pgTable("sync_events", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").references(() => fieldWorkers.id),
  action: text("action").notNull(),
  payloadKb: integer("payload_kb").notNull(),
  queuedAt: timestamp("queued_at").defaultNow().notNull(),
  syncedAt: timestamp("synced_at"),
  status: syncStatusEnum("status").notNull().default("PENDING"),
});

// Relations (only the ones we'll actually use)
export const familiesRelations = relations(families, ({ many, one }) => ({
  mothers: many(mothers),
  children: many(children),
  asha: one(fieldWorkers, {
    fields: [families.ashaId],
    references: [fieldWorkers.id],
  }),
}));

export const mothersRelations = relations(mothers, ({ one, many }) => ({
  family: one(families, {
    fields: [mothers.familyId],
    references: [families.id],
  }),
  ancVisits: many(ancVisits),
  pncVisits: many(pncVisits),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  family: one(families, {
    fields: [children.familyId],
    references: [families.id],
  }),
  mother: one(mothers, {
    fields: [children.motherId],
    references: [mothers.id],
  }),
  growthRecords: many(growthRecords),
  immunizations: many(immunizations),
  milestones: many(milestones),
}));
