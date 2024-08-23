import express,{ Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
const jwt = require("jsonwebtoken");
interface AuthenticatedRequest extends Request {
    user?: any;
}
const authUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            res.status(401).json();
            return
        }
        const tokens = token.split(" ")
        if (tokens.length != 2) {
            res.status(401).json();
            return
        }
        const {id} = jwt.decode(tokens[1]);
        const user = await UserService.findById(id);
        if (!user) {
            res.status(401).json();
            return
        }
        req.user = user;
        next();    
    } catch (error) {
        res.status(401).json();
        return
    }
}

export { authUser }