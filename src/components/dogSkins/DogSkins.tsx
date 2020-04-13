import React, { Component } from "react";
import { connect } from "react-redux";
import "./dogSkins.css";
import { selecters, actions } from "../../reducers/uiUtils";
import { actions as variablesUi } from "../../reducers/GameVariables";
import GameManager from "../../game/GameManager";
import { getText, getDogSkinText } from "../../utils/textUtil";
import { getDogSkinIcon } from "../../utils/uiUtil";
import DogSkinsManager from "../../game/DogSkinsManager";
import { DogSkinInterface } from "../../game/dogSkins/dogSkin";
import permaVariables from "../../game/PermaVariablesId";

interface IRecipeProps {
  display?: boolean;
  dispatch: Function;
}

interface IState {
  selectedSkin: string;
  hoverOption: boolean;
}

class DogSkinsUI extends Component<IRecipeProps, IState> {
  text = getText().dogSkins;
  constructor(props: any) {
    super(props);
    this.state = {
      selectedSkin: "",
      hoverOption: false,
    };
  }

  handleSelectDog = (selectedSkin: string) => () => {
    this.setState({
      selectedSkin: selectedSkin,
    });
  };

  handleBreedChoice = (selectedSkin: string) => () => {
    GameManager.getInstance().setPermaVariable(
      selectedSkin,
      permaVariables.selectedDogBreed
    );
    this.props.dispatch(variablesUi.updateVariables());
  };

  closeArchivements = () => (e: any) => {
    if (e.target.id === "dogSkin") {
      this.props.dispatch(actions.showDogSkins(false));
    }
  };

  render() {
    const { display } = this.props;
    const dogSkinManager = GameManager.getInstance().getDogSkinManager();
    return (
      display && (
        <div
          className="archivements"
          id="dogSkin"
          onClick={this.closeArchivements()}
        >
          <div className="archivements-box">
            <div className="archivements-box-title">
              <span className={"archivements-box-title-text"}>
                {this.text.breeds}
              </span>
            </div>
            <div className="dog-skins-view">
              {this.renderSkins(dogSkinManager)}
              {this.renderBreedInfo(dogSkinManager)}
            </div>
          </div>
        </div>
      )
    );
  }

  renderSkins(archivementManager: DogSkinsManager) {
    const archivements = archivementManager.getDogSkins();
    return (
      <div className="archivements-list">
        {this.renderInitialDog()}
        {archivements.map((skin, index) => this.renderSkin(skin, index))}
      </div>
    );
  }

  renderInitialDog() {
    const archivementUI = getDogSkinIcon("initial");
    const icon = {
      backgroundImage: `url(${archivementUI.icon})`,
    };
    return (
      <div
        className={`archivement`}
        key={"archivement-initial-good-boy"}
        onClick={this.handleSelectDog("")}
      >
        <div className="archivement-icon" style={icon}></div>
      </div>
    );
  }

  renderSkin(archivement: DogSkinInterface, index: number) {
    const unlocked = archivement.inUnlocked();
    const lockedClass = unlocked ? "" : "locked";
    const archivementUI = getDogSkinIcon(archivement.varId);
    const icon = {
      backgroundImage: `url(${archivementUI.icon})`,
    };
    return (
      <div
        className={`archivement ${lockedClass}`}
        key={"archivement-" + index}
        onClick={this.handleSelectDog(archivement.varId)}
      >
        <div className="archivement-icon" style={icon}></div>
      </div>
    );
  }

  handleHoverOption = (hover: boolean) => () => {
    this.setState({
      hoverOption: hover,
    });
  };

  renderBreedInfo(dogSkinManager: DogSkinsManager) {
    const { selectedSkin, hoverOption } = this.state;
    const archivement = dogSkinManager.getDogSkin(selectedSkin);
    const id = archivement ? archivement.varId : "initial";
    const skinText = getDogSkinText(id);
    const archivementUI = getDogSkinIcon(id);
    const unlocked = archivement ? archivement.inUnlocked() : true;
    const icon = {
      backgroundImage: `url(${archivementUI.icon})`,
    };
    const lockedClass = unlocked ? "" : " locked";
    const hoverClass = hoverOption ? " exited" : "";
    return (
      <div className="breed-info">
        <div className={"breed-icon" + lockedClass + hoverClass} style={icon}>
          {unlocked && (
            <div
              className="breed-info-select"
              onMouseEnter={this.handleHoverOption(true)}
              onMouseLeave={this.handleHoverOption(false)}
              onClick={this.handleBreedChoice(id)}
            >
              {this.text.choose}
            </div>
          )}
        </div>
        <div className="breed-info-text">
          <div className="breed-info-text-name">{skinText.breed}</div>
          <div className="breed-info-text-description">
            {this.text.origin}: {unlocked ? skinText.origin : "???"}
          </div>
          <div className="breed-info-text-description">
            {unlocked ? skinText.description : "..."}
          </div>
          <div className="breed-info-text-description">
            {unlocked ? skinText.temperament : ""}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  display: selecters.showDogSkins(state),
});

export default connect(mapStateToProps)(DogSkinsUI);
