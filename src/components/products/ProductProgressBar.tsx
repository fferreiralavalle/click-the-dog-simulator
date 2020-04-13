import React, { Component } from "react";

interface IRecipeProps {
  value: string;
  title: string;
  progress: number;
  [key: string]: any;
}

interface IState {
  value: string;
  title: string;
  progress: number;
}

class ProductProgressBar extends Component<IRecipeProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: props.value,
      title: props.title,
      progress: props.progress,
    };
  }

  setNewValue(value: string) {
    this.setState({
      value: value,
    });
  }

  setNewProgress(progress: number) {
    this.setState({
      progress: progress,
    });
  }

  render() {
    const { value, title, ref, progress, className, ...rest } = this.props;
    const { value: valueState, progress: progressState } = this.state;
    const progressStyle = {
      width: `${progressState * 100}%`,
    };
    return (
      <div {...rest} className={"progress " + className}>
        <div className="event-title">{title}</div>
        <div className={"progress-bar"}>
          <div className="progress-bar-progress" style={progressStyle}></div>
          <div className="progress-bar-value">{valueState}</div>
        </div>
      </div>
    );
  }
}

export default ProductProgressBar;
