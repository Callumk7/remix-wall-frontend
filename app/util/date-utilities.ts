import { CalendarDate } from "@internationalized/date";

export function getDaysSinceUnixEpoch(date: Date): number {
	const msPerDay = 1000 * 60 * 60 * 24;
	const unixEpoch = new Date("1970-01-01T00:00:00.000Z");

	// getTime() returns milliseconds since Unix Epoch
	const diff = date.getTime() - unixEpoch.getTime();

	return Math.floor(diff / msPerDay);
}

export function getDateFromDaysSinceUnixEpoch(days: number): Date {
	const date = new Date(0);
	date.setUTCDate(days);
	return date;
}

export function createCalendarDate(date: Date): CalendarDate {
	return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
}
