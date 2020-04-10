import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './museum.css'

import {selecters, actions} from '../../../reducers/GameVariables'

import { Variable } from '../../../game/Variables'
import ids from '../../../game/VariableId'
import GameManager from '../../../game/GameManager'
import { toFormat } from '../../../utils/uiUtil'
import { plusCurrency } from '../ProductPlus'
import { Currency } from '../../../game/products/Product'
import LevelUpButton from '../LevelUpButton'
import ProductPlusDog from '../ProductPlusDog'
import { Museum } from '../../../game/products/Museum'
import { getText } from '../../../utils/textUtil'

interface IRecipeProps {
  level: Variable
  dispatch: Function
}

interface IState {
  isHover: boolean;
  hoverLevel: boolean
}

class Product0 extends Component<IRecipeProps,IState> {
  commonText = getText().products.common
  currencyText = getText().currencies
  productText = getText().products.museum

  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      hoverLevel: false
    }
    const product = GameManager.getInstance().getProductManager().getProduct(ids.museum) as Museum
    product.subscribeToCurrency({
      id: 'UIOnCurrency',
      onCurrency: (result:Currency) => this.onCurrencyGain(result),
    })
  }

  onCurrencyGain = (currency: Currency) => {
    const pluses = this.refs.plusLove as ProductPlusDog
    
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
      if (pluses)
        pluses.addCurrency(plusCurrency)
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
      if (pluses)
        pluses.addCurrency(plusCurrency)
    } 
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
    const {isHover} = this.state;
    return (
      <div className="product museum boxed" 
        onMouseEnter={this.onHover(true)}
        onMouseLeave={this.onHover(false)}>
        {this.renderContent()}
        {isHover ? this.renderHighlight() : null}
        <LevelUpButton productId={ids.museum} 
          onMouseEnter={this.onLevelHover(true)}
          onMouseLeave={this.onLevelHover(false)}/>
        <ProductPlusDog ref="plusLove"/>
      </div>
    )
  }

  renderContent(){
    const {level} = this.props;
    return (
      <React.Fragment>
        <div className="museum-building"></div>
          <div className="product3-title">
            <p className="product3-title-text">{this.productText.title}</p>
          </div>
          <div className="product-level">
            {level.getValue()}
          </div>
          
      </React.Fragment>
    )
  }

  renderHighlight(){
    const product = GameManager.getInstance().getProductManager().getProduct(ids.museum) as Museum
    const {level} = this.props
    const usedLevel:number = level.getValue() + (this.state.hoverLevel ? 1 : 0)
    const lps = toFormat(product.updateCurrencyPerSecond(usedLevel, true).currency)
    const thropiesLove = toFormat(product.getCurrencyPerArchivement(usedLevel))
    const timeIncrease = Math.floor(product.getTimePassedMult() * 100) + '%'
    const levelClass = this.state.hoverLevel ? " hover-level" : ""
    return (
      <div className={"highlight "+levelClass}>
        <div className="highlight-section">
          <div className="highlight-field">
            <div className="highlight-attribute">{this.currencyText.love}</div>
            <div className="highlight-value">
              {lps}/s
              <div className="highlight-love-icon"/>
            </div>
          </div>
          <div className="highlight-field">
            <div className="highlight-attribute">{this.productText.perArchivement}</div>
            <div className="highlight-value">
              {thropiesLove}
              <div className="highlight-love-icon"/>
            </div>
          </div>
          <div className="highlight-field">
            <div className="highlight-attribute">{this.productText.timeMult}</div>
            <div className="highlight-value">
              {timeIncrease}
            </div>
          </div>
          <div className="highlight-field">
            {this.productText.description}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.museum)
})

export default connect(mapStateToProps)(Product0);