import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "@testing-library/jest-dom";
import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import { messages } from '../../../helpers/calendar-messages-es';
import { types } from '../../../types/types';
import { eventSetActive } from '../../../redux-actions/events';
import { act } from '@testing-library/react';

jest.mock('../../../redux-actions/events', () => ({
    eventSetActive: jest.fn(),
    eventsStartLoading: jest.fn()
}));
Storage.prototype.setItem = jest.fn();

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const store = mockStore({
    calendar: {
        events: []
    },
    auth: {
        uid: "asdads",
        name: "Facundo"
    },
    ui: {
        modalOpen: false
    }
});
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarScreen />
    </Provider>
);

describe('Pruebas en <CalendarScreen />', () => {

    beforeEach( () => {
        store.clearActions();
        jest.clearAllMocks();
    });
    
    test('debe mostrarse correctamente', () => {
       
        expect( wrapper ).toMatchSnapshot();

    });
    
    test('pruebas con las interacciones del calendario', () => {
        
        const calendar = wrapper.find("Calendar");

        const calendarMessages = calendar.prop("messages");
        expect( calendarMessages ).toEqual( messages );

        calendar.prop("onDoubleClickEvent")();
        expect( store.dispatch ).toHaveBeenCalledWith({ type: types.uiOpenModal });

        calendar.prop("onSelectEvent")({ start: "Hola" });
        expect( eventSetActive ).toHaveBeenCalledWith({ start: "Hola" });

        act(() => {
            calendar.prop("onView")("week");
            expect( localStorage.setItem ).toHaveBeenCalledWith("lastView", "week");
        });

    });
    

});
