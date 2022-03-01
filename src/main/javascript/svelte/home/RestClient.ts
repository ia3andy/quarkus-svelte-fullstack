export default class RestClient{
    url:string;
    

    constructor(url:string){
        this.url = url;
    }

    async getHeaders(){
        let headers:Headers = new Headers();
        //headers.set('Authorization', 'Bearer ' + authenticationToken);
        headers.set('Content-Type', 'application/json');
        return headers;
    }

    public static async create(url:string){
        let rc = new RestClient(url);
        return rc;
    }

    async post(uri:string, obj:any){
        return await fetch(this.url + uri, {
			method: 'POST',
            headers: await this.getHeaders(),
			body: obj
        })
        .then((res)=>{
            return res.json();
        })
        .then((f)=>RestClient.handleResponse(f, this.url + uri))
        .catch(e=>RestClient.handleError(e, this.url + uri, "post", obj));
    }


    async getList(uri:string):Promise<Array<any>>{
        return fetch(this.url + uri, {method:"GET", headers: await this.getHeaders()})
                .then((f)=>RestClient.handleResponse(f, this.url + uri))
                .catch(e=>RestClient.handleError(e, this.url + uri, "getList"));
    }
    async get(uri:string):Promise<any>{
        return fetch(this.url + uri, {method:"GET", headers: await this.getHeaders()})
                .then((f)=>RestClient.handleResponse(f, this.url + uri))
                .catch(e=>RestClient.handleError(e, this.url + uri, "get"));
    }

    async delete(uri:string){
        await fetch(this.url + uri, {
			method: 'DELETE',
            headers: await this.getHeaders()
        })
        .then((f)=>RestClient.handleResponse(f, this.url + uri))
        .catch(e=>RestClient.handleError(e, this.url + uri, "delete"));
    }

    async put(uri:string, obj:any){
        await fetch(this.url + uri, {
			method: 'PUT',
            headers: await this.getHeaders(),
			body: JSON.stringify(obj)
        })
        .then((f)=> {
            if(f.status == 200){
                //Everything OK
            }else{
                RestClient.handleResponse(f,this.url + uri)
            }
        })
        .catch(e=>RestClient.handleError(e, this.url + uri, "put", obj));
    }

    public static async handleResponse(res: Response, url:string) {
        function prop(key, value){
            return key + ": " + value + "\n";
        }
        function text(text){
            return text+"\n\n";
        }
        let status = res.status;
        if(status == 200){
            return res.json();
        } else {
            let message = text("Status Text: "+res.statusText)
                            +prop("http statusCode", status)
                            +prop("url", url);
            console.log("Look at XHR response for details");
            console.log("Unexpected Response: RestClient.ts in line:")
            console.log(res);        
            console.log(message);
            alert(
                text("Unexpected Response: Details in console.log")
                +message
            );
            return Promise.reject(res.text());
        }
    }

    public static handleError(e:any, url:string, methodName:string, data = null){
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

        console.log("Error: RestClient.ts in line:")
        console.log(e);
        console.log(e.trace);
        console.log(message);

        alert(
           message
           + text("\nError: Details in console.log")
        );

        return Promise.reject(e.message);
    }
}
