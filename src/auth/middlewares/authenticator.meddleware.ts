import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
	ForbiddenException,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../schemas/user.schema';
import { Role, RoleDocument } from '../schemas/roles.schema';

@Injectable()
export default class RolesGuardAuth implements CanActivate {
	private readonly logger = new Logger(RolesGuardAuth.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly reflector: Reflector,
		private readonly jwtService: JwtService,
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
		@InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException('Token ausente ou inválido');
		}

		const secret = this.configService.get<string>('JWT_SECRET');
		if (!secret) {
			throw new Error('JWT_SECRET não configurado no ambiente');
		}

		let decoded: any;
		try {
			decoded = this.jwtService.verify(token, { secret });
		} catch (err) {
			this.logger.error(`Erro ao verificar token: ${err.message}`);
			throw new UnauthorizedException('Token inválido ou expirado');
		}

		const user = await this.userModel.findById(decoded.userId).exec();
		if (!user) {
			throw new UnauthorizedException('Usuário não encontrado');
		}

		const role = await this.roleModel.findOne({ role_level: user.user_role }).exec();
		if (!role) {
			throw new UnauthorizedException('Role não encontrada');
		}

		const requiredRoles = this.reflector.get<number[]>('roles', context.getHandler());
		if (requiredRoles && requiredRoles.length > 0) {
			const requiredRoleLevel = Math.min(...requiredRoles);
			if (role.role_level > requiredRoleLevel) {
				throw new ForbiddenException('Permissões insuficientes');
			}
		}

		request.user = {
			id: user._id,
			role: role.role_name,
			role_level: role.role_level,
		};

		return true;
	}

	private extractTokenFromHeader(request: any): string | undefined {
		return request.headers.authorization?.split(' ')[1];
	}
}
