import * as React from 'react';
import { ReactElement } from 'react';
import * as enzyme from 'enzyme';
import { ShallowWrapper } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { Numbers, Strings, Try } from 'javascriptutilities';
import { ReduxStore as Store } from 'reactive-rx-redux-js';
import { Data } from 'react-base-utilities-js';
import { InputCell } from './../../src';

type BaseProps = InputCell.Base.Component.Props.Type;

describe('Input cell component should work correctly', () => {
  let viewModel: InputCell.Base.ViewModel.Type;

  beforeEach(() => {
    let input: Data.Input.Type = { id: 'fvp', placeholder: undefined };
    let action: InputCell.Base.Action.Type = {
      fullValuePath: () => Try.success('fvp'),
    };

    let actionCreator = InputCell.Dispatch.Action.createDefault(action);
    let reducer = InputCell.Dispatch.Reducer.createDefault();
    let store = Store.Dispatch.createDefault(reducer);

    let provider: InputCell.Dispatch.Provider.Type = {
      action: { inputCell: actionCreator },
      store: store,
      substateSeparator: '.',
    };

    let model = new InputCell.Dispatch.Model.Self(provider, input);
    viewModel = new InputCell.Base.ViewModel.Self(provider, model);
  });

  function testInputComponent<P extends BaseProps>(
    element: ReactElement<P>,
    inputSelector: (v: ShallowWrapper<P>) => ShallowWrapper<any>,
  ): void {
    /// Setup
    enzyme.configure({ adapter: new Adapter() });
    let times = 1000;
    let rendered = enzyme.shallow(element);

    /// When & Then
    Numbers.range(0, times)
      .map(() => Strings.randomString(10))
      .forEach(v => {
        viewModel.triggerInput(v);
        rendered.update();
        let inputComponent = inputSelector(rendered);
        let props = inputComponent.props();
        expect(props.value).toBe(v);
      });
  }

  // it('Native input component - should work correctly', () => {
  //   let style: InputCell.Native.Style.ProviderType = {
  //     inputCell: { style: () => Try.success(StyleSheet.flatten({
  //       height: '100%',
  //       width: '100%',
  //     })) },
  //   };

  //   let props: InputCell.Native.Component.Props.Type = { viewModel, style };
  //   let component = <InputCell.Native.Component.Self {...props}/>;
  //   testInputComponent(component, v => v.childAt(0));
  // });

  it('Web input component - should work correctly', () => {
    let identity: InputCell.Web.Identity.SelectorType = {
      identity: () => Try.success({
        className: 'input',
        id: undefined,
        type: Data.InputType.Web.Case.TEXT,
      }),
    };

    let identityProvider = { inputCell: identity };

    let props: InputCell.Web.Component.Props.Type = {
      viewModel,
      identity: identityProvider,
    };

    let component = <InputCell.Web.Component.Self {...props}/>;
    testInputComponent(component, v => v.find('.input'));
  });
});