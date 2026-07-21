/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20"
import { Strategy as LocalStrategy } from "passport-local"
import { envVars } from "./env"
import passport, { Profile } from "passport"
import { User } from "../modules/user/user.model"
import { IsActive, Role } from "../modules/user/user.interface"
import bcrypt from "bcryptjs"


// Custom login using PassportJS
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      // passReqToCallback: true,
      // session: false
    },
    async (email, password, done) => {
      try {
        const isUserExist = await User.findOne({ email: email });

        if( !isUserExist ){
          return done(null, false, {message: "User doesn't exist"})
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
          return done(null, false, {message: `User is ${isUserExist.isActive}`})
        }
        if (isUserExist.isDelete) {
          return done(null, false, {message: "User is deleted"})
        }

        // if user is registered by Google and no password
        const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google")
        if( isGoogleAuthenticated && !isUserExist.password ){
          return done(null, false, {message: "User is authenticated by Google. If you would like to login with credentials, use google authentication and set a password first."})
        }

        // if password match
        const isPasswordMatch = await bcrypt.compare(password, isUserExist.password as string)

        if( !isPasswordMatch ){
          return done(null, false, {message: "Password doesn't match"})
        }

        return done(null, isUserExist)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        done(error)
      }
    }
  )
);


// Google authentication using PassportJS
passport.use(
  new GoogleStrategy({
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: envVars.GOOGLE_CALLBACK_URL
  },
  async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    
    try {
      const email = profile.emails?.[0]?.value
      if( !email ){
        return done(null, false, {messaeg: "No email found"})
      }
      const photo = profile.photos?.[0]?.value

      let isUserExist = await User.findOne({email})

      if( isUserExist && isUserExist.isActive !== IsActive.ACTIVE ){
        return done(null, false, {message: `User is ${isUserExist.isActive}`})
      }
      
      if( isUserExist && isUserExist.isDelete ){
        return done(null, false, {message: `User is Deleted`})
      }

      if( ! isUserExist ){
        isUserExist = await User.create({
          name: profile.displayName,
          email,
          picture: photo ? photo : '',
          role: Role.USER,
          isVerified: true,
          auths: [
            {
              provider: "google",
              providerId: profile.id
            }
          ]
        })
      }
      
      return done(null, isUserExist, {message: "User created successfully"})
    } catch (error) {
      console.log("Google Strategy Error", error)
      return done(error)
    }
  })
)

passport.serializeUser(
  function(user: any, done: (err: any, id?: unknown) => void) {
    done(null, user._id);
  }
)

passport.deserializeUser( async (id: string, done: any) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    console.log(error)
    done(error)
  }
})