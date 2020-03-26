import {combineReducers} from 'redux'
import variables from './GameVariables';
import mails from './Mails';
import uiUtils from './uiUtils';

export default combineReducers({
    variables,
    mails,
    uiUtils,
})