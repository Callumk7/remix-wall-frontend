import { relations, sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

//
//
//
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
	comments: many(comments),
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
	comments: many(comments),
}));

// Notes are to be thought of as the main currency of communication on the platform, akin to tweets.
// They are short form communication that be be cross posted and used as messages, comments and feeds.
export const notes = sqliteTable("notes", {
	id: text("id").primaryKey(),
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
	inGroup: integer("in_group", { mode: "boolean" }).notNull().default(false),
	groupId: text("group_id"),
	onWall: integer("on_wall", { mode: "boolean" }).notNull().default(false),
	recipientUserId: text("recipient_user_id"),
	isPrivate: integer("is_private", { mode: "boolean" })
		.notNull()
		.default(false),
	isJournalEntry: integer("is_journal_entry", { mode: "boolean" })
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
	wall: one(users, {
		fields: [notes.recipientUserId],
		references: [users.id],
		relationName: "recipient",
	}),
	comments: many(comments),
}));

export const comments = sqliteTable("comments", {
	id: text("id").primaryKey(),
	createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	isUpdated: integer("is_updated", { mode: "boolean" }).default(false),
	postId: text("post_id"),
	noteId: text("note_id"),
	authorId: text("author_id").notNull(),
	body: text("body").notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id],
	}),
	note: one(notes, {
		fields: [comments.postId],
		references: [notes.id],
	}),
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id],
	}),
}));

// Generated Types:
export type Post = typeof posts.$inferSelect;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Note = typeof notes.$inferSelect;

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
export interface PostWithAuthorAndComments extends PostWithAuthor {
	comments: Comment[];
}

export interface CommentWithAuthor extends Comment {
	author: UserWithProfile;
}

export interface PostWithAuthorAndCommentsWithAuthor extends PostWithAuthor {
	comments: CommentWithAuthor[];
}

export interface PostWithAuthorCommentsRecipient
	extends PostWithAuthorAndComments {
	wall: UserWithProfile;
}

export interface PostAndCommentsWithAuthorsAndRecipient
	extends PostWithAuthorAndCommentsWithAuthor {
	wall: UserWithProfile;
}

export interface NoteWithAuthor extends Note {
	author: UserWithProfile;
}

export interface NoteWithAuthorAndComments extends NoteWithAuthor {
	comments: Comment[];
}
