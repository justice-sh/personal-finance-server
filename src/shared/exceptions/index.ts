import { HttpStatus } from "@nestjs/common";
import { ErrorResponse } from "../types/api.response";

export class CustomError extends Error implements ErrorResponse {
  code: HttpStatus;
  fields?: string[];
  errors?: { [key: string]: string };
  timestamp?: string;
  path?: string;
  method?: string;

  constructor(message: string, status?: HttpStatus, errors?: { [key: string]: string }, fields?: string[]) {
    super(message);
    this.errors = errors;
    this.code = status || 500;
    this.fields = fields;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
