import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Swal from 'sweetalert2';

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "@testing-library/jest-dom";
import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../redux-actions/auth';

jest.mock('../../../redux-actions/auth', () => ({
    startLogin: jest.fn(),
    startRegister: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
    fire: jest.fn()
}));


const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const store = mockStore({});
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <LoginScreen />
    </Provider>
);


describe('Pruebas en <LoginScreen />', () => {

    beforeEach( () => {
        store.clearActions();
        jest.clearAllMocks();
    });
    
    test('debe mostrarse correctamente', () => {
        
        expect( wrapper ).toMatchSnapshot();

    });

    test('debe llamar el dispatch del login', () => {
        
        wrapper.find('input[name="lEmail"]').simulate("change", {
            target: {
                name: "lEmail",
                value: "juan@gmail.com"
            }
        });

        wrapper.find('input[name="lPassword"]').simulate("change", {
            target: {
                name: "lPassword",
                value: "123456"
            }
        });

        wrapper.find("form").at(0).prop("onSubmit")({
            preventDefault(){}
        });

        expect( startLogin ).toHaveBeenCalledWith("juan@gmail.com", "123456");

    });

    test('no hay registro si las contraseñas son diferentes', () => {

        wrapper.find('input[name="rName"]').simulate("change", {
            target: {
                name: "rName",
                value: "Juan"
            }
        });

        wrapper.find('input[name="rEmail"]').simulate("change", {
            target: {
                name: "rEmail",
                value: "juan@gmail.com"
            }
        });
        
        wrapper.find('input[name="rPassword1"]').simulate("change", {
            target: {
                name: "rPassword1",
                value: "123456"
            }
        });

        wrapper.find('input[name="rPassword2"]').simulate("change", {
            target: {
                name: "rPassword2",
                value: "12345555"
            }
        });

        wrapper.find("form").at(1).prop("onSubmit")({
            preventDefault(){}
        });

        expect( startRegister ).not.toHaveBeenCalled();
        expect( Swal.fire ).toHaveBeenCalledWith("Error", "Las contraseñas deben ser iguales", "error");

    });
    
    test('Registro con contraseñas iguales', () => {
        
        wrapper.find('input[name="rName"]').simulate("change", {
            target: {
                name: "rName",
                value: "Juan"
            }
        });

        wrapper.find('input[name="rEmail"]').simulate("change", {
            target: {
                name: "rEmail",
                value: "juan@gmail.com"
            }
        });
        
        wrapper.find('input[name="rPassword1"]').simulate("change", {
            target: {
                name: "rPassword1",
                value: "123456"
            }
        });

        wrapper.find('input[name="rPassword2"]').simulate("change", {
            target: {
                name: "rPassword2",
                value: "123456"
            }
        });

        wrapper.find("form").at(1).prop("onSubmit")({
            preventDefault(){}
        });

        expect( Swal.fire ).not.toHaveBeenCalled();
        expect( startRegister ).toHaveBeenCalledWith("juan@gmail.com", "123456", "Juan");

    });
    

});

