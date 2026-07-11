import { JwtPayload } from "jsonwebtoken";
import { IImage } from "../modules/division/division.interface";

declare global{
  namespace Express{
    interface Request{
      user: JwtPayload
    }
  }
}

declare global{
  namespace Express{
    interface Request{
      uploadedImage: IImage
    }
  }
}