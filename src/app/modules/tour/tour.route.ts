import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { tourTypeZodSchema } from "./tour.validation";
import { tourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

// create tour-type
router.post("/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeZodSchema),
  tourControllers.createTourType
)

// get all tour-types
router.get("/tour-types",
  tourControllers.getAllTourType
)

export const tourRoutes = router