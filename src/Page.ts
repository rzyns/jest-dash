import * as io from "io-ts";

export const Page = io.type({
    name: io.string,
    type: io.string,
    toc: io.string,
});
export interface Page extends io.TypeOf<typeof Page> {}

export const Pages = io.array(Page);