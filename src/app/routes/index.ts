import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.route"

export const router = Router()
const moudleRoutes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  }
]

moudleRoutes.forEach(route => {
  router.use(route.path, route.route)
})