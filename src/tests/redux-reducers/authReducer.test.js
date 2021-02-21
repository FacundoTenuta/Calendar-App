const { authReducer } = require("../../redux-reducers/authReducer");
const { types } = require("../../types/types");


const initState = {
    checking: true,
}

describe('Pruebas en el authReducer.js', () => {
    
    test('debe retornar el estado por defecto', () => {
        
        const state = authReducer( initState, {} );

        expect( state ).toEqual( initState );

    });

    test('debe autenticar el usuario', () => {

        const action = {
            type: types.authLogin,
            payload: {
                uid: "123",
                name: "Facundo"
            }
        }
        
        const state = authReducer( initState, action );

        expect( state ).toEqual( { uid: "123", name: "Facundo", checking: false } );

    });

    test('debe funcionar el logout', () => {
        
        const state = authReducer( initState, { type: types.authLogout } );

        expect( state ).toEqual( { checking: false } );

    });
    

});
