"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    if (len <= 0) {
        throw new Error("Length must be a positive number");
    }
    const options = "qwertyasdfghjklzxcvbnm1234567890";
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * options.length)];
    }
    return ans;
}
