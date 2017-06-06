'use strict';

var CaptureSession = require('lib/capture-session'),
    CaptureProcessor = require('lib/state-processor/capture-processor'),
    temp = require('lib/temp'),
    proxyquire = require('proxyquire').noCallThru(),
    Promise = require('bluebird'),
    _ = require('lodash');

describe('state-processor/job', () => {
    var sandbox = sinon.sandbox.create(),
        CaptureProcessorStub,
        captureProcessor,
        browserSession;

    function execJob_(opts) {
        opts = _.defaults(opts || {}, {
            captureProcessorInfo: {
                module: '/path/to/some/module'
            }
        });

        var stubs = _.set({}, opts.captureProcessorInfo.module, CaptureProcessorStub),
            job = proxyquire('lib/state-processor/job', stubs);

        return job(opts, _.noop);
    }

    beforeEach(() => {
        captureProcessor = sinon.createStubInstance(CaptureProcessor);
        captureProcessor.exec.returns(Promise.resolve({}));

        CaptureProcessorStub = {
            create: sinon.stub().returns(captureProcessor)
        };

        browserSession = sinon.createStubInstance(CaptureSession);
        browserSession.capture.returns({});

        sandbox.stub(CaptureSession, 'fromObject').returns(Promise.resolve(browserSession));

        sandbox.stub(temp);
    });

    afterEach(() => sandbox.restore());

    it('should create capture processor', () => {
        execJob_({
            captureProcessorInfo: {
                module: '/some/module',
                constructorArg: 'some-arg'
            }
        });

        assert.calledOnceWith(CaptureProcessorStub.create, 'some-arg');
    });

    it('should capture screenshot', () => {
        var page = {captureArea: {}};

        return execJob_({page})
            .then(() => assert.calledOnceWith(browserSession.capture, page));
    });

    it('should process captured screenshot', () => {
        var capture = {some: 'capture'};
        browserSession.capture.returns(Promise.resolve(capture));

        return execJob_()
            .then(() => assert.calledOnceWith(captureProcessor.exec, capture));
    });
});
