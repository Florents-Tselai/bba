import { Connection, Repository } from 'typeorm';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

// see https://github.com/typeorm/typeorm/issues/1550#issuecomment-381039669

export async function loadFixtures(
  name: string,
  dbConnection: Connection,
): Promise<any> {
  let items: any[] = [];
  try {
    const file: any = yaml.safeLoad(
      fs.readFileSync(`../../test/fixtures/${name}.yml`, 'utf8'),
    );
    items = file['fixtures'];
  } catch (e) {
    console.log('fixtures error', e);
  }

  if (!items) {
    return;
  }

  items.forEach(async (item: any) => {
    const entityName = Object.keys(item)[0];
    const data = item[entityName];
    await dbConnection
      .createQueryBuilder()
      .insert()
      .into(entityName)
      .values(data)
      .execute();
  });
}
