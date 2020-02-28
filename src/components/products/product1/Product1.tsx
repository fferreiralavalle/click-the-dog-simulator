import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './product1.css'

import {selecters, actions} from '../../../reducers/GameVariables'
import ids from '../../../game/VariableId'

import {TimeSubscriber} from '../../../game/TimeManager'
import variableIds from  '../../../game/VariableId'
import { Variable } from '../../../game/Variables'
import GameManager from '../../../game/GameManager'
import { PetAppreciationCenter, RewardResult } from '../../../game/products/PetAppreciationCenter'
import LevelUpButton from '../LevelUpButton'
import ProductPlus, {plusCurrency} from '../ProductPlus'
import { CurrencySubscriber, Currency } from '../../../game/products/Product'
import { toFormat, clearPluses } from '../../../utils/uiUtil'

interface IRecipeProps {
  level: Variable;
  progress: Variable
}

interface IState {
  isHover: boolean;
  plusCurrencies: Array<plusCurrency>
}

class Product1 extends Component<IRecipeProps, IState> {
  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      plusCurrencies: [],
    }
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product1Level) as PetAppreciationCenter
    product.subscribeToReward({
      id: 'UIOnReward',
      onReward: (result:RewardResult) => this.onEventReward(result),
    })
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

  onEventReward = (result:RewardResult)=> {
    const x = (10+Math.random() * 50)+"%"
    const y = (30+Math.random() * 50)+"%"
    const plusCurrency:plusCurrency = {
      value: ('+'+toFormat(result.currencyReward.currency)),
      key: Date.UTC.toString()+(Math.random()),
      x,
      y,
      className:'currency-plus-icon',
      size: 1.5
    }
    this.addPlusCurrency(plusCurrency)
  }

  onCurrencyGain = (currency: Currency) => {
    const x = (10+Math.random() * 50)+"%"
    const y = (30+Math.random() * 50)+"%"
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

  render(){
    const {level, progress} = this.props;
    const {plusCurrencies} = this.state
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product1Level) as PetAppreciationCenter
    const progressStyle = {
      flex: `${progress.getValue()/product.getProgressGoal()} 1`
    }
    return (
      <div className="product product1 boxed">
        <div className="product1-building">
        </div>
        <div className="product-level">
            {level.getValue()}
          </div>
        <div className="product1-title">
          Pet Farm
        </div>
        <div className="progress-bar">
          <div className="progress-bar-progress" style={progressStyle}></div>
          <div className="progress-bar-value">
            {`${Math.floor(progress.getValue())} / ${Math.floor(product.getProgressGoal())}`}
          </div>
        </div>
        <ProductPlus plusCurrencies={plusCurrencies}/>
        <LevelUpButton productId={ids.product1Level}></LevelUpButton>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.product1Level),
  progress: selecters.getVariable(state, ids.product1Progress),
})

export default connect(mapStateToProps)(Product1);