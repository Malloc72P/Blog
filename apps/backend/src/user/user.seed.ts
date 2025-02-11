import * as argon2 from 'argon2';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from './user.entity';
import { UserRole } from './user.role';

const datas = [
  { email: 'walter@inabase.com', name: 'walter', password: 'test', role: UserRole.NORMAL },
  { email: 'saul@inabase.com', name: 'saul', password: 'test', role: UserRole.NORMAL },
  { email: 'comet@inabase.com', name: 'comet', password: 'test', role: UserRole.NORMAL },
  { email: 'admin@inabase.com', name: 'admin', password: 'test', role: UserRole.ADMIN },
];

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    await userRepository.clear();

    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      const user = new User();

      user.name = data.name;
      user.email = data.email;
      user.password = await argon2.hash(data.password);
      user.deleted = false;
      user.role = data.role;

      await userRepository.save(user);
    }
  }
}
