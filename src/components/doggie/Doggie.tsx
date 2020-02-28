import React, {Component} from 'react'
import { connect } from 'react-redux'
import './doggie.css'

import {selecters, actions} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import GameManager from '../../game/GameManager'
import { Variable } from '../../game/Variables'

interface plusCurrency {
    value: string,
    key: string,
    x: number,
    y: number
}

interface IRecipeProps {
    dogName: Variable;
    dispatch: Function;
}

interface IState {
    isHover: boolean;
    plusCurrencies: Array<plusCurrency>
}

class Doggies extends Component<IRecipeProps,IState> {

    constructor(props:any){
        super(props)
        this.state = {
            isHover: false,
            plusCurrencies: []
        }
    }

    onClickedDog(event:any){
        const earned = GameManager.getInstance().onClickedDog()
        this.props.dispatch(actions.updateVariables())
        this.plusCurrencyEffect(earned.currency, event)
    }

    renderPlusCurrencies(){
        const currencies = [...this.state.plusCurrencies]
        const plusCurrencies = currencies.map((c,i)=>{
            const style= {
                top: c.y,
                left: c.x
            }
            return (
                <div className="plus-currency" style={style} key={c.key}>
                    {c.value}
                    <div className="plus-currency-icon"/>
                </div>
            )
        })
        return plusCurrencies;
    } 

    plusCurrencyEffect(earned: number, e:any){
        const currencies = [...this.state.plusCurrencies]
        var rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.
        const plus = {
            value: "+"+earned,
            key: (new Date).toString()+(Math.random()),
            x: x,
            y: y
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
        return (
            <div className="doggie-background boxed">
                <div className="doggie">
                    <div className="doggie-plus">
                        {this.renderPlusCurrencies()}
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