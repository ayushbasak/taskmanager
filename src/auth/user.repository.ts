import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signup(authCredsDto: AuthCredsDto): Promise<void> {
        const {username, password} = authCredsDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try{
            await user.save();
        }
        catch(error){
            console.error(error);
            if(error.code = 23505)
                throw new ConflictException('Username Already Exists!')
            else
                throw new InternalServerErrorException();
        }
    }

    async validateUserPassword(authCredsDto: AuthCredsDto): Promise<string> {
        const {username, password} = authCredsDto;
        const user = await this.findOne({ username });

        if(user && await user.validatePassword(password))
            return user.username;
        else
            return null;
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}