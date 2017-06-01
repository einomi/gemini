'use strict';

const CaptureProcessor = require('../capture-processor');
const utils = require('../utils');

module.exports = class ScreenUpdater extends CaptureProcessor {
    exec(capture, opts) {
        const refPath = opts.refPath;

        return utils.existsRef(refPath)
            .then(
                () => this._processCapture(capture, opts, true),
                () => this._processCapture(capture, opts, false)
            )
            .then((updated) => ({imagePath: refPath, updated}));
    }

    _processCapture() {
        throw new Error('Not implemented');
    }
};
