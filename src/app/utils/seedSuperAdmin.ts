import { User } from "../modules/user/user.model";
import { envVars } from "../config/env";
import bcrypt from "bcryptjs"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";

export const seedSuperAdmin = async () => {
  try{
    const superAdmin = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL} )
    
    if( superAdmin ){
      console.log("Super admin already exists!")
      return
    }

    console.log("Trying to create super admin")

    const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL
    }
    const payload: IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      auths: [authProvider],
      isVerified: true
    }
    const createSuperAdmin = await User.create(payload)

    console.log(createSuperAdmin)
  }
  catch(err){
    console.error("SeedSuperAdmin error:", err);
  }
}
