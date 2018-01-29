import { Data } from 'react-base-utilities-js';
import * as InputList from './../../inputlist';
import * as Base from './../base';

export namespace Provider {
  /**
   * Provide the necessary dependencies for a dispatch store-based view model.
   * @extends {InputList.Dispatch.Provider.Type} Input list provider extension.
   */
  export interface Type extends InputList.Dispatch.Provider.Type {}
}

export namespace Model {
  /**
   * Model for dispatch store-based view model.
   * @extends {Base.Model.Type} Base model extension.
   */
  export interface Type extends Base.Model.Type {}

  /**
   * Model for dispatch store-based view model.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    private readonly provider: Provider.Type;
    private readonly baseModel: Base.Model.Type;

    public get inputHeader(): Data.Input.Header {
      return this.baseModel.inputHeader;
    }

    public constructor(provider: Provider.Type, header: Data.Input.Header) {
      this.provider = provider;
      this.baseModel = new Base.Model.Self(header);
    }

    public inputList_model(inputs: Data.Input.Type[]): InputList.Base.Model.Type {
      return new InputList.Dispatch.Model.Self(this.provider, inputs);
    }
  }
}