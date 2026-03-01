import z, { ZodObject } from "zod";
import { ZodDto } from "nestjs-zod";
import { zod } from "@/shared/schemas/zod";
import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from "@nestjs/common";

@Injectable()
export class ZodValidationPipe<S extends ZodObject, T extends z.infer<S>> implements PipeTransform {
  private readonly logger: Logger = new Logger(ZodValidationPipe.name);

  constructor(
    private schema?: S | ZodDto<any>,
    private preprocess: PreprocessFn<T> = (data) => data as T,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const metatype = metadata.metatype as NestJsZodMetatype | undefined;

    const schema = this.parseSchema(this.schema) ?? this.extractZodSchema(metatype);
    if (!schema) return value;

    const result = schema.safeParse(this.preprocess(value));
    if (result.success) return result.data as unknown;

    this.logger.error({ message: "Zod validation failed", errors: result.error, value });
    throw new BadRequestException(zod.formatError(result).message);
  }

  private parseSchema(dto?: ZodDto<any> | ZodObject): ZodObject | undefined {
    if (!dto) return undefined;
    return dto instanceof ZodObject ? dto : this.extractZodSchema(dto);
  }

  private extractZodSchema(data?: NestJsZodMetatype): ZodObject | undefined {
    if (!data) return undefined;
    if (data.isZodDto && data.schema instanceof ZodObject) return data.schema;
    return undefined;
  }
}

// NOTE: this is useful if you used `createZodDto` from `nestjs-zod`
interface NestJsZodMetatype {
  isZodDto?: boolean;
  schema?: ZodObject;
}

type PreprocessFn<T> = (data: unknown) => T;

export function createZodValidationPipe<S extends ZodObject, T extends z.infer<S>>(
  schema?: S | ZodDto<any>,
  preprocess?: PreprocessFn<T>,
) {
  return new ZodValidationPipe(schema, preprocess);
}
