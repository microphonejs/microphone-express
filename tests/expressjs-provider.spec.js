import chai from "chai";
import sinon from "sinon";

import request from 'request';
import ExpressProvider from "../src/express-provider";

import express from 'express';

chai.should();

describe("ExpressProvider:", () => {
    let expressProvider,
        configuration = {
            getPort: function () {
            }
        }
        , logger = {
            info: function (msg) {
            }
        },
        configurationMock, loggerMock;

    beforeEach(() => {

        configurationMock = sinon.mock(configuration);
        loggerMock = sinon.mock(logger);

        expressProvider = new ExpressProvider(configuration, logger);

    });

    describe("#ctor", () => {

        it("should create instance.", ()=> {
            (!!expressProvider).should.be.equal(true);
        });
    });

    describe("#start", () => {
        it("should start new express server and register status handler", async (done)=> {

            await startTest(null, done);
        });


        it("should attach existing express server and register status handler", async (done)=> {

            let server = express();

            await startTest(server, done);
        });

        async function startTest(server, done) {
            let port = 3006, statusResponse = 'ok';

            configurationMock.expects("getPort").returns(port).once();
            loggerMock.expects("info").withArgs(`Example app listening on port ${port}!`).once();

            let result = await expressProvider.start(server, "test-svc", "v1");

            request(`http://localhost:${port}/status`, (error, response, body)=> {

                (!!error).should.be.equal(false);

                body.should.be.equal(statusResponse);

                result.serverInstance.close();
                done();
            });
        }
    });

    afterEach(()=> {
        configurationMock.verify();
        loggerMock.verify();
    })
});