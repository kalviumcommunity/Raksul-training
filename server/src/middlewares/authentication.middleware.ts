// authentication.middleware.ts

import { Request, Response, NextFunction } from "express";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import jwtUtils from "../utils/jwtUtils";
import groupService from "../services/group.service";

const CLIENT_ID = process.env.OAUTH_CID;
const client = new OAuth2Client(CLIENT_ID);

interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export async function checkGAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.body.tokenId.credential;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload) {
      req.user = payload as TokenPayload;
      next();
    } else {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.headers.authorization ||
    typeof req.headers.authorization !== "string"
  ) {
    return next(new Error("Invalid Auth Header"));
  }
  let token = req.headers.authorization!.split(" ")[1];
  let payload = jwtUtils.verifyToken(token);
  res.locals.user = payload.sub;
  next();
};

export const checkGroupMember=async (req: Request, res: Response, next: NextFunction)=>{
  let groupId=req.params.group_id
  let user=res.locals.user.toString()
  try {
    if(await groupService.checkGroupMember(groupId,user)){
      res.locals.groupId=groupId
      next()
    }
    else next(new Error("Access Restricted!"))
  }
  catch(err){
    next(err)
  }
}
