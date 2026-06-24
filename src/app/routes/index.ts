import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.route"
import { divisionRoutes } from "../modules/division/division.route"
import { tourRoutes } from "../modules/tour/tour.route"

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
  }
]

moudleRoutes.forEach(route => {
  router.use(route.path, route.route)
})