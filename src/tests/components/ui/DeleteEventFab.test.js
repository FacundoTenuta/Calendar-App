import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "@testing-library/jest-dom";
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../redux-actions/events';

jest.mock('../../../redux-actions/events', () => ({
    eventStartDelete: jest.fn()
}));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const store = mockStore({});
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <DeleteEventFab />
    </Provider>
);


describe('Pruebas en el <DeleteEventFab />', () => {

    beforeEach( () => {
        store.clearActions();
        jest.clearAllMocks();
    });
    
    test('debe mostrarse correctamente', () => {
        
        expect( wrapper ).toMatchSnapshot();

    });
    
    test('debe llamar el eventStartDelete al hacer click', () => {
        
        wrapper.find("button").prop("onClick")();

        expect( eventStartDelete ).toHaveBeenCalled();

    });
    
});

