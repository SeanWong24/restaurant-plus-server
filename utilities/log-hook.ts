import { HookTarget, Context, getCookies } from "../deps/alosaur.ts";
import { Log } from "../domain-model/log.ts";

export class LogHook implements HookTarget<unknown, any> {
  onPostAction(context: Context<unknown>, data: any) {
    const serverRequest = context.request.serverRequest;
    const cookies = getCookies(serverRequest);
    const log = Object.assign(new Log(), {
      user: cookies.token,
      url: serverRequest.url,
      time: new Date(),
    });
    console.log(log);
  }
}
