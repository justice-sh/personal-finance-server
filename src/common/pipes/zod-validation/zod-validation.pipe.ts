import z, { ZodSchema } from "zod";
import { ZodDto } from "nestjs-zod";
import { fromZodError } from "zod-validation-error";
import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from "@nestjs/common";

@Injectable()
export class ZodValidationPipe<S extends ZodSchema, T extends z.infer<S>> implements PipeTransform {
  private readonly logger: Logger = new Logger(ZodValidationPipe.name);

  constructor(
    private schema?: S | ZodDto,
    private preprocess: PreprocessFn<T> = (data) => data as T,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const metatype = metadata.metatype as NestJsZodMetatype | undefined;

    const schema = this.parseSchema(this.schema) ?? this.extractZodSchema(metatype);
    if (!schema) return value;

    const result = schema.safeParse(this.preprocess(value));
    if (result.success) return result.data as unknown;

    this.logger.error({ message: "Zod validation failed", errors: result.error.errors, value });
    throw new BadRequestException(fromZodError(result.error, { prefix: "" }).message);
  }

  private parseSchema(dto?: ZodDto | ZodSchema): ZodSchema | undefined {
    return dto instanceof ZodSchema ? dto : this.extractZodSchema(dto);
  }

  private extractZodSchema(data?: NestJsZodMetatype): ZodSchema | undefined {
    if (data?.isZodDto && data.schema instanceof ZodSchema) return data.schema;
    return undefined;
  }
}

// NOTE: this is useful if you used `createZodDto` from `nestjs-zod`
interface NestJsZodMetatype {
  isZodDto?: boolean;
  schema?: ZodSchema;
}

type PreprocessFn<T> = (data: unknown) => T;

export function createZodValidationPipe<S extends ZodSchema, T extends z.infer<S>>(
  schema?: S | ZodDto,
  preprocess?: PreprocessFn<T>,
) {
  return new ZodValidationPipe(schema, preprocess);
}
