import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import moment from "moment";

import "@testing-library/jest-dom";
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventStartUpdate, eventClearActiveEvent, eventStartAddNew } from '../../../redux-actions/events';
import { act } from '@testing-library/react';
import Swal from 'sweetalert2';

jest.mock('../../../redux-actions/events', () => ({
    eventStartUpdate: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const now = moment().minutes(0).seconds(0).add(1,"hours");
const nowPlus1 = now.clone().add(1,"hours");

const store = mockStore({
    calendar: {
        events: [],
        activeEvent: {
            title: "Hola Mundo",
            notes: "Algunas notas",
            start: now.toDate(),
            end: nowPlus1.toDate()
        }
    },
    auth: {
        uid: "asdads",
        name: "Facundo"
    },
    ui: {
        modalOpen: true
    }
});
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarModal />
    </Provider>
);

describe('Pruebas en <CalendarModal />', () => {

    beforeEach( () => {
        store.clearActions();
        jest.clearAllMocks();
    });
    
    test('debe mostrar el modal', () => {
       
        expect( wrapper.find("Modal").prop("isOpen") ).toBe( true );

    });
    
    test('debe llamar la accion de actualizar y cerrar el modal', () => {
        
        wrapper.find("form").simulate("submit", {
            preventDefault(){}
        });

        expect( eventStartUpdate ).toHaveBeenCalledWith( {
            title: "Hola Mundo",
            notes: "Algunas notas",
            start: now.toDate(),
            end: nowPlus1.toDate()
        } );

        expect( eventClearActiveEvent ).toHaveBeenCalled();

    });

    test('debe mostrar error si falta el titulo', () => {
       
        wrapper.find("form").simulate("submit", {
            preventDefault(){}
        });

        expect( wrapper.find('input[name="title"]').hasClass("is-invalid") ).toBe( true );

    });

    test('debe crear un nuevo evento', () => {
        
        const store = mockStore({
            calendar: {
                events: [],
                activeEvent: null
            },
            auth: {
                uid: "asdads",
                name: "Facundo"
            },
            ui: {
                modalOpen: true
            }
        });
        store.dispatch = jest.fn();
        
        const wrapper = mount(
            <Provider store={ store }>
                <CalendarModal />
            </Provider>
        );

        wrapper.find('input[name="title"]').simulate("change", {
            target: {
                name: "title",
                value: "Hola pruebas"
            }
        });

        wrapper.find("form").simulate("submit", {
            preventDefault(){}
        });

        expect( eventStartAddNew ).toHaveBeenCalledWith({
            end: expect.anything(),
            start: expect.anything(),
            title: "Hola pruebas",
            notes: ""
        });

        expect( eventClearActiveEvent ).toHaveBeenCalled();

    });
    
    test('debe validar las fechas', () => {
        
        wrapper.find('input[name="title"]').simulate("change", {
            target: {
                name: "title",
                value: "Hola pruebas"
            }
        });

        const hoy = new Date();

        act(() => {
            wrapper.find("DateTimePicker").at(1).prop("onChange")(hoy);
        });

        wrapper.find("form").simulate("submit", {
            preventDefault(){}
        });

        expect( Swal.fire ).toHaveBeenCalledWith("Error", "La fecha fin debe ser mayor a la fecha de inicio", "error");

    });

});


