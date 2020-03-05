import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './laboratory.css'

import {selecters, actions} from '../../../reducers/GameVariables'
import ids from '../../../game/VariableId'

import variableIds from  '../../../game/VariableId'
import { Variable } from '../../../game/Variables'
import GameManager from '../../../game/GameManager'
import LevelUpButton from '../LevelUpButton'
import ProductPlus, {plusCurrency} from '../ProductPlus'
import { Currency } from '../../../game/products/Product'
import { toFormat, clearPluses } from '../../../utils/uiUtil'
import { Laboratory, Upgrade, UpgradeTier } from '../../../game/products/Laboratory'

interface IRecipeProps {
  level: Variable;
  progress: Variable
  eventId: Variable,
  dispatch: Function
}

interface IState {
  isHover: boolean;
  plusCurrencies: Array<plusCurrency>
  hoverLevel: boolean,
  chosenUpgrade: string
  buyUpgradeHoverValue: number
}

class LaboratoryUI extends Component<IRecipeProps, IState> {
  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      plusCurrencies: [],
      hoverLevel: false,
      chosenUpgrade: variableIds.labUpgradeTier1A,
      buyUpgradeHoverValue: 0
    }
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product2Level) as Laboratory
    product.subscribeToCurrency({
      id: 'UiLaboratory',
      onCurrency: (currency:Currency)=> this.onEventReward(currency)
    })
    setInterval(()=>{
      const newPlus = clearPluses(this.state.plusCurrencies)
      this.setState({
        plusCurrencies: newPlus
      })
    },5 * 1000)
  }

  onEventReward = (result:Currency)=> {
    
    if (result.treats<=0 && result.currency<=0)
      return
    const x = (10+Math.random() * 30)+"%"
    const y = (30+Math.random() * 40)+"%"
    let value = ('+'+toFormat(result.currency))
    let size = 1
    let className = 'love-icon'
    if (result.treats>0){
      value = ('+'+toFormat(result.treats))
      size = 1.5
      className = 'treat-icon'
    }
    const plusCurrency:plusCurrency = {
      value,
      key: Date.UTC.toString()+(Math.random()),
      x,
      y,
      className,
      size
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

  onUpgradeHover = (buyUpgradeHoverValue:number)=>()=>{
    this.setState({
        buyUpgradeHoverValue
    })
  }

  onUpgrade = (product:Laboratory, upgradeId:string, amount:number)=>()=> {
    product.buyUpgrade(upgradeId,amount)
    this.props.dispatch(actions.updateVariables())
  }

  getUpgradeData= (eventId: string)=> {
    switch (eventId){
      /* TIER 2 */
      case variableIds.labUpgradeTier2A:
            return {
                name:"Magic Rubbing", 
                description: "Petting has a chance of producing 1 Treat. Scientific Magic!",
                className: "lab-icon-1A",
            }
      case variableIds.labUpgradeTier2B:
          return {
              name:"Special Event!", 
              description: "Every Farm event has a chance of doubling its rewards. Yay!",
              className: "lab-icon-1B"
          }
      case variableIds.labUpgradeTier2C:
        return {
            name:"Lab Puptivities!", 
            description: "Labs produce love for each Farm and Divine Petting level!",
            className: "lab-icon-1C"
        }
      case variableIds.labUpgradeTier1B:
          return {
              name:"Farm Productivity", 
              description: "Reduces the time needed to prepare events.",
              className: "lab-icon-1B",
          }
      case variableIds.labUpgradeTier1C:
          return {
              name:"Artificial Treats!", 
              description: "The lab will slowly generate Treats on its own, Yummy!",
              className: "lab-icon-1C"
          }
      default:
          return {
              name:"Petting Mastery", 
              description: "You become an expert in the ways of petting.",
              className: "lab-icon-1A"
          }
    }
  }

  render(){
    const {level, progress} = this.props;
    const {plusCurrencies, isHover} = this.state
    const product = GameManager.getInstance().getProductManager().getProduct(ids.product2Level) as Laboratory
    const progressStyle = {
      width: `${progress.getValue()/product.getProgressGoal()*100}%`
    }
    const freePoints = product.getAvailablePoints()
    return (
      <div className="product laboratory boxed" onMouseEnter={this.onHover(true)} onMouseLeave={this.onHover(false)}>
        <div className="laboratory-building">
        </div>
        <div className="product-level">
            {level.getValue()}
          </div>
        <div className="product1-title">
          LABoratory
        </div>
        <div className="event-type">Artificial Treats</div>
        {freePoints>0 && <div className="available-points">{freePoints} Unspent Points</div>}
        <div className="progress-bar">
          <div className="progress-bar-progress" style={progressStyle}></div>
          <div className="progress-bar-value">
            {`${Math.floor(progress.getValue())} / ${Math.floor(product.getProgressGoal())}`}
          </div>
        </div>
        <ProductPlus plusCurrencies={plusCurrencies}/>
        <LevelUpButton productId={ids.product2Level} 
          onMouseEnter={this.onLevelHover(true)}
          onMouseLeave={this.onLevelHover(false)}/>
        {isHover && this.renderHighlight(product)}
      </div>
    )
  }

  renderHighlight(product: Laboratory){
    const {level} = this.props
    const {chosenUpgrade, buyUpgradeHoverValue, hoverLevel} = this.state
    const usedLevel:number = level.getValue() + (this.state.hoverLevel ? 1 : 0)
    const currentPoints = toFormat(product.getAvailablePoints(usedLevel))
    const points = toFormat(product.getPoints(usedLevel))
    const progressPS = toFormat(product.getProgressPerSecond(usedLevel))
    const levelClass = hoverLevel ? " hover-level" : ""
    const upgradeClass = buyUpgradeHoverValue ? " hover-level" : ""
    const currentPointsClass = product.getAvailablePoints(usedLevel) > 0 ? "lab-text-positive" : "lab-text-negative"
    return (
      <div className={"highlight "}>
        <div className="highlight-section">
          <div className="highlight-field title">
            Lab Info
          </div>
          <div className="highlight-field">
            The LABoratory is where our brightest puppers use their smarts for science.
          </div>
          <div className="highlight-field title">
            Lab Stats
          </div>
          <div className={"highlight-field"+levelClass}>
            <div className="highlight-attribute">Points</div>
            <div className="highlight-value">
              <span className={currentPointsClass}>{currentPoints}</span>/{points}
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
            Pupgrades
          </div>
          {this.renderUpgrades(product,usedLevel)}
        </div>
        <div className={"highlight-section"+upgradeClass}>
          <div className="highlight-field title">
            {this.getUpgradeData(chosenUpgrade).name}
          </div>
          <div className="highlight-field">
              {this.getUpgradeData(this.state.chosenUpgrade).description}
          </div>
          {this.renderUpgradeStatistic(product)}
          <div className="highlight-tier">
            {this.renderUpgradeButton(10,chosenUpgrade,product)}
            {this.renderUpgradeButton(1,chosenUpgrade,product)}
            {this.renderUpgradeButton(-1,chosenUpgrade,product)}
            {this.renderUpgradeButton(-10,chosenUpgrade,product)}
          </div>
        </div>
      </div>
    )
  }

  renderUpgradeButton(add:number, chosenUpgrade:string, product:Laboratory){
    const className:string = add >=0 ? " upgrade" : " downgrade"
    const simbol:string = add >=0 ? "+" : ""
    return (
        <div className={"lab-button"+className} 
            onClick={this.onUpgrade(product,chosenUpgrade,add)}
            onMouseEnter={this.onUpgradeHover(add)}
            onMouseLeave={this.onUpgradeHover(0)}>
                {simbol}{add}
        </div>
    )
  }

  renderUpgradeStatistic(product: Laboratory) {
    const {chosenUpgrade,buyUpgradeHoverValue} = this.state
    const upgradeLevel = product.getUpgradeLevel(chosenUpgrade)+buyUpgradeHoverValue
    const {name} = this.getUpgradeData(chosenUpgrade)
    const bonus = product.getUpgradeBonus(chosenUpgrade,upgradeLevel)
    const {baseBonus} = bonus
    const title = (
      <div className="highlight-field title">Stats</div>
    )
    const points = (
        <div className="highlight-field">
            <div className="highlight-attribute">Points</div>
            <div className="highlight-value">-{product.getUpgradePrice(chosenUpgrade,buyUpgradeHoverValue)}</div>
        </div>)
    switch (chosenUpgrade){
        case variableIds.labUpgradeTier1B:
            return (
                <React.Fragment>
                    {title}
                    {points}
                    <div className="highlight-field">
                        <div className="highlight-attribute">Reduction</div>
                        <div className="highlight-value">{toFormat((baseBonus-1)*100)}%</div>
                    </div>
                </React.Fragment>
                )
        case variableIds.labUpgradeTier1C:
            return (
                <React.Fragment>
                    {title}
                    {points}
                    <div className="highlight-field">
                        <div className="highlight-attribute">Progress</div>
                        <div className="highlight-value">
                            {toFormat(baseBonus)}s<div className="treat-icon"/>
                        </div>
                    </div>
                </React.Fragment>
                )
        case variableIds.labUpgradeTier2A:
        case variableIds.labUpgradeTier2B:
          return (
            <React.Fragment>
                {title}
                {points}
                <div className="highlight-field">
                    <div className="highlight-attribute">Chance</div>
                    <div className="highlight-value">
                        {toFormat(baseBonus*100)}%
                    </div>
                </div>
            </React.Fragment>
            )
        case variableIds.labUpgradeTier2C:
          return (
            <React.Fragment>
                {title}
                {points}
                <div className="highlight-field">
                    <div className="highlight-attribute">Love</div>
                    <div className="highlight-value">
                        {toFormat(baseBonus)}/s
                    </div>
                </div>
            </React.Fragment>
          )
        default:
            return (
            <React.Fragment>
                {title}
                {points}
                <div className="highlight-field">
                    <div className="highlight-attribute">Bonus</div>
                    <div className="highlight-value">
                        +{toFormat((baseBonus-1)*100)}%<div className="love-icon"/>
                    </div>
                </div>
            </React.Fragment>
            )
    }
  }

  renderUpgrades(product: Laboratory, level: number) {
    const upgradeTiers = product.getAvaiableUpgrades(level)
    return upgradeTiers.map((ut,i)=>{
        return (
            <div className={"highlight-tier tier-color-lab-"+i}>
                {ut.upgrades.map((upgrade)=>{
                    const upgradeData = this.getUpgradeData(upgrade.id)
                    const upgradeLevel = product.getUpgradeLevel(upgrade.id)
                    return (
                        <div className={"highlight-field "} onClick={this.selectUpgrade(upgrade.id)}>
                            <div className={"lab-icon "+upgradeData.className}>
                                <div className="lab-upgrade-level">{upgradeLevel}</div>
                            </div>
                        </div>)
                })}
            </div>
            )
    })
  }
  
  selectUpgrade = (chosenUpgrade: string) => () =>{
    this.setState({
        chosenUpgrade
    })
  }
}

const mapStateToProps = (state:any) => ({
  level: selecters.getVariable(state, ids.product2Level),
  progress: selecters.getVariable(state, ids.product2Progress),
  eventId: selecters.getVariable(state, ids.product1Event),
})

export default connect(mapStateToProps)(LaboratoryUI);