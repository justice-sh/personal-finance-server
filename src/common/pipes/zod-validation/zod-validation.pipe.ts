import { ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";
import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from "@nestjs/common";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private readonly logger: Logger = new Logger(ZodValidationPipe.name);

  constructor(
    private schema?: ZodSchema,
    private preprocess = (data: unknown) => data,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const metatype = metadata.metatype as NestJsZodMetatype | undefined;

    this.schema = this.schema || metatype?.schema;
    if (!this.schema) return value;

    const result = this.schema.safeParse(this.preprocess(value));
    if (result.success) return result.data as unknown;

    this.logger.error({ message: "Zod validation failed", errors: result.error.errors, value });
    throw new BadRequestException(fromZodError(result.error, { prefix: "", prefixSeparator: "" }).message);
  }
}

// NOTE: this is useful if you used `createZodDto` from `nestjs-zod`
interface NestJsZodMetatype {
  isZodDto?: boolean;
  schema?: ZodSchema;
}
