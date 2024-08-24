import { AddonGameParams } from '../types';
import base from './addons/base';
import leaders from './addons/leaders';
import cities from './addons/cities';
import armada from './addons/armada';
import edifice from './addons/edifice';

export const BASE_GAME: AddonGameParams = base;
export const ADDONS: AddonGameParams[] = [leaders, cities, armada, edifice];
