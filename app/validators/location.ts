import vine from '@vinejs/vine'

export const createLocationValidator = vine.create({
  latitude: vine
    .number()
    .min(-90)
    .max(90),
  longitude: vine
    .number()
    .min(-180)
    .max(180),
  accuracy: vine
    .number()
    .min(0),
  timestamp: vine
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
  country: vine
    .string()
    .trim()
    .minLength(1)
    .maxLength(100),
  state: vine
    .string()
    .trim()
    .minLength(1)
    .maxLength(100),
  description: vine
    .string()
    .trim()
    .maxLength(500)
    .optional()
    .nullable(),
})

export const updateLocationValidator = vine.create({
  description: vine
    .string()
    .trim()
    .maxLength(500)
    .optional()
    .nullable(),
})
