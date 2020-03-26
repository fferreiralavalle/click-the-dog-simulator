import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../products/product.css'
import './doggie.css'

import {selecters, actions} from '../../reducers/GameVariables'
import {actions as uiActions} from '../../reducers/uiUtils'
import ids from '../../game/VariableId'

import GameManager from '../../game/GameManager'
import { Variable } from '../../game/Variables'
import {toFormat, clearPluses} from '../../utils/uiUtil'
import { plusCurrency } from '../products/ProductPlus'
import ProductPlusDog, {productPlusInterface} from '../products/ProductPlusDog'
import { Currency } from '../../game/products/Product'
import DoggiePicture from './DoggiePicture'
import { events } from '../../game/products/Park'
import DoggieName from './DoggieName'
import permaVariables from '../../game/PermaVariablesId'

interface IRecipeProps {
    dispatch: Function;
    selectedDogPicture: string
}

interface IState {
    isHover: boolean;
}

class Doggies extends Component<IRecipeProps,IState> {

    petTimeout: any
    plusDog = React.createRef<ProductPlusDog>()
    dogPicture = React.createRef<DoggiePicture>()

    constructor(props:any){
        super(props)
        this.state = {
            isHover: false,
        }
        this.petTimeout = null
    }

    onClickedDog(event:any){
        const earned = GameManager.getInstance().onClickedDog()
        const currentPlus = this.dogPicture.current as DoggiePicture
        currentPlus.onClickedDog(event)
        this.props.dispatch(actions.updateVariables())
        console.log("dog clicked!")
        this.plusCurrencyEffect(earned, event)
    }

    plusCurrencyEffect(earned: Currency, e:any){
        var rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.
        const currentPlus = this.plusDog.current as productPlusInterface
        let plus :plusCurrency= {
            value: "+"+toFormat(earned.currency),
            key: (new Date).toString()+(Math.random()),
            x: x+"px",
            y: y+"px",
            className:"love-icon",
            size: (1 + Math.random() * 0.25)
        }
        currentPlus.addCurrency(plus)
        if (!earned.treats.equals(0)){
            plus.value = "+"+toFormat(earned.treats)
            plus.key = (new Date).toString()+(Math.random())
            plus.size = (1 + Math.random() * 0.25)
            plus.className = "treat-icon"
            plus.x = x-70+"px"
            currentPlus.addCurrency(plus)
        }
    }

    showArchivements = () => () => {
        this.props.dispatch(uiActions.showArchivements(true))
    }

    showDogSkins = () => () => {
        this.props.dispatch(uiActions.showDogSkins(true))
    }

    render(){
        const {selectedDogPicture} = this.props
        return (
            <div className="doggie-background boxed">
                <DoggiePicture selectedDogBreed={selectedDogPicture} ref={this.dogPicture}/>
                <div className="doggie-plus">
                    <ProductPlusDog ref={this.plusDog}/>
                </div>
                <div className="doggie-click" onClick={(e:any)=>this.onClickedDog(e)}/>
                <DoggieName/>
                <div className="doggie-options">
                    <div className="doogie-options-option" onClick={this.showArchivements()}>
                        <div className="doogie-options-option-icon"></div>
                    </div>
                    <div className="doogie-options-option" onClick={this.showDogSkins()}>
                        <div className="doogie-options-option-icon doggie-skins-icon"></div>
                    </div>
                </div>
                
        </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
    selectedDogPicture: selecters.getVariable(state, permaVariables.selectedDogBreed)?.getValue()
})

export default connect(mapStateToProps)(Doggies);