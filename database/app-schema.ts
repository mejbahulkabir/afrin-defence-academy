import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  index,
  int,
  mysqlEnum,
  json,
} from "drizzle-orm/mysql-core";

// ==========================================
// SHARED TIMESTAMPS
// ==========================================

export const timestamps = () => ({
  createdAt: timestamp("created_at", { fsp: 3 })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ==========================================
// ENUMS
// ==========================================

export const bannerSlotEnum = mysqlEnum("slot", [
    "hero",
    "cta"
]);

export const courseModeEnum = mysqlEnum("mode", [
  "Online",
  "Offline",
  "Hybrid",
]);

export const courseLevelEnum = mysqlEnum("level", [
  "Foundation",
  "Intermediate",
  "Advanced",
]);

export const userRoleEnum = mysqlEnum("user_role", [
  "owner",
  "admin",
  "publisher",
]);

// ==========================================
// ADMISSION SUBMISSIONS
// ==========================================

export const admissionSubmissions = mysqlTable(
  "admission_submissions",
  {
    id: int("id").autoincrement().primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }).notNull(),
    dob: varchar("dob", { length: 50 }),
    qualification: varchar("qualification", { length: 255 }),
    course: varchar("course", { length: 255 }),
    targetExam: varchar("target_exam", { length: 255 }),
    city: varchar("city", { length: 255 }),
    message: text("message"),
    applicationId: varchar("application_id", { length: 100 })
      .notNull()
      .unique(),
    handled: boolean("handled").default(false).notNull(),
    ...timestamps(),
  },
);

// ==========================================
// BANNERS
// ==========================================

export const banners = mysqlTable(
  "banners",
  {
    id: int("id").autoincrement().primaryKey(),
    slot: bannerSlotEnum.notNull(),
    image: text("image").notNull(),
    eyebrow: varchar("eyebrow", { length: 255 }),
    title: varchar("title", { length: 255 }),
    titleHighlight: varchar("title_highlight", { length: 255 }),
    subtitle: text("subtitle"),
    ctaLabel: varchar("cta_label", { length: 255 }),
    ctaHref: varchar("cta_href", { length: 2048 }),
    secondaryLabel: varchar("secondary_label", { length: 255 }),
    secondaryHref: varchar("secondary_href", { length: 2048 }),
    active: boolean("active").default(true).notNull(),
    order: int("order").default(0).notNull(),
    ...timestamps(),
  },
  (table) => [index("banners_slot_idx").on(table.slot)],
);

// ==========================================
// BLOG POSTS
// ==========================================

export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  image: text("image"),
  excerpt: text("excerpt"),
  content: text("content"),
  category: varchar("category", { length: 255 }),
  author: varchar("author", { length: 255 }),
  date: varchar("date", { length: 50 }),
  readingTime: varchar("reading_time", { length: 50 }),
  published: boolean("published").default(true).notNull(),
  ...timestamps(),
});

// ==========================================
// CONTACT SUBMISSIONS
// ==========================================

export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message"),
  handled: boolean("handled").default(false).notNull(),
  ...timestamps(),
});

// ==========================================
// COURSES
// ==========================================

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  mode: courseModeEnum.default("Hybrid").notNull(),
  level: courseLevelEnum.default("Foundation").notNull(),
  description: text("description"),
  features: json("features").$type<string[]>().notNull().default([]),
  popular: boolean("popular").default(false).notNull(),
  order: int("order").default(0).notNull(),
  ...timestamps(),
});

// ==========================================
// EXAMS
// ==========================================

export const exams = mysqlTable("exams", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  full: varchar("full", { length: 255 }),
  branch: varchar("branch", { length: 255 }),
  description: text("description"),
  eligibility: text("eligibility"),
  order: int("order").default(0).notNull(),
  ...timestamps(),
});

// ==========================================
// FACULTY
// ==========================================

export const faculty = mysqlTable("faculty", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  image: text("image"),
  rank: varchar("rank", { length: 100 }),
  experience: varchar("experience", { length: 100 }),
  specialization: varchar("specialization", { length: 255 }),
  order: int("order").default(0).notNull(),
  ...timestamps(),
});

// ==========================================
// GALLERY IMAGES
// ==========================================

export const galleryImages = mysqlTable("gallery_images", {
  id: int("id").autoincrement().primaryKey(),
  src: text("src").notNull(),
  alt: varchar("alt", { length: 500 }),
  caption: text("caption"),
  active: boolean("active").default(true).notNull(),
  order: int("order").default(0).notNull(),
  ...timestamps(),
});

// ==========================================
// SITE SETTINGS
// ==========================================

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).default("default").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("short_name", { length: 100 }),
  tagline: varchar("tagline", { length: 500 }),
  description: text("description"),
  phone: varchar("phone", { length: 50 }),
  phoneRaw: varchar("phone_raw", { length: 50 }),
  email: varchar("email", { length: 255 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  address: text("address"),
  mapsEmbed: text("maps_embed"),
  socials: json("socials").$type<{
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  }>(),
  ...timestamps(),
});

// ==========================================
// STATS
// ==========================================

export const stats = mysqlTable("stats", {
  id: int("id").autoincrement().primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  value: int("value").notNull(),
  suffix: varchar("suffix", { length: 50 }).default("").notNull(),
  order: int("order").default(0).notNull(),
  ...timestamps(),
});

// ==========================================
// TESTIMONIALS
// ==========================================

export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  achievement: varchar("achievement", { length: 255 }),
  batch: varchar("batch", { length: 100 }),
  quote: text("quote").notNull(),
  youtubeUrl: text("youtube_url"),
  image: text("image"),
  order: int("order").default(0).notNull(),
  ...timestamps(),
});

// ==========================================
// WHY US
// ==========================================

export const whyUs = mysqlTable("why_us", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  desc: text("desc").notNull(),
  order: int("order").default(0).notNull(),
  ...timestamps(),
});

// ==========================================
// DRIZZLE RELATIONS
// ==========================================

// No business-table relations are required yet.
// Better Auth session/account relationships are defined
// using database foreign keys above.