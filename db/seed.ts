import { db } from "db";
import { profiles, users } from "./schema";
import { uuidv4 } from "@/features/auth/uuidGenerator";

const seedUsers = [
	{
		id: uuidv4(),
		email: "tom@email.com",
		password: "passW00rd",
	},
	{
		id: uuidv4(),
		email: "alice@email.com",
		password: "passW00rd",
	},
	{
		id: uuidv4(),
		email: "callum@email.com",
		password: "passW00rd",
	},
	{
		id: uuidv4(),
		email: "martin@email.com",
		password: "passW00rd",
	},
	{
		id: uuidv4(),
		email: "emile@email.com",
		password: "passW00rd",
	},
];

const seedProfiles = [
	{
		id: uuidv4(),
		userId: seedUsers[0].id,
		firstName: "Emile",
		lastName: "Smith-Rowe",
		userName: "DeathRowe",
		bio: "I love football and Bukayo Saka.",
	},
	{
		id: uuidv4(),
		userId: seedUsers[1].id,
		firstName: "Martin",
		lastName: "Ødegard",
		userName: "GardOfHonor",
		bio: "I love football and I want to be a top notch manager one day like Mikel Arteta.",
	},
	{
		id: uuidv4(),
		userId: seedUsers[2].id,
		firstName: "Thiery",
		lastName: "Henry",
		userName: "TheKing",
		bio: "I love football and Dennis Berkamp.",
	},
	{
		id: uuidv4(),
		userId: seedUsers[3].id,
		firstName: "Dennis",
		lastName: "Berkamp",
		userName: "SpielTheBall",
		bio: "Probably the best footballer",
	},
	{
		id: uuidv4(),
		userId: seedUsers[4].id,
		firstName: "Bilbo",
		lastName: "Baggins",
		userName: "HWWAAAAGHHH",
		bio: "I don't know half of you half as well as I should like; and I like less than half of you half as well as you deserve.",
	},
];

const seededUsers = await db.insert(users).values(seedUsers);
const seededProfiles = await db.insert(profiles).values(seedProfiles);
console.log(seededProfiles);
