#! /usr/bin/env node

import * as repl from "repl";
import myEval from "../lib/myeval";

repl.start({ prompt: "WTF is ", eval: myEval, writer: (output) => output });

