import React, {Component} from 'react'
import { connect } from 'react-redux'
import './product.css'

import {selecters} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import { Variable } from '../../game/Variables'
import { isMobile } from '../../utils/uiUtil'

interface IRecipeProps {
    plusCurrencies: Array<plusCurrency>;
    [key: string]: any
}

export interface plusCurrency {
    value: string,
    key: string,
    x: string,
    y: string,
    size: number,
    className: string
}

interface IState {
    plusCurrencies: Array<plusCurrency>
}

class Currencies extends Component<IRecipeProps, IState> {
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
        const {plusCurrencies, ...rest} = this.props
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

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency)
})

export default connect(mapStateToProps)(Currencies);