import { db } from "db";
import { users } from "./schema";

const seedUsers = [
	{
		fullName: "Tom Thumb",
		userName: "TomOfTheSea",
		email: "tom@email.com",
		password: "passW00rd",
	},
	{
		fullName: "Alice Wonder",
		email: "alice@email.com",
		userName: "Wonderland",
		password: "passW00rd",
	},
	{
		fullName: "Callum Kloos",
		email: "callum@email.com",
		userName: "BigDogCal",
		password: "passW00rd",
	},
	{
		fullName: "Martin O",
		email: "martin@email.com",
		userName: "FootballWizard",
		password: "passW00rd",
	},
	{
		fullName: "Emile Smith",
		email: "emile@email.com",
		userName: "SakaAndEmileSmithRowe",
		password: "passW00rd",
	},
];

const seededUsers = await db.insert(users).values(seedUsers);
console.log(seededUsers);
