import OperationPath from './Core';
import React from 'react';
import {
  Classes, Colors, Intent, Alignment, Position,
  Icon,
  Tooltip, Toaster,
  Card, Callout,
  Navbar, NavbarGroup, NavbarDivider, NavbarHeading,
  Label, Button, InputGroup, NumericInput, Checkbox
} from '@blueprintjs/core';

const initialState = {
  target: 0,
  tolerance: 9,
  numbers: [],
  operators: {'*': true, '/': true, '+': true, '-': true},
  newNumber: '',
  calculating: null,
  limit: 10,
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.toaster = new Toaster();
    this.state = JSON.parse(JSON.stringify(initialState));
  }
  resetState() {
    this.setState(JSON.parse(JSON.stringify(initialState)));
  }
  getError() {
    let error;
    if (!(this.state.target > 0))
      error = 'hedef sayıyı girin.';
    else if (!(this.state.numbers.length > 5))
      error = 'en az 6 sayı girin.';
    else if (!Object.values(this.state.operators).some(o => o===true))
      error = 'operatörleri seçin.';

    return error;
  }
  updateRenderCalculating() {
    const op = new OperationPath(this.state.target, this.state.numbers);

    op.on('done', result => {
      this.setState({calculating: result});
      console.log(result);
    });

    op.solve(result => {
      if (result.number < this.state.target + this.state.tolerance && result.number > this.state.target - this.state.tolerance)
        return true;
    });
  }
  renderNumbers() {
    const items = [];
    this.state.numbers.filter(Number).forEach((n, i) => {
      items.push(
        <Label>
          <InputGroup
            key={n}
            value={n}
            onChange={(e) => this.state.numbers[i] = e.target.value}
            fill={true}
            rightElement={
              <Tooltip content="sil">
                <Button
                  icon="remove"
                  intent={Intent.WARNING}
                  minimal={true}
                  onClick={() => {delete this.state.numbers[i]; this.setState({numbers: this.state.numbers.filter(Number)});}}
                />
              </Tooltip>
            }
            type="number"
          />
        </Label>
      );
    });
    return items;
  }
  renderOperators() {
    return '*/+-'.split('').map(o => (
      <Checkbox
        label={o}
        inline={true}
        checked={this.state.operators[o]}
        onClick={() => {this.state.operators[o] = !this.state.operators[o]; this.forceUpdate();}}
      />
    ))
  }

  /**
   * @param number  {NumberObject}
   * @return {Object}
   */
  renderOperationRow(number) {
    if (!number.generated) return;

    const itemStyle = {
      display: 'inline-block',
      margin: 5,
      fontWeight: 600,
    };

    const iconStyle = {
      ...itemStyle,
      position: 'relative',
      top: -10,
      padding: 5,
    };

    const numberStyle = {
      ...itemStyle,
      color: Colors.TURQUOISE1
    };

    const operatorStyle = {
      ...itemStyle,
      color: Colors.ROSE1,
    };

    const resultStyle = {
      ...itemStyle,
      color: Colors.LIME1,
    };

    return <div key={number.toInt()} style={{margin: 5, paddingLeft: 'calc(50% - 100px)'}}>
      <code style={iconStyle}><Icon iconSize={12} icon="edit" /></code>
      <code style={numberStyle}>{number.source.numbers[0].toInt()}</code>
      <code style={operatorStyle}>{number.source.operator}</code>
      <code style={numberStyle}>{number.source.numbers[1].toInt()}</code>
      <code style={resultStyle}>= {number.toInt()}</code>
    </div>;
  }

  /**
   * @param number  {NumberObject}
   * @return {?Object[]}
   */
  renderOperations(number) {
    if (!number.generated) return null;

    const list = [];

    number.source.numbers.forEach(n => {
      if (n.generated)
        this.renderOperations(n).forEach(i => list.push(i));
    });

    list.push(this.renderOperationRow(number));

    return list;
  }
  render() {
    return [
      <Toaster key="errors" ref={(ref) => this.toaster = ref} />,
      <div
        key="app"
        style={{
          maxWidth: 600,
          width: '100%',
          margin: 'auto',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Navbar className={Classes.DARK}>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>işlem yolu</NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <Tooltip content="sıfırla">
              <Button
                icon="undo"
                minimal={true}
                onClick={() => this.resetState()}
              />
            </Tooltip>
          </NavbarGroup>
        </Navbar>
        <Callout>

          {
            this.state.calculating ? (
              <div>{this.renderOperations(this.state.calculating)}</div>
            ) : (<div>
            <h6>Hedef sayı</h6>
            <Label>
              <NumericInput
                selectAllOnFocus={true}
                fill={true}
                leftIcon="locate"
                min={0}
                value={this.state.target}
                onValueChange={target => this.setState({target})}
              />
            </Label>

            <h6>Tolerans</h6>
            <Label>
              <NumericInput
                selectAllOnFocus={true}
                fill={true}
                min={0}
                value={this.state.tolerance}
                onValueChange={tolerance => this.setState({tolerance})}
              />
            </Label>

            <h6>Kullanılacak sayılar</h6>
            {this.renderNumbers()}

            <form
              onSubmit={(e) => {
                this.state.numbers.push(this.state.newNumber);
                this.setState({newNumber: ''});
                e.preventDefault();
              }}
            >
              <InputGroup
                fill={true}
                value={this.state.newNumber}
                onChange={e => this.setState({newNumber: e.target.value})}
                rightElement={
                  <Tooltip content="ekle">
                    <Button
                      icon="add"
                      intent={Intent.PRIMARY}
                      minimal={true}
                      onClick={(e) => {
                        this.state.numbers.push(this.state.newNumber);
                        this.setState({newNumber: ''});
                        e.preventDefault();
                      }}
                    />
                  </Tooltip>
                }
                type="number"
              />
            </form>

            <h6>Kullanılacak operatörler</h6>
            <Label>{this.renderOperators()}</Label>

              <h6>Adım limiti</h6>
              <Label helperText="Maksimum adım sayısı">
                <NumericInput
                  selectAllOnFocus={true}
                  fill={true}
                  min={1}
                  max={15}
                  value={this.state.limit}
                  onValueChange={limit => this.setState({limit})}
                />
              </Label>

            <div style={{textAlign: 'right'}}>
              <Button
                intent={Intent.SUCCESS}
                icon="gantt-chart"
                text="işlem yap"
                onClick={() => {
                  if (this.getError()) {
                    this.toaster.show({
                      position: Position.TOP,
                      usePortal: true,
                      intent: Intent.DANGER,
                      message: this.getError(),
                    });
                  }
                  else
                    this.updateRenderCalculating()
                }}
              />
            </div>

          </div>)}

        </Callout>
      </div>
    ];
  }
}
