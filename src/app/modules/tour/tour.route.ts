import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourZodSchema, tourTypeZodSchema, updateTourZodSchema } from "./tour.validation";
import { tourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

// create tour
router.post("/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  tourControllers.createTour
)

// get all tour
router.get("/",
  tourControllers.getAllTours
)

// update tour
router.patch("/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourZodSchema),
  tourControllers.updateTour
)

// create tour-type
router.post("/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeZodSchema),
  tourControllers.createTourType
)

// update tour-type
router.patch("/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeZodSchema),
  tourControllers.updateTourType
)

// delete tour-type
router.delete("/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourControllers.deleteTourType
)

// get all tour-types
router.get("/tour-types",
  tourControllers.getAllTourType
)

export const tourRoutes = router