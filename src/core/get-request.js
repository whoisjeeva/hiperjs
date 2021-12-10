import { argparse } from "../utils/url.js";
import { Response } from "../model/response.js";

export function getRequest(
    url,
    {recursive=true, headers={}, params={}, lifecycle=null, timeout=0, loadstart=null, load=null, loadend=null, progress=null, error=null, abort=null}={}
) {    
    let promise = new Promise(function(resolve, reject) {
        let args = argparse(params)
        if (args.length > 0) {
            url += "?" + args
        }
        let xhr = new XMLHttpRequest()
        xhr.timeout = timeout

        
        // 0 - unsent
        // 1 - opened
        // 2 - headers received
        // 3 - loading
        // 4 - done
        xhr.onreadystatechange = function() {
            let response = new Response(xhr)
            if (this.readyState === 4 && this.status < 400) {
                resolve(response)
            }
            if (lifecycle !== null) {
                lifecycle(response)
            }
            if (!recursive && this.readyState === 4 && this.status >= 400) {
                reject(response)
            }
            if (recursive && this.readyState === 4 && this.status >= 400) {
                getRequest(url, {recursive, headers, params, lifecycle}).then(resolve, reject)
            }
        }

        xhr.addEventListener("loadstart", loadstart)
        xhr.addEventListener("load", load)
        xhr.addEventListener("loadend", loadend)
        xhr.addEventListener("progress", progress)
        xhr.addEventListener("error", error)
        xhr.addEventListener("abort", abort)

        xhr.open('GET', `${url}${args}`, true)
        xhr.send(null)


    })

    return promise
}