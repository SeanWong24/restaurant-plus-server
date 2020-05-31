import { HookTarget, Context, getCookies, HttpError } from "../deps/alosaur.ts";
import { Log } from "../domain-model/log.ts";

export class LogOptions {
  logBody: boolean = false;
}

export class LogHook implements HookTarget<unknown, LogOptions> {
  async onPostAction(
    context: Context<unknown>,
    options: LogOptions = new LogOptions(),
  ) {
    await this.log(context, options);
  }

  async onCatchAction(
    context: Context<unknown>,
    options: LogOptions = new LogOptions(),
  ) {
    await this.log(context, options);
  }

  private async log(context: Context<unknown>, options: LogOptions) {
    const serverRequest = context.request.serverRequest;
    const error = context.response.error;
    const cookies = getCookies(serverRequest);
    const log = Object.assign(new Log(), {
      user: cookies.token,
      url: serverRequest.url,
      body: options.logBody
        ? await this.readBody(serverRequest.body)
        : undefined,
      error: error
        ? {
          name: error.name,
          message: error.message,
        }
        : undefined,
      time: new Date(),
    });
    console.log(log);
  }

  // TODO this does not work correctly
  private async readBody(body: Deno.Reader) {
    const utf8Decoder = new TextDecoder("utf-8");
    let result = "";
    let p = new Uint8Array(1024);
    while (await body.read(p)) {
      result += utf8Decoder.decode(p);
    }
    return result;
  }
}
