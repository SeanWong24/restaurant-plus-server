import { MiddlewareTarget } from "../external-modules/alosaur-middleware-target.ts";
import { ServerRequest } from "../external-modules/alosaur.ts";
import { getCookies } from "../external-modules/cookie.ts";
import { Log } from "../domain-model/log.ts";

export class LogBuilder implements MiddlewareTarget {
    onPreRequest(req: ServerRequest, res: any): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        })
    }

    onPostRequest(req: ServerRequest, res: any, actionResult?: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const cookies = getCookies(req);
            const log = Object.assign(new Log, {
                user: cookies.token,
                url: req.url,
                time: new Date()
            });
            console.log(log);

            resolve();
        });
    }

}