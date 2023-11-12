import { db } from "db";
import { users } from "./schema";
import { uuidv4 } from "@/features/auth/uuidGenerator";

const seedUsers = [
	{
		id: uuidv4(),
		fullName: "Tom Thumb",
		userName: "TomOfTheSea",
		email: "tom@email.com",
		password: "passW00rd",
	},
	{
		id: uuidv4(),
		fullName: "Alice Wonder",
		email: "alice@email.com",
		userName: "Wonderland",
		password: "passW00rd",
	},
	{
		id: uuidv4(),
		fullName: "Callum Kloos",
		email: "callum@email.com",
		userName: "BigDogCal",
		password: "passW00rd",
	},
	{
		id: uuidv4(),
		fullName: "Martin O",
		email: "martin@email.com",
		userName: "FootballWizard",
		password: "passW00rd",
	},
	{
		id: uuidv4(),
		fullName: "Emile Smith",
		email: "emile@email.com",
		userName: "SakaAndEmileSmithRowe",
		password: "passW00rd",
	},
];

const seededUsers = await db.insert(users).values(seedUsers);
console.log(seededUsers);
