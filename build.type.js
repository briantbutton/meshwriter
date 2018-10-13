/*
 * BUILD DATACAFE  DATACAFE  DATACAFE  DATACAFE  DATACAFE  DATACAFE  DATACAFE 
 * 
 * Make sure to have updated the version number, stored in constants
 *
 * 
 *  ON LOCAL
 *
 *   1) Duplicate 'babylontype' into 'babylontypebuild' using finder
 * 
 *   3) Run r.js
 *      $ cd babylontypebuild 
 *      $ node r.js -o build.type.js
 *
 */

({

    baseUrl: ".",

    //By default all the configuration for optimization happens from the command
    //line or by properties in the config file, and configuration that was
    //passed to requirejs as part of the app's runtime "main" JS file is *not*
    //considered. However, if you prefer the "main" JS file configuration
    //to be read for the build so that you do not have to duplicate the values
    //in a separate configuration, set this property to the location of that
    //main JS file. The first requirejs({}), require({}), requirejs.config({}),
    //or require.config({}) call found in that file will be used.
    //As of 2.1.10, mainConfigFile can be an array of values, with the last
    //value's config take precedence over previous values in the array.
    mainConfigFile: 'index.js',

    //Set paths for modules. If relative paths, set relative to baseUrl above.
    //If a special value of "empty:" is used for the path value, then that
    //acts like mapping the path to an empty file. It allows the optimizer to
    //resolve the dependency to path, but then does not include it in the output.
    //Useful to map module names that are to resources on a CDN or other
    //http: URL when running in the browser and during an optimization that
    //file should be skipped because it has no dependencies.
    //e.g. if you wish to include `jquery` and `angularjs` from public CDNs,
    //paths: { "jquery": "empty:", "angular": "empty:" }
//  paths: {
//      "foo.bar": "../scripts/foo/bar",
//      "baz": "../another/path/baz"
//  },

    //Configure CommonJS packages. See http://requirejs.org/docs/api.html#packages
    //for more information.
    packages: [],

    //The directory path to save the output. If not specified, then
    //the path will default to be a directory called "build" as a sibling
    //to the build file. All relative paths are relative to the build file.
    dir: "../typebuilt",

    locale: "en-us",

    optimize: "uglify",

    uglify2: {
        mangle: { except: [ ] }
    },

    findNestedDependencies: false,

    removeCombined: false,

    modules: [
        {
            name: "index"
        }
    ],

    fileExclusionRegExp: /^\./,

    logLevel: 2,

    onBuildRead_: function (moduleName, path, contents) {
    },

    onBuildWrite_: function (moduleName, path, contents) {
    },

    onModuleBundleComplete_: function (data) {
    },

    waitSeconds: 45,
})