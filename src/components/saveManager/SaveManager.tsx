import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../products/product.css'
import './saveManager.css'
import GameManager from '../../game/GameManager'

class Currencies extends Component {

    onSave = () => ()=>{
        GameManager.getInstance().saveGame()
    }

    onReset = () => ()=>{
        GameManager.getInstance().resetGame()
    }

    onHardReset = ()=> () => {
        GameManager.getInstance().hardResetGame()
    }

    render(){
        
        return (
        <div className="save-manager">
            <div className="save-option">
                <div className="save-button button-save" onClick={this.onSave()}>Save</div>
                <div className="save-button button-reset" title="Resfresh page to see changes" onClick={this.onReset()}>Reset</div>
                <div className="save-button button-reset-hard" title="Resfresh page to see changes" onClick={this.onHardReset()}>Hard Reset</div>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
})

export default connect(mapStateToProps)(Currencies);