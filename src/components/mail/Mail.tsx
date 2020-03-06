import React, {Component} from 'react'
import { connect } from 'react-redux'
import './mail.css'
import {Notification as Mail} from '../../game/NotificationManager'
import {selecters, actions} from '../../reducers/Mails'
import ids from '../../game/VariableId'

import { Variable } from '../../game/Variables'

import {toFormat} from '../../utils/uiUtil'
import GameManager from '../../game/GameManager'

interface IRecipeProps {
    mails: any,
    unseen:any,
    dispatch: Function
}

interface IState {
  isHover: boolean
}

class MailUI extends Component<IRecipeProps,IState> {
  constructor(props:any){
    super(props)
    this.state = {
      isHover: false,
    }
  }

  componentDidMount(){
    this.props.dispatch(actions.updateMails())
  }

  handleHover = (isHover:boolean) => () =>{
    this.setState({
      isHover
    })
    if (!isHover){
      GameManager.getInstance().getNotificationManager().markAllNotificationsAsSeen()
      this.props.dispatch(actions.updateMails())
    }
  }

  render(){
    const {mails, unseen} = this.props
    const {isHover} = this.state
    const unread = unseen > 0 ? "dance" : ""
    return (
      <div className="mail" onMouseEnter={this.handleHover(true)} onMouseLeave={this.handleHover(false)}>
          <div className="mail-icon">
            <div className="mail-notification-icon">
              <span className={"mail-notification-unseen "+unread}>{unseen}</span></div>
          </div>
          {isHover && this.renderNotificationTab(mails)}
      </div>
    )
  }

  renderNotificationTab(mails: Array<Mail>){
    return (
        <div className="mail-tab">
            <div className="mail-list">
              {mails.map((m:Mail)=>this.renderMail(m))}
            </div>
        </div>
    )
  }

  renderMail(mail: Mail){
    const {image, background} = mail
    const styleMail = background ? {backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%), url(${background})`} : {}
    const styleIcon= {backgroundImage: `url(${image})`}
      return (
            <div className="mail-mail" style={styleMail}>
                <div className="mail-mail-icon" style={styleIcon}/>
                <div className="mail-mail-info">
                  <p className="mail-mail-title">{mail.title}</p>
                  <span className="mail-mail-description">{mail.description}</span>
                </div>
            </div>
      )
  }
}

const mapStateToProps = (state:any) => ({
  mails: selecters.getMails(state),
  unseen: selecters.getUnseenAmount(state)
})

export default connect(mapStateToProps)(MailUI);