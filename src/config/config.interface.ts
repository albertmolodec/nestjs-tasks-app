export interface JWTConfig {
  expiresIn: number;
  secret: string;
}

export interface DBConfig {
  type: 'postgres' | 'mysql' | 'mongodb' | 'sqlite';
  port: number;
  database: string;
  host: string;
  username: string;
  password: string;
  synchronize: boolean;
}

export interface ServerConfig {
  port: number;
  origin: string;
}
