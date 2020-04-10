import React, {Component} from 'react'
import { connect } from 'react-redux'
import './letGo.css'
import {selecters, actions} from '../../reducers/uiUtils'
import {selecters as uiVariables} from '../../reducers/GameVariables'
import {actions as variablesUi} from '../../reducers/GameVariables'
import GameManager from '../../game/GameManager'
import { getText } from '../../utils/textUtil'
import permaVariables from '../../game/PermaVariablesId'
import ids from '../../game/VariableId'
import { Tree } from '../../game/products/Tree'
import { toFormatPure } from '../../utils/uiUtil'
import Decimal from 'break_infinity.js'

interface IRecipeProps {
    level: number
    patiencePoints: Decimal
    dispatch: Function
}

interface IState {
  selectedSkin: string,
  hoverOption: boolean
}

class DogSkinsUI extends Component<IRecipeProps,IState> {
    text = getText().products.tree
    currencies = getText().currencies
  constructor(props:any){
    super(props)
    this.state = {
        selectedSkin: '',
        hoverOption: false
    }
  }

  closeArchivements = () => (e:any) => {
    if (e.target.id==="letGo"){
        this.props.dispatch(actions.setLetGoScreenLevel(0))
    }
  }

  render(){
    const {level, patiencePoints} = this.props
    const tree = GameManager.getInstance().getProductManager().getProduct(ids.treeOfGoodBoys) as Tree
    const goodBoyPoints = tree.getGoodBoyPointsThisGame()
    const goodBoyPointsPrevious = tree.getUsableGoodBoyPointsPoints()
    return (
      level>0 && 
      <div className="archivements let-go" id="letGo" onClick={this.closeArchivements()}>
        <div className="archivements-box">
            <div className="let-go-box-dog"></div>
            <div className="let-go-box">
                <div className="archivements-box-title">
                    <span className={"archivements-box-title-text"}>{this.text.areYouSure}</span>
                </div>
                <div className="dog-skins-view">
                    {this.text.letGoScreenText}
                    <div className={"highlight-field blessing-view-field"}>
                        <span className="highlight-attribute title">{this.text.goodBoyPoints}</span>
                        <span className="highlight-value">{toFormatPure(goodBoyPoints.add(goodBoyPointsPrevious))}<div className="gbp-icon"/></span>
                    </div>
                    <div className={"highlight-field blessing-view-field"}>
                        <span className="highlight-attribute title">{this.currencies.pattience}</span>
                        <span className="highlight-value">{toFormatPure(patiencePoints)}<div className="patience-icon"/></span>
                    </div>
                </div>
                <div className="let-go-options">
                    <div className="let-go-option" onClick={this.close()}>{this.text.notYet}</div>
                    <div className="let-go-option let-go-button" onClick={this.letGo(tree)}>{this.text.imReady}</div>
                </div>
            </div>
         </div>
       </div>
    )
  }

  close = ()=> ()=>{
      this.props.dispatch(actions.setLetGoScreenLevel(0))
  }

  letGo = (tree: Tree)=> ()=> {
    this.props.dispatch(actions.showFadeGame(true))
    setTimeout(()=>{
      this.close()()
      if (tree.canLetGo()){
        GameManager.getInstance().letGo()
      }
    },5000)
  }
}

const mapStateToProps = (state:any) => ({
    level: selecters.getLetGoScreenlevel(state),
    patiencePoints: uiVariables.getVariable(state, ids.patiencePoints)?.getValue()
})

export default connect(mapStateToProps)(DogSkinsUI);