var path  = require('path');

function getNS() {
    return __dirname.substring(__dirname.lastIndexOf(path.sep) + 1);
}

fis.config.set('settings.postprocessor.jswrapper.type', 'amd');
fis.config.set('namespace', getNS());
fis.config.set('roadmap.path',[
    {
        reg: 'vendor/mod.js',
        isMod: false,
        useHash: false,
        release: '/static/mod.js'
    },
    {
        reg: /^\/core\/(.*\.(js|less|css|swf|png|gif|jpg|jpeg|ico|svg))$/i,
        release: '/static/vendor/$1',
        isMod: true,
        useHash: true
    },
    {
        reg: /^\/vendor\/(.*\.(js|less|css|swf|png|gif|jpg|jpeg|ico|svg))$/i,
        release: '/static/vendor/$1',
        isMod: true,
        useHash: true
    },
    {
        reg: /^\/demo\/(.*\.(js|less|css|swf|png|gif|jpg|jpeg|ico|svg))$/i,
        release: '/static/demo/$1',
        isMod: true,
        useHash: true
    },
    {
        reg: /^\/demo\/(.*\.vm)$/i,
        url: '$1',
        release: '/WEB-INF/views/$1',
        isMod: true,
        extras: {
            isPage: true
        }
    },
    {
        reg: /^(.*\.(md|txt|))$/i,
        release: false,
        isMod: true,
        useHash: true
    },
    {
        reg : /(.*server\.conf)/i,
        release: '/WEB-INF/server.conf'
    },
    {
        reg: 'map.json',
        release: 'map/$&'
    },
    {
        reg : '${namespace}-map.json',   //map.json发布到map目录下
        release : 'map/$&'
    }
]);

fis.config.set('modules.postprocessor.html', 'require-async');
fis.config.set('modules.postprocessor.js', 'jswrapper, require-async');

// 开起 autuload, 好处是，依赖自动加载。
fis.config.set('modules.postpackager', 'autoload');

fis.config.set('settings.preprocessor.components', {
    paths :{
        'jquery': 'ext-jquery-ui:vendor/jquery.js'
    }
});

// 使用 depscombine 是因为，在配置 pack 的时候，命中的文件其依赖也会打包进来。
fis.config.set('modules.packager', 'depscombine');

// 只打包页面自己依赖的部分
fis.config.set('pack', {
    'pkg/index.css': '**.vm',
    'pkg/index.js': '**.vm'
});
