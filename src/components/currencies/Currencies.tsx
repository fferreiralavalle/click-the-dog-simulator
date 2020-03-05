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
    farmLvl: number
}

class Currencies extends Component<IRecipeProps> {


  render(){
    const {currency, treats, farmLvl} = this.props;
    const currencyUnits = toFormat(Math.floor(currency))
    const treatsUnits = toFormat(Math.floor(treats))
    return (
      <div className="currencies">
          <div className="currencies-love">
            <span className="currencies-love-value">{currencyUnits.toUpperCase()}</span>
            <div className="currencies-love-icon"/>
          </div>
          {farmLvl>=5 &&
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
  treats: selecters.getVariable(state, ids.treats)?.getValue(),
  farmLvl: selecters.getVariable(state, ids.product1Level)?.getValue(),
})

export default connect(mapStateToProps)(Currencies);