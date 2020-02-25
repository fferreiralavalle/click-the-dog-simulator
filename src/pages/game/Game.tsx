import React, {Component} from 'react'
import { connect } from 'react-redux'
import './game.css'

import {selecters, actions} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import GameManager from '../../game/GameManager'

import { Variable } from '../../game/Variables'
import Currencies from '../../components/currencies/Currencies'

interface IRecipeProps {
    dispatch: Function,
    currency: Variable
}

class Game extends Component<IRecipeProps> {

    componentDidMount(){
        this.props.dispatch(actions.updateVariables())
        GameManager.getInstance().initializeUI()
    }

    onClickedDog(){
        GameManager.getInstance().onClickedDog()
        this.props.dispatch(actions.updateVariables())
    }

    render(){
        return (
        <div className="game">
            <Currencies/>
            <div className="doggie" onClick={()=>this.onClickedDog()}/>
        </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency)
})

export default connect(mapStateToProps)(Game);