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
          },5 * 1000)
    }

    onClickedDog(event:any){
        const earned = GameManager.getInstance().onClickedDog()
        this.props.dispatch(actions.updateVariables())
        this.plusCurrencyEffect(earned.currency, event)
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

    plusCurrencyEffect(earned: number, e:any){
        const currencies = [...this.state.plusCurrencies]
        var rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.
        const plus :plusCurrency= {
            value: "+"+toFormat(earned),
            key: (new Date).toString()+(Math.random()),
            x: x+"px",
            y: y+"px",
            className:"love-icon",
            size: (1 + Math.random() * 0.25)

        }
        currencies.push(plus)
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
                <div className="doggie-name">{dogName?.getValue()}</div>
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