CREATE TYPE "public"."alert_status" AS ENUM('OPEN', 'ACK', 'DISPATCHED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."alert_type" AS ENUM('SOS', 'ANOMALY', 'REFERRAL_DUE');--> statement-breakpoint
CREATE TYPE "public"."facility_type" AS ENUM('SC', 'PHC', 'CHC', 'DH');--> statement-breakpoint
CREATE TYPE "public"."imm_status" AS ENUM('UPCOMING', 'DUE', 'GIVEN', 'MISSED');--> statement-breakpoint
CREATE TYPE "public"."milestone_status" AS ENUM('PENDING', 'ACHIEVED', 'DELAYED');--> statement-breakpoint
CREATE TYPE "public"."nutrition_class" AS ENUM('NORMAL', 'MAM', 'SAM');--> statement-breakpoint
CREATE TYPE "public"."referral_status" AS ENUM('PENDING', 'ACK', 'ACCEPTED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."risk_level" AS ENUM('NORMAL', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."worker_role" AS ENUM('ASHA', 'ANM', 'MO', 'SUPERVISOR', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."scheme_code" AS ENUM('PMMVY', 'JSY', 'JSSK', 'KASP');--> statement-breakpoint
CREATE TYPE "public"."scheme_status" AS ENUM('PENDING', 'ELIGIBLE', 'DISBURSED');--> statement-breakpoint
CREATE TYPE "public"."sync_status" AS ENUM('PENDING', 'SYNCED', 'FAILED');--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "alert_type" NOT NULL,
	"status" "alert_status" DEFAULT 'OPEN' NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" integer NOT NULL,
	"lat" real,
	"lng" real,
	"raised_at" timestamp DEFAULT now() NOT NULL,
	"raised_by_worker_id" integer,
	"channels" jsonb DEFAULT '[]'::jsonb,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "anc_visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"mother_id" integer NOT NULL,
	"visit_no" integer NOT NULL,
	"visit_date" timestamp DEFAULT now() NOT NULL,
	"bp_systolic" integer,
	"bp_diastolic" integer,
	"hb_value" real,
	"weight_kg" real,
	"fetal_hr" integer,
	"complaints" text,
	"risk_level" "risk_level" DEFAULT 'NORMAL' NOT NULL,
	"risk_triggers" jsonb DEFAULT '[]'::jsonb,
	"recorded_by_worker_id" integer,
	"kb_used" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "children" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" integer NOT NULL,
	"mother_id" integer,
	"beneficiary_id_12" varchar(12) NOT NULL,
	"name" text,
	"dob" date NOT NULL,
	"birth_weight_g" integer,
	"sex" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "children_beneficiary_id_12_unique" UNIQUE("beneficiary_id_12")
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "facility_type" NOT NULL,
	"block" text NOT NULL,
	"district" text NOT NULL,
	"lat" real,
	"lng" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" serial PRIMARY KEY NOT NULL,
	"head_of_family" text NOT NULL,
	"village" text NOT NULL,
	"block" text NOT NULL,
	"district" text NOT NULL,
	"bpl_score" integer NOT NULL,
	"scheme_priority_tier" integer NOT NULL,
	"asha_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "field_workers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(15),
	"role" "worker_role" NOT NULL,
	"facility_id" integer,
	"photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "growth_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_id" integer NOT NULL,
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	"weight_kg" real,
	"height_cm" real,
	"muac_cm" real,
	"weight_z" real,
	"height_z" real,
	"weight_for_height_z" real,
	"classification" "nutrition_class" DEFAULT 'NORMAL' NOT NULL,
	"recorded_by_worker_id" integer,
	"kb_used" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iec_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"language" text DEFAULT 'ml' NOT NULL,
	"title_en" text NOT NULL,
	"title_ml" text NOT NULL,
	"summary" text,
	"asset_url" text
);
--> statement-breakpoint
CREATE TABLE "immunizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_id" integer NOT NULL,
	"vaccine_code" text NOT NULL,
	"scheduled_date" date NOT NULL,
	"given_date" date,
	"given_at_facility_id" integer,
	"status" "imm_status" DEFAULT 'UPCOMING' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_id" integer NOT NULL,
	"milestone_code" text NOT NULL,
	"expected_age_months" integer NOT NULL,
	"achieved_date" date,
	"status" "milestone_status" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mothers" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" integer NOT NULL,
	"beneficiary_id_12" varchar(12) NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"lmp" date,
	"edd" date,
	"pregnancy_no" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mothers_beneficiary_id_12_unique" UNIQUE("beneficiary_id_12")
);
--> statement-breakpoint
CREATE TABLE "pnc_visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"mother_id" integer NOT NULL,
	"visit_day" integer NOT NULL,
	"visit_date" timestamp DEFAULT now() NOT NULL,
	"bp_systolic" integer,
	"bp_diastolic" integer,
	"hb_value" real,
	"complications" text,
	"recorded_by_worker_id" integer,
	"kb_used" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" integer NOT NULL,
	"from_facility_id" integer,
	"to_facility_id" integer,
	"tier_from" "facility_type",
	"tier_to" "facility_type",
	"reason" text,
	"status" "referral_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"beneficiary_type" text NOT NULL,
	"beneficiary_id" integer NOT NULL,
	"type" text NOT NULL,
	"due_date" date NOT NULL,
	"channel" text DEFAULT 'APP' NOT NULL,
	"sent_at" timestamp,
	"opened_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "scheme_enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"beneficiary_type" text NOT NULL,
	"beneficiary_id" integer NOT NULL,
	"scheme_code" "scheme_code" NOT NULL,
	"installment_no" integer DEFAULT 1 NOT NULL,
	"expected_date" date,
	"disbursed_date" date,
	"amount" integer,
	"status" "scheme_status" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sms_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"beneficiary_type" text NOT NULL,
	"beneficiary_id" integer NOT NULL,
	"reminder_id" integer,
	"language" text DEFAULT 'ml' NOT NULL,
	"body_text" text NOT NULL,
	"sender_id" text DEFAULT 'KLNHM-MCH' NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_id" integer,
	"action" text NOT NULL,
	"payload_kb" integer NOT NULL,
	"queued_at" timestamp DEFAULT now() NOT NULL,
	"synced_at" timestamp,
	"status" "sync_status" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_raised_by_worker_id_field_workers_id_fk" FOREIGN KEY ("raised_by_worker_id") REFERENCES "public"."field_workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anc_visits" ADD CONSTRAINT "anc_visits_mother_id_mothers_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."mothers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anc_visits" ADD CONSTRAINT "anc_visits_recorded_by_worker_id_field_workers_id_fk" FOREIGN KEY ("recorded_by_worker_id") REFERENCES "public"."field_workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_mother_id_mothers_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."mothers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_asha_id_field_workers_id_fk" FOREIGN KEY ("asha_id") REFERENCES "public"."field_workers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "field_workers" ADD CONSTRAINT "field_workers_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_records" ADD CONSTRAINT "growth_records_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_records" ADD CONSTRAINT "growth_records_recorded_by_worker_id_field_workers_id_fk" FOREIGN KEY ("recorded_by_worker_id") REFERENCES "public"."field_workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immunizations" ADD CONSTRAINT "immunizations_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immunizations" ADD CONSTRAINT "immunizations_given_at_facility_id_facilities_id_fk" FOREIGN KEY ("given_at_facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mothers" ADD CONSTRAINT "mothers_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pnc_visits" ADD CONSTRAINT "pnc_visits_mother_id_mothers_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."mothers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pnc_visits" ADD CONSTRAINT "pnc_visits_recorded_by_worker_id_field_workers_id_fk" FOREIGN KEY ("recorded_by_worker_id") REFERENCES "public"."field_workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_from_facility_id_facilities_id_fk" FOREIGN KEY ("from_facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_to_facility_id_facilities_id_fk" FOREIGN KEY ("to_facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_log" ADD CONSTRAINT "sms_log_reminder_id_reminders_id_fk" FOREIGN KEY ("reminder_id") REFERENCES "public"."reminders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_events" ADD CONSTRAINT "sync_events_worker_id_field_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."field_workers"("id") ON DELETE no action ON UPDATE no action;