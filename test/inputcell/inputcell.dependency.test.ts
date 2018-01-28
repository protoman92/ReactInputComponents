import { BehaviorSubject } from 'rxjs';
import { Nullable, Numbers, Strings, Try } from 'javascriptutilities';
import { ReduxStore as Store } from 'reactive-rx-redux-js';
import { Data } from 'react-base-utilities-js';
import { InputCell } from './../../src';

describe('Input cell view model should be implemented correctly', () => {
  var dispatchStore: Store.Dispatch.Self;
  var rxStore: Store.Rx.Self;
  var dispatchProvider: InputCell.Dispatch.Provider.Type;
  var rxProvider: InputCell.Rx.Provider.Type;
  var dispatchModel: InputCell.Dispatch.Model.Type;
  var rxModel: InputCell.Rx.Model.Type;

  beforeEach(() => {
    let input: Data.Input.Type = { id: 'fvp', placeholder: undefined };

    let dispatchAction = InputCell.Dispatch.Action.createDefault({
      fullValuePath: (_input: Data.Input.Type) => Try.success('fvp'),
    });

    let dispatchReducer = InputCell.Dispatch.Reducer.createDefault();
    dispatchStore = Store.Dispatch.createDefault(dispatchReducer);

    dispatchProvider = {
      action: { inputCell: dispatchAction },
      store: dispatchStore,
      substateSeparator: '.',
    };

    dispatchModel = new InputCell.Dispatch.Model.Self(dispatchProvider, input);

    let valueSubject = new BehaviorSubject<Nullable<string>>(undefined);

    let rxAction: InputCell.Rx.Action.Type = {
      fullValuePath: (_input: Data.Input.Type) => Try.success('fvp'),
      valueStream: (_input: Data.Input.Type) => Try.success(valueSubject),
      valueTrigger: (_input: Data.Input.Type) => Try.success(valueSubject),
    };

    let rxActionProvider = { inputCell: rxAction };
    let rxReducer = InputCell.Rx.Reducer.createDefault(rxActionProvider, input);
    rxStore = new Store.Rx.Self(...rxReducer);

    rxProvider = {
      action: rxActionProvider,
      store: rxStore,
      substateSeparator: '.',
    };

    rxModel = new InputCell.Rx.Model.Self(rxProvider, input);
  });

  let testInputCellVM = (viewModel: InputCell.Base.ViewModel.Type): void => {
    /// Setup
    let times = 1000;
    let inputs = Numbers.range(0, times).map(() => Strings.randomString(10));
    let inputResults: string[] = [];

    viewModel.inputStream()
      .mapNonNilOrEmpty(v => v)
      .doOnNext(v => inputResults.push(v))
      .subscribe();

    /// When
    inputs.forEach(v => viewModel.triggerInput(v));

    /// Then
    expect(inputResults).toEqual(inputs);
  };

  it('Dispatch input cell view model - should work correctly', () => {
    expect(dispatchModel instanceof InputCell.Dispatch.Model.Self).toBeTruthy();
    let vm = new InputCell.Base.ViewModel.Self(dispatchProvider, dispatchModel);
    testInputCellVM(vm);
  });

  it('Rx input cell view model - should work correctly', () => {
    expect(rxModel instanceof InputCell.Rx.Model.Self).toBeTruthy();
    let vm = new InputCell.Base.ViewModel.Self(rxProvider, rxModel);
    testInputCellVM(vm);
  });
});