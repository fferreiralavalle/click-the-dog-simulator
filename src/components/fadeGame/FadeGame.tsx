import React, { Component } from "react";
import { connect } from "react-redux";
import "./fadeGame.css";
import { selecters, actions } from "../../reducers/uiUtils";
import { getText } from "../../utils/textUtil";

interface IRecipeProps {
  display?: boolean;
  animationDuration: number;
  dispatch: Function;
}

interface IState {
  selectedSkin: string;
  hoverOption: boolean;
}

class DogSkinsUI extends Component<IRecipeProps, IState> {
  text = getText().dogSkins;
  timeout: any;
  constructor(props: any) {
    super(props);
    this.state = {
      selectedSkin: "",
      hoverOption: false,
    };
  }

  endFade() {
    this.props.dispatch(actions.showFadeGame(false));
  }

  setFadeTimeout() {
    const { animationDuration } = this.props;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.endFade(), 1000 * animationDuration);
  }

  render() {
    const { display, animationDuration } = this.props;
    const style = {
      animationDuration: animationDuration + "s",
    };
    if (display) {
      this.setFadeTimeout();
    }
    return (
      display && (
        <div className="fade-game" style={style}>
          <h1 className="fade-game-thanks"> Thank you for loving us ❤️🐶</h1>
        </div>
      )
    );
  }
}

const mapStateToProps = (state: any) => ({
  display: selecters.showFadeGame(state),
});

export default connect(mapStateToProps)(DogSkinsUI);
