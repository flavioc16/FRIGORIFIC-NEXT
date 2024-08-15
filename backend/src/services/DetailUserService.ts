import prismaClient from "../prisma";

class DetailUserService {
    async execute(user_id, role) {
         let user;

        if (role === 'ADMIN') {
            user = await prismaClient.user.findFirst({
                where: {
                    id: user_id
                }, select:{
                    id: true,
                    username: true,
                    role: true
                }
            });
        } else if (role === 'USER') {
            user = await prismaClient.cliente.findFirst({
                where: {
                    id: user_id
                }
            });
        } else {
            throw new Error("Invalid role");
        }

        if (!user) {
            throw new Error("User not found");
        }

        return  user;
    }
}

export { DetailUserService };
