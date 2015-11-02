var componentList = [
    'numberSelect',
    'select2'
];

fis.config.set('roadmap.path',[
    {
        reg: 'vendor/mod.js',
        isMod: false,
        useHash: false,
        release: '/static/mod.js'
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
    }
]);