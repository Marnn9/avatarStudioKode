"use strict"
import { GLTFLoader } from "../three.js-master/build/GLTFLoader.js";

const bodyParts = {
    head: null,
    neck: null,
    arm: null,
    chest: null,
    lowerBody: null,
    leg: null,
}

export function TCharacter(aHead, aNeck) {
    
    aHead = bodyParts.head;
    aNeck = bodyParts.neck;

    bodyParts.head = new TCharacter()


}