import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Show } from './show.entity';

const datas = [
  { title: 'Breaking Bed', tags: ['Drama'] },
  { title: 'Battlestar Galactica', tags: ['Drama'] },
  { title: 'Merlin', tags: ['Drama'] },
  { title: 'Caprica', tags: ['Drama'] },
  { title: 'DoctorWho', tags: ['Drama'] },
  { title: 'Better call Saul', tags: ['Drama'] },
];

export default class ShowSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const showRepository = dataSource.getRepository(Show);
    await showRepository.clear();

    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      const show = new Show();

      show.deleted = false;
      show.tags = data.tags;
      show.title = data.title;

      await showRepository.save(show);
    }
  }
}
