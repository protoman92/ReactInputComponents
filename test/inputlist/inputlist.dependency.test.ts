import { BehaviorSubject, Observable } from 'rxjs';
import { Collections, Nullable, Numbers, Strings, Try } from 'javascriptutilities';
import { ReduxStore as Store } from 'reactive-rx-redux-js';
import { Data } from 'react-base-utilities-js';
import { InputList, InputCell } from './../../src';

let timeout = 10;

describe('Input list view model should be implemented correctly', () => {
  let times = 100;
  var inputs: Data.Input.Type[];
  var dispatchProvider: InputList.Dispatch.Provider.Type;
  var rxProvider: InputList.Rx.Provider.Type;
  var dispatchModel: InputList.Dispatch.Model.Type;
  var rxModel: InputList.Rx.Model.Type;

  beforeEach(() => {
    inputs = Numbers.range(0, times).map(i => ({ id: '' + i, placeholder: undefined }));

    dispatchProvider = {
      action: {
        inputCell: InputCell.Dispatch.Action.createDefault({
          fullValuePath: (input: Data.Input.Type): Try<string> => {
            return Try.success(`input.${input.id}.value`);
          }
        }),
      },
      store: Store.Dispatch.createDefault(InputCell.Dispatch.Reducer.createDefault()),
      substateSeparator: '.',
    };

    dispatchModel = new InputList.Dispatch.Model.Self(dispatchProvider, inputs);

    let subjects = inputs.map(() => new BehaviorSubject<Nullable<string>>(undefined));

    let rxActionProvider: InputCell.Rx.Action.ProviderType = {
      inputCell: {
        fullValuePath: (input: Data.Input.Type): Try<string> => {
          return Try.success(`input.${input.id}.value`);
        },

        valueStream: (input: Data.Input.Type) => {
          return Collections.indexOf(inputs, input, (v1, v2) => v1.id === v2.id)
            .flatMap(v => Collections.elementAtIndex(subjects, v));
        },

        valueTrigger: (input: Data.Input.Type) => {
          return Collections.indexOf(inputs, input, (v1, v2) => v1.id === v2.id)
            .flatMap(v => Collections.elementAtIndex(subjects, v));
        }
      },
    };

    let rxReducers = inputs
      .map(v => InputCell.Rx.Reducer.createDefault(rxActionProvider, v))
      .reduce((v1, v2) => v1.concat(v2), []);

    rxProvider = {
      action: rxActionProvider,
      store: new Store.Rx.Self(...rxReducers),
      substateSeparator: '.',
    };

    rxModel = new InputList.Rx.Model.Self(rxProvider, inputs);
  });

  let testInputListViewModel = (viewModel: InputList.Base.ViewModel.Type): void => {
    /// Setup
    let inputCellVMs = inputs.map(v => viewModel.inputCell_viewModel(v));
    let inputResults: string[] = [];
    let inputSequence = Numbers.range(0, times).map(() => Strings.randomString(100));
    
    Observable.from(inputCellVMs)
      .flatMap((v, i) => v.inputStream()
        .mapNonNilOrEmpty(v1 => v1)
        .distinctUntilChanged()
        .map((v1): [string, number] => [v1, i]))
      .map(v => v[0])
      .doOnNext(v => inputResults.push(v))
      .subscribe();

    /// When
    for (let i of inputSequence) {
      let randomIndex = Numbers.randomBetween(0, times - 1);
      inputCellVMs[randomIndex].triggerInput(i);
    }

    /// Then
    expect(inputResults.length).toBe(inputSequence.length);
    expect(inputSequence.every(v => inputResults.indexOf(v) >= 0)).toBeTruthy();
  };

  it('Dispatch input for dispatch-based input cell - should update state', () => {
    let vm = new InputList.Base.ViewModel.Self(dispatchProvider, dispatchModel);
    testInputListViewModel(vm);
  }, timeout);

  it('Dispatch input for rx-based input cell - should update state', () => {
    let vm = new InputList.Base.ViewModel.Self(rxProvider, rxModel);
    testInputListViewModel(vm);
  }, timeout);
});