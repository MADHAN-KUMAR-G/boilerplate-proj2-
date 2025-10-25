import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validateRequest, validateIdParam } from "../middleware/validation";
import {
  createUserSchema,
  updateUserSchema,
  listUsersQuerySchema,
} from "../validations/user.validation";
import { ApiContext } from "../context/api-context";

const router = Router();
const apiContext = ApiContext.getInstance();
const userController = new UserController(apiContext);

// GET /users - List all users with pagination and filters
router.get(
  "/",
  validateRequest(listUsersQuerySchema, "query"),
  userController.listUsers.bind(userController)
);

// POST /users - Create a new user
router.post(
  "/",
  validateRequest(createUserSchema),
  userController.createUser.bind(userController)
);

// GET /users/:id - Get a specific user
router.get(
  "/:id",
  validateIdParam,
  userController.getUser.bind(userController)
);

// PUT /users/:id - Update a user
router.put(
  "/:id",
  validateIdParam,
  validateRequest(updateUserSchema),
  userController.updateUser.bind(userController)
);

// DELETE /users/:id - Delete a user
router.delete(
  "/:id",
  validateIdParam,
  userController.deleteUser.bind(userController)
);

export const usersRouter = router;
