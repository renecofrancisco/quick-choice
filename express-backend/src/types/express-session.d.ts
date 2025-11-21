import "express-session";
import { IUser } from "../../shared-backend/models/IUser";

declare module "express-session" {
  interface SessionData {
    user?: IUser;
  }
}
