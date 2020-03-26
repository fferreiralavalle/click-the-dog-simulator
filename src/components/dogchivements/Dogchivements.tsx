import React, {Component} from 'react'
import { connect } from 'react-redux'
import './dogchivements.css'
import {selecters, actions} from '../../reducers/uiUtils'
import GameManager from '../../game/GameManager'
import { getText, getArchivementText } from '../../utils/textUtil'
import { ArchivementInterface } from '../../game/Archivements/Archivement'
import variables from '../../game/VariableId'
import ArchivementManager from '../../game/ArchivementManager'
import { getArchivementIcon } from '../../utils/uiUtil'

interface IRecipeProps {
    display?: boolean
    dispatch: Function
}

interface IState {
  selectedArchivement: string
}

class MailUI extends Component<IRecipeProps,IState> {
    text = getText().archivements
  constructor(props:any){
    super(props)
    this.state = {
        selectedArchivement: variables.archivementClicks,
    }
  }

  handleSelectArchivement = (selectedArchivement:string) => () =>{
    this.setState({
        selectedArchivement
    })
  }

  closeArchivements = () => (e:any) => {
    if (e.target.id==="archivement"){
        this.props.dispatch(actions.showArchivements(false))
    }
  }

  render(){
    const {display} = this.props
    const archivementManager = GameManager.getInstance().getArchivementManager()
    return (
      display && <div className="archivements" id="archivement" onClick={this.closeArchivements()}>
          <div className="archivements-box">
            <div className="archivements-box-title">
              <span className={"archivements-box-title-text"}>{this.text.archivemntTitle}</span>
            </div>
            {this.renderArchivements(archivementManager)}
            {this.renderArhivementInfo(archivementManager)}
          </div>
      </div>
    )
  }

  renderArchivements(archivementManager: ArchivementManager){
      const archivements = archivementManager.getArchivements()
      return (
          <div className="archivements-list">
              {archivements.map((archivement,index)=>this.renderArchivement(archivement,index))}
          </div>
      )
  }

  renderArchivement(archivement: ArchivementInterface, index:number){
    const unlocked = archivement.inUnlocked()
    const lockedClass = unlocked ? "" : "locked"
    const archivementUI = getArchivementIcon(archivement.varId)
    const icon = {
        backgroundImage: `url(${archivementUI.icon})`
    }
    return (
        <div className={`archivement ${lockedClass}`} 
             key={'archivement-'+index}
             onClick={this.handleSelectArchivement(archivement.varId)}>
            <div className="archivement-icon" style={icon}>
            </div>
        </div>
    )
  }

  renderArhivementInfo(archivementManager: ArchivementManager){
    const {selectedArchivement} = this.state
    const archivement = archivementManager.getArchivement(selectedArchivement)
    const archivementText = getArchivementText(archivement.varId)
    const archivementUI = getArchivementIcon(archivement.varId)
    const unlocked = archivement.inUnlocked()
    const icon = {
        backgroundImage: `url(${archivementUI.icon})`
    }
    const lockedClass = unlocked ? "" : "locked"
    return (
        <div className="archivements-info">
            <div className={"archivement-icon "+lockedClass} style={icon}></div>
            <div className="archivements-info-text">
                <div className="archivements-info-text-name">
                    {archivementText.title}
                </div>
                <div className="archivements-info-text-description">
                    {unlocked ? archivementText.description : '???'}
                </div>
            </div>
            
        </div>
    )
  }
}

const mapStateToProps = (state:any) => ({
    display: selecters.showArchivements(state)
})

export default connect(mapStateToProps)(MailUI);