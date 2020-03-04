import React, {Component} from 'react'
import { connect } from 'react-redux'
import './product.css'

import {selecters, actions} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import {TimeSubscriber} from '../../game/TimeManager'
import variableIds from  '../../game/VariableId'
import { Variable } from '../../game/Variables'
import GameManager from '../../game/GameManager'
import {toFormat} from '../../utils/uiUtil'

interface IRecipeProps {
    productId: string,
    dispatch: Function,
    [key: string]: any
}

class LevelUpButton extends Component<IRecipeProps> {

    levelup = () => () => {
        const {productId} = this.props;
        GameManager.getInstance().getProductManager().levelUpProduct(productId)
        this.props.dispatch(actions.updateVariables())
    }

    render(){
        const {productId, ...rest} = this.props;
        const product = GameManager.getInstance().getProductManager().getProduct(productId)
        const canLevelUp = product.canLevelUp()
        const levelUpPrice = product.getLevelUpPrice()
        const levelUpCurrency:string= toFormat(product.getLevelUpPrice().currency)
        const levelUpTreats:string= toFormat(product.getLevelUpPrice().treats)
        return (
            <div className={`product-upgrade ${!canLevelUp && "disabled"}`} onClick={this.levelup()} {...rest}>
                {levelUpPrice.currency > 0 && (
                    <React.Fragment>
                        {levelUpCurrency}
                        <div className="highlight-love-icon"/>
                    </React.Fragment>)
                }
                {levelUpPrice.treats > 0 && (
                    <React.Fragment>
                        {levelUpTreats}
                        <div className="treat-icon"/>
                    </React.Fragment>)
                }
            </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
  currency: selecters.getVariable(state, ids.currency),
})

export default connect(mapStateToProps)(LevelUpButton);