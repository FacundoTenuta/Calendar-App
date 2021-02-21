const { fetchSinToken, fetchConToken } = require("../../helpers/fetch");


describe('Pruebas en el helper Fetch', () => {

    let token = "";
    
    test('fetchSinToken debe funcionar correctamente', async() => {
        
        const resp = await fetchSinToken("auth", { "email": "facundo@gmail.com", "password": "123456" }, "POST");

        expect( resp instanceof Response ).toBe( true );

        const body = await resp.json();
        expect( body.ok ).toBe( true );

        token = body.token;

    });
    
    test('fetchConToken debe funcionar correctamente', async() => {
        
        localStorage.setItem("token", token );

        const resp = await fetchConToken("", {}, "DELETE");
        const body = await resp.json();

        expect( body ).toEqual({
            "ok": false,
            "msg": "Evento no existe por ese id"
        });

    });

});
