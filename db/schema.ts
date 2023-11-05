import { relations, sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
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
		userId: integer("user_id").notNull(),
		friendId: integer("friend_id").notNull(),
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

export const posts = sqliteTable("posts", {
	id: integer("id").primaryKey(),
	createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at").default(sql`CURRENT_TIMESTAMP`),
	hasBody: integer("has_body", { mode: "boolean" }),
	body: text("body"),
	hasImage: integer("has_image", { mode: "boolean" }),
	image: text("image"),
	authorId: integer("authorId").notNull(),
	inGroup: integer("in_group", { mode: "boolean" }),
	groupId: integer("group_id"),
	isPrivate: integer("is_private", { mode: "boolean" }).notNull().default(false),
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

export const groups = sqliteTable("groups", {
	id: integer("id").primaryKey(),
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
		userId: integer("user_id")
			.notNull()
			.references(() => users.id),
		groupId: integer("group_id")
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

// Created Types:
export interface PostWithAuthor extends Post {
	authorId: number;
	author: User;
}
