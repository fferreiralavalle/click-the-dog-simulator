import React, {Component} from 'react'
import { connect } from 'react-redux'
import './currencies.css'

import {selecters} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import { Variable } from '../../game/Variables'

import {toFormat} from '../../utils/numberFormat'

interface IRecipeProps {
    currency: Variable;
}

class Currencies extends Component<IRecipeProps> {


  render(){
    const {currency} = this.props;
    const currencyUnits = toFormat(Math.floor(currency?.value))
    return (
      <div className="currencies">
          <div className="currencies-love">
            <span className="currencies-love-value">{currencyUnits.toUpperCase()}</span>
            <div className="currencies-love-icon"/>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency)
})

export default connect(mapStateToProps)(Currencies);