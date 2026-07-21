/* eslint-disable no-console */
import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router()

router.post('/login', AuthControllers.credentialsLogin)
router.post('/refresh-token', AuthControllers.getNewAccessToken)
router.post('/logout', AuthControllers.logout)
router.post('/change-password', checkAuth(...(Object.values(Role))), AuthControllers.chagePassword)
router.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword)
router.post("/forgot-password", AuthControllers.forgotPassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)

router.get('/google', 
  (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate('google', {
      scope: ["profile", "email"],
      state: redirect as string,
      session: false
    })(req, res, next)
  }
)

router.get('/google/callback', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: true }, async (err, user, info) => {
    if (err) {
      console.error('Google auth error:', err)
      return next(err)
    }

    if (!user) {
      console.warn('Google auth failed:', info)
      return res.redirect(`${envVars.FRONTEND_URL}/login`)
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Passport login error:', loginErr)
        return next(loginErr)
      }
      next()
    })
  })(req, res, next)
}, AuthControllers.googleCallback)

export const AuthRoutes = router