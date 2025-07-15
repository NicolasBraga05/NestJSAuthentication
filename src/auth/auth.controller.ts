import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup-dto';
import { LoginDto } from './dtos/login-dto';
import { RefreshTokenDto } from './dtos/refreshToken-dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('user')
	async createUser(@Body() userData: SignUpDto) {
		return this.authService.createUser(userData);
	}

	@Post('login')
	async login(@Body() userCredentials: LoginDto) {
		return this.authService.login(userCredentials);
	}

	@Post('refresh')
	async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshTokens(refreshTokenDto.refreshToken);
	}

	/* @Get()
	findAll() {
		return this.authService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.authService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
		return this.authService.update(+id, updateAuthDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.authService.remove(+id);
	} */
}
