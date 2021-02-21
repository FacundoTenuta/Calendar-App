import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "@testing-library/jest-dom";
import { AppRouter } from '../../routers/AppRouter';


const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );


describe('Pruebas en el <AppRouter />', () => {
    
    test('debe mostrar el espere...', () => {

        const store = mockStore({
            auth: {
                checking: true
            }
        });
        
        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );

        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find("h5").exists() ).toBe( true );

    });

    test('debe mostrar la ruta publica', () => {

        const store = mockStore({
            auth: {
                checking: false,
                uid: null
            }
        });
        
        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );

        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find(".login-container").exists() ).toBe( true );

    });

    test('debe mostrar la ruta privada', () => {

        const store = mockStore({
            auth: {
                checking: false,
                uid: "123",
                name: "Juan Pablo"
            },
            calendar: {
                events: []
            },
            ui: {
                modalOpen: false
            }
        });
        
        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );

        // expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find(".calendar-screen").exists() ).toBe( true );

    });
    

});

