# ReactInputComponents

[![npm version](https://badge.fury.io/js/react-basic-input-components.svg)](https://badge.fury.io/js/react-basic-input-components)
[![Build Status](https://travis-ci.org/protoman92/ReactInputComponents.svg?branch=master)](https://travis-ci.org/protoman92/ReactInputComponents)

MVVM-based generic input field components for React. These basic components are meant for simple forms, such as login/sign-up, but they can be used to construct more complex components.

For each component (e.g. **InputCell**) there are two Redux store implementations, generally found in **{ComponentName}/Dependency**. Depending on the store type used by the app, we choose the appropriate model class (e.g., for a dispatch store-based app, we use **{ComponentName}.Dispatch.Model.Self)**) to build the view model.

For more details about the concepts behind these stores, please visit: https://github.com/protoman92/ReactiveRedux-JS. Also take a look at the demo @ https://github.com/protoman92/ReactCustomComponentDemo.
