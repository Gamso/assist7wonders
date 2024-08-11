import { getScienceTotal } from '../../utils/science';

const cities = {
  name: 'Cities',
  maxPlayers: 7,
  wonders: ['Byzantium', 'Petra'],
  scores: [
    {
      id: 'debt',
      color: '#8F7B66',
      counters: [
        {
          id: 'debt',
          max: 0,
        },
      ],
    },
    {
      id: 'cities',
      color: '#545454',
      counters: [
        {
          id: 'cities',
          min: 0,
        },
      ],
    },
    {
      id: 'science',
      color: '#006118',
      counters: [
        {
          id: 'masks',
          min: 0,
          max: 10,
        },
      ],
      sum: getScienceTotal,
    },
  ],
};

export default cities;
