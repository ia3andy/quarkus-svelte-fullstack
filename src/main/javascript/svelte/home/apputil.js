let appUtilDebugging = true;
function log(msg){
    if(appUtilDebugging){
        console.log(msg);
    }
}
console.log(`AppUtil (0.3.5)
 - AppElement
 - ShadowElement
 - AppNavigatorBase
 - NotEmpty
 - RestClient
 - AppState`);
/******************************************************************
 *           AppElement
 ******************************************************************/
export class AppElement extends HTMLElement{
    constructor() {
        super();
    }
    connectedCallback(){
        log('AppElement.connectedCallback was called');
    }
    static get observedAttributes() {
        throw new Error('observedAttributes is not overridden');
        return [];
    }
    render(html){
        log('AppElement.render');
        this.innerHTML=html;
    }
    attr(key){
        let con = this.getAttribute(key);

        return con;
    }

    /**
     *
     * @param tag
     * @param a
     * @param t
     * @returns {HTMLElement}
     */
    create(tag, a = {}, t = null){
        let elem = document.createElement(tag);
        for (const attr in a) {
            elem.setAttribute(attr, a[attr]);
        }
        if(t === null){
            //nothing
        }else if(typeof t === 'string') {
            elem.innerText = t;
        }else{
            if(Array.isArray(t)){
                for (let i = 0; i<t.length; i++) {
                    elem.append(t[i]);
                }
            }else {
                elem.append(t);
            }
        }

        return elem;
    }

    /**
     *
     * @param name
     * @param value
     * @param event
     * @returns {HTMLElement}
     */

    createInput(name, value, event) {
        let input8 = this.create('input',  {'placeholder': name, 'type': 'text', 'value':value});
        input8.addEventListener('keyup', (e)=> event(e.target.value));
        return input8;
    }

    /**
     * @returns {HTMLElement}
     */
    el(select){
        return this.querySelector(select);
    }
    /**
     * @returns {HTMLInputElement}
     */
    input(select){
        return this.el(select);
    }
    /**
     * @returns {HTMLButtonElement}
     */
    button(select){
        return this.el(select);
    }
}
/******************************************************************
 *           ShadowElement
 ******************************************************************/
export class ShadowElement extends AppElement{
    shadow = null;
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        log('ShadowElement.connectedCallback was called');
    }
    render(html){
        log('ShadowElement.render');
        this.shadow.innerHTML=html;
    }
    attr(key){
        return this.getAttribute(key);
    }
    /**
     * @returns {HTMLElement}
     */
    el(select){
        return this.shadow.querySelector(select);
    }
}
/******************************************************************
 *           AppNavigatorBase
 ******************************************************************/
export class AppNavigatorBase{
    page = "/";
    //_pageStore = writable("");
    listeners = [];
    constructor(){
        //this._pageStore.subscribe((val)=>this.page = val);
    }
    home(){
        this.navigate("/");
    }
    isHome(){
        return this.isPage("/");
    }
    getParam(name){
        try{
            let paramPart = this.page.split("?")[1];
            let na = "&"+paramPart+"&";
            let valueStart = na.split("&"+name+"=")[1];
            let value = valueStart.split("&")[0];
            return value;
        }catch(e){
            throw new Error("Param "+name+" not found. On: "+this.page+"."+e);
        }
    }

    navigate(url){
        log("navigate to: "+ url);
        this.page = url;
        this.listeners.forEach((l)=>l());
        //this._pageStore.set(url);
        //location.href = url;
    }
    isPage(url){
        return (this.page.split("?")[0]) === url;
    }

    onChange(fun){
        //this._pageStore.subscribe(fun);
        this.listeners.push(fun);
    }

    isReady(){
        return this.page != null;
    }
}
/******************************************************************
 *           NotEmpty
 ******************************************************************/
let wasNotified = false;
export class NotEmpty{
    constructor(content) {
        this.assert(content !== undefined, "NotNull is Empty");
        this.content = content;
    }

    load(key, allowEmpty = false){
        let value = this.content[key];
        if(!allowEmpty){
            this.assert(value !== undefined, "Property \""+key + "\" is empty on "+this.content);
        }
        return value;
    }
    assert(cond, msg){
        if(cond !== true){
            console.error('Assertion Failed: '+msg, this.content);
            if(!wasNotified){
                wasNotified = true;
                alert(msg);
            }
        }
    }

    static of(content) {
        return new NotEmpty(content);
    }
}
/******************************************************************
 *           RestClient
 ******************************************************************/
export class RestClient {
    url = '';
    token = null;
    constructor(url){
        if(url){
            this.url = url;
        }
    }
    async getHeaders(){
        let headers = new Headers();
        if(this.token != null){
            headers.set('Authorization', 'Bearer ' + this.token);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    }
    static async create(url){
        let rc = new RestClient(url);
        return rc;
    }
    async post(uri, obj){
        return await fetch(this.url + uri, {
            method: 'POST',
            headers: await this.getHeaders(),
            body: JSON.stringify(obj)
        }).then((f)=>RestClient.handleResponse(f, this.url + uri))
            .catch(e=>RestClient.handleError(e, this.url + uri, "post", obj));
    }
    async get(uri){
        return fetch(this.url + uri, {method:"GET", headers: await this.getHeaders()})
            .then((f)=>RestClient.handleResponse(f, this.url + uri))
            .catch(e=>RestClient.handleError(e, this.url + uri, "get"));
    }
    async delete(uri){
        await fetch(this.url + uri, {
            method: 'DELETE',
            headers: await this.getHeaders()
        })
            .then((f)=>RestClient.handleResponse(f, this.url + uri))
            .catch(e=>RestClient.handleError(e, this.url + uri, "delete"));
    }
    async put(uri, obj){
        return await fetch(this.url + uri, {
            method: 'PUT',
            headers: await this.getHeaders(),
            body: JSON.stringify(obj)
        })
            .then((f)=> {
                if(f.status == 200){
                    return f.json();
                }else{
                    RestClient.handleResponse(f,this.url + uri)
                }
            })
            .catch(e=>RestClient.handleError(e, this.url + uri, "put", obj));
    }
    static async handleResponse(res, url) {
        function prop(key, value){
            return key + ": " + value + "\n";
        }
        function text(text){
            return text+"\n\n";
        }
        let status = res.status;
        if(res.ok){
            return res.json();
        } else {
            let message = text("Status Text: "+res.statusText)
                +prop("http statusCode", status)
                +prop("url", url);
            console.log("Look at XHR response for details");
            console.log("Unexpected Response: AppUtil.js in line:")
            console.log(res);
            console.log(message);
            alert(
                text("Unexpected Response: Details in console.log")
                +message
            );
            return Promise.reject(res.text());
        }
    }
    static handleError(e, url, methodName, data = null){
        function prop(key, value){
            return key + ": " + value + "\n";
        }

        function text(text){
            return text+"\n\n";
        }

        let message = text("Error: "+e.error)
            +prop("message", e.message)
            +prop("methodName", methodName)
            +prop("url", url)
            +prop("data", JSON.stringify(data))
            +prop("trace", e.trace);

        console.log("Error: AppUtil.js in line:")
        console.log(e);
        console.log(e.trace);
        console.log(message);

        alert(
            message
            + text("\nError: Details in console.log")
        );

        return Promise.reject(e.message);
    }
    setToken(token) {
        this.token = token;
    }
    hasToken() {
        return this.token != null;
    }
}

export class AppState {
    _myState = {};
    _listener = [];
    get(componentName){
        return this._myState[componentName];
    }
    set(componentName, content){
        this._myState[componentName] = content;
        this._listener.forEach(l => l());
        log('getting '+componentName+' from:');
        log(this._myState);
    }
    onChange(componentName, method){
        this._listener.push(method);
    }
}

export const state = new AppState();
