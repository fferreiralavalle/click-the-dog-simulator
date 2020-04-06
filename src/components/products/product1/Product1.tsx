import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './product1.css'

import {selecters} from '../../../reducers/GameVariables'
import ids from '../../../game/VariableId'

import {TimeSubscriber} from '../../../game/TimeManager'
import variableIds from  '../../../game/VariableId'
import { Variable } from '../../../game/Variables'
import GameManager from '../../../game/GameManager'
import { PetAppreciationCenter, RewardResult, events } from '../../../game/products/PetAppreciationCenter'
import LevelUpButton from '../LevelUpButton'
import ProductPlus, {plusCurrency} from '../ProductPlus'
import { Currency } from '../../../game/products/Product'
import { toFormat, clearPluses } from '../../../utils/uiUtil'
import ProductPlusDog from '../ProductPlusDog'

interface IRecipeProps {
  level: Variable;
  progress: Variable
  eventId: Variable
}

interface IState {
  isHover: boolean;
  plusCurrencies: Array<plusCurrency>
  hoverLevel: boolean
}

class Product1 extends Component<IRecipeProps, IState> {
  uiCleaner: any
  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      plusCurrencies: [],
      hoverLevel: false
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
  }

  componentWillUnmount(){
    clearInterval(this.uiCleaner)
  }

  onEventReward = (result:RewardResult)=> {
    const {eventId} = this.props;
    const x = (10+Math.random() * 30)+"%"
    const y = (30+Math.random() * 40)+"%"
    let value = ('+'+toFormat(result.currencyReward.currency))
    let className = 'love-icon'
    switch(eventId.getValue()){
      case events.pettingTraining.id:
        value = 'PET PARTY!'
        break
      case events.donationCampaign.id:
        value = '+'+toFormat(result.currencyReward.treats)
        className = 'treat-icon'
        break
    }
    const plusCurrency:plusCurrency = {
      value: value,
      key: Date.UTC.toString()+(Math.random()),
      x,
      y,
      className,
      size: 1.5
    }
    const pluses = this.refs.farmPlus as ProductPlusDog
    if (pluses)
      pluses.addCurrency(plusCurrency)
  }

  onCurrencyGain = (currency: Currency) => {
    const x = (10+Math.random() * 50)+"%"
    const y = (30+Math.random() * 50)+"%"
    const plusCurrency:plusCurrency = {
      value: ('+'+toFormat(currency.currency)),
      key: Date.UTC.toString()+(Math.random()),
      x,
      y,
      className:'love-icon',
      size: 1
    }
    const pluses = this.refs.farmPlus as ProductPlusDog
    if (pluses){
      pluses.addCurrency(plusCurrency)
    }
  }

  renderCurrentEvent = () => {
    const {eventId} = this.props
    const eventData = this.getEventData(eventId.getValue())
    return (<div className="event-title">{eventData.name}</div>)
  }

  getEventData= (eventId: string)=> {
    switch (eventId){
      case events.pettingTraining.id:
        return {
          name:"Petting Party!", 
          description: "Makes petting more efficient for some time (multiple instances at a time add up)"
        }
      case events.donationCampaign.id:
        return {
          name:"Treats Donation", 
          description: "Create a campagin for people to donate treats. Some dogs really like them! +1 Treats every 5 levels."
        }
      default:
        return {
          name:"Belly Rub Day", 
          description: "People come to belly rub your good boys, produces tons of love!"
        }
    }
  }

  onHover = (isHover: boolean) => () => {
    this.setState({
      isHover
    })
  }

  onLevelHover = (hoverLevel:boolean)=>()=> {
    this.setState({
      hoverLevel
    })
  }

  render(){
    const {isHover} = this.state
    return (
      <div className="product product1 boxed" onMouseEnter={this.onHover(true)} onMouseLeave={this.onHover(false)}>
        {isHover ? this.renderHighlight() : this.renderContent()}
        <LevelUpButton productId={ids.product1Level} 
          onMouseEnter={this.onLevelHover(true)}
          onMouseLeave={this.onLevelHover(false)}/>
        <ProductPlusDog ref="farmPlus"/>
        {isHover && this.renderHighlight()}
      </div>
    )
  }

  renderContent(){
    const {level, progress} = this.props;
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product1Level) as PetAppreciationCenter
    const progressStyle = {
      width: `${progress.getValue()/product.getProgressGoal()*100}%`
    }
    return (
      <React.Fragment>
        <div className="product1-building">
        </div>
        <div className="product-level">
            {level.getValue()}
          </div>
        <div className="product1-title">
          Pet Farm
        </div>
        <div className="progress">
          {this.renderCurrentEvent()}
          <div className="progress-bar">
            <div className="progress-bar-progress" style={progressStyle}></div>
            <div className="progress-bar-value">
              {`${Math.floor(progress.getValue())} / ${Math.floor(product.getProgressGoal())}`}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderHighlight(){
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product1Level) as PetAppreciationCenter
    const {level, eventId} = this.props
    const usedLevel:number = level.getValue() + (this.state.hoverLevel ? 1 : 0)
    const lps = toFormat(product.updateCurrencyPerSecond(usedLevel, true).currency)
    const progressPS = toFormat(product.getProgressPerSecond(usedLevel))
    const {description} = this.getEventData(eventId.getValue())
    const levelClass = this.state.hoverLevel ? " hover-level" : ""
    return (
      <div className={"highlight "+levelClass}>
        <div className="highlight-section">
          <div className="highlight-field title">
            Farm Info
          </div>
          <div className="highlight-field">
            Shelters lost pets in a cozy home. It also prepares EVENTS for them!
          </div>
          <div className="highlight-field title">
            Farm Stats
          </div>
          <div className="highlight-field">
            <div className="highlight-attribute">Love</div>
            <div className="highlight-value">
              {lps}/s
              <div className="highlight-love-icon"/>
            </div>
          </div>
          <div className="highlight-field">
            <div className="highlight-attribute">Progress</div>
            <div className="highlight-value">
              {progressPS}/s
            </div>
          </div>
        </div>
        <div className="highlight-section">
          <div className="highlight-field title">
            Events
          </div>
          {this.renderEventOptions(product, eventId.getValue())}
        </div>
        <div className="highlight-section">
          
          <div className="highlight-field title">
            Event Info
          </div>
          <div className="highlight-field">
            {description}
          </div>
          {this.renderEventStatistic(product,usedLevel)}
        </div>
      </div>
    )
  }

  renderEventStatistic(product: PetAppreciationCenter, level:number) {
    const eventId = product.getEvent().id
    const {name} = this.getEventData(eventId)
    const {petMultiplier, duration} = product.getPettingTrainingData(level)
    const title = (
      <div className="highlight-field title">{name+" Stats"}</div>
    )
    switch (eventId){
      case events.bellyRub.id:
        return (
          <React.Fragment>
            {title}
            <div className="highlight-field">
              <div className="highlight-attribute">Love</div>
              <div className="highlight-value">
                {toFormat(product.getEventReward(eventId,level).currencyReward.currency)}
                <div className="highlight-love-icon"/>
                </div>
            </div>
          </React.Fragment>
        )
        case events.donationCampaign.id:
          return (
            <React.Fragment>
              {title}
              <div className="highlight-field">
                <div className="highlight-attribute">Treats</div>
                <div className="highlight-value">
                  {product.getEventReward(eventId,level).currencyReward.treats.toString()}
                  <div className="treat-icon"/>
                  </div>
              </div>
            </React.Fragment>
          )
      default:
        return (
          <React.Fragment>
            {title}
            <div className="highlight-field">
              <div className="highlight-attribute">Pet Mult</div>
              <div className="highlight-value">{toFormat(petMultiplier)}</div>
            </div>
            <div className="highlight-field">
              <div className="highlight-attribute">Duration</div>
              <div className="highlight-value">{duration}s</div>
            </div>
          </React.Fragment>
        )
    }
  }

  renderEventOptions(product: PetAppreciationCenter, selected:string) {
    const events = product.getAvailableEvents()
    return events.map((e)=>{
      const selectedClass = e.id === selected ? " selected" : ""
      return (
        <div className={"highlight-field highlight-event-select"+selectedClass} onClick={this.selectEvent(e.id)}>
          {this.getEventData(e.id).name}
        </div>)
    }
    )
  }
  
  selectEvent = (eventId: string) => () =>{
    GameManager.getInstance().setVariable(eventId, variableIds.product1Event)
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.product1Level),
  progress: selecters.getVariable(state, ids.product1Progress),
  eventId: selecters.getVariable(state, ids.product1Event),
})

export default connect(mapStateToProps)(Product1);