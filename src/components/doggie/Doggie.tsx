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
    dogName: Variable;
    dispatch: Function;
}

interface IState {
    isHover: boolean;
    plusCurrencies: Array<plusCurrency>
    isPetted: boolean
}

class Doggies extends Component<IRecipeProps,IState> {

    petTimeout: any

    constructor(props:any){
        super(props)
        this.state = {
            isHover: false,
            plusCurrencies: [],
            isPetted: false
        }
        this.petTimeout = null
        setInterval(()=>{
            const newPlus = clearPluses(this.state.plusCurrencies)
            this.setState({
              plusCurrencies: newPlus
            })
          },3 * 1000)
    }

    onClickedDog(event:any){
        const earned = GameManager.getInstance().onClickedDog()
        this.props.dispatch(actions.updateVariables())
        this.plusCurrencyEffect(earned, event)
        this.setState({
            isPetted: true
        })
        clearTimeout(this.petTimeout)
        this.petTimeout = setTimeout(()=>{
            this.setState({
                isPetted: false
            })
        }, 100)
    }

    plusCurrencyEffect(earned: Currency, e:any){
        const currencies = [...this.state.plusCurrencies]
        var rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.
        let plus :plusCurrency= {
            value: "+"+toFormat(earned.currency),
            key: (new Date).toString()+(Math.random()),
            x: x+"px",
            y: y+"px",
            className:"love-icon",
            size: (1 + Math.random() * 0.25)

        }
        currencies.push(plus)
        if (!earned.treats.equals(0)){
            plus.value = "+"+toFormat(earned.treats)
            plus.key = (new Date).toString()+(Math.random())
            plus.size = (1 + Math.random() * 0.25)
            plus.className = "treat-icon"
            plus.x = x-70+"px"
            currencies.push(plus)
        }
        this.setState({
            plusCurrencies: currencies
        })
    }

    onNameChange(name: string):void {
        GameManager.getInstance().setVariable(name, ids.dogName)
        this.props.dispatch(actions.updateVariables())
    }

    onMouseChange(isIn: boolean){
        this.setState({
            isHover: isIn
        })
    }

    render(){
        const {dogName} = this.props
        const {isPetted, plusCurrencies} = this.state
        const hasName = !!dogName && dogName.getValue()!==""
        return (
            <div className="doggie-background boxed">
                <div className={`doggie ${isPetted ? "petted": ""}`}>
                    <div className="doggie-plus">
                        {<ProductPlus plusCurrencies={plusCurrencies}/>}
                    </div>
                    <div className="doggie-click" onClick={(e)=>this.onClickedDog(e)}>
                </div>
            </div>
            <div className="doggie-tag"
                onMouseEnter={()=>this.onMouseChange(true)}
                onMouseLeave={()=>this.onMouseChange(false)}>
                {this.state.isHover ? 
                <input 
                    className="doggie-name" 
                    value={dogName?.getValue()}
                    onChange={(e)=>this.onNameChange(e.target.value)}/>
                    :
                <div className="doggie-name">{hasName? dogName.getValue() : "What's my name?"}</div>
                }
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency),
  dogName: selecters.getVariable(state, ids.dogName),
})

export default connect(mapStateToProps)(Doggies);