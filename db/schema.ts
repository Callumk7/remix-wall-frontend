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
	fullName: text("full_name"),
	userName: text("user_name").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
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
	userId: one(users, {
		fields: [userFriends.userId],
		references: [users.id],
		relationName: "friends",
	}),
	friendId: one(users, {
		fields: [userFriends.friendId],
		references: [users.id],
		relationName: "friends_of",
	}),
}));

//
//
//
// POST TABLES AND RELATIONS
export const posts = sqliteTable("posts", {
	id: text("id").primaryKey(),
	// created and updated are dates when the post was created in the database
	createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	// these times are what the user sets in the UI
	day: integer("day").notNull(),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
	entryDate: integer("entry_date", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	body: text("body"),
	authorId: text("author_id").notNull(),
	inGroup: integer("in_group", { mode: "boolean" }),
	groupId: text("group_id"),
	isPrivate: integer("is_private", { mode: "boolean" })
		.notNull()
		.default(false),
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
	group: one(groups, {
		fields: [posts.groupId],
		references: [groups.id],
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
	posts: many(posts),
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

// Generated Types:
export type Post = typeof posts.$inferSelect;
export type User = typeof users.$inferSelect;
export type Group = typeof groups.$inferSelect;

// Created Types:
export interface PostWithAuthor extends Post {
	author: User;
}
