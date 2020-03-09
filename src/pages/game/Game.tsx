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
import Laboratory from '../../components/products/Laboratory/Laboratory'
import Mail from '../../components/mail/Mail'
import TimeWizard from '../../components/products/timeWizard/TimeWizard'

interface IRecipeProps {
    dispatch: Function
    currency: Variable
    dogWizard: Variable
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
                case ids.product2Level:
                    return <Box productId={p.variableId} w={2}><Laboratory/></Box>
                case ids.product3Level:
                    return <Box w={1}><TimeWizard/></Box>
                default:
                    return <Box productId={p.variableId} w={1}><Product0/></Box>
            }
        })
    }

    render(){
        const {dogWizard} = this.props
        return (
        <div className="game">
            <div className="game-header">
                <Currencies/>
                <Mail/>
                <SaveManager/>
            </div>
            <div className="product-list">
                <Box><Doggie/></Box>
                {dogWizard?.getValue()>0 && <Box w={1}><TimeWizard/></Box>}
                {this.renderProducts()}
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency),
  dogWizard: selecters.getVariable(state, ids.product3Level)
})

export default connect(mapStateToProps)(Game);