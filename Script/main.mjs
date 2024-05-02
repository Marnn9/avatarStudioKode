"use strict";
import { TinitialiseScene } from './scene.mjs';


export function loadScene() {
    TinitialiseScene();
}


export function addBrows() {
    console.log("browsAdded");
}

function stringifyAvatar(anAvatarObject) {

    JSON.stringify(anAvatarObject);

}

async function parseAvatar() {
    try{
        const path = './json/avatar.json';
        const response = await fetch(path);
        const avatarObject = await response.json();
        return avatarObject;
    } catch (error){
        console.error(error);
    }
}
/* const assets = {
    head: null,
    body: null,
    hairBtn: null,
    headBtn: null,
    clothesBtn: null,
}

function displayAvatar() {
    assets.head = new Tavatar.head(); // for when the time comes
} */

