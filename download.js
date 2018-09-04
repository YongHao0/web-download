(function(global, factory) {
    'use strict';
    if (typeof exports === 'object' && typeof module !== undefined) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.Download = factory();
    }
})(window, function() {
    var ErrorCode = {
        NOTFOUND: 'NOTFOUND',  // 连接无效
        TIMEDOUT: 'TIMEDOUT',
        UNSUPPORT: 'UNSUPPORT',
        CONNECTREFUSED: 'CONNECTREFUSED'  // 网络错误
    };
    var noop = function() {};

    var Downloader = function(option, callbacks) {
        option = option || {};
        callbacks = callbacks || {};
        var url = option.url || '',
            downloadName = option.name || getNameWithUrl(url);
        this.callbacks = callbacks;
        this.downloader = download(url, downloadName, callbacks);
        return this;
    };
    Downloader.prototype.abort = function() {
        this.downloader.abort();
    };

    function download(url, downloadName, callbacks) {
        var complete = callbacks.onComplete;
        callbacks.onComplete = function(event) {
            var total = event.total,
                loaded = event.loaded,
                blob = event.currentTarget.response,
                error = callbacks.error || noop;
            saveFile(blob, downloadName, function(err) {
                err ? error({
                    code: err
                }) : complete({
                    total: total,
                    loaded: loaded
                });
            });
        };
        return request(url, callbacks);
    }

    function request(url, callbacks) {
        if (!XMLHttpRequest) {
            return callbacks.onError({ code: ErrorCode.UNSUPPORT });
        }
        var xhr,
            isLoadStart = false;
        callbacks = callbacks || {};
        try {
            xhr = new XMLHttpRequest(),
            xhr.open('get', url);
        } catch(e) {
            return callbacks.onError({ code: ErrorCode.UNSUPPORT });
        }
        xhr.responseType = 'blob';

        xhr.addEventListener('progress', onProgress);

        xhr.addEventListener('loadend', onLoadend);

        xhr.addEventListener('abort', callbacks.onCancel);

        xhr.addEventListener('timeout', onTimeout);

        xhr.send();

        return xhr;

        function onTimeout() {
            callbacks.onError && callbacks.onError({
                code: ErrorCode.TIMEDOUT
            });
        }

        function onProgress(event) {
            var total = event.total,
                loaded = event.loaded;
            if (isLoadStart) {
                callbacks.onProgress && callbacks.onProgress({
                    total: total,
                    loaded: loaded
                });
            } else {
                isLoadStart = true;
                callbacks.onBefore && callbacks.onBefore({ total: total });
            }
        }

        function onLoadend(event) {
            var total = event.total,
                loaded = event.loaded,
                status = event.currentTarget.status,
                statusText = event.currentTarget.statusText,
                blob = event.currentTarget.response,
                error = callbacks.onError || noop,
                complete = callbacks.onComplete || noop;
            if ((status >= 200 && status < 300) || status == 304) {
                complete(event);
            } else if (status === 400) {
                error({ code: ErrorCode.NOTFOUND, message: statusText });
            } else if (status === 0) {
                error({ code: ErrorCode.CONNECTREFUSED, message: statusText });
            } else {
                error({ code: status, message: statusText });
            }
        }
    }

    function saveFile(blob, name, callback) {
        callback = callback || noop;
        var saveLink = document.createElement('a'),
            canUserSaveLink = !window.externalHost && 'download' in saveLink,
            msSaveOrOpenBlob = (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator));
        if (msSaveOrOpenBlob) {
            msSaveOrOpenBlob(blob, name);
            callback();
        } else if (canUserSaveLink) {
            var URL = window.URL || window.webkitURL || window,
                objectUrl = URL.createObjectURL(blob),
                saveLink = window.document.createElement('a');
            saveLink.href = objectUrl;
            saveLink.download = name;
            saveLink.click();
            URL.revokeObjectURL(objectUrl);
            callback();
        } else {
            callback(ErrorCode.UNSUPPORT);
        }
    }

    function getNameWithUrl(url) {
        var markIndex = url.lastIndexOf('/');
        var filename = url.substring(markIndex + 1);
        return filename || 'download';
    }

    return {
        save: function(option, callbacks) {
            return new Downloader(option, callbacks);
        }
    }; 
});
