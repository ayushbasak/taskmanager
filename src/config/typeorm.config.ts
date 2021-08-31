import { TypeOrmModuleOptions  } from '@nestjs/typeorm'
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'ayush0210',
    database: 'taskmanager',
    autoLoadEntities: true,
    // entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
};