import { ConfigModule } from '@nestjs/config';
import { BaseConstants } from '@src/base/base.constant';
import { AppConfig, DatabaseConfig, NodeEnv } from '@src/config/app.config';
import { DataSource } from 'typeorm';

const appEnv = process.env as unknown as AppConfig;
const databaseEnv = process.env as unknown as DatabaseConfig;

/**
 * ConfigModule.forRoot()를 호출하면 dotenv를 사용해서 환경변수 파일을 로드한다.
 * NODE_ENV가 프로덕션이 아닌 경우, 개발용 환경변수 파일을 로드한다.
 * 운영에선 서버 환경변수로 설정을 주입한다.
 */
if (appEnv.nodeEnv !== NodeEnv.PRODUCTION) {
  ConfigModule.forRoot({
    envFilePath: BaseConstants.dev.envFileName,
  });
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: databaseEnv.host,
  port: databaseEnv.dbPort,
  username: databaseEnv.username,
  password: databaseEnv.password,
  database: databaseEnv.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});
