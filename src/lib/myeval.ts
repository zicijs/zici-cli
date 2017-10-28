import lookup from "./bing";

export default function myEval(cmd, context, filename, callback) {
    lookup(cmd).then((value) => {
        let output = value.soundmark;
        for (const trs of value.trses) {
            output += "\n" + trs;
        }
        callback(null, output);
    }).catch((reason) => {
        callback("Err: " + reason.message);
    });
}