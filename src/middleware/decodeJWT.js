import jwt from "jsonwebtoken";

export const decodeJWT = (token) => {
    if(!token){
        return;
    }
    const response = jwt.decode(token);
    return response;
}