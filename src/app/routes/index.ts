import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.route"
import { divisionRoutes } from "../modules/division/division.route"
import { tourRoutes } from "../modules/tour/tour.route"
import { BookingRoutes } from "../modules/booking/booking.route"
import { PaymentRoutes } from "../modules/payment/payment.route"

export const router = Router()
const moudleRoutes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/division",
    route: divisionRoutes
  },
  {
    path: "/tour",
    route: tourRoutes
  },
  {
    path: "/booking",
    route: BookingRoutes
  },
  {
    path: "/payment",
    route: PaymentRoutes
  }
]

moudleRoutes.forEach(route => {
  router.use(route.path, route.route)
})