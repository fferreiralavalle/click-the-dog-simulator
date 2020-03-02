import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../products/product.css'
import './saveManager.css'

import {selecters} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import { Variable } from '../../game/Variables'
import GameManager from '../../game/GameManager'

interface IRecipeProps {
    
}

class Currencies extends Component<IRecipeProps> {

    onSave = () => ()=>{
        GameManager.getInstance().saveGame()
    }

    onReset = () => ()=>{
        GameManager.getInstance().resetGame()
    }

    render(){
        
        return (
        <div className="save-manager">
            <div className="save-option">
                <div className="product-upgrade button-save" onClick={this.onSave()}>Save</div>
                <div className="product-upgrade button-reset" onClick={this.onReset()}>Reset</div>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
})

export default connect(mapStateToProps)(Currencies);