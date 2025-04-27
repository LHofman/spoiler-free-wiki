export default class DocumentNotFoundError extends Error {
  constructor(model: string) {
    super(`${model} not found`);
  }
}