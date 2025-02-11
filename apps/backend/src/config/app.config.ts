export enum NodeEnv {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
}

export interface AppConfig {
  nodeEnv: NodeEnv;
  appPort: number;
  clientUrl: string;
}

export interface DatabaseConfig {
  host: string;
  dbPort: number;
  username: string;
  password: string;
  database: string;
}

export interface TokenConfig {
  authSecret: string;
  authExpireIn: string;
  refresthSecret: string;
  refreshExpireIn: string;
}
