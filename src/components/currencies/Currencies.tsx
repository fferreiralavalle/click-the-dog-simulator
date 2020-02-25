import React, {Component} from 'react'
import { connect } from 'react-redux'
import './currencies.css'

import {selecters, actions} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import {TimeSubscriber} from '../../game/TimeManager'
import variableIds from  '../../game/VariableId'
import { Variable } from '../../game/Variables'

interface IRecipeProps {
    currency: Variable;
}

class Currencies extends Component<IRecipeProps> {


  render(){
    const {currency} = this.props;
    return (
      <div className="currencies">
          <div className="currencies-love">
            <div className="currencies-love-icon"/>
            <span className="currencies-love-value">{currency?.value}</span>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency)
})

export default connect(mapStateToProps)(Currencies);