import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredsDto {

    @IsString()
    @MinLength(4)
    @MaxLength(10)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' }
    )
    password: string;
}