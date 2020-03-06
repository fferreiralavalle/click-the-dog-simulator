import {combineReducers} from 'redux'
import variables from './GameVariables';
import mails from './Mails';

export default combineReducers({
    variables,
    mails
})