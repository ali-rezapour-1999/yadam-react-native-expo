import { t } from "i18next";
import z from "zod";


export const EmailSchema = z.object({
  identifier: z.string().min(1, { message: t('auth.email_required') }).email({ message: t('auth.email_invalid') }),
});

export const PhoneSchema = z.object({
  identifier: z
    .string()
    .min(10, { message: t('auth.phone_required') })
    .regex(/^\+?\d{10,14}$/, { message: t('auth.phone_invalid') }),
});

export const CodeSchema = z.object({
  code: z.string().length(6, { message: t('auth.code_must_be_6') }),
});
