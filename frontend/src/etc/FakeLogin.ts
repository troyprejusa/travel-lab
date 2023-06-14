import { UserModel } from '../Models/Interfaces';
import { login } from '../redux/UserSlice';


function fakeLogin(dispactchRef: any) {
    (async function() {
        /* Query database directly to get the data for troy prejusa */
        try {
            const res: Response = await fetch('/dev?email=troy@test.com');
            if (res.ok) {
                const obj: UserModel = await res.json();
                dispactchRef(login(obj));
            } else {
                const obj = await res.json();
                throw new Error(JSON.stringify(obj));
            }

        } catch (e: any) {
            console.error(`No developing today :(\n${e.message}`)
        }
    })();
}

export default fakeLogin;