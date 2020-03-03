import React, {Component} from 'react'
import { connect } from 'react-redux'
import './currencies.css'

import {selecters} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import { Variable } from '../../game/Variables'

import {toFormat} from '../../utils/uiUtil'

interface IRecipeProps {
    currency: number;
    treats: number;
}

class Currencies extends Component<IRecipeProps> {


  render(){
    const {currency, treats} = this.props;
    const currencyUnits = toFormat(Math.floor(currency))
    const treatsUnits = toFormat(Math.floor(treats))
    return (
      <div className="currencies">
          <div className="currencies-love">
            <span className="currencies-love-value">{currencyUnits.toUpperCase()}</span>
            <div className="currencies-love-icon"/>
          </div>
          {
            (<div className="currencies-love">
              <span className="currencies-love-value">{treatsUnits.toUpperCase()}</span>
            <div className="treat-icon"/>
            </div>)
          }
      </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency)?.getValue(),
  treats: selecters.getVariable(state, ids.treats)?.getValue()
})

export default connect(mapStateToProps)(Currencies);