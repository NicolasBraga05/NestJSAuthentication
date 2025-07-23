import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup-dto';
import { LoginDto } from './dtos/login-dto';
import { RefreshTokenDto } from './dtos/refreshToken-dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dtos/updateUser-dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('user')
	@ApiOperation({
		summary: 'Criar perfil do usuário',
		description: 'Endpoint para criar o perfil do usuário.',
	})
	@ApiBody({ type: SignUpDto, description: 'Dados do usuário' })
	@ApiResponse({ status: 200, description: 'Perfil do usuário criado com sucesso' })
	@ApiResponse({
		status: 400,
		description: 'Erro na requisição',
		schema: { example: { status: 400, message: { errors: ['Dados inválidos'] } } },
	})
	async createUser(@Body() userData: SignUpDto) {
		return this.authService.createUser(userData);
	}

	@Post('login')
	@ApiOperation({
		summary: 'Login de usuário',
		description: 'Endpoint para autenticar um usuário e retornar um token JWT.',
	})
	@ApiBody({ type: LoginDto, description: 'Dados de login do usuário' })
	@ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
	@ApiResponse({
		status: 400,
		description: 'Erro na requisição',
		schema: { example: { status: 400, message: { errors: ['Credenciais inválidas'] } } },
	})
	async login(@Body() userCredentials: LoginDto) {
		return this.authService.login(userCredentials);
	}

	@Put('user')
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: 'Atualizar perfil do usuário',
		description: 'Endpoint para atualizar o perfil do usuário autenticado.',
	})
	@ApiBody({ type: UpdateUserDto, description: 'Dados atualizados do usuário' })
	@ApiResponse({ status: 200, description: 'Perfil do usuário atualizado com sucesso' })
	@ApiResponse({
		status: 400,
		description: 'Erro na requisição',
		schema: { example: { status: 400, message: { errors: ['Dados inválidos'] } } },
	})
	@ApiResponse({
		status: 401,
		description: 'Não autorizado',
		schema: { example: { status: 401, message: { errors: ['Token inválido'] } } },
	})
	async update(@Req() req, @Body() requestupdateUser: UpdateUserDto) {
		return this.authService.update(req?.userId, requestupdateUser);
	}

	@Post('refresh')
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: 'Gera um refresh token para o usuário',
		description: 'Endpoint para gerar um refresh token do usuário autenticado.',
	})
	@ApiBody({ type: RefreshTokenDto, description: 'Token' })
	@ApiResponse({ status: 200, description: 'Perfil do usuário atualizado com sucesso' })
	@ApiResponse({
		status: 400,
		description: 'Erro na requisição',
		schema: { example: { status: 400, message: { errors: ['Dados inválidos'] } } },
	})
	@ApiResponse({
		status: 401,
		description: 'Não autorizado',
		schema: { example: { status: 401, message: { errors: ['Token inválido'] } } },
	})
	async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshTokens(refreshTokenDto.refreshToken);
	}

	/* 
	@UseGuards(AuthGuard)
	@Get()
	findAll(@Req() req) {
		return this.authService.findAll(userId: req.userId);
	}

	@Get('')
	findOne(@Req() req) {
		return this.authService.findOne(userId: req.userId);
	}
		
	@UseGuards(AuthGuard)
	@Patch('')
	update(@Req() req, @Body() updateUserDto: UpdateAuthDto) {
		return this.authService.update(userId: req.userId, updateUserDto);
	}

	@UseGuards(AuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.authService.remove(+id);
	} */
}
