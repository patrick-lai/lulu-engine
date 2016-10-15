import endPoints from './endPoints';
import championActions from './championActions';
import itemActions from './itemActions';
import skillActions from './skillActions';
import runeActions from './runeActions';

var allActions = {
  ...endPoints,
  ...championActions,
  ...itemActions,
  ...skillActions,
  ...runeActions
};

module.exports = allActions;
