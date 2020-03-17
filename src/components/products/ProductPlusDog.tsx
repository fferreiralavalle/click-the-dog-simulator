import React, {Component} from 'react'
import { connect } from 'react-redux'
import './product.css'

import {selecters} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import { clearPluses } from '../../utils/uiUtil'
import { plusCurrency } from './ProductPlus'

interface IRecipeProps {
    [key: string]: any
}

interface IState {
    plusCurrencies: Array<plusCurrency>
}

export class productPlusInterface extends Component<IRecipeProps, IState>{
    addCurrency(plusCurrency: plusCurrency){
        let newPluses = [...this.state.plusCurrencies, plusCurrency]
        newPluses = clearPluses(newPluses)
        this.setState({
            plusCurrencies: newPluses
        })
    }
}

class ProductPlusDog extends productPlusInterface {
    constructor(props:any){
        super(props)
        this.state = {
            plusCurrencies: []
        }
    }

    componentWillReceiveProps(nextProps:any) {
        const {plusCurrencies} = nextProps
        if (plusCurrencies){
            this.setState({
                plusCurrencies
            });
        }
    }

    render(){
        const {plusCurrencies, ref, ...rest} = this.props
        return (
        <div className="plus-currencies" {...rest}>
            {this.renderPlusCurrencies()}
        </div>
        )
    }

    renderPlusCurrencies(){
        const currencies = [...this.state.plusCurrencies]
        const plusCurrencies = currencies.map((c,i)=>{
            const style= {
                top: c.y,
                left: c.x,
                fontSize: `${c.size * 18}px`,
                zIndex: c.size * 2
            }
            return (
                <div className="plus-currency" style={style} key={c.key}>
                    {c.value}
                    <div className={c.className}/>
                </div>
            )
        })
        return plusCurrencies;
    } 
}

export default ProductPlusDog;