import React, {Component} from 'react'
import { connect } from 'react-redux'
import './product1.css'

import {selecters, actions} from '../../../reducers/GameVariables'
import ids from '../../../game/VariableId'

import {TimeSubscriber} from '../../../game/TimeManager'
import variableIds from  '../../../game/VariableId'
import { Variable } from '../../../game/Variables'

interface IRecipeProps {
  level: Variable;
}

class Product1 extends Component<IRecipeProps> {


  render(){
    const {level} = this.props;
    return (
      <div className="product product1 boxed">
        <div className="product1-building">
        </div>
        <div className="product-level">
            {level.getValue()}
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.product1Level)
})

export default connect(mapStateToProps)(Product1);