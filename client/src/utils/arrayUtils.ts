export const getLastItem = <T>(list: T[]): T|null => list[list.length - 1] ?? null;
