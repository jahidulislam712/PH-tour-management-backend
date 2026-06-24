import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router()

// create/resiter user
router.post(
  '/register',
  validateRequest(createUserZodSchema),
  userControllers.createUser)



// get all users
router.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.getAllUsers)
router.patch('/:id', validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), userControllers.updateUser)

export const UserRoutes = router

// app.ts -> routes/index.ts