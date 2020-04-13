import React, { Component } from "react";
import "./tree.css";

import { toFormatPure } from "../../../utils/uiUtil";
import Decimal from "break_infinity.js";

interface IRecipeProps {
  points: Decimal;
  [key: string]: any;
}

interface IState {
  points: Decimal;
}

export class GoodBoyPointsSign extends Component<IRecipeProps, IState> {
  setNewPoints(value: Decimal) {
    this.setState({
      points: value,
    });
  }
}

class GoodBoyPointsSignUI extends GoodBoyPointsSign {
  constructor(props: any) {
    super(props);
    this.state = {
      points: props.points,
    };
  }

  render() {
    const { points, ref, product, className, ...rest } = this.props;
    const { points: statePoints } = this.state;
    return (
      <div {...rest} className={"tree-gbp " + className}>
        <div className="tree-gbp-value">
          {toFormatPure(statePoints)}
          <div className="gbp-icon"></div>
        </div>
      </div>
    );
  }
}

export default GoodBoyPointsSignUI;
