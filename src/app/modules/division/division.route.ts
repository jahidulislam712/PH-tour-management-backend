import { Router } from "express";
import { divisionController } from "./division.controller";
import { createDivisionZodValidation, updateDivisionZodValidation } from "./division.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";


const router = Router()

// create division
router.post( "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionZodValidation),
  divisionController.createDivision)

// update division
router.patch("/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateDivisionZodValidation),
  divisionController.updateDivision)

// get all division
router.get("/", divisionController.getAllDivisions)

export const divisionRoutes = router