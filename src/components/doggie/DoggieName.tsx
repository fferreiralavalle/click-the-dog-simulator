import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../products/product.css'
import './doggie.css'

import {selecters, actions} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import GameManager from '../../game/GameManager'
import { Variable } from '../../game/Variables'
import {toFormat, clearPluses} from '../../utils/uiUtil'
import ProductPlus, { plusCurrency } from '../products/ProductPlus'
import { Currency } from '../../game/products/Product'

interface IRecipeProps {
    onClick?: Function
    dogName: string
    dispatch: Function
}

interface IState {
    isHover: boolean;
}

class DoggieName extends Component<IRecipeProps,IState> {

    petTimeout: any

    constructor(props:any){
        super(props)
        this.state = {
            isHover: false
        }
        this.petTimeout = null
    }

    onMouseChange(isIn: boolean){
        this.setState({
            isHover: isIn
        })
    }

    onNameChange(name: string):void {
        GameManager.getInstance().setVariable(name, ids.dogName)
        this.props.dispatch(actions.updateVariables())
    }

    render(){
        const {isHover} = this.state
        const {dogName} = this.props
        const hasName = !!dogName && dogName!==""
        return (
            <div className="doggie-tag"
                onMouseEnter={()=>this.onMouseChange(true)}
                onMouseLeave={()=>this.onMouseChange(false)}>
                {isHover ? 
                <input 
                    className="doggie-name" 
                    value={dogName}
                    onChange={(e)=>this.onNameChange(e.target.value)}/>
                    :
                <div className="doggie-name">{hasName? dogName : "What's my name?"}</div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
    dogName: selecters.getVariable(state, ids.dogName)?.getValue(),
})
  
  export default connect(mapStateToProps)(DoggieName);