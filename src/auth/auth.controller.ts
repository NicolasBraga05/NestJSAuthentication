import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup-dto';
import { LoginDto } from './dtos/login-dto';
import { RefreshTokenDto } from './dtos/refreshToken-dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/updateUser-dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import IResponseHttpApi from './interfaces/responseObject.interface';
import Roles from './middlewares/authenticator.role';
import RolesGuardAuth from './middlewares/authenticator.meddleware';
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

	@Get('user')
	@ApiBearerAuth()
	@UseGuards(RolesGuardAuth)
	@Roles(3)
	@ApiOperation({
		summary: 'Busca o perfil do usuário pelo o token',
		description: 'Endpoint para buscar o perfil do usuário autenticado pelo token.',
	})
	@ApiResponse({ status: 200, description: 'Perfil do usuário resgatado com sucesso' })
	@ApiResponse({
		status: 400,
		description: 'Erro na requisição',
	})
	@ApiResponse({
		status: 401,
		description: 'Não autorizado',
		schema: { example: { status: 401, message: { errors: ['Token inválido'] } } },
	})
	async getUser(@Req() req) {
		return this.authService.getUser(req?.user?.id);
	}

	@Get('user/list')
	@ApiBearerAuth()
	@UseGuards(RolesGuardAuth)
	@Roles(1)
	@ApiOperation({
		summary: 'Busca todos os perfis dos usuários.',
		description: 'Endpoint para buscar os perfis dos usuários.',
	})
	@ApiResponse({ status: 200, description: 'Perfis dos usuários resgatados com sucesso' })
	@ApiResponse({
		status: 400,
		description: 'Erro na requisição',
	})
	@ApiResponse({
		status: 401,
		description: 'Não autorizado',
		schema: { example: { status: 401, message: { errors: ['Token inválido'] } } },
	})
	async getAllUsers(@Req() req) {
		return this.authService.getAllUsers(req?.user.id);
	}

	@Put('user')
	@ApiBearerAuth()
	@UseGuards(RolesGuardAuth)
	@Roles(3)
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
		return this.authService.update(req?.user.id, requestupdateUser);
	}

	@Delete(':_id')
	@ApiBearerAuth()
	@UseGuards(RolesGuardAuth)
	@Roles(1)
	@ApiOperation({
		summary: 'Remover usuário',
		description: 'Endpoint para remover um usuário. Requer autenticação e permissão de administrador.',
	})
	@ApiParam({ name: '_id', type: String, description: 'ID do usuário a ser removido' })
	@ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
	@ApiResponse({
		status: 401,
		description: 'Não autorizado',
		schema: { example: { status: 401, message: { errors: ['Token inválido'] } } },
	})
	@ApiResponse({
		status: 403,
		description: 'Acesso negado',
		schema: { example: { status: 403, message: { errors: ['Acesso negado'] } } },
	})
	@ApiResponse({
		status: 404,
		description: 'Usuário não encontrado',
		schema: { example: { status: 404, message: { errors: ['User not found!'] } } },
	})
	async removeUser(@Param('_id', ParseMongoIdPipe) id: string): Promise<IResponseHttpApi<object>> {
		return await this.authService.delete(id);
	}

	@Post('refresh')
	@ApiBearerAuth()
	@UseGuards(RolesGuardAuth)
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
	async refreshTokens(@Req() req, @Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshTokens(req?.user.id, refreshTokenDto.refreshToken);
	}
}
