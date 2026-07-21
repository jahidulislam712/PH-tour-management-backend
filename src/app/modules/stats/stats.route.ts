import Router from "express"
import { statsController } from "./stats.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"

const router = Router()

router.get("/user", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), statsController.getUserStats)
router.get("/tour", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), statsController.getTourStats)
router.get("/booking", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), statsController.getBookingStats)
router.get("/payment", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), statsController.getPaymentStats)

export const StatsRoutes = router