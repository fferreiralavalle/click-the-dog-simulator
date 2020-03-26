import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../product.css'
import './king.css'

import {selecters, actions} from '../../../reducers/GameVariables'

import ids from '../../../game/VariableId'
import GameManager from '../../../game/GameManager'
import {toFormat, clearPluses} from '../../../utils/uiUtil'
import { King } from '../../../game/products/UpgradeKing'
import ProductPlus, { plusCurrency } from '../ProductPlus'
import { Currency } from '../../../game/products/Product'
import LevelUpButton from '../LevelUpButton'
import Decimal from 'break_infinity.js'
import { UpgradeKing } from '../../../game/upgrades/Upgrade'
import { getText, getKingUpgradeText } from '../../../utils/textUtil'

interface IRecipeProps {
    currency: Decimal
    treats: Decimal
    level: number
    dispatch: Function
}

interface IState {
    isHover: boolean;
    plusCurrencies: Array<plusCurrency>
    hoverLevel: boolean,
    show: number //0 Main menu. 1 Shop, 2 Upgrades Bought
    selectedUpgrade: string
}

class KingUI extends Component<IRecipeProps,IState> {

  productText = getText().products.king
  commonText = getText().products.common
  currenciesText = getText().currencies
  uiCleaner: any
  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
      plusCurrencies: [],
      hoverLevel: false,
      selectedUpgrade: '',
      show: 0
    }
    const product = GameManager.getInstance().getProductManager().getProduct(ids.upgradeShop) as King
    product.subscribeToCurrency({
      id: 'UIOnCurrency',
      onCurrency: (result:Currency) => this.onCurrencyGain(result),
    })
    this.uiCleaner = setInterval(()=>{
      const newPlus = clearPluses(this.state.plusCurrencies)
      this.setState({
        plusCurrencies: newPlus
      })
    },3 * 1000)
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
    const {isHover, plusCurrencies, show, hoverLevel} = this.state;
    const {level} = this.props
    const king = GameManager.getInstance().getProductManager().getProduct(ids.upgradeShop) as King
    const usedLevel = hoverLevel ? level + 1 : level
    const upgradesNumber = king.getAvailableUpgrades().length
    return (
      <div className="product king boxed" 
        onMouseEnter={this.onHover(true)}
        onMouseLeave={this.onHover(false)}>
        {this.renderContent()}
        <div className="product-level">
            {level}
          </div>
        {isHover && show===0 && this.renderHighlight(king, usedLevel)}
        {isHover && show===1 && this.renderBuyMenu(king, usedLevel)}
        {isHover && show===2 && this.renderBuyMenu(king, usedLevel, true)}
        <LevelUpButton productId={ids.upgradeShop} 
          onMouseEnter={this.onLevelHover(true)}
          onMouseLeave={this.onLevelHover(false)}/>
        <ProductPlus plusCurrencies={plusCurrencies}/>
        {upgradesNumber>0 && <div className="available-king-upgrades">{upgradesNumber} Upgrades</div>}
      </div>
    )
  }

  renderContent(){
    return (
      <React.Fragment>
        <div className={"king-building"}/>
        <div className="product3-title">
            <p className="king-title-text">{this.productText.title}</p>
        </div>
      </React.Fragment>
    )
  }

  renderHighlight(king: King, level: number){
    const levelClass = this.state.hoverLevel ? " hover-level" : ""
    const lps = toFormat(king.updateCurrencyPerSecond(level, true).currency)
    const perBuilding = toFormat(king.getCurrencyMultiplier(level))
    const upgradeMax = king.getMaxUpgradeLevel(level)
    return (
      <div className={"highlight "+levelClass}>
        <div className="highlight-section options">
            <div className={"highlight-store-button "} onClick={this.changeMenu(1)}>
                <div className="highlight-store-name">
                    {this.productText.buy}
                </div>
                <div className="highlight-store-price"><div className="love-icon"/></div>
            </div>
            <div className={"highlight-store-button "} onClick={this.changeMenu(2)}>
                <div className="highlight-store-price">
                    {this.productText.show}
                </div>
            </div>
        </div>
        <div className="highlight-field">
            {this.productText.description}
        </div>
        <div className="highlight-section">
            <div className="highlight-field">
                <div className="highlight-attribute">
                    {this.currenciesText.love}
                </div>
                <div className="highlight-value">
                    {lps}/s
                    <div className="highlight-love-icon"/>
                </div>
            </div>
            <div className="highlight-field">
                <div className="highlight-attribute">
                    {this.productText.lovePerBuilding}
                </div>
                <div className="highlight-value">
                    {perBuilding}
                    <div className="highlight-love-icon"/>
                </div>
            </div>
            <div className="highlight-field">
                <div className="highlight-attribute">
                    {this.productText.maxUpgradeLevel}
                </div>
                <div className="highlight-value">
                    {upgradeMax}
                </div>
            </div>
        </div>
      </div>
    )
  }

  renderBuyMenu(king: King, level: number, seeBought:boolean=false){
      const {selectedUpgrade} = this.state;
      const upgradeText = getKingUpgradeText(selectedUpgrade)
      const isUpgradeSelected = selectedUpgrade!==''
      const title = isUpgradeSelected ? upgradeText.title : this.productText.defaultTitle
      const description = isUpgradeSelected ? upgradeText.description : this.productText.defaultDescription
      const upgradePrice = isUpgradeSelected ? king.getUpgradePrice(selectedUpgrade).currency : ''
      const price = toFormat(upgradePrice) 
      const canBuy = selectedUpgrade!=='' ? king.canBuyUpgrade(selectedUpgrade) ? "" : "locked" : "locked"
      return (
        <div className="highlight king-shop">
            <div className="highlight-section upgrades-shop scroll-y">
                {seeBought ? this.renderBoughtUpgrades(king,level) : this.renderAvailableUpgrades(king, level)}
            </div>
            <div className="highlight-section">
                {isUpgradeSelected && !seeBought && <div className={"highlight-store-button "+canBuy} onClick={this.buyUpgrade(selectedUpgrade, king)}>
                    <div className="highlight-store-name">
                        {this.productText.buy + " "+price}
                    </div>
                    <div className="highlight-store-price"><div className="love-icon"/></div>
                </div>}
                <div className={"highlight-store-button "} onClick={this.changeMenu(0)}>
                    <div className="highlight-store-name">
                        {this.commonText.close}
                    </div>
                </div>
                <div className="highlight-field title">
                    {title}
                </div>
                <div className="highlight-field">
                    {description}
                </div>
            </div>
        </div>
      )
  }

  renderBoughtUpgrades(king: King, level:number){
    const upgrades = king.getUpgrades()
    const bought = upgrades.filter((upgrade)=> king.getUpgradeLevel(upgrade.id)>0)
    return bought.map((upgrade)=> this.renderItem(upgrade, king, level))
  }

  renderAvailableUpgrades(king: King, level:number){
    const upgrades = king.getAvailableUpgrades()
    return upgrades.map((upgrade)=> this.renderItem(upgrade, king, level))
  }

  renderItem(item:UpgradeKing, king: King, currentLevel: number){
    const canBuyClass = king.canBuyUpgrade(item.id, currentLevel) ? "" : "disabled"
    const itemLevel = king.getUpgradeLevel(item.id)
    const iconStyle = {
        backgroundImage: `url(${item.getIcon().icon})`
    }
    return(
        <div className={"highlight-king-item "+canBuyClass} style={iconStyle} onClick={this.upgradeSelect(item.id)}>
          <div className="highlight-king-item-level">{itemLevel}</div>
        </div>
    )
  }

  upgradeSelect = (upgradeId: string) => () => {
    this.setState({
        selectedUpgrade: upgradeId
    })
  }

  changeMenu = (menu:number) => () => {
    this.setState({
        show: menu
    })
  }

  buyUpgrade = (upgradeId: string, king: King) => () => {
    king.buyUpgrade(upgradeId)
    this.setState({
        selectedUpgrade: ''
    })
  }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency).getValue(),
  treats: selecters.getVariable(state, ids.treats).getValue(),
  level: selecters.getVariable(state, ids.upgradeShop).getValue(),
})

export default connect(mapStateToProps)(KingUI);