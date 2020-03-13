import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './timeWizard.css'

import {selecters, actions} from '../../../reducers/GameVariables'

import ids from '../../../game/VariableId'
import GameManager from '../../../game/GameManager'
import {toFormat, clearPluses, toFormatTime} from '../../../utils/uiUtil'
import { PetPetting } from '../../../game/products/PetPetting'
import ProductPlus, { plusCurrency } from '../ProductPlus'
import { Currency } from '../../../game/products/Product'
import LevelUpButton from '../LevelUpButton'
import Decimal from 'break_infinity.js'

interface IRecipeProps {
  turboTime: number
  patiencePoints: Decimal
  dispatch: Function
}

interface IState {
  isHover: boolean;
  plusCurrencies: Array<plusCurrency>
  hoverLevel: boolean
}

class TimeWizard extends Component<IRecipeProps,IState> {

  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      plusCurrencies: [],
      hoverLevel: false
    }
  }

  onCurrencyGain = (currency: Currency) => {
    if (!currency.currency.equals(0)){
      let x = (10+Math.random() * 50)+"%"
      let y = (60+Math.random() * 40)+"%"
      let plusCurrency:plusCurrency = {
        value: ('+'+toFormat(currency.currency)),
        key: Date.UTC.toString()+(Math.random()),
        x,
        y,
        className:'love-icon',
        size: 1
      }
      this.addPlusCurrency(plusCurrency)
    }
    if (!currency.treats.equals(0)){
        let x = (10+Math.random() * 50)+"%"
        let y = (60+Math.random() * 40)+"%"
        const plusCurrency:plusCurrency = {
        value: ('+'+toFormat(currency.treats)),
        key: Date.UTC.toString()+(Math.random()),
        x,
        y,
        className:'treat-icon',
        size: 1
      }
      this.addPlusCurrency(plusCurrency)
    } 
  }

  addPlusCurrency = (pc: plusCurrency) => {
    this.setState({
      plusCurrencies: [...this.state.plusCurrencies,pc]
    })
  }

  onHover = (isHover: boolean) => () => {
    this.setState({
      isHover
    })
  }

  levelup = () => () => {
    GameManager.getInstance().getProductManager().levelUpProduct(ids.product0Level)
    this.props.dispatch(actions.updateVariables())
  }

  onLevelHover = (hoverLevel:boolean)=>()=> {
    this.setState({
      hoverLevel
    })
  }
  
  render(){
    const {isHover, plusCurrencies} = this.state;
    return (
      <div className="product product3 boxed" 
        onMouseEnter={this.onHover(true)}
        onMouseLeave={this.onHover(false)}>
        {isHover ? this.renderHighlight() : this.renderContent()}
        <ProductPlus plusCurrencies={plusCurrencies}/>
      </div>
    )
  }

  renderContent(){
    const {turboTime} = this.props;
    const tickTime = GameManager.getInstance().getTimeManager().getTickTime()
    const turboClass =  turboTime>=tickTime ? "petted" : ""
    return (
      <React.Fragment>
        <div className={"product3-building "+turboClass}/>
          <div className="product3-title">
            <p className="product3-title-text">Wizpug</p>
          </div>
          {turboTime>=tickTime &&
          <div className="product3 turbo-time">
              <p>{toFormatTime(turboTime)}</p>
          </div>}
      </React.Fragment>
    )
  }

  renderHighlight(){
    const levelClass = this.state.hoverLevel ? " hover-level" : ""
    
    return (
      <div className={"highlight "+levelClass}>
        <div className="highlight-section">
          {this.renderTurboButton(3600)}
          <div className="highlight-field">
            Good day young human, let me speed things up with my powerful magic.
          </div>
        </div>
      </div>
    )
  }

  renderTurboButton(turboTimePrice:number){
    const turboToHours = toFormat(turboTimePrice / 3600)
    const price = GameManager.getInstance().getTimeManager().getPatiencePoints(turboTimePrice)
    const priceFormat = toFormat(price)
    const {turboTime, patiencePoints} = this.props
    const canBuyClass = patiencePoints.gte(price) ? "" : "disabled"
    return(
        <div className={"highlight-store-button "+canBuyClass} onClick={()=>this.onTurboBuy(price)}>
            <div className="highlight-store-name">+{turboToHours} h</div>
            <div className="highlight-store-price">{priceFormat}<div className="patience-icon"/></div>
        </div>
    )
  }

  onTurboBuy(price:Decimal){
      GameManager.getInstance().buyTurboTime(price)
  }
}

const mapStateToProps = (state:any) => ({
  turboTime: selecters.getVariable(state, ids.turboTimeLeft).getValue(),
  patiencePoints: selecters.getVariable(state, ids.patiencePoints).getValue(),
})

export default connect(mapStateToProps)(TimeWizard);