import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';

interface Cat {
  name: string;
  subscriptionActive: boolean;
  breed: string;
  pouchSize: string;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cats: Cat[];
}

const POUCH_SIZES = ['A', 'B', 'C', 'D', 'E', 'F'];

function createCat(active?: boolean): Cat {
  return {
    name: faker.person.firstName(),
    subscriptionActive: active ?? Math.random() < 0.3,
    breed: faker.animal.cat(),
    pouchSize: faker.helpers.arrayElement(POUCH_SIZES),
  };
}

async function main() {
  const customers: Customer[] = [];

  for (let i = 0; i < 500; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const email = faker.internet.email({ firstName, lastName });

    const cats = [createCat(true)];

    // Exponentially decreases chances of multicat
    while (Math.random() < 0.2 && cats.length < 4) {
      cats.push(createCat());
    }

    customers.push({
      id: uuid(),
      firstName,
      lastName,
      email,
      cats,
    });
  }

  console.log(JSON.stringify(customers));
}

main();
