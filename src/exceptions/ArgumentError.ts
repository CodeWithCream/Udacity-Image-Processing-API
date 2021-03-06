export class ArgumentError implements Error {
  name: string;
  message: string;
  stack?: string | undefined;

  constructor(message: string) {
    this.name = 'ArgumentError';
    this.message = message;
  }
}
