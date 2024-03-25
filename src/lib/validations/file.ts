import z from "zod";

export const imageValidation = z.object({
  file: z.custom<FileList>().superRefine((files, ctx) => {
    if (files.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be provided",
      });
      return false;
    }

    if (!["application/pdf"].includes(files[0].type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be a valid pdf type",
      });
      return false;
    }

    if (files[0].size > 1024 * 1024 * 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be less than 5MB",
      });
      return false;
    }

    return true;
  }),
});

export const imageFileValidation = z.object({
  file: z.custom<File[]>().superRefine((files, ctx) => {
    if (files.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be provided",
      });
      return false;
    }

    if (
      ![
        "image/webp",
        "image/png",
        "image/svg",
        "image/jpg",
        "image/jpeg",
      ].includes(files[0].type)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be a valid image type",
      });
      return false;
    }

    if (files[0].size > 1024 * 1024 * 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be less than 5MB",
      });
      return false;
    }

    return true;
  }),
});

export type imageValidationType = z.infer<typeof imageFileValidation>;
