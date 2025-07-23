import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger('Bootstrap');

	const config = new DocumentBuilder()
		.setTitle('NestJS Authentication API')
		.setDescription(
			`### API para autenticação e criação de usuários
    Esta API permite que os usuários se registrem, façam login e gerenciem suas sessões. 
    **Endpoints disponíveis:**
      - **POST /auth/user**: Registra um novo usuário.
      - **POST /auth/login**: Realiza o login do usuário.
	  - **POST /auth/refresh**: Gera um novo token temporario para o usuário.
      - **PUT /auth/user**: Atualiza as informações do usuário.
      - **GET /auth/profile**: Retorna as informações do perfil do usuário autenticado.
	  - **GET /auth/user/list**: Retorna todos os usuários do sistema.
	  - **DELETE /auth/:user_id**: Deleta um usuário pelo o ID.
    - **Autenticação**: Utiliza Bearer Token para proteger os endpoints.
    - **Erros comuns**: 
      - 400: Requisição inválida.
      - 401: Não autorizado.
      - 404: Não encontrado.
    `,
		)
		.addBearerAuth()
		.setVersion('1.0')
		.addTag('Auth', 'Endpoints relacionados à autenticação de usuários')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('API', app, document);

	app.enableCors();
	app.getHttpAdapter().get('/', (req, res) => {
		res.redirect(301, '/API');
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	app.useGlobalFilters(new AllExceptionsFilter());

	await app.listen(process.env.PORT ?? 3000, () => {
		logger.log(`Start Api server: http://localhost:${process.env.PORT}/API#`);
	});
}
bootstrap();
