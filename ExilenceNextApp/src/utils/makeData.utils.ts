import namor from 'namor';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: string;
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Person => {
  const statusChance = Math.random();
  return {
    firstName: namor.generate({ words: 1, saltLength: 0 }),
    lastName: namor.generate({ words: 1, saltLength: 0, subset: 'manly' }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status: statusChance > 0.66 ? 'relationship' : statusChance > 0.33 ? 'complicated' : 'single',
  };
};

export interface PersonData extends Person {
  subRows?: PersonData[];
}

export function makeData(...lens: number[]): PersonData[] {
  const makeDataLevel = (depth = 0): PersonData[] => {
    const len = lens[depth];
    return range(len).map((_) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
