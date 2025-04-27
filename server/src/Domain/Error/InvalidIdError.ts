export default class InvalidIdError extends Error {
  constructor(id: string) {
    super(`id ${id} is not a valid id`);
  }
}