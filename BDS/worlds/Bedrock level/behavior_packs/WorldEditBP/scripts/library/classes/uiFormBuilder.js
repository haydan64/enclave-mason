/* eslint-disable @typescript-eslint/ban-types */
import { MessageFormData, ActionFormData, ModalFormData, FormCancelationReason } from "@minecraft/server-ui";
import { setTickTimeout, contentLog } from "./../Minecraft.js";
class UIForm {
    constructor(form) {
        this.form = form;
        this.cancelAction = form.cancel;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit(player, ctx) {
        /**/
    }
    handleCancel(response, player, ctx) {
        if (!response.canceled)
            return false;
        if (response.cancelationReason == FormCancelationReason.UserBusy) {
            setTickTimeout(() => this.enter(player, ctx));
        }
        else {
            ctx.goto(undefined);
            this.cancelAction?.(ctx, player);
        }
        return true;
    }
    buildFormData(player, ctx, error) {
        const resolve = (elem) => this.resolve(elem, player, ctx);
        if (typeof error === "string") {
            error = { rawtext: [{ text: "§c" }, { translate: error }, { text: "§r" }] };
        }
        else if (error) {
            error = { rawtext: [{ text: "§c" }, ...error.rawtext, { text: "§r" }] };
        }
        return this.build(this.form, resolve, error);
    }
    resolve(element, player, ctx) {
        return element instanceof Function ? element(ctx, player) : element;
    }
}
class MessageUIForm extends UIForm {
    constructor(form) {
        super(form);
        this.action1 = form.button2.action;
        this.action2 = form.button1.action;
    }
    build(form, resEl) {
        const formData = new MessageFormData();
        formData.title(resEl(form.title));
        formData.body(resEl(form.message));
        formData.button1(resEl(form.button2.text));
        formData.button2(resEl(form.button1.text));
        return formData;
    }
    enter(player, ctx) {
        this.buildFormData(player, ctx)
            .show(player)
            .then((response) => {
            if (this.handleCancel(response, player, ctx))
                return;
            ctx.goto(undefined);
            if (response.selection == 0) {
                this.action1(ctx, player);
            }
            else if (response.selection == 1) {
                this.action2(ctx, player);
            }
        });
    }
}
class ActionUIForm extends UIForm {
    constructor() {
        super(...arguments);
        this.actions = []; // Changes between builds
    }
    build(form, resEl, errorFmt) {
        this.actions = [];
        const formData = new ActionFormData();
        formData.title(errorFmt ?? resEl(form.title));
        if (form.message)
            formData.body(resEl(form.message));
        if (resEl((ctx) => ctx.canGoBack())) {
            formData.button("<< Back");
            this.actions.push((ctx) => ctx.back());
        }
        for (const button of resEl(form.buttons)) {
            formData.button(resEl(button.text), resEl(button.icon));
            this.actions.push(button.action);
        }
        return formData;
    }
    enter(player, ctx, error) {
        const form = this.buildFormData(player, ctx, error);
        const actions = this.actions;
        form.show(player).then((response) => {
            if (this.handleCancel(response, player, ctx))
                return;
            ctx.goto(undefined);
            actions[response.selection]?.(ctx, player);
        });
    }
}
class ModalUIForm extends UIForm {
    constructor(form) {
        super(form);
        this.inputNames = []; // Changes between builds
        this.submit = form.submit;
    }
    build(form, resEl, errorFmt) {
        this.inputNames = [];
        const formData = new ModalFormData();
        formData.title(errorFmt ?? resEl(form.title));
        const formInputs = resEl(form.inputs);
        for (const id in formInputs) {
            const input = formInputs[id];
            if (input.type == "dropdown") {
                formData.dropdown(resEl(input.name), resEl(input.options), resEl(input.default));
            }
            else if (input.type == "slider") {
                formData.slider(resEl(input.name), resEl(input.min), resEl(input.max), resEl(input.step ?? 1), resEl(input.default));
            }
            else if (input.type == "textField") {
                formData.textField(resEl(input.name), resEl(input.placeholder), resEl(input.default));
            }
            else if (input.type == "toggle") {
                formData.toggle(resEl(input.name), resEl(input.default));
            }
            this.inputNames.push(id);
        }
        return formData;
    }
    enter(player, ctx, error) {
        const form = this.buildFormData(player, ctx, error);
        const inputNames = this.inputNames;
        form.show(player).then((response) => {
            if (this.handleCancel(response, player, ctx))
                return;
            const inputs = {};
            for (const i in response.formValues) {
                inputs[inputNames[i]] = response.formValues[i];
            }
            ctx.goto(undefined);
            this.submit(ctx, player, inputs);
        });
    }
}
class MenuContext {
    constructor(player) {
        this.player = player;
        this.stack = [];
        this.data = {};
    }
    getData(key) {
        return this.data[key];
    }
    setData(key, value) {
        this.data[key] = value;
    }
    goto(menu) {
        if (menu && this.stack[this.stack.length - 1] === "$___confirmMenu___") {
            throw Error("Can't go to another form from a confirmation menu!");
        }
        this._goto(menu);
    }
    back() {
        this.stack.pop();
        this._goto(this.stack.pop());
    }
    returnto(menu) {
        let popped;
        // eslint-disable-next-line no-cond-assign
        while ((popped = this.stack.pop())) {
            if (popped === menu) {
                this._goto(menu);
                return;
            }
        }
        this._goto(undefined);
    }
    confirm(title, message, yes, no) {
        this.stack.push("$___confirmMenu___");
        const form = new MessageUIForm({
            title,
            message,
            button1: { text: "No", action: no ?? ((ctx) => ctx.back()) },
            button2: { text: "Yes", action: yes },
        });
        form.enter(this.player, this);
    }
    error(errorMessage) {
        this._goto(this.stack[this.stack.length - 1], errorMessage);
    }
    canGoBack() {
        return this.stack.length > 1;
    }
    get currentMenu() {
        return this.stack[this.stack.length - 1];
    }
    _goto(menu, error) {
        if (menu && menu !== this.stack[this.stack.length - 1])
            this.stack.push(menu);
        if (this.stack.length >= 64)
            throw Error("UI Stack overflow!");
        UIForms.goto(menu, this.player, this, error);
    }
}
class UIFormBuilder {
    constructor() {
        this.forms = new Map();
        this.active = new Map();
    }
    /**
     * Register a UI Form to be displayed to users.
     * @param name The name of the UI form
     * @param form The layout of the UI form
     */
    register(name, form) {
        if (this.forms.has(name)) {
            throw `UIForm by the name ${name} has already been registered.`;
        }
        if ("button1" in form) {
            this.forms.set(name, new MessageUIForm(form));
        }
        else if ("buttons" in form) {
            this.forms.set(name, new ActionUIForm(form));
        }
        else if ("inputs" in form) {
            this.forms.set(name, new ModalUIForm(form));
        }
    }
    /**
     * Displays a UI form registered as `name` to `player`.
     * @param name The name of the UI form
     * @param player The player the UI form must be shown to
     * @param data Context data to be made available to the UI form's elements
     * @returns True if another form is already being displayed. Otherwise false.
     */
    show(name, player, data) {
        if (this.displayingUI(player)) {
            return true;
        }
        const ctx = new MenuContext(player);
        Object.entries(data ?? {}).forEach((e) => ctx.setData(e[0], e[1]));
        ctx.goto(name);
        return false;
    }
    /**
     * Go from one UI form to another.
     * @internal
     * @param name The name of the UI form to go to
     * @param player The player to display the UI form to
     * @param ctx The context to be passed to the UI form
     */
    goto(name, player, ctx, error) {
        if (this.active.has(player)) {
            this.active.get(player).exit(player, ctx);
            this.active.delete(player);
        }
        if (!name) {
            return;
        }
        else if (this.forms.has(name)) {
            contentLog.debug("UI going to", name, "for", player.name);
            const form = this.forms.get(name);
            this.active.set(player, form);
            form.enter(player, ctx, error);
            return form;
        }
        else {
            throw new TypeError(`Menu "${name}" has not been registered!`);
        }
    }
    /**
     * @param player The player being tested
     * @param ui The name of the UI to test for, if you want to be specific
     * @returns Whether the UI, or any at all is being displayed.
     */
    displayingUI(player, ui) {
        if (!this.active.has(player))
            return false;
        if (!ui)
            return true;
        const form = this.active.get(player);
        for (const registered of this.forms.values()) {
            if (registered == form)
                return true;
        }
        return false;
    }
}
export const UIForms = new UIFormBuilder();
