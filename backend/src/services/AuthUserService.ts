import prismaClient from "../prisma";
import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken'

interface AuthRequest{
    username: string;
    password: string;
}

class AuthUserService{
    async execute({ username, password }: AuthRequest ){
        const user = await prismaClient.user.findFirst({
            where:{
                username: username
            }, include:{
                clientes: true
            }
        })

        if(!user){
            throw new Error("username/password incorrect")
        }

        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch){
            throw new Error("username/password incorrect")
        }

        const token = sign(
            {
                name: user.name,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '360d'
            }
        );

        return { 
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
            token: token,
            client: user.clientes
        }
    }
}

export { AuthUserService }