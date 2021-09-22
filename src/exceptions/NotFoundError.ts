export class NotFoundError implements Error {
  name: string;
  message: string;
  stack?: string | undefined;

  constructor(message: string) {
    this.name = 'NotFoundError';
    this.message = message;
  }
}
