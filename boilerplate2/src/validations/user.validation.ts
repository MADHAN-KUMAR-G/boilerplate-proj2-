import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).required(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().min(2).max(100).optional(),
  isActive: Joi.boolean().optional(),
});

export const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string()
    .valid("createdAt", "updatedAt", "name", "email")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  isActive: Joi.boolean().optional(),
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
});
