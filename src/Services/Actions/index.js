import endpoints from './endpoints';
import championActions from './championActions';
import itemActions from './itemActions';
import skillActions from './skillActions';
import runeActions from './runeActions';

var allActions = {
  ...endpoints,
  ...championActions,
  ...itemActions,
  ...skillActions,
  ...runeActions
};

module.exports = allActions;
