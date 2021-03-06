import endPoints from './endPoints';
import championActions from './championActions';
import itemActions from './itemActions';
import skillActions from './skillActions';
import runeActions from './runeActions';
import statsActions from './statsActions';

var allActions = {
  ...endPoints,
  ...championActions,
  ...itemActions,
  ...skillActions,
  ...runeActions,
  ...statsActions
};

module.exports = allActions;
