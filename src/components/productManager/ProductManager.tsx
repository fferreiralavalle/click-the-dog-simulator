import React, {Component} from 'react'
import { connect } from 'react-redux'

import {selecters, actions} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import GameManager from '../../game/GameManager'
import Product0 from '../products/product0/Product0'

import { Variable } from '../../game/Variables'

interface IRecipeProps {
    dispatch: Function,
    currency: Variable
}

class ProductManager extends Component<IRecipeProps> {

    componentDidMount(){
        this.props.dispatch(actions.updateVariables())
    }

    render(){
        const {currency} = this.props
        return (
        <div className="product-manager">
            {Math.floor(currency?.value)}
            {this.renderProducts()}
        </div>
        )
    }

    renderProducts(): Array<any>{
        return [
            <Product0 key={0}/>
        ]
    }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency)
})

export default connect(mapStateToProps)(ProductManager);