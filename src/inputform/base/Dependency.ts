import { Observable, Observer } from 'rxjs';
import { Try } from 'javascriptutilities';
import { Data, MVVM } from 'react-base-utilities-js';
import * as InputList from './../../inputlist';

export namespace Provider {
  /**
   * Provide the necessary dependencies for an input form view model.
   * @extends {InputList.Base.Provider.Type} Input list provider extension.
   */
  export interface Type extends InputList.Base.Provider.Type {}
}

export namespace Model {
  /**
   * Provide model for an input form view model.
   */
  export interface ProviderType {
    inputForm_model(inputs: Data.Input.Header): Try<Type>;
  }

  /**
   * Model for an input form view model.
   * @extends {InputList.Base.Model.ProviderType} Input list model provider extension.
   */
  export interface Type extends InputList.Base.Model.ProviderType {
    inputHeader: Readonly<Data.Input.Header>;
  }

  /**
   * Model for an input form view model.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    public readonly inputHeader: Data.Input.Header;

    public constructor( header: Data.Input.Header) {
      this.inputHeader = header;
    }

    public inputList_model(_inputs: Data.Input.Type[]): InputList.Base.Model.Type {
      throw new Error(`Must override this for ${this}`);
    }
  }
}

export namespace ViewModel {
  /**
   * Provide view model for an input form component.
   */
  export interface ProviderType {
    inputForm_viewModel(inputs: Data.Input.Header): Try<Type>;
  }

  /**
   * View model for an input form component.
   * @extends {MVVM.Confirm.ViewModel.Type} Confirm VM extension.
   * @extends {InputList.Base.ViewModel.ProviderType} Input list VM provider
   * extension.
   */
  export interface Type extends
    MVVM.Confirm.ViewModel.Type,
    InputList.Base.ViewModel.ProviderType {
    inputHeader: Readonly<Data.Input.Header>;
    triggerConfirm(): void;
  }

  /**
   * View model for an input form component.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    private readonly confirmVM: MVVM.Confirm.ViewModel.Type;
    private readonly provider: Provider.Type;
    private readonly model: Model.Type;

    public get inputHeader(): Readonly<Data.Input.Header> {
      return this.model.inputHeader;
    }

    public constructor(provider: Provider.Type, model: Model.Type) {
      this.confirmVM = new MVVM.Confirm.ViewModel.Self();
      this.provider = provider;
      this.model = model;
    }

    public confirmTrigger = (): Observer<void> => {
      return this.confirmVM.confirmTrigger();
    }

    public confirmStream = (): Observable<void> => {
      return this.confirmVM.confirmStream();
    }

    public inputList_viewModel(inputs: Data.Input.Type[]): InputList.Base.ViewModel.Type {
      let model = this.model.inputList_model(inputs);
      return new InputList.Base.ViewModel.Self(this.provider, model);
    }

    public triggerConfirm = (): void => {
      this.confirmTrigger().next(undefined);
    }
  }
}