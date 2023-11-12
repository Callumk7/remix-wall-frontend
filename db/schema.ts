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
	profiles: one(profiles, {
		fields: [users.id],
		references: [profiles.userId],
	}),
	posts: many(posts, {
		relationName: "author",
	}),
	comments: many(comments),
	wallPosts: many(posts, {
		relationName: "wall_user",
	}),
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
	isUpdated: integer("is_updated", { mode: "boolean" }).default(false),
	// these times are what the user sets in the UI for journal entries
	day: integer("day").notNull(),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
	entryDate: integer("entry_date", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	body: text("body").notNull(),
	authorId: text("author_id")
		.notNull()
		.references(() => users.id),
	inGroup: integer("in_group", { mode: "boolean" }).notNull().default(false),
	groupId: text("group_id"),
	onWall: integer("on_wall", { mode: "boolean" }).notNull().default(false),
	wallUserId: text("wall_user_id"),
	isPrivate: integer("is_private", { mode: "boolean" })
		.notNull()
		.default(false),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
		relationName: "author",
	}),
	group: one(groups, {
		fields: [posts.groupId],
		references: [groups.id],
	}),
	wall: one(users, {
		fields: [posts.wallUserId],
		references: [users.id],
		relationName: "wall_user",
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
	postId: text("post_id").notNull(),
	authorId: text("author_id").notNull(),
	body: text("body").notNull()
});

export const commentsRelations = relations(comments, ({one, many}) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id]
	}),
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id]
	})
}))

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
export type Profile = typeof profiles.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type Comment = typeof comments.$inferSelect;

// Created Types:
export interface UserWithProfile extends User {
	profiles: Profile;
}
export interface PostWithAuthor extends Post {
	author: UserWithProfile;
}
export interface PostWithComments extends Post {
	comments: Comment[]
}
export interface PostWithAuthorAndComments extends PostWithAuthor {
	comments: Comment[]
}
