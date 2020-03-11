import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './park.css'

import {selecters} from '../../../reducers/GameVariables'
import ids from '../../../game/VariableId'

import variableIds from  '../../../game/VariableId'
import { Variable } from '../../../game/Variables'
import GameManager from '../../../game/GameManager'
import { Park, RewardResult, events } from '../../../game/products/Park'
import LevelUpButton from '../LevelUpButton'
import ProductPlus, {plusCurrency} from '../ProductPlus'
import { Currency } from '../../../game/products/Product'
import { toFormat, clearPluses, toFormatTime } from '../../../utils/uiUtil'
import { getText, getRelicText } from '../../../utils/textUtil'

interface IRecipeProps {
  level: Variable;
  eventId: Variable
  progress0: any,
  progress1: any,
  progress2: any,
}

interface IState {
  isHover: boolean;
  plusCurrencies: Array<plusCurrency>
  hoverLevel: boolean
  displayedEvent: string
}

class ParkUI extends Component<IRecipeProps, IState> {
  commonText = getText().products.common
  currencyText = getText().currencies
  productText = getText().products.park
  relicsText = getText().relics

  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      plusCurrencies: [],
      hoverLevel: false,
      displayedEvent: events.pupsloration.id
    }
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product4Level) as Park
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
    const {eventId} = this.props;
    const x = (10+Math.random() * 30)+"%"
    const y = (30+Math.random() * 40)+"%"
    let value = ('+'+toFormat(result.currencyReward.currency))
    let className = 'love-icon'
    if (result.currencyReward.treats!==0){
        value = '+'+toFormat(result.currencyReward.treats)
        className = "treat-icon"
    }
    else if (result.currencyReward.patiencePoints){
        value = '+'+toFormat(result.currencyReward.patiencePoints)
        className = "patience-icon"
    }
    else if (result.relicReward){
        value = getRelicText(result.relicReward.id).title
    }
    const plusCurrency:plusCurrency = {
      value: value,
      key: Date.UTC.toString()+(Math.random()),
      x,
      y,
      className,
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
      className:'love-icon',
      size: 1
    }
    this.addPlusCurrency(plusCurrency)
  }

  addPlusCurrency = (pc: plusCurrency) => {
    this.setState({
      plusCurrencies: [...this.state.plusCurrencies,pc]
    })
  }

  renderCurrentEvent = () => {
    const {eventId} = this.props
    const eventData = this.getEventData(eventId.getValue())
    return (<div className="event-type">{eventData.title}</div>)
  }

  getEventData = (eventId: string)=> {
    switch (eventId) {
        case events.bigBoysploration.id:
            return {
                ...this.productText.quests.tier2
            }
        case events.dogsploration.id:
            return {
                ...this.productText.quests.tier1
            }
        default:
            return {
                ...this.productText.quests.tier0
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
    const {level} = this.props;
    const {plusCurrencies, isHover, displayedEvent} = this.state
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product4Level) as Park
    
    return (
      <div className="product product4 boxed" onMouseEnter={this.onHover(true)} onMouseLeave={this.onHover(false)}>
        <div className="product4-building">
        </div>
        <div className="product-level">
            {level.getValue()}
          </div>
        <div className="product1-title">
          {this.productText.title}
        </div>
        {this.renderTimeLeftBar(events.pupsloration.id, product)}
        {this.renderTimeLeftBar(events.dogsploration.id, product)}
        {this.renderTimeLeftBar(events.bigBoysploration.id, product)}
        <ProductPlus plusCurrencies={plusCurrencies}/>
        <LevelUpButton productId={ids.product4Level} 
          onMouseEnter={this.onLevelHover(true)}
          onMouseLeave={this.onLevelHover(false)}/>
        {isHover && this.renderHighlight()}
      </div>
    )
  }

  renderTimeLeftBar(evId: string, park:Park){
      const {progress0, progress1, progress2} = this.props;
      let progressUsed = 0
      let progressNeeeded = 1
      let order = 0
      let {title} = this.getEventData(evId)
      switch(evId){
          case events.bigBoysploration.id:
            progressUsed = progress2
            progressNeeeded = events.bigBoysploration.secondsNeeded
            order = 2
            break
          case events.dogsploration.id:
            progressUsed = progress1
            progressNeeeded = events.dogsploration.secondsNeeded
            order = 1
            break
          default:
            progressUsed = progress0
            progressNeeeded = events.pupsloration.secondsNeeded
      }
      const progressStyle = {
        width: `${progressUsed/progressNeeeded*100}%`
      }
      const isReady = park.isEventReady(evId)
      const text = isReady ? this.productText.claimPreview : `${toFormatTime(Math.max(progressNeeeded-progressUsed,0))}`
      return (
          <div className={"progress progress-order-"+order}>
            <div className="event-title">
                {title}
            </div>
            <div className={"progress-bar"}>
                <div className="progress-bar-progress" style={progressStyle}></div>
                <div className="progress-bar-value">
                    {text}
                </div>
            </div>
          </div>
      )
  }

  renderHighlight(){
    const park = GameManager.getInstance().getProductManager().getProduct(ids.product4Level) as Park 
    const {level} = this.props
    const {displayedEvent} = this.state
    const usedLevel:number = level.getValue() + (this.state.hoverLevel ? 1 : 0)
    const lps = toFormat(park.getCurrencyPerSecond(usedLevel).currency)
    const lovePerRelic = toFormat(park.getCurrencyPerRelic(usedLevel).currency)
    const levelClass = this.state.hoverLevel ? " hover-level" : ""
    const relicAmount = park.getRelicsUnlockedAmount()
    return (
      <div className={"highlight "+levelClass}>
        <div className="highlight-section">
          <div className="highlight-field title">
            {this.productText.title}
          </div>
          <div className="highlight-field">
          {this.productText.description}
          </div>
          <div className="highlight-field title">
            {this.commonText.stats}
          </div>
          <div className="highlight-field">
            <div className="highlight-attribute">{this.currencyText.love}</div>
            <div className="highlight-value">
              {lps}/s
              <div className="highlight-love-icon"/>
            </div>
          </div>
          <div className="highlight-field">
            <div className="highlight-attribute">{this.productText.lovePerRelic}</div>
            <div className="highlight-value">
              {lovePerRelic}<div className="highlight-love-icon"/>
            </div>
          </div>
          <div className="highlight-field">
            <div className="highlight-attribute">{this.relicsText.relic}s</div>
            <div className="highlight-value">
              {relicAmount}
            </div>
          </div>
        </div>
        <div className="highlight-section">
          <div className="highlight-field title">
            {this.productText.quest}
          </div>
          {this.renderEventOptions(park, usedLevel)}
        </div>
        <div className="highlight-section">
          
          <div className="highlight-field title">
            {this.commonText.info}
          </div>
          <div className="highlight-field">
            {this.getEventData(displayedEvent).description}
          </div>
          {this.renderEventStatistic(park,usedLevel)}
        </div>
      </div>
    )
  }

  renderEventStatistic(product: Park, level:number) {
    const {displayedEvent} = this.state
    const title = (
      <div className="highlight-field title">{this.commonText.stats}</div>
    )
    const relicChance = product.getRelicChance(level)
    const isEventReady = product.isEventReady(displayedEvent)
    const readyClass = isEventReady ? "" : " disabled"
    return (
        <React.Fragment>
            {title}
            <div className="highlight-field">
                <div className="highlight-attribute">
                    {this.relicsText.relic}
                    </div>
                <div className="highlight-value">
                    {toFormat(relicChance*100)}%
                </div>
            </div>
            <div className={"highlight-field"+readyClass} onClick={this.claimReward(displayedEvent, product)}>
                <div className="highlight-button-claim">
                    {isEventReady ? this.productText.claim : this.productText.notReady}
                </div>
            </div>
        </React.Fragment>
    )
  }

  renderEventOptions(product: Park, level: number) {
    const events = product.getEvents()
    const uiEvents:any = []
    const {displayedEvent} = this.state;
    Object.keys(events).forEach((e)=> {
        if (events[e].unlockLevel<=level){
            const isSelected = displayedEvent===e ? " selected" : ""
            uiEvents.push(
                <div className={"highlight-field highlight-event-select"+isSelected} onClick={this.selectEvent(e)}>
                {this.getEventData(e).title}
                </div>)
        }else{
            uiEvents.push(
                <div className="highlight-field highlight-event-select">
                    {events[e].unlockLevel}
                </div>)
        }
    })
    return uiEvents
  }
  
  selectEvent = (eventId: string) => () =>{
    this.setState({
        displayedEvent: eventId
    })
  }

  claimReward = (eventId: string, park: Park) => () => {
      park.claimEventReward(eventId)
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.product4Level),
  progress0: selecters.getVariable(state, ids.product4Tier0Progress).getValue(),
  progress1: selecters.getVariable(state, ids.product4Tier1Progress).getValue(),
  progress2: selecters.getVariable(state, ids.product4Tier2Progress).getValue(),
  eventId: selecters.getVariable(state, ids.product1Event),
})

export default connect(mapStateToProps)(ParkUI);