import React, { Component } from "react";
import "../products/product.css";
import "./doggie.css";

import { getDogSkinIcon } from "../../utils/uiUtil";

interface IRecipeProps {
  onClick?: Function;
  selectedDogBreed: string;
}

interface IState {
  isPetted: boolean;
}

class DoggiePicture extends Component<IRecipeProps, IState> {
  petTimeout: any;

  constructor(props: any) {
    super(props);
    this.state = {
      isPetted: false,
    };
    this.petTimeout = null;
  }

  onClickedDog(event: any) {
    const { onClick } = this.props;
    this.setState({
      isPetted: true,
    });
    clearTimeout(this.petTimeout);
    this.petTimeout = setTimeout(() => {
      this.setState({
        isPetted: false,
      });
    }, 500);
    if (typeof onClick === "function") {
      onClick(event);
    }
  }

  render() {
    const { isPetted } = this.state;
    const { selectedDogBreed } = this.props;
    const dogPicture = getDogSkinIcon(selectedDogBreed).icon;
    const style = {
      backgroundImage: `url(${dogPicture})`,
    };
    return (
      <div
        className={`doggie ${isPetted ? "petted" : ""}`}
        onClick={(e) => this.onClickedDog(e)}
        style={style}
      ></div>
    );
  }
}

export default DoggiePicture;
