import React, {Component, Fragment} from 'react'
import { connect } from 'react-redux'
import './game.css'

import {selecters, actions} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import GameManager from '../../game/GameManager'
import { Variable } from '../../game/Variables'

import Currencies from '../../components/currencies/Currencies'
import SaveManager from '../../components/saveManager/SaveManager'
import Box from '../../components/box/Box'
import Doggie from '../../components/doggie/Doggie'
import Product0 from '../../components/products/product0/Product0'
import Product1 from '../../components/products/product1/Product1'

interface IRecipeProps {
    dispatch: Function
    currency: Variable
}

class Game extends Component<IRecipeProps> {

    constructor(props:any){
        super(props)
        this.state = {
            plusCurrencies: []
        }
    }

    componentDidMount(){
        this.props.dispatch(actions.updateVariables())
        GameManager.getInstance().initializeUI()
        
    }

    renderProducts(){
        const products = GameManager.getInstance().getProductManager().getAvailableProducts();
        return products.map((p,i)=>{
            switch (p.variableId){
                case ids.product1Level:
                    return <Box productId={p.variableId} w={2}><Product1/></Box>
                default:
                    return <Box productId={p.variableId} w={1}><Product0/></Box>
            }
        })
    }

    render(){
        return (
        <div className="game">
            <div className="game-header">
                <Currencies/>
                <SaveManager/>
            </div>
            <div className="product-list">
                <Box><Doggie/></Box>
                {this.renderProducts()}
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency)
})

export default connect(mapStateToProps)(Game);