export default function (context) {
    console.log('Middleware: Check Auth');
        let req = context.req;
        let token;
        let expirationDate;
        if (req) {
            //ServerSide
            if (!req.headers.cookie) {
                return;
            }
            const jwtCookie = req.headers.cookie
                .split(';')
                .find(c => c.trim().startsWith("jwt="));
            if (!jwtCookie) {
                return;
            }
            token = jwtCookie.split('=')[1];
            expirationDate = req.headers.cookie
                .split(';')
                .find(c => c.trim().startsWith('expirationDate='))
                .split("=")[1];

                console.log(token);
        } else {
            token = localStorage.getItem('token');
            expirationDate = localStorage.getItem('tokenExpiration');
            console.log('here');
        }
        // if (new Date().getTime() > +expirationDate || !token) {
        //     console.log('No token or Invalid token');
        //     vuexContext.commit('clearToken');
        //     return;
        // }
        // vuexContext.commit('setToken', token);

}