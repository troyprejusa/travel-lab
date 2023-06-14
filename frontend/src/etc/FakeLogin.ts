import { UserModel } from '../Models/Interfaces';
import { login } from '../redux/UserSlice';


function fakeLogin(dispactchRef: any) {
    (async function() {
        /* Query database directly to get the data for troy prejusa */
        try {
            const res: Response = await fetch('/dev?email=troy@test.com');
            const json: UserModel = await res.json();
            if (res.ok) {
                dispactchRef(login(json));
            }
        } catch (e) {
            console.error('No developing today :(')
        }
    })();
}

export default fakeLogin;