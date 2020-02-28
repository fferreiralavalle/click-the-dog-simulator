import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './product0.css'

import {selecters, actions} from '../../../reducers/GameVariables'

import {TimeSubscriber} from '../../../game/TimeManager'
import { Variable } from '../../../game/Variables'
import ids from '../../../game/VariableId'
import GameManager from '../../../game/GameManager'
import {toFormat, clearPluses} from '../../../utils/uiUtil'
import { PetPetting } from '../../../game/products/PetPetting'
import ProductPlus, { plusCurrency } from '../ProductPlus'
import { Currency } from '../../../game/products/Product'

interface IRecipeProps {
  level: Variable
  currency: Variable
  dispatch: Function
}

interface IState {
  isHover: boolean;
  plusCurrencies: Array<plusCurrency>
}

class Product0 extends Component<IRecipeProps,IState> {

  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      plusCurrencies: []
    }
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product0Level) as PetPetting
    product.subscribeToCurrency({
      id: 'UIOnCurrency',
      onCurrency: (result:Currency) => this.onCurrencyGain(result),
    })
    setInterval(()=>{
      const newPlus = clearPluses(this.state.plusCurrencies)
      this.setState({
        plusCurrencies: newPlus
      })
    },5 * 1000)
  }

  onCurrencyGain = (currency: Currency) => {
    const x = (10+Math.random() * 50)+"%"
    const y = (60+Math.random() * 40)+"%"
    const plusCurrency:plusCurrency = {
      value: ('+'+toFormat(currency.currency)),
      key: Date.UTC.toString()+(Math.random()),
      x,
      y,
      className:'currency-plus-icon',
      size: 1
    }
    this.addPlusCurrency(plusCurrency)
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
  
  render(){
    const {isHover, plusCurrencies} = this.state;
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product0Level)
    const canLevelUp = product.canLevelUp()
    const levelUpPrice = toFormat(product.getLevelUpPrice().currency)
    return (
      <div className="product product0 boxed" 
        onMouseEnter={this.onHover(true)}
        onMouseLeave={this.onHover(false)}>
        {isHover ? this.renderHighlight() : this.renderContent()}
        <div className={`product-upgrade ${!canLevelUp && "disabled"}`} onClick={this.levelup()}>
          {levelUpPrice}
          <div className="highlight-love-icon"/>
        </div>
        <ProductPlus plusCurrencies={plusCurrencies}/>
      </div>
    )
  }

  renderContent(){
    const {level} = this.props;
    return (
      <React.Fragment>
        <div className="product0-building"></div>
          <div className="product0-title">
            <p className="product0-title-text">Divine Petting</p>
          </div>
          <div className="product-level">
            {level.getValue()}
          </div>
      </React.Fragment>
    )
  }

  renderHighlight(){
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product0Level) as PetPetting
    const lps = toFormat(product.getCurrencyPerSecond().currency)
    const petPow = toFormat(product.getCurrencyPerPet(product.getLevel()).currency)
    return (
      <div className="highlight">
        <div className="highlight-field">
          <div className="highlight-attribute">LPS</div>
          <div className="highlight-value">
            {lps}
            <div className="highlight-love-icon"/>
          </div>
        </div>
        <div className="highlight-field">
          <div className="highlight-attribute">Pet Pow</div>
          <div className="highlight-value">
            {petPow}
            <div className="highlight-love-icon"/>
          </div>
        </div>
        <div className="highlight-field">
          Commands the Divine Forces from far away to pet your beautiful doggos.
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.product0Level),
  currency: selecters.getVariable(state, ids.currency)
})

export default connect(mapStateToProps)(Product0);