import * as https from "https";
import * as xpath from "xpath";
import { DOMParser } from "xmldom";

interface Res {
    soundmark?: string;
    trses?: string[];
}

export default function lookup(word: string): Promise<Res> {
    return new Promise((resolve, reject) => {
        https.get("https://cn.bing.com/dict/SerpHoverTrans?intlf=&q=" + word, (res) => {
            const { statusCode } = res;

            let error;
            if (statusCode !== 200) {
                error = new Error("Request Failed.\n" +
                    `Status Code: ${statusCode}`);
                reject(error);
            }

            res.setEncoding("utf8");
            let rawData = "";
            res.on("data", (chunk) => { rawData += chunk; });
            res.on("end", () => {
                if (!rawData.trim()) {
                    reject(new Error("Not Found"));
                    return;
                }

                try {
                    let doc = new DOMParser().parseFromString(rawData);
                    let soundmark = xpath.select("string(//span[@class='ht_attr'])", doc);
    
                    let trses = [];
                    for (const trs of xpath.select("//ul", doc)) {
                        const head = trs.childNodes[0].childNodes[0].textContent;
                        const body = trs.childNodes[0].childNodes[1].textContent;
                        trses.push(head + "\t" + body);
                    }
                } catch (error) {
                    reject(new Error("xPath Error"));
                }

                resolve({ soundmark, trses });
            });
        });
    });
}