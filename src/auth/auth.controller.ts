import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signup(@Body(ValidationPipe) authCredsDto: AuthCredsDto): Promise<void> {
        return this.authService.signup(authCredsDto);
    }

    @Post('/signin')
    signin(@Body(ValidationPipe) authCredsDto: AuthCredsDto): Promise<{accessToken: string}> {
        return this.authService.signin(authCredsDto);
    }

}
