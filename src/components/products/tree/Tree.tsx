import React, { Component } from "react";
import { connect } from "react-redux";
import "../product.css";
import "./tree.css";

import { selecters } from "../../../reducers/GameVariables";
import ids from "../../../game/VariableId";

import { Variable } from "../../../game/Variables";
import GameManager from "../../../game/GameManager";
import { Park, events } from "../../../game/products/Park";
import LevelUpButton from "../LevelUpButton";
import { toFormat, getBlessingIcon, toFormatPure } from "../../../utils/uiUtil";
import { getText, getBlessingText } from "../../../utils/textUtil";
import { Tree, BlessingTier } from "../../../game/products/Tree";
import Decimal from "break_infinity.js";
import { Blessing } from "../../../game/blessings/Blessing";
import GoodBoyPointsSignUI from "./GoodBoySign";
import { actions } from "../../../reducers/uiUtils";

interface IRecipeProps {
  level: Variable;
  dispatch: Function;
}

interface IState {
  isHover: boolean;
  hoverLevel: boolean;
  displayedEvent: string;
  viewRelics: boolean;
  displayedBlessing: string;
  pickedBlessings: string[];
}

class TreeUi extends Component<IRecipeProps, IState> {
  commonText = getText().products.common;
  currencyText = getText().currencies;
  productText = getText().products.tree;
  uiCleaner: any;
  constructor(props: any) {
    super(props);
    this.state = {
      isHover: false,
      hoverLevel: false,
      displayedEvent: events.pupsloration.id,
      viewRelics: false,
      displayedBlessing: ids.blessing0A,
      pickedBlessings: [],
    };
    const product = GameManager.getInstance()
      .getProductManager()
      .getProduct(ids.treeOfGoodBoys) as Tree;
    product.subscribeToCurrency({
      id: "uiOnUpdate",
      onCurrency: () => this.onCurrencyGain(product),
    });
  }
  onCurrencyGain = (product: Tree) => {
    const myRef = this.refs.goodBoyPointsSign as GoodBoyPointsSignUI;
    const points = product.getGoodBoyPointsThisGame();
    if (myRef) myRef.setNewPoints(points);
  };

  getBlessingData = (blessingId: string) => {
    return getBlessingText(blessingId);
  };

  onHover = (isHover: boolean) => () => {
    this.setState({
      isHover,
    });
  };

  onLevelHover = (hoverLevel: boolean) => () => {
    this.setState({
      hoverLevel,
    });
  };

  render() {
    const { level } = this.props;
    const { isHover, viewRelics } = this.state;
    const product = GameManager.getInstance()
      .getProductManager()
      .getProduct(ids.treeOfGoodBoys) as Tree;
    const points = product.getGoodBoyPointsThisGame();
    const previousPoints = product.getUsableGoodBoyPointsPoints();
    const canPickBlessings = product.canPickBlessings();
    return (
      <div
        className="product tree boxed"
        onMouseEnter={this.onHover(true)}
        onMouseLeave={this.onHover(false)}
      >
        <div className="tree-building"></div>
        <div className="product-level">{level.getValue()}</div>
        <div className="tree-title">{this.productText.title}</div>
        <LevelUpButton
          productId={ids.treeOfGoodBoys}
          onMouseEnter={this.onLevelHover(true)}
          onMouseLeave={this.onLevelHover(false)}
        />
        <GoodBoyPointsSignUI ref="goodBoyPointsSign" points={points} />
        {previousPoints.gt(0) && (
          <React.Fragment>
            <div className="tree-gbp-total">{this.productText.previous}</div>
            <GoodBoyPointsSignUI
              ref="goodBoyPointsSignTotal"
              className="gbp-sign-total"
              points={previousPoints}
            />
          </React.Fragment>
        )}
        {isHover &&
          (viewRelics
            ? this.renderBlessigsView(product, canPickBlessings)
            : this.renderHighlight(product))}
      </div>
    );
  }

  renderHighlight(product: Tree) {
    const { level } = this.props;
    const usedLevel: number =
      level.getValue() + (this.state.hoverLevel ? 1 : 0);
    const multiplier: number = product.getGoodBoyPointsMultiplier(usedLevel);
    const perSecondPlayed: Decimal = product.getIncreasePerSecondPlayed();
    const levelClass = this.state.hoverLevel ? " hover-level" : "";
    const totalLevels = product.getPointsPerAllLevel();

    return (
      <div className={"highlight "}>
        <div className="highlight-section">
          <div className="highlight-field title">{this.productText.title}</div>
          <div className="highlight-field">{this.productText.description}</div>
        </div>
        <div className="highlight-section">
          <div className="highlight-field title">
            {this.productText.goodBoyPoints}
          </div>
          <div className={"highlight-field" + levelClass}>
            <div className="highlight-attribute">
              {this.productText.multiplier}
            </div>
            <div className="highlight-value">{multiplier}</div>
          </div>
          <div className="highlight-field">
            <div className="highlight-attribute">
              {this.productText.totalLevels}
            </div>
            <div className="highlight-value">{totalLevels.toString()}</div>
          </div>
          <div className={"highlight-field"}>
            <div className="highlight-attribute">
              {this.productText.perSecond}
            </div>
            <div className="highlight-value">{perSecondPlayed.toString()}</div>
          </div>
          <div className="highlight-field title">
            {this.productText.options}
          </div>
          {this.renderOptions(product)}
        </div>
        <div className="highlight-section">
          <div className="highlight-field title">
            {this.productText.theDesition}
          </div>
          <div className="highlight-field">{this.productText.letGoInfo}</div>
        </div>
      </div>
    );
  }

  renderOptions(tree: Tree) {
    const canletGo = tree.canLetGo();
    const canPickBlessings = tree.canPickBlessings();
    const uiEvents = [
      <div
        className={"highlight-field highlight-event-select"}
        onClick={this.toggleBlessingView(true)}
      >
        {(canPickBlessings ? this.productText.pick + " " : "") +
          this.productText.blessings}
      </div>,
    ];
    if (canletGo) {
      uiEvents.push(
        <div
          className={"highlight-field highlight-event-select special-option"}
          onClick={() => this.showLetGoScreen()}
        >
          {this.productText.letGo}
        </div>
      );
    } else {
      uiEvents.push(
        <div
          className={"highlight-field highlight-event-select special-option"}
        >
          {this.productText.notReady}
        </div>
      );
    }
    return uiEvents;
  }

  renderBlessigsView(tree: Tree, buyMode: boolean) {
    const blessings = tree.getBlessings();
    const { displayedBlessing, pickedBlessings } = this.state;
    const { title, description } = getBlessingText(displayedBlessing);
    const price = tree.getBlessingPrice(displayedBlessing);
    const { icon } = getBlessingIcon(displayedBlessing);
    const iconStyle = {
      backgroundImage: icon ? `url(${icon})` : "",
    };
    const tiers = blessings.map((tier, index) => {
      return this.renderBlessingTier(tier, index);
    });
    const points = tree.getUsableGoodBoyPointsPoints();
    const usedPoints = this.getPickedBlessingsCost(tree);
    const availablePoints = points.sub(usedPoints);
    const isUnlocked = tree.getBlessing(displayedBlessing).isUnlocked();
    const isPicked =
      pickedBlessings.indexOf(displayedBlessing) > -1 || isUnlocked
        ? " picked"
        : "";
    const finishPickingText = availablePoints.gte(0)
      ? this.productText.finish
      : this.productText.notEnough;
    const buyButton = buyMode ? (
      <div className={"highlight-blessing-options"}>
        <div className={"highlight-field blessing-view-field"}>
          <span className="highlight-value">
            {" "}
            {toFormat(availablePoints)}
            <div className="gbp-icon" />
          </span>
        </div>
        <div
          className={"highlight-store-button"}
          onClick={this.toogleBlessing(displayedBlessing)}
        >
          <span className="highlight-value">
            {" "}
            {toFormatPure(price)}
            <div className="gbp-icon" />
          </span>
        </div>
      </div>
    ) : (
      <div className={"highlight-field blessing-view-field"}>
        <span className="highlight-attribute title">
          {this.commonText.price}
        </span>
        <span className="highlight-value">
          {price.toString()}
          <div className="gbp-icon" />
        </span>
      </div>
    );
    const clarification = buyMode ? (
      <div
        className={"highlight-store-button finish-picking"}
        onClick={() => this.finishPickingBlessings(tree)}
      >
        <span className="highlight-value">{finishPickingText}</span>
      </div>
    ) : (
      <div className={"highlight-field italic"}>
        {this.productText.blessingsRules}
      </div>
    );
    return (
      <div className={"highlight relic-view"}>
        <div className="highlight-section scroll-y">{tiers}</div>
        <div className={"highlight-section " + isPicked}>
          <div className={"highlight-field title"}>
            <div className="relic-icon" style={iconStyle} />
            <span className="relic-title">{title}</span>
          </div>
          <div className="highlight-field">
            <span className="relic-description">{description}</span>
          </div>
          {buyButton}
          {clarification}
        </div>
        <div
          className="highlight-closeButton"
          onClick={this.toggleBlessingView(false)}
        >
          X
        </div>
      </div>
    );
  }

  getPickedBlessingsCost = (tree: Tree): Decimal => {
    const { pickedBlessings } = this.state;
    let cost = new Decimal(0);
    pickedBlessings.forEach((blessing) => {
      const price = tree.getBlessingPrice(blessing);
      cost = cost.add(price);
    });
    return cost;
  };

  renderBlessingTier(tier: BlessingTier, index: number) {
    const blessings = tier.blessings;
    return (
      <React.Fragment>
        <div className="highlight-field title">
          {this.productText.tier} - {index}
        </div>
        <div className="highlight-tier">
          {blessings.map((relic) => this.renderBlessing(relic))}
        </div>
      </React.Fragment>
    );
  }

  renderBlessing(blessing: Blessing) {
    const { pickedBlessings } = this.state;
    const { icon } = getBlessingIcon(blessing.id);
    const iconStyle = {
      backgroundImage: icon ? `url(${icon})` : "",
    };
    const isUnlocked = blessing.isUnlocked();
    const isPicked =
      pickedBlessings.indexOf(blessing.id) > -1 || isUnlocked ? " picked" : "";
    return (
      <div
        className={"highlight-field" + isPicked}
        onClick={this.selectBlessingView(blessing.id)}
      >
        <div className="relic-icon" style={iconStyle}></div>
      </div>
    );
  }

  selectBlessing = (eventId: string) => () => {
    this.setState({
      displayedEvent: eventId,
    });
  };

  toogleBlessing = (blessingId: string) => () => {
    const { pickedBlessings } = this.state;
    const index = pickedBlessings.indexOf(blessingId);
    if (index > -1) {
      pickedBlessings.splice(index, 1);
    } else {
      pickedBlessings.push(blessingId);
    }
    this.setState({
      pickedBlessings,
    });
  };

  finishPickingBlessings = (tree: Tree) => {
    const { pickedBlessings } = this.state;
    const result = tree.pickBlessings(pickedBlessings);
    this.toggleBlessingView(false)();
    console.log("Blessing picked successful", result);
  };

  selectBlessingView = (blessingId: string) => () => {
    this.setState({
      displayedBlessing: blessingId,
    });
  };

  toggleBlessingView = (view: boolean) => () => {
    this.setState({
      viewRelics: view,
    });
  };

  showLetGoScreen = () => {
    this.props.dispatch(actions.setLetGoScreenLevel(1));
  };

  claimReward = (eventId: string, park: Park) => () => {
    park.claimEventReward(eventId);
  };
}

const mapStateToProps = (state: any) => ({
  level: selecters.getVariable(state, ids.treeOfGoodBoys),
});

export default connect(mapStateToProps)(TreeUi);
