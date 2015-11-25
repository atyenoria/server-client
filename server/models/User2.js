import mongoose from 'mongoose'

export var User2 = mongoose.Schema({
    local: {
        username: {
            type: String,
            unique: true
        },
        password: String,
        email: String,
        socketid: String,
    },
    facebook: {
        id: String,
        username: String,
        token: String,
        email: String,
    }
});


// export var myVar1 = ...;
// export let myVar2 = ...;
// export const MY_CONST = ...;

// export function myFunc() {
//     ...
// }
// export function* myGeneratorFunc() {
//     ...
// }
// export class MyClass {
//     ...
// }