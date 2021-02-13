
import all from './posts/*.md';

export default all
  .sort((a, b) => new Date(b.date) - new Date(a.date));