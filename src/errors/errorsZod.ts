type ZodFieldErrors = {
  [x: string]: string[] | undefined;
};

export class AppErrorsZod extends Error {
  public readonly issues: ZodFieldErrors;
  public readonly statusCode: number;

  constructor(issues: ZodFieldErrors, statusCode = 400) {
    super('Validation Error'); 
    this.issues = issues;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppErrorsZod.prototype);
  }
}