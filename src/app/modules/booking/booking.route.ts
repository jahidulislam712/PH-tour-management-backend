import { Router } from "express";
import { Bookingontroller } from "./booking.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/", checkAuth(...Object.values(Role)), Bookingontroller.createBooking)

export const BookingRoutes = router