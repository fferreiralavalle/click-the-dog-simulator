import React, {Component} from 'react'
import { connect } from 'react-redux'

import {selecters, actions} from '../../../reducers/GameVariables'
import ids from '../../../game/VariableId'

import {TimeSubscriber} from '../../../game/TimeManager'
import variableIds from  '../../../game/VariableId'
import { Variable } from '../../../game/Variables'

interface IRecipeProps {
  level: Variable;
}

class Product0 extends Component<IRecipeProps> {


  render(){
    const {level} = this.props;
    return (
      <div className="product">
        {level?.value}
      </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.product0Level)
})

export default connect(mapStateToProps)(Product0);