import { defineStore } from 'pinia'

export const useEventStore = defineStore('event', {
    state: () => ({
        clickEvent: null,
        hoverEvent: null,
        inputEvent: null,
        changeEvent: null,
        submitEvent: null,
        keyboardEvents: {
            keydown: null,
            keyup: null,
            keypress: null,
        },
        focusEvent: null,
        blurEvent: null,
        mouseEvents: {
            mousedown: null,
            mouseup: null,
            mousemove: null,
            mouseenter: null,
            mouseleave: null,
        },
        scrollEvent: null,
        windowEvents: {
            resize: null,
            load: null,
            unload: null,
        },
        dragEvents: {
            dragstart: null,
            dragend: null,
            dragenter: null,
            dragleave: null,
            dragover: null,
            drop: null,
        },
        touchEvents: {
            touchstart: null,
            touchend: null,
            touchmove: null,
            touchcancel: null,
        },
    }),
    actions: {
        triggerClick(componentId: any) {
            this.clickEvent = componentId
        },
        triggerHover(componentId: any) {
            this.hoverEvent = componentId
        },
        triggerInput(componentId: any) {
            this.inputEvent = componentId
        },
        triggerChange(componentId: any) {
            this.changeEvent = componentId
        },
        triggerSubmit(componentId: any) {
            this.submitEvent = componentId
        },
        triggerKeyDown(componentId: any) {
            this.keyboardEvents.keydown = componentId
        },
        triggerKeyUp(componentId: any) {
            this.keyboardEvents.keyup = componentId
        },
        triggerKeyPress(componentId: any) {
            this.keyboardEvents.keypress = componentId
        },
        triggerFocus(componentId: any) {
            this.focusEvent = componentId
        },
        triggerBlur(componentId: any) {
            this.blurEvent = componentId
        },
        triggerMouseDown(componentId: any) {
            this.mouseEvents.mousedown = componentId
        },
        triggerMouseUp(componentId: any) {
            this.mouseEvents.mouseup = componentId
        },
        triggerMouseMove(componentId: any) {
            this.mouseEvents.mousemove = componentId
        },
        triggerMouseEnter(componentId: any) {
            this.mouseEvents.mouseenter = componentId
        },
        triggerMouseLeave(componentId: any) {
            this.mouseEvents.mouseleave = componentId
        },
        triggerScroll(componentId: any) {
            this.scrollEvent = componentId
        },
        triggerWindowResize(componentId: any) {
            this.windowEvents.resize = componentId
        },
        triggerWindowLoad(componentId: any) {
            this.windowEvents.load = componentId
        },
        triggerWindowUnload(componentId: any) {
            this.windowEvents.unload = componentId
        },
        triggerDragStart(componentId: any) {
            this.dragEvents.dragstart = componentId
        },
        triggerDragEnd(componentId: any) {
            this.dragEvents.dragend = componentId
        },
        triggerDragEnter(componentId: any) {
            this.dragEvents.dragenter = componentId
        },
        triggerDragLeave(componentId: any) {
            this.dragEvents.dragleave = componentId
        },
        triggerDragOver(componentId: any) {
            this.dragEvents.dragover = componentId
        },
        triggerDrop(componentId: any) {
            this.dragEvents.drop = componentId
        },
        triggerTouchStart(componentId: any) {
            this.touchEvents.touchstart = componentId
        },
        triggerTouchEnd(componentId: any) {
            this.touchEvents.touchend = componentId
        },
        triggerTouchMove(componentId: any) {
            this.touchEvents.touchmove = componentId
        },
        triggerTouchCancel(componentId: any) {
            this.touchEvents.touchcancel = componentId
        },
    },
})
