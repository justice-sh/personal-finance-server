import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { fromZodError } from "zod-validation-error";
import { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
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

    throw new BadRequestException(fromZodError(result.error, { prefix: "", includePath: false, prefixSeparator: "" }).message);
  }
}

// NOTE: this is useful if you used `createZodDto` from `nestjs-zod`
interface NestJsZodMetatype {
  isZodDto?: boolean;
  schema?: ZodSchema;
}
