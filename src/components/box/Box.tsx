import React, {Component} from 'react'
import { connect } from 'react-redux'
import './box.css'

import {selecters, actions} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import GameManager from '../../game/GameManager'
import { Variable } from '../../game/Variables'

import {toFormat} from '../../utils/uiUtil'

interface IRecipeProps {
    productId?: string
    children?: React.ReactChild | Element
    h?: number
    w?: number
    dispatch: Function;
}

interface IState {
    plusCurrencies: any;
}

const boxBase = 250;

class Box extends Component<IRecipeProps,IState> {

    constructor(props:any){
        super(props)
        this.state = {
            plusCurrencies: []
        }
        this.unlockProduct = this.unlockProduct.bind(this)
    }

    componentDidMount(){

    }

    unlockProduct(){
        const {productId} = this.props;
        const res = productId && GameManager.getInstance().getProductManager().levelUpProduct(productId)
    }

    render(){
        const {productId, children, h=1,w=1} = this.props;
        const product = productId && GameManager.getInstance().getProductManager().getProduct(productId)
        const productLevel = product && product.getLevel()
        const canLevelUp = product && product.canLevelUp()
        const levelUpPrice = product && toFormat(product.getLevelUpPrice().currency)
        const showHidden = !productLevel && product
        const style = {
            width: `${w*boxBase}px`, 
            height: `${h*boxBase}px`
        } 
        return (
            <div className={`product-box ${showHidden && 'hide-overflow'}`} style={style}>
                {showHidden ? 
                <div className='product-hidden'>
                    <div className="product-level-up-price">
                        <span className="product-level-up-value">{levelUpPrice}</span>
                        <div className="product-level-up-icon"/>
                    </div>
                    <button disabled={!!!canLevelUp} className="product-unlock" onClick={this.unlockProduct}>Buy</button>
                </div> : children}
            </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency)
})

export default connect(mapStateToProps)(Box);