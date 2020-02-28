import React, {Component} from 'react'
import { connect } from 'react-redux'
import './product0.css'
import '../product.css'

import {selecters, actions} from '../../../reducers/GameVariables'

import {TimeSubscriber} from '../../../game/TimeManager'
import { Variable } from '../../../game/Variables'
import ids from '../../../game/VariableId'
import GameManager from '../../../game/GameManager'
import {toFormat} from '../../../utils/numberFormat'
import { PetPetting } from '../../../game/products/PetPetting'

interface IRecipeProps {
  level: Variable
  currency: Variable
  dispatch: Function
}

interface IState {
  isHover: boolean;
}

class Product0 extends Component<IRecipeProps,IState> {

  constructor(props:any){
    super(props)
    this.state = {
      isHover: false
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
  
  render(){
    const {isHover} = this.state;
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
      </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.product0Level),
  currency: selecters.getVariable(state, ids.currency)
})

export default connect(mapStateToProps)(Product0);