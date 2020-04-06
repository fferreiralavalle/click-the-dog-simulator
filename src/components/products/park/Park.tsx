import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './park.css'

import {selecters} from '../../../reducers/GameVariables'
import ids from '../../../game/VariableId'

import variableIds from  '../../../game/VariableId'
import { Variable } from '../../../game/Variables'
import GameManager from '../../../game/GameManager'
import { Park, RewardResult, events, RelicTier, Relic } from '../../../game/products/Park'
import LevelUpButton from '../LevelUpButton'
import ProductPlus, {plusCurrency} from '../ProductPlus'
import { Currency } from '../../../game/products/Product'
import { toFormat, clearPluses, toFormatTime } from '../../../utils/uiUtil'
import { getText, getRelicText } from '../../../utils/textUtil'
import ProductPlusDog, { productPlusInterface } from '../ProductPlusDog'
import ProductProgressBar from '../ProductProgressBar'

interface IRecipeProps {
  level: Variable;
}

interface IState {
  isHover: boolean;
  hoverLevel: boolean
  displayedEvent: string
  viewRelics: boolean
  displayedRelic: string
}

class ParkUI extends Component<IRecipeProps, IState> {
  commonText = getText().products.common
  currencyText = getText().currencies
  productText = getText().products.park
  relicsText = getText().relics
  uiCleaner: any
  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      hoverLevel: false,
      displayedEvent: events.pupsloration.id,
      viewRelics: false,
      displayedRelic: ids.relicTier0A
    }
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product4Level) as Park
    product.subscribeToReward({
      id: 'UIOnReward',
      onReward: (result:RewardResult) => this.onEventReward(result),
    })
    product.subscribeToCurrency({
      id: 'UIOnCurrency',
      onCurrency: (result:Currency) => this.onCurrencyGain(result, product),
    })
  }

  componentWillUnmount(){
    clearTimeout(this.uiCleaner)
  }

  onEventReward = (result:RewardResult)=> {
    const x = (10+Math.random() * 30)+"%"
    const y = (30+Math.random() * 40)+"%"
    let value = ('+'+toFormat(result.currencyReward.currency.toString()))
    let className = 'love-icon'
    if (!result.currencyReward.treats.equals(0)){
        value = '+'+toFormat(result.currencyReward.treats.toString())
        className = "treat-icon"
    }
    else if (result.currencyReward.patiencePoints){
        value = '+'+toFormat(result.currencyReward.patiencePoints.toString())
        className = "patience-icon"
    }
    else if (result.relicReward){
        value = "Found "+getRelicText(result.relicReward.id).title
        className = ""
    }
    const plusCurrency:plusCurrency = {
      value: value,
      key: Date.UTC.toString()+(Math.random()),
      x,
      y,
      className,
      size: 1.5
    }
    const ppd = this.refs.prodSpecial as ProductPlusDog
    ppd.addCurrency(plusCurrency)
  }

  onCurrencyGain = (currency: Currency, product: Park) => {
    const x = (10+Math.random() * 50)+"%"
    const y = (30+Math.random() * 50)+"%"
    const currentPlus = this.refs.productPlus as ProductPlusDog
    const plusCurrency:plusCurrency = {
      value: ('+'+toFormat(currency.currency.toString())),
      key: Date.UTC.toString()+(Math.random()),
      x,
      y,
      className:'love-icon',
      size: 1
    }
    if (currency.currency.gt(0) && currentPlus){
      currentPlus.addCurrency(plusCurrency)
    }
    const timer0 = this.refs.progress0 as ProductProgressBar
    if (timer0){
      const {text, progress} = this.getUpdatedBarValues(events.pupsloration.id, product)
      timer0.setNewValue(text)
      timer0.setNewProgress(progress)
    }
    const timer1 = this.refs.progress1 as ProductProgressBar
    if (timer1){
      const {text, progress} =  this.getUpdatedBarValues(events.dogsploration.id, product)
      timer1.setNewValue(text)
      timer1.setNewProgress(progress)
    }
    const timer2 = this.refs.progress2 as ProductProgressBar
    if (timer2){
      const {text, progress} =  this.getUpdatedBarValues(events.bigBoysploration.id, product)
      timer2.setNewValue(text)
      timer2.setNewProgress(progress)
    }
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
    const {isHover, viewRelics} = this.state
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product4Level) as Park
    const plusCurrencyStyle = {
      bottom: '80px',
      right: '35px',
      zIndex: 105,
      
    }
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
        {!isHover && this.renderBars(product)}
        <ProductPlusDog ref="productPlus"/>
        <LevelUpButton productId={ids.product4Level} 
          onMouseEnter={this.onLevelHover(true)}
          onMouseLeave={this.onLevelHover(false)}/>
        {isHover && (viewRelics ? this.renderRelicView(product): this.renderHighlight(product))}
        <ProductPlusDog ref="prodSpecial" style={plusCurrencyStyle}/>
      </div>
    )
  }

  renderBars(park: Park){
    return (
      <React.Fragment>
        {this.renderTimeLeftBar(events.pupsloration.id, park)}
        {this.renderTimeLeftBar(events.dogsploration.id, park)}
        {this.renderTimeLeftBar(events.bigBoysploration.id, park)}
      </React.Fragment>
    )
  }

  renderTimeLeftBar(evId: string, park:Park){
    let order = 0
    let {title} = this.getEventData(evId)
      switch(evId){
          case events.bigBoysploration.id:
            if (!park.isEventUnlocked(events.bigBoysploration)){
              return null
            }
            order = 2
            break
          case events.dogsploration.id:
            if (!park.isEventUnlocked(events.dogsploration)){
              return null
            }
            order = 1
            break
      }
      const {text, progress} = this.getUpdatedBarValues(evId, park)
      return (
          <ProductProgressBar
            ref={"progress"+order}
            className={"progress-order-"+order}
            title={title}
            value={text}
            progress={progress}
            />
      )
  }

  getUpdatedBarValues(eventId: string, park: Park): {text: string, progress: number}{
    const isReady = park.isEventReady(eventId)
    const progress = park.getEventTimePassed(eventId)
    const progressNeeded = park.getEventTimeNeeded(eventId)
    const text = isReady ? this.productText.claimPreview : `${toFormatTime(Math.max(progressNeeded-progress,0))}`
    const progressValue = progress/progressNeeded
    return {
      text,
      progress: progressValue
    }
  }

  renderHighlight(park: Park){
    const {level} = this.props
    const {displayedEvent} = this.state
    const usedLevel:number = level.getValue() + (this.state.hoverLevel ? 1 : 0)
    const lps = toFormat(park.updateCurrencyPerSecond(usedLevel, true).currency.toString())
    const lovePerRelic = toFormat(park.getCurrencyPerRelic(usedLevel).currency.toString())
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
    const price = product.getEvent(displayedEvent).price.treats
    let buttontext = this.productText.notReady
    if (!product.canPayReward(displayedEvent)){
      buttontext = this.productText.notEnough
    }
    else if (isEventReady){
      buttontext = this.productText.claim
    }
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
            <div className="highlight-field">
                <div className="highlight-attribute">
                    {this.commonText.price}
                    </div>
                <div className="highlight-value">
                    {toFormat(price.toString())}<div className="treat-icon"/>
                </div>
            </div>
            <div className={"highlight-field"+readyClass} onClick={this.claimReward(displayedEvent, product)}>
                <div className="highlight-button-claim">
                    {buttontext}
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
    uiEvents.push(
      <div className={"highlight-field highlight-event-select special-option"} onClick={this.toggleRelicView(true)}>
          {this.productText.viewRelics}
      </div>
    )
    return uiEvents
  }

  renderRelicView(park: Park){
    const relics = park.getAllRelics()
    const {displayedRelic} = this.state
    const {title, description} = getRelicText(displayedRelic)
    const relic = park.getRelic(displayedRelic)
    const iconStyle = {
      backgroundImage: relic.icon ? `url(${relic.icon})` : ""
    }
    const isCurrentRelicUnlocked = park.isRelicUnlocked(displayedRelic)
    const lockClass = isCurrentRelicUnlocked ? "" : " locked"
    return (
      <div className={"highlight relic-view"}>
        <div className="highlight-section scroll-y">
          <div className="highlight-field title">
            {this.productText.quests.tier0.title}
          </div>
          {this.renderRelicTier(relics.tier0, park)}
          <div className="highlight-field title">
            {this.productText.quests.tier1.title}
          </div>
          {this.renderRelicTier(relics.tier1, park)}
          <div className="highlight-field title">
            {this.productText.quests.tier2.title}
          </div>
          {this.renderRelicTier(relics.tier2, park)}
        </div>
        <div className="highlight-section">
          <div className={"highlight-field title"+lockClass}>
            <div className="relic-icon" style={iconStyle}/><span className="relic-title">{title}</span>
          </div>
          <div className="highlight-field">
          <span className="relic-description">{isCurrentRelicUnlocked ? description : "???"}</span>
          </div>
        </div>
        <div className="highlight-closeButton" onClick={this.toggleRelicView(false)}>X</div>
        </div>
    )
  }

  renderRelicTier(tier: RelicTier, park: Park){
    const relics = tier.relics
    return (
      <div className="highlight-tier">
        {relics.map((relic)=> (this.renderRelic(relic, park.isRelicUnlocked(relic.id))))}
      </div>)
  }

  renderRelic(relic: Relic, isUnlocked: boolean){
    const iconStyle = {
      backgroundImage: relic.icon ? `url(${relic.icon})` : ""
    }
    const lockClass = isUnlocked ? "" : " locked"
    return (
      <div className={"highlight-field"+lockClass} onClick={this.selectRelic(relic.id)}>
        <div className="relic-icon" style={iconStyle}>

        </div>
      </div>
    )
  }
  
  selectEvent = (eventId: string) => () =>{
    this.setState({
        displayedEvent: eventId
    })
  }

  selectRelic = (relicId: string) => () =>{
    this.setState({
        displayedRelic: relicId
    })
  }

  toggleRelicView = (view:boolean) => () => {
    this.setState({
      viewRelics: view
    })
  }

  claimReward = (eventId: string, park: Park) => () => {
      park.claimEventReward(eventId)
      this.forceUpdate()
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.product4Level),
})

export default connect(mapStateToProps)(ParkUI);