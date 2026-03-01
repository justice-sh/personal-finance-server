import z from 'zod';
import { fromZodError } from 'zod-validation-error';

type ZodPrimitive = z.ZodEmail | z.ZodEnum | z.ZodString | z.ZodBoolean | z.ZodNumber | z.ZodPipe;

const id = () => z.string().trim();

const name = () => z.string().trim().max(50);

function password() {
  return z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
  });
}

function otp() {
  return z
    .string()
    .min(6, 'OTP must be at least 6 characters long')
    .max(6, 'OTP must be at most 6 characters long')
    .describe('Your OTP code');
}

function arrayFromString<T extends z.ZodArray<ZodPrimitive> | z.ZodOptional<z.ZodArray<ZodPrimitive>>>(schema: T) {
  return z.preprocess((val) => {
    if (!val) return val;

    return String(val)
      .split(',')
      .map((v) => v.trim());
  }, schema);
}



function formatError<T>(result: z.ZodSafeParseError<T>) {
  return fromZodError(result.error, { prefix: '' });
}


const booleanFromString = <T extends z.ZodBoolean | z.ZodOptional<z.ZodBoolean>>(schema: T) => {
  return z.preprocess((val) => {
    if (typeof val !== 'string') return val;

    const lowerVal = val.toLowerCase();
    if (lowerVal === 'true') return true;
    if (lowerVal === 'false') return false;
    return val;
  }, schema);
};

/**
 * All enum values are stored expected to be in uppercase.
 * @param schema
 * @returns
 */
function enumFromString<T extends z.ZodEnum | z.ZodOptional<z.ZodEnum>>(schema: T) {
  return z.preprocess((val) => {
    if (typeof val !== 'string') return val;
    return val.toUpperCase();
  }, schema);
}

const pagination = () => {
  return z.object({
    offset: z.number().min(1).default(1).optional(),
    limit: z.number().min(1).max(100).default(10).optional(),
  });
};

export const zod = {
  id,
  otp,
  name,
  password,
  pagination,
  formatError,
  enumFromString,
  arrayFromString,
  booleanFromString,
};
