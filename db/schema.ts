import { relations, sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

// USER TABLES AND RELATIONS
export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull(),
	password: text("password").notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	profile: one(profiles, {
		fields: [users.id],
		references: [profiles.userId],
	}),
	notes: many(notes, {
		relationName: "author",
	}),
	wallPosts: many(notes, {
		relationName: "recipient",
	}),
	posts: many(posts),
	savedPosts: many(postsSavedByUsers),
	friends: many(userFriends, {
		relationName: "friends",
	}),
	friendsOf: many(userFriends, {
		relationName: "friends_of",
	}),
	groups: many(usersToGroups),
}));

export const userFriends = sqliteTable(
	"user_friends",
	{
		userId: text("user_id").notNull(),
		friendId: text("friend_id").notNull(),
	},
	(t) => ({
		pk: primaryKey(t.userId, t.friendId),
	}),
);

export const userFriendsRelations = relations(userFriends, ({ one }) => ({
	user: one(users, {
		fields: [userFriends.userId],
		references: [users.id],
		relationName: "friends",
	}),
	friend: one(users, {
		fields: [userFriends.friendId],
		references: [users.id],
		relationName: "friends_of",
	}),
}));

export const profiles = sqliteTable("profiles", {
	id: text("id").primaryKey(),
	userId: text("user_id"),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	userName: text("user_name").notNull(),
	profilePictureUrl: text("profile_picture_url"),
	bio: text("bio"),
	dateOfBirth: integer("date_of_birth", { mode: "timestamp" }).default(
		sql`0`,
	),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
	user: one(users, {
		fields: [profiles.userId],
		references: [users.id],
	}),
}));

//
//
//
// GROUP TABLES AND RELATIONS
export const groups = sqliteTable("groups", {
	id: text("id").primaryKey(),
	createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at").default(sql`CURRENT_TIMESTAMP`),
	name: text("name").notNull(),
	description: text("description"),
});
export const groupsRelations = relations(groups, ({ many }) => ({
	members: many(usersToGroups),
	notes: many(notes),
}));

export const usersToGroups = sqliteTable(
	"users_to_groups",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		groupId: text("group_id")
			.notNull()
			.references(() => groups.id),
	},
	(t) => ({
		pk: primaryKey(t.userId, t.groupId),
	}),
);

//
//
//
// POST TABLES AND RELATIONS
// Posts are JOURNAL ENTRIES that lean towards private journalling that can be shared with others.
// They are longer form. They are organised into days, and many posts can be composed into a single
// day's Journal entry for that day.
export const posts = sqliteTable("posts", {
	id: text("id").primaryKey(),
	title: text("title"),
	// created and updated are dates when the post was created in the database
	createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	isUpdated: integer("is_updated", { mode: "boolean" }).default(false),

	// these times are what the user sets in the UI for journal entries
	day: integer("day").notNull(),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
	entryDate: integer("entry_date", { mode: "timestamp" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	body: text("body").notNull(),
	pageId: text("page_id"),
	authorId: text("author_id")
		.notNull()
		.references(() => users.id),
	isPrivate: integer("is_private", { mode: "boolean" })
		.notNull()
		.default(true),
	likes: integer("likes").default(0),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
	page: one(pages, {
		fields: [posts.pageId],
		references: [pages.id],
	}),
	savedBy: many(postsSavedByUsers),
	notes: many(notes),
}));

export const postsSavedByUsers = sqliteTable(
	"posts_saved_by_users",
	{
		userId: text("user_id").notNull(),
		postId: text("post_id").notNull(),
	},
	(t) => ({
		pk: primaryKey(t.userId, t.postId),
	}),
);

// Notes are to be thought of as the main currency of communication on the platform, akin to tweets.
// They are short form communication that be be cross posted and used as messages, comments and feeds.
export const notes = sqliteTable("notes", {
	id: text("id").primaryKey(),
	// parent logic. We have an enum value for the parent type. we then have four options for foreign
	// relations. This should simplify logic in the application layer.
	parentType: text("parent_type", {
		enum: ["note", "page", "group", "post"],
	}),
	parentNoteId: text("parent_note_id"),
	groupId: text("group_id"),
	pageId: text("page_id"),
	postId: text("post_id"),
	// created and updated are dates when the post was created in the database
	createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	isUpdated: integer("is_updated", { mode: "boolean" }).default(false),
	// these times are what the user sets in the UI for journal entries
	body: text("body").notNull(),
	authorId: text("author_id")
		.notNull()
		.references(() => users.id),
	isPrivate: integer("is_private", { mode: "boolean" })
		.notNull()
		.default(false),
	likes: integer("likes").default(0),
});

export const notesRelations = relations(notes, ({ one, many }) => ({
	author: one(users, {
		fields: [notes.authorId],
		references: [users.id],
		relationName: "author",
	}),
	group: one(groups, {
		fields: [notes.groupId],
		references: [groups.id],
	}),
	page: one(pages, {
		fields: [notes.pageId],
		references: [pages.id],
	}),
	post: one(posts, {
		fields: [notes.postId],
		references: [posts.id],
	}),
	parentNote: one(notes, {
		fields: [notes.parentNoteId],
		references: [notes.id],
	}),
	childNotes: many(subNotes),
}));

export const subNotes = sqliteTable(
	"sub_notes",
	{
		parentId: text("parent_id").notNull(),
		childId: text("child_id").notNull(),
	},
	(t) => ({
		pk: primaryKey(t.parentId, t.childId),
	}),
);

export const subNotesRelations = relations(subNotes, ({ one }) => ({
	parent: one(notes, {
		fields: [subNotes.parentId],
		references: [notes.id],
		relationName: "parent_note",
	}),
	child: one(notes, {
		fields: [subNotes.childId],
		references: [notes.id],
		relationName: "child_note",
	}),
}));

// pages are collections of data for organising and viewing your saved stuff,
// kind of like a scrapbook. I am debating constraining each page to a date, or
// allow the user to build out their collection however they like.
export const pages = sqliteTable("pages", {
	id: text("id").primaryKey(),
	title: text("title").notNull().default("Page Title"),
	ownerId: text("owner_id").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	isUpdated: integer("is_updated", { mode: "boolean" }).default(false),

	// these times are what the user sets in the UI for journal entries
	day: integer("day").notNull(),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
	entryDate: integer("entry_date", { mode: "timestamp" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
});

export const pagesRelations = relations(pages, ({ one, many }) => ({
	owner: one(users, {
		fields: [pages.ownerId],
		references: [users.id],
	}),
	posts: many(posts),
	notes: many(notes),
}));

// Generated Types:
export type Post = typeof posts.$inferSelect;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Page = typeof pages.$inferSelect;

// Inserts
export type PageInsert = typeof pages.$inferInsert;

// Created Types:
export interface UserWithProfile extends User {
	profile: Profile;
}
export interface PostWithAuthor extends Post {
	author: UserWithProfile;
}
export interface PostWithComments extends Post {
	comments: Comment[];
}

export interface PostWithNotesWithAuthor extends Post {
	notes: NoteWithAuthor[];
}

export interface PostWithAuthorAndNotes extends PostWithAuthor {
	notes: Note[];
}

export interface PostWithAuthorAndNotesWithAuthor extends PostWithAuthor {
	notes: NoteWithAuthor[];
}

export interface NoteWithAuthor extends Note {
	author: UserWithProfile;
}

export interface NoteWithSubnotesWithAuthors extends NoteWithAuthor {
	subNotes: NoteWithAuthor[];
}

export interface PageWithPostsAndNotes extends Page {
	posts: PostWithAuthor[];
	notes: NoteWithAuthor[];
}
