export const generateGroupName = () => {
  const prefixes = ['Divine', 'Strong', 'Swift', 'Rich', 'Humble', 'Fine'];
  const suffixes = [
    'Exiles',
    'Slayers',
    'Assassins',
    'Duelists',
    'Witches',
    'Farmers',
    'Grinders',
    'Templars',
  ];

  return (
    prefixes[Math.floor(Math.random() * prefixes.length)] +
    suffixes[Math.floor(Math.random() * suffixes.length)] +
    randomIntFromInterval(100, 999)
  );
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
