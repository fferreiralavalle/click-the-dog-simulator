import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './tree.css'

import {selecters} from '../../../reducers/GameVariables'
import ids from '../../../game/VariableId'

import variableIds from  '../../../game/VariableId'
import { Variable } from '../../../game/Variables'
import GameManager from '../../../game/GameManager'
import { Park, RewardResult, events, RelicTier, Relic } from '../../../game/products/Park'
import LevelUpButton from '../LevelUpButton'
import ProductPlus, {plusCurrency} from '../ProductPlus'
import { Currency } from '../../../game/products/Product'
import { toFormat, clearPluses, toFormatTime, getBlessingIcon, toFormatPure } from '../../../utils/uiUtil'
import { getText, getRelicText, getBlessingText } from '../../../utils/textUtil'
import { Tree, BlessingTier } from '../../../game/products/Tree'
import Decimal from 'break_infinity.js'
import permaVariables from '../../../game/PermaVariablesId'
import { Blessing } from '../../../game/blessings/Blessing'
import GoodBoyPointsSignUI from './GoodBoySign'
import { actions } from '../../../reducers/uiUtils'

interface IRecipeProps {
  level: Variable;
  dispatch: Function
}

interface IState {
  isHover: boolean;
  plusCurrencies: Array<plusCurrency>
  rewardsList: Array<plusCurrency>
  hoverLevel: boolean
  displayedEvent: string
  viewRelics: boolean
  displayedBlessing: string
}

class TreeUi extends Component<IRecipeProps, IState> {
  commonText = getText().products.common
  currencyText = getText().currencies
  productText = getText().products.tree
  uiCleaner: any
  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      plusCurrencies: [],
      rewardsList: [],
      hoverLevel: false,
      displayedEvent: events.pupsloration.id,
      viewRelics: false,
      displayedBlessing: ids.relicTier0A
    }
    const product = GameManager.getInstance().getProductManager().getProduct(ids.treeOfGoodBoys) as Tree
    product.subscribeToCurrency({
      id: 'uiOnUpdate',
      onCurrency: ()=> this.onCurrencyGain(product)
    })
  }
  onCurrencyGain = (product: Tree) => {
    const myRef = this.refs.goodBoyPointsSign as GoodBoyPointsSignUI
    const points = product.getGoodBoyPointsThisGame()
    myRef.setNewPoints(points)
  }

  getBlessingData = (blessingId: string)=> {
    return getBlessingText(blessingId)
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
    const {plusCurrencies, isHover, viewRelics} = this.state
    const product = GameManager.getInstance().getProductManager().getProduct(ids.treeOfGoodBoys) as Tree
    const points = product.getGoodBoyPointsThisGame()
    return (
      <div className="product tree boxed" onMouseEnter={this.onHover(true)} onMouseLeave={this.onHover(false)}>
        <div className="tree-building">
        </div>
        <div className="product-level">
            {level.getValue()}
          </div>
        <div className="tree-title">
          {this.productText.title}
        </div>
        <ProductPlus plusCurrencies={plusCurrencies}/>
        <LevelUpButton productId={ids.treeOfGoodBoys} 
          onMouseEnter={this.onLevelHover(true)}
          onMouseLeave={this.onLevelHover(false)}/>
        <GoodBoyPointsSignUI ref="goodBoyPointsSign" points={points}/>
        {isHover &&
          (viewRelics ? this.renderBlessigsView(product): this.renderHighlight(product))}
      </div>
    )
  }


  renderHighlight(product: Tree){
    const {level} = this.props
    const usedLevel:number = level.getValue() + (this.state.hoverLevel ? 1 : 0)
    const multiplier:number = product.getGoodBoyPointsMultiplier(usedLevel)
    const perSecondPlayed:Decimal = product.getIncreasePerSecondPlayed()
    const levelClass = this.state.hoverLevel ? " hover-level" : ""
    const totalLevels = product.getPointsPerAllLevel()
    
    return (
      <div className={"highlight "}>
        <div className="highlight-section">
          <div className="highlight-field title">
            {this.productText.title}
          </div>
          <div className="highlight-field">
          {this.productText.description}
          </div>
          
        </div>
        <div className="highlight-section">
            <div className="highlight-field title">
                {this.productText.goodBoyPoints}
            </div>
          <div className={"highlight-field"+levelClass}>
            <div className="highlight-attribute">{this.productText.multiplier}</div>
            <div className="highlight-value">{multiplier}</div>
          </div>
          <div className="highlight-field">
            <div className="highlight-attribute">{this.productText.totalLevels}</div>
            <div className="highlight-value">{totalLevels.toString()}</div>
          </div>
          <div className={"highlight-field"}>
            <div className="highlight-attribute">{this.productText.perSecond}</div>
            <div className="highlight-value">{perSecondPlayed.toString()}</div>
          </div>
          <div className="highlight-field title">
                {this.productText.options}
            </div>
          {this.renderEventOptions()}
        </div>
        <div className="highlight-section">
          
          <div className="highlight-field title">
            {this.productText.theDesition}
          </div>
          <div className="highlight-field">
            {this.productText.letGoInfo}
          </div>
        </div>
      </div>
    )
  }

  renderEventOptions() {
    const uiEvents:any = [
        (<div className={"highlight-field highlight-event-select"} onClick={this.toggleBlessingView(true)}>
            {this.productText.blessings}
        </div>),
        (<div className={"highlight-field highlight-event-select special-option"} onClick={()=>this.showLetGoScreen()}>
            {this.productText.letGo}
        </div>)
    ]
    return uiEvents
  }

  renderBlessigsView(tree: Tree){
    const blessings = tree.getBlessings()
    const {displayedBlessing} = this.state
    const {title, description} = getBlessingText(displayedBlessing)
    const price = tree.getBlessingPrice(displayedBlessing)
    const {icon} = getBlessingIcon(displayedBlessing)
    const iconStyle = {
      backgroundImage: icon ? `url(${icon})` : ""
    }
    const tiers = blessings.map((tier, index)=> {
        return this.renderBlessingTier(tier, index)
    })
    return (
      <div className={"highlight relic-view"}>
        <div className="highlight-section scroll-y">
            {tiers}
        </div>
        <div className="highlight-section ">
          <div className={"highlight-field title"}>
            <div className="relic-icon" style={iconStyle}/>
            <span className="relic-title">{title}</span>
          </div>
          <div className="highlight-field">
            <span className="relic-description">{description}</span>
          </div>
          <div className={"highlight-field blessing-view-field"}>
            <span className="highlight-attribute title">{this.commonText.price}</span>
            <span className="highlight-value">{price.toString()}<div className="gbp-icon"/></span>
          </div>
          <div className={"highlight-field italic"}>
            {this.productText.blessingsRules}
          </div>
        </div>
        <div className="highlight-closeButton" onClick={this.toggleBlessingView(false)}>X</div>
        </div>
    )
  }

  renderBlessingTier(tier: BlessingTier, index:number){
    const blessings = tier.blessings
    return (
        <React.Fragment>
        <div className="highlight-field title">
            {this.productText.tier} - {index}
        </div>
        <div className="highlight-tier">
            {blessings.map((relic)=> this.renderBlessing(relic))}
        </div>
        </React.Fragment>
    )
  }

  renderBlessing(blessing: Blessing){
    const {icon} = getBlessingIcon(blessing.id)
    const iconStyle = {
      backgroundImage: icon ? `url(${icon})` : ""
    }
    return (
      <div className={"highlight-field"} onClick={this.selectBlessingView(blessing.id)}>
        <div className="relic-icon" style={iconStyle}></div>
      </div>
    )
  }
  
  selectBlessing = (eventId: string) => () =>{
    this.setState({
        displayedEvent: eventId
    })
  }

  selectBlessingView = (blessingId: string) => () =>{
    this.setState({
        displayedBlessing: blessingId
    })
  }

  toggleBlessingView = (view:boolean) => () => {
    this.setState({
      viewRelics: view
    })
  }

  showLetGoScreen = () => {
    this.props.dispatch(actions.setLetGoScreenLevel(1))
  }

  claimReward = (eventId: string, park: Park) => () => {
      park.claimEventReward(eventId)
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.treeOfGoodBoys)
})

export default connect(mapStateToProps)(TreeUi);