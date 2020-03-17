import React, {Component} from 'react'
import { connect } from 'react-redux'
import '../products/product.css'
import './doggie.css'

import {selecters, actions} from '../../reducers/GameVariables'
import ids from '../../game/VariableId'

import GameManager from '../../game/GameManager'
import { Variable } from '../../game/Variables'
import {toFormat, clearPluses} from '../../utils/uiUtil'
import ProductPlus, { plusCurrency } from '../products/ProductPlus'
import { Currency } from '../../game/products/Product'

interface IRecipeProps {
    onClick?: Function
}

interface IState {
    isPetted: boolean
}

class DoggiePicture extends Component<IRecipeProps,IState> {

    petTimeout: any

    constructor(props:any){
        super(props)
        this.state = {
            isPetted: false
        }
        this.petTimeout = null
    }

    onClickedDog(event:any){
        const {onClick} = this.props
        this.setState({
            isPetted: true
        })
        clearTimeout(this.petTimeout)
        this.petTimeout = setTimeout(()=>{
            this.setState({
                isPetted: false
            })
        }, 500)
        if (typeof onClick==='function'){
            onClick(event)
        }
    }

    render(){
        const {isPetted} = this.state
        return (
            <div className={`doggie ${isPetted ? "petted": ""}`} onClick={(e)=>this.onClickedDog(e)}>
                
            </div>
        )
    }
}

export default DoggiePicture;