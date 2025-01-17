"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const tmp = __importStar(require("tmp"));
const execa = require("execa");
const check_1 = require("./check");
const input = __importStar(require("./input"));
function run(actionInput) {
    return __awaiter(this, void 0, void 0, function* () {
        const startedAt = new Date().toISOString();
        const alertResp = yield execa('vale', actionInput.args);
        let runner = new check_1.CheckRunner();
        runner.makeAnnotations(alertResp.stdout);
        yield runner.executeCheck({
            token: actionInput.token,
            name: 'Vale',
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            head_sha: github.context.sha,
            started_at: startedAt,
            context: { vale: actionInput.version }
        });
    });
}
exports.run = run;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // TODO: core.info('::add-matcher::vale.json');
            const tmpobj = tmp.fileSync({ postfix: '.ini' });
            const actionInput = yield input.get(tmpobj);
            yield run(actionInput);
            tmpobj.removeCallback();
            // TODO: core.info('::remove-matcher owner=vale::');
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
main();
