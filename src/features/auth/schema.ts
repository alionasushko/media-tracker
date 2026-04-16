import { z } from 'zod';

const emailField = z
  .string()
  .trim()
  .pipe(z.email({ message: 'Enter a valid email' }));

const strongPasswordField = z
  .string()
  .min(8, 'At least 8 characters')
  .max(72, 'Too long (max 72)')
  .refine((v) => /[a-z]/.test(v), 'Add a lowercase letter')
  .refine((v) => /[A-Z]/.test(v), 'Add an uppercase letter')
  .refine((v) => /\d/.test(v), 'Add a number')
  .refine((v) => /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(v), 'Add a symbol');

export const SignInSchema = z.object({
  email: emailField,
  password: z.string(),
});

export const SignUpSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: emailField,
  password: strongPasswordField,
});

export type SignInValues = z.infer<typeof SignInSchema>;
export type SignUpValues = z.infer<typeof SignUpSchema>;
