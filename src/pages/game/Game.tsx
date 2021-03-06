import React, { Component } from "react";
import { connect } from "react-redux";
import "./game.css";

import { selecters, actions } from "../../reducers/GameVariables";
import ids from "../../game/VariableId";

import GameManager from "../../game/GameManager";
import { Variable } from "../../game/Variables";

import Currencies from "../../components/currencies/Currencies";
import SaveManager from "../../components/saveManager/SaveManager";

import Box from "../../components/box/Box";
//Buildings
import Doggie from "../../components/doggie/Doggie";
import Product0 from "../../components/products/product0/Product0";
import Product1 from "../../components/products/product1/Product1";
import Laboratory from "../../components/products/Laboratory/Laboratory";
import Mail from "../../components/mail/Mail";
import TimeWizard from "../../components/products/timeWizard/TimeWizard";
import Park from "../../components/products/park/Park";
import King from "../../components/products/King/King";
import Tree from "../../components/products/tree/Tree";
import Museum from "../../components/products/museum/Museum";
import LetGo from "../../components/letGo/LetGo";
// Ui
import DogSkins from "../../components/dogSkins/DogSkins";
import Dogchivements from "../../components/dogchivements/Dogchivements";
import FadeGame from "../../components/fadeGame/FadeGame";

interface IRecipeProps {
  dispatch: Function;
  currency: Variable;
  dogWizard: Variable;
}

class Game extends Component<IRecipeProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      plusCurrencies: [],
    };
  }

  componentDidMount() {
    this.props.dispatch(actions.updateVariables());
    GameManager.getInstance().initializeUI();
  }

  renderProducts() {
    const products = GameManager.getInstance()
      .getProductManager()
      .getAvailableProducts();
    return products.map((p, i) => {
      switch (p.variableId) {
        case ids.product1Level:
          return (
            <Box key={1} productId={p.variableId} w={2}>
              <Product1 />
            </Box>
          );
        case ids.product2Level:
          return (
            <Box key={2} productId={p.variableId} w={2}>
              <Laboratory />
            </Box>
          );
        case ids.product4Level:
          return (
            <Box key={4} w={2} productId={p.variableId}>
              <Park />
            </Box>
          );
        case ids.upgradeShop:
          return (
            <Box key={5} w={1} productId={p.variableId}>
              <King />
            </Box>
          );
        case ids.treeOfGoodBoys:
          return (
            <Box key={6} w={2} productId={p.variableId}>
              <Tree />
            </Box>
          );
        case ids.museum:
          return (
            <Box key={7} w={1} productId={p.variableId}>
              <Museum />
            </Box>
          );
        default:
          return (
            <Box key={0} productId={p.variableId} w={1}>
              <Product0 />
            </Box>
          );
      }
    });
  }

  render() {
    const { dogWizard } = this.props;
    return (
      <div className="game">
        <div className="game-header">
          <Currencies />
          <Mail />
          <SaveManager />
        </div>
        <div className="product-list">
          <Box>
            <Doggie key={777} />
          </Box>
          {dogWizard?.getValue() > 0 && (
            <Box key={3} w={1}>
              <TimeWizard />
            </Box>
          )}
          {this.renderProducts()}
        </div>
        <Dogchivements />
        <DogSkins />
        <LetGo />
        <FadeGame animationDuration={20} />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  currency: selecters.getVariable(state, ids.currency),
  dogWizard: selecters.getVariable(state, ids.product3Level),
});

export default connect(mapStateToProps)(Game);
